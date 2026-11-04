'use client';

import React from 'react';
import { Check, Clock, MessageSquareText, MessagesSquare, ShoppingBag } from 'lucide-react';
import { getClientTranslation } from '@/app/i18n/client';
import styles from './integrations.module.css';
import { InstagramGlyph, SallaGlyph, ShopifyGlyph, WhatsAppGlyph, ZidGlyph } from './brand-icons';

type CardStyle = 'hero' | 'instagram' | 'salla' | 'zid' | 'soon';
type Item = { n: string; icon: React.ReactNode; style: CardStyle };

/* "Integrations": two panels (channels, e-commerce), three cards each; the live ones in their brand
   colour, the upcoming ones dashed. */
export default function Integrations({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);

  const channels: Item[] = [
    { n: 'WhatsApp', icon: <WhatsAppGlyph className={styles.icon} />, style: 'hero' },
    { n: 'Instagram', icon: <InstagramGlyph mono className={styles.icon} />, style: 'instagram' },
    { n: 'SMS', icon: <MessageSquareText className={styles.icon} />, style: 'soon' },
  ];
  const stores: Item[] = [
    { n: t('IntegrationsSalla'), icon: <SallaGlyph className={styles.icon} />, style: 'salla' },
    { n: t('IntegrationsZid'), icon: <ZidGlyph className={styles.icon} />, style: 'zid' },
    { n: 'Shopify', icon: <ShopifyGlyph className={styles.icon} />, style: 'soon' },
  ];

  const card = ({ n, icon, style }: Item) => {
    const live = style !== 'soon';
    return (
      <div key={n} className={`${styles.card} ${live ? styles.live : ''} ${styles[style]}`}>
        {icon}
        <div className={styles.cardFoot}>
          <div className={styles.name} dir={/^[A-Za-z]/.test(n) ? 'ltr' : undefined}>
            {n}
          </div>
          <span className={`${styles.pill} ${live ? styles.pillLive : styles.pillSoon}`}>
            {live ? <Check className={styles.pillIcon} aria-hidden /> : <Clock className={styles.pillIcon} aria-hidden />}
            {live ? t('IntegrationsAvailable') : t('IntegrationsSoon')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className={styles.section} id="integrations">
      <div className="container">
        <div className={styles.head} data-aos="fade-up">
          <h2 className={styles.title}>{t('IntegrationsTitle')}</h2>
          <p className={styles.subtitle}>{t('IntegrationsSubtitle')}</p>
        </div>
        <div className={styles.groups} data-aos="fade-up">
          <div className={styles.panel}>
            <h3 className={styles.panelHead}>
              <MessagesSquare className={styles.panelIcon} aria-hidden />
              {t('IntegrationsChannels')}
            </h3>
            <div className={styles.cards}>{channels.map(card)}</div>
          </div>
          <div className={styles.panel}>
            <h3 className={styles.panelHead}>
              <ShoppingBag className={styles.panelIcon} aria-hidden />
              {t('IntegrationsEcommerce')}
            </h3>
            <div className={styles.cards}>{stores.map(card)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
