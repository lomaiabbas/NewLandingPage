import { ActiveStatus, IndustryType } from '../../dto'

export interface GetAllPayload {
  name?: string
  id?: string
  phoneNumber?: string
  maxResultCount?: number
  skipCount?: number
  sorting?: string
  status?: ActiveStatus
  industry?: IndustryType
  hasChannel?: boolean
}

export interface GetAllCompaniesForAdminResponseDto {
  id: number
  arName: string
  enName: string
  code: string
  isVerified: boolean
  isActive: boolean
  isSendingTemplatesEnabled: boolean
  showInLandingPage?: boolean
  status: ActiveStatus
  arLogo: string
  enLogo: string
  cityId: number
  city: {
    value: string
    text: string
    flag: string
    country: {
      value: string
      text: string
      flag: string
    }
  }
}

export interface CompanyDto {
  id: number
  arName: string
  enName: string
  primaryColor: string
  code: string
  isVerified: boolean
  status: ActiveStatus
  cityId: number
  industry: IndustryType
  subDomainName: string
  longitude: number
  latitude: number
  address: string
  commercialNumber: string,
  showInLandingPage: boolean,
  commercialNumberIssuanceDate: Date
  link: string
  arDescription: string
  enDescription: string
  size: string
  countryCode: string
  phoneNumber: string
  email: string
  arLogo: string
  enLogo: string
  bankInfo: {
    bankId: string
    accountNumber: string
    taxNumber: string
    // commercialRecordNumber: string;
    regularLicensingDocUrl: string
    // documentIssueDate: string;
    // documentExpiryDate: string;
  }
  managerInfo: {
    name: string
    countryCode: string
    phoneNumber: string
    email: string
    lastName: string
  }
  city: {
    value: string
    text: string
    flag: string
    country: {
      value: string
      text: string
      flag: string
    }
  }
  isSendingTemplatesEnabled: boolean
}

export interface WhatsAppBusinessAccountDto {
  name: string
  isLinkedWebhook: boolean
  phoneNumber: string
  phoneNumberId: string
  qualityRating: string
  arTemplateFlowId: string
  enTemplateFlowId: string
  isSendingTemplatesEnabled: boolean
  isFlowTemplatesEnabled: boolean
  tasksCount?: number
}
