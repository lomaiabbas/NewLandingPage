import { getTranslation } from '@/app/i18n'
import AtrasLinkLogo from '@/lib/icons/logo'
import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../contact-info'
import { SOLUTIONS } from '../solutions/solutions.data'
import styles from './footer.module.css'
import LangSwitch from './lang-switch'

/* Footer: a brand column with the slogan, the tagline and the social links, a column of the
   solutions, a column of company links with the contact details, and a bottom bar with the
   copyright, the address and the language switch. */
export default async function Footer({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng)

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <Link href={`/${lng}`} className={styles.logo}>
              <AtrasLinkLogo XL />
            </Link>
            <p className={styles.slogan}>
              {t('HeroTitle1')}
              {t('HeroTitle2')}
              {t('HeroTitle3')}
            </p>
            <p className={styles.tagline}>{t('FooterDesc')}</p>
            <ul className={styles.social}>
              <li>
                <a
                  href="https://www.instagram.com/atraslink/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z" />
                    <path d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z" />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/LinkAtras"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1668.56 1221.19">
                    <path d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={styles.title}>{t('Solutions')}</h3>
            <ul className={styles.links}>
              {SOLUTIONS.map((s) => (
                <li key={s.titleKey}>
                  <Link href="#solutions">{t(s.titleKey)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.title}>{t('Company')}</h3>
            <ul className={styles.links}>
              <li>
                <Link href="#about">{t('AboutUs')}</Link>
              </li>
              <li>
                <Link href="#why">{t('WhyEyebrow')}</Link>
              </li>
              <li>
                <Link href={`/${lng}/privacy-policy`}>{t('PivacyPolicy')}</Link>
              </li>
              <li>
                <Link href={`/${lng}/terms-and-conditions`}>{t('TermsAndConditions')}</Link>
              </li>
            </ul>
            <ul className={`${styles.links} ${styles.contact}`}>
              <li>
                <Mail size={14} />
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
              <li>
                <Phone size={14} />
                <a href={CONTACT_PHONE_HREF} dir="ltr">
                  {CONTACT_PHONE}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.bar}>
        <div className={`container ${styles.barInner}`}>
          <span>
            © {new Date().getFullYear()} AtrasLink — {t('AllRightsReserved')}
          </span>
          <span>{t('AtrasLinkLocation')}</span>
          <LangSwitch lng={lng} />
        </div>
      </div>
    </footer>
  )
}
