'use client'

import AtrasLinkLogo from '@/lib/icons/logo'
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import styles from './signup-page.module.css'

/* Design only, as in atraslink-brand-beacon's sign-up page: the three steps (details, code, done)
   are all there, but nothing is validated server-side or sent anywhere. */
const COPY = {
  ar: {
    slogan: 'نَدور لنصلك بعملائك',
    switchLang: 'English',
    title: 'سجّل اشتراكك في أتراس لينك',
    subtitle:
      'أدخل بياناتك وسنرسل رمز تحقق إلى رقمك عبر واتساب، ثم يراجع فريقنا طلبك ويفعّل حسابك.',
    company: 'اسم الشركة',
    name: 'الاسم الكامل',
    phone: 'رقم الجوال (واتساب)',
    phoneHint: 'أدخل الرقم بالصيغة الدولية مع مفتاح الدولة.',
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
    backHome: 'العودة للرئيسية',
  },
  en: {
    slogan: 'We turn to connect you with your customers',
    switchLang: 'العربية',
    title: 'Sign up for AtrasLink',
    subtitle:
      'Enter your details and we will send a verification code to your number on WhatsApp, then our team reviews your request and activates your account.',
    company: 'Company name',
    name: 'Full name',
    phone: 'Mobile number (WhatsApp)',
    phoneHint: 'Enter the number in international format with the country code.',
    send: 'Send verification code',
    codeTitle: 'Enter the verification code',
    codeDesc: 'We sent a 6-digit code to your number on WhatsApp.',
    code: 'Verification code',
    verify: 'Verify and submit request',
    resend: 'Resend code',
    back: 'Edit details',
    reviewNote: 'Sign-up requests are reviewed by the AtrasLink team, with a reply within two business days, before your account is activated.',
    doneTitle: 'Your request has been received',
    doneDesc:
      'Your number is verified and the AtrasLink team will review your request. We will contact you on WhatsApp as soon as your account is activated.',
    backHome: 'Back to home',
  },
}

type Step = 'form' | 'otp' | 'done'

export default function SignupPage({ lng }: { lng: string }) {
  const isEn = lng === 'en'
  const t = COPY[isEn ? 'en' : 'ar']
  const Arrow = isEn ? ArrowRight : ArrowLeft
  const home = `/${lng}`
  const otherLng = isEn ? 'ar' : 'en'

  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({ companyName: '', contactName: '', phone: '' })
  const [code, setCode] = useState('')

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const sendCode = (e?: FormEvent) => {
    e?.preventDefault()
    setStep('otp')
  }

  const verify = (e: FormEvent) => {
    e.preventDefault()
    setStep('done')
  }

  return (
    <div className={styles.page} dir={isEn ? 'ltr' : 'rtl'} lang={lng}>
      <div className={styles.glow} />
      <div className={styles.dots} />

      <header className={styles.header}>
        <Link href={home} aria-label="AtrasLink" className={styles.brand}>
          <AtrasLinkLogo />
          <span className={styles.brandName} dir="ltr">
            AtrasLink
          </span>
        </Link>
        <Link href={`/${otherLng}/signup`} className={styles.btnGhost}>
          {t.switchLang}
        </Link>
      </header>

      <main className={styles.main}>
        <div className={styles.wrap}>
          <div className={styles.intro}>
            <span className={styles.slogan}>
              <span className={styles.sloganDot} />
              {t.slogan}
            </span>
            <h1 className={styles.title}>{t.title}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>

          <div className={styles.card}>
            {step === 'form' && (
              <form onSubmit={sendCode} className={styles.form}>
                <label className={styles.field}>
                  <span className={styles.label}>{t.company} *</span>
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    className={styles.input}
                    value={form.companyName}
                    onChange={set('companyName')}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{t.name} *</span>
                  <input
                    required
                    minLength={2}
                    maxLength={120}
                    className={styles.input}
                    value={form.contactName}
                    onChange={set('contactName')}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>{t.phone} *</span>
                  <input
                    required
                    type="tel"
                    dir="ltr"
                    minLength={8}
                    maxLength={20}
                    pattern="[0-9+\s\-]+"
                    placeholder="+9665XXXXXXXX"
                    className={styles.input}
                    value={form.phone}
                    onChange={set('phone')}
                  />
                  <span className={styles.hint}>{t.phoneHint}</span>
                </label>
                <button type="submit" className={`${styles.btnPrimary} ${styles.btnBlock}`}>
                  <MessageCircle size={16} />
                  {t.send}
                </button>
                <p className={styles.note}>
                  <BadgeCheck size={14} className={styles.noteIcon} />
                  {t.reviewNote}
                </p>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={verify} className={styles.form}>
                <div className={styles.center}>
                  <h2 className={styles.stepTitle}>{t.codeTitle}</h2>
                  <p className={styles.stepDesc}>{t.codeDesc}</p>
                  <p className={styles.phoneShown} dir="ltr">
                    {form.phone}
                  </p>
                </div>
                <label className={styles.field}>
                  <span className={styles.label}>{t.code} *</span>
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="\d{6}"
                    maxLength={6}
                    dir="ltr"
                    className={`${styles.input} ${styles.codeInput}`}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  />
                </label>
                <button
                  type="submit"
                  disabled={code.length !== 6}
                  className={`${styles.btnPrimary} ${styles.btnBlock}`}
                >
                  <CheckCircle2 size={16} />
                  {t.verify}
                </button>
                <div className={styles.rowBetween}>
                  <button type="button" onClick={() => setStep('form')} className={styles.linkMuted}>
                    {t.back}
                  </button>
                  <button type="button" onClick={() => sendCode()} className={styles.linkBrand}>
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
                <h2 className={styles.doneTitle}>{t.doneTitle}</h2>
                <p className={styles.doneDesc}>{t.doneDesc}</p>
                <Link href={home} className={`${styles.btnPrimary} ${styles.btnDone}`}>
                  {t.backHome}
                  <Arrow size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
