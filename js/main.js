// Createx Construction — интерактив главной. Ванильный JS, без зависимостей.
(function () {
  'use strict';

  // ---------- Бургер-меню ----------
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // Закрываем меню по клику на пункт (якорная навигация).
    nav.addEventListener('click', (e) => {
      if (e.target.closest('.nav__link')) {
        nav.classList.remove('nav--open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- Hero: пагинация 01–04 ----------
  // В выгрузке макета есть только один фон, поэтому «слайды» меняют номер и
  // прогресс-полосу; фон общий. Структура готова к добавлению фото слайдов.
  const bullets = Array.from(document.querySelectorAll('.hero__bullet'));
  let heroIndex = 0;
  let heroTimer = null;

  function goHero(i) {
    heroIndex = (i + bullets.length) % bullets.length;
    bullets.forEach((b, idx) => {
      b.classList.toggle('hero__bullet--active', idx === heroIndex);
      b.setAttribute('aria-selected', String(idx === heroIndex));
    });
  }

  function restartHeroAuto() {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => goHero(heroIndex + 1), 6000);
  }

  if (bullets.length) {
    bullets.forEach((b, idx) => b.addEventListener('click', () => { goHero(idx); restartHeroAuto(); }));
    document.querySelector('.hero__arrow--prev')?.addEventListener('click', () => { goHero(heroIndex - 1); restartHeroAuto(); });
    document.querySelector('.hero__arrow--next')?.addEventListener('click', () => { goHero(heroIndex + 1); restartHeroAuto(); });
    restartHeroAuto();
  }

  // ---------- Карусель проектов ----------
  const track = document.querySelector('[data-projects-track]');
  if (track) {
    const step = () => track.querySelector('.projects__item').getBoundingClientRect().width + 30;
    document.querySelector('[data-projects-prev]')?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    document.querySelector('[data-projects-next]')?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  }

  // ---------- Отзывы: перелистывание цитат ----------
  const QUOTES = [
    {
      text: 'Ipsum aute sunt aliquip aute et occaecat. Anim minim do cillum eiusmod anim. Consectetur magna cillum consequat minim laboris cillum laboris voluptate minim proident exercitation ullamco.',
      name: 'Shawn Edwards', position: 'Position, Company name',
    },
    {
      text: 'Createx delivered our office complex two weeks ahead of schedule without a single compromise on quality. Communication was outstanding from day one.',
      name: 'Monica Hale', position: 'CEO, Hale Development',
    },
    {
      text: 'The interior design team turned a difficult floor plan into a space our employees genuinely love. We already booked the next project.',
      name: 'Viktor Reyes', position: 'Operations Director, Reyes Group',
    },
  ];
  let quoteIndex = 0;
  const quoteText = document.querySelector('.quote__text');
  const quoteName = document.querySelector('.quote__name');
  const quotePosition = document.querySelector('.quote__position');

  function renderQuote(i) {
    quoteIndex = (i + QUOTES.length) % QUOTES.length;
    const q = QUOTES[quoteIndex];
    quoteText.textContent = q.text;
    quoteName.textContent = q.name;
    quotePosition.textContent = q.position;
  }

  if (quoteText) {
    document.querySelector('[data-quote-prev]')?.addEventListener('click', () => renderQuote(quoteIndex - 1));
    document.querySelector('[data-quote-next]')?.addEventListener('click', () => renderQuote(quoteIndex + 1));
  }

  // ---------- Цифры: счётчики и кольца по появлению в кадре ----------
  const facts = Array.from(document.querySelectorAll('.fact'));
  if (facts.length && 'IntersectionObserver' in window) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const DURATION = 1400;

    function animateFact(fact) {
      const ring = fact.querySelector('[data-ring]');
      const num = fact.querySelector('[data-count]');
      const targetDeg = (Number(ring.dataset.ring) / 100) * 360;
      const targetVal = Number(num.dataset.count);
      const suffix = num.dataset.suffix || '';
      if (reduced) {
        ring.style.setProperty('--deg', targetDeg);
        num.textContent = targetVal.toLocaleString('en-US') + suffix;
        return;
      }
      const start = performance.now();
      (function tick(now) {
        const p = Math.min(1, (now - start) / DURATION);
        const ease = 1 - Math.pow(1 - p, 3);
        ring.style.setProperty('--deg', targetDeg * ease);
        num.textContent = Math.round(targetVal * ease).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateFact(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    facts.forEach((f) => io.observe(f));
  }

  // ---------- Кнопка «наверх» ----------
  document.querySelector('[data-to-top]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Простая валидация форм ----------
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach((field) => {
        const empty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
        field.classList.toggle('form__input--invalid', empty);
        if (empty) valid = false;
      });
      if (valid) {
        form.reset();
        alert('Thank you! Your request has been sent.');
      }
    });
    form.addEventListener('input', (e) => e.target.classList.remove('form__input--invalid'));
  });
})();
