(() => {
  const ownScript=document.currentScript,assetRoot=ownScript?new URL('./',ownScript.src):new URL('assets/js/',document.baseURI);
  const load=src=>new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL(src,assetRoot).href;script.onload=resolve;script.onerror=()=>reject(new Error(`No se pudo cargar ${src}`));document.head.append(script);});
  const acquisitionKeys=['utm_source','utm_medium','utm_campaign'];
  const cleanAcquisition=value=>String(value||'').trim().slice(0,100).replace(/[^a-z0-9._~ -]/gi,'');
  let acquisition={};
  try{
    const params=new URLSearchParams(location.search),incoming=Object.fromEntries(acquisitionKeys.map(key=>[key,cleanAcquisition(params.get(key))]).filter(([,value])=>value));
    if(Object.keys(incoming).length)sessionStorage.setItem('dm-acquisition',JSON.stringify(incoming));
    acquisition=JSON.parse(sessionStorage.getItem('dm-acquisition')||'{}');
  }catch(error){acquisition={};}
  window.DMAcquisition={current:()=>({...acquisition})};
  const tagSignupLinks=()=>{if(!Object.keys(acquisition).length)return;document.querySelectorAll('a[href*="cuenta/registro"]').forEach(link=>{const url=new URL(link.href,location.href);acquisitionKeys.forEach(key=>{if(acquisition[key])url.searchParams.set(key,acquisition[key]);});link.href=url.href;});};
  tagSignupLinks();
  if(Object.keys(acquisition).length)new MutationObserver(tagSignupLinks).observe(document.documentElement,{childList:true,subtree:true});
  load('production/errors.js').catch(()=>{});
  const accountArea=/\/(?:cuenta|negocios|precios)(?:\/|$)/.test(location.pathname);
  if(accountArea){const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('../css/plans.css',assetRoot).href;document.head.append(style);window.DMCloudReady=(async()=>{try{await load('config.js');const cfg=window.DINEROMUNDO_CONFIG||{},configured=cfg.supabaseUrl&&!/YOUR_PROJECT/.test(cfg.supabaseUrl)&&cfg.supabaseAnonKey&&!/YOUR_SUPABASE/.test(cfg.supabaseAnonKey);if(configured){await load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.3/dist/umd/supabase.min.js');window.DMSupabase=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}await load('account/auth.js');await load('business/cloud-storage.js');await load('business/migration.js');await load('plans/plans.js');await load('plans/plan-service.js');await load('plans/plan-ui.js');await load('automation/engine.js');await load('automation/templates.js');await load('automation/message-templates.js');await load('automation/service.js');await load('recurring/engine.js');await load('recurring/models.js');await load('recurring/service.js');return configured;}catch(error){console.warn('Modo de cuenta no disponible:',error.message);return false;}})();}
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');

  if (toggle && nav) {
    const closeMenu = (restoreFocus = false) => {
      const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      const label = toggle.querySelector('.sr-only');
      if (label) label.textContent = 'Abrir menú principal';
      if (restoreFocus && wasOpen) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        const label = toggle.querySelector('.sr-only');
        if (label) label.textContent = 'Cerrar menú principal';
        nav.querySelector('a')?.focus();
      }
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  document.querySelectorAll('[data-year], [data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
  if(accountArea){window.DMCloudReady.then(async()=>{const nav=document.querySelector('#site-nav');if(!nav||!window.DMAuth)return;const user=await window.DMAuth.getCurrentUser(),home=new URL('../../',assetRoot);nav.querySelectorAll('[data-account-nav]').forEach(node=>node.remove());const links=user?[['Mi negocio',new URL('negocios/',home).href],['Cuenta',new URL('cuenta/',home).href],['Cerrar sesión','#']]:[['Iniciar sesión',new URL('cuenta/iniciar-sesion/',home).href],['Crear cuenta',new URL('cuenta/registro/',home).href]];links.forEach(([label,href])=>{const a=document.createElement('a');a.dataset.accountNav='';a.textContent=label;a.href=href;if(label==='Cerrar sesión')a.addEventListener('click',async event=>{event.preventDefault();await window.DMAuth.signOut();location.href=new URL('negocios/',home).href;});nav.append(a);});if(/\/negocios(?:\/|$)/.test(location.pathname)){const notice=document.createElement('p');notice.className='storage-mode-notice';notice.setAttribute('role','status');notice.textContent=user?'Guardado en tu cuenta':'Tus datos se guardan localmente en este dispositivo.';document.querySelector('main')?.prepend(notice);}});}
  if(accountArea){window.DMCloudReady.then(async()=>{
    if(!window.DMAuth||!await window.DMAuth.getCurrentUser())return;
    const replacements=new Map([
      ['Privacidad local','Privacidad de tu cuenta'],
      ['Los datos de clientes se guardan localmente en este dispositivo y no se envían a servidores de DineroMundo en esta versión.','Los datos de clientes se guardan en tu cuenta y solo están disponibles durante una sesión autenticada.'],
      ['Esta es una gestión básica de clientes para pequeños negocios. Los registros, cotizaciones y facturas permanecen en este navegador; no es un CRM certificado ni un servicio en la nube.','Esta es una gestión básica para pequeños negocios. Los registros se guardan en tu cuenta; no es un CRM certificado ni sustituye asesoría profesional.'],
      ['La información de tus cotizaciones se guarda localmente en tu dispositivo y no se envía a servidores de DineroMundo en esta versión.','La información de tus cotizaciones se guarda en tu cuenta y está protegida por el acceso de usuario.'],
      ['Tus borradores se guardan localmente en este dispositivo. No existe copia en la nube.','Tus borradores se guardan en tu cuenta y permanecen disponibles al volver a iniciar sesión.'],
      ['Los ingresos se guardan en este dispositivo y no se envían a servidores de DineroMundo.','Los ingresos se guardan en tu cuenta y solo están disponibles durante una sesión autenticada.'],
      ['Los gastos se guardan en este dispositivo y no se envían a servidores de DineroMundo.','Los gastos se guardan en tu cuenta y solo están disponibles durante una sesión autenticada.'],
      ['Los indicadores se calculan localmente en este dispositivo utilizando los datos que has registrado. DineroMundo no recibe esta información en esta versión.','Los indicadores se calculan en tu navegador utilizando los datos guardados en tu cuenta.'],
      ['Almacenamiento local','Almacenamiento en tu cuenta'],
      ['Registros de este dispositivo','Registros de tu cuenta']
    ]);
    document.querySelectorAll('main p,main span,main strong').forEach(node=>{const next=replacements.get(node.textContent.trim());if(next)node.textContent=next;});
  });}
})();
