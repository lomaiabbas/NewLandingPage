'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { MapPin, Phone } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../contact-info'
import styles from './contact-us.module.css'


const MESSAGE_TYPES = [
  'ContactTypeDemo',
  'ContactTypeGeneral',
  'ContactTypeSupport',
  'ContactTypePartnership',
] as const

type MessageType = (typeof MESSAGE_TYPES)[number]

/* The reference's CTA + contact band: a dark rounded card with the call to action and contact
   details on one side and the contact form on a white card on the other. */
export default function ContactUs({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [type, setType] = useState<MessageType>('ContactTypeDemo')
  const [content, setContent] = useState('')
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; content?: string }>({})

  const validateForm = () => {
    const _errors: typeof errors = {}
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!name.trim()) _errors.name = t('ThisFieldIsMandatory')
    if (!email) _errors.email = t('ThisFieldIsMandatory')
    else if (!emailRegex.test(email)) _errors.email = t('ThisEmailIsInvalid')
    if (!content.trim()) _errors.content = t('ThisFieldIsMandatory')
    setErrors(_errors)
    return Object.keys(_errors).length === 0
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    const body = [
      `${t('ContactFormName')}: ${name}`,
      `${t('ContactFormCompany')}: ${company}`,
      `${t('ContactFormEmail')}: ${email}`,
      `${t('ContactFormPhone')}: ${phone}`,
      '',
      content,
    ].join('\n')
    const subject = `[${t(type)}] AtrasLink`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
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

            <form onSubmit={onSubmit} noValidate className={styles.form}>
              <h3 className={styles.formTitle}>{t('Contact')}</h3>
              <div className={styles.fields}>
                <label className={styles.label}>
                  <span>{t('ContactFormName')} *</span>
                  <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(resolvePersianAndArabicNumbers(e.target.value))}
                    className={styles.field}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </label>
                <label className={styles.label}>
                  <span>{t('ContactFormCompany')}</span>
                  <input
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(resolvePersianAndArabicNumbers(e.target.value))}
                    className={styles.field}
                  />
                </label>
                <label className={styles.label}>
                  <span>{t('ContactFormEmail')} *</span>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(resolvePersianAndArabicNumbers(e.target.value))}
                    className={styles.field}
                  />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </label>
                <label className={styles.label}>
                  <span>{t('ContactFormPhone')}</span>
                  <input
                    name="phone"
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(resolvePersianAndArabicNumbers(e.target.value))}
                    className={styles.field}
                  />
                </label>
              </div>

              <fieldset className={styles.typeSet}>
                <legend className={styles.legend}>{t('ContactFormType')} *</legend>
                <div className={styles.chips}>
                  {MESSAGE_TYPES.map((x) => (
                    <button
                      key={x}
                      type="button"
                      aria-pressed={type === x}
                      onClick={() => setType(x)}
                      className={`${styles.chip} ${type === x ? styles.chipActive : ''}`}
                    >
                      {t(x)}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className={`${styles.label} ${styles.messageLabel}`}>
                <span>{t('ContactFormMessage')} *</span>
                <textarea
                  name="message"
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(resolvePersianAndArabicNumbers(e.target.value))}
                  className={styles.field}
                />
                {errors.content && <span className="error-msg">{errors.content}</span>}
              </label>

              <button type="submit" className={`${styles.btn} ${styles.submit}`}>
                {t('SendYourMassage')}
              </button>
              {sent && (
                <p role="status" className={styles.sent}>
                  {t('ContactFormSent')}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
