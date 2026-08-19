import { getClientTranslation } from '@/app/i18n/client'
import countries from '@/data/countries.json'
import { DrawerType } from '@/lib/constants'
import { preventString, removeWhiteSpaces } from '@/lib/helpers'
import countriesCodesServiceInstance from '@/lib/services/countries-codes'
import { CountryCodeDto } from '@/lib/services/countries-codes/dto'
import { Form, Input, Select } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext'
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from 'libphonenumber-js'
import Image from 'next/image'
import { useEffect, useState } from 'react'

function getCountryIsoFromDialCode(dialCode: string) {
  const sanitizedDialCode = dialCode?.replace('+', '')
  return getCountries().filter(
    (country) => getCountryCallingCode(country) === sanitizedDialCode
  )?.[0]
}

export default function PhoneInput({
  optional,
  label,
  type,
  lng,
  phone,
  setPhone,
  setConuntryCode,
  countryCode,
  withoutLabel,
  allCountries,
  withoutForm,
  disabled,
  size,
}: {
  setPhone: any
  setConuntryCode: any
  type: DrawerType
  lng: string
  phone: { value: ''; validateStatus: undefined; errorMsg: null }
  countryCode: string
  label?: string
  optional?: boolean
  withoutLabel?: boolean
  allCountries?: boolean
  withoutForm?: boolean
  disabled?: boolean
  size?: SizeType
}) {
  const [countriesCode, setCountriesCode] = useState<CountryCodeDto[]>([])
  const { t } = getClientTranslation(lng)
  const [defaultCountry, setDefaultCountry] = useState('')
  const placeholder =
    countries
      .find((c) => c.iso2?.toLowerCase() === defaultCountry?.toLowerCase())
      ?.example?.replace(countryCode + ' ', '') || ''

  const getActiveCodes = async () => {
    countriesCodesServiceInstance
      .getAll({
        skipCount: 0,
        maxResultCount: 1000,
        isActive: true,
      })
      .then((result: any) => {
        setCountriesCode(result.items)
      })
  }

  useEffect(
    () => {
      if (type === DrawerType.Edit && (countriesCode?.length > 0 || allCountries)) {
        let t = getCountryIsoFromDialCode(countryCode)?.toLocaleLowerCase()
        setDefaultCountry(
          countryCode
            ? t
            : allCountries
              ? 'sa'
              : countriesCode
                  ?.filter(
                    (i: CountryCodeDto) =>
                      i.dialCode ===
                      (countryCode
                        ? countryCode.includes('+')
                          ? countryCode
                          : '+' + countryCode
                        : '+966')
                  )?.[0]
                  ?.iso2Code?.toLocaleLowerCase()
        )
      } else if (type === DrawerType.Add) {
        let foundSA =
          allCountries ||
          countriesCode?.filter(
            (item: CountryCodeDto) => item.iso2Code?.toLocaleLowerCase() === 'sa'
          )?.[0]

        setDefaultCountry(
          foundSA
            ? 'sa'
            : countriesCode?.map((item: CountryCodeDto) => item.iso2Code?.toLocaleLowerCase())?.[0]
        )
        let c = !foundSA
          ? countriesCode?.map((item: CountryCodeDto) => item.dialCode?.toLocaleLowerCase())?.[0]
          : '+966'
        if (c) setConuntryCode(c.includes('+') ? c : '+' + c)
        setPhone({
          value: removeWhiteSpaces(phone.value),
          validateStatus: undefined,
          errorMsg: null,
        })
      }
    }, // eslint-disable-next-line
    [countriesCode, type]
  )

  useEffect(
    () => {
      if (!allCountries) getActiveCodes()
    }, // eslint-disable-next-line
    [type]
  )
  const displayNames = new Intl.DisplayNames([lng], { type: 'region' })

  const selectBefore = (disabled?: boolean) => (
    <Select
      className="min-w-[120px] phone-dropdown"
      disabled={disabled}
      suffixIcon={null}
      defaultValue={defaultCountry}
      value={countryCode}
      virtual={false}
      popupClassName="!w-auto"
      showSearch
      onChange={(value) => {
        const code = value || countryCode
        const isValid = isValidPhoneNumber((code?.includes('+') ? code : '+' + code) + phone?.value)
        setConuntryCode(code?.includes('+') ? code : '+' + code)
        let dd = getCountryIsoFromDialCode(
          code.includes('+') ? code : '+' + code
        )?.toLocaleLowerCase()

        setDefaultCountry(
          allCountries
            ? dd
            : countriesCode
                ?.filter(
                  (i: CountryCodeDto) => i.dialCode === (code.includes('+') ? code : '+' + code)
                )?.[0]
                ?.iso2Code?.toLocaleLowerCase()
        )

        setPhone({
          ...phone,
          validateStatus: phone ? (isValid ? 'success' : 'error') : 'success',
          errorMsg: phone ? (isValid ? null : t('PhoneIsInvalid')) : null,
        })
      }}
      optionFilterProp="children"
      filterOption={(input, option: any) =>
        option!.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
        option!.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {(allCountries
        ? getCountries()?.map((item) => {
            const name = displayNames.of(item)

            return {
              dialCode: `+${getCountryCallingCode(item)}`,
              name: name || '',
              iso2Code: item.toLowerCase(),
            }
          })
        : countriesCode
      )
        ?.sort((a, b) => {
          const aIndex = ['sa', 'ae', 'kw', 'qa', 'bh', 'om', 'nl'].indexOf(
            a.iso2Code?.toLowerCase()
          )
          const bIndex = ['sa', 'ae', 'kw', 'qa', 'bh', 'om', 'nl'].indexOf(
            b.iso2Code?.toLowerCase()
          )

          if (aIndex !== -1 && bIndex === -1) return -1
          if (aIndex === -1 && bIndex !== -1) return 1

          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex

          return a.name.localeCompare(b.name)
        })
        ?.map(
          (item, i) =>
            !['ac', 'ta', 'cc', 'cx', 'bq', 'ag', 'bl'].includes(item.iso2Code) && (
              <Select.Option key={item.name} value={item.dialCode}>
                <div className="flex gap-2 items-center justify-between">
                  <span>
                    <span className="hid">{item.name}</span>
                    <span className="hid"> (</span>
                    <span className="!text-left inline-block ![direction:ltr]">
                      {item.dialCode}
                    </span>
                    <span className="hid">)</span>
                  </span>
                  <Image
                    src={`/images/flags/${item.iso2Code?.toLowerCase()}.svg`}
                    width={35}
                    height={30}
                    loading="lazy"
                    className="rounded-[6px] border border-[#bbb]"
                    alt={item.iso2Code}
                  />
                </div>
              </Select.Option>
            )
        )}
    </Select>
  )

  return (countriesCode?.length > 0 && defaultCountry) || (allCountries && defaultCountry) ? (
    <>
      {withoutForm ? (
        <>
          <Input
            className="!text-left dir-ltr"
            disabled={disabled}
            addonBefore={lng === 'ar' ? null : selectBefore(disabled)}
            addonAfter={lng === 'ar' ? selectBefore(disabled) : null}
            placeholder={placeholder}
            value={phone.value}
            size={size || 'middle'}
            onChange={(e) => {
              const value = preventString(e.target.value)
              const code = countryCode
              const isValid = isValidPhoneNumber((code?.includes('+') ? code : '+' + code) + value)

              setConuntryCode(code?.includes('+') ? code : '+' + code)
              if (type === DrawerType.Edit) {
                setDefaultCountry(
                  allCountries
                    ? code.includes('+')
                      ? code
                      : '+' + code
                    : countriesCode
                        ?.filter(
                          (i: CountryCodeDto) =>
                            i.dialCode === (code.includes('+') ? code : '+' + code)
                        )?.[0]
                        ?.iso2Code?.toLocaleLowerCase()
                )
              }
              setPhone({
                value: removeWhiteSpaces(value),
                validateStatus: value && isValid ? 'success' : optional ? 'success' : 'error',
                errorMsg: value
                  ? isValid
                    ? null
                    : t('PhoneIsInvalid')
                  : optional
                    ? null
                    : t('ThisFieldIsMandatory'),
              })
            }}
          />
          {phone.errorMsg && <div className="ant-form-item-explain-error">{phone.errorMsg}</div>}
        </>
      ) : (
        <Form.Item
          label={withoutLabel ? '' : label || t('PhoneNumber')}
          required={optional ? false : true}
        >
          <Input
            className="!text-left dir-ltr"
            disabled={disabled}
            size={size || 'middle'}
            addonBefore={lng === 'ar' ? null : selectBefore(disabled)}
            addonAfter={lng === 'ar' ? selectBefore(disabled) : null}
            placeholder={placeholder}
            value={phone.value}
            onChange={(e) => {
              const value = preventString(e.target.value)
              const code = countryCode
              const isValid = isValidPhoneNumber((code?.includes('+') ? code : '+' + code) + value)

              setConuntryCode(code?.includes('+') ? code : '+' + code)
              if (type === DrawerType.Edit) {
                setDefaultCountry(
                  allCountries
                    ? code.includes('+')
                      ? code
                      : '+' + code
                    : countriesCode
                        ?.filter(
                          (i: CountryCodeDto) =>
                            i.dialCode === (code.includes('+') ? code : '+' + code)
                        )?.[0]
                        ?.iso2Code?.toLocaleLowerCase()
                )
              }
              setPhone({
                value: removeWhiteSpaces(value),
                validateStatus: value && isValid ? 'success' : optional ? 'success' : 'error',
                errorMsg: value
                  ? isValid
                    ? null
                    : t('PhoneIsInvalid')
                  : optional
                    ? null
                    : t('ThisFieldIsMandatory'),
              })
            }}
          />
          {phone.errorMsg && <div className="ant-form-item-explain-error">{phone.errorMsg}</div>}
        </Form.Item>
      )}
    </>
  ) : (
    <></>
  )
}
