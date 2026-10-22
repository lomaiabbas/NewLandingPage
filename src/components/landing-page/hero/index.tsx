'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { Col, Row } from 'antd';
import { Maximize2, Minimize2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import styles from './hero.module.css';
import AOS from 'aos';

/* 16:10 rather than 2:1 — the wide strip rendered the dashboard as a short band at ~0.42 scale,
   leaving its text unreadable and most of the hero empty. 1280 rather than 1440 wide so the same
   frame shows the UI ~12% larger; the demo's own breakpoints start at 1250px, so its desktop
   layout is unchanged. Keep the iframe size in hero.module.css in sync. */
const DEMO_DESIGN_WIDTH = 1280;
const DEMO_DESIGN_HEIGHT = 800;

export default function Hero({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);
  const frameRef = useRef<HTMLDivElement>(null);
  const demoWrapRef = useRef<HTMLDivElement>(null);
  const demoIframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      // the default 120px left the next section's heading hidden when it sat at the very bottom
      // of the first screen, which read as an empty band under the scroll hint
      offset: 20,
    });
  }, []);

  useEffect(() => {
    const wrap = demoWrapRef.current;
    const iframe = demoIframeRef.current;
    if (!wrap || !iframe) return;

    const applyScale = (width: number, height: number) => {
      if (isFullscreen) {
        // fit the whole demo inside the screen, then center the leftover space
        const scale = Math.min(width / DEMO_DESIGN_WIDTH, height / DEMO_DESIGN_HEIGHT);
        iframe.style.transform = `scale(${scale})`;
        iframe.style.left = `${(width - DEMO_DESIGN_WIDTH * scale) / 2}px`;
        iframe.style.top = `${(height - DEMO_DESIGN_HEIGHT * scale) / 2}px`;
        wrap.style.height = '';
        return;
      }

      // the whole dashboard is shown at every width — on phones it is small, and the
      // fullscreen button is there for a closer look
      const scale = width / DEMO_DESIGN_WIDTH;
      iframe.style.transform = `scale(${scale})`;
      iframe.style.left = '0px';
      iframe.style.top = '0px';
      wrap.style.height = `${DEMO_DESIGN_HEIGHT * scale}px`;
    };

    const rect = wrap.getBoundingClientRect();
    applyScale(rect.width, rect.height);

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box?.width) applyScale(box.width, box.height);
    });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [isFullscreen]);

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    };
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, []);

  // iPhone Safari has no Fullscreen API for anything but <video>, so there the frame is
  // pinned over the page with CSS instead; the body class lifts the hero above the navbar
  const isNativeFullscreen = () =>
    !!(document.fullscreenElement || (document as any).webkitFullscreenElement);

  useEffect(() => {
    if (!isFullscreen || isNativeFullscreen()) return;
    document.body.classList.add('demo-pseudo-fullscreen');
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.classList.remove('demo-pseudo-fullscreen');
      document.removeEventListener('keydown', handleKey);
    };
  }, [isFullscreen]);

  const handleFullscreen = () => {
    const frame = frameRef.current as any;
    if (!frame) return;

    if (isNativeFullscreen()) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
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
    if (canFullscreen && frame.requestFullscreen) {
      frame.requestFullscreen().catch(() => setIsFullscreen(true));
    } else if (canFullscreen && frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    } else {
      setIsFullscreen(true);
    }
  };

  return (
    <div className={styles.hero} id="hero">
      <div className="container">
        <Row align="middle" justify="space-between" gutter={[32, 48]}>
          <Col xs={24} lg={10} className={`min-w-0 ${styles.copyCol}`}>
            <div className={`${styles.heroContent} gap-3 flex flex-col`}>
              <h1 className={`${styles.heroTitle} text-white font-extrabold`}>
                <span className={styles.heroHighlight}>{t("HeroTitle1")}</span>
                {t("HeroTitle2")}
                {t("HeroTitle3")}
              </h1>
              <p className={`${styles.heroDesc} text-base leading-relaxed text-white text-pretty`}>
                {t("HeroDesc1")}{t("HeroDesc2")}{t("HeroDesc3")}</p>
            </div>
          </Col>
          <Col xs={24} lg={14} className={`relative z-10 min-w-0 ${styles.demoCol}`}>
            <div className={styles.demoMockup} data-aos="fade-up" data-aos-delay="300">
              <div className={styles.demoBlob} aria-hidden="true"></div>
              <div ref={frameRef} className={`${styles.demoFrame} ${isFullscreen ? styles.demoFrameFullscreen : ''}`}>
                <div ref={demoWrapRef} className={styles.demoIframeWrap}>
                  <iframe
                    ref={demoIframeRef}
                    className={styles.demoIframe}
                    src="/dashboard-demo/index.html?demo=1"
                    title={t("HeroDemoVideoAlt")}
                    loading="lazy"
                  />
                </div>

                <button
                  type="button"
                  className={styles.fullscreenBtn}
                  onClick={handleFullscreen}
                  aria-label={t(isFullscreen ? "HeroDemoVideoExitFullscreen" : "HeroDemoVideoFullscreen")}
                  title={t(isFullscreen ? "HeroDemoVideoExitFullscreen" : "HeroDemoVideoFullscreen")}
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.mouse} id="scroll-hint"></div>
    </div>
  );
}
