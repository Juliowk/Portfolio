# Plano de implementação — Portfólio Júlio Rocha

Oct 5, 2026 · @Júlio Rocha

## Visão geral e decisões

O portfólio será uma página única estática feita com **Vite + TypeScript, sem framework**, publicada automaticamente no GitHub Pages a cada push na `main`. É o mesmo fluxo que você já usa na Kaká Trufas, mas sem React: a página tem pouca interação (menu mobile, FAQ e ano do rodapé), e todo o motion fica em CSS puro.

| Decisão | Escolha | Por quê |
| --- | --- | --- |
| Build | Vite 7 + TypeScript (template `vanilla-ts`) | Minifica, gera hash nos arquivos e otimiza o build; você já conhece |
| Framework | Nenhum | Página estática; menos JS significa carregamento mais rápido e Lighthouse alto |
| Estilo | CSS puro com variáveis (design tokens) | O design já está todo em CSS; animações e scroll-reveal sem biblioteca |
| Repositório | `Juliowk/juliowk.github.io` | Repositório de usuário: o site abre na raiz `https://juliowk.github.io/` |
| Deploy | GitHub Actions → GitHub Pages | Build e publicação automáticos a cada push |
| Imagens | WebP em `public/images/` | Prints e foto 60–80% menores que JPEG |

O repositório **precisa** se chamar `juliowk.github.io` para o portfólio abrir na raiz. Os sites que já existem continuam funcionando normalmente em `juliowk.github.io/Trufas/` e nos demais caminhos, porque cada um vem do próprio repositório. Assim, o `base` do Vite fica `/`, sem o subdiretório que a Kaká Trufas exige.

## Antes de começar

Separe quatro coisas antes de abrir a sessão. Com elas na pasta do projeto, o Claude Code consegue implementar fiel ao canvas, sem adivinhar.

- [ ] Node.js 20 ou superior (`node -v`) e Git configurado
- [ ] Repositório vazio criado no GitHub com o nome exato `juliowk.github.io`, público
- [ ] Arquivo `design-referencia.html` (entregue junto com este plano) salvo em `docs/` no projeto. É o código-fonte do canvas aprovado: cores, espaçamentos, textos e animações exatos
- [ ] Imagens copiadas para `public/images/` com os nomes da tabela abaixo, e o currículo em `public/curriculo-julio-rocha.pdf`

| Arquivo | Origem | Onde aparece |
| --- | --- | --- |
| `julio.jpg` | Sua foto profissional (ft\_profissional\_04) | Seção Sobre (exibida em P&B via CSS) |
| `family-desktop.jpg` | Print da landing do Family Ctrl no desktop | Vitrine larga do Family Ctrl |
| `family-painel.jpg` | Print mobile do painel da família "Rochas" | Celular no bento do Family Ctrl |
| `family-familias.jpg` | Print mobile "Suas famílias" | Celular sobreposto na vitrine |
| `lanche-mobile.jpg` | Print mobile do cardápio | Card Lanche da Ana |
| `kaka-mobile.jpg` | Print mobile do catálogo | Card Kaká Trufas |
| `og-image.png` | Gerada na Fase 6 (1200×630) | Prévia ao compartilhar o link |

Recorte a barra de status e a barra do navegador dos prints mobile antes de copiar: o mockup de celular já desenha a moldura. A conversão para WebP fica com o Claude Code, na Fase 6.

O arquivo de referência usa uma sintaxe própria do canvas (`{{accent}}`, `<sc-for>`, `<sc-if>`, `/_blob/…`). O Claude Code deve traduzir essa sintaxe para HTML comum. Os prompts das fases já explicam como.

## Estrutura do projeto

O projeto tem um único `index.html` com todas as seções e o CSS dividido por responsabilidade. Um TypeScript pequeno cuida das interações. Os dados que você vai atualizar com frequência (projetos e FAQ) ficam no próprio HTML, para manter tudo legível sem renderização via JS.

```
juliowk.github.io/
├── .github/workflows/deploy.yml   # build + publicação no Pages
├── docs/design-referencia.html     # fonte do canvas (só referência, não vai pro build)
├── public/
│   ├── images/                     # foto e prints (WebP após a Fase 6)
│   ├── curriculo-julio-rocha.pdf
│   ├── favicon.svg                 # monograma JR
│   └── og-image.png
├── src/
│   ├── main.ts                     # importa os CSS e inicia os módulos
│   ├── menu.ts                     # menu mobile (abrir, fechar, Esc, foco)
│   ├── faq.ts                      # acordeão do FAQ
│   └── styles/
│       ├── tokens.css              # cores, fontes, raios, espaçamentos
│       ├── base.css                # reset, tipografia, .wrap, .grid-bg
│       ├── components.css          # botões, badges, chips, cards, glass, mockups
│       ├── sections.css            # estilos específicos de cada seção
│       ├── motion.css              # keyframes, reveal, hover, reduced-motion
│       └── responsive.css          # regras ≤ 900px
├── index.html
├── CLAUDE.md                       # contexto e regras para o Claude Code
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Como usar com o Claude Code

Rode uma fase por vez: cole o prompt da fase, revise o resultado no navegador (`npm run dev`) e faça o commit antes de seguir. Fases pequenas mantêm o contexto limpo e facilitam desfazer algo que saiu errado.

1. Abra a pasta do projeto no VS Code e inicie o Claude Code.
2. Na primeira vez, cole o prompt da Fase 0. Ele cria o `CLAUDE.md`, que o Claude Code relê em toda sessão.
3. Para cada fase seguinte, cole o prompt e acompanhe. Use o modo de plano (Shift+Tab) nas fases 2 e 4, que são as maiores, para aprovar a abordagem antes da edição.
4. Confira o critério de pronto no navegador, em 1440px e em 390px (DevTools, Ctrl+Shift+M).
5. Faça o commit no padrão que você já usa (Conventional Commits) e só então passe para a próxima fase.

Se uma sessão ficar longa, use `/clear` entre as fases. O `CLAUDE.md` e o arquivo de referência guardam todo o contexto necessário.

## Fases de implementação

São oito fases. As fases 0 a 6 acontecem aqui, e a 7 (deploy) tem seção própria logo abaixo. Cada fase traz o prompt pronto para colar e o critério de pronto.

### Fase 0 — Setup e contexto

Cria o projeto Vite, o repositório Git e o `CLAUDE.md`.

```text
Vamos implementar meu portfólio profissional como página estática para o GitHub Pages.

1. Inicialize um projeto Vite com o template vanilla-ts NESTA pasta (sem criar subpasta). Remova os arquivos de exemplo (counter.ts, typescript.svg, vite.svg e o CSS padrão).
2. Crie vite.config.ts com base: '/' (o repositório é juliowk.github.io, site de usuário, servido na raiz).
3. Inicialize o Git com branch main e um .gitignore para Node/Vite.
4. Crie a estrutura de pastas: src/styles/{tokens,base,components,sections,motion,responsive}.css, src/{main,menu,faq}.ts, public/images/, .github/workflows/.
5. Crie um CLAUDE.md com:
   - Objetivo: portfólio que funciona como segundo currículo e leva donos de empresas a me contratar (CTA principal: WhatsApp).
   - Stack: Vite + TypeScript vanilla, CSS puro, sem frameworks nem bibliotecas de animação.
   - Fonte de verdade visual: docs/design-referencia.html (exportado do canvas aprovado). Ele usa sintaxe de template: {{accent}} = #4ADE80; <sc-for>/<sc-if> = repetição/condicional que deve virar HTML estático; onClick="{{...}}" = comportamento a implementar em TS; /_blob/<id> = imagens que devem apontar para /images/*.
   - Regras: HTML semântico e acessível, mobile responsivo em 390px, idioma pt-BR, sem localStorage, commits no padrão Conventional Commits.
6. Faça o primeiro commit.
```

- [ ] `npm run dev` abre uma página em branco sem erros
- [ ] `CLAUDE.md` e `vite.config.ts` com `base: '/'` existem

### Fase 1 — Design tokens e base

Transforma a paleta, a tipografia e os componentes do canvas em CSS reutilizável.

```text
Leia docs/design-referencia.html (o <helmet><style> e os estilos inline) e o CLAUDE.md.

1. Em tokens.css, crie variáveis CSS para: fundo #0A0A0A, superfície #161616/#0E0E0E, texto #F5F5F5, secundário #A3A3A3, dim #8A8A8A, bordas rgba(255,255,255,.08/.12/.16), acento #4ADE80, raios (999px, 20px, 14px), largura máxima 1200px.
2. Carregue as fontes Geist e Geist Mono do Google Fonts no index.html com preconnect e display=swap.
3. Em base.css: reset leve, body, .wrap, .mono, .grid-bg, .sec, .h2, .lead, .muted, .dim e os textos em degradê (.grad, .grad-x, .chrome-text), exatamente como no arquivo de referência.
4. Em components.css: .badge/.badge-ic, .chip, .card, .glass, .btn/.btn-w/.btn-g, a moldura de celular (.phone) e a de navegador (.browser), extraindo os estilos inline repetidos da referência para classes.
5. Importe todos os CSS no main.ts, na ordem tokens → base → components → sections → motion → responsive.
```

- [ ] Nenhuma cor ou fonte "solta": tudo vem de `tokens.css`
- [ ] Componentes isolados aparecem iguais ao Guia visual do canvas

### Fase 2 — Estrutura e conteúdo das seções

Monta todas as seções em HTML semântico, com o conteúdo final. É a fase maior: use o modo de plano.

```text
Com base em docs/design-referencia.html, implemente o index.html completo, seção por seção, nesta ordem:
header/nav → hero (#topo) → faixa de tecnologias → Sobre (#sobre) → Projetos (#projetos: bento do Family Ctrl + vitrine + cards Lanche da Ana e Kaká Trufas) → Trajetória (números) → Experiência (#experiencia) → Stack → Serviços (#servicos, 2 cards) → FAQ (#faq) → Contato (#contato) → footer → botão flutuante de WhatsApp.

Regras:
- Use <header>, <nav>, <main>, <section aria-labelledby>, <article> nos cards de projeto, <footer>.
- Copie os textos exatamente como estão na referência. Mantenha os marcadores entre colchetes (ex.: [24h], [Prazo médio], [Frontend]) para eu revisar depois.
- Traduza a sintaxe do canvas: o <sc-for> do FAQ vira 5 itens estáticos; o <sc-if> do menu vira um painel oculto com o atributo hidden; {{accent}} vira var(--accent).
- Troque cada /_blob/... pela imagem certa em /images/ (veja os alt dos <img> na referência para identificar cada uma).
- Imagens com width/height explícitos, loading="lazy" em todas fora do hero e decoding="async".
- Os símbolos cromados ({ }, </>, ;) e as órbitas são decorativos: aria-hidden="true".
- Links externos (site, GitHub, WhatsApp) com target="_blank" rel="noopener".
- Mova os estilos de cada seção para sections.css. Evite estilos inline, exceto posições pontuais.
```

- [ ] Todas as seções aparecem iguais ao artboard desktop em 1440px
- [ ] As âncoras do menu levam à seção certa
- [ ] Nenhum `{{`, `sc-` ou `/_blob/` restante no código

### Fase 3 — Interações

Implementa o menu mobile, o FAQ e os detalhes de comportamento em TypeScript.

```text
Implemente as interações em TypeScript, sem bibliotecas:

1. menu.ts: o botão sanduíche (visível só ≤ 900px) abre e fecha o painel do menu; troca o ícone (hambúrguer/X); atualiza aria-expanded e aria-controls; fecha ao clicar num link, ao apertar Esc e ao clicar fora; trava a rolagem do body enquanto está aberto.
2. faq.ts: acordeão em que só um item fica aberto por vez e o primeiro começa aberto. Use <button aria-expanded> + painel com id/aria-controls. A altura anima suavemente (grid-template-rows 0fr → 1fr) e o ícone alterna entre + e −.
3. Rolagem suave nas âncoras via CSS (scroll-behavior: smooth em html) e scroll-margin-top nas seções, para compensar o header.
4. Ano do rodapé gerado automaticamente.
5. Header com fundo translúcido e backdrop-filter que ganha borda ao rolar a página (classe .is-scrolled via scroll listener passivo).
```

- [ ] Menu e FAQ funcionam com mouse, toque e teclado (Tab, Enter, Esc)
- [ ] Console sem erros

### Fase 4 — Motion e efeitos

Adiciona as animações aprovadas, todas em CSS. Use o modo de plano.

```text
Implemente o motion em motion.css, fiel à referência (keyframes fu, floaty, shine, spin, marquee, pulse, blink, type, reveal) e ao card "Motion" do guia visual:

1. Entrada do hero em cascata (.fu + .d1–.d5): sobe 26px e sai do desfoque, 1s, cubic-bezier(.2,.7,.2,1).
2. Símbolos cromados com flutuação (floaty) e brilho metálico (shine); órbitas girando (spin 36s e 54s reverso) com ponto de luz.
3. Terminal: digitação de "> Desenvolvedor Full Stack" (steps) e cursor piscando; ponto de "disponível" pulsando.
4. Faixa de tecnologias em letreiro infinito (lista duplicada, translateX -50%, máscara nas bordas, pausa no hover).
5. Reveal na rolagem com animation-timeline: view() dentro de @supports; sem suporte, o conteúdo aparece normal. Fallback opcional: IntersectionObserver em main.ts, aplicado só quando o navegador não suporta view().
6. Hovers: card sobe 6px e acende a borda; zoom de 1.04 nos prints; seta dos botões avança; sublinhado animado nos links do menu.
7. Wordmark "JÚLIO ROCHA" do rodapé com brilho percorrendo.
8. @media (prefers-reduced-motion: reduce) desliga animações e transições.
9. Anime apenas transform, opacity e filter; use will-change com moderação.
```

- [ ] Animações fluidas (60 fps) no DevTools > Performance
- [ ] Com "reduzir movimento" ativado no sistema, a página fica estática e legível

### Fase 5 — Responsivo (mobile)

Garante a versão de 390px igual ao artboard Mobile.

```text
Implemente responsive.css seguindo o artboard Mobile do canvas (regras do @media (max-width: 900px) da referência):

- Nav: links e CTA escondidos, botão de menu visível.
- Grades (.two, .three, bento, rodapé) em uma coluna; o card principal do Family Ctrl perde o span 2.
- Hero: padding menor; botões em largura total; arte dos símbolos com scale(.58) ancorada no canto superior direito; terminal com largura 100% (máx. 330px).
- Vitrine do Family Ctrl: navegador em 100% e celular sobreposto escondido.
- Trajetória: cards inclinados viram uma grade 2+1 sem rotação.
- Botão flutuante de WhatsApp visível só no mobile, respeitando env(safe-area-inset-bottom).
- Alvos de toque com no mínimo 44px; sem rolagem horizontal em nenhuma largura.
Teste em 320px, 390px, 768px, 1024px e 1440px.
```

- [ ] Sem barra de rolagem horizontal em 320px
- [ ] Visual igual ao artboard Mobile em 390px

### Fase 6 — SEO, acessibilidade e performance

Deixa o site pronto para ser encontrado, compartilhado e bem avaliado.

```text
Prepare o site para produção:

1. Converta as imagens de public/images para WebP (qualidade ~80, até 2x o tamanho exibido), atualize as referências e use <picture> com fallback JPG na foto.
2. No <head>: title "Júlio Rocha | Desenvolvedor Full Stack", meta description, canonical https://juliowk.github.io/, Open Graph e Twitter Card com og-image.png 1200x630 (gere uma no visual do site: fundo grafite, nome, cargo e o símbolo { } cromado), theme-color #0A0A0A, lang pt-BR.
3. Favicon SVG com o monograma JR (quadrado claro com "JR" em Geist Mono).
4. JSON-LD do tipo Person com nome, cargo, URL, GitHub e LinkedIn.
5. Crie public/robots.txt e public/sitemap.xml.
6. Acessibilidade: link "Pular para o conteúdo", foco visível nos elementos interativos, contraste AA e alt descritivo em todas as imagens.
7. Rode npm run build && npm run preview e o Lighthouse (modo mobile). Corrija até ter 90+ em Performance, Acessibilidade, Boas práticas e SEO.
```

- [ ] Lighthouse mobile 90+ nas quatro categorias
- [ ] A prévia do link aparece com imagem ao colar no WhatsApp (teste após o deploy)

## Fase 7 — Deploy no GitHub Pages

O deploy acontece sozinho: cada push na `main` dispara um workflow que roda `npm ci`, gera o build e publica a pasta `dist/` no Pages. A única etapa manual é escolher a fonte "GitHub Actions" nas configurações do repositório.

```text
Configure o deploy automático para o GitHub Pages:

1. Crie .github/workflows/deploy.yml com o workflow oficial: gatilho em push na main e workflow_dispatch; permissões contents: read, pages: write, id-token: write; concurrency group "pages"; job build (checkout, setup-node 20 com cache npm, npm ci, npm run build, configure-pages, upload-pages-artifact com path dist) e job deploy (deploy-pages, environment github-pages). Use as versões mais recentes das actions oficiais.
2. Confira se vite.config.ts está com base: '/'.
3. Adicione o remote: git remote add origin https://github.com/Juliowk/juliowk.github.io.git
4. Faça commit e push para a main.
```

Referência do workflow, caso queira conferir o que o Claude Code gerou:

```yaml
name: Deploy no GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

No GitHub, uma única vez:

1. Abra o repositório `juliowk.github.io` → **Settings** → **Pages**.
2. Em **Build and deployment → Source**, escolha **GitHub Actions**.
3. Acompanhe a execução na aba **Actions**. Com o check verde, o site estará em `https://juliowk.github.io/`, normalmente em 1 a 2 minutos.

Se a página abrir em branco, quase sempre o problema é o `base` errado ou um caminho de imagem absoluto que não está em `public/`. Abra o console do navegador e procure por erros 404.

Depois de publicar, coloque o link no currículo em PDF, no perfil do LinkedIn (seção Destaque) e no README do seu perfil no GitHub.

## Checklist final e conteúdo pendente

Antes de divulgar o link, troque os marcadores entre colchetes e confira os itens abaixo. Peça ao Claude Code: "liste todos os marcadores entre colchetes que ainda existem no index.html".

Conteúdo que só você pode preencher:

- [ ] Link do site e do repositório do **Family Ctrl** (botões "Ver projeto" e "Código no GitHub")
- [ ] Stack do frontend do Family Ctrl (chip `[Frontend]`)
- [ ] Links do site e do repositório do **Lanche da Ana**
- [ ] Prazo de resposta no contato (`[24h]`)
- [ ] Respostas do FAQ: disponibilidade para freelance e `[Prazo médio]`
- [ ] Currículo em PDF atualizado em `public/`, já com o link do portfólio

Verificação final:

- [ ] Todos os links externos abrem em nova aba e funcionam (WhatsApp abre com o número certo)
- [ ] Teste no seu celular de verdade, em 4G, e não só no DevTools
- [ ] Lighthouse mobile 90+ nas quatro categorias, já em `https://juliowk.github.io/`
- [ ] Prévia do link com imagem no WhatsApp e no LinkedIn
- [ ] Link adicionado ao currículo, ao LinkedIn e ao README do GitHub

Para adicionar um projeto no futuro, peça ao Claude Code um novo card na seção #projetos, seguindo o padrão dos cards do Lanche da Ana e da Kaká Trufas, com o print em `public/images/`. O deploy acontece sozinho no push.
