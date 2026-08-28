import { Briefcase, Clock, MailCheck, MessageCircle } from 'lucide-react'
import styles from './stats-bar.module.css'

interface StatsBarProps {
  clientCount: number
  t: (key: string) => string
}

export default function StatsBar({ clientCount, t }: StatsBarProps) {
  const stats = [
    { icon: Clock, value: '24/7', label: t('Support') },
    { icon: Briefcase, value: `+${clientCount}`, label: t('ActiveCompanies') },
    { icon: MessageCircle, value: '+15K', label: t('ConversationsClientslandingpag') },
    { icon: MailCheck, value: '+50K', label: t('MessageOurClient') },
  ]

  return (
    <div className="container">
      <div className={styles.row}>
        {stats.map(({ icon: Icon, value, label }, idx) => (
          <div
            key={idx}
            className={styles.card}
            data-aos="fade-up"
            data-aos-delay={500 + idx * 80}
          >
            <span className={styles.iconBadge}>
              <Icon strokeWidth={2} className={styles.icon} />
            </span>
            <span className={styles.number} dir="ltr">
              {value}
            </span>
            <span className={styles.label}>{label}</span>
            <span className={styles.underline} aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}
