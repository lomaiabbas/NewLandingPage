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
          className={`${styles.card} ${styles.cardA} ${styles.glass}`}
          data-aos="fade-up"
          data-aos-delay="500"
        >
          <div className={styles.content}>
            <span className={styles.numberHero} dir="ltr">
              +50K
            </span>
            <span className={styles.labelPrimary}>{t('MessageOurClient')}</span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColLg} ${styles.iconColGlass}`}>
            <MailCheck strokeWidth={1} className={`${styles.iconGlass} ${styles.iconSvgHero}`} />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.cardB} ${styles.glass}`}
          data-aos="fade-up"
          data-aos-delay="580"
        >
          <div className={styles.content}>
            <span className={styles.numberB} dir="ltr">
              +15K
            </span>
            <span className={styles.labelPrimary}>{t('ConversationsClientslandingpag')}</span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColLg} ${styles.iconColGlass}`}>
            <MessageCircle
              strokeWidth={1.05}
              className={`${styles.iconGlass} ${styles.iconSvgB}`}
            />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.cardC} ${styles.white}`}
          data-aos="fade-up"
          data-aos-delay="660"
        >
          <div className={styles.content}>
            <span className={`${styles.numberSm} ${styles.numberOnWhite}`} dir="ltr">
              {clientCount}+
            </span>
            <span className={`${styles.labelSm} ${styles.labelOnWhite}`}>
              {t('ActiveCompanies')}
            </span>
          </div>
          <div className={`${styles.iconCol} ${styles.iconColSm} ${styles.iconColWhite}`}>
            <Briefcase strokeWidth={1.1} className={`${styles.iconWhite} ${styles.iconSvgSm}`} />
          </div>
        </div>

        <div
          className={`${styles.card} ${styles.cardD} ${styles.glass}`}
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
