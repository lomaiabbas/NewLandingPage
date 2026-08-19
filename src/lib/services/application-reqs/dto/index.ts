import { ApplicationRequestStatus, IndustryType } from '../../dto'

export interface GetAllPayload {
  name?: string
  code?: string
  phoneNumber?: string
  maxResultCount?: number
  skipCount?: number
  sorting?: string
  status?: ApplicationRequestStatus
  industry?: IndustryType
  cityId?: number
  id?: string
}

export interface GetAllApplicationReqsResponse {
  id: number
  arName: string
  managerInfo: any
  latitude: any
  industry: number
  enName: string
  code: string
  status: ApplicationRequestStatus
  arLogo: string
  enLogo: string
  cityId: number
  isActive: boolean
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

export interface CreateOrUpdateApplicationReqDto {
  address: string
  arName: string
  cityId: number
  commercialNumber: string
  commercialNumberIssuanceDate: Date
  enName: string
  latitude: number
  link: string
  longitude: number
  managerInfo: {
    name: string
    countryCode: string
    phoneNumber: string
    email: string
    password: string
  }
  subDomainName: string
}

export interface ApplicationRequestDto {
  id: number
  arName: string
  enName: string
  code: string
  isVerified: boolean
  status: ApplicationRequestStatus
  cityId: number
  industry: IndustryType
  subDomainName: string
  longitude: number
  latitude: number
  address: string
  primaryColor: string
  commercialNumber: string
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
  actions: any[]
}
