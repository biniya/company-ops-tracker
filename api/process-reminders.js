import { createClient } from '@supabase/supabase-js'

function computeNextRunAt(reminder, fromDate = new Date()) {
  const recurrence = reminder.recurrence
  if (recurrence === 'none') return null

  const next = new Date(fromDate)

  if (recurrence === 'daily') {
    next.setUTCDate(next.getUTCDate() + 1)
    return next.toISOString()
  }

  if (recurrence === 'weekly') {
    next.setUTCDate(next.getUTCDate() + 7)
    return next.toISOString()
  }

  if (recurrence === 'monthly') {
    const day = reminder.recurrence_day ?? next.getUTCDate()
    next.setUTCMonth(next.getUTCMonth() + 1)
    const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate()
    next.setUTCDate(Math.min(day, lastDay))
    return next.toISOString()
  }

  return null
}

async function sendEmail({ to, title, message, fromEmail, apiKey }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: `Reminder: ${title}`,
      html: `
        <h2>${title}</h2>
        ${message ? `<p>${message.replace(/\n/g, '<br>')}</p>` : ''}
        <p style="color:#71717a;font-size:12px;">Sent by My Ops</p>
      `,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend error ${res.status}: ${body}`)
  }

  return res.json()
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const cronSecret = process.env.CRON_SECRET
  const authHeader = req.headers.authorization
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'My Ops <onboarding@resend.dev>'

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Supabase server credentials not configured' })
  }

  if (!resendKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' })
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const now = new Date().toISOString()

  const { data: dueReminders, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('is_active', true)
    .lte('next_run_at', now)
    .order('next_run_at', { ascending: true })
    .limit(50)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const results = []

  for (const reminder of dueReminders ?? []) {
    try {
      await sendEmail({
        to: reminder.email,
        title: reminder.title,
        message: reminder.message,
        fromEmail,
        apiKey: resendKey,
      })

      await supabase.from('notifications').insert({
        user_id: reminder.user_id,
        reminder_id: reminder.id,
        title: reminder.title,
        body: reminder.message,
      })

      const nextRunAt = computeNextRunAt(reminder, new Date())
      const updates = {
        last_sent_at: now,
        updated_at: now,
      }

      if (reminder.recurrence === 'none') {
        updates.is_active = false
      } else if (nextRunAt) {
        updates.next_run_at = nextRunAt
      } else {
        updates.is_active = false
      }

      await supabase.from('reminders').update(updates).eq('id', reminder.id)

      results.push({ id: reminder.id, status: 'sent' })
    } catch (e) {
      results.push({ id: reminder.id, status: 'error', error: e.message })
    }
  }

  return res.status(200).json({
    processed: results.length,
    results,
  })
}
