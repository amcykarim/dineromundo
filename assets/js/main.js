(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');

  if (toggle && nav) {
    const closeMenu = (restoreFocus = false) => {
      const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      const label = toggle.querySelector('.sr-only');
      if (label) label.textContent = 'Abrir menú principal';
      if (restoreFocus && wasOpen) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeMenu();
      else {
        nav.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        const label = toggle.querySelector('.sr-only');
        if (label) label.textContent = 'Cerrar menú principal';
        nav.querySelector('a')?.focus();
      }
    });

    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024) closeMenu();
    });
  }

  document.querySelectorAll('[data-year], [data-current-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
})();
