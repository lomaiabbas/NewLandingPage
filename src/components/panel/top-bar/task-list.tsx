'use client'

import { getClientTranslation } from '@/app/i18n/client'
import { useAppContext } from '@/lib/context'
import { popupConfirm } from '@/lib/popup-confirm'
import tasksServiceInstance from '@/lib/services/tasks'
import { TaskItemStatus, EntityType } from '@/lib/services/types'
import { App, Button, Drawer, Modal, Spin, Tour, Typography } from 'antd'
import { TourProps } from 'antd/lib'
import { CheckCircle2, ListTodo, Plus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import TaskAddForm from './task-add-form'
import TaskCard from './task-card'
import { Task, TaskStatus } from './task-types'
import styles from './top-bar.module.css'

export default function TaskList({ lng }: { lng: string }) {
  const { t } = getClientTranslation(lng)
  const {
    currentUser,
    grantedPolicies,
    tenant,
    WhatsAppBusinessAccount,
    setWhatsAppBusinessAccount,
    tasksCount,
    setTasksCount,
    systemTourSettings,
    dismissTour,
    tasksFilterChat,
    setTasksFilterChat,
  } = useAppContext()
  const router = useRouter()
  const { message } = App.useApp()

  const [openDrawer, setOpenDrawer] = useState(false)
  const [startTour, setStartTour] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [chats, setChats] = useState<{ id: string; userName: string; phoneNumber: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [onlyActiveTasks] = useState(true)
  const PAGE_SIZE = 4
  const dummyTaskId = 'dummy-task-tour-id'

  const addDummyTaskIfNeeded = () => {
    if (tasks.length === 0) {
      const dummy: Task = {
        id: dummyTaskId,
        title: t('TaskSampleTitle1') || 'Review pending requests',
        description: t('TaskSampleDesc1') || 'Check all application requests in the queue.',
        status: 'pending',
        assignedUserId: currentUser?.id || null,
        relatedEntityId: 'dummy-convo-id',
        creationTime: new Date().toISOString(),
        chatInfo: { id: 'dummy-convo-id', name: t('Conversations') || 'Conversations' } as any,
      }
      setTasks([dummy])
      setTotalCount(1)
    }
  }

  const removeDummyTask = () => {
    setTasks((prev) => {
      const filtered = prev.filter((tk) => tk.id !== dummyTaskId)
      if (filtered.length === 0) {
        setTotalCount(0)
      }
      return filtered
    })
  }

  const endTour = () => {
    dismissTour()
    setStartTour(false)
    removeDummyTask()
  }

  const canLinkChat =
    grantedPolicies?.includes('ChatsManagementForHost.Staff') ||
    grantedPolicies?.includes('ChatsManagementForHost.Clients') ||
    grantedPolicies?.includes('ChatsManagement.Clients') ||
    grantedPolicies?.includes('ChatsManagement.Staff')

  const formSteps: TourProps['steps'] = [
    {
      title: t('TaskTitle') || 'Title',
      description: t('TaskTitlePlaceholder') || 'What needs to be done?',
      target: () => document.querySelector('[data-tour="task-add-title"]')! as HTMLElement,
      nextButtonProps: { children: t('Continue') || 'Continue' },
    },
    {
      title: t('Status') || 'Status',
      description: t('Status') || 'Select the initial task status',
      target: () => document.querySelector('[data-tour="task-add-status"]')! as HTMLElement,
      nextButtonProps: { children: t('Continue') || 'Continue' },
    },
    {
      title: t('AssignedToAStaffMember') || 'Assigned to',
      description: t('AssignedToAStaffMember') || 'The team member assigned to the task',
      target: () => document.querySelector('[data-tour="task-add-assigned"]')! as HTMLElement,
      nextButtonProps: { children: t('Continue') || 'Continue' },
    },
    {
      title: t('Description') || 'Description',
      description: t('TaskDescriptionPlaceholder') || 'Add some details...',
      target: () =>
        (document.querySelector('[data-tour="task-add-desc"] textarea') ||
          document.querySelector('[data-tour="task-add-desc"]')) as HTMLElement,
      nextButtonProps: { children: t('Continue') || 'Continue' },
    },
    ...(canLinkChat
      ? [
        {
          title: t('SelectConversation') || 'Related Conversation',
          description: t('SearchByNameOrPhoneNumber') || 'Link this task to a chat if needed',
          target: () => document.querySelector('[data-tour="task-add-chat"]')! as HTMLElement,
          nextButtonProps: { children: t('Next') || 'Next' },
        },
      ]
      : []),
    {
      title: t('TasksManagement.Tasks.Create') || 'Create Task',
      description: t('AddTaskPrompt') || 'Click Add to save your task',
      target: () => document.querySelector('[data-tour="task-add-submit"]')! as HTMLElement,
      nextButtonProps: {
        children: t('Continue') || 'Continue',
        onClick: () => {
          handleAdd(
            t('TaskSampleTitle1') || 'Review pending requests',
            t('TaskSampleDesc1') || 'Check all application requests in the queue.',
            currentUser?.id || null,
            null,
            null,
            'pending'
          )
          setShowAddForm(false)
          setTimeout(() => {
            handleStepChange(currentStep + 1)
          }, 300)
        },
      },
    },
  ]

  const steps: TourProps['steps'] = [
    // Step 0: Open drawer
    {
      title: t('TasksManagement.TasksForHost') || 'Tasks',
      description: t('TourStep1Desc') || 'Manage and track your tasks directly from this menu. Click here to open your task list drawer.',
      target: () => document.getElementById('task-list-trigger')! as HTMLElement,
      nextButtonProps: {
        children: t('Continue') || 'Continue',
        onClick: () => {
          openDrawerFn()
          setTimeout(() => {
            handleStepChange(1)
          }, 300)
        },
      },
    },
    // Step 1: Add task button
    {
      title: t('TasksManagement.Tasks.Create') || 'Add new task',
      description: t('TourStep2Desc') || 'Click here to quickly create a new task. You can assign it, set its status, and add descriptions.',
      target: () => document.getElementById('task-add-button')! as HTMLElement,
      nextButtonProps: {
        children: t('Continue') || 'Continue',
        onClick: () => {
          addDummyTaskIfNeeded()
          setTimeout(() => {
            handleStepChange(2)
          }, 200)
        },
      },
    },
    // Step 2: Edit + Delete task (combined)
    {
      title: `${t('TasksManagement.Tasks.Update') || 'Edit'} | ${t('TasksManagement.Tasks.Delete') || 'Delete'}`,
      description: t('TourStep4Desc') || 'Click the edit icon to update task details, or the delete icon to remove it.',
      target: () => document.querySelector('[data-tour="task-edit-delete-btns"]')! as HTMLElement,
      nextButtonProps: { children: t('Continue') || 'Continue' },
    },
    // Step 3: View all tasks
    {
      title: t('ViewAllTasks') || 'View All Tasks',
      description: t('TourStep5Desc') || 'Click here to view the full Kanban Board where you can manage all tasks in one place.',
      target: () => document.getElementById('task-all-tasks-footer')! as HTMLElement,
      nextButtonProps: {
        children: t('Continue') || 'Continue',
        onClick: () => {
          localStorage.setItem('tasksTourState', 'all-tasks-board')
          router.push(`/${lng}/admin/all-tasks`)
          closeDrawerFn()
          setStartTour(false)
          removeDummyTask()
        },
      },
    },
  ]

  const handleStepChange = (nextStep: number) => {
    if (nextStep === 1) {
      if (!openDrawer) openDrawerFn()
      setShowAddForm(false)
      setTimeout(() => {
        setCurrentStep(1)
        setTimeout(() => {
          const el = document.getElementById('task-add-button')
          if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' })
        }, 100)
      }, 300)
      return
    }

    if (nextStep === 0) {
      setOpenDrawer(false)
      setCurrentStep(0)
      return
    }

    // Step 2 is the edit+delete step — ensure a dummy task is visible
    if (nextStep === 2) {
      addDummyTaskIfNeeded()
    }

    setCurrentStep(nextStep)

    // Scroll and focus the target element of the new step
    setTimeout(() => {
      const step = steps[nextStep]
      if (step && step.target) {
        const el = typeof step.target === 'function' ? (step.target as any)() : step.target
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'center' })
        }
      }
    }, 100)
  }



  const mapApiStatusToUI = (status: TaskItemStatus): TaskStatus => {
    if (status === TaskItemStatus.Doing) return 'inprogress'
    if (status === TaskItemStatus.Done) return 'completed'
    return 'pending'
  }

  const mapUIStatusToApi = (status: TaskStatus): TaskItemStatus => {
    if (status === 'inprogress') return TaskItemStatus.Doing
    if (status === 'completed') return TaskItemStatus.Done
    return TaskItemStatus.ToDo
  }

  const fetchTasks = async (reset = false) => {
    if (loading) return
    if (!reset && !hasMore) return
    try {
      setLoading(true)
      const currentSkip = reset ? 0 : tasks.length
      const response = await tasksServiceInstance.getAll(
        {
          maxResultCount: PAGE_SIZE,
          skipCount: currentSkip,
          onlyActiveTasks: onlyActiveTasks,
          relatedEntityId: tasksFilterChat ? String(tasksFilterChat.id) : undefined,
          relatedEntityType: tasksFilterChat ? EntityType.Chat : undefined,
        },
        !!tenant
      )
      const mappedTasks: Task[] = response.items.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        status: mapApiStatusToUI(t.status),
        assignedUserId: t.assignedUserId || null,
        relatedEntityId: t.relatedEntityId || null,
        relatedEntityType: t.relatedEntityType || null,
        creationTime: t.creationTime,
        chatInfo: (t as any).chatInfo || null,
      }))

      if (reset) {
        setTasks(mappedTasks)
        setHasMore(mappedTasks.length < response.totalCount)
      } else {
        setTasks((prev) => {
          const combined = [...prev, ...mappedTasks]
          const unique = combined.filter(
            (tk, index, self) => self.findIndex((t) => t.id === tk.id) === index
          )
          setHasMore(unique.length < response.totalCount)
          return unique
        })
      }
      setTotalCount(response.totalCount)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      fetchTasks(false)
    }
  }

  useEffect(() => {
    if (openDrawer) {
      fetchTasks(true)
    }
  }, [onlyActiveTasks, openDrawer, tasksFilterChat])

  // Automatically open drawer when tasksFilterChat context state is set
  useEffect(() => {
    if (tasksFilterChat) {
      setOpenDrawer(true)
    }
  }, [tasksFilterChat])

  // Auto-start the tour when shouldShowTour is true from the API context
  useEffect(() => {
    if (systemTourSettings?.shouldShowTour) {
      setStartTour(true)
    }
  }, [systemTourSettings])

  // Automatically load more tasks if they don't fill the container enough to show a scrollbar
  useEffect(() => {
    if (openDrawer && !loading && hasMore && tasks.length > 0) {
      const container = document.getElementById('taskListScrollableDiv')
      if (container) {
        const hasScrollbar = container.scrollHeight > container.clientHeight
        if (!hasScrollbar) {
          fetchTasks(false)
        }
      }
    }
  }, [tasks, loading, hasMore, openDrawer])

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    if (id === dummyTaskId) {
      setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, status } : tk)))
      message.success(t('StatusUpdatedSuccessfully'))
      return
    }
    try {
      const prevTask = tasks.find((tk) => tk.id === id)
      await tasksServiceInstance.changeStatus(id, mapUIStatusToApi(status), !!tenant)
      setTasks((prev) => prev.map((tk) => (tk.id === id ? { ...tk, status } : tk)))
      message.success(t('StatusUpdatedSuccessfully'))
      // Adjust badge count: completing a task decreases active, un-completing increases
      if (status === 'completed' && prevTask?.status !== 'completed') {
        setTasksCount((prev: number) => Math.max(0, prev - 1))
      } else if (status !== 'completed' && prevTask?.status === 'completed') {
        setTasksCount((prev: number) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      message.error(t('FailedToUpdateStatus'))
    }
  }

  const handleDelete = async (id: string) => {
    if (id === dummyTaskId) {
      setTasks((prev) => {
        const filtered = prev.filter((tk) => tk.id !== id)
        if (filtered.length === 0) setTotalCount(0)
        return filtered
      })
      message.success(t('TaskDeletedSuccessfully'))
      return
    }
    popupConfirm(
      async () => {
        try {
          await tasksServiceInstance.delete(id, !!tenant)
          setTasks((prev) => prev.filter((tk) => tk.id !== id))
          message.success(t('TaskDeletedSuccessfully'))
          setTasksCount((prev: number) => Math.max(0, prev - 1))
        } catch (error) {
          console.error('Failed to delete task:', error)
          message.error(t('FailedToDeleteTask'))
        }
      },
      t('ConfirmDeleteTask'),
      t('TasksManagement.Tasks.Delete') || 'Delete task'
    )
  }

  const handleAdd = async (
    title: string,
    description: string,
    assignedUserId: string | null,
    relatedEntityId: string | null,
    relatedEntityType: any | null,
    status: TaskStatus,
    chatInfo?: any
  ) => {
    if (startTour) {
      const dummy: Task = {
        id: dummyTaskId,
        title,
        description,
        status,
        assignedUserId: assignedUserId || currentUser?.id || null,
        relatedEntityId: relatedEntityId || 'dummy-convo-id',
        creationTime: new Date().toISOString(),
        chatInfo: null,
      }
      setTasks((prev) => [dummy, ...prev.filter((t) => t.id !== dummyTaskId)])
      setTotalCount((prev) => {
        const hasDummy = tasks.some((t) => t.id === dummyTaskId)
        return hasDummy ? prev : prev + 1
      })
      setShowAddForm(false)
      message.success(t('TaskAddedSuccessfully'))

      // Move to the edit+delete step (step 2)
      setTimeout(() => {
        handleStepChange(2)
      }, 300)
      return
    }

    try {
      const newTask = await tasksServiceInstance.create(
        {
          title,
          description,
          assignedUserId: assignedUserId || null,
          relatedEntityId: relatedEntityId || null,
          relatedEntityType: relatedEntityType,
          status: mapUIStatusToApi(status),
        },
        !!tenant
      )

      setTasks((prev) => {
        const filtered = prev.filter((t) => t.id !== dummyTaskId)
        return [
          {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            status: mapApiStatusToUI(newTask.status),
            assignedUserId: assignedUserId || null,
            relatedEntityId: relatedEntityId || null,
            creationTime: newTask.creationTime,
            chatInfo: (newTask as any).chatInfo || chatInfo || null,
          },
          ...filtered,
        ]
      })
      setShowAddForm(false)
      message.success(t('TaskAddedSuccessfully'))
      setTasksCount((prev: number) => prev + 1)
    } catch (error) {
      console.error('Failed to create task:', error)
      message.error(t('FailedToAddTask'))
      throw error
    }
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowEditModal(true)
  }

  const handleUpdate = async (
    title: string,
    description: string,
    assignedUserId: string | null,
    relatedEntityId: string | null,
    relatedEntityType: any | null,
    status: TaskStatus,
    chatInfo?: any
  ) => {
    if (!editingTask) return
    if (editingTask.id === dummyTaskId) {
      setTasks((prev) =>
        prev.map((tk) =>
          tk.id === dummyTaskId
            ? {
              ...tk,
              title,
              description,
              assignedUserId,
              relatedEntityId,
              relatedEntityType,
              status,
            }
            : tk
        )
      )
      setShowEditModal(false)
      setEditingTask(null)
      message.success(t('TaskUpdatedSuccessfully'))
      return
    }
    try {
      await tasksServiceInstance.update(
        editingTask.id,
        {
          title,
          description,
          assignedUserId: assignedUserId || null,
          relatedEntityId: relatedEntityId || null,
          relatedEntityType: relatedEntityType,
          status: mapUIStatusToApi(status),
        },
        !!tenant
      )

      setTasks((prev) =>
        prev.map((tk) =>
          tk.id === editingTask.id
            ? {
              ...tk,
              title,
              description,
              assignedUserId,
              relatedEntityId,
              relatedEntityType,
              status,
              chatInfo: chatInfo || tk.chatInfo || null,
            }
            : tk
        )
      )
      setShowEditModal(false)
      setEditingTask(null)
      message.success(t('TaskUpdatedSuccessfully'))
      if (status === 'completed' && editingTask.status !== 'completed') {
        setTasksCount((prev: number) => Math.max(0, prev - 1))
      } else if (status !== 'completed' && editingTask.status === 'completed') {
        setTasksCount((prev: number) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to update task:', error)
      message.error(t('FailedToUpdateStatus'))
      throw error
    }
  }

  const activeTasks = tasks

  const getStatusLabel = (status: TaskStatus) => {
    if (status === 'pending') return t('TaskStatusPending') || 'Pending'
    if (status === 'inprogress') return t('TaskStatusInProgress') || 'In Progress'
    return t('TaskStatusCompleted') || 'Completed'
  }

  const openDrawerFn = (isManual: any = false) => {
    setOpenDrawer(true)
    const manual =
      isManual === true || (isManual && typeof isManual === 'object' && 'target' in isManual)
    if (manual && startTour && currentStep === 0) {
      setTimeout(() => {
        handleStepChange(1)
      }, 300)
    }
  }
  const closeDrawerFn = () => {
    setOpenDrawer(false)
    setShowAddForm(false)
    setTasksFilterChat(undefined)
    if (startTour) {
      dismissTour()
      setStartTour(false)
      removeDummyTask()
    }
  }

  /* ── Render ──────────────────────────────────────────────────────────────── */
  return (
    <>
      <li className="flex items-center justify-center">
        <div
          id="task-list-trigger"
          onClick={openDrawerFn}
          className="flex items-center justify-center relative w-9 h-9 rounded-[5px] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 border border-[#07c6927d] text-primary bg-white/80 backdrop-blur-[4px] shadow-[0_4px_15px_rgba(59,130,246,0.25),inset_0_0_8px_rgba(59,130,246,0.1)] hover:shadow-lg"
        >
          <ListTodo size={18} />
          {tasksCount && tasksCount > 0 ? (
            <span className={styles.badge}>
              {tasksCount > 99 ? '99+' : tasksCount}
            </span>
          ) : null}
        </div>
      </li>

      {/* Drawer — 50vw */}
      <Drawer
        open={openDrawer}
        onClose={closeDrawerFn}
        placement={lng === 'ar' ? 'left' : 'right'}
        width="50vw"
        maskClosable={false}
        closeIcon={null}
        classNames={{
          body: '!p-0 bg-[#f8fafc] flex flex-col h-full overflow-hidden',
          header: '!p-0 !border-none',
        }}
        title={
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
            <div
              id="task-all-tasks-link"
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <ListTodo size={18} className="text-primary" />
              </div>
              <div>
                <Typography.Text className="mb-1 !text-primary !font-bold !leading-tight block">
                  {t('TaskManager') || 'Task Manager'}
                </Typography.Text>
                {tasksFilterChat && (
                  <Typography.Text className="!text-xs !text-slate-500 !leading-none block">
                    {tasksFilterChat.userName || tasksFilterChat.clientProfileName}
                  </Typography.Text>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Close */}
              <Button
                type="text"
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer border-none bg-transparent p-0"
                onClick={closeDrawerFn}
                icon={<X size={17} />}
              />
            </div>
          </div>
        }
      >
        <Modal
          title={t('EditTask') || 'Edit Task'}
          open={showEditModal}
          onCancel={() => {
            setShowEditModal(false)
            setEditingTask(null)
          }}
          footer={null}
          centered
          destroyOnClose
          width={450}
        >
          <div className="pt-2">
            {editingTask && (
              <TaskAddForm
                t={t}
                initialTitle={editingTask.title}
                initialDescription={editingTask.description}
                initialStatus={editingTask.status}
                initialAssignedUserId={editingTask.assignedUserId}
                initialRelatedEntityId={editingTask.relatedEntityId}
                initialChatInfo={editingTask.chatInfo}
                submitLabel={startTour ? t('Continue') : t('Save') || 'Save'}
                formTitle={t('UpdateTaskInfo') || 'Update Task Info'}
                onAdd={handleUpdate}
                onCancel={() => {
                  setShowEditModal(false)
                  setEditingTask(null)
                }}
                usersList={users}
                chatsList={chats}
                grantedPolicies={grantedPolicies ?? []}
                disabled={startTour}
              />
            )}
          </div>
        </Modal>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Fixed Add Section at the top */}
          {(startTour ||
            grantedPolicies?.includes('TasksManagement.TasksForHost.Create') ||
            grantedPolicies?.includes('TasksManagement.Tasks.Create')) && (
              <div className="p-4 bg-white border-b border-slate-100 flex-shrink-0">
                {!showAddForm ? (
                  <div
                    id="task-add-button"
                    onClick={() => {
                      if (startTour) return
                      setShowAddForm(true)
                      if (startTour && currentStep === 1) {
                        setTimeout(() => {
                          handleStepChange(2)
                        }, 150)
                      }
                    }}
                    className={`flex items-center gap-3 bg-white border border-dashed border-slate-200 ${startTour
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-primary hover:bg-primary/5 cursor-pointer'
                      } text-slate-400 p-3 rounded-xl transition-all shadow-sm group`}
                  >
                    <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-primary transition-colors">
                      <Plus size={14} />
                    </div>
                    <span className="text-sm font-medium">
                      {t('TasksManagement.Tasks.Create') || 'Add a new task...'}
                    </span>
                  </div>
                ) : (
                  <TaskAddForm
                    t={t}
                    onAdd={handleAdd}
                    onCancel={() => setShowAddForm(false)}
                    withContainer
                    usersList={users}
                    chatsList={chats}
                    grantedPolicies={grantedPolicies ?? []}
                    initialAssignedUserId={currentUser?.id}
                    initialRelatedEntityId={tasksFilterChat?.id}
                    initialChatInfo={tasksFilterChat}
                  />
                )}
              </div>
            )}

          {/* Scrollable Tasks list in the middle */}
          <div
            id="taskListScrollableDiv"
            className="flex-1 overflow-y-auto p-4 relative"
            onScroll={handleScroll}
          >
            {loading && tasks.length === 0 && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Spin size="large" />
              </div>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {t('ActiveTasks') || 'Active'}
                  {tasksFilterChat && (
                    <span className="text-slate-500 normal-case font-semibold">
                      {` (${tasksFilterChat.userName || tasksFilterChat.clientProfileName})`}
                    </span>
                  )}
                </span>
                <span className="flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-100 min-w-[20px] h-[20px] px-1.5 rounded-full leading-none">
                  {totalCount}
                </span>
              </div>

              {tasks.length === 0 && !loading ? (
                <div className="bg-white rounded-xl border border-dashed border-slate-200 p-8 flex flex-col items-center gap-3 text-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={24} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-600 font-semibold m-0 text-sm">
                      {t('AllTasksDone') || "You're all caught up!"}
                    </p>
                    <p className="text-slate-400 text-xs m-0 mt-1">
                      {t('AddTaskPrompt') || 'Add a new task to get started'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        getStatusLabel={getStatusLabel}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        compact
                        t={t}
                        usersList={users}
                        chatsList={chats}
                        grantedPolicies={grantedPolicies ?? []}
                        onCloseDrawer={closeDrawerFn}
                        disabled={startTour}
                      />
                    ))}
                  </div>
                  {loading && tasks.length > 0 && (
                    <div className="py-4 flex justify-center">
                      <Spin size="small" />
                    </div>
                  )}
                  {!hasMore && tasks.length > 0 && (
                    <div className="py-4 flex justify-center text-slate-400 text-xs font-medium">
                      {t('NoMoreTasks') || 'No more tasks'}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Fixed Footer at the bottom */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
            <Button
              id="task-all-tasks-footer"
              onClick={() => {
                if (startTour) {
                  localStorage.setItem('tasksTourState', 'all-tasks-board')
                }
                router.push(`/${lng}/admin/all-tasks`)
                setOpenDrawer(false)
                if (startTour) {
                  setStartTour(false)
                  removeDummyTask()
                }
              }}
              block
              size="large"
              type="primary"
              className="main-btn"
            >
              {t('ViewAllTasks') || 'View All Tasks'}
            </Button>
          </div>
        </div>
      </Drawer>
      <Tour
        open={startTour}
        onClose={endTour}
        current={currentStep}
        onChange={handleStepChange}
        steps={steps}
      />
    </>
  )
}
