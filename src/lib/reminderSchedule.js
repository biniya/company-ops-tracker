/**
 * Convert a local date/time in a given IANA timezone to a UTC Date.
 */
export function zonedTimeToUtc(date, time, timezone) {
  const [year, month, day] = date.split('-').map(Number)
  const [hour, minute] = time.split(':').map(Number)
  const targetMs = Date.UTC(year, month - 1, day, hour, minute, 0)

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  let guess = targetMs
  for (let i = 0; i < 4; i++) {
    const parts = Object.fromEntries(
      formatter.formatToParts(new Date(guess)).map((p) => [p.type, p.value])
    )
    const h = Number(parts.hour) % 24
    const shown = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      h,
      Number(parts.minute),
      Number(parts.second)
    )
    guess -= shown - targetMs
  }

  return new Date(guess)
}

export function buildReminderSchedule({
  date,
  time,
  timezone,
  recurrence,
  recurrenceDay,
}) {
  const remindAt = zonedTimeToUtc(date, time, timezone)
  let nextRunAt = new Date(remindAt)
  const now = new Date()

  if (nextRunAt <= now && recurrence !== 'none') {
    nextRunAt = advanceToFuture(remindAt, recurrence, recurrenceDay, now)
  }

  return {
    remind_at: remindAt.toISOString(),
    next_run_at: nextRunAt.toISOString(),
    recurrence_day: recurrence === 'weekly' || recurrence === 'monthly' ? recurrenceDay : null,
  }
}

function advanceToFuture(remindAt, recurrence, recurrenceDay, now) {
  const next = new Date(remindAt)

  while (next <= now) {
    if (recurrence === 'daily') {
      next.setUTCDate(next.getUTCDate() + 1)
    } else if (recurrence === 'weekly') {
      next.setUTCDate(next.getUTCDate() + 7)
    } else if (recurrence === 'monthly') {
      const day = recurrenceDay ?? next.getUTCDate()
      next.setUTCMonth(next.getUTCMonth() + 1)
      const lastDay = new Date(
        Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)
      ).getUTCDate()
      next.setUTCDate(Math.min(day, lastDay))
    } else {
      break
    }
  }

  return next
}

export const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Africa/Addis_Ababa', label: 'Addis Ababa (EAT)' },
  { value: 'America/New_York', label: 'Eastern (US)' },
  { value: 'America/Chicago', label: 'Central (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
]

export const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'One time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]
