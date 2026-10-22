'use client'

import { getClientTranslation } from '@/app/i18n/client'
import i18nConfig from '@/i18nConfig'
import AtrasLinkLogo from '@/lib/icons/logo'
import { Drawer } from 'antd'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [indicator, setIndicator] = useState({ x: 0, w: 0, visible: false, instant: true })

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
    /* This used to run on every scroll event, unthrottled, and query + write the DOM each time —
       a forced style recalc per frame for the whole duration of a smooth scroll. Now it coalesces
       into one rAF and only touches anything when a threshold is actually crossed. */
    let raf = 0
    let hintEl: HTMLElement | null = null
    let scrolled: boolean | null = null
    let hintHidden: boolean | null = null

    const update = () => {
      raf = 0
      const y = window.scrollY

      const nextScrolled = y > 40
      if (nextScrolled !== scrolled) {
        scrolled = nextScrolled
        setIsScrolled(nextScrolled)
      }

      // the hint is owned by the hero, so resolve it lazily and cache it
      hintEl ??= document.getElementById('scroll-hint')
      const nextHintHidden = y > 60
      if (hintEl && nextHintHidden !== hintHidden) {
        hintHidden = nextHintHidden
        hintEl.style.display = nextHintHidden ? 'none' : 'flex'
      }
    }

    const handleScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const hero = document.getElementById('hero')
    const sections = NAV_LINKS.map((link) => document.getElementById(link.hash)).filter(
      (el): el is HTMLElement => Boolean(el)
    )
    const watched = hero ? [hero, ...sections] : sections
    if (watched.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const closest = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        )
        setActiveHash(closest.target.id === 'hero' ? null : closest.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 }
    )

    watched.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    /* The sliding pill behind the active link: measured from the link itself so it follows
       any width (Arabic/English labels, font swap, resize). When it appears from hidden it
       snaps into place and only fades in, instead of sliding over from wherever it last was. */
    let raf = 0
    const measure = () => {
      const el = activeHash ? linkRefs.current[activeHash] : null
      setIndicator((prev) => {
        if (!el) return prev.visible ? { ...prev, visible: false } : prev
        const next = { x: el.offsetLeft, w: el.offsetWidth, visible: true, instant: !prev.visible }
        return next.x === prev.x && next.w === prev.w && next.visible === prev.visible ? prev : next
      })
      raf = requestAnimationFrame(() =>
        setIndicator((prev) => (prev.instant ? { ...prev, instant: false } : prev))
      )
    }

    measure()
    const container = activeHash ? linkRefs.current[activeHash]?.parentElement : null
    const resizeObserver = container ? new ResizeObserver(measure) : null
    if (container) resizeObserver?.observe(container)
    document.fonts?.ready.then(measure)
    return () => {
      resizeObserver?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [activeHash, lng])

  useEffect(() => {
    /* Loading the page with a section hash already in the URL (a refresh, or a shared/
       bookmarked link) makes the browser jump to that section before the hero mockup,
       stats counters and fonts finish loading and growing the page's height — so it lands
       short, with the fixed nav overlapping a spot that isn't the section's real top. Redo
       the jump once the page has actually settled. */
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const target = document.getElementById(hash)
    if (!target) return

    const settle = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => target.scrollIntoView({ behavior: 'auto', block: 'start' }))
      })
    }

    if (document.readyState === 'complete') {
      settle()
      return
    }
    window.addEventListener('load', settle, { once: true })
    return () => window.removeEventListener('load', settle)
  }, [])

  return (
    <header
      className={`${styles.headerLayout} z-50 ${isScrolled ? styles.scrolled : ''}`}
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
          {/* plain anchors, not next/link: these point at sections of the page that is already
              rendered, and a Link would run a full App Router navigation (RSC fetch + middleware)
              just to jump to a hash */}
          <span
            aria-hidden
            className={styles.navIndicator}
            data-visible={indicator.visible}
            data-instant={indicator.instant}
            style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
          />
          {NAV_LINKS.map((link) => (
            <a
              key={link.hash}
              ref={(el) => {
                linkRefs.current[link.hash] = el
              }}
              href={`#${link.hash}`}
              className={styles.navLink}
              aria-current={activeHash === link.hash ? 'page' : undefined}
            >
              {t(link.key)}
            </a>
          ))}
          <a
            href="#lng"
            className={`${styles.navLink} ${styles.langLink}`}
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
        /* 70% meant a 540px drawer on a tablet and a cramped 224px one on a small phone */
        width={'min(340px, 85vw)'}
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
            <a
              key={link.hash}
              href={`#${link.hash}`}
              className={styles.drawerLink}
              aria-current={activeHash === link.hash ? 'page' : undefined}
              onClick={() => setOpenDrawer(false)}
            >
              {t(link.key)}
            </a>
          ))}
          <a
            href="#lng"
            className={`${styles.drawerLink} ${styles.langLink}`}
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
