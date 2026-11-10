'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import landingRequestsServiceInstance, {
  CONTACT_LIMITS,
  type ContactMessageType,
} from '@/lib/services/landing-requests'
import { MapPin, Phone } from 'lucide-react'
import { FormEvent, useEffect, useId, useRef, useState } from 'react'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../contact-info'
import { onContactPrefill } from './contact-prefill'
import ContactSentDialog from './contact-sent-dialog'
import styles from './contact-us.module.css'
import {
  CONTACT_FIELDS,
  contactError,
  readContactError,
  type ContactField,
} from './contact-us.validation'
import SolutionField, { SOLUTIONS, type SolutionId } from './solution-field'

/* value: the fixed id sent to the backend (the same in every language); label: the translation key
   shown on the chip. To add a type, add a line here and the label in
   both translation files (and the value to ContactMessageType in the service). */
const MESSAGE_TYPES: { value: ContactMessageType; label: string }[] = [
  { value: 'Demo', label: 'ContactTypeDemo' },
  { value: 'General', label: 'ContactTypeGeneral' },
  { value: 'Support', label: 'ContactTypeSupport' },
  { value: 'Partnership', label: 'ContactTypePartnership' },
]

const DRAFT_KEY = 'contact-form-draft'

/* CTA + contact band: a dark rounded card with the call to action and contact details on one side
   and the contact form on a white card on the other. */
export default function ContactUs({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<ContactMessageType>('Demo')
  const [solutions, setSolutions] = useState<SolutionId[]>([])
  const [content, setContent] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({})
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)

  // switching the language reloads the page under another route, so the draft is kept in the
  // session and restored here
  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? 'null')
      if (!draft) return
      setName(draft.name ?? '')
      setCompany(draft.company ?? '')
      setEmail(draft.email ?? '')
      setPhone(draft.phone ?? '')
      setContent(draft.content ?? '')
      if (MESSAGE_TYPES.some((x) => x.value === draft.type)) setType(draft.type)
      if (Array.isArray(draft.solutions)) {
        setSolutions(SOLUTIONS.map((x) => x.value).filter((v) => draft.solutions.includes(v)))
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ name, company, email, phone, type, solutions, content })
      )
    } catch {}
  }, [name, company, email, phone, type, solutions, content])

  // other parts of the page can open the form with a message type already chosen
  useEffect(() => onContactPrefill(setType), [])

  const values = { name, company, email, phone, content }
  const setters: Record<ContactField, (value: string) => void> = {
    name: setName,
    company: setCompany,
    email: setEmail,
    phone: setPhone,
    content: setContent,
  }

  const errorFor = (field: ContactField, current = values) => {
    const key = contactError(field, current)
    return key ? t(key, { max: CONTACT_LIMITS.message }) : undefined
  }

  const focusField = (field: ContactField) =>
    formRef.current?.querySelector<HTMLElement>(`[data-field="${field}"]`)?.focus()

  const validateForm = () => {
    const found: typeof errors = {}
    for (const field of CONTACT_FIELDS) found[field] = errorFor(field)
    setErrors(found)
    const firstInvalid = CONTACT_FIELDS.find((field) => found[field])
    if (firstInvalid) focusField(firstInvalid)
    return !firstInvalid
  }

  // the email and the phone are typed left to right; the other fields follow the language of what
  // is typed (the page's direction while empty), so the cursor stays at the end of the text
  const directionOf = (field: ContactField): 'ltr' | 'auto' | undefined => {
    if (field === 'email' || field === 'phone') return 'ltr'
    return values[field] ? 'auto' : undefined
  }

  // the props every text field shares: typing clears its error (the phone and the message length
  // are checked as they are typed), leaving a field checks what was typed
  const fieldProps = (field: ContactField) => ({
    'data-field': field,
    dir: directionOf(field),
    value: values[field],
    onChange: (e: { target: { value: string } }) => {
      const next = resolvePersianAndArabicNumbers(e.target.value)
      setters[field](next)
      if (field === 'phone') {
        setErrors((prev) => ({ ...prev, phone: errorFor('phone', { ...values, phone: next }) }))
      } else if (field === 'content' && next.trim().length > CONTACT_LIMITS.message) {
        setErrors((prev) => ({ ...prev, content: errorFor('content', { ...values, content: next }) }))
      } else if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    onBlur: () => {
      if (!values[field].trim()) return // an empty field is only reported when submitting
      const error = errorFor(field)
      setErrors((prev) => ({ ...prev, [field]: error }))
    },
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${uid}-${field}` : undefined,
    className: `${styles.field} ${errors[field] ? styles.fieldInvalid : ''}`,
  })

  const fieldError = (field: ContactField) =>
    errors[field] && (
      <span id={`${uid}-${field}`} className="error-msg" role="alert">
        {errors[field]}
      </span>
    )

  const sendRequest = async () => {
    setSending(true)
    try {
      const result = await landingRequestsServiceInstance.sendContactRequest({
        fullName: name.trim(),
        email: email.trim(),
        messageType: type,
        message: content.trim(),
        solutionType:
          SOLUTIONS.map((x) => x.value)
            .filter((v) => solutions.includes(v))
            .join(',') || undefined,
        companyName: company.trim() || undefined,
        phoneNumber: phone.trim() || undefined,
      })
      if (!result?.success) {
        setSubmitError(result?.message || t('RegisterModalSubmitError'))
        return
      }
      setName('')
      setCompany('')
      setEmail('')
      setPhone('')
      setType('Demo')
      setSolutions([])
      setContent('')
      setSent(true)
    } catch (error: any) {
      // the backend's own message goes under the field it is about, otherwise under the form
      const { field, messageKey, message } = readContactError(error)
      const text = message || t(messageKey ?? 'RegisterModalSubmitError')
      if (field) {
        setErrors((prev) => ({ ...prev, [field]: text }))
        focusField(field)
      } else {
        setSubmitError(text)
      }
    } finally {
      setSending(false)
    }
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending) return
    setSent(false)
    setSubmitError(null)
    if (validateForm()) void sendRequest()
  }

  return (
    <section className={styles.contactUs} id="contact">
      <div className="container">
        <div className={styles.card} data-aos="fade-up">
          <div className={styles.glow} aria-hidden />
          <div className={styles.grid}>
            <div>
              <h2 className={styles.title}>{t('ContactCtaTitle')}</h2>
              <p className={styles.desc}>{t('ContactCtaDesc')}</p>

              <div className={styles.info}>
                <p className={styles.lead}>{t('ContactTitle')}</p>
                <div className={styles.infoRow}>
                  <MapPin className={styles.infoIcon} />
                  <div>
                    <b>{t('OurLocation')}</b>
                    <div className={styles.dim}>{t('AtrasLinkLocation')}</div>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <Phone className={styles.infoIcon} />
                  <div>
                    <b>{t('SayHello')}</b>
                    <div>
                      <a href={CONTACT_PHONE_HREF} dir="ltr" className={styles.infoLink}>
                        {CONTACT_PHONE}
                      </a>
                    </div>
                    <div>
                      <a href={`mailto:${CONTACT_EMAIL}`} className={styles.infoLink}>
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form ref={formRef} onSubmit={onSubmit} noValidate className={styles.form}>
              <h3 className={styles.formTitle}>{t('Contact')}</h3>
              <div className={styles.fields}>
                <label className={styles.label}>
                  <span>{t('ContactFormName')} *</span>
                  <input
                    name="name"
                    autoComplete="name"
                    maxLength={CONTACT_LIMITS.name}
                    {...fieldProps('name')}
                  />
                  {fieldError('name')}
                </label>
                <label className={styles.label}>
                  <span>{t('ContactFormCompany')}</span>
                  <input
                    name="company"
                    autoComplete="organization"
                    maxLength={CONTACT_LIMITS.company}
                    {...fieldProps('company')}
                  />
                  {fieldError('company')}
                </label>
                <label className={styles.label}>
                  <span>{t('ContactFormEmail')} *</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    maxLength={CONTACT_LIMITS.email}
                    {...fieldProps('email')}
                  />
                  {fieldError('email')}
                </label>
                <label className={styles.label}>
                  <span>{t('ContactFormPhone')}</span>
                  <input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    maxLength={CONTACT_LIMITS.phone}
                    {...fieldProps('phone')}
                  />
                  {fieldError('phone')}
                </label>
              </div>

              <SolutionField lng={lng} value={solutions} onChange={setSolutions} />

              <fieldset className={styles.typeSet}>
                <legend className={styles.legend}>{t('ContactFormType')} *</legend>
                <div className={styles.chips}>
                  {MESSAGE_TYPES.map((x) => (
                    <button
                      key={x.value}
                      type="button"
                      aria-pressed={type === x.value}
                      onClick={() => setType(x.value)}
                      className={`${styles.chip} ${type === x.value ? styles.chipActive : ''}`}
                    >
                      {t(x.label)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className={`${styles.label} ${styles.messageLabel}`}>
                <span>{t('ContactFormMessage')} *</span>
                <div className={styles.textareaWrap}>
                  <textarea
                    name="message"
                    rows={3}
                    {...fieldProps('content')}
                  />
                  <span
                    className={`${styles.counter} ${
                      content.length > CONTACT_LIMITS.message ? styles.counterOver : ''
                    }`}
                  >
                    <bdi dir="ltr">
                      {content.length} / {CONTACT_LIMITS.message}
                    </bdi>
                  </span>
                </div>
                {fieldError('content')}
              </label>

              <button type="submit" disabled={sending} className={`${styles.btn} ${styles.submit}`}>
                {t('SendYourMassage')}
              </button>
              {submitError && (
                <p role="alert" className="error-msg">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
      {sent && (
        <ContactSentDialog
          title={t('ContactFormSentTitle')}
          message={t('ContactFormSent')}
          closeLabel={t('Close')}
          onClose={() => setSent(false)}
        />
      )}
    </section>
  )
}
