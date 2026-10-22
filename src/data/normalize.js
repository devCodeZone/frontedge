// normalize.js — authoring helpers + converts compact syllabus entries into full term objects.
// Used by the app (lazy track loading) AND by scripts/build-catalog.mjs (search index).
//
// Authoring format (see src/data/syllabus/*.js):
//   m('Module title', t('id', 'Name', 'B'|'I'|'A', {
//     one:  'one-line definition',
//     ex:   `explanation (paragraphs separated by a blank line, `code` in backticks)`,
//     pts:  ['key point', ...],              // quick-revision bullets
//     flow: ['step 1', 'step 2', ...],       // auto-drawn flow diagram  (or dia: `mermaid code`)
//     code: ['javascript', `code with a comment on every line`],
//     iq:   [['interview question', 'answer'], ...],
//     cq:   [['coding question', `commented solution`], ...],
//     err:  ['common mistake', ...],
//     ver:  'React 19',                      // optional version badge
//     rel:  ['other-term-id', ...]           // optional "study next"
//   }))

export const t = (id, name, lvl, o = {}) => ({ id, name, lvl, ...o });
export const m = (title, ...terms) => ({ title, terms });

// Reuse the original deep-dive terms (src/data/terms/*.js) inside a syllabus module
export function legacyPicker(...arrays) {
  const map = Object.fromEntries(arrays.flat().map((x) => [x.id, x]));
  return (id) => {
    if (!map[id]) throw new Error('Unknown legacy term: ' + id);
    return { ...map[id], legacy: true };
  };
}

const LEVELS = { B: 'Beginner', I: 'Intermediate', A: 'Advanced' };

// Mermaid-safe label text
export const safeLabel = (s) =>
  String(s).replace(/["<>{}[\]|#;`]/g, ' ').replace(/\s+/g, ' ').trim();

// Linear flow diagram from an array of steps
export function flowDiagram(steps) {
  const short = steps.length <= 4 && steps.every((s) => s.length < 26);
  let out = 'flowchart ' + (short ? 'LR' : 'TD') + '\n';
  steps.forEach((s, i) => { out += `  F${i}["${safeLabel(s)}"]\n`; });
  steps.slice(1).forEach((_, i) => { out += `  F${i} --> F${i + 1}\n`; });
  return out;
}

// Concept map: term in the middle, key points around it
export function conceptDiagram(name, points) {
  let out = 'flowchart TD\n  C(("' + safeLabel(name) + '"))\n';
  points.slice(0, 6).forEach((p, i) => { out += `  C --> P${i}["${safeLabel(p).slice(0, 70)}"]\n`; });
  return out;
}

export function normalizeTerm(raw, cat, module) {
  if (raw.legacy) {
    return {
      id: raw.id, cat, module, name: raw.name, level: raw.level, version: raw.version,
      oneLiner: raw.oneLiner, explanation: raw.explanation, points: raw.points || [],
      mistakes: raw.mistakes || [], diagram: raw.diagram, code: raw.code,
      interview: raw.interview || [], coding: raw.coding || [], related: raw.related || []
    };
  }
  const points = raw.pts || [];
  return {
    id: raw.id, cat, module, name: raw.name,
    level: LEVELS[raw.lvl] || raw.lvl || 'Beginner',
    version: raw.ver,
    oneLiner: raw.one,
    explanation: (raw.ex || '').trim(),
    points,
    mistakes: raw.err || [],
    diagram: raw.dia ? raw.dia.trim() : raw.flow ? flowDiagram(raw.flow) : conceptDiagram(raw.name, points),
    code: raw.code ? { lang: raw.code[0], src: raw.code[1].replace(/^\n+|\s+$/g, '') } : null,
    interview: (raw.iq || []).map(([q, a]) => ({ q, a })),
    coding: (raw.cq || []).map(([q, a]) => ({ q, a: a.replace(/^\n+|\s+$/g, '') })),
    related: raw.rel || []
  };
}

export function normalizeTrack(cat, modules) {
  const mods = modules.map((md) => ({
    title: md.title,
    terms: md.terms.map((r) => normalizeTerm(r, cat, md.title))
  }));
  return { cat, modules: mods, terms: mods.flatMap((x) => x.terms) };
}
