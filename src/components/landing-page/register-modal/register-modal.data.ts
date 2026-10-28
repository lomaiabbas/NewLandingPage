import { languages } from '@/app/i18n/settings'

/* `?register=1` opens the modal, so a link to it can be shared */
export const REGISTER_QUERY_PARAM = 'register'

const REGISTER_PATH = new RegExp(`^/(${languages.join('|')})/register/?$`)

/** true for a same-origin link to the /register page or to `?register=1` */
export const isRegisterHref = (href: string) => {
  const url = new URL(href, window.location.href)
  return (
    url.origin === window.location.origin &&
    (REGISTER_PATH.test(url.pathname) || url.searchParams.get(REGISTER_QUERY_PARAM) === '1')
  )
}

/* in tab order; the first invalid one in this order gets focus on submit */
export const EMPTY_REGISTER_VALUES = {
  companyName: '',
  subdomain: '',
  // countryId: '',
  // cityId: '',
  // phone: '',
  // firstName: '',
  // lastName: '',
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

export type RegisterValues = typeof EMPTY_REGISTER_VALUES
export type RegisterField = keyof RegisterValues

export const REGISTER_FIELDS = Object.keys(EMPTY_REGISTER_VALUES) as RegisterField[]

/* the phone prefix before the country-code list loads, as on the /register page */
export const DEFAULT_DIAL_ISO = 'SA'
export const DEFAULT_DIAL_CODE = '+966'

/* The only countries the phone code list offers, in this order. Set here rather than loaded from
   the backend's country-code list, which offers others. */
export const DIAL_COUNTRIES = [
  { iso: 'SA', dialCode: '+966', ar: 'السعودية', en: 'Saudi Arabia' },
  { iso: 'AE', dialCode: '+971', ar: 'الإمارات العربية المتحدة', en: 'United Arab Emirates' },
  { iso: 'KW', dialCode: '+965', ar: 'الكويت', en: 'Kuwait' },
  { iso: 'NL', dialCode: '+31', ar: 'هولندا', en: 'Netherlands' },
]

/* The phone codes the /register page offers: the backend's active country-code list as it stood on
   2026-10-26. Only used when that list can't be loaded, so the dropdown never offers more than the
   /register page did. */
export const FALLBACK_DIAL_ISOS = ['SA', 'AE', 'JO', 'SY', 'NL', 'LB', 'ES', 'GB', 'DE', 'CA', 'DZ']

/* the order the /register page's phone dropdown puts these first in (components/panel/phone-input.tsx) */
export const PRIORITY_DIAL_ISOS = ['sa', 'ae', 'kw', 'qa', 'bh', 'om', 'nl']

export const SUBDOMAIN_MIN_LENGTH = 3
/* a DNS label can't be longer */
export const SUBDOMAIN_MAX_LENGTH = 63

/* Stand-ins for the sign-up fields the modal doesn't ask for. The backend's sign-up request
   (CompanySignUpForManagerRequest) still carries them; the company enters the real values later, in
   the "complete info" step, and until then the admin reviewing the request sees these. Edit them
   here. The issuance date and the address are filled in at submit time (see buildSignupPayload). */
export const SIGNUP_PLACEHOLDERS = {
  commercialNumber: '0000000000',
  // the admin review page shows "not available" for an empty document; a made-up URL would show
  // a broken PDF instead
  bankInfo_RegularLicensingDocUrl: null,
  link: null,
  // the admin map falls back to its default location when these are empty
  latitude: null,
  longitude: null,
}

/* The modal no longer asks for the country and the city: every sign-up goes in as Riyadh, Saudi
   Arabia. 6 is Riyadh in the backend's location list (a city of country 1, Saudi Arabia). */
export const SIGNUP_DEFAULT_LOCATION = {
  cityId: 6,
  address: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
}

/* Backend error codes (and the members of validation errors) → the field the error belongs under.
   First match wins. Where a translation key is given it replaces the backend's own message. */
export const SIGNUP_ERROR_FIELDS: { match: RegExp; field: RegisterField; messageKey?: string }[] = [
  { match: /DomainAlreadyExists/i, field: 'subdomain', messageKey: 'RegisterModalDomainTaken' },
  { match: /EmailAlreadyExists/i, field: 'email', messageKey: 'RegisterModalEmailTaken' },
  { match: /PhoneNumberAlreadyExists/i, field: 'phone', messageKey: 'RegisterModalPhoneTaken' },
  { match: /Domain/i, field: 'subdomain' },
  { match: /Email/i, field: 'email' },
  { match: /Phone|CountryCode/i, field: 'phone' },
  { match: /Password/i, field: 'password' },
  { match: /ArName|EnName/i, field: 'companyName' },
  // { match: /SureName|LastName/i, field: 'lastName' },
  // { match: /(^|[:.])Name/i, field: 'firstName' },
  // { match: /City/i, field: 'cityId' },
  // first and last name are one field now
  { match: /SureName|LastName|(^|[:.])Name/i, field: 'fullName' },
]
