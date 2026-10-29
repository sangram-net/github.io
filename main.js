(() => {
  const body = document.body;
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('nav-open', open);
      body.classList.toggle('menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('nav-open');
      body.classList.remove('menu-open');
    }));
  }

  const themeButton = document.querySelector('.theme-toggle');
  const storedTheme = (() => { try { return localStorage.getItem('sg-theme'); } catch (_) { return null; } })();
  if (storedTheme === 'dark') body.classList.add('dark-theme');
  if (themeButton) {
    themeButton.addEventListener('click', () => {
      body.classList.toggle('dark-theme');
      try { localStorage.setItem('sg-theme', body.classList.contains('dark-theme') ? 'dark' : 'light'); } catch (_) {}
    });
  }

  const filterButtons = [...document.querySelectorAll('.filter-btn')];
  const cards = [...document.querySelectorAll('#project-list .project-card')];
  const search = document.querySelector('#project-search');
  const empty = document.querySelector('#empty-state');
  let activeFilter = 'all';
  const updateProjects = () => {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'all' || card.dataset.category === activeFilter;
      const textMatch = !query || (card.dataset.search || '').includes(query) || card.innerText.toLowerCase().includes(query);
      const show = categoryMatch && textMatch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  };
  filterButtons.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    updateProjects();
  }));
  if (search) search.addEventListener('input', updateProjects);

  // A small reveal effect that respects reduced-motion preferences.
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const revealables = document.querySelectorAll('.project-card, .cert-card, .credential-row, .principles > div, .social-item');
    revealables.forEach(item => item.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealables.forEach(item => observer.observe(item));
  }
})();