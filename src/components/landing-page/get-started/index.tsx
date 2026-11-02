'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { getClientTranslation } from '@/app/i18n/client'
import styles from './get-started.module.css'

const STEPS = [
  { titleKey: 'GetStartedStep1Title', bodyKey: 'GetStartedStep1Desc' },
  { titleKey: 'GetStartedStep2Title', bodyKey: 'GetStartedStep2Desc' },
  { titleKey: 'GetStartedStep3Title', bodyKey: 'GetStartedStep3Desc' },
] as const

const DRAWERS = [
  { titleKey: 'AboutUs', bodyKey: 'GetStartedAboutText' },
  { titleKey: 'OurVision', bodyKey: 'GetStartedVisionText' },
  { titleKey: 'OurMission', bodyKey: 'GetStartedMissionText' },
] as const

export default function GetStarted({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const [openDrawer, setOpenDrawer] = useState(0)

  return (
    <section className={styles.section} id="get-started">
      <div className="container">
        <div className={styles.head} data-aos="fade-up">
          <span className={styles.eyebrow}>{t('GetStartedEyebrow')}</span>
          <h2 className={styles.title}>{t('GetStartedTitle')}</h2>
        </div>

        <div className={styles.grid} data-aos="fade-up" data-aos-delay="200">
          <ol className={styles.steps}>
            {STEPS.map((step, i) => (
              <li key={step.titleKey} className={styles.step}>
                {i < STEPS.length - 1 && <span className={styles.line} aria-hidden />}
                <span className={styles.stepNum}>{i + 1}</span>
                <div className={styles.stepText}>
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.bodyKey)}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* the About / Vision / Mission drawers stand in for the old About section, so the
              navbar's "About us" link lands here */}
          <div id="about" className={styles.drawers}>
            {DRAWERS.map((d, i) => {
              const isOpen = openDrawer === i
              return (
                <div key={d.titleKey} className={styles.drawer}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDrawer(isOpen ? -1 : i)}
                    className={styles.drawerBtn}
                  >
                    <span>{t(d.titleKey)}</span>
                    <ChevronDown className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
                  </button>
                  {isOpen && (
                    <div className={styles.drawerBody}>
                      <p>{t(d.bodyKey)}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
