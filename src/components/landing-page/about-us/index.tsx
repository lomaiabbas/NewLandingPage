import React from 'react'
import styles from './about-us.module.css';
import { Col, Row, Collapse} from 'antd';
import type { CollapseProps } from 'antd';
import { getTranslation } from '@/app/i18n';

export default async function AboutUs({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng);

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: t("OurVision"),
      children: <p>{t("OurVisionDesc")}</p>,
    },
    {
      key: '2',
      label: t("OurMission"),
      children: <p>{t("OurMissionDesc")}</p>,
    }
  ];
  
  return (
    <section className={`${styles.section} pt-[128px] pb-24`} id="about">
      <div className="container">
        <Row gutter={20} justify={'space-between'} align={"middle"}>
          <Col xs={24} lg={12} >

            <div className={styles.titleArea}>
              <span className={styles.subTitle} data-aos="fade-up">{t("AboutUs")}</span>
              <h2 className={`${styles.secTitle} text-start`} data-aos="fade-up" data-aos-delay="200">{t("AboutUsTitle")}</h2>
              <p className={`${styles.secText} text-start`} data-aos="fade-up" data-aos-delay="400">{t("AboutUsDesc")}</p>
            </div>
          </Col>
          <Col xs={24} lg={8} data-aos="fade-up" data-aos-delay="600">
            <Collapse items={items} accordion className="custom-accordion text-start" defaultActiveKey={['1']} />
          </Col>
        </Row>
      </div>
    </section>
  );
}
