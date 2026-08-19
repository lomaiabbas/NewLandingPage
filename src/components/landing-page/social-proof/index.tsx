'use client'

import { getClientTranslation } from '@/app/i18n/client'
import AtrasLinkLogo from '@/lib/icons/logo'
import { X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  SOCIAL_PROOF_INITIAL_DELAY_MS,
  SOCIAL_PROOF_INTERVAL_MS,
  SOCIAL_PROOF_TOASTS,
} from './social-proof.data'
import styles from './social-proof.module.css'

export default function SocialProof({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [visible, setVisible] = useState(false)
  const [index, setIndex] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => setVisible(true), SOCIAL_PROOF_INITIAL_DELAY_MS)
    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (!visible || dismissed) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SOCIAL_PROOF_TOASTS.length)
    }, SOCIAL_PROOF_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [visible, dismissed])

  if (dismissed) return null

  const toast = SOCIAL_PROOF_TOASTS[index]

  return (
    <div
      className={`${styles.wrap} ${visible ? styles.show : ''}`}
      role="status"
      aria-live="polite"
    >
      <div key={toast.id} className={styles.toast}>
        <div className={styles.accent}>
          <span className={styles.logoBadge}>
            <AtrasLinkLogo XL />
          </span>
        </div>

        <div className={styles.panel}>
          <button
            type="button"
            className={styles.close}
            aria-label={t('SocialProofDismiss')}
            onClick={() => setDismissed(true)}
          >
            <X size={12} />
          </button>

          <p className={styles.title}>{t(toast.titleKey)}</p>
          <Link href={toast.href(lng)} className={styles.cta}>
            {t(toast.ctaKey)}
          </Link>
        </div>

        <div className={styles.progressTrack}>
          <span key={index} className={styles.progressFill} />
        </div>
      </div>
    </div>
  )
}
