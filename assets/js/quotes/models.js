(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DMQuoteModels = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const countryCurrency = { México: 'MXN', Colombia: 'COP', Perú: 'PEN', Chile: 'CLP', Argentina: 'ARS', Otro: 'USD' };
  const currencies = ['MXN', 'COP', 'PEN', 'CLP', 'ARS', 'USD', 'EUR'];
  const statuses = ['borrador', 'enviada', 'aceptada', 'rechazada', 'vencida'];
  const invoiceStatuses = ['borrador', 'emitida', 'pagada', 'parcialmente_pagada', 'vencida', 'anulada'];
  const customerStatuses = ['active', 'archived'];
  const incomeStatuses = ['received', 'pending', 'cancelled'];
  const expenseStatuses = ['paid', 'pending', 'cancelled'];
  const incomeTypes = ['invoice_payment', 'manual_income', 'other'];
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  const isoDate = date => date.toISOString().slice(0, 10);
  const addDays = (date, days) => { const result = new Date(date); result.setDate(result.getDate() + days); return result; };

  function createItem(overrides = {}) {
    return { id: uid('item'), type: 'servicio', description: '', quantity: 1, unitPrice: 0, discountRate: 0, taxRate: 0, ...overrides };
  }
  function createCustomer(overrides = {}) {
    const now = new Date();
    return { id: uid('customer'), businessId: 'local-business', type: 'person', name: '', company: '', contactPerson: '', taxId: '', email: '', phone: '', address: '', city: '', stateRegion: '', postalCode: '', country: 'México', notes: '', status: 'active', createdAt: now.toISOString(), updatedAt: now.toISOString(), ...overrides };
  }
  function customerSnapshot(customer = {}) {
    return { name: customer.name || customer.contactPerson || '', company: customer.company || '', contactPerson: customer.contactPerson || '', phone: customer.phone || '', email: customer.email || '', taxId: customer.taxId || '', address: customer.address || '', city: customer.city || '', stateRegion: customer.stateRegion || '', postalCode: customer.postalCode || '', country: customer.country || 'Otro' };
  }
  function createIncome(overrides = {}) {
    const now=new Date();return { id:uid('income'),businessId:'local-business',customerId:'',invoiceId:'',type:'manual_income',description:'',amount:0,currency:'USD',date:isoDate(now),reminderDate:'',category:'Venta',paymentMethod:'Transferencia',reference:'',notes:'',status:'received',createdAt:now.toISOString(),updatedAt:now.toISOString(),...overrides };
  }
  function createExpense(overrides = {}) {
    const now=new Date();return { id:uid('expense'),businessId:'local-business',customerId:'',category:'Materiales',customCategory:'',description:'',vendor:'',amount:0,currency:'USD',date:isoDate(now),reminderDate:'',paymentMethod:'Transferencia',reference:'',notes:'',status:'paid',createdAt:now.toISOString(),updatedAt:now.toISOString(),...overrides };
  }

  function createQuote(overrides = {}) {
    const now = new Date();
    return {
      id: uid('quote'), businessId: 'local-business', customerId: uid('customer'), convertedInvoiceId: '', createdAt: now.toISOString(), updatedAt: now.toISOString(), status: 'borrador', quoteNumber: '', issueDate: isoDate(now), expiryDate: isoDate(addDays(now, 15)), quoteCountry: 'México', currency: 'MXN',
      business: { name: '', contact: '', phone: '', email: '', address: '', city: '', country: 'México', taxId: '', website: '', logoDataUrl: '' },
      customer: customerSnapshot({ country: 'México' }),
      items: [createItem()], notes: '', terms: '', ...overrides
    };
  }

  function duplicateQuote(source) {
    const now = new Date();
    const copy = JSON.parse(JSON.stringify(source));
    copy.id = uid('quote'); copy.customerId = uid('customer'); copy.convertedInvoiceId = ''; copy.createdAt = now.toISOString(); copy.updatedAt = now.toISOString(); copy.status = 'borrador';
    copy.items = (copy.items || []).map(item => ({ ...item, id: uid('item') }));
    return copy;
  }
  function createInvoice(overrides = {}) {
    const now = new Date();
    return {
      id: uid('invoice'), invoiceNumber: '', businessId: 'local-business', customerId: uid('customer'), sourceQuoteId: '', createdAt: now.toISOString(), updatedAt: now.toISOString(), issueDate: isoDate(now), dueDate: isoDate(addDays(now, 30)), country: 'México', currency: 'MXN', status: 'borrador',
      business: { name: '', contact: '', phone: '', email: '', address: '', city: '', country: 'México', taxId: '', website: '', logoDataUrl: '' },
      customer: customerSnapshot({ country: 'México' }),
      items: [createItem()], notes: '', terms: '', payment: { method: '', bank: '', reference: '', instructions: '' }, amountPaid: 0, ...overrides
    };
  }
  function duplicateInvoice(source) {
    const now = new Date(); const copy = JSON.parse(JSON.stringify(source));
    copy.id = uid('invoice'); copy.customerId = uid('customer'); copy.sourceQuoteId = ''; copy.createdAt = now.toISOString(); copy.updatedAt = now.toISOString(); copy.status = 'borrador'; copy.amountPaid = 0;
    copy.items = (copy.items || []).map(item => ({ ...item, id: uid('item') }));
    return copy;
  }
  function invoiceFromQuote(source) {
    const invoice = createInvoice({
      businessId: source.businessId || 'local-business', customerId: source.customerId || uid('customer'), sourceQuoteId: source.id || '', country: source.quoteCountry || 'Otro', currency: source.currency || 'USD',
      business: JSON.parse(JSON.stringify(source.business || {})), customer: JSON.parse(JSON.stringify(source.customer || {})), items: (source.items || []).map(item => ({ ...item, id: uid('item') })), notes: source.notes || '', terms: source.terms || ''
    });
    return invoice;
  }
  return { countryCurrency, currencies, statuses, invoiceStatuses, customerStatuses, incomeStatuses, expenseStatuses, incomeTypes, uid, createItem, createCustomer, customerSnapshot, createIncome, createExpense, createQuote, duplicateQuote, createInvoice, duplicateInvoice, invoiceFromQuote };
}));
