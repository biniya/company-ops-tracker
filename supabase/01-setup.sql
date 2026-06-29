-- ═══════════════════════════════════════════════════════════════════════════
-- COMPANY OPS TRACKER — RUN THIS FIRST IN SUPABASE SQL EDITOR
-- Project: ioavizzgjdnnqgimppop (companies operation Project)
--
-- Your Vue app runs LOCALLY (localhost:5173)
-- Your DATABASE is in the CLOUD (supabase.com) — tables must be created here.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. Tables
create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null default 'employee' check (role in ('admin', 'manager', 'employee')),
  department_id uuid references departments(id) on delete set null,
  avatar text,
  created_at timestamptz default now()
);

create table if not exists work_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  department_id uuid not null references departments(id) on delete cascade,
  assigned_to uuid references profiles(id) on delete set null,
  status text not null default 'planned' check (status in ('planned', 'in_progress', 'blocked', 'completed')),
  due_date date,
  block_reason text,
  created_by uuid not null references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references work_items(id) on delete cascade,
  user_id uuid not null references profiles(id),
  comment text not null,
  created_at timestamptz default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references work_items(id) on delete cascade,
  user_id uuid not null references profiles(id),
  action text not null,
  created_at timestamptz default now()
);

-- 2. Auto-create profile when new users are added
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'employee')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Default departments
insert into departments (name) values
  ('HR'), ('Development'), ('Operations'),
  ('Marketing'), ('Finance'), ('Administration')
on conflict (name) do nothing;

-- 4. Helper functions
create or replace function public.get_user_role()
returns text as $$
  select role from public.profiles where id = auth.uid();
$$ language sql security definer stable;

create or replace function public.get_user_department()
returns uuid as $$
  select department_id from public.profiles where id = auth.uid();
$$ language sql security definer stable;

-- 5. Row Level Security
alter table departments enable row level security;
alter table profiles enable row level security;
alter table work_items enable row level security;
alter table comments enable row level security;
alter table activities enable row level security;

drop policy if exists "Authenticated users can view departments" on departments;
create policy "Authenticated users can view departments" on departments for select to authenticated using (true);
drop policy if exists "Admins can manage departments" on departments;
create policy "Admins can manage departments" on departments for all to authenticated using (public.get_user_role() = 'admin') with check (public.get_user_role() = 'admin');

drop policy if exists "Authenticated users can view profiles" on profiles;
create policy "Authenticated users can view profiles" on profiles for select to authenticated using (true);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "Admins can manage all profiles" on profiles;
create policy "Admins can manage all profiles" on profiles for all to authenticated using (public.get_user_role() = 'admin') with check (public.get_user_role() = 'admin');

drop policy if exists "Authenticated users can view work items" on work_items;
create policy "Authenticated users can view work items" on work_items for select to authenticated using (public.get_user_role() = 'admin' or public.get_user_role() = 'manager' or assigned_to = auth.uid() or department_id = public.get_user_department());
drop policy if exists "Admins and managers can create work items" on work_items;
create policy "Admins and managers can create work items" on work_items for insert to authenticated with check (public.get_user_role() in ('admin', 'manager') or (public.get_user_role() = 'employee' and created_by = auth.uid()));
drop policy if exists "Users can update work items" on work_items;
create policy "Users can update work items" on work_items for update to authenticated using (public.get_user_role() = 'admin' or (public.get_user_role() = 'manager' and department_id = public.get_user_department()) or assigned_to = auth.uid());
drop policy if exists "Admins can delete work items" on work_items;
create policy "Admins can delete work items" on work_items for delete to authenticated using (public.get_user_role() = 'admin');

drop policy if exists "Authenticated users can view comments" on comments;
create policy "Authenticated users can view comments" on comments for select to authenticated using (true);
drop policy if exists "Authenticated users can add comments" on comments;
create policy "Authenticated users can add comments" on comments for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "Authenticated users can view activities" on activities;
create policy "Authenticated users can view activities" on activities for select to authenticated using (true);
drop policy if exists "Authenticated users can add activities" on activities;
create policy "Authenticated users can add activities" on activities for insert to authenticated with check (user_id = auth.uid());

-- 6. Realtime
do $$ begin alter publication supabase_realtime add table work_items; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table comments; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table activities; exception when duplicate_object then null; end $$;
