'use client'

import { Fragment } from 'react'
import styles from './stats-bar.module.css'

interface StatsBarProps {
  labels: {
    support: string
    companies: string
    conversations: string
    messages: string
  }
}

export default function StatsBar({ labels }: StatsBarProps) {
  const stats: { value: string; label: string }[] = [
    { value: '24/7', label: labels.support },
    { value: '+11', label: labels.companies },
    { value: '+100K', label: labels.conversations },
    { value: '+500K', label: labels.messages },
  ]

  return (
    <div className="container">
      <div className={styles.panelA} data-aos="fade-up" data-aos-delay="450">
        {stats.map(({ value, label }, idx) => (
          <Fragment key={idx}>
            {idx > 0 && <span className={styles.dividerA} aria-hidden="true" />}
            <div className={styles.itemA}>
              <span className={styles.numberA} dir="ltr">
                {value}
              </span>
              <span className={styles.labelA}>{label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
