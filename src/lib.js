// lib.js — routing, persistent progress store and small helpers
import { useEffect, useState, useSyncExternalStore } from 'react';

/* ---------- hash router: #/term/js-closures → ['term', 'js-closures'] ---------- */
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

/* ---------- progress store (localStorage, guarded) ---------- */
const KEY = 'frontedge-progress-v1';
const empty = { saved: [], mastered: [], tests: [], recent: [] };
let state = load();
const subs = new Set();
function load() {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...empty }; }
}
function commit(next) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
  subs.forEach((f) => f());
}
export function useProgress() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => state);
}
const toggleIn = (list, id) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
export const toggleSaved = (id) => commit({ ...state, saved: toggleIn(state.saved, id) });
export const toggleMastered = (id) => commit({ ...state, mastered: toggleIn(state.mastered, id) });
export const markRecent = (id) => commit({ ...state, recent: [id, ...state.recent.filter((x) => x !== id)].slice(0, 8) });
export const recordTest = (t) => commit({ ...state, tests: [t, ...state.tests].slice(0, 30) });
export const resetProgress = () => commit({ ...empty });

/* ---------- helpers ---------- */
export const levelName = ['Fresher', 'Junior', 'Mid', 'Senior'];
export const safeLabel = (s) => String(s).replace(/["<>{}[\]|#;]/g, ' ').replace(/\s+/g, ' ').trim();
