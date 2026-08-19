'use client'
import { getClientTranslation } from '@/app/i18n/client'
import AtrasLinkLogo from '@/lib/icons/logo'
import { Popover } from 'antd'
import { Languages } from 'lucide-react'
import Link from 'next/link'
import styles from '../panel/top-bar/top-bar.module.css';
import i18nConfig from '@/i18nConfig'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export default function TopNavBar({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng);
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (newLocale: string) => {
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = '; expires=' + date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    if (lng === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      router.replace('/' + newLocale + currentPathname + (searchParams.size > 0 ? '?' + searchParams.toString() : ''));
    } else {
      router.replace(currentPathname.replace(`/${lng}`, `/${newLocale}`)+(searchParams.size > 0 ? '?' + searchParams.toString() : ''));
    }
    router.refresh();
  };

  return (
    <header className="sticky inset-x-0 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="text-lg font-medium flex w-full flex-row justify-between items-center md:text-sm">
        <Link href={`/${lng}`} className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <AtrasLinkLogo />
          <span>{t('AtrasLink')}</span>
        </Link>
        <div className={styles.navItemBox}>
          <Popover content={
            <div className={styles.menuDropUser}>
              <div className={styles.dropdownItem} onClick={() => handleChange(lng === 'ar' ? 'en' : 'ar')}>
                {lng === 'en' ? 'العربيّة' : 'English'}
              </div>
            </div>
          }
            trigger="click">
            <div className={styles.userset}>
              <span className={styles.userInfo}>
                <span className={styles.userLetter}>
                  <Languages className='font-bold' />
                </span>
              </span>
            </div>
          </Popover>
        </div>
      </nav>
    </header>
  );
}
