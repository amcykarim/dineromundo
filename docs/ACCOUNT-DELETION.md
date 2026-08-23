# Manual authenticated account deletion

This is the launch-time deletion procedure. It intentionally avoids a browser service-role key and does not require an Edge Function.

1. Receive a request at `amcykarimgroupinc@gmail.com` sent from the email registered in DineroMundo, with subject `Eliminar mi cuenta DineroMundo`.
2. Never ask for the password, access token, one-time code or backup file.
3. Reply to that registered address describing permanent deletion and ask the user to respond with `ELIMINAR MI CUENTA`.
4. Confirm the reply is in the same email thread and from the registered address.
5. In Supabase Dashboard, open **Authentication → Users**, locate the exact email and verify the user ID. Do not use a similarly named account.
6. Delete that Auth user. The schema's `ON DELETE CASCADE` relationships remove the profile, business, subscription, customers, documents, ledger records, automations, reminders and recurring data.
7. Confirm the Auth user no longer appears and that the related business ID no longer returns rows in the Table Editor/SQL verification performed by the authorized operator.
8. Reply that deletion is complete. Do not include deleted business content in the reply.

If identity cannot be verified, do not delete the account. Escalate through the monitored support thread.

