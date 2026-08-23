(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DMQuoteValidation = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const allowedImage = /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i;
  const text = (value, max = 2000) => typeof value === 'string' ? value.slice(0, max) : '';
  const number = (value, max = 1000000000000) => { const parsed = Number(value); return Number.isFinite(parsed) ? Math.min(max, Math.max(0, parsed)) : 0; };
  const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value || '') ? value : '';
  const logo = value => typeof value === 'string' && value.length <= 2100000 && allowedImage.test(value) ? value : '';
  function sanitizeQuote(raw, models) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('La cotización no tiene un formato válido.');
    const base = models.createQuote();
    const countries = Object.keys(models.countryCurrency);
    const business = raw.business && typeof raw.business === 'object' ? raw.business : {};
    const customer = raw.customer && typeof raw.customer === 'object' ? raw.customer : {};
    const items = Array.isArray(raw.items) ? raw.items.slice(0, 100).map(item => ({
      id: text(item?.id, 80) || models.uid('item'), type: item?.type === 'producto' ? 'producto' : 'servicio', description: text(item?.description, 300), quantity: number(item?.quantity, 1000000), unitPrice: number(item?.unitPrice), discountRate: number(item?.discountRate, 100), taxRate: number(item?.taxRate, 100)
    })) : [];
    return {
      ...base, id: text(raw.id, 100) || base.id, businessId: text(raw.businessId, 100) || 'local-business', customerId: text(raw.customerId, 100) || models.uid('customer'), convertedInvoiceId: text(raw.convertedInvoiceId, 100), createdAt: text(raw.createdAt, 40) || base.createdAt, updatedAt: text(raw.updatedAt, 40) || base.updatedAt,
      status: models.statuses.includes(raw.status) ? raw.status : 'borrador', quoteNumber: text(raw.quoteNumber, 40), issueDate: date(raw.issueDate) || base.issueDate, expiryDate: date(raw.expiryDate) || base.expiryDate, quoteCountry: countries.includes(raw.quoteCountry) ? raw.quoteCountry : 'Otro', currency: models.currencies.includes(raw.currency) ? raw.currency : 'USD',
      business: { name: text(business.name, 120), contact: text(business.contact, 120), phone: text(business.phone, 40), email: text(business.email, 160), address: text(business.address, 200), city: text(business.city, 100), country: countries.includes(business.country) ? business.country : 'Otro', taxId: text(business.taxId, 80), website: text(business.website, 200), logoDataUrl: logo(business.logoDataUrl) },
      customer: { name: text(customer.name, 120), company: text(customer.company, 120), contactPerson: text(customer.contactPerson, 120), phone: text(customer.phone, 40), email: text(customer.email, 160), taxId: text(customer.taxId, 80), address: text(customer.address, 200), city: text(customer.city, 100), stateRegion: text(customer.stateRegion, 100), postalCode: text(customer.postalCode, 30), country: countries.includes(customer.country) ? customer.country : 'Otro' },
      items: items.length ? items : [models.createItem()], notes: text(raw.notes, 1500), terms: text(raw.terms, 2000)
    };
  }
  function sanitizeProfile(raw, models) {
    const quote = sanitizeQuote({ business: raw, items: [{}] }, models);
    return { id: 'primary', ...quote.business, updatedAt: new Date().toISOString() };
  }
  function sanitizeInvoice(raw, models) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('La factura no tiene un formato válido.');
    const base = models.createInvoice(); const countries = Object.keys(models.countryCurrency);
    const common = sanitizeQuote({ ...raw, quoteNumber: raw.invoiceNumber, quoteCountry: raw.country, expiryDate: raw.dueDate, status: 'borrador' }, models);
    const payment = raw.payment && typeof raw.payment === 'object' ? raw.payment : {};
    return {
      ...base, id: text(raw.id, 100) || base.id, recurringTemplateId:text(raw.recurringTemplateId,100),recurrenceRunId:text(raw.recurrenceRunId,100),invoiceNumber: text(raw.invoiceNumber, 40), businessId: text(raw.businessId, 100) || 'local-business', customerId: text(raw.customerId, 100) || models.uid('customer'), sourceQuoteId: text(raw.sourceQuoteId, 100), createdAt: text(raw.createdAt, 40) || base.createdAt, updatedAt: text(raw.updatedAt, 40) || base.updatedAt,
      issueDate: date(raw.issueDate) || base.issueDate, dueDate: date(raw.dueDate) || base.dueDate, country: countries.includes(raw.country) ? raw.country : 'Otro', currency: models.currencies.includes(raw.currency) ? raw.currency : 'USD', status: models.invoiceStatuses.includes(raw.status) ? raw.status : 'borrador',
      business: common.business, customer: common.customer, items: common.items, notes: text(raw.notes, 1500), terms: text(raw.terms, 2000), amountPaid: number(raw.amountPaid),
      payment: { method: text(payment.method, 120), bank: text(payment.bank, 160), reference: text(payment.reference, 160), instructions: text(payment.instructions, 1500) }
    };
  }
  function sanitizeCustomer(raw, models) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('El cliente no tiene un formato válido.');
    const base=models.createCustomer(),countries=Object.keys(models.countryCurrency);const email=text(raw.email,160).trim();
    if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Un cliente contiene un correo electrónico no válido.');
    return { ...base,id:text(raw.id,100)||base.id,businessId:text(raw.businessId,100)||'local-business',type:raw.type==='company'?'company':'person',name:text(raw.name,120),company:text(raw.company,120),contactPerson:text(raw.contactPerson,120),taxId:text(raw.taxId,80),email,phone:text(raw.phone,40),address:text(raw.address,200),city:text(raw.city,100),stateRegion:text(raw.stateRegion,100),postalCode:text(raw.postalCode,30),country:countries.includes(raw.country)?raw.country:'Otro',notes:text(raw.notes,2000),status:models.customerStatuses.includes(raw.status)?raw.status:'active',createdAt:text(raw.createdAt,40)||base.createdAt,updatedAt:text(raw.updatedAt,40)||base.updatedAt };
  }
  function sanitizeIncome(raw, models) {
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('El ingreso no tiene un formato válido.');const base=models.createIncome(),amount=Number(raw.amount);if(!Number.isFinite(amount)||amount<0)throw new Error('Un ingreso contiene un monto no válido.');return {...base,id:text(raw.id,100)||base.id,businessId:text(raw.businessId,100)||'local-business',customerId:text(raw.customerId,100),invoiceId:text(raw.invoiceId,100),type:models.incomeTypes.includes(raw.type)?raw.type:'manual_income',description:text(raw.description,240),amount:number(amount),currency:models.currencies.includes(raw.currency)?raw.currency:'USD',date:date(raw.date)||base.date,reminderDate:date(raw.reminderDate),category:text(raw.category,100)||'Otro',paymentMethod:text(raw.paymentMethod,80)||'Otro',reference:text(raw.reference,160),notes:text(raw.notes,2000),status:models.incomeStatuses.includes(raw.status)?raw.status:'received',createdAt:text(raw.createdAt,40)||base.createdAt,updatedAt:text(raw.updatedAt,40)||base.updatedAt};
  }
  function sanitizeExpense(raw, models) {
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('El gasto no tiene un formato válido.');const base=models.createExpense(),amount=Number(raw.amount);if(!Number.isFinite(amount)||amount<0)throw new Error('Un gasto contiene un monto no válido.');return {...base,id:text(raw.id,100)||base.id,recurringTemplateId:text(raw.recurringTemplateId,100),recurrenceRunId:text(raw.recurrenceRunId,100),businessId:text(raw.businessId,100)||'local-business',customerId:text(raw.customerId,100),category:text(raw.category,100)||'Otros',customCategory:text(raw.customCategory,100),description:text(raw.description,240),vendor:text(raw.vendor,160),amount:number(amount),currency:models.currencies.includes(raw.currency)?raw.currency:'USD',date:date(raw.date)||base.date,reminderDate:date(raw.reminderDate),paymentMethod:text(raw.paymentMethod,80)||'Otro',reference:text(raw.reference,160),notes:text(raw.notes,2000),status:models.expenseStatuses.includes(raw.status)?raw.status:'paid',createdAt:text(raw.createdAt,40)||base.createdAt,updatedAt:text(raw.updatedAt,40)||base.updatedAt};
  }
  function validateBackup(raw, models) {
    const version = Number(raw?.schemaVersion ?? raw?.version);
    if (!raw || typeof raw !== 'object' || ![1, 2, 3, 4, 5, 6].includes(version) || !Array.isArray(raw.quotes) || raw.quotes.length > 500 || (version >= 2 && raw.invoices != null && (!Array.isArray(raw.invoices) || raw.invoices.length > 500)) || (version >= 3 && raw.customers != null && (!Array.isArray(raw.customers) || raw.customers.length > 1000)) || (version>=4&&((raw.incomes!=null&&!Array.isArray(raw.incomes))||(raw.expenses!=null&&!Array.isArray(raw.expenses))||(raw.incomes?.length||0)>2000||(raw.expenses?.length||0)>2000)) || (version>=5&&(raw.automationRules!=null&&!Array.isArray(raw.automationRules)||(raw.automationRules?.length||0)>100)) || (version===6&&(raw.recurringTemplates!=null&&!Array.isArray(raw.recurringTemplates)||(raw.recurringTemplates?.length||0)>100))) throw new Error('El archivo no es un respaldo válido de DineroMundo.');
    const quotes = raw.quotes.map(quote => sanitizeQuote(quote, models));
    const invoices = (raw.invoices || []).slice(0, 500).map(invoice => sanitizeInvoice(invoice, models));
    const customers = (raw.customers || []).slice(0, 1000).map(customer => sanitizeCustomer(customer, models));
    const incomes=(raw.incomes||[]).slice(0,2000).map(row=>sanitizeIncome(row,models));const expenses=(raw.expenses||[]).slice(0,2000).map(row=>sanitizeExpense(row,models));
    const profileSource = raw.businessProfile || raw.profile;
    const profile = profileSource ? sanitizeProfile(profileSource, models) : null;
    const automationRules=(raw.automationRules||[]).filter(row=>row&&typeof row==='object').map(row=>({id:text(row.id,100),type:text(row.type,40),name:text(row.name,160),enabled:false,triggerType:'condition',triggerConfig:row.triggerConfig&&typeof row.triggerConfig==='object'?row.triggerConfig:{},actionType:'in_app_reminder',actionConfig:{}}));const recurringTemplates=(raw.recurringTemplates||[]).filter(row=>row&&typeof row==='object').map(row=>({...row,id:text(row.id,100),name:text(row.name,160),type:['invoice','expense'].includes(row.type)?row.type:'',frequency:['weekly','monthly','quarterly','yearly'].includes(row.frequency)?row.frequency:'',interval:Math.max(1,Math.min(24,Number(row.interval)||1)),startDate:date(row.startDate),endDate:date(row.endDate),enabled:false,template:row.template&&typeof row.template==='object'?row.template:{}})).filter(row=>row.type&&row.frequency&&row.startDate);const outputVersion=version>=5?version:4;return { schemaVersion: outputVersion, version: outputVersion, quotes, invoices, customers, incomes, expenses, automationRules, recurringTemplates, profile, businessProfile: profile };
  }
  function validateForm(form, quote) {
    const errors = [];
    if (!quote.business.name.trim()) errors.push('Escribe el nombre del negocio.');
    if (!quote.customer.name.trim()) errors.push('Escribe el nombre del cliente.');
    if (!quote.quoteNumber.trim()) errors.push('Escribe el número de cotización.');
    if (!date(quote.issueDate) || !date(quote.expiryDate)) errors.push('Revisa las fechas de la cotización.');
    if (!quote.items.length || quote.items.every(item => !item.description.trim())) errors.push('Agrega al menos una partida con descripción.');
    if (form.elements.businessEmail.value && !form.elements.businessEmail.validity.valid) errors.push('Revisa el correo del negocio.');
    if (form.elements.customerEmail.value && !form.elements.customerEmail.validity.valid) errors.push('Revisa el correo del cliente.');
    if (form.elements.businessWebsite.value && !form.elements.businessWebsite.validity.valid) errors.push('Revisa el sitio web del negocio.');
    return errors;
  }
  function validateInvoiceForm(form, invoice) {
    const errors = [];
    if (!invoice.business.name.trim()) errors.push('Escribe el nombre del negocio.');
    if (!invoice.customer.name.trim()) errors.push('Escribe el nombre del cliente.');
    if (!invoice.invoiceNumber.trim()) errors.push('Escribe el número de factura.');
    if (!date(invoice.issueDate) || !date(invoice.dueDate)) errors.push('Revisa las fechas de la factura.');
    if (invoice.dueDate < invoice.issueDate) errors.push('La fecha de vencimiento no puede ser anterior a la fecha de emisión.');
    if (!invoice.items.length || invoice.items.every(item => !item.description.trim())) errors.push('Agrega al menos una partida con descripción.');
    if (form.elements.businessEmail.value && !form.elements.businessEmail.validity.valid) errors.push('Revisa el correo del negocio.');
    if (form.elements.customerEmail.value && !form.elements.customerEmail.validity.valid) errors.push('Revisa el correo del cliente.');
    if (form.elements.businessWebsite.value && !form.elements.businessWebsite.validity.valid) errors.push('Revisa el sitio web del negocio.');
    return errors;
  }
  function validateCustomerForm(form, customer) {
    const errors=[];if(!customer.name.trim()&&!customer.company.trim())errors.push('Escribe el nombre de la persona o de la empresa.');if(form.elements.email.value&&!form.elements.email.validity.valid)errors.push('Revisa el correo electrónico.');return errors;
  }
  function validateLedgerForm(entry){const errors=[];if(!entry.description.trim())errors.push('Escribe una descripción.');if(!Number.isFinite(Number(entry.amount))||Number(entry.amount)<=0)errors.push('El monto debe ser mayor que cero.');if(!date(entry.date))errors.push('Revisa la fecha.');return errors;}
  return { allowedImage, sanitizeQuote, sanitizeInvoice, sanitizeCustomer, sanitizeIncome, sanitizeExpense, sanitizeProfile, validateBackup, validateForm, validateInvoiceForm, validateCustomerForm, validateLedgerForm };
}));
