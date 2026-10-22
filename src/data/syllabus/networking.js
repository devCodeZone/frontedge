// APIs & Networking — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. How the Web Works',
    t('net-url-to-page', 'What Happens When You Type a URL', 'B', {
      one: 'The journey from URL to pixels: DNS lookup, TCP/QUIC connection, TLS handshake, HTTP request, server response, then parsing, rendering and loading sub-resources.',
      ex: `Browser checks caches (memory, disk, service worker), resolves the domain via DNS to an IP, opens a connection (TCP + TLS 1.3, or QUIC for HTTP/3), sends the HTTP request with headers/cookies, receives the response (possibly from a CDN edge), parses HTML, discovers CSS/JS/images (preload scanner), builds DOM/CSSOM, executes scripts, lays out, paints and composites.

A classic interview question — mention caching, CDN, TLS, critical rendering path and how frontend optimisations (preconnect, compression, HTTP/2) shorten each step.`,
      pts: ['Cache → DNS → connection → TLS → HTTP', 'CDN edges shorten distance', 'Parse → render → paint', 'Each step has optimisations'],
      flow: ['Check caches', 'DNS lookup', 'TCP or QUIC + TLS handshake', 'HTTP request and response', 'Parse HTML, CSS, JS', 'Layout, paint, composite'],
      code: ['javascript', `// Measure the phases of the main document load
const [nav] = performance.getEntriesByType('navigation');  // Navigation Timing entry
console.table({
  dns: nav.domainLookupEnd - nav.domainLookupStart,         // DNS time
  connect: nav.connectEnd - nav.connectStart,                // TCP + TLS
  tls: nav.secureConnectionStart ? nav.connectEnd - nav.secureConnectionStart : 0, // TLS part
  ttfb: nav.responseStart - nav.requestStart,                // time to first byte
  download: nav.responseEnd - nav.responseStart,             // HTML transfer
  domReady: nav.domContentLoadedEventEnd - nav.startTime     // until DOMContentLoaded
});`],
      iq: [['Explain what happens when you enter a URL.', 'Cache check, DNS resolution, TCP/QUIC + TLS handshake, HTTP request/response (maybe via CDN), HTML parsing, sub-resource loading, DOM/CSSOM, layout, paint and composite.'],
           ['What is TTFB?', 'Time to First Byte: time from request start until the first byte of the response arrives.']],
      cq: [['Warm up a third-party connection.', `<link rel="preconnect" href="https://api.example.com" crossorigin> <!-- DNS+TCP+TLS early -->`]],
      err: ['Ignoring server/TTFB when optimising frontend']
    }),
    t('net-http-basics', 'HTTP Basics: requests, responses, headers, methods', 'B', {
      one: 'HTTP is a request–response protocol: a request has method, URL, headers and optional body; a response has status, headers and body.',
      ex: `Methods: GET (read), POST (create/action), PUT (replace), PATCH (partial update), DELETE, HEAD (headers only), OPTIONS (CORS preflight). Safe methods don't change state; idempotent methods can be repeated with the same effect.

Common request headers: Accept, Content-Type, Authorization, Cookie, Cache-Control, If-None-Match, User-Agent, Origin. Response headers: Content-Type, Cache-Control, ETag, Set-Cookie, Location, Access-Control-*, Content-Encoding. HTTP is stateless — cookies/tokens add state.`,
      pts: ['Method + URL + headers + body', 'Status + headers + body', 'Safe vs idempotent methods', 'Stateless protocol'],
      code: ['http', `GET /api/terms?track=react HTTP/2          # method, path + query
Host: frontedge.app                          # target host
Accept: application/json                     # what we can read
Authorization: Bearer eyJhbGciOi...          # credentials
If-None-Match: "v42"                         # conditional request (cache)

HTTP/2 200                                   # status
Content-Type: application/json; charset=utf-8
Cache-Control: max-age=60, stale-while-revalidate=300
ETag: "v43"                                  # version of this response
Content-Encoding: br                         # brotli compressed`],
      iq: [['Which HTTP methods are idempotent?', 'GET, HEAD, PUT, DELETE, OPTIONS (POST and PATCH are not guaranteed to be).'],
           ['What does stateless mean?', 'Each request is independent; the server doesn’t remember previous requests unless state is sent (cookies, tokens).']],
      cq: [['Send a HEAD request to check if a file exists.', `const res = await fetch('/files/report.pdf', { method: 'HEAD' }); // headers only
console.log(res.ok, res.headers.get('content-length'));`]],
      err: ['Using GET for state-changing actions']
    }),
    L('net-fetch-rest'),
    t('net-http-caching', 'HTTP Caching: Cache-Control, ETag, 304, immutable assets', 'I', {
      one: 'HTTP caching lets browsers and CDNs reuse responses: Cache-Control sets freshness, ETag/Last-Modified enable revalidation (304 Not Modified), and hashed filenames allow year-long caching.',
      ex: `Cache-Control directives: max-age (browser), s-maxage (shared/CDN), no-cache (store but revalidate every time), no-store (never store), private/public, immutable, stale-while-revalidate. Revalidation sends If-None-Match: ETag; unchanged → 304 with no body.

Best practice: HTML → no-cache (always revalidate); hashed assets (app.3f9a.js) → public, max-age=31536000, immutable; APIs → short max-age or private. Purge or version on deploy.`,
      pts: ['max-age / s-maxage / no-cache / no-store', 'ETag → 304 revalidation', 'Hashed assets cached forever', 'HTML always revalidated'],
      flow: ['Request', 'Fresh in cache? serve', 'Stale: send If-None-Match', 'Server 304: reuse body', 'Or 200 with new body'],
      code: ['javascript', `// Express: set caching per resource type
app.use('/assets', express.static('dist/assets', {
  setHeaders: (res) => res.setHeader('Cache-Control', 'public, max-age=31536000, immutable') // hashed files
}));
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');            // HTML: revalidate every time
  res.sendFile('dist/index.html');
});
app.get('/api/terms', (req, res) => {
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // CDN caches 5 min
  res.json(terms);                                        // Express adds a weak ETag automatically
});`],
      iq: [['no-cache vs no-store?', 'no-cache may store but must revalidate before use; no-store must not store at all.'],
           ['Why can hashed assets be cached forever?', 'Any content change produces a new filename, so the old URL never needs updating.']],
      cq: [['Bypass the HTTP cache for one fetch.', `fetch('/api/stats', { cache: 'no-store' }); // always go to network`]],
      err: ['Long max-age on index.html (users stuck on old versions)']
    }),
    t('net-https-http-versions', 'HTTPS/TLS & HTTP/1.1 vs HTTP/2 vs HTTP/3', 'I', {
      one: 'HTTPS encrypts HTTP with TLS; HTTP/2 multiplexes many requests over one connection; HTTP/3 runs over QUIC (UDP) to avoid head-of-line blocking and speed up connection setup.',
      ex: `TLS provides encryption, integrity and server authentication via certificates (Let's Encrypt). Browsers require HTTPS for service workers, geolocation, camera, HTTP/2 in practice, and mark HTTP as "Not secure". HSTS forces HTTPS.

HTTP/1.1: one request at a time per connection (browsers open ~6) → domain sharding and bundling hacks. HTTP/2: multiplexing, header compression (HPACK), stream priorities — many small files are fine. HTTP/3/QUIC: faster handshakes (0-RTT), better on lossy mobile networks, connection migration across Wi-Fi/4G.`,
      pts: ['TLS = encryption + identity', 'Secure context required for many APIs', 'HTTP/2 multiplexing', 'HTTP/3 over QUIC for mobile'],
      dia: `flowchart LR
  H1["HTTP/1.1: 6 parallel connections, one request each"] --> H2["HTTP/2: one TCP connection, many multiplexed streams"]
  H2 --> H3["HTTP/3: QUIC over UDP, no TCP head-of-line blocking"]`,
      code: ['javascript', `// Check the protocol used for each resource
performance.getEntriesByType('resource').forEach((r) => {
  console.log(r.name.split('/').pop(), r.nextHopProtocol); // "h2", "h3" or "http/1.1"
});
console.log(window.isSecureContext);                       // true on HTTPS/localhost`],
      iq: [['What problem does HTTP/2 multiplexing solve?', 'HTTP/1.1’s one-request-per-connection limit; many requests share one connection concurrently.'],
           ['Why is HTTP/3 faster on mobile?', 'QUIC reduces handshake round trips and avoids TCP head-of-line blocking when packets are lost.']],
      cq: [['Force HTTPS with HSTS.', `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload  # response header`]],
      err: ['Domain sharding on HTTP/2']
    })
  ),
  m('2. APIs & Auth',
    L('net-cors'),
    t('net-api-design', 'REST API Design: resources, pagination, filtering, errors, versioning', 'I', {
      one: 'Good APIs use resource-based URLs, correct methods/status codes, consistent pagination and filtering, structured errors and versioning — making frontends simpler.',
      ex: `Resources are nouns (/terms, /terms/42/comments). Pagination: offset (?page=2&limit=20 — simple, unstable with inserts) or cursor (?cursor=abc — stable, ideal for infinite scroll). Filtering/sorting via query params (?level=advanced&sort=-createdAt). Errors in a consistent shape (RFC 9457 Problem Details: type, title, status, detail, errors[]).

Versioning via URL (/v2) or headers. Frontend devs often define API contracts with backend teams (OpenAPI) and may build a BFF.`,
      pts: ['Nouns + HTTP verbs', 'Cursor pagination for feeds', 'Consistent error format', 'Version APIs'],
      code: ['javascript', `// Consuming a cursor-paginated API
async function loadPage(cursor) {
  const url = new URL('/api/terms', location.origin);
  url.searchParams.set('limit', '20');                     // page size
  if (cursor) url.searchParams.set('cursor', cursor);      // continue from last item
  const res = await fetch(url);
  if (!res.ok) {
    const problem = await res.json();                      // { title, status, detail, errors }
    throw new Error(problem.detail ?? problem.title);      // show server message
  }
  return res.json();                                       // { items: [...], nextCursor: 'abc' | null }
}`],
      iq: [['Offset vs cursor pagination?', 'Offset is simple and supports jumping to pages but shifts with inserts and is slow at depth; cursor is stable and efficient for infinite lists.']],
      cq: [['Infinite scroll loop with cursors.', `let cursor = null, all = [];
do { const page = await loadPage(cursor); all.push(...page.items); cursor = page.nextCursor; } while (cursor && all.length < 100);`]],
      err: ['Verbs in URLs like /getTerms']
    }),
    L('net-auth-jwt'),
    t('net-oauth-oidc', 'OAuth 2.0, OpenID Connect & PKCE', 'I', {
      one: 'OAuth 2.0 lets apps get limited access tokens on a user’s behalf; OpenID Connect adds identity (ID tokens) for "Sign in with Google"; SPAs must use the Authorization Code flow with PKCE.',
      ex: `Roles: user, client (your app), authorization server (Google/Auth0/Keycloak), resource server (API). Code flow + PKCE: app creates a code_verifier and code_challenge, redirects to the auth server, user consents, app receives a code, exchanges it (with the verifier) for tokens. The implicit flow is deprecated.

Best practice for SPAs: a backend-for-frontend (BFF) does the token exchange and keeps tokens server-side, giving the browser only an HttpOnly session cookie.`,
      pts: ['OAuth = authorisation, OIDC = authentication', 'Code flow + PKCE for SPAs', 'Implicit flow deprecated', 'BFF keeps tokens off the browser'],
      flow: ['App creates code_verifier + challenge', 'Redirect to auth server', 'User logs in and consents', 'Redirect back with code', 'Exchange code + verifier for tokens'],
      code: ['javascript', `async function startLogin() {
  const verifier = crypto.randomUUID() + crypto.randomUUID();           // random secret
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)); // SHA-256
  const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))  // base64url encode
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  sessionStorage.setItem('pkce_verifier', verifier);                    // needed after redirect
  const url = new URL('https://auth.example.com/authorize');
  url.search = new URLSearchParams({
    response_type: 'code', client_id: 'frontedge-web', redirect_uri: location.origin + '/callback',
    scope: 'openid profile email', code_challenge: challenge, code_challenge_method: 'S256',
    state: crypto.randomUUID()                                          // CSRF protection for the flow
  });
  location.assign(url);                                                 // go to login page
}`],
      iq: [['OAuth vs OpenID Connect?', 'OAuth grants access to resources (access tokens); OIDC is an identity layer on top that returns an ID token describing the user.'],
           ['Why PKCE?', 'Public clients can’t keep secrets; PKCE proves the token request comes from the same app that started the flow.']],
      cq: [['What is the state parameter for?', `// A random value stored before redirect and checked on callback to prevent CSRF/login injection.`]],
      err: ['Using the implicit flow', 'Storing refresh tokens in localStorage']
    }),
    t('net-axios-clients', 'HTTP Clients: fetch wrappers, Axios & interceptors', 'I', {
      one: 'Wrap HTTP calls in a single client (fetch wrapper or Axios) to centralise base URLs, auth headers, timeouts, error handling, retries and typing.',
      ex: `Axios offers interceptors, automatic JSON, timeouts, upload progress and rejects on non-2xx; fetch is native and works everywhere (including edge/server). Libraries like ky/ofetch wrap fetch with similar ergonomics.

Interceptors: attach tokens, refresh on 401 (queue concurrent requests during refresh), normalise errors, log. Keep the API layer separate from components (api/terms.ts).`,
      pts: ['One client for the whole app', 'Interceptors for auth/errors', 'Axios rejects non-2xx; fetch doesn’t', 'Separate API layer from UI'],
      code: ['javascript', `import axios from 'axios';
export const http = axios.create({ baseURL: '/api', timeout: 10_000 });   // shared client
http.interceptors.request.use((config) => {                               // before every request
  const token = getAccessToken();
  if (token) config.headers.Authorization = 'Bearer ' + token;            // attach auth
  return config;
});
http.interceptors.response.use(
  (res) => res,                                                           // pass through success
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {         // expired token
      error.config._retry = true;                                         // avoid loops
      await refreshToken();                                               // get a new token
      return http(error.config);                                          // retry original
    }
    return Promise.reject(normalizeError(error));                         // consistent errors
  }
);
export const getTerms = (track) => http.get('/terms', { params: { track } }).then((r) => r.data);`],
      iq: [['fetch vs Axios?', 'fetch is native, streaming-capable and requires manual JSON/error handling; Axios adds interceptors, timeouts, JSON defaults and rejects on HTTP errors.']],
      cq: [['Upload progress with Axios.', `await http.post('/upload', formData, { onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)) });`]],
      err: ['Calling fetch directly in dozens of components']
    }),
    t('net-file-upload', 'File Uploads: multipart, progress, chunking, presigned URLs', 'I', {
      one: 'Upload files with multipart/form-data, show progress, split large files into chunks/resumable uploads, and upload directly to cloud storage with presigned URLs.',
      ex: `Basic: FormData with the File → POST. Validate type/size on the client for UX and on the server for security. Progress: XHR upload events or Axios onUploadProgress (fetch upload progress is limited). Large files: chunked/resumable uploads (tus protocol, S3 multipart).

Presigned URLs: backend issues a short-lived signed URL; the browser PUTs the file directly to S3/GCS/R2 — no load on your server. Compress images client-side before upload.`,
      pts: ['FormData + multipart', 'Validate client and server', 'Chunked/resumable for large files', 'Presigned URLs to cloud storage'],
      flow: ['User selects file', 'Validate size and type', 'Ask backend for presigned URL', 'PUT file directly to storage', 'Notify backend with file key'],
      code: ['javascript', `async function uploadAvatar(file) {
  if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) throw new Error('Image ≤ 2MB only'); // client validation
  const { url, key } = await fetch('/api/uploads/presign', {              // backend signs a URL
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: file.name, type: file.type })
  }).then((r) => r.json());
  const put = await fetch(url, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file }); // direct to storage
  if (!put.ok) throw new Error('Upload failed');
  await fetch('/api/profile/avatar', { method: 'POST', body: JSON.stringify({ key }) }); // save reference
}`],
      iq: [['Why use presigned URLs?', 'Uploads go straight to object storage, saving server bandwidth and scaling better, while access stays controlled by short-lived signatures.']],
      cq: [['Compress an image before upload.', `const bitmap = await createImageBitmap(file);                       // decode
const canvas = new OffscreenCanvas(800, (800 / bitmap.width) * bitmap.height); // resize to 800px wide
canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
const smaller = await canvas.convertToBlob({ type: 'image/webp', quality: 0.8 }); // WebP 80%`]],
      err: ['Trusting client-side file type checks only']
    }),
    t('net-retry-resilience', 'Resilience: retries, backoff, idempotency, timeouts & offline', 'A', {
      one: 'Make network code robust with timeouts, retries using exponential backoff with jitter, idempotency keys for safe retries, circuit breaking and offline handling.',
      ex: `Retry only transient failures (network errors, 429, 502/503/504) — never 400/401/403/404. Exponential backoff with jitter avoids thundering herds; respect Retry-After headers. For POSTs, send an Idempotency-Key so retries don't double-charge.

Detect offline (navigator.onLine + failures), queue writes (IndexedDB + background sync) and show clear status. Show friendly errors with retry buttons.`,
      pts: ['Retry only transient errors', 'Exponential backoff + jitter', 'Idempotency keys for POST', 'Offline queue and UI'],
      code: ['javascript', `async function fetchWithRetry(url, opts = {}, retries = 3) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(8000) }); // 8s timeout
      if ([429, 502, 503, 504].includes(res.status) && attempt < retries) {         // transient
        const retryAfter = Number(res.headers.get('Retry-After')) * 1000;          // server hint
        await sleep(retryAfter || 2 ** attempt * 300 + Math.random() * 200);       // backoff + jitter
        continue;
      }
      return res;                                                                    // success or permanent error
    } catch (e) {
      if (attempt >= retries) throw e;                                               // give up
      await sleep(2 ** attempt * 300 + Math.random() * 200);                         // network error: retry
    }
  }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Payments: fetch('/api/pay', { method: 'POST', headers: { 'Idempotency-Key': crypto.randomUUID() }, body })`],
      iq: [['Why add jitter to backoff?', 'Randomness spreads retries from many clients so they don’t hit the server simultaneously.'],
           ['What is an idempotency key?', 'A unique key per logical operation so the server can recognise and ignore duplicate retries.']],
      cq: [['Show offline banner.', `const update = () => banner.hidden = navigator.onLine; addEventListener('online', update); addEventListener('offline', update); update();`]],
      err: ['Retrying 4xx errors', 'Retrying non-idempotent POSTs without keys']
    })
  ),
  m('3. Real-time & Alternative APIs',
    L('net-graphql-realtime'),
    t('net-graphql-clients', 'GraphQL in Depth: queries, mutations, fragments, Apollo/urql', 'I', {
      one: 'GraphQL clients (Apollo, urql, Relay) send typed queries to a single endpoint, normalise and cache results, and handle mutations, fragments and subscriptions.',
      ex: `Queries request exact fields with variables; mutations change data; fragments reuse field selections; subscriptions stream updates (WebSocket). Apollo's normalised cache (by __typename + id) updates every component showing an entity after a mutation.

Use codegen (GraphQL Code Generator) for typed hooks. Watch N+1 resolvers and query complexity on the server; persisted queries reduce payloads and improve security.`,
      pts: ['Variables + fragments', 'Normalised client cache', 'Codegen for types', 'Persisted queries'],
      code: ['javascript', `import { gql, useQuery, useMutation } from '@apollo/client';
const TERM_FIELDS = gql\`fragment TermFields on Term { id name level oneLiner }\`; // reusable fragment
const GET_TERMS = gql\`
  query Terms($track: String!) { terms(track: $track) { ...TermFields } }   # variables
  \${TERM_FIELDS}\`;
const SAVE = gql\`mutation Save($id: ID!) { saveTerm(id: $id) { id saved } }\`;
function Terms({ track }) {
  const { data, loading } = useQuery(GET_TERMS, { variables: { track } }); // cached query
  const [save] = useMutation(SAVE);                                        // cache updates by id
  if (loading) return <p>Loading…</p>;
  return data.terms.map((t) => <button key={t.id} onClick={() => save({ variables: { id: t.id } })}>{t.name}</button>);
}`],
      iq: [['How does Apollo update the UI after a mutation?', 'The mutation result includes the entity id and changed fields; the normalised cache updates that entity and all queries referencing it re-render.']],
      cq: [['Raw GraphQL with fetch.', `const res = await fetch('/graphql', { method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'query($id: ID!){ term(id: $id){ name } }', variables: { id: 'x' } }) });`]],
      err: ['Over-fetching huge nested queries']
    }),
    t('net-trpc-grpc-openapi', 'Typed APIs: OpenAPI/Swagger, tRPC & gRPC-Web', 'I', {
      one: 'Contract-first and end-to-end typed APIs: OpenAPI describes REST APIs (docs + codegen), tRPC shares TypeScript types between server and client, gRPC-Web uses Protocol Buffers.',
      ex: `OpenAPI (Swagger) specs generate interactive docs, mock servers and typed clients (openapi-typescript, Orval, Kubb) — great when backend is Java/.NET/Go. tRPC gives full-stack TypeScript apps typed procedure calls with no codegen (common with Next.js). gRPC-Web/Connect use protobuf schemas for efficient binary APIs, common in large enterprises.`,
      pts: ['OpenAPI → docs + typed clients', 'tRPC for full-stack TS', 'gRPC-Web/Connect with protobuf', 'Contracts reduce integration bugs'],
      code: ['typescript', `// Generated from OpenAPI: npx openapi-typescript https://api.example.com/openapi.json -o src/api/schema.ts
import createClient from 'openapi-fetch';
import type { paths } from './api/schema';
const api = createClient<paths>({ baseUrl: '/api' });              // typed client
const { data, error } = await api.GET('/terms/{id}', {             // path is autocompleted
  params: { path: { id: 'js-closures' } }                          // params are type-checked
});
if (data) console.log(data.name);                                  // response is typed`],
      iq: [['Why generate clients from OpenAPI?', 'Types and request code stay in sync with the backend contract, catching breaking changes at compile time.']],
      cq: [['tRPC call from React.', `const { data } = trpc.terms.byId.useQuery({ id: 'js-closures' }); // input and output typed from server`]],
      err: ['Hand-written API types drifting from the backend']
    }),
    t('net-polling-long-polling', 'Polling, Long Polling & Choosing Real-time Transport', 'B', {
      one: 'Polling repeatedly asks the server for updates; long polling holds the request open until data arrives; SSE and WebSockets push updates — pick based on frequency, direction and infrastructure.',
      ex: `Short polling: simple, wasteful at high frequency; use with backoff and pause when the tab is hidden. Long polling: near real-time over plain HTTP, more server connections. SSE: one-way server push with auto-reconnect. WebSocket: full-duplex. Webhooks are server-to-server.

For dashboards updating every 30s, polling is fine; chat or collaboration needs WebSockets; notifications and AI token streams suit SSE.`,
      pts: ['Polling = simple, periodic', 'Long polling = held requests', 'SSE / WebSocket = push', 'Pause when tab hidden'],
      dia: `flowchart TD
  Q{"Update frequency and direction?"} -->|"Every 30s+, simple"| P["Short polling"]
  Q -->|"Server → client, frequent"| S["SSE"]
  Q -->|"Both directions, low latency"| W["WebSocket"]
  Q -->|"Legacy infra, near real-time"| LP["Long polling"]`,
      code: ['javascript', `function startPolling(fn, interval = 30000) {
  let timer, stopped = false;
  async function tick() {
    if (stopped) return;
    if (document.visibilityState === 'visible') await fn().catch(() => {}); // skip when hidden
    timer = setTimeout(tick, interval);                                    // schedule after finishing
  }
  tick();
  return () => { stopped = true; clearTimeout(timer); };                  // stop function
}
const stop = startPolling(() => fetch('/api/notifications/count').then((r) => r.json()).then(updateBadge));`],
      iq: [['Long polling vs WebSocket?', 'Long polling uses repeated HTTP requests held open until data is ready; WebSocket keeps one persistent bidirectional connection.']],
      cq: [['Long polling loop.', `async function longPoll() { while (true) { const r = await fetch('/api/updates?wait=30'); if (r.status === 200) handle(await r.json()); } } // server responds when data or timeout`]],
      err: ['Polling every second for rarely changing data']
    })
  ),
  m('4. Infrastructure',
    t('net-cdn-dns-edge', 'CDNs, DNS & Edge Computing', 'I', {
      one: 'DNS maps domains to IPs; CDNs cache content on servers near users; edge functions run code at those locations for low-latency personalisation.',
      ex: `DNS records: A/AAAA (IP), CNAME (alias), TXT (verification), MX (mail); TTL controls caching. CDNs (Cloudflare, Akamai, CloudFront, Vercel/Netlify edges) cache static assets and cacheable API responses, terminate TLS, compress, protect against DDoS and serve images optimised.

Edge functions/middleware run at CDN locations for redirects, A/B tests, auth checks and geolocation. Purge caches on deploy or use versioned URLs.`,
      pts: ['DNS records and TTL', 'CDN caches near users', 'Edge functions for personalisation', 'Purge or version on deploy'],
      flow: ['User request', 'DNS resolves to nearest edge', 'Edge cache hit: respond', 'Miss: fetch origin and cache', 'Response to user'],
      code: ['javascript', `// Cloudflare Worker / edge function: add caching + geo-based content
export default {
  async fetch(request, env, ctx) {
    const country = request.cf?.country ?? 'IN';                 // edge geolocation
    const cache = caches.default;                                // edge cache
    const key = new Request(request.url + '?c=' + country);      // vary cache by country
    let res = await cache.match(key);
    if (!res) {
      res = await fetch(request);                                // go to origin
      res = new Response(res.body, res);                         // make headers mutable
      res.headers.set('Cache-Control', 's-maxage=300');          // cache 5 min at the edge
      ctx.waitUntil(cache.put(key, res.clone()));                // store without blocking
    }
    return res;
  }
};`],
      iq: [['How does a CDN improve performance?', 'It serves cached content from servers geographically close to users, reducing latency and origin load.']],
      cq: [['Check if a response came from cache.', `fetch('/logo.png').then((r) => console.log(r.headers.get('cf-cache-status') ?? r.headers.get('x-vercel-cache'))); // HIT / MISS`]],
      err: ['Caching personalised responses publicly']
    }),
    t('net-bff-gateway', 'BFF (Backend for Frontend) & API Gateways', 'A', {
      one: 'A Backend-for-Frontend is a thin server layer owned by the frontend team that aggregates and shapes backend APIs for a specific UI; API gateways centralise routing, auth and rate limiting.',
      ex: `Benefits of BFF: one call instead of many (aggregation), response shaping (only fields the UI needs), secret handling (tokens stay server-side), protocol translation (gRPC/SOAP → JSON), caching. Next.js route handlers/Server Actions often serve as a BFF.

Gateways (Kong, AWS API Gateway, Apigee) handle cross-cutting concerns for many clients. Keep business logic in domain services, not the BFF.`,
      pts: ['Aggregate and shape APIs per UI', 'Keeps secrets server-side', 'Next.js can act as BFF', 'Gateway for cross-cutting concerns'],
      dia: `flowchart LR
  W["Web app"] --> BW["Web BFF"]
  M["Mobile app"] --> BM["Mobile BFF"]
  BW --> G["API Gateway"]
  BM --> G
  G --> U["Users service"]
  G --> O["Orders service"]
  G --> S["Shipping service"]`,
      code: ['javascript', `// app/api/dashboard/route.js — BFF aggregating three services into one response
export async function GET(request) {
  const token = request.cookies.get('session')?.value;                 // session from HttpOnly cookie
  const headers = { Authorization: 'Bearer ' + (await exchange(token)) }; // server-side token
  const [user, orders, shipments] = await Promise.all([                 // parallel backend calls
    fetch(process.env.USERS_API + '/me', { headers }).then((r) => r.json()),
    fetch(process.env.ORDERS_API + '/recent', { headers }).then((r) => r.json()),
    fetch(process.env.SHIP_API + '/active', { headers }).then((r) => r.json())
  ]);
  return Response.json({                                                // only fields the UI needs
    name: user.firstName, orders: orders.items.slice(0, 5).map(({ id, total }) => ({ id, total })),
    inTransit: shipments.filter((s) => s.status === 'IN_TRANSIT').length
  });
}`],
      iq: [['When is a BFF useful?', 'When different clients need differently shaped data, many backend calls must be combined, or tokens/secrets must stay off the browser.']],
      cq: [['Why not put business rules in the BFF?', `// Duplicated rules across BFFs drift; keep them in domain services and let BFFs orchestrate/shape.`]],
      err: ['BFF growing into a monolith']
    }),
    t('net-compression-rate-limits', 'Compression, Payload Size & Rate Limiting', 'I', {
      one: 'Reduce bytes with Brotli/gzip compression, smaller payloads and efficient formats, and handle rate limits (429) gracefully on the client.',
      ex: `Servers/CDNs compress text (HTML, CSS, JS, JSON, SVG) with Brotli (best) or gzip — check Content-Encoding. Don't compress already-compressed formats (images, video). Shrink JSON: paginate, select fields, avoid deeply nested duplicates.

Rate limiting protects APIs (and your AI bills): servers return 429 with Retry-After; clients should back off, debounce user input and cache results. Implement server-side limits per IP/user with Redis/Upstash or gateway features.`,
      pts: ['Brotli > gzip for text', 'Don’t compress images', 'Paginate and select fields', 'Respect 429 + Retry-After'],
      code: ['javascript', `// Express: compression + simple rate limiting
import compression from 'compression';
import rateLimit from 'express-rate-limit';
app.use(compression());                                          // gzip/brotli responses
app.use('/api/', rateLimit({                                     // per-IP limits
  windowMs: 60_000,                                              // 1 minute window
  limit: 60,                                                     // 60 requests per window
  standardHeaders: 'draft-7',                                    // RateLimit-* headers
  handler: (req, res) => res.status(429).set('Retry-After', '30').json({ error: 'Too many requests' })
}));`],
      iq: [['How should a client handle 429?', 'Stop sending, wait for Retry-After (or backoff), inform the user if needed, and reduce request frequency (debounce/cache).']],
      cq: [['Check response compression in DevTools or code.', `const r = await fetch('/api/terms'); console.log(r.headers.get('content-encoding')); // "br" or "gzip"`]],
      err: ['Sending entire database tables to the client']
    })
  )
];
