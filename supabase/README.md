# Supabase setup for DineroMundo Phase 7

1. Create a project on the **Supabase Free** plan. A credit card should not be required for the normal free-project flow.
2. In **SQL Editor**, run [`schema.sql`](schema.sql) once on the new project.
3. In **Project Settings → API** (or the current **Connect/API Keys** screen), copy:
   - Project URL
   - `anon` public key or publishable key
4. Put only those two public values in `assets/js/config.js`.
5. In **Authentication → URL Configuration**, set the production Site URL to `https://dineromundo.com/` and add the local/preview and GitHub Pages redirect URLs actually used for testing.
6. Keep email/password auth enabled. Supabase's normal confirmation and recovery emails can be used during early testing; delivery limits and template/domain behavior are controlled by the Supabase project configuration.
7. Create two non-production test accounts and execute the checklist in `tests/rls-isolation.sql` before launch.

Never place a `service_role`/secret key, database password, JWT secret, SMTP credential, or direct PostgreSQL connection string in frontend files, Git, GitHub Pages, browser storage, or support messages. The service role bypasses RLS.

The browser client is loaded from the free jsDelivr CDN only when valid public configuration is present. Pin a reviewed exact `@supabase/supabase-js` v2 release before production if deterministic supply-chain builds are required.

Free-tier limits change over time. At the time Phase 7 was prepared, Supabase advertised $0/month, 500 MB database storage, 50,000 monthly active users, 5 GB egress, two active projects, and pausing after one week of inactivity. Verify the current pricing page before launch.

## Phase 8–9 migrations

After `schema.sql`, run `migrations/20260823_phase8_plans.sql` and then `migrations/20260823_phase9_automations.sql`. Phase 9 adds optional reminder dates plus private rules, reminders, and lightweight events. Existing business rows remain unchanged and no default rule is forced onto existing users.

Date-only conditions use the user's local calendar date (`YYYY-MM-DD`) and calendar-day arithmetic, not midnight UTC, so month, year, and daylight-saving boundaries do not shift a rule by one day. Browser-triggered checks run when the dashboard or automation center opens and when the user requests a refresh; they are not 24/7 jobs.

A future server-side design can use a scheduled job to load due rules, evaluate the same deterministic conditions, create idempotent actions, and pass them to optional delivery handlers. Phase 9 does not depend on cron, an email provider, SMS, WhatsApp, webhooks, or any additional server.

## Phase 10 recurrence

Run `migrations/20260823_phase10_recurring.sql` after the Phase 8 and Phase 9 migrations. It adds private recurring templates and duplicate-safe run claims. Monthly and yearly schedules retain the original start-day anchor and use the last valid day in shorter months. Checks are browser-triggered, so there is no scheduler fee and no claim of 24/7 execution.

A future scheduled worker can call the same recurrence processor: claim one unique run, create the normal draft invoice or pending expense, create the existing in-app reminder, complete the run, and only then advance the schedule. No service-role credential belongs in browser code.
