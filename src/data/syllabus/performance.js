// Performance — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Measuring',
    t('perf-why-models', 'Why Performance Matters & the RAIL Model', 'B', {
      one: 'Faster sites convert better, rank higher and feel better; RAIL (Response, Animation, Idle, Load) gives user-centric targets for each type of interaction.',
      ex: `Response: handle input within 100ms (now measured by INP ≤ 200ms). Animation: produce frames in ~10ms to hit 60fps (16ms budget). Idle: do background work in ≤50ms chunks. Load: deliver content quickly (LCP ≤ 2.5s) on mid-range phones and slow networks.

Performance is a feature: set budgets, measure real users and treat regressions like bugs. Optimise for the 75th percentile on mobile.`,
      pts: ['Response < 100ms feel', '60fps animations', '≤50ms idle chunks', 'Measure p75 on mobile'],
      flow: ['Response: input feedback', 'Animation: smooth frames', 'Idle: chunked background work', 'Load: fast first content'],
      code: ['javascript', `// Measure your own user-centric timings with the User Timing API
performance.mark('search-start');                         // before work
const results = expensiveSearch(query);                   // the work
performance.mark('search-end');                           // after work
performance.measure('search', 'search-start', 'search-end'); // create a measure
const [m] = performance.getEntriesByName('search');
console.log('search took', Math.round(m.duration), 'ms');  // shows in DevTools Performance panel too`],
      iq: [['What is the RAIL model?', 'A user-centric performance model with goals for Response, Animation, Idle and Load.']],
      cq: [['Throttle in DevTools to test like real users.', `// DevTools → Performance → CPU: 4x slowdown, Network: Fast 4G — test on mid-range conditions`]],
      err: ['Testing only on a fast laptop and Wi-Fi']
    }),
    L('perf-core-web-vitals'),
    t('perf-tools', 'Tools: Lighthouse, DevTools Performance, WebPageTest, CrUX', 'B', {
      one: 'Lab tools (Lighthouse, DevTools Performance panel, WebPageTest) diagnose issues; field data (CrUX, PageSpeed Insights, RUM) shows real-user experience.',
      ex: `Lighthouse audits performance, accessibility, SEO and best practices with suggestions. The Performance panel records flame charts: long tasks (red), layout/paint, network waterfall, LCP/CLS markers and INP interactions. WebPageTest tests from real devices/locations with filmstrips and request maps. PageSpeed Insights combines Lighthouse with CrUX field data.

Use the Coverage tab (unused JS/CSS), Network panel (waterfall, priorities), and Performance Insights/Layer views.`,
      pts: ['Lab = diagnose, field = truth', 'Flame charts show long tasks', 'Coverage tab finds unused code', 'PSI combines both'],
      code: ['bash', `npx lighthouse https://frontedge.vercel.app --preset=desktop --view   # run Lighthouse CLI
npx lighthouse https://frontedge.vercel.app --form-factor=mobile --throttling-method=simulate --output=json --output-path=report.json
# CI: use Lighthouse CI to fail builds when scores drop below thresholds`],
      iq: [['Why do Lighthouse scores differ between runs?', 'Lab tests vary with CPU load, network and third parties; run multiple times and focus on trends and field data.']],
      cq: [['Find unused JavaScript.', `// DevTools → Ctrl+Shift+P → "Show Coverage" → reload → red bars = unused bytes`]],
      err: ['Chasing a 100 Lighthouse score while field data is poor']
    }),
    t('perf-rum', 'Real User Monitoring (RUM) & PerformanceObserver', 'I', {
      one: 'RUM collects performance data from actual users (web-vitals library, PerformanceObserver, Navigation/Resource Timing) and sends it to analytics to track p75 metrics over time.',
      ex: `PerformanceObserver subscribes to entries: largest-contentful-paint, layout-shift, event (INP), longtask/long-animation-frame, resource, navigation. The web-vitals library handles edge cases (bfcache, visibility) — prefer it. Attribution builds (web-vitals/attribution) tell you WHICH element/script caused poor LCP/INP.

Send with navigator.sendBeacon, segment by device, country, page and release. Tools: Vercel Speed Insights, Sentry, Datadog RUM, SpeedCurve.`,
      pts: ['Field data reflects reality', 'web-vitals with attribution', 'PerformanceObserver entries', 'Segment by device/page/release'],
      code: ['javascript', `import { onLCP, onINP, onCLS } from 'web-vitals/attribution';   // with attribution data
function send(metric) {
  const body = JSON.stringify({
    name: metric.name, value: Math.round(metric.value), rating: metric.rating, // good/needs-improvement/poor
    page: location.pathname,
    culprit: metric.attribution?.interactionTarget || metric.attribution?.element // what caused it
  });
  navigator.sendBeacon('/api/vitals', body);                      // survives page unload
}
onLCP(send); onINP(send); onCLS(send);
new PerformanceObserver((list) => list.getEntries().forEach((e) =>  // long animation frames
  e.duration > 100 && console.warn('Slow frame', Math.round(e.duration), e.scripts?.[0]?.sourceURL)
)).observe({ type: 'long-animation-frame', buffered: true });`],
      iq: [['Why use the 75th percentile?', 'It reflects most users’ experience while being robust to outliers; Google assesses Core Web Vitals at p75.']],
      cq: [['Log resource timings over 500ms.', `performance.getEntriesByType('resource').filter((r) => r.duration > 500).forEach((r) => console.log(r.name, Math.round(r.duration)));`]],
      err: ['Only looking at averages']
    })
  ),
  m('2. Loading Performance',
    t('perf-critical-rendering-path', 'Critical Rendering Path & Render-blocking Resources', 'I', {
      one: 'The critical rendering path is the minimum work to show first content: HTML → DOM, CSS → CSSOM, render tree, layout, paint; render-blocking CSS and parser-blocking JS delay it.',
      ex: `Optimise by reducing critical resources (inline critical CSS, defer the rest), shortening critical path length (fewer round trips, preload key resources, preconnect), and reducing critical bytes (minify, compress, remove unused code).

Server-side: fast TTFB, streaming HTML, early hints (103). Avoid client-side rendering for content pages — SSR/SSG gets HTML to users sooner.`,
      pts: ['CSS blocks render, sync JS blocks parsing', 'Inline critical CSS', 'Fewer round trips', 'SSR/SSG for content'],
      flow: ['HTML downloaded', 'CSS blocks render', 'Sync JS blocks parser', 'Render tree built', 'First paint'],
      code: ['html', `<head>
  <style>/* critical above-the-fold CSS inlined (~10KB) */ header{...} .hero{...}</style>
  <link rel="preload" href="/css/main.css" as="style" onload="this.rel='stylesheet'"> <!-- non-blocking full CSS -->
  <link rel="preconnect" href="https://cdn.example.com">        <!-- early connection -->
  <script src="/js/app.js" defer></script>                      <!-- doesn't block parsing -->
</head>`],
      iq: [['What are render-blocking resources?', 'Stylesheets in the head and synchronous scripts that must load before the browser can render content.']],
      cq: [['Server early hints.', `HTTP/1.1 103 Early Hints
Link: </css/main.css>; rel=preload; as=style   # browser starts fetching before the final response`]],
      err: ['Huge CSS bundles blocking first paint']
    }),
    L('perf-code-splitting'),
    t('perf-images-media', 'Image & Media Optimisation', 'B', {
      one: 'Images are usually the largest bytes: use modern formats (AVIF/WebP), correct dimensions (srcset/sizes), compression, lazy loading, priority for the hero and an image CDN.',
      ex: `Checklist: right format (photos AVIF/WebP, icons SVG), resize to display size × DPR, compress (quality 60–80), lazy-load offscreen images, fetchpriority="high" for LCP, width/height to prevent CLS, responsive images, decoding="async". Image CDNs (Cloudinary, imgix, Vercel/Next Image) transform on the fly.

Video: compress, use poster images, preload="none", lazy-load embeds with facades (lite-youtube).`,
      pts: ['AVIF/WebP + SVG', 'srcset/sizes for right size', 'Lazy offscreen, prioritise hero', 'Image CDN transforms'],
      code: ['html', `<img
  src="https://img.cdn.example.com/hero.jpg?w=800&fm=avif&q=70"            <!-- CDN transforms -->
  srcset="https://img.cdn.example.com/hero.jpg?w=400&fm=avif 400w,
          https://img.cdn.example.com/hero.jpg?w=800&fm=avif 800w,
          https://img.cdn.example.com/hero.jpg?w=1600&fm=avif 1600w"
  sizes="(max-width: 700px) 100vw, 700px"
  width="1600" height="900" alt="Course banner"
  fetchpriority="high" decoding="async">                                    <!-- LCP hero -->
<lite-youtube videoid="abc123" playlabel="Play: React hooks"></lite-youtube> <!-- facade, loads iframe on click -->`],
      iq: [['How do you find oversized images?', 'Lighthouse "Properly size images", DevTools network (compare intrinsic vs rendered size) and the Coverage of image bytes.']],
      cq: [['Lazy-load background images.', `const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.style.backgroundImage = 'url(' + e.target.dataset.bg + ')'; io.unobserve(e.target); } }));
document.querySelectorAll('[data-bg]').forEach((el) => io.observe(el));`]],
      err: ['4000px images displayed at 300px']
    }),
    t('perf-fonts-third-party', 'Fonts & Third-party Scripts', 'I', {
      one: 'Web fonts and third-party scripts (analytics, ads, chat, A/B testing, tag managers) often dominate load cost — subset/self-host fonts and load third parties late, lazily or off the main thread.',
      ex: `Fonts: WOFF2, subset, variable fonts, preload the critical one, font-display swap/optional, metric-matched fallbacks. Third parties: audit with the Network panel by domain, remove unused tags, load with async/defer or after interaction, use facades for chat/video, consider Partytown (runs scripts in a worker), and set performance budgets per vendor.

A/B testing tools (Adobe Target, Optimizely) can cause flicker; use server-side or edge testing, or async with careful anti-flicker snippets and short timeouts.`,
      pts: ['Subset + self-host fonts', 'Audit third parties regularly', 'Load after interaction/idle', 'Server-side A/B testing avoids flicker'],
      code: ['javascript', `// Load a chat widget only when the user shows intent
let chatLoaded = false;
function loadChat() {
  if (chatLoaded) return; chatLoaded = true;                    // load once
  const s = document.createElement('script');
  s.src = 'https://widget.example.com/chat.js'; s.async = true; // third-party script
  document.head.append(s);
}
document.querySelector('#chat-btn').addEventListener('click', loadChat);   // on click
document.querySelector('#chat-btn').addEventListener('mouseenter', loadChat, { once: true }); // or on hover
requestIdleCallback?.(() => setTimeout(loadChat, 10000));                  // or after 10s idle`],
      iq: [['How do third-party scripts hurt performance?', 'They add network requests, main-thread work, layout shifts and can block rendering; you don’t control their size.'],
           ['What causes A/B test flicker and how to reduce it?', 'Client-side tests change content after render; use server/edge-side tests or async loading with a short anti-flicker timeout.']],
      cq: [['Measure total bytes by third-party domain.', `const byHost = {}; performance.getEntriesByType('resource').forEach((r) => { const h = new URL(r.name).host; byHost[h] = (byHost[h] || 0) + r.transferSize; }); console.table(byHost);`]],
      err: ['Loading every marketing tag on every page synchronously']
    }),
    t('perf-caching-delivery', 'Caching, Compression & Delivery Strategy', 'I', {
      one: 'Deliver fewer bytes from closer locations: long-term caching for hashed assets, CDN edge caching, Brotli compression, HTTP/2–3, and service-worker caching for repeat visits.',
      ex: `Build tools add content hashes to filenames → Cache-Control: immutable for a year. HTML stays revalidated. CDNs cache static assets and SSG pages; ISR/stale-while-revalidate keeps dynamic pages fast. Service workers serve the app shell offline and instantly.

Also: minify (esbuild/Terser, Lightning CSS), remove dead code, avoid huge polyfills (browserslist targets), and use the bfcache (avoid unload listeners).`,
      pts: ['Hashed filenames + immutable', 'CDN + stale-while-revalidate', 'Brotli compression', 'Service worker for repeat visits'],
      code: ['json', `{
  "headers": [
    { "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "/(.*).html",
      "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }
  ]
}`],
      iq: [['What is the bfcache?', 'Back/forward cache: browsers keep a full page snapshot in memory so back/forward navigation is instant; unload listeners and some APIs prevent it.']],
      cq: [['Test bfcache eligibility.', `// DevTools → Application → Back/forward cache → "Test back/forward cache" shows blocking reasons`]],
      err: ['Cache-busting with query strings and no hashing']
    }),
    t('perf-rendering-strategies', 'Rendering Strategy for Performance (CSR, SSR, SSG, Streaming, Islands)', 'I', {
      one: 'How and where HTML is produced dramatically affects load performance: static and streamed server HTML beat client-only rendering for content-heavy pages.',
      ex: `CSR: blank page until JS downloads and runs — slow LCP on mobile. SSR: HTML per request (TTFB cost) then hydration (INP risk if huge). SSG/ISR: CDN-served HTML, fastest. Streaming SSR: shell first, slow parts later. Islands architecture (Astro, Qwik's resumability, React Server Components) ships JS only for interactive parts.

Choose per route: marketing/docs → SSG; dashboards → CSR/SSR with streaming; personalised → SSR/edge.`,
      pts: ['CSR hurts LCP on mobile', 'SSG/ISR fastest delivery', 'Streaming improves perceived speed', 'Islands/RSC reduce JS'],
      dia: `flowchart LR
  CSR["CSR: HTML shell → JS → data → content"] --> SSR["SSR: HTML content → JS → hydrate"]
  SSR --> SSG["SSG: CDN HTML instantly"]
  SSG --> IS["Islands/RSC: HTML + minimal JS"]`,
      code: ['javascript', `// Astro island example: page is static HTML, only the counter ships JS
// src/pages/index.astro
// ---
// import Counter from '../components/Counter.jsx';
// ---
// <h1>FrontEdge</h1>                      <!-- static HTML, zero JS -->
// <Counter client:visible />              <!-- hydrates only when scrolled into view -->`],
      iq: [['What is hydration cost?', 'Time to download, parse and execute JS to attach interactivity to server HTML — it can delay interactions (INP).']],
      cq: [['Pick rendering for a news site.', `// Article pages: SSG/ISR; homepage: ISR every 60s; comments: client-side or streamed island`]],
      err: ['Client-rendering SEO-critical content']
    })
  ),
  m('3. Runtime Performance',
    t('perf-reflow-repaint', 'Reflow, Repaint & Layout Thrashing', 'I', {
      one: 'Changing geometry triggers layout (reflow), visual changes trigger paint, and transform/opacity can skip both (composite only); interleaving DOM reads and writes forces repeated layouts.',
      ex: `Pipeline: JS → Style → Layout → Paint → Composite. width/top/margin changes cause layout of affected (sometimes all) elements; color/background cause paint; transform/opacity only composite on the GPU.

Layout thrashing: reading offsetHeight after writing styles in a loop forces synchronous layout each time. Batch reads then writes (or use requestAnimationFrame / fastdom). Use contain and content-visibility to limit layout scope.`,
      pts: ['Layout > Paint > Composite cost', 'Animate transform/opacity', 'Batch reads then writes', 'contain limits layout scope'],
      flow: ['JavaScript', 'Style recalculation', 'Layout', 'Paint', 'Composite layers'],
      code: ['javascript', `const items = [...document.querySelectorAll('.card')];
// ❌ Thrashing: read → write → read → write (forces layout every iteration)
items.forEach((el) => { el.style.height = el.offsetWidth / 2 + 'px'; });
// ✅ Batch: read everything first, then write everything
const widths = items.map((el) => el.offsetWidth);          // reads (one layout)
requestAnimationFrame(() => {                               // writes before next paint
  items.forEach((el, i) => { el.style.height = widths[i] / 2 + 'px'; });
});`],
      iq: [['Which properties trigger layout?', 'Geometry-affecting ones: width, height, margin, padding, top/left, font-size, display; reading offset*/getBoundingClientRect forces pending layout.']],
      cq: [['Animate a drawer without layout.', `.drawer { transform: translateX(-100%); transition: transform .3s; } .drawer.open { transform: none; } /* composite only */`]],
      err: ['Animating height/left on many elements']
    }),
    t('perf-long-tasks-inp', 'Long Tasks, Main-thread Work & Improving INP', 'A', {
      one: 'INP suffers when the main thread is busy: break long tasks, defer non-urgent work, yield to the browser, reduce render work and move heavy computation off-thread.',
      ex: `An interaction's latency = input delay (thread busy) + processing (your handlers) + presentation (render/paint). Fixes: give immediate visual feedback, then yield (scheduler.yield / setTimeout) before heavy work; split work into chunks; debounce expensive handlers; use React transitions/useDeferredValue; virtualise lists; avoid huge DOM (>1,500 nodes is a warning); move parsing/sorting to Web Workers; reduce hydration JS.

Diagnose with Long Animation Frames (LoAF) attribution and the Performance panel's Interactions track.`,
      pts: ['Input delay + processing + presentation', 'Yield after visual feedback', 'Workers for heavy compute', 'Smaller DOM and less JS'],
      flow: ['User taps', 'Show feedback immediately', 'Yield to browser to paint', 'Run heavy work in chunks or worker', 'Update results'],
      code: ['javascript', `async function onFilterClick(level) {
  showSpinner();                                           // instant visual feedback
  await yieldToMain();                                     // let the browser paint it
  const results = [];
  for (let i = 0; i < allTerms.length; i++) {
    if (allTerms[i].level === level) results.push(allTerms[i]);
    if (i % 500 === 0) await yieldToMain();                // break into short tasks
  }
  render(results);
}
function yieldToMain() {
  return globalThis.scheduler?.yield?.() ?? new Promise((r) => setTimeout(r, 0)); // modern or fallback
}`],
      iq: [['What are the three parts of INP?', 'Input delay, processing duration and presentation delay.'],
           ['How do you improve INP in a React app?', 'Reduce re-render work (memo/compiler, colocated state), use transitions for heavy updates, virtualise lists, split code and avoid long synchronous handlers.']],
      cq: [['Move JSON parsing of a big file to a worker.', `const worker = new Worker(new URL('./parse.worker.js', import.meta.url), { type: 'module' });
worker.postMessage(bigText); worker.onmessage = (e) => render(e.data); // UI stays responsive`]],
      err: ['Doing everything synchronously in click handlers']
    }),
    t('perf-virtualization-lists', 'Virtualisation, Pagination & Large Lists', 'I', {
      one: 'Render only what is visible: virtualise long lists/grids, paginate or infinitely load data, and use content-visibility for long documents.',
      ex: `Rendering 10,000 DOM rows is slow (memory, layout, hydration). Virtualisation (TanStack Virtual, react-window, Angular CDK virtual scroll, vue-virtual-scroller) renders ~20 rows and recycles them while scrolling. Handle dynamic heights (measure), keyboard navigation and accessibility (aria-rowcount/aria-rowindex).

Combine with server pagination/cursor APIs and IntersectionObserver for infinite loading.`,
      pts: ['Render visible rows only', 'Dynamic heights need measuring', 'Keep accessibility attributes', 'Pair with cursor pagination'],
      code: ['jsx', `function InfiniteTerms() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({        // server pagination
    queryKey: ['terms'],
    queryFn: ({ pageParam }) => fetch('/api/terms?cursor=' + (pageParam ?? '')).then((r) => r.json()),
    getNextPageParam: (last) => last.nextCursor                          // cursor for next page
  });
  const sentinel = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && hasNextPage && fetchNextPage()); // near bottom
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, [hasNextPage, fetchNextPage]);
  return <>{data?.pages.flatMap((p) => p.items).map((t) => <TermRow key={t.id} t={t} />)}<div ref={sentinel} /></>;
}`],
      iq: [['Virtualisation vs pagination?', 'Pagination limits data fetched; virtualisation limits DOM rendered. Large datasets often need both.']],
      cq: [['CSS-only win for long pages.', `.section { content-visibility: auto; contain-intrinsic-size: auto 600px; } /* skip offscreen rendering */`]],
      err: ['Rendering thousands of rows with complex components']
    }),
    t('perf-memory-leaks', 'Memory Leaks & Memory Profiling', 'A', {
      one: 'Memory leaks in SPAs grow heap usage over time (slow, crashes on mobile); find them with heap snapshots and fix uncleaned listeners, timers, subscriptions and detached DOM.',
      ex: `Symptoms: app slows after navigating repeatedly, tabs crash on low-memory phones. Workflow: perform an action several times, take heap snapshots, compare (Objects allocated between snapshots), search for "Detached" DOM nodes, inspect retainers to see what holds them.

Common causes: global listeners, setInterval, observers not disconnected, WebSocket/RxJS subscriptions, growing caches/Maps, closures capturing large data, third-party widgets not destroyed.`,
      pts: ['Heap snapshots + comparison', 'Detached DOM nodes', 'Retainer paths', 'Cleanup in unmount/destroy'],
      code: ['javascript', `// React: every effect that subscribes must clean up
useEffect(() => {
  const ws = new WebSocket(url);                         // resource
  const io = new IntersectionObserver(onVisible);        // observer
  io.observe(ref.current);
  const id = setInterval(sync, 5000);                    // timer
  return () => { ws.close(); io.disconnect(); clearInterval(id); }; // release all
}, [url]);
// Quick check in console: performance.memory?.usedJSHeapSize (Chrome only)`],
      iq: [['How do you find a memory leak in Chrome?', 'Memory panel → heap snapshot before/after repeating an action → compare → check detached nodes and retainers.']],
      cq: [['Bound a cache to avoid unbounded growth.', `if (cache.size > 500) cache.delete(cache.keys().next().value); // evict oldest (Map keeps order)`]],
      err: ['Never disconnecting observers']
    }),
    t('perf-animations', 'Smooth Animations & 60fps', 'I', {
      one: 'Smooth animation means each frame finishes within ~16ms: animate compositor-friendly properties, use requestAnimationFrame or CSS/WAAPI, and avoid layout during animation.',
      ex: `Prefer transform and opacity; promote elements carefully (will-change only while animating). Use CSS transitions/animations or the Web Animations API (runs off main thread where possible). For JS animation loops use rAF and time-based progress (not frame counting).

Scroll-driven animations and View Transitions are declarative and efficient. Check the Performance panel's Frames track and enable Paint Flashing/Layer borders. Respect prefers-reduced-motion.`,
      pts: ['transform/opacity only', 'rAF + time-based progress', 'will-change temporarily', 'Reduced motion'],
      code: ['javascript', `function animateCounter(el, to, duration = 800) {
  const start = performance.now();                         // timestamp at start
  function frame(now) {
    const p = Math.min((now - start) / duration, 1);       // progress 0..1 based on time
    const eased = 1 - Math.pow(1 - p, 3);                  // ease-out cubic
    el.textContent = Math.round(to * eased).toLocaleString(); // update text
    if (p < 1) requestAnimationFrame(frame);               // next frame
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) el.textContent = to; // skip animation
  else requestAnimationFrame(frame);
}`],
      iq: [['Why use time-based animation instead of frame counts?', 'Frame rates vary (60/120Hz, dropped frames); time-based progress keeps duration consistent.']],
      cq: [['Pause animations when offscreen.', `const io = new IntersectionObserver(([e]) => el.getAnimations().forEach((a) => (e.isIntersecting ? a.play() : a.pause())));`]],
      err: ['setInterval-based animation']
    }),
    t('perf-budgets-ci', 'Performance Budgets & Monitoring in CI', 'I', {
      one: 'Performance budgets set limits (JS KB, LCP, number of requests) that CI enforces so regressions are caught before release.',
      ex: `Define budgets per page type: e.g. ≤170KB compressed JS on mobile, LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms. Enforce with bundle size checks (size-limit, bundlewatch), Lighthouse CI assertions, Angular budgets or Next.js analyzer in PR comments.

Monitor field data after release (RUM dashboards, alerts) and tie performance to business metrics (conversion, bounce).`,
      pts: ['Budgets for JS size and vitals', 'Fail CI on regressions', 'PR comments with size diffs', 'Watch field data after release'],
      code: ['json', `{
  "ci": {
    "collect": { "url": ["http://localhost:4173/", "http://localhost:4173/#/term/js-closures"], "numberOfRuns": 3 },
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-byte-weight": ["warn", { "maxNumericValue": 400000 }]
      }
    }
  }
}`],
      iq: [['What is a performance budget?', 'A limit on metrics (bundle size, LCP, requests) agreed by the team and enforced automatically to prevent regressions.']],
      cq: [['size-limit config.', `"size-limit": [{ "path": "dist/assets/index-*.js", "limit": "150 KB" }]   // package.json`]],
      err: ['Budgets with no enforcement']
    })
  )
];
