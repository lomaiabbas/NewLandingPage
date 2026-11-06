import { CONTACT_LIMITS } from '@/lib/services/landing-requests'

export type ContactField = 'name' | 'company' | 'email' | 'phone' | 'content'

export interface ContactValues {
  name: string
  company: string
  email: string
  phone: string
  content: string
}

/** field order on the page: the first invalid one is focused */
export const CONTACT_FIELDS: ContactField[] = ['name', 'company', 'email', 'phone', 'content']

const MIN_NAME = 2
const MIN_MESSAGE = 10
const MIN_PHONE_DIGITS = 7
const MAX_PHONE_DIGITS = 15

// something@something.tld, with no spaces ("+" and similar are fine before the @)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// digits with an optional leading "+", and spaces, dashes or brackets between them
const PHONE_REGEX = /^\+?[0-9\s\-()]+$/

/** the translation key of the error for one field, or undefined when it is fine */
export function contactError(field: ContactField, values: ContactValues): string | undefined {
  const value = values[field].trim()
  switch (field) {
    case 'name':
      if (!value) return 'ThisFieldIsMandatory'
      if (value.length < MIN_NAME) return 'ContactErrNameShort'
      if (!/\p{L}/u.test(value)) return 'ContactErrNameInvalid'
      if (value.length > CONTACT_LIMITS.name) return 'ContactErrTooLong'
      return undefined
    case 'company':
      return value.length > CONTACT_LIMITS.company ? 'ContactErrTooLong' : undefined
    case 'email':
      if (!value) return 'ThisFieldIsMandatory'
      if (value.length > CONTACT_LIMITS.email) return 'ContactErrTooLong'
      return EMAIL_REGEX.test(value) ? undefined : 'ThisEmailIsInvalid'
    case 'phone': {
      if (!value) return undefined // optional
      if (value.length > CONTACT_LIMITS.phone) return 'ContactErrTooLong'
      if (!PHONE_REGEX.test(value)) return 'ContactErrPhoneInvalid'
      const digits = value.replace(/\D/g, '').length
      return digits < MIN_PHONE_DIGITS || digits > MAX_PHONE_DIGITS
        ? 'ContactErrPhoneInvalid'
        : undefined
    }
    case 'content':
      if (!value) return 'ThisFieldIsMandatory'
      if (value.length < MIN_MESSAGE) return 'ContactErrMessageShort'
      return value.length > CONTACT_LIMITS.message ? 'ContactErrTooLong' : undefined
  }
}

// backend names (the request's property names, or words in its error code) -> the form's fields
const BACKEND_FIELDS: { match: RegExp; field: ContactField }[] = [
  { match: /^fullName$/i, field: 'name' },
  { match: /^companyName$/i, field: 'company' },
  { match: /^email$/i, field: 'email' },
  { match: /^phoneNumber$/i, field: 'phone' },
  { match: /^message$/i, field: 'content' }, // not messageType
]

/* What to show when the backend refuses a request: the field it is about (when we can tell) and
   its own message, which is already in the visitor's language. */
export function readContactError(error: any): {
  field?: ContactField
  messageKey?: string
  message?: string
} {
  if (!error?.response) return { messageKey: 'CheckNetwork' }

  const info = error.response.data?.error
  if (!info) return { messageKey: 'RegisterModalSubmitError' }

  for (const validationError of info.validationErrors ?? []) {
    for (const member of validationError?.members ?? []) {
      const found = BACKEND_FIELDS.find((rule) => rule.match.test(member))
      if (found) return { field: found.field, message: validationError.message }
    }
  }

  // e.g. ContactUsInvalidEmail / ContactUsInvalidPhoneNumber; ContactUsInvalidMessageType is not
  // a field the visitor types, so it stays a general error
  if (/ContactUsInvalid(Email|PhoneNumber)/i.test(info.code ?? '')) {
    const field: ContactField = /Email/i.test(info.code) ? 'email' : 'phone'
    return { field, message: info.message }
  }

  return info.message ? { message: info.message } : { messageKey: 'RegisterModalSubmitError' }
}
