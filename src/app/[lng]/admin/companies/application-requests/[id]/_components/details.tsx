'use client'

import { getClientTranslation } from '@/app/i18n/client'
import Loader from '@/components/panel/loader'
import MapModal from '@/components/panel/map/map-modal'
import { CardContent, CardHeader } from '@/components/ui/card'
import { FALLBACK_IMAGE, defaultDateFormat, defaultDateTimeFormat } from '@/lib/constants'
import { ModalContext } from '@/lib/context/modal-context'
import { renderDateTime, renderIndustry } from '@/lib/helpers'
import applicationReqsServiceInstance from '@/lib/services/application-reqs'
import { ApplicationRequestDto } from '@/lib/services/application-reqs/dto'
import { ApplicationRequestActionName, ApplicationRequestStatus } from '@/lib/services/dto'
import {
  Button,
  Card,
  ColorPicker,
  Descriptions,
  DescriptionsProps,
  Divider,
  Image,
  Steps,
  Tabs,
  Tag,
  Tooltip,
} from 'antd'
import { TabsProps } from 'antd/lib'
import { Ban, CheckCircle, ChevronLeft, ChevronRight, Info, LoaderIcon, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext, useEffect, useState } from 'react'

export default function Details({ lng, id }: { lng: string; id: number }) {
  const { t } = getClientTranslation(lng)
  const [data, setData] = useState<ApplicationRequestDto | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [openMapModal, setOpenMapModal] = useState(false)
  const [actions, setActions] = useState([])
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || '1')
  const { modal } = useContext(ModalContext)

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
    const result = await applicationReqsServiceInstance.get(id)
    setData(result)

    let temp: any = []
    result?.actions?.map((action: any) => {
      temp.push({
        id: action.name,
        title: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>{t(`Action${action.name}`)}</span>
            {action.name !== 0 && action.notes && (
              <Tooltip title={action.notes}>
                <Info style={{ position: 'relative', top: -3 }} />
              </Tooltip>
            )}
          </div>
        ),
        icon:
          action.name === ApplicationRequestActionName.Rejected ? (
            <Ban color="#d00404" />
          ) : (
            <CheckCircle color="#1a9c54" />
          ),
        description: (
          <>
            <span style={{ display: 'inline-block' }}>
              {renderDateTime(action.actionTime, defaultDateTimeFormat)}
            </span>
          </>
        ),
      })
      return null
    })

    const lastStep = temp[temp.length - 1]

    switch (lastStep.id) {
      case 0:
      case 4:
        temp.push({
          id: 1,
          title: t(`Action1`),
          icon: <LoaderIcon className="pending-status spin" />,
          description: <></>,
        })
        break
      case 1:
        temp.push({
          id: 2,
          title: t(`Action2`),
          icon: <LoaderIcon className="pending-status spin" />,
          description: <></>,
        })
        break
    }
    setActions(temp)
    setIsLoading(false)
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
        <Tag
          color={
            data?.status === ApplicationRequestStatus.Verified
              ? 'green-inverse'
              : data?.status === ApplicationRequestStatus.Rejected
                ? 'red-inverse'
                : data?.status === ApplicationRequestStatus.WaitingForApproval
                  ? 'blue-inverse'
                  : 'yellow-inverse'
          }
        >
          {data?.status === ApplicationRequestStatus.Verified
            ? t('Verified')
            : data?.status === ApplicationRequestStatus.Rejected
              ? t('Rejected')
              : data?.status === ApplicationRequestStatus.WaitingForApproval
                ? t('WaitingForApproval')
                : t('InReview')}
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
      children: data?.phoneNumber || t('NotAvailable'),
    },
    {
      key: '10',
      label: t('CompanyEmail'),
      children: data?.email || t('NotAvailable'),
    },
    {
      key: '11',
      label: t('CommercialRecordReleaseDate'),
      children: data?.commercialNumberIssuanceDate
        ? renderDateTime(data?.commercialNumberIssuanceDate, defaultDateFormat)
        : t('NotAvailable'),
    },
    {
      key: '12',
      label: t('CommercialRecordNumber'),
      children: data?.commercialNumber || t('NotAvailable'),
    },
    {
      key: '15',
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
      key: '16',
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
      key: '13',
      label: t('EnCompanyDescription'),
      children: data?.enDescription || t('NotAvailable'),
    },
    {
      key: '14',
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
      // span: 2,
      label: (
        <span>
          {t('Address')}
          {data?.address && (
            <Button type="link" className="px-0 mx-0 w-fit" onClick={() => setOpenMapModal(true)}>
              {`(${t('ViewOnMap')})`}
            </Button>
          )}
        </span>
      ),
      children: (
        <>
          <span>{data?.address || t('NotAvailable')}</span>
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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('BasicInfo'),
      children: (
        <>
          <Descriptions layout="vertical" colon={false} items={basicInfoItems} />
          <Divider orientation="left" orientationMargin="0">
            {t('StatusesHistory')}
          </Divider>
          <Steps
            direction={`${actions.length > 6 ? 'vertical' : 'horizontal'}`}
            className="order-steps"
            current={actions?.length}
            items={actions}
          />
        </>
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

  return (
    <Card className="p-0">
      <CardHeader className="border-b px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          <div className="page-header flex gap-2 items-center">
            <div className={'icon-btn'} onClick={() => router.back()}>
              {lng === 'ar' ? <ChevronRight size={19} /> : <ChevronLeft size={19} />}
            </div>
            <h4 className="page-title">{t('ApplicationRequestInfo')}</h4>
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
