// App.jsx — shell: routing, bottom tab bar, theme, install prompt
import { useEffect, useState } from 'react';
import { useRoute, useSettings, applySettings } from './lib.js';
import { Home, Category, Roadmap, Term, Revise, Saved, NotFound } from './components/Learn.jsx';
import Mock from './components/Mock.jsx';
import Chat from './components/Chat.jsx';
import News from './components/News.jsx';

const TABS = [
  { id: '', label: 'Learn', icon: '◧' },
  { id: 'mock', label: 'Mock', icon: '✎' },
  { id: 'chat', label: 'AI Mentor', icon: '✦' },
  { id: 'news', label: 'News', icon: '◎' },
  { id: 'saved', label: 'Progress', icon: '★' }
];

function InstallButton() {
  const [evt, setEvt] = useState(null);
  const [iosHint, setIosHint] = useState(false);
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
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
  const settings = useSettings();
  useEffect(() => {
    applySettings(settings);                                        // theme + font size
    if (settings.theme !== 'system') return;
    const mq = matchMedia('(prefers-color-scheme: light)');
    const on = () => applySettings(settings);                       // follow device theme changes
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [settings]);

  const [root, id] = parts;
  let page;
  switch (root) {
    case undefined: page = <Home installPrompt={<InstallButton />} />; break;
    case 'cat': page = <Category id={id} />; break;
    case 'roadmap': page = <Roadmap id={id} />; break;
    case 'term': page = <Term key={id} id={id} params={params} />; break;
    case 'revise': page = <Revise key={id} id={id || 'all'} />; break;
    case 'mock': page = <Mock key={params.toString()} params={params} />; break;
    case 'chat': page = <Chat key={params.get('q') || 'chat'} params={params} />; break;
    case 'news': page = <News />; break;
    case 'saved': page = <Saved />; break;
    default: page = <NotFound />;
  }
  const activeTab = ['cat', 'roadmap', 'term', 'revise'].includes(root) ? '' : root || '';
  return (
    <>
      <a className="skip-link" href="#main-content" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.focus(); }}>Skip to content</a>
      <main className="app" id="main-content" tabIndex={-1}>{page}</main>
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
