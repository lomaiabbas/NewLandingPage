'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getCookie, saveCookie } from '../helpers'
import { WhatsAppBusinessAccountDto } from '../services/companies/dto'
import settingsServiceInstance from '../services/settings'


interface AppContextType {
  accessToken: string | undefined
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>
  refreshToken: string | undefined
  setRefreshToken: React.Dispatch<React.SetStateAction<string | undefined>>
  grantedPolicies: string[] | undefined
  setGrantedPolicies: React.Dispatch<React.SetStateAction<string[] | undefined>>
  role: string | undefined
  setRole: React.Dispatch<React.SetStateAction<string | undefined>>
  features: any
  setFeatures: React.Dispatch<React.SetStateAction<any>>
  tenant: any
  setTenant: React.Dispatch<React.SetStateAction<string | undefined>>
  companyInfo: any
  setCompanyInfo: React.Dispatch<React.SetStateAction<any>>
  currentUser: any
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>
  currentTenant: any
  setCurrentTenant: React.Dispatch<React.SetStateAction<any>>
  WhatsAppBusinessAccount: WhatsAppBusinessAccountDto | undefined
  setWhatsAppBusinessAccount: React.Dispatch<
    React.SetStateAction<WhatsAppBusinessAccountDto | undefined>
  >
  wallet: any | undefined
  setWallet: React.Dispatch<React.SetStateAction<any | undefined>>
  gatekeepOtp: any | undefined
  setGatekeepOtp: any
  orderNumber: any | undefined
  setOrderNumber: any
  orderPhoneNumber: any | undefined
  setOrderPhoneNumber: any
  orderCountryCode: any | undefined
  setOrderCountryCode: any
  showFlowTemplates: boolean | undefined
  campaignId: any | undefined
  setCampaignId: any
  campaignInfo: any | undefined
  setCampaignInfo: any
  targetChatInfo: any
  setTargetChatInfo: any
  tasksFilterChat: any
  setTasksFilterChat: React.Dispatch<React.SetStateAction<any>>
  tasksCount: number
  setTasksCount: React.Dispatch<React.SetStateAction<number>>
  notificationUnreadCount: number
  setNotificationUnreadCount: React.Dispatch<React.SetStateAction<number>>
  systemTourSettings: any
  setSystemTourSettings: React.Dispatch<React.SetStateAction<any>>
  dismissTour: () => Promise<void>
}

const AppContext = createContext<AppContextType>({
  accessToken: undefined,
  setAccessToken: (val: React.SetStateAction<string | undefined>) => {},
  refreshToken: undefined,
  setRefreshToken: (val: React.SetStateAction<string | undefined>) => {},
  grantedPolicies: undefined,
  setGrantedPolicies: (val: React.SetStateAction<string[] | undefined>) => {},
  role: undefined,
  setRole: (val: React.SetStateAction<string | undefined>) => {},
  features: undefined,
  setFeatures: (val: React.SetStateAction<any>) => {},
  tenant: undefined,
  setTenant: (val: React.SetStateAction<string | undefined>) => {},
  companyInfo: undefined,
  setCompanyInfo: (val: React.SetStateAction<any>) => {},
  currentUser: undefined,
  setCurrentUser: (val: React.SetStateAction<any>) => {},
  currentTenant: undefined,
  setCurrentTenant: (val: React.SetStateAction<any>) => {},
  WhatsAppBusinessAccount: undefined,
  setWhatsAppBusinessAccount: (
    val: React.SetStateAction<WhatsAppBusinessAccountDto | undefined>
  ) => {},
  wallet: undefined,
  setWallet: (val: React.SetStateAction<any | undefined>) => {},
  gatekeepOtp: undefined,
  setGatekeepOtp: (val: string, tokenExpireDate?: Date) => {},
  orderNumber: undefined,
  setOrderNumber: (val: string, tokenExpireDate?: Date) => {},
  orderPhoneNumber: undefined,
  setOrderPhoneNumber: (val: string, tokenExpireDate?: Date) => {},
  orderCountryCode: undefined,
  setOrderCountryCode: (val: string, tokenExpireDate?: Date) => {},
  showFlowTemplates: false,
  campaignId: undefined,
  setCampaignId: (val: string, tokenExpireDate?: Date) => {},
  campaignInfo: undefined,
  setCampaignInfo: (val: any, tokenExpireDate?: Date) => {},
  targetChatInfo: undefined,
  setTargetChatInfo: (val: React.SetStateAction<any>) => {},
  tasksFilterChat: undefined,
  setTasksFilterChat: (val: React.SetStateAction<any>) => {},
  tasksCount: 0,
  setTasksCount: (val: React.SetStateAction<number>) => {},
  notificationUnreadCount: 0,
  setNotificationUnreadCount: (val: React.SetStateAction<number>) => {},
  systemTourSettings: undefined,
  setSystemTourSettings: () => {},
  dismissTour: async () => {},
})

export const AppProvider = ({
  children,
  companyData,
}: {
  children: React.ReactNode
  companyData?: any
}) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const [refreshToken, setRefreshToken] = useState<string | undefined>(undefined)
  const [grantedPolicies, setGrantedPolicies] = useState<string[] | undefined>(undefined)
  const [role, setRole] = useState<string | undefined>(undefined)
  const [features, setFeatures] = useState<any>(undefined)
  const [companyInfo, setCompanyInfo] = useState<any>(undefined)
  const [currentUser, setCurrentUser] = useState<any>(undefined)
  const [currentTenant, setCurrentTenant] = useState<any>(undefined)
  const [tenant, setTenant] = useState<string | undefined>(undefined)
  const [WhatsAppBusinessAccount, setWhatsAppBusinessAccount] = useState<
    WhatsAppBusinessAccountDto | undefined
  >(undefined)
  const [wallet, setWallet] = useState<any | undefined>(undefined)
  const [gatekeepOtp, setGatekeepOtp2] = useState(getCookie('otp-code'))
  const [orderNumber, setOrderNumber2] = useState(getCookie('order-number'))
  const [orderCountryCode, setOrderCountryCode2] = useState(getCookie('order-CountryCode'))
  const [orderPhoneNumber, setOrderPhoneNumber2] = useState(getCookie('order-PhoneNumber'))
  const [campaignId, setCampaignId2] = useState(getCookie('campaign-id'))
  const [campaignInfo, setCampaignInfo2] = useState(getCookie('campaign-info'))
  const [showFlowTemplates, setShowFlowTemplates] = useState<boolean | undefined>(false)
  const [targetChatInfo, setTargetChatInfo2] = useState<any>(undefined)
  const [tasksFilterChat, setTasksFilterChat] = useState<any>(undefined)
  const [tasksCount, setTasksCount] = useState<number>(0)
  const [notificationUnreadCount, setNotificationUnreadCount] = useState<number>(0)
  const [systemTourSettings, setSystemTourSettings] = useState<any>(undefined)

  const dismissTour = async () => {
    if (!systemTourSettings) return
    const version = systemTourSettings.currentVersion || 1
    try {
      await settingsServiceInstance.updateLastSeenTourVersion(version)
      setSystemTourSettings((prev: any) =>
        prev ? { ...prev, shouldShowTour: false } : prev
      )
    } catch (error) {
      console.error('Failed to dismiss tour:', error)
    }
  }

  useEffect(() => {
    if (companyData) setCompanyInfo(companyData)
  }, [companyData])

  useEffect(() => {
    if (
      !tenant ||
      (tenant && WhatsAppBusinessAccount && WhatsAppBusinessAccount?.isFlowTemplatesEnabled)
    ) {
      setShowFlowTemplates(true)
    }
    if (tenant && WhatsAppBusinessAccount && !WhatsAppBusinessAccount?.isFlowTemplatesEnabled) {
      setShowFlowTemplates(false)
    }
  }, [WhatsAppBusinessAccount, tenant])

  const setGatekeepOtp = (val: string, tokenExpireDate?: number) => {
    saveCookie('otp-code', val, tokenExpireDate)
    setGatekeepOtp2(val)
  }
  const setOrderPhoneNumber = (val: string, tokenExpireDate?: number) => {
    saveCookie('order-PhoneNumber', val, tokenExpireDate)
    setOrderPhoneNumber2(val)
  }
  const setOrderCountryCode = (val: string, tokenExpireDate?: number) => {
    saveCookie('order-CountryCode', val, tokenExpireDate)
    setOrderCountryCode2(val)
  }

  const setOrderNumber = (val: string, tokenExpireDate?: number) => {
    saveCookie('order-number', val, tokenExpireDate)
    setOrderNumber2(val)
  }

  const setCampaignId = (val: string, tokenExpireDate?: number) => {
    saveCookie('campaign-id', val, tokenExpireDate)
    setCampaignId2(val)
  }

  const setCampaignInfo = (val: any, tokenExpireDate?: number) => {
    saveCookie('campaign-info', val, tokenExpireDate)
    setCampaignInfo2(val)
  }

  const setTargetChatInfo = (val: any) => {
    setTargetChatInfo2(val)
  }

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      setAccessToken,
      setRefreshToken,
      grantedPolicies,
      features,
      setFeatures,
      setGrantedPolicies,
      tenant,
      setTenant,
      companyInfo,
      setCompanyInfo,
      role,
      setRole,
      WhatsAppBusinessAccount,
      setWhatsAppBusinessAccount,
      wallet,
      setWallet,
      gatekeepOtp,
      setGatekeepOtp,
      orderNumber,
      setOrderNumber,
      orderCountryCode,
      setOrderCountryCode,
      orderPhoneNumber,
      setOrderPhoneNumber,
      currentUser,
      setCurrentUser,
      currentTenant,
      setCurrentTenant,
      showFlowTemplates,
      campaignId,
      setCampaignId,
      campaignInfo,
      setCampaignInfo,
      targetChatInfo,
      setTargetChatInfo,
      tasksFilterChat,
      setTasksFilterChat,
      tasksCount,
      setTasksCount,
      notificationUnreadCount,
      setNotificationUnreadCount,
      systemTourSettings,
      setSystemTourSettings,
      dismissTour,
    }),
    [
      refreshToken,
      accessToken,
      features,
      grantedPolicies,
      tenant,
      companyInfo,
      role,
      WhatsAppBusinessAccount,
      wallet,
      orderNumber,
      gatekeepOtp,
      orderCountryCode,
      orderPhoneNumber,
      currentUser,
      currentTenant,
      showFlowTemplates,
      campaignId,
      campaignInfo,
      targetChatInfo,
      tasksFilterChat,
      tasksCount,
      notificationUnreadCount,
      systemTourSettings,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
