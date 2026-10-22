// Frontend System Design — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Framework & Fundamentals',
    t('sd-radio-framework', 'How to Approach Frontend System Design (RADIO)', 'I', {
      one: 'A structured approach for design interviews and real projects: Requirements, Architecture, Data model, Interface (API), Optimisations — RADIO.',
      ex: `Requirements: clarify users, core features, scale, devices, offline, accessibility, i18n, SEO, non-goals (5–8 min). Architecture: rendering strategy and high-level components/modules (diagram). Data model: client state shape, normalisation, caching. Interface: API contracts (REST/GraphQL), pagination, real-time, error formats. Optimisations: performance, a11y, security, observability, testing and trade-offs.

Think aloud, draw diagrams, state trade-offs explicitly and prioritise depth on 1–2 interesting areas.`,
      pts: ['Clarify requirements first', 'Diagram architecture', 'Define state + API contracts', 'Discuss trade-offs and optimisations'],
      flow: ['Requirements', 'Architecture', 'Data model', 'Interface (API)', 'Optimisations'],
      code: ['text', `Template for any "Design X" question:
1. Requirements  → functional (must/should), non-functional (perf, a11y, offline, SEO, scale)
2. Architecture  → rendering (CSR/SSR/SSG), component tree, state ownership, modules
3. Data model    → entities, normalised store, cache keys, derived selectors
4. Interface     → endpoints/queries, pagination (cursor), real-time (SSE/WS), errors
5. Optimise      → perf (virtualise, code split, images), a11y, security, i18n, monitoring, tests`],
      iq: [['How do you start a frontend system design interview?', 'Ask clarifying questions about users, core features, scale, devices and constraints before proposing architecture.']],
      cq: [['Write requirements for "Design a news feed".', `Must: infinite feed, post (text+image), like/comment, real-time new-post banner.
Non-functional: fast LCP on mobile, accessible, works offline (read cached), 10M users.`]],
      err: ['Jumping into components without requirements']
    }),
    t('sd-rendering-architecture', 'Choosing Rendering & Application Architecture', 'I', {
      one: 'Pick rendering (CSR, SSR, SSG/ISR, streaming, islands) and app structure (SPA, MPA, micro-frontends) per page type, based on SEO, interactivity, personalisation and scale.',
      ex: `Content/SEO pages → SSG/ISR; personalised dashboards → CSR or SSR with streaming; e-commerce → SSG for product listing + SSR for cart/checkout; admin tools → SPA. Hybrid frameworks (Next.js, Nuxt, Angular SSR, Astro) allow per-route choices.

Also decide: monolith frontend vs micro-frontends, monorepo vs polyrepo, BFF or direct API calls, edge vs origin rendering.`,
      pts: ['Per-route rendering choice', 'SEO → server HTML', 'Personalised → SSR/CSR', 'Org structure influences architecture'],
      dia: `flowchart TD
  P{"Page type"} -->|"Marketing / docs / blog"| SSG["SSG / ISR"]
  P -->|"Product listing (SEO + fresh)"| ISR["ISR + client hydration"]
  P -->|"Personalised dashboard"| SSR["SSR streaming or CSR"]
  P -->|"Highly interactive tool"| CSR["CSR SPA"]`,
      code: ['text', `E-commerce example:
/                 → ISR (revalidate 60s), CDN cached
/category/:slug   → ISR + client filters (URL state)
/product/:id      → ISR + client price/stock refresh
/cart, /checkout  → SSR/CSR, no caching, authenticated
/account/*        → CSR behind auth (BFF for data)`],
      iq: [['Why not CSR for everything?', 'Slower first contentful paint/LCP on mobile and weaker SEO/link previews; server HTML improves both.']],
      cq: [['Justify SSR for a dashboard.', `// Faster first view with user data, secrets stay on server, stream slow widgets; trade-off: server cost + hydration`]],
      err: ['One rendering mode for all pages']
    }),
    t('sd-component-architecture', 'Component Architecture: atomic design, container/presentational, feature folders', 'I', {
      one: 'Organise UI into reusable layers (atoms → molecules → organisms → templates → pages), separate data logic from presentation, and structure code by feature for scale.',
      ex: `Atomic design maps to a design system: Button/Input (atoms), SearchField (molecule), Header (organism). Container components (or hooks/services) fetch and manage data; presentational components render props — easier to test and reuse. Feature-sliced or feature folders (features/terms, features/mock) keep related code together with clear public APIs; shared UI in components/ui.

Define component APIs carefully: controlled/uncontrolled, composition (slots/children), variants via props, accessibility built in.`,
      pts: ['Atomic design layers', 'Logic vs presentation split', 'Feature-based folders', 'Thoughtful component APIs'],
      dia: `flowchart TD
  PG["Page: TermPage"] --> O["Organism: TermHeader, TabPanel"]
  O --> MO["Molecule: SearchField, LevelBadge"]
  MO --> A["Atoms: Button, Input, Icon"]`,
      code: ['jsx', `// features/terms/TermPage.container.jsx — data + logic
export function TermPageContainer({ id }) {
  const { data, isPending } = useTerm(id);                   // data hook
  const { toggle, saved } = useSaved();                      // state hook
  if (isPending) return <TermSkeleton />;
  return <TermView term={data} saved={saved.includes(id)} onSave={() => toggle(id)} />; // pass props
}
// features/terms/TermView.jsx — pure presentation, easy to test & story
export function TermView({ term, saved, onSave }) {
  return (<article><h1>{term.name}</h1><Button variant={saved ? 'ghost' : 'primary'} onClick={onSave}>{saved ? 'Saved' : 'Save'}</Button></article>);
}`],
      iq: [['Why separate container and presentational components?', 'Presentational components become reusable and easy to test/story; data logic is isolated and swappable.']],
      cq: [['Feature folder public API.', `// features/terms/index.ts
export { TermPageContainer as TermPage } from './TermPage.container'; // only exports, internals stay private`]],
      err: ['God components mixing fetching, state and markup']
    }),
    t('sd-design-systems', 'Design Systems & Component Libraries', 'I', {
      one: 'A design system is a shared language of tokens, components, patterns and guidelines (with code + Figma) that keeps products consistent, accessible and fast to build.',
      ex: `Layers: design tokens (colour, type, spacing, radius, motion) → primitives (Button, Input) → patterns (forms, modals, data tables) → documentation (Storybook, usage rules, a11y notes). Distribution: npm package (React/Angular), web components for multi-framework orgs, or copy-in approaches (shadcn/ui). Governance: versioning, changelogs, contribution model, deprecation policy, visual regression tests.

Theming via CSS variables enables brands and dark mode; headless libraries supply behaviour.`,
      pts: ['Tokens → components → patterns → docs', 'Storybook + Figma in sync', 'Versioned package', 'Accessibility built in'],
      flow: ['Design tokens in Figma', 'Export to CSS variables', 'Components in code', 'Docs in Storybook', 'Versioned releases to apps'],
      code: ['jsx', `// packages/ui/Button.jsx — token-driven, accessible, variant API
import styles from './Button.module.css';                 // uses var(--color-accent) etc.
export function Button({ variant = 'primary', size = 'md', loading = false, children, ...rest }) {
  return (
    <button className={[styles.btn, styles[variant], styles[size]].join(' ')}
      aria-busy={loading || undefined} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {children}
    </button>
  );
}`],
      iq: [['What belongs in a design system besides components?', 'Tokens, guidelines, accessibility standards, patterns, content style, documentation and governance processes.']],
      cq: [['Semantic tokens for theming.', `:root { --color-accent: #2563eb; } [data-theme="dark"] { --color-accent: #60a5fa; } /* components only use --color-accent */`]],
      err: ['Copy-pasted components diverging across teams']
    }),
    t('sd-state-data-flow', 'State, Data Flow & Caching Architecture', 'I', {
      one: 'Design where each piece of state lives, how data flows between server and UI, and how it is cached, invalidated, persisted and synchronised in real time.',
      ex: `Map state types: server cache (TanStack/RTK Query or Angular resources with cache keys), client global state (small store), URL state (filters), local UI state. Define cache keys and invalidation on mutations, optimistic updates, pagination strategy, normalisation for entities shared across views, and real-time updates merging into the cache (WebSocket events patching query data).

Consider offline persistence and multi-tab sync for critical data.`,
      pts: ['Classify state types', 'Cache keys + invalidation plan', 'Real-time patches into cache', 'Optimistic updates where safe'],
      dia: `flowchart LR
  API["REST / GraphQL API"] --> QC["Query cache (keys)"]
  WS["WebSocket events"] -->|patch| QC
  QC --> UI["Components"]
  UI -->|mutation| API
  UI --> URL["URL state: filters"]
  UI --> ST["Small client store: UI prefs"]`,
      code: ['javascript', `// Merge real-time events into the query cache
socket.on('comment:new', (comment) => {
  queryClient.setQueryData(['comments', comment.postId], (old = []) =>   // update cached list
    old.some((c) => c.id === comment.id) ? old : [...old, comment]);    // dedupe
});
socket.on('post:updated', (post) => {
  queryClient.setQueryData(['post', post.id], post);                    // single entity
  queryClient.invalidateQueries({ queryKey: ['feed'] });                // refetch lists lazily
});`],
      iq: [['How do you keep a list and detail view consistent?', 'Use shared cache keys/normalised entities and update or invalidate both on mutations and real-time events.']],
      cq: [['Cache key design.', `['terms', { track: 'react', level: 'advanced', page: 2 }] // include every parameter that changes the result`]],
      err: ['Duplicated server data in multiple stores']
    }),
    L('sysdesign-microfrontends')
  ),
  m('2. Cross-cutting Concerns',
    t('sd-performance-at-scale', 'Performance Architecture at Scale', 'A', {
      one: 'Bake performance into architecture: budgets, rendering strategy, code splitting, edge caching, image pipeline, virtualisation, prefetching and monitoring per release.',
      ex: `Large apps fail on performance through accumulation: shared bundles grow, third parties pile up, hydration cost rises. Architectural defences: route-level splitting, server components/islands, performance budgets in CI, CDN + edge caching strategy, image CDN, prefetch on intent, web workers for heavy compute, and RUM dashboards with alerts by release.

Assign ownership (performance champions) and track business impact.`,
      pts: ['Budgets enforced in CI', 'Split by route/feature', 'Edge caching + image CDN', 'RUM per release + ownership'],
      code: ['javascript', `// Prefetch the next likely route on hover/visible (intent-based)
function prefetchOnIntent(link, loader) {
  let done = false;
  const go = () => { if (!done) { done = true; loader(); } };   // run once
  link.addEventListener('pointerenter', go, { once: true });    // desktop hover
  link.addEventListener('focus', go, { once: true });            // keyboard
  new IntersectionObserver(([e], io) => { if (e.isIntersecting) { requestIdleCallback?.(go); io.disconnect(); } }).observe(link); // in viewport, idle
}
prefetchOnIntent(document.querySelector('a[href="/#/mock"]'), () => import('./components/Mock.jsx'));`],
      iq: [['How do you prevent performance regressions in a big team?', 'Budgets and bundle diffs in CI, RUM alerts per release, ownership, and architecture that limits shared bundle growth.']],
      cq: [['Bundle-size comment in PRs.', `# Use size-limit or bundlewatch GitHub actions to comment size changes on every PR`]],
      err: ['Optimising only after users complain']
    }),
    t('sd-security-privacy-design', 'Security & Privacy by Design for Frontends', 'A', {
      one: 'Design auth flows, data exposure, input handling and third-party usage with security and privacy from the start.',
      ex: `Decisions: session strategy (BFF + HttpOnly cookies), permission model checked server-side, CSP + Trusted Types, sanitisation strategy for rich content (markdown, AI output), third-party script policy, PII minimisation and masking in logs/replays, consent management, rate limits on expensive endpoints (AI), secret handling in serverless functions, dependency policy and incident response.`,
      pts: ['BFF + HttpOnly sessions', 'Server-side authorisation', 'CSP + sanitisation', 'PII minimisation + consent'],
      code: ['text', `Security checklist for a design review:
[ ] Auth: OIDC code+PKCE via BFF, HttpOnly SameSite cookies, MFA/passkeys
[ ] Authorisation enforced in APIs/actions, not just UI
[ ] CSP (nonces), Trusted Types, DOMPurify for rich text / AI output
[ ] Third-party scripts reviewed, loaded with SRI or via tag manager with CSP
[ ] Rate limits on login, search and AI endpoints
[ ] Logs/replays mask PII; consent before analytics
[ ] Secrets only in server env; rotation plan`],
      iq: [['What security concerns are specific to AI features?', 'Prompt injection, leaking system prompts or data, rendering unsanitised model output, API key exposure and cost abuse — mitigate with server proxies, sanitisation, rate limits and least privilege.']],
      cq: [['Rate-limit an AI route per user.', `if (!(await limiter.allow(userId, { max: 30, windowMs: 3600_000 }))) return Response.json({ error: 'Limit reached' }, { status: 429 });`]],
      err: ['Security reviewed only before launch']
    }),
    t('sd-i18n-accessibility-scale', 'Internationalisation & Accessibility at Scale', 'I', {
      one: 'Plan i18n (translations, locale formatting, RTL, routing, content workflow) and accessibility (standards, components, testing, ownership) as architecture, not afterthoughts.',
      ex: `i18n: message keys with ICU plurals, locale routing (/hi/…), lazy-loaded dictionaries, Intl formatting, logical CSS for RTL, translation management (Crowdin/Lokalise), pseudo-localisation tests for text expansion. Accessibility: accessible design system components, WCAG 2.2 AA definition of done, automated axe in CI, manual audits, training and an accessibility statement.`,
      pts: ['ICU messages + Intl formatting', 'Lazy locale bundles + RTL', 'Accessible design system', 'a11y in definition of done'],
      code: ['javascript', `// Pseudo-localisation: catch hard-coded strings and layout overflow early
const pseudo = (s) => '[' + s.replace(/[aeiou]/g, (v) => ({ a: 'à', e: 'ë', i: 'ï', o: 'ö', u: 'ü' })[v]) + ' ~~~~]'; // longer + accented
const t = (key, msgs) => (import.meta.env.MODE === 'pseudo' ? pseudo(msgs[key]) : msgs[key]);
console.log(t('save', { save: 'Save changes' })); // "[Sàvë chàngës ~~~~]" in pseudo mode`],
      iq: [['What is pseudo-localisation?', 'Replacing strings with accented, longer versions to detect hard-coded text and layouts that break with translation.']],
      cq: [['ICU plural message.', `"items": "{count, plural, =0 {No terms} one {# term} other {# terms}}"`]],
      err: ['String concatenation for translated sentences']
    }),
    t('sd-observability-reliability', 'Observability, Error Handling & Resilience', 'I', {
      one: 'Design how the frontend fails gracefully and how teams see problems: error boundaries per area, retries, fallbacks, offline states, structured logging, tracing and alerts.',
      ex: `Resilience: error boundaries around widgets, skeletons and empty states, retries with backoff for transient errors, timeouts, circuit breakers for flaky services, offline mode, idempotent mutations. Observability: error tracking with releases, RUM vitals, business events, distributed tracing (traceparent header from frontend to backend), dashboards and alert thresholds tied to user impact.`,
      pts: ['Contain failures per widget', 'Graceful fallbacks + retries', 'Trace IDs frontend → backend', 'Alerts on user impact'],
      flow: ['Error occurs', 'Boundary shows fallback', 'Retry or degrade gracefully', 'Report with trace id + release', 'Alert if threshold crossed'],
      code: ['javascript', `// Propagate a trace id so backend logs can be correlated with frontend errors
async function tracedFetch(url, opts = {}) {
  const traceId = crypto.randomUUID().replaceAll('-', '');            // 32 hex chars
  const spanId = traceId.slice(0, 16);
  const res = await fetch(url, { ...opts, headers: { ...opts.headers, traceparent: \`00-\${traceId}-\${spanId}-01\` } }); // W3C trace context
  if (!res.ok) reportError(new Error('API ' + res.status), { url, traceId }); // same id in error tracker
  return res;
}`],
      iq: [['How should a dashboard behave if one widget’s API fails?', 'Only that widget shows an error/fallback with retry; the rest of the page keeps working.']],
      cq: [['Circuit breaker idea.', `if (failures >= 5 && Date.now() - lastFailure < 30000) return cachedOrFallback(); // stop hammering a failing service`]],
      err: ['One global error page for any failure']
    })
  ),
  m('3. Classic Design & Machine-coding Questions',
    t('sd-design-news-feed', 'Design a News Feed (Facebook/LinkedIn/Twitter)', 'A', {
      one: 'A system design case: infinite, personalised feed with posts, media, likes/comments, real-time updates and great mobile performance.',
      ex: `Requirements: infinite scroll, create post, like/comment, new-posts banner, media, accessibility, offline read. Architecture: SSR first page for LCP/SEO (if public), client hydration; components FeedList, PostCard, Composer, CommentThread. Data: normalised posts/users/comments in query cache; cursor pagination API (GET /feed?cursor=). Real-time: SSE/WebSocket for new posts → "N new posts" banner (don't jump content). Optimisations: virtualised list, image CDN + lazy loading + aspect ratios (no CLS), optimistic likes, prefetch next page near bottom, skeletons, accessibility (article roles, focus management on load more), error isolation per post.`,
      pts: ['Cursor pagination + virtualisation', 'Normalised cache', 'Real-time banner, not auto-insert', 'Optimistic likes, no CLS'],
      dia: `flowchart TD
  F["FeedPage"] --> C["Composer"]
  F --> B["NewPostsBanner (SSE)"]
  F --> V["VirtualList"]
  V --> P["PostCard"]
  P --> M["Media (lazy, aspect-ratio)"]
  P --> A["Actions: like (optimistic), comment"]
  V --> S["Sentinel → fetch next cursor"]`,
      code: ['javascript', `// API contract sketch
// GET  /api/feed?cursor=<opaque>&limit=10 → { items: Post[], nextCursor: string|null }
// POST /api/posts { text, mediaIds[] }   → Post
// POST /api/posts/:id/like (Idempotency-Key) → { liked: true, likes: 41 }
// SSE  /api/feed/stream → event: new_post data: { id, authorId, createdAt }
const banner = { count: 0 };
source.addEventListener('new_post', () => { banner.count++; renderBanner(banner.count); }); // don't shift the list
function showNewPosts() { queryClient.invalidateQueries({ queryKey: ['feed'] }); window.scrollTo({ top: 0 }); }`],
      iq: [['Why show a "new posts" banner instead of inserting posts live?', 'Inserting shifts content under the user (bad UX, CLS); a banner lets them choose when to load.']],
      cq: [['Optimistic like toggle.', `onMutate: (id) => qc.setQueryData(['post', id], (p) => ({ ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }))`]],
      err: ['Offset pagination for a live feed']
    }),
    t('sd-design-autocomplete', 'Design an Autocomplete / Typeahead', 'A', {
      one: 'A frequent interview design: a search input that suggests results as you type, efficiently, accessibly and race-condition free.',
      ex: `Requirements: suggestions after 2+ chars, keyboard navigation, highlight matches, recent searches, mobile friendly, handles slow networks. Design: debounce (~200–300ms), cancel stale requests (AbortController) or ignore out-of-order responses, client cache (LRU by query), min length, server endpoint with limit, highlight matches safely (no innerHTML), combobox ARIA pattern (role=combobox, listbox, option, aria-activedescendant), Esc closes, Enter selects, show loading/empty/error states, and analytics for selections.`,
      pts: ['Debounce + cancel stale requests', 'LRU cache by query', 'ARIA combobox pattern', 'Loading/empty/error states'],
      flow: ['User types', 'Debounce 250ms', 'Cache hit? show', 'Else fetch (abort previous)', 'Render listbox with keyboard nav'],
      code: ['javascript', `function createAutocomplete(input, list, fetcher) {
  const cache = new Map(); let ctrl, active = -1, items = [];
  const render = () => {                                         // accessible listbox
    list.replaceChildren(...items.map((it, i) => Object.assign(document.createElement('li'), {
      id: 'opt-' + i, role: 'option', textContent: it, ariaSelected: String(i === active) })));
    input.setAttribute('aria-expanded', String(items.length > 0));
    input.setAttribute('aria-activedescendant', active >= 0 ? 'opt-' + active : '');
  };
  input.addEventListener('input', debounce(async () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { items = []; return render(); }
    if (cache.has(q)) { items = cache.get(q); return render(); }   // instant from cache
    ctrl?.abort(); ctrl = new AbortController();                  // cancel stale request
    try { items = await fetcher(q, ctrl.signal); cache.set(q, items); active = -1; render(); } catch {}
  }, 250));
  input.addEventListener('keydown', (e) => {                       // keyboard navigation
    if (e.key === 'ArrowDown') active = Math.min(active + 1, items.length - 1);
    else if (e.key === 'ArrowUp') active = Math.max(active - 1, 0);
    else if (e.key === 'Enter' && active >= 0) input.value = items[active];
    else if (e.key === 'Escape') items = [];
    else return;
    e.preventDefault(); render();
  });
}`],
      iq: [['How do you prevent out-of-order results?', 'Abort the previous request or track a request id and ignore responses that aren’t for the latest query.']],
      cq: [['Required ARIA on the input.', `<input role="combobox" aria-autocomplete="list" aria-controls="suggestions" aria-expanded="false"><ul id="suggestions" role="listbox"></ul>`]],
      err: ['innerHTML highlighting user input']
    }),
    t('sd-design-chat', 'Design a Chat / Messaging App', 'A', {
      one: 'Real-time messaging design: conversations list, message thread with history pagination, typing indicators, delivery/read receipts, offline sending and notifications.',
      ex: `Transport: WebSocket for bidirectional events (message, typing, read) with reconnect + heartbeat; REST for history (cursor, newest-first, load older on scroll up keeping scroll position). Messages get client-generated IDs for optimistic send (pending → sent → delivered → read) and dedupe; outbox in IndexedDB for offline. UI: virtualised reverse list, day separators, grouping, attachments with upload progress, link previews, accessible live region for incoming messages (polite), focus management. Notifications: in-app + web push. Security: sanitise rendered content, rate limits, E2E encryption as advanced topic.`,
      pts: ['WebSocket events + REST history', 'Client IDs for optimistic send', 'Reverse virtualised list', 'Offline outbox + push'],
      dia: `sequenceDiagram
  participant U as Client A
  participant S as Chat Server
  participant B as Client B
  U->>U: show message as pending (client id)
  U->>S: WS send {clientId, text}
  S-->>U: ack {clientId, serverId, sent}
  S-->>B: WS message
  B->>S: read receipt
  S-->>U: status read`,
      code: ['javascript', `function sendMessage(conversationId, text) {
  const msg = { clientId: crypto.randomUUID(), conversationId, text, status: 'pending', createdAt: Date.now() };
  addToThread(msg);                                        // optimistic render
  outbox.put(msg);                                         // survives offline/reload
  socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ type: 'message', ...msg }));
}
socket.addEventListener('message', (e) => {
  const evt = JSON.parse(e.data);
  if (evt.type === 'ack') updateStatus(evt.clientId, { id: evt.serverId, status: 'sent' }); // reconcile
  if (evt.type === 'message') addToThread(evt);            // incoming (dedupe by id)
  if (evt.type === 'read') markRead(evt.upTo);
});`],
      iq: [['How do you keep scroll position when loading older messages?', 'Measure scrollHeight before prepending, then set scrollTop += newScrollHeight − oldScrollHeight.']],
      cq: [['Typing indicator without spamming.', `input.addEventListener('input', throttle(() => socket.send(JSON.stringify({ type: 'typing' })), 2000)); // at most every 2s`]],
      err: ['No dedupe → duplicate messages after reconnect']
    }),
    t('sd-design-ecommerce-pdp', 'Design an E-commerce Product Page & Checkout', 'A', {
      one: 'Design product listing/detail pages and checkout for speed, SEO, conversion, accessibility and reliability.',
      ex: `PDP: SSG/ISR HTML for SEO + fast LCP (hero image priority), client refresh for price/stock, variant selection in URL, image gallery with zoom (accessible), reviews lazy-loaded, recommendations deferred, structured data (Product, Offer, AggregateRating), sticky add-to-cart. Cart: optimistic updates, persisted (server + local), cross-tab sync. Checkout: SSR/CSR secure flow, address autocomplete, payment provider SDK (PCI scope minimised), idempotency keys, clear errors, minimal fields, guest checkout, analytics funnel, A/B testing server-side to avoid flicker.`,
      pts: ['ISR + fresh price/stock', 'Variant in URL', 'Structured data for SEO', 'Idempotent, secure checkout'],
      code: ['jsx', `// Variant selection stored in the URL (shareable, back-button friendly)
function VariantPicker({ product }) {
  const [params, setParams] = useSearchParams();
  const size = params.get('size') ?? product.sizes[0];
  return (
    <fieldset>
      <legend>Size</legend>
      {product.sizes.map((s) => (
        <label key={s}><input type="radio" name="size" value={s} checked={s === size}
          onChange={() => setParams({ ...Object.fromEntries(params), size: s }, { replace: true })} /> {s}</label>
      ))}
    </fieldset>
  );
}`],
      iq: [['How do you keep a statically generated PDP price accurate?', 'Serve cached HTML for speed, then fetch live price/stock on the client (or ISR with short revalidate/on-demand revalidation).']],
      cq: [['Prevent double charges.', `fetch('/api/checkout', { method: 'POST', headers: { 'Idempotency-Key': orderDraftId }, body }); // server dedupes`]],
      err: ['Client-side A/B tests flickering on PDP']
    }),
    t('sd-machine-coding', 'Machine Coding Round: common problems & approach', 'I', {
      one: 'Machine coding rounds ask you to build a working UI component/app in 60–120 minutes (e.g. todo, star rating, tabs, accordion, carousel, infinite scroll, nested comments, file explorer, Kanban, OTP input, progress bar, autocomplete).',
      ex: `Approach: clarify requirements (5 min), sketch component tree and state, build the core happy path first, then edge cases, accessibility and polish; keep code modular and readable; narrate trade-offs; test manually as you go.

Evaluated on: working functionality, code structure, state management, edge cases (empty, loading, errors, keyboard), accessibility, styling basics and communication. Practise in vanilla JS and your framework.`,
      pts: ['Clarify → structure → core → edges', 'Readable modular code', 'Handle keyboard + empty/error states', 'Talk through trade-offs'],
      flow: ['Clarify requirements', 'Sketch components and state', 'Build happy path', 'Edge cases and a11y', 'Polish and explain'],
      code: ['jsx', `// Example: accessible star rating (common machine-coding task)
export function StarRating({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(0);                    // preview on hover
  return (
    <div role="radiogroup" aria-label="Rating" onMouseLeave={() => setHover(0)}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n}
          aria-label={n + ' star' + (n > 1 ? 's' : '')}
          onMouseEnter={() => setHover(n)} onClick={() => onChange(n)}
          style={{ color: n <= (hover || value) ? '#f59f00' : '#ccc', fontSize: 28 }}>★</button>
      ))}
    </div>
  );
}`],
      iq: [['What do interviewers look for in machine coding?', 'Working core features, clean component/state design, edge cases, accessibility, and clear communication of trade-offs.']],
      cq: [['OTP input that auto-advances.', `function onInput(e, i) { const v = e.target.value.replace(/\\D/g, '').slice(-1); setDigits((d) => d.with(i, v)); if (v) refs[i + 1]?.focus(); } // digits only, move next`]],
      err: ['Spending the first 30 minutes on styling']
    }),
    t('sd-design-collab-dashboard', 'Design a Dashboard or Collaborative Editor', 'A', {
      one: 'Design data-heavy dashboards (widgets, filters, real-time charts) and collaborative editors (presence, conflict-free merging with CRDTs, undo/redo).',
      ex: `Dashboard: layout grid with lazy widgets, independent data fetching + error boundaries per widget, filters in URL, shared time range, polling/SSE for live data, chart virtualisation/downsampling, export (CSV/PDF), permissions per widget, responsive and accessible charts (data tables).

Collaborative editor (Google Docs/Figma style): real-time sync via WebSocket, CRDTs (Yjs, Automerge) or OT for conflict-free concurrent edits, presence (cursors/avatars), offline edits merged later, undo/redo per user, versions/history, comments, permission levels, large document performance (virtualised rendering).`,
      pts: ['Independent widgets + error isolation', 'Filters in URL, shared time range', 'CRDTs for conflict-free editing', 'Presence + offline merge'],
      code: ['javascript', `import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
const doc = new Y.Doc();                                       // shared CRDT document
const provider = new WebsocketProvider('wss://collab.example.com', 'roadmap-42', doc); // sync room
const steps = doc.getArray('steps');                           // shared list
steps.observe(() => render(steps.toArray()));                  // re-render on any user's change
provider.awareness.setLocalStateField('user', { name: 'Riya', color: '#7cf2c8' }); // presence
function addStep(text) { steps.push([text]); }                 // merges without conflicts`],
      iq: [['CRDT vs OT?', 'Both resolve concurrent edits; OT transforms operations via a central server, CRDTs use data structures that merge deterministically without central coordination (good for offline).']],
      cq: [['Downsample a large time series before charting.', `const step = Math.ceil(points.length / 1000); const sampled = points.filter((_, i) => i % step === 0); // ≤1000 points`]],
      err: ['One API call blocking the whole dashboard']
    })
  )
];
