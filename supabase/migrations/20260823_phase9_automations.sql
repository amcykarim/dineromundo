-- Phase 9: deterministic in-app automation foundation. No delivery provider or secret is required.
alter table public.incomes add column if not exists reminder_date date;
alter table public.expenses add column if not exists reminder_date date;

create table if not exists public.automation_rules(
  id text primary key,business_id uuid not null references public.businesses(id) on delete cascade,
  type text not null check(type in('invoice_due_soon','invoice_overdue','quote_followup','expense_reminder','income_reminder')),
  name text not null check(char_length(name) between 1 and 160),enabled boolean not null default false,
  trigger_type text not null default 'condition',trigger_config jsonb not null default '{}'::jsonb,
  action_type text not null default 'in_app_reminder' check(action_type='in_app_reminder'),action_config jsonb not null default '{}'::jsonb,
  last_evaluated_at timestamptz,created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.reminders(
  id uuid primary key default gen_random_uuid(),business_id uuid not null references public.businesses(id) on delete cascade,
  automation_rule_id text references public.automation_rules(id) on delete set null,entity_type text not null check(entity_type in('invoice','quote','income','expense')),entity_id text not null,
  type text not null,title text not null check(char_length(title)<=200),message text not null check(char_length(message)<=1000),due_at date not null,
  status text not null default 'unread' check(status in('unread','read','completed','dismissed')),read_at timestamptz,completed_at timestamptz,
  dedupe_key text not null check(char_length(dedupe_key)<=300),created_at timestamptz not null default now(),updated_at timestamptz not null default now(),unique(business_id,dedupe_key)
);
create table if not exists public.automation_events(
  id bigint generated always as identity primary key,business_id uuid not null references public.businesses(id) on delete cascade,
  automation_rule_id text references public.automation_rules(id) on delete set null,event_type text not null check(event_type in('reminder_created','reminder_completed','rule_enabled','rule_disabled')),
  entity_type text,entity_id text,metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now()
);
create index if not exists automation_rules_business_enabled_idx on public.automation_rules(business_id,enabled);
create index if not exists reminders_business_status_due_idx on public.reminders(business_id,status,due_at);
create index if not exists automation_events_business_created_idx on public.automation_events(business_id,created_at desc);
drop trigger if exists set_automation_rules_updated_at on public.automation_rules;create trigger set_automation_rules_updated_at before update on public.automation_rules for each row execute function public.set_updated_at();
drop trigger if exists set_reminders_updated_at on public.reminders;create trigger set_reminders_updated_at before update on public.reminders for each row execute function public.set_updated_at();

alter table public.automation_rules enable row level security;alter table public.reminders enable row level security;alter table public.automation_events enable row level security;
revoke all on table public.automation_rules,public.reminders,public.automation_events from anon,authenticated;
grant select,insert,update,delete on public.automation_rules,public.reminders to authenticated;grant select,insert on public.automation_events to authenticated;
do $$ declare t text;begin foreach t in array array['automation_rules','reminders','automation_events'] loop
  execute format('drop policy if exists "owned %s select" on public.%I',t,t);execute format('create policy "owned %s select" on public.%I for select to authenticated using(public.owns_business(business_id))',t,t);
  execute format('drop policy if exists "owned %s insert" on public.%I',t,t);execute format('create policy "owned %s insert" on public.%I for insert to authenticated with check(public.owns_business(business_id))',t,t);
end loop;end $$;
drop policy if exists "owned automation_rules update" on public.automation_rules;create policy "owned automation_rules update" on public.automation_rules for update to authenticated using(public.owns_business(business_id)) with check(public.owns_business(business_id));
drop policy if exists "owned automation_rules delete" on public.automation_rules;create policy "owned automation_rules delete" on public.automation_rules for delete to authenticated using(public.owns_business(business_id));
drop policy if exists "owned reminders update" on public.reminders;create policy "owned reminders update" on public.reminders for update to authenticated using(public.owns_business(business_id)) with check(public.owns_business(business_id));
drop policy if exists "owned reminders delete" on public.reminders;create policy "owned reminders delete" on public.reminders for delete to authenticated using(public.owns_business(business_id));

create or replace function public.enforce_automation_rule_limit() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare code text;lim integer;used_count bigint;begin
  if not new.enabled or (tg_op='UPDATE' and old.enabled) then return new;end if;
  select s.plan_code into code from public.subscriptions s where s.business_id=new.business_id and s.status in('active','trial') limit 1;code:=coalesce(code,'free');
  lim:=case code when 'free' then 0 when 'starter' then 3 when 'business' then 10 else null end;
  if lim is null then return new;end if;select count(*) into used_count from public.automation_rules where business_id=new.business_id and enabled and id<>new.id;
  if used_count>=lim then raise exception using errcode='P0001',message='plan_limit_reached:automationRules';end if;return new;
end$$;
drop trigger if exists enforce_automation_rule_plan_limit on public.automation_rules;create trigger enforce_automation_rule_plan_limit before insert or update of enabled on public.automation_rules for each row execute function public.enforce_automation_rule_limit();
