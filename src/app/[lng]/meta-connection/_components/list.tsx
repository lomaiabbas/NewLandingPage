'use client'

import { getClientTranslation } from '@/app/i18n/client'
import Fireworks from '@/components/firework'
import Loader from '@/components/panel/loader'
import { CardContent, CardHeader } from '@/components/ui/card'
import { useAppContext } from '@/lib/context'
import { useFacebookSDK } from '@/lib/hooks/useFacebookSDK'
import { popupConfirm } from '@/lib/popup-confirm'
import abpServiceInstance from '@/lib/services/abp'
import channelsServiceInstance from '@/lib/services/channels'
import { CompanyChannelForManagerResponseDto } from '@/lib/services/channels/dto'
import { Button, Card, Dropdown, Image, message, Tooltip } from 'antd'
import { MenuProps } from 'antd/lib'
import { BookCheck, BookX, MoreVertical, Phone, PhoneOff, Webhook, WebhookOff, Instagram, MessageSquare, Lock } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const comingSoonChannels = [
  {
    key: 'instagram',
    nameKey: 'Instagram',
    descKey: 'InstagramDesc',
    icon: <Instagram size={37} className="text-white" />,
    iconGradient: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    bgGradient: 'from-[#fff5f8] to-[#ffdce5]',
    cardGradient: 'hover:to-[#ee2a7b]/10',
    borderColor: 'hover:border-[#ee2a7b]/20',
    hoverTextTheme: 'group-hover:text-[#ee2a7b]',
  },
  {
    key: 'telegram',
    nameKey: 'Telegram',
    descKey: 'TelegramDesc',
    icon: (
      <svg className="w-[37px] h-[37px] fill-white mb-[5px]" viewBox="0 0 24 24">
        <path d="M9.78 18.65l.28-4.22L17.7 7.72c.33-.29-.07-.45-.51-.16l-9.82 6.18-4.09-1.28c-.89-.28-.91-.89.19-1.31L19.4 6.77c1.1-.41 2.06.25 1.7 1.93l-2.71 12.78c-.2 1-.8 1.25-1.63.78l-4.14-3.05-2.0 1.93c-.22.22-.4.41-.83.41z" />
      </svg>
    ),
    iconGradient: 'bg-gradient-to-br from-[#54A9EB] to-[#229ED9]',
    bgGradient: 'from-[#f0f9ff] to-[#bae6fd]',
    cardGradient: 'hover:to-[#54A9EB]/15',
    borderColor: 'hover:border-[#54A9EB]/20',
    hoverTextTheme: 'group-hover:text-[#54A9EB]',
  },
  {
    key: 'sms',
    nameKey: 'SMS',
    descKey: 'SMSDesc',
    icon: <MessageSquare size={28} className="text-white" />,
    iconGradient: 'bg-gradient-to-br from-[#6366F1] to-[#4F46E5]',
    bgGradient: 'from-[#faf5ff] to-[#c7d2fe]',
    cardGradient: 'hover:to-[#6366F1]/15',
    borderColor: 'hover:border-[#6366F1]/20',
    hoverTextTheme: 'group-hover:text-[#4F46E5]',
  },
  {
    key: 'tiktok',
    nameKey: 'TikTok',
    descKey: 'TikTokDesc',
    icon: (
      <svg className="w-[28px] h-[28px] fill-white" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.8 1.02 1.96 1.8 3.28 2.2v3.98c-1.97-.24-3.79-1.16-5.12-2.65-.07 3.51-.02 7.02-.04 10.53-.13 1.93-.93 3.79-2.27 5.17A7.346 7.346 0 0 1 8.87 24a7.314 7.314 0 0 1-5.18-2.14c-1.4-1.39-2.2-3.32-2.2-5.31.02-1.99.85-3.92 2.27-5.3 1.4-1.35 3.32-2.11 5.29-2.07v4.03a3.308 3.308 0 0 0-3.32 3.34c.01.88.38 1.73 1.02 2.34a3.327 3.327 0 0 0 4.67-.02c.63-.61.99-1.44 1.01-2.32.05-4.24.02-8.49.03-12.73z" />
      </svg>
    ),
    iconGradient: 'bg-gradient-to-br from-[#25F4EE] via-[#000000] to-[#FE2C55]',
    bgGradient: 'from-[#f6fcfc] to-[#fed7e2]',
    cardGradient: 'hover:to-[#FE2C55]/10',
    borderColor: 'hover:border-[#FE2C55]/20',
    hoverTextTheme: 'group-hover:text-[#FE2C55]',
  },
  {
    key: 'salla',
    nameKey: 'Salla',
    descKey: 'SallaDesc',
    icon: (
      <svg className="w-[41px] h-[35px] mb-[2px]" viewBox="0 0 95 82" fill="none">
        <rect
          x="5"
          y="5"
          width="85"
          height="72"
          rx="20"
          stroke="white"
          strokeWidth="8"
        />
        <path
          d="M22 43 C35 55 60 55 73 43"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    ),
    iconGradient: 'bg-gradient-to-br from-[#00B4A2] to-[#009282]',
    bgGradient: 'from-[#f4fcfb] to-[#cbf2ee]',
    cardGradient: 'hover:to-[#00B4A2]/10',
    borderColor: 'hover:border-[#00B4A2]/20',
    hoverTextTheme: 'group-hover:text-[#00B4A2]',
  },
]

const ComingSoonCard = ({ item, lng, t }: { item: typeof comingSoonChannels[0]; lng: string; t: any }) => {
  const isAr = lng === 'ar'

  return (
    <Card className={`shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full h-full rounded-2xl border border-slate-100/80 bg-gradient-to-br ${item.bgGradient} relative overflow-hidden ${item.borderColor} [&_.ant-card-body]:!p-0 [&_.ant-card-body]:h-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:justify-between`}>
      {/* Ribbon - left corner for Arabic, right corner for English */}
      {isAr ? (
        <div className="absolute top-0 left-0 w-[88px] h-[88px] overflow-hidden pointer-events-none z-20">
          <div className="absolute top-[18px] left-[-28px] w-[120px] bg-[#02c39a] text-white text-[14px] font-bold py-[3px] text-center -rotate-45 shadow-sm">
            {t('ComingSoonLabel')}
          </div>
        </div>
      ) : (
        <div className="absolute top-0 right-0 w-[88px] h-[88px] overflow-hidden pointer-events-none z-20">
          <div className="absolute top-[18px] right-[-28px] w-[120px] bg-[#02c39a] text-white text-[12px] font-bold py-[3px] text-center rotate-45 shadow-sm">
            {t('ComingSoonLabel')}
          </div>
        </div>
      )}
      <CardHeader className="p-6 opacity-90">
        <div className="flex gap-4 items-start text-start w-full">
          <div className={`w-[60px] h-[60px] rounded-xl border border-slate-200/80 p-2 ${item.iconGradient} flex items-center justify-center shrink-0 shadow-sm`}>
            {item.icon}
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0 text-start">
            <h2 className="font-bold text-[17px] text-slate-800 m-0 leading-tight">{t(item.nameKey)}</h2>
            <p className="text-slate-400 text-[11px] leading-snug m-0 line-clamp-2">
              {t(item.descKey)}
            </p>
          </div>
        </div>
      </CardHeader>
      <div className={`mt-auto p-4 px-6 flex flex-col gap-1.5 bg-gradient-to-r from-white/60 to-white/20 border-t border-slate-100/60 backdrop-blur-sm opacity-90`}>
        <div className="flex items-center gap-2 font-bold text-[13px] text-slate-700">
          <Lock size={14} className={`${item.hoverTextTheme} transition-colors duration-150`} />
          {t('ComingSoon1')}
        </div>
        <p className="text-[11px] text-slate-500 m-0 leading-relaxed font-medium">
          {t('ComingSoonDesc')}
        </p>
      </div>

      {/* Blur Overlay (keep blur, remove stripes) */}
      <div className="absolute inset-0 pointer-events-none z-10 backdrop-blur-[1px] bg-white/[0.12]" />
    </Card>
  )
}

export const ChannelsList = ({ lng }: { lng: string }) => {
  const { t } = getClientTranslation(lng)
  const [sdkLoaded, setSdkLoaded] = useState(false)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const currentTenant = searchParams.get('currentTenant')

  const [WhatsAppLinked, setWhatsAppLinked] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [response, setResponse] = useState<any>(undefined)
  const [data, setData] = useState<CompanyChannelForManagerResponseDto | undefined>(undefined)

  const { grantedPolicies, setGrantedPolicies, setFeatures, setRole, setTenant } = useAppContext()
  const FB = useFacebookSDK(process.env.NEXT_PUBLIC_FB_APP_ID!)

  useEffect(() => {
    if (token && currentTenant) {
      fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          refreshToken: token,
          accessToken: token,
          rememberMe: false,
        }),
      }).then(async () => {
        console.log(currentTenant?.trim() === 'bialahcamp')
        console.log(currentTenant?.trim())
        setTimeout(async () => {
          let res1: any = await abpServiceInstance.abpApplicationConfigurationGet(
            token,
            false,
            lng,
            undefined,
            currentTenant?.trim() === 'bialahcamp'
          )

          setGrantedPolicies(Object.keys(res1?.auth?.grantedPolicies))
          setFeatures(res1.features.values)
          setRole(res1.currentUser.roles?.[0])
          if (res1.currentTenant.id) setTenant(res1.currentTenant.id)

          let res: CompanyChannelForManagerResponseDto[] =
            await channelsServiceInstance.getChannelsForManager(currentTenant === 'bialahcamp')
          setLoadingData(false)
          if (res.length > 0) {
            res?.map((item: CompanyChannelForManagerResponseDto) => {
              if (item.type === 0 && item.isHaveToken) {
                setWhatsAppLinked(true)
              }
              setData(item)
            })
          }
        }, 1000)
      })
    }
  }, [token, currentTenant])

  useEffect(
    () => {
      if (typeof window === 'undefined') return
      if (FB) {
        setSdkLoaded(true)
      }
    }, // eslint-disable-next-line
    [FB]
  )

  useEffect(() => {
    if (success && response) call2EP(response)
  }, [success, response])

  const call2EP = async (response: any) => {
    const { code, userID, expiresIn } = response.authResponse
    try {
      await channelsServiceInstance.registerWhatsAppChannel(
        userID,
        expiresIn,
        code,
        currentTenant === 'bialahcamp'
      )
      setTimeout(async () => {
        let res: CompanyChannelForManagerResponseDto[] =
          await channelsServiceInstance.getChannelsForManager(currentTenant === 'bialahcamp')
        if (res.length > 0) {
          res?.map((item: CompanyChannelForManagerResponseDto) => {
            if (item.type === 0 && item.isHaveToken) {
              setWhatsAppLinked(true)
            }
            setData(item)
          })
        }
      }, 5000)
    } catch { }
  }

  const fbLoginCallback = (response: any) => {
    ; (async () => {
      setResponse(response)
      // if (response.authResponse && success) {
      //   const { code, userID, expiresIn } = response.authResponse
      //   try {
      //     let res = await channelsServiceInstance.registerWhatsAppChannel(userID, expiresIn, code)
      //   } finally {
      //   }
      // } else {
      // }
    })().catch((err) => console.error(err))
  }

  const launchWhatsAppSignup = () => {
    window.fbAsyncInit = (function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FB_APP_ID,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v21.0',
      })
    })()
    window.FB.login(fbLoginCallback, {
      config_id: process.env.NEXT_PUBLIC_FB_CONFIG_ID,
      response_type: 'code',
      // scope: 'business_management,whatsapp_business_management,pages_show_list',
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: '',
        sessionInfoVersion: '3',
      },
    })

    window.addEventListener('message', (event) => {
      ; (async () => {
        try {
          if (
            event.origin !== 'https://www.facebook.com' &&
            event.origin !== 'https://web.facebook.com'
          ) {
            return
          }
          try {
            const data = typeof event.data === 'object' ? event.data : JSON.parse(event.data)
            if (data.type === 'WA_EMBEDDED_SIGNUP') {
              // if user finishes the Embedded Signup flow
              if (data.event === 'FINISH') {
                const { phone_number_id, waba_id } = data.data

                try {
                  if (phone_number_id && waba_id) {
                    channelsServiceInstance
                      .registerWhatsAppChannel2(
                        waba_id,
                        phone_number_id,
                        currentTenant === 'bialahcamp'
                      )
                      .then(() => setSuccess(true))
                  }
                } finally {
                }

                // if user cancels the Embedded Signup flow
              } else if (data.event === 'CANCEL') {
                const { current_step } = data.data
                console.warn('Cancel at ', current_step)
                // if user reports an error during the Embedded Signup flow
              } else if (data.event === 'ERROR') {
                const { error_message } = data.data
                console.error('error ', error_message)
              }
            }
            let d: any = document.getElementById('session-info-response')
            if (d) d.textContent = JSON.stringify(data, null, 2)
          } catch { }
        } catch (err) {
          console.error(err)
        }
      })()
    })
  }

  const items: MenuProps['items'] = [
    !data?.isLinkedWebhook
      ? {
        label: <span>{t('LinkWithWebhook')}</span>,
        key: '0',
        onClick: async () => {
          popupConfirm(async () => {
            await channelsServiceInstance.subscribeWhatsAppBusinessAccount(
              currentTenant === 'bialahcamp'
            )
            setTimeout(async () => {
              let res: CompanyChannelForManagerResponseDto[] =
                await channelsServiceInstance.getChannelsForManager(
                  currentTenant === 'bialahcamp'
                )
              if (res.length > 0) {
                res?.map((item: CompanyChannelForManagerResponseDto) => {
                  if (item.type === 0 && item.isHaveToken) {
                    setWhatsAppLinked(true)
                  }
                  setData(item)
                })
              }
            }, 300)
            message.success(t('DoneSuccessfully'), 5)
          }, t('AreYouSureYouWantToLinkWithWebhook'))
        },
      }
      : null,
    !data?.isHaveTemplateDailyConnect
      ? {
        label: <span>{t('LinkDailyTemplate')}</span>,
        key: '1',
        onClick: async () => {
          popupConfirm(async () => {
            await channelsServiceInstance.dailyTemplateConnect(currentTenant === 'bialahcamp')
            setTimeout(async () => {
              let res: CompanyChannelForManagerResponseDto[] =
                await channelsServiceInstance.getChannelsForManager(
                  currentTenant === 'bialahcamp'
                )
              if (res.length > 0) {
                res?.map((item: CompanyChannelForManagerResponseDto) => {
                  if (item.type === 0 && item.isHaveToken) {
                    setWhatsAppLinked(true)
                  }
                  setData(item)
                })
              }
            }, 300)
            message.success(t('DoneSuccessfully'), 5)
          }, t('AreYouSureYouWantToLinkDailyTemplate'))
        },
      }
      : null,
    !data?.isRegisteredNumber || data?.isRegisteredNumber
      ? {
        label: <span>{t('RegisterNumberWithMeta')}</span>,
        key: '10',
        onClick: async () => {
          popupConfirm(async () => {
            await channelsServiceInstance.registerPhoneNumber(currentTenant === 'bialahcamp')
            setTimeout(async () => {
              let res: CompanyChannelForManagerResponseDto[] =
                await channelsServiceInstance.getChannelsForManager(
                  currentTenant === 'bialahcamp'
                )
              if (res.length > 0) {
                res?.map((item: CompanyChannelForManagerResponseDto) => {
                  if (item.type === 0 && item.isHaveToken) {
                    setWhatsAppLinked(true)
                  }
                  setData(item)
                })
              }
            }, 300)
            message.success(t('DoneSuccessfully'), 5)
          }, t('AreYouSureYouWantToRegisterNumberWithMeta'))
        },
      }
      : null,
  ]

  return loadingData ? (
    <Loader />
  ) : (
    <div className="overflow-hidden w-full">
      {success && response && WhatsAppLinked && <Fireworks />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-4">
        {grantedPolicies?.includes('ChannelsManagement.Channels.ConnectWhatsApp') && (
          <Card className="shadow-[0_4px_20px_rgba(0,0,0,0.02)] w-full h-full rounded-2xl border border-slate-100/80 bg-gradient-to-br from-[#f4fdf8] to-[#d1fae5] relative overflow-hidden hover:border-[#25D366]/20 [&_.ant-card-body]:!p-0 [&_.ant-card-body]:h-full [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col [&_.ant-card-body]:justify-between">
            <CardHeader className="p-6">
              <div className="flex gap-4 items-start text-start w-full justify-between">
                <div className="flex gap-4 items-start text-start flex-1 min-w-0">
                  <div className="w-[60px] h-[60px] rounded-xl border border-slate-200/80 p-2 bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <Image
                      width={37}
                      height={37}
                      preview={false}
                      alt={'whatsapp'}
                      src="/images/whatsapp-logo.png"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1 min-w-0 text-start">
                    <h2 className="font-bold text-[17px] text-slate-800 m-0 leading-tight">{t('WhatsApp')}</h2>
                    <p className="text-slate-400 text-[12px] leading-snug m-0 line-clamp-2">
                      {t('ConnectWithUsersThroughWhatsAppBusinessAPI')}
                    </p>
                  </div>
                </div>
                {(!data?.isHaveTemplateDailyConnect ||
                  !data?.isLinkedWebhook ||
                  !data?.isRegisteredNumber) &&
                  data?.isHaveToken && (
                    <Dropdown
                      menu={{ items }}
                      className="cursor-pointer shrink-0 ml-2"
                      placement="bottomCenter"
                      trigger={['click']}
                    >
                      <MoreVertical size={20} className="text-slate-600 hover:text-slate-800 transition-colors" />
                    </Dropdown>
                  )}
              </div>
            </CardHeader>
            <div className="mt-auto p-4 px-6 flex items-center justify-between bg-gradient-to-r from-white/60 to-white/20 border-t border-slate-100/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                {data?.isHaveToken && (
                  <>
                    <Tooltip
                      title={
                        data?.isHaveTemplateDailyConnect
                          ? t('HaveTemplateDailyConnect')
                          : t('NotHaveTemplateDailyConnect')
                      }
                    >
                      {data?.isHaveTemplateDailyConnect ? (
                        <BookCheck
                          size={12}
                          className="border-2 p-[6px] bg-primary border-primary text-white transition-all rounded-[6px] w-[33px] h-[33px] cursor-pointer"
                        />
                      ) : (
                        <BookX
                          size={12}
                          className="border-2 p-[6px] bg-red-700 border-red-700 text-white transition-all rounded-[6px] w-[33px] h-[33px] cursor-pointer"
                        />
                      )}
                    </Tooltip>
                    <Tooltip
                      title={
                        data?.isLinkedWebhook ? t('LinkedWithWebhook') : t('NotLinkedWithWebhook')
                      }
                    >
                      {data?.isLinkedWebhook ? (
                        <Webhook
                          size={12}
                          className="border-2 bg-primary border-primary text-white transition-all rounded-[6px] w-[33px] h-[33px] cursor-pointer p-[6px]"
                        />
                      ) : (
                        <WebhookOff
                          size={12}
                          className="border-2 bg-red-700 border-red-700 text-white transition-all rounded-[6px] w-[33px] h-[33px] cursor-pointer p-[6px]"
                        />
                      )}
                    </Tooltip>
                    <Tooltip
                      title={
                        data?.isRegisteredNumber
                          ? t('IsRegisteredNumber')
                          : t('NotIsRegisteredNumber')
                      }
                    >
                      {data?.isRegisteredNumber ? (
                        <Phone
                          size={12}
                          className="border-2 bg-primary border-primary text-white transition-all rounded-[6px] w-[33px] h-[33px] cursor-pointer p-[6px]"
                        />
                      ) : (
                        <PhoneOff
                          size={12}
                          className="border-2 bg-red-700 border-red-700 text-white transition-all rounded-[6px] w-[33px] h-[33px] cursor-pointer p-[6px]"
                        />
                      )}
                    </Tooltip>
                  </>
                )}
              </div>
              <Button type="primary" disabled={!sdkLoaded} onClick={launchWhatsAppSignup}>
                {WhatsAppLinked ? t('ReConnectViaMeta') : t('ConnectViaMeta')}
              </Button>
            </div>
          </Card>
        )}

        {comingSoonChannels.map((item) => (
          <ComingSoonCard key={item.key} item={item} lng={lng} t={t} />
        ))}
      </div>
    </div>
  )
}
