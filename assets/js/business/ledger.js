(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DMLedger=api;}(typeof self!=='undefined'?self:this,function(){'use strict';
  const money=(value,currency)=>new Intl.NumberFormat('es-419',{style:'currency',currency:currency||'USD',maximumFractionDigits:2}).format(Number(value)||0);
  const groupTotals=(rows,predicate=()=>true)=>rows.filter(predicate).reduce((out,row)=>{out[row.currency]=(out[row.currency]||0)+Number(row.amount||0);return out;},{});
  const monthKey=value=>String(value||'').slice(0,7);
  const invoicePayments=(invoice,incomes,calculate)=>{const total=calculate(invoice.items||[]).total;const received=incomes.filter(row=>row.invoiceId===invoice.id&&row.status==='received'&&row.currency===invoice.currency).reduce((sum,row)=>sum+Number(row.amount||0),0);return {total,paid:received,balance:Math.max(0,total-received),status:received<=0?invoice.status:received+0.005>=total?'pagada':'parcialmente_pagada'};};
  return {money,groupTotals,monthKey,invoicePayments};
}));
