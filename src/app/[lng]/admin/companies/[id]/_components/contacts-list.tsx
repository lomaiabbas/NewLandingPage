import { getClientTranslation } from '@/app/i18n/client'
import { DrawerType } from '@/lib/constants'
import { resolvePersianAndArabicNumbers } from '@/lib/helpers'
import contactsServiceInstance from '@/lib/services/contacts'
import { App, Button, Collapse, Dropdown, Input, Popover, Table } from 'antd'
import { CollapseProps } from 'antd/lib'
import { Edit, Eye, MoreVertical, PlusSquare, Save, SearchIcon, Undo } from 'lucide-react'
import { useEffect, useState } from 'react'
import AddEditDrawer from '../../../contacts-management/contacts/_components/add-edit-drawer'
import ContactDetailsDrawer from './contact-details-drawer'

const INDEX_PAGE_SIZE_DEFAULT = 20
const INDEX_PAGE_SIZE_OPTIONS = ['10', '20', '50', '100', '150']

export default function ContactsList({ lng, id }: { lng: string; id: number }) {
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [contactsTotalCount, setContactsTotalCount] = useState<number>(0)
  const [contactsMeta, setContactsMeta] = useState<{
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
  const [contactsData, setContactsData] = useState<any[]>([])
  const { t } = getClientTranslation(lng)
  const [detailsDrawer, setDetailsDrawer] = useState<{
    open: boolean
    data: any | undefined
  }>({
    open: false,
    data: undefined,
  })
  const [addEditContactDrawer, setAddEditContactDrawer] = useState<{
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
    firstName: string | undefined
    surname: string | undefined
    phoneNumber: string | undefined
    email: string | undefined
  }>({
    firstName: undefined,
    surname: undefined,
    phoneNumber: undefined,
    email: undefined,
  })
  const { message } = App.useApp()

  useEffect(() => {
    if (id) {
      getContactsData(id, contactsMeta.pageSize, contactsMeta.skipCount, keywords)
    }
  }, [id])

  const getContactsData = async (
    id: number,
    maxResultCount: number,
    skipCount: number,
    keywords: {
      firstName: string | undefined
      email: string | undefined
      surname: string | undefined
      phoneNumber: string | undefined
    }
  ) => {
    setLoadingContacts(true)
    let result = await contactsServiceInstance.getAllContactsForCompany({
      skipCount: skipCount,
      maxResultCount: maxResultCount,
      firstName: keywords.firstName?.trim(),
      surname: keywords.surname?.trim(),
      email: keywords.email?.trim(),
      phoneNumber: keywords.phoneNumber?.trim(),
      companyId: id,
    })

    setContactsData(result.items)
    setContactsTotalCount(result.totalCount)
    setLoadingContacts(false)
  }

  const renderContactsActionsMenu = (item: any) => {
    return [
      {
        key: '1',
        label: (
          <div onClick={() => setDetailsDrawer({ open: true, data: item })}>
            <div className="dropdown-item">
              <Eye size={20} className="text-primary" />
              {t('Details')}
            </div>
          </div>
        ),
      },
      {
        key: '2',
        label: (
          <div
            className="dropdown-item"
            onClick={() =>
              setAddEditContactDrawer({ open: true, data: item, type: DrawerType.Edit })
            }
          >
            <Edit size={19} color="#0000dd" />
            {t('Edit')}
          </div>
        ),
      },
      // {
      //     key: '3',
      //     label: <div className='dropdown-item' onClick={() => onDeleteItem(item)}>
      //         <Trash size={19} color='#d50000' />
      //         {t('Delete')}
      //     </div>
      // }
    ]
  }

  const contactsTableColumns = [
    {
      title: t('ID'),
      dataIndex: 'id',
      key: 'id',
      minWidth: 100,
    },
    {
      title: t('FullName'),
      dataIndex: 'firstName',
      key: 'firstName',
      minWidth: 160,
      render: (firstName: string, item: any) =>
        firstName + (item.sureName ? ` ${item.sureName}` : ''),
    },
    {
      title: t('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      minWidth: 120,
      render: (phoneNumber: string, item: any) => (
        <span style={{ direction: 'ltr', display: 'inline-block' }}>
          {(item?.countryCode || '') + phoneNumber}
        </span>
      ),
    },
    {
      title: t('Action'),
      key: 'action',
      minWidth: 100,
      render: (text: string, item: any) => (
        <Dropdown
          menu={{ items: renderContactsActionsMenu(item) }}
          overlayStyle={{ zIndex: 22 }}
          placement="bottom"
        >
          <MoreVertical className="more-btn" />
        </Dropdown>
      ),
    },
  ]

  const contactsPaginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = contactsMeta
      temp.pageSize = pageSize
      setContactsMeta(temp)
      // setSearchParams({
      //   name: nameKeyword || "",
      //   email: emailKeyword || "",
      //   active: isActiveFilter ? 'true' : isActiveFilter !== undefined ? 'false' : "",
      //   role: roleIdFilter?.toString() || "",
      //   page: meta.page.toString(),
      //   pageSize: pageSize.toString(),
      // }, { replace: true });
      await getContactsData(id, pageSize, 0, keywords)
    },
    onChange: async (page: any) => {
      const temp = contactsMeta
      temp.page = page
      setContactsMeta(temp)
      // setSearchParams({
      //   name: nameKeyword || "",
      //   email: emailKeyword || "",
      //   active: isActiveFilter ? 'true' : isActiveFilter !== undefined ? 'false' : "",
      //   role: roleIdFilter?.toString() || "",
      //   page: meta.page.toString(),
      //   pageSize: meta.pageSize.toString(),
      // }, { replace: true });
      await getContactsData(id, contactsMeta.pageSize, (page - 1) * contactsMeta.pageSize, keywords)
    },
    pageSizeOptions: contactsMeta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${t('To')} ${range[1]} ${t('Of')} ${total}`,
  }

  const contactsPagination = {
    ...contactsPaginationOptions,
    total: contactsTotalCount,
    current: contactsMeta.page,
    pageSize: contactsMeta.pageSize,
  }

  const checkIfSearchApplied = () =>
    keywords.firstName !== undefined ||
    keywords.email !== undefined ||
    keywords.surname !== undefined ||
    keywords.phoneNumber !== undefined

  // const onDeleteItem = async (item: any) => {
  //   popupConfirm(
  //     async () => {
  //       await contactsServiceInstance.delete(item)
  //       message.success(t('TheContactHasBeenSuccessfullyDeleted', { name: item.firstName }), 5)
  //       await getContactsData(id, contactsMeta.pageSize, 0, keywords)
  //     },
  //     t('AreYouSureYouWantToDeleteThisContact', { name: item.firstName })
  //   )
  // }

  const searchItems: CollapseProps['items'] = [
    {
      key: '1',
      label: t('SearchByFirstName'),
      children: (
        <Input
          allowClear
          placeholder={t('EnterFirstName')}
          onChange={(e: any) =>
            setKeywords({
              ...keywords,
              firstName: resolvePersianAndArabicNumbers(e.target.value || undefined),
            })
          }
          value={keywords.firstName}
        />
      ),
    },
    {
      key: '2',
      label: t('SearchBySurname'),
      children: (
        <Input
          allowClear
          placeholder={t('EnterSurname')}
          onChange={(e: any) =>
            setKeywords({
              ...keywords,
              surname: resolvePersianAndArabicNumbers(e.target.value || undefined),
            })
          }
          value={keywords.surname}
        />
      ),
    },
    {
      key: '3',
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
    {
      key: '4',
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
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="page-header">
          <h4 className="page-title">
            {t('Contacts')}
            <span className="count-title">
              {' '}
              {loadingContacts ? <>&nbsp;&nbsp;</> : contactsTotalCount}
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
                      await getContactsData(id, contactsMeta.pageSize, 0, keywords)
                      setIsLoadingSearchResult(false)
                    }}
                    type="primary"
                  >
                    <Save size={15} /> {t('Apply')}
                  </Button>
                  <Button
                    loading={isLoadingUndoSearchResult}
                    onClick={async () => {
                      setKeywords({
                        firstName: undefined,
                        email: undefined,
                        phoneNumber: undefined,
                        surname: undefined,
                      })
                      setIsLoadingUndoSearchResult(true)
                      await getContactsData(id, contactsMeta.pageSize, 0, {
                        firstName: undefined,
                        email: undefined,
                        phoneNumber: undefined,
                        surname: undefined,
                      })
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

          <Button
            size="large"
            type="primary"
            className="main-btn"
            onClick={() =>
              setAddEditContactDrawer({ open: true, data: undefined, type: DrawerType.Add })
            }
          >
            <PlusSquare size={15} />
            {t('Add')}
          </Button>
        </div>
      </div>
      <Table
        pagination={contactsPagination}
        className="main-table"
        rowKey={(record) => `${record.id}`}
        loading={loadingContacts}
        tableLayout="auto"
        dataSource={contactsData}
        columns={contactsTableColumns}
      />

      <AddEditDrawer
        drawer={addEditContactDrawer}
        setDrawer={setAddEditContactDrawer}
        lng={lng}
        companyId={id}
        onOK={async () =>
          getContactsData(
            id,
            contactsMeta.pageSize,
            addEditContactDrawer.type === DrawerType.Add
              ? 0
              : (contactsMeta.page - 1) * contactsMeta.pageSize,
            keywords
          )
        }
      />

      <ContactDetailsDrawer drawer={detailsDrawer} setDrawer={setDetailsDrawer} lng={lng} />
    </>
  )
}
