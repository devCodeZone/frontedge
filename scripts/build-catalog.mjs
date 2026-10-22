// build-catalog.mjs — reads every track in src/data/syllabus, validates it, and writes
// src/data/catalog.json (lightweight search/syllabus index loaded on app start).
// Runs automatically before `npm run dev` and `npm run build`.
import { readdirSync, writeFileSync } from 'node:fs';
import { normalizeTrack } from '../src/data/normalize.js';

const dir = new URL('../src/data/syllabus/', import.meta.url);
const out = { tracks: {}, terms: [] };
const seen = new Set();
const problems = [];

for (const file of readdirSync(dir).filter((f) => f.endsWith('.js')).sort()) {
  const cat = file.replace(/\.js$/, '');
  const mod = await import(new URL(file, dir).href);
  const track = normalizeTrack(cat, mod.default);
  out.tracks[cat] = track.modules.map((md) => ({ title: md.title, ids: md.terms.map((x) => x.id) }));
  for (const x of track.terms) {
    if (seen.has(x.id)) problems.push('Duplicate id: ' + x.id);
    seen.add(x.id);
    if (!x.oneLiner) problems.push(x.id + ': missing one-liner');
    if (!x.explanation) problems.push(x.id + ': missing explanation');
    if (!x.interview.length) problems.push(x.id + ': no interview questions');
    out.terms.push({ id: x.id, name: x.name, cat, mod: x.module, lvl: x.level[0], one: x.oneLiner, ...(x.version ? { ver: x.version } : {}) });
  }
}

if (problems.length) {
  console.error('Syllabus problems:\n' + problems.join('\n'));
  process.exit(1);
}
writeFileSync(new URL('../src/data/catalog.json', import.meta.url), JSON.stringify(out));
console.log(`catalog.json: ${out.terms.length} terms in ${Object.keys(out.tracks).length} tracks`);
