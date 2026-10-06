// Efeitos guiados por JS: link ativo, parallax do hero, spotlight, tilt 3D, CTAs magnéticos,
// contadores e cascata de chips. Tudo fica desligado com prefers-reduced-motion.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Agrupa atualizações de ponteiro em um quadro de animação por elemento.
function onPointerFrame(target: HTMLElement, handler: (event: PointerEvent) => void): void {
  let frame = 0;
  let last: PointerEvent | null = null;
  target.addEventListener('pointermove', (event) => {
    last = event;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (last) handler(last);
    });
  });
}

// Destaca no menu a seção que está no meio da tela.
function initScrollSpy(): void {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-links .navlink, .menu-link'));
  const sections = new Set(
    links
      .map((link) => document.querySelector<HTMLElement>(link.getAttribute('href') ?? ''))
      .filter((section): section is HTMLElement => section !== null),
  );
  if (!sections.size || !('IntersectionObserver' in window)) return;
  // No hero nenhum link fica ativo.
  const hero = document.querySelector<HTMLElement>('#topo');
  if (hero) sections.add(hero);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const href = `#${entry.target.id}`;
        links.forEach((link) => {
          const active = link.getAttribute('href') === href;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((section) => observer.observe(section));
}

// Camadas do hero acompanham o cursor em profundidades diferentes (ver motion.css).
function initHeroParallax(): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  onPointerFrame(hero, (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    hero.style.setProperty('--px', x.toFixed(3));
    hero.style.setProperty('--py', y.toFixed(3));
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--px', '0');
    hero.style.setProperty('--py', '0');
  });
}

// Luz suave que segue o cursor dentro de cada card.
function initSpotlight(): void {
  document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
    onPointerFrame(card, (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--sx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--sy', `${event.clientY - rect.top}px`);
    });
  });
}

// Mockups inclinam em 3D conforme o cursor passa pelo card que os contém.
function initTilt(): void {
  const MAX = 7;
  document.querySelectorAll<HTMLElement>('.fc-phone, .project-phone, .showcase-browser').forEach((target) => {
    const area = target.closest<HTMLElement>('.card') ?? target;
    target.classList.add('tilt-3d');

    onPointerFrame(area, (event) => {
      const rect = area.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      target.style.setProperty('--tx', `${(x * MAX * 2).toFixed(2)}deg`);
      target.style.setProperty('--ty', `${(-y * MAX * 2).toFixed(2)}deg`);
    });
    area.addEventListener('pointerleave', () => {
      target.style.setProperty('--tx', '0deg');
      target.style.setProperty('--ty', '0deg');
    });
  });
}

// Botões principais são levemente atraídos pelo cursor.
function initMagnetic(): void {
  const STRENGTH = 0.25;
  document.querySelectorAll<HTMLElement>('.btn-w').forEach((button) => {
    button.classList.add('magnetic');
    onPointerFrame(button, (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      button.style.setProperty('--mx', `${(x * STRENGTH).toFixed(1)}px`);
      button.style.setProperty('--my', `${(y * STRENGTH).toFixed(1)}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--mx', '0px');
      button.style.setProperty('--my', '0px');
    });
  });
}

// Números da trajetória contam de zero até o valor final ao aparecerem.
function initCounters(): void {
  const DURATION = 1400;
  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

  const counters = Array.from(document.querySelectorAll<HTMLElement>('.tilt-num'))
    .map((el) => {
      const match = (el.textContent ?? '').trim().match(/^(\d+)(.*)$/);
      if (!match) return null;
      const final = el.textContent!.trim();
      // Leitores de tela recebem o valor final; o número animado é só visual.
      el.innerHTML = '';
      const visual = document.createElement('span');
      visual.setAttribute('aria-hidden', 'true');
      visual.textContent = `0${match[2]}`;
      const label = document.createElement('span');
      label.className = 'sr-only';
      label.textContent = final;
      el.append(visual, label);
      return { el, visual, target: Number(match[1]), suffix: match[2] };
    })
    .filter((counter) => counter !== null);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        const counter = counters.find((c) => c.el === entry.target);
        if (!counter) return;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / DURATION, 1);
          counter.visual.textContent = `${Math.round(easeOut(t) * counter.target)}${counter.suffix}`;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.6 },
  );
  counters.forEach((counter) => observer.observe(counter.el));
}

// Chips e listas entram um item de cada vez quando o grupo aparece.
function initStagger(): void {
  const groups = document.querySelectorAll<HTMLElement>('.chips, .service-list');
  document.documentElement.classList.add('stagger-ready');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px' },
  );

  groups.forEach((group) => {
    group.classList.add('stagger');
    Array.from(group.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)));
    observer.observe(group);
  });
}

export function initMotion(): void {
  initScrollSpy();
  if (reducedMotion || !('IntersectionObserver' in window)) return;

  initCounters();
  initStagger();

  if (!finePointer) return;
  initHeroParallax();
  initSpotlight();
  initTilt();
  initMagnetic();
}
