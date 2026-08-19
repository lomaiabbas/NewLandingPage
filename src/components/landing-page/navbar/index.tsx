'use client'

import { getClientTranslation } from '@/app/i18n/client'
import i18nConfig from '@/i18nConfig'
import AtrasLinkLogo from '@/lib/icons/logo'
import { Drawer } from 'antd'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './navbar.module.css'

const NAV_LINKS = [
  { key: 'KeyFeatures', hash: 'key-features' },
  { key: 'AboutUs', hash: 'about' },
  { key: 'WhyChooseAtrasLink', hash: 'why-us' },
  { key: 'Contact', hash: 'contact' },
] as const

export default function Navbar({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const router = useRouter()
  const currentPathname = usePathname()
  const searchParams = useSearchParams()
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [activeHash, setActiveHash] = useState<string | null>(null)

  const handleChange = (newLocale: string) => {
    const days = 30
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = '; expires=' + date.toUTCString()
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`

    if (lng === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      router.replace('/' + newLocale + currentPathname)
    } else {
      router.replace(
        currentPathname.replace(`/${lng}`, `/${newLocale}`) +
          (searchParams.size > 0 ? '?' + searchParams.toString() : '')
      )
    }
    router.refresh()
  }

  const handleCloseSideMenu = () => {
    let i = document.body
    i?.classList.remove('sidebar-open')
    i?.classList.remove('no-scroll')
  }

  const toggleLanguage = () => {
    handleCloseSideMenu()
    handleChange(lng === 'ar' ? 'en' : 'ar')
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
      let mouse: any = document.querySelector('.mouse')
      if (window.scrollY > 60 && mouse) {
        mouse.style.display = 'none'
      } else if (mouse) {
        mouse.style.display = 'flex'
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.hash)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const closest = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        )
        setActiveHash(closest.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    )

    sections.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`${styles.headerLayout} z-50 ${isScrolled ? 'fixed' : 'absolute'}`}
    >
      <nav
        className={`${styles.nav} ${isScrolled ? styles.isScrolled : ''}`}
        aria-label={lng === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}
      >
        <Link href={`/${lng}`} className={styles.navBrand}>
          <span className={styles.navMark}>
            <AtrasLinkLogo />
          </span>
          <span className={styles.navWord}>{t('AtrasLink')}</span>
        </Link>

        <div className={styles.navLinks}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              href={`/${lng}#${link.hash}`}
              className={styles.navLink}
              aria-current={activeHash === link.hash ? 'page' : undefined}
            >
              {t(link.key)}
            </Link>
          ))}
          <a
            href="#lng"
            className={`${styles.navLink} ${styles.isLang}`}
            onClick={(e) => {
              e.preventDefault()
              toggleLanguage()
            }}
          >
            {lng === 'en' ? 'العربيّة' : 'English'}
          </a>
        </div>

        <Link href={`/${lng}/register`} className={styles.navCta}>
          {t('Register')}
        </Link>

        <button
          type="button"
          className={styles.navBurger}
          aria-expanded={openDrawer}
          aria-controls="nav-drawer"
          aria-label={lng === 'ar' ? 'فتح القائمة' : 'Open menu'}
          onClick={() => setOpenDrawer(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <Drawer
        id="nav-drawer"
        zIndex={1005}
        width={'70%'}
        title={
          <div className="flex flex-row gap-3 font-bold text-lg items-center justify-center text-[#e9e4d9]">
            <AtrasLinkLogo XL />
            {t('AtrasLink')}
          </div>
        }
        className="landing-drawer relative"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        placement={lng === 'en' ? 'right' : 'left'}
      >
        <div className={styles.drawerLinks}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              href={`/${lng}#${link.hash}`}
              className={styles.drawerLink}
              aria-current={activeHash === link.hash ? 'page' : undefined}
              onClick={() => setOpenDrawer(false)}
            >
              {t(link.key)}
            </Link>
          ))}
          <a
            href="#lng"
            className={`${styles.drawerLink} ${styles.isLang}`}
            onClick={(e) => {
              e.preventDefault()
              setOpenDrawer(false)
              toggleLanguage()
            }}
          >
            {lng === 'en' ? 'العربيّة' : 'English'}
          </a>
        </div>
        <div className={styles.drawerCta}>
          <Link
            href={`/${lng}/register`}
            className={styles.drawerCtaBtn}
            onClick={() => setOpenDrawer(false)}
          >
            {t('Register')}
          </Link>
        </div>
      </Drawer>
    </header>
  )
}
