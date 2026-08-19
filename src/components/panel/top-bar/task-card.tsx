'use client'
import { useState } from 'react'

import { defaultDateTimeFormat } from '@/lib/constants'
import { useAppContext } from '@/lib/context'
import { renderDateTime, renderDateTimeFromNow } from '@/lib/helpers'
import { Avatar, Button, Dropdown, Tooltip, Typography } from 'antd'
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  ExternalLink,
  Loader2,
  MessageSquare,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { STATUS_CONFIG, Task, TaskStatus } from './task-types'

interface TaskCardProps {
  task: Task
  getStatusLabel: (s: TaskStatus) => string
  onStatusChange: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  compact?: boolean
  t?: any
  usersList?: { id: string; name: string; surName?: string }[]
  chatsList?: { id: string; userName: string; phoneNumber: string }[]
  grantedPolicies?: string[]
  onCloseDrawer?: () => void
  disabled?: boolean
}

export default function TaskCard({
  task,
  getStatusLabel,
  onStatusChange,
  onDelete,
  onEdit,
  compact = false,
  t,
  usersList = [],
  chatsList = [],
  grantedPolicies = [],
  onCloseDrawer,
  disabled = false,
}: TaskCardProps) {
  const { lng } = useParams()
  const router = useRouter()
  const { currentUser } = useAppContext()

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

  const p = compact ? 'p-3' : 'p-4'
  const titleSize = compact ? 'text-xs' : 'text-sm'
  const descSize = compact ? 'text-[10px]' : 'text-[11px]'

  const allStatuses: { value: TaskStatus; icon: any; color: string }[] = [
    { value: 'pending', icon: <Clock3 size={12} />, color: 'text-amber-500' },
    {
      value: 'inprogress',
      icon: <Loader2 size={12} className="animate-spin-slow" />,
      color: 'text-blue-500',
    },
    { value: 'completed', icon: <CheckCircle2 size={12} />, color: 'text-emerald-500' },
  ]

  const statusOptions = allStatuses
    .filter((s) => s.value !== task.status)
    .map((s) => ({
      value: s.value,
      label: getStatusLabel(s.value as TaskStatus),
      icon: s.icon,
      color: s.color,
    }))

  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`bg-white rounded-xl border border-slate-100 ${p} shadow-sm transition-all hover:shadow-md hover:border-slate-200 group relative ${disabled ? 'opacity-70 pointer-events-none' : ''}`}
    >
      {/* Header: title + actions */}
      <div className="flex justify-between items-start gap-2 mb-1.5">
        <div className="flex flex-col gap-1 flex-1">
          <h4 className={`font-semibold text-slate-800 ${titleSize} m-0 leading-snug`}>
            {task.title}
          </h4>
        </div>
        <div className="flex items-center shrink-0">
          {/* Status dropdown — only if user can update */}
          {grantedPolicies.includes('TasksManagement.Tasks.Update') ||
          grantedPolicies.includes('TasksManagement.TasksForHost.Update') ? (
            <Dropdown
              data-tour="task-status-select"
              menu={{
                items: statusOptions.map((opt) => ({
                  key: opt.value,
                  label: (
                    <div className={`flex items-center gap-2 py-1 px-1 font-medium text-slate-600`}>
                      {opt.icon && <span className={opt.color || ''}>{opt.icon}</span>}
                      <span className="text-xs">{opt.label}</span>
                    </div>
                  ),
                  onClick: () => onStatusChange(task.id, opt.value as TaskStatus),
                })),
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              {(() => {
                const label = getStatusLabel(task.status)
                const config = STATUS_CONFIG[task.status]
                return (
                  <div
                    className={`text-[11px] font-semibold tracking-wide uppercase px-2 py-1 rounded-[4px] flex items-center gap-1.5 transition-all hover:opacity-80 cursor-pointer ${config.className}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    <span>{label}</span>
                    <ChevronDown size={12} className="opacity-50 ml-0.5" />
                  </div>
                )
              })()}
            </Dropdown>
          ) : (
            /* Read-only status pill */
            (() => {
              const label = getStatusLabel(task.status)
              const config = STATUS_CONFIG[task.status]
              return (
                <div
                  className={`text-[11px] font-semibold tracking-wide uppercase px-2 py-1 rounded-[4px] flex items-center gap-1.5 ${config.className}`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  <span>{label}</span>
                </div>
              )
            })()
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <Typography.Paragraph
          type="secondary"
          className={`${descSize} m-0 leading-relaxed`}
          ellipsis={{
            rows: 2,
            expandable: 'collapsible',
            symbol: expanded
              ? t
                ? t('ViewLess') || 'View Less'
                : 'View Less'
              : t
                ? t('ViewMore') || 'View More'
                : 'View More',
            onExpand: (_, info) => setExpanded(info.expanded),
          }}
        >
          {task.description}
        </Typography.Paragraph>
      )}

      {/* Related Conversation Section */}
      {task.relatedEntityId ? (
        (() => {
          const chat =
            task.chatInfo || chatsList.find((c) => String(c.id) === String(task.relatedEntityId))
          const chatName = chat
            ? getChatName(chat)
            : t
              ? t('GoToConversation') || 'Go to Conversation'
              : 'Go to Conversation'
          return (
            <div className="mt-2.5 flex items-center justify-start rtl:justify-end">
              {canGoToChat ? (
                <Tooltip
                  title={t ? t('GoToConversation') || 'Go to Conversation' : 'Go to Conversation'}
                >
                  <Button
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/${lng}/admin/conversations/clients/${task.relatedEntityId}`)
                      if (onCloseDrawer) {
                        onCloseDrawer()
                      }
                    }}
                    className="!inline-flex !items-center !gap-1.5 !px-2 !py-1 !rounded-[4px] !bg-slate-50 hover:!bg-slate-100 !border !border-slate-200/60 !text-[10px] !font-semibold !text-slate-600 hover:!text-slate-800 !transition-all !cursor-pointer !select-none !min-w-0 !max-w-full !h-auto"
                    data-tour="task-go-convo-btn"
                  >
                    <MessageSquare size={10} className="shrink-0" />
                    <span className="truncate">{chatName}</span>
                    <ExternalLink size={9} className="opacity-70 shrink-0" />
                  </Button>
                </Tooltip>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-[4px] bg-slate-50 border border-slate-100 text-[10px] font-semibold text-slate-500 min-w-0 max-w-full">
                  <MessageSquare size={10} className="shrink-0 opacity-70" />
                  <span className="truncate">{chatName}</span>
                </div>
              )}
            </div>
          )
        })()
      ) : (
        /* Empty placeholder div of the same height to keep card heights consistent */
        <div className="mt-2.5 h-[26px]" />
      )}

      {/* Separator */}
      <div className="h-px bg-slate-100 my-3" />

      {/* Footer: Avatar + Actions */}
      <div className="flex items-center justify-between mt-auto">
        {/* User Info */}
        <div className="flex items-center gap-2.5 group cursor-pointer min-w-0">
          {(() => {
            const u =
              usersList.find((user) => user.id === task.assignedUserId) ||
              (currentUser && currentUser.id === task.assignedUserId ? currentUser : null)
            const nameStr = u
              ? `${u.name} ${u.surName || ''}`.trim()
              : t
                ? t('Unassigned') || 'Unassigned'
                : 'Unassigned'
            const initial = u ? u.name.charAt(0).toUpperCase() : '?'

            return (
              <>
                {u ? (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-emerald-700 text-white grid place-items-center text-[10px] font-bold shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <span className="leading-none">{initial}</span>
                  </div>
                ) : (
                  <Avatar
                    size={24}
                    src="https://i.pravatar.cc/150?u=unassigned"
                    className="border-[1.5px] border-white shadow-sm transition-transform group-hover:scale-105"
                  />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-semibold text-slate-700 truncate leading-tight">
                    {nameStr}
                  </span>
                  {task.creationTime && (
                    <Tooltip title={renderDateTimeFromNow(task.creationTime)}>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 leading-none mt-1 whitespace-nowrap hover:text-slate-500 transition-colors">
                        <Clock3 size={10} />
                        {renderDateTime(task.creationTime, defaultDateTimeFormat)}
                      </span>
                    </Tooltip>
                  )}
                </div>
              </>
            )
          })()}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5" data-tour="task-edit-delete-btns">
          {(grantedPolicies.includes('TasksManagement.Tasks.Update') ||
            grantedPolicies.includes('TasksManagement.TasksForHost.Update')) && (
            <Tooltip title={t ? t('Edit') || 'Edit' : 'Edit'}>
              <Button
                type="text"
                color="primary"
                variant="text"
                onClick={() => onEdit(task)}
                className="w-7 h-7 rounded-md transition-colors cursor-pointer flex items-center justify-center p-0 m-0 border-none"
                icon={<Pencil size={14} />}
                data-tour="task-edit-btn"
              />
            </Tooltip>
          )}
          {(grantedPolicies.includes('TasksManagement.Tasks.Delete') ||
            grantedPolicies.includes('TasksManagement.TasksForHost.Delete')) && (
            <Tooltip title={t ? t('Delete') || 'Delete' : 'Delete'}>
              <Button
                type="text"
                danger
                variant="text"
                onClick={() => onDelete(task.id)}
                className="w-7 h-7 rounded-md transition-colors cursor-pointer border-none flex items-center justify-center p-0 m-0"
                icon={<Trash2 size={14} />}
                data-tour="task-delete-btn"
              />
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
