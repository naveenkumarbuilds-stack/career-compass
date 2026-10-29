create table if not exists public.student_plans (
 user_id uuid primary key references auth.users(id) on delete cascade,
 bookmarks jsonb not null default '[]',
 progress jsonb not null default '{}',
 history jsonb not null default '[]',
 updated_at timestamptz not null default now(),
 constraint plan_size check (octet_length(bookmarks::text)+octet_length(progress::text)+octet_length(history::text) < 100000)
);
alter table public.student_plans enable row level security;
drop policy if exists student_plan_owner on public.student_plans;
create policy student_plan_owner on public.student_plans for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select,insert,update,delete on public.student_plans to authenticated;
