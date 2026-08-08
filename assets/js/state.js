/* ===== Global UI state (theme + sidebar + cookies) — backed by localStorage =====
   Mirrors the React useUiStore. Persist key: "pf-ui". */
(function (global) {
  const STORAGE_KEY = 'pf-ui';

  const DEFAULTS = {
    darkMode: false,
    sidebarCollapsed: false,
    sidebarMobileOpen: false,
    cookiesAccepted: false,
    showCookieBanner: false,
  };

  let state = { ...DEFAULTS };
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        state = {
          ...DEFAULTS,
          darkMode: !!p.darkMode,
          sidebarCollapsed: !!p.sidebarCollapsed,
          cookiesAccepted: !!p.cookiesAccepted,
        };
      }
    } catch (_) {}
  }

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          darkMode: state.darkMode,
          sidebarCollapsed: state.sidebarCollapsed,
          cookiesAccepted: state.cookiesAccepted,
        })
      );
    } catch (_) {}
  }

  function set(patch) {
    state = { ...state, ...patch };
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

  function applyTheme() {
    const root = document.documentElement;
    if (state.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }

  function toggleDarkMode() {
    set({ darkMode: !state.darkMode });
    applyTheme();
  }
  function setDarkMode(val) {
    set({ darkMode: val });
    applyTheme();
  }
  function toggleSidebar() {
    set({ sidebarCollapsed: !state.sidebarCollapsed });
  }
  function toggleSidebarMobile(val) {
    set({ sidebarMobileOpen: val !== undefined ? val : !state.sidebarMobileOpen });
  }
  function acceptCookies() {
    set({ cookiesAccepted: true, showCookieBanner: false });
  }
  function declineCookies() {
    set({ cookiesAccepted: false, showCookieBanner: false });
  }
  function openCookieBanner() {
    set({ showCookieBanner: true });
  }
  function closeCookieBanner() {
    set({ showCookieBanner: false });
  }

  function notify(message, type, duration) {
    if (global.UIToast) global.UIToast(message, type, duration);
    else console.log('[notify]', message);
  }

  load();
  applyTheme();

  global.UIState = {
    get,
    set,
    subscribe,
    applyTheme,
    toggleDarkMode,
    setDarkMode,
    toggleSidebar,
    toggleSidebarMobile,
    acceptCookies,
    declineCookies,
    openCookieBanner,
    closeCookieBanner,
    notify,
    notifySuccess: (m) => notify(m, 'success'),
    notifyError: (m) => notify(m, 'error'),
    notifyWarning: (m) => notify(m, 'warning'),
  };
})(window);
