// engineering.js — Networking, Performance, Security, Testing, Tooling, A11y, PWA, DevOps, System Design

export default [
  {
    id: 'net-fetch-rest', cat: 'networking', name: 'REST, fetch & HTTP Status Codes', level: 'Beginner',
    oneLiner: 'REST maps resources to URLs and HTTP methods; fetch is the browser API to call them; status codes tell you what happened.',
    explanation: `REST conventions: GET /users (list), GET /users/7 (read), POST /users (create), PUT/PATCH /users/7 (replace/update), DELETE /users/7. GET, PUT and DELETE should be idempotent.

Status codes: 2xx success (200 OK, 201 Created, 204 No Content), 3xx redirect (301, 304 Not Modified), 4xx client error (400 Bad Request, 401 Unauthenticated, 403 Forbidden, 404, 409 Conflict, 422 Validation, 429 Too Many Requests), 5xx server error (500, 502, 503).

Important gotcha: fetch only rejects on network failure. A 404 or 500 still RESOLVES — you must check response.ok yourself.`,
    diagram: `flowchart LR
  C["Client fetch"] --> M{"Method"}
  M -->|GET| R["Read"]
  M -->|POST| CR["Create → 201"]
  M -->|"PUT / PATCH"| U["Update → 200"]
  M -->|DELETE| D["Delete → 204"]
  R --> S{"response.ok?"}
  S -- No --> E["Throw with status"]`,
    code: { lang: 'javascript', src: `async function api(path, { method = 'GET', body, token } = {}) { // reusable wrapper with defaults
  const res = await fetch('/api' + path, {             // build the full URL
    method,                                            // HTTP verb
    headers: {                                         // request headers
      'Content-Type': 'application/json',              // we send JSON
      ...(token && { Authorization: 'Bearer ' + token }) // add auth header only if token exists
    },                                                 // end headers
    body: body ? JSON.stringify(body) : undefined,     // serialise the body for non-GET requests
    credentials: 'include'                             // send cookies (needed for cookie sessions)
  });                                                  // end fetch
  if (!res.ok) {                                       // fetch does NOT reject on 4xx/5xx
    const detail = await res.text();                   // read the error body for debugging
    throw new Error(res.status + ' ' + detail);        // turn it into a real error
  }                                                    // end if
  return res.status === 204 ? null : res.json();       // 204 has no body
}                                                      // end api

await api('/users', { method: 'POST', body: { name: 'Riya' } }); // create a user` },
    interview: [
      { q: 'PUT vs PATCH?', a: 'PUT replaces the whole resource (idempotent); PATCH applies a partial update.' },
      { q: '401 vs 403?', a: '401 means not authenticated (who are you?); 403 means authenticated but not allowed.' },
      { q: 'Does fetch reject on 500?', a: 'No — only on network errors or abort. Check response.ok or response.status.' },
      { q: 'What is idempotency?', a: 'Repeating the same request has the same effect as doing it once (GET, PUT, DELETE).' }
    ],
    coding: [
      { q: 'Cancel a fetch after 3 seconds.', a: `const res = await fetch('/api/slow', {          // request
  signal: AbortSignal.timeout(3000)               // built-in timeout signal → rejects with TimeoutError
});                                               // end fetch` }
    ],
    roadmap: ['HTTP basics', 'Methods & status codes', 'fetch & Response', 'Error handling', 'Cancellation', 'Retries & caching'],
    related: ['net-cors', 'net-auth-jwt', 'js-promises-async']
  },
  {
    id: 'net-cors', cat: 'networking', name: 'CORS & Same-Origin Policy', level: 'Intermediate',
    oneLiner: 'Browsers block cross-origin responses unless the server explicitly allows them with Access-Control-* headers.',
    explanation: `Origin = scheme + host + port. The same-origin policy stops a script on site A from reading responses from site B.

CORS (Cross-Origin Resource Sharing) lets the SERVER opt in: Access-Control-Allow-Origin, -Methods, -Headers, -Credentials. "Non-simple" requests (e.g. JSON content type, custom headers, PUT/DELETE) trigger a preflight OPTIONS request first.

Key insight for interviews: CORS is enforced by the browser, configured on the server. You cannot "fix CORS" from frontend code — use correct server headers or a same-origin proxy (e.g. Next.js rewrites, a BFF, or the Vite dev proxy). With credentials, Allow-Origin cannot be *.`,
    diagram: `sequenceDiagram
  participant B as Browser app.com
  participant S as Server api.com
  B->>S: OPTIONS preflight with Origin
  S-->>B: 204 + Access-Control-Allow-Origin app.com
  B->>S: Actual POST request
  S-->>B: 200 + CORS headers
  Note over B: Browser lets JS read the response`,
    code: { lang: 'javascript', src: `// Express server: allow one frontend origin with cookies
app.use((req, res, next) => {                                       // middleware runs for every request
  res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com'); // exact origin (not * with cookies)
  res.setHeader('Access-Control-Allow-Credentials', 'true');        // allow cookies/auth
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE'); // allowed verbs
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization'); // allowed custom headers
  if (req.method === 'OPTIONS') return res.sendStatus(204);         // answer preflight quickly
  next();                                                           // continue to real route
});                                                                 // end middleware

// vite.config.js dev proxy — avoids CORS locally by making requests same-origin
// server: { proxy: { '/api': 'http://localhost:4000' } }` },
    interview: [
      { q: 'Who enforces CORS?', a: 'The browser. Servers only send headers; tools like curl or Postman ignore CORS.' },
      { q: 'What triggers a preflight?', a: 'Methods other than GET/HEAD/POST, non-simple headers (Authorization, custom), or Content-Type other than form/text types (e.g. application/json).' },
      { q: 'Can you use * with credentials?', a: 'No — with credentials the server must echo a specific origin.' }
    ],
    coding: [
      { q: 'Proxy API calls in Next.js to avoid CORS.', a: `// next.config.js
module.exports = {                                   // Next config export
  async rewrites() {                                 // rewrite rules
    return [{ source: '/api/:path*', destination: 'https://api.example.com/:path*' }]; // same-origin proxy
  }                                                  // end rewrites
};                                                   // end config` }
    ],
    roadmap: ['Origins', 'Same-origin policy', 'CORS headers', 'Preflight', 'Credentials', 'Proxies & BFF'],
    related: ['net-fetch-rest', 'sec-csrf']
  },
  {
    id: 'net-auth-jwt', cat: 'networking', name: 'Authentication: Cookies, JWT, OAuth & Passkeys', level: 'Intermediate',
    oneLiner: 'How the frontend proves who the user is — via session cookies, bearer tokens (JWT), OAuth/OIDC sign-in, or passwordless passkeys.',
    explanation: `Session cookie: server stores session, browser holds an HttpOnly, Secure, SameSite cookie. JS cannot read it, which protects against XSS token theft.

JWT: a signed token (header.payload.signature) sent as Authorization: Bearer. Stateless and good for APIs, but storing it in localStorage exposes it to XSS. Best practice: short-lived access token in memory + refresh token in an HttpOnly cookie.

OAuth 2.0 + OpenID Connect: "Sign in with Google" — SPAs must use Authorization Code flow with PKCE.

Passkeys (WebAuthn): phishing-resistant public-key login using device biometrics — increasingly expected in 2026.`,
    diagram: `sequenceDiagram
  participant U as Browser
  participant A as Auth API
  U->>A: POST /login credentials
  A-->>U: access token JSON + refresh token HttpOnly cookie
  U->>A: API call with Bearer access token
  A-->>U: 401 when access token expires
  U->>A: POST /refresh with cookie sent automatically
  A-->>U: new access token`,
    code: { lang: 'javascript', src: `let accessToken = null;                                 // kept in memory only (not localStorage)

async function authFetch(url, opts = {}) {              // wrapper used for every API call
  const send = () => fetch(url, {                        // inner function so we can retry
    ...opts,                                             // keep caller options
    headers: { ...opts.headers, Authorization: 'Bearer ' + accessToken } // attach token
  });                                                    // end send
  let res = await send();                                // first attempt
  if (res.status === 401) {                              // token expired?
    const r = await fetch('/auth/refresh', {             // ask for a new access token
      method: 'POST', credentials: 'include'             // HttpOnly refresh cookie is sent automatically
    });                                                  // end refresh fetch
    if (!r.ok) throw new Error('Session expired');       // refresh failed → user must log in
    accessToken = (await r.json()).accessToken;          // store the new token in memory
    res = await send();                                  // retry original request once
  }                                                      // end if
  return res;                                            // final response
}                                                        // end authFetch` },
    interview: [
      { q: 'Where should you store JWTs?', a: 'Ideally not in localStorage. Prefer HttpOnly Secure SameSite cookies, or short-lived tokens in memory with an HttpOnly refresh cookie.' },
      { q: 'What is PKCE?', a: 'Proof Key for Code Exchange: the client sends a hashed verifier with the auth request and the raw verifier at token exchange, so intercepted codes are useless.' },
      { q: 'Is a JWT encrypted?', a: 'Usually not — it is signed and base64url-encoded. Anyone can read the payload, so never put secrets in it.' },
      { q: 'What are passkeys?', a: 'WebAuthn credentials: a private key stays on the device; the server stores the public key. Login is phishing-resistant and passwordless.' }
    ],
    coding: [
      { q: 'Decode a JWT payload on the client (for display only).', a: `function decodeJwt(token) {                       // NOT verification — just reading
  const payload = token.split('.')[1];              // middle part is the payload
  const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/')); // base64url → base64 → string
  return JSON.parse(json);                          // object with sub, exp, etc.
}                                                   // end decodeJwt` }
    ],
    roadmap: ['Sessions & cookies', 'JWT structure', 'Token storage', 'Refresh flow', 'OAuth/OIDC + PKCE', 'Passkeys'],
    related: ['sec-xss', 'sec-csrf', 'angular-di']
  },
  {
    id: 'net-graphql-realtime', cat: 'networking', name: 'GraphQL, WebSockets & Server-Sent Events', level: 'Advanced',
    oneLiner: 'GraphQL lets the client ask for exactly the fields it needs; WebSockets give two-way real-time messaging; SSE streams one-way server updates.',
    explanation: `GraphQL: one endpoint, a typed schema, queries/mutations/subscriptions. Solves over-fetching and under-fetching; clients like Apollo or urql add normalised caching. Trade-offs: harder HTTP caching, N+1 queries on the server, query complexity limits.

WebSocket: a persistent full-duplex TCP connection after an HTTP upgrade — chat, multiplayer, live trading, collaborative editing. You handle reconnection and heartbeats.

Server-Sent Events (EventSource): simple one-way stream over HTTP with automatic reconnection — notifications, live scores and the classic transport for streaming AI tokens.`,
    diagram: `flowchart TD
  N{"Real-time need?"} -->|"Server pushes only"| SSE["SSE / streamed fetch: notifications, AI tokens"]
  N -->|"Both directions, low latency"| WS["WebSocket: chat, games, collaboration"]
  N -->|"Occasional updates"| P["Polling / refetch on focus"]
  D{"Many clients need different shapes of data?"} -->|Yes| GQL["GraphQL"]
  D -->|No| REST["REST"]`,
    code: { lang: 'javascript', src: `// WebSocket with auto-reconnect
function connect(url, onMessage, retry = 1000) {   // retry delay starts at 1 s
  const ws = new WebSocket(url);                   // open the connection (wss:// in production)
  ws.onopen = () => { retry = 1000; };             // reset backoff when connected
  ws.onmessage = (e) => onMessage(JSON.parse(e.data)); // parse each message
  ws.onclose = () => {                             // connection dropped
    setTimeout(() => connect(url, onMessage, Math.min(retry * 2, 30000)), retry); // backoff, max 30 s
  };                                               // end onclose
  return ws;                                       // caller can ws.send(...)
}                                                  // end connect

// Server-Sent Events
const es = new EventSource('/api/notifications');  // opens a long-lived GET request
es.onmessage = (e) => console.log('notify', e.data); // each 'data:' line from the server
// es.close();                                     // stop listening

// GraphQL over fetch
const query = 'query { user(id: 7) { name avatar } }'; // ask only for the fields you need
fetch('/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }) }); // single endpoint` },
    interview: [
      { q: 'WebSocket vs SSE?', a: 'WebSocket is bidirectional and needs custom reconnection; SSE is server-to-client only, text-based, over plain HTTP with automatic reconnect.' },
      { q: 'GraphQL advantages and drawbacks?', a: 'Pros: precise data, typed schema, one round-trip. Cons: caching complexity, N+1 resolvers, security around expensive queries.' }
    ],
    coding: [
      { q: 'Why might a WebSocket silently die, and how to detect it?', a: `// Proxies/load balancers drop idle connections. Send heartbeats:
setInterval(() => {                               // every 25 seconds
  if (ws.readyState === WebSocket.OPEN) ws.send('ping'); // keep the connection alive
}, 25000);                                        // server replies 'pong'; no pong → reconnect` }
    ],
    roadmap: ['HTTP request/response', 'Polling', 'SSE', 'WebSockets', 'GraphQL basics', 'Subscriptions'],
    related: ['ai-streaming', 'net-fetch-rest']
  },
  {
    id: 'perf-core-web-vitals', cat: 'performance', name: 'Core Web Vitals: LCP, INP, CLS', level: 'Intermediate',
    oneLiner: 'Google\'s user-centric metrics for loading (LCP), responsiveness (INP) and visual stability (CLS).',
    explanation: `LCP — Largest Contentful Paint: time until the biggest visible element (hero image/heading) renders. Good ≤ 2.5 s. Fix: optimise and preload the hero image, fetchpriority="high", SSR/SSG, CDN, fewer render-blocking resources.

INP — Interaction to Next Paint (replaced FID in March 2024): worst-ish latency from user input to the next frame. Good ≤ 200 ms. Fix: break long tasks, defer non-critical JS, use transitions, move work to Workers, avoid huge re-renders.

CLS — Cumulative Layout Shift: unexpected movement of content. Good ≤ 0.1. Fix: set width/height or aspect-ratio on media, reserve space for ads/banners, use font-display and size-adjusted fallback fonts.

Measure in the field (RUM, web-vitals library, CrUX) — lab tools like Lighthouse are only approximations.`,
    diagram: `flowchart LR
  L["LCP ≤ 2.5s: loading"] --> G["Good page experience"]
  I["INP ≤ 200ms: responsiveness"] --> G
  C["CLS ≤ 0.1: stability"] --> G
  L -. "fix" .-> L1["preload hero, CDN, SSR"]
  I -. "fix" .-> I1["split long tasks, less JS"]
  C -. "fix" .-> C1["reserve space, image dimensions"]`,
    code: { lang: 'html', src: `<!-- LCP: tell the browser the hero image is the most important resource -->
<link rel="preload" as="image" href="/hero.avif" fetchpriority="high"> <!-- start downloading early -->
<img src="/hero.avif" width="1200" height="600"
     fetchpriority="high" alt="Course banner">                        <!-- width/height prevent CLS -->

<!-- Below-the-fold images: load lazily -->
<img src="/card.webp" loading="lazy" decoding="async" width="300" height="200" alt="Card"> <!-- deferred -->

<script type="module">
  import { onLCP, onINP, onCLS } from 'https://unpkg.com/web-vitals@4?module'; // field-measurement library
  const send = (m) => navigator.sendBeacon('/analytics', JSON.stringify(m));   // beacon survives page unload
  onLCP(send);                                                                 // report LCP
  onINP(send);                                                                 // report INP
  onCLS(send);                                                                 // report CLS
</script>` },
    interview: [
      { q: 'What replaced FID?', a: 'INP (Interaction to Next Paint) became a Core Web Vital in March 2024, measuring all interactions, not just the first.' },
      { q: 'How do you improve LCP?', a: 'Find the LCP element; serve it fast (CDN, SSR), preload it, compress images (AVIF/WebP), remove render-blocking CSS/JS, avoid lazy-loading the hero.' },
      { q: 'Lab vs field data?', a: 'Lab (Lighthouse) is a controlled synthetic test; field (CrUX, RUM) reflects real users\' devices and networks — Google ranks using field data.' },
      { q: 'What is a long task?', a: 'Any main-thread task over 50 ms; it delays input handling and harms INP.' }
    ],
    coding: [
      { q: 'Yield to the main thread inside a long loop.', a: `async function processAll(items) {                         // many items to handle
  for (const item of items) {                               // iterate
    handle(item);                                           // small unit of work
    if (navigator.scheduling?.isInputPending?.() || Math.random() < 0.05) { // periodically
      await (globalThis.scheduler?.yield?.() ?? new Promise((r) => setTimeout(r))); // let input/paint run
    }                                                       // end if
  }                                                         // end for
}                                                           // end processAll` }
    ],
    roadmap: ['Critical rendering path', 'Measuring: Lighthouse & RUM', 'LCP', 'CLS', 'INP & long tasks', 'Performance budgets'],
    related: ['perf-code-splitting', 'js-event-loop', 'react-memo']
  },
  {
    id: 'perf-code-splitting', cat: 'performance', name: 'Code Splitting, Lazy Loading & Tree Shaking', level: 'Intermediate',
    oneLiner: 'Ship less JavaScript up front by splitting bundles, loading code on demand, and removing unused exports.',
    explanation: `Dynamic import() creates a separate chunk loaded only when needed. React.lazy + Suspense, Angular's loadComponent / @defer, and Next.js dynamic() build on it. Split by route first, then by heavy components (charts, editors, maps, diagram libraries).

Tree shaking: bundlers remove unused ES module exports. It needs ESM imports, side-effect-free modules ("sideEffects": false in package.json), and named imports (import { debounce } from 'lodash-es', not the whole library).

Also analyse bundles (vite-bundle-visualizer, webpack-bundle-analyzer), prefer smaller libraries, and prefetch likely next routes.`,
    diagram: `flowchart LR
  A["main bundle: app shell"] --> R1["route chunk: /dashboard"]
  A --> R2["route chunk: /settings"]
  R1 --> H["heavy chunk: chart lib, loaded on click"]
  T["Tree shaking"] -. "drops unused exports" .-> A`,
    code: { lang: 'jsx', src: `import { lazy, Suspense, useState } from 'react';          // lazy-loading helpers

const ChartPanel = lazy(() => import('./ChartPanel'));     // separate chunk, fetched on first render

export default function Dashboard() {                      // page component
  const [show, setShow] = useState(false);                 // chart hidden initially
  return (                                                 // UI
    <>
      <button onClick={() => setShow(true)}>Show chart</button> {/* user intent triggers the load */}
      {show && (                                           // render only after click
        <Suspense fallback={<p>Loading chart…</p>}>        {/* shown while the chunk downloads */}
          <ChartPanel />                                   {/* heavy component */}
        </Suspense>
      )}
    </>
  );                                                       // end return
}                                                          // end Dashboard

// Prefetch on hover so it feels instant:
// <button onMouseEnter={() => import('./ChartPanel')}>Show chart</button>` },
    interview: [
      { q: 'What is tree shaking?', a: 'Dead-code elimination of unused ES module exports during bundling.' },
      { q: 'Why might tree shaking fail?', a: 'CommonJS modules, side effects at import time, re-export barrels that pull everything, or importing the whole default object.' },
      { q: 'Preload vs prefetch?', a: 'preload: needed for the current page, high priority. prefetch: likely needed for a future navigation, low priority.' }
    ],
    coding: [
      { q: 'Lazy-load a route in Angular.', a: `export const routes: Routes = [                              // router config
  { path: 'admin', loadComponent: () => import('./admin.component').then((m) => m.AdminComponent) } // separate chunk
];                                                          // end routes` }
    ],
    roadmap: ['Bundles & chunks', 'Dynamic import', 'Route-level splitting', 'Component-level splitting', 'Tree shaking', 'Bundle analysis'],
    related: ['perf-core-web-vitals', 'tool-vite-webpack']
  },
  {
    id: 'sec-xss', cat: 'security', name: 'XSS & Content Security Policy', level: 'Intermediate',
    oneLiner: 'Cross-Site Scripting injects attacker scripts into your page; CSP is a browser-enforced allow-list that limits what can run.',
    explanation: `Types: Stored (malicious content saved in DB and shown to others), Reflected (in URL/response), DOM-based (unsafe client-side sinks like innerHTML, eval, location assignments).

Frameworks escape text by default ({value} in React, {{ }} in Angular). Danger zones: dangerouslySetInnerHTML, [innerHTML] with bypassSecurityTrust*, v-html, href="javascript:…", and third-party scripts.

Defences: escape/encode output, sanitise HTML with DOMPurify, avoid inline scripts, use CSP with nonces or hashes (script-src 'self' 'nonce-…'), HttpOnly cookies so stolen JS cannot read sessions, and Trusted Types to lock down DOM sinks.`,
    diagram: `flowchart LR
  A["Attacker input: script tag in comment"] --> DB["Saved to database"]
  DB --> P["Rendered with innerHTML"]
  P --> X["Script runs in victim browser: steals data"]
  S["Sanitise + escape"] -. "blocks" .-> P
  C["CSP: script-src self + nonce"] -. "blocks" .-> X`,
    code: { lang: 'javascript', src: `import DOMPurify from 'dompurify';                     // battle-tested HTML sanitiser

const userBio = '<img src=x onerror="alert(document.cookie)"> Hello'; // malicious input example

// ❌ Dangerous: browser parses and runs the onerror handler
// el.innerHTML = userBio;

// ✅ Safe for plain text: treated as text, never parsed as HTML
document.querySelector('#bio-text').textContent = userBio; // shows the raw characters

// ✅ Safe when you NEED rich HTML: sanitise first
const clean = DOMPurify.sanitize(userBio);             // strips onerror and other dangerous parts
document.querySelector('#bio-html').innerHTML = clean; // now only safe markup remains

// React equivalent: <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />

// Server response header (CSP) — the browser refuses scripts not from your origin or without the nonce:
// Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m'; object-src 'none'` },
    interview: [
      { q: 'Does React prevent XSS?', a: 'It escapes values in JSX by default, but dangerouslySetInnerHTML, javascript: URLs and unsafe third-party code can still introduce XSS.' },
      { q: 'What is CSP?', a: 'A response header that restricts sources of scripts, styles, images, frames, etc., reducing the impact of injection.' },
      { q: 'What is DOM-based XSS?', a: 'XSS where client-side JS reads attacker-controlled data (URL hash, query) and writes it into a dangerous sink without a server round-trip.' }
    ],
    coding: [
      { q: 'Validate a user-supplied URL before using it as href.', a: `function safeUrl(input) {                          // returns a safe URL or '#'
  try {                                             // URL constructor throws on invalid input
    const u = new URL(input, location.origin);      // resolve relative URLs
    return ['http:', 'https:'].includes(u.protocol) ? u.href : '#'; // block javascript:, data:
  } catch { return '#'; }                           // invalid → neutral link
}                                                   // end safeUrl` }
    ],
    roadmap: ['Same-origin policy', 'XSS types', 'Escaping & sanitising', 'CSP', 'Trusted Types', 'Third-party script risk'],
    related: ['sec-csrf', 'net-auth-jwt', 'ai-prompt-injection']
  },
  {
    id: 'sec-csrf', cat: 'security', name: 'CSRF & SameSite Cookies', level: 'Intermediate',
    oneLiner: 'Cross-Site Request Forgery tricks a logged-in browser into sending an unwanted request; SameSite cookies and CSRF tokens prevent it.',
    explanation: `Because browsers attach cookies automatically, a malicious site can submit a form to bank.com/transfer and the user's session cookie goes with it.

Defences: SameSite=Lax (default in modern browsers) or Strict on session cookies; anti-CSRF tokens (synchroniser or double-submit) on state-changing requests; check Origin/Referer headers; never change state on GET.

Bearer tokens in an Authorization header are not sent automatically, so they are not CSRF-prone — but they are more exposed to XSS. Security is a trade-off.`,
    diagram: `sequenceDiagram
  participant V as Victim browser
  participant E as evil.com
  participant B as bank.com
  V->>E: Visits page
  E-->>V: Hidden auto-submitting form to bank.com
  V->>B: POST /transfer + session cookie
  Note over B: SameSite=Lax cookie NOT sent cross-site → blocked`,
    code: { lang: 'javascript', src: `// Server sets a hardened session cookie (Express example)
res.cookie('sid', sessionId, {        // cookie name and value
  httpOnly: true,                     // JS cannot read it → protects against XSS theft
  secure: true,                       // only over HTTPS
  sameSite: 'lax',                    // not sent on cross-site POSTs → blocks classic CSRF
  maxAge: 1000 * 60 * 60 * 8          // 8 hours
});                                   // end cookie

// Client: send the CSRF token (from a meta tag) with state-changing requests
const csrf = document.querySelector('meta[name="csrf-token"]').content; // token rendered by the server
fetch('/api/profile', {               // mutation request
  method: 'POST',                     // state change
  headers: { 'X-CSRF-Token': csrf },  // server compares this with the session's token
  credentials: 'include'              // send cookies
});                                   // end fetch` },
    interview: [
      { q: 'XSS vs CSRF?', a: 'XSS runs attacker code in your origin; CSRF makes the browser send a forged request using existing credentials without running code on your site.' },
      { q: 'SameSite Lax vs Strict vs None?', a: 'Strict: never cross-site. Lax: sent on top-level GET navigations only. None: always (requires Secure) — needed for third-party embeds.' }
    ],
    coding: [
      { q: 'Check Origin on the server for mutations.', a: `if (req.method !== 'GET' && req.headers.origin !== 'https://app.example.com') { // unexpected origin
  return res.status(403).send('Bad origin');                                     // reject the request
}                                                                                // end check` }
    ],
    roadmap: ['Cookies', 'CSRF attack flow', 'SameSite', 'CSRF tokens', 'Origin checks'],
    related: ['sec-xss', 'net-auth-jwt', 'net-cors']
  },
  {
    id: 'test-rtl-playwright', cat: 'testing', name: 'Unit, Integration & E2E Testing (Vitest, Testing Library, Playwright)', level: 'Intermediate',
    oneLiner: 'Unit tests check functions, component/integration tests check UI behaviour like a user, E2E tests drive a real browser through full flows.',
    explanation: `Testing trophy/pyramid: many fast unit tests, a solid layer of integration (component) tests, a few critical E2E tests.

Vitest/Jest: test runner with expect assertions and mocking. Testing Library: render components and query them the way users find them — getByRole, getByLabelText — not by CSS class or implementation detail. user-event simulates real typing and clicks. MSW (Mock Service Worker) mocks the network at the request level.

Playwright: cross-browser E2E with auto-waiting, tracing, parallel runs and codegen. Run all of it in CI on every pull request.`,
    diagram: `flowchart BT
  U["Unit: pure functions, hooks — many, fast"] --> I["Integration: component + user events + MSW"]
  I --> E["E2E: Playwright full flows — few, slow"]
  E --> CI["Run in CI on every PR"]`,
    code: { lang: 'jsx', src: `// Counter.test.jsx — runs with Vitest + React Testing Library
import { render, screen } from '@testing-library/react';  // render into a test DOM, query helpers
import userEvent from '@testing-library/user-event';      // realistic user interactions
import { expect, test } from 'vitest';                     // test runner API
import Counter from './Counter';                           // component under test

test('increments when the user clicks', async () => {      // describe the behaviour, not internals
  const user = userEvent.setup();                          // create a user session
  render(<Counter />);                                     // mount the component
  const button = screen.getByRole('button', { name: /add/i }); // find like a user / screen reader
  await user.click(button);                                // real click sequence
  expect(screen.getByText('Count: 1')).toBeInTheDocument();// assert what the user sees
});                                                        // end test

// e2e/login.spec.js — Playwright
// test('login works', async ({ page }) => {
//   await page.goto('/login');                                         // open the page
//   await page.getByLabel('Email').fill('a@b.com');                    // type into labelled input
//   await page.getByRole('button', { name: 'Sign in' }).click();       // click the button
//   await expect(page.getByText('Welcome')).toBeVisible();             // auto-waits for result
// });` },
    interview: [
      { q: 'Why query by role instead of test IDs?', a: 'Role queries mirror how users and assistive tech find elements, so tests are more meaningful and also catch accessibility issues.' },
      { q: 'What is MSW?', a: 'Mock Service Worker intercepts network requests in browser and Node, letting tests and dev use realistic mocked APIs.' },
      { q: 'Snapshot tests — good or bad?', a: 'Useful for small stable outputs; large snapshots get rubber-stamped and rarely catch real bugs.' }
    ],
    coding: [
      { q: 'Test an async API call result with findBy.', a: `render(<Users />);                                   // component fetches on mount
expect(await screen.findByText('Riya')).toBeInTheDocument(); // findBy* waits until it appears` }
    ],
    roadmap: ['Test types', 'Vitest/Jest', 'Testing Library queries', 'Mocking & MSW', 'Playwright', 'CI & coverage'],
    related: ['tool-vite-webpack', 'a11y-aria']
  },
  {
    id: 'tool-vite-webpack', cat: 'tooling', name: 'Bundlers: Vite vs Webpack (and Rspack, Turbopack)', level: 'Intermediate',
    oneLiner: 'Bundlers turn your modules into optimised files for the browser; Vite uses native ESM in dev for instant start.',
    explanation: `Webpack builds a full dependency graph and bundle even in development — very configurable (loaders, plugins, Module Federation) but slower on big apps.

Vite serves source files as native ES modules during development and pre-bundles dependencies with esbuild, so the dev server starts almost instantly and HMR is fast. Production builds use Rollup (moving to Rolldown, a Rust-based Rollup).

Rust-based tools are the trend: Rspack (Webpack-compatible), Turbopack (Next.js), SWC and esbuild for transpiling, Biome/Oxc for linting and formatting.`,
    diagram: `flowchart LR
  subgraph WP["Webpack dev"]
    W1["Crawl all modules"] --> W2["Bundle"] --> W3["Serve bundle"]
  end
  subgraph VT["Vite dev"]
    V1["Serve index.html"] --> V2["Browser requests ESM modules on demand"] --> V3["Transform only what is requested"]
  end`,
    code: { lang: 'javascript', src: `// vite.config.js
import { defineConfig } from 'vite';                // typed config helper
import react from '@vitejs/plugin-react';           // React support (JSX, Fast Refresh)

export default defineConfig({                       // export the config
  plugins: [react()],                               // plugins array
  server: {                                         // dev server options
    port: 5173,                                     // local port
    proxy: { '/api': 'http://localhost:4000' }      // forward API calls → no CORS in dev
  },                                                // end server
  build: {                                          // production build options
    sourcemap: true,                                // generate source maps for debugging
    rollupOptions: {                                // pass-through to Rollup
      output: { manualChunks: { vendor: ['react', 'react-dom'] } } // split vendor code into its own chunk
    }                                               // end rollupOptions
  }                                                 // end build
});                                                 // end config` },
    interview: [
      { q: 'Why is Vite faster in development?', a: 'It skips bundling in dev, serving native ESM and transforming files on demand, with esbuild pre-bundling dependencies.' },
      { q: 'What is HMR?', a: 'Hot Module Replacement swaps updated modules in the running app without a full reload, preserving state where possible.' },
      { q: 'What is Module Federation?', a: 'A Webpack/Rspack feature letting separately deployed builds share code at runtime — a common basis for micro-frontends.' }
    ],
    coding: [
      { q: 'Expose environment variables safely in Vite.', a: `// .env → VITE_API_URL=https://api.example.com   (only VITE_ prefixed vars reach the client)
const api = import.meta.env.VITE_API_URL;          // read at build time
// Never put secret keys in VITE_ vars — they are visible in the bundle.` }
    ],
    roadmap: ['Modules (ESM vs CJS)', 'Transpiling (Babel/SWC)', 'Bundling', 'Dev server & HMR', 'Optimisation', 'Rust toolchain'],
    related: ['perf-code-splitting', 'sysdesign-microfrontends']
  },
  {
    id: 'a11y-aria', cat: 'a11y', name: 'ARIA, Keyboard & Focus Management (WCAG 2.2)', level: 'Intermediate',
    oneLiner: 'Make interfaces usable with keyboards and screen readers using semantic HTML first, ARIA only to fill gaps, and deliberate focus handling.',
    explanation: `First rule of ARIA: do not use ARIA if a native element does the job. ARIA changes what is announced, never behaviour — role="button" does not make Enter work.

Essentials: every interactive element reachable by Tab with a visible focus style; logical order; labels for inputs; alt text; colour contrast 4.5:1 for body text; aria-expanded / aria-controls for disclosure widgets; aria-live regions for dynamic messages (toasts, form errors).

Focus management: move focus into opened dialogs and return it on close; trap focus in modals (native <dialog> does this); skip links. WCAG 2.2 adds focus not obscured, minimum target size (24×24 px), and accessible authentication.`,
    diagram: `flowchart TD
  N{"Is there a native HTML element for it?"} -- Yes --> H["Use it: button, a, dialog, details, input"]
  N -- No --> A["Add role + states: aria-expanded, aria-selected"]
  A --> K["Implement keyboard: Enter, Space, Arrows, Escape"]
  K --> F["Manage focus + visible focus ring"]
  F --> T["Test: keyboard only, screen reader, axe"]`,
    code: { lang: 'jsx', src: `import { useId, useState } from 'react';                // useId gives unique, SSR-safe ids

export function Disclosure({ title, children }) {      // accessible show/hide section
  const [open, setOpen] = useState(false);              // expanded state
  const panelId = useId();                              // id linking button and panel
  return (                                              // UI
    <div>
      <button                                           // native button: focusable, Enter/Space work
        aria-expanded={open}                            // announces "expanded"/"collapsed"
        aria-controls={panelId}                         // tells AT which element it controls
        onClick={() => setOpen((o) => !o)}              // toggle
      >
        {title}                                         {/* accessible name from text */}
      </button>
      <div id={panelId} hidden={!open}>{children}</div> {/* hidden removes it from the a11y tree */}
      <p aria-live="polite" className="sr-only">        {/* screen readers announce changes politely */}
        {open ? title + ' expanded' : ''}
      </p>
    </div>
  );                                                    // end return
}                                                       // end Disclosure` },
    interview: [
      { q: 'First rule of ARIA?', a: 'Prefer native semantic HTML; use ARIA only when no native element provides the needed semantics.' },
      { q: 'aria-label vs aria-labelledby vs aria-describedby?', a: 'aria-label gives a string name; aria-labelledby points to visible text that names it; aria-describedby adds extra descriptive text.' },
      { q: 'What is an aria-live region?', a: 'An element whose content changes are announced by screen readers (polite waits, assertive interrupts).' },
      { q: 'What is new in WCAG 2.2?', a: 'Criteria like Focus Not Obscured, Target Size (Minimum), Dragging Movements, Consistent Help, Accessible Authentication and Redundant Entry.' }
    ],
    coding: [
      { q: 'Visually hide text but keep it for screen readers.', a: `.sr-only {                      /* utility class */
  position: absolute;            /* take out of layout */
  width: 1px; height: 1px;       /* tiny box */
  overflow: hidden;              /* hide overflow */
  clip-path: inset(50%);         /* clip everything visually */
  white-space: nowrap;           /* avoid wrapping artefacts */
}` }
    ],
    roadmap: ['Semantic HTML', 'Keyboard navigation', 'Labels & names', 'ARIA states', 'Focus management', 'WCAG 2.2 audit'],
    related: ['html-semantic', 'test-rtl-playwright']
  },
  {
    id: 'pwa-installable', cat: 'pwa', name: 'Progressive Web Apps & App-Store Delivery', level: 'Intermediate',
    oneLiner: 'Web apps that install to the home screen, work offline and can be packaged for Play Store / App Store.',
    explanation: `A PWA needs: HTTPS, a web app manifest (name, icons, start_url, display: standalone), and a service worker with a fetch handler for offline support. Android Chrome shows an install prompt (beforeinstallprompt); on iOS Safari users tap Share → Add to Home Screen. iOS supports web push for installed PWAs (16.4+).

To reach stores: Android — wrap with a Trusted Web Activity (Bubblewrap / PWABuilder) and verify with Digital Asset Links. iOS — wrap with Capacitor (WKWebView) and add some native value, since Apple rejects apps that are "just a website". React Native / Flutter are alternatives when you need deep native APIs.`,
    diagram: `flowchart LR
  W["Web app on Vercel: HTTPS"] --> M["manifest.webmanifest"]
  W --> SW["service worker: offline cache"]
  M --> I["Installable PWA: Android + iOS home screen"]
  SW --> I
  I --> PS["Play Store via TWA / PWABuilder"]
  I --> AS["App Store via Capacitor wrapper"]`,
    code: { lang: 'javascript', src: `let deferredPrompt = null;                               // saved install event (Chrome/Android)

window.addEventListener('beforeinstallprompt', (e) => {  // browser says "this app is installable"
  e.preventDefault();                                    // stop the automatic mini-infobar
  deferredPrompt = e;                                    // keep it to show later from our own button
  document.querySelector('#install').hidden = false;     // reveal our custom Install button
});                                                      // end listener

document.querySelector('#install').addEventListener('click', async () => { // user taps Install
  if (!deferredPrompt) return;                           // nothing to show (iOS or already installed)
  deferredPrompt.prompt();                               // show the native install dialog
  const { outcome } = await deferredPrompt.userChoice;   // 'accepted' or 'dismissed'
  console.log('Install', outcome);                       // analytics
  deferredPrompt = null;                                 // the prompt can only be used once
});                                                      // end click

const isStandalone = matchMedia('(display-mode: standalone)').matches; // running as installed app?` },
    interview: [
      { q: 'Minimum requirements for an installable PWA?', a: 'HTTPS, a manifest with name, icons (192 and 512), start_url and display, plus a registered service worker.' },
      { q: 'PWA vs native app?', a: 'PWA: one codebase, instant updates, no store review, linkable. Native: full device APIs, better store discovery, deeper OS integration.' },
      { q: 'How do you publish a PWA to the Play Store?', a: 'Package it as a Trusted Web Activity with Bubblewrap or PWABuilder and verify domain ownership with assetlinks.json.' }
    ],
    coding: [
      { q: 'Detect iOS to show "Add to Home Screen" instructions.', a: `const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent); // iOS devices
const installed = navigator.standalone === true;             // iOS-specific installed flag
if (isIOS && !installed) showIosInstallHint();               // guide the user manually` }
    ],
    roadmap: ['Responsive design', 'Manifest', 'Service worker', 'Offline strategies', 'Install UX', 'TWA & Capacitor store builds'],
    related: ['webapi-workers', 'perf-core-web-vitals']
  },
  {
    id: 'devops-git-ci', cat: 'devops', name: 'Git Workflows & CI/CD for Frontend', level: 'Beginner',
    oneLiner: 'Branch, review and merge with Git; let a CI pipeline lint, test and build every change, and deploy previews automatically.',
    explanation: `Common flows: trunk-based (short-lived branches merged to main daily, behind feature flags) or GitFlow (develop/release branches). Rebase keeps a linear history; merge preserves context. Never rewrite shared history.

CI (GitHub Actions, GitLab CI): on each push/PR → install with a lockfile (npm ci), lint, type-check, unit tests, build, E2E. CD: Vercel/Netlify create a preview URL per PR and promote main to production. Keep secrets in the platform's environment variables, never in the repo. Monitor with Sentry / RUM and roll back instantly if needed.`,
    diagram: `flowchart LR
  B["feature branch"] --> PR["Pull request"]
  PR --> CI["CI: lint, typecheck, test, build"]
  CI --> PV["Preview deployment URL"]
  PV --> RV["Code review"]
  RV --> M["Merge to main"]
  M --> P["Production deploy"]`,
    code: { lang: 'yaml', src: `# .github/workflows/ci.yml — runs on every PR
name: CI                                  # workflow name shown in GitHub
on: [pull_request]                        # trigger: any pull request
jobs:                                     # list of jobs
  build:                                  # job id
    runs-on: ubuntu-latest                # GitHub-hosted Linux runner
    steps:                                # ordered steps
      - uses: actions/checkout@v4         # clone the repository
      - uses: actions/setup-node@v4       # install Node.js
        with: { node-version: 22, cache: npm } # Node 22 + npm cache for speed
      - run: npm ci                       # clean install exactly from package-lock.json
      - run: npm run lint                 # code style & bug checks
      - run: npx tsc --noEmit             # type-check without emitting files
      - run: npm test -- --run            # unit/integration tests once (no watch)
      - run: npm run build                # make sure production build succeeds` },
    interview: [
      { q: 'Rebase vs merge?', a: 'Rebase replays your commits on top of the target for linear history; merge creates a merge commit preserving branch history. Do not rebase shared branches.' },
      { q: 'npm install vs npm ci?', a: 'npm ci installs exactly from the lockfile, deletes node_modules first and fails if package.json and lockfile mismatch — ideal for CI.' },
      { q: 'What are feature flags?', a: 'Runtime switches to enable code for some users, enabling trunk-based development, gradual rollouts and A/B tests (e.g. with Adobe Target or LaunchDarkly).' }
    ],
    coding: [
      { q: 'Undo the last commit but keep changes.', a: `git reset --soft HEAD~1   # move branch back one commit; changes stay staged
# If already pushed to a shared branch, prefer: git revert <sha>` }
    ],
    roadmap: ['Git basics', 'Branching strategies', 'Pull requests', 'CI pipelines', 'Preview deployments', 'Monitoring & rollback'],
    related: ['test-rtl-playwright', 'tool-vite-webpack']
  },
  {
    id: 'sysdesign-microfrontends', cat: 'sysdesign', name: 'Frontend System Design & Micro-Frontends', level: 'Advanced',
    oneLiner: 'Structuring large frontends: choosing rendering, data flow, component architecture, and splitting apps so independent teams can ship.',
    explanation: `Frontend system design interviews (common for senior roles) follow RADIO: Requirements → Architecture → Data model → Interface (API) → Optimisations.

Cover: rendering strategy (CSR/SSR/SSG), component hierarchy, state ownership, API contracts (REST/GraphQL, pagination: cursor vs offset), caching, performance (virtualisation, code splitting, images), accessibility, i18n, offline, error handling, observability and security.

Micro-frontends split a product into independently deployed apps owned by different teams — composed via Module Federation, web components, iframes or server-side composition. Benefits: team autonomy. Costs: duplicated dependencies, inconsistent UX, shared-state complexity. Use a shared design system and keep contracts small.`,
    diagram: `flowchart TD
  SH["Shell app: routing, auth, design system"] --> MF1["Search MFE — Team A"]
  SH --> MF2["Cart MFE — Team B"]
  SH --> MF3["Account MFE — Team C"]
  MF1 -. "custom events / URL" .- MF2
  DS["Shared design system + tokens"] --> MF1
  DS --> MF2
  DS --> MF3`,
    code: { lang: 'javascript', src: `// Autocomplete design — client side core (a classic system design question)
const cache = new Map();                                // in-memory cache: query → results
let controller;                                         // to cancel the previous request

async function suggest(query) {                         // called from a debounced input handler
  const q = query.trim().toLowerCase();                 // normalise the key
  if (q.length < 2) return [];                          // avoid useless requests
  if (cache.has(q)) return cache.get(q);                // instant result from cache
  controller?.abort();                                  // cancel the in-flight older request (race-safe)
  controller = new AbortController();                   // new controller for this request
  const res = await fetch('/api/suggest?q=' + encodeURIComponent(q), { signal: controller.signal }); // encode user input
  const items = (await res.json()).slice(0, 8);         // limit results for UI and payload
  cache.set(q, items);                                  // store for repeat queries
  if (cache.size > 200) cache.delete(cache.keys().next().value); // simple LRU-ish eviction of oldest key
  return items;                                         // render as role="listbox" with keyboard support
}                                                       // end suggest` },
    interview: [
      { q: 'How would you design a news feed?', a: 'SSR first page for SEO/LCP, cursor-based pagination, infinite scroll with IntersectionObserver, list virtualisation, normalised cache, optimistic likes, image lazy-loading, skeletons, and real-time updates via SSE/WebSocket.' },
      { q: 'When are micro-frontends worth it?', a: 'When many teams need independent release cycles on one product. For a single team they add unnecessary complexity.' },
      { q: 'Offset vs cursor pagination?', a: 'Offset is simple but breaks with inserts/deletes and is slow at depth; cursor uses a stable marker and suits infinite feeds.' }
    ],
    coding: [
      { q: 'Communicate between micro-frontends without tight coupling.', a: `// Team A publishes an event
window.dispatchEvent(new CustomEvent('cart:add', { detail: { sku: 'A12' } })); // fire event
// Team B listens
window.addEventListener('cart:add', (e) => addToCart(e.detail.sku)); // react to it` }
    ],
    roadmap: ['RADIO framework', 'Rendering choice', 'Component & state design', 'API & pagination', 'Performance & a11y', 'Micro-frontends'],
    related: ['tool-vite-webpack', 'perf-core-web-vitals', 'state-tanstack-query']
  }
];
