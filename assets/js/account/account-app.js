(async()=>{
  'use strict';
  await (window.DMCloudReady||Promise.resolve(false));
  const auth=window.DMAuth,form=document.querySelector('[data-auth-form]'),message=document.querySelector('[data-account-message]');
  const show=(text,type='info')=>{if(!message)return;message.textContent=text;message.dataset.type=type;message.hidden=false;};
  const busy=value=>{form?.querySelectorAll('button,input').forEach(node=>node.disabled=value);};
  if(!auth||!auth.configured()){show('Las cuentas todavía no están conectadas. Configura el proyecto gratuito de Supabase para activar esta función.','warning');form?.querySelectorAll('button,input,select').forEach(node=>node.disabled=true);return;}
  const mode=document.body.dataset.accountPage;
  if(form&&['register','login','recover','new-password'].includes(mode))form.addEventListener('submit',async event=>{
    event.preventDefault();const data=Object.fromEntries(new FormData(form));busy(true);
    try{
      if(mode==='register'){if(String(data.password).length<8)throw new Error('La contraseña debe tener al menos 8 caracteres.');if(data.password!==data.confirmPassword)throw new Error('Las contraseñas no coinciden.');const result=await auth.signUp({email:data.email,password:data.password,fullName:data.fullName,businessName:data.businessName});show(result.session?'Cuenta creada. Redirigiendo…':'Revisa tu correo para confirmar la cuenta. Después continuarás con la configuración inicial.','success');if(result.session)location.href='../bienvenida/';}
      else if(mode==='login'){await auth.signIn(data.email,data.password);location.href='../../negocios/';}
      else if(mode==='recover'){await auth.resetPassword(data.email);show('Si el correo puede recibir mensajes de recuperación, encontrarás las instrucciones allí.','success');}
      else if(mode==='new-password'){if(String(data.password).length<8||data.password!==data.confirmPassword)throw new Error('Usa al menos 8 caracteres y confirma la misma contraseña.');await auth.updatePassword(data.password);show('Contraseña actualizada. Ya puedes iniciar sesión.','success');form.reset();}
    }catch(error){show(error.message,'error');}finally{busy(false);}
  });
  if(mode==='account'){
    const user=await auth.getCurrentUser();if(!user){location.href='iniciar-sesion/';return;}
    document.querySelector('[data-account-email]').textContent=user.email||'';const profile=await window.DMCloudStorage.getBusinessProfile();document.querySelector('[name="fullName"]').value=user.user_metadata?.full_name||'';document.querySelector('[name="businessName"]').value=profile.name||'';
    form?.addEventListener('submit',async event=>{event.preventDefault();const data=Object.fromEntries(new FormData(form));busy(true);try{const {error}=await window.DMSupabase.auth.updateUser({data:{full_name:data.fullName}});if(error)throw error;await window.DMCloudStorage.saveBusinessProfile({...profile,name:data.businessName});show('Cambios guardados.','success');}catch(error){show('No pudimos guardar los cambios.','error');}finally{busy(false);}});
    document.querySelector('[data-sign-out]')?.addEventListener('click',async()=>{await auth.signOut();location.href='../negocios/';});
    const preview=await window.DMMigration.localPreview(),box=document.querySelector('[data-migration]');
    if(box&&preview.hasData){box.hidden=false;box.querySelector('[data-migration-counts]').textContent=`Clientes: ${preview.counts.customers} · Cotizaciones: ${preview.counts.quotes} · Facturas: ${preview.counts.invoices} · Ingresos: ${preview.counts.incomes} · Gastos: ${preview.counts.expenses}`;box.querySelector('[data-import-local]').addEventListener('click',async()=>{const cloud=await window.DMMigration.cloudCounts(),hasCloud=Object.values(cloud).some(Boolean);if(hasCloud&&!confirm('Tu cuenta ya contiene datos. La importación actualizará registros con el mismo identificador y conservará los demás. ¿Continuar?'))return;if(!confirm('¿Copiar estos datos locales a tu cuenta? La copia local se conservará.'))return;show('Importando…');try{await window.DMMigration.importLocal({allowExisting:hasCloud});show('Tus datos se copiaron a tu cuenta. Los datos locales siguen guardados en este dispositivo.','success');}catch(error){show(error.message,'error');}});}
  }
})();
