import type { AxiosRequestConfig } from 'axios'
import http from '../httpService'

/* The landing page's public forms (contact us, sign-up request).

   Contact us is the real backend endpoint (POST /api/contact-us, no login needed).
   The sign-up endpoints below are still PROPOSED names and shapes, to be confirmed with the backend
   team; with NEXT_PUBLIC_LANDING_FORMS_API unset the sign-up form only moves between its steps and
   sends nothing. Set NEXT_PUBLIC_LANDING_FORMS_API=true once they exist. */
export const LANDING_FORMS_API_READY = process.env.NEXT_PUBLIC_LANDING_FORMS_API === 'true'

const ENDPOINTS = {
  contact: 'api/contact-us',
  signupSendOtp: 'api/app/signup-requests/send-otp',
  signupVerify: 'api/app/signup-requests/verify',
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
}

export interface ContactResultDto {
  success: boolean
  message?: string | null
}

export interface SignupOtpRequestDto {
  /** international format with the country code, e.g. +9665XXXXXXXX */
  phoneNumber: string
}

export interface SignupVerifyDto {
  companyName: string
  contactName: string
  phoneNumber: string
  /** the 6-digit code sent over WhatsApp */
  code: string
}

// skipErrorHandler: the form shows the error itself instead of httpService's global popup
const OPTIONS: AxiosRequestConfig & { skipErrorHandler?: boolean } = { skipErrorHandler: true }

class LandingRequestsService {
  public async sendContactRequest(input: ContactRequestDto): Promise<ContactResultDto> {
    const result = await http.post<ContactResultDto>(ENDPOINTS.contact, input, OPTIONS)
    return result.data
  }

  public async sendSignupOtp(input: SignupOtpRequestDto): Promise<void> {
    await http.post(ENDPOINTS.signupSendOtp, input, OPTIONS)
  }

  /** checks the code and, if it is right, records the sign-up request */
  public async verifySignup(input: SignupVerifyDto): Promise<void> {
    await http.post(ENDPOINTS.signupVerify, input, OPTIONS)
  }
}

const landingRequestsServiceInstance = new LandingRequestsService()
export default landingRequestsServiceInstance
