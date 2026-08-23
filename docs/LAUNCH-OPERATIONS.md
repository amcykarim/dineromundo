# DineroMundo launch operations

## Daily and weekly checks

- Confirm `https://dineromundo.com/`, account routes and Supabase project status are available.
- Review Supabase Dashboard usage for database size, monthly active Auth users, Storage, egress/bandwidth, API activity and Auth errors.
- Review Authentication logs for unusual signup, login, recovery and refresh failures.
- Watch Auth email rate-limit errors. The built-in provider can return HTTP 429 during bursts; never expose that raw response to users.
- Review GitHub Pages deployment status and repository/Pages bandwidth notices.
- If Edge Functions are introduced later, monitor invocations and errors separately. Phase 12 uses none.

Do not copy historical quota numbers into operational decisions. Verify the current Supabase and GitHub plan pages before a campaign. Free projects can be paused for inactivity, and free projects do not include downloadable automatic database backups.

## Auth email incident response

The built-in Supabase mail provider has a low project-wide email allowance. If signup or recovery returns a rate-limit error:

1. Tell the user: “Has solicitado varios correos en poco tiempo. Espera unos minutos e inténtalo de nuevo.”
2. Do not repeatedly retry; that extends the incident and can consume the remaining allowance.
3. Check **Authentication → Logs** and **Authentication → Rate Limits**.
4. Avoid a broad public signup campaign until email capacity is appropriate. Do not add a paid SMTP service without explicit approval.

## Support

Monitored address: `amcykarimgroupinc@gmail.com`.

- Never request passwords, one-time codes, full payment-card numbers, banking credentials or service-role keys.
- Verify deletion requests using the registered account email and the documented confirmation reply.
- Record the request date, confirmation date, deletion date and operator—without copying business data into the log.

## Release checklist

- Production public URL and publishable Supabase key only; no privileged credentials.
- Exact Supabase browser-client version pinned.
- `CNAME`, HTTPS, redirects, canonical URLs, `robots.txt`, `sitemap.xml`, private `noindex` and 404 verified.
- Public signup/login/recovery and disposable-data walkthrough passed on HTTPS.
- Live User A/User B RLS isolation passed.
- Account deletion path and monitored support published.
- User backup export/restore rehearsal passed; malformed backup rejected; plan entitlement not importable.
- Free-tier usage reviewed before outreach.

