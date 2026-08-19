'use client'
import { getClientTranslation } from '@/app/i18n/client'
import { CardContent, CardHeader } from '@/components/ui/card'
import { DrawerType, FALLBACK_IMAGE } from '@/lib/constants'
import { useAppContext } from '@/lib/context'
import { hasPermission, renderIndustry, resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { popupConfirm } from '@/lib/popup-confirm'
import Rules from '@/lib/rules'
import companiesServiceInstance from '@/lib/services/companies'
import { GetAllCompaniesForAdminResponseDto } from '@/lib/services/companies/dto'
import { ActiveStatus, IndustryType } from '@/lib/services/dto'
import {
  App,
  Button,
  Card,
  Collapse,
  Dropdown,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Radio,
  RadioChangeEvent,
  Select,
  Table,
  Tag,
  Tooltip,
} from 'antd'
import { CollapseProps } from 'antd/lib'
import {
  CircleCheck,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Link2,
  MoreVertical,
  Save,
  SearchIcon,
  Settings2,
  SquareCheck,
  SquareX,
  StopCircle,
  Undo,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEditDrawer from './add-edit-drawer'
import { CompanyActionsDrawer } from './company-actions-drawer'
import ManageFeaturesDrawer from './manage-features-drawer'

const INDEX_PAGE_SIZE_DEFAULT = 20
const INDEX_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '150']

export const CompaniesList = ({ lng }: { lng: string }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { message } = App.useApp()

  const { t } = getClientTranslation(lng)
  const [loadingData, setLoadingData] = useState(true)
  const [data, setData] = useState<GetAllCompaniesForAdminResponseDto[]>([])
  const [dataTotalCount, setDataTotalCount] = useState<number>(0)
  const [meta, setMeta] = useState<{
    page: number
    pageSize: number
    pageSizeOptions: string[]
    pageTotal: number
    skipCount: number
    total: number
  }>({
    page: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('pageSize')) || INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    skipCount:
      ((Number(searchParams.get('page')) || 1) - 1) *
        (Number(searchParams.get('pageSize')) || INDEX_PAGE_SIZE_DEFAULT) || 0,
    total: 0,
  })

  const [addEditDrawer, setAddEditDrawer] = useState<{
    open: boolean
    type: DrawerType
    data: GetAllCompaniesForAdminResponseDto | undefined
  }>({
    open: false,
    type: DrawerType.Add,
    data: undefined,
  })

  const [filters, setFilters] = useState({
    status:
      searchParams.get('status') && searchParams.get('status') !== undefined
        ? Number(searchParams.get('status'))
        : undefined,
    industry:
      searchParams.get('industry') && searchParams.get('industry') !== undefined
        ? Number(searchParams.get('industry'))
        : undefined,
  })

  const [featuresDrawer, setFeaturesDrawer] = useState<{
    open: boolean
    data: any | undefined
  }>({
    open: false,
    data: undefined,
  })

  const [keywords, setKeywords] = useState({
    name:
      searchParams.get('name') && searchParams.get('name') !== undefined
        ? searchParams.get('name')?.toString()
        : undefined,
    id:
      searchParams.get('id') && searchParams.get('id') !== undefined
        ? searchParams.get('id')?.toString()
        : undefined,
    phoneNumber:
      searchParams.get('phoneNumber') && searchParams.get('phoneNumber') !== undefined
        ? searchParams.get('phoneNumber')?.toString()
        : undefined,
  })

  const [isLoadingSearchResult, setIsLoadingSearchResult] = useState(false)
  const [isLoadingUndoSearchResult, setIsLoadingUndoSearchResult] = useState(false)
  const [isLoadingFilterResult, setIsLoadingFilterResult] = useState(false)
  const [isLoadingUndoFilterResult, setIsLoadingUndoFilterResult] = useState(false)
  const { grantedPolicies } = useAppContext()

  const [registerPhoneNumberDrawer, setRegisterPhoneNumberDrawer] = useState<{
    open: boolean
    data: any
  }>({
    open: false,
    data: undefined,
  })

  const [isSubmittingData, setIsSubmittingData] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (
      searchParams.get('tenant') &&
      data?.length > 0 &&
      data?.filter((i: any) => i.tenantId === searchParams.get('tenant'))?.[0]
    ) {
      onManageFeatures(data?.filter((i: any) => i.tenantId === searchParams.get('tenant'))?.[0])
      removeParam('tenant')
    }
  }, [searchParams, data])

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key) // remove the variable
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname

    router.replace(newUrl, { scroll: false })
  }

  const updateSearchParam = (
    page: string,
    pageSize: string,
    keywords: {
      name: string | undefined
      id: string | undefined
      phoneNumber: string | undefined
    },
    filters: { status: ActiveStatus | undefined; industry: IndustryType | undefined }
  ) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    params.set('pageSize', pageSize)
    params.set('industry', filters.industry !== undefined ? filters.industry + '' : '')
    params.set('status', filters.status !== undefined ? filters.status + '' : '')
    params.set('name', keywords.name?.trim() || '')
    params.set('id', keywords.id || '')
    params.set('phoneNumber', keywords.phoneNumber?.trim() || '')

    router.replace(`${pathname}?${params.toString()}`)
  }

  const getData = async (
    maxResultCount: number,
    skipCount: number,
    keywords: {
      name: string | undefined
      id: string | undefined
      phoneNumber: string | undefined
    },
    filters: { status: ActiveStatus | undefined; industry: IndustryType | undefined }
  ) => {
    try {
      setLoadingData(true)
      let result = await companiesServiceInstance.getAll({
        skipCount: skipCount,
        maxResultCount: maxResultCount,
        name: keywords.name?.trim(),
        phoneNumber: keywords.phoneNumber?.trim(),
        id: keywords.id,
        status: filters.status,
        industry: filters.industry !== undefined ? filters.industry : undefined,
      })
      setData(result.items)
      setDataTotalCount(result.totalCount)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(
    () => {
      getData(meta.pageSize, meta.skipCount, keywords, filters)
    }, // eslint-disable-next-line
    []
  )

  const renderActionsMenu = (item: GetAllCompaniesForAdminResponseDto) => {
    return [
      ...[
        {
          key: '1',
          label: (
            <Link href={`/${lng}/admin/companies/${item.id}`}>
              <div className="dropdown-item">
                <Eye size={20} className="text-primary" />
                {t('Details')}
              </div>
            </Link>
          ),
        },
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update')
          ? {
              key: '2',
              label: (
                <div
                  className="dropdown-item"
                  onClick={() =>
                    setAddEditDrawer({ open: true, data: item, type: DrawerType.Edit })
                  }
                >
                  <Edit size={19} color="#0000dd" />
                  {t('Edit')}
                </div>
              ),
            }
          : null,
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Active') && !item.isActive
          ? {
              key: '3',
              label: (
                <div className="dropdown-item" onClick={() => onActivateItem(item)}>
                  <CircleCheck size={19} className="text-primary" />
                  {t('Activate')}
                </div>
              ),
            }
          : null,
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.DeActive') && item.isActive
          ? {
              key: '4',
              label: (
                <div className="dropdown-item" onClick={() => onActivateItem(item)}>
                  <StopCircle size={19} color="#d50000" />
                  {t('Deactivate')}
                </div>
              ),
            }
          : null,
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.ManageFeatures')
          ? {
              key: '5',
              label: (
                <div className="dropdown-item" onClick={() => onManageFeatures(item)}>
                  <Settings2 size={19} color="#0000dd" />
                  {t('ManageFeatures')}
                </div>
              ),
            }
          : null,
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update') &&
        !item.isSendingTemplatesEnabled
          ? {
              key: '6',
              label: (
                <div
                  className="dropdown-item"
                  onClick={() => onActivateSendingTemplateFeature(item)}
                >
                  <SquareCheck size={19} className="text-primary" />
                  {t('ActivateSendingTemplateFeature')}
                </div>
              ),
            }
          : null,
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update') &&
        item.isSendingTemplatesEnabled
          ? {
              key: '7',
              label: (
                <div
                  className="dropdown-item"
                  onClick={() => onActivateSendingTemplateFeature(item)}
                >
                  <SquareX size={19} color="#d50000" />
                  {t('DeactivateSendingTemplateFeature')}
                </div>
              ),
            }
          : null,
        ...(hasPermission(grantedPolicies, 'CompaniesManagement.Companies.ManageMetaActions')
          ? [
              {
                key: '8',
                label: (
                  <div className="dropdown-item" onClick={() => openActions(item)}>
                    <Link2 size={19} className="text-primary" />
                    {t('MetaActions')}
                  </div>
                ),
              },
            ]
          : []),
        hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update')
          ? {
              key: '9',
              label: (
                <div className="dropdown-item" onClick={() => onToggleLandingPage(item)}>
                  {item.showInLandingPage ? (
                    <EyeOff size={19} color="#d50000" />
                  ) : (
                    <Eye size={19} className="text-primary" />
                  )}
                  {item.showInLandingPage ? t('HideFromLandingPage') : t('ShowInLandingPageAction')}
                </div>
              ),
            }
          : null,
      ],
    ]
  }

  const tableColumns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      minWith: 100,
    },
    {
      title: t('Name'),
      dataIndex: 'arName',
      key: 'arName',
      minWith: 200,
      render: (arName: string, item: GetAllCompaniesForAdminResponseDto) => (
        <div className="flex items-center flex-wrap gap-2">
          <span className="font-medium text-sm">{lng === 'ar' ? item.arName : item.enName}</span>
          <Tooltip
            title={item.showInLandingPage ? t('ShownOnLandingPage') : t('HiddenFromLandingPage')}
          >
            {item.showInLandingPage ? (
              <CircleCheck size={18} className="text-primary fill-primary/10" />
            ) : (
              <></>
            )}
          </Tooltip>
        </div>
      ),
    },
    {
      title: t('Logo'),
      dataIndex: 'arLogo',
      key: 'arLogo',
      minWith: 100,
      render: (arLogo: string, item: GetAllCompaniesForAdminResponseDto) => (
        <Image
          width={48}
          height={48}
          className="rounded-lg object-contain"
          src={(lng === 'ar' ? item.arLogo : item.enLogo) ?? FALLBACK_IMAGE}
          alt={lng === 'ar' ? item.arName : item.enName}
        />
      ),
    },
    {
      title: t('City'),
      dataIndex: 'city',
      key: 'city',
      minWith: 100,
      render: (city: any) => city?.text,
    },
    // {
    //   title: t('IsVerified'),
    //   dataIndex: 'isVerified',
    //   key: 'isVerified',
    //   with: 100,
    //   render: (isVerified: boolean) => (<Tag color={isVerified ? "green-inverse" : "red-inverse"}>{isVerified ? t("Yes") : t("No")}</Tag>)
    // },
    {
      title: t('Industry'),
      dataIndex: 'industry',
      key: 'industry',
      minWith: 100,
      render: (industry: number) =>
        industry !== null && industry !== undefined
          ? t(renderIndustry(industry))
          : t('NotAvailable'),
    },
    {
      title: t('SendingTemplateFeature'),
      dataIndex: 'isSendingTemplatesEnabled',
      key: 'isSendingTemplatesEnabled',
      minWith: 100,
      render: (isSendingTemplatesEnabled: boolean) => (
        <Tag color={isSendingTemplatesEnabled ? 'green-inverse' : 'red-inverse'}>
          {isSendingTemplatesEnabled ? t('Active') : t('Inactive')}
        </Tag>
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      minWith: 100,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green-inverse' : 'red-inverse'}>
          {isActive ? t('Active') : t('Inactive')}
        </Tag>
      ),
    },

    {
      title: t('Action'),
      key: 'action',
      minWith: 100,
      render: (text: string, item: GetAllCompaniesForAdminResponseDto) => (
        <Dropdown
          menu={{ items: renderActionsMenu(item) }}
          overlayStyle={{ zIndex: 22 }}
          placement={lng === 'en' ? 'bottomRight' : 'bottomLeft'}
        >
          <MoreVertical className="more-btn" />
        </Dropdown>

        // <MoreVertical className="more-btn" onClick={() => openActions(item)} />
      ),
    },
  ]

  const paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = meta
      temp.pageSize = pageSize
      setMeta(temp)
      updateSearchParam('0', pageSize + '', keywords, filters)
      await getData(pageSize, 0, keywords, filters)
    },
    onChange: async (page: any) => {
      const temp = meta
      temp.page = page
      setMeta(temp)
      updateSearchParam(page + '', meta.pageSize + '', keywords, filters)
      await getData(meta.pageSize, (page - 1) * meta.pageSize, keywords, filters)
    },
    pageSizeOptions: meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${t('To')} ${range[1]} ${t('Of')} ${total}`,
  }

  const pagination = {
    ...paginationOptions,
    total: dataTotalCount,
    current: meta.page,
    pageSize: meta.pageSize,
  }

  const checkIfSearchApplied = () =>
    keywords.id !== undefined || keywords.name !== undefined || keywords.phoneNumber !== undefined
  const checkIfFiltersApplied = () => filters.status !== undefined || filters.industry !== undefined

  const onActivateItem = async (item: GetAllCompaniesForAdminResponseDto) => {
    popupConfirm(
      async () => {
        if (item.isActive) await companiesServiceInstance.deactive(item.id)
        else await companiesServiceInstance.active(item.id)

        message.success(
          item.isActive
            ? t('TheCompanyHasBeenSuccessfullyDeactivated', {
                name: lng === 'ar' ? item.arName : item.enName,
              })
            : t('TheCompanyHasBeenSuccessfullyActivated', {
                name: lng === 'ar' ? item.arName : item.enName,
              }),
          5
        )
        updateSearchParam('0', meta.pageSize + '', keywords, filters)
        setSelectedCompany({
          ...selectedCompany,
          isActive: !item.isActive,
        })
        await getData(meta.pageSize, 0, keywords, filters)
      },
      item.isActive
        ? t('AreYouSureYouWantToDeactivateThisCompany', {
            name: lng === 'ar' ? item.arName : item.enName,
          })
        : t('AreYouSureYouWantToActivateThisCompany', {
            name: lng === 'ar' ? item.arName : item.enName,
          })
    )
  }

  const onActivateSendingTemplateFeature = async (item: GetAllCompaniesForAdminResponseDto) => {
    popupConfirm(
      async () => {
        if (item.isSendingTemplatesEnabled)
          await companiesServiceInstance.disableSendingTemplates(item.id)
        else await companiesServiceInstance.enableSendingTemplates(item.id)

        message.success(
          item.isSendingTemplatesEnabled
            ? t('TheSendingTemplateFeatureHasBeenSuccessfullyDeactivated', {
                name: lng === 'ar' ? item.arName : item.enName,
              })
            : t('TheSendingTemplateFeatureHasBeenSuccessfullyActivated', {
                name: lng === 'ar' ? item.arName : item.enName,
              }),
          5
        )
        updateSearchParam('0', meta.pageSize + '', keywords, filters)
        setSelectedCompany({
          ...selectedCompany,
          isSendingTemplatesEnabled: !item.isSendingTemplatesEnabled,
        })
        await getData(meta.pageSize, 0, keywords, filters)
      },
      item.isSendingTemplatesEnabled
        ? t('AreYouSureYouWantToDeactivateSendingTemplateFeature', {
            name: lng === 'ar' ? item.arName : item.enName,
          })
        : t('AreYouSureYouWantToActivateSendingTemplateFeature', {
            name: lng === 'ar' ? item.arName : item.enName,
          })
    )
  }

  const onToggleLandingPage = async (item: GetAllCompaniesForAdminResponseDto) => {
    popupConfirm(
      async () => {
        if (item.showInLandingPage) await companiesServiceInstance.hideInLandingPage(item.id)
        else await companiesServiceInstance.showInLandingPage(item.id)

        message.success(
          item.showInLandingPage
            ? t('TheCompanyHasBeenSuccessfullyHiddenFromLandingPage', {
                name: lng === 'ar' ? item.arName : item.enName,
              })
            : t('TheCompanyHasBeenSuccessfullyShownInLandingPage', {
                name: lng === 'ar' ? item.arName : item.enName,
              }),
          5
        )
        await getData(meta.pageSize, (meta.page - 1) * meta.pageSize, keywords, filters)
      },
      item.showInLandingPage
        ? t('AreYouSureYouWantToHideThisCompanyFromLandingPage', {
            name: lng === 'ar' ? item.arName : item.enName,
          })
        : t('AreYouSureYouWantToShowThisCompanyInLandingPage', {
            name: lng === 'ar' ? item.arName : item.enName,
          })
    )
  }

  const cancelInvitation = async () => {
    try {
      if (!registerPhoneNumberDrawer?.data?.otpCode?.trim()) {
        message.error(t('OtpCodeRequired'))
        return Promise.reject()
      }

      setIsSubmittingData(true)

      await getData(meta.pageSize, (meta.page - 1) * meta.pageSize, keywords, filters)
      setRegisterPhoneNumberDrawer({ open: false, data: undefined })
    } finally {
      setIsSubmittingData(false)
    }
  }

  const onManageFeatures = async (item: GetAllCompaniesForAdminResponseDto) => {
    setFeaturesDrawer({ open: true, data: item })
  }

  const filterItems: CollapseProps['items'] = [
    {
      key: '1',
      label: t('FilterByStatus'),
      children: (
        <Radio.Group
          onChange={(e: RadioChangeEvent) => {
            setFilters({ ...filters, status: e.target.value })
          }}
          value={filters.status}
        >
          <Radio value={undefined}>{t('All')}</Radio>
          <Radio value={1}>{t('Active')}</Radio>
          <Radio value={0}>{t('Inactive')}</Radio>
        </Radio.Group>
      ),
    },
    {
      key: '2',
      label: t('FilterByIndustry'),
      children: (
        <Select
          placeholder={t('PleaseSelectIndustry')}
          showSearch
          value={filters.industry}
          dropdownStyle={{ zIndex: 9999 }}
          allowClear
          virtual={false}
          className="w-full"
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) =>
            setFilters({ ...filters, industry: value !== undefined ? value : undefined })
          }
        >
          <Select.Option key={undefined} value={undefined}>
            {t('All')}
          </Select.Option>
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
      ),
    },
    // {
    //   key: '2',
    //   label: t("FilterByVerifiedStatus"),
    //   children: <Radio.Group onChange={(e: RadioChangeEvent) => {
    //     setFilters({ ...filters, isVerified: e.target.value });
    //   }}
    //     value={filters.isVerified}>
    //     <Radio value={undefined}>{t("All")}</Radio>
    //     <Radio value={1}>{t("Verified")}</Radio>
    //     <Radio value={0}>{t("NotVerified")}</Radio>
    //   </Radio.Group>,
    // }
  ]
  const openActions = (company: any) => {
    setSelectedCompany(company)
    setDrawerOpen(true)
  }

  const searchItems: CollapseProps['items'] = [
    {
      key: '1',
      label: t('SearchByName'),
      children: (
        <Input
          allowClear
          placeholder={t('EnterName')}
          onChange={(e: any) =>
            setKeywords({
              ...keywords,
              name: resolvePersianAndArabicNumbers(e.target.value || undefined),
            })
          }
          value={keywords.name}
        />
      ),
    },
    {
      key: '2',
      label: t('SearchByID'),
      children: (
        <Input
          placeholder={t('EnterID')}
          allowClear
          onChange={(e: any) =>
            setKeywords({
              ...keywords,
              id: resolvePersianAndArabicNumbers(e.target.value || undefined),
            })
          }
          value={keywords.id}
        />
      ),
    },
    {
      key: '3',
      label: t('SearchByPhoneNumber'),
      children: (
        <Input
          allowClear
          placeholder={t('EnterPhoneNumber')}
          onChange={(e: any) =>
            setKeywords({
              ...keywords,
              phoneNumber: resolvePersianAndArabicNumbers(e.target.value || undefined),
            })
          }
          value={keywords.phoneNumber}
        />
      ),
    },
  ]

  return (
    <>
      <Card className="p-0">
        <CardHeader className="border-b px-4 py-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
            <div className="page-header">
              <h4 className="page-title">
                {t('Companies')}
                <span className="count-title">
                  {' '}
                  {loadingData ? <>&nbsp;&nbsp;</> : dataTotalCount}
                </span>
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {/* <Button size='large' type='default' className='main-btn'><File size={15} />{t("Export")}</Button> */}
              <Popover
                content={
                  <div className="w-[320px]">
                    <Collapse items={searchItems} defaultActiveKey={['1']} />
                    <div className="flex items-center gap-2 justify-end mt-3">
                      <Button
                        loading={isLoadingSearchResult}
                        onClick={async () => {
                          setIsLoadingSearchResult(true)
                          updateSearchParam('0', meta.pageSize + '', keywords, filters)
                          await getData(meta.pageSize, 0, keywords, filters)
                          setIsLoadingSearchResult(false)
                        }}
                        type="primary"
                      >
                        <Save size={15} /> {t('Apply')}
                      </Button>
                      <Button
                        loading={isLoadingUndoSearchResult}
                        onClick={async () => {
                          setKeywords({ name: undefined, id: undefined, phoneNumber: undefined })
                          setIsLoadingUndoSearchResult(true)
                          updateSearchParam(
                            '0',
                            meta.pageSize + '',
                            { name: undefined, id: undefined, phoneNumber: undefined },
                            filters
                          )
                          await getData(
                            meta.pageSize,
                            0,
                            { name: undefined, id: undefined, phoneNumber: undefined },
                            filters
                          )
                          setIsLoadingUndoSearchResult(false)
                        }}
                        type="default"
                      >
                        <Undo size={15} /> {t('Reset')}
                      </Button>
                    </div>
                  </div>
                }
                placement="bottom"
                title={
                  <div className="flex gap-3 border-b py-2 mb-3 items-center text-[16px]">
                    <SearchIcon size={20} className="text-primary" />
                    {t('Search')}
                  </div>
                }
                trigger="click"
              >
                <Button
                  size="large"
                  type={checkIfSearchApplied() ? 'primary' : 'default'}
                  className="main-btn"
                >
                  <SearchIcon size={15} />
                  {t('Search')}
                </Button>
              </Popover>
              <Popover
                content={
                  <div className="w-[320px]">
                    <Collapse items={filterItems} defaultActiveKey={['1']} />
                    <div className="flex items-center gap-2 justify-end mt-3">
                      <Button
                        loading={isLoadingFilterResult}
                        onClick={async () => {
                          setIsLoadingFilterResult(true)
                          updateSearchParam('0', meta.pageSize + '', keywords, filters)
                          await getData(meta.pageSize, 0, keywords, filters)
                          setIsLoadingFilterResult(false)
                        }}
                        type="primary"
                      >
                        <Save size={15} /> {t('Apply')}
                      </Button>
                      <Button
                        loading={isLoadingUndoFilterResult}
                        onClick={async () => {
                          setFilters({ status: undefined, industry: undefined })
                          setIsLoadingUndoFilterResult(true)
                          updateSearchParam('0', meta.pageSize + '', keywords, {
                            status: undefined,
                            industry: undefined,
                          })
                          await getData(meta.pageSize, 0, keywords, {
                            status: undefined,
                            industry: undefined,
                          })
                          setIsLoadingUndoFilterResult(false)
                        }}
                        type="default"
                      >
                        <Undo size={15} /> {t('Reset')}
                      </Button>
                    </div>
                  </div>
                }
                placement="bottom"
                title={
                  <div className="flex gap-3 border-b py-2 mb-3 items-center text-[16px]">
                    <Filter size={20} className="text-primary" />
                    {t('Filter')}
                  </div>
                }
                trigger="click"
              >
                <Button
                  size="large"
                  type={checkIfFiltersApplied() ? 'primary' : 'default'}
                  className="main-btn"
                >
                  <Filter size={15} />
                  {t('Filter')}
                </Button>
              </Popover>

              {/* <Button
                size="large"
                type='primary'
                className='main-btn'
                onClick={() => setAddEditDrawer({ open: true, data: undefined, type: DrawerType.Add })}>
                <PlusSquare size={15} />{t("Add")}
              </Button> */}
            </div>
          </div>
        </CardHeader>
        <CardContent className="py-0 px-4">
          <Table
            pagination={pagination}
            className="main-table"
            rowKey={(record) => `${record.id}`}
            loading={loadingData}
            dataSource={data}
            tableLayout="auto"
            columns={tableColumns}
          />
        </CardContent>
      </Card>
      {hasPermission(grantedPolicies, 'CompaniesManagement.Companies.Update') && (
        <AddEditDrawer
          drawer={addEditDrawer}
          setDrawer={setAddEditDrawer}
          lng={lng}
          onOK={async () =>
            await getData(
              meta.pageSize,
              addEditDrawer.type === DrawerType.Add ? 0 : (meta.page - 1) * meta.pageSize,
              keywords,
              filters
            )
          }
        />
      )}
      <ManageFeaturesDrawer
        drawer={featuresDrawer}
        setDrawer={setFeaturesDrawer}
        lng={lng}
        // onOK={async (checkedKeys: any, treeData: any) => {
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

          trees.mobile.forEach((node: any) => processNode(node, checked.mobile))
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
          await getData(meta.pageSize, (meta.page - 1) * meta.pageSize, keywords, filters)
        }}
      />
      {/* Actions Drawer */}
      <CompanyActionsDrawer
        lng={lng}
        company={selectedCompany}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onUpdate={async () => {
          await getData(meta.pageSize, (meta.page - 1) * meta.pageSize, keywords, filters)
        }}
      />

      <Modal
        title={t('RegisterPhoneNumberWithMeta')}
        open={registerPhoneNumberDrawer.open}
        centered
        zIndex={9999}
        footer={
          <Form.Item className="flex-1 !mb-0">
            <Button
              type="primary"
              block
              loading={isSubmittingData}
              size="large"
              onClick={cancelInvitation}
            >
              {t('Register1')}
            </Button>
          </Form.Item>
        }
        onCancel={() => setRegisterPhoneNumberDrawer({ open: false, data: undefined })}
      >
        <Form layout="vertical">
          <div style={{ maxWidth: 500, margin: '20px auto' }}>
            <Form.Item
              className="mb-0"
              rules={[new Rules().getMandatoryRule()]}
              label={t('OtpCode')}
            >
              <Input
                placeholder={t('EnterOtpCode')}
                value={registerPhoneNumberDrawer?.data?.otpCode}
                onChange={(e) =>
                  setRegisterPhoneNumberDrawer({
                    ...registerPhoneNumberDrawer,
                    data: {
                      ...registerPhoneNumberDrawer.data,
                      otpCode: e.target.value,
                    },
                  })
                }
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}
