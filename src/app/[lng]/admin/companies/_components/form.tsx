import { getClientTranslation } from '@/app/i18n/client'
import FileUploader from '@/components/panel/file-uploader/file-uploader'
import MapModal from '@/components/panel/map/map-modal'
import PhoneInput from '@/components/panel/phone-input'
import { DrawerType, defaultDateFormat } from '@/lib/constants'
import { ModalContext } from '@/lib/context/modal-context'
import { preventString, removeWhiteSpaces, renderDateTimeWithoutFormat } from '@/lib/helpers'
import Rules, {
  validateArName,
  validateDomian,
  validateEmail,
  validateEnName,
  validatePhone,
} from '@/lib/rules'
import applicationReqsServiceInstance from '@/lib/services/application-reqs'
import companiesForManagerServiceInstance from '@/lib/services/companies-for-manager'
import { LiteEntityDto, LocationType } from '@/lib/services/dto'
import imageServiceInstance from '@/lib/services/images'
import locationServiceInstance from '@/lib/services/locations'
import {
  App,
  Button,
  Col,
  Collapse,
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

const MyDatePicker = DatePicker.generatePicker<Moment>(momentGenerateConfig)
const maxFileSize = 5

export default function AddUpdateForm({
  lng,
  drawer,
  type,
  countries,
  updateRegisterInfo,
  data,
  onOK,
  host,
}: {
  host: string
  onOK?: any
  data?: any
  updateRegisterInfo?: boolean
  lng: string
  drawer?: boolean
  type: DrawerType
  countries: LiteEntityDto[]
}) {
  const { t } = getClientTranslation(lng)
  const [cities, setCities] = useState<LiteEntityDto[]>([])
  const pathname = usePathname()
  const { message } = App.useApp()
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
  const [regularLicensingDocUrl, setRegularLicensingDocUrl] = useState<string>('')
  const searchParams = useSearchParams()
  const otp = searchParams.get('otp')
  const phoneNumber = searchParams.get('phone')
  const countryCode = searchParams.get('countrycode')
  const [ownerCountryCode, setOwnerCountryCode] = useState<string>(
    countryCode?.trim()
      ? countryCode?.trim()?.startsWith('+')
        ? countryCode?.trim()
        : `+${countryCode?.trim()}`
      : '+966'
  )

  const [commercialNumber, setCommercialNumber] = useState('')
  const router = useRouter()
  const [isRegularLicensingDocUrlUploading, setIsRegularLicensingDocUrlUploading] =
    useState<boolean>(false)
  const { modal } = useContext(ModalContext)

  useEffect(
    () => {
      if (data) {
        setOwnerEmail({
          ...validateEmail(data?.managerInfo?.email, true),
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
        form.setFieldValue('arName', data?.arName)
        form.setFieldValue('enName', data?.enName)
        form.setFieldValue('domain', data?.subDomainName)
        form.setFieldValue('ownerName', data?.managerInfo?.name)
        form.setFieldValue('lastName', data?.managerInfo?.lastName)
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
        form.setFieldValue('commercialNumber', data?.commercialNumber)
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

        form.setFieldValue(
          'bankInfo_RegularLicensingDocUrl',
          data?.bankInfo?.regularLicensingDocUrl
        )
        setRegularLicensingDocUrl(data?.bankInfo?.regularLicensingDocUrl)
      } else {
        handleClose()
      }
    }, // eslint-disable-next-line
    [data]
  )

  const handleClose = () => {
    form.resetFields()
    setCommercialNumber('')
    setDomain({ value: '', validateStatus: undefined, errorMsg: null })
    setArName({ value: '', validateStatus: undefined, errorMsg: null })
    setEnName({ value: '', validateStatus: undefined, errorMsg: null })
    setPhone({ value: '', validateStatus: undefined, errorMsg: null })
    setOwnerCountryCode(
      countryCode
        ? countryCode?.trim()?.startsWith('+')
          ? countryCode?.trim()
          : `+${countryCode?.trim()}`
        : '+966'
    )

    setOwnerEmail({ value: '', validateStatus: undefined, errorMsg: null })

    setLocation({
      latitude: undefined,
      longitude: undefined,
      address: '',
      enable: false,
    })
  }

  const uploadImage = async (file: any, field: string) => {
    try {
      if (field === 'bankInfo_RegularLicensingDocUrl') setIsRegularLicensingDocUrlUploading(true)

      let result
      if (field === 'bankInfo_RegularLicensingDocUrl')
        result = await imageServiceInstance.uploadFile({ file: file })
      else result = await imageServiceInstance.uploadImage({ file: file })

      let url = result.url
      form.setFieldValue(field, url)
      if (field === 'bankInfo_RegularLicensingDocUrl') setRegularLicensingDocUrl(url)
    } finally {
      if (field === 'bankInfo_RegularLicensingDocUrl') setIsRegularLicensingDocUrlUploading(false)
    }
  }

  const onOwnerEmailChange = (e: any) => {
    let value = e.target.value
    setOwnerEmail({ ...validateEmail(value, true), value })
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
    if (ownerEmail.errorMsg === null && phone.errorMsg === null) {
      setLoading(true)
      try {
        values.arName = arName.value
        values.enName = enName.value
        values.subDomainName = domain.value
        values.managerInfo = {
          name: values.ownerName,
          lastName: values.lastName,
          countryCode: ownerCountryCode,
          phoneNumber: removeWhiteSpaces(phone.value),
          email: ownerEmail.value,
          password: values.password,
        }
        values.commercialNumber = commercialNumber
        values.address = location.address
        values.latitude = location.latitude
        values.longitude = location.longitude
        values.bankInfo_RegularLicensingDocUrl = regularLicensingDocUrl
        values.commercialNumberIssuanceDate = moment(values?.commercialNumberIssuanceDate)
          .hours(12)
          .minutes(12)

        if (pathname.includes('register')) {
          if (updateRegisterInfo) {
            values.otpPhoneNumber = phoneNumber
            values.otpCountryCode = '+' + countryCode?.substring(1)
            values.otpCode = otp
            values.id = data?.id
            values.currentSubdomain = data?.subDomainName || host
            await companiesForManagerServiceInstance.updateCompanyBasicSignupInfo(values)
            message.success(
              t('TheApplicationRequestHasBeenSuccessfullyUpdated', {
                name: lng === 'ar' ? arName.value : enName.value,
              }),
              5
            )
            if (domain.value !== data?.subDomainName) {
              window.location.href = 'https://' + domain.value + '.atraslink.com'
            } else {
              router.replace(`/${lng}`)
            }
          } else {
            await companiesForManagerServiceInstance.signup(values)
            message.success(t('TheApplicationRequestHasBeenSuccessfullyCreated'), 5)
            window.location.href = 'https://' + domain.value + '.atraslink.com'
          }
        } else {
          let result = await applicationReqsServiceInstance.create(values)
          message.success(t('TheApplicationRequestHasBeenSuccessfullyCreated1'), 5)
          onOK?.()
          handleClose()
        }
      } finally {
        setLoading(false)
      }
    } else {
      setOwnerEmail({ ...validateEmail(ownerEmail.value, true), value: ownerEmail.value })
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

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: t('BasicInfo'),
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
              <Input onChange={onArChange} value={arName?.value} />
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
              <Input onChange={onEnChange} value={enName?.value} />
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
                style={{ direction: 'ltr', textAlign: 'left' }}
                value={domain?.value}
                suffix={'.atraslink.com'}
                onChange={onDomainChange}
              />
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
                    week: '',
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
          <Col xs={24} lg={drawer ? 12 : 8}>
            <Form.Item name="link" label={t('ReferenceLink')}>
              <Input type="url" />
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
                    handleChange={(e: any) => uploadImage(e, 'bankInfo_RegularLicensingDocUrl')}
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
      key: '2',
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
          <Col lg={drawer ? 12 : 8} xs={24}>
            <Form.Item label={t('City')} name="cityId" rules={[new Rules().getMandatoryRule()]}>
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

          <Col xs={24}>
            <div className="map-container w-full">
              <h3 className="mb-3">
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
        </Row>
      ),
    },
    {
      key: '3',
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

          <Col xs={24} lg={drawer ? 12 : 8}>
            <PhoneInput
              type={type}
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
              <Input onChange={onOwnerEmailChange} value={ownerEmail.value} autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={drawer ? 12 : 8}>
            <Form.Item
              colon={false}
              label={t('Password')}
              name="password"
              rules={updateRegisterInfo ? [] : [new Rules().getMandatoryRule()]}
            >
              <Input.Password visibilityToggle autoComplete="new-password" />
            </Form.Item>
          </Col>
          <Col xs={24} lg={drawer ? 12 : 8}>
            <Form.Item
              colon={false}
              label={t('ConfirmPassword')}
              name="confirmpass"
              dependencies={['password']}
              rules={
                updateRegisterInfo
                  ? [
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
                    ]
                  : [
                      new Rules().getMandatoryRule(),
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
                    ]
              }
            >
              <Input.Password visibilityToggle autoComplete="new-password" />
            </Form.Item>
          </Col>
        </Row>
      ),
    },
  ]

  const handleSubmitError = async ({ values, errorFields }: any) => {
    if (!ownerEmail.value) {
      setOwnerEmail({ value: '', validateStatus: 'error', errorMsg: t('ThisFieldIsMandatory') })
    } else if (ownerEmail.value) {
      setOwnerEmail({ ...validateEmail(ownerEmail.value, true), value: ownerEmail.value })
    }
    if (!phone.value) {
      setPhone({ value: '', validateStatus: 'error', errorMsg: t('ThisFieldIsMandatory') })
    }
  }

  return (
    <Form
      form={form}
      onFinish={onFinish}
      onFinishFailed={handleSubmitError}
      className={`flex flex-col gap-3 w-full ${drawer || updateRegisterInfo ? 'h-full' : ' h-[calc(100vh_-_350px)] lg:h-[400px] overflow-y-auto'} overflow-x-hidden  text-white mx-auto min-w-full`}
      colon={false}
      layout="vertical"
    >
      <Collapse className="min-w-full w-full" items={items} defaultActiveKey={['1', '2', '3']} />
      <Form.Item>
        <Button type="primary" block htmlType="submit" size="large" loading={loading}>
          {pathname.includes('register')
            ? updateRegisterInfo
              ? t('Edit')
              : t('Register')
            : type !== DrawerType.Add
              ? t('Edit')
              : t('Add')}
        </Button>
      </Form.Item>
    </Form>
  )
}
