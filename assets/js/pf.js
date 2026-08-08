/* ===== Portfolio store — mirrors React usePortfolioStore + useBriefStore =====
   Domain data persisted under "pf-data"; briefing draft under "pf-brief". */
(function (global) {
  const STORAGE_KEY = 'pf-data';
  const BRIEF_KEY = 'pf-brief';

  function clone(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function slugify(s) {
    return String(s)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const nextId = (rows) => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1);

  function nextProposalCode(rows) {
    const year = new Date().getFullYear();
    const seq = rows.filter((p) => p.code.includes(String(year))).length + 1;
    return `PRO-${year}-${String(seq).padStart(3, '0')}`;
  }

  function seed() {
    return {
      services: clone(Data.SERVICES),
      cases: clone(Data.CASES),
      team: clone(Data.TEAM),
      testimonials: clone(Data.TESTIMONIALS),
      leads: clone(Data.LEADS),
      proposals: clone(Data.PROPOSALS),
    };
  }

  let state = seed();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        state = {
          services: p.services || state.services,
          cases: p.cases || state.cases,
          team: p.team || state.team,
          testimonials: p.testimonials || state.testimonials,
          leads: p.leads || state.leads,
          proposals: p.proposals || state.proposals,
        };
      }
    } catch (_) {}
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function emit() {
    persist();
    listeners.forEach((cb) => cb(state));
  }

  function get() {
    return state;
  }

  function subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }

  // ---- Serviços ----
  function addService(data) {
    const service = { ...data, id: nextId(state.services) };
    state.services = [...state.services, service];
    emit();
    return service;
  }
  function updateService(id, patch) {
    state.services = state.services.map((s) => (s.id === id ? { ...s, ...patch } : s));
    emit();
  }
  function removeService(id) {
    state.services = state.services.filter((s) => s.id !== id);
    emit();
  }
  function toggleServiceActive(id) {
    state.services = state.services.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    emit();
  }

  // ---- Cases ----
  function addCase(data) {
    const study = { ...data, id: nextId(state.cases) };
    state.cases = [study, ...state.cases];
    emit();
    return study;
  }
  function updateCase(id, patch) {
    state.cases = state.cases.map((c) => (c.id === id ? { ...c, ...patch } : c));
    emit();
  }
  function removeCase(id) {
    state.cases = state.cases.filter((c) => c.id !== id);
    emit();
  }
  function togglePublished(id) {
    state.cases = state.cases.map((c) => (c.id === id ? { ...c, published: !c.published } : c));
    emit();
  }
  function toggleFeatured(id) {
    state.cases = state.cases.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c));
    emit();
  }

  // ---- Depoimentos ----
  function addTestimonial(data) {
    const row = { ...data, id: nextId(state.testimonials) };
    state.testimonials = [...state.testimonials, row];
    emit();
    return row;
  }
  function updateTestimonial(id, patch) {
    state.testimonials = state.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t));
    emit();
  }
  function removeTestimonial(id) {
    state.testimonials = state.testimonials.filter((t) => t.id !== id);
    emit();
  }
  function toggleApproved(id) {
    state.testimonials = state.testimonials.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t));
    emit();
  }

  // ---- Leads ----
  function addLead(data) {
    const lead = {
      ...data,
      stage: data.stage || 'novo',
      id: nextId(state.leads),
      createdAt: new Date().toISOString(),
    };
    state.leads = [lead, ...state.leads];
    emit();
    return lead;
  }
  function updateLead(id, patch) {
    state.leads = state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
    emit();
  }
  function moveLeadStage(id, stage) {
    state.leads = state.leads.map((l) => (l.id === id ? { ...l, stage } : l));
    emit();
  }
  function removeLead(id) {
    state.leads = state.leads.filter((l) => l.id !== id);
    emit();
  }

  // ---- Propostas ----
  function addProposal(data) {
    const proposal = {
      ...data,
      id: nextId(state.proposals),
      code: nextProposalCode(state.proposals),
      createdAt: new Date().toISOString(),
    };
    state.proposals = [proposal, ...state.proposals];
    emit();
    return proposal;
  }
  function updateProposal(id, patch) {
    state.proposals = state.proposals.map((p) => (p.id === id ? { ...p, ...patch } : p));
    emit();
  }
  function removeProposal(id) {
    state.proposals = state.proposals.filter((p) => p.id !== id);
    emit();
  }

  function reset() {
    state = seed();
    emit();
  }

  load();

  // ---- Briefing wizard (separate store, key "pf-brief") ----
  const STEPS = ['brief.steps.scope', 'brief.steps.budget', 'brief.steps.contact', 'brief.steps.review'];
  const EMPTY_DRAFT = {
    scope: [],
    budget: '',
    deadline: '',
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  };

  let brief = { step: 0, draft: { ...EMPTY_DRAFT }, submitted: false };
  const briefListeners = new Set();

  try {
    const raw = localStorage.getItem(BRIEF_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      brief = {
        step: p.step || 0,
        draft: { ...EMPTY_DRAFT, ...(p.draft || {}), scope: (p.draft && p.draft.scope) || [] },
        submitted: !!p.submitted,
      };
    }
  } catch (_) {}

  function briefPersist() {
    try {
      localStorage.setItem(BRIEF_KEY, JSON.stringify(brief));
    } catch (_) {}
  }
  function briefEmit() {
    briefPersist();
    briefListeners.forEach((cb) => cb(brief));
  }

  const Brief = {
    STEPS,
    get: () => brief,
    subscribe(cb) {
      briefListeners.add(cb);
      return () => briefListeners.delete(cb);
    },
    setStep(step) {
      brief = { ...brief, step: Math.max(0, Math.min(STEPS.length - 1, step)) };
      briefEmit();
    },
    next() {
      Brief.setStep(brief.step + 1);
    },
    back() {
      Brief.setStep(brief.step - 1);
    },
    patch(patch) {
      brief = { ...brief, draft: { ...brief.draft, ...patch } };
      briefEmit();
    },
    toggleScope(slug) {
      const scope = brief.draft.scope;
      brief = {
        ...brief,
        draft: {
          ...brief.draft,
          scope: scope.includes(slug) ? scope.filter((s) => s !== slug) : [...scope, slug],
        },
      };
      briefEmit();
    },
    markSubmitted() {
      brief = { ...brief, submitted: true };
      briefEmit();
    },
    reset() {
      brief = { step: 0, draft: { ...EMPTY_DRAFT }, submitted: false };
      briefEmit();
    },
    /** Etapa preenchida o bastante para avançar. */
    canAdvance(step) {
      const d = brief.draft;
      if (step === 0) return d.scope.length > 0;
      if (step === 1) return Boolean(d.budget && d.deadline);
      if (step === 2) return Boolean(d.name.trim() && /.+@.+\..+/.test(d.email));
      return true;
    },
  };

  global.PF = {
    slugify,
    get,
    subscribe,
    addService,
    updateService,
    removeService,
    toggleServiceActive,
    addCase,
    updateCase,
    removeCase,
    togglePublished,
    toggleFeatured,
    addTestimonial,
    updateTestimonial,
    removeTestimonial,
    toggleApproved,
    addLead,
    updateLead,
    moveLeadStage,
    removeLead,
    addProposal,
    updateProposal,
    removeProposal,
    reset,
    Brief,
  };
})(window);
