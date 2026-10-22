// Diagram.jsx — renders Mermaid diagrams; mermaid is lazy-loaded so the first screen stays light
import { useEffect, useRef, useState } from 'react';

let mermaidPromise;
function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(({ default: m }) => {
      m.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'strict',
        fontFamily: 'Inter, system-ui, sans-serif',
        themeVariables: {
          background: '#151923', primaryColor: '#1f2532', primaryTextColor: '#e8ecf3',
          primaryBorderColor: '#7cf2c8', lineColor: '#8a94a8', secondaryColor: '#252c3b',
          tertiaryColor: '#151923', fontSize: '14px', noteBkgColor: '#2a2414', noteTextColor: '#ffd9a0',
          actorBkg: '#1f2532', actorTextColor: '#e8ecf3', actorBorder: '#7cf2c8', signalColor: '#c8d0dd', signalTextColor: '#e8ecf3'
        },
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
        sequence: { useMaxWidth: true }
      });
      return m;
    });
  }
  return mermaidPromise;
}

let n = 0;
export default function Diagram({ code, caption }) {
  const ref = useRef(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    setErr(false);
    getMermaid()
      .then((m) => m.render('mmd' + ++n, code))
      .then(({ svg }) => { if (alive && ref.current) ref.current.innerHTML = svg; })
      .catch(() => alive && setErr(true));
    return () => { alive = false; };
  }, [code]);
  return (
    <figure className="diagram">
      {err ? <pre className="diagram-fallback">{code}</pre> : <div ref={ref} className="diagram-svg"><div className="skeleton" /></div>}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
