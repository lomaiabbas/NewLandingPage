import { useAppContext } from '@/lib/context'
import Rules from '@/lib/rules'
import adminChatServiceInstance from '@/lib/services/admin/chat'
import managerChatServiceInstance from '@/lib/services/manager/chat'
import { EntityType } from '@/lib/services/types'
import { Button, Form, Input, Select, Spin, Typography } from 'antd'
import { CheckCircle2, Clock3, Loader2, PencilLine, SquarePlus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { TaskStatus } from './task-types'

interface TaskAddFormProps {
  onAdd: (
    title: string,
    description: string,
    assignedUserId: string | null,
    relatedEntityId: string | null,
    relatedEntityType: EntityType.Chat | null,
    status: TaskStatus,
    chatInfo?: any
  ) => Promise<any> | void
  onCancel: () => void
  t: (key: string) => string
  initialTitle?: string
  initialDescription?: string
  initialStatus?: TaskStatus
  initialAssignedUserId?: string | null
  initialRelatedEntityId?: string | number | null
  initialChatInfo?: any
  usersList?: { id: string; name: string; surName?: string }[]
  chatsList?: { id: string; userName: string; phoneNumber: string }[]
  grantedPolicies?: string[]
  submitLabel?: string
  formTitle?: string
  withContainer?: boolean
  hideStatus?: boolean
  isSubmitDisabled?: boolean
  disabled?: boolean
}

export default function TaskAddForm({
  onAdd,
  onCancel,
  t,
  initialTitle = '',
  initialDescription = '',
  initialStatus = 'pending',
  initialAssignedUserId = null,
  initialRelatedEntityId = null,
  initialChatInfo = null,
  usersList = [],
  chatsList = [],
  grantedPolicies = [],
  submitLabel,
  formTitle,
  withContainer = false,
  hideStatus = false,
  isSubmitDisabled = false,
  disabled = false,
}: TaskAddFormProps) {
  const { tenant, currentUser } = useAppContext()
  const { lng } = useParams()
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [desc, setDesc] = useState(initialDescription)
  const [status, setStatus] = useState<TaskStatus>(initialStatus)
  const [assignedUserId, setAssignedUserId] = useState<string | null>(
    initialAssignedUserId || currentUser?.id || null
  )
  const [relatedEntityId, setRelatedEntityId] = useState<string | null>(
    initialRelatedEntityId ? String(initialRelatedEntityId) : null
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!assignedUserId && currentUser?.id) {
      setAssignedUserId(currentUser.id)
    }
  }, [currentUser])

  useEffect(() => {
    setTitle(initialTitle)
  }, [initialTitle])

  useEffect(() => {
    setDesc(initialDescription)
  }, [initialDescription])

  // Local chats state for API-based scroll pagination
  const [localChats, setLocalChats] = useState<
    { id: string; userName: string; phoneNumber: string }[]
  >([])
  const [chatPage, setChatPage] = useState(1)
  const [hasMoreChats, setHasMoreChats] = useState(true)
  const [loadingChats, setLoadingChats] = useState(false)
  const [chatSearch, setChatSearch] = useState('')
  const [chatsLoaded, setChatsLoaded] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Use refs to avoid stale closures in the Select component's scroll event handlers
  const chatPageRef = useRef(1)
  const chatSearchRef = useRef('')
  const hasMoreChatsRef = useRef(true)
  const loadingChatsRef = useRef(false)

  const canLinkChat =
    grantedPolicies.includes('ChatsManagementForHost.Staff') ||
    grantedPolicies.includes('ChatsManagementForHost.Clients') ||
    grantedPolicies.includes('ChatsManagement.Clients') ||
    grantedPolicies.includes('ChatsManagement.Staff')

  const canGoToChat =
    grantedPolicies.includes('ChatsManagementForHost.Staff') ||
    grantedPolicies.includes('ChatsManagementForHost.Clients') ||
    grantedPolicies.includes('ChatsManagement.Clients') ||
    grantedPolicies.includes('ChatsManagement.Staff')

  const getChatName = (c: any) => {
    const name = c.name || c.userName || c.clientProfileName || ''
    const isUnknown =
      !name.trim() || name.toLowerCase() === 'unknownuser' || name.toLowerCase() === 'unknown'
    if (isUnknown) {
      return String(lng) === 'ar' ? 'محادثة جديدة' : 'New Conversation'
    }
    return name
  }

  const fetchChats = async (page: number, search: string, append = false) => {
    if (!canLinkChat) return
    setLoadingChats(true)
    loadingChatsRef.current = true
    try {
      const pageSize = 15
      const skipCount = (page - 1) * pageSize
      const res = tenant
        ? await managerChatServiceInstance.getChats(null, skipCount, pageSize, search || undefined)
        : await adminChatServiceInstance.getChats(null, skipCount, pageSize, search || undefined)

      const mapped = (res.items || []).map((c: any) => ({
        id: String(c.id),
        userName: getChatName(c),
        phoneNumber: c.phoneNumber || '',
      }))

      if (append) {
        setLocalChats((prev) => {
          const existingIds = new Set(prev.map((item) => item.id))
          const newItems = mapped.filter((item) => !existingIds.has(item.id))
          const updated = [...prev, ...newItems]
          const hasMore = updated.length < res.totalCount
          setHasMoreChats(hasMore)
          hasMoreChatsRef.current = hasMore
          return updated
        })
      } else {
        setLocalChats((prev) => {
          const initialChatObj = prev.find((x) => String(x.id) === String(initialRelatedEntityId))
          const updated = initialChatObj
            ? [
              initialChatObj,
              ...mapped.filter((item) => String(item.id) !== String(initialRelatedEntityId)),
            ]
            : mapped
          const hasMore = updated.length < res.totalCount
          setHasMoreChats(hasMore)
          hasMoreChatsRef.current = hasMore
          return updated
        })
      }

      setChatPage(page)
      chatPageRef.current = page
    } catch (err) {
      console.error('Failed to fetch chats for task form:', err)
    } finally {
      setLoadingChats(false)
      loadingChatsRef.current = false
    }
  }

  // Handle initialization and fetch specific existing chat details if in edit mode
  useEffect(() => {
    const initChats = async () => {
      if (!canLinkChat) return
      if (initialRelatedEntityId) {
        if (initialChatInfo) {
          setLocalChats([
            {
              id: String(initialRelatedEntityId),
              userName: getChatName(initialChatInfo),
              phoneNumber: initialChatInfo.phoneNumber || '',
            },
          ])
          return
        }

        const existingChat = chatsList?.find((c) => String(c.id) === String(initialRelatedEntityId))
        if (existingChat) {
          setLocalChats([
            {
              id: String(existingChat.id),
              userName: getChatName(existingChat),
              phoneNumber: existingChat.phoneNumber || '',
            },
          ])
          return
        }
        setLoadingChats(true)
        loadingChatsRef.current = true
        try {
          const chatId = Number(initialRelatedEntityId)
          if (!isNaN(chatId)) {
            const chatDetails = tenant
              ? await managerChatServiceInstance.getChat(chatId)
              : await adminChatServiceInstance.getChat(chatId)
            if (chatDetails) {
              const initialChatObj = {
                id: String(chatDetails.id),
                userName: getChatName(chatDetails),
                phoneNumber: chatDetails.phoneNumber || '',
              }
              setLocalChats([initialChatObj])
            }
          }
        } catch (err) {
          console.error('Failed to fetch initial related chat:', err)
        } finally {
          setLoadingChats(false)
          loadingChatsRef.current = false
        }
      }
    }

    initChats()
  }, [canLinkChat, initialRelatedEntityId])

  const handleSearch = (val: string) => {
    setChatSearch(val)
    chatSearchRef.current = val
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      fetchChats(1, val, false)
    }, 500)
  }

  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
      if (hasMoreChatsRef.current && !loadingChatsRef.current) {
        fetchChats(chatPageRef.current + 1, chatSearchRef.current, true)
      }
    }
  }

  const handleDropdownVisibleChange = async (open: boolean) => {
    if (open) {
      setChatsLoaded(true)
      setChatSearch('')
      chatSearchRef.current = ''
      const hasInitial = !!initialRelatedEntityId
      await fetchChats(1, '', hasInitial)
    } else {
      setChatSearch('')
      chatSearchRef.current = ''
    }
  }

  const handleSubmit = async () => {
    if (!title.trim() || !desc.trim() || loading || isSubmitDisabled) return
    setLoading(true)
    try {
      const selectedChat = localChats.find((c) => String(c.id) === String(relatedEntityId))
      await onAdd(
        title.trim(),
        desc.trim(),
        assignedUserId,
        relatedEntityId,
        relatedEntityId ? EntityType.Chat : null,
        status,
        selectedChat
          ? {
            id: selectedChat.id,
            name: selectedChat.userName,
            userName: selectedChat.userName,
            clientProfileName: selectedChat.userName,
            phoneNumber: selectedChat.phoneNumber,
          }
          : null
      )
      setTitle('')
      setDesc('')
      setRelatedEntityId(null)
      setAssignedUserId(initialAssignedUserId)
      setStatus('pending')
    } catch (error) {
      console.error('Failed to submit task form:', error)
    } finally {
      setLoading(false)
    }
  }

  const statusOptions = [
    {
      value: 'pending',
      label: t('TaskStatusPending') || 'Pending',
      icon: <Clock3 size={14} className="text-amber-500" />,
    },
    {
      value: 'inprogress',
      label: t('TaskStatusInProgress') || 'In Progress',
      icon: <Loader2 size={14} className="text-blue-500" />,
    },
    {
      value: 'completed',
      label: t('TaskStatusCompleted') || 'Completed',
      icon: <CheckCircle2 size={14} className="text-emerald-500" />,
    },
  ]

  return (
    <div
      className={
        withContainer
          ? 'bg-white rounded-xl border border-slate-100 p-5 shadow-lg max-w-full overflow-hidden'
          : 'p-0 max-w-full overflow-hidden'
      }
    >
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {initialTitle ? <PencilLine size={18} /> : <SquarePlus size={18} />}
        </div>
        <div>
          <Typography.Title
            level={5}
            className="!text-base !font-bold !text-slate-800 !m-0 !leading-tight"
          >
            {formTitle ||
              (initialTitle
                ? t('EditTask') || 'Edit Task'
                : t('TasksManagement.Tasks.Create') || 'Add New Task')}
          </Typography.Title>
          <Typography.Text className="!text-xs !text-slate-400 !m-0 !mt-1 block">
            {initialTitle
              ? t('UpdateDetails') || 'Update task details'
              : t('FillDetails') || 'Fill in the details below'}
          </Typography.Text>
        </div>
      </div>

      <Form layout="vertical" onFinish={handleSubmit} className="flex flex-col gap-2.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Form.Item
            label={t('TaskTitle') || 'Title'}
            className="!mb-0 md:col-span-2"
            required
            rules={[new Rules().getMandatoryRule()]}
          >
            <Input
              autoFocus
              placeholder={t('TaskTitlePlaceholder') || 'What needs to be done?'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              size="large"
              disabled={loading || disabled}
              data-tour="task-add-title"
            />
          </Form.Item>

          {!hideStatus && (
            <Form.Item label={t('Status') || 'Status'} className="!mb-0">
              <Select
                value={status}
                onChange={setStatus}
                size="large"
                disabled={loading || disabled}
                data-tour="task-add-status"
                options={statusOptions.map((opt) => ({
                  value: opt.value,
                  label: (
                    <div className="flex items-center gap-2">
                      {opt.icon}
                      <span>{opt.label}</span>
                    </div>
                  ),
                }))}
              />
            </Form.Item>
          )}

          <Form.Item
            label={t('AssignedToAStaffMember') || 'Assigned to'}
            className={`!mb-0 ${hideStatus ? 'md:col-span-2' : ''}`}
          >
            {(() => {
              const u =
                usersList.find((user) => user.id === assignedUserId) ||
                (currentUser && currentUser.id === assignedUserId ? currentUser : null)
              const nameStr = u
                ? `${u.name} ${u.surName || ''}`.trim()
                : t
                  ? t('Unassigned') || 'Unassigned'
                  : 'Unassigned'
              const initial = u ? u.name.charAt(0).toUpperCase() : '?'
              return (
                <div
                  className="flex items-center gap-2.5 px-3 h-10 bg-slate-50 border border-slate-100 rounded-lg"
                  data-tour="task-add-assigned"
                >
                  {u ? (
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-emerald-700 text-white grid place-items-center text-[10px] font-bold shrink-0">
                      <span className="leading-none">{initial}</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-400 grid place-items-center text-[10px] font-bold shrink-0">
                      <span className="leading-none">?</span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-700 truncate">{nameStr}</span>
                </div>
              )
            })()}
          </Form.Item>
        </div>

        <Form.Item
          label={t('Description') || 'Description'}
          className="!mb-0"
          required
          rules={[new Rules().getMandatoryRule()]}
        >
          <div data-tour="task-add-desc" className="w-full">
            <Input.TextArea
              placeholder={t('TaskDescriptionPlaceholder') || 'Add some details...'}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              maxLength={200}
              autoSize={{ minRows: 2, maxRows: 4 }}
              disabled={loading || disabled}
              className="mt-1"
            />
          </div>
        </Form.Item>
        {/* Chat link – only if user has chat access */}
        {canLinkChat && (
          <Form.Item label={t('SelectConversation') || 'Related Conversation'} className="!mb-0">
            <Select
              showSearch
              allowClear
              size="large"
              className="w-full"
              data-tour="task-add-chat"
              listHeight={250}
              virtual={false}
              getPopupContainer={(trigger) => trigger.parentElement}
              placeholder={t('SearchByNameOrPhoneNumber') || 'Search and select a chat...'}
              value={relatedEntityId}
              onChange={(val) => setRelatedEntityId(val ?? null)}
              labelRender={(props) => {
                const chat = localChats.find((c) => String(c.id) === String(props.value))
                return chat
                  ? chat.userName || (String(lng) === 'ar' ? 'محادثة جديدة' : 'New Conversation')
                  : props.label
              }}
              onSearch={handleSearch}
              onPopupScroll={handlePopupScroll}
              onDropdownVisibleChange={handleDropdownVisibleChange}
              filterOption={false}
              notFoundContent={
                loadingChats ? (
                  <div className="p-2 text-center">
                    <Spin size="small" />
                  </div>
                ) : null
              }
              options={localChats.map((c) => ({
                value: String(c.id),
                label: `${c.userName || 'محادثة جديدة'} · \u200E${c.phoneNumber}\u200E`,
              }))}
              disabled={loading || disabled}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  {loadingChats && localChats.length > 0 && (
                    <div className="p-2 text-center border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400 text-xs">
                      <Spin size="small" />
                      <span>{t('Loading') || 'Loading...'}</span>
                    </div>
                  )}
                </>
              )}
              optionRender={(option) => {
                const chat = localChats.find((c) => String(c.id) === option.value)
                if (!chat) return option.label
                const initial = chat.userName ? chat.userName.charAt(0).toUpperCase() : 'م'
                return (
                  <div className="flex items-center gap-2 py-0.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {initial}
                    </div>
                    <div className="flex flex-col min-w-0 align-start text-start items-start">
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {chat.userName || 'محادثة جديدة'}
                      </span>
                      <span
                        className="text-[10px] text-slate-400 [direction:ltr] text-start"
                        dir="ltr"
                      >
                        {chat.phoneNumber}
                      </span>
                    </div>
                  </div>
                )
              }}
            />
          </Form.Item>
        )}

        <div className="flex gap-2 justify-end mt-2 pt-2 border-t border-slate-50">
          <Button
            className="px-4 h-9 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer bg-transparent"
            onClick={onCancel}
            disabled={loading || disabled}
          >
            {t('Cancel') || 'Cancel'}
          </Button>
          <Button
            type="primary"
            className={`px-6 h-9 rounded-lg text-sm font-semibold transition-all border-none shadow-sm ${title.trim() && desc.trim() && !loading && !isSubmitDisabled && !disabled
                ? 'bg-primary text-white hover:bg-primary/90 cursor-pointer'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            onClick={handleSubmit}
            disabled={!title.trim() || !desc.trim() || loading || isSubmitDisabled || disabled}
            loading={loading}
            data-tour="task-add-submit"
          >
            {submitLabel || t('Add') || 'Add'}
          </Button>
        </div>
      </Form>
    </div>
  )
}
