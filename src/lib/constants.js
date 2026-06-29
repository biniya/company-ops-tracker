export const STATUSES = {
  planned: { label: 'Planned', color: 'zinc' },
  in_progress: { label: 'In Progress', color: 'brand' },
  blocked: { label: 'Blocked', color: 'rose' },
  completed: { label: 'Completed', color: 'emerald' },
}

export const STATUS_ORDER = ['planned', 'in_progress', 'blocked', 'completed']

export const ROLES = {
  admin: { label: 'Admin', description: 'Manage everything' },
  manager: { label: 'Manager', description: 'Manage department items' },
  employee: { label: 'Employee', description: 'View and update assigned items' },
}

export function formatStatus(status) {
  return STATUSES[status]?.label ?? status
}

export function statusColor(status) {
  const colors = {
    planned: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
    in_progress: 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300',
    blocked: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  }
  return colors[status] ?? colors.planned
}

export function columnAccent(status) {
  const colors = {
    planned: 'border-t-zinc-300 bg-zinc-50/80 dark:border-t-zinc-600 dark:bg-zinc-900/50',
    in_progress: 'border-t-brand-500 bg-brand-50/30 dark:border-t-brand-600 dark:bg-brand-950/20',
    blocked: 'border-t-rose-500 bg-rose-50/30 dark:border-t-rose-600 dark:bg-rose-950/20',
    completed: 'border-t-emerald-500 bg-emerald-50/30 dark:border-t-emerald-600 dark:bg-emerald-950/20',
  }
  return colors[status] ?? colors.planned
}

export function columnDot(status) {
  const colors = {
    planned: 'bg-zinc-400',
    in_progress: 'bg-brand-500',
    blocked: 'bg-rose-500',
    completed: 'bg-emerald-500',
  }
  return colors[status] ?? colors.planned
}

// backward compat
export const columnHeaderColor = columnAccent
