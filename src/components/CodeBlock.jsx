// CodeBlock.jsx — shows code with comments highlighted, copy button, and a toggle to hide comments
import { useState } from 'react';

// Find where a line's comment starts (ignores comment markers inside quotes)
function splitComment(line, lang) {
  const markers = lang === 'yaml' || lang === 'bash' ? ['# '] : lang === 'css' ? ['/*'] : lang === 'html' ? ['<!--', '//'] : ['{/*', '//', '/*'];
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) { if (ch === quote && line[i - 1] !== '\\') quote = null; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    for (const m of markers) {
      if (line.startsWith(m, i) && !(m === '//' && line[i - 1] === ':')) return [line.slice(0, i), line.slice(i)];
    }
  }
  return [line, ''];
}

export default function CodeBlock({ code, lang = 'javascript', title }) {
  const [showComments, setShowComments] = useState(true);
  const [stacked, setStacked] = useState(() => typeof window !== 'undefined' && window.innerWidth < 700); // phones: comment under each line
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  return (
    <div className="code">
      <div className="code-bar">
        <span className="code-lang">{title || lang}</span>
        <div className="code-actions">
          <button className="chip" onClick={() => setShowComments((s) => !s)} aria-pressed={showComments}>
            {showComments ? 'Hide notes' : 'Show notes'}
          </button>
          {showComments && <button className="chip" onClick={() => setStacked((s) => !s)} aria-pressed={stacked}>{stacked ? 'Inline' : 'Stacked'}</button>}
          <button className="chip" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
        </div>
      </div>
      <pre className={'code-body' + (stacked && showComments ? ' stacked' : '')} tabIndex={0}>
        {lines.map((line, i) => {
          const [src, comment] = splitComment(line, lang);
          if (!showComments && !src.trim() && comment) return null;
          if (stacked && showComments) {
            const indent = (line.match(/^\s*/) || [''])[0].length;
            const codePart = src.replace(/\s+$/, '');
            return (
              <div className="code-line stack" key={i}>
                <span className="ln">{i + 1}</span>
                <span className="stack-body">
                  {codePart.trim() && <span className="src">{codePart}</span>}
                  {comment && <span className="cmt note" style={{ paddingLeft: codePart.trim() ? indent * 1.08 + 'ch' : 0 }}>{comment.trim()}</span>}
                  {!codePart.trim() && !comment && <span className="src"> </span>}
                </span>
              </div>
            );
          }
          return (
            <div className="code-line" key={i}>
              <span className="ln">{i + 1}</span>
              <span className="src">{src}</span>
              {showComments && comment && <span className="cmt">{comment}</span>}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
