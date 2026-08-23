-- Phase 8: plan entitlements and database-side usage enforcement.
-- No payment provider is connected. Only trusted SQL/admin processes may mutate subscriptions.
create table if not exists public.subscriptions(
  id uuid primary key default gen_random_uuid(),business_id uuid not null unique references public.businesses(id) on delete cascade,
  plan_code text not null default 'free' check(plan_code in('free','starter','business','pro')),
  status text not null default 'active' check(status in('active','trial','past_due','cancelled')),
  provider text,provider_customer_id text,provider_subscription_id text,current_period_start timestamptz,current_period_end timestamptz,cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create index if not exists subscriptions_business_idx on public.subscriptions(business_id);create index if not exists subscriptions_provider_ids_idx on public.subscriptions(provider,provider_customer_id,provider_subscription_id) where provider is not null;
drop trigger if exists set_subscriptions_updated_at on public.subscriptions;create trigger set_subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
insert into public.subscriptions(business_id,plan_code,status) select id,'free','active' from public.businesses on conflict(business_id) do nothing;
alter table public.subscriptions enable row level security;revoke all on table public.subscriptions from anon,authenticated;grant select on public.subscriptions to authenticated;drop policy if exists "owned subscription select" on public.subscriptions;create policy "owned subscription select" on public.subscriptions for select to authenticated using(public.owns_business(business_id));

create or replace function public.enforce_plan_limit() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
declare code text:='free';allowed integer;used_count bigint;resource text:=tg_table_name;
begin
  if tg_table_name='customers' and new.status<>'active' then return new;end if;
  if tg_op='UPDATE' and not(tg_table_name='customers' and old.status='archived' and new.status='active') then return new;end if;
  select s.plan_code into code from public.subscriptions s where s.business_id=new.business_id and s.status in('active','trial') limit 1;code:=coalesce(code,'free');
  allowed:=case code when 'free' then case resource when 'customers' then 10 when 'quotes' then 5 when 'invoices' then 5 when 'incomes' then 25 when 'expenses' then 25 end when 'starter' then case resource when 'customers' then 100 when 'quotes' then 50 when 'invoices' then 50 when 'incomes' then 250 when 'expenses' then 250 end when 'business' then case resource when 'customers' then 500 when 'quotes' then 200 when 'invoices' then 200 when 'incomes' then 1000 when 'expenses' then 1000 end when 'pro' then null end;
  if allowed is null then return new;end if;
  if resource='customers' then select count(*) into used_count from public.customers where business_id=new.business_id and status='active';
  elsif resource='quotes' then select count(*) into used_count from public.quotes where business_id=new.business_id and created_at>=date_trunc('month',now()) and created_at<date_trunc('month',now())+interval '1 month';
  elsif resource='invoices' then select count(*) into used_count from public.invoices where business_id=new.business_id and created_at>=date_trunc('month',now()) and created_at<date_trunc('month',now())+interval '1 month';
  elsif resource='incomes' then select count(*) into used_count from public.incomes where business_id=new.business_id and created_at>=date_trunc('month',now()) and created_at<date_trunc('month',now())+interval '1 month';
  elsif resource='expenses' then select count(*) into used_count from public.expenses where business_id=new.business_id and created_at>=date_trunc('month',now()) and created_at<date_trunc('month',now())+interval '1 month';end if;
  if used_count>=allowed then raise exception using errcode='P0001',message=format('plan_limit_reached:%s:%s:%s',resource,used_count,allowed);end if;return new;
end$$;revoke all on function public.enforce_plan_limit() from public;
drop trigger if exists enforce_customer_plan_limit on public.customers;create trigger enforce_customer_plan_limit before insert or update of status on public.customers for each row execute function public.enforce_plan_limit();
drop trigger if exists enforce_quote_plan_limit on public.quotes;create trigger enforce_quote_plan_limit before insert on public.quotes for each row execute function public.enforce_plan_limit();
drop trigger if exists enforce_invoice_plan_limit on public.invoices;create trigger enforce_invoice_plan_limit before insert on public.invoices for each row execute function public.enforce_plan_limit();
drop trigger if exists enforce_income_plan_limit on public.incomes;create trigger enforce_income_plan_limit before insert on public.incomes for each row execute function public.enforce_plan_limit();
drop trigger if exists enforce_expense_plan_limit on public.expenses;create trigger enforce_expense_plan_limit before insert on public.expenses for each row execute function public.enforce_plan_limit();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public,pg_temp as $$declare new_business_id uuid;begin insert into public.profiles(id,full_name) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''));insert into public.businesses(owner_user_id,name,contact_name,email) values(new.id,coalesce(nullif(new.raw_user_meta_data->>'business_name',''),'Mi negocio'),coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.email,'')) returning id into new_business_id;insert into public.subscriptions(business_id,plan_code,status) values(new_business_id,'free','active');return new;end$$;

-- Trusted development override (run only in Supabase SQL Editor after replacing the UUID):
-- update public.subscriptions set plan_code='starter',status='active' where business_id='BUSINESS_UUID';
-- Never expose an UPDATE grant, RPC, service key, or plan selector to normal browser users.
