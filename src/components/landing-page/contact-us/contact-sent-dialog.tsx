'use client'

import { Check, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './contact-us.module.css'

type Props = {
  title: string
  message: string
  closeLabel: string
  onClose: () => void
}

export default function ContactSentDialog({ title, message, closeLabel, onClose }: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    buttonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      opener?.focus()
    }
  }, [onClose])

  return createPortal(
    <div
      className={styles.sentOverlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={styles.sentPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-sent-title"
      >
        <button
          ref={buttonRef}
          type="button"
          className={styles.sentClose}
          aria-label={closeLabel}
          onClick={onClose}
        >
          <X size={18} aria-hidden />
        </button>
        <span className={styles.sentIcon} aria-hidden>
          <Check size={30} strokeWidth={3} />
        </span>
        <h3 id="contact-sent-title" className={styles.sentTitle}>
          {title}
        </h3>
        <p className={styles.sentText}>{message}</p>
      </div>
    </div>,
    document.body
  )
}
