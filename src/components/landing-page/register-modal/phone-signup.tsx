'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { BadgeCheck, Check, CheckCircle2, MessageCircle } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
} from 'react'
import styles from './register-modal.module.css'

type Step = 'form' | 'otp' | 'done'

/* The sign-up as the leader's page has it (atraslink-brand-beacon, Signup.tsx): company, name and
   WhatsApp number, then a 6-digit code sent to that number, then "request received".
   Design only for now: nothing is sent anywhere, each button just moves on to the next step. */
export default function PhoneSignup({
  lng,
  onClose,
  firstFieldRef,
}: {
  lng: string
  onClose: () => void
  /** the modal focuses it when it opens */
  firstFieldRef: RefObject<HTMLInputElement>
}) {
  const { t } = getClientTranslation(lng)
  const uid = useId()
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({ companyName: '', contactName: '', phone: '' })
  const [code, setCode] = useState('')
  const stepTitleRef = useRef<HTMLHeadingElement>(null)
  const isFirstStep = useRef(true)

  // each new step is announced and keyboard users land on it, not on the page's top
  useEffect(() => {
    if (isFirstStep.current) {
      isFirstStep.current = false
      return
    }
    if (step === 'form') firstFieldRef.current?.focus()
    else stepTitleRef.current?.focus()
  }, [step, firstFieldRef])

  const set = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }))

  const sendCode = (event?: FormEvent) => {
    event?.preventDefault()
    setCode('')
    setStep('otp')
  }

  const verify = (event: FormEvent) => {
    event.preventDefault()
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className={styles.sheet}>
        <div className={`${styles.body} ${styles.success}`}>
          <span className={styles.successIcon} aria-hidden>
            <Check size={34} strokeWidth={2.5} />
          </span>
          <h3 ref={stepTitleRef} tabIndex={-1} className={styles.successTitle}>
            {t('PhoneSignupDoneTitle')}
          </h3>
          <p className={styles.successText}>{t('PhoneSignupDoneDesc')}</p>
        </div>
        <div className={`${styles.footer} ${styles.successFooter}`}>
          <button type="button" className={styles.submit} onClick={onClose}>
            {t('PhoneSignupBackHome')}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'otp') {
    return (
      <form className={styles.sheet} onSubmit={verify}>
        <div className={styles.body}>
          <div className={styles.stepIntro}>
            <h3 ref={stepTitleRef} tabIndex={-1} className={styles.stepTitle}>
              {t('PhoneSignupCodeTitle')}
            </h3>
            <p className={styles.stepText}>{t('PhoneSignupCodeDesc')}</p>
            <p className={styles.stepPhone} dir="ltr">
              {form.phone}
            </p>
          </div>
          <div className={styles.field}>
            <label htmlFor={`${uid}code`} className={styles.label}>
              {t('PhoneSignupCode')}
            </label>
            <div className={`${styles.control} ${styles.codeControl}`}>
              <input
                id={`${uid}code`}
                className={`${styles.input} ${styles.codeInput}`}
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                dir="ltr"
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button type="submit" className={`${styles.submit} ${styles.codeSubmit}`}
            disabled={code.length !== 6}
          >
            <CheckCircle2 size={18} aria-hidden />
            {t('PhoneSignupVerify')}
          </button>
          <div className={styles.stepLinks}>
            <button type="button" className={styles.textButton} onClick={() => setStep('form')}>
              {t('PhoneSignupBack')}
            </button>
            <button
              type="button"
              className={`${styles.textButton} ${styles.textButtonStrong}`}
              onClick={() => sendCode()}
            >
              {t('PhoneSignupResend')}
            </button>
          </div>
        </div>
      </form>
    )
  }

  return (
    <form className={styles.sheet} onSubmit={sendCode}>
      <div className={styles.body}>
        <p className={styles.stepText}>{t('PhoneSignupSubtitle')}</p>
        <div className={`${styles.grid} ${styles.stepFields}`}>
          <div className={`${styles.field} ${styles.wide}`}>
            <label htmlFor={`${uid}company`} className={styles.label}>
              {t('CompanyName')} *
            </label>
            <div className={styles.control}>
              <input
                ref={firstFieldRef}
                id={`${uid}company`}
                className={styles.input}
                type="text"
                autoComplete="organization"
                required
                minLength={2}
                maxLength={120}
                placeholder={t('RegisterModalCompanyNamePlaceholder')}
                value={form.companyName}
                onChange={set('companyName')}
              />
            </div>
          </div>

          <div className={`${styles.field} ${styles.wide}`}>
            <label htmlFor={`${uid}name`} className={styles.label}>
              {t('FullName')} *
            </label>
            <div className={styles.control}>
              <input
                id={`${uid}name`}
                className={styles.input}
                type="text"
                autoComplete="name"
                required
                minLength={2}
                maxLength={120}
                placeholder={t('RegisterModalFullNamePlaceholder')}
                value={form.contactName}
                onChange={set('contactName')}
              />
            </div>
          </div>

          <div className={`${styles.field} ${styles.wide}`}>
            <label htmlFor={`${uid}phone`} className={styles.label}>
              {t('PhoneSignupPhone')} *
            </label>
            <div className={styles.control}>
              <input
                id={`${uid}phone`}
                className={`${styles.input} ${styles.pageAligned}`}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                required
                minLength={8}
                maxLength={20}
                pattern="[0-9+\s\-]+"
                placeholder="+9665XXXXXXXX"
                aria-describedby={`${uid}phone-hint`}
                value={form.phone}
                onChange={set('phone')}
              />
            </div>
            <p id={`${uid}phone-hint`} className={styles.hint}>
              {t('PhoneSignupPhoneHint')}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <button type="submit" className={styles.submit}>
          <MessageCircle size={18} aria-hidden />
          {t('PhoneSignupSend')}
        </button>
        <p className={styles.reviewNote}>
          <BadgeCheck size={14} aria-hidden />
          {t('PhoneSignupReviewNote')}
        </p>
      </div>
    </form>
  )
}
