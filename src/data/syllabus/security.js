// Web Security — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Foundations',
    t('sec-overview-owasp', 'Frontend Security Overview & OWASP Top 10', 'B', {
      one: 'Frontend security protects users and data in the browser: preventing injection (XSS), forged requests (CSRF), clickjacking, data leaks, insecure dependencies and misconfiguration — guided by the OWASP Top 10.',
      ex: `Golden rules: never trust input (from users, URLs, APIs, storage); the browser is a hostile environment — all client checks can be bypassed, so the server enforces authorisation and validation; minimise secrets in the frontend (anything shipped is public); use secure defaults (framework escaping, HttpOnly cookies, CSP); keep dependencies updated.

OWASP Top 10 (2021, updated periodically) includes Broken Access Control, Cryptographic Failures, Injection, Insecure Design, Security Misconfiguration, Vulnerable Components, Auth Failures, Integrity Failures, Logging Failures, SSRF.`,
      pts: ['Never trust input', 'Client checks are UX only', 'No secrets in frontend code', 'Secure defaults + updates'],
      flow: ['Untrusted input', 'Validate and encode', 'Least privilege', 'Server enforces rules', 'Monitor and patch'],
      code: ['javascript', `// Anything here is visible to users — never ship secrets
const config = {
  apiUrl: import.meta.env.VITE_API_URL,     // ✅ public URL is fine
  // stripeSecret: 'sk_live_...'             // ❌ never: secrets belong on the server
};
// Client-side role check = UX only (hide button)
if (user.role === 'admin') showAdminButton();
// Server must still verify on every admin request:
// app.delete('/api/terms/:id', requireRole('admin'), handler)`],
      iq: [['Is hiding a button enough to protect an admin action?', 'No — attackers can call the API directly; the server must check authorisation.'],
           ['Name three OWASP Top 10 risks relevant to frontend.', 'Injection (XSS), broken access control, vulnerable/outdated components, security misconfiguration.']],
      cq: [['Check what secrets leaked into your bundle.', `grep -rE "sk_live|AKIA|AIza|-----BEGIN" dist/   # scan build output for keys`]],
      err: ['API keys in frontend env vars']
    }),
    t('sec-same-origin', 'Same-Origin Policy & Origins', 'B', {
      one: 'The same-origin policy stops scripts from one origin (scheme + host + port) reading data from another, forming the browser’s core security boundary.',
      ex: `https://app.com and https://api.app.com are different origins; so are http:// and https://, or different ports. Cross-origin reads (fetch responses, iframe DOM, canvas pixels) are blocked unless allowed (CORS, postMessage). Cross-origin writes/embeds are often allowed (forms, images, scripts) — which is why CSRF exists.

"Site" (eTLD+1) is a broader concept used by SameSite cookies: app.com and api.app.com are same-site but cross-origin.`,
      pts: ['Origin = scheme + host + port', 'Blocks cross-origin reads', 'Embeds/writes often allowed', 'Site ≠ origin'],
      code: ['javascript', `console.log(location.origin);                         // "https://frontedge.app"
const same = (a, b) => new URL(a).origin === new URL(b).origin;
console.log(same('https://app.com/x', 'https://app.com:443/y')); // true (443 default)
console.log(same('https://app.com', 'https://api.app.com'));      // false — different host
// iframe from another origin: frame.contentWindow.document → SecurityError`],
      iq: [['Same-origin vs same-site?', 'Same-origin requires identical scheme, host and port; same-site compares the registrable domain (and scheme), so subdomains are same-site.']],
      cq: [['Safely compare message origins.', `const ALLOWED = new Set(['https://widget.example.com']); window.addEventListener('message', (e) => { if (!ALLOWED.has(e.origin)) return; /* trusted */ });`]],
      err: ['Using startsWith on origins (evil-example.com tricks)']
    })
  ),
  m('2. Attacks & Defences',
    L('sec-xss'),
    t('sec-csp', 'Content Security Policy (CSP) in Depth', 'I', {
      one: 'CSP is an HTTP header that whitelists where scripts, styles, images, frames and connections may come from, drastically limiting the damage of injection bugs.',
      ex: `Strict CSP uses nonces or hashes: script-src 'nonce-RANDOM' 'strict-dynamic'; object-src 'none'; base-uri 'none'. Avoid 'unsafe-inline' and 'unsafe-eval'. Other directives: default-src, connect-src (APIs/WebSockets), img-src, style-src, frame-ancestors (clickjacking), form-action, upgrade-insecure-requests, report-to.

Roll out with Content-Security-Policy-Report-Only first, collect violation reports, fix, then enforce. Frameworks (Next.js middleware, Angular autoCsp) can generate nonces.`,
      pts: ['Nonce/hash-based strict CSP', 'No unsafe-inline/unsafe-eval', 'frame-ancestors for clickjacking', 'Report-Only rollout'],
      flow: ['Server generates nonce per request', 'Adds CSP header', 'Scripts carry the nonce', 'Injected scripts lack nonce: blocked', 'Violations reported'],
      code: ['javascript', `// Express middleware: per-request nonce + strict CSP
import crypto from 'node:crypto';
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');            // unpredictable per request
  res.locals.nonce = nonce;                                           // use in HTML templates
  res.setHeader('Content-Security-Policy', [
    \`script-src 'nonce-\${nonce}' 'strict-dynamic'\`,                    // only nonced scripts (and what they load)
    "object-src 'none'", "base-uri 'none'",                           // block plugins and base tag hijack
    "frame-ancestors 'none'",                                         // no framing (clickjacking)
    "connect-src 'self' https://api.example.com"                      // allowed fetch/WebSocket targets
  ].join('; '));
  next();
});
// HTML: <script nonce="<%= nonce %>" src="/app.js"></script>`],
      iq: [['Why are nonces better than domain allowlists?', 'Allowlisted domains (CDNs) may host attacker-controllable scripts/JSONP; nonces only allow scripts you explicitly marked for this response.'],
           ['How do you deploy CSP safely?', 'Start with Report-Only, monitor reports, fix violations, then enforce.']],
      cq: [['Meta tag CSP for a static site.', `<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data: https:; object-src 'none'"> <!-- frame-ancestors not supported in meta -->`]],
      err: ["Adding 'unsafe-inline' to silence errors"]
    }),
    L('sec-csrf'),
    t('sec-clickjacking', 'Clickjacking & Frame Protection', 'I', {
      one: 'Clickjacking tricks users into clicking hidden elements of your site loaded in an invisible iframe; prevent it with CSP frame-ancestors or X-Frame-Options.',
      ex: `An attacker overlays a transparent iframe of your "Delete account" or "Pay" page over a fake button. Defences: Content-Security-Policy: frame-ancestors 'none' (or 'self' / specific partners); legacy X-Frame-Options: DENY/SAMEORIGIN. If you must be embeddable, allow only specific origins and require re-confirmation for sensitive actions.`,
      pts: ['Invisible iframe overlay attack', "frame-ancestors 'none'", 'X-Frame-Options legacy', 'Confirm sensitive actions'],
      code: ['javascript', `// next.config.js headers
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://partner.example.com" }, // who may embed us
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' }                                               // older browsers
      ]
    }];
  }
};`],
      iq: [['How do you prevent clickjacking?', 'Send frame-ancestors (CSP) or X-Frame-Options headers so browsers refuse to render your pages inside other sites’ frames.']],
      cq: [['Detect if your page is framed (defence in depth).', `if (window.top !== window.self) document.body.innerHTML = 'This page cannot be framed.'; // framebusting fallback`]],
      err: ['Relying on JS framebusting only']
    }),
    t('sec-open-redirect-url', 'Open Redirects, URL & Input Validation', 'I', {
      one: 'Validate URLs and inputs before using them: open redirects (?next=https://evil.com) enable phishing, and javascript:/data: URLs enable XSS.',
      ex: `Only redirect to same-origin paths or an allowlist. Parse with new URL() and compare origins; reject protocol-relative (//evil.com) and backslash tricks. For links from user content, allow only http/https. Validate input types, lengths and formats on the client for UX and on the server for security (Zod schemas shared across both).

Also beware DOM-based injection sinks: innerHTML, outerHTML, document.write, eval, setTimeout(string), location assignments.`,
      pts: ['Allowlist redirect targets', 'Block javascript:/data: links', 'Validate on server too', 'Know dangerous DOM sinks'],
      code: ['javascript', `function safeNextUrl(next, fallback = '/') {
  try {
    const url = new URL(next, location.origin);            // resolve relative paths
    if (url.origin !== location.origin) return fallback;   // block other sites (incl. //evil.com)
    return url.pathname + url.search + url.hash;           // keep only path parts
  } catch { return fallback; }                             // invalid URL
}
const next = new URLSearchParams(location.search).get('next');
location.assign(safeNextUrl(next ?? '/'));                 // safe post-login redirect`],
      iq: [['What is an open redirect?', 'An endpoint that redirects to any URL from a parameter, letting attackers use your trusted domain to send users to malicious sites.']],
      cq: [['Allow only http/https links from user content.', `const isSafeHref = (h) => { try { return ['http:', 'https:'].includes(new URL(h).protocol); } catch { return false; } };`]],
      err: ['Redirecting to any ?returnUrl value']
    }),
    t('sec-prototype-pollution', 'Prototype Pollution & Unsafe JS Patterns', 'A', {
      one: 'Prototype pollution happens when attacker-controlled keys like __proto__ or constructor.prototype are merged into objects, modifying Object.prototype for the whole app.',
      ex: `Deep merge/set utilities that copy user JSON ({ "__proto__": { "isAdmin": true } }) can make every object appear to have isAdmin. Prevent by blocking dangerous keys, using Object.create(null) or Map for dictionaries, Object.hasOwn checks, and updated libraries (lodash merge had CVEs).

Other unsafe patterns: eval/new Function with input, regex DoS, insecure randomness (Math.random for tokens — use crypto.randomUUID/getRandomValues).`,
      pts: ['Block __proto__/constructor/prototype keys', 'Map or null-prototype dictionaries', 'No eval with input', 'crypto for randomness'],
      code: ['javascript', `const BLOCKED = new Set(['__proto__', 'constructor', 'prototype']);
function safeMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (BLOCKED.has(key)) continue;                         // skip dangerous keys
    const v = source[key];
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      target[key] = safeMerge(Object.hasOwn(target, key) ? target[key] : {}, v); // recurse safely
    } else target[key] = v;
  }
  return target;
}
const token = crypto.randomUUID();                          // secure random id (not Math.random)`],
      iq: [['How does prototype pollution escalate?', 'Polluted properties appear on all objects, altering logic such as authorisation checks or enabling XSS via template options.']],
      cq: [['Dictionary without a prototype.', `const counts = Object.create(null); counts['__proto__'] = 1; // just a normal key now`]],
      err: ['Using Math.random for security tokens']
    })
  ),
  m('3. Hardening',
    t('sec-security-headers', 'Security Headers (HSTS, nosniff, Referrer-Policy, Permissions-Policy)', 'I', {
      one: 'HTTP response headers that harden the browser: Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy and CSP.',
      ex: `HSTS forces HTTPS for future visits. nosniff stops MIME sniffing of scripts/styles. Referrer-Policy: strict-origin-when-cross-origin limits URL leakage. Permissions-Policy disables powerful features you don't use (camera=(), geolocation=()). COOP/COEP enable cross-origin isolation (needed for SharedArrayBuffer) and protect against cross-window attacks.

Check with securityheaders.com or Mozilla Observatory; configure in hosting (vercel.json, Netlify _headers, nginx) or framework config.`,
      pts: ['HSTS for HTTPS', 'nosniff', 'Referrer-Policy', 'Permissions-Policy limits features'],
      code: ['json', `{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Permissions-Policy", "value": "camera=(), geolocation=(), microphone=(self)" },
      { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
    ]
  }]
}`],
      iq: [['What does X-Content-Type-Options: nosniff prevent?', 'Browsers guessing (sniffing) content types, which could execute uploaded files as scripts.']],
      cq: [['Check a site’s headers from the terminal.', `curl -sI https://frontedge.vercel.app | grep -iE "strict|content-security|referrer|permissions"`]],
      err: ['No HSTS on HTTPS sites']
    }),
    t('sec-sri-supply-chain', 'Supply-chain Security: dependencies, SRI, lockfiles', 'I', {
      one: 'Most frontend code comes from npm packages and CDNs — secure the supply chain with lockfiles, audits, update automation, minimal dependencies and Subresource Integrity for CDN scripts.',
      ex: `Risks: malicious packages (typosquatting), compromised maintainers, install scripts, vulnerable versions, hijacked CDN files. Defences: commit lockfiles and use npm ci; npm audit / Dependabot / Renovate / Snyk; review new dependencies (size, maintenance, permissions); disable or allowlist install scripts (npm's allow-scripts, pnpm onlyBuiltDependencies); pin versions for CDN scripts with SRI hashes (integrity + crossorigin).

Also sign commits, protect CI secrets and generate SBOMs for compliance.`,
      pts: ['Lockfiles + npm ci', 'Automated audits and updates', 'Control install scripts', 'SRI for CDN scripts'],
      code: ['html', `<!-- Browser refuses the script if its hash doesn't match (tampered CDN) -->
<script
  src="https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js"
  integrity="sha384-BASE64HASHOFTHEFILE"
  crossorigin="anonymous"></script>
<!-- Generate: curl -s URL | openssl dgst -sha384 -binary | openssl base64 -A -->`],
      iq: [['What is Subresource Integrity?', 'An integrity attribute with a cryptographic hash; the browser blocks the resource if its content differs.'],
           ['How do you reduce npm supply-chain risk?', 'Fewer and well-maintained dependencies, lockfiles, audits, automated updates, blocking unexpected install scripts and reviewing changes.']],
      cq: [['Audit dependencies in CI.', `npm ci && npm audit --audit-level=high   # fail on high/critical vulnerabilities`]],
      err: ['Unpinned CDN scripts without SRI']
    }),
    t('sec-auth-best-practices', 'Secure Authentication & Session Handling in the Frontend', 'I', {
      one: 'Handle auth safely: HttpOnly secure cookies or in-memory short-lived tokens, refresh rotation, MFA/passkeys, logout everywhere, and never trust client-side role checks.',
      ex: `Prefer server sessions or a BFF with HttpOnly cookies. If tokens must be in JS, keep access tokens in memory (short TTL) and refresh via HttpOnly cookie with rotation. Clear sensitive state on logout (and broadcast to other tabs), avoid storing PII in localStorage, protect against brute force (rate limits, CAPTCHA server-side) and support MFA/passkeys.

Show generic error messages ("invalid email or password") to avoid account enumeration.`,
      pts: ['HttpOnly cookies / in-memory tokens', 'Refresh token rotation', 'MFA and passkeys', 'Generic login errors'],
      code: ['javascript', `async function logout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); // server clears session cookie
  accessToken = null;                                       // drop in-memory token
  queryClient.clear();                                      // remove cached private data
  sessionStorage.clear();                                   // clear tab data
  new BroadcastChannel('auth').postMessage('logout');       // log out other tabs
  location.replace('/login');                               // no back-button return
}`],
      iq: [['Why generic login error messages?', 'To avoid revealing which emails are registered (account enumeration).']],
      cq: [['Auto-logout after inactivity.', `let t; const reset = () => { clearTimeout(t); t = setTimeout(logout, 15 * 60_000); }; ['click', 'keydown'].forEach((e) => addEventListener(e, reset)); reset();`]],
      err: ['Long-lived tokens in localStorage']
    }),
    t('sec-trusted-types-sanitization', 'Trusted Types & HTML Sanitisation', 'A', {
      one: 'Trusted Types (a CSP feature) forces dangerous DOM sinks like innerHTML to accept only vetted objects created by policies, eliminating most DOM-based XSS; sanitizers (DOMPurify, Sanitizer API) clean HTML.',
      ex: `Enable with CSP: require-trusted-types-for 'script'; trusted-types myPolicy dompurify. Then el.innerHTML = string throws; you must pass policy.createHTML(DOMPurify.sanitize(input)). This makes risky sinks auditable in one place.

The native HTML Sanitizer API (element.setHTML) is arriving in browsers. Frameworks already escape by default; Trusted Types catch the escape hatches (dangerouslySetInnerHTML, [innerHTML], v-html).`,
      pts: ['CSP require-trusted-types-for', 'Policies centralise risky code', 'DOMPurify / Sanitizer API', 'Catches framework escape hatches'],
      code: ['javascript', `import DOMPurify from 'dompurify';
// CSP header: require-trusted-types-for 'script'; trusted-types app-html
const policy = window.trustedTypes?.createPolicy('app-html', {
  createHTML: (input) => DOMPurify.sanitize(input, { RETURN_TRUSTED_TYPE: false }) // single vetted path
});
function renderMarkdownHtml(el, html) {
  el.innerHTML = policy ? policy.createHTML(html) : DOMPurify.sanitize(html); // raw strings would throw
}
// Native (newer browsers): el.setHTML(untrustedHtml)  // sanitizes automatically`],
      iq: [['How do Trusted Types prevent DOM XSS?', 'Dangerous sinks reject plain strings; only objects created by approved policies (which sanitise) are accepted.']],
      cq: [['Sanitise AI/markdown output before rendering.', `const safe = DOMPurify.sanitize(marked.parse(aiText)); el.innerHTML = safe; // never render raw model output`]],
      err: ['Rendering markdown/HTML from users or AI without sanitising']
    }),
    t('sec-secrets-privacy', 'Secrets, Environment Variables & Privacy Compliance', 'I', {
      one: 'Keep secrets server-side, expose only public config, minimise personal data in the browser and follow privacy laws (GDPR, India’s DPDP Act) with consent and data minimisation.',
      ex: `Build-time env vars prefixed VITE_ / NEXT_PUBLIC_ / NG env files are embedded in bundles — public by definition. Put API keys (AI, payments, databases) in serverless functions. Rotate keys if leaked (git history counts).

Privacy: collect minimum data, get consent before non-essential cookies/analytics, honour Do Not Track/GPC where applicable, mask PII in logs and session replays, set data retention, and provide data export/deletion.`,
      pts: ['Public prefixes = public data', 'Secrets in serverless functions', 'Consent before tracking', 'Mask PII in logs/replays'],
      code: ['javascript', `// ❌ Frontend: const ai = new Groq({ apiKey: import.meta.env.VITE_GROQ_KEY }) — key is public!
// ✅ Serverless function (api/chat.js) — key read on the server only
export default async function handler(req, res) {
  const key = process.env.GROQ_API_KEY;                    // never sent to the browser
  if (!key) return res.status(503).json({ error: 'NO_KEY' });
  // ...call the AI provider and return only the answer
}
// Consent-gated analytics
if (localStorage.getItem('consent') === 'analytics') loadAnalytics(); // load only after opt-in`],
      iq: [['Are Vite env variables secret?', 'No — any VITE_ variable is inlined into the client bundle and visible to everyone.']],
      cq: [['Remove a leaked secret from git history (then rotate it!).', `git filter-repo --replace-text <(echo 'sk_live_LEAKED==>REMOVED')   # rewrite history; ALWAYS rotate the key`]],
      err: ['Committing .env files']
    })
  )
];
