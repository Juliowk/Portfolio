// Menu mobile: abre/fecha o painel, troca o ícone, fecha com Esc, clique fora ou num link.

export function initMenu(): void {
  const header = document.querySelector<HTMLElement>('#header');
  const button = document.querySelector<HTMLButtonElement>('#menu-btn');
  const panel = document.querySelector<HTMLElement>('#menu-mobile');
  if (!header || !button || !panel) return;

  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  function open(): void {
    panel!.hidden = false;
    button!.setAttribute('aria-expanded', 'true');
    button!.setAttribute('aria-label', 'Fechar menu');
    document.body.classList.add('menu-open');
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onClickOutside);
  }

  function close(returnFocus = false): void {
    panel!.hidden = true;
    button!.setAttribute('aria-expanded', 'false');
    button!.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onClickOutside);
    if (returnFocus) button!.focus();
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') close(true);
  }

  function onClickOutside(event: MouseEvent): void {
    if (!header!.contains(event.target as Node)) close();
  }

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isOpen()) close();
    else open();
  });

  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) close();
  });

  // Se a tela crescer além do breakpoint com o menu aberto, fecha para destravar a rolagem.
  window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches && isOpen()) close();
  });
}
