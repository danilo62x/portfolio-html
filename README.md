# Creative Studio Portfolio / HTML

[Leia em português](./README.pt-BR.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE) ![Free](https://img.shields.io/badge/price-free-brightgreen)

A creative studio website with a sales back office, built with plain HTML, vanilla JavaScript and Tailwind CSS v4. The public side shows the work: case studies with the challenge, what was done and the numbers that moved, a service catalogue with deliverables and pricing, an about page with the team and a timeline, a contact form and a four-step brief that turns a visitor into a lead. Behind the login sits the commercial side: a lead funnel you drag between stages, proposals with an item editor and discount, and CRUD for case studies, services and testimonials. Everything runs on mock data persisted to `localStorage`, so there is no backend to set up.

Live preview: https://template.dev.br/preview/portfolio-html/

## Pages included

16 screens, covering the public site and the authenticated area:

- Home: hero, numbers, services, featured cases, process, testimonials, clients and a call to action
- Services: cards by category with deliverables and price, the five-step process, FAQ accordion
- Cases: search and category filter over the portfolio, with pagination
- Case detail: cover, client and year, challenge, solution, results, gallery, client quote and the next case
- About: story, working principles, team, timeline and client logos
- Contact: validated form that creates a lead, plus the contact channels
- Brief: four-step wizard (scope, budget and timeline, contact, review) that submits a lead
- Login and Register: standalone auth screens
- Dashboard: leads this month, open proposals, win rate, closed revenue, revenue and lead charts, funnel by stage and revenue by service
- Leads: kanban by stage with drag and drop, filters by source, detail drawer and one-click conversion into a proposal
- Proposals: list by status plus an item editor with quantity, unit price, discount and totals
- Case studies admin: CRUD with publish and feature toggles
- Services admin: CRUD with category, price, timeline and deliverables
- Testimonials: CRUD with approval, rating and link to a case
- Settings: profile, studio details, notifications, theme and language
- Not found: 404 page

## Tech stack

- HTML5 and vanilla JavaScript modules, no framework runtime
- Tailwind CSS v4, compiled with the Tailwind CLI (the output is committed)
- ApexCharts loaded from CDN on the dashboard
- `localStorage` persistence for the whole domain and the session
- Installable PWA: web manifest plus an offline-first service worker
- Client-side i18n reading JSON dictionaries from `assets/i18n/` (en, es, pt-BR)
- Vite 6 as an optional dev server with hot reload

## Requirements

A modern browser is enough to open the pages. Node.js 18 or newer is only needed for the optional tooling (dev server and CSS rebuild).

## Getting started

```bash
npx serve .
# or: python -m http.server
```

Opening the `.html` files straight from disk mostly works, but the language switcher loads its JSON dictionaries with `fetch()` and the service worker needs HTTP, so a local server is the reliable option.

For development with hot reload:

```bash
npm install
npm run dev
```

Demo credentials (client-side only):

- `estudio@agencia.com` / `demo123`

Any non-empty email and password logs in; the pair above is the account suggested on the login screen and the one the seed data belongs to.

## Build for production

```bash
npm run build   # rebuilds the minified stylesheet
```

The compiled CSS is committed, so this step is only needed after changing styles or markup. To deploy, copy the folder to any static host.

## Project structure

```
assets/
├── css/               app.css (entrada do Tailwind) e o tailwind.css compilado
├── i18n/              en.json, es.json, pt-BR.json
└── js/                auth.js, data.js, pf.js, layout.js, i18n.js, icons.js, pwa.js
*.html                 as páginas
sw.js, manifest.webmanifest, pwa-*.png
```

## Theming and customization

Tailwind CSS v4 is configured in CSS, not in a JavaScript config file. The stylesheet imports Tailwind, declares the dark variant and defines the design tokens inside `@theme`: the Outfit font family, extra breakpoints and the brand color ramp (`--color-brand-25` through `--color-brand-950`). Semantic surface tokens use the `--tx-` prefix (sidebar, header, card, border, text). Dark mode is a class on the root element, toggled at runtime and persisted. To rebrand, change the brand ramp and the `--tx-` values together.

## Internationalization

Three locales live in `assets/i18n/`. `assets/js/i18n.js` fetches the JSON dictionary, translates every `[data-i18n]` node and stores the choice in `localStorage`. Because it uses `fetch()`, the pages need to be served over HTTP rather than opened from disk. Currency, dates and numbers are formatted per locale, so a proposal in Spanish shows euros and a Brazilian one shows reais.

## The same system in other stacks

The same system exists in five stacks, all sharing the screens and the visual identity, and all of them are free:

- React 19: https://github.com/danilo62x/portfolio-react
- Vue 3.5: https://github.com/danilo62x/portfolio-vue3
- Angular 19: https://github.com/danilo62x/portfolio-angular
- Laravel 11 + Blade: https://github.com/danilo62x/portfolio-laravel

The full catalog of free and paid templates is at https://template.dev.br

## Support this project

This template is free and MIT licensed. If it saves you time, you can support the work with a donation at https://template.dev.br/doar?template=portfolio-html

## License

[MIT](./LICENSE), copyright 2026 Danilo Quinelato.
