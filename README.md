# OpsBoard

**Company operations at a glance.** A lightweight internal board that answers: *"What is happening in the company right now?"*

Built with Vue 3, Vite, TailwindCSS, Pinia, Vue Router, Vue Draggable, and Supabase.

## Features

- Department boards with four columns: Planned, In Progress, Blocked, Completed
- Drag-and-drop work items with instant database sync
- Realtime updates for all connected users
- Dashboard with blocked-item highlights and department summaries
- Work item details with comments and activity timeline
- Role-based access: Admin, Manager, Employee
- Dark mode support
- Admin settings for departments and team members

## Tech Stack

Vue 3 · Vite · TailwindCSS v4 · Pinia · Vue Router · Vue Draggable · Supabase · Vercel

## Local Development

```bash
npm install
cp .env.example .env   # add your Supabase URL and anon key
npm run dev
```

### Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/01-setup.sql` in the **SQL Editor**
3. **Authentication → Providers → Email** → disable **Enable sign ups**
4. **Authentication → Users** → add your admin user
5. Run `supabase/seed-admin.sql` (update the email first)

### Admin user creation from the app

Deploy the edge function:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase functions deploy create-user
```

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git status          # confirm .env is NOT listed
git commit -m "Initial commit: OpsBoard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/company-ops-tracker.git
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the repo
2. Framework preset: **Vite** (auto-detected)
3. Add **Environment Variables**:

| Variable | Example |
|----------|---------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your anon / publishable key |

> Use the project URL **without** `/rest/v1/` at the end.

4. Click **Deploy**

`vercel.json` is included for SPA routing (Vue Router).

## Project Structure

```
src/
├── components/   # UI (board, dashboard, layout, settings)
├── composables/  # useRealtime
├── lib/          # Supabase client, constants
├── router/
├── stores/       # Pinia
└── views/
supabase/
├── 01-setup.sql       # Database schema (run first)
├── seed-admin.sql     # Promote admin user
└── functions/create-user/
```

## License

MIT
