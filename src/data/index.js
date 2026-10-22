// index.js — syllabus catalog (loaded at startup) + lazy full-track loading + search helpers
import { useEffect, useState } from 'react';
import catalog from './catalog.json';
import { normalizeTrack } from './normalize.js';
import { CATEGORIES, CATEGORY_MAP } from './categories.js';

// Lightweight index of every term: { id, name, cat, mod, lvl: 'B'|'I'|'A', one, ver? }
export const CATALOG = catalog.terms;
export const TRACKS = catalog.tracks;                      // cat → [{ title, ids }]
export const BY_ID = Object.fromEntries(CATALOG.map((t) => [t.id, t]));
export const LEVEL_NAME = { B: 'Beginner', I: 'Intermediate', A: 'Advanced' };
export const catTerms = (cat) => CATALOG.filter((t) => t.cat === cat);
export const orderedIds = (cat) => (TRACKS[cat] || []).flatMap((m) => m.ids);

// ---------- lazy full-content loading (one chunk per track) ----------
const loaders = import.meta.glob('./syllabus/*.js');
const cache = new Map();
const resolved = new Map();
export function loadTrack(cat) {
  if (!cache.has(cat)) {
    const loader = loaders['./syllabus/' + cat + '.js'];
    cache.set(cat, (loader ? loader() : Promise.reject(new Error('Unknown track ' + cat)))
      .then((m) => { const tr = normalizeTrack(cat, m.default); resolved.set(cat, tr); return tr; }));
  }
  return cache.get(cat);
}
export function useTrack(cat) {
  const [track, setTrack] = useState(() => resolved.get(cat) || null);
  const [error, setError] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!cat) return;
    if (resolved.has(cat)) { setTrack(resolved.get(cat)); return; }
    setTrack(null);
    loadTrack(cat).then((t) => alive && setTrack(t)).catch((e) => alive && setError(e));
    return () => { alive = false; };
  }, [cat]);
  return { track, error };
}
export const loadAllTracks = () => Promise.all(CATEGORIES.map((c) => loadTrack(c.id)));

// ---------- search over the catalog ----------
const STOP = new Set(['the','and','for','with','what','why','how','does','not','are','you','your','my','me','its','this','that','from','into','when','keeps','getting','error','issue','problem','explain','about','can','use','using','vs','is','in','on','of','to','a','an','it','do','i','am','was','get','got','why','which','between','difference','help','please','work','works','working']);
const ALIASES = { js: 'javascript', ts: 'typescript', ng: 'angular', rxjs: 'rxjs', a11y: 'accessibility', perf: 'performance', sso: 'oauth', jwt: 'jwt', llm: 'llm', ai: 'ai' };
const haystack = CATALOG.map((t) => ({
  t,
  name: t.name.toLowerCase(),
  meta: ((CATEGORY_MAP[t.cat]?.name || '') + ' ' + t.mod).toLowerCase(),
  body: t.one.toLowerCase()
}));
export function searchTerms(query, limit = 8, cat = null) {
  const words = query.toLowerCase().split(/[^a-z0-9#+.@]+/)
    .map((w) => ALIASES[w] || w)
    .filter((w) => w.length > 1 && !STOP.has(w));
  if (!words.length) return [];
  const scored = [];
  for (const h of haystack) {
    if (cat && h.t.cat !== cat) continue;
    let score = 0;
    for (const w of words) {
      if (h.name === w) score += 40;
      else if (h.name.startsWith(w)) score += 18;
      else if (new RegExp('\\b' + w.replace(/[.+#@]/g, '\\$&')).test(h.name)) score += 12;
      else if (h.name.includes(w)) score += 6;
      if (h.meta.includes(w)) score += 3;
      if (h.body.includes(w)) score += 2;
    }
    if (score > 2) scored.push({ t: h.t, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.t);
}

// ---------- term of the day (stable per calendar day) ----------
export function termOfTheDay() {
  const d = new Date();
  const seed = d.getFullYear() * 1000 + Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return CATALOG[(seed * 7919) % CATALOG.length];
}

// ---------- auto-generated "concept match" MCQs from the catalog ----------
const LVL_NUM = { B: 0, I: 1, A: 2 };
export function conceptQuestions(cats = [], level = null) {
  const pool = CATALOG.filter((t) => (!cats.length || cats.includes(t.cat)) &&
    (level === null || (LVL_NUM[t.lvl] <= level && LVL_NUM[t.lvl] >= level - 1)));
  return pool.map((t) => {
    const siblings = catTerms(t.cat).filter((x) => x.id !== t.id);
    const distractors = [...siblings].sort(() => Math.random() - 0.5).slice(0, 3).map((x) => x.name);
    return {
      id: 'c-' + t.id, cat: t.cat, level: LVL_NUM[t.lvl], generated: true, termId: t.id,
      q: 'Which term matches this definition? “' + t.one + '”',
      options: [t.name, ...distractors], answer: 0,
      why: t.name + ': ' + t.one
    };
  }).filter((q) => q.options.length === 4);
}

// Curated "release watch" — edit as new versions ship. Live articles come from /api/news.
export const RELEASE_WATCH = [
  { tag: 'React', title: 'React 19.x + React Compiler', note: 'Actions, use(), Server Components and automatic memoisation are now mainstream interview topics.', term: 'react-compiler' },
  { tag: 'Angular', title: 'Angular 20+: zoneless & signals-first', note: 'Signals, resource()/httpResource, @defer and zoneless change detection replace Zone.js patterns.', term: 'ng-change-detection' },
  { tag: 'Next.js', title: 'Next.js caching, PPR & Turbopack', note: 'New caching defaults, "use cache", Partial Prerendering and Turbopack builds.', term: 'next-caching' },
  { tag: 'JavaScript', title: 'ES2025 shipped; Temporal arriving', note: 'Set methods, Iterator helpers, Promise.try, RegExp.escape — and the Temporal date API rolling out.', term: 'js-es-new' },
  { tag: 'CSS', title: 'Anchor positioning, view transitions, scroll-driven animations', note: 'More "JS-only" UI patterns are becoming pure CSS.', term: 'css-anchor-positioning' },
  { tag: 'AI', title: 'Agents, MCP & generative UI', note: 'Tool calling, MCP-connected agents and streaming generative UI are new frontend skills.', term: 'ai-agents-mcp' },
  { tag: 'Performance', title: 'INP is the responsiveness metric', note: 'Optimise long tasks and interaction latency, not just load time.', term: 'perf-long-tasks-inp' }
];
