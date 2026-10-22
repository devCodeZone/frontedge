// App.jsx — shell: routing + bottom tab bar + install prompt
import { useEffect, useState } from 'react';
import { useRoute } from './lib.js';
import { Home, Category, Roadmap, Term, Saved, NotFound } from './components/Learn.jsx';
import Mock from './components/Mock.jsx';
import Chat from './components/Chat.jsx';
import News from './components/News.jsx';

const TABS = [
  { id: '', label: 'Learn', icon: '◧' },
  { id: 'mock', label: 'Mock', icon: '✎' },
  { id: 'chat', label: 'AI Mentor', icon: '✦' },
  { id: 'news', label: 'News', icon: '◎' },
  { id: 'saved', label: 'Saved', icon: '★' }
];

function InstallButton() {
  const [evt, setEvt] = useState(null);
  const [iosHint, setIosHint] = useState(false);
  const standalone = typeof window !== 'undefined' && (matchMedia('(display-mode: standalone)').matches || navigator.standalone);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  useEffect(() => {
    const on = (e) => { e.preventDefault(); setEvt(e); };
    window.addEventListener('beforeinstallprompt', on);
    return () => window.removeEventListener('beforeinstallprompt', on);
  }, []);
  if (standalone || (!evt && !isIOS)) return null;
  return (
    <div className="install">
      <button className="btn primary small" onClick={async () => {
        if (evt) { evt.prompt(); await evt.userChoice; setEvt(null); } else setIosHint((v) => !v);
      }}>Install app</button>
      {iosHint && <p className="ios-hint">On iPhone: tap <b>Share</b> → <b>Add to Home Screen</b>.</p>}
    </div>
  );
}

export default function App() {
  const { parts, params } = useRoute();
  const [root, id] = parts;
  let page;
  switch (root) {
    case undefined: page = <Home installPrompt={<InstallButton />} />; break;
    case 'cat': page = <Category id={id} />; break;
    case 'roadmap': page = <Roadmap id={id} />; break;
    case 'term': page = <Term id={id} />; break;
    case 'mock': page = <Mock key={params.toString()} params={params} />; break;
    case 'chat': page = <Chat key={params.get('q') || 'chat'} params={params} />; break;
    case 'news': page = <News />; break;
    case 'saved': page = <Saved />; break;
    default: page = <NotFound />;
  }
  const activeTab = ['cat', 'roadmap', 'term'].includes(root) ? '' : root || '';
  return (
    <>
      <main className="app">{page}</main>
      <nav className="tabbar" aria-label="Main">
        {TABS.map((t) => (
          <a key={t.label} href={'#/' + t.id} className={activeTab === t.id ? 'active' : ''} aria-current={activeTab === t.id ? 'page' : undefined}>
            <span className="tab-icon" aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
