import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=process.cwd(),read=file=>fs.readFileSync(path.join(root,file),'utf8');let assertions=0;
const check=(value,message)=>{assert.ok(value,message);assertions+=1;};
const config=read('assets/js/config.js'),auth=read('assets/js/account/auth.js'),account=read('assets/js/account/account-app.js'),recurring=read('assets/js/recurring/recurring-app.js'),reminders=read('assets/js/automation/dashboard-reminders.js'),pricing=read('precios/index.html'),terms=read('terminos/index.html'),launch=read('docs/PRODUCTION-LAUNCH.md');

check(config.includes("productionOrigin:'https://dineromundo.com/'"),'Production origin must be explicit');
check(/supabaseUrl:'https:\/\/[a-z0-9]+\.supabase\.co'/.test(config)&&/supabaseAnonKey:'sb_publishable_[^']+'/.test(config),'Production public configuration must be present');
check(!/service_role\s*:\s*['"][^'"]+/i.test(config),'Browser config must not contain a service role value');
check(auth.includes("cuenta/bienvenida/"),'Signup confirmation must continue to onboarding');
check(auth.includes("cuenta/nueva-contrasena/"),'Recovery must use the new-password endpoint');
check(fs.existsSync(path.join(root,'cuenta/bienvenida/index.html')),'Onboarding page must exist');
check(fs.existsSync(path.join(root,'cuenta/nueva-contrasena/index.html')),'New-password page must exist');
check(read('cuenta/bienvenida/index.html').includes('noindex,nofollow'),'Onboarding must not be indexed');
check(read('cuenta/nueva-contrasena/index.html').includes('noindex,nofollow'),'Recovery endpoint must not be indexed');
check(account.includes("querySelectorAll('button,input,select')"),'Unavailable account forms must be disabled');
check(recurring.includes('esc(row.name)')&&recurring.includes('esc(detail)'),'Recurring account content must be escaped');
check(recurring.includes("select.replaceChildren(new Option('Selecciona',''))"),'Customer options must use safe DOM construction');
check(reminders.includes('row.title')&&reminders.includes('row.message')&&!reminders.includes('innerHTML'),'Dashboard reminders must use safe DOM rendering');
check(pricing.includes('3 automatizaciones y 3 recurrencias'),'Starter limits must match product enforcement');
check(pricing.includes('10 automatizaciones y 15 recurrencias'),'Business limits must match product enforcement');
check(terms.includes('no son facturación electrónica oficial'),'Legal copy must describe invoice limits');
check(terms.includes('no procesa cobros ni pagos'),'Legal copy must describe payment limits');
check(launch.includes('live two-user RLS isolation'),'Launch checklist must require live isolation');
check(launch.includes('account-deletion process'),'Launch checklist must require account deletion support');
check(read('assets/js/main.js').includes("load('production/errors.js')"),'Friendly production errors must load globally');

console.log(JSON.stringify({result:'PASS',assertions,productionPublicConfig:'PASS',liveChecks:'reported separately from static regression'},null,2));
