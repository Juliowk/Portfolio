import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/motion.css';
import './styles/responsive.css';

import { initMenu } from './menu';
import { initFaq } from './faq';

function initHeaderScroll(): void {
  const header = document.querySelector<HTMLElement>('#header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
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
