// ─── Shared types & constants for the Task feature ───────────────────────────

export type TaskStatus = 'pending' | 'inprogress' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignedUserId?: string | null
  relatedEntityId?: string | null
  relatedEntityType?: any | null
  creationTime?: string | null
  chatInfo?: {
    id: number | string
    name?: string | null
    userName?: string | null
    phoneNumber?: string | null
  } | null
}

export const STATUS_CONFIG: Record<TaskStatus, { label_en: string; className: string; dot: string }> = {
  pending: {
    label_en: 'Pending',
    className: 'text-amber-600 bg-amber-50',
    dot: 'bg-amber-400',
  },
  inprogress: {
    label_en: 'In Progress',
    className: 'text-blue-600 bg-blue-50',
    dot: 'bg-blue-400',
  },
  completed: {
    label_en: 'Completed',
    className: 'text-emerald-600 bg-emerald-50',
    dot: 'bg-emerald-400',
  },
}

export const SAMPLE_TASKS: Task[] = [
  { id: '1', title: '', description: '', status: 'pending' },
  { id: '2', title: '', description: '', status: 'inprogress' },
]
