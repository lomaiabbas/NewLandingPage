import moment from 'moment'
import Cookies from 'universal-cookie'
import { arabicNumbers, persianNumbers } from './constants'

export const resolvePersianAndArabicNumbers = (str: string) => {
  if (str && typeof str === 'string') {
    for (let i: number = 0; i < 10; i++) {
      str = str.replace(persianNumbers[i], i.toString()).replace(arabicNumbers[i], i.toString())
    }
  }
  return str
}

export const preventString = (str: string) => {
  let str1 = resolvePersianAndArabicNumbers(String(str).replace(/[a-zA-Z\u0621-\u064A\s]/g, ''))
  return str1
}

export const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null // SSR safe

  const cookies = document.cookie?.split('; ') ?? []
  const targetCookie = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  return targetCookie ? targetCookie.split('=')[1] : null
}

export const saveCookie = (key: string, value?: string | undefined, expires?: number) => {
  if (value)
    new Cookies().set(key, value, {
      maxAge: expires,
      path: '/',
    })
  else new Cookies().remove(key)
}

export const renderIndustry = (key: number) => {
  switch (key) {
    case 0:
      return 'Agriculture'
    case 1:
      return 'Automotive'
    case 2:
      return 'Banking'
    case 3:
      return 'Biotechnology'
    case 4:
      return 'Construction'
    case 5:
      return 'Consulting'
    case 6:
      return 'ConsumerGoods'
    case 7:
      return 'Education'
    case 8:
      return 'Energy'
    case 9:
      return 'Entertainment'
    case 10:
      return 'EnvironmentalServices'
    case 11:
      return 'Finance'
    case 12:
      return 'FoodBeverage'
    case 13:
      return 'Government'
    case 14:
      return 'Healthcare'
    case 15:
      return 'Hospitality'
    case 16:
      return 'InformationTechnology'
    case 17:
      return 'Insurance'
    case 18:
      return 'Legal'
    case 19:
      return 'Logistics'
    case 20:
      return 'Manufacturing'
    case 21:
      return 'Media'
    case 22:
      return 'Mining'
    case 23:
      return 'Nonprofit'
    case 24:
      return 'Pharmaceutical'
    case 25:
      return 'RealEstate'
    case 26:
      return 'Recruitment'
    case 27:
      return 'Retail'
    case 28:
      return 'ScienceResearch'
    case 29:
      return 'Software'
    case 30:
      return 'Telecommunications'
    case 31:
      return 'Transportation'
    case 32:
      return 'Utilities'
    case 33:
      return 'Warehousing'
    case 34:
      return 'Wholesale'
    case 35:
      return 'Other'
    case 36:
      return 'EventsManagementEInvitations'
    default:
      return ''
  }
}

export const getMomentLocals = (t: any, lng: string): any => {
  return {
    relativeTime: relativeTimeOfCurrentLanguage(lng),
    meridiem: function (hour: number) {
      if (hour < 12) return t('AM')
      else return t('PM')
    },
  }
}

export const removeWhiteSpaces = (str: string) => {
  return str.replace(/\s/g, '')
}

export const renderDateTime = (dateTime: string | Date, format: string) => {
  const offsetInHours = -new Date().getTimezoneOffset() / 60
  return moment(dateTime).add('hours', offsetInHours).format(format)
}

export const renderDateTimeWithoutFormat = (dateTime: string | Date) => {
  const offsetInHours = -new Date().getTimezoneOffset() / 60
  return moment(dateTime).add('hours', offsetInHours)
}

export const renderDateTimeFromNow = (dateTime: string | Date) => {
  const offsetInHours = -new Date().getTimezoneOffset() / 60
  return moment(dateTime).add('hours', offsetInHours).fromNow()
}

const relativeTimeOfCurrentLanguage = (lng: string): any => {
  if (lng === 'ar')
    return {
      future: 'خلال %s',
      past: 'منذ %s',
      s: 'ثوان قليلة',
      ss: '%d ثوان',
      m: 'دقيقة',
      mm: '%d دقائق',
      h: 'ساعة',
      hh: '%d ساعات',
      d: 'يوم',
      dd: '%d أيام',
      M: 'شهر',
      MM: '%d أشهر',
      y: 'سنة',
      yy: '%d سنوات',
    }
  else
    return {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years',
    }
}

export const setTextAlignment = (message: string) => {
  const arabicRegex = /[\u0600-\u06FF]/

  if (arabicRegex.test(message)) {
    return 'text-right rtl'
  } else {
    return 'text-left ltr'
  }
}

export const renderBodyText = (item: any) => {
  let text = item?.text
  if (item?.example?.[0]?.body_text?.[0]?.length > 0) {
    let index = 0
    for (let i of item?.example?.[0]?.body_text?.[0]) {
      text = text?.replace(`{{${index + 1}}}`, i)
      index++
    }
  }
  return replaceURLInString(text)
}

export const renderBodyText3 = (item: any) => {
  let text = item?.text
  if (item?.example?.body_text?.[0]?.length > 0) {
    let index = 0
    for (let i of item?.example?.body_text?.[0]) {
      text = text?.replace(`{{${index + 1}}}`, i)
      index++
    }
  }
  return replaceURLInString(text)
}

export const renderBodyText2 = (item: any) => {
  let text = item?.data || ''
  if (item?.parameters?.length > 0) {
    let index = 0
    for (let i of item?.parameters) {
      text = text?.replace(`{{${index + 1}}}`, i)
      index++
    }
  }

  return replaceURLInString(text)
}

export const moveToFirst = (arr: any[], phoneNumber: string) => {
  return arr.sort((a, b) =>
    a.phoneNumber === phoneNumber ? -1 : b.phoneNumber === phoneNumber ? 1 : 0
  )
}

export const hasPermission = (grantedPolicies: string[] | undefined, checkedPermission: string) => {
  return grantedPolicies?.includes(checkedPermission)
}

export const replaceURLInString = (input: string) => {
  return input?.replace(
    /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?)/g,
    (match, url) => {
      const href = url.startsWith('http') ? url : `https://${url}`
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`
    }
  )
}

export const replaceAsterisksWithBold = (text: string) => {
  return text.replace(/\*(.*?)\*/g, '<b>$1</b>')
}

export const resolvePageTitle = (pathWithQS: string, t: any) => {
  let path = pathWithQS.replace(/\?#.*$/, '')
  if (path.endsWith('admin')) {
    return t('Analytics1')
  } else if (path.includes('/application-requests/')) {
    return t('ApplicationRequestInfo')
  } else if (path.endsWith('/application-requests')) {
    return t('ApplicationReqs')
  } else if (path.includes('/companies/managers/')) {
    return t('CompanyManagerInfo')
  } else if (path.endsWith('/companies/managers')) {
    return t('CompaniesManagers')
  } else if (path.includes('/companies/staff/')) {
    return t('CompanyStaffInfo')
  } else if (path.endsWith('/companies/staff')) {
    return t('CompaniesStaff')
  } else if (path.includes('/companies/')) {
    return t('CompanyInfo')
  } else if (path.endsWith('/companies')) {
    return t('Companies')
  } else if (path.endsWith('financial-management/credits')) {
    return t('CompaniesCredits')
  } else if (path.endsWith('financial-management/billing')) {
    return t('CompaniesBilling')
  } else if (path.endsWith('conversations/clients')) {
    return t('ClientsConversations')
  } else if (path.endsWith('conversations/team')) {
    return t('TeamConversations')
  } else if (
    path.includes('tools/templates/') ||
    path.includes('tools/sent-templates/') ||
    path.includes('tools/scheduled-templates/')
  ) {
    return t('TemplateInfo')
  } else if (path.endsWith('tools/templates')) {
    return t('Templates')
  } else if (path.includes('tools/campaigns/')) {
    return t('CampaignDetails')
  } else if (path.endsWith('tools/campaigns')) {
    return t('Campaigns')
  } else if (path.includes('tools/occasions/')) {
    return t('OccasionDetails')
  } else if (path.endsWith('tools/occasions')) {
    return t('Occasions')
  } else if (path.endsWith('tools/sent-templates')) {
    return t('SentTemplates')
  } else if (path.endsWith('tools/scheduled-templates')) {
    return t('ScheduledTemplates')
  } else if (path.endsWith('tools/sent-einvitations')) {
    return t('SentEInvitations')
  } else if (
    path.includes('tools/sent-einvitations/') ||
    path.includes('tools/scheduled-einvitations/')
  ) {
    return t('SentInvitationTemplateInfo')
  } else if (path.endsWith('content/ready-messages')) {
    return t('ReadyMessages')
  } else if (path.endsWith('content/documents')) {
    return t('Documents')
  } else if (path.includes('contacts-management/contacts/')) {
    return t('ContactInfo')
  } else if (path.endsWith('contacts-management/contacts')) {
    return t('Contacts')
  } else if (path.includes('contacts-management/groups/')) {
    return t('GroupInfo')
  } else if (path.endsWith('contacts-management/groups')) {
    return t('Groups')
  } else if (path.includes('staff-management/staff/')) {
    return t('StaffInfo')
  } else if (path.endsWith('staff-management/staff')) {
    return t('Staff')
  } else if (path.includes('staff-management/roles/')) {
    return t('RoleInfo')
  } else if (path.endsWith('staff-management/roles')) {
    return t('Roles')
  } else if (path.endsWith('account-activity')) {
    return t('AccountActivity1')
  } else if (path.endsWith('administration/banks')) {
    return t('Banks')
  } else if (path.endsWith('administration/countries-codes')) {
    return t('CountriesCodes')
  } else if (path.endsWith('administration/settings')) {
    return t('Settings')
  } else if (path.endsWith('administration/locations/countries')) {
    return t('Countries')
  } else if (path.endsWith('administration/locations/cities')) {
    return t('Cities')
  } else if (path.endsWith('dynamic-templates')) {
    return t('EInvitationDynamicTemplates')
  } else if (path.endsWith('invitation-owner')) {
    return t('InvitationOwner')
  }

  return t('Home')
}

export const isImageUrl = (url: string) => {
  const imageUrlRegex = /\.(jpeg|jpg|gif|png|webp|bmp|tiff|svg)(\?.*)?$/i
  return imageUrlRegex.test(url)
}

export const resolveNotificationPathName = (item: any) => {
  switch (item.name) {
    case 'PlaceAJoiningRequest':
    case 'PlaceAJoiningRequestByCompanyToAdmin':
    case 'CompanyDataComplitionByCompanyToAdmin':
    case 'EditCompanyJoiningRequestDataByCompanyToAdmin':
    case 'EditDataCompanyBeforeWaitingForLaunchByCompanyToAdmin':
      return `/admin/companies/application-requests/${item.entityId}`
    case 'EditStaffInformationByAdminToStaff':
    // case 'EditRoleByAdminToStaff':
    //   return `/admin/staff-management/staff/${item.entityId}`
    case 'ActivateStaffByAdminToStaff':
    case 'DeactivateStaffByAdminToStaff':
    case 'ActivateCompanyByAdminToCompany':
    case 'DeactivateCompanyByAdminToCompany':
    case 'ActivateCompanyManagerByAdminToCompany':
    case 'DeactivateCompanyManagerByAdminToCompany':
    case 'ResetPasswardForCompanyManagerByAdminToCompany':
    case 'ActivateStaffManagerByAdminToCompany':
    case 'DeactivateStaffManagerByAdminToCompany':
    case 'ResetPasswardForStaffManagerByAdminToCompany':
      return `/admin/`
    case 'LinkWithTheChannelByCompanyToAdmin':
      return `/admin/companies/${item.entityId}`
    case 'JoiningRequestBeenApprovedByAdminToCompany':
    case 'ManageFeatureEditAddOrDeleteFeaturesByAdminToCompany':
      return `/admin/dashboard`
    case 'EditCompanyInfoByAdminToCompany':
    case 'EditCompanyManagerInfoByAdminToCompany':
    case 'EditCompanyStaffInfoByAdminToCompany':
      return `/admin/my-profile`
    case 'AddCreditByAdminToCompany':
      return '/admin/usage/topup-credits'
    case 'BillingSettilingByAdminToCompany':
    case 'BillingIssuedByAdminToCompany':
      return '/admin/usage/billing'
    default:
      return ''
  }
}

export const resolveFirstGrantedRoute = (policies: string[]) => {
  if (policies?.includes('CompaniesManagement.ApplicationRequests')) {
    return 'companies/application-requests'
  } else if (policies?.includes('CompaniesManagement.Companies')) {
    return 'companies'
  } else if (policies?.includes('CompaniesManagement.CompanyStaff')) {
    return 'companies/staff'
  } else if (policies?.includes('CompaniesManagement.CompanyManager')) {
    return 'companies/managers'
  } else if (policies?.includes('FinancialManagement.CompaniesBilling')) {
    return 'financial-management/billing'
  } else if (policies?.includes('FinancialManagement.CompaniesCredits')) {
    return 'financial-management/credits'
  } else if (
    policies?.includes('ChatsManagementForHost.Clients') ||
    policies?.includes('ChatsManagement.Clients')
  ) {
    return 'conversations/clients'
  } else if (
    policies?.includes('ChatsManagementForHost.Staff') ||
    policies?.includes('ChatsManagement.Staff')
  ) {
    return 'conversations/team'
  } else if (
    policies?.includes('ToolsManagement.TemplatesForHost') ||
    policies?.includes('ToolsManagement.Templates')
  ) {
    return 'tools/templates'
  } else if (
    policies?.includes('ToolsManagement.Campaigns') ||
    policies?.includes('ToolsManagement.CampaignsFortHost')
  ) {
    return 'tools/campaigns'
  } else if (
    policies?.includes('ToolsManagement.Occasions') ||
    policies?.includes('ToolsManagement.OccasionsFortHost')
  ) {
    return 'tools/occasions'
  } else if (
    policies?.includes('ToolsManagement.SentTemplatesFortHost') ||
    policies?.includes('ToolsManagement.SentTemplates')
  ) {
    return 'tools/sent-templates'
  } else if (
    policies?.includes('ToolsManagement.ScheduledTemplatesFortHost') ||
    policies?.includes('ToolsManagement.ScheduledTemplates')
  ) {
    return 'tools/scheduled-templates'
  } else if (
    policies?.includes('ToolsManagement.EInvitationsTemplatesFortHost') ||
    policies?.includes('ToolsManagement.EInvitationsTemplates')
  ) {
    return 'tools/sent-einvitations'
  } else if (
    policies?.includes('ToolsManagement.ScheduledEInvitationsFortHost') ||
    policies?.includes('ToolsManagement.ScheduledEInvitations')
  ) {
    return 'tools/scheduled-einvitations'
  } else if (
    policies?.includes('ContentManagement.ReadyMessagesFortHost') ||
    policies?.includes('ContentManagement.ReadyMessages')
  ) {
    return 'content/ready-messages'
  } else if (
    policies?.includes('ContentManagement.DocumentsFortHost') ||
    policies?.includes('ContentManagement.Documents')
  ) {
    return 'content/documents'
  } else if (
    policies?.includes('ContactsManagement.ContactsForHost') ||
    policies?.includes('ContactsManagement.Contact')
  ) {
    return 'contacts-management/contacts'
  } else if (
    policies?.includes('ContactsManagement.GroupsForHost') ||
    policies?.includes('ContactsManagement.Groups')
  ) {
    return 'contacts-management/groups'
  } else if (
    policies?.includes('StaffManagement.StaffForHost') ||
    policies?.includes('StaffManagement.StaffManagement')
  ) {
    return 'staff-management/staff'
  } else if (
    policies?.includes('StaffManagement.RolesForHost') ||
    policies?.includes('StaffManagement.Roles')
  ) {
    return 'staff-management/roles'
  } else if (policies?.includes('UsageManagement.Billing')) {
    return 'usage/billing'
  } else if (policies?.includes('UsageManagement.Credits')) {
    return 'usage/topup-credits'
  } else if (policies?.includes('AccountActivity.WhatsAppActivityForHost')) {
    return 'account-activity'
  } else if (policies?.includes('AccountActivity.WhatsAppActivity')) {
    return 'activity'
  } else if (policies?.includes('ChannelsManagement.Channels')) {
    return 'channels'
  } else if (policies?.includes('ApiKeysManagement.ApiKeys')) {
    return 'api-keys'
  } else if (policies?.includes('TechnicalSupportManagement.TechnicalSupport')) {
    return 'technical-support'
  } else if (policies?.includes('Administration.Banks')) {
    return 'administration/banks'
  } else if (policies?.includes('Administration.CountryCode')) {
    return 'administration/countries-codes'
  } else if (policies?.includes('Administration.Locations')) {
    return 'administration/locations/countries'
  } else if (policies?.includes('Administration.Settings')) {
    return 'administration/settings'
  } else if (
    policies?.includes('Administration.SettingsForHost') ||
    policies?.includes('Administration.Settings')
  ) {
    return 'admin/settings'
  } else {
    return 'dashboard'
  }
}

export const getInitials = (name: any) => {
  if (!name || !name.trim()) return ''

  // Remove invisible Unicode chars (optional but recommended)
  name = name.replace(/[\u200B-\u200D\uFEFF]/g, '')

  const words = name.trim().split(/\s+/)

  const first = [...words[0]][0]

  if (words.length === 1) {
    return first
  }

  return `${first}`
}

export const formatMessageText = (text: string) => {
  if (!text) return ''

  return (
    text
      // Bold: *text*
      .replace(/\*(.*?)\*/g, '<strong>$1</strong>')

      // Italic: _text_
      .replace(/_(.*?)_/g, '<em>$1</em>')

      // Strike: ~text~
      .replace(/~(.*?)~/g, '<del>$1</del>')

      // Line breaks
      .replace(/\n/g, '<br />')

      // Spaces
      .replace(/ {2}/g, '&nbsp;&nbsp;')
  )
}

export const normalizeWhatsAppError = (errorMessage: string): string => {
  const error = errorMessage?.toLowerCase() || ''

  // 🔴 Generic exception from AtrasLab WhatsApp Business SDK
  // Example: "Exception of type 'AtrasLab.WhatsappBusiness...'"
  if (error.includes('atraslab.whatsappbusiness')) {
    return 'WhatsAppBusinessExceptionMessage'
  }

  // 🔴 Healthy ecosystem (rate limit / spam prevention)
  // Example: "This message was not delivered to maintain healthy ecosystem engagement"
  if (error.includes('healthy ecosystem')) {
    return 'HealthyEcosystemMessage'
  }

  // 🔴 Generic unknown error
  // Example: "(#131000) Something went wrong"
  if (error.includes('(#131000)') || error.includes('something went wrong')) {
    return 'SomethingWentWrongMessage'
  }

  // 🔴 Re-engagement failed
  // Example: "Re-engagement message: Message failed to send"
  if (error.includes('re-engagement message') && error.includes('failed')) {
    return 'ReEngagementFailedMessage'
  }

  // 🔴 Message undeliverable
  // Example: "Message undeliverable: Message Undeliverable"
  if (error.includes('undeliverable')) {
    return 'MessageUndeliverable'
  }

  // 🔴 Invalid parameter
  // Example: "(#100) Invalid parameter"
  if (error.includes('(#100)') || error.includes('invalid parameter')) {
    return 'InvalidParameterMessage'
  }

  // 🔴 Re-engagement expired
  // Example: "Re-engagement expired after 7 days without use"
  if (error.includes('re-engagement expired')) {
    return 'ReEngagementExpiredMessage'
  }

  // 🔴 Experiment restriction
  // Example: "User's number is part of an experiment: Failed to send"
  if (error.includes('part of an experiment')) {
    return 'UserInExperimentGroupMessage'
  }

  // 🔴 Media upload/download failed
  // Example: "Media upload error: Downloading media from web failed"
  if (error.includes('media upload error') || error.includes('downloading media from web failed')) {
    return 'FailedMediaUploadMessage'
  }

  // 🔴 Business payment / eligibility issue
  // Example: "Business eligibility payment issue: Message failed to send"
  if (error.includes('business eligibility payment issue')) {
    return 'BusinessPaymentIssueMessage'
  }

  // 🔴 Spam / rate limit hit
  // Example: "Spam Rate limit hit: Message failed to send"
  if (error.includes('spam rate limit')) {
    return 'SpamRateLimitHitMessage'
  }

  // 🔴 Service unavailable
  // Example: "(#2) Service temporarily unavailable"
  if (error.includes('(#2)') || error.includes('service temporarily unavailable')) {
    return 'ServiceUnavailableMessage'
  }

  // 🔴 Account not registered
  // Example: "(#133010) Account not registered"
  if (error.includes('(#133010)') || error.includes('account not registered')) {
    return 'AccountNotRegisteredMessage'
  }

  // 🔴 Unsupported media type
  // Example: "Media upload error: Unsupported Image mime type"
  if (error.includes('unsupported image mime type')) {
    return 'UnsupportedMediaTypeMessage'
  }

  return errorMessage
}
