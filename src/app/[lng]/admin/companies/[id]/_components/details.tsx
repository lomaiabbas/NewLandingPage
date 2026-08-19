'use client'

import { getClientTranslation } from '@/app/i18n/client'
import Loader from '@/components/panel/loader'
import MapModal from '@/components/panel/map/map-modal'
import { CardContent, CardHeader } from '@/components/ui/card'
import { defaultDateFormat, FALLBACK_IMAGE } from '@/lib/constants'
import { useAppContext } from '@/lib/context'
import { ModalContext } from '@/lib/context/modal-context'
import { hasPermission, renderDateTime, renderIndustry } from '@/lib/helpers'
import { popupConfirm } from '@/lib/popup-confirm'
import companiesServiceInstance from '@/lib/services/companies'
import { CompanyDto } from '@/lib/services/companies/dto'
import { ActiveStatus } from '@/lib/services/dto'
import {
  Button,
  Card,
  Col,
  ColorPicker,
  Descriptions,
  DescriptionsProps,
  Image,
  message,
  Row,
  Switch,
  Tabs,
  Tag,
} from 'antd'
import { TabsProps } from 'antd/lib'
import { ChevronLeft, ChevronRight, Power, Send, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'
import { MetaActions } from './meta-actions'
import RolesList from './roles-list'
import StaffList from './staff-list'

export default function Details({ lng, id }: { lng: string; id: number }) {
  const { modal } = useContext(ModalContext)

  const { t } = getClientTranslation(lng)
  const [data, setData] = useState<CompanyDto | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [openMapModal, setOpenMapModal] = useState(false)
  const [appFeatures, setAppFeatures] = useState<any[]>([])
  const [mobileFeatures, setMobileFeatures] = useState<any[]>([])
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { grantedPolicies } = useAppContext()
  const [activeTab, setActiveTab] = useState(() => {
    if (
      searchParams.get('tab') === '5' &&
      !hasPermission(grantedPolicies, 'CompaniesManagement.Companies.ManageMetaActions')
    ) {
      return '1'
    }
    return searchParams.get('tab') || '1'
  })
  const [activeContentTab, setActiveContentTab] = useState(searchParams.get('contentTab') || '1')
  const [activeBasicTab, setActiveBasicTab] = useState(searchParams.get('basicTab') || '1')
  const [pendingToggle, setPendingToggle] = useState<'active' | 'templates' | 'landingPage' | null>(
    null
  )

  useEffect(
    () => {
      if (id) {
        getData(id)
      }
    }, // eslint-disable-next-line
    [id]
  )

  const getData = async (id: number) => {
    setIsLoading(true)
    const result = await companiesServiceInstance.get(id)
    const r = await companiesServiceInstance.getFeatures(result.tenantId)
    let temp: any[] = []
    for (let group of r?.groups) {
      if (
        group.name !== 'SettingManagement' &&
        group.name !== 'UsageManagement' &&
        group.name !== 'FinancialManagement'
      ) {
        for (let item of group.features) {
          if (item.value === 'true') {
            temp.push(item)
          }
        }
      }
    }
    setAppFeatures(temp.filter((f: any) => !f.name.startsWith('Mobile')))

    setMobileFeatures(temp.filter((f: any) => f.name.startsWith('Mobile')))
    setData({ ...result, features: r })
    setIsLoading(false)
  }

  const handleToggleActive = async () => {
    popupConfirm(
      async () => {
        setPendingToggle('active')
        if (data)
          if (data?.status === ActiveStatus.Active)
            await companiesServiceInstance.deactive(data?.id)
          else await companiesServiceInstance.active(data?.id)

        message.success(
          data?.status === ActiveStatus.Active
            ? t('TheCompanyHasBeenSuccessfullyDeactivated', {
                name: lng === 'ar' ? data?.arName : data?.enName,
              })
            : t('TheCompanyHasBeenSuccessfullyActivated', {
                name: lng === 'ar' ? data?.arName : data?.enName,
              }),
          5
        )
        setPendingToggle(null)
        await getData(id)
      },
      data?.status === ActiveStatus.Active
        ? t('AreYouSureYouWantToDeactivateThisCompany', {
            name: lng === 'ar' ? data?.arName : data?.enName,
          })
        : t('AreYouSureYouWantToActivateThisCompany', {
            name: lng === 'ar' ? data?.arName : data?.enName,
          })
    )
  }

  const handleActivateSendingTemplateFeature = async () => {
    setPendingToggle('templates')
    popupConfirm(
      async () => {
        if (data)
          if (data?.isSendingTemplatesEnabled)
            await companiesServiceInstance.disableSendingTemplates(data?.id)
          else await companiesServiceInstance.enableSendingTemplates(data?.id)

        message.success(
          data?.isSendingTemplatesEnabled
            ? t('TheSendingTemplateFeatureHasBeenSuccessfullyDeactivated', {
                name: lng === 'ar' ? data?.arName : data?.enName,
              })
            : t('TheSendingTemplateFeatureHasBeenSuccessfullyActivated', {
                name: lng === 'ar' ? data?.arName : data?.enName,
              }),
          5
        )
        setPendingToggle(null)
        await getData(id)
      },
      data?.isSendingTemplatesEnabled
        ? t('AreYouSureYouWantToDeactivateSendingTemplateFeature', {
            name: lng === 'ar' ? data?.arName : data?.enName,
          })
        : t('AreYouSureYouWantToActivateSendingTemplateFeature', {
            name: lng === 'ar' ? data?.arName : data?.enName,
          })
    )
  }

  const handleToggleLandingPage = async () => {
    popupConfirm(
      async () => {
        setPendingToggle('landingPage')
        if (data) {
          if (data?.showInLandingPage) await companiesServiceInstance.hideInLandingPage(data?.id)
          else await companiesServiceInstance.showInLandingPage(data?.id)
        }

        message.success(
          data?.showInLandingPage
            ? t('TheCompanyHasBeenSuccessfullyHiddenFromLandingPage', {
                name: lng === 'ar' ? data?.arName : data?.enName,
              })
            : t('TheCompanyHasBeenSuccessfullyShownInLandingPage', {
                name: lng === 'ar' ? data?.arName : data?.enName,
              }),
          5
        )
        setPendingToggle(null)
        await getData(id)
      },
      data?.showInLandingPage
        ? t('AreYouSureYouWantToHideThisCompanyFromLandingPage', {
            name: lng === 'ar' ? data?.arName : data?.enName,
          })
        : t('AreYouSureYouWantToShowThisCompanyInLandingPage', {
            name: lng === 'ar' ? data?.arName : data?.enName,
          })
    )
  }

  const basicInfoItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('ID'),
      children: data?.id,
    },
    {
      key: '2',
      label: t('Domain'),
      children: (
        <a
          href={`https://${data?.subDomainName}.atraslink.com`}
          target="_blank"
        >{`${data?.subDomainName}.atraslink.com`}</a>
      ),
    },
    {
      key: '3',
      label: t('Status'),
      children: (
        <Tag color={data?.status === ActiveStatus.Active ? 'green-inverse' : 'red-inverse'}>
          {data?.status === ActiveStatus.Active ? t('Active') : t('Inactive')}
        </Tag>
      ),
    },
    {
      key: '21',
      label: t('SendingTemplateFeature'),
      children: (
        <Tag color={data?.isSendingTemplatesEnabled ? 'green-inverse' : 'red-inverse'}>
          {data?.isSendingTemplatesEnabled ? t('Active') : t('Inactive')}
        </Tag>
      ),
    },
    {
      key: '22',
      label: t('ShowInLandingPage'),
      children: (
        <Tag color={data?.showInLandingPage ? 'green-inverse' : 'red-inverse'}>
          {data?.showInLandingPage ? t('Yes') : t('No')}
        </Tag>
      ),
    },
    {
      key: '4',
      label: t('ArName'),
      children: data?.arName || t('NotAvailable'),
    },
    {
      key: '5',
      label: t('EnName'),
      children: data?.enName || t('NotAvailable'),
    },
    {
      key: '6',
      label: t('CompanySize'),
      children: data?.size ? t(data?.size) : t('NotAvailable'),
    },
    {
      key: '7',
      label: t('ReferenceLink'),
      children: data?.link ? (
        <a href={data?.link} target="_blank">
          {data?.link}
        </a>
      ) : (
        t('NotAvailable')
      ),
    },
    {
      key: '8',
      label: t('Industry'),
      children:
        data?.industry !== null && data?.industry !== undefined
          ? t(renderIndustry(+data?.industry))
          : t('NotAvailable'),
    },
    {
      key: '9',
      label: t('CompanyPhone'),
      children: data?.phoneNumber ? (
        <span style={{ direction: 'ltr' }}>{data?.countryCode + '' + data?.phoneNumber}</span>
      ) : (
        t('NotAvailable')
      ),
    },
    {
      key: '10',
      label: t('CompanyEmail'),
      children: data?.email || t('NotAvailable'),
    },
    {
      key: '13',
      label: t('CommercialRecordReleaseDate'),
      children: data?.commercialNumberIssuanceDate
        ? renderDateTime(data?.commercialNumberIssuanceDate, defaultDateFormat)
        : t('NotAvailable'),
    },
    {
      key: '14',
      label: t('CommercialRecordNumber'),
      children: data?.commercialNumber || t('NotAvailable'),
    },
    {
      key: '11',
      label: t('ArLogoImage'),
      children: (
        <Image
          width={50}
          height={50}
          className="rounded-md object-contain"
          src={data?.arLogo ?? FALLBACK_IMAGE}
          alt={lng === 'ar' ? data?.arName : data?.enName}
        />
      ),
    },
    {
      key: '12',
      label: t('EnLogoImage'),
      children: (
        <Image
          width={50}
          height={50}
          className="rounded-md object-contain"
          src={data?.enLogo ?? FALLBACK_IMAGE}
          alt={lng === 'ar' ? data?.arName : data?.enName}
        />
      ),
    },
    {
      key: '5',
      label: t('RegularLicensingDocUrl'),
      children: data?.bankInfo?.regularLicensingDocUrl ? (
        <Image
          width={50}
          height={50}
          className="rounded-md object-contain cursor-pointer"
          preview={false}
          onClick={() =>
            modal.info({
              closable: true,
              closeIcon: <X className="text-white mt-[6px]" size={20} />,
              content: (
                <iframe
                  src={data?.bankInfo?.regularLicensingDocUrl}
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
      ) : (
        t('NotAvailable')
      ),
    },
    {
      key: '15',
      label: t('EnCompanyDescription'),
      children: data?.enDescription || t('NotAvailable'),
    },
    {
      key: '16',
      label: t('ArCompanyDescription'),
      children: data?.arDescription || t('NotAvailable'),
    },
    {
      key: '20',
      label: t('PrimaryColor'),
      children: data?.primaryColor ? (
        <ColorPicker disabled value={data?.primaryColor} showText />
      ) : (
        t('NotAvailable')
      ),
    },
    {
      key: '17',
      label: t('Country'),
      children: data?.city?.country?.text || t('NotAvailable'),
    },
    {
      key: '18',
      label: t('City'),
      children: data?.city?.text || t('NotAvailable'),
    },
    {
      key: '19',
      label: (
        <span>
          {t('Address')}
          <Button
            type="link"
            className="px-0 mx-0 w-fit"
            onClick={() => setOpenMapModal(true)}
          >{`(${t('ViewOnMap')})`}</Button>
        </span>
      ),
      children: (
        <>
          <span>{data?.address}</span>
          <MapModal
            data={{
              lat: data?.latitude,
              lng: data?.longitude,
              address: data?.address,
            }}
            open={openMapModal}
            lng={lng}
            setOpen={setOpenMapModal}
          />
        </>
      ),
    },
  ]

  const banksInfoItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('Bank'),
      children: data?.bankInfo?.bankId || t('NotAvailable'),
    },
    {
      key: '2',
      label: t('BankAccountNumber'),
      children: data?.bankInfo?.accountNumber || t('NotAvailable'),
    },
    {
      key: '3',
      label: t('TaxNumber'),
      children: data?.bankInfo?.taxNumber || t('NotAvailable'),
    },
  ]

  const managerInfoItems: DescriptionsProps['items'] = [
    {
      key: '1',
      label: t('FirstName'),
      children: data?.managerInfo?.name || t('NotAvailable'),
    },
    {
      key: '2',
      label: t('LastName'),
      children: data?.managerInfo?.lastName || t('NotAvailable'),
    },
    {
      key: '3',
      label: t('Email'),
      children: data?.managerInfo?.email || t('NotAvailable'),
    },
    {
      key: '4',
      label: t('PhoneNumber'),
      children: data?.managerInfo?.phoneNumber ? (
        <span style={{ direction: 'ltr' }}>
          {data?.managerInfo?.countryCode + '' + data?.managerInfo?.phoneNumber}
        </span>
      ) : (
        t('NotAvailable')
      ),
    },
  ]

  const basicItems: TabsProps['items'] = [
    {
      key: '1',
      label: t('CompanyInfo'),
      children: (
        <Row className="w-full" gutter={[0, 15]}>
          <Col span={24}>
            <Descriptions layout="vertical" colon={false} items={basicInfoItems} />
          </Col>
          <Col span={24}>
            {/* Status Toggles */}
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t('Status&Access')}
            </h4>

            <Row className="w-full" gutter={[15, 15]}>
              {(hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Active') &&
                data?.status === ActiveStatus.Inactive) ||
              (hasPermission(grantedPolicies, 'CompaniesManagement.Companies.DeActive') &&
                data?.status === ActiveStatus.Active) ? (
                <Col xs={24} md={12} xl={8} xxl={6}>
                  <div
                    className={`relative flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all duration-300 border ${pendingToggle === 'active' ? 'scale-[0.98] opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                          data?.status === ActiveStatus.Active
                            ? 'bg-success/15 text-success'
                            : 'bg-destructive/15 text-destructive'
                        }`}
                      >
                        <Power className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">{t('Status')}</p>
                        <p
                          className={`text-xs font-medium transition-colors duration-300 ${
                            data?.status === ActiveStatus.Active
                              ? 'text-success'
                              : 'text-destructive'
                          }`}
                        >
                          {data?.status === ActiveStatus.Active ? t('Active') : t('Inactive')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={data?.status === ActiveStatus.Active}
                      onChange={handleToggleActive}
                      disabled={pendingToggle !== null}
                      className="data-[state=checked]:bg-success"
                    />
                  </div>
                </Col>
              ) : (
                <></>
              )}
              {hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update') ? (
                <Col xs={24} md={12} xl={8} xxl={6}>
                  <div
                    className={`relative flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all duration-300 border ${pendingToggle === 'templates' ? 'scale-[0.98] opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                          data?.isSendingTemplatesEnabled
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Send className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {t('SendingTemplateFeature')}
                        </p>
                        <p
                          className={`text-xs font-medium transition-colors duration-300 ${
                            data?.isSendingTemplatesEnabled
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {data?.isSendingTemplatesEnabled ? t('Active') : t('Inactive')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={data?.isSendingTemplatesEnabled}
                      onChange={handleActivateSendingTemplateFeature}
                      disabled={pendingToggle !== null}
                    />
                  </div>
                </Col>
              ) : (
                <></>
              )}
              {/* {hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update') ? (
                <Col xs={24} md={12} xl={8} xxl={6}>
                  <div
                    className={`relative flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 transition-all duration-300 border ${pendingToggle === 'landingPage' ? 'scale-[0.98] opacity-70' : ''}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 ${
                          data?.showInLandingPage
                            ? 'bg-primary/15 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {data?.showInLandingPage ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium leading-tight">
                          {t('ShowInLandingPage')}
                        </p>
                        <p
                          className={`text-xs font-medium transition-colors duration-300 ${
                            data?.showInLandingPage ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        >
                          {data?.showInLandingPage ? t('Yes') : t('No')}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={data?.showInLandingPage}
                      onChange={handleToggleLandingPage}
                      disabled={pendingToggle !== null}
                    />
                  </div>
                </Col>
              ) : (
                <></>
              )} */}
            </Row>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: t('ManagerInfo'),
      children: (
        <>
          <Descriptions layout="vertical" colon={false} items={managerInfoItems} />
        </>
      ),
    },
    {
      key: '3',
      label: t('BankInfo'),
      children: (
        <>
          <Descriptions layout="vertical" colon={false} items={banksInfoItems} />
        </>
      ),
    },
  ]

  const contentItems: TabsProps['items'] = [
    {
      key: '1',
      label: t('Templates'),
      children: <></>,
    },
    {
      key: '2',
      label: t('Documents'),
      children: <></>,
    },
    {
      key: '3',
      label: t('QuickResponses'),
      children: <></>,
    },
  ]

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('BasicInfo'),
      children: (
        <>
          <Tabs
            className="min-w-full w-full"
            items={basicItems}
            onChange={(activeKey: string) => {
              setActiveBasicTab(activeKey)
              const params = new URLSearchParams(searchParams)
              params.set('basicTab', activeKey || '1')
              router.replace(`${pathname}?${params.toString()}`)
            }}
            defaultActiveKey={activeBasicTab}
          />
        </>
      ),
    },
    {
      key: '2',
      label: t('Features'),
      children: (
        <Tabs
          items={[
            {
              key: 'app',
              label: t('ApplicationFeaturesManagement'),
              children: (
                <ul className="w-full flex flex-col gap-2">
                  {appFeatures.length > 0 ? (
                    appFeatures.map((item: any) => (
                      <li
                        key={item.name}
                        style={{
                          listStyle: 'inside',
                          listStyleType: item.parentName ? 'circle' : 'unset',
                        }}
                        className={item.parentName ? 'ms-3' : 'font-bold'}
                      >
                        {t(item.name)}
                      </li>
                    ))
                  ) : (
                    <li>{t('NoFeatures')}</li>
                  )}
                </ul>
              ),
            },
            {
              key: 'mobile',
              label: t('MobileFeaturesManagement'),
              children: (
                <ul className="w-full flex flex-col gap-2">
                  {mobileFeatures.length > 0 ? (
                    mobileFeatures.map((item: any) => (
                      <li
                        key={item.name}
                        style={{
                          listStyle: 'inside',
                          listStyleType: item.parentName ? 'circle' : 'unset',
                        }}
                        className={item.parentName ? 'ms-3' : 'font-bold'}
                      >
                        {t(item.name)}
                      </li>
                    ))
                  ) : (
                    <li>{t('NoFeatures')}</li>
                  )}
                </ul>
              ),
            },
          ]}
        />
      ),
    },
    {
      key: '3',
      label: t('Roles'),
      children: <RolesList lng={lng} id={id} />,
    },
    {
      key: '4',
      label: t('Staff'),
      children: <StaffList lng={lng} id={id} />,
    },
    ...(hasPermission(grantedPolicies, 'CompaniesManagement.Companies.ManageMetaActions')
      ? [
          {
            key: '5',
            label: t('MetaActions'),
            children: (
              <MetaActions
                lng={lng}
                company={data}
                onUpdate={async () => {
                  await getData(id)
                }}
              />
            ),
          },
        ]
      : []),
    // {
    //   key: '5',
    //   label: t('Contacts'),
    //   children: <ContactsList lng={lng} id={id} />,
    // },
    // {
    //   key: '6',
    //   label: t('Content'),
    //   children: (
    //     <>
    //       <Tabs
    //         className="min-w-full w-full"
    //         items={contentItems}
    //         onChange={(activeKey: string) => {
    //           setActiveContentTab(activeKey)
    //           const params = new URLSearchParams(searchParams)
    //           params.set('contentTab', activeKey || '1')
    //           router.replace(`${pathname}?${params.toString()}`)
    //         }}
    //         defaultActiveKey={activeContentTab}
    //       />
    //     </>
    //   ),
    // },
    // {
    //   key: '7',
    //   label: t('Campaigns'),
    //   children: <></>,
    // },
  ]

  return (
    <Card className="p-0 custom-card">
      <CardHeader className="border-b px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="page-header flex gap-2 items-center">
            <div className={'icon-btn'} onClick={() => router.back()}>
              {lng === 'ar' ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
            </div>
            <h4 className="page-title">{t('CompanyInfo')}</h4>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </CardHeader>
      <CardContent className="py-4 px-4">
        {isLoading ? (
          <Loader />
        ) : (
          <Tabs
            className="min-w-full w-full"
            items={items}
            onChange={(activeKey: string) => {
              setActiveTab(activeKey)
              const params = new URLSearchParams(searchParams)
              params.set('tab', activeKey || '1')
              router.replace(`${pathname}?${params.toString()}`)
            }}
            defaultActiveKey={activeTab}
          />
        )}
      </CardContent>
    </Card>
  )
}
