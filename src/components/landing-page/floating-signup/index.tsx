'use client'

import { getClientTranslation } from '@/app/i18n/client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import styles from './floating-signup.module.css'

/* Phones only (hidden by CSS from 768px up, where the navbar button is visible), in place of the
   social-proof toast, which is hidden at the same breakpoint. Same target as the navbar button. */
export default function FloatingSignup({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [collapsed, setCollapsed] = useState(false)
  const lastY = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const goingDown = y > lastY.current + 4
      const goingUp = y < lastY.current - 4
      lastY.current = y

      if (goingDown && y > 80) setCollapsed(true)
      if (goingUp) setCollapsed(false)

      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCollapsed(false), 1000)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  return (
    <Link
      href={`/${lng}?register=1`}
      aria-label={t('Register')}
      className={`${styles.fab} ${collapsed ? styles.isCollapsed : ''}`}
    >
      <span className={styles.disc}>
        <span className={styles.ripple} />
        <span className={`${styles.ripple} ${styles.ripple2}`} />
        <Image src="/images/atras-logo.png" alt="" width={40} height={36} priority />
        <span className={styles.badge} />
      </span>
      <span className={styles.bub}>
        <span className={styles.text}>
          {t('Register')}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        </span>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
      </span>
    </Link>
  )
}
