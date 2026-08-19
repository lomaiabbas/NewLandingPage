import { getTranslation } from '@/app/i18n'
import AtrasLinkLogo from '@/lib/icons/logo'
import { Col, Row } from 'antd'
import Link from 'next/link'
import styles from './footer.module.css'

export default async function Footer({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng)

  return (
    <footer className={styles.footer}>
      {/* <div className="overflow-hidden -mt-1" style={{ zIndex: 1 }}>
            <div className="divider divider-alt text-[#323232] mx-[-0.5rem]">
              <svg xmlns="http://www.w3.org/2000/svg" className='border-0' viewBox="0 0 1440 100">
                <g fill="#323232" stroke='transparent'>
                  <polygon points="1440 100 0 15 0 0 1440 0 1440 100"></polygon>
                </g>
              </svg>
            </div>
          </div> */}
      <div className="container">
        <div className={styles.footerInner}>
          <Row
            gutter={20}
            className="flex wow fadeInUp"
            style={{ visibility: 'visible', animationName: 'fadeInUp' }}
          >
            <Col xs={24} md={12} lg={10}>
              <div className={`${styles.widget} ${styles.footerWidget}`}>
                <Link href={`/${lng}`} className={styles.footerLogo}>
                  <AtrasLinkLogo XL />
                </Link>
                <p className="copyright text-start">
                  <span className="block max-w-[80%]">{t('FooterDesc')}</span>
                </p>
              </div>
            </Col>

            <Col xs={24} md={12} lg={4}>
              <div className={`${styles.widget} ${styles.footerWidget}`}>
                <h3 className={`${styles.widgetTitle} text-start`}>{t('QuickLinks')}</h3>

                <ul className={`${styles.footerMenu} text-start`}>
                  <li>
                    <Link href="#">{t('Home')}</Link>
                  </li>
                  <li>
                    <Link href="#about">{t('AboutUs')}</Link>
                  </li>
                  <li>
                    <Link href="#services">{t('OurServices')}</Link>
                  </li>
                  <li>
                    <Link href="#contact">{t('Contact')}</Link>
                  </li>
                </ul>
              </div>
            </Col>

            <Col xs={24} md={12} lg={4}>
              <div className={`${styles.widget} ${styles.footerWidget}`}>
                <h3 className={`${styles.widgetTitle} text-start`}>{t('PoliciesAndSupport')}</h3>

                <ul className={`${styles.footerMenu} text-start`}>
                  <li>
                    <Link href={`/${lng}/privacy-policy`}>{t('PivacyPolicy')}</Link>
                  </li>
                  {/* <li><Link href={`/${lng}/technical-support`}>{t("TechnicalSupport2")}</Link></li> */}
                  <li>
                    <Link href={`/${lng}/terms-and-conditions`}>{t('TermsAndConditions')}</Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <div className={`${styles.widget} ${styles.footerWidget}`}>
                <h3 className={`${styles.widgetTitle} text-start`}>{t('Contact')}</h3>
                <p className="copyright text-start">
                  {t('SeenTriangleEST')}
                  <br />
                  {t('AtrasLinkLocation')}
                  <br />
                  {t('CommercialRegistration')}
                </p>

                <ul className={styles.footerSocialLink}>
                  <li>
                    <a href="https://x.com/LinkAtras" target="_blank">
                      <svg
                        version="1.1"
                        className={styles.twitter}
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 1668.56 1221.19"
                      >
                        <path
                          id="path1009"
                          d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99
     h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/atraslink/" target="_blank">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ion-icon"
                        viewBox="0 0 512 512"
                      >
                        <path d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z" />
                        <path d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z" />
                      </svg>
                    </a>
                  </li>
                  {/* <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" className="ion-icon" viewBox="0 0 512 512"><path d="M496 347.21a190.31 190.31 0 01-32.79-5.31c-27.28-6.63-54.84-24.26-68.12-52.43-6.9-14.63-2.64-18.59 11.86-24 14.18-5.27 29.8-7.72 36.86-23 5.89-12.76 1.13-27.76-10.41-35.49-15.71-10.53-30.35-.21-46.62 2.07 3.73-46.66 8.66-88.57-22.67-127.73C338.14 48.86 297.34 32 256.29 32s-81.86 16.86-107.81 49.33c-31.38 39.26-26.4 81.18-22.67 127.92-16.32-2.25-30.81-12.79-46.63-2.18-14.72 9.85-17 29.76-5.44 43s31.64 9.5 43.45 20.6c6.49 6.09 3.49 12.61-.35 20.14-14.48 28.4-39.26 45.74-69.84 51.56-4 .76-22.31 2.87-31 3.65 0 9.28.52 16.78 1.63 21.73 2.94 13.06 12.32 23.58 23.69 30.1 11.18 6.4 35.48 6.43 41.68 15.51 3 4.48 1.76 12.28 5.33 17.38a23.8 23.8 0 0015.37 9.75c18.61 3.61 37.32-7.2 56.42-2.1 14.85 3.95 26.52 15.87 39.26 24 15.51 9.85 32.34 16.42 50.83 17.49 38.1 2.21 59.93-18.91 90.58-36.42 19.5-11.14 38.15-3.86 58.88-2.68 20.1 1.15 23.53-9.25 29.62-24.88a27.37 27.37 0 001.54-4.85 10.52 10.52 0 002.28-1.47c2-1.57 10.55-2.34 12.76-2.86 10.28-2.44 20.34-5.15 29.17-11.2 11.31-7.76 17.65-18.5 19.58-32.64a93.73 93.73 0 001.38-15.67zM208 128c8.84 0 16 10.74 16 24s-7.16 24-16 24-16-10.74-16-24 7.16-24 16-24zm103.62 77.7c-15.25 15-35 23.3-55.62 23.3a78.37 78.37 0 01-55.66-23.34 8 8 0 0111.32-11.32A62.46 62.46 0 00256 213c16.39 0 32.15-6.64 44.39-18.7a8 8 0 0111.23 11.4zM304 176c-8.84 0-16-10.75-16-24s7.16-24 16-24 16 10.75 16 24-7.16 24-16 24z" /></svg></a></li> */}
                </ul>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </footer>
  )
}
