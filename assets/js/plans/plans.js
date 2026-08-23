(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DMPlans=api;}(typeof self!=='undefined'?self:this,function(){'use strict';
  const unlimited=null;
  const PLANS=Object.freeze({
    free:{id:'free',displayName:'Gratis',monthlyPrice:0,currency:'USD',limits:{customers:10,quotes:5,invoices:5,incomes:25,expenses:25,automationRules:0,recurringTemplates:0},features:{cloudStorage:true,multiDevice:true,pdf:true,basicDashboard:true,advancedDashboard:false,dataExport:true,automationLevel:'none',multipleBusinesses:false}},
    starter:{id:'starter',displayName:'Starter',monthlyPrice:9,currency:'USD',limits:{customers:100,quotes:50,invoices:50,incomes:250,expenses:250,automationRules:3,recurringTemplates:3},features:{cloudStorage:true,multiDevice:true,pdf:true,basicDashboard:true,advancedDashboard:true,dataExport:true,automationLevel:'limited',multipleBusinesses:false}},
    business:{id:'business',displayName:'Negocio',monthlyPrice:19,currency:'USD',limits:{customers:500,quotes:200,invoices:200,incomes:1000,expenses:1000,automationRules:10,recurringTemplates:15},features:{cloudStorage:true,multiDevice:true,pdf:true,basicDashboard:true,advancedDashboard:true,dataExport:true,automationLevel:'higher',multipleBusinesses:false}},
    pro:{id:'pro',displayName:'Pro',monthlyPrice:39,currency:'USD',limits:{customers:unlimited,quotes:unlimited,invoices:unlimited,incomes:unlimited,expenses:unlimited,automationRules:unlimited,recurringTemplates:unlimited},features:{cloudStorage:true,multiDevice:true,pdf:true,basicDashboard:true,advancedDashboard:true,dataExport:true,automationLevel:'highest',multipleBusinesses:false}}
  });
  const getPlan=code=>PLANS[code]||PLANS.free;
  const getPlanLimit=(code,resource)=>getPlan(code).limits[resource]??null;
  const hasFeature=(code,feature)=>Boolean(getPlan(code).features[feature]);
  const isWithinLimit=(code,resource,used)=>{const limit=getPlanLimit(code,resource);return limit===null||Number(used)<limit;};
  const monthKey=value=>/^\d{4}-\d{2}/.test(String(value||''))?String(value).slice(0,7):'';
  function getPlanUsage({customers=[],quotes=[],invoices=[],incomes=[],expenses=[]}={},now=new Date()){const current=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;const monthly=rows=>(Array.isArray(rows)?rows:[]).filter(row=>monthKey(row.createdAt||row.date||row.issueDate)===current).length;return {customers:(Array.isArray(customers)?customers:[]).filter(row=>row&&row.status!=='archived').length,quotes:monthly(quotes),invoices:monthly(invoices),incomes:monthly(incomes),expenses:monthly(expenses),month:current};}
  function usageState(code,resource,used){const plan=getPlan(code),limit=getPlanLimit(code,resource);return {resource,used:Number(used)||0,limit,unlimited:limit===null,allowed:limit===null||used<limit,percentage:limit===null?0:Math.min(100,Math.round((Number(used)||0)/limit*100)),warning:limit!==null&&used>=limit*.8&&used<limit,reached:limit!==null&&used>=limit,plan};}
  return {PLANS,getPlan,getPlanLimit,hasFeature,isWithinLimit,getPlanUsage,usageState};
}));
