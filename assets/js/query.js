/* ===== Query helpers — lookups, filtros, funil, receita e paginação =====
   Ports React src/data/query.ts. */
(function (global) {
  // ---- Lookups ------------------------------------------------------------

  function serviceById(list, id) {
    return list.find((s) => s.id === id);
  }
  function serviceBySlug(list, slug) {
    return list.find((s) => s.slug === slug);
  }
  function caseById(list, id) {
    return list.find((c) => c.id === id);
  }
  function caseBySlug(list, slug) {
    return list.find((c) => c.slug === slug);
  }
  function leadById(list, id) {
    return list.find((l) => l.id === id);
  }
  function proposalById(list, id) {
    return list.find((p) => p.id === id);
  }

  /** Serviços vinculados a um case, na ordem em que aparecem no case. */
  function servicesOfCase(services, study) {
    return study.serviceIds.map((id) => serviceById(services, id)).filter(Boolean);
  }

  // ---- Cases: busca, filtro e ordenação -----------------------------------

  // filterCases(list, f) — f: { search, category, serviceId, onlyPublished, onlyFeatured }
  function filterCases(list, f) {
    f = f || {};
    const term = (f.search || '').trim().toLowerCase();
    return list.filter((c) => {
      if (f.onlyPublished && !c.published) return false;
      if (f.onlyFeatured && !c.featured) return false;
      if (f.category && f.category !== 'all' && c.category !== f.category) return false;
      if (f.serviceId && f.serviceId !== 'all' && !c.serviceIds.includes(f.serviceId)) return false;
      if (!term) return true;
      return (
        c.title.toLowerCase().includes(term) ||
        c.client.toLowerCase().includes(term) ||
        c.summary.toLowerCase().includes(term) ||
        c.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }

  /** Cases publicados, mais recentes primeiro, destaque na frente. */
  function sortCases(list) {
    return [...list].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.year - a.year || a.title.localeCompare(b.title);
    });
  }

  function featuredCases(list, limit) {
    limit = limit == null ? 3 : limit;
    return sortCases(list.filter((c) => c.published && c.featured)).slice(0, limit);
  }

  /** Próximo case publicado depois do atual, voltando ao início no fim da lista. */
  function nextCase(list, current) {
    const published = sortCases(list.filter((c) => c.published));
    if (published.length < 2) return undefined;
    const idx = published.findIndex((c) => c.id === current.id);
    if (idx === -1) return published[0];
    return published[(idx + 1) % published.length];
  }

  /** Cases relacionados: mesma categoria primeiro, depois serviços em comum. */
  function relatedCases(list, current, limit) {
    limit = limit == null ? 3 : limit;
    const others = list.filter((c) => c.published && c.id !== current.id);
    const score = (c) => {
      let s = 0;
      if (c.category === current.category) s += 3;
      s += c.serviceIds.filter((id) => current.serviceIds.includes(id)).length;
      s += c.tags.filter((tg) => current.tags.includes(tg)).length;
      return s;
    };
    return [...others].sort((a, b) => score(b) - score(a) || b.year - a.year).slice(0, limit);
  }

  // ---- Serviços -----------------------------------------------------------

  function servicesByCategory(list, category) {
    if (category === 'all') return list.filter((s) => s.active);
    return list.filter((s) => s.active && s.category === category);
  }

  function serviceCategories(list) {
    const seen = [];
    for (const s of list) if (!seen.includes(s.category)) seen.push(s.category);
    return seen;
  }

  // ---- Depoimentos --------------------------------------------------------

  function approvedTestimonials(list) {
    return list.filter((t) => t.approved);
  }

  function testimonialForCase(list, caseId) {
    return list.find((t) => t.approved && t.caseId === caseId);
  }

  // ---- Leads --------------------------------------------------------------

  // filterLeads(list, f) — f: { search, stage, source }
  function filterLeads(list, f) {
    f = f || {};
    const term = (f.search || '').trim().toLowerCase();
    return list.filter((l) => {
      if (f.stage && f.stage !== 'all' && l.stage !== f.stage) return false;
      if (f.source && f.source !== 'all' && l.source !== f.source) return false;
      if (!term) return true;
      return (
        l.name.toLowerCase().includes(term) ||
        l.company.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term)
      );
    });
  }

  const LEAD_STAGES = ['novo', 'contato', 'proposta', 'ganho', 'perdido'];

  /** Contagem e valor estimado por estágio, para o funil do dashboard. */
  function leadFunnel(leads, proposals) {
    return LEAD_STAGES.map((stage) => {
      const rows = leads.filter((l) => l.stage === stage);
      const amount = rows.reduce((sum, l) => {
        const p = proposals.find((pr) => pr.leadId === l.id);
        return sum + (p ? proposalTotal(p) : 0);
      }, 0);
      return { stage, count: rows.length, amount };
    });
  }

  /** Leads mais recentes primeiro. */
  function recentLeads(list, limit) {
    limit = limit == null ? 5 : limit;
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
  }

  function leadsThisMonth(list) {
    const now = new Date();
    return list.filter((l) => {
      const d = new Date(l.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }

  // ---- Propostas ----------------------------------------------------------

  function proposalSubtotal(p) {
    return p.items.reduce((sum, i) => sum + i.qty * i.price, 0);
  }

  function proposalDiscountValue(p) {
    return (proposalSubtotal(p) * p.discount) / 100;
  }

  function proposalTotal(p) {
    return proposalSubtotal(p) - proposalDiscountValue(p);
  }

  function openProposals(list) {
    return list.filter((p) => p.status === 'enviada');
  }

  function wonRevenue(list) {
    return list.filter((p) => p.status === 'aceita').reduce((sum, p) => sum + proposalTotal(p), 0);
  }

  /** Aceitas / (aceitas + recusadas), em percentual. */
  function winRate(list) {
    const decided = list.filter((p) => p.status === 'aceita' || p.status === 'recusada');
    if (decided.length === 0) return 0;
    const won = decided.filter((p) => p.status === 'aceita').length;
    return Math.round((won / decided.length) * 100);
  }

  function isExpired(p) {
    return p.status === 'enviada' && new Date(p.validUntil) < new Date();
  }

  /** Receita aceita distribuída pelos serviços dos leads correspondentes. */
  function revenueByService(proposals, leads, services) {
    const totals = new Map();
    for (const p of proposals) {
      if (p.status !== 'aceita') continue;
      const lead = p.leadId ? leadById(leads, p.leadId) : undefined;
      const matched = ((lead && lead.scope) || [])
        .map((slug) => serviceBySlug(services, slug))
        .filter(Boolean);
      const targets = matched.length > 0 ? matched : services.slice(0, 1);
      if (targets.length === 0) continue;
      const share = proposalTotal(p) / targets.length;
      for (const s of targets) totals.set(s.id, (totals.get(s.id) || 0) + share);
    }
    const grand = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
    return [...totals.entries()]
      .map(([serviceId, amount]) => {
        const s = serviceById(services, serviceId);
        return {
          serviceId,
          name: s ? s.name : '—',
          amount,
          share: Math.round((amount / grand) * 100),
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }

  // ---- Paginação ----------------------------------------------------------

  function paginate(list, page, perPage) {
    const start = (page - 1) * perPage;
    return list.slice(start, start + perPage);
  }

  function pageCount(total, perPage) {
    return Math.max(1, Math.ceil(total / perPage));
  }

  global.Query = {
    serviceById,
    serviceBySlug,
    caseById,
    caseBySlug,
    leadById,
    proposalById,
    servicesOfCase,
    filterCases,
    sortCases,
    featuredCases,
    nextCase,
    relatedCases,
    servicesByCategory,
    serviceCategories,
    approvedTestimonials,
    testimonialForCase,
    filterLeads,
    LEAD_STAGES,
    leadFunnel,
    recentLeads,
    leadsThisMonth,
    proposalSubtotal,
    proposalDiscountValue,
    proposalTotal,
    openProposals,
    wonRevenue,
    winRate,
    isExpired,
    revenueByService,
    paginate,
    pageCount,
  };
})(window);
