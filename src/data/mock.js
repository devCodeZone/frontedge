// mock.js — MCQ bank, experience profiles and company interview patterns for Mock Tests.
// Row format: [category, level, question, [4 options], correctIndex, explanation]
// level: 0 = Fresher, 1 = Junior (1–3 yrs), 2 = Mid (3–6 yrs), 3 = Senior / Lead (6+ yrs)

const RAW = [
  // ---------- JavaScript ----------
  ['javascript', 0, 'What does typeof null return?', ['"null"', '"object"', '"undefined"', '"number"'], 1, 'A historic bug kept for compatibility: typeof null === "object".'],
  ['javascript', 0, 'Which keyword declares a block-scoped variable that cannot be reassigned?', ['var', 'let', 'const', 'static'], 2, 'const is block-scoped and cannot be reassigned (object contents can still change).'],
  ['javascript', 0, 'What is the result of 0.1 + 0.2 === 0.3?', ['true', 'false', 'TypeError', 'undefined'], 1, 'Floating-point precision: 0.1 + 0.2 is 0.30000000000000004.'],
  ['javascript', 0, 'What does [] + [] evaluate to?', ['[]', '0', '"" (empty string)', 'NaN'], 2, 'Both arrays convert to empty strings, so concatenation gives "".'],
  ['javascript', 0, 'Which method creates a NEW array with transformed items?', ['forEach', 'map', 'push', 'splice'], 1, 'map returns a new array; forEach returns undefined.'],
  ['javascript', 1, 'Order of output: setTimeout(A,0); Promise.resolve().then(B); console.log(C)?', ['A B C', 'C A B', 'C B A', 'B C A'], 2, 'Sync first (C), then microtasks (B), then macrotasks (A).'],
  ['javascript', 1, 'What does a closure capture?', ['A copy of variable values', 'References to variables in its lexical scope', 'Only global variables', 'The call stack'], 1, 'Closures keep live references to outer variables, not snapshots.'],
  ['javascript', 1, 'Accessing a let variable before its declaration throws because of…', ['Hoisting to undefined', 'The Temporal Dead Zone', 'Strict mode', 'Garbage collection'], 1, 'let/const are hoisted but uninitialised until their declaration line (TDZ).'],
  ['javascript', 1, 'Which Promise method resolves when ALL settle, regardless of rejection?', ['Promise.all', 'Promise.race', 'Promise.allSettled', 'Promise.any'], 2, 'allSettled waits for every promise and reports each outcome.'],
  ['javascript', 1, 'In strict mode, what is `this` inside a plain function call fn()?', ['window', 'globalThis', 'undefined', 'the function'], 2, 'Default binding is undefined in strict mode.'],
  ['javascript', 1, 'Which is true about arrow functions?', ['They have their own this', 'They can be used with new', 'They inherit this lexically', 'They have an arguments object'], 2, 'Arrows capture this from the enclosing scope and cannot be constructors.'],
  ['javascript', 1, 'What does Object.freeze do to nested objects?', ['Freezes them deeply', 'Nothing — it is shallow', 'Deletes them', 'Makes them read-only strings'], 1, 'Object.freeze is shallow; nested objects stay mutable.'],
  ['javascript', 2, 'Debounce is the best fit for…', ['Scroll position tracking', 'Search-as-you-type API calls', 'requestAnimationFrame loops', 'Drag handlers'], 1, 'Debounce fires once after the user stops typing.'],
  ['javascript', 2, 'Which array method does NOT mutate the original array?', ['sort', 'reverse', 'toSorted', 'splice'], 2, 'toSorted (ES2023) returns a new sorted copy.'],
  ['javascript', 2, 'What does Object.groupBy return?', ['A Map', 'An array of arrays', 'A null-prototype object of arrays', 'A Set'], 2, 'Object.groupBy returns a null-prototype object; Map.groupBy returns a Map.'],
  ['javascript', 2, 'A common cause of memory leaks in SPAs is…', ['Using const', 'Forgotten event listeners and timers', 'Using arrow functions', 'Using modules'], 1, 'Listeners/intervals that are never removed keep references alive.'],
  ['javascript', 3, 'WeakMap keys must be…', ['Strings', 'Objects (or non-registered symbols)', 'Numbers', 'Any primitive'], 1, 'WeakMap holds keys weakly so they can be garbage-collected; keys must be objects.'],
  ['javascript', 3, 'Which ES2025 feature adds union/intersection operations?', ['Array.prototype.union', 'Set methods', 'Object.merge', 'Iterator.union'], 1, 'Set.prototype.union, intersection, difference etc. landed in ES2025.'],

  // ---------- TypeScript ----------
  ['typescript', 1, 'Which type must be narrowed before use?', ['any', 'unknown', 'never', 'object'], 1, 'unknown is type-safe; you must narrow it first.'],
  ['typescript', 1, 'Partial<User> makes…', ['All props required', 'All props optional', 'All props readonly', 'Removes all props'], 1, 'Partial maps every property to optional.'],
  ['typescript', 2, 'What does K extends keyof T ensure?', ['K is a number', 'K is one of T\'s property names', 'K is a subtype of T', 'K is optional'], 1, 'keyof T is the union of T\'s keys.'],
  ['typescript', 2, 'Omit<T, K> vs Exclude<U, M>?', ['Same thing', 'Omit works on object keys, Exclude on unions', 'Exclude works on objects', 'Both work only on strings'], 1, 'Omit removes keys from object types; Exclude removes union members.'],
  ['typescript', 2, 'The satisfies operator…', ['Casts a value', 'Checks a type without widening inference', 'Creates an interface', 'Runs at runtime'], 1, 'satisfies validates while keeping the narrow inferred type.'],
  ['typescript', 3, 'In conditional types, infer is used to…', ['Import types', 'Capture a type into a variable', 'Make types optional', 'Convert to any'], 1, 'infer captures part of a matched type, e.g. Promise<infer V>.'],

  // ---------- React ----------
  ['react', 0, 'What must a React component name start with?', ['Lowercase letter', 'Capital letter', 'Underscore', 'Dollar sign'], 1, 'Lowercase tags are treated as HTML elements.'],
  ['react', 0, 'Which hook stores state in a function component?', ['useRef', 'useState', 'useMemo', 'useId'], 1, 'useState returns [value, setter].'],
  ['react', 1, 'Why should list keys be stable ids rather than indexes?', ['Faster rendering always', 'Index keys break state when items reorder', 'Keys are required by JSX syntax', 'Index keys cause syntax errors'], 1, 'Reordering with index keys reuses the wrong DOM/state.'],
  ['react', 1, 'When does useEffect with [] run?', ['Before render', 'After the first render (and cleanup on unmount)', 'On every render', 'Never'], 1, 'An empty dependency array runs once after mount.'],
  ['react', 1, 'Why does an effect run twice in development?', ['A bug in React', 'Strict Mode re-mounts to expose missing cleanups', 'Hot reload', 'Two React copies'], 1, 'Strict Mode intentionally mounts → unmounts → mounts in dev.'],
  ['react', 1, 'setCount(count + 1) twice in one handler increments by…', ['2', '1', '0', 'Depends on browser'], 1, 'Both read the same stale count; use setCount(c => c + 1).'],
  ['react', 2, 'useCallback is mainly useful when…', ['Any function is defined', 'Passing callbacks to memoised children or effect deps', 'Fetching data', 'Using refs'], 1, 'It stabilises function identity for memo/effects.'],
  ['react', 2, 'What does the React Compiler do?', ['Converts JSX to HTML', 'Automatically memoises components and hooks', 'Replaces Webpack', 'Adds TypeScript'], 1, 'It inserts memoisation at build time.'],
  ['react', 2, 'Which hook returns [state, formAction, isPending]?', ['useFormStatus', 'useActionState', 'useOptimistic', 'useTransition'], 1, 'React 19 useActionState.'],
  ['react', 2, 'Server Components can NOT…', ['Be async', 'Read a database', 'Use useState', 'Render client components'], 2, 'State and effects require client components.'],
  ['react', 3, 'Which hook can be called conditionally?', ['useState', 'useEffect', 'use', 'useMemo'], 2, 'use() can be called in conditions and loops.'],
  ['react', 3, 'What enables React to interrupt rendering for urgent updates?', ['Virtual DOM', 'Fiber + concurrent rendering', 'Synthetic events', 'PropTypes'], 1, 'Fiber splits work into interruptible units.'],

  // ---------- Next.js ----------
  ['nextjs', 1, 'In the App Router, components are by default…', ['Client components', 'Server components', 'Static HTML only', 'Web components'], 1, 'Add "use client" to opt into client components.'],
  ['nextjs', 2, 'export const revalidate = 60 gives you…', ['SSR on every request', 'ISR: regenerate at most every 60 s', 'CSR', 'A 60 s timeout'], 1, 'Time-based incremental static regeneration.'],
  ['nextjs', 2, 'Server Actions should always…', ['Skip validation', 'Validate input and check auth', 'Run in the browser', 'Use GET'], 1, 'They are public POST endpoints.'],
  ['nextjs', 3, 'Partial Prerendering means…', ['Only half the page renders', 'A static shell with streamed dynamic holes', 'Client-only rendering', 'Rendering at build only'], 1, 'Static shell served instantly; dynamic parts stream via Suspense.'],

  // ---------- Angular ----------
  ['angular', 0, 'Which decorator defines an Angular component?', ['@Injectable', '@Component', '@NgModule', '@Directive'], 1, '@Component adds selector, template and styles.'],
  ['angular', 1, 'How do you read a signal named count?', ['count.value', 'count()', 'count.get', '$count'], 1, 'Signals are read by calling them.'],
  ['angular', 1, 'Which operator cancels the previous inner observable?', ['mergeMap', 'concatMap', 'switchMap', 'exhaustMap'], 2, 'switchMap unsubscribes from the previous inner stream.'],
  ['angular', 1, 'The async pipe…', ['Only works with promises', 'Subscribes and unsubscribes automatically', 'Blocks rendering', 'Converts to signals'], 1, 'It manages subscription lifecycle in templates.'],
  ['angular', 2, 'providedIn: "root" creates…', ['A new instance per component', 'A tree-shakable singleton', 'A module', 'A pipe'], 1, 'Singleton in the root injector, removed if unused.'],
  ['angular', 2, 'Which new control-flow block requires a track expression?', ['@if', '@switch', '@for', '@defer'], 2, '@for needs track for efficient diffing.'],
  ['angular', 3, 'Zoneless change detection relies on…', ['Zone.js patches', 'Signals, events and explicit scheduling', 'setInterval polling', 'NgModules'], 1, 'Without Zone.js, signals notify Angular of changes.'],
  ['angular', 3, 'exhaustMap is ideal for…', ['Typeahead search', 'Preventing duplicate login submissions', 'Parallel uploads', 'Ordered saves'], 1, 'It ignores new emissions while the current one runs.'],

  // ---------- Vue / jQuery ----------
  ['vue', 1, 'In Vue 3 script, how do you read a ref named count?', ['count', 'count.value', 'count()', '$count'], 1, 'Refs need .value in script; templates auto-unwrap.'],
  ['vue', 2, 'Destructuring a reactive() object…', ['Keeps reactivity', 'Loses reactivity unless toRefs is used', 'Throws an error', 'Creates a computed'], 1, 'Use toRefs to keep reactive bindings.'],
  ['jquery', 0, '$(document).ready fires when…', ['All images load', 'The DOM is parsed', 'The user clicks', 'CSS loads'], 1, 'Ready = DOMContentLoaded; load waits for all resources.'],
  ['jquery', 1, 'Delegated events in jQuery use…', ['.bind', '.on(event, selector, fn)', '.live', '.click'], 1, '.on with a selector delegates to matching descendants.'],

  // ---------- HTML / CSS / a11y ----------
  ['html', 0, 'Which element should wrap the main unique content of a page?', ['<section>', '<main>', '<div>', '<article>'], 1, 'One <main> landmark per page.'],
  ['html', 0, 'Which attribute lazy-loads images natively?', ['defer', 'async', 'loading="lazy"', 'lazy="true"'], 2, 'loading="lazy" defers offscreen images.'],
  ['html', 1, 'Which native element provides a modal with focus handling?', ['<modal>', '<dialog>', '<popup>', '<aside>'], 1, 'dialog.showModal() opens a top-layer modal.'],
  ['css', 0, 'box-sizing: border-box means width includes…', ['Only content', 'Content + padding + border', 'Margin too', 'Nothing'], 1, 'Padding and border are inside the declared width.'],
  ['css', 0, 'Which has the highest specificity?', ['.class', '#id', 'element', '*'], 1, 'IDs outrank classes and elements.'],
  ['css', 1, 'Best tool for a 2-D page layout?', ['Flexbox', 'Grid', 'Floats', 'Tables'], 1, 'Grid handles rows and columns together.'],
  ['css', 2, 'Container queries respond to…', ['Viewport width', 'The size of an ancestor container', 'Device type', 'User preferences'], 1, '@container uses the container\'s size.'],
  ['css', 2, 'The :has() pseudo-class lets you…', ['Select children only', 'Style an element based on what it contains', 'Check browser support', 'Import CSS'], 1, 'It acts as a parent/relational selector.'],
  ['css', 3, 'Cascade layers decide precedence…', ['By specificity first', 'By layer order before specificity', 'By file size', 'By !important only'], 1, 'Layer order is evaluated before specificity.'],
  ['a11y', 1, 'The first rule of ARIA is…', ['Always add roles', 'Use native HTML when possible', 'Hide decorative text', 'Use aria-label everywhere'], 1, 'Native semantics beat ARIA.'],
  ['a11y', 1, 'Minimum contrast ratio for normal text (WCAG AA)?', ['3:1', '4.5:1', '7:1', '2:1'], 1, '4.5:1 for body text, 3:1 for large text.'],
  ['a11y', 2, 'aria-live="polite" means…', ['Announce immediately', 'Announce when the user is idle', 'Never announce', 'Only on focus'], 1, 'Polite updates wait for a pause.'],

  // ---------- Web APIs / Networking ----------
  ['webapis', 0, 'Which storage is cleared when the tab closes?', ['localStorage', 'sessionStorage', 'IndexedDB', 'Cookies'], 1, 'sessionStorage is per tab session.'],
  ['webapis', 1, 'event.target vs event.currentTarget?', ['Same thing', 'target = origin element, currentTarget = listener element', 'currentTarget = origin', 'target is always document'], 1, 'Key to event delegation.'],
  ['webapis', 1, 'Best API to detect an element entering the viewport?', ['scroll event', 'IntersectionObserver', 'MutationObserver', 'requestIdleCallback'], 1, 'Async, efficient visibility detection.'],
  ['webapis', 2, 'Web Workers can NOT access…', ['fetch', 'the DOM', 'IndexedDB', 'timers'], 1, 'Workers have no DOM access.'],
  ['webapis', 2, 'Service workers require…', ['HTTP only', 'HTTPS (or localhost)', 'A backend in Node', 'WebSockets'], 1, 'Secure context required.'],
  ['networking', 0, 'Which status code means "Created"?', ['200', '201', '204', '301'], 1, '201 is returned after creating a resource.'],
  ['networking', 1, 'Does fetch reject on a 404 response?', ['Yes', 'No — check response.ok', 'Only in Chrome', 'Only for POST'], 1, 'fetch rejects only on network failure/abort.'],
  ['networking', 1, '401 vs 403?', ['Same', '401 unauthenticated, 403 forbidden', '401 forbidden, 403 not found', 'Both server errors'], 1, '401 = who are you; 403 = not allowed.'],
  ['networking', 2, 'CORS is enforced by…', ['The server', 'The browser', 'The CDN', 'DNS'], 1, 'Servers send headers; browsers enforce.'],
  ['networking', 2, 'Which request triggers a CORS preflight?', ['Simple GET', 'POST with Content-Type: application/json', 'Image load', 'Form POST with text/plain'], 1, 'Non-simple content types trigger OPTIONS.'],
  ['networking', 2, 'Safest place for a session token?', ['localStorage', 'HttpOnly Secure SameSite cookie', 'URL query string', 'window variable shared across tabs'], 1, 'HttpOnly cookies are not readable by JS.'],
  ['networking', 3, 'For one-way server-to-client streaming (e.g. AI tokens), the simplest option is…', ['WebSocket', 'SSE / streamed fetch', 'Long polling', 'WebRTC'], 1, 'SSE/streamed fetch over plain HTTP.'],

  // ---------- Performance / Security / Testing / Tooling ----------
  ['performance', 1, 'Which metric replaced FID as a Core Web Vital?', ['TTFB', 'INP', 'FCP', 'TBT'], 1, 'INP since March 2024.'],
  ['performance', 1, 'A "good" LCP is at most…', ['1 s', '2.5 s', '4 s', '6 s'], 1, '≤ 2.5 s at the 75th percentile.'],
  ['performance', 2, 'Main fix for CLS from images?', ['Lazy-load everything', 'Set width/height or aspect-ratio', 'Use PNG', 'Inline SVG'], 1, 'Reserving space prevents layout shifts.'],
  ['performance', 2, 'Tree shaking works best with…', ['CommonJS require', 'ES module named imports', 'Global scripts', 'eval'], 1, 'Static ESM imports are analysable.'],
  ['performance', 3, 'A long task is a main-thread task longer than…', ['16 ms', '50 ms', '100 ms', '1 s'], 1, 'Tasks over 50 ms delay input handling.'],
  ['security', 1, 'Which is safest for inserting user text into the DOM?', ['innerHTML', 'textContent', 'document.write', 'outerHTML'], 1, 'textContent never parses HTML.'],
  ['security', 2, 'SameSite=Lax cookies mainly defend against…', ['XSS', 'CSRF', 'SQL injection', 'DDoS'], 1, 'They are not sent on cross-site POSTs.'],
  ['security', 2, 'Content Security Policy helps reduce…', ['CSRF', 'XSS impact', 'Slow LCP', 'CORS errors'], 1, 'CSP restricts which scripts can run.'],
  ['testing', 1, 'Testing Library recommends querying by…', ['CSS class', 'Role and accessible name', 'Component instance', 'XPath'], 1, 'Mirrors how users find elements.'],
  ['testing', 2, 'MSW mocks APIs at the…', ['Component level', 'Network request level', 'Database level', 'Compiler level'], 1, 'It intercepts requests via a service worker / Node interceptors.'],
  ['tooling', 1, 'npm ci differs from npm install because it…', ['Updates packages', 'Installs exactly from the lockfile', 'Skips devDependencies always', 'Publishes the package'], 1, 'Deterministic installs for CI.'],
  ['tooling', 2, 'Why is Vite\'s dev server fast?', ['It bundles everything with Webpack', 'It serves native ESM on demand', 'It caches in the cloud', 'It skips JavaScript'], 1, 'No full bundle in dev.'],
  ['tooling', 3, 'Module Federation is commonly used for…', ['CSS modules', 'Micro-frontends sharing code at runtime', 'Type checking', 'Linting'], 1, 'Separately deployed builds share modules.'],
  ['state', 1, 'Redux Toolkit lets you write "mutating" reducers because of…', ['Proxies in the browser', 'Immer', 'Signals', 'Zone.js'], 1, 'Immer produces immutable updates from drafts.'],
  ['state', 2, 'Server data (API responses) is best managed with…', ['Global Redux slice for everything', 'TanStack Query / RTK Query', 'localStorage', 'Context only'], 1, 'They handle caching, dedupe and invalidation.'],
  ['sysdesign', 3, 'For an infinite news feed, which pagination is more robust?', ['Offset', 'Cursor-based', 'Random', 'Page numbers only'], 1, 'Cursors stay stable when items are inserted.'],
  ['sysdesign', 3, 'Micro-frontends are most justified when…', ['A solo developer builds an MVP', 'Many teams need independent releases', 'The app has 3 pages', 'SEO is the only goal'], 1, 'They trade complexity for team autonomy.'],
  ['devops', 1, 'Rebasing a shared public branch is…', ['Recommended', 'Risky — it rewrites shared history', 'Required', 'Impossible'], 1, 'Others\' history diverges; prefer merge/revert.'],
  ['pwa', 1, 'Which file makes a web app installable alongside a service worker?', ['robots.txt', 'manifest.webmanifest', 'sitemap.xml', '.htaccess'], 1, 'The manifest describes name, icons, start URL.'],

  // ---------- AI-Integrated Frontend ----------
  ['ai', 0, 'Where should an LLM API secret key live?', ['In React state', 'In a server/serverless env variable', 'In localStorage', 'In a VITE_ env var'], 1, 'Anything in the client bundle is public.'],
  ['ai', 0, 'Lower temperature generally makes output…', ['More random', 'More focused and consistent', 'Longer', 'Multimodal'], 1, 'Temperature controls sampling randomness.'],
  ['ai', 1, 'A token is roughly…', ['One sentence', 'A word piece (~¾ of an English word)', 'One byte', 'One paragraph'], 1, 'Tokens are sub-word units used for billing and limits.'],
  ['ai', 1, 'Why stream LLM responses?', ['Cheaper tokens', 'Faster time-to-first-token / better perceived speed', 'Better accuracy', 'Required by HTTP'], 1, 'Users see text immediately and can stop early.'],
  ['ai', 1, 'To cancel a streaming fetch you use…', ['clearTimeout', 'AbortController', 'Promise.race only', 'window.stop'], 1, 'Pass signal to fetch and call abort().'],
  ['ai', 2, 'RAG stands for…', ['React AI Generator', 'Retrieval-Augmented Generation', 'Rapid API Gateway', 'Rendered AI Graphics'], 1, 'Retrieve relevant docs, then generate grounded answers.'],
  ['ai', 2, 'Embeddings are…', ['Images in HTML', 'Numeric vectors representing meaning', 'Compressed prompts', 'API keys'], 1, 'Similar meanings map to nearby vectors.'],
  ['ai', 2, 'In function calling, who executes the function?', ['The model', 'Your application code', 'The browser automatically', 'The vector DB'], 1, 'The model only proposes structured calls.'],
  ['ai', 2, 'Rendering raw LLM output with innerHTML risks…', ['CSRF', 'XSS', 'CORS errors', 'CLS only'], 1, 'Model output is untrusted; sanitise it.'],
  ['ai', 3, 'Indirect prompt injection comes from…', ['The system prompt', 'Content the model reads (web pages, PDFs, emails)', 'The API key', 'Temperature'], 1, 'Hidden instructions inside processed content.'],
  ['ai', 3, 'MCP (Model Context Protocol) standardises…', ['CSS for AI apps', 'How AI apps connect to tools and data sources', 'Token pricing', 'Image formats'], 1, 'Open protocol for tool/resource servers.'],
  ['ai', 3, 'Main reason to run models on-device in the browser?', ['Bigger models', 'Privacy, offline use and zero per-call cost', 'Better SEO', 'Simpler deployment'], 1, 'Data stays local; fallback needed for weak devices.']
];

// Convert compact rows into objects with ids
export const QUESTIONS = RAW.map(([cat, level, q, options, answer, why], i) => ({
  id: 'q' + i, cat, level, q, options, answer, why
}));

// Experience profiles used by the "Profile" filter
export const PROFILES = [
  { id: 0, name: 'Fresher / Intern', years: '0–1 yrs', focus: ['html', 'css', 'javascript', 'react', 'angular', 'networking', 'ai'] },
  { id: 1, name: 'Junior Frontend Developer', years: '1–3 yrs', focus: ['javascript', 'react', 'angular', 'typescript', 'css', 'webapis', 'networking', 'testing'] },
  { id: 2, name: 'Mid / Senior Developer', years: '3–6 yrs', focus: ['javascript', 'react', 'angular', 'typescript', 'nextjs', 'performance', 'security', 'state', 'testing', 'ai'] },
  { id: 3, name: 'Lead / Architect', years: '6+ yrs', focus: ['sysdesign', 'performance', 'security', 'react', 'angular', 'nextjs', 'tooling', 'state', 'ai', 'a11y'] }
];

// Company interview PATTERNS — compiled from commonly reported candidate experiences.
// They describe typical rounds and focus areas; companies change formats often and
// no app can guarantee the exact questions. Update `rounds`/`focus` as you collect fresh reports.
export const COMPANIES = [
  { id: 'tcs', name: 'TCS', type: 'Service', rounds: ['Online aptitude + coding (TCS NQT style)', 'Technical interview: JS fundamentals, HTML/CSS, one framework', 'Managerial', 'HR'], focus: ['javascript', 'html', 'css', 'react', 'angular', 'networking'], tip: 'Expect fundamentals and project walkthroughs; explain your own project clearly.' },
  { id: 'infosys', name: 'Infosys', type: 'Service', rounds: ['Online test', 'Technical: JS, OOP concepts, framework basics', 'HR'], focus: ['javascript', 'html', 'css', 'angular', 'react', 'typescript'], tip: 'Know OOP terms, JS basics and SDLC; be ready to code simple array/string problems.' },
  { id: 'wipro', name: 'Wipro', type: 'Service', rounds: ['Online assessment', 'Technical interview', 'HR'], focus: ['javascript', 'html', 'css', 'react', 'networking'], tip: 'Core JS output-based questions are common.' },
  { id: 'hcl', name: 'HCLTech', type: 'Service', rounds: ['Technical round 1: JS + framework', 'Technical round 2: project deep-dive', 'HR'], focus: ['javascript', 'angular', 'react', 'typescript', 'testing'], tip: 'Angular and RxJS frequently appear for enterprise projects.' },
  { id: 'accenture', name: 'Accenture', type: 'Consulting', rounds: ['Cognitive + technical assessment', 'Technical interview', 'HR'], focus: ['javascript', 'react', 'angular', 'a11y', 'testing', 'networking'], tip: 'Client-facing communication and accessibility awareness score well.' },
  { id: 'capgemini', name: 'Capgemini', type: 'Service', rounds: ['Game-based + technical test', 'Technical interview', 'HR'], focus: ['javascript', 'html', 'css', 'angular', 'react'], tip: 'Revise fundamentals and a short coding problem.' },
  { id: 'cognizant', name: 'Cognizant', type: 'Service', rounds: ['Online test', 'Technical interview', 'HR'], focus: ['javascript', 'react', 'angular', 'networking', 'testing'], tip: 'Project explanation + JS concepts like closures and promises.' },
  { id: 'publicis', name: 'Publicis Sapient', type: 'Digital Consulting', rounds: ['Online coding (JS problem solving)', 'Technical: JS deep-dive, React/Angular, performance', 'Frontend system design / case', 'Managerial + HR'], focus: ['javascript', 'react', 'performance', 'sysdesign', 'testing', 'typescript', 'security'], tip: 'Polyfills, async JS, performance and clean architecture are frequently discussed.' },
  { id: 'deloitte', name: 'Deloitte', type: 'Consulting', rounds: ['Technical interview', 'Case / design discussion', 'HR'], focus: ['javascript', 'react', 'angular', 'a11y', 'security', 'sysdesign'], tip: 'Expect scenario-based questions from client projects.' },
  { id: 'flipkart', name: 'Flipkart', type: 'Product', rounds: ['Machine coding (build a UI component in 90 min)', 'Problem solving / DSA', 'Frontend system design', 'Hiring manager'], focus: ['javascript', 'react', 'performance', 'sysdesign', 'webapis', 'state'], tip: 'Machine coding: autocomplete, carousel, infinite scroll, nested comments.' },
  { id: 'amazon', name: 'Amazon', type: 'Product', rounds: ['Online assessment', 'Coding rounds (DSA + JS)', 'Frontend design', 'Bar raiser with Leadership Principles'], focus: ['javascript', 'performance', 'sysdesign', 'a11y', 'webapis', 'networking'], tip: 'Prepare STAR stories for every Leadership Principle.' },
  { id: 'google', name: 'Google', type: 'Product', rounds: ['Phone screen: coding', 'Onsite: coding x2–3 (often JS/DSA)', 'Frontend domain / design', 'Googleyness & leadership'], focus: ['javascript', 'webapis', 'performance', 'a11y', 'sysdesign', 'security'], tip: 'Strong DSA + browser fundamentals; write clean code without a framework.' },
  { id: 'microsoft', name: 'Microsoft', type: 'Product', rounds: ['Coding screen', 'Coding + design loops', 'Hiring manager'], focus: ['javascript', 'typescript', 'react', 'a11y', 'sysdesign', 'testing'], tip: 'TypeScript, accessibility and component design are emphasised.' },
  { id: 'startup', name: 'Startups (SaaS / AI)', type: 'Startup', rounds: ['Take-home or live build', 'Technical deep-dive on your build', 'Founder / culture'], focus: ['react', 'nextjs', 'typescript', 'ai', 'state', 'performance'], tip: 'Ship fast: Next.js + an AI feature (streaming chat, RAG) is a strong signal.' }
];

// Shuffle helper (Fisher–Yates) used to randomise questions and options
export function shuffle(arr) {
  const a = [...arr];                                // copy so the source is not mutated
  for (let i = a.length - 1; i > 0; i--) {           // walk backwards
    const j = Math.floor(Math.random() * (i + 1));   // random index 0..i
    [a[i], a[j]] = [a[j], a[i]];                     // swap
  }
  return a;                                          // shuffled copy
}

// Build a test: curated questions first (up to ~60%), topped up with auto-generated concept questions
export function buildTest({ cats = [], level = null, count = 15, extra = [] }) {
  const fits = (q) => (!cats.length || cats.includes(q.cat)) &&
    (level === null || (q.level <= level && q.level >= level - 1));
  let curated = QUESTIONS.filter(fits);
  if (curated.length < 3 && level !== null) curated = QUESTIONS.filter((q) => (!cats.length || cats.includes(q.cat)) && q.level <= level);
  const generated = extra.filter(fits);
  const takeCurated = Math.min(curated.length, Math.ceil(count * 0.6));
  const picked = [...shuffle(curated).slice(0, takeCurated), ...shuffle(generated).slice(0, count - takeCurated)];
  if (picked.length < count) picked.push(...shuffle(curated).slice(takeCurated, takeCurated + (count - picked.length)));
  return shuffle(picked).slice(0, count).map((q) => {        // shuffle options while tracking the answer
    const order = shuffle(q.options.map((_, i) => i));
    return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
  });
}
