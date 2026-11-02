'use client';

import React from 'react';
import { BadgeCheck, Puzzle, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { getClientTranslation } from '@/app/i18n/client';
import styles from './why-us.module.css';

const ITEMS = [
  { icon: ShieldCheck, titleKey: 'WhyItem1Title', descKey: 'WhyItem1Desc' },
  { icon: Users, titleKey: 'WhyItem2Title', descKey: 'WhyItem2Desc' },
  { icon: Puzzle, titleKey: 'WhyItem3Title', descKey: 'WhyItem3Desc' },
  { icon: Sparkles, titleKey: 'WhyItem4Title', descKey: 'WhyItem4Desc' },
  { icon: BadgeCheck, titleKey: 'WhyItem5Title', descKey: 'WhyItem5Desc' },
];

/* The leader's "Why AtrasLink?" section, carried over as is: five centred cards, an icon circle
   that fills with the brand green on hover. */
export default function WhyUs({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);

  return (
    <section className={styles.section} id="why">
      <div className="container">
        <div className={styles.head} data-aos="fade-up">
          <span className={styles.eyebrow}>{t('WhyEyebrow')}</span>
          <h2 className={styles.title}>{t('WhyTitle')}</h2>
          <p className={styles.subtitle}>{t('WhySubtitle')}</p>
        </div>
        <div className={styles.grid}>
          {ITEMS.map(({ icon: Icon, titleKey, descKey }, i) => (
            <div key={titleKey} className={styles.card} data-aos="fade-up" data-aos-delay={i * 60}>
              <span className={styles.icon}>
                <Icon size={20} />
              </span>
              <h3 className={styles.cardTitle}>{t(titleKey)}</h3>
              <p className={styles.cardDesc}>{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
