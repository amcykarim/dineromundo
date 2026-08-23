# DineroMundo production launch gate

The repository is intentionally safe but not connected to production while `assets/js/config.js` contains placeholders. Do not publish a launch-ready claim until every gate below passes.

## Public browser configuration

1. Create or select the production Supabase project.
2. Copy only the Project URL and the browser-safe publishable/anon key into `assets/js/config.js`, following `config.example.js`.
3. Never place a service-role/secret key, database password, JWT secret, SMTP credential, or PostgreSQL connection string in this repository or a browser.
4. Keep `productionOrigin` set to `https://dineromundo.com/` and `enablePlanTesting` false.

## Database order

Run these files once, in order, in the Supabase SQL editor:

1. `supabase/schema.sql`
2. `supabase/migrations/20260823_phase8_plans.sql`
3. `supabase/migrations/20260823_phase9_automations.sql`
4. `supabase/migrations/20260823_phase10_recurring.sql`

Then run `supabase/tests/rls-isolation.sql` using two disposable users. Verify User A cannot select, insert, update, or delete User B data in every private table. Do not share passwords or access tokens in support messages.

## Authentication URLs

In Supabase Authentication URL Configuration set:

- Site URL: `https://dineromundo.com/`
- Allowed redirects: `https://dineromundo.com/cuenta/bienvenida/` and `https://dineromundo.com/cuenta/nueva-contrasena/`
- Add the exact localhost preview equivalents only while testing.

Test signup with and without email confirmation as configured, confirmation, login, logout, invalid credentials, recovery, expired/reused recovery links, and session persistence. Email delivery and rate limits belong to the real project and must be verified there.

## Deployment and operations

- Publish the static site through the existing GitHub Pages workflow/domain, preserving `CNAME` as `dineromundo.com`.
- Confirm DNS, HTTPS, canonical URLs, `robots.txt`, and `sitemap.xml` on the deployed origin.
- Pin and review the Supabase browser-client CDN version before launch; do not silently float dependencies.
- Review current Supabase quotas and alerts in its dashboard. Do not rely on historical quota numbers.
- Schedule encrypted database backups/export checks and perform a restore rehearsal. Test the app's user-data export/import separately.
- Establish a monitored support/contact channel and an authenticated account-deletion process before accepting real accounts. The static frontend cannot safely delete an Auth user with administrative privileges.

## Release decision

Launch is blocked until real configuration, live two-user RLS isolation, live auth/email flows, deployed-domain browser checks, backup/restore rehearsal, and a real support/deletion process are verified and recorded.
