create table public.calculator_usage_daily (
  usage_date date not null default current_date,
  calculator_mode text not null,
  usage_count bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (usage_date, calculator_mode),
  constraint calculator_usage_daily_mode_check
    check (calculator_mode in ('simple', 'full')),
  constraint calculator_usage_daily_count_check check (usage_count >= 0)
);

alter table public.calculator_usage_daily enable row level security;

-- Visitors can increment an aggregate only; the table remains unreadable.
create or replace function public.increment_calculator_usage(p_mode text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_mode not in ('simple', 'full') then
    raise exception 'Invalid calculator mode';
  end if;

  insert into public.calculator_usage_daily (
    usage_date,
    calculator_mode,
    usage_count
  )
  values (current_date, p_mode, 1)
  on conflict (usage_date, calculator_mode)
  do update set
    usage_count = calculator_usage_daily.usage_count + 1,
    updated_at = now();
end;
$$;

revoke all on table public.calculator_usage_daily from anon, authenticated;
revoke all on function public.increment_calculator_usage(text) from public;
grant execute on function public.increment_calculator_usage(text)
  to anon, authenticated;

create or replace function public.get_calculator_usage_totals()
returns table (
  total_count bigint,
  today_count bigint,
  last_seven_days_count bigint,
  simple_count bigint,
  full_count bigint
)
language sql
security invoker
set search_path = public
as $$
  select
    coalesce(sum(usage_count), 0)::bigint,
    coalesce(sum(usage_count) filter (where usage_date = current_date), 0)::bigint,
    coalesce(sum(usage_count) filter (
      where usage_date >= current_date - interval '6 days'
    ), 0)::bigint,
    coalesce(sum(usage_count) filter (where calculator_mode = 'simple'), 0)::bigint,
    coalesce(sum(usage_count) filter (where calculator_mode = 'full'), 0)::bigint
  from public.calculator_usage_daily;
$$;

revoke all on function public.get_calculator_usage_totals() from public;
grant execute on function public.get_calculator_usage_totals() to service_role;
