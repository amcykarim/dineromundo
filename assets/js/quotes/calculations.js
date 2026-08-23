(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.DMQuoteCalculations = api;
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
  const clampRate = value => Math.min(100, Math.max(0, finite(value)));
  const roundMoney = value => Math.round((finite(value) + Number.EPSILON) * 100) / 100;
  function calculateItem(item) {
    const quantity = Math.max(0, finite(item.quantity));
    const unitPrice = Math.max(0, finite(item.unitPrice));
    const discountRate = clampRate(item.discountRate);
    const taxRate = clampRate(item.taxRate);
    const subtotal = roundMoney(quantity * unitPrice);
    const discount = roundMoney(subtotal * discountRate / 100);
    const taxable = roundMoney(subtotal - discount);
    const tax = roundMoney(taxable * taxRate / 100);
    return { quantity, unitPrice, discountRate, taxRate, subtotal, discount, taxable, tax, total: roundMoney(taxable + tax) };
  }
  function calculateQuote(items) {
    const lines = (Array.isArray(items) ? items : []).map(item => ({ item, ...calculateItem(item) }));
    const sum = key => roundMoney(lines.reduce((total, line) => total + line[key], 0));
    return { lines, subtotal: sum('subtotal'), discount: sum('discount'), tax: sum('tax'), total: sum('total') };
  }
  function formatMoney(value, currency = 'USD') {
    const safeCurrency = ['MXN', 'COP', 'PEN', 'CLP', 'ARS', 'USD', 'EUR'].includes(currency) ? currency : 'USD';
    return new Intl.NumberFormat('es-419', { style: 'currency', currency: safeCurrency, maximumFractionDigits: safeCurrency === 'CLP' ? 0 : 2 }).format(finite(value));
  }
  return { finite, clampRate, roundMoney, calculateItem, calculateQuote, formatMoney };
}));
