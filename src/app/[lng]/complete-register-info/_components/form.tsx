import { getClientTranslation } from '@/app/i18n/client'
import FileUploader from '@/components/panel/file-uploader/file-uploader'
import MapModal from '@/components/panel/map/map-modal'
import PhoneInput from '@/components/panel/phone-input'
import { DrawerType, defaultDateFormat } from '@/lib/constants'
import { ModalContext } from '@/lib/context/modal-context'
import { preventString, removeWhiteSpaces, renderDateTimeWithoutFormat } from '@/lib/helpers'
import Rules, {
  validateArName,
  validateArNameOptional,
  validateDomian,
  validateEmail,
  validateEnName,
  validateEnNameOptional,
  validatePhone,
} from '@/lib/rules'
import applicationReqsServiceInstance from '@/lib/services/application-reqs'
import companiesForManagerServiceInstance from '@/lib/services/companies-for-manager'
import { ApplicationRequestStatus, LiteEntityDto, LocationType } from '@/lib/services/dto'
import imageServiceInstance from '@/lib/services/images'
import locationServiceInstance from '@/lib/services/locations'
import type { ColorPickerProps, GetProp } from 'antd'
import {
  App,
  Button,
  Col,
  Collapse,
  ColorPicker,
  DatePicker,
  Form,
  Image,
  Input,
  Row,
  Select,
  Space,
} from 'antd'
import { CollapseProps } from 'antd/lib'
import { Edit, X } from 'lucide-react'
import type { Moment } from 'moment'
import moment from 'moment'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import momentGenerateConfig from 'rc-picker/lib/generate/moment'
import { useContext, useEffect, useState } from 'react'
type Color = GetProp<ColorPickerProps, 'value'>

const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig)
const maxFileSize = 5

export default function CompleteInfoForm({
  lng,
  drawer,
  countries,
  data,
  completeInfo,
  banks,
  onOk,
  onClose,
  host,
  editBasicFromAdmin,
}: {
  editBasicFromAdmin?: boolean
  host?: string
  onClose?: any
  onOk?: any
  completeInfo?: boolean
  data?: any
  lng: string
  drawer?: boolean
  countries: LiteEntityDto[]
  banks: LiteEntityDto[]
}) {
  const { t } = getClientTranslation(lng)
  const [cities, setCities] = useState<LiteEntityDto[]>([])
  const pathname = usePathname()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [domain, setDomain] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
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
  const [phone, setPhone] = useState<any>({ value: '', validateStatus: undefined, errorMsg: null })
  const [arDescription, setArDescription] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
  const { modal } = useContext(ModalContext)

  const [enDescription, setEnDescription] = useState<any>({
    value: '',
    validateStatus: undefined,
    errorMsg: null,
  })
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
    enable: boolean
  }>({
    latitude: undefined,
    longitude: undefined,
    address: '',
    enable: false,
  })
  const { message } = App.useApp()

  const searchParams = useSearchParams()
  const otp = searchParams.get('otp')
  const phoneNumber = searchParams.get('phone')
  const countryCode = searchParams.get('countrycode')
  const [status, setStatus] = useState<ApplicationRequestStatus | undefined>(undefined)
  const router = useRouter()
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
  const [color, setColor] = useState<any>('#07C692')
  const [commercialNumber, setCommercialNumber] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [isMapIntiated, setIsMapIntiated] = useState(false)
  const [locationError, setLocationError] = useState(false)

  useEffect(
    () => {
      if (data) {
        setOwnerEmail({
          ...validateEmail(data?.managerInfo?.email),
          value: data?.managerInfo?.email,
        })
        setArName({ ...validateArName(data?.arName), value: data?.arName })
        setEnName({ ...validateEnName(data?.enName), value: data?.enName })
        setDomain({ ...validateDomian(data?.subDomainName), value: data?.subDomainName })
        setOwnerCountryCode(data?.managerInfo?.countryCode)
        setPhone({
          ...validatePhone(data?.managerInfo?.countryCode + '' + data?.managerInfo?.phoneNumber),
          value: data?.managerInfo?.phoneNumber,
        })
        // setCompanyPhone
        form.setFieldValue('ownerName', data?.managerInfo?.name)
        form.setFieldValue('lastName', data?.managerInfo?.lastName)
        form.setFieldValue('arName', data?.arName)
        form.setFieldValue('enName', data?.enName)
        form.setFieldValue('domain', data?.subDomainName)
        form.setFieldValue('address', data?.address)
        form.setFieldValue('latitude', data?.latitude)
        form.setFieldValue('longitude', data?.longitude)
        form.setFieldValue('link', data?.link)
        setLocation({
          latitude: data?.latitude,
          address: data?.address,
          longitude: data?.longitude,
          enable: false,
        })
        form.setFieldValue('link', data?.link)
        setCommercialNumber(data?.commercialNumber)
        form.setFieldValue(
          'commercialNumberIssuanceDate',
          renderDateTimeWithoutFormat(data?.commercialNumberIssuanceDate)
        )
        form.setFieldValue('cityId', data?.cityId)
        form.setFieldValue(
          'countryId',
          data?.city?.country?.value ? +data?.city?.country?.value : undefined
        )
        if (data?.city?.country?.value) getCities(data?.city?.country.value)

        setStatus(data?.status)
        form.setFieldValue('size', data?.size)
        setCompanyCountryCode(data?.countryCode || '+966')
        if (data?.phoneNumber)
          setCompanyPhone({
            ...validatePhone((data?.countryCode || '+966') + '' + data?.phoneNumber),
            value: data?.phoneNumber,
          })
        setCompanyEmail({ ...validateEmail(data?.email || ''), value: data?.email || '' })

        form.setFieldValue('industry', data?.industry)
        if (data?.arDescription)
          setArDescription({
            ...validateArNameOptional(data?.arDescription),
            value: data?.arDescription,
          })
        if (data?.enDescription)
          setEnDescription({
            ...validateEnNameOptional(data?.enDescription),
            value: data?.enDescription,
          })
        form.setFieldValue('arDescription', data?.arDescription)
        form.setFieldValue('enDescription', data?.enDescription)
        form.setFieldValue('arLogo', data?.arLogo)
        form.setFieldValue('enLogo', data?.enLogo)
        setArLogoUrl(data?.arLogo)
        setEnLogoUrl(data?.enLogo)
        setColor(data?.primaryColor || '#07C692')
        form.setFieldValue('bankId', data?.bankInfo?.bankId || undefined)
        setAccountNumber(data?.bankInfo?.accountNumber || undefined)
        setTaxNumber(data?.bankInfo?.taxNumber || undefined)
        form.setFieldValue(
          'bankInfo_RegularLicensingDocUrl',
          data?.bankInfo?.regularLicensingDocUrl
        )
        setRegularLicensingDocUrl(data?.bankInfo?.regularLicensingDocUrl)
        setTimeout(() => {
          setIsMapIntiated(true)
        }, 500)
      } else {
        setIsMapIntiated(true)
      }
    }, // eslint-disable-next-line
    [data]
  )

  const onOwnerEmailChange = (e: any) => {
    let value = e.target.value
    setOwnerEmail({ ...validateEmail(value, true), value })
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

  const onFinish = async (values: any) => {
    if (ownerEmail.errorMsg) return
    console.log({ status, location })
    if (
      (!editBasicFromAdmin && location.address) ||
      (status === ApplicationRequestStatus.Verified && !location.address) ||
      (status === ApplicationRequestStatus.WaitingForApproval && !location.address)
    ) {
      setLocationError(true)
      setLocation({ ...location, enable: true })
    } else {
      try {
        setLoading(true)
        try {
          values.commercialNumberIssuanceDate = moment(values?.commercialNumberIssuanceDate)
            .hours(12)
            .minutes(12)

          values.address = location.address
          values.latitude = location.latitude
          values.longitude = location.longitude
          values.arDescription = arDescription.value
          values.commercialNumber = commercialNumber
          values.enDescription = enDescription.value
          values.countryCode = companyCountryCode
          values.phoneNumber = removeWhiteSpaces(companyPhone.value)
          values.email = companyEmail.value
          values.arLogo = arLogoUrl
          values.enLogo = enLogoUrl
          values.otpCode = otp
          values.otpPhoneNumber = removeWhiteSpaces(phoneNumber + '')
          values.otpCountryCode = '+' + countryCode?.substring(1)
          values.bankInfo_RegularLicensingDocUrl = regularLicensingDocUrl

          if (typeof color === 'string' || color instanceof String) {
            values.primaryColor = color
          } else {
            values.primaryColor = color?.toHexString()
          }

          values.bankInfo = {
            bankId: values.bankId,
            accountNumber: accountNumber,
            taxNumber: taxNumber,
            // "commercialRecordNumber": commercialRecordNumber,
            regularLicensingDocUrl: regularLicensingDocUrl,
            // "documentIssueDate": values.documentIssueDate,
            // "documentExpiryDate": values.documentExpiryDate
          }
          values.enName = enName.value
          values.arName = arName.value
          values.managerInfo = {
            name: values.ownerName,
            lastName: values.lastName,
            countryCode: ownerCountryCode,
            phoneNumber: removeWhiteSpaces(phone.value),
            email: ownerEmail.value,
            password: values.password,
          }

          if (pathname.includes('register')) {
            values.currentSubDomain = host
            values.id = data?.id

            await companiesForManagerServiceInstance.completeSignupInfo(values)
            message.success(
              t(
                status === ApplicationRequestStatus.Rejected ||
                  status === ApplicationRequestStatus.WaitingForApproval
                  ? 'TheApplicationRequestHasBeenSuccessfullyUpdated2'
                  : 'TheApplicationRequestHasBeenSuccessfullyCompleted',
                {
                  name: lng === 'ar' ? arName.value : enName.value,
                }
              ),
              5
            )

            router.replace(`/${lng}`)
          } else {
            //admin

            values.id = data?.id
            values.subDomainName = data?.subDomainName || domain.value

            if (
              status === ApplicationRequestStatus.Verified ||
              status === ApplicationRequestStatus.WaitingForApproval
            ) {
              let result = await applicationReqsServiceInstance.updateCompleteInfo(values)
            } else {
              values.subDomainName = domain.value
              delete values.otpCode
              delete values.otpPhoneNumber
              delete values.otpCountryCode
              let result = await applicationReqsServiceInstance.update(values)
            }
            message.success(
              t('TheApplicationRequestHasBeenSuccessfullyUpdated', {
                name: lng === 'ar' ? arName.value : enName.value,
              }),
              5
            )
            onClose?.()
            await onOk?.()
          }
        } finally {
          setLoading(false)
        }
      } catch (err: any) {
        setLoading(false)
      }
    }
  }

  const onDomainChange = (e: any) => {
    let value = e.target.value
    setDomain({ ...validateDomian(value), value })
  }

  const onArChange = (e: any) => {
    let value = e.target.value
    setArName({ ...validateArName(value), value })
  }

  const onEnChange = (e: any) => {
    let value = e.target.value
    setEnName({ ...validateEnName(value), value })
  }

  const uploadImage = async (file: any, field: string) => {
    try {
      if (field === 'arLogo') setIsArLogoUrlUploading(true)
      else if (field === 'enLogo') setIsEnLogoUrlUploading(true)
      else if (field === 'bankInfo_RegularLicensingDocUrl')
        setIsRegularLicensingDocUrlUploading(true)

      let result
      if (field === 'bankInfo_RegularLicensingDocUrl')
        result = await imageServiceInstance.uploadFile({ file: file })
      else result = await imageServiceInstance.uploadImage({ file: file })

      let url = result.url
      form.setFieldValue(field, url)

      if (field === 'arLogo') setArLogoUrl(url)
      else if (field === 'enLogo') setEnLogoUrl(url)
      else if (field === 'bankInfo_RegularLicensingDocUrl') setRegularLicensingDocUrl(url)
    } finally {
      if (field === 'arLogo') setIsArLogoUrlUploading(false)
      else if (field === 'enLogo') setIsEnLogoUrlUploading(false)
      else if (field === 'bankInfo_RegularLicensingDocUrl')
        setIsRegularLicensingDocUrlUploading(false)
    }
  }

  const items: CollapseProps['items'] =
    status === ApplicationRequestStatus.Verified ||
    status === ApplicationRequestStatus.WaitingForApproval ||
    (status === ApplicationRequestStatus.Rejected && data?.enLogo)
      ? [
          {
            key: '1',
            label: t('CompanyInfo'),
            children: (
              <Row gutter={40} align={'bottom'}>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    validateStatus={arName.validateStatus}
                    help={arName.errorMsg}
                    name="arName"
                    label={t('CompanyArName')}
                  >
                    <Input onChange={onArChange} disabled={completeInfo} value={arName?.value} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    validateStatus={enName.validateStatus}
                    help={enName.errorMsg}
                    name="enName"
                    label={t('CompanyEnName')}
                  >
                    <Input onChange={onEnChange} disabled={completeInfo} value={enName?.value} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
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

                <Col xs={24} lg={drawer ? 12 : 8} style={{ position: 'relative' }}>
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
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('CompanyEmail')}
                    validateStatus={companyEmail.validateStatus}
                    help={companyEmail.errorMsg}
                    rules={[new Rules().getMandatoryRule()]}
                  >
                    <Input onChange={onCompanyEmailChange} value={companyEmail.value} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={drawer ? 12 : 8}>
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
                      <Select.Option key={0} value={0}>
                        {t('Agriculture')}
                      </Select.Option>
                      <Select.Option key={1} value={1}>
                        {t('Automotive')}
                      </Select.Option>
                      <Select.Option key={2} value={2}>
                        {t('Banking')}
                      </Select.Option>
                      <Select.Option key={3} value={3}>
                        {t('Biotechnology')}
                      </Select.Option>
                      <Select.Option key={4} value={4}>
                        {t('Construction')}
                      </Select.Option>
                      <Select.Option key={5} value={5}>
                        {t('Consulting')}
                      </Select.Option>
                      <Select.Option key={6} value={6}>
                        {t('ConsumerGoods')}
                      </Select.Option>
                      <Select.Option key={7} value={7}>
                        {t('Education')}
                      </Select.Option>
                      <Select.Option key={8} value={8}>
                        {t('Energy')}
                      </Select.Option>
                      <Select.Option key={9} value={9}>
                        {t('Entertainment')}
                      </Select.Option>
                      <Select.Option key={10} value={10}>
                        {t('EnvironmentalServices')}
                      </Select.Option>
                      <Select.Option key={11} value={11}>
                        {t('Finance')}
                      </Select.Option>
                      <Select.Option key={12} value={12}>
                        {t('FoodBeverage')}
                      </Select.Option>
                      <Select.Option key={13} value={13}>
                        {t('Government')}
                      </Select.Option>
                      <Select.Option key={14} value={14}>
                        {t('Healthcare')}
                      </Select.Option>
                      <Select.Option key={15} value={15}>
                        {t('Hospitality')}
                      </Select.Option>
                      <Select.Option key={16} value={16}>
                        {t('InformationTechnology')}
                      </Select.Option>
                      <Select.Option key={17} value={17}>
                        {t('Insurance')}
                      </Select.Option>
                      <Select.Option key={18} value={18}>
                        {t('Legal')}
                      </Select.Option>
                      <Select.Option key={19} value={19}>
                        {t('Logistics')}
                      </Select.Option>
                      <Select.Option key={20} value={20}>
                        {t('Manufacturing')}
                      </Select.Option>
                      <Select.Option key={21} value={21}>
                        {t('Media')}
                      </Select.Option>
                      <Select.Option key={22} value={22}>
                        {t('Mining')}
                      </Select.Option>
                      <Select.Option key={23} value={23}>
                        {t('Nonprofit')}
                      </Select.Option>
                      <Select.Option key={24} value={24}>
                        {t('Pharmaceutical')}
                      </Select.Option>
                      <Select.Option key={25} value={25}>
                        {t('RealEstate')}
                      </Select.Option>
                      <Select.Option key={26} value={26}>
                        {t('Recruitment')}
                      </Select.Option>
                      <Select.Option key={27} value={27}>
                        {t('Retail')}
                      </Select.Option>
                      <Select.Option key={28} value={28}>
                        {t('ScienceResearch')}
                      </Select.Option>
                      <Select.Option key={29} value={29}>
                        {t('Software')}
                      </Select.Option>
                      <Select.Option key={30} value={30}>
                        {t('Telecommunications')}
                      </Select.Option>
                      <Select.Option key={31} value={31}>
                        {t('Transportation')}
                      </Select.Option>
                      <Select.Option key={32} value={32}>
                        {t('Utilities')}
                      </Select.Option>
                      <Select.Option key={33} value={33}>
                        {t('Warehousing')}
                      </Select.Option>
                      <Select.Option key={34} value={34}>
                        {t('Wholesale')}
                      </Select.Option>
                      <Select.Option key={35} value={35}>
                        {t('Other')}
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('ArDescription')}
                    validateStatus={arDescription.validateStatus}
                    help={arDescription.errorMsg}
                    name="arDescription"
                  >
                    <Input.TextArea rows={4} onChange={onArDescriptionChange} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('EnDescription')}
                    validateStatus={enDescription.validateStatus}
                    help={enDescription.errorMsg}
                    name="enDescription"
                  >
                    <Input.TextArea rows={4} onChange={onEnDescriptionChange} />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={drawer ? 12 : 8}>
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
                <Col xs={24} lg={drawer ? 12 : 8}>
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
                          now: t('Now'),
                          backToToday: 'Back to today',
                          ok: 'تم',
                          clear: 'Clear',
                          month: 'Month',
                          week: '',
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
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item name="link" label={t('ReferenceLink')}>
                    <Input type="url" disabled={completeInfo} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    label={t('RegularLicensingDocument')}
                    name="bankInfo_RegularLicensingDocUrl"
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
                          OnOK={(e: any) => uploadImage(e[0], 'bankInfo_RegularLicensingDocUrl')}
                          handleChange={(e: any) =>
                            uploadImage(e, 'bankInfo_RegularLicensingDocUrl')
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
                          uploadImage(e[0], 'bankInfo_RegularLicensingDocUrl')
                        }}
                        uploading={isRegularLicensingDocUrlUploading}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '3',
            label: t('CompanyIdentity'),
            children: (
              <Row gutter={40}>
                <Col xs={24} lg={drawer ? 12 : 8}>
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
                          style={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 10 }}
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
                <Col xs={24} lg={drawer ? 12 : 8}>
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
                          style={{ width: 70, height: 70, objectFit: 'contain', borderRadius: 10 }}
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
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item rules={[new Rules().getMandatoryRule()]} label={t('PrimaryColor')}>
                    <ColorPicker value={color} showText onChangeComplete={setColor} />
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '4',
            label: t('Address'),
            children: (
              <Row gutter={40}>
                <Col lg={drawer ? 12 : 8} xs={24}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    label={t('Country')}
                    name="countryId"
                  >
                    <Select
                      virtual={false}
                      placeholder={t('PleaseSelectCountry')}
                      showSearch
                      disabled={completeInfo}
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
                <Col lg={drawer ? 12 : 8} xs={24}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    label={t('City')}
                    name="cityId"
                  >
                    <Select
                      disabled={completeInfo}
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
                {isMapIntiated && (
                  <>
                    <Col xs={24}>
                      <Form.Item
                        label={
                          <h3 className="mb-3 required">
                            {t('Address')}
                            <Space>
                              <Button
                                type="link"
                                className="px-0 mx-0 w-fit"
                                onClick={() => setLocation({ ...location, enable: true })}
                              >{`(${t('ChooseLocationOnMap')})`}</Button>
                              <Button
                                type="link"
                                className="px-0 mx-0 w-fit"
                                onClick={() =>
                                  setLocation({
                                    latitude: 24.748303042002888,
                                    address:
                                      'شارع إبراهيم بن أبي بكر, حي النخيل, Al-Riyadh, Riyadh, Saudi Arabia',
                                    longitude: 46.61938961732466,
                                    enable: false,
                                  })
                                }
                              >{`(${t('SelectDefaultAddress')})`}</Button>
                            </Space>
                          </h3>
                        }
                        required
                      >
                        <div className="map-container w-full">
                          <p className="mt-2 mb-0">{location.address}</p>
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
                    <MapModal
                      data={{
                        lat: location?.latitude,
                        lng: location?.longitude,
                        address: location?.address,
                      }}
                      disabled={false}
                      open={location?.enable}
                      lng={lng}
                      setLocation={(e: any) => {
                        setLocation({
                          ...location,
                          latitude: e.latitude,
                          longitude: e.longitude,
                          address: e.address,
                        })
                      }}
                      setOpen={() => setLocation({ ...location, enable: false })}
                    />
                  </>
                )}
              </Row>
            ),
          },
          {
            key: '5',
            label: t('ManagerInfo'),
            children: (
              <Row gutter={40}>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('FirstName')}
                    name="ownerName"
                    rules={[new Rules().getMandatoryRule()]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('LastName')}
                    name="lastName"
                    rules={[new Rules().getMandatoryRule()]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8} style={{ position: 'relative' }}>
                  <PhoneInput
                    type={DrawerType.Edit}
                    lng={lng}
                    setConuntryCode={setOwnerCountryCode}
                    countryCode={ownerCountryCode}
                    phone={phone}
                    setPhone={setPhone}
                  />
                </Col>

                <Col xs={24} lg={drawer ? 12 : 8}>
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
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item colon={false} label={t('Password')} name="password">
                    <Input.Password visibilityToggle autoComplete="new-password" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
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
            ),
          },
          {
            key: '2',
            label: t('BankInfo'),
            children: (
              <Row gutter={40}>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item label={t('Bank')} name="bankId">
                    <Select
                      virtual={false}
                      placeholder={t('PleaseSelectBank')}
                      showSearch
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

                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item label={t('BankAccountNumber')}>
                    <Input
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(preventString(e.target.value))}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item label={t('TaxNumber')}>
                    <Input
                      value={taxNumber}
                      onChange={(e) => setTaxNumber(preventString(e.target.value))}
                    />
                  </Form.Item>
                </Col>

                {/* <Col xs={24} lg={drawer ? 12 : 8}>
                            <Form.Item
                                label={t('CommercialRecordNumber2')}
                                required
                                rules={[new Rules().getMandatoryRule()]}>
                                <Input value={commercialRecordNumber} onChange={(e) => setCommercialRecordNumber(preventString(e.target.value))} />
                            </Form.Item>
                        </Col> */}

                {/* <Col xs={24} lg={drawer ? 12 : 8}>
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
                 
                        <Col xs={24} lg={drawer ? 12 : 8} >
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
            ),
          },
        ]
      : [
          {
            key: '3',
            label: t('BasicInfo'),
            children: (
              <Row gutter={40}>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    validateStatus={arName.validateStatus}
                    help={arName.errorMsg}
                    name="arName"
                    label={t('CompanyArName')}
                  >
                    <Input onChange={onArChange} disabled={completeInfo} value={arName?.value} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    validateStatus={enName.validateStatus}
                    help={enName.errorMsg}
                    name="enName"
                    label={t('CompanyEnName')}
                  >
                    <Input onChange={onEnChange} disabled={completeInfo} value={enName?.value} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('Domain')!}
                    name="domain"
                    validateStatus={domain.validateStatus}
                    help={domain.errorMsg}
                    rules={[new Rules().getMandatoryRule()]}
                  >
                    <Input
                      autoComplete="off"
                      disabled={completeInfo}
                      value={domain?.value}
                      style={{ direction: 'ltr', textAlign: 'left' }}
                      onChange={onDomainChange}
                      suffix={'.atraslink.com'}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item name="link" label={t('ReferenceLink')}>
                    <Input type="url" disabled={completeInfo} />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
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
                <Col xs={24} lg={drawer ? 12 : 8}>
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
                          now: t('Now'),
                          backToToday: 'Back to today',
                          ok: 'تم',
                          clear: 'Clear',
                          week: '',
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
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    label={t('RegularLicensingDocument')}
                    name="bankInfo_RegularLicensingDocUrl"
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
                          OnOK={(e: any) => uploadImage(e[0], 'bankInfo_RegularLicensingDocUrl')}
                          handleChange={(e: any) =>
                            uploadImage(e, 'bankInfo_RegularLicensingDocUrl')
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
                          uploadImage(e[0], 'bankInfo_RegularLicensingDocUrl')
                        }}
                        uploading={isRegularLicensingDocUrlUploading}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            ),
          },
          {
            key: '4',
            label: t('Address'),
            children: (
              <Row gutter={40}>
                <Col lg={drawer ? 12 : 8} xs={24}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    label={t('Country')}
                    name="countryId"
                  >
                    <Select
                      virtual={false}
                      placeholder={t('PleaseSelectCountry')}
                      showSearch
                      disabled={completeInfo}
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
                <Col lg={drawer ? 12 : 8} xs={24}>
                  <Form.Item
                    rules={[new Rules().getMandatoryRule()]}
                    label={t('City')}
                    name="cityId"
                  >
                    <Select
                      disabled={completeInfo}
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

                {isMapIntiated && (
                  <>
                    <Col xs={24}>
                      <div className="map-container w-full">
                        <h3 className="mb-3">
                          {t('Address')}{' '}
                          <Space>
                            <Button
                              type="link"
                              className="px-0 mx-0 w-fit"
                              onClick={() => setLocation({ ...location, enable: true })}
                            >{`(${t('ChooseLocationOnMap')})`}</Button>
                            <Button
                              type="link"
                              className="px-0 mx-0 w-fit"
                              onClick={() =>
                                setLocation({
                                  latitude: 24.748303042002888,
                                  address:
                                    'شارع إبراهيم بن أبي بكر, حي النخيل, Al-Riyadh, Riyadh, Saudi Arabia',
                                  longitude: 46.61938961732466,
                                  enable: false,
                                })
                              }
                            >{`(${t('SelectDefaultAddress')})`}</Button>
                          </Space>
                        </h3>
                        <p className="mt-2 mb-2">{location.address}</p>
                      </div>
                    </Col>
                    <MapModal
                      data={{
                        lat: location?.latitude,
                        lng: location?.longitude,
                        address: location?.address,
                      }}
                      disabled={false}
                      open={location?.enable}
                      lng={lng}
                      setLocation={(e: any) => {
                        setLocation({
                          ...location,
                          latitude: e.latitude,
                          longitude: e.longitude,
                          address: e.address,
                        })
                      }}
                      setOpen={() => setLocation({ ...location, enable: false })}
                    />
                  </>
                )}
              </Row>
            ),
          },
          {
            key: '5',
            label: t('ManagerInfo'),
            children: (
              <Row gutter={40}>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('FirstName')}
                    name="ownerName"
                    rules={[new Rules().getMandatoryRule()]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item
                    label={t('LastName')}
                    name="lastName"
                    rules={[new Rules().getMandatoryRule()]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8} style={{ position: 'relative' }}>
                  <PhoneInput
                    type={DrawerType.Edit}
                    lng={lng}
                    setConuntryCode={setOwnerCountryCode}
                    countryCode={ownerCountryCode}
                    phone={phone}
                    setPhone={setPhone}
                  />
                </Col>

                <Col xs={24} lg={drawer ? 12 : 8}>
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
                <Col xs={24} lg={drawer ? 12 : 8}>
                  <Form.Item colon={false} label={t('Password')} name="password">
                    <Input.Password visibilityToggle autoComplete="new-password" />
                  </Form.Item>
                </Col>
                <Col xs={24} lg={drawer ? 12 : 8}>
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
            ),
          },
        ]

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className={`flex flex-col gap-3 w-full ${drawer || completeInfo ? 'h-full' : 'h-[450px] overflow-y-auto'} overflow-x-hidden  text-white mx-auto min-w-full`}
      colon={false}
      layout="vertical"
    >
      <Collapse
        className="min-w-full w-full"
        items={items}
        defaultActiveKey={['1', '2', '3', '4', '5']}
      />
      <Form.Item>
        <Button type="primary" block htmlType="submit" size="large" loading={loading}>
          {pathname.includes('register') ? t('Complete') : t('Edit')}
        </Button>
      </Form.Item>
    </Form>
  )
}
