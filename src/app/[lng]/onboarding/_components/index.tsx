'use client'

import { getClientTranslation } from '@/app/i18n/client'
import FileUploader from '@/components/panel/file-uploader/file-uploader'
import Loader from '@/components/panel/loader'
import MapContainerForEdit from '@/components/panel/map/map-container-for-edit'
import PhoneInput from '@/components/panel/phone-input'
import { CardContent, CardHeader } from '@/components/ui/card'
import { DrawerType, defaultDateFormat } from '@/lib/constants'
import { useAppContext } from '@/lib/context'
import { preventString, removeWhiteSpaces, renderDateTimeWithoutFormat } from '@/lib/helpers'
import Onboarding01 from '@/lib/icons/onboarding-01'
import { popupConfirm } from '@/lib/popup-confirm'
import Rules, {
  validateArName,
  validateArNameOptional,
  validateDomian,
  validateEmail,
  validateEnName,
  validateEnNameOptional,
  validatePhone,
} from '@/lib/rules'
import abpServiceInstance from '@/lib/services/abp'
import applicationReqsServiceInstance from '@/lib/services/application-reqs'
import { ApplicationRequestDto } from '@/lib/services/application-reqs/dto'
import companiesServiceInstance from '@/lib/services/companies'
import { ApplicationRequestStatus, LiteEntityDto, LocationType } from '@/lib/services/dto'
import imageServiceInstance from '@/lib/services/images'
import locationServiceInstance from '@/lib/services/locations'
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Tag,
} from 'antd'
import confetti from 'canvas-confetti'
import { Edit, Home, Mail, MoveLeft, MoveRight, Pin, Save, X } from 'lucide-react'
import type { Moment } from 'moment'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import React, { useEffect, useState } from 'react'
import ManageFeaturesDrawer from '../../admin/companies/_components/manage-features-drawer'

const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig)
const maxFileSize = 5

var count = 200
var defaults = {
  origin: { y: 0.7 },
}

function fire(particleRatio: any, opts: any) {
  confetti({
    ...defaults,
    ...opts,
    particleCount: Math.floor(count * particleRatio),
  })
}

export default function Onboarding({
  lng,
  id,
  accessToken,
}: {
  lng: string
  id: number
  accessToken: string | undefined
}) {
  const router = useRouter()
  const [modal, contextHolder] = Modal.useModal()
  const [featuresDrawer, setFeaturesDrawer] = useState<{
    open: boolean
    data: any | undefined
  }>({
    open: false,
    data: undefined,
  })

  const { t } = getClientTranslation(lng)
  const [data, setData] = useState<ApplicationRequestDto | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState(0)
  const [isSubmittingData, setIsSubmittingData] = useState(false)
  const [form] = Form.useForm()

  const [Message, setMessage] = useState('')

  const [arName, setArName] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [enName, setEnName] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [companyPhone, setCompanyPhone] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [companyCountryCode, setCompanyCountryCode] = useState<string>('+966')
  const [companyEmail, setCompanyEmail] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [arLogoUrl, setArLogoUrl] = useState<string>('')
  const [enLogoUrl, setEnLogoUrl] = useState<string>('')
  const [regularLicensingDocUrl, setRegularLicensingDocUrl] = useState<string>('')
  const [isEnLogoUrlUploading, setIsEnLogoUrlUploading] = useState<boolean>(false)
  const [isArLogoUrlUploading, setIsArLogoUrlUploading] = useState<boolean>(false)
  const [isRegularLicensingDocUrlUploading, setIsRegularLicensingDocUrlUploading] =
    useState<boolean>(false)
  const [ownerCountryCode, setOwnerCountryCode] = useState<string>('+966')
  const [ownerEmail, setOwnerEmail] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [location, setLocation] = useState<{
    latitude: number | undefined
    longitude: number | undefined
    address: string
  }>({
    latitude: undefined,
    longitude: undefined,
    address: '',
  })
  const [phone, setPhone] = useState<any>({ value: '', validateStatus: undefined, errorMsg: null })
  const [arDescription, setArDescription] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [enDescription, setEnDescription] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const [cities, setCities] = useState<LiteEntityDto[]>([])
  const [countries, setCountries] = useState<LiteEntityDto[]>([])
  const [banks, setBanks] = useState<LiteEntityDto[]>([])
  const [domain, setDomain] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  // const [approveDrawer, setApproveDrawer] = useState<{
  //   open: boolean
  //   data: any | undefined
  // }>({
  //   open: false,
  //   data: undefined,
  // })
  const [isMapIntiated, setIsMapIntiated] = useState(false)
  const [color, setColor] = useState<any>('#07C692')
  const [commercialNumber, setCommercialNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  // const [commercialRecordNumber, setCommercialRecordNumber] = useState("");
  const [finalizeAcception, setFinalizeAcception] = useState(false)
  const [agreement, setAgreement] = useState(false)
  const [locationError, setLocationError] = useState(false)
  const { message } = App.useApp()
  const { setGrantedPolicies, setFeatures, setRole, tenant } = useAppContext()

  const getCountries = async () => {
    let result = await locationServiceInstance.getAllLite({
      isActive: true,
      skipCount: 0,
      maxResultCount: 1000,
      type: LocationType.Country,
    })
    setCountries(result.items)
  }
  const getBanks = async () => {
    // let result = await banksServiceInstance.getAllLite({ skipCount: 0, maxResultCount: 1000 })
    // setBanks(result.items)
  }

  useEffect(
    () => {
      if (id && accessToken) {
        getData(id)
      } else {
        if (!accessToken) {
          router.replace(`/${lng}?needLogin`)
        }
      }
    }, // eslint-disable-next-line
    [id, accessToken]
  )

  React.useEffect(
    () => {
      if (step === 3 && !isMapIntiated) {
        setIsMapIntiated(true)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, // eslint-disable-next-line
    [step]
  )

  const uploadImage = async (file: any, field: string) => {
    try {
      if (field === 'arLogo') setIsArLogoUrlUploading(true)
      else if (field === 'enLogo') setIsEnLogoUrlUploading(true)
      else if (field === 'regularLicensingDocUrl') setIsRegularLicensingDocUrlUploading(true)

      let result
      if (field === 'regularLicensingDocUrl')
        result = await imageServiceInstance.uploadFile({ file: file })
      else result = await imageServiceInstance.uploadImage({ file: file })

      let url = result.url
      form.setFieldValue(field, url)

      if (field === 'arLogo') setArLogoUrl(url)
      else if (field === 'enLogo') setEnLogoUrl(url)
      else if (field === 'regularLicensingDocUrl') setRegularLicensingDocUrl(url)
    } finally {
      if (field === 'arLogo') setIsArLogoUrlUploading(false)
      else if (field === 'enLogo') setIsEnLogoUrlUploading(false)
      else if (field === 'regularLicensingDocUrl') setIsRegularLicensingDocUrlUploading(false)
    }
  }

  const renderStepsNavigator = (finalStep: boolean = false) => {
    return (
      <div className="onboarding-navigator">
        <Button type="default" onClick={() => setStep((old) => old - 1)}>
          {lng === 'ar' ? <MoveRight /> : <MoveLeft />} {t('Back')}
        </Button>
        <Button
          type="primary"
          loading={isSubmittingData}
          onClick={() => {
            if (step === 1) {
              // if (selectedCategories.length === 0) setCategoryError(true);
              if (!arName.value) setArName({ ...validateArName(arName.value), value: arName.value })
              if (!enName.value) setEnName({ ...validateEnName(enName.value), value: enName.value })
            } else if (step === 2) {
              if (!companyPhone.value)
                setCompanyPhone({
                  ...validatePhone((companyCountryCode || '+966') + '' + companyPhone.value, false),
                  value: companyPhone.value,
                })
            }

            if (step === 1) {
              if (
                arName.value &&
                enName.value &&
                !domain.errorMsg &&
                commercialNumber &&
                form.getFieldValue('size') &&
                form.getFieldValue('industry') !== undefined &&
                !companyPhone.errorMsg &&
                regularLicensingDocUrl &&
                form.getFieldValue('commercialNumberIssuanceDate')
              )
                setStep((old) => old + 1)
            } else if (step === 5) {
              form.submit()
            } else if (step === 2) {
              if (arLogoUrl && enLogoUrl) setStep((old) => old + 1)
            } else if (step === 3) {
              if (
                form.getFieldValue('countryId') &&
                form.getFieldValue('cityId') &&
                location.longitude
              ) {
                setStep((old) => old + 1)
              }
              if (!location.address) {
                setLocationError(true)
              }
            } else if (step === 4) {
              if (
                form.getFieldValue('ownerName') &&
                form.getFieldValue('lastName') &&
                !phone.errorMsg &&
                !ownerEmail.errorMsg
              ) {
                setStep((old) => old + 1)
              }
            }
          }}
        >
          {finalStep ? (
            <div className="flex gap-2 items-center">
              {t('Finish')} <Save />
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              {t('Next')} {lng === 'ar' ? <MoveLeft /> : <MoveRight />}{' '}
            </div>
          )}
        </Button>
      </div>
    )
  }

  const renderStepLabel = (label: string) => {
    return (
      <div className="onboarding-label p-3">
        <Tag className="bg-primary p-3 text-xl">{t(label)}</Tag>
      </div>
    )
  }

  const getCities = async (parentId: number) => {
    let result = await locationServiceInstance.getAllLite({
      isActive: true,
      skipCount: 0,
      maxResultCount: 1000,
      type: LocationType.City,
      parentId,
    })
    setCities(result.items)
  }

  const getData = async (id: number) => {
    setIsLoading(true)
    try {
      let res: any = await abpServiceInstance.abpApplicationConfigurationGet(
        accessToken + '',
        false,
        lng,
        tenant
      )
      getCountries()
      getBanks()
      setGrantedPolicies(Object.keys(res?.auth?.grantedPolicies))
      setFeatures(res.features.values)
      setRole(res.currentUser.roles?.[0])
      const result = await applicationReqsServiceInstance.get(id)
      setData(result)
      if (result.status === ApplicationRequestStatus.Verified) {
        setOwnerEmail({
          ...validateEmail(result?.managerInfo?.email, true),
          value: result?.managerInfo?.email,
        })
        setArName({ ...validateArName(result?.arName), value: result?.arName })
        setEnName({ ...validateEnName(result?.enName), value: result?.enName })
        setDomain({ ...validateDomian(result?.subDomainName), value: result?.subDomainName })
        form.setFieldValue('domain', result?.subDomainName)
        setOwnerCountryCode(result?.managerInfo?.countryCode)
        setPhone({
          ...validatePhone(
            result?.managerInfo?.countryCode + '' + result?.managerInfo?.phoneNumber
          ),
          value: result?.managerInfo?.phoneNumber,
        })
        form.setFieldValue('ownerName', result?.managerInfo?.name)
        form.setFieldValue('lastName', result?.managerInfo?.lastName)
        form.setFieldValue('arName', result?.arName)
        form.setFieldValue('enName', result?.enName)
        form.setFieldValue('domain', result?.subDomainName)
        setColor(result?.primaryColor || '#07C692')
        form.setFieldValue('address', result?.address)
        form.setFieldValue('latitude', result?.latitude)
        form.setFieldValue('longitude', result?.longitude)
        form.setFieldValue('link', result?.link)
        setLocation({
          latitude: result?.latitude,
          address: result?.address,
          longitude: result?.longitude,
        })
        form.setFieldValue('link', result?.link)
        setCommercialNumber(result?.commercialNumber)
        form.setFieldValue(
          'commercialNumberIssuanceDate',
          renderDateTimeWithoutFormat(result?.commercialNumberIssuanceDate)
        )
        form.setFieldValue('cityId', result?.cityId)
        form.setFieldValue('countryId', +result?.city?.country.value)
        if (result?.city?.country.value) getCities(+result?.city?.country.value)

        form.setFieldValue('size', result?.size)
        setCompanyCountryCode(result?.countryCode || '+966')
        if (result?.phoneNumber)
          setCompanyPhone({
            ...validatePhone((result?.countryCode || '+966') + '' + result?.phoneNumber, false),
            value: result?.phoneNumber,
          })
        setCompanyEmail({ ...validateEmail(result?.email || ''), value: result?.email || '' })

        form.setFieldValue('industry', result?.industry)
        if (result?.arDescription)
          setArDescription({
            ...validateArNameOptional(result?.arDescription),
            value: result?.arDescription,
          })
        if (result?.enDescription)
          setEnDescription({
            ...validateEnNameOptional(result?.enDescription),
            value: result?.enDescription,
          })
        form.setFieldValue('arDescription', result?.arDescription)
        form.setFieldValue('enDescription', result?.enDescription)
        form.setFieldValue('arLogo', result?.arLogo)
        form.setFieldValue('enLogo', result?.enLogo)
        setArLogoUrl(result?.arLogo)
        setEnLogoUrl(result?.enLogo)

        form.setFieldValue('bankId', result?.bankInfo?.bankId || undefined)
        setAccountNumber(result?.bankInfo?.accountNumber || '')
        setTaxNumber(result?.bankInfo?.taxNumber || '')
        form.setFieldValue('regularLicensingDocUrl', result?.bankInfo?.regularLicensingDocUrl)
        setRegularLicensingDocUrl(result?.bankInfo?.regularLicensingDocUrl)
      } else {
        setMessage(t('TheApplicationRequestCanNotAbleToOnboardingAgain'))
      }
    } catch {
      router.replace(`/${lng}/admin/companies/application-requests`)
    }

    setIsLoading(false)
  }

  const onOwnerEmailChange = (e: any) => {
    let value = e.target.value
    setOwnerEmail({ ...validateEmail(value, true), value })
  }
  const onDomainChange = (e: any) => {
    let value = e.target.value
    setDomain({ ...validateDomian(value), value })
  }
  const onCompanyEmailChange = (e: any) => {
    let value = e.target.value
    setCompanyEmail({ ...validateEmail(value), value })
  }

  const onArDescriptionChange = (e: any) => {
    let value = e.target.value
    setArDescription({ ...validateArNameOptional(value), value })
  }
  const onEnDescriptionChange = (e: any) => {
    let value = e.target.value
    setEnDescription({ ...validateEnNameOptional(value), value })
  }

  const onArChange = (e: any) => {
    let value = e.target.value
    setArName({ ...validateArName(value), value })
  }

  const onEnChange = (e: any) => {
    let value = e.target.value
    setEnName({ ...validateEnName(value), value })
  }

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmittingData(true)
      try {
        values.address = location.address
        values.latitude = location.latitude
        values.longitude = location.longitude
        ;(values.managerPhoneNumber = removeWhiteSpaces(phone.value)),
          (values.commercialNumber = commercialNumber)
        values.arDescription = arDescription.value
        values.enDescription = enDescription.value
        values.countryCode = companyCountryCode
        values.phoneNumber = removeWhiteSpaces(companyPhone.value)
        values.email = companyEmail.value
        values.arLogo = arLogoUrl
        values.enLogo = enLogoUrl
        values.bankInfo = {
          bankId: values.bankId,
          accountNumber: accountNumber,
          taxNumber: taxNumber,
          // "commercialRecordNumber": commercialRecordNumber,
          regularLicensingDocUrl: regularLicensingDocUrl,
          // "documentIssueDate": values.documentIssueDate,
          // "documentExpiryDate": values.documentExpiryDate
        }
        values.subDomainName = data?.subDomainName || domain.value
        values.enName = enName.value
        values.arName = arName.value
        values.id = data?.id
        values.managerInfo = {
          name: values.ownerName,
          lastName: values.lastName,
          countryCode: ownerCountryCode,
          phoneNumber: removeWhiteSpaces(phone.value),
          email: ownerEmail.value,
          password: values.password,
        }
        values.commercialNumberIssuanceDate = moment(values?.commercialNumberIssuanceDate)
          .hours(12)
          .minutes(12)

        if (typeof color === 'string' || color instanceof String) {
          values.primaryColor = color
        } else {
          values.primaryColor = color?.toHexString()
        }
        await applicationReqsServiceInstance.updateCompleteInfo(values)
        await applicationReqsServiceInstance.setAsWaitingForApproval(values.id)

        setStep((old) => old + 1)
        setTimeout(() => {
          fire(0.25, {
            spread: 26,
            startVelocity: 55,
          })
          fire(0.2, {
            spread: 60,
          })
          fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8,
          })
          fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2,
          })
          fire(0.1, {
            spread: 120,
            startVelocity: 45,
          })
        }, 1000)
      } catch (err: unknown) {
        if (err instanceof Error) {
        }
      } finally {
        setIsSubmittingData(false)
      }
    } catch (err: any) {
      setIsSubmittingData(false)
    }
  }

  return (
    <>
      {contextHolder}
      {Message ? (
        <div className="min-h-[calc(100vh_-_150px)] flex flex-col gap-3 items-center justify-center w-full">
          <h3 className="text-3xl">{Message}</h3>
          <Button
            type="primary"
            onClick={() => router.push(`/${lng}/admin/companies/application-requests`)}
          >
            {t('ReturnToApplicationReqsPage')}
          </Button>
        </div>
      ) : (
        <>
          <Card className="p-0">
            <CardHeader className="border-b px-4 pt-2 pb-0">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
                <div className="flex justify-center lg:justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold">{t('CompanyOnboarding')}</h3>
                    <p>{t('OnboardingNote')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2"></div>
              </div>
            </CardHeader>
            <CardContent className="py-4 px-4">
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <Form scrollToFirstError form={form} layout="vertical" onFinish={handleSubmit}>
                    <div
                      className="onboarding-content"
                      style={{ display: step === 0 ? 'flex' : 'none' }}
                    >
                      <Row gutter={20} className="w-full">
                        <Col xs={24} lg={10}>
                          <Onboarding01 />
                        </Col>

                        <Col xs={24} lg={14} className="flex flex-col gap-3">
                          <h2 className="mb-3 font-bold text-primary text-2xl">
                            {t('OnboardingWelcome')}
                            <span className="mx-1 text-gray-700 text-sm">
                              {t('OnboardingDesc')}
                            </span>
                          </h2>
                          {data && (
                            <>
                              <h4 className="mb-2">
                                <Home className="text-primary" />{' '}
                                {`${lng === 'ar' ? data?.arName : data?.enName}, ${data?.managerInfo.name}`}
                              </h4>
                              {data?.managerInfo.email && (
                                <h4 className="mb-2">
                                  <Mail className="text-primary" /> {data?.managerInfo.email}
                                </h4>
                              )}
                              <h4>
                                <Pin className="text-primary" /> {data?.city.country.text},{' '}
                                {data?.city.text}
                              </h4>
                            </>
                          )}
                          <p className="mt-7 mb-2">
                            <Checkbox
                              checked={agreement}
                              onChange={(e) => {
                                setAgreement(e.target.checked)
                              }}
                            >
                              {t('IAgreeOn') + ' '}
                              <Link href={`/${lng}/terms-and-conditions`} target="_blank">
                                {t('TermsAndConditions')}
                              </Link>
                              {' ' + t('And') + ' '}
                              <Link href={`/${lng}/privacy-policy`} target="_blank">
                                {t('PivacyPolicy')}
                              </Link>
                            </Checkbox>
                          </p>
                          <div className="flex gap-2 flex-wrap items-center mt-6">
                            <Button
                              type="primary"
                              className="w-max"
                              disabled={!agreement}
                              onClick={() => setStep(1)}
                            >
                              {t('GetStarted')}
                            </Button>
                            <Button
                              type="default"
                              onClick={() =>
                                router.replace(`/${lng}/admin/companies/application-requests`)
                              }
                            >
                              {t('GoBackToApplicationRequests')}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div
                      className="onboarding-content"
                      style={{ display: step === 1 ? 'flex' : 'none' }}
                    >
                      {renderStepLabel('BasicInfo')}
                      <Row
                        gutter={[45, 10]}
                        style={{ marginTop: '30px', width: '100%', maxWidth: 875 }}
                      >
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            validateStatus={arName.validateStatus}
                            help={arName.errorMsg}
                            name="arName"
                            label={t('CompanyArName')}
                          >
                            <Input onChange={onArChange} value={arName?.value} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            validateStatus={enName.validateStatus}
                            help={enName.errorMsg}
                            name="enName"
                            label={t('CompanyEnName')}
                          >
                            <Input onChange={onEnChange} value={enName?.value} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            label={t('Domain')!}
                            name="domain"
                            validateStatus={domain.validateStatus}
                            help={domain.errorMsg}
                            rules={[new Rules().getMandatoryRule()]}
                          >
                            <Input
                              autoComplete="off"
                              value={domain?.value}
                              style={{ direction: 'ltr', textAlign: 'left' }}
                              onChange={onDomainChange}
                              suffix={'.atraslink.com'}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('CompanySize')}
                            name="size"
                          >
                            <Select
                              placeholder={t('PleaseSelectSize')}
                              showSearch
                              virtual={false}
                              dropdownStyle={{ zIndex: 9999 }}
                              optionFilterProp="children"
                              filterOption={(input, option: any) =>
                                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              <Select.Option key={1} value={'Small'}>
                                {t('Small')}
                              </Select.Option>
                              <Select.Option key={2} value={'Medium'}>
                                {t('Medium')}
                              </Select.Option>
                              <Select.Option key={3} value={'Large'}>
                                {t('Large')}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} lg={8}>
                          <PhoneInput
                            type={DrawerType.Edit}
                            lng={lng}
                            optional
                            label={t('CompanyPhoneNumber')}
                            setConuntryCode={setCompanyCountryCode}
                            countryCode={companyCountryCode}
                            phone={companyPhone}
                            setPhone={setCompanyPhone}
                          />
                        </Col>

                        <Col xs={24} lg={8}>
                          <Form.Item
                            label={t('CompanyEmail')}
                            validateStatus={companyEmail.validateStatus}
                            help={companyEmail.errorMsg}
                            rules={[new Rules().getMandatoryRule()]}
                          >
                            <Input onChange={onCompanyEmailChange} value={companyEmail.value} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('Industry')}
                            name="industry"
                          >
                            <Select
                              placeholder={t('PleaseSelectIndustry')}
                              showSearch
                              virtual={false}
                              dropdownStyle={{ zIndex: 9999 }}
                              optionFilterProp="children"
                              filterOption={(input, option: any) =>
                                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              <Select.Option key={36} value={36}>
                                {t('EventsManagementEInvitations')}
                              </Select.Option>
                              <Select.Option key={'0'} value={0}>
                                {t('Agriculture')}
                              </Select.Option>
                              <Select.Option key={'1'} value={1}>
                                {t('Automotive')}
                              </Select.Option>
                              <Select.Option key={'2'} value={2}>
                                {t('Banking')}
                              </Select.Option>
                              <Select.Option key={'3'} value={3}>
                                {t('Biotechnology')}
                              </Select.Option>
                              <Select.Option key={'4'} value={4}>
                                {t('Construction')}
                              </Select.Option>
                              <Select.Option key={'5'} value={5}>
                                {t('Consulting')}
                              </Select.Option>
                              <Select.Option key={'6'} value={6}>
                                {t('ConsumerGoods')}
                              </Select.Option>
                              <Select.Option key={'7'} value={7}>
                                {t('Education')}
                              </Select.Option>
                              <Select.Option key={'8'} value={8}>
                                {t('Energy')}
                              </Select.Option>
                              <Select.Option key={'9'} value={9}>
                                {t('Entertainment')}
                              </Select.Option>
                              <Select.Option key={'10'} value={10}>
                                {t('EnvironmentalServices')}
                              </Select.Option>
                              <Select.Option key={'11'} value={11}>
                                {t('Finance')}
                              </Select.Option>
                              <Select.Option key={'12'} value={12}>
                                {t('FoodBeverage')}
                              </Select.Option>
                              <Select.Option key={'13'} value={13}>
                                {t('Government')}
                              </Select.Option>
                              <Select.Option key={'14'} value={14}>
                                {t('Healthcare')}
                              </Select.Option>
                              <Select.Option key={'15'} value={15}>
                                {t('Hospitality')}
                              </Select.Option>
                              <Select.Option key={'16'} value={16}>
                                {t('InformationTechnology')}
                              </Select.Option>
                              <Select.Option key={'17'} value={17}>
                                {t('Insurance')}
                              </Select.Option>
                              <Select.Option key={'18'} value={18}>
                                {t('Legal')}
                              </Select.Option>
                              <Select.Option key={'19'} value={19}>
                                {t('Logistics')}
                              </Select.Option>
                              <Select.Option key={'20'} value={20}>
                                {t('Manufacturing')}
                              </Select.Option>
                              <Select.Option key={'21'} value={21}>
                                {t('Media')}
                              </Select.Option>
                              <Select.Option key={'22'} value={22}>
                                {t('Mining')}
                              </Select.Option>
                              <Select.Option key={'23'} value={23}>
                                {t('Nonprofit')}
                              </Select.Option>
                              <Select.Option key={'24'} value={24}>
                                {t('Pharmaceutical')}
                              </Select.Option>
                              <Select.Option key={'25'} value={25}>
                                {t('RealEstate')}
                              </Select.Option>
                              <Select.Option key={'26'} value={26}>
                                {t('Recruitment')}
                              </Select.Option>
                              <Select.Option key={'27'} value={27}>
                                {t('Retail')}
                              </Select.Option>
                              <Select.Option key={'28'} value={28}>
                                {t('ScienceResearch')}
                              </Select.Option>
                              <Select.Option key={'29'} value={29}>
                                {t('Software')}
                              </Select.Option>
                              <Select.Option key={'30'} value={30}>
                                {t('Telecommunications')}
                              </Select.Option>
                              <Select.Option key={'31'} value={31}>
                                {t('Transportation')}
                              </Select.Option>
                              <Select.Option key={'32'} value={32}>
                                {t('Utilities')}
                              </Select.Option>
                              <Select.Option key={'33'} value={33}>
                                {t('Warehousing')}
                              </Select.Option>
                              <Select.Option key={'34'} value={34}>
                                {t('Wholesale')}
                              </Select.Option>
                              <Select.Option key={'35'} value={35}>
                                {t('Other')}
                              </Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item name="link" label={t('ReferenceLink')}>
                            <Input type="url" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('RegularLicensingDocument')}
                            name="regularLicensingDocUrl"
                          >
                            {regularLicensingDocUrl && !isRegularLicensingDocUrlUploading ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Image
                                  width={70}
                                  height={70}
                                  className="rounded-md object-contain cursor-pointer"
                                  preview={false}
                                  onClick={() =>
                                    modal.info({
                                      closable: true,
                                      closeIcon: <X className="text-white mt-[6px]" size={20} />,
                                      content: (
                                        <iframe
                                          src={regularLicensingDocUrl}
                                          title="iframe"
                                          width="100%"
                                          className="!h-[calc(100vh_-_80px)] !border-0"
                                        ></iframe>
                                      ),
                                      icon: null,
                                      className: 'external-file-modal',
                                      footer: false,
                                      width: '100%',
                                      centered: true,
                                    })
                                  }
                                  src={'/images/pdf.jpg'}
                                  alt={t('RegularLicensingDocUrl')}
                                />
                                <FileUploader
                                  singleFile
                                  PDFOnly
                                  extra={t('MaxFileSize') + ': ' + maxFileSize + ' ' + t('MB')}
                                  OnOK={(e: any) => uploadImage(e[0], 'regularLicensingDocUrl')}
                                  handleChange={(e: any) =>
                                    uploadImage(e, 'regularLicensingDocUrl')
                                  }
                                  loading={isRegularLicensingDocUrlUploading}
                                  buttonMode
                                  lng={lng}
                                  icon={<Edit className="text-white" size={15} />}
                                />
                              </div>
                            ) : (
                              <FileUploader
                                singleFile
                                PDFOnly
                                lng={lng}
                                extra={t('MaxFileSize') + ': ' + maxFileSize + ' ' + t('MB')}
                                OnOK={(e: any) => {
                                  uploadImage(e[0], 'regularLicensingDocUrl')
                                }}
                                uploading={isRegularLicensingDocUrlUploading}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item
                            label={t('ArDescription')}
                            validateStatus={arDescription.validateStatus}
                            help={arDescription.errorMsg}
                            name="arDescription"
                          >
                            <Input.TextArea rows={4} onChange={onArDescriptionChange} />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item
                            label={t('EnDescription')}
                            validateStatus={enDescription.validateStatus}
                            help={enDescription.errorMsg}
                            name="enDescription"
                          >
                            <Input.TextArea rows={4} onChange={onEnDescriptionChange} />
                          </Form.Item>
                        </Col>

                        <Col xs={24} lg={12}>
                          <Form.Item
                            label={t('CommercialRecordNumber')}
                            required
                            rules={[new Rules().getMandatoryRule()]}
                          >
                            <Input
                              value={commercialNumber}
                              onChange={(e) => setCommercialNumber(preventString(e.target.value))}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item
                            label={t('CommercialRecordReleaseDate')}
                            name="commercialNumberIssuanceDate"
                            rules={[new Rules().getMandatoryRule()]}
                          >
                            <MyDatePicker
                              style={{ width: '100%' }}
                              placeholder={t('SelectDate')!}
                              locale={{
                                lang: {
                                  locale: 'ar_EG',
                                  placeholder: t('SelectDate'),
                                  rangePlaceholder: [t('StartDate'), t('EndDate')],
                                  today: t('Today'),
                                  week: '',
                                  now: t('Now'),
                                  backToToday: 'Back to today',
                                  ok: 'تم',
                                  clear: 'Clear',
                                  month: 'Month',
                                  year: 'Year',
                                  timeSelect: 'Select time',
                                  dateSelect: 'Select date',
                                  monthSelect: 'Choose a month',
                                  yearSelect: 'Choose a year',
                                  decadeSelect: 'Choose a decade',
                                  yearFormat: 'YYYY',
                                  dateFormat: 'M/D/YYYY',
                                  dayFormat: 'D',
                                  dateTimeFormat: 'M/D/YYYY HH:mm:ss',
                                  monthFormat: 'MM',
                                  monthBeforeYear: true,
                                  previousMonth: 'Previous month (PageUp)',
                                  nextMonth: 'Next month (PageDown)',
                                  previousYear: 'Last year (Control + left)',
                                  nextYear: 'Next year (Control + right)',
                                  previousDecade: 'Last decade',
                                  nextDecade: 'Next decade',
                                  previousCentury: 'Last century',
                                  nextCentury: 'Next century',
                                  shortWeekDays: [
                                    t('Sun'),
                                    t('Mon'),
                                    t('Tue'),
                                    t('Wed'),
                                    t('Thu'),
                                    t('Fri'),
                                    t('Sat'),
                                  ],
                                },
                                timePickerLocale: {
                                  placeholder: 'Select time',
                                },
                                dateFormat: 'YYYY-MM-DD',
                                dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
                                weekFormat: 'YYYY-wo',
                                monthFormat: 'YYYY-MM',
                              }}
                              format={defaultDateFormat}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      {renderStepsNavigator()}
                    </div>

                    <div
                      className="onboarding-content"
                      style={{ display: step === 5 ? 'flex' : 'none' }}
                    >
                      {renderStepLabel('BankInfo')}
                      <Row
                        gutter={[45, 10]}
                        style={{ marginTop: '30px', maxWidth: 875, width: '100%' }}
                      >
                        <Col xs={24} lg={12}>
                          <Form.Item label={t('Bank')} name="bankId">
                            <Select
                              placeholder={t('PleaseSelectBank')}
                              showSearch
                              virtual={false}
                              dropdownStyle={{ zIndex: 9999 }}
                              optionFilterProp="children"
                              filterOption={(input, option: any) =>
                                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {banks?.map((element: LiteEntityDto) => (
                                <Select.Option key={+element.value} value={+element.value}>
                                  {element.text}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col xs={24} lg={12}>
                          <Form.Item label={t('BankAccountNumber')}>
                            <Input
                              value={accountNumber}
                              onChange={(e) => setAccountNumber(preventString(e.target.value))}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                          <Form.Item label={t('TaxNumber')}>
                            <Input
                              value={taxNumber}
                              onChange={(e) => setTaxNumber(preventString(e.target.value))}
                            />
                          </Form.Item>
                        </Col>

                        {/* <Col xs={24} lg={12}>
                                            <Form.Item
                                                label={t('CommercialRecordNumber2')}
                                                required
                                                rules={[new Rules().getMandatoryRule()]}>
                                                <Input value={commercialRecordNumber} onChange={(e) => setCommercialRecordNumber(preventString(e.target.value))} />
                                            </Form.Item>
                                        </Col> */}

                        {/* <Col xs={24} lg={12}>
                                            <Form.Item
                                                label={t('IssuanceOfTheStatutoryLicensingDocumentDate')}
                                                name='documentIssueDate'
                                            >
                                                <MyDatePicker
                                                    style={{ width: '100%' }}
                                                    placeholder={t('SelectDate')!}
                                                    format={defaultDateFormat}
                                                    locale={
                                                        {
                                                            "lang": {
                                                                "locale": "ar_EG",
                                                                "placeholder": t("SelectDate"),
                                                                "rangePlaceholder": [t("StartDate"), t("EndDate")],
                                                                "today": t('Today'),
                                                                "now": t('Now'),
                                                                "backToToday": "Back to today",
                                                                "ok": t('OK3'),
                                                                "clear": "Clear",
                                                                "month": "Month",
                                                                "year": "Year",
                                                                "timeSelect": "Select time",
                                                                "dateSelect": "Select date",
                                                                "monthSelect": "Choose a month",
                                                                "yearSelect": "Choose a year",
                                                                "decadeSelect": "Choose a decade",
                                                                "yearFormat": "YYYY",
                                                                "dateFormat": "M/D/YYYY",
                                                                "dayFormat": "D",
                                                                "dateTimeFormat": "M/D/YYYY HH:mm:ss",
                                                                "monthFormat": "MM",
                                                                "monthBeforeYear": true,
                                                                "previousMonth": "Previous month (PageUp)",
                                                                "nextMonth": "Next month (PageDown)",
                                                                "previousYear": "Last year (Control + left)",
                                                                "nextYear": "Next year (Control + right)",
                                                                "previousDecade": "Last decade",
                                                                "nextDecade": "Next decade",
                                                                "previousCentury": "Last century",
                                                                "nextCentury": "Next century",
                                                                "shortWeekDays": [t('Sun'), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat')],
                                                            },
                                                            "timePickerLocale": {
                                                                "placeholder": "Select time"
                                                            },
                                                            "dateFormat": "YYYY-MM-DD",
                                                            "dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
                                                            "weekFormat": "YYYY-wo",
                                                            "monthFormat": "YYYY-MM"
                                                        }
                                                    }
                                                />
                                            </Form.Item>
                                        </Col>
             
                                        <Col xs={24} lg={12} >
                                            <Form.Item
                                                label={t('DocumentExpiryDate')}
                                                name='documentExpiryDate'
                                                rules={[new Rules().getMandatoryRule()]}
                                            >
                                                <MyDatePicker
                                                    style={{ width: '100%' }}
                                                    placeholder={t('SelectDate')!}
                                                    format={defaultDateFormat}
                                                    locale={
                                                        {
                                                            "lang": {
                                                                "locale": "ar_EG",
                                                                "placeholder": t("SelectDate"),
                                                                "rangePlaceholder": [t("StartDate"), t("EndDate")],
                                                                "today": t('Today'),
                                                                "now": t('Now'),
                                                                "backToToday": "Back to today",
                                                                "ok": t('OK3'),
                                                                "clear": "Clear",
                                                                "month": "Month",
                                                                "year": "Year",
                                                                "timeSelect": "Select time",
                                                                "dateSelect": "Select date",
                                                                "monthSelect": "Choose a month",
                                                                "yearSelect": "Choose a year",
                                                                "decadeSelect": "Choose a decade",
                                                                "yearFormat": "YYYY",
                                                                "dateFormat": "M/D/YYYY",
                                                                "dayFormat": "D",
                                                                "dateTimeFormat": "M/D/YYYY HH:mm:ss",
                                                                "monthFormat": "MM",
                                                                "monthBeforeYear": true,
                                                                "previousMonth": "Previous month (PageUp)",
                                                                "nextMonth": "Next month (PageDown)",
                                                                "previousYear": "Last year (Control + left)",
                                                                "nextYear": "Next year (Control + right)",
                                                                "previousDecade": "Last decade",
                                                                "nextDecade": "Next decade",
                                                                "previousCentury": "Last century",
                                                                "nextCentury": "Next century",
                                                                "shortWeekDays": [t('Sun'), t('Mon'), t('Tue'), t('Wed'), t('Thu'), t('Fri'), t('Sat')],
                                                            },
                                                            "timePickerLocale": {
                                                                "placeholder": "Select time"
                                                            },
                                                            "dateFormat": "YYYY-MM-DD",
                                                            "dateTimeFormat": "YYYY-MM-DD HH:mm:ss",
                                                            "weekFormat": "YYYY-wo",
                                                            "monthFormat": "YYYY-MM"
                                                        }
                                                    }
                                                />
                                            </Form.Item>
                                        </Col> */}
                      </Row>
                      {renderStepsNavigator(true)}
                    </div>

                    <div
                      className="onboarding-content"
                      style={{ display: step === 2 ? 'flex' : 'none' }}
                    >
                      {renderStepLabel('CompanyIdentity')}
                      <Row
                        gutter={[45, 10]}
                        style={{ marginTop: '30px', maxWidth: 875, width: '100%' }}
                      >
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('ArLogoImage')}
                            name="arLogo"
                          >
                            {arLogoUrl && !isArLogoUrlUploading ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Image
                                  alt={t('ArLogoImage')}
                                  src={arLogoUrl}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    objectFit: 'contain',
                                    borderRadius: 10,
                                  }}
                                />
                                <FileUploader
                                  singleFile
                                  ImageOnly
                                  extra={t('MaxFileSize') + ': ' + maxFileSize + ' ' + t('MB')}
                                  OnOK={(e: any) => uploadImage(e[0], 'arLogo')}
                                  handleChange={(e: any) => uploadImage(e, 'arLogo')}
                                  loading={isArLogoUrlUploading}
                                  buttonMode
                                  lng={lng}
                                  icon={<Edit className="text-white" size={15} />}
                                />
                              </div>
                            ) : (
                              <FileUploader
                                singleFile
                                ImageOnly
                                lng={lng}
                                extra={t('MaxFileSize') + ': ' + maxFileSize + ' ' + t('MB')}
                                OnOK={(e: any) => {
                                  uploadImage(e[0], 'arLogo')
                                }}
                                uploading={isArLogoUrlUploading}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('EnLogoImage')}
                            name="enLogo"
                          >
                            {enLogoUrl && !isEnLogoUrlUploading ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Image
                                  alt={t('EnLogoImage')}
                                  src={enLogoUrl}
                                  style={{
                                    width: 70,
                                    height: 70,
                                    objectFit: 'contain',
                                    borderRadius: 10,
                                  }}
                                />
                                <FileUploader
                                  singleFile
                                  ImageOnly
                                  lng={lng}
                                  extra={t('MaxFileSize') + ': ' + maxFileSize + ' ' + t('MB')}
                                  OnOK={(e: any) => uploadImage(e[0], 'enLogo')}
                                  handleChange={(e: any) => uploadImage(e, 'enLogo')}
                                  loading={isEnLogoUrlUploading}
                                  buttonMode
                                  icon={<Edit className="text-white" size={15} />}
                                />
                              </div>
                            ) : (
                              <FileUploader
                                singleFile
                                ImageOnly
                                lng={lng}
                                extra={t('MaxFileSize') + ': ' + maxFileSize + ' ' + t('MB')}
                                OnOK={(e: any) => {
                                  uploadImage(e[0], 'enLogo')
                                }}
                                uploading={isEnLogoUrlUploading}
                              />
                            )}
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('PrimaryColor')}
                          >
                            <ColorPicker
                              style={{ width: '100%' }}
                              value={color}
                              showText
                              onChangeComplete={setColor}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      {renderStepsNavigator()}
                    </div>

                    <div
                      className="onboarding-content"
                      style={{ display: step === 3 ? 'flex' : 'none' }}
                    >
                      {renderStepLabel('Address')}
                      <Row
                        gutter={[45, 10]}
                        style={{ marginTop: '30px', maxWidth: 875, width: '100%', minWidth: '75%' }}
                      >
                        <Col lg={12} xs={24}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('Country')}
                            name="countryId"
                          >
                            <Select
                              placeholder={t('PleaseSelectCountry')}
                              showSearch
                              virtual={false}
                              dropdownStyle={{ zIndex: 9999 }}
                              optionFilterProp="children"
                              filterOption={(input, option: any) =>
                                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={async (value: string) => {
                                form.setFieldValue('cityId', undefined)
                                getCities(+value)
                              }}
                            >
                              {countries?.map((element: LiteEntityDto) => (
                                <Select.Option key={+element.value} value={+element.value}>
                                  {element.text}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col lg={12} xs={24}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('City')}
                            name="cityId"
                          >
                            <Select
                              placeholder={t('PleaseSelectCity')}
                              showSearch
                              virtual={false}
                              dropdownStyle={{ zIndex: 9999 }}
                              optionFilterProp="children"
                              filterOption={(input, option: any) =>
                                option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {cities?.map((element: LiteEntityDto) => (
                                <Select.Option key={+element.value} value={+element.value}>
                                  {element.text}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                        {isMapIntiated ? (
                          <Col xs={24}>
                            <Form.Item label={t('Address')} required>
                              <div className="map-container w-full">
                                <p className="mt-2 mb-0">{location.address}</p>

                                <MapContainerForEdit
                                  data={{
                                    lat: location.latitude,
                                    lng: location.longitude,
                                    address: location.address,
                                  }}
                                  setLocation={(e: any) => {
                                    setLocation({
                                      latitude: e.latitude,
                                      longitude: e.longitude,
                                      address: e.address,
                                    })
                                    //   form.setFieldValue('address', e.address);
                                  }}
                                />
                              </div>
                              {locationError && (
                                <div
                                  className="ant-form-item-explain ant-form-item-explain-connected"
                                  role="alert"
                                >
                                  <div className="ant-form-item-explain-error">
                                    {t('ThisFieldIsMandatory')}
                                  </div>
                                </div>
                              )}
                            </Form.Item>
                          </Col>
                        ) : null}
                      </Row>
                      {renderStepsNavigator()}
                    </div>
                    <div
                      className="onboarding-content"
                      style={{ display: step === 4 ? 'flex' : 'none' }}
                    >
                      {renderStepLabel('ManagerInfo')}
                      <Row
                        gutter={[45, 10]}
                        style={{ marginTop: '30px', maxWidth: 875, width: '100%', minWidth: '75%' }}
                      >
                        <Col xs={24} lg={8}>
                          <Form.Item
                            label={t('FirstName')}
                            name="ownerName"
                            rules={[new Rules().getMandatoryRule()]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            rules={[new Rules().getMandatoryRule()]}
                            label={t('LastName')}
                            name="lastName"
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8} style={{ position: 'relative' }}>
                          <PhoneInput
                            type={DrawerType.Edit}
                            lng={lng}
                            setConuntryCode={setOwnerCountryCode}
                            countryCode={ownerCountryCode}
                            phone={phone}
                            setPhone={setPhone}
                          />
                        </Col>

                        <Col xs={24} lg={8}>
                          <Form.Item
                            label={t('Email')}
                            validateStatus={ownerEmail.validateStatus}
                            help={ownerEmail.errorMsg}
                            required
                            rules={[new Rules().getMandatoryRule()]}
                          >
                            <Input
                              autoComplete="off"
                              onChange={onOwnerEmailChange}
                              value={ownerEmail.value}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item colon={false} label={t('Password')} name="password">
                            <Input.Password
                              readOnly
                              onFocus={(e) => e.target.removeAttribute('readOnly')}
                              visibilityToggle
                              autoComplete="new-password"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                          <Form.Item
                            colon={false}
                            label={t('ConfirmPassword')}
                            name="confirmpass"
                            dependencies={['password']}
                            rules={[
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                  }
                                  return Promise.reject(
                                    new Error(t('TheTwoPasswordsThatYouEnteredDoNotMatch')!)
                                  )
                                },
                              }),
                            ]}
                          >
                            <Input.Password visibilityToggle autoComplete="new-password" />
                          </Form.Item>
                        </Col>
                      </Row>
                      {renderStepsNavigator()}
                    </div>

                    {step === 6 ? (
                      <div className="onboarding-content">
                        <Onboarding01 />
                        <h1 style={{ maxWidth: 500, textAlign: 'center', fontSize: 34 }}>
                          {t('Congratulations')}
                        </h1>
                        <p style={{ maxWidth: 500, textAlign: 'center' }}>
                          {t('YourCompanyIsNowReady')}
                        </p>
                        <div className="flex gap-3">
                          <Button
                            type="default"
                            onClick={() =>
                              (window.location.href = `https://${domain.value}.atraslink.com`)
                            }
                          >
                            {t('GoToYourCompany')}
                          </Button>
                          {!finalizeAcception ? (
                            <Button
                              type="primary"
                              onClick={() => {
                                popupConfirm(
                                  async () => {
                                    let result = await applicationReqsServiceInstance.accept(
                                      data?.id!,
                                      []
                                    )

                                    message.success(
                                      t('TheApplicationRequestHasBeenSuccessfullyApproved', {
                                        name: lng === 'ar' ? data?.arName : data?.enName,
                                      }),
                                      5
                                    )
                                    setFeaturesDrawer({
                                      open: true,
                                      data: { tenantId: result.tenantId, ...data },
                                    })
                                  },
                                  t('AreYouSureYouWantToApproveThisApplicationRequest', {
                                    name: lng === 'ar' ? data?.arName : data?.enName,
                                  })
                                )
                              }}
                            >
                              {t('FinishOnbarding')}
                            </Button>
                          ) : (
                            <Button
                              type="primary"
                              onClick={() =>
                                router.replace(`/${lng}/admin/companies/application-requests`)
                              }
                            >
                              {t('GoBackToApplicationRequests')}
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </Form>
                </>
              )}
            </CardContent>
          </Card>

          <ManageFeaturesDrawer
            drawer={featuresDrawer}
            setDrawer={setFeaturesDrawer}
            lng={lng}
            onOK={async (
              checked: {
                app: any[]
                mobile: any[]
              },
              trees: {
                app: any[]
                mobile: any[]
              }
            ) => {
              // let checkedFeatures: any = []
              // for (let level1 of treeData) {
              //   if (level1.children?.length === 0) {
              //     if (checkedKeys.includes(level1.key)) {
              //       checkedFeatures.push({ name: level1.name, value: 'true' })
              //     } else {
              //       checkedFeatures.push({ name: level1.name, value: 'false' })
              //     }
              //   } else {
              //     let found = false

              //     for (let level2 of level1.children!) {
              //       if (level2.children?.length === 0) {
              //         if (checkedKeys.includes(level2.key)) {
              //           found = true
              //           checkedFeatures.push({ name: level2.name, value: 'true' })
              //         } else {
              //           checkedFeatures.push({ name: level2.name, value: 'false' })
              //         }

              //         if (
              //           found &&
              //           (checkedFeatures.filter(
              //             (i: any) => i.name === level1.name && i.value === 'false'
              //           )?.length > 0 ||
              //             checkedFeatures.filter((i: any) => i.name === level1.name)?.length === 0)
              //         ) {
              //           checkedFeatures.push({ name: level1.name, value: 'true' })
              //         }
              //         if (
              //           !found &&
              //           (checkedFeatures.filter(
              //             (i: any) => i.name === level1.name && i.value === 'true'
              //           )?.length > 0 ||
              //             checkedFeatures.filter((i: any) => i.name === level1.name)?.length === 0)
              //         )
              //           checkedFeatures.push({ name: level1.name, value: 'false' })
              //       } else {
              //         found = false

              //         for (let level3 of level2.children!) {
              //           if (level3.children?.length === 0) {
              //             if (checkedKeys.includes(level3.key)) {
              //               found = true
              //               checkedFeatures.push({ name: level3.name, value: 'true' })
              //             } else {
              //               checkedFeatures.push({ name: level3.name, value: 'false' })
              //             }
              //           }
              //         }
              //         if (
              //           found &&
              //           (checkedFeatures.filter(
              //             (i: any) => i.name === level2.name && i.value === 'false'
              //           )?.length > 0 ||
              //             checkedFeatures.filter((i: any) => i.name === level2.name)?.length === 0)
              //         ) {
              //           checkedFeatures.push({ name: level2.name, value: 'true' })
              //         }
              //         if (
              //           !found &&
              //           (checkedFeatures.filter(
              //             (i: any) => i.name === level2.name && i.value === 'true'
              //           )?.length > 0 ||
              //             checkedFeatures.filter((i: any) => i.name === level2.name)?.length === 0)
              //         )
              //           checkedFeatures.push({ name: level2.name, value: 'false' })
              //       }
              //     }
              //   }
              // }

              const checkedFeatures: any[] = []

              const processNode = (node: any, currentCheckedKeys: any[]): boolean => {
                const selfChecked = currentCheckedKeys.includes(node.key)

                // leaf
                if (!node.children || node.children.length === 0) {
                  checkedFeatures.push({
                    name: node.name,
                    value: selfChecked ? 'true' : 'false',
                  })

                  return selfChecked
                }

                // process children
                const childResults = node.children.map((child: any) =>
                  processNode(child, currentCheckedKeys)
                )
                const hasCheckedChild = childResults.some(Boolean)

                // OLD LOGIC:
                // only add parent if direct children are leaves
                const childrenAreLeaves = node.children.every(
                  (child: any) => !child.children || child.children.length === 0
                )

                if (childrenAreLeaves) {
                  checkedFeatures.push({
                    name: node.name,
                    value: selfChecked || hasCheckedChild ? 'true' : 'false',
                  })
                }

                return selfChecked || hasCheckedChild
              }

              trees.app.forEach((node: any) => processNode(node, checked.app))

              await companiesServiceInstance.updateFeatures(featuresDrawer?.data?.tenantId, {
                features: checkedFeatures,
              })
              message.success(
                t('TheFeaturesHasBeenSuccessfullyUpdated', {
                  name: lng === 'ar' ? featuresDrawer?.data?.arName : featuresDrawer?.data?.enName,
                }),
                5
              )
              setFeaturesDrawer({ open: false, data: undefined })
              router.replace(`/${lng}/admin/companies`)
            }}
          />
          {/* <ApproveDrawer
            drawer={approveDrawer}
            setFinalizeAcception={setFinalizeAcception}
            setDrawer={setApproveDrawer}
            lng={lng}
            onOK={async (checkedKeys: any, treeData: any) => {
              let checkedFeatures: any = []
              for (let key of checkedKeys) {
                let name = ''
                if (key.includes('-')) {
                  let data = treeData.filter(
                    (item: any) => item.key === key.substring(0, key.indexOf('-'))
                  )?.[0]
                  if (data?.children?.length > 0) {
                    name = data?.children?.filter((item: any) => item.key === key)?.[0]?.name
                    if (name) {
                      checkedFeatures.push({ name: name, value: 'true' })
                      if (checkedFeatures.filter((i: any) => i.name === data.name)?.length === 0)
                        checkedFeatures.push({ name: data.name, value: 'true' })
                    }
                  }
                } else {
                  name = treeData.filter((item: any) => item.key === key)?.[0]?.name
                  if (name) {
                    checkedFeatures.push({ name: name, value: 'true' })
                  }
                }
              }

              checkedFeatures = checkedFeatures.filter(
                (obj: { name: string; value: string }, index: number, self: any[]) =>
                  index === self.findIndex((o) => o.name === obj.name)
              )

              popupConfirm(
                async () => {
                  let result = await applicationReqsServiceInstance.accept(
                    approveDrawer?.data?.id!,
                    []
                  )
                  await companiesServiceInstance.updateFeatures(result.tenantId, {
                    features: checkedFeatures,
                  })

                  message.success(
                    t('TheApplicationRequestHasBeenSuccessfullyApproved', {
                      name: lng === 'ar' ? data?.arName : data?.enName,
                    }),
                    5
                  )
                  setApproveDrawer({ open: false, data: undefined })
                  // await getData(meta.pageSize, 0, keywords);
                },
                t('AreYouSureYouWantToApproveThisApplicationRequest', {
                  name: lng === 'ar' ? data?.arName : data?.enName,
                })
              )
            }}
          /> */}
        </>
      )}
    </>
  )
}
