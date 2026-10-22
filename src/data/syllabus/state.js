// State Management — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import web from '../terms/web.js';
const L = legacyPicker(web);

export default [
  m('1. Concepts',
    t('state-types', 'Types of State: local, shared, server, URL, form', 'B', {
      one: 'Frontend state comes in kinds — local UI state, shared client state, server/cache state, URL state and form state — and each has a best home.',
      ex: `Local: open/closed, input text → component state. Shared client: theme, auth user, cart → context or store. Server state: data owned by the backend (lists, profiles) → a caching library (TanStack Query, RTK Query, SWR, Angular resource). URL state: filters, pagination, tabs → query params so links are shareable. Form state: values, errors, touched → form library.

Choosing the right home removes most "state management" complexity.`,
      pts: ['Keep state as local as possible', 'Server state → caching library', 'Filters/pagination → URL', 'Forms → form library'],
      dia: `flowchart TD
  Q{"What kind of state?"} --> L["Local UI → component state"]
  Q --> S["Shared client → context/store"]
  Q --> SV["Server data → TanStack/RTK Query"]
  Q --> U["Shareable view → URL params"]
  Q --> F["Form → form library"]`,
      code: ['jsx', `function TermsPage() {
  const [params, setParams] = useSearchParams();             // URL state: shareable filters
  const level = params.get('level') ?? 'all';
  const { data: terms = [] } = useQuery({                    // server state: cached
    queryKey: ['terms', level], queryFn: () => fetchTerms(level)
  });
  const [expanded, setExpanded] = useState(null);            // local UI state
  const { theme } = useTheme();                              // shared client state (context)
  return <TermList terms={terms} theme={theme} expanded={expanded} onToggle={setExpanded}
           onLevel={(l) => setParams({ level: l })} />;
}`],
      iq: [['Why separate server state from client state?', 'Server state needs caching, refetching, deduping and invalidation — different concerns from UI state.']],
      cq: [['Persist a filter in the URL.', `const url = new URL(location.href); url.searchParams.set('level', 'advanced'); history.replaceState(null, '', url);`]],
      err: ['Putting everything in one global store']
    }),
    t('state-unidirectional-flow', 'Unidirectional Data Flow & Flux Architecture', 'B', {
      one: 'Data flows one way: state → view → user action → update → new state; Flux/Redux formalised this with actions, a dispatcher/store and views.',
      ex: `Two-way data binding everywhere (classic AngularJS) made it hard to trace changes. Flux: views dispatch actions, stores update and emit change, views re-render. Redux simplified to a single store with pure reducers.

Benefits: predictable updates, easy debugging (log every action), time travel and testability.`,
      pts: ['State → View → Action → State', 'Actions describe what happened', 'Pure updates', 'Easy to trace and debug'],
      flow: ['State', 'View renders', 'User triggers action', 'Store/reducer computes new state', 'View re-renders'],
      code: ['javascript', `// Minimal Redux-like store
function createStore(reducer, initial) {
  let state = initial;                                     // current state
  const listeners = new Set();                             // subscribers (views)
  return {
    getState: () => state,
    dispatch(action) {                                     // the only way to change state
      state = reducer(state, action);                      // pure update
      listeners.forEach((l) => l());                       // notify views
    },
    subscribe(l) { listeners.add(l); return () => listeners.delete(l); }
  };
}
const store = createStore((s, a) => (a.type === 'inc' ? { count: s.count + 1 } : s), { count: 0 });
store.subscribe(() => console.log(store.getState()));
store.dispatch({ type: 'inc' });                           // { count: 1 }`],
      iq: [['What is unidirectional data flow?', 'State flows down to views and changes flow back only through explicit actions/callbacks, making updates predictable.']],
      cq: [['Add logging middleware to the store.', `const dispatch = store.dispatch;
store.dispatch = (a) => { console.log('action', a.type); dispatch(a); console.log('next', store.getState()); };`]],
      err: ['Mutating shared state from many places']
    }),
    t('state-immutability-normalization', 'Immutability, Immer & Normalised State', 'I', {
      one: 'Store state immutably (new references on change) and normalise relational data into id-keyed tables to avoid duplication and deep updates.',
      ex: `Immutable updates enable cheap change detection (===) and time travel. Immer lets you write "mutating" code on a draft and produces an immutable result (used by Redux Toolkit, Zustand middleware).

Normalisation: store entities as { ids: [], entities: { [id]: item } } like database tables, reference others by id, and derive views with selectors. RTK's createEntityAdapter and NgRx Entity generate this.`,
      pts: ['New references signal change', 'Immer for ergonomic updates', 'Normalise: ids + entities', 'Selectors derive views'],
      code: ['javascript', `import { produce } from 'immer';
const state = {
  posts: { ids: [1], entities: { 1: { id: 1, title: 'Hooks', authorId: 7 } } }, // normalised
  users: { ids: [7], entities: { 7: { id: 7, name: 'Riya' } } }
};
const next = produce(state, (draft) => {                 // write mutations on a draft
  draft.posts.entities[1].title = 'React Hooks';         // looks mutable
  draft.posts.ids.push(2);                               // add id
  draft.posts.entities[2] = { id: 2, title: 'Signals', authorId: 7 };
});
console.log(state.posts.entities[1].title, next.posts.entities[1].title); // "Hooks" "React Hooks"
const postWithAuthor = (s, id) => ({ ...s.posts.entities[id], author: s.users.entities[s.posts.entities[id].authorId] }); // selector`],
      iq: [['Why normalise state?', 'Each entity is stored once, updates touch one place, and lookups by id are O(1).']],
      cq: [['Normalise an API array.', `const normalize = (arr) => ({ ids: arr.map((x) => x.id), entities: Object.fromEntries(arr.map((x) => [x.id, x])) });`]],
      err: ['Duplicated nested copies of the same entity']
    })
  ),
  m('2. Libraries',
    t('state-context-patterns', 'Context-based State (React Context + useReducer)', 'I', {
      one: 'Combine Context with useReducer for small/medium global state without a library; split contexts and memoise values to limit re-renders.',
      ex: `Provide state and dispatch in separate contexts so components that only dispatch don't re-render. Expose custom hooks (useCart, useCartDispatch). Context has no selector support, so frequently changing values with many consumers cause wide re-renders — that is the point to adopt Zustand/Redux or use-context-selector.`,
      pts: ['Context + reducer = mini store', 'Separate state and dispatch contexts', 'Custom hooks API', 'No selectors → watch re-renders'],
      code: ['jsx', `const CartState = createContext(null);
const CartDispatch = createContext(null);
function cartReducer(state, a) {
  if (a.type === 'add') return [...state, a.item];        // pure update
  if (a.type === 'remove') return state.filter((i) => i.id !== a.id);
  return state;
}
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  return (
    <CartDispatch value={dispatch}>                       {/* stable: never changes */}
      <CartState value={items}>{children}</CartState>     {/* changes on updates */}
    </CartDispatch>
  );
}
export const useCart = () => useContext(CartState);
export const useCartDispatch = () => useContext(CartDispatch);`],
      iq: [['When is Context + useReducer enough?', 'For modest shared state that changes infrequently or has few consumers.']],
      cq: [['Add-to-cart button that never re-renders on cart changes.', `function AddButton({ item }) { const dispatch = useCartDispatch(); return <button onClick={() => dispatch({ type: 'add', item })}>Add</button>; }`]],
      err: ['Single context with frequently changing big objects']
    }),
    t('state-redux-core', 'Redux Core Concepts: store, actions, reducers, middleware, selectors', 'I', {
      one: 'Redux keeps app state in a single store updated by dispatching actions to pure reducers; middleware handles side effects and selectors read/derive data.',
      ex: `Three principles: single source of truth, state is read-only (changed only by actions), changes via pure functions. Middleware (thunk, listener, saga) sits between dispatch and reducer for async logic and logging. Selectors (reselect createSelector) compute derived data with memoisation.

Modern Redux = Redux Toolkit; you rarely write raw Redux, but interviews still ask the concepts.`,
      pts: ['Single store, read-only state', 'Pure reducers', 'Middleware for side effects', 'Memoised selectors'],
      flow: ['UI dispatch(action)', 'Middleware (thunk/logger)', 'Root reducer', 'New state', 'useSelector re-renders subscribers'],
      code: ['javascript', `// thunk middleware in 4 lines
const thunk = (store) => (next) => (action) =>
  typeof action === 'function' ? action(store.dispatch, store.getState) : next(action); // functions get dispatch
const fetchTerms = () => async (dispatch) => {          // async action creator
  dispatch({ type: 'terms/loading' });
  const data = await fetch('/api/terms').then((r) => r.json());
  dispatch({ type: 'terms/loaded', payload: data });   // plain action to reducer
};
import { createSelector } from 'reselect';
const selectTerms = (s) => s.terms.list;
const selectAdvanced = createSelector([selectTerms], (list) => list.filter((t) => t.level === 'Advanced')); // memoised`],
      iq: [['Why must reducers be pure?', 'For predictable state, time-travel debugging and because Redux compares references to detect changes.'],
           ['What is middleware in Redux?', 'A function wrapping dispatch to intercept actions for logging, async work or routing.']],
      cq: [['Write a logger middleware.', `const logger = (store) => (next) => (action) => { console.log(action.type); const r = next(action); console.log(store.getState()); return r; };`]],
      err: ['Putting non-serialisable values (promises, class instances) in state']
    }),
    L('state-redux-toolkit'),
    t('state-rtk-query', 'RTK Query', 'I', {
      one: 'RTK Query is Redux Toolkit’s data-fetching and caching layer: define endpoints once and get generated hooks with caching, invalidation and loading states.',
      ex: `createApi({ baseQuery: fetchBaseQuery({ baseUrl }), endpoints }) generates useGetTermsQuery, useAddTermMutation, etc. Tags (providesTags/invalidatesTags) automatically refetch affected queries after mutations. Supports polling, optimistic updates, streaming updates and code generation from OpenAPI.

Choose it if you already use Redux; otherwise TanStack Query is equally capable.`,
      pts: ['Endpoints generate hooks', 'Tag-based invalidation', 'Integrated with Redux DevTools', 'OpenAPI codegen'],
      code: ['javascript', `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Term'],
  endpoints: (b) => ({
    getTerms: b.query({ query: (level) => 'terms?level=' + level, providesTags: ['Term'] }), // cached query
    addTerm: b.mutation({ query: (body) => ({ url: 'terms', method: 'POST', body }), invalidatesTags: ['Term'] }) // refetch after
  })
});
export const { useGetTermsQuery, useAddTermMutation } = api;   // generated hooks
// const { data, isLoading } = useGetTermsQuery('advanced');`],
      iq: [['How does RTK Query refresh lists after a mutation?', 'Mutations invalidate tags that queries provide, triggering automatic refetch.']],
      cq: [['Poll every 30 seconds.', `useGetTermsQuery('all', { pollingInterval: 30000 }); // auto refetch`]],
      err: ['Duplicating API data into separate slices']
    }),
    t('state-zustand', 'Zustand', 'I', {
      one: 'Zustand is a tiny hook-based store: create a store with state and actions, then subscribe to slices with selectors so components re-render only when their slice changes.',
      ex: `No providers needed (works outside React too). Use selectors (useStore(s => s.count)) and useShallow for selecting multiple values. Middleware: persist (localStorage), devtools, immer, subscribeWithSelector. Great default for small/medium apps that outgrow Context.`,
      pts: ['No provider, minimal API', 'Selectors limit re-renders', 'persist / devtools middleware', 'Usable outside React'],
      code: ['javascript', `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useProgress = create(persist(                 // persisted store
  (set, get) => ({
    mastered: [],
    toggle: (id) => set((s) => ({                          // update via set
      mastered: s.mastered.includes(id) ? s.mastered.filter((x) => x !== id) : [...s.mastered, id]
    })),
    isMastered: (id) => get().mastered.includes(id)       // read current state
  }),
  { name: 'progress' }                                     // localStorage key
));
// const count = useProgress((s) => s.mastered.length);    // re-renders only when length changes
// useProgress.getState().toggle('js-closures');          // outside React`],
      iq: [['Why is Zustand lighter than Redux?', 'Minimal boilerplate, no actions/reducers ceremony, no provider and selector-based subscriptions out of the box.']],
      cq: [['Select several values without extra renders.', `import { useShallow } from 'zustand/react/shallow';
const { mastered, toggle } = useProgress(useShallow((s) => ({ mastered: s.mastered, toggle: s.toggle })));`]],
      err: ['Selecting the whole store object in every component']
    }),
    t('state-atomic', 'Atomic State: Jotai, Recoil & signals', 'I', {
      one: 'Atomic state splits global state into small independent atoms that components subscribe to individually; derived atoms compute from others.',
      ex: `Jotai: atom(initial), derived atom(get => …), async atoms that integrate with Suspense, atomWithStorage. Only components using a changed atom re-render. Recoil (Meta) pioneered the idea but is no longer maintained — prefer Jotai.

Signals (Preact signals, Angular signals, Solid, Vue refs, the TC39 signals proposal) share the same fine-grained reactive idea.`,
      pts: ['Small atoms, fine-grained updates', 'Derived atoms', 'Async atoms + Suspense', 'Recoil unmaintained → Jotai'],
      code: ['jsx', `import { atom, useAtom, useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
const queryAtom = atom('');                                      // primitive atom
const levelAtom = atomWithStorage('level', 'all');               // persisted atom
const filteredAtom = atom(async (get) => {                       // derived async atom
  const res = await fetch('/api/terms?q=' + get(queryAtom) + '&level=' + get(levelAtom));
  return res.json();
});
function Search() { const [q, setQ] = useAtom(queryAtom); return <input value={q} onChange={(e) => setQ(e.target.value)} />; }
function Results() { const terms = useAtomValue(filteredAtom); return <p>{terms.length} results</p>; } // suspends while loading`],
      iq: [['Atomic vs single store?', 'Atomic stores state in many independent units with automatic dependency tracking; single stores keep one tree and use selectors.']],
      cq: [['Write-only action atom.', `const resetAtom = atom(null, (get, set) => { set(queryAtom, ''); set(levelAtom, 'all'); }); // custom setter`]],
      err: ['Starting new projects on Recoil']
    }),
    t('state-mobx', 'MobX & Observable State', 'I', {
      one: 'MobX makes state observable and automatically re-renders components that read it, using mutable classes with actions and computed values.',
      ex: `makeAutoObservable(this) turns class fields into observables, getters into computed and methods into actions. observer() components track what they read. It is very productive for complex domain models but less explicit than Redux; strict mode ensures changes happen in actions.`,
      pts: ['Observable mutable state', 'Automatic dependency tracking', 'computed getters', 'observer components'],
      code: ['jsx', `import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
class QuizStore {
  answers = {};                                   // observable
  constructor() { makeAutoObservable(this); }     // auto-wire observables/actions/computed
  answer(qId, optionIdx) { this.answers[qId] = optionIdx; } // action (mutation allowed)
  get answeredCount() { return Object.keys(this.answers).length; } // computed
}
const quiz = new QuizStore();
const Progress = observer(() => <p>{quiz.answeredCount} answered</p>); // re-renders when count changes`],
      iq: [['How does MobX know what to re-render?', 'observer components track which observables they read during render and re-render when those change.']],
      cq: [['React to changes outside UI.', `import { autorun } from 'mobx'; autorun(() => localStorage.setItem('answers', JSON.stringify(quiz.answers))); // runs on change`]],
      err: ['Forgetting observer() wrapper']
    }),
    L('state-tanstack-query'),
    t('state-swr', 'SWR (stale-while-revalidate hooks)', 'B', {
      one: 'SWR by Vercel is a lightweight data-fetching hook library: return cached (stale) data immediately, revalidate in the background, then update.',
      ex: `useSWR(key, fetcher) returns data, error, isLoading and mutate. Revalidates on focus, reconnect and intervals; dedupes identical keys; supports optimistic updates via mutate and infinite loading (useSWRInfinite). Smaller API than TanStack Query, popular in Next.js projects.`,
      pts: ['Stale-while-revalidate strategy', 'Key-based caching', 'mutate for updates', 'Revalidate on focus'],
      code: ['jsx', `import useSWR from 'swr';
const fetcher = (url) => fetch(url).then((r) => r.json());   // shared fetcher
function Profile() {
  const { data, error, isLoading, mutate } = useSWR('/api/me', fetcher); // cached by key
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed</p>;
  async function rename(name) {
    await mutate(fetch('/api/me', { method: 'PATCH', body: JSON.stringify({ name }) }).then((r) => r.json()),
      { optimisticData: { ...data, name } });                 // instant UI, then confirm
  }
  return <button onClick={() => rename('Riya')}>{data.name}</button>;
}`],
      iq: [['What does stale-while-revalidate mean?', 'Serve cached data immediately (possibly stale) and fetch fresh data in the background to update it.']],
      cq: [['Conditional fetching.', `useSWR(userId ? '/api/users/' + userId : null, fetcher); // null key = don't fetch`]],
      err: ['Different fetchers for the same key']
    })
  ),
  m('3. Advanced Patterns',
    t('state-optimistic-updates', 'Optimistic Updates & Rollback', 'I', {
      one: 'Optimistic updates change the UI before the server confirms, then roll back if the request fails — making apps feel instant.',
      ex: `Steps: snapshot current state, apply the expected change, send the request, on error restore the snapshot and show a message, finally refetch/invalidate to sync. Use for likes, toggles, reordering, sending messages. Avoid for irreversible or high-risk operations (payments).

Tools: TanStack Query onMutate/onError/onSettled, SWR optimisticData, React 19 useOptimistic, RTK Query onQueryStarted.`,
      pts: ['Snapshot → apply → request', 'Rollback on error', 'Invalidate on settle', 'Not for payments'],
      flow: ['Snapshot state', 'Apply optimistic change', 'Send request', 'Error: rollback + notify', 'Settle: refetch to sync'],
      code: ['javascript', `const qc = useQueryClient();
const toggleSave = useMutation({
  mutationFn: (id) => fetch('/api/saved/' + id, { method: 'POST' }),
  onMutate: async (id) => {
    await qc.cancelQueries({ queryKey: ['saved'] });          // stop in-flight refetches
    const previous = qc.getQueryData(['saved']);              // snapshot
    qc.setQueryData(['saved'], (old = []) =>                  // optimistic change
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id]);
    return { previous };                                      // context for rollback
  },
  onError: (_e, _id, ctx) => qc.setQueryData(['saved'], ctx.previous), // rollback
  onSettled: () => qc.invalidateQueries({ queryKey: ['saved'] })       // sync with server
});`],
      iq: [['When should you avoid optimistic UI?', 'For irreversible, expensive or failure-prone operations where showing success prematurely misleads users (payments, deletes without undo).']],
      cq: [['Simple optimistic toggle with plain state.', `const prev = liked; setLiked(!liked);                 // update first
try { await api.like(id); } catch { setLiked(prev); toast('Could not like'); } // rollback`]],
      err: ['No rollback path']
    }),
    t('state-machines', 'State Machines & Statecharts (XState)', 'A', {
      one: 'A finite state machine models UI as explicit states and allowed transitions (idle → loading → success/error), eliminating impossible states; XState implements statecharts in JS.',
      ex: `Instead of booleans (isLoading, isError, isOpen) that can combine illegally, define states and events: in "loading" only RESOLVE/REJECT are valid. Statecharts add nested/parallel states, guards, delayed transitions and actions. Visualise machines with Stately tools.

Great for complex flows: checkout, multi-step forms, media players, onboarding, auth.`,
      pts: ['Explicit states + transitions', 'No impossible combinations', 'Guards and actions', 'Visualisable'],
      dia: `stateDiagram-v2
  [*] --> idle
  idle --> loading: SUBMIT
  loading --> success: RESOLVE
  loading --> error: REJECT
  error --> loading: RETRY
  success --> [*]`,
      code: ['javascript', `import { createMachine, assign } from 'xstate';
export const submitMachine = createMachine({
  id: 'submit',
  initial: 'idle',
  context: { error: null },
  states: {
    idle: { on: { SUBMIT: 'loading' } },                        // only SUBMIT allowed
    loading: {
      invoke: { src: 'saveForm',                                  // async service
        onDone: 'success',
        onError: { target: 'failure', actions: assign({ error: ({ event }) => event.error }) } }
    },
    failure: { on: { RETRY: 'loading' } },
    success: { type: 'final' }
  }
});
// React: const [state, send] = useMachine(submitMachine.provide({ actors: { saveForm } }));`],
      iq: [['Why use state machines in UI?', 'They make all states and transitions explicit, preventing impossible states and making complex flows testable and visual.']],
      cq: [['Tiny machine without libraries.', `const transitions = { idle: { SUBMIT: 'loading' }, loading: { OK: 'done', FAIL: 'error' }, error: { RETRY: 'loading' } };
const next = (state, event) => transitions[state]?.[event] ?? state; // ignore invalid events`]],
      err: ['Multiple booleans for one process']
    }),
    t('state-persistence-sync', 'State Persistence & Cross-tab Sync', 'I', {
      one: 'Persist state to localStorage/IndexedDB with versioning and hydration, and sync it across tabs with the storage event or BroadcastChannel.',
      ex: `Persist only what matters (preferences, drafts, cart) — not server data that can be refetched. Version stored data and migrate on schema changes. Guard storage access (private mode, SSR). Avoid hydration flashes by reading persisted state before first render or showing a skeleton.

The storage event fires in other tabs when localStorage changes; BroadcastChannel sends arbitrary messages between same-origin tabs.`,
      pts: ['Persist only user-owned state', 'Version + migrate', 'Guard storage access', 'storage event / BroadcastChannel for tabs'],
      code: ['javascript', `const KEY = 'prefs';
const VERSION = 2;
export function loadPrefs() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');   // may throw
    if (!raw) return { theme: 'dark', fontSize: 16 };              // defaults
    if (raw.v === 1) return { ...raw.data, fontSize: 16 };         // migrate v1 → v2
    return raw.data;
  } catch { return { theme: 'dark', fontSize: 16 }; }              // storage unavailable
}
export function savePrefs(data) {
  try { localStorage.setItem(KEY, JSON.stringify({ v: VERSION, data })); } catch {}
}
window.addEventListener('storage', (e) => {                        // another tab changed it
  if (e.key === KEY) applyPrefs(loadPrefs());                      // keep tabs in sync
});`],
      iq: [['How do you sync logout across tabs?', 'Broadcast a logout message via BroadcastChannel or update a storage key that other tabs listen for.']],
      cq: [['BroadcastChannel cart sync.', `const ch = new BroadcastChannel('cart');
ch.onmessage = (e) => setCart(e.data);       // receive from other tabs
function update(cart) { setCart(cart); ch.postMessage(cart); } // send to others`]],
      err: ['Persisting tokens or large API caches in localStorage']
    }),
    t('state-choosing', 'Choosing a State Management Approach', 'I', {
      one: 'A decision guide: start local, lift when needed, use a server-cache library for API data, URL for shareable state, and add a global store only for truly global, frequently changing client state.',
      ex: `Questions to ask: Who owns the data (server or client)? How many components need it? How often does it change? Does it need persistence, devtools, undo, offline? Team size and conventions?

Typical modern stack: React → useState + TanStack Query + URL params + Zustand (if needed). Angular → signals in services + httpResource + NgRx SignalStore for large apps. Vue → refs/composables + Pinia.`,
      pts: ['Start local, lift as needed', 'Server cache library for API data', 'Global store only when justified', 'Match the framework’s idioms'],
      dia: `flowchart TD
  A{"Is it data from the server?"} -- Yes --> Q["TanStack/RTK Query, SWR, httpResource"]
  A -- No --> B{"Should it be in the URL?"}
  B -- Yes --> U["Search params"]
  B -- No --> C{"Used by many distant components?"}
  C -- No --> L["Local state / lift up"]
  C -- Yes --> D{"Changes often + complex?"}
  D -- No --> CX["Context / provide-inject / service"]
  D -- Yes --> S["Zustand / Redux / Pinia / NgRx"]`,
      code: ['javascript', `// Signals of over-engineering:
// ❌ Redux slice for a modal's open state
// ❌ Copying API responses into a global store manually
// ✅ const [open, setOpen] = useState(false);                // local UI
// ✅ useQuery({ queryKey: ['terms'], queryFn })              // server cache
// ✅ const useUI = create((set) => ({ sidebar: true, toggle: () => set((s) => ({ sidebar: !s.sidebar })) })); // global UI`],
      iq: [['How would you choose state management for a new project?', 'Classify state types, keep most state local/server-cached, use URL for shareable views, and adopt a global store only for shared, frequently changing client state.']],
      cq: [['Explain your choice for a dashboard app.', `// Filters → URL; widgets data → TanStack Query; user prefs → Zustand + persist; dialog state → local`]],
      err: ['Choosing a library before understanding the state']
    })
  )
];
