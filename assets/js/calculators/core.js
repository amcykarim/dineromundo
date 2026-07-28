(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DMCalculatorCore = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const monthsBetween = (date) => Math.max(1, Math.ceil((new Date(date + 'T12:00:00') - new Date()) / 2629800000));
  const addMonths = (count) => { const d = new Date(); d.setMonth(d.getMonth() + Math.ceil(count)); return d; };

  function budget(v) {
    const income = finite(v.income), savings = finite(v.savings);
    const expenses = ['housing','utilities','food','transport','insurance','debts','savings','entertainment','other'].reduce((s,k)=>s+finite(v[k]),0);
    const remaining = income-expenses;
    return { income, expenses, remaining, spentPct: income ? expenses/income*100 : 0, savedPct: income ? savings/income*100 : 0, status: remaining > .005 ? 'Presupuesto positivo' : remaining < -.005 ? 'Gastas más de lo que ingresas' : 'Presupuesto equilibrado' };
  }
  function savingsGoal(v) {
    const goal=finite(v.goal), current=finite(v.current), monthly=finite(v.monthly), annual=finite(v.rate)/100, needed=Math.max(0,goal-current);
    let balance=current, months=0, cap=1200;
    while(balance<goal && months<cap){ balance=balance*(1+annual/12)+monthly; months++; if(monthly<=0 && annual<=0) break; }
    if(balance<goal) months=null;
    const targetMonths=v.targetDate?monthsBetween(v.targetDate):null;
    let required=null;
    if(targetMonths){ const r=annual/12; required=r===0?needed/targetMonths:(goal-current*Math.pow(1+r,targetMonths))*r/(Math.pow(1+r,targetMonths)-1); required=Math.max(0,required); }
    return { needed, months, completion:months===null?null:addMonths(months), required, progress:goal?Math.min(100,current/goal*100):0 };
  }
  function emergency(v){const expenses=finite(v.expenses),coverage=finite(v.coverage),current=finite(v.current),monthly=finite(v.monthly),goal=expenses*coverage,needed=Math.max(0,goal-current);return{goal,needed,progress:goal?Math.min(100,current/goal*100):0,months:needed===0?0:monthly>0?Math.ceil(needed/monthly):null};}
  function amortize(principal, annual, months, extra=0){if(principal<0||annual<0||months<=0)return null;let balance=principal,totalInterest=0,count=0;const r=annual/1200;const payment=r===0?principal/months:principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);const actual=payment+extra;if(actual<=principal*r&&principal>0)return null;while(balance>.005&&count<1200){const interest=balance*r;const paid=Math.min(balance+interest,actual);balance-=paid-interest;totalInterest+=interest;count++;}return{payment,actual,totalInterest,totalPaid:principal+totalInterest,months:count};}
  function loan(v){const p=finite(v.amount),rate=finite(v.rate),months=Math.round(finite(v.term)*(v.unit==='years'?12:1)),extra=finite(v.extra);const base=amortize(p,rate,months,0),withExtra=amortize(p,rate,months,extra);return{base,withExtra,interestSaved:base&&withExtra?Math.max(0,base.totalInterest-withExtra.totalInterest):0};}
  function credit(v){const p=finite(v.balance),rate=finite(v.rate),payment=finite(v.payment),extra=finite(v.extra);const simulate=(pay)=>{let b=p,i=0,m=0,r=rate/1200;if(pay<=b*r&&b>0)return null;while(b>.005&&m<1200){const interest=b*r,actual=Math.min(b+interest,pay);b-=actual-interest;i+=interest;m++;}return m>=1200?null:{months:m,interest:i,total:p+i,date:addMonths(m)};};const base=simulate(payment),plus=simulate(payment+extra);return{base,plus,timeSaved:base&&plus?base.months-plus.months:0,interestSaved:base&&plus?Math.max(0,base.interest-plus.interest):0};}
  function compound(v){const initial=finite(v.initial),monthly=finite(v.monthly),rate=finite(v.rate)/100,years=Math.min(100,Math.max(0,Math.round(finite(v.years)))),freq=finite(v.frequency,12);let balance=initial,rows=[];for(let y=1;y<=years;y++){for(let m=1;m<=12;m++){balance+=monthly;if(m%(12/freq)===0)balance*=1+rate/freq;}rows.push({year:y,balance,contributed:initial+monthly*12*y,growth:balance-(initial+monthly*12*y)});}const contributed=initial+monthly*12*years;return{balance,contributed,growth:balance-contributed,rows};}
  function dti(v){const income=finite(v.income),debt=['housing','vehicle','cards','student','other'].reduce((s,k)=>s+finite(v[k]),0),ratio=income?debt/income*100:null;let interpretation='Ingresa tus datos para ver una interpretación educativa.';if(ratio!==null)interpretation=ratio<20?'Nivel de deuda relativamente bajo.':ratio<36?'Nivel de deuda moderado.':ratio<43?'Nivel de deuda elevado; conviene revisar el presupuesto.':'Nivel de deuda alto; considera evaluar tus obligaciones con cuidado.';return{debt,ratio,interpretation};}
  function hourly(v){const hourly=finite(v.hourly),regular=finite(v.regular),overtime=finite(v.overtime),multiplier=finite(v.multiplier,1.5),weeks=finite(v.weeks),tax=Math.min(100,finite(v.tax))/100,weekly=hourly*regular+hourly*multiplier*overtime,annual=weekly*weeks;return{weekly,monthly:annual/12,annual,netAnnual:annual*(1-tax),netMonthly:annual*(1-tax)/12};}
  function percentages(v){const x=finite(v.x),y=finite(v.y),mode=v.mode;if(mode==='of')return{value:y*x/100,label:`${x}% de ${y}`};if(mode==='ratio')return{value:y===0?null:x/y*100,label:`${x} como porcentaje de ${y}`};return{value:x===0?null:(y-x)/Math.abs(x)*100,label:`Cambio de ${x} a ${y}`};}
  function tip(v){const bill=finite(v.bill),pct=finite(v.tip),people=Math.max(1,Math.round(finite(v.people,1))),tipAmount=bill*pct/100,total=bill+tipAmount;return{tipAmount,total,perPerson:total/people,tipPerPerson:tipAmount/people};}
  function transfer(v){const sent=finite(v.sent),fee=finite(v.fee),senderRate=finite(v.senderRate),referenceRate=finite(v.referenceRate),recipientFee=finite(v.recipientFee),received=Math.max(0,sent*senderRate-recipientFee),markup=referenceRate>0?(referenceRate-senderRate)/referenceRate*100:null,referenceReceived=sent*referenceRate,recipientFeeSender=referenceRate>0?recipientFee/referenceRate:0,totalCost=fee+recipientFeeSender+(referenceRate>0?Math.max(0,referenceReceived-sent*senderRate)/referenceRate:0),totalPaid=sent+fee;return{totalPaid,received,markup,totalCost,effective:sent?totalCost/sent*100:0};}
  function inflation(v){const amount=finite(v.amount),rate=finite(v.rate)/100,years=Math.min(100,Math.max(0,Math.round(finite(v.years)))),rows=[];for(let y=1;y<=years;y++){const future=amount*Math.pow(1+rate,y),power=amount/Math.pow(1+rate,y);rows.push({year:y,future,power,loss:amount-power});}const future=amount*Math.pow(1+rate,years),power=amount/Math.pow(1+rate,years);return{future,power,loss:amount-power,rows};}
  return {budget,savingsGoal,emergency,loan,credit,compound,dti,hourly,percentages,tip,transfer,inflation,finite};
}));
