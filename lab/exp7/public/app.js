// app.js - client state management demo
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const modeEls = document.querySelectorAll('input[name="mode"]');
  const themeEls = document.querySelectorAll('input[name="theme"]');
  const incBtn = document.getElementById('inc');
  const decBtn = document.getElementById('dec');
  const resetBtn = document.getElementById('reset');
  const countEl = document.getElementById('count');
  const statusMode = document.getElementById('status-mode');
  const statusTs = document.getElementById('status-ts');
  const statusNotes = document.getElementById('status-notes');

  // default state
  let state = { counter: 0, theme: 'dark', lastUpdated: null };
  const STORAGE_KEY = 'stateLab.storageMode'; // chosen mode saved in localStorage

  // init UI by reading saved mode (defaults to 'local')
  const savedMode = localStorage.getItem(STORAGE_KEY) || 'local';
  setModeRadio(savedMode);

  // helper: get selected mode
  function getMode() {
    return Array.from(modeEls).find(r => r.checked)?.value || 'local';
  }
  function setModeRadio(mode) {
    modeEls.forEach(r => r.checked = (r.value === mode));
  }

  // load state based on chosen mode
  async function loadState() {
    const mode = getMode();
    statusMode.textContent = mode;
    statusNotes.textContent = (mode === 'server') ? 'Server mode uses browser cookies; open via http://localhost:3000' : 'Local/session storage in browser';
    if (mode === 'local') {
      const raw = localStorage.getItem('stateLab.state');
      if (raw) state = JSON.parse(raw);
      updateUI();
    } else if (mode === 'session') {
      const raw = sessionStorage.getItem('stateLab.state');
      if (raw) state = JSON.parse(raw);
      updateUI();
    } else if (mode === 'server') {
      // fetch from server session
      try {
        const res = await fetch('/api/state', { credentials: 'include' });
        if (res.ok) {
          state = await res.json();
        } else {
          console.error('Failed to fetch server state', res.status);
        }
      } catch (err) {
        console.error('Server fetch error', err);
      }
      updateUI();
    }
  }

  // save state based on mode
  async function saveState() {
    const mode = getMode();
    state.lastUpdated = new Date().toISOString();
    if (mode === 'local') {
      localStorage.setItem('stateLab.state', JSON.stringify(state));
    } else if (mode === 'session') {
      sessionStorage.setItem('stateLab.state', JSON.stringify(state));
    } else if (mode === 'server') {
      try {
        await fetch('/api/state', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ counter: state.counter, theme: state.theme })
        });
      } catch (err) {
        console.error('Failed to post server state', err);
      }
    }
    updateUI();
  }

  function updateUI() {
    countEl.textContent = String(state.counter);
    statusTs.textContent = state.lastUpdated ? new Date(state.lastUpdated).toLocaleString() : '-';
    // apply theme
    if (state.theme === 'light') document.documentElement.style.setProperty('--bg', '#ffffff'), document.documentElement.style.setProperty('--text', '#0b1220');
    else document.documentElement.style.setProperty('--bg', '#0d1117'), document.documentElement.style.setProperty('--text', '#e6edf3');

    // set theme radio
    themeEls.forEach(r => r.checked = (r.value === state.theme));
  }

  // event listeners
  incBtn.addEventListener('click', () => { state.counter = Number(state.counter) + 1; saveState(); });
  decBtn.addEventListener('click', () => { state.counter = Number(state.counter) - 1; saveState(); });
  resetBtn.addEventListener('click', async () => {
    state.counter = 0;
    state.theme = 'dark';
    if (getMode() === 'server') {
      try {
        await fetch('/api/reset', { method: 'POST', credentials: 'include' });
      } catch (err) { console.error('Reset failed', err); }
    } else {
      localStorage.removeItem('stateLab.state');
      sessionStorage.removeItem('stateLab.state');
    }
    saveState();
  });

  // change storage mode
  modeEls.forEach(r => r.addEventListener('change', (e) => {
    localStorage.setItem(STORAGE_KEY, e.target.value);
    // when switching mode, try to load that mode's state
    loadState();
  }));

  // change theme
  themeEls.forEach(r => r.addEventListener('change', (e) => {
    state.theme = e.target.value;
    saveState();
  }));

  // initial load
  loadState();
});
