(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {root.DMLocalStorage=api;const facade={},resources={saveCustomer:['Customer','customers'],saveQuote:['Quote','quotes'],saveInvoice:['Invoice','invoices'],saveIncome:['Income','incomes'],saveExpense:['Expense','expenses']};Object.keys(api).forEach(name=>{facade[name]=typeof api[name]==='function'?async(...args)=>{await(root.DMCloudReady||Promise.resolve());const cloud=root.DMAuth&&root.DMCloudStorage&&await root.DMAuth.getCurrentUser(),target=cloud&&name!=='clearAll'&&name!=='deleteBusinessProfile'?root.DMCloudStorage:api;if(cloud&&resources[name]&&root.DMPlanService){const [kind,resource]=resources[name],existing=await target[`get${kind}`](args[0]?.id);if(!existing)await root.DMPlanService.beforeCreate(resource);}const result=await target[name](...args);if(cloud&&resources[name]&&root.DMAutomationService)root.DMAutomationService.evaluate().catch(()=>{});return result;}:api[name];});facade.mode=async()=>{await(root.DMCloudReady||Promise.resolve());return root.DMAuth&&await root.DMAuth.getCurrentUser()?'cloud':'local';};root.DMQuoteStorage=facade;}
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const DB_NAME = 'dineromundo-business';
  const DB_VERSION = 4;
  let databasePromise;
  function open() {
    if (!('indexedDB' in globalThis)) return Promise.reject(new Error('IndexedDB no está disponible en este navegador.'));
    if (databasePromise) return databasePromise;
    databasePromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains('quotes')) { const store = db.createObjectStore('quotes', { keyPath: 'id' }); store.createIndex('updatedAt', 'updatedAt'); } if (!db.objectStoreNames.contains('invoices')) { const store = db.createObjectStore('invoices', { keyPath: 'id' }); store.createIndex('updatedAt', 'updatedAt'); } if (!db.objectStoreNames.contains('customers')) { const store = db.createObjectStore('customers', { keyPath: 'id' }); store.createIndex('updatedAt', 'updatedAt'); store.createIndex('status', 'status'); } ['incomes','expenses'].forEach(name=>{if(!db.objectStoreNames.contains(name)){const store=db.createObjectStore(name,{keyPath:'id'});store.createIndex('updatedAt','updatedAt');store.createIndex('date','date');store.createIndex('status','status');}}); if (!db.objectStoreNames.contains('profiles')) db.createObjectStore('profiles', { keyPath: 'id' }); if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' }); };
      request.onsuccess = () => { const db=request.result;db.onversionchange=()=>{db.close();databasePromise=null;};resolve(db); }; request.onerror = () => reject(request.error || new Error('No se pudo abrir el almacenamiento local.'));request.onblocked=()=>reject(new Error('Cierra o actualiza otras pestañas de DineroMundo para completar la actualización del almacenamiento local.'));
    });
    return databasePromise;
  }
  async function transaction(storeName, mode, action) {
    const db = await open();
    return new Promise((resolve, reject) => { const tx = db.transaction(storeName, mode); const store = tx.objectStore(storeName); let result; try { result = action(store); } catch (error) { reject(error); return; } tx.oncomplete = () => resolve(result?.result ?? result); tx.onerror = () => reject(tx.error || new Error('No se pudo completar la operación local.')); tx.onabort = () => reject(tx.error || new Error('La operación local fue cancelada.')); });
  }
  const saveQuote = quote => transaction('quotes', 'readwrite', store => store.put(quote)).then(() => quote);
  const getQuote = id => transaction('quotes', 'readonly', store => store.get(id));
  const getQuotes = () => transaction('quotes', 'readonly', store => store.getAll()).then(rows => (rows || []).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))));
  const deleteQuote = id => transaction('quotes', 'readwrite', store => store.delete(id));
  const saveInvoice = invoice => transaction('invoices', 'readwrite', store => store.put(invoice)).then(() => invoice);
  const getInvoice = id => transaction('invoices', 'readonly', store => store.get(id));
  const getInvoices = () => transaction('invoices', 'readonly', store => store.getAll()).then(rows => (rows || []).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))));
  const deleteInvoice = id => transaction('invoices', 'readwrite', store => store.delete(id));
  const saveCustomer = customer => transaction('customers', 'readwrite', store => store.put(customer)).then(() => customer);
  const getCustomer = id => transaction('customers', 'readonly', store => store.get(id));
  const getCustomers = () => transaction('customers', 'readonly', store => store.getAll()).then(rows => (rows || []).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt))));
  const deleteCustomer = id => transaction('customers', 'readwrite', store => store.delete(id));
  const archiveCustomer = async id => { const customer=await getCustomer(id);if(!customer)return null;customer.status='archived';customer.updatedAt=new Date().toISOString();return saveCustomer(customer); };
  const restoreCustomer = async id => { const customer=await getCustomer(id);if(!customer)return null;customer.status='active';customer.updatedAt=new Date().toISOString();return saveCustomer(customer); };
  const findCustomers = async query => { const needle=String(query||'').trim().toLocaleLowerCase('es');const rows=await getCustomers();return needle?rows.filter(row=>[row.name,row.company,row.email,row.phone].some(value=>String(value||'').toLocaleLowerCase('es').includes(needle))):rows; };
  const saveIncome=row=>transaction('incomes','readwrite',store=>store.put(row)).then(()=>row);const getIncome=id=>transaction('incomes','readonly',store=>store.get(id));const getIncomes=()=>transaction('incomes','readonly',store=>store.getAll()).then(rows=>(rows||[]).sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.updatedAt).localeCompare(String(a.updatedAt))));const deleteIncome=id=>transaction('incomes','readwrite',store=>store.delete(id));
  const saveExpense=row=>transaction('expenses','readwrite',store=>store.put(row)).then(()=>row);const getExpense=id=>transaction('expenses','readonly',store=>store.get(id));const getExpenses=()=>transaction('expenses','readonly',store=>store.getAll()).then(rows=>(rows||[]).sort((a,b)=>String(b.date).localeCompare(String(a.date))||String(b.updatedAt).localeCompare(String(a.updatedAt))));const deleteExpense=id=>transaction('expenses','readwrite',store=>store.delete(id));
  const saveBusinessProfile = profile => transaction('profiles', 'readwrite', store => store.put({ ...profile, id: 'primary' })).then(() => profile);
  const getBusinessProfile = () => transaction('profiles', 'readonly', store => store.get('primary'));
  const deleteBusinessProfile = () => transaction('profiles', 'readwrite', store => store.delete('primary'));
  async function nextQuoteNumber() {
    const year = new Date().getFullYear(); const key = `quote-sequence-${year}`; const db = await open();
    return new Promise((resolve, reject) => { const tx = db.transaction('meta', 'readwrite'); const store = tx.objectStore('meta'); const request = store.get(key); let next = 1; request.onsuccess = () => { next = Math.max(1, Number(request.result?.value || 0) + 1); store.put({ key, value: next }); }; tx.oncomplete = () => resolve(`COT-${year}-${String(next).padStart(4, '0')}`); tx.onerror = () => reject(tx.error || new Error('No se pudo generar el número local.')); });
  }
  async function nextInvoiceNumber() {
    const year = new Date().getFullYear(); const key = `invoice-sequence-${year}`; const db = await open();
    return new Promise((resolve, reject) => { const tx = db.transaction('meta', 'readwrite'); const store = tx.objectStore('meta'); const request = store.get(key); let next = 1; request.onsuccess = () => { next = Math.max(1, Number(request.result?.value || 0) + 1); store.put({ key, value: next }); }; tx.oncomplete = () => resolve(`FAC-${year}-${String(next).padStart(4, '0')}`); tx.onerror = () => reject(tx.error || new Error('No se pudo generar el número local.')); });
  }
  async function clearAll() { const db = await open(); return new Promise((resolve, reject) => { const names=['quotes','invoices','customers','incomes','expenses','profiles','meta'];const tx = db.transaction(names, 'readwrite'); names.forEach(name => tx.objectStore(name).clear()); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error || new Error('No se pudieron eliminar los datos locales.')); }); }
  async function exportData() { const profile = await getBusinessProfile(); return { schemaVersion: 4, version: 4, exportedAt: new Date().toISOString(), businessProfile: profile, profile, customers: await getCustomers(), quotes: await getQuotes(), invoices: await getInvoices(), incomes:await getIncomes(), expenses:await getExpenses() }; }
  async function importData(data) { const db = await open(); return new Promise((resolve, reject) => { const tx = db.transaction(['quotes', 'invoices', 'customers','incomes','expenses', 'profiles'], 'readwrite'); data.quotes.forEach(row => tx.objectStore('quotes').put(row)); (data.invoices || []).forEach(row => tx.objectStore('invoices').put(row)); (data.customers || []).forEach(row => tx.objectStore('customers').put(row));(data.incomes||[]).forEach(row=>tx.objectStore('incomes').put(row));(data.expenses||[]).forEach(row=>tx.objectStore('expenses').put(row)); const profile = data.businessProfile || data.profile; if (profile) tx.objectStore('profiles').put({ ...profile, id: 'primary' }); tx.oncomplete = resolve; tx.onerror = () => reject(tx.error || new Error('No se pudo restaurar el respaldo.')); }); }
  return { saveQuote, getQuote, getQuotes, deleteQuote, saveInvoice, getInvoice, getInvoices, deleteInvoice, saveCustomer, getCustomer, getCustomers, deleteCustomer, archiveCustomer, restoreCustomer, findCustomers, saveIncome,getIncome,getIncomes,deleteIncome,saveExpense,getExpense,getExpenses,deleteExpense, saveBusinessProfile, getBusinessProfile, deleteBusinessProfile, nextQuoteNumber, nextInvoiceNumber, clearAll, exportData, importData };
}));
