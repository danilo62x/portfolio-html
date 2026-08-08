/* ===== Portfolio layout (three shells) + shared component library =====
   PUBLIC shell (navbar + footer), APP shell (sidebar + topbar) for app-*.html,
   or BLANK shell (auth / 404). Chooses by <body data-shell>. Exposes UI.* render
   helpers and wires theme/lang/menu handlers. Mirrors the React layouts and pf components. */
(function (global) {
  const SHELL = (document.body.getAttribute('data-shell') || 'public').toLowerCase();

  function t(key, opts) {
    return global.I18n ? global.I18n.t(key, opts) : key;
  }
  function tArr(key) {
    return global.I18n ? global.I18n.tArr(key) : [];
  }
  function lang() {
    return global.I18n ? global.I18n.getLang() : 'pt-BR';
  }
  const F = global.Format;
  const fmt = (v) => F.formatCurrency(v, lang());
  const fmtCompact = (v) => F.formatCompact(v, lang());
  const fmtNumber = (v) => F.formatNumber(v, lang());
  const fmtDate = (v) => F.formatDate(v, lang());
  const fmtDateTime = (v) => F.formatDateTime(v, lang());
  const fmtTime = (v) => F.formatTime(v, lang());
  const fromNow = (v) => F.fromNow(v, lang());

  const LANGS = global.I18n ? global.I18n.LANGUAGES : [{ code: 'pt-BR', flag: '🇧🇷', label: 'Português' }];

  // Load shared scripts once (pwa).
  (function loadScriptsOnce() {
    ['assets/js/pwa.js'].forEach((src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const sc = document.createElement('script');
        sc.src = src;
        document.head.appendChild(sc);
      }
    });
  })();

  /** Escape a value before injecting it into markup. */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ============================================================
  // Shared render helpers
  // ============================================================
  function langMenu() {
    return LANGS.map(
      (l) =>
        `<button type="button" class="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 ${
          l.code === lang() ? 'font-medium text-brand-600' : 'text-body'
        }" data-action="set-lang" data-lang="${l.code}"><span>${l.flag}</span> ${l.label}${
          l.code === lang() ? icon('check', { size: 14, className: 'ml-auto' }) : ''
        }</button>`
    ).join('');
  }

  function langDropdown(id) {
    return (
      `<div class="relative" id="${id}"><button type="button" data-action="toggle-lang" data-menu="#${id}-menu" aria-label="Language" class="flex h-10 w-10 items-center justify-center rounded-full border border-themed text-base hover:bg-gray-50 dark:hover:bg-gray-800">${
        LANGS.find((l) => l.code === lang()).flag
      }</button><div id="${id}-menu" class="surface-card absolute right-0 mt-3 w-44 rounded-xl border py-1 shadow-theme-lg hidden z-50">${langMenu()}</div></div>`
    );
  }

  const AVATAR_SIZE = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  };

  function initials(name) {
    return String(name || '?')
      .split(' ')
      .slice(0, 2)
      .map((w) => (w[0] || '').toUpperCase())
      .join('');
  }

  function avatar(name, size) {
    const dims = AVATAR_SIZE[size] || AVATAR_SIZE.md;
    return `<span class="flex ${dims} shrink-0 items-center justify-center rounded-full bg-brand-500 font-semibold text-white">${esc(
      initials(name)
    )}</span>`;
  }

  const BADGE_COLORS = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-500',
    error: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  };
  const BADGE_SOLID = {
    brand: 'bg-brand-500 text-white',
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-white',
    error: 'bg-error-500 text-white',
    gray: 'bg-gray-500 text-white',
  };
  const BADGE_DOT = {
    brand: 'bg-brand-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    gray: 'bg-gray-400',
  };

  // badge(label, color, opts) — opts: { variant:'soft'|'solid', dot:bool, icon:string }
  function badge(label, color, opts) {
    color = color || 'brand';
    opts = opts || {};
    const styles = opts.variant === 'solid' ? BADGE_SOLID[color] || BADGE_SOLID.gray : BADGE_COLORS[color] || BADGE_COLORS.gray;
    const dot = opts.dot
      ? `<span class="h-1.5 w-1.5 rounded-full ${opts.variant === 'solid' ? 'bg-white' : BADGE_DOT[color] || BADGE_DOT.gray}"></span>`
      : '';
    const ic = opts.icon ? icon(opts.icon, { size: 12, strokeWidth: 2.2 }) : '';
    return `<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles}">${dot}${ic}${label}</span>`;
  }

  // ---- Status pills (lead stage + proposal status) ----
  const STAGE_COLOR = { novo: 'gray', contato: 'brand', proposta: 'warning', ganho: 'success', perdido: 'error' };
  const PROPOSAL_COLOR = { rascunho: 'gray', enviada: 'brand', aceita: 'success', recusada: 'error' };

  function stagePill(stage) {
    return badge(t('leadStages.' + stage), STAGE_COLOR[stage] || 'gray', { dot: true });
  }
  function proposalPill(status) {
    return badge(t('proposalStatuses.' + status), PROPOSAL_COLOR[status] || 'gray', { dot: true });
  }

  const STATS_ACCENT = {
    brand: 'bg-brand-50 dark:bg-brand-500/15',
    success: 'bg-success-50 dark:bg-success-500/15',
    warning: 'bg-warning-50 dark:bg-warning-500/15',
    error: 'bg-error-50 dark:bg-error-500/15',
    info: 'bg-blue-light-50 dark:bg-blue-light-500/15',
  };
  const STATS_COLOR = {
    brand: 'text-brand-500',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-500',
    info: 'text-blue-light-500',
  };

  // kpiCard(o) — o: { title, value, icon, accent, hint, trend, trendValue }
  function kpiCard(o) {
    const up = o.trend === 'up';
    const trend = o.trend
      ? `<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          up
            ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
            : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
        }">${icon(up ? 'arrow-up' : 'arrow-down', { size: 12, strokeWidth: 2.5 })}${o.trendValue || ''}</span>`
      : '';
    return (
      `<div class="surface-card rounded-2xl border p-5 shadow-theme-sm md:p-6">` +
      `<div class="flex items-start justify-between">` +
      `<div class="flex h-12 w-12 items-center justify-center rounded-xl ${STATS_ACCENT[o.accent] || STATS_ACCENT.brand}">${icon(
        o.icon,
        { size: 22, className: STATS_COLOR[o.accent] || STATS_COLOR.brand }
      )}</div>${trend}</div>` +
      `<div class="mt-5"><span class="text-sm text-muted">${o.title}</span>` +
      `<h4 class="mt-2 text-title-sm font-bold text-heading">${o.value}</h4>` +
      (o.hint ? `<p class="mt-1 text-xs text-muted">${o.hint}</p>` : '') +
      `</div></div>`
    );
  }

  function emptyState(o) {
    o = o || {};
    return (
      `<div class="flex flex-col items-center justify-center py-16 text-center">` +
      `<span class="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">${icon(
        o.icon || 'package',
        { size: 28 }
      )}</span>` +
      `<h3 class="mt-5 text-lg font-semibold text-heading">${o.title || ''}</h3>` +
      (o.description ? `<p class="mt-2 max-w-sm text-sm text-muted">${o.description}</p>` : '') +
      (o.action ? `<div class="mt-6">${o.action}</div>` : '') +
      `</div>`
    );
  }

  function breadcrumb(items) {
    const lis = items
      .map((item, i) => {
        const last = i === items.length - 1;
        const content =
          item.href && !last
            ? `<a href="${item.href}" class="text-muted transition hover:text-brand-600 dark:hover:text-brand-400">${item.label}</a>`
            : `<span ${last ? 'aria-current="page"' : ''} class="${last ? 'font-medium text-heading' : 'text-muted'}">${item.label}</span>`;
        const sep = !last ? icon('chevron-right', { size: 14, className: 'text-gray-400' }) : '';
        return `<li class="flex items-center gap-1.5">${content}${sep}</li>`;
      })
      .join('');
    return `<nav aria-label="Breadcrumb"><ol class="flex flex-wrap items-center gap-1.5 text-sm">${lis}</ol></nav>`;
  }

  function pageHeader(o) {
    return (
      `<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">` +
      `<div>` +
      (o.crumbs && o.crumbs.length ? `<div class="mb-2">${breadcrumb(o.crumbs)}</div>` : '') +
      `<h1 class="text-2xl font-bold text-heading">${o.title}</h1>` +
      (o.subtitle ? `<p class="mt-1 text-sm text-muted">${o.subtitle}</p>` : '') +
      `</div>` +
      (o.action ? `<div class="shrink-0">${o.action}</div>` : '') +
      `</div>`
    );
  }

  // switchToggle(checked, attrs, size)
  function switchToggle(checked, attrs, size) {
    const sm = size === 'sm';
    return (
      `<button type="button" role="switch" aria-checked="${!!checked}" ${attrs || ''} class="relative inline-flex shrink-0 items-center rounded-full transition ${
        sm ? 'h-5 w-9' : 'h-6 w-11'
      } ${checked ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'}"><span class="inline-block transform rounded-full bg-white shadow-theme-xs transition ${
        sm ? 'h-4 w-4' : 'h-5 w-5'
      } ${checked ? (sm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-1'}"></span></button>`
    );
  }

  // ============================================================
  // Portfolio components (mirror React src/components/pf)
  // ============================================================

  // caseCard(study, featured?) — mirrors React CaseCard
  function caseCard(study, featured) {
    const results = (study.results || [])
      .slice(0, featured ? 3 : 2)
      .map(
        (r) =>
          `<div><p class="text-lg font-bold text-brand-500">${esc(r.value)}</p><p class="text-xs text-muted">${esc(r.label)}</p></div>`
      )
      .join('');
    return (
      `<a href="case.html?slug=${encodeURIComponent(study.slug)}" class="group flex flex-col overflow-hidden rounded-2xl border border-themed surface-card shadow-theme-sm transition hover:shadow-theme-lg">` +
      `<div class="relative overflow-hidden ${featured ? 'aspect-16/10' : 'aspect-4/3'}">` +
      `<img src="${study.cover}" alt="${esc(study.title)}" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>` +
      `<span class="absolute left-4 top-4">${badge(t('caseCategories.' + study.category), 'brand', { variant: 'solid' })}</span>` +
      `</div>` +
      `<div class="flex flex-1 flex-col p-5 md:p-6">` +
      `<p class="text-xs font-medium uppercase tracking-wider text-muted">${esc(study.client)} · ${study.year}</p>` +
      `<h3 class="mt-2 font-bold text-heading ${featured ? 'text-title-sm' : 'text-lg'}">${esc(study.title)}</h3>` +
      `<p class="mt-2 line-clamp-2 flex-1 text-sm text-muted">${esc(study.summary)}</p>` +
      (results ? `<div class="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-themed pt-4">${results}</div>` : '') +
      `<span class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">${t(
        'common.viewCase'
      )}${icon('arrow-right', { size: 16, className: 'transition group-hover:translate-x-0.5' })}</span>` +
      `</div></a>`
    );
  }

  // serviceCard(service, detailed?) — mirrors React ServiceCard
  function serviceCard(service, detailed) {
    const deliverables = detailed
      ? `<ul class="mt-4 space-y-2">${service.deliverables
          .map(
            (d) =>
              `<li class="flex items-start gap-2 text-sm text-body">${icon('check', {
                size: 16,
                strokeWidth: 2.4,
                className: 'mt-0.5 text-success-600',
              })}${esc(d)}</li>`
          )
          .join('')}</ul>`
      : '';
    return (
      `<div class="flex flex-col rounded-2xl border border-themed surface-card p-6 shadow-theme-sm transition hover:shadow-theme-md">` +
      `<span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">${icon(service.icon, { size: 22 })}</span>` +
      `<h3 class="mt-5 text-lg font-bold text-heading">${esc(service.name)}</h3>` +
      `<p class="mt-2 text-sm text-muted">${esc(detailed ? service.description : service.summary)}</p>` +
      deliverables +
      `<div class="mt-6 flex items-end justify-between gap-3 border-t border-themed pt-4">` +
      `<div><p class="text-xs text-muted">${t('services.priceFrom')}</p><p class="text-lg font-bold text-heading">${fmt(service.priceFrom)}</p></div>` +
      `<p class="text-xs text-muted">${t('services.weeks', { count: service.weeks })}</p>` +
      `</div>` +
      `<a href="orcamento.html?servico=${encodeURIComponent(service.slug)}" class="mt-4 flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-500 text-sm font-medium text-white transition hover:bg-brand-600">${t(
        'services.request'
      )}${icon('arrow-right', { size: 16 })}</a>` +
      `</div>`
    );
  }

  function stars(rating, size) {
    let out = '';
    for (let i = 0; i < 5; i++) {
      out += icon('star', {
        size: size || 16,
        className: i < rating ? 'text-warning-500' : 'text-gray-300 dark:text-gray-700',
      });
    }
    return out;
  }

  // testimonialCard(item) — mirrors React TestimonialCard
  function testimonialCard(item) {
    return (
      `<figure class="flex h-full flex-col rounded-2xl border border-themed surface-card p-6 shadow-theme-sm">` +
      `<div class="flex gap-0.5">${stars(item.rating)}</div>` +
      `<blockquote class="mt-4 flex-1 text-sm leading-relaxed text-body">“${esc(item.quote)}”</blockquote>` +
      `<figcaption class="mt-5 flex items-center gap-3 border-t border-themed pt-4">` +
      `<img src="${item.avatar}" alt="${esc(item.author)}" loading="lazy" class="h-10 w-10 rounded-full object-cover"/>` +
      `<div class="min-w-0"><p class="truncate text-sm font-semibold text-heading">${esc(item.author)}</p>` +
      `<p class="truncate text-xs text-muted">${esc(item.role)} · ${esc(item.company)}</p></div>` +
      `</figcaption></figure>`
    );
  }

  // teamCard(member) — mirrors React TeamCard
  function teamCard(member) {
    const links = member.links
      .map(
        (l) =>
          `<a href="${l.url}" class="text-xs font-medium text-muted transition hover:text-brand-500">${esc(l.label)}</a>`
      )
      .join('');
    return (
      `<div class="overflow-hidden rounded-2xl border border-themed surface-card shadow-theme-sm">` +
      `<div class="aspect-square overflow-hidden"><img src="${member.photo}" alt="${esc(member.name)}" loading="lazy" class="h-full w-full object-cover"/></div>` +
      `<div class="p-5"><h3 class="text-base font-bold text-heading">${esc(member.name)}</h3>` +
      `<p class="text-sm text-brand-600 dark:text-brand-400">${esc(member.role)}</p>` +
      `<p class="mt-2 text-sm text-muted">${esc(member.bio)}</p>` +
      `<div class="mt-3 flex flex-wrap gap-3">${links}</div></div></div>`
    );
  }

  // processSteps() — mirrors React ProcessSteps
  function processSteps() {
    const items = Data.PROCESS.map((step, i) => {
      const line =
        i < Data.PROCESS.length - 1
          ? '<span class="absolute left-6 top-12 hidden h-px w-full bg-[color:var(--tx-border)] lg:block"></span>'
          : '';
      return (
        `<li class="relative">${line}` +
        `<div class="relative flex h-12 w-12 items-center justify-center rounded-xl border border-themed surface-card text-brand-500">${icon(step.icon, { size: 22 })}</div>` +
        `<p class="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-500">${String(step.step).padStart(2, '0')}</p>` +
        `<h3 class="mt-1 text-base font-bold text-heading">${t(step.titleKey)}</h3>` +
        `<p class="mt-1.5 text-sm text-muted">${t(step.descKey)}</p></li>`
      );
    }).join('');
    return `<ol class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">${items}</ol>`;
  }

  // clientLogos() — faixa de "logos" desenhada em texto, sem depender de arquivos externos.
  function clientLogos() {
    const cells = Data.CLIENTS.map(
      (name) =>
        `<div class="flex h-20 items-center justify-center surface-card px-4 text-base font-semibold uppercase tracking-[0.2em] text-muted transition hover:text-heading">${esc(name)}</div>`
    ).join('');
    return `<div class="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-themed bg-[color:var(--tx-border)] sm:grid-cols-4">${cells}</div>`;
  }

  // faqAccordion(openId) — mirrors React FaqAccordion (page owns the open state)
  function faqAccordion(openId) {
    const rows = Data.FAQS.map((faq) => {
      const isOpen = openId === faq.id;
      return (
        `<div>` +
        `<button type="button" data-faq="${faq.id}" aria-expanded="${isOpen}" class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6">` +
        `<span class="text-sm font-semibold text-heading md:text-base">${t(faq.questionKey)}</span>` +
        icon('chevron-down', { size: 18, className: `shrink-0 text-muted transition ${isOpen ? 'rotate-180' : ''}` }) +
        `</button>` +
        (isOpen ? `<p class="px-5 pb-5 text-sm leading-relaxed text-muted md:px-6">${t(faq.answerKey)}</p>` : '') +
        `</div>`
      );
    }).join('');
    return `<div class="divide-y divide-[color:var(--tx-border)] overflow-hidden rounded-2xl border border-themed surface-card">${rows}</div>`;
  }

  // leadCard(lead) — mirrors React LeadCard (draggable kanban card)
  function leadCard(lead) {
    return (
      `<article draggable="true" data-lead="${lead.id}" class="cursor-pointer rounded-xl border border-themed surface-card p-4 shadow-theme-xs transition hover:shadow-theme-md">` +
      `<div class="flex items-start justify-between gap-2">` +
      `<div class="min-w-0"><p class="truncate text-sm font-semibold text-heading">${esc(lead.company || lead.name)}</p>` +
      `<p class="truncate text-xs text-muted">${esc(lead.name)}</p></div>` +
      badge(t('leadSources.' + lead.source), 'gray') +
      `</div>` +
      `<p class="mt-3 line-clamp-2 text-xs text-muted">${esc(lead.message)}</p>` +
      `<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">` +
      `<span class="inline-flex items-center gap-1">${icon('dollar', { size: 13 })}${esc(lead.budget)}</span>` +
      `<span class="inline-flex items-center gap-1">${icon('clock', { size: 13 })}${esc(lead.deadline)}</span>` +
      `</div>` +
      `<p class="mt-3 border-t border-themed pt-2 text-[11px] text-muted">${fmtDate(lead.createdAt)}</p>` +
      `</article>`
    );
  }

  // stepIndicator(steps, current) — mirrors React StepIndicator (data-step jumps back)
  function stepIndicator(steps, current) {
    const lis = steps
      .map((labelKey, i) => {
        const done = i < current;
        const active = i === current;
        const clickable = i < current;
        const circle = done
          ? 'border-brand-500 bg-brand-500 text-white'
          : active
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-themed text-muted';
        const label = active ? 'text-heading' : done ? 'text-body' : 'text-muted';
        const line =
          i < steps.length - 1
            ? `<span class="mx-3 h-px flex-1 ${done ? 'bg-brand-500' : 'bg-[color:var(--tx-border)]'}"></span>`
            : '';
        return (
          `<li class="flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}">` +
          `<button type="button" ${clickable ? `data-step="${i}"` : 'disabled'} class="flex items-center gap-2.5 ${
            clickable ? 'cursor-pointer' : 'cursor-default'
          }">` +
          `<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition ${circle}">${
            done ? icon('check', { size: 16, strokeWidth: 2.5 }) : i + 1
          }</span>` +
          `<span class="hidden text-sm font-medium sm:block ${label}">${t(labelKey)}</span>` +
          `</button>${line}</li>`
        );
      })
      .join('');
    return `<ol class="flex w-full items-center">${lis}</ol>`;
  }

  // proposalItemsEditor(items, discount, opts) — mirrors React ProposalItemsEditor.
  // Rows carry data-item-index; inputs data-item-field. opts: { readOnly }
  function proposalItemsEditor(items, discount, opts) {
    opts = opts || {};
    const readOnly = !!opts.readOnly;
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    const total = subtotal - (subtotal * discount) / 100;
    const inputCls = 'h-9 w-full rounded-lg border border-themed bg-transparent px-3 text-sm text-body focus-ring';

    const rows = items.length
      ? items
          .map(
            (item, index) =>
              `<tr data-item-index="${index}">` +
              `<td class="px-4 py-2">${
                readOnly
                  ? `<span class="text-body">${esc(item.description)}</span>`
                  : `<input value="${esc(item.description)}" data-item-field="description" class="${inputCls}"/>`
              }</td>` +
              `<td class="px-4 py-2">${
                readOnly
                  ? `<span class="text-body">${item.qty}</span>`
                  : `<input type="number" min="1" value="${item.qty}" data-item-field="qty" class="${inputCls}"/>`
              }</td>` +
              `<td class="px-4 py-2">${
                readOnly
                  ? `<span class="text-body">${fmt(item.price)}</span>`
                  : `<input type="number" min="0" step="100" value="${item.price}" data-item-field="price" class="${inputCls}"/>`
              }</td>` +
              `<td class="px-4 py-2 text-right font-medium text-heading" data-line-total>${fmt(item.qty * item.price)}</td>` +
              (readOnly
                ? ''
                : `<td class="px-2 py-2"><button type="button" data-item-remove="${index}" aria-label="${t(
                    'common.remove'
                  )}" class="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:text-error-500">${icon('trash', { size: 16 })}</button></td>`) +
              `</tr>`
          )
          .join('')
      : `<tr><td colspan="${readOnly ? 4 : 5}" class="px-4 py-6 text-center text-sm text-muted">${t('proposals.noItems')}</td></tr>`;

    return (
      `<div class="space-y-4">` +
      `<div class="overflow-x-auto rounded-xl border border-themed"><table class="w-full min-w-[520px] text-sm">` +
      `<thead><tr class="border-b border-themed text-left text-xs uppercase tracking-wider text-muted">` +
      `<th class="px-4 py-3 font-medium">${t('proposals.item')}</th>` +
      `<th class="w-20 px-4 py-3 font-medium">${t('proposals.qty')}</th>` +
      `<th class="w-36 px-4 py-3 font-medium">${t('proposals.unitPrice')}</th>` +
      `<th class="w-32 px-4 py-3 text-right font-medium">${t('proposals.lineTotal')}</th>` +
      (readOnly ? '' : '<th class="w-12 px-2 py-3"></th>') +
      `</tr></thead>` +
      `<tbody class="divide-y divide-[color:var(--tx-border)]">${rows}</tbody></table></div>` +
      (readOnly
        ? ''
        : `<button type="button" data-item-add class="inline-flex h-9 items-center gap-2 rounded-lg border border-themed px-3 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800">${icon(
            'plus',
            { size: 16 }
          )}${t('proposals.addItem')}</button>`) +
      `<div class="ml-auto w-full max-w-xs space-y-2 rounded-xl border border-themed p-4 text-sm">` +
      `<div class="flex justify-between text-muted"><span>${t('proposals.subtotal')}</span><span data-subtotal>${fmt(subtotal)}</span></div>` +
      `<div class="flex items-center justify-between gap-3 text-muted"><span>${t('proposals.discount')}</span>${
        readOnly
          ? `<span>${discount}%</span>`
          : `<input type="number" min="0" max="100" value="${discount}" data-item-discount class="h-8 w-20 rounded-lg border border-themed bg-transparent px-2 text-right text-sm text-body focus-ring"/>`
      }</div>` +
      `<div class="flex justify-between border-t border-themed pt-2 text-base font-bold text-heading"><span>${t('proposals.total')}</span><span data-total>${fmt(total)}</span></div>` +
      `</div></div>`
    );
  }

  // ============================================================
  // Generic UI: tabs / modal / drawer / table / pagination
  // ============================================================

  // tabs(items, active) — items: [{ label, icon, content }]. Self-contained switcher.
  function tabs(items, active) {
    active = active || 0;
    const heads = items
      .map(
        (it, i) =>
          `<button type="button" data-tab="${i}" class="-mb-px inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
            i === active
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-muted hover:border-gray-300 hover:text-body dark:hover:border-gray-700'
          }">${it.icon ? icon(it.icon, { size: 16 }) : ''}${it.label}</button>`
      )
      .join('');
    return (
      `<div data-tabs><div class="flex gap-1 overflow-x-auto border-b border-themed no-scrollbar" role="tablist">${heads}</div>` +
      `<div data-tab-panel class="pt-5 text-sm text-body" role="tabpanel">${items[active] ? items[active].content : ''}</div></div>`
    );
  }

  // modal(id, opts) — opts: { title, subtitle, body, footer, size }. Hidden by default.
  const MODAL_SIZE = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  function modal(id, opts) {
    opts = opts || {};
    return (
      `<div id="${id}" class="fixed inset-0 z-[80] hidden" data-modal>` +
      `<div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" data-modal-close></div>` +
      `<div class="relative flex min-h-full items-center justify-center p-4"><div class="surface-card w-full ${
        MODAL_SIZE[opts.size] || MODAL_SIZE.md
      } overflow-hidden rounded-2xl border shadow-theme-xl">` +
      `<header class="flex items-center justify-between border-b border-themed px-5 py-4"><div><h3 class="text-base font-semibold text-heading">${
        opts.title || ''
      }</h3>${opts.subtitle ? `<p class="mt-0.5 text-xs text-muted">${opts.subtitle}</p>` : ''}</div>` +
      `<button type="button" data-modal-close aria-label="${t('common.close')}" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">${icon('x', { size: 20 })}</button></header>` +
      `<div class="max-h-[75vh] overflow-y-auto px-5 py-5" data-modal-body>${opts.body || ''}</div>` +
      (opts.footer
        ? `<footer class="flex items-center justify-end gap-2 border-t border-themed px-5 py-3" data-modal-footer>${opts.footer}</footer>`
        : '') +
      `</div></div></div>`
    );
  }
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }
  function closeModal(id) {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.classList.add('hidden');
  }

  // drawer(id, opts) — right-side panel. opts: { title, subtitle, body, footer, width }
  function drawer(id, opts) {
    opts = opts || {};
    return (
      `<div id="${id}" class="fixed inset-0 z-[70] hidden" data-drawer>` +
      `<div class="absolute inset-0 bg-gray-900/50" data-drawer-close></div>` +
      `<aside class="surface-card absolute right-0 top-0 flex h-full w-full ${
        opts.width || 'max-w-md'
      } flex-col border-l shadow-theme-xl" role="dialog">` +
      `<div class="flex items-start justify-between border-b border-themed px-5 py-4"><div>` +
      `<h2 class="text-lg font-semibold text-heading" data-drawer-title>${opts.title || ''}</h2>` +
      `<p class="mt-0.5 text-xs text-muted" data-drawer-subtitle>${opts.subtitle || ''}</p></div>` +
      `<button type="button" data-drawer-close aria-label="${t('common.close')}" class="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-heading">${icon('x', { size: 20 })}</button></div>` +
      `<div class="flex-1 overflow-y-auto px-5 py-4" data-drawer-body>${opts.body || ''}</div>` +
      `<div class="border-t border-themed px-5 py-4" data-drawer-footer>${opts.footer || ''}</div>` +
      `</aside></div>`
    );
  }
  function openDrawer(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }
  function closeDrawer(id) {
    const el = typeof id === 'string' ? document.getElementById(id) : id;
    if (el) el.classList.add('hidden');
  }

  // pageNav(page, totalPages) — numbered pagination, mirrors React Pagination.
  // Buttons carry data-page; the page wires the click handler.
  function pageNav(page, totalPages) {
    if (totalPages <= 1) return '';
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) pages.push(i);
      else if (pages[pages.length - 1] !== '...') pages.push('...');
    }
    const btn =
      'flex h-10 min-w-10 items-center justify-center rounded-lg border border-themed px-3 text-sm font-medium transition disabled:opacity-40';
    const cells = pages
      .map((p, i) =>
        p === '...'
          ? `<span key="gap-${i}" class="px-1 text-muted">…</span>`
          : `<button type="button" data-page="${p}" class="${btn} ${
              p === page ? 'border-brand-500 bg-brand-500 text-white' : 'text-body hover:text-heading'
            }">${p}</button>`
      )
      .join('');
    return (
      `<nav class="flex items-center justify-center gap-2" aria-label="Pagination">` +
      `<button type="button" data-page="${page - 1}" ${page <= 1 ? 'disabled' : ''} aria-label="${t(
        'common.previous'
      )}" class="${btn} text-muted hover:text-heading">${icon('chevron-left', { size: 16 })}</button>` +
      cells +
      `<button type="button" data-page="${page + 1}" ${page >= totalPages ? 'disabled' : ''} aria-label="${t(
        'common.next'
      )}" class="${btn} text-muted hover:text-heading">${icon('chevron-right', { size: 16 })}</button>` +
      `</nav>`
    );
  }

  // dataTable(opts) — opts: { id, columns:[{key,header,sortable,render}], rows, pageSize, searchable, searchKeys }
  const TABLES = {};
  function dataTable(opts) {
    const id = opts.id;
    TABLES[id] = { ...opts, page: 1, sortKey: null, sortDir: 'asc', search: '' };
    return `<div id="${id}" data-table></div>`;
  }
  function setTableRows(id, rows) {
    if (TABLES[id]) {
      TABLES[id].rows = rows;
      TABLES[id].page = 1;
      renderTable(id);
    }
  }
  function pagination(page, pages) {
    if (pages <= 1) return '';
    return (
      `<div class="flex items-center justify-between border-t border-themed px-5 py-3"><span class="text-xs text-muted">${page} / ${pages}</span><div class="flex gap-2"><button type="button" data-table-prev ${
        page <= 1 ? 'disabled' : ''
      } class="flex h-9 items-center gap-1 rounded-lg border border-themed px-3 text-sm text-body disabled:opacity-40">${icon('chevron-left', { size: 14 })}${t('common.previous')}</button><button type="button" data-table-next ${
        page >= pages ? 'disabled' : ''
      } class="flex h-9 items-center gap-1 rounded-lg border border-themed px-3 text-sm text-body disabled:opacity-40">${t('common.next')}${icon('chevron-right', { size: 14 })}</button></div></div>`
    );
  }
  function searchRows(list, query, keys) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return list;
    return list.filter((row) =>
      keys.some((k) => {
        const v = k.split('.').reduce((o, kk) => (o == null ? o : o[kk]), row);
        return v != null && String(v).toLowerCase().includes(q);
      })
    );
  }
  function sortRows(list, key, dir) {
    if (!key) return list;
    const out = [...list];
    out.sort((a, b) => {
      const av = a[key],
        bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === 'number' && typeof bv === 'number') return dir === 'desc' ? bv - av : av - bv;
      const cmp = String(av).localeCompare(String(bv));
      return dir === 'desc' ? -cmp : cmp;
    });
    return out;
  }
  function renderTable(id) {
    const cfg = TABLES[id];
    const wrap = document.getElementById(id);
    if (!cfg || !wrap) return;
    const pageSize = cfg.pageSize || 10;
    const searchable = cfg.searchable !== false;
    const searchKeys = cfg.searchKeys || cfg.columns.filter((c) => c.key).map((c) => c.key);

    let rows = cfg.rows;
    if (searchable) rows = searchRows(rows, cfg.search, searchKeys);
    rows = sortRows(rows, cfg.sortKey, cfg.sortDir);
    const total = rows.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (cfg.page > pages) cfg.page = pages;
    const start = (cfg.page - 1) * pageSize;
    const view = rows.slice(start, start + pageSize);

    const head = cfg.columns
      .map((c) => {
        const sortable = c.sortable !== false && c.key;
        const arrow =
          sortable && cfg.sortKey === c.key ? icon(cfg.sortDir === 'asc' ? 'arrow-up' : 'arrow-down', { size: 12 }) : '';
        return `<th class="px-5 py-3.5 text-left font-medium text-muted ${sortable ? 'cursor-pointer select-none' : ''}" ${
          sortable ? `data-sort="${c.key}"` : ''
        }><span class="inline-flex items-center gap-1.5">${c.header}${arrow}</span></th>`;
      })
      .join('');

    const body = view.length
      ? view
          .map(
            (row, i) =>
              `<tr class="border-b border-themed last:border-0">` +
              cfg.columns.map((c) => `<td class="px-5 py-3.5 text-sm text-body">${c.render ? c.render(row, i) : row[c.key]}</td>`).join('') +
              `</tr>`
          )
          .join('')
      : `<tr><td colspan="${cfg.columns.length}" class="px-5 py-12 text-center text-sm text-muted">${t('common.noResults')}</td></tr>`;

    wrap.innerHTML =
      (searchable
        ? `<div class="mb-4"><div class="relative max-w-xs"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">${icon('search', { size: 16 })}</span><input type="search" data-table-search value="${esc(
            cfg.search
          )}" placeholder="${t('common.search')}" class="h-10 w-full rounded-lg border border-themed bg-transparent pl-9 pr-3 text-sm text-body outline-none focus:border-brand-300 focus-ring"/></div></div>`
        : '') +
      `<div class="surface-card overflow-hidden rounded-2xl border"><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-themed bg-gray-50/50 dark:bg-gray-900/30">${head}</tr></thead><tbody>${body}</tbody></table></div>${pagination(
        cfg.page,
        pages
      )}</div>`;
  }

  // ============================================================
  // Chrome: public navbar / footer
  // ============================================================
  const PUBLIC_LINKS = [
    { href: 'cases.html', key: 'nav.cases' },
    { href: 'servicos.html', key: 'nav.services' },
    { href: 'sobre.html', key: 'nav.about' },
    { href: 'contato.html', key: 'nav.contact' },
  ];

  function brandLogo(size, rounded) {
    return `<span class="flex h-9 w-9 items-center justify-center ${
      rounded || 'rounded-xl'
    } bg-brand-500 text-white shadow-theme-md">${icon('sparkles', { size: size || 18 })}</span>`;
  }

  function renderPublicNavbar() {
    const dark = UIState.get().darkMode;
    const isAuth = Auth.isAuthenticated();
    const here = window.location.pathname.split('/').pop() || 'index.html';
    const links = PUBLIC_LINKS.map(
      (l) =>
        `<a href="${l.href}" class="rounded-lg px-3 py-2 text-sm font-medium transition ${
          l.href === here ? 'text-brand-600 dark:text-brand-400' : 'text-body hover:text-heading'
        }">${t(l.key)}</a>`
    ).join('');
    const mobileLinks = PUBLIC_LINKS.map(
      (l) =>
        `<a href="${l.href}" class="rounded-lg px-3 py-2.5 text-sm font-medium text-body hover:bg-gray-50 dark:hover:bg-gray-800">${t(l.key)}</a>`
    ).join('');

    const account = isAuth
      ? `<a href="app.html" class="hidden h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:flex">${t('nav.dashboard')}</a>`
      : `<a href="login.html" class="hidden h-10 items-center rounded-lg border border-themed px-4 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:flex">${t(
          'nav.login'
        )}</a><a href="orcamento.html" class="hidden h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:flex">${icon(
          'file-text',
          { size: 16 }
        )}${t('nav.brief')}</a>`;

    const mobileAccount = isAuth
      ? `<a href="app.html" class="flex h-11 items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white">${t('nav.dashboard')}</a>`
      : `<a href="login.html" class="flex h-11 items-center justify-center rounded-lg border border-themed text-sm font-medium text-body">${t(
          'nav.login'
        )}</a><a href="orcamento.html" class="flex h-11 items-center justify-center rounded-lg bg-brand-500 text-sm font-medium text-white">${t('nav.brief')}</a>`;

    return (
      `<div class="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">` +
      `<a href="index.html" class="flex items-center gap-2.5">${brandLogo()}<span class="text-lg font-bold text-heading">${t('brand')}</span></a>` +
      `<nav class="ml-6 hidden items-center gap-1 lg:flex">${links}</nav>` +
      `<div class="ml-auto flex items-center gap-1 sm:gap-2">` +
      `<button type="button" data-action="toggle-dark" aria-label="${t('common.theme')}" class="flex h-10 w-10 items-center justify-center rounded-full border border-themed text-body transition hover:bg-gray-50 dark:hover:bg-gray-800">${icon(
        dark ? 'sun' : 'moon',
        { size: 18 }
      )}</button>` +
      langDropdown('tx-lang') +
      account +
      `<button type="button" data-action="toggle-mobile-menu" class="flex h-10 w-10 items-center justify-center rounded-lg text-body lg:hidden" aria-label="Menu">${icon('menu', { size: 22 })}</button>` +
      `</div></div>` +
      `<div id="tx-mobile-menu" class="surface-card border-t border-themed lg:hidden hidden"><nav class="flex flex-col gap-1 px-4 py-4 sm:px-6">${mobileLinks}<div class="mt-2 flex flex-col gap-2 border-t border-themed pt-3">${mobileAccount}</div></nav></div>`
    );
  }

  function renderPublicFooter() {
    const year = new Date().getFullYear();
    const links = [
      ['nav.cases', 'cases.html'],
      ['nav.services', 'servicos.html'],
      ['nav.brief', 'orcamento.html'],
      ['nav.about', 'sobre.html'],
      ['nav.contact', 'contato.html'],
    ]
      .map(([key, href]) => `<a href="${href}" class="text-muted transition hover:text-brand-600">${t(key)}</a>`)
      .join('');
    const social = ['github', 'slack', 'globe']
      .map(
        (ic) =>
          `<a href="#" aria-label="${ic}" class="flex h-9 w-9 items-center justify-center rounded-full border border-themed text-muted transition hover:text-brand-500">${icon(ic, { size: 16 })}</a>`
      )
      .join('');
    return (
      `<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">` +
      `<div class="flex flex-col items-start justify-between gap-8 lg:flex-row">` +
      `<div class="max-w-sm"><a href="index.html" class="flex items-center gap-2.5">${brandLogo()}<span class="text-lg font-bold text-heading">${t(
        'brand'
      )}</span></a><p class="mt-4 text-sm text-muted">${t('landing.footer.tagline')}</p></div>` +
      `<div class="flex flex-wrap gap-x-10 gap-y-2 text-sm">${links}</div>` +
      `</div>` +
      `<div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-themed pt-6 sm:flex-row"><p class="text-xs text-muted">© ${year} ${t(
        'brand'
      )}. ${t('landing.footer.rights')}</p><div class="flex items-center gap-3">${social}</div></div>` +
      `</div>`
    );
  }

  // ============================================================
  // Chrome: app sidebar / topbar / footer
  // ============================================================
  const APP_SECTIONS = [
    {
      titleKey: 'appNav.commercial',
      items: [
        { href: 'app.html', labelKey: 'appNav.dashboard', icon: 'dashboard' },
        { href: 'app-leads.html', labelKey: 'appNav.leads', icon: 'users' },
        { href: 'app-orcamentos.html', labelKey: 'appNav.proposals', icon: 'file-text' },
      ],
    },
    {
      titleKey: 'appNav.content',
      items: [
        { href: 'app-cases.html', labelKey: 'appNav.cases', icon: 'briefcase' },
        { href: 'app-servicos.html', labelKey: 'appNav.services', icon: 'layers' },
        { href: 'app-depoimentos.html', labelKey: 'appNav.testimonials', icon: 'message-circle' },
      ],
    },
    {
      titleKey: 'appNav.settingsSection',
      items: [{ href: 'app-configuracoes.html', labelKey: 'appNav.settings', icon: 'settings' }],
    },
  ];

  function renderSidebar() {
    const collapsed = UIState.get().sidebarCollapsed;
    const here = window.location.pathname.split('/').pop() || 'app.html';
    const navCls = (active) =>
      `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${collapsed ? 'justify-center' : ''} ${
        active ? 'is-sidebar-active' : 'is-sidebar-inactive'
      }`;

    const sections = APP_SECTIONS.map(
      (section) =>
        `<nav>${
          collapsed ? '' : `<h3 class="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider">${t(section.titleKey)}</h3>`
        }<ul class="flex flex-col gap-1">${section.items
          .map((item) => {
            const active = item.href === here;
            return `<li><a href="${item.href}" class="${navCls(active)}" ${
              collapsed ? `title="${t(item.labelKey)}"` : ''
            }>${icon(item.icon, { size: 20 })}${collapsed ? '' : `<span class="flex-1">${t(item.labelKey)}</span>`}</a></li>`;
          })
          .join('')}</ul></nav>`
    ).join('');

    return (
      `<div class="flex items-center pt-7 pb-6 ${collapsed ? 'justify-center' : 'justify-between'}">` +
      `<a href="app.html" class="flex items-center gap-2.5"><span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-theme-sm">${icon(
        'sparkles',
        { size: 18 }
      )}</span>${collapsed ? '' : `<span data-brand-text class="text-lg font-semibold">${t('brand')}</span>`}</a>` +
      (collapsed
        ? ''
        : `<button type="button" data-action="toggle-sidebar" class="is-sidebar-inactive hidden h-8 w-8 items-center justify-center rounded-lg border border-themed lg:flex" title="${t(
            'appNav.collapse'
          )}">${icon('chevron-right', { size: 14, className: 'rotate-180' })}</button>`) +
      `</div>` +
      `<div class="flex flex-col gap-5 overflow-y-auto no-scrollbar pb-4">${sections}</div>` +
      `<div class="mt-auto space-y-3 border-t border-themed py-4">` +
      (collapsed
        ? ''
        : `<div class="rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10"><p class="text-xs font-medium text-muted">${t(
            'appNav.proTitle'
          )}</p><p class="mt-0.5 text-sm font-semibold text-heading">${t(
            'appNav.proDesc'
          )}</p><a href="app-leads.html" class="mt-3 flex h-9 w-full items-center justify-center rounded-lg bg-brand-500 text-xs font-medium text-white transition hover:bg-brand-600">${t(
            'appNav.openLeads'
          )}</a></div>`) +
      `<button type="button" data-action="logout" class="${navCls(false)} w-full" ${
        collapsed ? `title="${t('appNav.logout')}"` : ''
      }>${icon('logout', { size: 20 })}${collapsed ? '' : `<span>${t('appNav.logout')}</span>`}</button>` +
      `</div>`
    );
  }

  const NOTIFICATIONS = [
    { id: 1, key: 'newLead', name: 'Lume Cosméticos', time: 'Há 5 min', read: false },
    { id: 2, key: 'proposalAccepted', name: 'PRO-2026-011', time: 'Há 18 min', read: false },
    { id: 3, key: 'casePublished', name: 'Rebranding Norte', time: 'Há 2 horas', read: true },
  ];

  function renderTopbar() {
    const dark = UIState.get().darkMode;
    const user = Auth.getUser();
    const notifs = NOTIFICATIONS.map(
      (n) =>
        `<li class="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800"><span class="mt-1 flex h-2 w-2 shrink-0 rounded-full ${
          n.read ? 'bg-gray-300' : 'bg-brand-500'
        }"></span><div class="flex-1"><p class="text-sm font-medium text-heading">${t('notifications.' + n.key, {
          name: n.name,
        })}</p><p class="text-xs text-muted">${n.time}</p></div></li>`
    ).join('');

    return (
      `<div class="flex flex-grow items-center justify-between gap-4 px-4 py-3 md:px-6 2xl:px-10">` +
      `<div class="flex items-center gap-3">` +
      `<button type="button" data-action="toggle-sidebar-responsive" class="flex h-10 w-10 items-center justify-center rounded-lg border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800" aria-label="Toggle sidebar">${icon(
        'menu',
        { size: 20 }
      )}</button>` +
      `<a href="app-leads.html" class="hidden h-10 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600 sm:flex">${icon(
        'users',
        { size: 18 }
      )}${t('appNav.leads')}</a>` +
      `</div>` +
      `<div class="flex items-center gap-2">` +
      `<a href="index.html" class="hidden h-10 items-center gap-2 rounded-lg border border-themed px-3 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800 sm:flex">${icon(
        'globe',
        { size: 16 }
      )}${t('brand')}</a>` +
      langDropdown('tx-app-lang') +
      `<button type="button" data-action="toggle-dark" class="flex h-10 w-10 items-center justify-center rounded-full border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800" aria-label="${t(
        'common.theme'
      )}">${icon(dark ? 'sun' : 'moon', { size: 18 })}</button>` +
      `<div class="relative" id="tx-notif"><button type="button" data-action="toggle-menu" data-menu="#tx-notif-menu" class="relative flex h-10 w-10 items-center justify-center rounded-full border border-themed text-muted hover:bg-gray-50 dark:hover:bg-gray-800" aria-label="${t(
        'appNav.notifications'
      )}">${icon('bell', {
        size: 18,
      })}<span class="absolute top-1.5 right-1.5 flex h-2 w-2"><span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-error-400 opacity-75"></span><span class="relative inline-flex h-2 w-2 rounded-full bg-error-500"></span></span></button>` +
      `<div id="tx-notif-menu" class="surface-card absolute right-0 mt-3 w-80 rounded-xl border shadow-theme-lg hidden z-50"><div class="flex items-center justify-between border-b border-themed px-4 py-3"><p class="text-sm font-semibold text-heading">${t(
        'appNav.notifications'
      )}</p></div><ul class="max-h-72 divide-themed overflow-y-auto">${notifs}</ul></div></div>` +
      `<div class="relative" id="tx-profile"><button type="button" data-action="toggle-menu" data-menu="#tx-profile-menu" class="ml-1 flex items-center gap-3"><span class="hidden text-right lg:block"><span class="block text-sm font-medium text-heading">${esc(
        (user && user.name) || 'Convidado'
      )}</span><span class="block text-xs text-muted">${esc((user && user.role) || '—')}</span></span>${avatar(
        (user && user.name) || '?',
        'md'
      )}${icon('chevron-down', { size: 16, className: 'text-muted' })}</button>` +
      `<div id="tx-profile-menu" class="surface-card absolute right-0 mt-3 w-56 rounded-xl border shadow-theme-lg hidden z-50"><div class="border-b border-themed px-4 py-3"><p class="text-sm font-medium text-heading">${esc(
        (user && user.name) || 'Convidado'
      )}</p><p class="text-xs text-muted">${esc((user && user.email) || '')}</p></div>` +
      `<ul class="py-1"><li><a href="app-configuracoes.html" class="flex items-center gap-2 px-4 py-2 text-sm text-body hover:bg-gray-50 dark:hover:bg-gray-800">${icon(
        'settings',
        { size: 16 }
      )} ${t('appNav.settings')}</a></li></ul>` +
      `<div class="border-t border-themed py-1"><button type="button" data-action="logout" class="flex w-full items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-error-500/10">${icon(
        'logout',
        { size: 16 }
      )} ${t('appNav.logout')}</button></div></div></div>` +
      `</div></div>`
    );
  }

  function renderAppFooter() {
    const year = new Date().getFullYear();
    return (
      `<div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">` +
      `<p class="text-xs text-muted">© ${year} ${t('brand')}. ${t('landing.footer.rights')}</p>` +
      `<div class="flex items-center gap-4 text-xs text-muted"><a href="sobre.html" class="hover:text-brand-500">${t(
        'nav.about'
      )}</a><a href="contato.html" class="hover:text-brand-500">${t('nav.contact')}</a><a href="cases.html" class="hover:text-brand-500">${t(
        'nav.cases'
      )}</a></div></div>`
    );
  }

  // ============================================================
  // Cookie banner + toasts
  // ============================================================
  function renderCookieBanner() {
    const ui = UIState.get();
    if (!ui.showCookieBanner) return '';
    return (
      `<div class="fixed inset-x-0 bottom-0 z-[90] p-4"><div class="surface-card mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border p-5 shadow-theme-xl sm:flex-row sm:items-center">` +
      `<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/15">${icon('cookie', { size: 22 })}</span>` +
      `<div class="flex-1"><p class="text-sm font-semibold text-heading">${t('cookie.title')}</p>` +
      `<p class="mt-0.5 text-xs text-muted">${t('cookie.desc')} <a href="#" class="font-medium text-brand-500 hover:text-brand-600">${t(
        'cookie.policy'
      )}</a></p></div>` +
      `<div class="flex shrink-0 items-center gap-2">` +
      `<button type="button" data-action="decline-cookies" class="focus-ring rounded-lg border border-themed px-4 py-2 text-sm font-medium text-body transition hover:bg-gray-50 dark:hover:bg-gray-800">${t(
        'cookie.decline'
      )}</button>` +
      `<button type="button" data-action="accept-cookies" class="focus-ring rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600">${t(
        'cookie.accept'
      )}</button>` +
      `</div></div></div>`
    );
  }
  function updateCookieBanner() {
    const el = document.getElementById('tx-cookie');
    if (el) el.innerHTML = renderCookieBanner();
  }

  const TOAST_STYLES = {
    success: { border: 'border-success-200 dark:border-success-500/30', icon: 'check', color: 'text-success-500' },
    error: { border: 'border-error-200 dark:border-error-500/30', icon: 'x', color: 'text-error-500' },
    warning: { border: 'border-warning-200 dark:border-warning-500/30', icon: 'bell', color: 'text-warning-500' },
    info: { border: 'border-blue-light-200 dark:border-blue-light-500/30', icon: 'bell', color: 'text-blue-light-500' },
  };
  function notify(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;
    const s = TOAST_STYLES[type] || TOAST_STYLES.info;
    const stack = document.getElementById('tx-toast-stack');
    if (!stack) {
      console.log('[notify]', message);
      return;
    }
    const el = document.createElement('div');
    el.className =
      'pointer-events-auto flex w-80 items-start gap-3 rounded-lg border bg-white p-4 shadow-theme-md dark:bg-gray-dark ' + s.border;
    el.innerHTML =
      '<span class="' + s.color + '">' + icon(s.icon, { size: 20 }) + '</span>' +
      '<div class="flex-1"><p class="text-sm font-medium text-heading">' + esc(message) + '</p></div>' +
      '<button type="button" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">' + icon('x', { size: 16 }) + '</button>';
    el.querySelector('button').addEventListener('click', () => el.remove());
    stack.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  // ============================================================
  // DOM update helpers
  // ============================================================
  function updateNavbar() {
    const el = document.getElementById('tx-navbar');
    if (el) el.innerHTML = renderPublicNavbar();
  }
  function updateFooter() {
    const el = document.getElementById('tx-footer');
    if (el) el.innerHTML = renderPublicFooter();
  }
  function updateSidebar() {
    const el = document.getElementById('tx-sidebar');
    if (!el) return;
    el.style.width = UIState.get().sidebarCollapsed ? '90px' : '280px';
    el.innerHTML = renderSidebar();
  }
  function updateTopbar() {
    const el = document.getElementById('tx-topbar');
    if (el) el.innerHTML = renderTopbar();
  }
  function updateAppFooter() {
    const el = document.getElementById('tx-app-footer');
    if (el) el.innerHTML = renderAppFooter();
  }
  function updateSidebarMobile() {
    const el = document.getElementById('tx-sidebar');
    const overlay = document.getElementById('tx-sidebar-overlay');
    if (!el) return;
    const open = UIState.get().sidebarMobileOpen;
    el.classList.toggle('translate-x-0', open);
    el.classList.toggle('-translate-x-full', !open);
    if (overlay) overlay.classList.toggle('hidden', !open);
  }

  // ============================================================
  // Event delegation
  // ============================================================
  function closeAllMenus(except) {
    document.querySelectorAll('[id$="-menu"]').forEach((m) => {
      if (m !== except) m.classList.add('hidden');
    });
  }

  function handleClick(e) {
    const trigger = e.target.closest(
      '[data-action], [data-sort], [data-table-prev], [data-table-next], [data-tab], [data-modal-close], [data-drawer-close]'
    );

    if (
      !trigger ||
      ((trigger.getAttribute('data-action') || '').indexOf('toggle-menu') === -1 &&
        trigger.getAttribute('data-action') !== 'toggle-lang')
    ) {
      closeAllMenus();
    }
    if (!trigger) return;

    if (trigger.hasAttribute('data-tab')) {
      const wrap = trigger.closest('[data-tabs]');
      if (wrap && typeof global.onTabChange === 'function') global.onTabChange(Number(trigger.getAttribute('data-tab')), wrap);
      return;
    }

    if (trigger.hasAttribute('data-sort')) {
      const wrap = trigger.closest('[data-table]');
      const cfg = TABLES[wrap.id];
      const key = trigger.getAttribute('data-sort');
      if (cfg.sortKey === key) cfg.sortDir = cfg.sortDir === 'asc' ? 'desc' : 'asc';
      else {
        cfg.sortKey = key;
        cfg.sortDir = 'asc';
      }
      renderTable(wrap.id);
      return;
    }
    if (trigger.hasAttribute('data-table-prev') || trigger.hasAttribute('data-table-next')) {
      const wrap = trigger.closest('[data-table]');
      const cfg = TABLES[wrap.id];
      cfg.page += trigger.hasAttribute('data-table-next') ? 1 : -1;
      renderTable(wrap.id);
      return;
    }

    if (trigger.hasAttribute('data-modal-close')) {
      closeModal(trigger.closest('[data-modal]'));
      return;
    }
    if (trigger.hasAttribute('data-drawer-close')) {
      closeDrawer(trigger.closest('[data-drawer]'));
      return;
    }

    const action = trigger.getAttribute('data-action');
    switch (action) {
      case 'toggle-dark':
        UIState.toggleDarkMode();
        if (SHELL === 'public') updateNavbar();
        else if (SHELL === 'app') updateTopbar();
        if (typeof global.onThemeChange === 'function') setTimeout(global.onThemeChange, 50);
        break;
      case 'toggle-lang':
      case 'toggle-menu': {
        e.stopPropagation();
        const sel = trigger.getAttribute('data-menu');
        const menu = sel && document.querySelector(sel);
        closeAllMenus(menu);
        if (menu) menu.classList.toggle('hidden');
        break;
      }
      case 'set-lang':
        e.stopPropagation();
        closeAllMenus();
        if (global.I18n) global.I18n.setLang(trigger.getAttribute('data-lang'));
        break;
      case 'toggle-mobile-menu':
        if (document.getElementById('tx-mobile-menu')) document.getElementById('tx-mobile-menu').classList.toggle('hidden');
        break;
      case 'toggle-sidebar':
        UIState.toggleSidebar();
        updateSidebar();
        break;
      case 'toggle-sidebar-responsive':
        if (window.innerWidth < 1024) UIState.toggleSidebarMobile();
        else {
          UIState.toggleSidebar();
          updateSidebar();
        }
        break;
      case 'close-sidebar-mobile':
        UIState.toggleSidebarMobile(false);
        break;
      case 'logout':
        Auth.logout();
        window.location.href = 'login.html';
        break;
      case 'accept-cookies':
        UIState.acceptCookies();
        updateCookieBanner();
        break;
      case 'decline-cookies':
        UIState.declineCookies();
        updateCookieBanner();
        break;
      case 'open-cookie-banner':
        UIState.openCookieBanner();
        updateCookieBanner();
        break;
    }
  }

  function handleInput(e) {
    const search = e.target.closest('[data-table-search]');
    if (search) {
      const wrap = search.closest('[data-table]');
      const cfg = TABLES[wrap.id];
      cfg.search = search.value;
      cfg.page = 1;
      renderTable(wrap.id);
      const input = document.querySelector(`#${wrap.id} [data-table-search]`);
      if (input) {
        input.focus();
        const v = input.value;
        input.setSelectionRange(v.length, v.length);
      }
    }
  }

  // ============================================================
  // Init
  // ============================================================
  function buildPublicShell(inner) {
    return (
      `<div class="flex min-h-screen flex-col" style="background-color:var(--tx-body-bg)">` +
      `<header id="tx-navbar" class="surface-header sticky top-0 z-40 border-b border-themed backdrop-blur"></header>` +
      `<main id="tx-main" class="flex-1">${inner}</main>` +
      `<footer id="tx-footer" class="border-t border-themed surface-card"></footer>` +
      `<div id="tx-cookie"></div>` +
      `<div id="tx-toast-stack" class="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2"></div>` +
      `</div>`
    );
  }

  function buildAppShell(inner) {
    const here = window.location.pathname.split('/').pop() || 'app.html';
    // The leads kanban uses the full width of the viewport.
    const wide = here === 'app-leads.html';
    const main = wide
      ? `<main class="flex-1"><div class="h-full p-3 md:p-4">${inner}</div></main>`
      : `<main class="flex-1"><div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">${inner}</div></main>`;
    return (
      `<div class="flex h-screen overflow-hidden" style="background-color:var(--tx-body-bg)">` +
      `<aside id="tx-sidebar" class="surface-sidebar fixed left-0 top-0 z-50 flex h-screen flex-col overflow-y-hidden border-r px-4 transition-transform duration-300 -translate-x-full lg:static lg:translate-x-0" style="width:280px"></aside>` +
      `<div id="tx-sidebar-overlay" class="fixed inset-0 z-40 bg-gray-900/50 lg:hidden hidden" data-action="close-sidebar-mobile"></div>` +
      `<div class="relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto">` +
      `<header id="tx-topbar" class="surface-header sticky top-0 z-30 flex w-full border-b"></header>` +
      main +
      (wide ? '' : `<footer id="tx-app-footer" class="surface-header border-t px-4 py-4 md:px-6 2xl:px-10"></footer>`) +
      `</div>` +
      `<div id="tx-cookie"></div>` +
      `<div id="tx-toast-stack" class="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2"></div>` +
      `</div>`
    );
  }

  function buildBlankShell(inner) {
    return inner + `<div id="tx-toast-stack" class="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-2"></div>`;
  }

  function init() {
    const app = document.getElementById('app');
    if (!app) return;

    if (SHELL === 'app' || document.body.getAttribute('data-guard') === 'true') {
      if (!Auth.requireAuth()) return;
    }

    const inner = app.innerHTML;
    if (SHELL === 'app') app.outerHTML = buildAppShell(inner);
    else if (SHELL === 'blank') app.outerHTML = buildBlankShell(inner);
    else app.outerHTML = buildPublicShell(inner);

    global.UIToast = notify;
    global.notify = notify;

    const renderChrome = () => {
      if (SHELL === 'public') {
        updateNavbar();
        updateFooter();
        updateCookieBanner();
      } else if (SHELL === 'app') {
        updateSidebar();
        updateTopbar();
        updateAppFooter();
        updateSidebarMobile();
        updateCookieBanner();
      }
    };
    renderChrome();

    // Surface the cookie banner on first visit (no choice persisted yet).
    if (SHELL !== 'blank' && !UIState.get().cookiesAccepted) {
      setTimeout(() => {
        UIState.openCookieBanner();
        updateCookieBanner();
      }, 800);
    }

    document.addEventListener('i18n:changed', () => {
      renderChrome();
      if (typeof global.renderPage === 'function') global.renderPage();
    });

    UIState.subscribe(() => {
      if (SHELL === 'app') updateSidebarMobile();
    });

    document.addEventListener('click', handleClick);
    document.addEventListener('input', handleInput);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllMenus();
        document.querySelectorAll('[data-modal]:not(.hidden)').forEach((m) => m.classList.add('hidden'));
        document.querySelectorAll('[data-drawer]:not(.hidden)').forEach((m) => m.classList.add('hidden'));
        if (UIState.get().sidebarMobileOpen) UIState.toggleSidebarMobile(false);
      }
    });

    if (global.I18n) global.I18n.whenReady(() => typeof global.renderPage === 'function' && global.renderPage());
    else if (typeof global.renderPage === 'function') global.renderPage();
  }

  // Expose helpers for pages.
  global.UI = {
    t,
    tArr,
    lang,
    esc,
    fmt,
    fmtCompact,
    fmtNumber,
    fmtDate,
    fmtDateTime,
    fmtTime,
    fromNow,
    icon,
    notify,
    avatar,
    badge,
    stagePill,
    proposalPill,
    stars,
    kpiCard,
    emptyState,
    breadcrumb,
    pageHeader,
    switchToggle,
    caseCard,
    serviceCard,
    testimonialCard,
    teamCard,
    processSteps,
    clientLogos,
    faqAccordion,
    leadCard,
    stepIndicator,
    proposalItemsEditor,
    tabs,
    modal,
    openModal,
    closeModal,
    drawer,
    openDrawer,
    closeDrawer,
    dataTable,
    setTableRows,
    renderTable,
    pagination,
    pageNav,
    brandLogo,
  };
  global.Layout = { init, updateNavbar, updateFooter, updateSidebar, updateTopbar };

  if (document.getElementById('app')) init();
  else document.addEventListener('DOMContentLoaded', init);
})(window);
