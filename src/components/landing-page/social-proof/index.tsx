'use client'

import { getClientTranslation } from '@/app/i18n/client'
import AtrasLinkLogo from '@/lib/icons/logo'
import { BarChart3, QrCode, Send, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  SOCIAL_PROOF_EXIT_MS,
  SOCIAL_PROOF_INITIAL_DELAY_MS,
  SOCIAL_PROOF_INTERVAL_MS,
  SOCIAL_PROOF_MAX_LOOPS,
  SOCIAL_PROOF_TOASTS,
  type SocialProofIcon,
} from './social-proof.data'
import styles from './social-proof.module.css'

const ICONS: Record<SocialProofIcon, typeof Send> = {
  send: Send,
  qrcode: QrCode,
  chart: BarChart3,
}

const MAX_SHOWS = SOCIAL_PROOF_TOASTS.length * SOCIAL_PROOF_MAX_LOOPS

export default function SocialProof({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const close = () => {
    setVisible(false)
    setTimeout(() => setDismissed(true), SOCIAL_PROOF_EXIT_MS)
  }

  useEffect(() => {
    const startTimer = setTimeout(() => setVisible(true), SOCIAL_PROOF_INITIAL_DELAY_MS)
    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (!visible || dismissed) return
    let shows = 1
    const timer = setInterval(() => {
      shows += 1
      if (shows > MAX_SHOWS) {
        clearInterval(timer)
        close()
        return
      }
      setIndex((i) => (i + 1) % SOCIAL_PROOF_TOASTS.length)
    }, SOCIAL_PROOF_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [visible, dismissed])

  if (dismissed) return null

  const toast = SOCIAL_PROOF_TOASTS[index]
  const ToastIcon = ICONS[toast.icon]

  return (
    <div
      className={`${styles.wrap} ${visible ? styles.show : ''}`}
      role="status"
      aria-live="polite"
    >
      <div key={toast.id} className={styles.toast}>
        <div className={styles.header}>
          <span className={styles.brand}>
            <AtrasLinkLogo XL />
            <span className={styles.brandName}>{t('AtrasLink')}</span>
          </span>

          <span className={styles.headerEnd}>
            <span className={styles.timestamp}>{t('SocialProofJustNow')}</span>
            <button
              type="button"
              className={styles.close}
              aria-label={t('SocialProofDismiss')}
              onClick={close}
            >
              <X size={11} />
            </button>
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.iconColumn}>
            <ToastIcon size={16} strokeWidth={2.5} />
          </div>

          <div className={styles.contentColumn}>
            <p className={styles.title}>{t(toast.titleKey)}</p>
            <Link href={toast.href(lng)} className={styles.cta}>
              {t(toast.ctaKey)}
            </Link>
          </div>
        </div>

        <div className={styles.progressTrack}>
          <span key={index} className={styles.progressFill} />
        </div>
      </div>
    </div>
  )
}
