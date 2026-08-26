import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(),read=file=>fs.readFileSync(path.join(root,file),'utf8');
let assertions=0;
const ok=(value,message)=>{assert.ok(value,message);assertions+=1;};
const landing=read('software-para-pequenos-negocios/index.html');
const homepage=read('index.html'),pricing=read('precios/index.html'),contact=read('contacto/index.html');
const main=read('assets/js/main.js'),auth=read('assets/js/account/auth.js'),sitemap=read('sitemap.xml');

ok(landing.includes('<h1>Software en español para organizar tu pequeño negocio</h1>'),'Acquisition H1');
ok(landing.includes('SoftwareApplication')&&landing.includes('FAQPage'),'Valid landing structured data types');
ok(landing.includes('https://dineromundo.com/software-para-pequenos-negocios/'),'Landing canonical and URL');
ok(landing.includes('../cuenta/registro/')&&landing.includes('Empieza gratis'),'Landing signup CTA');
ok(!/Stripe|PayPal|Mercado Pago/i.test(landing),'No payment provider promotion');
ok(homepage.includes('Para freelancers y pequeños negocios')&&homepage.includes('software-para-pequenos-negocios/'),'Homepage acquisition path');
ok(homepage.includes('href="./cuenta/registro/">Empieza gratis'),'Homepage primary signup CTA');
ok(pricing.includes('DineroMundo no procesa pagos')&&pricing.includes('Disponible próximamente'),'Paid checkout remains disabled');
ok(pricing.includes('mailto:amcykarimgroupinc@gmail.com'),'Upgrade-interest contact uses monitored support');
ok(contact.includes('¿Qué puedes enviarnos?'),'Feedback path is explicit');
ok(main.includes("['utm_source','utm_medium','utm_campaign']"),'UTM allowlist');
ok(main.includes("sessionStorage.setItem('dm-acquisition'"),'UTM session preservation');
ok(auth.includes("metadata[key]=acquisition[key]"),'UTM saved only as signup metadata');
ok(sitemap.includes('https://dineromundo.com/software-para-pequenos-negocios/'),'Landing in sitemap');
for(const file of ['marketing/launch-plan.md','marketing/social-posts.md','marketing/outreach-messages.md','marketing/first-100-users.md'])ok(fs.existsSync(path.join(root,file)),`${file} required`);
const publicText=[homepage,pricing,contact,landing,main,auth].join('\n');
ok(!publicText.includes('amyckarimgroupinc@gmail.com'),'Typo support address forbidden');
ok(!/sb_secret_|service_role/i.test(publicText),'No privileged Supabase key in changed public files');

console.log(JSON.stringify({result:'PASS',assertions,landing:'/software-para-pequenos-negocios/',tracking:'privacy-conscious UTM only',paidServices:'NONE'},null,2));
