import React from 'react'
import styles from './why-us.module.css';
import { Col, Row} from 'antd';
import { BarChart3, Gift, Megaphone, MessageSquareMore, Users, UsersRound } from 'lucide-react';
import { getTranslation } from '@/app/i18n';

export default async function Features({ lng }: { lng: string }) {
    const { t } = await getTranslation(lng);

    return (
        <div className={`position-relative pt-[96px] pb-16 md:pt-[128px] md:pb-24 ${styles.bandSection}`} id="key-features">

            <div className="container">
                <div>
                    <div>
                        <div className={styles.titleArea}>
                            <span className={styles.subTitle} data-aos="fade-up" >{t("KeyFeatures")}</span>
                            <h2 className={styles.secTitle} data-aos="fade-up">{t("KeyFeaturesDesc")}</h2>
                            {/* <p className="sec-text"></p> */}
                        </div>
                    </div>
                </div>
                <Row gutter={20} className='mx-0' justify="center" align="middle">
                    <Col xs={24} md={12} lg={8}>
                        <div className={styles.featureCard} data-aos="fade-up" data-aos-delay="200">
                            <div>
                                <MessageSquareMore size={26} />
                            </div>
                            <div className='flex flex-col gap-2 text-start'>
                                <h3 className={styles.boxTitle}>{t("KeyFeature01Title")}</h3>
                                <p className={styles.boxText}>{t("KeyFeature01Desc")}</p>
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8} data-aos="fade-up" data-aos-delay="400">
                        <div className={styles.featureCard}>
                            <div>
                                <UsersRound size={26} />
                            </div>
                            <div className='flex flex-col gap-2 text-start'>
                                <h3 className={styles.boxTitle}>{t("KeyFeature02Title")}</h3>
                                <p className={styles.boxText}>{t("KeyFeature02Desc")}</p>
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8} data-aos="fade-up" data-aos-delay="600">
                        <div className={styles.featureCard}>
                            <div>
                                <Gift size={26} />
                            </div>
                            <div className='flex flex-col gap-2 text-start'>
                                <h3 className={styles.boxTitle}>{t("KeyFeature03Title")}</h3>
                                <p className={styles.boxText}>{t("KeyFeature03Desc")}</p>
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8} data-aos="fade-up" data-aos-delay="800">
                        <div className={styles.featureCard}>
                            <div>
                                <Megaphone size={26} />
                            </div>
                            <div className='flex flex-col gap-2 text-start'>
                                <h3 className={styles.boxTitle}>{t("KeyFeature04Title")}</h3>
                                <p className={styles.boxText}>{t("KeyFeature04Desc")}</p>
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8} data-aos="fade-up" data-aos-delay="1000">
                        <div className={styles.featureCard}>
                            <div>
                                <BarChart3 size={26} />
                            </div>
                            <div className='flex flex-col gap-2 text-start'>
                                <h3 className={styles.boxTitle}>{t("KeyFeature05Title")}</h3>
                                <p className={styles.boxText}>{t("KeyFeature05Desc")}</p>
                            </div>
                            
                        </div>
                    </Col>
                    <Col xs={24} md={12} lg={8} data-aos="fade-up" data-aos-delay="1200">
                        <div className={styles.featureCard}>
                            <div>
                                <Users size={26} />
                            </div>
                            <div className='flex flex-col gap-2 text-start'>
                                <h3 className={styles.boxTitle}>{t("KeyFeature06Title")}</h3>
                                <p className={styles.boxText}>{t("KeyFeature06Desc")}</p>
                            </div>
                            
                        </div>
                    </Col>
                </Row>
            
            </div>
        </div>
    );
}
