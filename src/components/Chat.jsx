// Chat.jsx — AI Mentor: Gemini via /api/chat, with an offline smart-search fallback
import { useEffect, useRef, useState } from 'react';
import { TERMS, TERM_MAP, searchTerms } from '../data/index.js';
import { CATEGORY_MAP } from '../data/categories.js';
import CodeBlock from './CodeBlock.jsx';

const CATALOG = TERMS.map((t) => ({ id: t.id, name: t.name, cat: t.cat }));
const STARTERS = [
  'My React useEffect runs in an infinite loop — why?',
  'Getting a CORS error calling my API from localhost',
  'Explain switchMap vs mergeMap with an example',
  'How do I stream Gemini responses into a React chat UI?',
  'What should a 5-year frontend dev revise for Publicis Sapient?'
];

// Tiny safe markdown → React (no innerHTML): fenced code, **bold**, `code`, headings, bullets
function Markdown({ text }) {
  const parts = text.split(/```(\w+)?\n?([\s\S]*?)```/g);
  const out = [];
  for (let i = 0; i < parts.length; i += 3) {
    if (parts[i]) out.push(<Prose key={'p' + i} text={parts[i]} />);
    if (parts[i + 2] !== undefined) out.push(<CodeBlock key={'c' + i} code={parts[i + 2].replace(/\n$/, '')} lang={parts[i + 1] || 'javascript'} />);
  }
  return <>{out}</>;
}
function inline(s) {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((seg, i) =>
    seg.startsWith('**') ? <b key={i}>{seg.slice(2, -2)}</b> : seg.startsWith('`') ? <code key={i}>{seg.slice(1, -1)}</code> : seg);
}
function Prose({ text }) {
  return text.trim().split(/\n{2,}/).map((block, i) => {
    const lines = block.split('\n');
    if (lines.every((l) => /^\s*([-*]|\d+\.)\s/.test(l))) return <ul key={i}>{lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*([-*]|\d+\.)\s/, ''))}</li>)}</ul>;
    if (/^#{1,4}\s/.test(block)) return <h3 key={i}>{inline(block.replace(/^#{1,4}\s/, ''))}</h3>;
    return <p key={i}>{lines.map((l, j) => <span key={j}>{inline(l)}{j < lines.length - 1 && <br />}</span>)}</p>;
  });
}

function offlineAnswer(q) {
  const hits = searchTerms(q, 4);
  if (!hits.length) return { text: 'I could not match that to a topic yet. Try naming the technology (React, Angular, CORS, TypeScript…) or the error message.', termIds: [] };
  const top = hits[0];
  return {
    text: '**Best match: ' + top.name + '**\n\n' + top.oneLiner + '\n\n' + top.explanation.split('\n\n')[0] + '\n\nOpen the topic below for the diagram, commented code and interview questions.',
    termIds: hits.map((h) => h.id)
  };
}

export default function Chat({ params }) {
  const [msgs, setMsgs] = useState([{ role: 'ai', text: 'Hi! Describe what you are stuck on — an error, a concept, or interview prep — and I will explain it and point you to the right topic to study.', termIds: [] }]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);
  const [provider, setProvider] = useState('AI');
  const endRef = useRef(null);
  const seeded = useRef(false);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, busy]);
  useEffect(() => {
    const q = params.get('q');
    if (q && !seeded.current) { seeded.current = true; send(q); }
  }, []);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || busy) return;
    setInput('');
    const history = msgs.slice(1);
    setMsgs((m) => [...m, { role: 'user', text: question }]);
    setBusy(true);
    try {
      if (offline) throw new Error('offline');
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: history.map(({ role, text }) => ({ role, text })), catalog: CATALOG })
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'fail');
      if (data.provider) setProvider(data.provider[0].toUpperCase() + data.provider.slice(1));
      setMsgs((m) => [...m, { role: 'ai', text: data.answer, termIds: (data.termIds || []).filter((id) => TERM_MAP[id]) }]);
    } catch (e) {
      if (e.message === 'NO_KEY' || e.message === 'offline' || e.message === 'fail' || e instanceof TypeError) setOffline(true);
      const a = offlineAnswer(question);
      setMsgs((m) => [...m, { role: 'ai', text: a.text, termIds: a.termIds, offline: true }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page chat">
      <header className="chat-head">
        <h1>AI Mentor</h1>
        <span className={'status' + (offline ? ' off' : '')}>{offline ? 'Offline search mode' : provider}</span>
      </header>
      {offline && <p className="muted small">The AI service isn't reachable right now, so answers come from the built-in topic library. (Site owner: set an AI key such as GEMINI_API_KEY or GROQ_API_KEY in Vercel.)</p>}
      <div className="msgs" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={'msg ' + m.role}>
            {m.role === 'ai' ? <Markdown text={m.text} /> : <p>{m.text}</p>}
            {m.termIds?.length > 0 && (
              <div className="msg-links">
                <span className="small muted">Study these:</span>
                {m.termIds.map((id) => <a key={id} className="pill linked" href={'#/term/' + id}>{CATEGORY_MAP[TERM_MAP[id].cat].icon} {TERM_MAP[id].name}</a>)}
              </div>
            )}
          </div>
        ))}
        {busy && <div className="msg ai typing"><i /><i /><i /></div>}
        <div ref={endRef} />
      </div>
      {msgs.length < 2 && (
        <div className="pill-wrap">{STARTERS.map((s) => <button key={s} className="pill" onClick={() => send(s)}>{s}</button>)}</div>
      )}
      <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="Paste an error or ask anything…"
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }} aria-label="Message" />
        <button className="btn primary" disabled={busy || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
