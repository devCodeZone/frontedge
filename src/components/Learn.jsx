// Learn.jsx — Home, Category, Roadmap and Term pages
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories.js';
import { TERMS, TERM_MAP, termsByCat, searchTerms, RELEASE_WATCH } from '../data/index.js';
import { go, useProgress, toggleSaved, toggleMastered, markRecent, safeLabel } from '../lib.js';
import Diagram from './Diagram.jsx';
import CodeBlock from './CodeBlock.jsx';

const Level = ({ l }) => <span className={'lvl lvl-' + l.toLowerCase()}>{l}</span>;

export function TermCard({ t }) {
  const p = useProgress();
  const c = CATEGORY_MAP[t.cat];
  return (
    <a className="term-card" href={'#/term/' + t.id} style={{ '--accent': c.color }}>
      <div className="term-card-top">
        <span className="term-cat">{c.icon} {c.name}</span>
        {p.mastered.includes(t.id) && <span className="done-dot" title="Mastered">✓</span>}
      </div>
      <h3>{t.name}</h3>
      <p>{t.oneLiner}</p>
      <div className="term-meta"><Level l={t.level} />{t.version && <span className="ver">{t.version}</span>}</div>
    </a>
  );
}

/* ------------------------------- HOME ------------------------------- */
export function Home({ installPrompt }) {
  const [q, setQ] = useState('');
  const p = useProgress();
  const results = useMemo(() => (q.trim() ? searchTerms(q, 12) : []), [q]);
  const pct = Math.round((p.mastered.length / TERMS.length) * 100);
  const recent = p.recent.map((id) => TERM_MAP[id]).filter(Boolean);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-row">
          <div>
            <p className="eyebrow">FrontEdge</p>
            <h1>Stay interview-ready on every frontend topic.</h1>
          </div>
          {installPrompt}
        </div>
        <label className="search">
          <span aria-hidden>⌕</span>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a term — closures, CORS, signals, RAG…" aria-label="Search terms" />
          {q && <button className="clear" onClick={() => setQ('')} aria-label="Clear">×</button>}
        </label>
        <div className="stats">
          <div><b>{TERMS.length}</b><span>deep-dive terms</span></div>
          <div><b>{CATEGORIES.length}</b><span>tracks</span></div>
          <div><b>{pct}%</b><span>mastered</span></div>
        </div>
      </header>

      {q.trim() ? (
        <section>
          <h2 className="sec-title">Results</h2>
          {results.length ? <div className="grid">{results.map((t) => <TermCard key={t.id} t={t} />)}</div>
            : <p className="muted">No match. Try the AI Mentor tab — describe the problem you are stuck on.</p>}
        </section>
      ) : (
        <>
          {recent.length > 0 && (
            <section>
              <h2 className="sec-title">Continue</h2>
              <div className="hscroll">{recent.map((t) => <TermCard key={t.id} t={t} />)}</div>
            </section>
          )}
          <section>
            <h2 className="sec-title">Tracks</h2>
            <div className="cat-grid">
              {CATEGORIES.map((c) => {
                const count = termsByCat(c.id).length;
                const done = termsByCat(c.id).filter((t) => p.mastered.includes(t.id)).length;
                return (
                  <a key={c.id} className="cat" href={'#/cat/' + c.id} style={{ '--accent': c.color }}>
                    <span className="cat-icon">{c.icon}</span>
                    <span className="cat-name">{c.name}</span>
                    <span className="cat-count">{count} terms · {done} done</span>
                    <span className="bar"><i style={{ width: (count ? (done / count) * 100 : 0) + '%' }} /></span>
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
                  <span className="tag">{w.tag}</span>
                  <b>{w.title}</b>
                  <span className="muted">{w.note}</span>
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

/* ------------------------------- CATEGORY ------------------------------- */
export function Category({ id }) {
  const c = CATEGORY_MAP[id];
  if (!c) return <NotFound />;
  const terms = termsByCat(id);
  const upcoming = c.roadmap.flatMap((s) => s.items).filter((it) => !terms.some((t) => t.name.toLowerCase().includes(it.toLowerCase().split(' ')[0])));
  return (
    <div className="page">
      <a className="back" href="#/">← Tracks</a>
      <header className="cat-head" style={{ '--accent': c.color }}>
        <span className="cat-icon big">{c.icon}</span>
        <div>
          <h1>{c.name}</h1>
          <p className="muted">{c.desc}</p>
        </div>
      </header>
      <div className="row-actions">
        <a className="btn primary" href={'#/roadmap/' + c.id}>View roadmap</a>
        <a className="btn" href={'#/mock?cat=' + c.id}>Mock test this track</a>
      </div>
      <h2 className="sec-title">Deep-dive terms</h2>
      <div className="grid">{terms.map((t) => <TermCard key={t.id} t={t} />)}</div>
      {upcoming.length > 0 && (
        <>
          <h2 className="sec-title">Also on this roadmap</h2>
          <p className="muted small">Ask the AI Mentor about any of these for an instant explanation.</p>
          <div className="pill-wrap">
            {upcoming.map((u) => <a key={u} className="pill" href={'#/chat?q=' + encodeURIComponent('Explain ' + u + ' in ' + c.name + ' with a commented code example and interview questions')}>{u}</a>)}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------- ROADMAP ------------------------------- */
export function Roadmap({ id }) {
  const c = CATEGORY_MAP[id];
  if (!c) return <NotFound />;
  const code = useMemo(() => {
    let s = 'flowchart TD\n';
    c.roadmap.forEach((st, i) => {
      s += '  subgraph S' + i + '["' + (i + 1) + '. ' + safeLabel(st.stage) + '"]\n    direction LR\n';
      st.items.forEach((it, j) => { s += '    S' + i + 'I' + j + '["' + safeLabel(it) + '"]\n'; });
      s += '  end\n';
      if (i > 0) s += '  S' + (i - 1) + ' --> S' + i + '\n';
    });
    return s;
  }, [c]);
  return (
    <div className="page">
      <a className="back" href={'#/cat/' + c.id}>← {c.name}</a>
      <h1>{c.icon} {c.name} roadmap</h1>
      <p className="muted">Work top to bottom. Each stage builds on the previous one.</p>
      <Diagram code={code} />
      <ol className="stage-list">
        {c.roadmap.map((st) => (
          <li key={st.stage}>
            <b>{st.stage}</b>
            <div className="pill-wrap">
              {st.items.map((it) => {
                const match = searchTerms(it + ' ' + c.name, 1)[0];
                return match && match.cat === c.id
                  ? <a key={it} className="pill linked" href={'#/term/' + match.id}>{it}</a>
                  : <a key={it} className="pill" href={'#/chat?q=' + encodeURIComponent('Explain ' + it + ' (' + c.name + ') with commented code')}>{it}</a>;
              })}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------- TERM ------------------------------- */
const TABS = ['Learn', 'Code', 'Interview', 'Coding Q&A', 'Roadmap'];

export function Term({ id }) {
  const t = TERM_MAP[id];
  const p = useProgress();
  const [tab, setTab] = useState('Learn');
  const [open, setOpen] = useState({});
  useEffect(() => { if (t) markRecent(t.id); setTab('Learn'); setOpen({}); }, [id]);
  if (!t) return <NotFound />;
  const c = CATEGORY_MAP[t.cat];
  const roadmapCode = 'flowchart LR\n' + t.roadmap.map((s, i) => '  R' + i + '["' + safeLabel(s) + '"]').join('\n') + '\n' +
    t.roadmap.slice(1).map((_, i) => '  R' + i + ' --> R' + (i + 1)).join('\n') +
    '\n  style R' + Math.max(0, t.roadmap.findIndex((s) => s.toLowerCase().includes(t.name.toLowerCase().split(/[ ,&(]/)[0]))) + ' stroke:' + c.color + ',stroke-width:3px';

  return (
    <div className="page term" style={{ '--accent': c.color }}>
      <a className="back" href={'#/cat/' + c.id}>← {c.icon} {c.name}</a>
      <header className="term-head">
        <h1>{t.name}</h1>
        <div className="term-meta"><Level l={t.level} />{t.version && <span className="ver">{t.version}</span>}</div>
        <p className="one-liner">{t.oneLiner}</p>
        <div className="row-actions">
          <button className={'btn' + (p.saved.includes(t.id) ? ' on' : '')} onClick={() => toggleSaved(t.id)}>{p.saved.includes(t.id) ? '★ Saved' : '☆ Save'}</button>
          <button className={'btn' + (p.mastered.includes(t.id) ? ' on' : '')} onClick={() => toggleMastered(t.id)}>{p.mastered.includes(t.id) ? '✓ Mastered' : 'Mark mastered'}</button>
          <a className="btn" href={'#/chat?q=' + encodeURIComponent('I am studying ' + t.name + '. Give me a tricky real-project scenario and explain how to solve it.')}>Ask AI</a>
        </div>
      </header>

      <nav className="tabs" role="tablist">
        {TABS.map((x) => <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)}>{x}</button>)}
      </nav>

      {tab === 'Learn' && (
        <section className="prose">
          <h2>Explanation</h2>
          {t.explanation.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
          <h2>How it flows</h2>
          <Diagram code={t.diagram} />
        </section>
      )}
      {tab === 'Code' && (
        <section>
          <p className="muted small">Every line is commented — tap “Hide notes” to test yourself on reading the code.</p>
          <CodeBlock code={t.code.src} lang={t.code.lang} title={'Implementation · ' + t.code.lang} />
        </section>
      )}
      {tab === 'Interview' && (
        <section className="qa">
          {t.interview.map((qa, i) => (
            <div key={i} className={'qa-item' + (open['i' + i] ? ' open' : '')}>
              <button onClick={() => setOpen((o) => ({ ...o, ['i' + i]: !o['i' + i] }))} aria-expanded={!!open['i' + i]}>
                <span>Q{i + 1}. {qa.q}</span><span className="chev">›</span>
              </button>
              {open['i' + i] && <p>{qa.a}</p>}
            </div>
          ))}
        </section>
      )}
      {tab === 'Coding Q&A' && (
        <section className="qa">
          {t.coding.map((qa, i) => (
            <div key={i} className={'qa-item' + (open['c' + i] ? ' open' : '')}>
              <button onClick={() => setOpen((o) => ({ ...o, ['c' + i]: !o['c' + i] }))} aria-expanded={!!open['c' + i]}>
                <span>{i + 1}. {qa.q}</span><span className="chev">›</span>
              </button>
              {open['c' + i] && <CodeBlock code={qa.a} lang={t.code.lang === 'yaml' ? 'bash' : t.code.lang} title="Solution" />}
            </div>
          ))}
        </section>
      )}
      {tab === 'Roadmap' && (
        <section>
          <p className="muted small">Where this term sits in your learning path.</p>
          <Diagram code={roadmapCode} />
          {t.related?.length > 0 && (
            <>
              <h2 className="sec-title">Study next</h2>
              <div className="grid">{t.related.map((r) => TERM_MAP[r]).filter(Boolean).map((r) => <TermCard key={r.id} t={r} />)}</div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

/* ------------------------------- SAVED / PROGRESS ------------------------------- */
export function Saved() {
  const p = useProgress();
  const saved = p.saved.map((id) => TERM_MAP[id]).filter(Boolean);
  return (
    <div className="page">
      <h1>Saved & progress</h1>
      <div className="stats inline">
        <div><b>{p.mastered.length}/{TERMS.length}</b><span>terms mastered</span></div>
        <div><b>{p.tests.length}</b><span>mock tests taken</span></div>
        <div><b>{p.tests.length ? Math.round(p.tests.reduce((a, t) => a + t.score / t.total, 0) / p.tests.length * 100) : 0}%</b><span>avg score</span></div>
      </div>
      <h2 className="sec-title">Saved terms</h2>
      {saved.length ? <div className="grid">{saved.map((t) => <TermCard key={t.id} t={t} />)}</div> : <p className="muted">Tap ☆ Save on any term to keep it here for quick revision.</p>}
      {p.tests.length > 0 && (
        <>
          <h2 className="sec-title">Recent mock tests</h2>
          <ul className="history">{p.tests.map((t, i) => <li key={i}><span>{t.label}</span><b>{t.score}/{t.total}</b><span className="muted small">{new Date(t.at).toLocaleDateString()}</span></li>)}</ul>
        </>
      )}
    </div>
  );
}

export function NotFound() {
  return <div className="page"><h1>Not found</h1><p><a href="#/">Go home</a></p></div>;
}
