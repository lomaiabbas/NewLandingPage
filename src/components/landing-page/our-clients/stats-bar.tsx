'use client'

import { Fragment, useState, type SVGProps } from 'react'
import styles from './stats-bar.module.css'

interface StatsBarProps {
  clientCount: number
  labels: {
    support: string
    companies: string
    conversations: string
    messages: string
  }
}

type Variant = 'a' | 'b'

const VARIANTS: { id: Variant; label: string }[] = [
  { id: 'a', label: '1a' },
  { id: 'b', label: '1b' },
]

type IconKind = 'clock' | 'briefcase' | 'chat' | 'envelope'

function StatIcon({ kind, color, ...props }: SVGProps<SVGSVGElement> & { kind: IconKind; color: string }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1.8 }
  switch (kind) {
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" {...common} {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" strokeLinecap="round" />
        </svg>
      )
    case 'briefcase':
      return (
        <svg viewBox="0 0 24 24" {...common} {...props}>
          <rect x="3.5" y="8" width="17" height="11" rx="2" />
          <path d="M8.5 8V6.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V8" strokeLinecap="round" />
        </svg>
      )
    case 'chat':
      return (
        <svg viewBox="0 0 24 24" {...common} {...props}>
          <path d="M4 6h16v10H9l-3.5 3V16H4z" strokeLinejoin="round" />
          <circle cx="9" cy="11" r=".6" fill={color} stroke="none" />
          <circle cx="12" cy="11" r=".6" fill={color} stroke="none" />
          <circle cx="15" cy="11" r=".6" fill={color} stroke="none" />
        </svg>
      )
    case 'envelope':
      return (
        <svg viewBox="0 0 24 24" {...common} {...props}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

export default function StatsBar({ clientCount, labels }: StatsBarProps) {
  const [variant, setVariant] = useState<Variant>('a')

  const stats: { icon: IconKind; value: string; label: string }[] = [
    { icon: 'clock', value: '24/7', label: labels.support },
    { icon: 'briefcase', value: `+${clientCount}`, label: labels.companies },
    { icon: 'chat', value: '+15K', label: labels.conversations },
    { icon: 'envelope', value: '+50K', label: labels.messages },
  ]

  return (
    <div className="container">
      <div className={styles.switcher} role="tablist" aria-label="Stats style">
        {VARIANTS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={variant === id}
            className={`${styles.switchBtn} ${variant === id ? styles.switchBtnActive : ''}`}
            onClick={() => setVariant(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {variant === 'a' && (
        <div className={styles.panelA} data-aos="fade-up" data-aos-delay="450">
          {stats.map(({ icon, value, label }, idx) => (
            <Fragment key={idx}>
              {idx > 0 && <span className={styles.dividerA} aria-hidden="true" />}
              <div className={styles.itemA}>
                <span className={styles.iconWrapA}>
                  <StatIcon kind={icon} color="#fff" className={styles.iconSvgA} />
                </span>
                <span className={styles.numberA} dir="ltr">
                  {value}
                </span>
                <span className={styles.labelA}>{label}</span>
              </div>
            </Fragment>
          ))}
        </div>
      )}

      {variant === 'b' && (
        <div className={styles.panelB} data-aos="fade-up" data-aos-delay="450">
          {stats.map(({ icon, value, label }, idx) => (
            <div key={idx} className={styles.itemB}>
              <StatIcon kind={icon} color="#f5f3ec" className={styles.iconSvgB} />
              <span className={styles.numberB} dir="ltr">
                {value}
              </span>
              <span className={styles.labelB}>{label}</span>
              <span className={styles.underlineB} aria-hidden="true" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
