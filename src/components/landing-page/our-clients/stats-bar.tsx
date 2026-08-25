import { Briefcase, Clock, MailCheck, MessageCircle } from 'lucide-react'
import styles from './stats-bar.module.css'

interface StatsBarProps {
  clientCount: number
  t: (key: string) => string
}

export default function StatsBar({ clientCount, t }: StatsBarProps) {
  return (
    <div className="container">
      <div className={styles.grid}>
        <div
          className={`${styles.card} ${styles.white}`}
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className={styles.content}>
            <span className={`${styles.numberXl} ${styles.numberOnWhite}`} dir="ltr">
              +50K
            </span>
            <span className={`${styles.labelPrimary} ${styles.labelOnWhite}`}>
              {t('MessageOurClient')}
            </span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColLg} ${styles.iconColWhite}`}>
            <MailCheck strokeWidth={1} className={`${styles.iconWhite} ${styles.iconSvgXl}`} />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.glass}`}
          data-aos="fade-up"
          data-aos-delay="580"
        >
          <div className={styles.content}>
            <span className={styles.numberLg} dir="ltr">
              +15K
            </span>
            <span className={styles.labelPrimary}>{t('ConversationsClientslandingpag')}</span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColLg} ${styles.iconColGlass}`}>
            <MessageCircle
              strokeWidth={1.05}
              className={`${styles.iconGlass} ${styles.iconSvgLg}`}
            />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.glass}`}
          data-aos="fade-up"
          data-aos-delay="660"
        >
          <div className={styles.content}>
            <span className={`${styles.numberSm} ${styles.numberOnGlass}`} dir="ltr">
              {clientCount}+
            </span>
            <span className={`${styles.labelSm} ${styles.labelOnGlass}`}>
              {t('ActiveCompanies')}
            </span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColSm} ${styles.iconColGlass}`}>
            <Briefcase strokeWidth={1.1} className={`${styles.iconGlass} ${styles.iconSvgSm}`} />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.glass}`}
          data-aos="fade-up"
          data-aos-delay="740"
        >
          <div className={styles.content}>
            <span className={`${styles.numberSm} ${styles.numberOnGlass}`} dir="ltr">
              24/7
            </span>
            <span className={`${styles.labelSm} ${styles.labelOnGlass}`}>{t('Support')}</span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColSm} ${styles.iconColGlass}`}>
            <Clock strokeWidth={1.1} className={`${styles.iconGlass} ${styles.iconSvgSm}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
