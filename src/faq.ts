// Acordeão do FAQ: um item aberto por vez; o primeiro começa aberto (definido no HTML).

export function initFaq(): void {
  const list = document.querySelector<HTMLElement>('#faq-list');
  if (!list) return;

  const items = Array.from(list.querySelectorAll<HTMLElement>('.faq-item'));

  function setOpen(item: HTMLElement, open: boolean): void {
    const button = item.querySelector<HTMLButtonElement>('.faq-q');
    const icon = item.querySelector<HTMLElement>('.faq-icon');
    item.classList.toggle('is-open', open);
    button?.setAttribute('aria-expanded', String(open));
    if (icon) icon.textContent = open ? '−' : '+';
  }

  items.forEach((item) => {
    item.querySelector<HTMLButtonElement>('.faq-q')?.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      items.forEach((other) => setOpen(other, other === item && willOpen));
    });
  });
}
