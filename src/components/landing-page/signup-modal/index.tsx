'use client'

import AtrasLinkLogo from '@/lib/icons/logo'
import landingRequestsServiceInstance, {
  LANDING_FORMS_API_READY,
} from '@/lib/services/landing-requests'
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, MessageCircle, X } from 'lucide-react'
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MutableRefObject,
} from 'react'
import { createPortal } from 'react-dom'
import DialCodePicker from '../register-modal/dial-code-picker'
import {
  DEFAULT_DIAL_CODE,
  DEFAULT_DIAL_ISO,
  EMPTY_REGISTER_VALUES,
} from '../register-modal/register-modal.data'
import {
  dialCountries,
  phoneMask,
  sanitizePhone,
  toNationalNumber,
  validateRegisterField,
} from '../register-modal/register-modal.helpers'
import styles from './signup-modal.module.css'

/* The three steps (details, code, done). With NEXT_PUBLIC_LANDING_FORMS_API=true the code is sent
   and checked by the backend (see lib/services/landing-requests); without it the steps only move
   on and nothing is sent. The register-modal provider opens it over the landing page
   (?register=1, or any link to /register). */
const COPY = {
  ar: {
    slogan: 'نَدور لنصلك بعملائك',
    title: 'سجّل اشتراكك في أتراس لينك',
    subtitle:
      'أدخل بياناتك وسنرسل رمز تحقق إلى رقمك عبر واتساب، ثم يراجع فريقنا طلبك ويفعّل حسابك.',
    company: 'اسم الشركة',
    name: 'الاسم الكامل',
    phone: 'رقم الجوال (واتساب)',
    phoneHint: 'اختر الدولة، ثم أدخل رقمك بدون مفتاح الدولة.',
    dialCode: 'مفتاح الدولة',
    send: 'أرسل رمز التحقق',
    codeTitle: 'أدخل رمز التحقق',
    codeDesc: 'أرسلنا رمزاً مكوّناً من 6 أرقام إلى رقمك عبر واتساب.',
    code: 'رمز التحقق',
    verify: 'تحقّق وأرسل الطلب',
    resend: 'إعادة إرسال الرمز',
    back: 'تعديل البيانات',
    reviewNote: 'تتم مراجعة طلبات التسجيل من فريق أتراس لينك والرد خلال يومي عمل قبل تفعيل الحساب.',
    doneTitle: 'تم استلام طلبك بنجاح',
    doneDesc:
      'تم التحقق من رقمك، وسيراجع فريق أتراس لينك طلبك. سنتواصل معك عبر واتساب فور تفعيل حسابك.',
    close: 'إغلاق',
    backHome: 'العودة للرئيسية',
    sending: 'جاري الإرسال...',
    sendError: 'تعذّر إرسال الرمز، حاول مرة أخرى.',
    verifyError: 'الرمز غير صحيح أو تعذّر إرسال الطلب، حاول مرة أخرى.',
    networkError: 'الرجاء التحقق من اتصالك بالشبكة والمحاولة مجدداً.',
    companyRequired: 'اسم الشركة مطلوب.',
    nameRequired: 'الاسم الكامل مطلوب.',
    tooShort: 'يجب ألا يقل عن حرفين.',
    phoneRequired: 'رقم الجوال مطلوب.',
    phoneTooShort: 'الرقم أقصر من أرقام هذه الدولة.',
    phoneTooLong: 'الرقم أطول من أرقام هذه الدولة.',
    phoneInvalid: 'رقم الجوال غير صحيح لهذه الدولة.',
    codeDigits: 'الرمز أرقام فقط.',
    codeLength: 'الرمز مكوّن من 6 أرقام.',
  },
  en: {
    slogan: 'We turn to connect you with your customers',
    title: 'Sign up for AtrasLink',
    subtitle:
      'Enter your details and we will send a verification code to your number on WhatsApp, then our team reviews your request and activates your account.',
    company: 'Company name',
    name: 'Full name',
    phone: 'Mobile number (WhatsApp)',
    phoneHint: 'Choose the country, then enter your number without the country code.',
    dialCode: 'Country code',
    send: 'Send verification code',
    codeTitle: 'Enter the verification code',
    codeDesc: 'We sent a 6-digit code to your number on WhatsApp.',
    code: 'Verification code',
    verify: 'Verify and submit request',
    resend: 'Resend code',
    back: 'Edit details',
    reviewNote:
      'Sign-up requests are reviewed by the AtrasLink team, with a reply within two business days, before your account is activated.',
    doneTitle: 'Your request has been received',
    doneDesc:
      'Your number is verified and the AtrasLink team will review your request. We will contact you on WhatsApp as soon as your account is activated.',
    close: 'Close',
    backHome: 'Back to home',
    sending: 'Sending...',
    sendError: 'We could not send the code. Please try again.',
    verifyError: 'The code is wrong or the request could not be sent. Please try again.',
    networkError: 'Please check your network connection and try again.',
    companyRequired: 'Company name is required.',
    nameRequired: 'Full name is required.',
    tooShort: 'Must be at least 2 characters.',
    phoneRequired: 'Mobile number is required.',
    phoneTooShort: 'The number is too short for this country.',
    phoneTooLong: 'The number is too long for this country.',
    phoneInvalid: 'This is not a valid mobile number for this country.',
    codeDigits: 'The code must contain digits only.',
    codeLength: 'The code must be 6 digits.',
  },
}

type Step = 'form' | 'otp' | 'done'

export default function SignupModal({
  lng,
  open,
  onClose,
  returnFocusRef,
}: {
  lng: string
  open: boolean
  onClose: () => void
  returnFocusRef: MutableRefObject<HTMLElement | null>
}) {
  const isEn = lng === 'en'
  const t = COPY[isEn ? 'en' : 'ar']
  const Arrow = isEn ? ArrowRight : ArrowLeft

  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({ companyName: '', contactName: '', phone: '' })
  const [code, setCode] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // the phone's country, picked from a list with flags as on the /register page: Saudi Arabia,
  // the UAE, Kuwait and the Netherlands (DIAL_COUNTRIES), Saudi Arabia first
  const countryCodes = useMemo(() => dialCountries(lng), [lng])
  const [dialIso, setDialIso] = useState(DEFAULT_DIAL_ISO)
  const dialCode =
    countryCodes.find((c) => c.iso2Code.toUpperCase() === dialIso)?.dialCode ?? DEFAULT_DIAL_CODE

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // a field shows its rule error as soon as the user types in it (or leaves it / submits)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [codeBadChar, setCodeBadChar] = useState(false)

  const touch = (key: string) => setTouched((s) => (s[key] ? s : { ...s, [key]: true }))

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    // the number takes digits only (Arabic-Indic digits become latin ones); the code is the picker's
    const value = key === 'phone' ? sanitizePhone(e.target.value) : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setError(null)
    touch(key)
  }

  // +966 and 0555555555 -> +966555555555 (what the backend gets; a typed trunk 0 is dropped)
  const phoneNumber = dialCode + toNationalNumber(dialCode, form.phone)

  const validateName = (value: string, required: string) => {
    const v = value.trim()
    if (!v) return required
    if (v.length < 2) return t.tooShort
    return null
  }
  // the /register page's rule (libphonenumber, for the picked country) decides
  const validatePhone = (value: string) => {
    if (!value) return t.phoneRequired
    const issue = validateRegisterField('phone', { ...EMPTY_REGISTER_VALUES, phone: value }, dialCode)
    if (!issue) return null
    if (issue.key === 'RegisterModalPhoneTooShort') return t.phoneTooShort
    if (issue.key === 'RegisterModalPhoneTooLong') return t.phoneTooLong
    return t.phoneInvalid
  }
  const fieldErrors = {
    companyName: validateName(form.companyName, t.companyRequired),
    contactName: validateName(form.contactName, t.nameRequired),
    phone: validatePhone(form.phone),
  }
  const shown = (key: keyof typeof fieldErrors) => (touched[key] ? fieldErrors[key] : null)
  const formValid = !fieldErrors.companyName && !fieldErrors.contactName && !fieldErrors.phone
  const codeError = codeBadChar ? t.codeDigits : touched.code && code.length < 6 ? t.codeLength : null

  // runs one backend call: shows the busy state, then moves on only if it worked
  const run = async (call: () => Promise<void>, onOk: () => void, failed: string) => {
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await call()
      onOk()
    } catch (err: any) {
      setError(err?.response ? failed : t.networkError)
    } finally {
      setBusy(false)
    }
  }

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault()
    if (!formValid) {
      setTouched((s) => ({ ...s, companyName: true, contactName: true, phone: true }))
      return
    }
    if (!LANDING_FORMS_API_READY) {
      setCode('')
      setCodeBadChar(false)
      setTouched((s) => ({ ...s, code: false }))
      setStep('otp')
      return
    }
    void run(
      () => landingRequestsServiceInstance.sendSignupOtp({ phoneNumber }),
      () => {
        setCode('')
        setCodeBadChar(false)
        setTouched((s) => ({ ...s, code: false }))
        setStep('otp')
      },
      t.sendError
    )
  }

  const verify = (e: FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) {
      touch('code')
      return
    }
    if (!LANDING_FORMS_API_READY) {
      setStep('done')
      return
    }
    void run(
      () =>
        landingRequestsServiceInstance.verifySignup({
          companyName: form.companyName.trim(),
          contactName: form.contactName.trim(),
          phoneNumber,
          code,
        }),
      () => setStep('done'),
      t.verifyError
    )
  }

  // Esc closes, the page behind stops scrolling, focus moves in and goes back to the trigger
  useEffect(() => {
    if (!open) return
    const body = document.body
    const bodyOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('input, button')?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      body.style.overflow = bodyOverflow
      const target = returnFocusRef.current
      returnFocusRef.current = null
      if (target?.isConnected) target.focus({ preventScroll: true })
    }
  }, [open, onClose, returnFocusRef])

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-state={open ? 'open' : 'closed'}
      dir={isEn ? 'ltr' : 'rtl'}
      lang={lng}
      aria-hidden={!open}
      // pointerdown: while the country list is open, DialCodePicker stops it so a press on the
      // backdrop closes only the list
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label={t.close}>
          <X size={20} />
        </button>

        <div className={styles.intro}>
          <span className={styles.logo}>
            <AtrasLinkLogo />
          </span>
          <span className={styles.slogan}>
            <span className={styles.sloganDot} />
            {t.slogan}
          </span>
          <h2 className={styles.title}>{t.title}</h2>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div className={styles.card}>
          {step === 'form' && (
            <form onSubmit={sendCode} noValidate className={styles.form}>
              <label className={styles.field}>
                <span className={styles.label}>{t.company} *</span>
                <input
                  maxLength={120}
                  className={`${styles.input} ${shown('companyName') ? styles.inputInvalid : ''}`}
                  aria-invalid={!!shown('companyName')}
                  value={form.companyName}
                  onChange={set('companyName')}
                  onBlur={() => touch('companyName')}
                />
                {shown('companyName') && (
                  <span role="alert" className={styles.fieldError}>
                    {shown('companyName')}
                  </span>
                )}
              </label>
              <label className={styles.field}>
                <span className={styles.label}>{t.name} *</span>
                <input
                  maxLength={120}
                  className={`${styles.input} ${shown('contactName') ? styles.inputInvalid : ''}`}
                  aria-invalid={!!shown('contactName')}
                  value={form.contactName}
                  onChange={set('contactName')}
                  onBlur={() => touch('contactName')}
                />
                {shown('contactName') && (
                  <span role="alert" className={styles.fieldError}>
                    {shown('contactName')}
                  </span>
                )}
              </label>
              {/* a div, not a label: a label would pass its clicks to the country button */}
              <div className={styles.field}>
                <label htmlFor="signup-phone" className={styles.label}>
                  {t.phone} *
                </label>
                <div
                  className={`${styles.input} ${styles.phoneControl} ${shown('phone') || error ? styles.inputInvalid : ''}`}
                  dir="ltr"
                >
                  <DialCodePicker
                    codes={countryCodes}
                    value={dialIso}
                    onChange={(iso) => {
                      setDialIso(iso)
                      setError(null)
                    }}
                    label={t.dialCode}
                    containerRef={overlayRef}
                    styles={styles}
                  />
                  <input
                    id="signup-phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    maxLength={15}
                    placeholder={phoneMask(dialIso)}
                    className={styles.phoneInput}
                    aria-invalid={!!(shown('phone') || error)}
                    value={form.phone}
                    onChange={set('phone')}
                    onBlur={() => touch('phone')}
                  />
                </div>
                {shown('phone') || error ? (
                  <span role="alert" className={styles.fieldError}>
                    {shown('phone') || error}
                  </span>
                ) : (
                  <span className={styles.hint}>{t.phoneHint}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={busy}
                className={`${styles.btnPrimary} ${styles.btnBlock}`}
              >
                <MessageCircle size={16} />
                {busy ? t.sending : t.send}
              </button>
              <p className={styles.note}>
                <BadgeCheck size={14} className={styles.noteIcon} />
                {t.reviewNote}
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={verify} noValidate className={styles.form}>
              <div className={styles.center}>
                <h3 className={styles.stepTitle}>{t.codeTitle}</h3>
                <p className={styles.stepDesc}>{t.codeDesc}</p>
                <p className={styles.phoneShown} dir="ltr">
                  {phoneNumber}
                </p>
              </div>
              <label className={styles.field}>
                <span className={styles.label}>{t.code} *</span>
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  className={`${styles.input} ${styles.codeInput} ${codeError || error ? styles.inputInvalid : ''}`}
                  aria-invalid={!!(codeError || error)}
                  value={code}
                  onChange={(e) => {
                    const raw = e.target.value
                    setCodeBadChar(/\D/.test(raw))
                    setCode(raw.replace(/\D/g, '').slice(0, 6))
                    setError(null)
                    touch('code')
                  }}
                />
                {(codeError || error) && (
                  <span role="alert" className={styles.fieldError}>
                    {codeError || error}
                  </span>
                )}
              </label>
              <button
                type="submit"
                disabled={code.length !== 6 || busy}
                className={`${styles.btnPrimary} ${styles.btnBlock}`}
              >
                <CheckCircle2 size={16} />
                {busy ? t.sending : t.verify}
              </button>
              <div className={styles.rowBetween}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setError(null)
                    setStep('form')
                  }}
                  className={styles.linkMuted}
                >
                  {t.back}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => sendCode()}
                  className={styles.linkBrand}
                >
                  {t.resend}
                </button>
              </div>
            </form>
          )}

          {step === 'done' && (
            <div className={styles.center}>
              <span className={styles.doneIcon}>
                <CheckCircle2 size={32} />
              </span>
              <h3 className={styles.doneTitle}>{t.doneTitle}</h3>
              <p className={styles.doneDesc}>{t.doneDesc}</p>
              <button type="button" onClick={onClose} className={`${styles.btnPrimary} ${styles.btnDone}`}>
                {t.backHome}
                <Arrow size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
