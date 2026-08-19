'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { CardContent, CardHeader } from '@/components/ui/card'
import { DrawerType, FALLBACK_IMAGE } from '@/lib/constants'
import { useAppContext } from '@/lib/context'
import { hasPermission, resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { popupConfirm } from '@/lib/popup-confirm'
import applicationReqsServiceInstance from '@/lib/services/application-reqs'
import { GetAllApplicationReqsResponse } from '@/lib/services/application-reqs/dto'
import { ApplicationRequestStatus, LiteEntityDto, LocationType } from '@/lib/services/dto'
import locationServiceInstance from '@/lib/services/locations'
import {
  App,
  Button,
  Card,
  Collapse,
  Dropdown,
  Image,
  Input,
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
  BadgeCheck,
  CheckCheckIcon,
  CheckCircle,
  CheckSquare,
  Edit,
  Eye,
  Filter,
  MoreVertical,
  PlusSquare,
  Rocket,
  Save,
  SearchIcon,
  StopCircle,
  Undo,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AddEditDrawer from './add-edit-drawer'
import EditDrawer from './edit-drawer'

const INDEX_PAGE_SIZE_DEFAULT = 20
const INDEX_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '150']

export const ApplicationReqsList = ({ lng }: { lng: string }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { message } = App.useApp()
  const { grantedPolicies } = useAppContext()
  const { t } = getClientTranslation(lng)
  const [loadingData, setLoadingData] = useState(true)
  const [data, setData] = useState<GetAllApplicationReqsResponse[]>([])
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

  const [editDrawer, setEditDrawer] = useState<{
    open: boolean
    type: DrawerType
    data: GetAllApplicationReqsResponse | undefined
  }>({
    open: false,
    type: DrawerType.Add,
    data: undefined,
  })

  const [addDrawer, setAddDrawer] = useState<{
    open: boolean
    type: DrawerType
    data: GetAllApplicationReqsResponse | undefined
  }>({
    open: false,
    type: DrawerType.Add,
    data: undefined,
  })

  // const [approveDrawer, setApproveDrawer] = useState<{
  //   open: boolean
  //   data: GetAllApplicationReqsResponse | undefined
  // }>({
  //   open: false,
  //   data: undefined,
  // })

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

  const [filters, setFilters] = useState({
    status:
      searchParams.get('status') && searchParams.get('status') !== undefined
        ? Number(searchParams.get('status'))
        : undefined,
    city:
      searchParams.get('city') && searchParams.get('city') !== undefined
        ? Number(searchParams.get('city'))
        : undefined,
  })

  const [isLoadingSearchResult, setIsLoadingSearchResult] = useState(false)
  const [isLoadingUndoSearchResult, setIsLoadingUndoSearchResult] = useState(false)
  const [isLoadingFilterResult, setIsLoadingFilterResult] = useState(false)
  const [isLoadingUndoFilterResult, setIsLoadingUndoFilterResult] = useState(false)

  const updateSearchParam = (
    page: string,
    pageSize: string,
    keywords: { name: string | undefined; id: string | undefined; phoneNumber: string | undefined },
    filters: { status: ApplicationRequestStatus | undefined; city: number | undefined }
  ) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    params.set('pageSize', pageSize)
    params.set('city', filters.city !== undefined ? filters.city + '' : '')
    params.set('status', filters.status !== undefined ? filters.status + '' : '')
    params.set('name', keywords.name || '')
    params.set('id', keywords.id || '')
    params.set('phoneNumber', keywords.phoneNumber || '')

    router.replace(`${pathname}?${params.toString()}`)
  }

  const getData = async (
    maxResultCount: number,
    skipCount: number,
    keywords: { name: string | undefined; id: string | undefined; phoneNumber: string | undefined },
    filters: { status: ApplicationRequestStatus | undefined; city: number | undefined }
  ) => {
    try {
      setLoadingData(true)
      let result = await applicationReqsServiceInstance.getAll({
        skipCount: skipCount,
        maxResultCount: maxResultCount,
        name: keywords.name?.trim(),
        phoneNumber: keywords.phoneNumber?.trim(),
        id: keywords.id,
        status: filters.status,
        cityId: filters.city,
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
      getCities()
    }, // eslint-disable-next-line
    []
  )

  const renderActionsMenu = (item: GetAllApplicationReqsResponse) => {
    return [
      ...[
        {
          key: '1',
          label: (
            <Link href={`/${lng}/admin/companies/application-requests/${item.id}`}>
              <div className="dropdown-item">
                <Eye size={20} className="text-primary" />
                {t('Details')}
              </div>
            </Link>
          ),
        },
        hasPermission(grantedPolicies, 'CompaniesManagement.ApplicationRequests.Update')
          ? {
              key: '2',
              label: (
                <div
                  className="dropdown-item"
                  onClick={() => setEditDrawer({ open: true, data: item, type: DrawerType.Edit })}
                >
                  <Edit size={19} color="#0000dd" />
                  {t('Edit')}
                </div>
              ),
            }
          : null,
      ],
      hasPermission(grantedPolicies, 'CompaniesManagement.ApplicationRequests.Verify') &&
      item.status !== ApplicationRequestStatus.Verified &&
      item.status !== ApplicationRequestStatus.WaitingForApproval
        ? {
            key: '3',
            label: (
              <div className="dropdown-item" onClick={() => onVerifyItem(item)}>
                <CheckSquare size={19} className="text-primary" />
                {t('Verify')}
              </div>
            ),
          }
        : null,
      hasPermission(grantedPolicies, 'CompaniesManagement.ApplicationRequests.Accept') &&
      item.status === ApplicationRequestStatus.WaitingForApproval
        ? {
            key: '4',
            label: (
              <div className="dropdown-item" onClick={() => onApproveItem(item)}>
                <CheckCircle size={19} className="text-primary" />
                {t('Approve')}
              </div>
            ),
          }
        : null,
      hasPermission(
        grantedPolicies,
        'CompaniesManagement.ApplicationRequests.UpdateCompleteInfo'
      ) && item.status === ApplicationRequestStatus.Verified
        ? {
            key: '5',
            label: (
              <Link href={`/${lng}/onboarding?id=${item.id}`} target="_blank">
                <div className="dropdown-item">
                  <Rocket size={19} className="text-yellow-500" />
                  {t('Onboarding')}
                </div>
              </Link>
            ),
          }
        : null,
      hasPermission(grantedPolicies, 'CompaniesManagement.ApplicationRequests.WaitingForLunch') &&
      item.status === ApplicationRequestStatus.Verified
        ? {
            key: '61',
            label: (
              <div className="dropdown-item" onClick={() => onSetWaitingLaunchItem(item)}>
                <CheckCheckIcon size={19} className="text-primary" />
                {t('SetAsWaitingLaunch')}
              </div>
            ),
          }
        : null,
      hasPermission(grantedPolicies, 'CompaniesManagement.ApplicationRequests.Reject') &&
      item.status !== ApplicationRequestStatus.Rejected &&
      (item.status === ApplicationRequestStatus.WaitingForApproval ||
        item.status === ApplicationRequestStatus.InReview)
        ? {
            key: '7',
            label: (
              <div className="dropdown-item" onClick={() => onRejectItem(item)}>
                <StopCircle size={19} color="#d50000" />
                {t('Reject')}
              </div>
            ),
          }
        : null,
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
      minWith: 160,
      render: (arName: string, item: GetAllApplicationReqsResponse) => (
        <span className="relative flex gap-2 items-center">
          {lng === 'ar' ? item.arName : item.enName}
          {item.status === ApplicationRequestStatus.Verified ? (
            <Tooltip title={t('IsVerified')}>
              <BadgeCheck color="green" className="relative" size={20} />
            </Tooltip>
          ) : null}
        </span>
      ),
    },
    {
      title: t('Logo'),
      dataIndex: 'arLogo',
      key: 'arLogo',
      minWith: 100,
      render: (arLogo: string, item: GetAllApplicationReqsResponse) => (
        <div className="relative w-fit h-fit">
          <Image
            width={50}
            height={50}
            className="rounded-md object-contain shadow"
            src={(lng === 'ar' ? item.arLogo : item.enLogo) ?? FALLBACK_IMAGE}
            alt={lng === 'ar' ? item.arName : item.enName}
          />
        </div>
      ),
    },
    {
      title: t('City'),
      dataIndex: 'city',
      key: 'city',
      minWith: 100,
      render: (city: any) => city?.text,
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      key: 'status',
      minWith: 130,
      render: (status: ApplicationRequestStatus) => (
        <Tag
          color={
            status === ApplicationRequestStatus.Verified
              ? 'green-inverse'
              : status === ApplicationRequestStatus.Rejected
                ? 'red-inverse'
                : status === ApplicationRequestStatus.WaitingForApproval
                  ? 'blue-inverse'
                  : 'yellow-inverse'
          }
        >
          {status === ApplicationRequestStatus.Verified
            ? t('Verified')
            : status === ApplicationRequestStatus.Rejected
              ? t('Rejected')
              : status === ApplicationRequestStatus.WaitingForApproval
                ? t('WaitingForApproval')
                : t('InReview')}
        </Tag>
      ),
    },
    {
      title: t('Action'),
      key: 'action',
      minWith: 100,
      render: (text: string, item: GetAllApplicationReqsResponse) => (
        <Dropdown
          menu={{ items: renderActionsMenu(item) }}
          overlayStyle={{ zIndex: 22 }}
          placement="bottom"
        >
          <MoreVertical className="more-btn" />
        </Dropdown>
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
  const checkIfFiltersApplied = () => filters.city !== undefined || filters.status !== undefined

  const onVerifyItem = async (item: GetAllApplicationReqsResponse) => {
    popupConfirm(
      async () => {
        await applicationReqsServiceInstance.verify(item.id)
        message.success(
          t('TheApplicationRequestHasBeenSuccessfullyVerified', {
            name: lng === 'ar' ? item.arName : item.enName,
          }),
          5
        )
        updateSearchParam('0', meta.pageSize + '', keywords, filters)
        await getData(meta.pageSize, 0, keywords, filters)
      },
      t('AreYouSureYouWantToVerifyThisApplicationRequest', {
        name: lng === 'ar' ? item.arName : item.enName,
      })
    )
  }

  const onApproveItem = async (item: GetAllApplicationReqsResponse) => {
    if (
      item.industry !== undefined &&
      item.latitude &&
      item.enLogo &&
      item.managerInfo.name &&
      item.managerInfo.lastName &&
      item.managerInfo.email
    ) {
      // setApproveDrawer({ open: true, data: item })
      popupConfirm(
        async () => {
          let result = await applicationReqsServiceInstance.accept(item?.id!, [])
          router.push(`/${lng}/admin/companies?tenant=${result?.tenantId}`)
          message.success(
            t('TheApplicationRequestHasBeenSuccessfullyApproved', {
              name: lng === 'ar' ? item?.arName : item?.enName,
            }),
            5
          )
        },
        t('AreYouSureYouWantToApproveThisApplicationRequest', {
          name: lng === 'ar' ? item?.arName : item?.enName,
        })
      )
    } else {
      message.error(t('YouMustCompleteInfo'), 7)
      setEditDrawer({ open: true, data: item, type: DrawerType.Edit })
    }
  }

  const onRejectItem = async (item: GetAllApplicationReqsResponse) => {
    popupConfirm(
      async () => {
        await applicationReqsServiceInstance.reject(item.id)

        message.success(
          t('TheApplicationRequestHasBeenSuccessfullyRejected', {
            name: lng === 'ar' ? item.arName : item.enName,
          }),
          5
        )
        updateSearchParam('0', meta.pageSize + '', keywords, filters)
        await getData(meta.pageSize, 0, keywords, filters)
      },
      t('AreYouSureYouWantToRejectThisApplicationRequest', {
        name: lng === 'ar' ? item.arName : item.enName,
      })
    )
  }

  const onSetWaitingLaunchItem = async (item: GetAllApplicationReqsResponse) => {
    popupConfirm(
      async () => {
        await applicationReqsServiceInstance.setAsWaitingForApproval(item.id)

        message.success(
          t('TheApplicationRequestHasBeenSuccessfullySetAsWaitinfLaunch', {
            name: lng === 'ar' ? item.arName : item.enName,
          }),
          5
        )
        updateSearchParam('0', meta.pageSize + '', keywords, filters)
        await getData(meta.pageSize, 0, keywords, filters)
      },
      t('AreYouSureYouWantToChangeThisApplicationRequestStatusToWaitingLaunch', {
        name: lng === 'ar' ? item.arName : item.enName,
      })
    )
  }

  const searchItems: CollapseProps['items'] = [
    {
      key: '1',
      label: t('SearchByName'),
      children: (
        <Input
          placeholder={t('EnterName')}
          allowClear
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
          placeholder={t('EnterPhoneNumber')}
          allowClear
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
  const [cities, setCities] = useState<LiteEntityDto[]>([])

  const getCities = async () => {
    let result = await locationServiceInstance.getAllLite({
      isActive: true,
      skipCount: 0,
      maxResultCount: 1000,
      type: LocationType.City,
    })
    setCities(result.items)
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
          <Radio value={0}>{t('InReview')}</Radio>
          <Radio value={1}>{t('Verified')}</Radio>
          <Radio value={2}>{t('Rejected')}</Radio>
          <Radio value={3}>{t('WaitingForApproval')}</Radio>
        </Radio.Group>
      ),
    },
    {
      key: '2',
      label: t('FilterByCity'),
      children: (
        <Select
          placeholder={t('PleaseSelectCity')}
          showSearch
          value={filters.city}
          dropdownStyle={{ zIndex: 9999 }}
          allowClear
          virtual={false}
          className="w-full"
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          onChange={(value) =>
            setFilters({ ...filters, city: value !== undefined ? value : undefined })
          }
        >
          <Select.Option key={undefined} value={undefined}>
            {t('All')}
          </Select.Option>
          {cities?.map((element: LiteEntityDto) => (
            <Select.Option key={+element.value} value={+element.value}>
              {element.text}
            </Select.Option>
          ))}
        </Select>
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
                {t('ApplicationReqs')}
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
                          setFilters({ status: undefined, city: undefined })
                          setIsLoadingUndoFilterResult(true)
                          updateSearchParam('0', meta.pageSize + '', keywords, {
                            status: undefined,
                            city: undefined,
                          })
                          await getData(meta.pageSize, 0, keywords, {
                            status: undefined,
                            city: undefined,
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
              {hasPermission(grantedPolicies, 'CompaniesManagement.ApplicationRequests.Create') && (
                <Button
                  size="large"
                  type="primary"
                  className="main-btn"
                  onClick={() =>
                    setAddDrawer({ open: true, data: undefined, type: DrawerType.Add })
                  }
                >
                  <PlusSquare size={15} />
                  {t('Add')}
                </Button>
              )}
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

      <AddEditDrawer
        drawer={addDrawer}
        setDrawer={setAddDrawer}
        lng={lng}
        onOK={async () => {
          updateSearchParam('0', meta.pageSize + '', keywords, filters)
          await getData(meta.pageSize, 0, keywords, filters)
        }}
      />

      {/* <ApproveDrawer
        drawer={approveDrawer}
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
              let result = await applicationReqsServiceInstance.accept(approveDrawer?.data?.id!, [])
              await companiesServiceInstance.updateFeatures(result.tenantId, {
                features: checkedFeatures,
              })

              message.success(
                t('TheApplicationRequestHasBeenSuccessfullyApproved', {
                  name: lng === 'ar' ? approveDrawer?.data?.arName : approveDrawer?.data?.enName,
                }),
                5
              )
              setApproveDrawer({ open: false, data: undefined })
              updateSearchParam('0', meta.pageSize + '', keywords, filters)
              await getData(meta.pageSize, 0, keywords, filters)
            },
            t('AreYouSureYouWantToApproveThisApplicationRequest', {
              name: lng === 'ar' ? approveDrawer?.data?.arName : approveDrawer?.data?.enName,
            })
          )
        }}
      /> */}

      <EditDrawer
        drawer={editDrawer}
        setDrawer={setEditDrawer}
        lng={lng}
        onOK={async () => {
          updateSearchParam('0', meta.pageSize + '', keywords, filters)
          await getData(meta.pageSize, 0, keywords, filters)
        }}
      />
    </>
  )
}
