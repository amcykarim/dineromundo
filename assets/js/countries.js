(() => {
  'use strict';

  const search = document.querySelector('[data-country-search]');
  const cards = [...document.querySelectorAll('[data-country-card]')];
  const empty = document.querySelector('[data-country-empty]');
  const count = document.querySelector('[data-country-count]');

  if (!search || !cards.length) return;

  const normalize = (value) => value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

  const filterCountries = () => {
    const query = normalize(search.value.trim());
    let visible = 0;

    cards.forEach((card) => {
      const matches = !query || normalize(card.textContent).includes(query);
      card.hidden = !matches;
      if (matches) visible += 1;
    });

    if (empty) empty.hidden = visible !== 0;
    if (count) count.textContent = `${visible} ${visible === 1 ? 'país' : 'países'}`;
  };

  search.addEventListener('input', filterCountries);
  filterCountries();
})();
