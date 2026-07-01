# My Ops

**Your personal operations board.** Track what you're working on across your own life areas — planned, in progress, blocked, and done.

Built with Vue 3, Vite, TailwindCSS, Pinia, Vue Router, Vue Draggable, and Supabase.

## Features

- Personal **areas** (Work, Personal, Home, Money, Health, Projects — or your own)
- Kanban board per area with four columns: Planned, In Progress, Blocked, Completed
- Drag-and-drop items with instant sync
- Dashboard with blocked-item highlights and area summaries
- Item details with notes and activity timeline
- **Reminders** with one-time or recurring schedules (daily / weekly / monthly)
- **Email alerts** via Resend + **in-app notifications** (bell icon)
- Dark mode support
- Settings to manage your areas and notification preferences

## Tech Stack

Vue 3 · Vite · TailwindCSS v4 · Pinia · Vue Router · Vue Draggable · Supabase · Resend · Vercel

## Local Development

```bash
npm install
cp .env.example .env   # add your Supabase URL and anon key
npm run dev
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run SQL files in order in the **SQL Editor**:
   - `supabase/01-setup.sql`
   - `supabase/02-multi-department.sql`
   - `supabase/03-personal-ops.sql`
   - `supabase/04-reminders.sql`
3. **Authentication → Providers → Email** → disable **Enable sign ups** (optional — create your account in Supabase dashboard)
4. **Authentication → Users** → add your user
5. Run `supabase/seed-admin.sql` only if you need to fix profile role (optional)

On first login, default areas are created automatically.

### Reminders & email setup

1. Create a free account at [resend.com](https://resend.com) and get an API key
2. On Resend free tier, verify your email address to receive test messages (custom domain optional later)
3. Add these **server-only** env vars in Vercel (and locally if testing the cron endpoint):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Cron job reads due reminders |
| `RESEND_API_KEY` | Sends reminder emails |
| `RESEND_FROM_EMAIL` | Sender, e.g. `My Ops <onboarding@resend.dev>` |
| `CRON_SECRET` | Random secret; protects `/api/process-reminders` |

4. In **Settings** inside the app, set your default notification email and timezone
5. Create reminders under **Reminders** in the sidebar

The Vercel cron runs every 5 minutes on Pro. On Hobby, cron is limited to once per day — use [cron-job.org](https://cron-job.org) to ping `https://your-app.vercel.app/api/process-reminders` with header `Authorization: Bearer YOUR_CRON_SECRET` for more frequent checks.

### Deploy to Vercel

| Variable | Example |
|----------|---------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key (server only) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | `My Ops <onboarding@resend.dev>` |
| `CRON_SECRET` | random secret string |

## License

MIT
