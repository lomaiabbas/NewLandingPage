import { getClientTranslation } from '@/app/i18n/client'
import { DrawerType } from '@/lib/constants'
import { renderDateTimeFromNow, resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { popupConfirm } from '@/lib/popup-confirm'
import companiesServiceInstance from '@/lib/services/companies'
import companiesStaffServiceInstance from '@/lib/services/companies-staff'
import { LiteEntityDto } from '@/lib/services/dto'
import {
  App,
  Button,
  Collapse,
  Dropdown,
  Input,
  Popover,
  Radio,
  RadioChangeEvent,
  Select,
  Table,
  Tag,
} from 'antd'
import { CollapseProps } from 'antd/lib'
import {
  CheckCircle,
  Edit,
  Eye,
  Filter,
  Lock,
  MoreVertical,
  PlusSquare,
  Save,
  SearchIcon,
  StopCircle,
  Undo,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddEditDrawer from '../../staff/_components/add-edit-drawer'
import ResetPasswordDrawer from '../../staff/_components/reset-password-drawer'

const INDEX_PAGE_SIZE_DEFAULT = 20
const INDEX_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '150']

export default function StaffList({ lng, id }: { lng: string; id: number }) {
  const [loadingStaff, setLoadingStaff] = useState(true)
  const [staffTotalCount, setStaffTotalCount] = useState<number>(0)
  const [staffMeta, setStaffMeta] = useState<{
    page: number
    pageSize: number
    pageSizeOptions: string[]
    pageTotal: number
    skipCount: number
    total: number
  }>({
    page: 1,
    pageSize: INDEX_PAGE_SIZE_DEFAULT,
    pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
    pageTotal: 1,
    skipCount: 0,
    total: 0,
  })
  const [staffData, setStaffData] = useState<any[]>([])
  const { t } = getClientTranslation(lng)

  const [addEditStaffDrawer, setAddEditStaffDrawer] = useState<{
    open: boolean
    type: DrawerType
    data: any | undefined
  }>({
    open: false,
    type: DrawerType.Add,
    data: undefined,
  })

  const [staffResetPasswordDrawer, setStaffResetPasswordDrawer] = useState<{
    open: boolean
    data: any | undefined
  }>({
    open: false,
    data: undefined,
  })
  const [isLoadingSearchResult, setIsLoadingSearchResult] = useState(false)
  const [isLoadingUndoSearchResult, setIsLoadingUndoSearchResult] = useState(false)
  const [isLoadingFilterResult, setIsLoadingFilterResult] = useState(false)
  const [isLoadingUndoFilterResult, setIsLoadingUndoFilterResult] = useState(false)
  const [roles, setRoles] = useState<LiteEntityDto[]>([])
  const [filters, setFilters] = useState<{
    status: boolean | undefined
    role: string | undefined
  }>({
    status: undefined,
    role: undefined,
  })

  const [keywords, setKeywords] = useState<{
    name: string | undefined
    email: string | undefined
  }>({
    name: undefined,
    email: undefined,
  })
  const { message } = App.useApp()

  useEffect(() => {
    if (id) {
      getStaffData(id, staffMeta.pageSize, staffMeta.skipCount, keywords, filters)
      getRoles(id + '')
    }
  }, [id])

  const getRoles = async (companyId: string) => {
    let result = await companiesServiceInstance.getRolesByCompany({
      skipCount: 0,
      maxResultCount: 1000,
      id: companyId,
    })
    setRoles(result.items)
  }

  const getStaffData = async (
    id: number,
    maxResultCount: number,
    skipCount: number,
    keywords: {
      name: string | undefined
      email: string | undefined
    },
    filters: { status: boolean | undefined; role: string | undefined }
  ) => {
    setLoadingStaff(true)
    let result = await companiesStaffServiceInstance.getAll({
      maxResultCount,
      skipCount,
      companyId: id,
      emailAddress: keywords.email?.trim(),
      name: keywords.name?.trim(),
      isActive: filters.status,
      roleId: filters.role,
    })

    setStaffData(result.items)
    setStaffTotalCount(result.totalCount)
    setLoadingStaff(false)
  }

  const onActivateStaffItem = async (item: any) => {
    popupConfirm(
      async () => {
        if (item.isActive) await companiesStaffServiceInstance.deactivate(item.id)
        else await companiesStaffServiceInstance.activate(item.id)

        message.success(
          item.isActive
            ? t('TheStaffHasBeenSuccessfullyDeactivated', { name: item.name })
            : t('TheStaffHasBeenSuccessfullyActivated', { name: item.name }),
          5
        )
        await getStaffData(
          id,
          staffMeta.pageSize,
          (staffMeta.page - 1) * staffMeta.pageSize,
          keywords,
          filters
        )
      },
      item.isActive
        ? t('AreYouSureYouWantToDeactivateThisStaff', { name: item.name })
        : t('AreYouSureYouWantToActivateThisStaff', { name: item.name })
    )
  }

  const renderStaffActionsMenu = (item: any) => {
    return [
      {
        key: '1',
        label: (
          <Link href={`/${lng}/admin/companies/staff/${item.id}`}>
            <div className="dropdown-item">
              <Eye size={20} className="text-primary" />
              {t('Details')}
            </div>
          </Link>
        ),
      },
      {
        key: '2',
        label: (
          <div
            className="dropdown-item"
            onClick={() => setAddEditStaffDrawer({ open: true, data: item, type: DrawerType.Edit })}
          >
            <Edit size={19} color="#0000dd" />
            {t('Edit')}
          </div>
        ),
      },
      {
        key: '3',
        label: (
          <div className="dropdown-item" onClick={() => onActivateStaffItem(item)}>
            {item.isActive ? (
              <StopCircle size={19} color="#d50000" />
            ) : (
              <CheckCircle size={19} className="text-primary" />
            )}
            {item.isActive ? t('Deactivate') : t('Activate')}
          </div>
        ),
      },
      {
        key: '4',
        label: (
          <div
            className="dropdown-item"
            onClick={() => setStaffResetPasswordDrawer({ open: true, data: item })}
          >
            <Lock size={19} color="#0000dd" />
            {t('ResetPassword')}
          </div>
        ),
      },
    ]
  }

  const staffTableColumns = [
    {
      title: t('ID'),
      dataIndex: 'sequenceNumber',
      key: 'sequenceNumber',
      minWith: 100,
      render: (_: string, item: any) => item?.extraProperties?.SequenceNumber,
    },
    {
      title: t('FullName'),
      dataIndex: 'name',
      key: 'name',
      minWith: 160,
      render: (name: string, item: any) => name + (item.surname ? ` ${item.surname}` : ''),
    },
    {
      title: t('Position'),
      dataIndex: 'position',
      key: 'position',
      minWith: 120,
    },
    {
      title: t('Role'),
      dataIndex: 'roleName',
      key: 'roleName',
      minWith: 120,
    },
    {
      title: t('LastLoginTime'),
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      minWith: 120,
      render: (_: string, item: any) =>
        item?.lastLoginTime ? renderDateTimeFromNow(item?.lastLoginTime) : t('NotAvailable'),
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
      minWidth: 100,
      render: (text: string, item: any) => (
        <Dropdown
          menu={{ items: renderStaffActionsMenu(item) }}
          overlayStyle={{ zIndex: 22 }}
          placement="bottom"
        >
          <MoreVertical className="more-btn" />
        </Dropdown>
      ),
    },
  ]

  const staffPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = staffMeta
      temp.pageSize = pageSize
      setStaffMeta(temp)
      // setSearchParams({
      //   name: nameKeyword || "",
      //   email: emailKeyword || "",
      //   active: isActiveFilter ? 'true' : isActiveFilter !== undefined ? 'false' : "",
      //   role: roleIdFilter?.toString() || "",
      //   page: meta.page.toString(),
      //   pageSize: pageSize.toString(),
      // }, { replace: true });
      await getStaffData(id, pageSize, 0, keywords, filters)
    },
    onChange: async (page: any) => {
      const temp = staffMeta
      temp.page = page
      setStaffMeta(temp)
      // setSearchParams({
      //   name: nameKeyword || "",
      //   email: emailKeyword || "",
      //   active: isActiveFilter ? 'true' : isActiveFilter !== undefined ? 'false' : "",
      //   role: roleIdFilter?.toString() || "",
      //   page: meta.page.toString(),
      //   pageSize: meta.pageSize.toString(),
      // }, { replace: true });
      await getStaffData(id, staffMeta.pageSize, (page - 1) * staffMeta.pageSize, keywords, filters)
    },
    pageSizeOptions: staffMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${t('To')} ${range[1]} ${t('Of')} ${total}`,
  }

  const staffPagination = {
    ...staffPaginationOptions,
    total: staffTotalCount,
    current: staffMeta.page,
    pageSize: staffMeta.pageSize,
  }

  const checkIfSearchApplied = () => keywords.name !== undefined || keywords.email !== undefined
  const checkIfFiltersApplied = () => filters.status !== undefined || filters.role !== undefined

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
          <Radio value={true}>{t('Active')}</Radio>
          <Radio value={false}>{t('Inactive')}</Radio>
        </Radio.Group>
      ),
    },

    {
      key: '3',
      label: t('FilterByRole'),
      children: (
        <Select
          placeholder={t('PleaseSelectRole')}
          showSearch
          className="w-full"
          allowClear
          onChange={(value: string) => {
            setFilters({ ...filters, role: value || undefined })
          }}
          value={filters.role}
          virtual={false}
          dropdownStyle={{ zIndex: 9999 }}
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {roles?.map((element: any) => (
            <Select.Option key={element.value} value={element.value}>
              {element.text}
            </Select.Option>
          ))}
        </Select>
      ),
    },
  ]

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
      label: t('SearchByEmail'),
      children: (
        <Input
          allowClear
          placeholder={t('EnterEmail')}
          onChange={(e: any) =>
            setKeywords({
              ...keywords,
              email: resolvePersianAndArabicNumbers(e.target.value || undefined),
            })
          }
          value={keywords.email}
        />
      ),
    },
  ]

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="page-header">
          <h4 className="page-title">
            {t('Staff')}
            <span className="count-title">
              {' '}
              {loadingStaff ? <>&nbsp;&nbsp;</> : staffTotalCount}
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
                      await getStaffData(id, staffMeta.pageSize, 0, keywords, filters)
                      setIsLoadingSearchResult(false)
                    }}
                    type="primary"
                  >
                    <Save size={15} /> {t('Apply')}
                  </Button>
                  <Button
                    loading={isLoadingUndoSearchResult}
                    onClick={async () => {
                      setKeywords({ name: undefined, email: undefined })
                      setIsLoadingUndoSearchResult(true)
                      await getStaffData(
                        id,
                        staffMeta.pageSize,
                        0,
                        { name: undefined, email: undefined },
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
                      await getStaffData(id, staffMeta.pageSize, 0, keywords, filters)
                      setIsLoadingFilterResult(false)
                    }}
                    type="primary"
                  >
                    <Save size={15} /> {t('Apply')}
                  </Button>
                  <Button
                    loading={isLoadingUndoFilterResult}
                    onClick={async () => {
                      setFilters({ status: undefined, role: undefined })
                      setIsLoadingUndoFilterResult(true)
                      await getStaffData(id, staffMeta.pageSize, 0, keywords, {
                        status: undefined,
                        role: undefined,
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
          <Button
            size="large"
            type="primary"
            className="main-btn"
            onClick={() =>
              setAddEditStaffDrawer({ open: true, data: undefined, type: DrawerType.Add })
            }
          >
            <PlusSquare size={15} />
            {t('Add')}
          </Button>
        </div>
      </div>
      <Table
        pagination={staffPagination}
        className="main-table"
        rowKey={(record) => `${record.id}`}
        loading={loadingStaff}
        tableLayout="auto"
        dataSource={staffData}
        columns={staffTableColumns}
      />

      <AddEditDrawer
        drawer={addEditStaffDrawer}
        setDrawer={setAddEditStaffDrawer}
        lng={lng}
        companyId={id}
        companies={[]}
        onOK={async () =>
          getStaffData(
            id,
            staffMeta.pageSize,
            addEditStaffDrawer.type === DrawerType.Add
              ? 0
              : (staffMeta.page - 1) * staffMeta.pageSize,
            keywords,
            filters
          )
        }
      />

      <ResetPasswordDrawer
        drawer={staffResetPasswordDrawer}
        setDrawer={setStaffResetPasswordDrawer}
        lng={lng}
        onOK={async () =>
          getStaffData(
            id,
            staffMeta.pageSize,
            (staffMeta.page - 1) * staffMeta.pageSize,
            keywords,
            filters
          )
        }
      />
    </>
  )
}
