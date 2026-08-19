
export interface LanguageInfo {
    cultureName?: string | null
    uiCultureName?: string | null
    displayName?: string | null
    readonly twoLetterISOLanguageName?: string | null
    flagIcon?: string | null
}
  
export interface ApplicationLocalizationResourceDto {
    texts?: {
      [key: string]: string
    } | null
    baseResources?: Array<string> | null
}
  
export interface DateTimeFormatDto  {
    calendarAlgorithmType?: string | null
    dateTimeFormatLong?: string | null
    shortDatePattern?: string | null
    fullDateTimePattern?: string | null
    dateSeparator?: string | null
    shortTimePattern?: string | null
    longTimePattern?: string | null
  }

export interface CurrentCultureDto  {
    displayName?: string | null
    englishName?: string | null
    threeLetterIsoLanguageName?: string | null
    twoLetterIsoLanguageName?: string | null
    isRightToLeft?: boolean
    cultureName?: string | null
    name?: string | null
    nativeName?: string | null
    dateTimeFormat?: DateTimeFormatDto
}
  
export type NameValue = {
    name?: string | null
    value?: string | null
  }

  
export interface ApplicationLocalizationConfigurationDto  {
    values?: {
      [key: string]: {
        [key: string]: string
      }
    } | null
    resources?: {
      [key: string]: ApplicationLocalizationResourceDto
    } | null
    languages?: Array<LanguageInfo> | null
    currentCulture?: CurrentCultureDto
    defaultResourceName?: string | null
    languagesMap?: {
      [key: string]: Array<NameValue>
    } | null
    languageFilesMap?: {
      [key: string]: Array<NameValue>
    } | null
  }

export interface CurrentUserDto {
    isAuthenticated?: boolean
    id?: string | null
    tenantId?: string | null
    impersonatorUserId?: string | null
    impersonatorTenantId?: string | null
    impersonatorUserName?: string | null
    impersonatorTenantName?: string | null
    userName?: string | null
    name?: string | null
    surName?: string | null
    email?: string | null
    emailVerified?: boolean
    phoneNumber?: string | null
    phoneNumberVerified?: boolean
    roles?: Array<string> | null
}

export interface ClockDto {
    kind?: string | null
}
  
export interface CurrentTenantDto {
    id?: string | null
    name?: string | null
    isAvailable?: boolean
}
export type LocalizableStringDto = {
    name?: string | null
    resource?: string | null
  }
  
  export type ExtensionPropertyApiDto = {
    onGet?: ExtensionPropertyApiGetDto
    onCreate?: any
    onUpdate?: ExtensionPropertyApiUpdateDto
}
  
export type ExtensionPropertyApiGetDto = {
    isAvailable?: boolean
  }
  
  export type ExtensionPropertyApiUpdateDto = {
    isAvailable?: boolean
  }
  
  export type ExtensionPropertyAttributeDto = {
    typeSimple?: string | null
    config?: {
      [key: string]: unknown
    } | null
}
  
export type ExtensionPropertyDto = {
    type?: string | null
    typeSimple?: string | null
    displayName?: LocalizableStringDto
    api?: ExtensionPropertyApiDto
    ui?: any
    attributes?: Array<ExtensionPropertyAttributeDto> | null
    configuration?: {
      [key: string]: unknown
    } | null
    defaultValue?: unknown
}
  


  export type EntityExtensionDto = {
    properties?: {
      [key: string]: ExtensionPropertyDto
    } | null
    configuration?: {
      [key: string]: unknown
    } | null
  }

  export type ModuleExtensionDto = {
    entities?: {
      [key: string]: EntityExtensionDto
    } | null
    configuration?: {
      [key: string]: unknown
    } | null
  }

  export type ObjectExtensionsDto = {
    modules?: {
      [key: string]: ModuleExtensionDto
    } | null
    enums?: {
      [key: string]: ExtensionEnumDto
    } | null
}
  
export type ExtensionEnumDto = {
    fields?: Array<ExtensionEnumFieldDto> | null
    localizationResource?: string | null
}

  export type ExtensionEnumFieldDto = {
    name?: string | null
    value?: unknown
}
  
export type IanaTimeZone = {
    timeZoneName?: string | null
}

export type WindowsTimeZone = {
    timeZoneId?: string | null
  }
  
export type TimeZone = {
    iana?: IanaTimeZone
    windows?: WindowsTimeZone
}
  
export type TimingDto = {
    timeZone?: TimeZone
}

export type MultiTenancyInfoDto = {
    isEnabled?: boolean
}
  
export type ApplicationAuthConfigurationDto = {
    grantedPolicies?: {
        [key: string]: boolean
    } | null
}

export type ApplicationSettingConfigurationDto = {
    values?: {
        [key: string]: string | null
    } | null
}

export type ApplicationFeatureConfigurationDto = {
    values?: {
        [key: string]: string | null
    } | null
}
  
export type ApplicationGlobalFeatureConfigurationDto = {
    enabledFeatures?: Array<string> | null
}
  
export interface ApplicationConfigurationDto {
    localization?: ApplicationLocalizationConfigurationDto
    auth?: ApplicationAuthConfigurationDto
    setting?: ApplicationSettingConfigurationDto
    currentUser?: CurrentUserDto
    features?: ApplicationFeatureConfigurationDto
    globalFeatures?: ApplicationGlobalFeatureConfigurationDto
    multiTenancy?: MultiTenancyInfoDto
    currentTenant?: CurrentTenantDto
    timing?: TimingDto
    clock?: ClockDto
    objectExtensions?: ObjectExtensionsDto
    extraProperties?: {
        [key: string]: unknown
    } | null
}