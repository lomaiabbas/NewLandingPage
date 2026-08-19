'use client';

import { getClientTranslation } from '@/app/i18n/client';
import { Col, Row } from 'antd';
import React, { useEffect, useRef } from 'react'
import styles from './hero.module.css';
import Star1 from '../shared/star1';
import Star2 from '../shared/star2';
import AOS from 'aos';

export default function Hero({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration (in milliseconds)
      easing: 'ease-in-out', // Easing function
    });
  }, []);

  const handleFullscreen = () => {
    const video = videoRef.current as any;
    if (!video) return;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  };

  return (
    <div className={styles.hero} id="hero">
      <div className="container">
        <Row align="middle" justify="space-between" gutter={[32, 48]}>
          <Col xs={24} lg={10} className='min-w-0'>
            <div className={`${styles.heroStyle} gap-4 flex flex-col text-start`}>
              <h1 className="text-white text-[clamp(2.1rem,4vw+1rem,3.5rem)] font-extrabold leading-[1.15] tracking-tight mb-6 lg:mb-0" data-aos="fade-up">
                <span className="text-primary">{t("HeroTitle1")}</span>
                {t("HeroTitle2")}
                {t("HeroTitle3")}
              </h1>
              <p className="text-base leading-relaxed text-white/85 max-w-full sm:max-w-[500px]" data-aos="fade-up" data-aos-delay="400">
                {t("HeroDesc1")}{t("HeroDesc2")}{t("HeroDesc3")}</p>
            </div>
          </Col>
          <Col xs={24} lg={14} className='relative z-10 min-w-0'>
            <div className={styles.mock} data-aos="fade-up" data-aos-delay="300">
              <div className={styles.floorShadow} aria-hidden="true"></div>
              <div className={styles.demoFrame}>
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
                  aria-label={t("HeroDemoVideoFullscreen")}
                  title={t("HeroDemoVideoFullscreen")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 9V4h5M4 4l6 6M20 9V4h-5M20 4l-6 6M4 15v5h5M4 20l6-6M20 15v5h-5M20 20l-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <div className={`${styles.mouse} mouse`}></div>
      <Star2 styles={styles}/>

  <Star1 styles={styles}/>
    </div>
  );
}
