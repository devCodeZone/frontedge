// React — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import react from '../terms/react.js';
const L = legacyPicker(react);

export default [
  m('1. Fundamentals',
    t('react-intro', 'What is React? Declarative UI & Components', 'B', {
      one: 'React is a JavaScript library for building user interfaces from reusable components that describe what the UI should look like for a given state.',
      ex: `Declarative: you describe the UI for the current state and React updates the DOM to match, instead of manually adding/removing nodes. UI = f(state). Components encapsulate markup, logic and styles and compose into trees.

React itself is just the rendering library (react + react-dom/react-native). Routing, data fetching and SSR come from frameworks (Next.js, React Router v7) or libraries. React 19 added Actions, Server Components support, the use() hook and the React Compiler ecosystem.`,
      pts: ['UI = f(state)', 'Component-based', 'Declarative vs imperative', 'Frameworks add routing/SSR'],
      flow: ['State changes', 'Component re-renders', 'React compares trees', 'Minimal DOM updates'],
      code: ['jsx', `import { useState } from 'react';               // hook for local state

export default function Counter() {             // a component is a function
  const [count, setCount] = useState(0);        // state: current value + setter
  return (                                      // describe UI for this state
    <button onClick={() => setCount(count + 1)}> {/* event updates state */}
      Clicked {count} times                     {/* React re-renders with the new value */}
    </button>
  );
}`],
      iq: [['Is React a library or framework?', 'A library for UI rendering; frameworks like Next.js add routing, data fetching and server rendering.'],
           ['What does declarative mean in React?', 'You describe the desired UI for a state; React figures out the DOM operations.']],
      cq: [['Mount a React app to the page.', `import { createRoot } from 'react-dom/client';  // React 18+ root API
import App from './App';
createRoot(document.getElementById('root')).render(<App />); // render into #root`]],
      err: ['Manipulating DOM directly instead of state']
    }),
    t('react-setup', 'Setting up React: Vite, frameworks & project structure', 'B', {
      one: 'Start React projects with a framework (Next.js, React Router v7) or a build tool (Vite); Create React App is deprecated.',
      ex: `react.dev recommends a framework for full apps (routing, data loading, SSR). For SPAs, widgets or learning, Vite (npm create vite@latest my-app -- --template react-ts) gives fast dev server and builds.

Typical structure: src/components, src/features (feature folders), src/hooks, src/lib (utilities, API clients), src/routes or app/, tests next to code. Use TypeScript, ESLint (react-hooks plugin) and Prettier from day one.`,
      pts: ['CRA is deprecated', 'Framework for full apps', 'Vite for SPAs and learning', 'Feature-based folders'],
      code: ['bash', `npm create vite@latest frontedge -- --template react-ts   # scaffold React + TypeScript
cd frontedge && npm install                               # install dependencies
npm run dev                                               # start dev server (HMR)
npx create-next-app@latest my-next-app                    # or a full framework (Next.js)`],
      iq: [['Why was Create React App deprecated?', 'It was slow, unmaintained and lacked routing/data/SSR solutions; Vite and frameworks replaced it.']],
      cq: [['Feature-folder structure example.', `src/
  features/terms/       # TermList.tsx, TermPage.tsx, api.ts, terms.test.tsx
  features/mock/        # mock-test feature
  components/ui/        # Button.tsx, Card.tsx (shared design system)
  hooks/                # useDebounce.ts
  lib/                  # http.ts, format.ts`]],
      err: ['Starting new projects with CRA']
    }),
    t('react-jsx', 'JSX', 'B', {
      one: 'JSX is HTML-like syntax inside JavaScript that compiles to React.createElement/jsx() calls producing React elements.',
      ex: `Rules: return one root (use fragments <>…</>), close every tag (<img />), use className and htmlFor, camelCase attributes (onClick, tabIndex), and embed expressions in { }. Statements (if, for) are not allowed inside JSX — use ternaries, && and map.

JSX escapes values by default, preventing XSS (dangerouslySetInnerHTML opts out). style takes an object: style={{ marginTop: 8 }}. JSX is optional but universal.`,
      pts: ['One root or fragment', 'className, htmlFor, camelCase', 'Expressions in {}', 'Escapes values by default'],
      flow: ['JSX source', 'Compiler (Babel/SWC/esbuild)', 'jsx() function calls', 'React element objects', 'Rendered to DOM'],
      code: ['jsx', `const user = { name: 'Riya', avatar: '/r.png', online: true };
const card = (
  <>                                                      {/* fragment: no extra DOM node */}
    <img src={user.avatar} alt={user.name} width={48} />  {/* expressions in braces, self-closing */}
    <label htmlFor="msg" className="label">Message</label> {/* htmlFor/className */}
    <input id="msg" style={{ marginTop: 8 }} />            {/* style object */}
    {user.online && <span>Online</span>}                  {/* conditional */}
  </>
);
// compiles roughly to: jsx(Fragment, { children: [jsx('img', {...}), ...] })`],
      iq: [['Why className instead of class?', 'class is a reserved word in JavaScript and JSX maps to DOM properties (className).'],
           ['Can browsers run JSX?', 'No, it must be compiled to JavaScript by a tool like Babel, SWC or esbuild.']],
      cq: [['Render a list of skills.', `<ul>{skills.map((s) => <li key={s}>{s}</li>)}</ul> {/* map + key */}`]],
      err: ['Using if inside JSX', 'Rendering 0 with {count && <X/>}']
    }),
    t('react-components-props', 'Components & Props', 'B', {
      one: 'Components are functions that receive props (read-only inputs) and return JSX; props flow one way from parent to child.',
      ex: `Name components with a capital letter. Destructure props with defaults: function Avatar({ size = 48, user }). children is a special prop for nested content, enabling composition (Card, Modal, Layout).

Props are read-only — never mutate them. Pass callbacks (onSelect) to let children notify parents. Keep components small and focused; split when a component does too many things.`,
      pts: ['Props are read-only', 'Default values via destructuring', 'children for composition', 'Callbacks flow events up'],
      flow: ['Parent owns data', 'Passes props down', 'Child renders', 'Child calls callback prop', 'Parent updates state'],
      code: ['jsx', `function Card({ title, children, footer = null }) {   // destructured props with default
  return (
    <section className="card">
      <h3>{title}</h3>                                 {/* read prop */}
      <div>{children}</div>                            {/* nested content */}
      {footer}                                         {/* optional slot */}
    </section>
  );
}
function TermCard({ term, onSave }) {
  return (
    <Card title={term.name} footer={<button onClick={() => onSave(term.id)}>Save</button>}> {/* callback prop */}
      <p>{term.oneLiner}</p>
    </Card>
  );
}`],
      iq: [['Props vs state?', 'Props are inputs passed from a parent (read-only); state is data a component owns and can update.'],
           ['How does a child send data to its parent?', 'By calling a callback function the parent passed as a prop.']],
      cq: [['Spread remaining props to a native element.', `function Input({ label, ...rest }) {      // collect the rest
  return <label>{label}<input {...rest} /></label>; // forward type, value, onChange...
}`]],
      err: ['Mutating props', 'Giant components doing everything']
    }),
    t('react-conditional-lists', 'Conditional Rendering & Rendering Lists', 'B', {
      one: 'Render UI conditionally with if/early returns, ternaries and &&; render lists with map and a stable key per item.',
      ex: `Early return for loading/error states keeps JSX clean. Use ternary for either/or, && for show/hide (careful: {0 && <X />} renders "0" — use a boolean: {count > 0 && …}). Returning null renders nothing.

Lists: items.map(item => <Row key={item.id} …/>). Keys must be stable and unique among siblings (database IDs), not array index when items can reorder. Filtering and sorting happen before map.`,
      pts: ['Early returns for states', 'Beware {0 && ...}', 'Stable unique keys', 'null renders nothing'],
      code: ['jsx', `function TermList({ status, terms, query }) {
  if (status === 'loading') return <p>Loading…</p>;        // early return
  if (status === 'error') return <p role="alert">Failed</p>;
  const visible = terms.filter((t) => t.name.toLowerCase().includes(query)); // derive first
  return (
    <>
      {visible.length > 0 ? (                                 // ternary either/or
        <ul>{visible.map((t) => <li key={t.id}>{t.name}</li>)}</ul> // key = stable id
      ) : (
        <p>No results</p>
      )}
      {terms.length > 50 && <small>Showing many terms</small>} {/* boolean condition */}
    </>
  );
}`],
      iq: [['Why does {items.length && <List />} sometimes show 0?', '&& returns the left operand when falsy; 0 is rendered by React. Use items.length > 0.']],
      cq: [['Render grouped list with headings.', `{Object.entries(groupBy(terms, (t) => t.module)).map(([mod, list]) => (
  <section key={mod}><h3>{mod}</h3><ul>{list.map((t) => <li key={t.id}>{t.name}</li>)}</ul></section>
))}`]],
      err: ['Index as key on dynamic lists']
    }),
    t('react-events', 'Handling Events (synthetic events)', 'B', {
      one: 'React event handlers are camelCase props (onClick, onChange, onSubmit) receiving a SyntheticEvent that wraps the native event consistently.',
      ex: `Pass a function, not a call: onClick={handleClick} or onClick={() => remove(id)}. Call e.preventDefault() explicitly (returning false does nothing). React attaches listeners at the root container (delegation).

onChange on inputs fires on every keystroke (like native input). Use e.currentTarget for the element the handler is attached to. Capture phase: onClickCapture.`,
      pts: ['Pass function references', 'preventDefault explicitly', 'onChange fires per keystroke', 'Root-level delegation'],
      code: ['jsx', `function Composer({ onSend }) {
  function handleSubmit(e) {                    // receives SyntheticEvent
    e.preventDefault();                         // stop page reload
    const text = new FormData(e.currentTarget).get('msg'); // read form
    onSend(text);                               // notify parent
    e.currentTarget.reset();                    // clear the form
  }
  return (
    <form onSubmit={handleSubmit}>              {/* function reference, not a call */}
      <input name="msg" onKeyDown={(e) => e.key === 'Escape' && e.currentTarget.blur()} /> {/* inline arrow */}
      <button type="submit">Send</button>
    </form>
  );
}`],
      iq: [['What is a SyntheticEvent?', 'React’s cross-browser wrapper around native events with the same interface; e.nativeEvent gives the original.'],
           ['Why onClick={handle} not onClick={handle()}?', 'handle() calls it during render and passes its return value instead of the function.']],
      cq: [['Pass an argument to a handler.', `{items.map((it) => <button key={it.id} onClick={() => remove(it.id)}>Delete</button>)} {/* arrow captures id */}`]],
      err: ['onClick={fn()} executing during render']
    }),
    t('react-forms', 'Forms: Controlled vs Uncontrolled Inputs', 'B', {
      one: 'Controlled inputs keep their value in React state (value + onChange); uncontrolled inputs keep it in the DOM, read via refs or FormData.',
      ex: `Controlled: single source of truth, instant validation and formatting, but re-renders on every keystroke. Uncontrolled: defaultValue + ref/FormData on submit — less code and great with React 19 form Actions.

Don't switch an input between controlled and uncontrolled (value undefined → string triggers a warning). For complex forms use React Hook Form + Zod.`,
      pts: ['Controlled: value + onChange', 'Uncontrolled: defaultValue + FormData/ref', 'Never switch modes', 'Libraries for complex forms'],
      code: ['jsx', `function Controlled() {
  const [email, setEmail] = useState('');               // value lives in state
  const valid = email.includes('@');                    // derived validation
  return (
    <>
      <input value={email} onChange={(e) => setEmail(e.target.value)} /> {/* controlled */}
      {!valid && email && <small>Enter a valid email</small>}             {/* live feedback */}
    </>
  );
}
function Uncontrolled() {
  function onSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)); // read DOM values on submit
    console.log(data);
  }
  return <form onSubmit={onSubmit}><input name="email" defaultValue="" /><button>Save</button></form>;
}`],
      iq: [['Controlled vs uncontrolled?', 'Controlled inputs derive their value from React state; uncontrolled inputs store it in the DOM and are read when needed.']],
      cq: [['Single handler for many fields.', `const [form, setForm] = useState({ name: '', city: '' });
const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value })); // computed key
<input name="city" value={form.city} onChange={onChange} />`]],
      err: ['value without onChange (read-only input warning)']
    }),
    t('react-styling', 'Styling in React', 'B', {
      one: 'Options for styling React: plain CSS/className, CSS Modules, Tailwind, CSS-in-JS (styled-components/Emotion), zero-runtime CSS-in-JS and inline styles.',
      ex: `CSS Modules and Tailwind are the most common in modern apps. Inline style objects are fine for dynamic values but lack pseudo-classes and media queries. Runtime CSS-in-JS has performance costs and friction with Server Components. Use clsx/cn to compose conditional classes; CSS variables for dynamic theming.`,
      pts: ['className + CSS Modules', 'Tailwind utilities', 'Inline style for dynamic values', 'clsx for conditional classes'],
      code: ['jsx', `import styles from './Badge.module.css';           // scoped CSS
import clsx from 'clsx';                           // conditional class helper
export function Badge({ level, progress }) {
  return (
    <span
      className={clsx(styles.badge, level === 'Advanced' && styles.hard)} // merge classes
      style={{ '--progress': progress + '%' }}      // dynamic value via CSS variable
    >
      {level}
    </span>
  );
}`],
      iq: [['Pros and cons of inline styles in React?', 'Easy dynamic values, but no pseudo-classes/media queries, harder overrides and no caching.']],
      cq: [['Theme switch with CSS variables.', `<div data-theme={dark ? 'dark' : 'light'}>{children}</div> {/* CSS: [data-theme=dark]{ --bg: #111 } */}`]],
      err: ['Huge inline style objects recreated every render']
    }),
    t('react-composition', 'Composition, children & Lifting State Up', 'B', {
      one: 'React favours composition: build complex UIs by nesting components and passing children/slots; share state by lifting it to the closest common parent.',
      ex: `When two siblings need the same data, move the state to their parent and pass it down with callbacks — "lifting state up". Avoid prop drilling through many layers by restructuring (passing components as children) or using Context.

Patterns: slots via props (header={…}), children functions, layout components. React docs: "Thinking in React" — break UI into a hierarchy, find minimal state, decide where it lives.`,
      pts: ['Composition over inheritance', 'Lift shared state to the common parent', 'Pass JSX as props (slots)', 'Thinking in React steps'],
      flow: ['Two siblings need same data', 'Move state to parent', 'Pass value down as props', 'Pass setter callback down'],
      code: ['jsx', `function FilterableTerms({ terms }) {
  const [query, setQuery] = useState('');                 // lifted to the common parent
  return (
    <>
      <SearchBar value={query} onChange={setQuery} />     {/* sibling 1 writes */}
      <TermList terms={terms} query={query} />            {/* sibling 2 reads */}
    </>
  );
}
function SearchBar({ value, onChange }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} />;
}
function TermList({ terms, query }) {
  return <ul>{terms.filter((t) => t.name.includes(query)).map((t) => <li key={t.id}>{t.name}</li>)}</ul>;
}`],
      iq: [['What is prop drilling and how do you avoid it?', 'Passing props through many intermediate components that do not use them; avoid with composition (children), Context or a store.'],
           ['What is lifting state up?', 'Moving state to the nearest common ancestor so multiple components can share and stay in sync.']],
      cq: [['Layout with named slots.', `function Layout({ sidebar, children }) {   // slot props
  return <div className="grid"><aside>{sidebar}</aside><main>{children}</main></div>;
}
<Layout sidebar={<Nav />}><Page /></Layout>`]],
      err: ['Duplicating the same state in siblings']
    })
  ),
  m('2. Hooks',
    L('react-hooks-core'),
    t('react-useref', 'useRef: DOM refs & mutable values', 'B', {
      one: 'useRef returns a mutable object { current } that persists across renders without causing re-renders — used for DOM access and instance-like values.',
      ex: `Attach to elements (ref={inputRef}) to focus, measure or scroll. Store values that should not trigger re-render: timer IDs, previous values, latest callback, AbortControllers.

Do not read/write ref.current during render (except lazy init) — it makes rendering impure. In React 19, ref is a regular prop on function components (forwardRef no longer needed), and ref callbacks can return a cleanup function.`,
      pts: ['ref.current persists, no re-render', 'DOM access: focus, measure, scroll', 'Store timer IDs / previous values', 'React 19: ref as a prop'],
      code: ['jsx', `import { useEffect, useRef, useState } from 'react';
function SearchBox() {
  const inputRef = useRef(null);                 // will point to the <input>
  const timer = useRef();                        // holds a timer id across renders
  const [q, setQ] = useState('');
  useEffect(() => { inputRef.current.focus(); }, []); // focus after mount
  function onChange(e) {
    setQ(e.target.value);
    clearTimeout(timer.current);                 // reset debounce timer
    timer.current = setTimeout(() => console.log('search', e.target.value), 300); // no re-render
  }
  return <input ref={inputRef} value={q} onChange={onChange} />;
}
function MyInput({ ref, ...props }) {            // React 19: ref is just a prop
  return <input ref={ref} {...props} />;
}`],
      iq: [['useRef vs useState?', 'Changing a ref does not re-render; changing state does. Use refs for values not shown in UI.'],
           ['Why not read ref.current in render?', 'Refs are mutable and not tracked; reading them during render makes output unpredictable.']],
      cq: [['usePrevious hook.', `function usePrevious(value) {
  const ref = useRef();                   // stores last committed value
  useEffect(() => { ref.current = value; }); // update after each render
  return ref.current;                     // value from the previous render
}`]],
      err: ['Using refs for data that should display in UI']
    }),
    t('react-usecontext', 'useContext & the Context API', 'I', {
      one: 'Context passes a value deep into the tree without prop drilling: createContext, a Provider (or <Context> in React 19) and useContext to read it.',
      ex: `Good for theme, locale, authenticated user, feature flags and dependency injection. Every consumer re-renders when the provider value changes, so memoise the value object and split contexts by concern (state vs dispatch).

Context is not a state manager by itself — pair with useState/useReducer. For frequently changing global state with many consumers, prefer a selector-based store (Zustand, Redux).`,
      pts: ['Avoids prop drilling', 'All consumers re-render on value change', 'Memoise the value', 'Split contexts by concern'],
      flow: ['createContext(default)', 'Provider wraps tree with value', 'Child calls useContext', 'Value changes → consumers re-render'],
      code: ['jsx', `import { createContext, useContext, useMemo, useState } from 'react';
const ThemeContext = createContext(null);                  // default when no provider
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }), [theme]); // stable object
  return <ThemeContext value={value}>{children}</ThemeContext>; // React 19 (<ThemeContext.Provider> before)
}
export function useTheme() {                                // custom hook with a guard
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
function ThemeButton() { const { theme, toggle } = useTheme(); return <button onClick={toggle}>{theme}</button>; }`],
      iq: [['Does Context replace Redux?', 'For low-frequency global values yes; for complex, frequently updated state with many consumers, a store with selectors scales better.'],
           ['Why memoise the context value?', 'A new object each render changes identity and re-renders all consumers even if data did not change.']],
      cq: [['Split state and dispatch contexts.', `const CountState = createContext(0); const CountDispatch = createContext(() => {});
// components that only dispatch won't re-render when the count changes`]],
      err: ['One giant context for everything']
    }),
    t('react-usereducer', 'useReducer', 'I', {
      one: 'useReducer manages state with a reducer function (state, action) => newState — useful for complex state transitions and related values.',
      ex: `Prefer it when the next state depends on the previous in several ways, when many values change together, or when you want testable pure update logic (same pattern as Redux). dispatch is stable, so it is safe to pass down or use in effects.

Combine with Context for app-level state without libraries. Reducers must be pure and return new objects.`,
      pts: ['Pure reducer function', 'dispatch is stable', 'Great for state machines', 'Pairs well with Context'],
      flow: ['Event calls dispatch(action)', 'Reducer computes new state', 'React re-renders with it'],
      code: ['jsx', `const initial = { items: [], status: 'idle' };
function cartReducer(state, action) {                 // pure function
  switch (action.type) {
    case 'add': return { ...state, items: [...state.items, action.item] };
    case 'remove': return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'checkout': return { ...state, status: 'paying' };
    default: throw new Error('Unknown action ' + action.type); // catch typos
  }
}
function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initial);  // state + dispatcher
  return <button onClick={() => dispatch({ type: 'add', item: { id: Date.now() } })}>Add ({state.items.length})</button>;
}`],
      iq: [['useState vs useReducer?', 'useState for simple independent values; useReducer for complex/related state with many transitions.']],
      cq: [['Lazy initial state from localStorage.', `const [state, dispatch] = useReducer(reducer, null, () => JSON.parse(localStorage.getItem('cart') || '{"items":[]}')); // init fn runs once`]],
      err: ['Mutating state inside the reducer']
    }),
    L('react-memo'),
    t('react-custom-hooks', 'Custom Hooks', 'I', {
      one: 'Custom hooks are functions starting with "use" that reuse stateful logic (state, effects, refs) across components.',
      ex: `They share logic, not state — each component calling the hook gets its own state. Good candidates: useDebounce, useLocalStorage, useMediaQuery, useOnlineStatus, useFetch, useIntersection, useEventListener.

Follow the rules of hooks inside them, return what callers need (values, setters, objects), and keep them focused. Prefer useSyncExternalStore for subscribing to external sources.`,
      pts: ['Name starts with use', 'Share logic, not state', 'Follow rules of hooks', 'Return a clear API'],
      code: ['jsx', `import { useEffect, useState } from 'react';
export function useMediaQuery(query) {                 // reusable logic
  const [matches, setMatches] = useState(() => matchMedia(query).matches); // initial value
  useEffect(() => {
    const mq = matchMedia(query);                       // subscribe
    const onChange = () => setMatches(mq.matches);      // update state
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange); // cleanup
  }, [query]);
  return matches;                                       // boolean result
}
function Layout() {
  const isMobile = useMediaQuery('(max-width: 700px)'); // each caller has own state
  return isMobile ? <MobileNav /> : <Sidebar />;
}`],
      iq: [['Do two components using the same custom hook share state?', 'No; each call has independent state. To share, lift state or use context/store.']],
      cq: [['useOnlineStatus with useSyncExternalStore.', `const subscribe = (cb) => { addEventListener('online', cb); addEventListener('offline', cb);
  return () => { removeEventListener('online', cb); removeEventListener('offline', cb); }; };
export const useOnlineStatus = () => useSyncExternalStore(subscribe, () => navigator.onLine, () => true); // client, server snapshot`]],
      err: ['Calling hooks conditionally inside custom hooks']
    }),
    t('react-uselayouteffect-useid-sync', 'useLayoutEffect, useId, useSyncExternalStore & useImperativeHandle', 'A', {
      one: 'Specialised hooks: useLayoutEffect (measure before paint), useId (stable unique IDs), useSyncExternalStore (subscribe to external stores) and useImperativeHandle (expose methods via ref).',
      ex: `useLayoutEffect runs synchronously after DOM mutations but before paint — use it only to measure layout (tooltip positions) and avoid flicker; it blocks painting. useId generates IDs that match between server and client for label/aria associations (not for list keys).

useSyncExternalStore safely subscribes to stores outside React (Redux, browser APIs) without tearing in concurrent rendering. useImperativeHandle customises what a parent gets through a ref (e.g. focus(), scrollToTop()).`,
      pts: ['useLayoutEffect = measure before paint', 'useId for accessibility attributes', 'useSyncExternalStore for external stores', 'useImperativeHandle exposes limited methods'],
      code: ['jsx', `function Field({ label }) {
  const id = useId();                                  // e.g. ":r1:" — SSR-safe
  return <><label htmlFor={id}>{label}</label><input id={id} aria-describedby={id + '-hint'} /></>;
}
function Tooltip({ anchorRect, children }) {
  const ref = useRef(null);
  const [top, setTop] = useState(0);
  useLayoutEffect(() => {                              // runs before paint
    const h = ref.current.getBoundingClientRect().height; // measure
    setTop(anchorRect.top - h - 8);                    // position above anchor, no flicker
  }, [anchorRect]);
  return <div ref={ref} style={{ position: 'fixed', top }}>{children}</div>;
}
function VideoPlayer({ ref }) {
  const v = useRef(null);
  useImperativeHandle(ref, () => ({ play: () => v.current.play() })); // only expose play()
  return <video ref={v} src="/intro.mp4" />;
}`],
      iq: [['When use useLayoutEffect over useEffect?', 'When you must read layout and synchronously update before the user sees the frame, to avoid visible flicker.'],
           ['Can useId be used for list keys?', 'No — keys should come from your data.']],
      cq: [['Window width with useSyncExternalStore.', `const subscribe = (cb) => { window.addEventListener('resize', cb); return () => window.removeEventListener('resize', cb); };
const useWidth = () => useSyncExternalStore(subscribe, () => window.innerWidth, () => 1024); // server fallback`]],
      err: ['Using useLayoutEffect for data fetching']
    }),
    t('react-rules-of-hooks', 'Rules of Hooks & Purity Rules', 'B', {
      one: 'Hooks must be called at the top level of React functions in the same order every render; components and hooks must be pure during render.',
      ex: `Never call hooks inside conditions, loops, nested functions or after early returns — React tracks hook state by call order. Only call hooks from components or custom hooks. eslint-plugin-react-hooks enforces this and checks effect dependencies.

Rules of React (needed for the React Compiler): render must be pure, props/state are immutable snapshots, don't mutate values after passing them to JSX, side effects go in event handlers or effects.`,
      pts: ['Top level only, same order', 'Only in components/custom hooks', 'Render must be pure', 'Lint with react-hooks plugin'],
      code: ['jsx', `function Profile({ userId }) {
  // ❌ if (!userId) return null; then useState(...)  → hook order changes between renders
  const [tab, setTab] = useState('info');      // ✅ hooks first
  const user = useUser(userId);                // ✅ custom hook at top level
  if (!userId) return null;                    // ✅ early return AFTER hooks
  return <h2 onClick={() => setTab('posts')}>{user.name} — {tab}</h2>;
}`],
      iq: [['Why must hooks be called in the same order?', 'React stores hook state in a list per component and matches each call by position.']],
      cq: [['Conditional effect done correctly.', `useEffect(() => {
  if (!enabled) return;                 // condition INSIDE the hook
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, [enabled]);`]],
      err: ['Hooks after an early return', 'Disabling the exhaustive-deps lint rule']
    }),
    t('react-effects-guide', 'You Might Not Need an Effect (effect best practices)', 'I', {
      one: 'Effects are for synchronising with external systems; derived data, event-driven logic and state resets should not use useEffect.',
      ex: `Anti-patterns: computing filtered lists in an effect (compute during render instead), resetting state when a prop changes (use a key), handling a button's result in an effect (do it in the event handler), chains of effects setting state (compute in one place), fetching in effects without cleanup (race conditions).

Good uses: subscriptions, timers, non-React widgets, analytics on mount, syncing to localStorage. Always include all dependencies and write cleanups.`,
      pts: ['Derive during render', 'Event logic in handlers', 'Reset with key', 'Effects only for external sync'],
      dia: `flowchart TD
  Q{"Why does this code run?"} -->|"Because user did something"| H["Put it in the event handler"]
  Q -->|"Because the component is shown and must sync with something external"| E["useEffect + cleanup"]
  Q -->|"It computes a value from props/state"| R["Calculate during render (useMemo if expensive)"]`,
      code: ['jsx', `function TodoList({ todos, filter }) {
  // ❌ const [visible, setVisible] = useState([]);
  // ❌ useEffect(() => setVisible(todos.filter(...)), [todos, filter]); // extra render + bug-prone
  const visible = todos.filter((t) => (filter === 'done' ? t.done : true)); // ✅ derive during render
  return <ul>{visible.map((t) => <li key={t.id}>{t.text}</li>)}</ul>;
}
function BuyButton({ product }) {
  async function handleClick() {                   // ✅ side effect caused by a click lives here
    await addToCart(product.id);
    showToast('Added to cart');
  }
  return <button onClick={handleClick}>Buy</button>;
}`],
      iq: [['Give three cases where you should not use useEffect.', 'Deriving data from props/state, handling user events, and resetting state on prop change (use key).']],
      cq: [['Reset form state when switching user.', `<EditProfile key={userId} userId={userId} />  // new key → fresh component state`]],
      err: ['Effect chains that set state repeatedly']
    })
  ),
  m('3. Rendering & Architecture',
    L('react-reconciliation'),
    t('react-lifecycle-class', 'Component Lifecycle & Class Components', 'I', {
      one: 'Components mount, update and unmount; class components expose lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount) that map to effects in function components.',
      ex: `Mounting: constructor → render → componentDidMount. Updating: render → componentDidUpdate(prevProps). Unmounting: componentWillUnmount. Error boundaries still require classes (componentDidCatch/getDerivedStateFromError).

Function equivalents: useEffect(() => {…}, []) ≈ didMount + cleanup ≈ willUnmount; effect with deps ≈ didUpdate for those deps. Legacy code uses setState (merges objects), this.props and bound methods.`,
      pts: ['Mount → update → unmount', 'useEffect maps to lifecycle methods', 'Error boundaries need classes', 'Recognise class syntax in legacy code'],
      flow: ['Mount: render then didMount', 'Update: render then didUpdate', 'Unmount: willUnmount cleanup'],
      code: ['jsx', `class Clock extends React.Component {
  state = { now: new Date() };                       // class field state
  componentDidMount() {                              // after first render
    this.id = setInterval(() => this.setState({ now: new Date() }), 1000); // setState merges
  }
  componentDidUpdate(prevProps) {                    // after updates
    if (prevProps.tz !== this.props.tz) console.log('timezone changed');
  }
  componentWillUnmount() { clearInterval(this.id); } // cleanup
  render() { return <p>{this.state.now.toLocaleTimeString()}</p>; }
}
// Function equivalent:
// useEffect(() => { const id = setInterval(...); return () => clearInterval(id); }, []);`],
      iq: [['How do you replicate componentWillUnmount with hooks?', 'Return a cleanup function from useEffect.'],
           ['What still requires class components?', 'Error boundaries (getDerivedStateFromError/componentDidCatch).']],
      cq: [['Convert componentDidUpdate on userId to hooks.', `useEffect(() => { loadUser(userId); }, [userId]); // runs when userId changes`]],
      err: ['Missing cleanup for subscriptions']
    }),
    t('react-error-boundaries', 'Error Boundaries', 'I', {
      one: 'Error boundaries are class components that catch rendering errors in their child tree and show a fallback UI instead of crashing the whole app.',
      ex: `They catch errors during render, lifecycle methods and constructors of children — not in event handlers, async code (setTimeout, promises) or the boundary itself. Use getDerivedStateFromError to show fallback and componentDidCatch to log (Sentry).

Place them around routes/widgets so one failure does not blank the page. react-error-boundary provides a ready hook-friendly component with reset. React 19 adds onCaughtError/onUncaughtError root options.`,
      pts: ['Catch render-time errors in children', 'Not event handlers or async', 'Place around routes and widgets', 'Log in componentDidCatch'],
      code: ['jsx', `class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {         // switch to fallback UI
    return { error };
  }
  componentDidCatch(error, info) {                 // side effect: report it
    reportError(error, info.componentStack);
  }
  render() {
    if (this.state.error) return (
      <div role="alert">Something went wrong. <button onClick={() => this.setState({ error: null })}>Retry</button></div>
    );
    return this.props.children;                    // normal rendering
  }
}
// <ErrorBoundary><Dashboard /></ErrorBoundary>`],
      iq: [['Which errors are not caught by error boundaries?', 'Errors in event handlers, async callbacks, server-side rendering and the boundary component itself.']],
      cq: [['Show errors from an event handler in the boundary.', `const [, setState] = useState();
const onClick = async () => { try { await save(); } catch (e) { setState(() => { throw e; }); } }; // rethrow during render`]],
      err: ['One boundary at the root only']
    }),
    t('react-portals-fragments', 'Portals, Fragments & StrictMode', 'I', {
      one: 'Portals render children into a different DOM node (modals, tooltips); Fragments group elements without extra DOM; StrictMode surfaces bugs in development.',
      ex: `createPortal(jsx, document.body) escapes overflow:hidden and stacking contexts while keeping React context and event bubbling through the React tree. Fragments (<>…</> or <Fragment key>) avoid wrapper divs that break CSS layouts (tables, flex).

StrictMode double-invokes render and effects in development to reveal impure renders and missing cleanups; it has no production effect.`,
      pts: ['Portal: different DOM parent, same React tree', 'Events bubble through React tree', 'Fragments avoid wrapper divs', 'StrictMode is dev-only'],
      code: ['jsx', `import { createPortal } from 'react-dom';
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return createPortal(                                 // render outside the parent DOM
    <div className="backdrop" onClick={onClose}>
      <div role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>,
    document.body                                      // target container
  );
}
function Rows({ items }) {
  return items.map((it) => (
    <Fragment key={it.id}><dt>{it.term}</dt><dd>{it.desc}</dd></Fragment> // keyed fragment
  ));
}`],
      iq: [['Do events from a portal bubble to React parents?', 'Yes — they bubble through the React component tree, not the DOM tree.']],
      cq: [['When do you need <Fragment key> instead of <>?', `// When mapping lists that return multiple sibling elements per item (dt + dd).`]],
      err: ['Building modals without focus management (prefer <dialog>)']
    }),
    t('react-suspense-lazy', 'Suspense, lazy & Code Splitting', 'I', {
      one: 'React.lazy loads components on demand and <Suspense> shows a fallback while lazy code or data (via use()/frameworks) is loading.',
      ex: `const Chart = lazy(() => import('./Chart')) creates a separate chunk. Wrap with <Suspense fallback={<Spinner/>}>. Place boundaries thoughtfully: too high hides the whole page; too many cause "popcorn" loading.

Suspense also coordinates data fetching in frameworks and with the use() hook, and enables streaming SSR: the server sends HTML for ready parts and streams the rest. Transitions keep showing old UI instead of fallbacks for updates.`,
      pts: ['lazy + dynamic import = separate chunk', 'Suspense fallback while loading', 'Works with data via use()/frameworks', 'Streaming SSR boundaries'],
      flow: ['Component suspends', 'Nearest Suspense shows fallback', 'Code or data resolves', 'Real content renders'],
      code: ['jsx', `import { lazy, Suspense } from 'react';
const Admin = lazy(() => import('./Admin'));          // separate JS chunk
const Reports = lazy(() => import('./Reports'));
export function App({ route }) {
  return (
    <Suspense fallback={<p>Loading page…</p>}>         {/* shown while chunks download */}
      {route === 'admin' ? <Admin /> : <Reports />}
    </Suspense>
  );
}`],
      iq: [['What does Suspense do?', 'Shows a fallback while descendants are waiting for code or data, then reveals them when ready.']],
      cq: [['Preload a lazy route on hover.', `const loadAdmin = () => import('./Admin');            // same import function
const Admin = lazy(loadAdmin);
<a href="/admin" onMouseEnter={loadAdmin}>Admin</a>   // start download early`]],
      err: ['Single Suspense boundary at the root causing full-page spinners']
    }),
    t('react-concurrent', 'Concurrent Rendering: useTransition & useDeferredValue', 'A', {
      one: 'Concurrent features let React prepare multiple UI versions and keep the app responsive: useTransition marks updates as non-urgent; useDeferredValue lags a value behind.',
      ex: `Urgent updates (typing) should render immediately; heavy updates (filtering 10,000 rows, switching tabs) can be interrupted. startTransition(() => setTab('reports')) keeps the current UI interactive and gives isPending for a subtle indicator.

useDeferredValue(query) returns a "lagging" copy so the input updates instantly while the expensive list re-renders with the deferred value. Transitions also avoid Suspense fallbacks replacing visible content. React 19 supports async functions in startTransition (Actions).`,
      pts: ['Urgent vs non-urgent updates', 'startTransition + isPending', 'useDeferredValue for expensive children', 'Keeps old UI instead of fallback'],
      code: ['jsx', `import { useDeferredValue, useState, useTransition, memo } from 'react';
function Search({ terms }) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);            // lags behind during typing
  const stale = query !== deferred;                     // true while catching up
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} /> {/* always instant */}
      <div style={{ opacity: stale ? 0.6 : 1 }}><Results terms={terms} query={deferred} /></div>
    </>
  );
}
const Results = memo(function Results({ terms, query }) {    // memo so it re-renders only for deferred value
  return <ul>{terms.filter((t) => t.name.includes(query)).map((t) => <li key={t.id}>{t.name}</li>)}</ul>;
});
function Tabs() {
  const [tab, setTab] = useState('learn');
  const [isPending, startTransition] = useTransition();
  return <button onClick={() => startTransition(() => setTab('reports'))}>{isPending ? 'Loading…' : 'Reports'}</button>;
}`],
      iq: [['useTransition vs useDeferredValue?', 'useTransition wraps the state update you control; useDeferredValue defers a value you receive (e.g. a prop) when you cannot wrap its update.'],
           ['Does useTransition debounce?', 'No; it renders the update at lower priority and can interrupt it, but doesn’t delay by time.']],
      cq: [['Avoid fallback flash when switching tabs with Suspense.', `startTransition(() => setTab(next)); // React keeps showing the old tab until the new one is ready`]],
      err: ['Wrapping text input state in a transition (input lags)']
    }),
    t('react-patterns', 'Component Patterns: HOC, Render Props, Compound Components, Headless', 'A', {
      one: 'Reusable composition patterns: higher-order components, render props, compound components, controlled props and headless components (logic without UI).',
      ex: `HOC: a function taking a component and returning an enhanced one (withAuth(Page)) — mostly replaced by hooks. Render props: a function child decides rendering (<DataLoader>{data => …}</DataLoader>). Compound components share implicit state via context (<Tabs><Tabs.List/><Tabs.Panel/></Tabs>) — used by Radix, Reach, Headless UI.

Headless libraries (TanStack Table, Downshift, Radix primitives) provide behaviour and accessibility while you control markup and styles. Controlled/uncontrolled props give flexibility (value + onChange or defaultValue).`,
      pts: ['HOCs mostly replaced by hooks', 'Render props for flexible rendering', 'Compound components via context', 'Headless = logic + a11y, your UI'],
      code: ['jsx', `const TabsCtx = createContext(null);
function Tabs({ defaultValue, children }) {                 // compound root holds state
  const [value, setValue] = useState(defaultValue);
  return <TabsCtx value={{ value, setValue }}>{children}</TabsCtx>;
}
Tabs.Tab = function Tab({ value, children }) {               // reads shared state
  const ctx = useContext(TabsCtx);
  return <button role="tab" aria-selected={ctx.value === value} onClick={() => ctx.setValue(value)}>{children}</button>;
};
Tabs.Panel = function Panel({ value, children }) {
  return useContext(TabsCtx).value === value ? <div role="tabpanel">{children}</div> : null;
};
// <Tabs defaultValue="code"><Tabs.Tab value="code">Code</Tabs.Tab><Tabs.Panel value="code">…</Tabs.Panel></Tabs>`],
      iq: [['Why did hooks replace many HOCs?', 'Hooks share logic without wrapper nesting ("wrapper hell"), prop name collisions or indirection.'],
           ['What is a headless component?', 'A component/hook providing state, behaviour and accessibility without imposing markup or styles.']],
      cq: [['Simple HOC adding a loading state.', `const withLoading = (Comp) => ({ loading, ...props }) =>  // returns a new component
  loading ? <p>Loading…</p> : <Comp {...props} />;          // wrap behaviour`]],
      err: ['Deep HOC chains']
    }),
    t('react-performance', 'React Performance Optimisation', 'A', {
      one: 'Make React apps fast by measuring with the Profiler, avoiding unnecessary renders, virtualising long lists, splitting code and keeping state close to where it is used.',
      ex: `Measure first (React DevTools Profiler, "Highlight updates", Performance panel). Common wins: move state down (colocation) so fewer components re-render; pass children to avoid re-rendering static subtrees; memoise expensive computations and children (or rely on React Compiler); virtualise long lists (TanStack Virtual, react-window); debounce/defer heavy updates; lazy-load routes and heavy widgets; avoid creating new objects in context values; use stable keys.

Server Components and SSR reduce client JS. Watch bundle size and INP.`,
      pts: ['Profile before optimising', 'Colocate state', 'Virtualise long lists', 'Code-split heavy parts'],
      flow: ['Measure with Profiler', 'Find wasted renders or slow components', 'Apply targeted fix', 'Measure again'],
      code: ['jsx', `import { useVirtualizer } from '@tanstack/react-virtual';   // render only visible rows
function BigList({ rows }) {
  const parentRef = useRef(null);
  const v = useVirtualizer({ count: rows.length, getScrollElement: () => parentRef.current, estimateSize: () => 48 }); // 48px rows
  return (
    <div ref={parentRef} style={{ height: 500, overflow: 'auto' }}>          {/* scroll container */}
      <div style={{ height: v.getTotalSize(), position: 'relative' }}>       {/* full height spacer */}
        {v.getVirtualItems().map((item) => (                                 /* ~15 visible items */
          <div key={item.key} style={{ position: 'absolute', top: item.start, height: 48 }}>{rows[item.index].name}</div>
        ))}
      </div>
    </div>
  );
}`],
      iq: [['What causes a component to re-render?', 'Its state changes, its parent re-renders, or a context it uses changes.'],
           ['How do you render 10,000 rows efficiently?', 'Virtualisation: render only the visible window of rows.']],
      cq: [['Avoid re-rendering static children when parent state changes.', `function ScrollTracker({ children }) {      // state lives here
  const [y, setY] = useState(0);
  return <div onScroll={(e) => setY(e.currentTarget.scrollTop)}>{children}</div>; // children element is created by the parent → not re-rendered
}`]],
      err: ['Premature memo everywhere', 'Global state for local UI']
    }),
    t('react-ssr-hydration', 'SSR, Hydration & Hydration Errors', 'A', {
      one: 'Server-side rendering produces HTML on the server for fast first paint and SEO; hydration attaches React to that HTML in the browser.',
      ex: `Flow: server renders components to HTML (renderToPipeableStream/streaming), browser shows it immediately, JS loads, hydrateRoot reuses DOM and attaches listeners. Selective hydration hydrates Suspense boundaries independently and prioritises what the user interacts with.

Hydration mismatches happen when server and client render differently: Date.now(), Math.random(), window checks, locale formatting, invalid HTML nesting, browser extensions. Fix with consistent data, useEffect for client-only values, or suppressHydrationWarning for unavoidable text (timestamps).`,
      pts: ['SSR → HTML first, then hydrate', 'Mismatches from non-deterministic render', 'Client-only values in useEffect', 'Selective hydration with Suspense'],
      flow: ['Server renders HTML', 'Browser paints HTML', 'JS bundle loads', 'hydrateRoot attaches events', 'App interactive'],
      code: ['jsx', `function LocalTime() {
  const [time, setTime] = useState(null);           // same on server and first client render
  useEffect(() => { setTime(new Date().toLocaleTimeString()); }, []); // client-only value after hydration
  return <span>{time ?? '--:--'}</span>;
}
// Client entry:
// import { hydrateRoot } from 'react-dom/client';
// hydrateRoot(document.getElementById('root'), <App />);  // reuse server HTML`],
      iq: [['What is a hydration mismatch?', 'The client’s first render differs from the server HTML, so React must patch or re-render, causing warnings and visual jumps.'],
           ['SSR vs CSR trade-offs?', 'SSR: faster first paint/SEO but server cost and hydration time; CSR: simple hosting but slower first content.']],
      cq: [['Render a component only on the client.', `function ClientOnly({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);            // true only after hydration
  return mounted ? children : null;
}`]],
      err: ['Reading window/localStorage during render in SSR']
    })
  ),
  m('4. React 19 & Server Components',
    t('react-19-whats-new', 'What’s New in React 19', 'I', {
      one: 'React 19 introduced Actions (useActionState, useOptimistic, useFormStatus), the use() hook, ref as a prop, <Context> as provider, document metadata, resource preloading, and stable Server Components support.',
      ex: `Highlights: async transitions (Actions) with automatic pending state; <form action={fn}>; use(promise|context); ref is a normal prop on function components (forwardRef unnecessary) and ref callbacks can return cleanups; <title>, <meta>, <link> rendered anywhere are hoisted to <head>; stylesheet precedence and async scripts deduplicated; preload/preinit APIs; better hydration error messages; custom elements support.

React 19.x and the React Compiler (stable 2025) make automatic memoisation mainstream; React Labs work includes <ViewTransition> and Activity (offscreen).`,
      pts: ['Actions + form action', 'use() hook', 'ref as prop, Context as provider', 'Metadata in components'],
      code: ['jsx', `import { use } from 'react';
function Post({ postPromise }) {
  const post = use(postPromise);                    // suspends until resolved
  return (
    <article>
      <title>{post.title}</title>                   {/* hoisted into <head> */}
      <meta name="description" content={post.excerpt} />
      <h1>{post.title}</h1>
    </article>
  );
}
function FancyInput({ ref, ...props }) {            // ref is a regular prop now
  return <input ref={ref} {...props} />;
}`],
      iq: [['What replaced forwardRef in React 19?', 'Function components receive ref as a normal prop.'],
           ['How do you set the page title in React 19 without a library?', 'Render <title> inside any component; React hoists it to the document head.']],
      cq: [['Context provider in React 19.', `<ThemeContext value={theme}>{children}</ThemeContext>  {/* no .Provider needed */}`]],
      err: ['Still wrapping every component in forwardRef']
    }),
    L('react-actions'),
    L('react-server-components'),
    t('react-compiler', 'React Compiler', 'A', {
      one: 'A build-time compiler that automatically memoises components and hooks, removing most manual useMemo, useCallback and React.memo.',
      ex: `It analyses data flow and inserts fine-grained caching so components only recompute what changed. It requires code to follow the Rules of React (pure render, no mutation of props/state/values after render). An ESLint plugin flags code it cannot optimise.

Adopt incrementally (per directory or with "use memo" opt-in), test, and remove manual memo only after verifying. Available via Babel plugin, and integrated in Next.js, Vite and Expo setups.`,
      pts: ['Automatic memoisation', 'Requires Rules of React', 'ESLint plugin reports issues', 'Incremental adoption'],
      flow: ['Source components', 'Compiler analyses dependencies', 'Inserts memo caches', 'Fewer wasted re-renders'],
      code: ['javascript', `// vite.config.js
import react from '@vitejs/plugin-react';
export default {
  plugins: [
    react({
      babel: { plugins: [['babel-plugin-react-compiler', {}]] }   // enable the compiler
    })
  ]
};
// Component code stays plain — no useMemo/useCallback needed:
// function List({ items, query }) { const visible = items.filter(i => i.includes(query)); return ... }`],
      iq: [['Does the React Compiler change how you write components?', 'Mostly no — you write plain components, but they must follow the Rules of React.']],
      cq: [['Opt a single component out.', `function Legacy() { 'use no memo';     // directive: skip compiling this component
  /* ... */ }`]],
      err: ['Mutating objects during render (breaks compiler assumptions)']
    })
  ),
  m('5. Ecosystem',
    t('react-router', 'Routing with React Router v7', 'I', {
      one: 'React Router maps URLs to components with nested routes, layouts, params, loaders/actions and navigation hooks; v7 also works as a full framework (formerly Remix).',
      ex: `Library mode: createBrowserRouter([{ path: '/', element: <Layout/>, children: [...] }]) + <RouterProvider>. <Outlet/> renders child routes in layouts. useParams, useSearchParams, useNavigate, <Link>/<NavLink>.

Data APIs: loader functions fetch data before rendering a route; actions handle form submissions; errorElement shows route errors. Framework mode adds file-based routes, SSR, code splitting and type-safe route modules. Protect routes by redirecting in loaders.`,
      pts: ['Nested routes + Outlet', 'useParams / useSearchParams', 'loaders/actions for data', 'Framework mode = SSR'],
      flow: ['URL changes', 'Router matches route tree', 'Loaders fetch data', 'Layouts render Outlets', 'Page shows'],
      code: ['jsx', `import { createBrowserRouter, RouterProvider, Outlet, Link, useParams, useLoaderData, redirect } from 'react-router';
const router = createBrowserRouter([
  { path: '/', element: <Layout />, children: [                     // layout route
    { index: true, element: <Home /> },                             // "/"
    { path: 'term/:id', element: <TermPage />,                      // dynamic segment
      loader: async ({ params }) => fetch('/api/terms/' + params.id).then((r) => r.json()) }, // data before render
    { path: 'admin', loader: () => (isLoggedIn() ? null : redirect('/login')), element: <Admin /> } // guard
  ] }
]);
function Layout() { return <><nav><Link to="/">Home</Link></nav><Outlet /></>; } // child renders in Outlet
function TermPage() { const term = useLoaderData(); const { id } = useParams(); return <h1>{term.name} ({id})</h1>; }
export default function App() { return <RouterProvider router={router} />; }`],
      iq: [['What does Outlet do?', 'Renders the matched child route inside a parent layout route.'],
           ['How do you protect routes?', 'Check auth in a loader (redirect) or in a wrapper component before rendering.']],
      cq: [['Read and update a ?page= query param.', `const [params, setParams] = useSearchParams();    // URL search params
const page = Number(params.get('page') ?? 1);
<button onClick={() => setParams({ page: String(page + 1) })}>Next</button>`]],
      err: ['Fetching route data in effects causing waterfalls']
    }),
    t('react-data-fetching', 'Data Fetching Strategies in React', 'I', {
      one: 'Ways to load server data: effects (manual), TanStack Query/SWR (client cache), router loaders, Server Components and the use() hook.',
      ex: `Raw useEffect fetching needs loading/error state, race-condition handling, caching and refetch logic — easy to get wrong and causes waterfalls. TanStack Query adds caching, dedupe, retries and background refetch. Route loaders fetch in parallel before rendering. Server Components fetch on the server with no client JS.

Avoid waterfalls: start requests in parallel, hoist fetching to routes, prefetch on hover.`,
      pts: ['Effects need careful handling', 'TanStack Query for client caching', 'Loaders avoid waterfalls', 'Server Components fetch on server'],
      dia: `flowchart TD
  Q{"Where does the component render?"} -->|"Server Component / framework"| S["Fetch on server: async component or loader"]
  Q -->|"Client SPA"| C{"Need caching, refetch, mutations?"}
  C -->|Yes| TQ["TanStack Query / SWR"]
  C -->|"No, one-off"| E["useEffect + AbortController"]`,
      code: ['jsx', `import { useQuery } from '@tanstack/react-query';
function TermDetails({ id }) {
  const { data, isPending, error } = useQuery({
    queryKey: ['term', id],                                   // cache key per term
    queryFn: ({ signal }) => fetch('/api/terms/' + id, { signal }).then((r) => r.json()), // cancellable
    staleTime: 5 * 60_000                                     // fresh for 5 min
  });
  if (isPending) return <Skeleton />;
  if (error) return <p role="alert">{error.message}</p>;
  return <h2>{data.name}</h2>;
}`],
      iq: [['What is a request waterfall?', 'Sequential requests where a child only starts fetching after its parent finished, multiplying latency.']],
      cq: [['Fetch two resources in parallel in an effect.', `useEffect(() => {
  const ac = new AbortController();
  Promise.all([getUser(id, ac.signal), getPosts(id, ac.signal)]).then(([u, p]) => { setUser(u); setPosts(p); }); // parallel
  return () => ac.abort();                                  // cancel on change/unmount
}, [id]);`]],
      err: ['No cancellation → stale responses overwrite new ones']
    }),
    t('react-forms-libraries', 'Form Libraries: React Hook Form + Zod', 'I', {
      one: 'React Hook Form manages form state with uncontrolled inputs and minimal re-renders; Zod schemas provide typed validation via resolvers.',
      ex: `register('email') connects inputs; handleSubmit validates then calls your function; formState.errors exposes messages; watch reads values reactively; Controller wraps controlled UI components (date pickers, selects). zodResolver(schema) validates against a Zod schema and infers types.

Alternatives: TanStack Form, Formik (older), Conform (server actions). React 19 Actions cover simpler forms.`,
      pts: ['register for native inputs', 'Controller for custom components', 'zodResolver for schema validation', 'Fewer re-renders than controlled forms'],
      code: ['tsx', `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const schema = z.object({ email: z.string().email('Invalid email'), age: z.coerce.number().min(18) }); // rules
type FormValues = z.infer<typeof schema>;                    // typed values
export function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });  // connect schema
  const onSubmit = async (data: FormValues) => { await fetch('/api', { method: 'POST', body: JSON.stringify(data) }); };
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register('email')} aria-invalid={!!errors.email} />  {/* registered input */}
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <input type="number" {...register('age')} />
      <button disabled={isSubmitting}>Sign up</button>
    </form>
  );
}`],
      iq: [['Why is React Hook Form fast?', 'It uses uncontrolled inputs and subscriptions, so typing doesn’t re-render the whole form.']],
      cq: [['Use a controlled third-party select.', `<Controller name="city" control={control} render={({ field }) => <Select {...field} options={cities} />} />`]],
      err: ['Validating only on the client']
    }),
    t('react-native-intro', 'React Native & Cross-platform Basics', 'I', {
      one: 'React Native uses React to build truly native iOS/Android apps with native components (View, Text, Image) instead of DOM elements; Expo is the recommended toolchain.',
      ex: `Same concepts (components, hooks, state) but different primitives: <View> (div), <Text> (all text must be inside), <Pressable>, <FlatList> (virtualised lists), StyleSheet with flexbox (column by default). Navigation via Expo Router or React Navigation. The New Architecture (Fabric, TurboModules, JSI) improves performance.

Choose React Native for native UX and device APIs; a PWA for content apps with simpler distribution; Capacitor to wrap an existing web app.`,
      pts: ['Native components, not DOM', 'Expo for setup/builds/OTA updates', 'FlatList for long lists', 'Flexbox defaults to column'],
      code: ['jsx', `import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
export default function Terms({ terms, onOpen }) {
  return (
    <FlatList                                           // virtualised list
      data={terms}
      keyExtractor={(t) => t.id}                        // like React keys
      renderItem={({ item }) => (
        <Pressable onPress={() => onOpen(item.id)} style={styles.row}> {/* touchable */}
          <Text style={styles.title}>{item.name}</Text>  {/* all text inside <Text> */}
        </Pressable>
      )}
    />
  );
}
const styles = StyleSheet.create({ row: { padding: 16 }, title: { fontSize: 16, fontWeight: '600' } });`],
      iq: [['React vs React Native?', 'Both use React’s component model; React DOM renders HTML elements, React Native renders native platform views.'],
           ['What is Expo?', 'A framework and toolchain for React Native providing dev tooling, native modules, cloud builds and OTA updates.']],
      cq: [['Platform-specific value.', `import { Platform } from 'react-native';
const padding = Platform.select({ ios: 20, android: 12, default: 16 }); // per platform`]],
      err: ['Putting raw strings outside <Text>']
    }),
    t('react-animation-i18n', 'Animation & Internationalisation in React', 'I', {
      one: 'Animate React UIs with CSS transitions or Motion (Framer Motion) and translate them with i18n libraries like react-i18next or FormatJS.',
      ex: `Motion offers declarative animations (<motion.div animate={{ opacity: 1 }} />), layout animations and exit animations via AnimatePresence. Prefer CSS for simple transitions, and respect prefers-reduced-motion (useReducedMotion).

i18n: keep strings in JSON per locale, use keys (t('home.title')), interpolation and pluralisation (ICU), format numbers/dates with Intl, set <html lang>, support RTL with logical CSS, and lazy-load locale files.`,
      pts: ['CSS for simple, Motion for complex', 'AnimatePresence for exit', 'Translation keys + ICU plurals', 'Intl for numbers and dates'],
      code: ['jsx', `import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';
function Toast({ show, count }) {
  const reduce = useReducedMotion();                       // user preference
  const { t } = useTranslation();                          // translate function
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {t('cart.added', { count })}                     {/* "1 item added" / "3 items added" */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}`],
      iq: [['How do you handle plurals in i18n?', 'Use ICU message format or library plural rules (Intl.PluralRules) rather than string concatenation.']],
      cq: [['Format currency per locale.', `new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'INR' }).format(499); // locale-aware`]],
      err: ['Concatenating translated fragments']
    })
  )
];
