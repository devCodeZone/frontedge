// lib.js — routing, persistent progress store, theme and small helpers
import { useEffect, useState, useSyncExternalStore } from 'react';

/* ---------- hash router: #/term/js-closures?tab=code → parts + params ---------- */
export function useRoute() {
  const [hash, setHash] = useState(() => location.hash || '#/');
  useEffect(() => {
    const on = () => { setHash(location.hash || '#/'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const [path, query = ''] = hash.slice(2).split('?');
  return { parts: path.split('/').filter(Boolean), params: new URLSearchParams(query) };
}
export const go = (path) => { location.hash = '#/' + path; };

/* ---------- tiny external store helper ---------- */
function createStore(key, initial) {
  let state = initial;
  try { state = { ...initial, ...JSON.parse(localStorage.getItem(key) || '{}') }; } catch {}
  const subs = new Set();
  return {
    get: () => state,
    set(next) {
      state = next;
      try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
      subs.forEach((f) => f());
    },
    subscribe(f) { subs.add(f); return () => subs.delete(f); }
  };
}

/* ---------- progress (saved, mastered, tests, recent, streak) ---------- */
const progress = createStore('frontedge-progress-v1', { saved: [], mastered: [], tests: [], recent: [], days: [] });
export const useProgress = () => useSyncExternalStore(progress.subscribe, progress.get);
const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
const today = () => new Date().toISOString().slice(0, 10);
const touchDay = (s) => (s.days?.includes(today()) ? s.days : [...(s.days || []), today()].slice(-60));
export const toggleSaved = (id) => { const s = progress.get(); progress.set({ ...s, saved: toggleIn(s.saved, id) }); };
export const toggleMastered = (id) => { const s = progress.get(); progress.set({ ...s, mastered: toggleIn(s.mastered, id), days: touchDay(s) }); };
export const setMastered = (id, on) => {
  const s = progress.get();
  const has = s.mastered.includes(id);
  if (on === has) return;
  progress.set({ ...s, mastered: on ? [...s.mastered, id] : s.mastered.filter((x) => x !== id), days: touchDay(s) });
};
export const markRecent = (id) => { const s = progress.get(); progress.set({ ...s, recent: [id, ...s.recent.filter((x) => x !== id)].slice(0, 10), days: touchDay(s) }); };
export const recordTest = (t) => { const s = progress.get(); progress.set({ ...s, tests: [t, ...s.tests].slice(0, 30), days: touchDay(s) }); };
export function streak(days = []) {
  const set = new Set(days);
  let n = 0;
  const d = new Date();
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1); // today not studied yet: count from yesterday
  while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

/* ---------- settings (theme, font size) ---------- */
const settings = createStore('frontedge-settings-v1', { theme: 'system', fontScale: 1 });
export const useSettings = () => useSyncExternalStore(settings.subscribe, settings.get);
export const setSetting = (k, v) => settings.set({ ...settings.get(), [k]: v });
export function resolvedTheme(theme) {
  if (theme === 'light' || theme === 'dark') return theme;
  return matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
export function applySettings(s) {
  const root = document.documentElement;
  root.dataset.theme = resolvedTheme(s.theme);
  root.style.setProperty('--font-scale', String(s.fontScale));
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', root.dataset.theme === 'light' ? '#f6f7fb' : '#0f1115');
}

/* ---------- helpers ---------- */
export const levelName = ['Fresher', 'Junior', 'Mid', 'Senior'];
export const safeLabel = (s) => String(s).replace(/["<>{}[\]|#;`]/g, ' ').replace(/\s+/g, ' ').trim();
