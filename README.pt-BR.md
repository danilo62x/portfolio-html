# Creative Studio Portfolio / HTML

[Read in English](./README.md)

[![Licença: MIT](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue.svg)](./LICENSE) ![Grátis](https://img.shields.io/badge/pre%C3%A7o-gr%C3%A1tis-brightgreen)

Site de estúdio criativo com um back office comercial, feito em HTML puro, JavaScript sem framework e Tailwind CSS v4. O lado público mostra o trabalho: cases com o desafio, o que foi feito e os números que mudaram, um catálogo de serviços com entregáveis e preço, uma página sobre com time e linha do tempo, formulário de contato e um briefing em quatro etapas que transforma o visitante em lead. Depois do login fica o lado comercial: um funil de leads que você arrasta entre estágios, propostas com editor de itens e desconto, e CRUD de cases, serviços e depoimentos. Tudo roda com dados fictícios persistidos no `localStorage`, sem backend para configurar.

Demonstração ao vivo: https://template.dev.br/preview/portfolio-html/

## Páginas incluídas

16 telas, cobrindo o site público e a área autenticada:

- Home: hero, números, serviços, cases em destaque, processo, depoimentos, clientes e uma chamada para ação
- Serviços: cards por categoria com entregáveis e preço, o processo em cinco passos e um FAQ em accordion
- Cases: busca e filtro por categoria no portfólio, com paginação
- Detalhe do case: capa, cliente e ano, desafio, solução, resultados, galeria, depoimento do cliente e o próximo case
- Sobre: história, princípios de trabalho, time, linha do tempo e logos de clientes
- Contato: formulário validado que cria um lead, mais os canais de atendimento
- Briefing: wizard de quatro etapas (escopo, investimento e prazo, contato, revisão) que envia um lead
- Login e Registro: telas de autenticação isoladas
- Dashboard: leads no mês, propostas abertas, taxa de fechamento, receita fechada, gráficos de receita e leads, funil por estágio e receita por serviço
- Leads: kanban por estágio com arrastar e soltar, filtros por origem, drawer de detalhe e conversão em proposta com um clique
- Propostas: lista por status e editor de itens com quantidade, valor unitário, desconto e totais
- Cases (admin): CRUD com publicar e destacar
- Serviços (admin): CRUD com categoria, preço, prazo e entregáveis
- Depoimentos: CRUD com aprovação, nota e vínculo com um case
- Configurações: perfil, dados do estúdio, notificações, tema e idioma
- Not found: página 404

## Stack

- HTML5 e módulos JavaScript sem framework
- Tailwind CSS v4, compilado com a CLI do Tailwind (a saída está versionada)
- ApexCharts carregado por CDN no dashboard
- Persistência em `localStorage` para todo o domínio e para a sessão
- PWA instalável: web manifest e service worker offline-first
- i18n no cliente, lendo dicionários JSON de `assets/i18n/` (en, es, pt-BR)
- Vite 6 como servidor de desenvolvimento opcional, com hot reload

## Requisitos

Um navegador atual já basta para abrir as páginas. Node.js 18 ou mais novo só é necessário para o ferramental opcional (servidor de desenvolvimento e recompilação do CSS).

## Como rodar

```bash
npx serve .
# ou: python -m http.server
```

Abrir os arquivos `.html` direto do disco quase sempre funciona, mas o seletor de idioma carrega os dicionários JSON com `fetch()` e o service worker exige HTTP, então subir um servidor local é o caminho confiável.

Para desenvolvimento com hot reload:

```bash
npm install
npm run dev
```

Credenciais de demonstração (só no cliente):

- `estudio@agencia.com` / `demo123`

Qualquer e-mail e senha não vazios entram; o par acima é a conta sugerida na tela de login e a dona dos dados de exemplo.

## Build de produção

```bash
npm run build   # recompila a folha de estilo minificada
```

O CSS compilado está versionado, então esse passo só é necessário depois de mexer nos estilos ou no markup. Para publicar, copie a pasta para qualquer host estático.

## Estrutura do projeto

```
assets/
├── css/               app.css (entrada do Tailwind) e o tailwind.css compilado
├── i18n/              en.json, es.json, pt-BR.json
└── js/                auth.js, data.js, pf.js, layout.js, i18n.js, icons.js, pwa.js
*.html                 as páginas
sw.js, manifest.webmanifest, pwa-*.png
```

## Tema e personalização

O Tailwind CSS v4 é configurado em CSS, não em arquivo JavaScript. A folha de estilo importa o Tailwind, declara a variante dark e define os tokens de design dentro de `@theme`: a fonte Outfit, breakpoints extras e a rampa da cor da marca (`--color-brand-25` até `--color-brand-950`). Os tokens semânticos de superfície usam o prefixo `--tx-` (sidebar, header, card, borda, texto). O modo escuro é uma classe no elemento raiz, alternada em tempo de execução e persistida. Para trocar a marca, altere a rampa e os valores `--tx-` juntos.

## Internacionalização

Três idiomas ficam em `assets/i18n/`. O `assets/js/i18n.js` busca o dicionário JSON, traduz cada nó `[data-i18n]` e guarda a escolha no `localStorage`. Como usa `fetch()`, as páginas precisam ser servidas por HTTP, não abertas direto do disco. Moeda, datas e números são formatados conforme o idioma, então uma proposta em espanhol mostra euros e uma em português mostra reais.

## O mesmo sistema em outras stacks

O mesmo sistema existe em cinco stacks, todas com as mesmas telas e a mesma identidade visual, e todas gratuitas:

- React 19: https://github.com/danilo62x/portfolio-react
- Vue 3.5: https://github.com/danilo62x/portfolio-vue3
- Angular 19: https://github.com/danilo62x/portfolio-angular
- Laravel 11 + Blade: https://github.com/danilo62x/portfolio-laravel

O catálogo completo de templates gratuitos e pagos está em https://template.dev.br

## Apoie o projeto

Este template é gratuito e licenciado sob MIT. Se ele te poupar tempo, você pode apoiar o trabalho com uma doação em https://template.dev.br/doar?template=portfolio-html

## Licença

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
