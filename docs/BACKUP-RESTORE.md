# Backup and restore

## User-controlled backup rehearsal

Use a disposable account or disposable records:

1. Create a customer, quote, invoice, income, expense, disabled automation rule and disabled recurring template.
2. Export the account backup and confirm it is JSON with `schemaVersion`, `exportedAt`, `businessProfile`, and each supported collection.
3. Confirm no subscription, `plan_code`, password, access token or service credential is present.
4. Remove the disposable records or switch to another disposable account.
5. Import the backup after reviewing the confirmation prompt.
6. Verify customers, quotes, invoices, incomes, expenses, automation rules and recurring templates.
7. Confirm imported automations and recurrences are disabled until the user reviews them.
8. Try a malformed fixture and confirm import is rejected without replacing existing data.

## Supabase project backup awareness

The free Supabase plan does not provide downloadable automatic backups. Supabase recommends regular logical exports with `supabase db dump` and off-site storage. This requires an authorized operator and database credentials that must never be placed in browser code, Git, chat logs or public files.

Before launch and on a regular schedule:

- Generate an encrypted logical database dump from a trusted administrator machine.
- Store at least one copy outside the hosting account with restricted access.
- Restore only into a separate disposable Supabase project for rehearsal; never overwrite production to test a backup.
- Record the dump date, schema version and restore result without recording credentials.

