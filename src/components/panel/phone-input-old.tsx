// import { getClientTranslation } from '@/app/i18n/client'
// import { DrawerType } from '@/lib/constants'
// import countriesCodesServiceInstance from '@/lib/services/countries-codes'
// import { CountryCodeDto } from '@/lib/services/countries-codes/dto'
// import { Form } from 'antd'
// import { useEffect, useRef, useState } from 'react'
// import IntlTelInput from 'react-intl-tel-input'

// export default function PhoneInput({
//   optional,
//   label,
//   type,
//   lng,
//   phone,
//   setPhone,
//   setConuntryCode,
//   countryCode,
//   withoutLabel,
//   allCountries,
//   withoutForm,
// }: {
//   setPhone: any
//   setConuntryCode: any
//   type: DrawerType
//   lng: string
//   phone: { value: ''; validateStatus: undefined; errorMsg: null }
//   countryCode: string
//   label?: string
//   optional?: boolean
//   withoutLabel?: boolean
//   allCountries?: boolean
//   withoutForm?: boolean
// }) {
//   const [countriesCode, setCountriesCode] = useState<CountryCodeDto[]>([])
//   const { t } = getClientTranslation(lng)
//   const [defaultCountry, setDefaultCountry] = useState('')
//   const wrapperRef = useRef<any>(null)
//   const intlTelInputRef = useRef<any>(null)

//   useEffect(() => {
//     const selectedFlag = wrapperRef.current?.querySelector('.selected-flag')

//     if (intlTelInputRef.current) {
//       // intlTelInputRef.current?.clickSelectedFlag();

//       if (selectedFlag) {
//         selectedFlag.addEventListener('click', (e: any) => {
//           e.preventDefault()
//           setTimeout(() => {
//             document.querySelector('.country-list')?.classList.toggle('hide')
//             console.log('ssss')
//             if (
//               !intlTelInputRef.current?.isOpening &&
//               !e.target?.matches?.('.iti-flag') &&
//               !e.target?.matches?.('.arrow')
//             )
//               document.querySelector('.country-list')?.classList.toggle('hide')

//             // intlTelInputRef.current?.clickSelectedFlag();
//           }, 500)
//           // document?.querySelector(".country-list")?.classList?.toggle("hide");
//         })
//       }
//     }
//     // console.log({selectedFlag})

//     // return () => {
//     //   if (selectedFlag) {
//     //     selectedFlag.addEventListener('click', (e: any) => {
//     //       e.preventDefault();
//     //       setTimeout(() => {
//     //         if (!intlTelInputRef.current?.isOpening && !e.target?.matches?.(".iti-flag") && !e.target?.matches?.(".arrow"))
//     //           intlTelInputRef.current?.clickSelectedFlag();
//     //       }, 500);
//     //       // document?.querySelector(".country-list")?.classList?.toggle("hide");
//     //     });
//     //   }
//     // };
//   }, [intlTelInputRef, wrapperRef])

//   const getActiveCodes = async () => {
//     countriesCodesServiceInstance
//       .getAll({
//         skipCount: 0,
//         maxResultCount: 1000,
//         isActive: true,
//       })
//       .then((result: any) => {
//         setCountriesCode(result.items)
//       })
//   }

//   useEffect(
//     () => {
//       if (type === DrawerType.Edit && (countriesCode?.length > 0 || allCountries)) {
//         setDefaultCountry(
//           allCountries
//             ? 'sa'
//             : countriesCode?.filter(
//                 (i: CountryCodeDto) =>
//                   i.dialCode ===
//                   (countryCode
//                     ? countryCode.includes('+')
//                       ? countryCode
//                       : '+' + countryCode
//                     : '+966')
//               )?.[0]?.iso2Code
//         )
//       } else if (type === DrawerType.Add) {
//         let foundSA =
//           allCountries ||
//           countriesCode?.filter((item: CountryCodeDto) => item.iso2Code === 'sa')?.[0]

//         setDefaultCountry(
//           foundSA ? 'sa' : countriesCode?.map((item: CountryCodeDto) => item.iso2Code)?.[0]
//         )
//         let c = !foundSA ? countriesCode?.map((item: CountryCodeDto) => item.dialCode)?.[0] : '+966'
//         if (c) setConuntryCode(c.includes('+') ? c : '+' + c)
//         setPhone({ value: phone.value, validateStatus: undefined, errorMsg: null })
//       }
//     }, // eslint-disable-next-line
//     [countriesCode, type]
//   )

//   useEffect(
//     () => {
//       if (!allCountries) getActiveCodes()
//     }, // eslint-disable-next-line
//     [type]
//   )

//   return (countriesCode?.length > 0 && defaultCountry) || (allCountries && defaultCountry) ? (
//     <>
//       {withoutForm ? (
//         <>
//           <div style={{ direction: 'ltr', position: 'relative' }} ref={wrapperRef}>
//             {/* <div className="click-overlay" /> */}
//             <IntlTelInput
//               ref={intlTelInputRef}
//               containerClassName={`intl-tel-input ${phone.validateStatus}`}
//               inputClassName="form-control"
//               onlyCountries={
//                 allCountries
//                   ? undefined
//                   : countriesCode?.map((item: CountryCodeDto) => item.iso2Code)
//               }
//               onSelectFlag={(currentNumber, selectedCountryData, fullNumber, isValid) => {
//                 let code = selectedCountryData.dialCode || countryCode
//                 setConuntryCode(code?.includes('+') ? code : '+' + code)
//                 setDefaultCountry(
//                   allCountries
//                     ? code.includes('+')
//                       ? code
//                       : '+' + code
//                     : countriesCode?.filter(
//                         (i: CountryCodeDto) =>
//                           i.dialCode === (code.includes('+') ? code : '+' + code)
//                       )?.[0]?.iso2Code
//                 )
//                 setPhone({
//                   ...phone,
//                   validateStatus: phone ? (isValid ? 'success' : 'error') : 'success',
//                   errorMsg: phone ? (isValid ? null : t('PhoneIsInvalid')) : null,
//                 })
//                 if (!isValid && countryCode !== '+966' && defaultCountry !== 'sa') {
//                   setConuntryCode('+966')
//                   setDefaultCountry('sa')
//                 }
//               }}
//               allowDropdown
//               value={phone.value}
//               onPhoneNumberChange={(isValid, value, selectedCountryData, fullNumber, extension) => {
//                 let code = selectedCountryData.dialCode || countryCode
//                 setConuntryCode(code?.includes('+') ? code : '+' + code)
//                 if (type === DrawerType.Edit) {
//                   setDefaultCountry(
//                     allCountries
//                       ? code.includes('+')
//                         ? code
//                         : '+' + code
//                       : countriesCode?.filter(
//                           (i: CountryCodeDto) =>
//                             i.dialCode === (code.includes('+') ? code : '+' + code)
//                         )?.[0]?.iso2Code
//                   )
//                 }
//                 setPhone({
//                   value: value,
//                   validateStatus: value && isValid ? 'success' : optional ? 'success' : 'error',
//                   errorMsg: value
//                     ? isValid
//                       ? null
//                       : t('PhoneIsInvalid')
//                     : optional
//                       ? null
//                       : t('ThisFieldIsMandatory'),
//                 })
//               }}
//               defaultCountry={defaultCountry}
//               separateDialCode
//               preferredCountries={[]}
//             />
//           </div>
//           {phone.errorMsg && <div className="ant-form-item-explain-error">{phone.errorMsg}</div>}
//         </>
//       ) : (
//         <Form.Item
//           label={withoutLabel ? '' : label || t('PhoneNumber')}
//           required={optional ? false : true}
//         >
//           <div style={{ direction: 'ltr', position: 'relative' }} ref={wrapperRef}>
//             {/* <div className="click-overlay" /> */}
//             <IntlTelInput
//               ref={intlTelInputRef}
//               containerClassName={`intl-tel-input ${phone.validateStatus}`}
//               inputClassName="form-control"
//               onlyCountries={
//                 allCountries
//                   ? undefined
//                   : countriesCode?.map((item: CountryCodeDto) => item.iso2Code)
//               }
//               onSelectFlag={(currentNumber, selectedCountryData, fullNumber, isValid) => {
//                 let code = selectedCountryData.dialCode || countryCode
//                 setConuntryCode(code?.includes('+') ? code : '+' + code)
//                 setDefaultCountry(
//                   allCountries
//                     ? code.includes('+')
//                       ? code
//                       : '+' + code
//                     : countriesCode?.filter(
//                         (i: CountryCodeDto) =>
//                           i.dialCode === (code.includes('+') ? code : '+' + code)
//                       )?.[0]?.iso2Code
//                 )
//                 setPhone({
//                   ...phone,
//                   validateStatus: phone ? (isValid ? 'success' : 'error') : 'success',
//                   errorMsg: phone ? (isValid ? null : t('PhoneIsInvalid')) : null,
//                 })
//               }}
//               allowDropdown
//               value={phone.value}
//               onPhoneNumberChange={(isValid, value, selectedCountryData, fullNumber, extension) => {
//                 let code = selectedCountryData.dialCode || countryCode
//                 setConuntryCode(code?.includes('+') ? code : '+' + code)
//                 if (type === DrawerType.Edit) {
//                   setDefaultCountry(
//                     allCountries
//                       ? code.includes('+')
//                         ? code
//                         : '+' + code
//                       : countriesCode?.filter(
//                           (i: CountryCodeDto) =>
//                             i.dialCode === (code.includes('+') ? code : '+' + code)
//                         )?.[0]?.iso2Code
//                   )
//                 }
//                 setPhone({
//                   value: value,
//                   validateStatus: value && isValid ? 'success' : optional ? 'success' : 'error',
//                   errorMsg: value
//                     ? isValid
//                       ? null
//                       : t('PhoneIsInvalid')
//                     : optional
//                       ? null
//                       : t('ThisFieldIsMandatory'),
//                 })
//               }}
//               defaultCountry={defaultCountry}
//               separateDialCode
//               preferredCountries={[]}
//             />
//           </div>
//           {phone.errorMsg && <div className="ant-form-item-explain-error">{phone.errorMsg}</div>}
//         </Form.Item>
//       )}
//     </>
//   ) : (
//     <></>
//   )
// }
