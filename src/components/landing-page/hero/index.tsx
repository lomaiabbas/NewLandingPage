'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { Col, Row } from 'antd';
import { Maximize2, Minimize2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import styles from './hero.module.css';
import AOS from 'aos';

const DEMO_DESIGN_WIDTH = 1600;
const DEMO_DESIGN_HEIGHT = 800;
/* Fitting all 1600px into a phone leaves the dashboard at ~0.22 scale — an unreadable smudge.
   Below this width we zoom into the top-start corner instead and crop to a 4:3-ish window. */
const DEMO_CROP_MAX_WIDTH = 768;
const DEMO_CROP_VIEWPORT = 900;
const DEMO_CROP_RATIO = 0.78;

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

      // narrow screens: map a 900px slice of the design onto the frame so type stays legible,
      // and crop the height rather than letter-boxing the rest of the dashboard
      const isCropped = window.innerWidth <= DEMO_CROP_MAX_WIDTH;
      const sourceWidth = isCropped ? DEMO_CROP_VIEWPORT : DEMO_DESIGN_WIDTH;
      const scale = width / sourceWidth;

      // in RTL the dashboard chrome lives on the right, so anchor the crop to that edge instead
      const isRtl = document.documentElement.dir === 'rtl';
      const offsetX = isCropped && isRtl ? -(DEMO_DESIGN_WIDTH - sourceWidth) * scale : 0;

      iframe.style.transform = `scale(${scale})`;
      iframe.style.left = `${offsetX}px`;
      iframe.style.top = '0px';
      wrap.style.height = isCropped
        ? `${width * DEMO_CROP_RATIO}px`
        : `${DEMO_DESIGN_HEIGHT * scale}px`;
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

  const handleFullscreen = () => {
    const frame = frameRef.current as any;
    if (!frame) return;

    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      return;
    }

    if (frame.requestFullscreen) {
      frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    }
  };

  return (
    <div className={styles.hero} id="hero">
      <div className="container">
        <Row align="middle" justify="space-between" gutter={[32, 48]}>
          <Col xs={24} lg={10} className='min-w-0'>
            <div className={`${styles.heroContent} gap-5 flex flex-col`}>
              <h1 className={`${styles.heroTitle} text-white font-extrabold`}>
                <span className={styles.heroHighlight}>{t("HeroTitle1")}</span>
                {t("HeroTitle2")}
                {t("HeroTitle3")}
              </h1>
              <p className={`${styles.heroDesc} text-base leading-relaxed text-white text-pretty`}>
                {t("HeroDesc1")}{t("HeroDesc2")}{t("HeroDesc3")}</p>
            </div>
          </Col>
          <Col xs={24} lg={14} className='relative z-10 min-w-0'>
            <div className={styles.demoMockup} data-aos="fade-up" data-aos-delay="300">
              <div className={styles.floorShadow} aria-hidden="true"></div>
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
