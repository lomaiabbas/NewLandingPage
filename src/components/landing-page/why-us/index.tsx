'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getClientTranslation } from '@/app/i18n/client';
import { ArrowRight, Check, Maximize2, Minimize2 } from 'lucide-react';
import styles from './why-us.module.css';
import { WHY_US_TABS, WHY_US_STEP_MS } from './why-us.data';

export default function WhyUs({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);

  const [tabIndex, setTabIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const [bg, setBg] = useState<{ a: string | null; b: string | null; showA: boolean }>({
    a: null,
    b: null,
    showA: true,
  });

  const tabsRef = useRef<HTMLDivElement | null>(null);
  const tabBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastImgRef = useRef<string | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  /* the walkthrough only advances on its own while someone could be watching it: it holds while
     the pointer is over the stage or the stage is off screen, stops for good once the visitor
     picks a step or tab themselves, and never starts for reduced-motion users */
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [userTookOver, setUserTookOver] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const isAutoplaying = !isHovered && isInView && !userTookOver && !reducedMotion;
  /* how far into the current step the walkthrough got before a pause: it resumes from there, as
     the tab's progress bar does, instead of starting the step over and falling behind the bar */
  const stepElapsedRef = useRef({ step: '', ms: 0 });

  const tab = WHY_US_TABS[tabIndex];
  const steps = tab.steps;
  const currentStep = steps[stepIndex];
  const hasImage = Boolean(currentStep?.img);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoplaying) return;
    const isLastStep = stepIndex >= steps.length - 1;

    const step = `${tabIndex}:${stepIndex}`;
    if (stepElapsedRef.current.step !== step) stepElapsedRef.current = { step, ms: 0 };
    const startedAt = performance.now();

    const timer = setTimeout(() => {
      if (isLastStep) {
        setTabIndex((i) => (i + 1) % WHY_US_TABS.length);
        setStepIndex(0);
      } else {
        setStepIndex((s) => s + 1);
      }
    }, Math.max(0, WHY_US_STEP_MS - stepElapsedRef.current.ms));

    return () => {
      clearTimeout(timer);
      stepElapsedRef.current.ms += performance.now() - startedAt;
    };
  }, [tabIndex, stepIndex, steps.length, isAutoplaying]);

  useEffect(() => {
    const url = currentStep?.img || null;
    if (url === lastImgRef.current) return;
    lastImgRef.current = url;

    setBg((prev) =>
      prev.showA ? { ...prev, b: url, showA: false } : { ...prev, a: url, showA: true },
    );
  }, [currentStep]);

  useEffect(() => {
    /* A step lasts WHY_US_STEP_MS, which is not long enough to fetch a background from scratch
       without the stage flashing, so warm the next one (and the next tab's first) ahead of time. */
    const next =
      steps[stepIndex + 1]?.img ??
      WHY_US_TABS[(tabIndex + 1) % WHY_US_TABS.length].steps[0]?.img;
    if (!next) return;

    const img = new window.Image();
    img.src = next;
  }, [tabIndex, stepIndex, steps]);

  useEffect(() => {
    const handleChange = () => {
      const element = document.fullscreenElement ?? (document as any).webkitFullscreenElement;
      setIsFullscreen(element === stageRef.current);
    };
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, []);

  // iPhone Safari has no Fullscreen API for anything but <video>, so there the stage is pinned over
  // the page with CSS instead, as the hero's demo is; the body class lifts the section above the navbar
  const isNativeFullscreen = () =>
    !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

  useEffect(() => {
    if (!isFullscreen || isNativeFullscreen()) return;
    document.body.classList.add('why-us-pseudo-fullscreen');
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('why-us-pseudo-fullscreen');
      document.removeEventListener('keydown', handleKey);
    };
  }, [isFullscreen]);

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
    setUserTookOver(true);
  }

  function selectStep(index: number) {
    setStepIndex(index);
    setUserTookOver(true);
  }

  function toggleFullscreen() {
    const el = stageRef.current as any;
    if (!el) return;

    if (isNativeFullscreen()) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      return;
    }

    if (isFullscreen) {
      setIsFullscreen(false);
      return;
    }

    const canFullscreen = document.fullscreenEnabled || (document as any).webkitFullscreenEnabled;
    if (canFullscreen && el.requestFullscreen) {
      el.requestFullscreen().catch(() => setIsFullscreen(true));
    } else if (canFullscreen && el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else {
      setIsFullscreen(true);
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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
                  {isActive && !userTookOver && !reducedMotion && (
                    <span
                      key={tabIndex}
                      className={`${styles.tabProgress} ${isAutoplaying ? '' : styles.tabProgressPaused}`}
                      style={{ '--dur': tabDuration } as CSSProperties}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className={styles.body}>
            {/* below desktop the tint has to cover the backdrop for the copy to read, so the step's
                screenshot gets its own card above the steps instead of disappearing */}
            {currentStep?.img && (
              <div className={styles.shot}>
                <img
                  key={currentStep.img}
                  src={currentStep.img}
                  alt={t(currentStep.titleKey)}
                  className={styles.shotImg}
                />
              </div>
            )}
            {/* Tabs hold different amounts of copy, so rendering only the current one made the
                stage grow when the walkthrough reached a longer tab. All of them are rendered in
                one grid cell (see .panels) with the inactive ones hidden, so the stage takes the
                longest tab's height from the start, at any width and in either language. */}
            <div className={styles.panels}>
              {WHY_US_TABS.map((tabItem, ti) => {
                const isActive = ti === tabIndex;
                // a hidden tab is laid out the way it opens, on its first step
                const current = isActive ? stepIndex : 0;
                return (
                  <div
                    key={tabItem.id}
                    className={`${styles.panel} ${isActive ? '' : styles.panelHidden}`}
                    id={`why-us-panel-${tabItem.id}`}
                    role="tabpanel"
                    aria-label={t(tabItem.labelKey)}
                  >
                    <div className={styles.steps}>
                      {tabItem.steps.map((step, i) => (
                        <div
                          key={step.titleKey}
                          className={[
                            styles.step,
                            i === current ? styles.stepActive : '',
                            i < current ? styles.stepDone : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          role="button"
                          tabIndex={0}
                          aria-current={i === current}
                          onClick={() => selectStep(i)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              selectStep(i);
                            }
                          }}
                        >
                          <div className={styles.stepNum}>
                            {i < current ? (
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
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
