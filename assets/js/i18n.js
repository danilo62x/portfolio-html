/* ===== Lightweight i18n — loads JSON locale, t() with interpolation + plurals ===== */
(function (global) {
  const LANGUAGES = [
    { code: 'pt-BR', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  let dict = {};
  let current = (() => {
    try {
      return localStorage.getItem('pf-lang') || 'pt-BR';
    } catch (_) {
      return 'pt-BR';
    }
  })();

  const readyCallbacks = [];
  let isReady = false;

  function lookup(key) {
    return key.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), dict);
  }

  // t(key, opts?) — opts may carry { count, ... } for {{var}} interpolation.
  // i18next-style plural: when `count` is present and != 1, prefer `<key>_plural`.
  function t(key, opts) {
    opts = opts || {};
    let v;
    if (opts.count != null && opts.count !== 1) {
      v = lookup(key + '_plural');
    }
    if (typeof v !== 'string') v = lookup(key);
    if (typeof v !== 'string') {
      return typeof opts === 'string' ? opts : (opts.defaultValue != null ? opts.defaultValue : key);
    }
    return v.replace(/\{\{(\w+)\}\}/g, (m, name) => (opts[name] != null ? String(opts[name]) : m));
  }

  // tArr(key) — returns an array value, or [] if missing.
  function tArr(key) {
    const v = lookup(key);
    return Array.isArray(v) ? v : [];
  }

  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach((el) => {
      const v = lookup(el.getAttribute('data-i18n'));
      if (typeof v === 'string') el.textContent = v;
    });
    (root || document).querySelectorAll('[data-i18n-ph]').forEach((el) => {
      const v = lookup(el.getAttribute('data-i18n-ph'));
      if (typeof v === 'string') el.setAttribute('placeholder', v);
    });
  }

  async function load(lang) {
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      dict = await res.json();
    } catch (_) {
      dict = {};
    }
    document.documentElement.lang = lang;
    apply(document);
    isReady = true;
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
    while (readyCallbacks.length) readyCallbacks.shift()();
  }

  async function setLang(lang) {
    current = lang;
    try {
      localStorage.setItem('pf-lang', lang);
    } catch (_) {}
    await load(lang);
  }

  function whenReady(cb) {
    if (isReady) cb();
    else readyCallbacks.push(cb);
  }

  global.I18n = {
    LANGUAGES,
    t,
    tArr,
    apply,
    setLang,
    whenReady,
    getLang: () => current,
    isReady: () => isReady,
    init: () => load(current),
  };

  global.I18n.init();
})(window);
