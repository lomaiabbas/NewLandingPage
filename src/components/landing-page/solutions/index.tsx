'use client';

import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Package, ScanLine, ShoppingBag, Ticket } from 'lucide-react';
import { getClientTranslation } from '@/app/i18n/client';
import styles from './solutions.module.css';
import { SOLUTIONS, type SolutionId } from './solutions.data';

type T = ReturnType<typeof getClientTranslation>['t'];

/* A carousel of solutions, one card at a time: arrows, dots and swipe. Each card puts its copy
   beside an illustration drawn in markup (sample data, not real screenshots), alternating sides on
   desktop. */
export default function Solutions({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);
  const rtl = lng === 'ar';
  const count = SOLUTIONS.length;
  const [idx, setIdx] = useState(0);
  const go = (n: number) => setIdx(((n % count) + count) % count);

  const swipeStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    swipeStart.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = swipeStart.current;
    const x = e.changedTouches[0]?.clientX;
    swipeStart.current = null;
    if (start === null || x === undefined) return;
    const dx = x - start;
    if (Math.abs(dx) < 40) return;
    // swiping towards the reading direction's end brings in the next card
    go((rtl ? dx > 0 : dx < 0) ? idx + 1 : idx - 1);
  };

  const NextIcon = rtl ? ArrowLeft : ArrowRight;
  const PrevIcon = rtl ? ArrowRight : ArrowLeft;

  return (
    <section className={styles.section} id="solutions">
      <div className="container">
        <div className={styles.head} data-aos="fade-up">
          <span className={styles.eyebrow}>{t('Solutions')}</span>
          <h2 className={styles.title}>{t('SolutionsTitle')}</h2>
          <p className={styles.subtitle}>{t('SolutionsSubtitle')}</p>
        </div>

        <div role="region" aria-roledescription="carousel" aria-label={t('SolutionsTitle')} data-aos="fade-up">
          <div className={styles.viewport} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {/* the cards run in the reading direction, so in Arabic the track moves the other way */}
            <div className={styles.track} style={{ transform: `translateX(${rtl ? idx * 100 : -idx * 100}%)` }}>
              {SOLUTIONS.map((s, i) => (
                <article key={s.id} className={styles.card} aria-hidden={i !== idx}>
                  <div className={styles.cardGrid}>
                    <div className={i % 2 ? styles.copyFlipped : undefined}>
                      <span className={styles.num} dir="ltr">
                        0{i + 1}
                      </span>
                      <h3 className={styles.cardTitle}>{t(s.titleKey)}</h3>
                      <p className={styles.cardDesc}>{t(s.descKey)}</p>
                      <ul className={styles.points}>
                        {s.pointKeys.map((key) => (
                          <li key={key}>{t(key)}</li>
                        ))}
                      </ul>
                      {s.badgeKey && (
                        <span className={styles.badge}>
                          <ShoppingBag size={14} />
                          {t(s.badgeKey)}
                        </span>
                      )}
                    </div>
                    <div className={styles.visualWrap}>
                      <SolutionVisual id={s.id} t={t} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.controls}>
            <button type="button" className={styles.navBtn} aria-label="Previous" onClick={() => go(idx - 1)}>
              <PrevIcon size={20} />
            </button>
            <div className={styles.dots} role="tablist" aria-label={t('SolutionsTitle')}>
              {SOLUTIONS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === idx}
                  aria-label={`${i + 1} / ${count}`}
                  onClick={() => go(i)}
                  className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                />
              ))}
            </div>
            <button type="button" className={styles.navBtn} aria-label="Next" onClick={() => go(idx + 1)}>
              <NextIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ v, l, pct }: { v: string; l: string; pct: number }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statTop}>
        <span className={styles.statValue}>{v}</span>
        <span className={styles.statPct}>{pct}%</span>
      </div>
      <div className={styles.statLabel}>{l}</div>
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SolutionVisual({ id, t }: { id: SolutionId; t: T }) {
  if (id === 'events') {
    return (
      <div className={styles.visEvents}>
        <div className={styles.ticketCard}>
          <div className={styles.ticketLabel}>{t('SolMockReserved')}</div>
          <div className={styles.ticketCount} dir="ltr">
            478<span> / 590</span>
          </div>
          <div className={styles.bar}>
            <div className={styles.barFill} style={{ width: '80%' }} />
          </div>
        </div>
        <div className={styles.scanTile}>
          <ScanLine size={48} className={styles.scanIcon} />
          <div className={styles.scanText}>{t('SolMockVerified')}</div>
          <div className={styles.scanGate}>{t('SolMockGate1')}</div>
        </div>
        <div className={styles.ticketList}>
          {[
            ['SolMockTicketGeneral', 80],
            ['SolMockTicketVip', 14],
          ].map(([key, left]) => (
            <div key={key} className={styles.ticketRow}>
              <span className={styles.ticketName}>
                <Ticket size={14} />
                {t(key as string)}
              </span>
              <span className={styles.muted}>
                {t('SolMockRemaining')}: {left}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (id === 'campaigns') {
    return (
      <div className={styles.visCampaigns}>
        <div className={styles.offerCard}>
          <div className={styles.offerHead}>
            <span className={styles.offerAvatar}>A</span>
            <div className={styles.offerSender}>
              <b>{t('SolMockChannelName')}</b>
              <div className={styles.offerSub}>{t('SolMockVerifiedChannel')}</div>
            </div>
            <span className={styles.offerSub}>10:24</span>
          </div>
          <div className={styles.offerBanner}>
            <span className={styles.offerTag}>{t('SolMockLimitedOffer')}</span>
            <span className={styles.offerOff}>
              25% {t('SolMockOff')}
            </span>
          </div>
          <p className={styles.muted}>{t('SolMockOfferFull')}</p>
          <div className={styles.offerCta}>{t('SolMockShopNow')}</div>
          <div className={styles.offerFoot}>
            <Check size={12} className={styles.orderCheck} />
            {t('SolMockTemplateSent')}
          </div>
        </div>
        <div className={styles.visCampaignsStats}>
          <Stat v="812" l={t('SolMockDelivered')} pct={99} />
          <Stat v="634" l={t('SolMockRead')} pct={78} />
          <Stat v="141" l={t('SolMockReplies')} pct={17} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.visStores}>
      <div className={styles.bubbleIn}>{t('SolMockStoreQuestion')}</div>
      <div className={styles.bubbleOut}>{t('SolMockStoreAnswer')}</div>
      <div className={styles.orderCard}>
        <span className={styles.orderIcon}>
          <Package size={16} />
        </span>
        <div>
          <b className={styles.orderTitle}>
            {t('SolMockOrderConfirmed')}
            <Check size={14} className={styles.orderCheck} />
          </b>
          <div className={styles.orderSub}>{t('SolMockOrderNotify')}</div>
        </div>
      </div>
      <div className={styles.assigned}>
        <ShoppingBag size={14} />
        {t('SolMockAssignedCare')}
      </div>
    </div>
  );
}
