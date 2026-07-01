-- Run in Supabase SQL Editor AFTER 03-personal-ops.sql
-- Email + in-app reminders

-- 1. Profile notification preferences
alter table profiles add column if not exists notification_email text;
alter table profiles add column if not exists timezone text not null default 'UTC';

-- 2. Reminders
create table if not exists reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  work_item_id uuid references work_items(id) on delete set null,
  title text not null,
  message text,
  email text not null,
  recurrence text not null default 'none'
    check (recurrence in ('none', 'daily', 'weekly', 'monthly')),
  remind_at timestamptz not null,
  next_run_at timestamptz not null,
  recurrence_day int,
  is_active boolean not null default true,
  last_sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists reminders_next_run_at_idx
  on reminders (next_run_at)
  where is_active = true;

-- 3. In-app notifications
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_id uuid references reminders(id) on delete set null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists notifications_user_unread_idx
  on notifications (user_id, created_at desc)
  where read_at is null;

-- 4. Row Level Security
alter table reminders enable row level security;
alter table notifications enable row level security;

drop policy if exists "Users can view own reminders" on reminders;
drop policy if exists "Users can manage own reminders" on reminders;

create policy "Users can view own reminders"
  on reminders for select to authenticated
  using (user_id = auth.uid());

create policy "Users can manage own reminders"
  on reminders for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "Users can view own notifications" on notifications;
drop policy if exists "Users can update own notifications" on notifications;

create policy "Users can view own notifications"
  on notifications for select to authenticated
  using (user_id = auth.uid());

create policy "Users can update own notifications"
  on notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- 5. Realtime for in-app alerts
do $$ begin alter publication supabase_realtime add table notifications; exception when duplicate_object then null; end $$;
