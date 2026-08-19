import { t } from 'i18next'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { preventString } from './helpers'

type RequiredRule = {
  required: boolean
  message: string
}

export default class Rules {
  getMandatoryRule = (): RequiredRule => {
    return { required: true, message: t('ThisFieldIsMandatory') }
  }
}

export const validateDomian = (value: string) => {
  let reqex = /^[a-z0-9\-]{3,}$/
  if (value !== '' && !reqex.test(value)) {
    return {
      validateStatus: 'error',
      errorMsg: t('PleaseEnterAValidDomainName'),
    }
  }
  if (value !== '') {
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  }

  return {
    validateStatus: 'error',
    errorMsg: t('ThisFieldIsMandatory'),
  }
}

export const validateArName = (value: string) => {
  let reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/
  if (value !== '' && value !== null && !reqex.test(value)) {
    return {
      validateStatus: 'warning',
      errorMsg: t('YouAreWritingEnglishSymbols'),
    }
  }
  if (value !== '') {
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  }

  return {
    validateStatus: 'error',
    errorMsg: t('ThisFieldIsMandatory'),
  }
}

export const validateEnName = (value: string) => {
  let reqex = /^[A-Za-z0-9\s.\-_()+]+$/
  if (value !== '' && value !== null && !reqex.test(value)) {
    return {
      validateStatus: 'warning',
      errorMsg: t('YouAreWritingArabicSymbols'),
    }
  }
  if (value !== '') {
    return {
      validateStatus: 'success',
      errorMsg: null,
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: t('ThisFieldIsMandatory'),
  }
}

export const validateArNameOptional = (value: string) => {
  let reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/
  if (value !== '' && !reqex.test(value)) {
    return {
      validateStatus: 'warning',
      errorMsg: t('YouAreWritingEnglishSymbols'),
    }
  }

  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

export const validateEnNameOptional = (value: string) => {
  let reqex = /^[A-Za-z0-9\s.\-_()+]+$/
  if (value !== '' && !reqex.test(value)) {
    return {
      validateStatus: 'warning',
      errorMsg: t('YouAreWritingArabicSymbols'),
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

export const validateURL = (value: string, mandatory = false) => {
  const reqex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?$/
  if (value === '' && mandatory) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisFieldIsMandatory'),
    }
  }
  if (value !== '' && !reqex.test(value)) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisURLIsInvalid'),
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}
export const validateLink = () => ({
  validator(_: any, value: any) {
    try {
      new URL(value)
      return Promise.resolve()
    } catch (_1) {
      return Promise.reject(new Error(value ? t('PleaseInputValidLink')! : ''))
    }
  },
})

export const validateEmail = (value: string, mandatory = false) => {
  const reqex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (value === '' && mandatory) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisFieldIsMandatory'),
    }
  }
  if (value !== '' && !reqex.test(value)) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisEmailIsInvalid'),
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

export const validateMandatory = (value: string) => {
  if (value === '') {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisFieldIsMandatory'),
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

export const validateContains0 = (value: string) => {
  if (value === '') {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisFieldIsMandatory'),
    }
  } else if (!value.includes('{0}')) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisMessageShouldContains0'),
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

export const validatePhone = (value: string, mandatory = true) => {
  let phon = preventString(value)
  if (phon !== '' && !isValidPhoneNumber(phon)) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisPhoneIsInvalid'),
    }
  }
  if (phon === '' && mandatory) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisFieldIsMandatory'),
    }
  }
  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}

export const validatePhoneWithRedundantCondition = (
  value: string,
  mandatory = true,
  phonesList: string[]
) => {
  let phon = preventString(value)
  if (phon !== '' && !isValidPhoneNumber(phon)) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisPhoneIsInvalid'),
    }
  }
  if (phon === '' && mandatory) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisFieldIsMandatory'),
    }
  }
  if (phon !== '' && phonesList.includes(phon)) {
    return {
      validateStatus: 'error',
      errorMsg: t('ThisPhoneIsAlreadyAdded'),
    }
  }

  return {
    validateStatus: 'success',
    errorMsg: null,
  }
}
