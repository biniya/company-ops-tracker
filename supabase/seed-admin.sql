-- Run AFTER schema.sql
-- Creates your profile (if missing) and makes you admin.
-- Your user already exists in Auth — this links it to the profiles table.

insert into profiles (id, full_name, email, role)
select
  id,
  coalesce(raw_user_meta_data->>'full_name', 'Biniyam'),
  email,
  'admin'
from auth.users
where email = 'biniyamlemma059@gmail.com'
on conflict (id) do update set role = 'admin';
