import type { AxiosRequestConfig } from 'axios'
import http from '../httpService'

/* The landing page's public forms (contact us, sign-up request). Neither needs a login. */
const ENDPOINTS = {
  contact: 'api/contact-us',
  signupSendOtp: 'api/application-request/send-signup-otp',
  signupVerify: 'api/application-request/verify-signup',
}

/* Fixed ids for the message type, the only values the backend accepts (it rejects anything else
   with ContactUsInvalidMessageType): the same whatever language the visitor uses. */
export type ContactMessageType = 'Demo' | 'General' | 'Support' | 'Partnership'

/* The backend's limits: fullName, email, companyName up to 256 characters, phoneNumber 32,
   message 4000. */
export const CONTACT_LIMITS = { name: 256, email: 256, company: 256, phone: 32, message: 4000 }

export interface ContactRequestDto {
  fullName: string
  email: string
  messageType: ContactMessageType
  message: string
  companyName?: string
  phoneNumber?: string
  /** the chosen solutions (Events, Campaigns, Stores) separated by commas; up to 128 characters */
  solutionType?: string
}

export interface ContactResultDto {
  success: boolean
  message?: string | null
}

export interface SignupOtpRequestDto {
  /** international format with the country code, e.g. +9665XXXXXXXX */
  phoneNumber: string
}

export interface SignupOtpResultDto {
  /** ties the code to this send; a resend issues a new one and voids the previous */
  signupSessionId: string
  expiresInSeconds: number
}

export interface SignupVerifyDto {
  fullName: string
  companyName: string
  phoneNumber: string
  /** exactly 6 digits, kept as a string for leading zeros */
  otpCode: string
  signupSessionId: string
}

export interface SignupApiError {
  /** 0 when the server was not reached */
  status: number
  /** already localized by the server through Accept-Language */
  message?: string
  retryAfterSeconds?: number
  validationErrors: { message: string; members: string[] }[]
}

export function readSignupApiError(error: any): SignupApiError {
  const info = error?.response?.data?.error
  return {
    status: error?.response?.status ?? 0,
    message: info?.message || undefined,
    retryAfterSeconds: info?.data?.retryAfterSeconds,
    validationErrors: info?.validationErrors ?? [],
  }
}

// skipErrorHandler: the form shows the error itself instead of httpService's global popup
const OPTIONS: AxiosRequestConfig & { skipErrorHandler?: boolean; skipAuth?: boolean } = {
  skipErrorHandler: true,
  skipAuth: true,
}

// the language of the response messages and of the WhatsApp message
const withLanguage = (lng: string): typeof OPTIONS => ({
  ...OPTIONS,
  headers: { 'Accept-Language': lng === 'en' ? 'en' : 'ar' },
})

class LandingRequestsService {
  public async sendContactRequest(input: ContactRequestDto): Promise<ContactResultDto> {
    const result = await http.post<ContactResultDto>(ENDPOINTS.contact, input, OPTIONS)
    return result.data
  }

  public async sendSignupOtp(input: SignupOtpRequestDto, lng: string): Promise<SignupOtpResultDto> {
    const result = await http.post<{ data: SignupOtpResultDto }>(
      ENDPOINTS.signupSendOtp,
      input,
      withLanguage(lng)
    )
    return result.data.data
  }

  /** checks the code and, if it is right, records the sign-up request */
  public async verifySignup(input: SignupVerifyDto, lng: string): Promise<number> {
    const result = await http.post<{ data: { applicationRequestId: number } }>(
      ENDPOINTS.signupVerify,
      input,
      withLanguage(lng)
    )
    return result.data.data.applicationRequestId
  }
}

const landingRequestsServiceInstance = new LandingRequestsService()
export default landingRequestsServiceInstance
