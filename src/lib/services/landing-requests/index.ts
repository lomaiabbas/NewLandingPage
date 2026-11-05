import type { AxiosRequestConfig } from 'axios'
import http from '../httpService'

/* The landing page's public forms (contact us, sign-up request). The backend endpoints below are
   PROPOSED names and shapes, to be confirmed with the backend team; change them here only.

   Until the backend has them, set nothing: with NEXT_PUBLIC_LANDING_FORMS_API unset the forms keep
   their old behaviour (contact opens the mail app, sign-up only moves between its steps), so no
   request reaches the production API. Set NEXT_PUBLIC_LANDING_FORMS_API=true once they exist. */
export const LANDING_FORMS_API_READY = process.env.NEXT_PUBLIC_LANDING_FORMS_API === 'true'

const ENDPOINTS = {
  contact: 'api/app/contact-requests',
  signupSendOtp: 'api/app/signup-requests/send-otp',
  signupVerify: 'api/app/signup-requests/verify',
}

/* Fixed ids for the message type: the same value whatever language the visitor uses, so the
   backend can filter on it. */
export type ContactMessageType = 'Demo' | 'General' | 'Support' | 'Partnership'

export interface ContactRequestDto {
  name: string
  email: string
  messageType: ContactMessageType
  message: string
  company?: string
  phone?: string
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
  public async sendContactRequest(input: ContactRequestDto): Promise<void> {
    await http.post(ENDPOINTS.contact, input, OPTIONS)
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
