# Portfólio — Júlio Rocha

## Objetivo

Portfólio profissional que funciona como um segundo currículo e leva donos de empresas a me contratar. O CTA principal é o WhatsApp (`https://wa.me/5584988510505`).

Publicado em `https://juliowk.github.io/` (repositório de usuário `Juliowk/juliowk.github.io`), com deploy automático via GitHub Actions a cada push na `main`.

## Stack

- Vite + TypeScript vanilla (sem frameworks)
- CSS puro com variáveis (design tokens), sem bibliotecas de animação
- `vite.config.ts` com `base: '/'` (site servido na raiz)

## Estrutura

- `index.html` — página única com todas as seções; projetos e FAQ ficam no próprio HTML
- `src/main.ts` — importa os CSS e inicia os módulos
- `src/menu.ts` — menu mobile; `src/faq.ts` — acordeão do FAQ
- `src/styles/` — `tokens` → `base` → `components` → `sections` → `motion` → `responsive` (importados nessa ordem)
- `public/images/` — foto e prints; `npm run images` gera os `.webp` a partir dos `.jpg`/`.png`
- `public/curriculo-julio-rocha.pdf` — currículo linkado no hero

## Fonte de verdade visual

`docs/design-referencia.html`, exportado do canvas aprovado. Ele usa sintaxe de template que deve virar HTML/CSS/TS comum:

- `{{accent}}` = `#4ADE80` → `var(--accent)`
- `<sc-for>` / `<sc-if>` = repetição/condicional → HTML estático (o `<sc-if>` do menu vira painel com `hidden`)
- `onClick="{{...}}"` = comportamento a implementar em TypeScript
- `/_blob/<id>` = imagens → `/images/*` (identifique pelo `alt`)

O arquivo de referência não entra no build.

## Regras

- HTML semântico e acessível (landmarks, `aria-*`, foco visível, alt descritivo, contraste AA)
- Responsivo, conferido em 320px, 390px, 768px, 1024px e 1440px; sem rolagem horizontal
- Idioma pt-BR
- Sem `localStorage`
- Nenhuma cor ou fonte solta: tudo vem de `src/styles/tokens.css`
- Animar só `transform`, `opacity` e `filter`; respeitar `prefers-reduced-motion`
- Links externos com `target="_blank" rel="noopener"`
- Conteúdo pendente vai entre colchetes (ex.: `[Prazo]`) para o Júlio revisar; não inventar links nem dados
- Commits no padrão Conventional Commits (`feat:`, `fix:`, `chore:`, `style:`, `docs:`…)
