'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getClientTranslation } from '@/app/i18n/client';
import { ArrowRight, Check, Maximize2, Minimize2 } from 'lucide-react';
import styles from './why-us.module.css';
import { WHY_US_TABS, WHY_US_STEP_MS } from './why-us.data';

export default function WhyUs({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);

  const [tabIndex, setTabIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const [fillHeight, setFillHeight] = useState(0);

  const [bg, setBg] = useState<{ a: string | null; b: string | null; showA: boolean }>({
    a: null,
    b: null,
    showA: true,
  });

  const stepsRef = useRef<HTMLDivElement | null>(null);
  const numRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastImgRef = useRef<string | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const tab = WHY_US_TABS[tabIndex];
  const steps = tab.steps;
  const currentStep = steps[stepIndex];
  const hasImage = Boolean(currentStep?.img);

  useEffect(() => {
    const isLastStep = stepIndex >= steps.length - 1;

    const timer = setTimeout(() => {
      if (isLastStep) {
        setTabIndex((i) => (i + 1) % WHY_US_TABS.length);
        setStepIndex(0);
      } else {
        setStepIndex((s) => s + 1);
      }
    }, WHY_US_STEP_MS);

    return () => clearTimeout(timer);
  }, [tabIndex, stepIndex, steps.length]);

  useEffect(() => {
    const url = currentStep?.img || null;
    if (url === lastImgRef.current) return;
    lastImgRef.current = url;

    setBg((prev) =>
      prev.showA ? { ...prev, b: url, showA: false } : { ...prev, a: url, showA: true },
    );
  }, [currentStep]);

  useLayoutEffect(() => {
    const container = stepsRef.current;
    const numEl = numRefs.current[stepIndex];
    if (!container || !numEl) return;

    const containerTop = container.getBoundingClientRect().top;
    const numRect = numEl.getBoundingClientRect();
    setFillHeight(numRect.top - containerTop + numRect.height / 2 - 6);
  }, [tabIndex, stepIndex]);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(document.fullscreenElement === stageRef.current);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  useEffect(() => {
    const container = tabsRef.current;
    const btn = tabBtnRefs.current[tabIndex];
    if (!container || !btn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const offset = btnRect.left - containerRect.left - (containerRect.width - btnRect.width) / 2;
    container.scrollBy({ left: offset, behavior: 'smooth' });
  }, [tabIndex]);

  function selectTab(index: number) {
    setTabIndex(index);
    setStepIndex(0);
  }

  function selectStep(index: number) {
    setStepIndex(index);
  }

  function toggleFullscreen() {
    const el = stageRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  }

  const tabDuration = `${(steps.length * WHY_US_STEP_MS) / 1000}s`;

  return (
    <div className={`position-relative pt-[96px] pb-16 md:pt-[128px] md:pb-24 ${styles.bandSection}`} id="why-us">
      <div className="container">
        <div>
          <div>
            <div className={styles.titleArea}>
              <span className={styles.subTitle} data-aos="fade-up">
                {t('WhyChooseAtrasLink')}
              </span>
              <h2 className={styles.secTitle} data-aos="fade-up" data-aos-delay="200">
                {t('AddedValueWithAtrasLink')}
              </h2>
            </div>
          </div>
        </div>

        <div
          className={`${styles.stage} ${isFullscreen ? styles.fullscreen : ''}`}
          data-aos="fade-up"
          data-aos-delay="200"
          ref={stageRef}
        >
          <div
            className={`${styles.bgImg} ${bg.showA ? styles.show : ''}`}
            style={bg.a ? { backgroundImage: `url('${bg.a}')` } : undefined}
          />
          <div
            className={`${styles.bgImg} ${!bg.showA ? styles.show : ''}`}
            style={bg.b ? { backgroundImage: `url('${bg.b}')` } : undefined}
          />
          <div className={`${styles.bgTint} ${hasImage ? '' : styles.bgTintSolid}`} />

          <button
            type="button"
            className={styles.fullscreenBtn}
            onClick={toggleFullscreen}
            aria-label={t(isFullscreen ? 'ExitFullscreen' : 'ViewFullscreen')}
            title={t(isFullscreen ? 'ExitFullscreen' : 'ViewFullscreen')}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <div className={styles.tabs} role="tablist" aria-label={t('AddedValueWithAtrasLink')} ref={tabsRef}>
            {WHY_US_TABS.map((tabItem, i) => {
              const isActive = i === tabIndex;
              return (
                <button
                  key={tabItem.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`why-us-panel-${tabItem.id}`}
                  className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
                  onClick={() => selectTab(i)}
                  ref={(el) => {
                    tabBtnRefs.current[i] = el;
                  }}
                >
                  <span className={styles.tabArrow}>
                    <ArrowRight size={14} />
                  </span>{' '}
                  {t(tabItem.labelKey)}
                  {isActive && (
                    <span
                      key={tabIndex}
                      className={styles.tabProgress}
                      style={{ '--dur': tabDuration } as CSSProperties}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className={styles.body}>
            <div
              className={styles.panel}
              id={`why-us-panel-${tab.id}`}
              role="tabpanel"
              aria-label={t(tab.labelKey)}
            >
              <div className={styles.steps} ref={stepsRef}>
                <div className={styles.stepsFill} style={{ height: fillHeight }} />

                {steps.map((step, i) => (
                  <div
                    key={step.titleKey}
                    className={[
                      styles.step,
                      i === stepIndex ? styles.stepActive : '',
                      i < stepIndex ? styles.stepDone : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="button"
                    tabIndex={0}
                    aria-current={i === stepIndex}
                    onClick={() => selectStep(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectStep(i);
                      }
                    }}
                  >
                    <div
                      className={styles.stepNum}
                      ref={(el) => {
                        numRefs.current[i] = el;
                      }}
                    >
                      {i < stepIndex ? (
                        <span className={styles.stepCheck}>
                          <Check size={16} strokeWidth={3} />
                        </span>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <h4>{t(step.titleKey)}</h4>
                    {step.bodyKey && <p>{t(step.bodyKey)}</p>}
                    {step.tagKeys && (
                      <div className={styles.tags}>
                        {step.tagKeys.map((tagKey) => (
                          <span key={tagKey} className={styles.tag}>
                            {t(tagKey)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
