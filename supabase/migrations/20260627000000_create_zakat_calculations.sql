create table public.zakat_calculations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text null,
  calculation_date date null,
  payload jsonb not null,
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint zakat_calculations_payload_is_object
    check (jsonb_typeof(payload) = 'object'),
  constraint zakat_calculations_name_length
    check (name is null or char_length(name) <= 120)
);

create index zakat_calculations_user_updated_at_idx
  on public.zakat_calculations (user_id, updated_at desc);

grant select, insert, update, delete
  on public.zakat_calculations
  to authenticated;

alter table public.zakat_calculations enable row level security;

create policy "Authenticated users can select own zakat calculations"
  on public.zakat_calculations
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Authenticated users can insert own zakat calculations"
  on public.zakat_calculations
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Authenticated users can update own zakat calculations"
  on public.zakat_calculations
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Authenticated users can delete own zakat calculations"
  on public.zakat_calculations
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
