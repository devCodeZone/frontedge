// Mock.jsx — mock tests by topic, experience profile or company pattern
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_MAP } from '../data/categories.js';
import { conceptQuestions, loadTrack } from '../data/index.js';
import { PROFILES, COMPANIES, buildTest, shuffle } from '../data/mock.js';
import { recordTest, levelName } from '../lib.js';
import CodeBlock from './CodeBlock.jsx';

const MODES = ['Topic', 'Experience', 'Company'];
const FORMATS = [
  { id: 'mcq', name: 'MCQ quiz', desc: 'Timed, auto-scored' },
  { id: 'cards', name: 'Interview round', desc: 'Answer aloud, then check' },
  { id: 'coding', name: 'Coding round', desc: 'Write it, then compare' }
];
const LEVEL_ORDER = ['Beginner', 'Intermediate', 'Advanced'];

export default function Mock({ params }) {
  const cat0 = params.get('cat');
  const [mode, setMode] = useState(cat0 ? 'Topic' : 'Experience');
  const [cats, setCats] = useState(cat0 ? [cat0] : []);
  const [level, setLevel] = useState(1);
  const [company, setCompany] = useState(params.get('company') || 'tcs');
  const [format, setFormat] = useState(params.get('format') || 'mcq');
  const [count, setCount] = useState(15);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const comp = COMPANIES.find((c) => c.id === company) || COMPANIES[0];
  const activeCats = mode === 'Topic' ? cats : mode === 'Experience' ? PROFILES[level].focus : comp.focus;
  const lvl = mode === 'Topic' ? null : level;

  async function start() {
    const label = mode === 'Company' ? comp.name + ' · ' + levelName[level]
      : mode === 'Experience' ? PROFILES[level].name
      : (cats.map((c) => CATEGORY_MAP[c].name).join(', ') || 'All topics');
    if (format === 'mcq') {
      const extra = conceptQuestions(activeCats, lvl);                    // auto-generated from the syllabus
      setSession({ format, label, items: buildTest({ cats: activeCats, level: lvl, count, extra }) });
      return;
    }
    setLoading(true);
    try {
      const ids = activeCats.length ? activeCats : CATEGORIES.map((c) => c.id);
      const tracks = await Promise.all(ids.map(loadTrack));                // load full content for Q&A
      const maxLvl = lvl === null ? 2 : Math.min(2, lvl);
      const pool = tracks.flatMap((tr) => tr.terms)
        .filter((t) => LEVEL_ORDER.indexOf(t.level) <= maxLvl + (lvl === 3 ? 1 : 0));
      const items = shuffle(pool.flatMap((t) => (format === 'cards' ? t.interview : t.coding).map((qa) => ({ ...qa, term: t }))))
        .slice(0, format === 'cards' ? count : Math.min(count, 8));
      setSession({ format, label, items });
    } finally {
      setLoading(false);
    }
  }

  if (session) return <Runner session={session} onExit={() => setSession(null)} />;

  return (
    <div className="page">
      <h1>Mock tests</h1>
      <p className="muted">New random questions every time — curated MCQs plus questions generated from all syllabus terms.</p>

      <div className="seg" role="tablist" aria-label="Test mode">{MODES.map((m) => <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'active' : ''} onClick={() => setMode(m)}>{m === 'Topic' ? 'By topic' : m === 'Experience' ? 'By experience' : 'By company'}</button>)}</div>

      {mode === 'Topic' && (
        <div className="pill-wrap selectable" role="group" aria-label="Topics">
          {CATEGORIES.map((c) => (
            <button key={c.id} aria-pressed={cats.includes(c.id)} className={'pill' + (cats.includes(c.id) ? ' on' : '')} onClick={() => setCats((s) => (s.includes(c.id) ? s.filter((x) => x !== c.id) : [...s, c.id]))}>{c.icon} {c.name}</button>
          ))}
          <p className="muted small">{cats.length ? cats.length + ' selected' : 'None selected = all topics'}</p>
        </div>
      )}

      {(mode === 'Experience' || mode === 'Company') && (
        <div className="profile-list" role="radiogroup" aria-label="Experience level">
          {PROFILES.map((p) => (
            <button key={p.id} role="radio" aria-checked={level === p.id} className={'profile' + (level === p.id ? ' on' : '')} onClick={() => setLevel(p.id)}>
              <b>{p.name}</b><span>{p.years}</span>
            </button>
          ))}
        </div>
      )}

      {mode === 'Company' && (
        <>
          <label className="field">Company
            <select value={company} onChange={(e) => setCompany(e.target.value)}>
              {COMPANIES.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.type}</option>)}
            </select>
          </label>
          <div className="company-card">
            <b>{comp.name}: typical interview pattern</b>
            <ol>{comp.rounds.map((r) => <li key={r}>{r}</li>)}</ol>
            <p className="tip">💡 {comp.tip}</p>
            <p className="muted small">Patterns are compiled from commonly reported candidate experiences and change often — no source can promise the exact questions. Practise the topics and formats they usually test.</p>
            <div className="pill-wrap">{comp.focus.map((f) => <a key={f} className="pill linked" href={'#/cat/' + f}>{CATEGORY_MAP[f].icon} {CATEGORY_MAP[f].name}</a>)}</div>
          </div>
        </>
      )}

      <h2 className="sec-title">Format</h2>
      <div className="format-list" role="radiogroup" aria-label="Format">
        {FORMATS.map((f) => (
          <button key={f.id} role="radio" aria-checked={format === f.id} className={'format' + (format === f.id ? ' on' : '')} onClick={() => setFormat(f.id)}>
            <b>{f.name}</b><span>{f.desc}</span>
          </button>
        ))}
      </div>
      <label className="field">Questions: {count}
        <input type="range" min="5" max="30" step="5" value={count} onChange={(e) => setCount(+e.target.value)} />
      </label>
      <button className="btn primary wide" onClick={start} disabled={loading}>{loading ? 'Preparing questions…' : 'Start test'}</button>
    </div>
  );
}

function Runner({ session, onExit }) {
  const { items, format, label } = session;
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reveal, setReveal] = useState(false);
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(items.length * 45);

  useEffect(() => {
    if (format !== 'mcq' || done) return;
    const id = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [format, done]);
  useEffect(() => { if (format === 'mcq' && secs === 0) setDone(true); }, [secs, format]);

  const score = useMemo(() => (format === 'mcq'
    ? items.filter((q, k) => answers[k] === q.answer).length
    : Object.values(answers).filter((v) => v === 'knew').length), [answers, items, format]);

  useEffect(() => { if (done) recordTest({ label: label + ' · ' + format.toUpperCase(), score, total: items.length, at: Date.now() }); }, [done]);

  if (!items.length) return <div className="page"><p>No questions match these filters yet.</p><button className="btn" onClick={onExit}>Back</button></div>;

  const catOf = (q) => q.cat || q.term.cat;
  const termOf = (q) => q.termId || q.term?.id;

  if (done) {
    const byCat = {};
    items.forEach((q, k) => {
      const c = catOf(q);
      byCat[c] = byCat[c] || { ok: 0, n: 0 };
      byCat[c].n++;
      if (format === 'mcq' ? answers[k] === q.answer : answers[k] === 'knew') byCat[c].ok++;
    });
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="page">
        <h1>Result</h1>
        <div className={'score-ring' + (pct >= 70 ? ' good' : pct >= 40 ? ' mid' : ' low')}><b>{pct}%</b><span>{score}/{items.length}</span></div>
        <p className="center muted">{pct >= 70 ? 'Interview-ready on these topics. Push to harder levels.' : pct >= 40 ? 'Close. Revise the weak tracks below and retake.' : 'Revise the linked terms, then retake — repetition works.'}</p>
        <h2 className="sec-title">By track</h2>
        <ul className="history">{Object.entries(byCat).map(([c, v]) => <li key={c}><a href={'#/cat/' + c}>{CATEGORY_MAP[c].icon} {CATEGORY_MAP[c].name}</a><b>{v.ok}/{v.n}</b></li>)}</ul>
        {format === 'mcq' && (
          <>
            <h2 className="sec-title">Review</h2>
            {items.map((q, k) => (
              <div key={k} className={'review ' + (answers[k] === q.answer ? 'ok' : 'bad')}>
                <b>{k + 1}. {q.q}</b>
                <p>Your answer: {answers[k] !== undefined ? q.options[answers[k]] : '—'}</p>
                {answers[k] !== q.answer && <p>Correct: {q.options[q.answer]}</p>}
                <p className="muted small">{q.why}</p>
                {termOf(q) && <a className="small" href={'#/term/' + termOf(q)}>Study this term →</a>}
              </div>
            ))}
          </>
        )}
        <div className="row-actions"><button className="btn primary" onClick={onExit}>New test</button></div>
      </div>
    );
  }

  const q = items[i];
  const last = i === items.length - 1;
  const next = () => { setReveal(false); last ? setDone(true) : setI(i + 1); };
  const cat = CATEGORY_MAP[catOf(q)];

  return (
    <div className="page runner">
      <div className="runner-top">
        <button className="back plain" onClick={onExit}>✕ Quit</button>
        <span>{i + 1} / {items.length}</span>
        {format === 'mcq' && <span className={'timer' + (secs < 30 ? ' warn' : '')} aria-label="Time left">{Math.floor(secs / 60)}:{String(secs % 60).padStart(2, '0')}</span>}
      </div>
      <div className="progress"><i style={{ width: ((i + 1) / items.length) * 100 + '%' }} /></div>
      <span className="term-cat">{cat.icon} {cat.name}{q.level !== undefined ? ' · ' + levelName[q.level] : ''}{q.term ? ' · ' + q.term.name : ''}</span>
      <h2 className="question">{q.q}</h2>

      {format === 'mcq' && (
        <>
          <div className="options" role="group" aria-label="Answer options">
            {q.options.map((o, k) => {
              const chosen = answers[i] !== undefined;
              const cls = !chosen ? '' : k === q.answer ? ' correct' : k === answers[i] ? ' wrong' : ' dim';
              return <button key={k} className={'option' + cls} disabled={chosen} onClick={() => setAnswers((a) => ({ ...a, [i]: k }))}><span className="opt-key">{'ABCD'[k]}</span>{o}</button>;
            })}
          </div>
          {answers[i] !== undefined && <p className="why" role="status">{answers[i] === q.answer ? '✓ Correct. ' : '✗ Not quite. '}{q.why}</p>}
          <button className="btn primary wide" disabled={answers[i] === undefined} onClick={next}>{last ? 'Finish' : 'Next'}</button>
        </>
      )}

      {format !== 'mcq' && (
        <>
          {!reveal ? (
            <>
              <p className="muted">{format === 'cards' ? 'Answer out loud as you would in an interview, then reveal.' : 'Write your solution (paper or editor), then compare.'}</p>
              <button className="btn primary wide" onClick={() => setReveal(true)}>Reveal answer</button>
            </>
          ) : (
            <>
              {format === 'cards' ? <p className="answer">{q.a}</p> : <CodeBlock code={q.a} lang={q.term.code?.lang || 'javascript'} title="Model solution" />}
              <a className="small" href={'#/term/' + q.term.id}>Study “{q.term.name}” →</a>
              <div className="self-rate">
                <button className="btn" onClick={() => { setAnswers((a) => ({ ...a, [i]: 'missed' })); next(); }}>Missed it</button>
                <button className="btn primary" onClick={() => { setAnswers((a) => ({ ...a, [i]: 'knew' })); next(); }}>I knew it</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
