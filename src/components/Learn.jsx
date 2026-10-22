// Learn.jsx — Home, Syllabus (track), Roadmap, Term, Revise and Progress pages
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories.js';
import {
  CATALOG, BY_ID, TRACKS, LEVEL_NAME, catTerms, orderedIds, useTrack, searchTerms,
  termOfTheDay, RELEASE_WATCH, loadAllTracks
} from '../data/index.js';
import {
  go, useProgress, toggleSaved, toggleMastered, setMastered, markRecent, safeLabel,
  streak, useSettings, setSetting
} from '../lib.js';
import Diagram from './Diagram.jsx';
import CodeBlock from './CodeBlock.jsx';

/* ---------------- small shared pieces ---------------- */
const Level = ({ l }) => { const name = LEVEL_NAME[l] || l; return <span className={'lvl lvl-' + name.toLowerCase()}>{name}</span>; };

// Renders `inline code` inside plain text safely
function Rich({ text }) {
  return String(text).split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part);
}

export function TermCard({ c, compact = false }) {
  const p = useProgress();
  const cat = CATEGORY_MAP[c.cat];
  return (
    <a className={'term-card' + (compact ? ' compact' : '')} href={'#/term/' + c.id} style={{ '--accent': cat.color }}>
      <div className="term-card-top">
        <span className="term-cat">{cat.icon} {cat.name}</span>
        {p.mastered.includes(c.id) && <span className="done-dot" title="Mastered" aria-label="Mastered">✓</span>}
      </div>
      <h3>{c.name}</h3>
      {!compact && <p>{c.one}</p>}
      <div className="term-meta"><Level l={c.lvl} />{c.ver && <span className="ver">{c.ver}</span>}</div>
    </a>
  );
}

function ProgressBar({ value, label }) {
  return <span className="bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)} aria-label={label}><i style={{ width: value + '%' }} /></span>;
}

function ThemeToggle() {
  const s = useSettings();
  const next = { system: 'dark', dark: 'light', light: 'system' }[s.theme];
  const icon = { system: '◐', dark: '☾', light: '☀' }[s.theme];
  return <button className="icon-btn" onClick={() => setSetting('theme', next)} aria-label={'Theme: ' + s.theme + '. Switch to ' + next}>{icon}</button>;
}

/* ---------------- HOME ---------------- */
export function Home({ installPrompt }) {
  const [q, setQ] = useState('');
  const p = useProgress();
  const results = useMemo(() => (q.trim() ? searchTerms(q, 20) : []), [q]);
  const pct = Math.round((p.mastered.length / CATALOG.length) * 100);
  const recent = p.recent.map((id) => BY_ID[id]).filter(Boolean);
  const tod = termOfTheDay();
  const days = streak(p.days);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-row">
          <p className="eyebrow">FrontEdge</p>
          <div className="hero-actions">{installPrompt}<ThemeToggle /></div>
        </div>
        <h1>Your complete frontend syllabus.</h1>
        <p className="muted">Every term with diagrams, commented code, interview Q&A and mock tests.</p>
        <label className="search">
          <span aria-hidden>⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={'Search ' + CATALOG.length + ' terms — closures, CORS, signals, RAG…'} aria-label="Search all terms" />
          {q && <button className="clear" onClick={() => setQ('')} aria-label="Clear search">×</button>}
        </label>
        <div className="stats">
          <div><b>{CATALOG.length}</b><span>terms</span></div>
          <div><b>{CATEGORIES.length}</b><span>tracks</span></div>
          <div><b>{pct}%</b><span>mastered</span></div>
          <div><b>{days}🔥</b><span>day streak</span></div>
        </div>
      </header>

      {q.trim() ? (
        <section aria-live="polite">
          <h2 className="sec-title">{results.length} results</h2>
          {results.length ? <div className="grid">{results.map((c) => <TermCard key={c.id} c={c} />)}</div>
            : <p className="muted">No match. Try the <a href={'#/chat?q=' + encodeURIComponent(q)}>AI Mentor</a> — describe what you're stuck on.</p>}
        </section>
      ) : (
        <>
          <section>
            <h2 className="sec-title">Term of the day</h2>
            <a className="tod" href={'#/term/' + tod.id} style={{ '--accent': CATEGORY_MAP[tod.cat].color }}>
              <span className="term-cat">{CATEGORY_MAP[tod.cat].icon} {CATEGORY_MAP[tod.cat].name} · {tod.mod.replace(/^\d+\.\s*/, '')}</span>
              <b>{tod.name}</b>
              <span>{tod.one}</span>
              <span className="tod-cta">Learn it in 3 minutes →</span>
            </a>
          </section>
          {recent.length > 0 && (
            <section>
              <h2 className="sec-title">Continue learning</h2>
              <div className="hscroll">{recent.map((c) => <TermCard key={c.id} c={c} />)}</div>
            </section>
          )}
          <section>
            <h2 className="sec-title">Tracks</h2>
            <div className="cat-grid">
              {CATEGORIES.map((c) => {
                const list = catTerms(c.id);
                const done = list.filter((t) => p.mastered.includes(t.id)).length;
                return (
                  <a key={c.id} className="cat" href={'#/cat/' + c.id} style={{ '--accent': c.color }}>
                    <span className="cat-icon" aria-hidden>{c.icon}</span>
                    <span className="cat-name">{c.name}</span>
                    <span className="cat-count">{list.length} terms · {(TRACKS[c.id] || []).length} modules</span>
                    <ProgressBar value={list.length ? (done / list.length) * 100 : 0} label={c.name + ' progress'} />
                  </a>
                );
              })}
            </div>
          </section>
          <section>
            <h2 className="sec-title">Release watch</h2>
            <div className="watch">
              {RELEASE_WATCH.map((w) => (
                <a key={w.title} href={'#/term/' + w.term} className="watch-item">
                  <span className="tag">{w.tag}</span><b>{w.title}</b><span className="muted">{w.note}</span>
                </a>
              ))}
              <a href="#/news" className="watch-more">Live frontend news →</a>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

/* ---------------- SYLLABUS (track page) ---------------- */
const FILTERS = [['all', 'All'], ['B', 'Beginner'], ['I', 'Intermediate'], ['A', 'Advanced'], ['todo', 'Not mastered']];

export function Category({ id }) {
  const c = CATEGORY_MAP[id];
  const p = useProgress();
  const [filter, setFilter] = useState('all');
  const [q, setQ] = useState('');
  const modules = TRACKS[id] || [];
  const firstOpen = useMemo(() => Math.max(0, modules.findIndex((m) => m.ids.some((x) => !p.mastered.includes(x)))), [id]);
  const [open, setOpen] = useState(() => ({ [firstOpen]: true }));
  useEffect(() => setOpen({ [firstOpen]: true }), [id]);
  if (!c) return <NotFound />;

  const all = orderedIds(id);
  const done = all.filter((x) => p.mastered.includes(x)).length;
  const nextId = all.find((x) => !p.mastered.includes(x)) || all[0];
  const matchIds = q.trim() ? new Set(searchTerms(q, 200, id).map((t) => t.id)) : null;
  const visible = (tid) => {
    const t = BY_ID[tid];
    if (matchIds && !matchIds.has(tid)) return false;
    if (filter === 'todo') return !p.mastered.includes(tid);
    return filter === 'all' || t.lvl === filter;
  };
  const filtering = filter !== 'all' || !!matchIds;

  return (
    <div className="page">
      <a className="back" href="#/">← All tracks</a>
      <header className="cat-head" style={{ '--accent': c.color }}>
        <span className="cat-icon big" aria-hidden>{c.icon}</span>
        <div>
          <h1>{c.name}</h1>
          <p className="muted">{c.desc}</p>
        </div>
      </header>
      <div className="track-progress">
        <span>{done}/{all.length} mastered · {modules.length} modules</span>
        <ProgressBar value={all.length ? (done / all.length) * 100 : 0} label="Track progress" />
      </div>
      <div className="row-actions">
        <a className="btn primary" href={'#/term/' + nextId}>{done ? 'Continue' : 'Start learning'} →</a>
        <a className="btn" href={'#/roadmap/' + id}>Roadmap</a>
        <a className="btn" href={'#/revise/' + id}>Quick revise</a>
        <a className="btn" href={'#/mock?cat=' + id}>Mock test</a>
      </div>

      <div className="filter-bar">
        <label className="search small-search">
          <span aria-hidden>⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={'Search in ' + c.name} aria-label={'Search in ' + c.name} />
        </label>
        <div className="pill-wrap selectable" role="group" aria-label="Filter terms">
          {FILTERS.map(([k, label]) => <button key={k} className={'pill' + (filter === k ? ' on' : '')} aria-pressed={filter === k} onClick={() => setFilter(k)}>{label}</button>)}
        </div>
      </div>

      <div className="modules">
        {modules.map((m, mi) => {
          const ids = m.ids.filter(visible);
          if (!ids.length) return null;
          const mDone = m.ids.filter((x) => p.mastered.includes(x)).length;
          const isOpen = filtering || !!open[mi];
          return (
            <section key={m.title} className={'module' + (isOpen ? ' open' : '')}>
              <button className="module-head" aria-expanded={isOpen} onClick={() => setOpen((o) => ({ ...o, [mi]: !o[mi] }))}>
                <span className="module-title">{m.title}</span>
                <span className="module-count">{mDone}/{m.ids.length}</span>
                <span className="chev" aria-hidden>›</span>
              </button>
              <ProgressBar value={(mDone / m.ids.length) * 100} label={m.title + ' progress'} />
              {isOpen && (
                <ol className="term-rows">
                  {ids.map((tid) => {
                    const t = BY_ID[tid];
                    const mastered = p.mastered.includes(tid);
                    return (
                      <li key={tid}>
                        <a href={'#/term/' + tid} className={'term-row' + (mastered ? ' done' : '')}>
                          <span className={'status ' + (mastered ? 'ok' : '')} aria-label={mastered ? 'Mastered' : 'Not mastered'}>{mastered ? '✓' : ''}</span>
                          <span className="row-body">
                            <span className="row-name">{t.name}{p.saved.includes(tid) && <span className="saved-star" aria-label="Saved"> ★</span>}</span>
                            <span className="row-one">{t.one}</span>
                          </span>
                          <span className={'dot dot-' + t.lvl} title={LEVEL_NAME[t.lvl]} aria-label={LEVEL_NAME[t.lvl]} />
                        </a>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          );
        })}
        {modules.every((m) => !m.ids.some(visible)) && <p className="muted">No terms match this filter.</p>}
      </div>
    </div>
  );
}

/* ---------------- ROADMAP ---------------- */
export function Roadmap({ id }) {
  const c = CATEGORY_MAP[id];
  const p = useProgress();
  const modules = TRACKS[id] || [];
  const code = useMemo(() => {
    let s = 'flowchart TD\n';
    modules.forEach((m, i) => {
      const done = m.ids.filter((x) => p.mastered.includes(x)).length;
      s += `  M${i}["${safeLabel(m.title)}<br/>${m.ids.length} terms · ${done} done"]\n`;
      if (i > 0) s += `  M${i - 1} --> M${i}\n`;
      if (done === m.ids.length) s += `  style M${i} stroke:#5fe39a,stroke-width:3px\n`;
    });
    return s;
  }, [id, p.mastered]);
  if (!c) return <NotFound />;
  return (
    <div className="page">
      <a className="back" href={'#/cat/' + c.id}>← {c.name} syllabus</a>
      <h1>{c.icon} {c.name} roadmap</h1>
      <p className="muted">Follow the modules in order. Green modules are fully mastered.</p>
      <Diagram code={code} caption={c.name + ' learning path'} />
      <ol className="timeline">
        {modules.map((m) => (
          <li key={m.title}>
            <h2>{m.title}</h2>
            <div className="pill-wrap">
              {m.ids.map((tid) => (
                <a key={tid} className={'pill linked' + (p.mastered.includes(tid) ? ' mastered' : '')} href={'#/term/' + tid}>
                  {p.mastered.includes(tid) ? '✓ ' : ''}{BY_ID[tid].name}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------------- TERM ---------------- */
const TABS = ['Learn', 'Code', 'Interview', 'Coding Q&A', 'Roadmap'];

export function Term({ id, params }) {
  const c = BY_ID[id];
  const p = useProgress();
  const { track, error } = useTrack(c?.cat);
  const [tab, setTab] = useState(params?.get('tab') || 'Learn');
  const [open, setOpen] = useState({});
  useEffect(() => { if (c) markRecent(c.id); setTab(params?.get('tab') || 'Learn'); setOpen({}); }, [id]);
  if (!c) return <NotFound />;
  const cat = CATEGORY_MAP[c.cat];
  const t = track?.terms.find((x) => x.id === id);
  const order = orderedIds(c.cat);
  const idx = order.indexOf(id);
  const prev = BY_ID[order[idx - 1]];
  const next = BY_ID[order[idx + 1]];
  const mastered = p.mastered.includes(id);
  const askAi = (q) => '#/chat?q=' + encodeURIComponent(q);

  return (
    <div className="page term" style={{ '--accent': cat.color }}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href={'#/cat/' + cat.id}>{cat.icon} {cat.name}</a><span aria-hidden>›</span><span>{c.mod}</span>
      </nav>
      <header className="term-head">
        <h1>{c.name}</h1>
        <div className="term-meta"><Level l={c.lvl} />{c.ver && <span className="ver">{c.ver}</span>}<span className="muted small">Term {idx + 1} of {order.length}</span></div>
        <p className="one-liner"><span className="tag-inline">In one line</span> <Rich text={c.one} /></p>
        <div className="row-actions">
          <button className={'btn' + (p.saved.includes(id) ? ' on' : '')} aria-pressed={p.saved.includes(id)} onClick={() => toggleSaved(id)}>{p.saved.includes(id) ? '★ Saved' : '☆ Save'}</button>
          <button className={'btn' + (mastered ? ' on' : '')} aria-pressed={mastered} onClick={() => toggleMastered(id)}>{mastered ? '✓ Mastered' : 'Mark mastered'}</button>
          <a className="btn" href={askAi('Explain ' + c.name + ' (' + cat.name + ') in more depth with a real-project scenario and a fully commented example.')}>✦ Ask AI</a>
        </div>
      </header>

      <nav className="tabs" role="tablist" aria-label="Term sections">
        {TABS.map((x) => <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)}>{x}</button>)}
      </nav>

      {error && <p role="alert">Couldn't load this track. Check your connection and retry.</p>}
      {!t && !error && <div className="loading-block"><div className="skeleton" /><div className="skeleton short" /></div>}

      {t && tab === 'Learn' && (
        <section className="prose">
          <h2>Explanation</h2>
          {t.explanation.split(/\n\s*\n/).map((para, i) => <p key={i}><Rich text={para} /></p>)}
          {t.points.length > 0 && (
            <>
              <h2>Key points to remember</h2>
              <ul className="keypoints">{t.points.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
            </>
          )}
          <h2>How it works</h2>
          <Diagram code={t.diagram} caption={'Diagram: ' + c.name} />
          {t.mistakes.length > 0 && (
            <div className="mistakes">
              <h2>Common mistakes</h2>
              <ul>{t.mistakes.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
            </div>
          )}
        </section>
      )}

      {t && tab === 'Code' && (
        <section>
          {t.code ? (
            <>
              <p className="muted small">Every line is commented. Tap “Hide notes” to test whether you can read the code yourself.</p>
              <CodeBlock code={t.code.src} lang={t.code.lang} title={'Implementation · ' + t.code.lang} />
            </>
          ) : <p className="muted">No code sample for this term. <a href={askAi('Show a fully commented code example for ' + c.name)}>Ask AI for one →</a></p>}
        </section>
      )}

      {t && tab === 'Interview' && (
        <section className="qa">
          <div className="qa-tools">
            <span className="muted small">{t.interview.length} questions</span>
            <button className="chip" onClick={() => setOpen((o) => {
              const allOpen = t.interview.every((_, i) => o['i' + i]);
              return Object.fromEntries(t.interview.map((_, i) => ['i' + i, !allOpen]));
            })}>Show / hide all answers</button>
          </div>
          {t.interview.map((qa, i) => (
            <div key={i} className={'qa-item' + (open['i' + i] ? ' open' : '')}>
              <button onClick={() => setOpen((o) => ({ ...o, ['i' + i]: !o['i' + i] }))} aria-expanded={!!open['i' + i]}>
                <span>Q{i + 1}. {qa.q}</span><span className="chev" aria-hidden>›</span>
              </button>
              {open['i' + i] && <p><Rich text={qa.a} /></p>}
            </div>
          ))}
          <a className="btn wide" href={'#/mock?cat=' + c.cat + '&format=cards'}>Practise {cat.name} interview questions →</a>
        </section>
      )}

      {t && tab === 'Coding Q&A' && (
        <section className="qa">
          {t.coding.length ? t.coding.map((qa, i) => (
            <div key={i} className={'qa-item' + (open['c' + i] ? ' open' : '')}>
              <button onClick={() => setOpen((o) => ({ ...o, ['c' + i]: !o['c' + i] }))} aria-expanded={!!open['c' + i]}>
                <span>{i + 1}. {qa.q}</span><span className="chev" aria-hidden>›</span>
              </button>
              {open['c' + i] && <CodeBlock code={qa.a} lang={t.code?.lang || 'javascript'} title="Solution" />}
            </div>
          )) : <p className="muted">No coding question yet. <a href={askAi('Give me 3 coding interview questions on ' + c.name + ' with fully commented solutions')}>Generate with AI →</a></p>}
          <a className="btn wide" href={askAi('Give me a new tricky coding question on ' + c.name + ' (' + cat.name + '). Do not show the answer until I ask.')}>✦ Get a fresh AI coding challenge</a>
        </section>
      )}

      {t && tab === 'Roadmap' && <TermRoadmap c={c} t={t} track={track} />}

      <nav className="pager" aria-label="Previous and next term">
        {prev ? <a className="pager-link" href={'#/term/' + prev.id}><small>← Previous</small><span>{prev.name}</span></a> : <span />}
        {next ? (
          <a className="pager-link next" href={'#/term/' + next.id} onClick={() => setMastered(id, true)}>
            <small>Mark done & next →</small><span>{next.name}</span>
          </a>
        ) : <a className="pager-link next" href={'#/cat/' + c.cat} onClick={() => setMastered(id, true)}><small>Finish track ✓</small><span>Back to syllabus</span></a>}
      </nav>
    </div>
  );
}

function TermRoadmap({ c, t, track }) {
  const p = useProgress();
  const mod = track.modules.find((m) => m.title === c.mod);
  const ids = mod.terms.map((x) => x.id);
  const i = ids.indexOf(c.id);
  const windowIds = ids.slice(Math.max(0, i - 2), i + 3);
  const code = 'flowchart LR\n' +
    windowIds.map((x, k) => `  N${k}["${safeLabel(BY_ID[x].name)}"]`).join('\n') + '\n' +
    windowIds.slice(1).map((_, k) => `  N${k} --> N${k + 1}`).join('\n') + '\n' +
    `  style N${windowIds.indexOf(c.id)} stroke:${CATEGORY_MAP[c.cat].color},stroke-width:4px\n`;
  const related = (t.related.length ? t.related : ids.filter((x) => x !== c.id).slice(0, 4)).map((x) => BY_ID[x]).filter(Boolean);
  return (
    <section>
      <p className="muted small">Where “{c.name}” sits in <b>{c.mod}</b>.</p>
      <Diagram code={code} caption="Your path through this module" />
      <ol className="module-path">
        {mod.terms.map((x) => (
          <li key={x.id} className={(x.id === c.id ? 'current ' : '') + (p.mastered.includes(x.id) ? 'done' : '')}>
            <a href={'#/term/' + x.id}>{p.mastered.includes(x.id) ? '✓ ' : ''}{x.name}</a>
          </li>
        ))}
      </ol>
      {related.length > 0 && (
        <>
          <h2 className="sec-title">Study next</h2>
          <div className="grid">{related.map((r) => <TermCard key={r.id} c={r} compact />)}</div>
        </>
      )}
      <a className="btn wide" href={'#/roadmap/' + c.cat}>See the full {CATEGORY_MAP[c.cat].name} roadmap →</a>
    </section>
  );
}

/* ---------------- QUICK REVISE (flashcards) ---------------- */
export function Revise({ id }) {
  const p = useProgress();
  const isTrack = !!CATEGORY_MAP[id];
  const sourceIds = useMemo(() => {
    if (isTrack) return orderedIds(id);
    if (id === 'saved') return p.saved;
    return CATALOG.map((t) => t.id);
  }, [id]);
  const [onlyTodo, setOnlyTodo] = useState(true);
  const [deck, setDeck] = useState(null);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const current = deck ? BY_ID[deck[i]] : null;
  const { track } = useTrack(current?.cat);
  const full = track?.terms.find((x) => x.id === current?.id);

  function start() {
    const ids = sourceIds.filter((x) => !onlyTodo || !p.mastered.includes(x));
    const shuffled = [...(ids.length ? ids : sourceIds)].sort(() => Math.random() - 0.5).slice(0, 20);
    setDeck(shuffled); setI(0); setFlipped(false); setKnown(0);
  }
  function answer(knew) {
    if (knew) { setMastered(deck[i], true); setKnown((k) => k + 1); }
    setFlipped(false);
    setI((n) => n + 1);
  }
  const title = isTrack ? CATEGORY_MAP[id].name : id === 'saved' ? 'Saved terms' : 'All tracks';

  if (!deck) return (
    <div className="page">
      <a className="back" href={isTrack ? '#/cat/' + id : '#/'}>← Back</a>
      <h1>Quick revise: {title}</h1>
      <p className="muted">Flashcards: see the term, recall its meaning, then flip to check. Up to 20 cards per round.</p>
      <label className="toggle"><input type="checkbox" checked={onlyTodo} onChange={(e) => setOnlyTodo(e.target.checked)} /> Only terms I haven't mastered</label>
      <button className="btn primary wide" onClick={start} disabled={!sourceIds.length}>Start revision</button>
      {!sourceIds.length && <p className="muted">Nothing to revise yet — save some terms first.</p>}
    </div>
  );

  if (i >= deck.length) return (
    <div className="page center">
      <h1>Round complete</h1>
      <div className={'score-ring' + (known / deck.length >= 0.7 ? ' good' : ' mid')}><b>{known}/{deck.length}</b><span>recalled</span></div>
      <div className="row-actions center-row">
        <button className="btn primary" onClick={start}>Another round</button>
        <a className="btn" href={isTrack ? '#/cat/' + id : '#/'}>Done</a>
      </div>
    </div>
  );

  const cat = CATEGORY_MAP[current.cat];
  return (
    <div className="page runner">
      <div className="runner-top">
        <button className="back plain" onClick={() => setDeck(null)}>✕ End</button>
        <span>{i + 1} / {deck.length}</span>
        <span className="muted small">{known} known</span>
      </div>
      <div className="progress"><i style={{ width: ((i + 1) / deck.length) * 100 + '%' }} /></div>
      <button className={'flashcard' + (flipped ? ' flipped' : '')} style={{ '--accent': cat.color }} onClick={() => setFlipped((f) => !f)} aria-live="polite">
        <span className="term-cat">{cat.icon} {cat.name} · {LEVEL_NAME[current.lvl]}</span>
        <span className="fc-name">{current.name}</span>
        {!flipped ? <span className="muted small">Think of the meaning, then tap to flip</span> : (
          <span className="fc-back">
            <span className="fc-one"><Rich text={current.one} /></span>
            {full?.points?.length > 0 && <ul>{full.points.slice(0, 4).map((x, k) => <li key={k}><Rich text={x} /></li>)}</ul>}
          </span>
        )}
      </button>
      {flipped ? (
        <div className="self-rate">
          <button className="btn" onClick={() => answer(false)}>Need practice</button>
          <button className="btn primary" onClick={() => answer(true)}>I knew it ✓</button>
        </div>
      ) : <button className="btn primary wide" onClick={() => setFlipped(true)}>Show answer</button>}
      <a className="small center-link" href={'#/term/' + current.id}>Open full lesson →</a>
    </div>
  );
}

/* ---------------- PROGRESS / SAVED / SETTINGS ---------------- */
export function Saved() {
  const p = useProgress();
  const s = useSettings();
  const [offline, setOffline] = useState('idle');
  const saved = p.saved.map((x) => BY_ID[x]).filter(Boolean);
  const avg = p.tests.length ? Math.round((p.tests.reduce((a, t) => a + t.score / t.total, 0) / p.tests.length) * 100) : 0;
  async function downloadAll() {
    setOffline('loading');
    try { await loadAllTracks(); setOffline('done'); } catch { setOffline('error'); }
  }
  return (
    <div className="page">
      <h1>Progress</h1>
      <div className="stats">
        <div><b>{p.mastered.length}</b><span>of {CATALOG.length} mastered</span></div>
        <div><b>{streak(p.days)}🔥</b><span>day streak</span></div>
        <div><b>{p.tests.length}</b><span>tests taken</span></div>
        <div><b>{avg}%</b><span>avg score</span></div>
      </div>

      <h2 className="sec-title">Tracks</h2>
      <ul className="history">
        {CATEGORIES.map((c) => {
          const list = catTerms(c.id); const done = list.filter((t) => p.mastered.includes(t.id)).length;
          return <li key={c.id}><a href={'#/cat/' + c.id}>{c.icon} {c.name}</a><span className="track-mini"><ProgressBar value={(done / list.length) * 100} label={c.name} /></span><b>{done}/{list.length}</b></li>;
        })}
      </ul>

      <h2 className="sec-title">Saved terms</h2>
      {saved.length ? (
        <>
          <div className="grid">{saved.map((c) => <TermCard key={c.id} c={c} />)}</div>
          <a className="btn wide" href="#/revise/saved">Revise saved terms</a>
        </>
      ) : <p className="muted">Tap ☆ Save on any term to keep it here for quick revision.</p>}

      {p.tests.length > 0 && (
        <>
          <h2 className="sec-title">Recent mock tests</h2>
          <ul className="history">{p.tests.map((t, i) => <li key={i}><span>{t.label}</span><b>{t.score}/{t.total}</b><span className="muted small">{new Date(t.at).toLocaleDateString()}</span></li>)}</ul>
        </>
      )}

      <h2 className="sec-title">Settings</h2>
      <div className="settings">
        <label className="field">Theme
          <select value={s.theme} onChange={(e) => setSetting('theme', e.target.value)}>
            <option value="system">Match device</option><option value="dark">Dark</option><option value="light">Light</option>
          </select>
        </label>
        <label className="field">Text size: {Math.round(s.fontScale * 100)}%
          <input type="range" min="0.9" max="1.3" step="0.05" value={s.fontScale} onChange={(e) => setSetting('fontScale', Number(e.target.value))} />
        </label>
        <button className="btn" onClick={downloadAll} disabled={offline === 'loading'}>
          {offline === 'loading' ? 'Downloading…' : offline === 'done' ? '✓ All lessons available offline' : 'Download all lessons for offline'}
        </button>
        {offline === 'error' && <p role="alert" className="muted small">Download failed — check your connection.</p>}
      </div>
    </div>
  );
}

export function NotFound() {
  return <div className="page"><h1>Not found</h1><p><a href="#/">Go home</a></p></div>;
}
