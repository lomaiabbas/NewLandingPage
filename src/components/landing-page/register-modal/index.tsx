'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import AtrasLinkLogo from '@/lib/icons/logo'
import companiesForManagerServiceInstance from '@/lib/services/companies-for-manager'
import countriesCodesServiceInstance from '@/lib/services/countries-codes'
import { CountryCodeDto } from '@/lib/services/countries-codes/dto'
import { LiteEntityDto, LocationType } from '@/lib/services/dto'
import locationServiceInstance from '@/lib/services/locations'
import { Check, ChevronDown, Eye, EyeOff, Loader2, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import {
  DEFAULT_DIAL_CODE,
  DEFAULT_DIAL_ISO,
  EMPTY_REGISTER_VALUES,
  REGISTER_FIELDS,
  SUBDOMAIN_MAX_LENGTH,
  type RegisterField,
  type RegisterValues,
} from './register-modal.data'
import {
  buildSignupPayload,
  findCountryCode,
  phoneExample,
  readSignupError,
  sanitizePhone,
  sanitizeSubdomain,
  sortCountryCodes,
  validateRegisterField,
} from './register-modal.helpers'
import styles from './register-modal.module.css'

const EXIT_MS = 160
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

type FieldErrors = Partial<Record<RegisterField, string>>

const withPlus = (code: string) => (code.startsWith('+') ? code : `+${code}`)

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string
  label: string
  error?: string
  className: string
  children: ReactNode
}) {
  return (
    <div className={`${styles.field} ${className}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function RegisterModal({
  lng,
  open,
  onClose,
  returnFocusRef,
}: {
  lng: string
  open: boolean
  onClose: () => void
  /** gets focus back once the modal has closed */
  returnFocusRef: MutableRefObject<HTMLElement | null>
}) {
  const { t } = getClientTranslation(lng)
  const uid = useId()
  const fieldId = (field: RegisterField) => `${uid}${field}`

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const successTitleRef = useRef<HTMLHeadingElement>(null)
  const pressedOnBackdrop = useRef(false)
  const wasOpen = useRef(open)
  const latestCountry = useRef('')
  const citiesCache = useRef(new Map<string, LiteEntityDto[]>())

  const [closing, setClosing] = useState(false)
  const [values, setValues] = useState(EMPTY_REGISTER_VALUES)
  const [errors, setErrors] = useState<FieldErrors>({})
  // fields the user has typed in; a field shows no error before that, even after losing focus
  const [touched, setTouched] = useState<Partial<Record<RegisterField, boolean>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [registeredDomain, setRegisteredDomain] = useState<string | null>(null)

  const [countries, setCountries] = useState<LiteEntityDto[] | null>(null)
  const [cities, setCities] = useState<LiteEntityDto[]>([])
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [countryCodes, setCountryCodes] = useState<CountryCodeDto[]>([])
  const [dialIso, setDialIso] = useState(DEFAULT_DIAL_ISO)

  // read from timers and request callbacks, which would otherwise see the values of an old render
  const countriesRef = useRef(countries)
  countriesRef.current = countries
  const registeredRef = useRef(registeredDomain)
  registeredRef.current = registeredDomain

  const dialCodeOf = (iso: string) =>
    withPlus(
      countryCodes.find((code) => code.iso2Code?.toUpperCase() === iso)?.dialCode ??
        DEFAULT_DIAL_CODE
    )
  const dialCode = dialCodeOf(dialIso)
  const phoneHint = useMemo(() => phoneExample(dialIso), [dialIso])
  const passwordsMatch = !!values.confirmPassword && values.confirmPassword === values.password
  const domainCharsHint = t('RegisterModalDomainChars')

  const errorFor = (field: RegisterField, nextValues: RegisterValues, iso = dialIso) => {
    const issue = validateRegisterField(field, nextValues, dialCodeOf(iso))
    if (!issue) return undefined
    return t(issue.key, {
      // isolated left-to-right, or an Arabic sentence shows "51 234 5678" as "5678 234 51"
      example: `⁦${phoneExample(iso)}⁩`,
      items: issue.items?.map((item) => t(item)).join(lng === 'ar' ? '، ' : ', '),
      interpolation: { escapeValue: false },
    })
  }

  /* the country-code list and the countries list name countries differently, so the matching is
     done by name (see findCountryCode) */
  const dialIsoFor = (countryId: string, codes: CountryCodeDto[]) => {
    const country = countriesRef.current?.find((item) => item.value === countryId)
    return country && findCountryCode(country.text, codes)?.iso2Code?.toUpperCase()
  }

  const resetForm = useCallback(() => {
    setValues(EMPTY_REGISTER_VALUES)
    setErrors({})
    setTouched({})
    setShowPassword(false)
    setFormError(null)
    setRegisteredDomain(null)
    setDialIso(DEFAULT_DIAL_ISO)
    setCities([])
    latestCountry.current = ''
  }, [])

  // stays on screen while the close animation plays
  useEffect(() => {
    if (open) {
      wasOpen.current = true
      setClosing(false)
      return
    }
    if (!wasOpen.current) return
    wasOpen.current = false
    setClosing(true)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(
      () => {
        setClosing(false)
        // what was typed is kept for the next open, but a finished registration starts over
        if (registeredRef.current) resetForm()
      },
      reduceMotion ? 0 : EXIT_MS
    )
    return () => window.clearTimeout(timer)
  }, [open, resetForm])

  useEffect(() => {
    if (!open || countries) return
    let cancelled = false
    locationServiceInstance
      .getAllLite({ isActive: true, skipCount: 0, maxResultCount: 1000, type: LocationType.Country })
      .then((result) => {
        if (!cancelled) setCountries(result.items)
      })
      // httpService has already reported it; the next open tries again
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [open, countries])

  useEffect(() => {
    if (!open || countryCodes.length) return
    let cancelled = false
    countriesCodesServiceInstance
      .getAll({ isActive: true, skipCount: 0, maxResultCount: 1000 })
      .then((result) => {
        if (cancelled) return
        const codes = sortCountryCodes(result.items)
        setCountryCodes(codes)
        // a country picked before the codes arrived
        const iso = dialIsoFor(latestCountry.current, codes)
        if (iso) setDialIso(iso)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, countryCodes.length])

  // focus trap, Esc, and the page behind made inert and unscrollable
  useEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!open || !overlay || !panel) return

    const { body, documentElement: html } = document
    const background = Array.from(body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== overlay && !el.inert
    )
    background.forEach((el) => (el.inert = true))
    const bodyOverflow = body.style.overflow
    // the scrollbar's gutter stays, so the page doesn't shift sideways when its scrollbar goes
    const keepGutter = window.innerWidth > html.clientWidth
    body.style.overflow = 'hidden'
    if (keepGutter) html.style.setProperty('scrollbar-gutter', 'stable')

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0
      )
    let lastFocused: HTMLElement | null = null

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing) return
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const active = document.activeElement
      const edge = event.shiftKey ? items[0] : items[items.length - 1]
      if (active === edge || !panel.contains(active)) {
        event.preventDefault()
        ;(event.shiftKey ? items[items.length - 1] : items[0]).focus()
      }
    }
    // focus pushed out of the modal (the nav drawer hands it back to its menu button once it has
    // closed, for one) comes straight back
    const onFocusIn = (event: FocusEvent) => {
      if (panel.contains(event.target as Node)) lastFocused = event.target as HTMLElement
      else (lastFocused ?? focusables()[0])?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
    const frame = requestAnimationFrame(() =>
      (successTitleRef.current ?? firstFieldRef.current)?.focus({ preventScroll: true })
    )

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocusIn)
      background.forEach((el) => (el.inert = false))
      body.style.overflow = bodyOverflow
      if (keepGutter) html.style.removeProperty('scrollbar-gutter')
      // only now that the trap is gone can focus go back to what opened the modal
      const target = returnFocusRef.current
      returnFocusRef.current = null
      if (target?.isConnected && target.getClientRects().length) {
        target.focus({ preventScroll: true })
      }
    }
  }, [open, onClose, returnFocusRef])

  useEffect(() => {
    if (registeredDomain) successTitleRef.current?.focus()
  }, [registeredDomain])

  // after the render that puts the error on the field, so it's read out along with it
  const focusField = (field: RegisterField) =>
    requestAnimationFrame(() => document.getElementById(fieldId(field))?.focus())

  const update = (field: RegisterField, value: string) => {
    const next = { ...values, [field]: value }
    setValues(next)
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }))
    // an error already on screen follows the input, so it goes away the moment it's fixed
    setErrors((prev) => {
      const live: FieldErrors = {}
      if (prev[field]) live[field] = errorFor(field, next)
      if (field === 'password' && prev.confirmPassword) {
        live.confirmPassword = errorFor('confirmPassword', next)
      }
      return Object.keys(live).length ? { ...prev, ...live } : prev
    })
  }

  const onBlur = (field: RegisterField) => () => {
    if (!touched[field]) return
    setErrors((prev) => ({
      ...prev,
      [field]: errorFor(field, values),
      ...(field === 'password' &&
        touched.confirmPassword && { confirmPassword: errorFor('confirmPassword', values) }),
    }))
  }

  const onSubdomainChange = (event: ChangeEvent<HTMLInputElement>) => {
    const typed = resolvePersianAndArabicNumbers(event.target.value).toLowerCase()
    const subdomain = sanitizeSubdomain(typed)
    const next = { ...values, subdomain }
    setValues(next)
    setTouched((prev) => (prev.subdomain ? prev : { ...prev, subdomain: true }))
    setErrors((prev) => {
      // a key the field won't take says why, instead of silently doing nothing
      if (subdomain !== typed) return { ...prev, subdomain: domainCharsHint }
      if (!prev.subdomain) return prev
      return {
        ...prev,
        subdomain: prev.subdomain === domainCharsHint ? undefined : errorFor('subdomain', next),
      }
    })
  }

  const loadCities = (countryId: string) => {
    latestCountry.current = countryId
    const cached = citiesCache.current.get(countryId)
    setCities(cached ?? [])
    setCitiesLoading(!cached)
    if (cached) return
    locationServiceInstance
      .getAllLite({
        isActive: true,
        skipCount: 0,
        maxResultCount: 1000,
        type: LocationType.City,
        parentId: Number(countryId),
      })
      .then((result) => {
        citiesCache.current.set(countryId, result.items)
        if (latestCountry.current === countryId) setCities(result.items)
      })
      .catch(() => {})
      .finally(() => {
        if (latestCountry.current === countryId) setCitiesLoading(false)
      })
  }

  const onCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const countryId = event.target.value
    const iso = dialIsoFor(countryId, countryCodes) ?? dialIso
    const next = { ...values, countryId, cityId: '' }
    setValues(next)
    setTouched((prev) => ({ ...prev, countryId: true }))
    // the phone prefix follows the country; it can still be changed by hand afterwards
    setDialIso(iso)
    setErrors((prev) => ({
      ...prev,
      countryId: undefined,
      cityId: undefined,
      ...(prev.phone && { phone: errorFor('phone', next, iso) }),
    }))
    loadCities(countryId)
  }

  const onDialCodeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const iso = event.target.value
    setDialIso(iso)
    setErrors((prev) =>
      prev.phone ? { ...prev, phone: errorFor('phone', values, iso) } : prev
    )
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return

    const found: FieldErrors = {}
    for (const field of REGISTER_FIELDS) found[field] = errorFor(field, values)
    setErrors(found)
    setFormError(null)
    const firstInvalid = REGISTER_FIELDS.find((field) => found[field])
    if (firstInvalid) {
      focusField(firstInvalid)
      return
    }

    setSubmitting(true)
    try {
      await companiesForManagerServiceInstance.signup(
        buildSignupPayload({
          values,
          dialCode,
          countryName: countries?.find((item) => item.value === values.countryId)?.text ?? '',
          cityName: cities.find((item) => item.value === values.cityId)?.text ?? '',
          lng,
        }),
        { skipErrorHandler: true }
      )
      setRegisteredDomain(values.subdomain)
    } catch (error) {
      const { field, messageKey, message } = readSignupError(error)
      const text = messageKey ? t(messageKey) : message || t('RegisterModalSubmitError')
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: text }))
        focusField(field)
      } else {
        setFormError(text)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!open && !closing) return null

  const inputProps = (field: RegisterField) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    required: true,
    onBlur: onBlur(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${fieldId(field)}-error` : undefined,
  })

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-state={open ? 'open' : 'closed'}
      onPointerDown={(event) => {
        pressedOnBackdrop.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        // a press that started inside the modal (selecting text, say) and ended outside isn't one
        if (pressedOnBackdrop.current && event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}title`}
        aria-describedby={`${uid}status`}
      >
        <header className={styles.header}>
          <span className={styles.blobs} aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.logo} aria-hidden>
            <AtrasLinkLogo />
          </span>
          <h2 id={`${uid}title`} className={styles.title}>
            {t('Register')}
          </h2>
          <p id={`${uid}status`} className={styles.status}>
            <span className={styles.dot} aria-hidden />
            <span>
              {t('RegisterModalStatusLead')} <strong>{t('RegisterModalStatusEmphasis')}</strong>
            </span>
          </p>
          <span className={styles.divider} aria-hidden />
          <button type="button" className={styles.close} aria-label={t('Close')} onClick={onClose}>
            <X size={20} aria-hidden />
          </button>
        </header>

        {registeredDomain ? (
          <div className={styles.sheet}>
            <div className={`${styles.body} ${styles.success}`}>
              <span className={styles.successIcon} aria-hidden>
                <Check size={34} strokeWidth={2.5} />
              </span>
              <h3 ref={successTitleRef} tabIndex={-1} className={styles.successTitle}>
                {t('RegisterModalSuccessTitle')}
              </h3>
              <p className={styles.successText}>{t('RegisterNote')}</p>
            </div>
            <div className={`${styles.footer} ${styles.successFooter}`}>
              {/* as on the /register page, the next stop is the company's own address */}
              <a className={styles.submit} href={`https://${registeredDomain}.atraslink.com`}>
                {t('OK2')}
              </a>
            </div>
          </div>
        ) : (
          <form className={styles.sheet} onSubmit={onSubmit} noValidate aria-busy={submitting}>
            <div className={styles.body}>
              <div className={styles.grid}>
                <Field
                  id={fieldId('companyName')}
                  label={t('CompanyName')}
                  error={errors.companyName}
                  className={styles.wide}
                >
                  <div className={styles.control} data-invalid={!!errors.companyName}>
                    <input
                      ref={firstFieldRef}
                      {...inputProps('companyName')}
                      className={styles.input}
                      type="text"
                      autoComplete="organization"
                      maxLength={128}
                      placeholder={t('RegisterModalCompanyNamePlaceholder')}
                      onChange={(event) => update('companyName', event.target.value)}
                    />
                  </div>
                </Field>

                <Field
                  id={fieldId('subdomain')}
                  label={t('Domain')}
                  error={errors.subdomain}
                  className={styles.wide}
                >
                  <div className={styles.control} data-invalid={!!errors.subdomain} dir="ltr">
                    <input
                      {...inputProps('subdomain')}
                      className={styles.input}
                      type="text"
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      maxLength={SUBDOMAIN_MAX_LENGTH}
                      placeholder={t('RegisterModalDomainPlaceholder')}
                      onChange={onSubdomainChange}
                    />
                    <span className={styles.addon}>.atraslink.com</span>
                  </div>
                </Field>

                <Field
                  id={fieldId('countryId')}
                  label={t('Country')}
                  error={errors.countryId}
                  className={styles.pair}
                >
                  <div
                    className={styles.control}
                    data-invalid={!!errors.countryId}
                    data-disabled={!countries}
                  >
                    <select
                      {...inputProps('countryId')}
                      className={styles.select}
                      autoComplete="country-name"
                      data-empty={!values.countryId}
                      disabled={!countries}
                      onChange={onCountryChange}
                    >
                      <option value="" disabled>
                        {countries ? t('RegisterModalSelectCountry') : t('Loading')}
                      </option>
                      {countries?.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.text}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={styles.chevron} size={16} aria-hidden />
                  </div>
                </Field>

                <Field
                  id={fieldId('cityId')}
                  label={t('City')}
                  error={errors.cityId}
                  className={styles.pair}
                >
                  <div
                    className={styles.control}
                    data-invalid={!!errors.cityId}
                    data-disabled={!values.countryId || citiesLoading}
                  >
                    <select
                      {...inputProps('cityId')}
                      className={styles.select}
                      autoComplete="address-level2"
                      data-empty={!values.cityId}
                      disabled={!values.countryId || citiesLoading}
                      onChange={(event) => update('cityId', event.target.value)}
                    >
                      <option value="" disabled>
                        {citiesLoading ? t('Loading') : t('RegisterModalSelectCity')}
                      </option>
                      {cities.map((city) => (
                        <option key={city.value} value={city.value}>
                          {city.text}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={styles.chevron} size={16} aria-hidden />
                  </div>
                </Field>

                <Field
                  id={fieldId('phone')}
                  label={t('PhoneNumber')}
                  error={errors.phone}
                  className={styles.third}
                >
                  <div className={styles.control} data-invalid={!!errors.phone} dir="ltr">
                    {/* looks like a fixed prefix; a native select laid over it picks the code */}
                    <span className={styles.addon}>
                      <span aria-hidden>{dialCode}</span>
                      <ChevronDown className={styles.addonChevron} size={14} aria-hidden />
                      <select
                        className={styles.addonSelect}
                        value={dialIso}
                        aria-label={t('RegisterModalDialCode')}
                        disabled={!countryCodes.length}
                        onChange={onDialCodeChange}
                      >
                        {countryCodes.length ? (
                          countryCodes.map((code) => (
                            <option key={code.iso2Code} value={code.iso2Code.toUpperCase()}>
                              {`${code.name} (⁦${withPlus(code.dialCode)}⁩)`}
                            </option>
                          ))
                        ) : (
                          <option value={DEFAULT_DIAL_ISO}>{DEFAULT_DIAL_CODE}</option>
                        )}
                      </select>
                    </span>
                    <input
                      {...inputProps('phone')}
                      className={styles.input}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      maxLength={15}
                      placeholder={phoneHint}
                      onChange={(event) => update('phone', sanitizePhone(event.target.value))}
                    />
                  </div>
                </Field>

                <Field
                  id={fieldId('firstName')}
                  label={t('FirstName')}
                  error={errors.firstName}
                  className={styles.pair}
                >
                  <div className={styles.control} data-invalid={!!errors.firstName}>
                    <input
                      {...inputProps('firstName')}
                      className={styles.input}
                      type="text"
                      autoComplete="given-name"
                      maxLength={64}
                      placeholder={t('RegisterModalFirstNamePlaceholder')}
                      onChange={(event) => update('firstName', event.target.value)}
                    />
                  </div>
                </Field>

                <Field
                  id={fieldId('lastName')}
                  label={t('LastName')}
                  error={errors.lastName}
                  className={styles.pair}
                >
                  <div className={styles.control} data-invalid={!!errors.lastName}>
                    <input
                      {...inputProps('lastName')}
                      className={styles.input}
                      type="text"
                      autoComplete="family-name"
                      maxLength={64}
                      placeholder={t('RegisterModalLastNamePlaceholder')}
                      onChange={(event) => update('lastName', event.target.value)}
                    />
                  </div>
                </Field>

                <Field
                  id={fieldId('email')}
                  label={t('Email')}
                  error={errors.email}
                  className={styles.third}
                >
                  <div className={styles.control} data-invalid={!!errors.email}>
                    <input
                      {...inputProps('email')}
                      className={styles.input}
                      dir="ltr"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      maxLength={256}
                      placeholder={t('RegisterModalEmailPlaceholder')}
                      onChange={(event) => update('email', event.target.value)}
                    />
                  </div>
                </Field>

                <Field
                  id={fieldId('password')}
                  label={t('Password')}
                  error={errors.password}
                  className={styles.wide}
                >
                  <div className={styles.control} data-invalid={!!errors.password}>
                    {/* ltr once typed in, so a shown password keeps its characters in order (but
                        still aligned with the page); empty, it follows the page so the hint reads
                        right */}
                    <input
                      {...inputProps('password')}
                      className={`${styles.input} ${styles.pageAligned}`}
                      dir={values.password ? 'ltr' : undefined}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      maxLength={128}
                      placeholder={t('RegisterModalPasswordPolicy')}
                      onChange={(event) => update('password', event.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={t('RegisterModalShowPassword')}
                      aria-pressed={showPassword}
                      aria-controls={`${fieldId('password')} ${fieldId('confirmPassword')}`}
                      onClick={() => setShowPassword((shown) => !shown)}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                    </button>
                  </div>
                </Field>

                <Field
                  id={fieldId('confirmPassword')}
                  label={t('ConfirmPassword')}
                  error={errors.confirmPassword}
                  className={styles.wide}
                >
                  <div className={styles.control} data-invalid={!!errors.confirmPassword}>
                    <input
                      {...inputProps('confirmPassword')}
                      className={`${styles.input} ${styles.pageAligned}`}
                      dir={values.confirmPassword ? 'ltr' : undefined}
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      maxLength={128}
                      placeholder={t('RegisterModalConfirmPasswordPlaceholder')}
                      onChange={(event) => update('confirmPassword', event.target.value)}
                    />
                    <span className={styles.match} aria-live="polite">
                      {passwordsMatch && (
                        <>
                          <Check size={18} strokeWidth={2.5} aria-hidden />
                          <span className="visually-hidden">{t('RegisterModalPasswordsMatch')}</span>
                        </>
                      )}
                    </span>
                  </div>
                </Field>
              </div>
            </div>

            <div className={styles.footer}>
              {formError && (
                <p className={styles.formError} role="alert">
                  {formError}
                </p>
              )}
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting && <Loader2 className={styles.spinner} size={18} aria-hidden />}
                {t('Register')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  )
}
