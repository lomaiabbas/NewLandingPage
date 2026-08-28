'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { Col, Row } from 'antd';
import { Maximize2, Minimize2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import styles from './hero.module.css';
import AOS from 'aos';

export default function Hero({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
    });
  }, []);

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
    const video = videoRef.current as any;
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
    } else if (video?.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (video?.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div className={styles.hero} id="hero">
      <div className="container">
        <Row align="middle" justify="space-between" gutter={[32, 48]}>
          <Col xs={24} lg={9} className='min-w-0'>
            <div className={`${styles.heroContent} gap-4 flex flex-col text-center`}>
              <h1 className="text-white text-[clamp(2.1rem,4vw+1rem,3.5rem)] font-extrabold leading-[1.15] tracking-tight mb-6 lg:mb-0 text-pretty">
                <span className="text-primary">{t("HeroTitle1")}</span>
                {t("HeroTitle2")}
                {t("HeroTitle3")}
              </h1>
              <p className="text-base leading-relaxed text-white max-w-full sm:max-w-[500px] text-pretty">
                {t("HeroDesc1")}{t("HeroDesc2")}{t("HeroDesc3")}</p>
            </div>
          </Col>
          <Col xs={24} lg={15} className='relative z-10 min-w-0'>
            <div className={styles.demoMockup} data-aos="fade-up" data-aos-delay="300">
              <div className={styles.floorShadow} aria-hidden="true"></div>
              <div ref={frameRef} className={`${styles.demoFrame} ${isFullscreen ? styles.demoFrameFullscreen : ''}`}>
                <video
                  ref={videoRef}
                  className={styles.demoVideo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster="/images/hero-demo-poster.jpg"
                  aria-label={t("HeroDemoVideoAlt")}
                >
                  <source src="/videos/atraslink-demo.webm" type="video/webm" />
                  <source src="/videos/atraslink-demo.mp4" type="video/mp4" />
                </video>
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
