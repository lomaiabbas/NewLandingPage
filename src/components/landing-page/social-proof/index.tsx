'use client'

import { getClientTranslation } from '@/app/i18n/client'
import AtrasLinkLogo from '@/lib/icons/logo'
import { BarChart3, QrCode, Send, X } from 'lucide-react'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import {
  SOCIAL_PROOF_AUTO_HIDE_MS,
  SOCIAL_PROOF_EXIT_MS,
  SOCIAL_PROOF_HIDDEN_SECTIONS,
  SOCIAL_PROOF_INITIAL_DELAY_MS,
  SOCIAL_PROOF_SECTION_IDS,
  SOCIAL_PROOF_SECTION_TOAST,
  SOCIAL_PROOF_TOASTS,
  type SocialProofIcon,
} from './social-proof.data'
import styles from './social-proof.module.css'

const ICONS: Record<SocialProofIcon, typeof Send> = {
  send: Send,
  qrcode: QrCode,
  chart: BarChart3,
}

export default function SocialProof({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [readyToShow, setReadyToShow] = useState(false)
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null)
  const [activeToastId, setActiveToastId] = useState<string | null>(null)
  const [autoHidden, setAutoHidden] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [closing, setClosing] = useState(false)

  const isHiddenSection = currentSectionId
    ? SOCIAL_PROOF_HIDDEN_SECTIONS.includes(currentSectionId)
    : true

  const visible =
    readyToShow &&
    !isHiddenSection &&
    !dismissed &&
    !closing &&
    !autoHidden &&
    activeToastId !== null

  const close = () => {
    setClosing(true)
    setTimeout(() => setDismissed(true), SOCIAL_PROOF_EXIT_MS)
  }

  useEffect(() => {
    const startTimer = setTimeout(() => setReadyToShow(true), SOCIAL_PROOF_INITIAL_DELAY_MS)
    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    const elements = SOCIAL_PROOF_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrentSectionId(entry.target.id)
          }
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!currentSectionId || SOCIAL_PROOF_HIDDEN_SECTIONS.includes(currentSectionId)) return

    const mapped = SOCIAL_PROOF_SECTION_TOAST[currentSectionId]
    if (!mapped) return

    setActiveToastId(mapped)
    setAutoHidden(false)

    const hideTimer = setTimeout(() => setAutoHidden(true), SOCIAL_PROOF_AUTO_HIDE_MS)
    return () => clearTimeout(hideTimer)
  }, [currentSectionId])

  if (dismissed) return null

  const toast = SOCIAL_PROOF_TOASTS.find((item) => item.id === activeToastId)
  if (!toast) return null

  const ToastIcon = ICONS[toast.icon]

  return (
    <div
      className={`${styles.wrap} ${visible ? styles.show : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.toast} key={`${currentSectionId}-${activeToastId}`}>
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
          <span
            key={`${currentSectionId}-${activeToastId}`}
            className={styles.progressFill}
            style={{ '--dur': `${SOCIAL_PROOF_AUTO_HIDE_MS}ms` } as CSSProperties}
          />
        </div>
      </div>
    </div>
  )
}
