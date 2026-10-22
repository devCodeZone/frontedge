// News.jsx — live trending frontend articles (via /api/news) + curated release watch
import { useEffect, useState } from 'react';
import { RELEASE_WATCH } from '../data/index.js';

const TAGS = ['all', 'javascript', 'react', 'typescript', 'angular', 'nextjs', 'css', 'ai'];

export default function News() {
  const [tag, setTag] = useState('all');
  const [state, setState] = useState({ loading: true, items: [], error: false });

  useEffect(() => {
    const ac = new AbortController();
    setState((s) => ({ ...s, loading: true, error: false }));
    fetch('/api/news' + (tag === 'all' ? '' : '?tag=' + tag), { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setState({ loading: false, items: d.items || [], error: !(d.items || []).length }))
      .catch((e) => { if (e?.name !== 'AbortError') setState({ loading: false, items: [], error: true }); });
    return () => ac.abort();
  }, [tag]);

  return (
    <div className="page">
      <h1>What's new</h1>
      <h2 className="sec-title">Release watch</h2>
      <div className="watch">
        {RELEASE_WATCH.map((w) => (
          <a key={w.title} href={'#/term/' + w.term} className="watch-item"><span className="tag">{w.tag}</span><b>{w.title}</b><span className="muted">{w.note}</span></a>
        ))}
      </div>
      <h2 className="sec-title">Trending this week</h2>
      <div className="pill-wrap selectable">{TAGS.map((t) => <button key={t} className={'pill' + (tag === t ? ' on' : '')} onClick={() => setTag(t)}>#{t}</button>)}</div>
      {state.loading && <div className="news-list">{[0, 1, 2, 3].map((k) => <div key={k} className="skeleton tall" />)}</div>}
      {!state.loading && state.error && <p className="muted">Live news isn't available right now (it loads once the app is deployed on Vercel). The release watch above is always available offline.</p>}
      <div className="news-list">
        {state.items.map((a) => (
          <a key={a.id} className="news" href={a.url} target="_blank" rel="noopener noreferrer">
            <b>{a.title}</b>
            <span className="muted small">{a.author} · {a.readMin} min · ♥ {a.reactions} · {new Date(a.published).toLocaleDateString()}</span>
            <span className="pill-wrap">{(a.tags || []).slice(0, 4).map((t) => <span key={t} className="pill static tiny">#{t}</span>)}</span>
          </a>
        ))}
      </div>
      <p className="muted small">Articles via the public DEV Community API.</p>
    </div>
  );
}
