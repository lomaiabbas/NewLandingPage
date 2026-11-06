'use client'

import i18nConfig from '@/i18nConfig'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import styles from './footer.module.css'

/* The footer's language switch: sets the NEXT_LOCALE cookie like the navbar does, then swaps the
   locale in the current URL. */
export default function LangSwitch({ lng }: { lng: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const newLocale = lng === 'ar' ? 'en' : 'ar'

  const handleClick = () => {
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `NEXT_LOCALE=${newLocale}; expires=${expires}; path=/`

    if (lng === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      router.replace('/' + newLocale + pathname)
    } else {
      router.replace(
        pathname.replace(`/${lng}`, `/${newLocale}`) +
          (searchParams.size > 0 ? '?' + searchParams.toString() : '')
      )
    }
    router.refresh()
  }

  return (
    <button type="button" className={styles.switchLang} onClick={handleClick}>
      {lng === 'en' ? 'العربيّة' : 'English'}
    </button>
  )
}
