// Diagram.jsx — renders Mermaid diagrams (lazy-loaded) and re-renders when the theme changes
import { useEffect, useRef, useState } from 'react';
import { useSettings, resolvedTheme } from '../lib.js';

let mermaidPromise;
const getMermaid = () => (mermaidPromise ??= import('mermaid').then((m) => m.default));

const THEMES = {
  dark: {
    background: '#151923', primaryColor: '#1f2532', primaryTextColor: '#e8ecf3', primaryBorderColor: '#7cf2c8',
    lineColor: '#8a94a8', secondaryColor: '#252c3b', tertiaryColor: '#151923', noteBkgColor: '#2a2414',
    noteTextColor: '#ffd9a0', actorBkg: '#1f2532', actorTextColor: '#e8ecf3', actorBorder: '#7cf2c8',
    signalColor: '#c8d0dd', signalTextColor: '#e8ecf3', clusterBkg: '#191e2a', clusterBorder: '#2f3850',
    edgeLabelBackground: '#151923', labelBoxBkgColor: '#1f2532', labelTextColor: '#e8ecf3',
    git0: '#7cf2c8', git1: '#4dabf7', gitBranchLabel0: '#08241a', commitLabelColor: '#e8ecf3', commitLabelBackground: '#1f2532'
  },
  light: {
    background: '#ffffff', primaryColor: '#eef6ff', primaryTextColor: '#14213d', primaryBorderColor: '#2f9e77',
    lineColor: '#5c677d', secondaryColor: '#f1f3f9', tertiaryColor: '#ffffff', noteBkgColor: '#fff4dc',
    noteTextColor: '#5c3d00', actorBkg: '#eef6ff', actorTextColor: '#14213d', actorBorder: '#2f9e77',
    signalColor: '#3b4252', signalTextColor: '#14213d', clusterBkg: '#f7f9fc', clusterBorder: '#d5dbe7',
    edgeLabelBackground: '#ffffff', labelBoxBkgColor: '#eef6ff', labelTextColor: '#14213d'
  }
};

let n = 0;
let queue = Promise.resolve();                 // mermaid.render is not re-entrant: serialise renders

export default function Diagram({ code, caption }) {
  const ref = useRef(null);
  const [err, setErr] = useState(false);
  const { theme } = useSettings();
  const mode = resolvedTheme(theme);
  useEffect(() => {
    let alive = true;
    setErr(false);
    queue = queue.then(async () => {
      if (!alive) return;
      const m = await getMermaid();
      m.initialize({
        startOnLoad: false, theme: 'base', securityLevel: 'strict',
        fontFamily: 'Inter, system-ui, sans-serif',
        themeVariables: { ...THEMES[mode], fontSize: '14px' },
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
        sequence: { useMaxWidth: true }, gitGraph: { useMaxWidth: true }
      });
      try {
        const { svg } = await m.render('mmd' + ++n, code);
        if (alive && ref.current) ref.current.innerHTML = svg;
      } catch { if (alive) setErr(true); }
    });
    return () => { alive = false; };
  }, [code, mode]);
  return (
    <figure className="diagram">
      {err ? <pre className="diagram-fallback">{code}</pre> : <div ref={ref} className="diagram-svg" role="img" aria-label={caption || 'Diagram'}><div className="skeleton" /></div>}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
