(() => {
  'use strict';
  const core=window.DMCalculatorCore;
  const money=(n,c='USD')=>new Intl.NumberFormat('es-US',{style:'currency',currency:c,maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
  const number=n=>new Intl.NumberFormat('es-US',{maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
  const pct=n=>Number.isFinite(n)?`${number(n)}%`:'No disponible';
  const date=d=>d instanceof Date&&!Number.isNaN(d)?new Intl.DateTimeFormat('es-US',{year:'numeric',month:'long'}).format(d):'No estimable';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copyText=async text=>{if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);const area=document.createElement('textarea');area.value=text;area.setAttribute('readonly','');area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();const ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('copy');};
  const item=(label,value,primary=false)=>`<div class="result-item${primary?' result-primary':''}"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`;
  const table=(headers,rows)=>`<div class="table-wrap"><table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
  const currency=form=>form.elements.currency?.value||'USD';
  const M=(n,form)=>money(n,currency(form));
  const renderers={
    budget:(r,f)=>item('Total de ingresos',M(r.income,f))+item('Total de gastos',M(r.expenses,f))+item('Dinero restante',M(r.remaining,f),true)+item('Porcentaje gastado',pct(r.spentPct))+item('Porcentaje ahorrado',pct(r.savedPct))+`<p class="result-status">${esc(r.status)}</p><div class="bar-chart" role="img" aria-label="Se utiliza ${number(Math.min(100,r.spentPct))}% del ingreso"><span style="width:${Math.min(100,Math.max(0,r.spentPct))}%"></span></div>`,
    savingsGoal:(r,f)=>item('Cantidad pendiente',M(r.needed,f),true)+item('Meses estimados',r.months===null?'No estimable':String(r.months))+item('Fecha estimada',r.months===null?'No estimable':date(r.completion))+item('Aporte requerido para la fecha',r.required===null?'Añade una fecha':M(r.required,f))+item('Progreso',pct(r.progress))+`<div class="bar-chart" role="img" aria-label="Progreso ${number(r.progress)}%"><span style="width:${r.progress}%"></span></div>`,
    emergency:(r,f)=>item('Fondo recomendado',M(r.goal,f),true)+item('Cantidad pendiente',M(r.needed,f))+item('Progreso actual',pct(r.progress))+item('Meses estimados',r.months===null?'Añade un aporte mensual':String(r.months))+`<div class="bar-chart" role="img" aria-label="Progreso ${number(r.progress)}%"><span style="width:${r.progress}%"></span></div>`,
    loan:(r,f)=>!r.base?'<p class="result-warning">Revisa el plazo y los valores ingresados.</p>':item('Pago mensual estándar',M(r.base.payment,f),true)+item('Pago con aporte adicional',M(r.withExtra.actual,f))+item('Interés total con aporte',M(r.withExtra.totalInterest,f))+item('Total pagado con aporte',M(r.withExtra.totalPaid,f))+item('Tiempo estimado',`${r.withExtra.months} meses`)+item('Interés ahorrado',M(r.interestSaved,f)),
    credit:(r,f)=>!r.base?'<p class="result-warning">El pago es demasiado bajo para reducir el saldo. Debe superar el interés mensual.</p>':item('Meses para pagar',String(r.plus.months),true)+item('Fecha estimada',date(r.plus.date))+item('Interés total',M(r.plus.interest,f))+item('Total pagado',M(r.plus.total,f))+item('Tiempo ahorrado',`${r.timeSaved} meses`)+item('Interés ahorrado',M(r.interestSaved,f)),
    compound:(r,f)=>item('Saldo final estimado',M(r.balance,f),true)+item('Total aportado',M(r.contributed,f))+item('Crecimiento estimado',M(r.growth,f))+table(['Año','Saldo','Aportado','Crecimiento'],r.rows.map(x=>`<tr><th scope="row">${x.year}</th><td>${M(x.balance,f)}</td><td>${M(x.contributed,f)}</td><td>${M(x.growth,f)}</td></tr>`)),
    dti:(r,f)=>item('Deuda mensual total',M(r.debt,f),true)+item('Relación deuda-ingreso',r.ratio===null?'No disponible':pct(r.ratio))+`<p class="result-status">${esc(r.interpretation)}</p>`,
    hourly:(r,f)=>item('Pago bruto semanal',M(r.weekly,f),true)+item('Bruto mensual estimado',M(r.monthly,f))+item('Pago bruto anual',M(r.annual,f))+item('Neto anual estimado',M(r.netAnnual,f))+item('Neto mensual estimado',M(r.netMonthly,f)),
    percentages:(r)=>item(r.label,r.value===null?'No se puede dividir entre cero':pct(r.value),true),
    tip:(r,f)=>item('Propina',M(r.tipAmount,f))+item('Total de la cuenta',M(r.total,f),true)+item('Total por persona',M(r.perPerson,f))+item('Propina por persona',M(r.tipPerPerson,f)),
    transfer:(r,f)=>item('Total pagado por quien envía',M(r.totalPaid,f),true)+item('Cantidad estimada recibida',number(r.received))+item('Margen estimado del tipo de cambio',r.markup===null?'Añade una tasa de referencia':pct(r.markup))+item('Costo total estimado',M(r.totalCost,f))+item('Costo efectivo',pct(r.effective)),
    inflation:(r,f)=>item('Costo futuro estimado',M(r.future,f),true)+item('Poder adquisitivo estimado',M(r.power,f))+item('Pérdida de poder adquisitivo',M(r.loss,f))+item('Cantidad futura equivalente',M(r.future,f))+table(['Año','Costo equivalente','Poder adquisitivo','Pérdida'],r.rows.map(x=>`<tr><th scope="row">${x.year}</th><td>${M(x.future,f)}</td><td>${M(x.power,f)}</td><td>${M(x.loss,f)}</td></tr>`))
  };
  const calculate={budget:core.budget,savingsGoal:core.savingsGoal,emergency:core.emergency,loan:core.loan,credit:core.credit,compound:core.compound,dti:core.dti,hourly:core.hourly,percentages:core.percentages,tip:core.tip,transfer:core.transfer,inflation:core.inflation};

  function setupCalculator(form){
    const type=form.dataset.calculator,result=document.querySelector('[data-results]'),error=form.querySelector('[data-errors]'),storage=`dm-calc-${type}`;
    const values=()=>Object.fromEntries([...new FormData(form).entries()].map(([k,v])=>[k,v]));
    const validate=()=>{const messages=[];form.querySelectorAll('[required]').forEach(input=>{if(input.value==='')messages.push(`Completa “${input.labels?.[0]?.textContent.trim()||input.name}”.`);});form.querySelectorAll('input[type=number]').forEach(input=>{const value=Number(input.value);if(input.value!==''&&(!Number.isFinite(value)||(input.min!==''&&value<Number(input.min))||(input.max!==''&&value>Number(input.max))))messages.push(`Revisa “${input.labels?.[0]?.textContent.trim()||input.name}”.`);});return [...new Set(messages)];};
    const run=(announce=true)=>{const errors=validate();if(errors.length){error.textContent=errors.join(' ');if(announce)error.focus();return;}error.textContent='';const v=values(),r=calculate[type](v);result.innerHTML=renderers[type](r,form);result.dataset.summary=`${document.querySelector('h1').textContent}\n${result.innerText}`;try{localStorage.setItem(storage,JSON.stringify(v));}catch{} };
    form.addEventListener('submit',e=>{e.preventDefault();run();});
    form.addEventListener('reset',()=>{setTimeout(()=>{try{localStorage.removeItem(storage);}catch{}result.innerHTML='<p class="result-empty">Completa el formulario para ver tus resultados.</p>';error.textContent='';},0);});
    try{const saved=JSON.parse(localStorage.getItem(storage)||'null');if(saved)Object.entries(saved).forEach(([k,v])=>{if(form.elements[k])form.elements[k].value=v;});}catch{}
    document.querySelector('[data-clear]')?.addEventListener('click',()=>{form.reset();try{localStorage.removeItem(storage);}catch{}});
    document.querySelector('[data-copy]')?.addEventListener('click',async e=>{const text=result.dataset.summary||result.innerText;try{await copyText(text);e.currentTarget.textContent='Resultados copiados';setTimeout(()=>e.currentTarget.textContent='Copiar resultados',1800);}catch{error.textContent='No fue posible copiar. Selecciona los resultados manualmente.';}});
    document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
    document.querySelectorAll('[data-tip]').forEach(btn=>btn.addEventListener('click',()=>{form.elements.tip.value=btn.dataset.tip;run(false);}));
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.querySelector('[data-calculator]');if(form)setupCalculator(form);
    const search=document.querySelector('[data-calc-search]'),filter=document.querySelector('[data-calc-category]'),cards=[...document.querySelectorAll('[data-calc-card]')],empty=document.querySelector('[data-filter-empty]');
    const apply=()=>{const q=(search?.value||'').toLocaleLowerCase('es'),cat=filter?.value||'all';let shown=0;cards.forEach(card=>{const ok=(!q||card.textContent.toLocaleLowerCase('es').includes(q))&&(cat==='all'||card.dataset.category===cat);card.hidden=!ok;if(ok)shown++;});if(empty)empty.hidden=shown!==0;};search?.addEventListener('input',apply);filter?.addEventListener('change',apply);
  });
})();
