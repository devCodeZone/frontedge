// react.js — React 19 terms

export default [
  {
    id: 'react-hooks-core', cat: 'react', name: 'useState & useEffect', level: 'Beginner',
    oneLiner: 'useState stores values that trigger re-renders; useEffect synchronises a component with something outside React.',
    explanation: `useState returns [value, setValue]. Calling the setter schedules a re-render; React 18+ batches multiple updates in the same event. When the next value depends on the previous, pass a function: setCount(c => c + 1).

useEffect runs AFTER the browser paints. Use it to sync with external systems: subscriptions, timers, DOM APIs, analytics, non-React widgets. The dependency array controls when it re-runs; the returned function is the cleanup that runs before the next effect and on unmount.

Modern guidance (react.dev "You Might Not Need an Effect"): do not use effects to derive data from props/state — compute it during render. Fetch data with a framework loader, React Query, or the use() hook instead of raw effects where possible. In Strict Mode during development, effects mount → unmount → mount once to surface missing cleanups.`,
    diagram: `flowchart TD
  R["Render: function runs, JSX returned"] --> C["Commit: React updates the DOM"]
  C --> P["Browser paints"]
  P --> E["useEffect runs"]
  E --> S{"Dependency changed on next render?"}
  S -- Yes --> CL["Run previous cleanup"] --> E
  S -- No --> W["Effect skipped"]
  U["Unmount"] --> CL2["Final cleanup runs"]`,
    code: { lang: 'jsx', src: `import { useEffect, useState } from 'react';       // import the two hooks from React

export default function OnlineClock() {            // a function component (name starts with a capital)
  const [now, setNow] = useState(() => new Date()); // lazy initial state: function runs only on 1st render
  const [ticks, setTicks] = useState(0);           // a second piece of state, starts at 0

  useEffect(() => {                                // effect: subscribe to an external system (a timer)
    const id = setInterval(() => {                 // start a timer that fires every second
      setNow(new Date());                          // replace the date → triggers a re-render
      setTicks((t) => t + 1);                      // functional update avoids a stale closure on 'ticks'
    }, 1000);                                      // 1000 ms interval
    return () => clearInterval(id);                // cleanup: stop the timer on unmount (prevents leaks)
  }, []);                                          // [] → run once after the first render

  return (                                         // JSX describing the UI
    <p>                                            {/* a paragraph element */}
      {now.toLocaleTimeString()} — {ticks} ticks   {/* curly braces embed JS expressions */}
    </p>
  );                                               // end return
}                                                  // end component` },
    interview: [
      { q: 'Why use the functional form of setState?', a: 'Because updates are batched and closures may be stale; setX(prev => ...) always receives the latest value.' },
      { q: 'What is the cleanup function in useEffect?', a: 'A function returned from the effect that React calls before re-running the effect and on unmount, to unsubscribe, clear timers or abort requests.' },
      { q: 'useEffect vs useLayoutEffect?', a: 'useEffect runs after paint (non-blocking). useLayoutEffect runs after DOM mutation but before paint — use it only to measure layout and avoid flicker.' },
      { q: 'Why does my effect run twice in development?', a: 'React Strict Mode intentionally mounts, unmounts and remounts to reveal missing cleanup logic. It does not happen in production.' },
      { q: 'What are the rules of hooks?', a: 'Call hooks only at the top level of components or custom hooks — never inside conditions, loops or nested functions — so React can match state by call order.' }
    ],
    coding: [
      { q: 'Fetch data in an effect safely (avoid race conditions).', a: `useEffect(() => {                                 // runs whenever userId changes
  const controller = new AbortController();       // allows cancelling the request
  fetch('/api/users/' + userId, { signal: controller.signal }) // start request
    .then((r) => r.json())                        // parse JSON
    .then(setUser)                                // store result in state
    .catch((e) => { if (e.name !== 'AbortError') setError(e); }); // ignore aborts
  return () => controller.abort();                // cleanup cancels the outdated request
}, [userId]);                                     // dependency array` },
      { q: 'Build a useLocalStorage hook.', a: `function useLocalStorage(key, initial) {         // custom hook: name starts with 'use'
  const [value, setValue] = useState(() => {      // lazy init reads storage only once
    try {                                         // storage can throw (private mode)
      const raw = localStorage.getItem(key);      // read saved string
      return raw !== null ? JSON.parse(raw) : initial; // parse or fall back
    } catch { return initial; }                   // fallback on error
  });                                             // end useState
  useEffect(() => {                               // persist whenever value changes
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {} // save as string
  }, [key, value]);                               // dependencies
  return [value, setValue];                       // same API as useState
}                                                 // end hook` }
    ],
    roadmap: ['Components & props', 'useState', 'Batching', 'useEffect & cleanup', 'Custom hooks', 'You might not need an effect'],
    related: ['react-memo', 'js-closures', 'react-reconciliation']
  },
  {
    id: 'react-reconciliation', cat: 'react', name: 'Virtual DOM, Reconciliation & Keys', level: 'Intermediate',
    oneLiner: 'React builds a tree of elements, diffs it with the previous tree (reconciliation) and applies only the needed DOM changes.',
    explanation: `When state changes, React calls your component again to get a new element tree. Its Fiber reconciler compares it with the previous tree using two heuristics: (1) different element types → throw away the old subtree and build new; (2) for lists, the key prop identifies which item is which.

Fiber splits rendering into small units of work so React can pause, prioritise (transitions vs urgent updates) and resume — the basis of concurrent rendering, useTransition and Suspense.

Keys must be stable and unique among siblings. Using array index as key breaks state when items are inserted, removed or reordered: input values and focus "jump" to the wrong row.`,
    diagram: `flowchart TD
  S["setState called"] --> R["Render phase: build new element tree"]
  R --> D["Diff with previous tree — Fiber reconciler"]
  D --> K{"Same type and same key?"}
  K -- Yes --> U["Update props on existing DOM node"]
  K -- No --> RP["Unmount old, mount new"]
  U --> C["Commit phase: apply DOM changes"]
  RP --> C
  C --> E["Run effects"]`,
    code: { lang: 'jsx', src: `function TodoList({ todos, onToggle }) {        // receives an array of todos via props
  return (                                       // return JSX
    <ul>                                         {/* list container */}
      {todos.map((todo) => (                     // map each data item to an element
        <li key={todo.id}>                       {/* key = stable unique id, NOT the index */}
          <input
            type="checkbox"                      // a checkbox input
            checked={todo.done}                  // controlled by data
            onChange={() => onToggle(todo.id)}   // tell the parent which todo changed
          />
          {todo.title}                           {/* text content */}
        </li>
      ))}
    </ul>
  );                                             // end return
}                                                // end component
// Why key matters: if a todo is inserted at the top and we used index keys,
// React would think every row changed and reuse the wrong DOM/state for each row.` },
    interview: [
      { q: 'What is the Virtual DOM?', a: 'A lightweight JS representation of the UI. React diffs new vs old trees and batches minimal real DOM operations.' },
      { q: 'Why not use index as key?', a: 'Index keys change when the list is reordered or items are inserted, so React reuses DOM nodes and component state for the wrong items.' },
      { q: 'What is React Fiber?', a: 'The reconciliation engine since React 16 that breaks rendering into interruptible units, enabling priorities, concurrent features and Suspense.' },
      { q: 'Render phase vs commit phase?', a: 'Render is pure and may be paused or repeated; commit applies DOM changes synchronously and then runs layout effects and effects.' }
    ],
    coding: [
      { q: 'Force a component to reset its state when a prop changes.', a: `// Changing the key tells React "this is a different component" → state resets
<ProfileForm key={userId} userId={userId} />   // new userId → fresh form state` }
    ],
    roadmap: ['JSX & elements', 'Rendering', 'Reconciliation rules', 'Keys', 'Fiber & concurrency', 'useTransition / Suspense'],
    related: ['react-hooks-core', 'react-memo', 'perf-core-web-vitals']
  },
  {
    id: 'react-memo', cat: 'react', name: 'useMemo, useCallback, React.memo & React Compiler', level: 'Advanced', version: 'React 19',
    oneLiner: 'Memoisation tools that skip expensive recalculation or re-rendering; the React Compiler can now add them automatically.',
    explanation: `useMemo caches a computed value between renders until dependencies change. useCallback caches a function identity. React.memo wraps a component so it skips re-rendering when props are shallow-equal.

They matter mainly when (a) a calculation is genuinely expensive, or (b) you pass objects/functions to memoised children or effect dependencies. Overusing them adds complexity with no benefit.

React Compiler (stable in 2025) analyses your components at build time and inserts fine-grained memoisation automatically, so most hand-written useMemo/useCallback becomes unnecessary — provided your code follows the Rules of React (pure render, no mutation of props/state).`,
    diagram: `flowchart TD
  P["Parent re-renders"] --> F["New object / function created each render"]
  F --> C{"Child wrapped in React.memo?"}
  C -- No --> RR["Child re-renders"]
  C -- Yes --> EQ{"Props shallow-equal?"}
  EQ -- "Yes: thanks to useMemo / useCallback" --> SK["Child render skipped"]
  EQ -- No --> RR
  RC["React Compiler"] -. "adds memoisation automatically" .-> EQ`,
    code: { lang: 'jsx', src: `import { memo, useCallback, useMemo, useState } from 'react'; // memoisation helpers

const Row = memo(function Row({ item, onSelect }) {   // memo: skip render if props unchanged
  return <li onClick={() => onSelect(item.id)}>{item.name}</li>; // simple clickable row
});                                                   // end Row

export function ProductList({ products }) {           // parent component
  const [query, setQuery] = useState('');             // search text state
  const [selected, setSelected] = useState(null);     // selected product id

  const filtered = useMemo(                           // cache the filtered list
    () => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())), // the work
    [products, query]                                 // recompute only when these change
  );                                                  // end useMemo

  const handleSelect = useCallback((id) => {          // stable function identity across renders
    setSelected(id);                                  // update selection
  }, []);                                             // no deps: setSelected is already stable

  return (                                            // UI
    <>                                                {/* fragment: no extra DOM node */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} /> {/* controlled input */}
      <p>Selected: {selected ?? 'none'}</p>           {/* ?? shows 'none' for null/undefined */}
      <ul>{filtered.map((p) => <Row key={p.id} item={p} onSelect={handleSelect} />)}</ul> {/* rows */}
    </>
  );                                                  // end return
}                                                     // end ProductList` },
    interview: [
      { q: 'useMemo vs useCallback?', a: 'useMemo caches the RESULT of a function; useCallback caches the FUNCTION itself. useCallback(fn, deps) equals useMemo(() => fn, deps).' },
      { q: 'When should you NOT use useMemo?', a: 'For cheap calculations or values not passed to memoised children/effects. It costs memory and readability.' },
      { q: 'What is the React Compiler?', a: 'A build-time compiler that automatically memoises components and hooks, reducing the need for manual useMemo/useCallback/memo.' },
      { q: 'Does React.memo do deep comparison?', a: 'No, shallow comparison by default (Object.is per prop). You can pass a custom compare function as the second argument.' }
    ],
    coding: [
      { q: 'Why does this child re-render? <Child style={{color:"red"}} />', a: `// A new object literal is created on every render, so props are never equal.
const style = useMemo(() => ({ color: 'red' }), []); // create once
<Child style={style} />                               // same reference each render
// Or simply move the constant outside the component:
const STYLE = { color: 'red' };                       // module-level constant` }
    ],
    roadmap: ['Re-render causes', 'Referential equality', 'React.memo', 'useMemo / useCallback', 'Profiler', 'React Compiler'],
    related: ['react-reconciliation', 'perf-core-web-vitals']
  },
  {
    id: 'react-server-components', cat: 'react', name: 'React Server Components (RSC)', level: 'Advanced', version: 'React 19',
    oneLiner: 'Components that run only on the server, can read data directly, and send zero JavaScript to the browser.',
    explanation: `Server Components render on the server (at build or request time). They can be async, await a database or API directly, and use secrets. Their output is streamed to the client as a serialised tree — their code never ships to the browser, shrinking bundles.

Client Components are marked with 'use client' at the top of the file. They are needed for state, effects, event handlers and browser APIs. Server components can import and render client components (passing serialisable props), but not the other way round — though you can pass server components to client components as children.

RSC is used through frameworks: Next.js App Router, React Router v7 (framework mode), Waku and others.`,
    diagram: `flowchart LR
  REQ["Browser request"] --> SC["Server Component: async, reads DB"]
  SC --> RSC["RSC payload streamed"]
  SC --> CC["Client Component: use client"]
  RSC --> B["Browser renders HTML + payload"]
  CC --> J["Only client component JS is shipped"]
  J --> H["Hydration: interactivity"]`,
    code: { lang: 'jsx', src: `// app/products/page.jsx — a SERVER component (default in Next.js App Router)
import { db } from '@/lib/db';                      // server-only module: never sent to the browser
import AddToCart from './AddToCart';               // a client component we can render

export default async function ProductsPage() {     // server components may be async
  const products = await db.product.findMany();    // query the database directly — no API layer needed
  return (                                         // JSX rendered on the server
    <ul>
      {products.map((p) => (                       // loop over rows
        <li key={p.id}>
          {p.name} — ₹{p.price}                    {/* plain text: no client JS for this */}
          <AddToCart id={p.id} />                  {/* interactive island; props must be serialisable */}
        </li>
      ))}
    </ul>
  );                                               // end return
}                                                  // end ProductsPage

// app/products/AddToCart.jsx
'use client';                                      // directive: this file runs in the browser
import { useState } from 'react';                  // hooks only work in client components
export default function AddToCart({ id }) {        // receives serialisable props
  const [added, setAdded] = useState(false);       // local UI state
  return <button onClick={() => setAdded(true)}>{added ? 'Added' : 'Add'}</button>; // event handler
}                                                  // end AddToCart` },
    interview: [
      { q: 'Server Components vs SSR?', a: 'SSR renders client components to HTML then hydrates all of them. RSC components never hydrate and ship no JS; they can be combined with SSR.' },
      { q: 'Can Server Components use useState?', a: 'No. State, effects, refs and event handlers require a Client Component.' },
      { q: 'What can be passed from server to client components?', a: 'Serialisable props: primitives, plain objects/arrays, Dates, Promises (with use()), server actions, and JSX — not functions or class instances.' },
      { q: 'What does use client actually mark?', a: 'A boundary: that module and everything it imports become part of the client bundle.' }
    ],
    coding: [
      { q: 'Stream slow data with Suspense in a server component.', a: `import { Suspense } from 'react';                 // boundary for async children
export default function Page() {                   // server component
  return (                                         // JSX
    <Suspense fallback={<p>Loading reviews…</p>}>  {/* shown instantly while waiting */}
      <Reviews />                                  {/* async server component streams in later */}
    </Suspense>
  );                                               // end return
}                                                  // end Page` }
    ],
    roadmap: ['SSR basics', 'Client vs server boundary', 'Async server components', 'Suspense streaming', 'Server Actions'],
    related: ['react-actions', 'next-rendering', 'perf-core-web-vitals']
  },
  {
    id: 'react-actions', cat: 'react', name: 'Actions, useActionState, useOptimistic & use()', level: 'Advanced', version: 'React 19',
    oneLiner: 'React 19 primitives for async mutations: pending state, errors, optimistic UI and reading promises/context during render.',
    explanation: `An Action is an async function used in a transition — for example passed to <form action={fn}>. React tracks its pending state automatically, resets the form on success, and works with progressive enhancement when the action is a Server Action.

useActionState(action, initialState) returns [state, formAction, isPending] — perfect for forms that show validation errors.
useFormStatus() lets a child (like a submit button) read the parent form's pending state.
useOptimistic(state, updateFn) shows an instant optimistic value while the async action is in flight; it reverts if the action fails.
use(promiseOrContext) reads a promise (suspending until it resolves) or a context — and unlike other hooks it can be called conditionally.`,
    diagram: `flowchart TD
  U["User submits form"] --> A["Action starts: isPending = true"]
  A --> O["useOptimistic shows expected result instantly"]
  A --> S["Server Action / API call"]
  S -- success --> N["New state returned → UI confirmed"]
  S -- error --> RV["Optimistic value reverted, error shown"]`,
    code: { lang: 'jsx', src: `'use client';                                         // these hooks run in the browser
import { useActionState } from 'react';               // React 19 form-state hook

async function subscribe(prevState, formData) {       // an Action: receives previous state + FormData
  const email = formData.get('email');                // read the input by its name attribute
  if (!email.includes('@')) {                         // basic validation
    return { ok: false, msg: 'Enter a valid email' }; // returned value becomes the new state
  }                                                   // end if
  await fetch('/api/subscribe', { method: 'POST', body: formData }); // send to server
  return { ok: true, msg: 'Subscribed!' };            // success state
}                                                     // end subscribe

export default function Newsletter() {                // component
  const [state, formAction, isPending] = useActionState(subscribe, { ok: null, msg: '' }); // state, action, pending
  return (                                            // UI
    <form action={formAction}>                        {/* React calls the action on submit */}
      <input name="email" type="email" required />    {/* value arrives via FormData */}
      <button disabled={isPending}>                   {/* disabled while the action runs */}
        {isPending ? 'Saving…' : 'Subscribe'}         {/* pending label */}
      </button>
      {state.msg && <p>{state.msg}</p>}               {/* show result or error */}
    </form>
  );                                                  // end return
}                                                     // end Newsletter` },
    interview: [
      { q: 'What problem does useActionState solve?', a: 'It removes boilerplate for async form handling — pending flags, error/success state and sequencing — in one hook that also supports Server Actions.' },
      { q: 'How is use() different from other hooks?', a: 'It can be called inside conditions and loops, and it reads Promises (suspending) or Context.' },
      { q: 'What is optimistic UI?', a: 'Updating the UI as if a mutation succeeded before the server confirms, then reconciling or reverting. useOptimistic implements it in React 19.' }
    ],
    coding: [
      { q: 'Optimistic like button with useOptimistic.', a: `const [optimisticLikes, addLike] = useOptimistic( // temporary value during the action
  likes,                                           // real value from server/state
  (current, delta) => current + delta              // how to compute the optimistic value
);                                                 // end useOptimistic
async function like() {                            // action
  addLike(1);                                      // UI shows +1 immediately
  await saveLike(postId);                          // real request; on error React reverts
}                                                  // end like` }
    ],
    roadmap: ['Forms in React', 'Transitions', 'Actions', 'useActionState / useFormStatus', 'useOptimistic', 'Server Actions'],
    related: ['react-server-components', 'next-server-actions']
  }
];
