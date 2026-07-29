(() => {
  'use strict';

  const search = document.querySelector('[data-learning-search]');
  const buttons = [...document.querySelectorAll('[data-learning-filter]')];
  const cards = [...document.querySelectorAll('[data-learning-card]')];
  const count = document.querySelector('[data-learning-count]');
  const empty = document.querySelector('[data-learning-empty]');

  if (!cards.length) return;

  const normalize = (value) => value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');

  let category = 'all';
  const apply = () => {
    const query = normalize(search?.value.trim() || '');
    let visible = 0;
    cards.forEach((card) => {
      const matchesCategory = category === 'all' || card.dataset.category === category;
      const matchesSearch = !query || normalize(card.textContent).includes(query);
      card.hidden = !(matchesCategory && matchesSearch);
      if (!card.hidden) visible += 1;
    });
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.learningFilter === category)));
    if (count) count.textContent = `${visible} ${visible === 1 ? 'guía' : 'guías'}`;
    if (empty) empty.hidden = visible !== 0;
  };

  search?.addEventListener('input', apply);
  buttons.forEach((button) => button.addEventListener('click', () => {
    category = button.dataset.learningFilter || 'all';
    apply();
  }));
  apply();
})();
