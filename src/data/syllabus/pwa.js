// PWA & Mobile Web — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Mobile Web Foundations',
    t('pwa-mobile-web-basics', 'Mobile Web Basics: viewport, touch, safe areas', 'B', {
      one: 'Mobile-friendly web apps need the viewport meta tag, touch-friendly targets and gestures, safe-area handling for notches and performance tuned for mid-range phones.',
      ex: `viewport-fit=cover + env(safe-area-inset-*) keeps content clear of notches/home indicators. Use pointer events, generous tap targets, touch-action to control panning/zoom, and avoid hover-only UI. 100dvh for full-height layouts. Inputs ≥16px font avoid iOS auto-zoom.

Test on real devices (Chrome remote debugging for Android, Safari Web Inspector for iOS).`,
      pts: ['viewport-fit=cover + safe areas', 'Pointer events + big targets', '16px inputs (no iOS zoom)', 'Test on real devices'],
      code: ['html', `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"> <!-- full-bleed -->
<style>
  .tabbar { padding-bottom: env(safe-area-inset-bottom); }    /* clear the iPhone home bar */
  header { padding-top: env(safe-area-inset-top); }          /* below the notch */
  input, select, textarea { font-size: 16px; }               /* prevent iOS zoom on focus */
  .carousel { touch-action: pan-y; }                         /* allow vertical scroll, handle horizontal swipe in JS */
</style>`],
      iq: [['Why do iOS inputs zoom in on focus?', 'Safari zooms when the input font size is under 16px.']],
      cq: [['Debug a phone from your laptop.', `// Android: enable USB debugging → chrome://inspect on desktop Chrome
// iOS: Settings → Safari → Advanced → Web Inspector, then Safari → Develop menu`]],
      err: ['Hover-only menus on touch devices']
    }),
    L('pwa-installable'),
    t('pwa-manifest', 'Web App Manifest in Depth', 'B', {
      one: 'manifest.webmanifest describes how the installed app looks and behaves: name, icons, start_url, scope, display, theme/background colours, shortcuts, screenshots and more.',
      ex: `display: standalone (app-like), fullscreen, minimal-ui or browser; display_override for window-controls-overlay. id gives a stable identity. shortcuts add long-press quick actions; screenshots + description enable richer install dialogs; share_target receives shared content; file_handlers/protocol_handlers integrate with the OS (Chromium).

Validate in DevTools → Application → Manifest.`,
      pts: ['name, icons, start_url, display', 'Maskable icons', 'shortcuts + screenshots', 'share_target integration'],
      code: ['json', `{
  "id": "/",
  "name": "FrontEdge — Frontend Mastery",
  "short_name": "FrontEdge",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "background_color": "#0f1115",
  "theme_color": "#0f1115",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "shortcuts": [{ "name": "Start mock test", "url": "/#/mock", "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192" }] }],
  "screenshots": [{ "src": "/shots/home.png", "sizes": "780x1688", "type": "image/png", "form_factor": "narrow" }]
}`],
      iq: [['What does display: standalone do?', 'Opens the installed app in its own window without browser UI.']],
      cq: [['Track installs from the PWA.', `if (new URLSearchParams(location.search).get('source') === 'pwa') analytics('opened_from_home_screen');`]],
      err: ['Missing maskable icon (ugly Android icon)']
    })
  ),
  m('2. Service Workers & Offline',
    t('pwa-sw-lifecycle', 'Service Worker Lifecycle & Updates', 'I', {
      one: 'Service workers install, wait, activate and then control pages; updates follow the same lifecycle, so apps must handle new versions gracefully.',
      ex: `register() → install (pre-cache) → waiting (if an old SW still controls tabs) → activate (clean old caches) → fetch/push/sync events. A new SW waits until all tabs close unless skipWaiting() is called. Prompt users "New version available — Refresh" then call skipWaiting and reload on controllerchange.

The browser checks for updates on navigation (byte-diff of sw.js) — serve sw.js with no-cache headers. Scope is the folder of the SW file.`,
      pts: ['install → waiting → activate', 'skipWaiting + reload prompt', 'sw.js must not be cached', 'Scope = SW folder'],
      flow: ['register', 'install: pre-cache', 'waiting for old tabs', 'activate: clean caches', 'controls fetch events'],
      code: ['javascript', `// main.js — show an "Update available" banner
const reg = await navigator.serviceWorker.register('/sw.js');
reg.addEventListener('updatefound', () => {
  const nw = reg.installing;                                   // the new worker
  nw.addEventListener('statechange', () => {
    if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBanner(() => nw.postMessage('SKIP_WAITING'));
  });
});
navigator.serviceWorker.addEventListener('controllerchange', () => location.reload()); // new SW took over
// sw.js
self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });`],
      iq: [['Why do users still see the old version after deploy?', 'The new service worker is waiting until all tabs of the old version close; you need skipWaiting + clients.claim or an update prompt.']],
      cq: [['Unregister all service workers (debugging).', `(await navigator.serviceWorker.getRegistrations()).forEach((r) => r.unregister());`]],
      err: ['Caching sw.js with long max-age']
    }),
    t('pwa-caching-strategies', 'Caching Strategies & Workbox', 'I', {
      one: 'Common service-worker strategies — cache-first, network-first, stale-while-revalidate, network-only, cache-only — chosen per resource type; Workbox implements them declaratively.',
      ex: `App shell and hashed assets: cache-first (precache with revision). API data: network-first with timeout fallback to cache, or stale-while-revalidate for fast but fresh-ish data. Images: cache-first with expiration (max entries/age). HTML navigation: network-first with offline fallback page.

Workbox (vite-plugin-pwa, workbox-webpack-plugin) generates precache manifests and routing; add expiration and broadcast updates.`,
      pts: ['Cache-first for static assets', 'Network-first for APIs/HTML', 'SWR for fast + fresh', 'Workbox to configure'],
      dia: `flowchart TD
  R{"Request type"} -->|"Hashed JS/CSS"| CF["Cache first"]
  R -->|"Images"| CFE["Cache first + expiration"]
  R -->|"API data"| NF["Network first, fallback cache"]
  R -->|"Feeds, avatars"| SWR["Stale-while-revalidate"]
  R -->|"Navigation"| NFO["Network first, offline page"]`,
      code: ['javascript', `// vite.config.js with vite-plugin-pwa (Workbox under the hood)
import { VitePWA } from 'vite-plugin-pwa';
export default {
  plugins: [VitePWA({
    registerType: 'prompt',                                     // show update prompt
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],       // precache build output
      runtimeCaching: [
        { urlPattern: /\\/api\\/news/, handler: 'StaleWhileRevalidate', options: { cacheName: 'news' } },
        { urlPattern: ({ request }) => request.destination === 'image', handler: 'CacheFirst',
          options: { cacheName: 'images', expiration: { maxEntries: 100, maxAgeSeconds: 30 * 86400 } } }
      ]
    }
  })]
};`],
      iq: [['Which strategy for API data that must be fresh?', 'Network-first with a short timeout and cache fallback for offline.']],
      cq: [['Hand-written stale-while-revalidate.', `e.respondWith(caches.open('api').then(async (c) => { const hit = await c.match(e.request); const net = fetch(e.request).then((r) => (c.put(e.request, r.clone()), r)); return hit || net; }));`]],
      err: ['Cache-first for API responses (stale forever)']
    }),
    t('pwa-offline-first', 'Offline-first Data & Background Sync', 'A', {
      one: 'Offline-first apps read/write local data (IndexedDB) first, queue changes while offline and sync with the server when connectivity returns (Background Sync or manual retry).',
      ex: `Pattern: UI reads from local store → background fetch updates local store → writes go to an outbox queue → sync worker sends them and resolves conflicts (last-write-wins, server wins, or merge). Background Sync API (Chromium) retries in the service worker even if the tab closed; otherwise retry on 'online' events.

Show sync status ("Saved offline, will sync") and handle conflicts explicitly. Libraries: Dexie Cloud, RxDB, PouchDB, TanStack Query persisters, Replicache/Zero for sync engines.`,
      pts: ['Local DB as source for UI', 'Outbox queue for writes', 'Background Sync / online retry', 'Clear sync status + conflicts'],
      flow: ['User edits offline', 'Save to IndexedDB outbox', 'Connectivity returns', 'Sync sends queued changes', 'Server confirms; UI updated'],
      code: ['javascript', `async function saveNote(note) {
  await db.put('notes', { ...note, dirty: true });          // local first: instant UI
  await db.put('outbox', { id: crypto.randomUUID(), type: 'saveNote', note }); // queue the change
  const reg = await navigator.serviceWorker.ready;
  if ('sync' in reg) await reg.sync.register('sync-outbox'); // let SW retry later
  else if (navigator.onLine) flushOutbox();                  // fallback: try now
}
// sw.js
self.addEventListener('sync', (e) => {
  if (e.tag === 'sync-outbox') e.waitUntil(flushOutbox());   // retried by the browser until success
});`],
      iq: [['What conflict strategies exist for offline sync?', 'Last-write-wins, server-wins, client-wins, field-level merging, or CRDTs for collaborative data.']],
      cq: [['Retry when back online (all browsers).', `addEventListener('online', flushOutbox); // fallback when Background Sync is unsupported`]],
      err: ['Losing offline edits silently']
    })
  ),
  m('3. Distribution & Native',
    t('pwa-install-ux', 'Install Experience & App-like UX', 'I', {
      one: 'Design a respectful install flow (custom prompt after engagement, iOS instructions) and app-like UX: standalone layout, offline states, splash, gestures, haptics and fast navigation.',
      ex: `Capture beforeinstallprompt and show your own button after users engage (not on first load). Detect standalone mode (display-mode: standalone) to adjust UI (hide install button, add in-app back buttons). iOS needs "Share → Add to Home Screen" instructions.

App-like touches: bottom tab bar, skeleton screens, view transitions, pull-to-refresh, badge counts, offline banners, fast loads from cache, persist state across launches.`,
      pts: ['Prompt after engagement', 'Detect standalone mode', 'iOS manual instructions', 'Skeletons + offline states'],
      code: ['javascript', `const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone; // installed?
if (standalone) document.documentElement.classList.add('is-app');   // tweak UI for app mode
let promptEvent;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); promptEvent = e; }); // keep for later
function maybeOfferInstall(visits) {
  if (!standalone && promptEvent && visits >= 3) showInstallCard(async () => { // after real engagement
    promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;                // accepted / dismissed
    track('install_prompt', outcome);
  });
}
addEventListener('appinstalled', () => track('installed'));`],
      iq: [['Why not prompt to install on first visit?', 'Users haven’t seen value yet, so they dismiss it — and browsers may suppress future prompts.']],
      cq: [['Haptic feedback on Android.', `navigator.vibrate?.(10); // tiny vibration on important taps (not supported on iOS)`]],
      err: ['Aggressive install banners']
    }),
    t('pwa-app-stores', 'Publishing to Play Store & App Store (TWA, PWABuilder, Capacitor)', 'I', {
      one: 'Wrap a PWA for stores: Android via Trusted Web Activity (Bubblewrap/PWABuilder) with Digital Asset Links; iOS via Capacitor (WKWebView) adding native value to pass review.',
      ex: `Android TWA: PWABuilder generates a signed .aab; host /.well-known/assetlinks.json with your app's SHA-256 fingerprint so Chrome shows no URL bar; upload to Play Console (developer account fee, data safety form, privacy policy).

iOS: Capacitor creates an Xcode project loading your built web assets; add native plugins (push, haptics, share, offline storage) — Apple guideline 4.2 rejects "repackaged websites". Needs a Mac + Apple Developer Program. Updates: web content updates instantly for TWA; Capacitor can use live updates (within rules).`,
      pts: ['Android: TWA + assetlinks.json', 'iOS: Capacitor + native features', 'Store accounts + privacy policy', 'Apple rejects plain wrappers'],
      flow: ['Deploy PWA on HTTPS', 'Generate package (PWABuilder or Capacitor)', 'Verify domain (assetlinks)', 'Store listing + policies', 'Submit for review'],
      code: ['bash', `# iOS / Android with Capacitor
npm i @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init FrontEdge app.frontedge.mobile --web-dir=dist   # app id + build folder
npm run build && npx cap add ios && npx cap add android        # native projects
npx cap sync                                                    # copy web build + plugins
npx cap open ios                                                # build/sign in Xcode (needs a Mac)
# Android TWA alternative: https://www.pwabuilder.com → enter your Vercel URL → Package for Android`],
      iq: [['How does a TWA differ from a WebView app?', 'A TWA runs your verified PWA in full Chrome (same engine, cookies, updates) without browser UI; WebViews embed a separate engine.']],
      cq: [['assetlinks.json shape.', `[{ "relation": ["delegate_permission/common.handle_all_urls"], "target": { "namespace": "android_app", "package_name": "app.frontedge.twa", "sha256_cert_fingerprints": ["AB:CD:..."] } }]`]],
      err: ['Submitting a bare website wrapper to the App Store']
    }),
    t('pwa-cross-platform-choice', 'PWA vs React Native vs Flutter vs Capacitor', 'I', {
      one: 'Choosing a mobile approach: PWA (web, instant updates), Capacitor/Ionic (web inside native shell), React Native/Expo (native UI with React) or Flutter (Dart, own renderer) — based on features, team skills, performance and distribution.',
      ex: `PWA: cheapest, one codebase, SEO, instant updates; limits on iOS (push only when installed, fewer device APIs), weaker store discovery. Capacitor: reuse web app + native plugins and stores. React Native: native look/performance, huge ecosystem, React skills transfer, OTA updates via Expo. Flutter: consistent pixel-perfect UI, great performance, separate language.

Learning/content apps, dashboards and internal tools fit PWA/Capacitor; heavy device integration, complex animations or offline-heavy native UX fit React Native/Flutter.`,
      pts: ['PWA = reach + speed', 'Capacitor = web + stores', 'React Native = native UI with React', 'Flutter = own renderer, Dart'],
      dia: `flowchart TD
  Q{"Need deep native APIs or native-feel UI?"} -- No --> W{"Need store presence?"}
  W -- No --> PWA["PWA"]
  W -- Yes --> CAP["PWA + Capacitor / TWA"]
  Q -- Yes --> T{"Team knows React?"}
  T -- Yes --> RN["React Native + Expo"]
  T -- No --> FL["Flutter"]`,
      code: ['text', `Decision notes for FrontEdge (learning app):
- Content-heavy, SEO valuable          → PWA first
- Store presence for discovery          → TWA (Android) + Capacitor (iOS)
- Push reminders for daily revision     → Web Push (Android/desktop), native push via Capacitor on iOS
- Future: offline video, heavy native UX → consider React Native/Expo`],
      iq: [['When is a PWA not enough?', 'When you need extensive native APIs (background location, Bluetooth on iOS, advanced media), native UI performance or iOS push without installation.']],
      cq: [['Share code between web and React Native.', `// monorepo: packages/core (logic, API client, types) used by apps/web (React) and apps/mobile (Expo)`]],
      err: ['Choosing a stack before defining requirements']
    }),
    t('pwa-fugu-capabilities', 'Advanced PWA Capabilities (share target, file handling, badging, shortcuts)', 'A', {
      one: 'Modern PWAs can integrate with the OS: receive shared content (share_target), open files (file_handlers), handle links (protocol_handlers), show badges, use window controls overlay and periodic background sync.',
      ex: `Many of these are Chromium-only (Android, Windows, ChromeOS, macOS Chrome) — always feature-detect and treat as enhancements. Examples: a notes PWA appears in the Android share sheet; a markdown editor opens .md files; a mail app sets an unread badge; desktop PWAs draw custom title bars.`,
      pts: ['share_target / file_handlers', 'Badging API', 'Window Controls Overlay', 'Chromium-first → feature-detect'],
      code: ['json', `{
  "share_target": {
    "action": "/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": { "title": "title", "text": "text", "url": "url", "files": [{ "name": "file", "accept": ["image/*"] }] }
  },
  "file_handlers": [{ "action": "/open", "accept": { "text/markdown": [".md"] } }],
  "display_override": ["window-controls-overlay", "standalone"]
}`],
      iq: [['How can a PWA appear in the Android share sheet?', 'Declare share_target in the manifest and handle the incoming request (often in the service worker).']],
      cq: [['Read files opened via file_handlers.', `if ('launchQueue' in window) launchQueue.setConsumer(async ({ files }) => { for (const h of files) openDoc(await (await h.getFile()).text()); });`]],
      err: ['Relying on these features for core flows on iOS']
    })
  )
];
