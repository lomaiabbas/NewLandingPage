import { getClientTranslation } from '@/app/i18n/client'
import { DrawerType } from '@/lib/constants'
import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import { popupConfirm } from '@/lib/popup-confirm'
import rolesServiceInstance from '@/lib/services/roles'
import { App, Button, Collapse, Input, Popover, Table } from 'antd'
import { CollapseProps } from 'antd/lib'
import { Edit, Eye, Save, SearchIcon, Trash, Undo } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import AddEditDrawer from '../../../staff-management/roles/_components/add-edit-drawer'

const INDEX_PAGE_SIZE_DEFAULT = 20
const INDEX_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '150']

export default function RolesList({ lng, id }: { lng: string; id: number }) {
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [rolesTotalCount, setRolesTotalCount] = useState<number>(0)
  const [rolesMeta, setRolesMeta] = useState<{
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
  const [rolesData, setRolesData] = useState<any[]>([])
  const { t } = getClientTranslation(lng)

  const [addEditRoleDrawer, setAddEditRoleDrawer] = useState<{
    open: boolean
    type: DrawerType
    data: any | undefined
  }>({
    open: false,
    type: DrawerType.Add,
    data: undefined,
  })

  const [isLoadingSearchResult, setIsLoadingSearchResult] = useState(false)
  const [isLoadingUndoSearchResult, setIsLoadingUndoSearchResult] = useState(false)

  const [keywords, setKeywords] = useState<{
    name: string | undefined
  }>({
    name: undefined,
  })
  const { message } = App.useApp()

  useEffect(() => {
    if (id) {
      getRolesData(id, rolesMeta.pageSize, rolesMeta.skipCount, keywords)
    }
  }, [id])

  const getRolesData = async (
    id: number,
    maxResultCount: number,
    skipCount: number,
    keywords: {
      name: string | undefined
    }
  ) => {
    setLoadingRoles(true)
    let result = await rolesServiceInstance.getAllForCompany({
      maxResultCount,
      skipCount,
      companyId: id,
      name: keywords.name?.trim(),
    })

    setRolesData(result.items)
    setRolesTotalCount(result.totalCount)
    setLoadingRoles(false)
  }

  const onDeleteRole = async (item: any) => {
    popupConfirm(
      async () => {
        await rolesServiceInstance.delete(item.id)
        message.success(t('TheRoleHasBeenSuccessfullyDeleted', { name: item.name }), 5)
        await getRolesData(id, rolesMeta.pageSize, 0, keywords)
      },
      t('AreYouSureYouWantToDeleteThisRole', { name: item.name })
    )
  }

  const renderRolesActionsMenu = (item: any) => {
    return [
      ...[
        {
          key: '1',
          label: (
            <Link href={`/${lng}/admin/staff-management/roles/${item.id}`}>
              <div className="dropdown-item">
                <Eye size={20} className="text-primary" />
                {t('Details')}
              </div>
            </Link>
          ),
        },
      ],
      item.name !== 'admin'
        ? {
            key: '2',
            label: (
              <div
                className="dropdown-item"
                onClick={() =>
                  setAddEditRoleDrawer({ open: true, data: item, type: DrawerType.Edit })
                }
              >
                <Edit size={19} color="#0000dd" />
                {t('Edit')}
              </div>
            ),
          }
        : null,
      item.name !== 'admin'
        ? {
            key: '3',
            label: (
              <div className="dropdown-item" onClick={() => onDeleteRole(item)}>
                <Trash size={19} color="#d50000" />
                {t('Delete')}
              </div>
            ),
          }
        : null,
    ]
  }

  const rolesTableColumns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      minWidth: 100,
      render: (_: string, item: any) => item?.extraProperties?.SequenceNumber || t('NotAvailable'),
    },
    {
      title: t('ArName'),
      dataIndex: 'arName',
      key: 'arName',
      minWidth: 150,
      render: (_: string, item: any) => item?.extraProperties?.ArName || t('NotAvailable'),
    },
    {
      title: t('EnName'),
      dataIndex: 'name',
      key: 'name',
      minWidth: 150,
    },
    {
      title: t('StaffCount'),
      dataIndex: 'usersCount',
      key: 'usersCount',
      minWidth: 110,
      render: (_: string, item: any) => item?.extraProperties?.usersCount || 0,
    },
    // {
    //     title: t('Action'),
    //     key: 'action',
    //     minWidth: 100,
    //     render: (text: string, item: any) => (
    //         <Dropdown menu={{ items: renderRolesActionsMenu(item) }} overlayStyle={{ zIndex: 22 }} placement="bottom">
    //             <MoreVertical className='more-btn' />
    //         </Dropdown>
    //     )
    // }
  ]

  const rolesPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = rolesMeta
      temp.pageSize = pageSize
      setRolesMeta(temp)
      // setSearchParams({
      //   name: nameKeyword || "",
      //   email: emailKeyword || "",
      //   active: isActiveFilter ? 'true' : isActiveFilter !== undefined ? 'false' : "",
      //   role: roleIdFilter?.toString() || "",
      //   page: meta.page.toString(),
      //   pageSize: pageSize.toString(),
      // }, { replace: true });
      await getRolesData(id, pageSize, 0, keywords)
    },
    onChange: async (page: any) => {
      const temp = rolesMeta
      temp.page = page
      setRolesMeta(temp)
      // setSearchParams({
      //   name: nameKeyword || "",
      //   email: emailKeyword || "",
      //   active: isActiveFilter ? 'true' : isActiveFilter !== undefined ? 'false' : "",
      //   role: roleIdFilter?.toString() || "",
      //   page: meta.page.toString(),
      //   pageSize: meta.pageSize.toString(),
      // }, { replace: true });
      await getRolesData(id, rolesMeta.pageSize, (page - 1) * rolesMeta.pageSize, keywords)
    },
    pageSizeOptions: rolesMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${t('To')} ${range[1]} ${t('Of')} ${total}`,
  }

  const rolesPagination = {
    ...rolesPaginationOptions,
    total: rolesTotalCount,
    current: rolesMeta.page,
    pageSize: rolesMeta.pageSize,
  }

  const checkIfSearchApplied = () => keywords.name !== undefined

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
  ]

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="page-header">
          <h4 className="page-title">
            {t('Roles')}
            <span className="count-title">
              {' '}
              {loadingRoles ? <>&nbsp;&nbsp;</> : rolesTotalCount}
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
                      await getRolesData(id, rolesMeta.pageSize, 0, keywords)
                      setIsLoadingSearchResult(false)
                    }}
                    type="primary"
                  >
                    <Save size={15} /> {t('Apply')}
                  </Button>
                  <Button
                    loading={isLoadingUndoSearchResult}
                    onClick={async () => {
                      setKeywords({ name: undefined })
                      setIsLoadingUndoSearchResult(true)
                      await getRolesData(id, rolesMeta.pageSize, 0, { name: undefined })
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

          {/* <Button
                        size="large"
                        type='primary'
                        className='main-btn'
                        onClick={() => setAddEditRoleDrawer({ open: true, data: undefined, type: DrawerType.Add })}>
                        <PlusSquare size={15} />{t("Add")}
                    </Button> */}
        </div>
      </div>
      <Table
        pagination={rolesPagination}
        className="main-table"
        rowKey={(record) => `${record.id}`}
        loading={loadingRoles}
        tableLayout="auto"
        dataSource={rolesData}
        columns={rolesTableColumns}
      />

      <AddEditDrawer
        drawer={addEditRoleDrawer}
        setDrawer={setAddEditRoleDrawer}
        lng={lng}
        companyId={id}
        onOK={async () =>
          getRolesData(
            id,
            rolesMeta.pageSize,
            addEditRoleDrawer.type === DrawerType.Add
              ? 0
              : (rolesMeta.page - 1) * rolesMeta.pageSize,
            keywords
          )
        }
      />
    </>
  )
}
