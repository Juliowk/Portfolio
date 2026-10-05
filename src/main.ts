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

initMenu();
initFaq();
initHeaderScroll();
initYear();
