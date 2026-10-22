// web.js — HTML, CSS, jQuery, State management, Browser APIs

export default [
  {
    id: 'html-semantic', cat: 'html', name: 'Semantic HTML & Modern Elements', level: 'Beginner',
    oneLiner: 'Using elements that describe meaning (header, nav, main, article, dialog) instead of generic divs.',
    explanation: `Semantic elements tell browsers, search engines and assistive technology what each part of the page IS. A <button> is focusable, keyboard-operable and announced as a button for free; a clickable <div> is none of these.

Landmarks: header, nav, main (one per page), aside, footer, section (with a heading), article (self-contained content).
Modern native elements reduce JavaScript: <dialog> (modal with showModal() and focus trapping), <details>/<summary> (accordion), the popover attribute (tooltips/menus with no JS), <search>, input types (date, email, range), loading="lazy" on images and iframes.`,
    diagram: `flowchart TD
  B["body"] --> H["header: logo + nav"]
  B --> M["main: one per page"]
  M --> A1["article: post"]
  M --> S["section: with heading"]
  B --> AS["aside: related"]
  B --> F["footer"]`,
    code: { lang: 'html', src: `<header>                                         <!-- page/site header landmark -->
  <nav aria-label="Main">                        <!-- navigation landmark; label distinguishes multiple navs -->
    <a href="/" aria-current="page">Home</a>      <!-- aria-current marks the active link -->
  </nav>                                          <!-- end nav -->
</header>                                         <!-- end header -->
<main>                                            <!-- the unique main content of the page -->
  <article>                                       <!-- self-contained piece (could be syndicated) -->
    <h1>Learn Closures</h1>                       <!-- one clear h1 per page -->
    <details>                                     <!-- native accordion, keyboard accessible -->
      <summary>Show answer</summary>              <!-- clickable toggle label -->
      <p>A function that remembers its scope.</p> <!-- hidden until opened -->
    </details>                                    <!-- end details -->
    <button popovertarget="tip">Tip</button>      <!-- opens the popover with zero JavaScript -->
    <div id="tip" popover>Use let in loops.</div> <!-- popover: top-layer, light-dismiss -->
  </article>                                      <!-- end article -->
  <dialog id="confirm">                           <!-- native modal; use dialog.showModal() -->
    <form method="dialog"><button>OK</button></form> <!-- method=dialog closes it on submit -->
  </dialog>                                       <!-- end dialog -->
</main>                                           <!-- end main -->` },
    interview: [
      { q: 'Why does semantic HTML matter?', a: 'Accessibility (screen readers, keyboard), SEO, maintainability, and built-in behaviour without extra JS.' },
      { q: 'section vs article vs div?', a: 'article is self-contained content; section is a thematic group that should have a heading; div has no meaning and is for styling hooks only.' },
      { q: 'What does the popover attribute do?', a: 'Makes an element a top-layer popover that can be toggled by a button with popovertarget, with light-dismiss and no JavaScript.' }
    ],
    coding: [
      { q: 'Make a fake div button accessible (or explain why not to).', a: `<!-- Best: use a real <button>. If you truly cannot: -->
<div role="button" tabindex="0"                <!-- role announces it; tabindex makes it focusable -->
  onclick="save()"                             <!-- mouse activation -->
  onkeydown="if(event.key==='Enter'||event.key===' ')save()"> <!-- keyboard activation -->
  Save
</div>` }
    ],
    roadmap: ['Document outline', 'Landmarks', 'Forms & labels', 'Native interactive elements', 'SEO meta tags'],
    related: ['a11y-aria', 'css-layout']
  },
  {
    id: 'css-layout', cat: 'css', name: 'Flexbox vs Grid', level: 'Beginner',
    oneLiner: 'Flexbox lays items out along ONE axis; Grid lays them out in TWO dimensions (rows and columns).',
    explanation: `Flexbox is content-first: items size themselves and wrap along a row or column. Ideal for nav bars, button groups, centring, and distributing space.

Grid is layout-first: you define tracks (grid-template-columns/rows) and place items into them. Ideal for page layouts, card galleries, dashboards. repeat(auto-fill, minmax(200px, 1fr)) creates responsive grids with no media queries. subgrid lets nested grids align to the parent's tracks.

The box model underpins both: content + padding + border + margin; box-sizing: border-box makes width include padding and border.`,
    diagram: `flowchart LR
  Q{"Layout in one direction?"} -- Yes --> FX["Flexbox: navbars, toolbars, centring"]
  Q -- "No: rows AND columns" --> GR["Grid: pages, galleries, dashboards"]
  GR --> SG["subgrid for aligned nested cards"]`,
    code: { lang: 'css', src: `*, *::before, *::after { box-sizing: border-box; } /* width now includes padding + border */

.toolbar {                         /* a horizontal bar of buttons */
  display: flex;                   /* turn on flexbox layout */
  align-items: center;             /* vertical centring on the cross axis */
  justify-content: space-between;  /* push items to both ends on the main axis */
  gap: 12px;                       /* space between items, no margin hacks */
}

.cards {                           /* responsive card gallery */
  display: grid;                   /* turn on grid layout */
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* as many 220px+ columns as fit */
  gap: 16px;                       /* row and column gap */
}

.center {                          /* the famous perfect centring */
  display: grid;                   /* grid container */
  place-items: center;             /* shorthand: align-items + justify-items = center */
  min-height: 100dvh;              /* dynamic viewport height: correct on mobile browsers */
}` },
    interview: [
      { q: 'When Flexbox vs Grid?', a: 'Flexbox for one-dimensional alignment driven by content; Grid for two-dimensional layouts driven by structure. They are often combined.' },
      { q: 'What does flex: 1 mean?', a: 'flex-grow: 1, flex-shrink: 1, flex-basis: 0% — the item takes an equal share of free space.' },
      { q: 'auto-fill vs auto-fit?', a: 'Both create as many tracks as fit; auto-fit collapses empty tracks so items stretch, auto-fill keeps empty tracks.' }
    ],
    coding: [
      { q: 'Holy-grail layout with Grid.', a: `.page {                                     /* whole page container */
  display: grid;                             /* grid layout */
  grid-template: "head head" auto "nav main" 1fr "foot foot" auto / 200px 1fr; /* areas / columns */
  min-height: 100dvh;                        /* full viewport height */
}
header { grid-area: head; }                  /* place header into the 'head' area */
nav    { grid-area: nav; }                   /* sidebar */
main   { grid-area: main; }                  /* content */
footer { grid-area: foot; }                  /* footer */` }
    ],
    roadmap: ['Box model', 'Display & positioning', 'Flexbox', 'Grid', 'Subgrid', 'Container queries'],
    related: ['css-modern', 'html-semantic']
  },
  {
    id: 'css-modern', cat: 'css', name: 'Modern CSS: Container Queries, :has(), Nesting, Layers, View Transitions', level: 'Advanced',
    oneLiner: 'New native CSS features that replace many JS and preprocessor tricks.',
    explanation: `Container queries (@container) style a component based on ITS container size, not the viewport — true reusable components.
:has() is the "parent selector": .card:has(img) styles cards that contain an image; form:has(:invalid) styles forms with errors.
Native nesting lets you write .card { &:hover { … } } without Sass.
Cascade layers (@layer reset, base, components, utilities) control priority independent of specificity.
Custom properties (--brand) are runtime variables, ideal for theming and dark mode.
View Transitions API animates between DOM states or even page navigations with document.startViewTransition() / @view-transition.
Also: scroll-driven animations (animation-timeline: scroll()), anchor positioning, color-mix(), light-dark(), text-wrap: balance.`,
    diagram: `flowchart TD
  C["Card component"] --> CQ{"@container width > 400px?"}
  CQ -- Yes --> H["Horizontal layout"]
  CQ -- No --> V["Stacked layout"]
  C --> HS{":has(img)?"}
  HS -- Yes --> I["Image card styling"]`,
    code: { lang: 'css', src: `@layer reset, base, components;            /* declare layer order: later layers win */

:root {                                     /* global design tokens */
  --brand: oklch(70% 0.15 160);             /* modern perceptual colour space */
  color-scheme: light dark;                 /* enables light-dark() and native dark UI */
}

@layer components {                         /* put component styles in their layer */
  .card-wrap { container-type: inline-size; } /* make this element a size container */

  .card {                                   /* the component */
    display: grid;                          /* stacked by default */
    gap: 8px;                               /* spacing */
    background: light-dark(#fff, #1b1f2a);  /* picks a colour per colour scheme */
    &:hover { outline: 2px solid var(--brand); } /* native nesting: & = .card */
    &:has(img) { padding-top: 0; }          /* parent selector: card that contains an image */
  }

  @container (min-width: 420px) {           /* applies when .card-wrap is at least 420px wide */
    .card { grid-template-columns: 120px 1fr; } /* switch to horizontal layout */
  }
}

h2 { text-wrap: balance; }                  /* evenly balanced multi-line headings */` },
    interview: [
      { q: 'Media queries vs container queries?', a: 'Media queries react to the viewport; container queries react to the size of a component\'s container, making components portable.' },
      { q: 'What problem do cascade layers solve?', a: 'Specificity wars: layer order decides precedence first, so utilities can override components without !important.' },
      { q: 'What is :has()?', a: 'A relational pseudo-class that matches an element if it contains (or is followed by) something matching the inner selector.' }
    ],
    coding: [
      { q: 'Animate a page update with the View Transitions API.', a: `function updateView(render) {                 // render = function that changes the DOM
  if (!document.startViewTransition) return render(); // fallback for older browsers
  document.startViewTransition(() => render());     // browser snapshots old/new and cross-fades
}                                                   // end updateView` }
    ],
    roadmap: ['Custom properties', 'Nesting', ':has()', 'Container queries', 'Cascade layers', 'View Transitions & scroll animations'],
    related: ['css-layout', 'perf-core-web-vitals']
  },
  {
    id: 'jquery-basics', cat: 'jquery', name: 'jQuery Selectors, Events & Migration to Vanilla JS', level: 'Beginner',
    oneLiner: 'jQuery wraps DOM elements in a chainable object for selection, events and AJAX; modern browsers provide native equivalents.',
    explanation: `$(selector) returns a jQuery collection; methods apply to every element and return the collection for chaining. .on('click', '.child', fn) uses event delegation. $.ajax / $.getJSON handle HTTP.

Many enterprise and legacy apps (including CMS and Adobe-based sites) still use jQuery, so you must read it. For new code, native APIs cover nearly everything: querySelectorAll, classList, addEventListener, fetch, element.animate.

Migration strategy: wrap legacy widgets, replace page by page, and stop adding new jQuery dependencies. jQuery 4 removed many deprecated APIs and old-browser support.`,
    diagram: `flowchart LR
  J1["$('.btn')"] --> N1["document.querySelectorAll('.btn')"]
  J2[".addClass('on')"] --> N2["classList.add('on')"]
  J3[".on('click', fn)"] --> N3["addEventListener('click', fn)"]
  J4["$.ajax"] --> N4["fetch"]`,
    code: { lang: 'javascript', src: `// jQuery version
$(function () {                                    // shorthand for document ready
  $('#list').on('click', 'li', function () {       // delegated: works for li items added later
    $(this).toggleClass('done');                   // 'this' = clicked li; toggle a CSS class
  });                                              // end handler
  $.getJSON('/api/todos', function (todos) {       // GET request expecting JSON
    todos.forEach((t) => $('#list').append('<li>' + t.title + '</li>')); // append items
  });                                              // end getJSON
});                                                // end ready

// Vanilla JS equivalent
document.addEventListener('DOMContentLoaded', async () => {  // DOM ready event
  const list = document.querySelector('#list');            // single element lookup
  list.addEventListener('click', (e) => {                  // one listener on the parent
    const li = e.target.closest('li');                     // find the clicked li (delegation)
    if (li) li.classList.toggle('done');                   // toggle class if an li was clicked
  });                                                      // end listener
  const todos = await fetch('/api/todos').then((r) => r.json()); // native HTTP
  todos.forEach((t) => {                                   // render each todo
    const li = document.createElement('li');               // create element safely
    li.textContent = t.title;                              // textContent avoids XSS
    list.append(li);                                       // add to the DOM
  });                                                      // end forEach
});                                                        // end ready` },
    interview: [
      { q: 'What is event delegation in jQuery?', a: '.on(event, childSelector, handler) attaches one listener to a parent and handles events from matching children, including future ones.' },
      { q: '$(document).ready vs window.onload?', a: 'ready fires when the DOM is parsed; load waits for images, styles and iframes too.' },
      { q: 'Why is .html() with user input dangerous?', a: 'It parses strings as HTML, enabling XSS. Use .text() or textContent for untrusted data.' }
    ],
    coding: [
      { q: 'Convert $(".item").hide() to vanilla JS.', a: `document.querySelectorAll('.item')          // all matching elements (NodeList)
  .forEach((el) => (el.style.display = 'none')); // hide each one` }
    ],
    roadmap: ['Selectors', 'DOM manipulation', 'Events & delegation', 'AJAX', 'Vanilla equivalents', 'Incremental migration'],
    related: ['webapi-event-delegation', 'sec-xss']
  },
  {
    id: 'state-redux-toolkit', cat: 'state', name: 'Redux Toolkit vs Zustand vs Context', level: 'Intermediate',
    oneLiner: 'Ways to share client state across components — Context for low-frequency values, Zustand for lightweight stores, Redux Toolkit for large, structured apps.',
    explanation: `Context passes a value down the tree without prop drilling, but every consumer re-renders when the value changes — fine for theme, auth user, locale.

Redux Toolkit (RTK) is the official Redux: createSlice generates actions + reducers, Immer lets you "mutate" drafts safely, DevTools give time-travel debugging, and RTK Query handles server data caching.

Zustand is a tiny hook-based store with selectors, so components subscribe only to the slice they use.

Rule of thumb: server data (API responses) belongs in TanStack Query / RTK Query, not in global client state.`,
    diagram: `flowchart TD
  Q{"What kind of state?"} -->|"Server data"| TQ["TanStack Query / RTK Query"]
  Q -->|"UI local"| LS["useState in component"]
  Q -->|"Shared, rarely changes"| CX["Context"]
  Q -->|"Shared, changes often"| Z["Zustand / Redux Toolkit"]
  Z --> L{"Large team, strict patterns, devtools?"}
  L -- Yes --> RTK["Redux Toolkit"]
  L -- No --> ZU["Zustand"]`,
    code: { lang: 'javascript', src: `import { createSlice, configureStore } from '@reduxjs/toolkit'; // RTK helpers

const cartSlice = createSlice({                    // creates reducer + action creators together
  name: 'cart',                                    // prefix for action types: 'cart/add'
  initialState: { items: [] },                     // starting state
  reducers: {                                      // case reducers
    add(state, action) {                           // action.payload = the product
      state.items.push(action.payload);            // looks like mutation; Immer makes it immutable
    },                                             // end add
    remove(state, action) {                        // payload = product id
      state.items = state.items.filter((i) => i.id !== action.payload); // replace array
    }                                              // end remove
  }                                                // end reducers
});                                                // end createSlice

export const { add, remove } = cartSlice.actions;  // auto-generated action creators
export const store = configureStore({              // store with DevTools + thunk by default
  reducer: { cart: cartSlice.reducer }             // mount the slice under state.cart
});                                                // end configureStore

// Zustand equivalent:
// const useCart = create((set) => ({ items: [], add: (p) => set((s) => ({ items: [...s.items, p] })) }));
// const count = useCart((s) => s.items.length);   // selector: re-render only when length changes` },
    interview: [
      { q: 'When is Context not enough?', a: 'When the value changes frequently and has many consumers — every consumer re-renders. Split contexts or use a selector-based store.' },
      { q: 'Why does RTK let you mutate state?', a: 'It uses Immer, which records changes on a draft and produces a new immutable state.' },
      { q: 'Client state vs server state?', a: 'Client state is owned by the UI (modals, filters). Server state is a cached copy of remote data that needs fetching, caching, revalidation — use a data-fetching library.' }
    ],
    coding: [
      { q: 'Read and dispatch in a component (React-Redux).', a: `const count = useSelector((s) => s.cart.items.length); // subscribe to one value
const dispatch = useDispatch();                         // get dispatch
<button onClick={() => dispatch(add(product))}>Add</button> // send an action` }
    ],
    roadmap: ['Props & lifting state', 'Context', 'Redux core concepts', 'Redux Toolkit', 'Zustand', 'TanStack Query'],
    related: ['state-tanstack-query', 'react-hooks-core']
  },
  {
    id: 'state-tanstack-query', cat: 'state', name: 'TanStack Query (Server State)', level: 'Intermediate',
    oneLiner: 'A library that fetches, caches, deduplicates, refetches and invalidates server data with simple hooks.',
    explanation: `useQuery({ queryKey, queryFn }) returns data, error and status flags. The queryKey is the cache identity — identical keys anywhere share one request and one cache entry.

staleTime controls how long data is considered fresh; gcTime controls how long unused data stays in memory. Data refetches on window focus, reconnect, or invalidation. useMutation handles writes, and queryClient.invalidateQueries({ queryKey }) refreshes affected data. Supports pagination, infinite queries, optimistic updates and prefetching (including for SSR).

It is available for React, Vue, Angular, Solid and Svelte.`,
    diagram: `flowchart LR
  C1["Component A useQuery todos"] --> K["Cache key: todos"]
  C2["Component B useQuery todos"] --> K
  K -->|"stale or missing"| F["Single fetch"]
  M["useMutation addTodo"] --> I["invalidateQueries todos"]
  I --> F`,
    code: { lang: 'jsx', src: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // hooks

function Todos() {                                       // component
  const qc = useQueryClient();                           // access the shared cache
  const { data, isPending, error } = useQuery({          // read server state
    queryKey: ['todos'],                                 // cache identity
    queryFn: () => fetch('/api/todos').then((r) => r.json()), // how to fetch
    staleTime: 60_000                                    // treat as fresh for 1 minute
  });                                                    // end useQuery
  const addTodo = useMutation({                          // write server state
    mutationFn: (title) => fetch('/api/todos', { method: 'POST', body: JSON.stringify({ title }) }), // request
    onSuccess: () => qc.invalidateQueries({ queryKey: ['todos'] }) // refetch list after success
  });                                                    // end useMutation
  if (isPending) return <p>Loading…</p>;                 // first load
  if (error) return <p>Error: {error.message}</p>;       // error UI
  return (                                               // success UI
    <>
      <button onClick={() => addTodo.mutate('New task')}>Add</button> {/* trigger mutation */}
      <ul>{data.map((t) => <li key={t.id}>{t.title}</li>)}</ul>       {/* render cached data */}
    </>
  );                                                     // end return
}                                                        // end Todos` },
    interview: [
      { q: 'staleTime vs gcTime?', a: 'staleTime: how long data is fresh (no refetch). gcTime: how long inactive cache entries are kept before garbage collection.' },
      { q: 'Why not store API data in Redux?', a: 'You would hand-write loading, caching, dedupe, refetch and invalidation logic that TanStack Query already provides.' }
    ],
    coding: [
      { q: 'Dependent query that waits for a user id.', a: `useQuery({                                  // query options
  queryKey: ['orders', userId],             // key includes the variable
  queryFn: () => getOrders(userId),         // fetch function
  enabled: !!userId                         // do not run until userId exists
});                                         // end useQuery` }
    ],
    roadmap: ['Fetching in effects (problems)', 'Query keys', 'Caching & staleness', 'Mutations & invalidation', 'Optimistic updates', 'SSR prefetch'],
    related: ['state-redux-toolkit', 'net-fetch-rest']
  },
  {
    id: 'webapi-event-delegation', cat: 'webapis', name: 'Event Bubbling, Capturing & Delegation', level: 'Beginner',
    oneLiner: 'Events travel down (capture) and up (bubble) the DOM; delegation uses one parent listener to handle many children.',
    explanation: `A DOM event has three phases: capturing (window → target), target, and bubbling (target → window). addEventListener listens in the bubbling phase by default; pass { capture: true } for capturing.

event.target is the element that was actually clicked; event.currentTarget is the element the listener is attached to. stopPropagation() stops further travel; preventDefault() stops the browser's default action (like following a link) — they are different.

Delegation: attach one listener to a container and use event.target.closest(selector). Fewer listeners, works for dynamically added elements. React itself delegates all events to the root container.`,
    diagram: `flowchart TD
  W["window"] -->|"1. capture"| D["document"]
  D -->|"capture"| UL["ul"]
  UL -->|"capture"| LI["li: target"]
  LI -->|"2. bubble"| UL2["ul — delegated listener here"]
  UL2 -->|"bubble"| D2["document"]`,
    code: { lang: 'javascript', src: `const menu = document.querySelector('#menu');       // the parent container

menu.addEventListener('click', (event) => {           // ONE listener for all items
  const item = event.target.closest('[data-action]'); // walk up from the click to an action element
  if (!item || !menu.contains(item)) return;          // ignore clicks outside action items
  event.preventDefault();                             // stop default behaviour (e.g. link navigation)
  const action = item.dataset.action;                 // read data-action="..." attribute
  console.log('Run', action);                         // handle the action
});                                                   // end listener

// Capturing example: runs BEFORE child handlers
document.addEventListener('click', () => console.log('capture first'), { capture: true }); // capture phase` },
    interview: [
      { q: 'target vs currentTarget?', a: 'target is the originating element; currentTarget is the element whose listener is running.' },
      { q: 'stopPropagation vs preventDefault?', a: 'stopPropagation halts the event travelling to other elements; preventDefault cancels the browser default action.' },
      { q: 'Which events do not bubble?', a: 'focus, blur, mouseenter, mouseleave, load, scroll (on elements). Use focusin/focusout for bubbling focus events.' }
    ],
    coding: [
      { q: 'Remove an event listener properly.', a: `function onResize() { console.log(innerWidth); }  // named function (same reference needed)
window.addEventListener('resize', onResize);       // add
window.removeEventListener('resize', onResize);    // remove with the SAME function reference
// Modern: const ac = new AbortController(); addEventListener('resize', fn, { signal: ac.signal }); ac.abort();` }
    ],
    roadmap: ['DOM events', 'Phases', 'target vs currentTarget', 'Delegation', 'Passive & once options', 'AbortSignal for listeners'],
    related: ['jquery-basics', 'js-event-loop']
  },
  {
    id: 'webapi-observers', cat: 'webapis', name: 'IntersectionObserver, ResizeObserver & MutationObserver', level: 'Intermediate',
    oneLiner: 'Efficient browser APIs that notify you when elements enter the viewport, change size, or change in the DOM.',
    explanation: `IntersectionObserver fires when a target's visibility crosses a threshold relative to the viewport or a root element — used for lazy loading, infinite scroll, analytics impressions and scroll-triggered animations, without scroll listeners.

ResizeObserver reports element size changes (not just window resize) — useful for responsive components and charts.

MutationObserver watches DOM changes (children, attributes, text) — useful for third-party widgets, A/B testing and personalisation tools (like Adobe Target) that inject content.

All run asynchronously and off the hot scroll path, so they are far cheaper than polling or scroll handlers.`,
    diagram: `flowchart LR
  S["User scrolls"] --> IO["IntersectionObserver checks visibility"]
  IO -->|"isIntersecting"| L["Load next page / image"]
  RZ["Element resized"] --> RO["ResizeObserver"] --> CH["Re-layout chart"]
  DM["DOM changed"] --> MO["MutationObserver"] --> RE["React to injected content"]`,
    code: { lang: 'javascript', src: `const sentinel = document.querySelector('#load-more');  // invisible div at the list bottom

const io = new IntersectionObserver((entries) => {      // callback receives a list of entries
  entries.forEach((entry) => {                          // one entry per observed element
    if (entry.isIntersecting) {                         // the sentinel became visible
      loadNextPage();                                   // fetch and append more items
    }                                                   // end if
  });                                                   // end forEach
}, {                                                    // options object
  rootMargin: '200px',                                  // trigger 200px BEFORE it is visible
  threshold: 0                                          // any pixel visible counts
});                                                     // end constructor

io.observe(sentinel);                                   // start watching
// io.disconnect();                                     // stop watching everything (cleanup)

const ro = new ResizeObserver(([entry]) => {            // destructure the first entry
  console.log('width', entry.contentRect.width);        // new content-box width
});                                                     // end ResizeObserver
ro.observe(document.querySelector('.chart'));           // watch the chart container` },
    interview: [
      { q: 'Why IntersectionObserver over scroll events?', a: 'It is async and browser-optimised, avoiding layout thrashing and main-thread work on every scroll frame.' },
      { q: 'Use-cases for MutationObserver?', a: 'Reacting to DOM changes from third-party scripts, personalisation/A-B testing injections, or legacy code you cannot modify.' }
    ],
    coding: [
      { q: 'Lazy-load images with IntersectionObserver.', a: `const io = new IntersectionObserver((entries, obs) => { // observer with access to itself
  entries.forEach((e) => {                              // each image entry
    if (!e.isIntersecting) return;                      // skip if not visible
    e.target.src = e.target.dataset.src;                // swap in the real image URL
    obs.unobserve(e.target);                            // stop watching this image
  });                                                   // end forEach
});                                                     // end observer
document.querySelectorAll('img[data-src]').forEach((img) => io.observe(img)); // observe all
// Simpler today: <img loading="lazy" src="..."> for most cases.` }
    ],
    roadmap: ['Scroll events (and their cost)', 'IntersectionObserver', 'ResizeObserver', 'MutationObserver', 'PerformanceObserver'],
    related: ['perf-core-web-vitals', 'webapi-event-delegation']
  },
  {
    id: 'webapi-workers', cat: 'webapis', name: 'Web Workers & Service Workers', level: 'Advanced',
    oneLiner: 'Web Workers run JS on a background thread; Service Workers sit between your app and the network for caching, offline and push.',
    explanation: `Web Worker: a separate thread with its own event loop and no DOM access. Communicates via postMessage (structured clone) or transferable objects. Use it for CPU-heavy work — parsing big files, image processing, search indexing, running on-device AI — so the UI stays responsive.

Service Worker: an event-driven worker registered for a scope. It intercepts fetch requests, enabling caching strategies (cache-first, network-first, stale-while-revalidate), offline mode, background sync and push notifications. It requires HTTPS and has its own lifecycle (install → activate → fetch). It is the core of a PWA.`,
    diagram: `flowchart LR
  UI["Main thread: UI"] -- postMessage --> WW["Web Worker: heavy compute"]
  WW -- result --> UI
  UI -- fetch --> SW["Service Worker"]
  SW -->|"cache hit"| C["Cache Storage"]
  SW -->|"miss"| N["Network"]`,
    code: { lang: 'javascript', src: `// main.js — start a worker for heavy work
const worker = new Worker(new URL('./primes.worker.js', import.meta.url), { type: 'module' }); // module worker
worker.postMessage({ limit: 5_000_000 });           // send input (copied via structured clone)
worker.onmessage = (e) => {                         // receive results
  console.log('primes found:', e.data.count);       // UI thread was never blocked
};                                                  // end handler

// primes.worker.js — runs on a background thread
self.onmessage = (e) => {                           // 'self' is the worker global scope
  const { limit } = e.data;                         // read the input
  let count = 0;                                    // result counter
  for (let n = 2; n < limit; n++) {                 // CPU-heavy loop
    let prime = true;                               // assume prime
    for (let d = 2; d * d <= n; d++) {              // trial division up to sqrt(n)
      if (n % d === 0) { prime = false; break; }    // divisible → not prime
    }                                               // end inner loop
    if (prime) count++;                             // count primes
  }                                                 // end outer loop
  self.postMessage({ count });                      // send the result back
};                                                  // end onmessage` },
    interview: [
      { q: 'Can a Web Worker access the DOM?', a: 'No. It can use fetch, timers, IndexedDB, WebSockets, OffscreenCanvas, but must message the main thread for DOM updates.' },
      { q: 'Service worker lifecycle?', a: 'register → install (pre-cache) → waiting → activate (clean old caches) → controls pages and handles fetch/push events.' },
      { q: 'What is stale-while-revalidate?', a: 'Serve the cached response immediately, then fetch a fresh copy in the background to update the cache for next time.' }
    ],
    coding: [
      { q: 'Register a service worker.', a: `if ('serviceWorker' in navigator) {                 // feature detection
  window.addEventListener('load', () => {           // wait so registration doesn't slow first load
    navigator.serviceWorker.register('/sw.js');     // scope defaults to the file's folder
  });                                               // end load
}                                                   // end if` }
    ],
    roadmap: ['Main thread limits', 'Web Workers', 'Transferables & SharedArrayBuffer', 'Service Worker lifecycle', 'Caching strategies', 'Push & background sync'],
    related: ['js-event-loop', 'pwa-installable', 'ai-on-device']
  }
];
