(() => {
  'use strict';

  const search = document.querySelector('[data-provider-search]');
  const filter = document.querySelector('[data-provider-filter]');
  const cards = [...document.querySelectorAll('[data-provider-card]')];
  const empty = document.querySelector('[data-provider-empty]');
  const count = document.querySelector('[data-provider-count]');

  if (!cards.length || (!search && !filter)) return;

  const normalize = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

  const applyFilters = () => {
    const query = normalize(search?.value.trim() || '');
    const capability = filter?.value || 'all';
    let visible = 0;

    cards.forEach((card) => {
      const capabilities = (card.dataset.capabilities || '').split(' ');
      const matchesSearch = !query || normalize(card.textContent).includes(query);
      const matchesCapability = capability === 'all' || capabilities.includes(capability);
      const matches = matchesSearch && matchesCapability;
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = `${visible} ${visible === 1 ? 'proveedor' : 'proveedores'}`;
  };

  search?.addEventListener('input', applyFilters);
  filter?.addEventListener('change', applyFilters);
  applyFilters();
})();
