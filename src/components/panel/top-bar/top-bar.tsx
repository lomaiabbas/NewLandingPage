'use client'

import { getClientTranslation } from '@/app/i18n/client'
import i18nConfig from '@/i18nConfig'
import { useAppContext } from '@/lib/context'
import { useWindowWidth } from '@/lib/hooks/useWindowWidth'
import AtrasLinkLogo from '@/lib/icons/logo'
import languageServiceInstance from '@/lib/services/language'
import { Divider, Image, Popover, Space } from 'antd'
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  BadgeCheck,
  Languages,
  LogOut,
  Menu,
  SquareCheck,
  SquareX,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Pako from 'pako'
import { useEffect, useState } from 'react'
import MessageList from './message-list'
import NotificationList from './notification-list'
import TaskList from './task-list'
import styles from './top-bar.module.css'

export default function AdminTopBar({
  lng,
  miniSidebar,
  handleMiniSidebar,
  setOpenDrawer,
  companyInfoObj,
}: {
  companyInfoObj: any
  lng: string
  miniSidebar: boolean
  handleMiniSidebar: () => void
  setOpenDrawer: any
}) {
  const { t } = getClientTranslation(lng)
  const router = useRouter()
  const currentPathname = usePathname()
  const searchParams = useSearchParams()
  const {
    setAccessToken,
    setRefreshToken,
    setCompanyInfo,
    setFeatures,
    setRole,
    setGrantedPolicies,
    setTenant,
    tenant,
    accessToken,
    companyInfo,
    currentUser,
    WhatsAppBusinessAccount,
    grantedPolicies,
  } = useAppContext()
  // const [data, setData] = useState<WalletDto>()
  // const { connection } = useContext(SignalRContext)
  const { width } = useWindowWidth()
  const [openProfilePopover, setOpenProfilePopover] = useState(false)

  const logout = async () => {
    await fetch('/api/auth/set-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        refreshToken: ' ',
        accessToken: ' ',
        rememberMe: false,
        logout: true,
        tenant: ' ',
        companyInfo: ' ',
      }),
    })
    setOpenProfilePopover(false)
    setAccessToken(undefined)
    setRefreshToken(undefined)
    setCompanyInfo(undefined)
    setTenant(undefined)
    setFeatures(undefined)
    setGrantedPolicies(undefined)
    setRole(undefined)
    localStorage.setItem('logout', 'true')
    router.replace(`/${lng}`)
  }

  // const getData = async () => {
  //   managerWalletServiceInstance.get().then((res: WalletDto) => {
  //     setData(res)
  //     setWallet(res)
  //   })
  // }

  // const messageHandler1 = (data: any) => {
  //   getData()
  // }

  // useEffect(() => {
  //   if (!connection) return
  //   connection.on('UpdateCredits', messageHandler1)

  //   return () => {
  //     connection.off('UpdateCredits', messageHandler1)
  //   }
  // }, [connection])

  // useEffect(() => {
  //   if (companyInfoObj?.value && !data && grantedPolicies?.includes('UsageManagement.Credits'))
  //     getData()
  // }, [companyInfoObj, grantedPolicies])

  useEffect(() => {
    if (!companyInfo && companyInfoObj?.value) {
      setCompanyInfo(
        JSON.parse(Pako.ungzip(Buffer.from(companyInfoObj?.value, 'base64'), { to: 'string' }))
      )
    }
  }, [companyInfo, companyInfoObj])

  useEffect(() => {
    languageServiceInstance.get().then((res) => {
      const newLocale = res.language || 'ar'
      if (lng !== newLocale) {
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
    })
  }, [])

  const actions = (
    <div className={styles.headerUser}>
      <ul className={`${styles.userMenu} ${styles.nav}`}>
        {tenant && WhatsAppBusinessAccount && (
          <li className={`hidden md:flex ${styles.navItemBox}`}>
            {WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? (
              <div className="flex flex-col !p-2 justify-start !items-start !w-[max-content] !cursor-context-menu">
                <span className="text-gray-700 text-[11px]">{t('SendingTemplateFeature')}</span>
                <Space size={3} align="center">
                  {WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? (
                    <SquareCheck size={14} className="text-primary" />
                  ) : (
                    <SquareX size={14} color="#d50000" />
                  )}
                  <div
                    className={`font-bold text-[11px] ${WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? 'text-primary' : 'text-[#d50000]'}`}
                  >
                    {t(WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? 'Active' : 'Inactive')}
                  </div>
                </Space>
              </div>
            ) : (
              <Popover
                content={
                  <div className="w-[250px] flex flex-col gap-4 pt-4 ps-2">
                    <span className="font-bold">
                      {t('ActivateYourSendingTemplateFeatureMeesage')}
                    </span>
                  </div>
                }
                trigger="hover"
              >
                <div className="flex flex-col !p-2 justify-start !items-start !w-[max-content]">
                  <span className="text-gray-700 text-[11px]">{t('SendingTemplateFeature')}</span>
                  <Space size={3} align="center">
                    {WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? (
                      <SquareCheck size={14} className="text-primary" />
                    ) : (
                      <SquareX size={14} color="#d50000" />
                    )}
                    <div
                      className={`font-bold text-[11px] ${WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? 'text-primary' : 'text-[#d50000]'}`}
                    >
                      {t(
                        WhatsAppBusinessAccount?.isSendingTemplatesEnabled ? 'Active' : 'Inactive'
                      )}
                    </div>
                  </Space>
                </div>
              </Popover>
            )}
          </li>
        )}
        {/* {tenant && grantedPolicies?.includes('UsageManagement.Credits') && (
          <li
            className={`hidden md:flex ${styles.navItemBox} w-[120px]`}
            // onClick={() => router.replace(`/${lng}/admin/usage/billing`)}
          >
            <div className="flex flex-col !p-2 justify-start !items-start !min-w-[120px] !max-w-[160px]">
              <span className="text-gray-700 text-[11px]">
                {t('Credit1')}
               
                // <span className='text-gray-700 text-[10px] mx-1'>
                //  ({t("CurrentMonth")})
               // </span> 
              </span>
              <span style={{ direction: 'rtl', display: 'block' }}>
                <span className="font-bold text-[14px]">
                  {new Intl.NumberFormat('en-IN').format(data?.credit ? +data?.credit : 0)} &nbsp;
                </span>
                <span className="text-primary font-bold text-[11px]">
                  <SAR color="var(--primary-color)" width="0.7rem" top="-2px" />
                </span>
              </span>
            </div>
          </li>
        )} */}

        {/* {tenant && grantedPolicies?.includes('UsageManagement.Credits') && (
          <li className={`hidden md:flex ${styles.navItemBox} w-[120px]`}>
            <Popover
              content={
                <div className="w-[250px] flex flex-col gap-4 pt-4 ps-2">
                  <div className="flex flex-col">
                    <span className="font-bold">
                      {t('Balance')}
                      <span className="text-[10px] px-[2px] font-normal">{t('CurrentMonth1')}</span>
                      :
                    </span>
                    <span
                      className="text-end rtl:text-start"
                      style={{ direction: 'rtl', display: 'block' }}
                    >
                      <span className="font-bold text-[14px]">
                        {new Intl.NumberFormat('en-IN').format(data?.balance ? +data?.balance : 0)}{' '}
                        &nbsp;
                      </span>
                      <span className="text-primary font-bold text-[11px]">
                        <SAR color="var(--primary-color)" width="0.7rem" top="-2px" />
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold">
                      {t('ConversationsCount')}
                      <span className="text-[10px] px-[2px] font-normal">{t('CurrentMonth1')}</span>
                      :
                    </span>
                    <span>
                      <span className="font-bold text-[14px]">{data?.totalConversationsCount}</span>
                    </span>
                  </div>

                  <Link
                    prefetch={false}
                    href={`/${lng}/admin/activity`}
                    className="text-[12px] flex mt-3 gap-1 items-center justify-end"
                  >
                    {t('ShowMonthlyInsight')} <ArrowLeft className="ltr:rotate-180" size={16} />
                  </Link>
                </div>
              }
              trigger="click"
            >
              <div className="flex flex-col !p-2 justify-start !items-start !min-w-[120px] !max-w-[150px]">
                <span className="text-gray-700 text-[11px]">{t('CurrentBalance')}</span>
                <span style={{ direction: 'rtl', display: 'block' }}>
                  <span className="font-bold text-[14px]">
                    {new Intl.NumberFormat('en-IN').format(data?.balance ? +data?.balance : 0)}{' '}
                    &nbsp;
                  </span>
                  <span className="text-primary font-bold text-[11px]">
                    <SAR color="var(--primary-color)" width="0.7rem" top="-2px" />
                  </span>
                </span>
              </div>
            </Popover>
          </li>
        )} */}

        {currentUser?.roles?.length > 0 && (
          <>
            {grantedPolicies?.includes('TasksManagement.TasksForHost') ||
            grantedPolicies?.includes('TasksManagement.TasksForHost.Create') ||
            grantedPolicies?.includes('TasksManagement.Tasks') ||
            grantedPolicies?.includes('TasksManagement.Tasks.Create') ? (
              <TaskList lng={lng} />
            ) : (
              <></>
            )}
            {grantedPolicies?.includes('ChatsManagementForHost.Staff') ||
            grantedPolicies?.includes('ChatsManagementForHost.Clients') ||
            grantedPolicies?.includes('ChatsManagement.Clients') ||
            grantedPolicies?.includes('ChatsManagement.Staff') ? (
              <>
                <MessageList lng={lng} />
              </>
            ) : (
              <></>
            )}
            <NotificationList lng={lng} />
          </>
        )}

        <li className={styles.navItemBox}>
          <Popover
            open={openProfilePopover}
            onOpenChange={(open) => setOpenProfilePopover(open)}
            content={
              <div className={styles.menuDropUser}>
                <div className={`flex gap-3 `}>
                  <div className="rounded-[10px] p-2 flex items-center bg-primary justify-center !w-14 !h-14">
                    <UserRound size={35} className="text-white !m-0" />
                  </div>
                  <div>
                    <span className="text-lg">{`${currentUser?.name}  ${currentUser?.surName || ''}`}</span>
                    <div className="text-sm text-green-500 font-semibold flex items-center gap-[3px]">
                      <span>{currentUser?.roles?.[0] === 'admin' ? t('Admin') : t('Staff1')}</span>{' '}
                      <BadgeCheck size={16} className="text-green-500" />
                    </div>
                  </div>
                </div>
                <Divider className="!mb-0 !mt-2" />
                {currentUser?.roles?.length > 0 && (
                  <div
                    className={styles.dropdownItem}
                    onClick={() => {
                      router.push(`/${lng}/admin/my-profile`)
                      setOpenProfilePopover(false)
                    }}
                  >
                    <UserRound /> {t('MyProfile')}
                  </div>
                )}
                {/* {companyInfo?.arName && role !== 'Meta Role' && (
                  <Tooltip title={t('ComingSoon1')}>
                    <div
                      className={`${styles.dropdownItem} !cursor-no-drop`}
                      onClick={() => {
                        // router.push(`/${lng}/admin/company-profile`)
                      }}
                    >
                      <Building2 /> {t('CompanyProfile')}
                    </div>
                  </Tooltip>
                )} */}

                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    handleChange(lng === 'ar' ? 'en' : 'ar')
                    setOpenProfilePopover(false)
                  }}
                >
                  <Languages /> {lng === 'en' ? 'العربيّة' : 'English'}
                </div>
                <div className={styles.dropdownItem} onClick={logout}>
                  <LogOut /> {t('Logout')}
                </div>
              </div>
            }
            trigger="click"
          >
            <div className={styles.userset}>
              <span className={styles.userInfo}>
                <span className={styles.userLetter}>
                  <UserRound className="font-bold" />
                </span>
                <span className={`${styles.badge} ${styles.badgeSuccess}`}></span>
              </span>
            </div>
          </Popover>
        </li>
      </ul>
    </div>
  )

  const handleChange = (newLocale: string) => {
    const days = 30
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = '; expires=' + date.toUTCString()
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`

    if (accessToken) languageServiceInstance.update(newLocale)

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

  return (
    <div className={`${styles.header} ${!miniSidebar ? '' : styles.miniSidebar}`}>
      <div className={`${styles.headerLeft} ${!miniSidebar ? styles.active : ''}`}>
        <Link href={`/${lng}/admin`} className="text-lg mr-2 flex flex-row gap-2 items-center">
          {companyInfo?.enLogo ? (
            lng === 'ar' ? (
              <Image
                src={companyInfo?.arLogo}
                className="rounded-[8px] p-1 bg-gray-50 max-w-[45px] max-h-[45px]"
                alt={companyInfo?.arName}
                preview={false}
              />
            ) : (
              <Image
                className="rounded-[8px] p-1 bg-gray-50 max-w-[45px] max-h-[45px]"
                src={companyInfo?.enLogo}
                alt={companyInfo?.arName}
                preview={false}
              />
            )
          ) : (
            <AtrasLinkLogo />
          )}

          {miniSidebar ? null : (
            <span>
              {companyInfo?.arName
                ? lng === 'ar'
                  ? companyInfo?.arName
                  : companyInfo?.enName
                : t('AtrasLink')}
            </span>
          )}
        </Link>
        <span className={styles.desktop}>
          {lng === 'en' ? (
            miniSidebar ? (
              <ArrowRightToLine className="cursor-pointer" size={19} onClick={handleMiniSidebar} />
            ) : (
              <ArrowLeftToLine className="cursor-pointer" size={19} onClick={handleMiniSidebar} />
            )
          ) : !miniSidebar ? (
            <ArrowRightToLine className="cursor-pointer" size={19} onClick={handleMiniSidebar} />
          ) : (
            <ArrowLeftToLine className="cursor-pointer" size={19} onClick={handleMiniSidebar} />
          )}
        </span>
        <div className={styles.mobile}>
          {width > 0 && width <= 991 ? <>{actions}</> : <></>}
          <span className={styles.mobileBtn} onClick={() => setOpenDrawer(true)}>
            <Menu size={24} className="font-bold" />
          </span>
        </div>
      </div>

      {width > 0 && width > 991 ? actions : <></>}
    </div>
  )
}
