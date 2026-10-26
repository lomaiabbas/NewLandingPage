import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { validateEmail, validatePhone } from '@/lib/rules'
import { SignupDto } from '@/lib/services/companies-for-manager/dto'
import { CountryCodeDto } from '@/lib/services/countries-codes/dto'
import {
  getExampleNumber,
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  type CountryCode,
} from 'libphonenumber-js'
import examples from 'libphonenumber-js/mobile/examples'
import {
  PRIORITY_DIAL_ISOS,
  SIGNUP_ERROR_FIELDS,
  SIGNUP_PLACEHOLDERS,
  SUBDOMAIN_MAX_LENGTH,
  SUBDOMAIN_MIN_LENGTH,
  type RegisterField,
  type RegisterValues,
} from './register-modal.data'

/* lower-case latin letters, digits and "-" only: anything else is dropped as it's typed */
export const sanitizeSubdomain = (value: string) =>
  resolvePersianAndArabicNumbers(value)
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, SUBDOMAIN_MAX_LENGTH)

export const sanitizePhone = (value: string) =>
  resolvePersianAndArabicNumbers(value).replace(/\D/g, '').slice(0, 15)

/* People often type the local trunk 0 after the country code ("+962 079…"). libphonenumber accepts
   that as valid, so the backend is sent its national number instead, which leaves the 0 out
   (and keeps it in the countries whose numbers really start with one). */
export const toNationalNumber = (dialCode: string, digits: string) =>
  parsePhoneNumberFromString(dialCode + digits)?.nationalNumber ?? digits

/** what's wrong with a field: a translation key, and for a password the keys of what it lacks */
export type FieldIssue = { key: string; items?: string[] }

/* the backend's ABP password settings (Abp.Identity.Password.*): 6+ characters with an upper- and
   a lower-case letter, a digit and a character that is neither */
const PASSWORD_RULES: [RegExp, string][] = [
  [/\p{Lu}/u, 'RegisterModalPasswordUpper'],
  [/\p{Ll}/u, 'RegisterModalPasswordLower'],
  [/\p{Nd}/u, 'RegisterModalPasswordDigit'],
  [/[^\p{L}\p{Nd}]/u, 'RegisterModalPasswordSymbol'],
]

function passwordIssue(password: string): FieldIssue | undefined {
  const items = PASSWORD_RULES.filter(([rule]) => !rule.test(password)).map(([, key]) => key)
  if (password.length < 6) {
    return items.length
      ? { key: 'RegisterModalPasswordShortAndMissing', items }
      : { key: 'RegisterModalPasswordTooShort' }
  }
  return items.length ? { key: 'RegisterModalPasswordMissing', items } : undefined
}

/* the /register page's rule (validateEmail) decides; this only says what's wrong */
function emailIssue(email: string): FieldIssue | undefined {
  if (!validateEmail(email).errorMsg) return undefined
  if (/\s/.test(email)) return { key: 'RegisterModalEmailSpaces' }
  if (/[^\x20-\x7E]/.test(email)) return { key: 'RegisterModalEmailLatin' }
  const at = email.indexOf('@')
  if (at === -1) return { key: 'RegisterModalEmailNoAt' }
  if (at === 0) return { key: 'RegisterModalEmailNoName' }
  if (email.indexOf('@', at + 1) === -1 && !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.slice(at + 1))) {
    return { key: 'RegisterModalEmailNoDomain' }
  }
  return { key: 'RegisterModalEmailInvalid' }
}

/* the /register page's rule (validatePhone) decides; this only says what's wrong */
function phoneIssue(dialCode: string, digits: string): FieldIssue | undefined {
  const number = dialCode + toNationalNumber(dialCode, digits)
  if (!validatePhone(number).errorMsg) return undefined
  const length = validatePhoneNumberLength(number)
  if (length === 'TOO_SHORT') return { key: 'RegisterModalPhoneTooShort' }
  if (length === 'TOO_LONG') return { key: 'RegisterModalPhoneTooLong' }
  return { key: 'RegisterModalPhoneInvalid' }
}

export function validateRegisterField(
  field: RegisterField,
  values: RegisterValues,
  dialCode: string
): FieldIssue | undefined {
  const value = values[field]
  // the city list only fills in once a country is picked
  if (field === 'cityId' && !values.countryId) return { key: 'RegisterModalCountryFirst' }
  if (!value.trim()) return { key: 'ThisFieldIsMandatory' }

  switch (field) {
    case 'subdomain':
      if (value.length < SUBDOMAIN_MIN_LENGTH) return { key: 'RegisterModalDomainTooShort' }
      if (value.startsWith('-') || value.endsWith('-')) {
        return { key: 'RegisterModalDomainHyphenEdge' }
      }
      return undefined
    case 'phone':
      return phoneIssue(dialCode, value)
    case 'email':
      return emailIssue(value.trim())
    case 'password':
      return passwordIssue(value)
    case 'confirmPassword':
      return value === values.password
        ? undefined
        : { key: 'TheTwoPasswordsThatYouEnteredDoNotMatch' }
    default:
      return undefined
  }
}

export const sortCountryCodes = (codes: CountryCodeDto[]) =>
  [...codes].sort((a, b) => {
    const ai = PRIORITY_DIAL_ISOS.indexOf(a.iso2Code?.toLowerCase())
    const bi = PRIORITY_DIAL_ISOS.indexOf(b.iso2Code?.toLowerCase())
    if (ai !== -1 || bi !== -1) return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi)
    return a.name.localeCompare(b.name)
  })

const regionNames: Record<string, Intl.DisplayNames | null> = {}
const regionName = (locale: string, iso2: string) => {
  try {
    regionNames[locale] ??= new Intl.DisplayNames([locale], { type: 'region' })
    return regionNames[locale]?.of(iso2.toUpperCase()) ?? ''
  } catch {
    regionNames[locale] = null
    return ''
  }
}

const normalizeName = (name: string) =>
  name
    .normalize('NFKD')
    .replace(/\p{M}|ـ/gu, '')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()

const initials = (name: string) =>
  name
    .split(' ')
    .map((word) => word[0])
    .join('')

/* The countries list (location/lite) has no dial codes; they live in the separate country-code list,
   whose names don't always match it ("UAE" / "United Arab Emirates", "المملكة العربية السعودية" /
   "السعودية"). So every name a code has, in both languages, is tried: exact, then one name inside
   the other, then initials. */
export function findCountryCode(countryName: string, codes: CountryCodeDto[]) {
  const target = normalizeName(countryName)
  if (!target) return undefined

  const named = codes.map((code) => ({
    code,
    names: [
      code.name,
      code.arName,
      code.enName,
      regionName('ar', code.iso2Code),
      regionName('en', code.iso2Code),
    ]
      .filter(Boolean)
      .map(normalizeName),
  }))
  const compact = target.replace(/\s/g, '')

  return (
    named.find(({ names }) => names.includes(target)) ??
    named.find(({ names }) =>
      names.some(
        (name) =>
          Math.min(name.length, target.length) > 3 &&
          (name.includes(target) || target.includes(name))
      )
    ) ??
    named.find(({ names }) => names.some((name) => name.includes(' ') && initials(name) === compact))
  )?.code
}

/* the country's example mobile number without its code: "+966 51 234 5678" → "51 234 5678" */
export function phoneExample(iso2: string) {
  try {
    const example = getExampleNumber(iso2.toUpperCase() as CountryCode, examples)
    return example?.formatInternational().replace(/^\+\d+\s*/, '') ?? ''
  } catch {
    return ''
  }
}

export function buildSignupPayload({
  values,
  dialCode,
  countryName,
  cityName,
  lng,
}: {
  values: RegisterValues
  dialCode: string
  countryName: string
  cityName: string
  lng: string
}): SignupDto {
  const companyName = values.companyName.trim()

  // today, from the start of the day: the backend rejects an issuance date in the future, and the
  // exact "now" of a device whose clock runs a little ahead of the server's would already be one
  const issuanceDate = new Date()
  issuanceDate.setHours(0, 0, 0, 0)

  return {
    ...SIGNUP_PLACEHOLDERS,
    // the modal asks for one company name; the backend wants it in Arabic and in English
    arName: companyName,
    enName: companyName,
    subDomainName: values.subdomain,
    cityId: Number(values.cityId),
    address: [cityName, countryName].filter(Boolean).join(lng === 'ar' ? '، ' : ', '),
    commercialNumberIssuanceDate: issuanceDate,
    managerInfo: {
      name: values.firstName.trim(),
      lastName: values.lastName.trim(),
      countryCode: dialCode,
      phoneNumber: toNationalNumber(dialCode, values.phone),
      email: values.email.trim(),
      password: values.password,
    },
  }
}

/* An ABP error response → the field it belongs under and what to say. `messageKey` (a translation
   key) wins over `message` (the backend's own, already localized, text). */
export function readSignupError(error: any): {
  field?: RegisterField
  messageKey?: string
  message?: string
} {
  if (!error?.response) return { messageKey: 'CheckNetwork' }

  const info = error.response.data?.error
  if (!info) return { messageKey: 'RegisterModalSubmitError' }

  const fieldOf = (name?: string) =>
    name ? SIGNUP_ERROR_FIELDS.find((rule) => rule.match.test(name)) : undefined

  const byCode = fieldOf(info.code)
  if (byCode) return { field: byCode.field, messageKey: byCode.messageKey, message: info.message }

  for (const validationError of info.validationErrors ?? []) {
    for (const member of validationError?.members ?? []) {
      const byMember = fieldOf(member)
      if (byMember) return { field: byMember.field, message: validationError.message }
    }
  }

  return { message: info.message }
}
