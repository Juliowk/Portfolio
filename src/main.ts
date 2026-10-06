import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/motion.css';
import './styles/responsive.css';

import { initMenu } from './menu';
import { initFaq } from './faq';
import { initMotion } from './motion';

// Header ganha fundo ao rolar e se esconde ao descer (volta ao subir ou ao receber foco).
function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('#header');
  if (!header) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastY = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    if (!reduced && Math.abs(y - lastY) > 6) {
      const keepVisible = document.body.classList.contains('menu-open') || header.contains(document.activeElement);
      header.classList.toggle('is-hidden', y > lastY && y > 320 && !keepVisible);
      lastY = y;
    }
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
}

function initYear(): void {
  const year = document.querySelector<HTMLElement>('#ano');
  if (year) year.textContent = String(new Date().getFullYear());
}

// Reveal na rolagem para navegadores sem animation-timeline: view().
function initRevealFallback(): void {
  if (CSS.supports('animation-timeline: view()')) return;
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('io-reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

initMenu();
initFaq();
initHeaderScroll();
initYear();
initRevealFallback();
initMotion();
