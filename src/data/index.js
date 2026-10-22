// index.js — combines every term file and exposes lookup + search helpers
import javascript from './terms/javascript.js';
import react from './terms/react.js';
import frameworks from './terms/frameworks.js';
import web from './terms/web.js';
import engineering from './terms/engineering.js';
import ai from './terms/ai.js';
import { CATEGORIES } from './categories.js';

export const TERMS = [...javascript, ...react, ...frameworks, ...web, ...engineering, ...ai];
export const TERM_MAP = Object.fromEntries(TERMS.map((t) => [t.id, t]));
export const termsByCat = (cat) => TERMS.filter((t) => t.cat === cat);

// Curated "release watch" — edit as new versions ship. Live articles come from /api/news.
export const RELEASE_WATCH = [
  { tag: 'React', title: 'React 19.x + React Compiler', note: 'Actions, use(), Server Components and automatic memoisation are now mainstream expectations in interviews.', term: 'react-memo' },
  { tag: 'Angular', title: 'Angular 20+: zoneless & signals-first', note: 'Signals, resource()/httpResource, @defer and zoneless change detection replace older Zone.js patterns.', term: 'angular-signals' },
  { tag: 'Next.js', title: 'Next.js App Router, PPR & Turbopack', note: 'Partial Prerendering, async params, caching changes and Turbopack builds.', term: 'next-rendering' },
  { tag: 'JavaScript', title: 'ES2025 shipped; Temporal arriving', note: 'Set methods, Iterator helpers, Promise.try, RegExp.escape — and the Temporal date API rolling out.', term: 'js-es-new' },
  { tag: 'CSS', title: 'Interop: anchor positioning, view transitions, scroll-driven animations', note: 'More "JS-only" UI patterns are becoming pure CSS.', term: 'css-modern' },
  { tag: 'AI', title: 'Built-in browser AI & agentic UIs', note: 'On-device models, MCP-connected agents and streaming generative UI are new frontend skills.', term: 'ai-agents-mcp' },
  { tag: 'Performance', title: 'INP is the responsiveness metric', note: 'Optimise long tasks and interaction latency, not just load time.', term: 'perf-core-web-vitals' }
];

// Lightweight relevance search used by the search bar and the offline AI fallback
const STOP = new Set(['the','and','for','with','what','why','how','does','not','are','you','your','my','me','its','this','that','from','into','when','keeps','getting','error','issue','problem','explain','about','can','use','using','vs','is','in','on','of','to','a','an','it','do','i']);

export function searchTerms(query, limit = 8) {
  const words = query.toLowerCase().split(/[^a-z0-9#+.]+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return [];
  const scored = TERMS.map((t) => {
    const name = t.name.toLowerCase();
    const cat = (CATEGORIES.find((c) => c.id === t.cat)?.name || '').toLowerCase();
    const body = (t.oneLiner + ' ' + t.explanation + ' ' + t.interview.map((i) => i.q + ' ' + i.a).join(' ') + ' ' + t.code.src).toLowerCase();
    let score = 0;
    for (const w of words) {
      const re = new RegExp('\\b' + w.replace(/[.+#]/g, '\\$&'));
      if (re.test(name)) score += 10 + w.length;
      if (re.test(cat)) score += 4;
      const hits = body.split(w).length - 1;
      score += Math.min(hits, 6);
    }
    return { t, score };
  });
  return scored.filter((s) => s.score > 2).sort((a, b) => b.score - a.score).slice(0, limit).map((s) => s.t);
}
