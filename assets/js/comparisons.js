(() => {
  'use strict';

  const search = document.querySelector('[data-comparison-search]');
  const filters = [...document.querySelectorAll('[data-comparison-filter]')];
  const cards = [...document.querySelectorAll('[data-comparison-card]')];
  const empty = document.querySelector('[data-comparison-empty]');
  const count = document.querySelector('[data-comparison-count]');

  if (!cards.length) return;

  const normalize = (value) => value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

  let provider = 'all';
  const update = () => {
    const query = normalize(search?.value.trim() || '');
    let visible = 0;
    cards.forEach((card) => {
      const matchesProvider = provider === 'all' || (card.dataset.providers || '').split(' ').includes(provider);
      const matchesSearch = !query || normalize(card.textContent).includes(query);
      card.hidden = !(matchesProvider && matchesSearch);
      if (!card.hidden) visible += 1;
    });
    filters.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.comparisonFilter === provider)));
    if (count) count.textContent = `${visible} ${visible === 1 ? 'comparación' : 'comparaciones'}`;
    if (empty) empty.hidden = visible !== 0;
  };

  search?.addEventListener('input', update);
  filters.forEach((button) => button.addEventListener('click', () => {
    provider = button.dataset.comparisonFilter || 'all';
    update();
  }));
  update();
})();
