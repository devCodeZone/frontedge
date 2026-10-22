// Browser & Web APIs — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import web from '../terms/web.js';
const L = legacyPicker(web);

export default [
  m('1. DOM & Events',
    t('webapi-dom-tree', 'The DOM Tree, Nodes & Traversal', 'B', {
      one: 'The DOM represents the document as a tree of nodes (elements, text, comments); you traverse it with parent/child/sibling properties and query it with selectors.',
      ex: `Node types: Document, Element, Text, Comment, DocumentFragment. Element-only traversal: parentElement, children, firstElementChild, nextElementSibling, closest(). Node traversal (childNodes, firstChild) includes text/whitespace nodes.

Measurement APIs: getBoundingClientRect(), offsetWidth, scrollHeight, clientWidth. Reading layout after writing styles forces synchronous layout (layout thrashing) — batch reads then writes. matches(selector) tests an element; contains() checks ancestry.`,
      pts: ['Element vs Node traversal', 'closest() and matches()', 'getBoundingClientRect for geometry', 'Batch reads before writes'],
      dia: `flowchart TD
  D["document"] --> H["html"]
  H --> HD["head"]
  H --> B["body"]
  B --> M["main"]
  M --> P["p (Element)"]
  P --> T["'Hello' (Text node)"]`,
      code: ['javascript', `const item = document.querySelector('li.active');      // an element
console.log(item.parentElement.tagName);                 // "UL"
console.log(item.nextElementSibling?.textContent);       // next item text
console.log(item.closest('nav') !== null);               // inside a nav?
console.log(item.matches('.active'));                    // true
const rect = item.getBoundingClientRect();               // position + size relative to viewport
console.log(rect.top, rect.width);
console.log(item.childNodes.length, item.children.length); // nodes (incl. text) vs elements`],
      iq: [['childNodes vs children?', 'childNodes includes all nodes (text, comments); children only element nodes.'],
           ['What is layout thrashing?', 'Interleaving DOM reads and writes that forces the browser to recalculate layout repeatedly.']],
      cq: [['Find all text containing a word (TreeWalker).', `const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); // text nodes only
const hits = [];
while (walker.nextNode()) if (walker.currentNode.nodeValue.includes('React')) hits.push(walker.currentNode); // collect matches`]],
      err: ['Reading offsetHeight inside loops that also write styles']
    }),
    L('webapi-event-delegation'),
    t('webapi-custom-events', 'Custom Events & EventTarget', 'I', {
      one: 'Create your own events with new CustomEvent(name, { detail, bubbles }) and dispatch them; extend EventTarget to build event-emitting classes without libraries.',
      ex: `Custom events decouple components: a web component or micro-frontend dispatches 'cart:add' and others listen. bubbles: true lets ancestors catch it; composed: true lets it cross shadow DOM boundaries. EventTarget is available in browsers and Node, giving addEventListener/dispatchEvent for any object.`,
      pts: ['CustomEvent with detail', 'bubbles / composed options', 'EventTarget for your own classes', 'Decouples components'],
      code: ['javascript', `class Store extends EventTarget {                      // built-in emitter
  #items = [];
  add(item) {
    this.#items.push(item);
    this.dispatchEvent(new CustomEvent('change', { detail: [...this.#items] })); // notify
  }
}
const store = new Store();
store.addEventListener('change', (e) => console.log('items', e.detail)); // subscribe
store.add('React');
document.querySelector('#widget').dispatchEvent(
  new CustomEvent('widget:ready', { bubbles: true, composed: true, detail: { version: 2 } }) // crosses shadow DOM
);`],
      iq: [['What does composed: true do?', 'Allows the event to propagate out of a shadow root into the light DOM.']],
      cq: [['Listen once for a custom event as a promise.', `const once = (target, type) => new Promise((res) => target.addEventListener(type, res, { once: true }));
const e = await once(document, 'widget:ready'); console.log(e.detail);`]],
      err: ['Forgetting bubbles: true and listening on an ancestor']
    }),
    t('webapi-web-components', 'Web Components & Shadow DOM', 'I', {
      one: 'Web Components are native reusable elements built from Custom Elements, Shadow DOM (encapsulated DOM and styles) and templates/slots — usable in any framework.',
      ex: `attachShadow({ mode: 'open' }) creates a shadow root whose styles don't leak in or out. Style the host with :host, slotted content with ::slotted(), expose styling hooks with CSS custom properties and ::part(). Lifecycle: connectedCallback, disconnectedCallback, attributeChangedCallback, adoptedCallback.

Form-associated custom elements (ElementInternals) participate in forms. Libraries like Lit simplify authoring. Used for design systems shared across React/Angular/Vue apps (e.g. Shoelace/Web Awesome, Salesforce, Adobe Spectrum).`,
      pts: ['Custom Elements + Shadow DOM + slots', 'Style encapsulation', ':host, ::slotted, ::part', 'Framework-agnostic design systems'],
      flow: ['customElements.define', 'Element upgraded', 'connectedCallback attaches shadow root', 'Slots project light DOM', 'Attributes change → re-render'],
      code: ['javascript', `class FeBadge extends HTMLElement {
  static observedAttributes = ['level'];                 // watched attributes
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });                 // encapsulated DOM
  }
  connectedCallback() { this.render(); }                 // added to page
  attributeChangedCallback() { this.render(); }          // level changed
  render() {
    const level = this.getAttribute('level') ?? 'Beginner';
    this.shadowRoot.innerHTML = \`
      <style>
        :host { display: inline-block; }                  /* the element itself */
        span { padding: 2px 8px; border-radius: 99px; background: var(--badge-bg, #eee); }
      </style>
      <span part="pill">\${level}</span><slot></slot>\`;   // part = styleable from outside
  }
}
customElements.define('fe-badge', FeBadge);              // <fe-badge level="Advanced">!</fe-badge>`],
      iq: [['What problem does Shadow DOM solve?', 'Encapsulation: component internals and styles are isolated from the page and vice versa.'],
           ['How do you style inside a shadow root from outside?', 'CSS custom properties (inherit through), ::part() for exposed parts, and ::slotted for projected content inside.']],
      cq: [['Use a web component in React 19.', `<fe-badge level="Advanced" onclick={handle} /> {/* React 19 passes properties/events to custom elements */}`]],
      err: ['Expecting global CSS to style shadow internals']
    })
  ),
  m('2. Storage',
    t('webapi-web-storage', 'localStorage & sessionStorage', 'B', {
      one: 'Synchronous key–value string storage per origin: localStorage persists until cleared, sessionStorage lasts for the tab session.',
      ex: `~5MB per origin, strings only (JSON.stringify objects), synchronous (blocks the main thread for large data), available to any script on the origin — never store tokens or sensitive data (XSS can read it). Can throw in private modes or when full: wrap in try/catch. The storage event syncs other tabs.

For larger or structured data use IndexedDB; for request/response caching use the Cache API.`,
      pts: ['Strings only, ~5MB', 'Synchronous', 'Not for secrets (XSS readable)', 'Wrap in try/catch'],
      code: ['javascript', `const storage = {                                    // safe wrapper
  get(key, fallback = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } // parse JSON
    catch { return fallback; }                       // blocked or invalid JSON
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }                          // quota exceeded / private mode
  }
};
storage.set('prefs', { theme: 'dark' });
console.log(storage.get('prefs').theme);             // "dark"
sessionStorage.setItem('draft', 'unsaved text');     // gone when the tab closes`],
      iq: [['localStorage vs sessionStorage vs cookies?', 'localStorage persists; sessionStorage is per tab session; cookies are sent with every request, can be HttpOnly and have expiry/domain/path controls.'],
           ['Why not store JWTs in localStorage?', 'Any injected script (XSS) can read and exfiltrate them.']],
      cq: [['Expiring localStorage item.', `const setWithTTL = (k, v, ms) => localStorage.setItem(k, JSON.stringify({ v, exp: Date.now() + ms }));
const getWithTTL = (k) => { const o = JSON.parse(localStorage.getItem(k) || 'null'); return o && o.exp > Date.now() ? o.v : null; };`]],
      err: ['Storing large datasets synchronously']
    }),
    t('webapi-cookies', 'Cookies from the Frontend Perspective', 'I', {
      one: 'Cookies are small name=value pairs the browser stores and automatically sends with matching requests, controlled by attributes like HttpOnly, Secure, SameSite, Domain, Path and Max-Age.',
      ex: `Servers set cookies via Set-Cookie headers; JS can read/write non-HttpOnly cookies via document.cookie (or the async Cookie Store API). Use HttpOnly + Secure + SameSite=Lax/Strict for sessions. Third-party cookies are being restricted (Safari/Firefox block them; partitioned cookies with CHIPS).

Cookies add bytes to every request — keep them small. Consent laws (GDPR/DPDP) require consent for non-essential cookies.`,
      pts: ['Sent automatically with requests', 'HttpOnly hides from JS', 'SameSite against CSRF', 'Third-party cookies restricted'],
      code: ['javascript', `document.cookie = 'lang=hi; Max-Age=31536000; Path=/; SameSite=Lax; Secure'; // set (1 year)
function getCookie(name) {                                       // parse document.cookie
  return document.cookie.split('; ').find((c) => c.startsWith(name + '='))?.split('=')[1];
}
console.log(getCookie('lang'));                                  // "hi"
document.cookie = 'lang=; Max-Age=0; Path=/';                    // delete by expiring
// Modern async API (Chromium): await cookieStore.set({ name: 'lang', value: 'en' });`],
      iq: [['What does HttpOnly do?', 'Prevents JavaScript from reading the cookie, protecting session cookies from XSS theft.']],
      cq: [['Server Set-Cookie for a session.', `Set-Cookie: sid=abc123; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=86400`]],
      err: ['Readable session cookies']
    }),
    t('webapi-indexeddb', 'IndexedDB', 'I', {
      one: 'IndexedDB is an asynchronous, transactional, client-side database for large structured data (objects, blobs) with indexes — the storage behind offline-first apps.',
      ex: `Databases contain object stores (like tables) with keys and indexes; operations run in transactions. The raw API is verbose and event-based, so most apps use idb (promise wrapper) or Dexie. Quotas are large (a share of disk), and navigator.storage.persist() requests persistent storage.

Use for offline data, drafts, cached API data, files and sync queues.`,
      pts: ['Async, transactional, large capacity', 'Object stores + indexes', 'Use idb/Dexie wrappers', 'Foundation of offline-first'],
      code: ['javascript', `import { openDB } from 'idb';                               // promise-based wrapper
const db = await openDB('frontedge', 1, {
  upgrade(db) {                                               // runs on version change
    const store = db.createObjectStore('terms', { keyPath: 'id' }); // primary key
    store.createIndex('byTrack', 'cat');                      // secondary index
  }
});
await db.put('terms', { id: 'js-closures', cat: 'javascript', name: 'Closures' }); // upsert
const jsTerms = await db.getAllFromIndex('terms', 'byTrack', 'javascript');       // query index
console.log(jsTerms.length);`],
      iq: [['IndexedDB vs localStorage?', 'IndexedDB is async, stores structured data and blobs, supports indexes/transactions and much larger quotas; localStorage is sync strings only.']],
      cq: [['Request persistent storage.', `if (navigator.storage?.persist) console.log(await navigator.storage.persist()); // true if granted`]],
      err: ['Using the raw callback API everywhere']
    }),
    t('webapi-cache-api', 'Cache API & Storage Quotas', 'I', {
      one: 'The Cache API stores Request/Response pairs (used by service workers for offline assets); navigator.storage.estimate() reports usage and quota.',
      ex: `caches.open('v1') returns a cache; cache.addAll(urls) pre-caches; cache.match(request) reads; cache.put stores responses. Available in windows and workers. Version cache names and delete old ones on activate.

Browsers evict storage under pressure unless persistent; Safari may clear storage for sites not visited for a while (ITP).`,
      pts: ['Request → Response storage', 'Used by service workers', 'Version and clean caches', 'storage.estimate() for quota'],
      code: ['javascript', `const cache = await caches.open('frontedge-v2');                 // open/create
await cache.addAll(['/', '/index.html', '/icons/icon-192.png']); // pre-cache assets
const cached = await cache.match('/index.html');                 // read
console.log(!!cached);
const { usage, quota } = await navigator.storage.estimate();      // bytes used / available
console.log(Math.round((usage / quota) * 100) + '% used');
for (const name of await caches.keys()) if (name !== 'frontedge-v2') await caches.delete(name); // clean old`],
      iq: [['Cache API vs HTTP cache?', 'The HTTP cache is browser-managed via headers; the Cache API is programmatically controlled by your code.']],
      cq: [['Offline fallback in a service worker fetch.', `e.respondWith(fetch(e.request).catch(() => caches.match('/offline.html'))); // network or fallback`]],
      err: ['Never deleting old caches']
    })
  ),
  m('3. Observers & Workers',
    L('webapi-observers'),
    L('webapi-workers'),
    t('webapi-messaging', 'postMessage, MessageChannel & BroadcastChannel', 'I', {
      one: 'Cross-context messaging APIs: window.postMessage (frames/popups), MessageChannel (private two-way ports), BroadcastChannel (all same-origin tabs/workers).',
      ex: `postMessage(data, targetOrigin) sends structured-cloneable data between windows; always set a specific targetOrigin and validate event.origin on receive. MessageChannel creates two linked ports for dedicated communication (e.g. iframe ↔ parent, worker pools). BroadcastChannel('name') broadcasts to every same-origin context — great for syncing logout or cart across tabs. Transferables (ArrayBuffer) move ownership without copying.`,
      pts: ['postMessage + origin checks', 'MessageChannel for private ports', 'BroadcastChannel for all tabs', 'Transferables avoid copying'],
      code: ['javascript', `// Parent → iframe with a specific target origin
const frame = document.querySelector('iframe');
frame.contentWindow.postMessage({ type: 'theme', value: 'dark' }, 'https://widget.example.com'); // never "*" for sensitive data
window.addEventListener('message', (e) => {
  if (e.origin !== 'https://widget.example.com') return;          // validate sender
  if (e.data?.type === 'resize') frame.style.height = e.data.height + 'px'; // handle
});
// Sync logout across tabs
const auth = new BroadcastChannel('auth');
auth.onmessage = (e) => { if (e.data === 'logout') location.href = '/login'; };
function logout() { auth.postMessage('logout'); location.href = '/login'; }`],
      iq: [['Why specify targetOrigin in postMessage?', 'Prevents leaking data if the target window navigated to a different (malicious) origin.']],
      cq: [['Transfer a large buffer to a worker without copying.', `worker.postMessage(buffer, [buffer]); // buffer becomes unusable here, owned by the worker`]],
      err: ['postMessage(data, "*") with secrets']
    }),
    t('webapi-webassembly', 'WebAssembly (Wasm) for Frontend', 'A', {
      one: 'WebAssembly is a fast, portable binary format that runs alongside JavaScript in the browser — used for heavy computation like image/video processing, games, CAD and AI inference.',
      ex: `Compile C/C++/Rust/Go to .wasm, load with WebAssembly.instantiateStreaming(fetch('/x.wasm')) and call exported functions from JS. Tools: Emscripten, wasm-pack (Rust), AssemblyScript. Real examples: Figma, Photoshop web, FFmpeg.wasm, SQLite in the browser, ONNX Runtime/Transformers.js backends.

Wasm doesn't access the DOM directly; JS glue passes data (copying memory has a cost). Run heavy Wasm in a Web Worker.`,
      pts: ['Near-native speed for compute', 'Compiled from Rust/C++/Go', 'Called from JS', 'Run in workers for heavy work'],
      flow: ['Rust/C++ source', 'Compile to .wasm', 'Fetch + instantiate', 'Call exports from JS', 'Return results to UI'],
      code: ['javascript', `const { instance } = await WebAssembly.instantiateStreaming( // compile while downloading
  fetch('/wasm/math.wasm'),                                 // served with application/wasm
  { env: { log: (n) => console.log('from wasm', n) } }      // imports available to wasm
);
const { fib } = instance.exports;                           // exported function
console.log(fib(40));                                       // fast native-like computation`],
      iq: [['Does WebAssembly replace JavaScript?', 'No — it complements JS for compute-heavy tasks; JS still handles DOM and app logic.']],
      cq: [['Load a wasm-pack Rust module.', `import init, { resize } from './pkg/image_tools.js'; // generated bindings
await init();                                         // load wasm
const out = resize(bytes, 800, 600);                  // call Rust function`]],
      err: ['Frequent tiny calls across the JS–Wasm boundary']
    })
  ),
  m('4. Media & Graphics',
    t('webapi-canvas-webgl', 'Canvas 2D, WebGL & WebGPU', 'I', {
      one: 'Canvas 2D draws shapes/images/text with an immediate-mode API; WebGL and WebGPU use the GPU for 3D graphics and compute.',
      ex: `Canvas 2D: charts, signatures, image editing, simple games; redraw on each frame with requestAnimationFrame. WebGL (OpenGL ES based) powers 3D via libraries (Three.js, Babylon.js, deck.gl maps). WebGPU (modern, now in major browsers) offers better performance and GPU compute — used for ML inference in the browser.

OffscreenCanvas lets workers render without blocking the UI. Handle device pixel ratio for sharp output and provide accessible alternatives.`,
      pts: ['2D for charts/editors', 'WebGL via Three.js', 'WebGPU for modern graphics + compute', 'OffscreenCanvas in workers'],
      code: ['javascript', `const canvas = document.querySelector('#chart');
const ctx = canvas.getContext('2d');                     // 2D context
const data = [40, 75, 55, 90];
const barW = canvas.width / data.length;
data.forEach((v, i) => {
  const h = (v / 100) * canvas.height;                   // scale value to height
  ctx.fillStyle = i % 2 ? '#4dabf7' : '#7cf2c8';         // alternate colours
  ctx.fillRect(i * barW + 8, canvas.height - h, barW - 16, h); // draw bar
});
const hasWebGPU = 'gpu' in navigator;                    // feature detect WebGPU`],
      iq: [['When use WebGL/WebGPU instead of Canvas 2D?', 'For 3D scenes, thousands of animated objects, heavy visual effects or GPU compute.']],
      cq: [['Export a canvas as an image.', `canvas.toBlob((blob) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'chart.png'; a.click(); }, 'image/png');`]],
      err: ['Not handling devicePixelRatio (blurry output)']
    }),
    t('webapi-media-devices', 'Camera, Microphone & Screen (getUserMedia, MediaRecorder)', 'I', {
      one: 'navigator.mediaDevices.getUserMedia accesses camera/mic streams, getDisplayMedia captures the screen, and MediaRecorder records streams to files.',
      ex: `Requires HTTPS and user permission. Show a <video> preview with srcObject = stream; stop tracks when done (stream.getTracks().forEach(t => t.stop())) to turn off the camera light. Constraints select resolution, facingMode (user/environment) and device. MediaRecorder produces Blobs (webm/mp4) for uploads.

Use cases: video KYC, voice notes, barcode/QR scanning (BarcodeDetector), screen recording, voice input for AI apps.`,
      pts: ['HTTPS + permission required', 'srcObject for preview', 'Stop tracks to release device', 'MediaRecorder for recording'],
      code: ['javascript', `async function startCamera(videoEl) {
  const stream = await navigator.mediaDevices.getUserMedia({        // asks permission
    video: { facingMode: 'environment', width: { ideal: 1280 } },    // back camera
    audio: false
  });
  videoEl.srcObject = stream;                                       // live preview
  await videoEl.play();
  return stream;
}
async function recordVoice(ms = 5000) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // microphone
  const rec = new MediaRecorder(stream);                            // recorder
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);                 // collect data
  rec.start(); await new Promise((r) => setTimeout(r, ms)); rec.stop(); // record for ms
  await new Promise((r) => (rec.onstop = r));
  stream.getTracks().forEach((t) => t.stop());                      // release mic
  return new Blob(chunks, { type: rec.mimeType });                  // audio file
}`],
      iq: [['Why might getUserMedia fail?', 'Not HTTPS, permission denied, no device, device in use, or iframe without allow="camera".']],
      cq: [['List available cameras.', `const cams = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === 'videoinput');`]],
      err: ['Not stopping tracks after use']
    }),
    t('webapi-audio-speech', 'Web Audio & Web Speech APIs', 'I', {
      one: 'Web Audio processes and synthesises sound with audio nodes; the Web Speech API provides speech recognition (speech-to-text) and speech synthesis (text-to-speech).',
      ex: `AudioContext → source → gain/filter/analyser nodes → destination: build visualisers, games and audio effects. speechSynthesis.speak(new SpeechSynthesisUtterance(text)) reads text aloud (great for accessibility/learning apps); voices vary per OS.

SpeechRecognition (webkitSpeechRecognition in Chrome) converts voice to text, often via cloud services — support is limited across browsers; cloud APIs (Whisper, Gemini, Deepgram) are alternatives.`,
      pts: ['AudioContext node graph', 'speechSynthesis for TTS', 'SpeechRecognition limited support', 'Cloud STT as fallback'],
      code: ['javascript', `function speak(text, lang = 'en-IN') {
  const u = new SpeechSynthesisUtterance(text);        // what to say
  u.lang = lang; u.rate = 1;                           // language + speed
  speechSynthesis.cancel();                            // stop current speech
  speechSynthesis.speak(u);                            // read aloud
}
speak('A closure remembers its outer scope.');
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SR) {
  const rec = new SR(); rec.lang = 'en-IN';            // recogniser
  rec.onresult = (e) => console.log('You said:', e.results[0][0].transcript); // text
  rec.start();                                         // listen (asks mic permission)
}`],
      iq: [['How would you add "listen to this explanation" to a learning app?', 'Use speechSynthesis with an utterance per paragraph, plus pause/resume controls and language selection.']],
      cq: [['Beep with Web Audio.', `const ctx = new AudioContext(); const osc = ctx.createOscillator(); osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.2); // 200ms tone`]],
      err: ['Assuming SpeechRecognition works in all browsers']
    }),
    t('webapi-webrtc', 'WebRTC (real-time audio/video/data)', 'A', {
      one: 'WebRTC enables peer-to-peer audio, video and data channels between browsers with low latency, using signalling, ICE (STUN/TURN) and encrypted media.',
      ex: `Flow: get media → create RTCPeerConnection → exchange offer/answer SDP and ICE candidates through your signalling server (WebSocket) → media flows peer-to-peer (or via TURN relays when NAT blocks). RTCDataChannel sends arbitrary data (file transfer, games).

Group calls use SFUs (LiveKit, mediasoup, Jitsi). Used for video calls, telehealth, live classes, screen sharing and multiplayer.`,
      pts: ['Peer-to-peer, low latency', 'Signalling server for SDP/ICE', 'STUN/TURN for NAT traversal', 'SFU for group calls'],
      flow: ['getUserMedia', 'Create offer SDP', 'Exchange via signalling server', 'Exchange ICE candidates', 'Encrypted media flows'],
      code: ['javascript', `const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }); // NAT discovery
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
stream.getTracks().forEach((t) => pc.addTrack(t, stream));         // send local media
pc.ontrack = (e) => (remoteVideo.srcObject = e.streams[0]);       // receive remote media
pc.onicecandidate = (e) => e.candidate && signal.send({ candidate: e.candidate }); // share network paths
const offer = await pc.createOffer();                              // describe our media
await pc.setLocalDescription(offer);
signal.send({ sdp: pc.localDescription });                         // send via WebSocket
// on answer: await pc.setRemoteDescription(answer)`],
      iq: [['Why does WebRTC need a server if it is peer-to-peer?', 'A signalling server exchanges connection details, and STUN/TURN servers help traverse NATs/firewalls.']],
      cq: [['Send text over a data channel.', `const ch = pc.createDataChannel('chat'); ch.onopen = () => ch.send('hello'); // P2P data`]],
      err: ['No TURN server (calls fail on corporate networks)']
    })
  ),
  m('5. Device & Platform APIs',
    t('webapi-geolocation-sensors', 'Geolocation & Device Sensors', 'B', {
      one: 'navigator.geolocation gives the user’s location with permission; device APIs expose orientation, motion, vibration, battery and more (support varies).',
      ex: `getCurrentPosition(success, error, { enableHighAccuracy, timeout, maximumAge }) or watchPosition for tracking. HTTPS and permission required; explain why before asking. Handle denial gracefully (manual city input).

DeviceOrientation/DeviceMotion events (iOS requires a permission request), navigator.vibrate (Android), Screen Wake Lock (keep screen on for recipes/presentations), Battery Status (limited).`,
      pts: ['Permission + HTTPS', 'Explain before asking', 'Fallback when denied', 'Wake Lock for keep-awake'],
      code: ['javascript', `function getLocation() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('Not supported'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy }), // success
      (err) => reject(err),                                         // denied / timeout
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 } // balanced options
    );
  });
}
const lock = await navigator.wakeLock?.request('screen');          // keep screen on
// lock?.release() when done`],
      iq: [['How should you request location permission?', 'In response to a user action, after explaining the benefit, with a fallback if denied.']],
      cq: [['Check permission state first.', `const status = await navigator.permissions.query({ name: 'geolocation' }); // granted | denied | prompt
console.log(status.state);`]],
      err: ['Requesting permissions on page load']
    }),
    t('webapi-notifications-push', 'Notifications & Push API', 'I', {
      one: 'The Notifications API shows system notifications; the Push API with a service worker receives server-sent push messages even when the site isn’t open.',
      ex: `Ask permission after user intent (Notification.requestPermission()). Push flow: register service worker → pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: VAPID }) → send subscription to your server → server sends via web-push → service worker 'push' event shows a notification → 'notificationclick' opens the app.

iOS supports web push only for installed PWAs (16.4+). Respect frequency and offer easy opt-out.`,
      pts: ['Permission after user intent', 'Push needs service worker + VAPID', 'notificationclick opens app', 'iOS: installed PWAs only'],
      flow: ['User opts in', 'Subscribe with VAPID key', 'Save subscription on server', 'Server sends push', 'SW shows notification'],
      code: ['javascript', `async function enablePush(vapidPublicKey) {
  if ((await Notification.requestPermission()) !== 'granted') return null; // user said no
  const reg = await navigator.serviceWorker.ready;                         // active SW
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,                                                 // must show notifications
    applicationServerKey: vapidPublicKey                                   // identifies your server
  });
  await fetch('/api/push/subscribe', { method: 'POST', body: JSON.stringify(sub) }); // store it
  return sub;
}
// sw.js
self.addEventListener('push', (e) => {
  const data = e.data?.json() ?? {};
  e.waitUntil(self.registration.showNotification(data.title ?? 'FrontEdge', { body: data.body, data: { url: data.url } }));
});
self.addEventListener('notificationclick', (e) => { e.notification.close(); e.waitUntil(clients.openWindow(e.notification.data.url ?? '/')); });`],
      iq: [['Can websites send push notifications when closed?', 'Yes, via the Push API and a service worker (on iOS only for installed PWAs).']],
      cq: [['Simple local notification.', `if (Notification.permission === 'granted') new Notification('Daily revision', { body: 'Time for your 10-minute quiz!' });`]],
      err: ['Prompting for notifications immediately on first visit']
    }),
    t('webapi-clipboard-share-files', 'Clipboard, Web Share, File & Drag-and-Drop APIs', 'B', {
      one: 'Async Clipboard API copies/pastes text and images, Web Share opens the native share sheet, File/Blob/FileReader read user files, and drag-and-drop/File System Access handle file workflows.',
      ex: `navigator.clipboard.writeText needs a user gesture and secure context. navigator.share({ title, text, url, files }) works on mobile and some desktops — feature-detect and fall back to copy link. Files from <input type=file> or drop events are File objects (Blob subclass): read with file.text(), arrayBuffer() or URL.createObjectURL for previews.

File System Access API (showOpenFilePicker/showSaveFilePicker) enables editors that save back to disk (Chromium).`,
      pts: ['Clipboard needs user gesture', 'Web Share with fallback', 'File/Blob/object URLs', 'Drag-drop with dragover preventDefault'],
      code: ['javascript', `async function shareTerm(term) {
  const data = { title: term.name, text: term.oneLiner, url: location.origin + '/term/' + term.id };
  if (navigator.share) return navigator.share(data);             // native share sheet
  await navigator.clipboard.writeText(data.url);                 // fallback: copy link
  alert('Link copied');
}
const zone = document.querySelector('#drop');
zone.addEventListener('dragover', (e) => e.preventDefault());    // allow dropping
zone.addEventListener('drop', async (e) => {
  e.preventDefault();                                            // don't open the file
  const [file] = e.dataTransfer.files;                           // dropped files
  if (file?.type === 'application/json') console.log(JSON.parse(await file.text())); // read content
});`],
      iq: [['Why does clipboard.writeText sometimes fail?', 'It requires a secure context, document focus and usually a user gesture; permissions can block it.']],
      cq: [['Download generated text as a file.', `const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'notes.json' });
a.click(); URL.revokeObjectURL(a.href);   // free memory`]],
      err: ['Forgetting preventDefault on dragover']
    }),
    t('webapi-history-url', 'History API, Navigation API, URL & URLSearchParams', 'I', {
      one: 'APIs for SPA navigation and URL handling: history.pushState/replaceState + popstate, the newer Navigation API, and URL/URLSearchParams for parsing and building URLs.',
      ex: `Routers are built on these. pushState adds an entry without reload; popstate fires on back/forward (not on pushState). The Navigation API (navigation.navigate, navigate event with intercept) simplifies SPA routing, now in major browsers.

new URL(path, base) parses and resolves URLs safely; url.searchParams.get/set/append/delete manipulate queries with correct encoding. Never build URLs by concatenating unencoded user input.`,
      pts: ['pushState + popstate', 'Navigation API intercept', 'URL for parsing/resolving', 'URLSearchParams handles encoding'],
      code: ['javascript', `const url = new URL('/search', location.origin);         // resolve against origin
url.searchParams.set('q', 'react & vue');                  // encodes & and spaces
url.searchParams.append('tag', 'hooks');
console.log(url.href);                                     // .../search?q=react+%26+vue&tag=hooks
history.pushState({ q: 'react' }, '', url);               // SPA navigation
window.addEventListener('popstate', (e) => render(e.state)); // back/forward
// Navigation API (modern browsers)
navigation?.addEventListener('navigate', (e) => {
  if (!e.canIntercept || new URL(e.destination.url).origin !== location.origin) return;
  e.intercept({ handler: () => render(new URL(e.destination.url).pathname) }); // client-side route
});`],
      iq: [['Does pushState trigger popstate?', 'No — popstate fires only on history traversal (back/forward) or history.go.']],
      cq: [['Read all filters from the URL.', `const filters = Object.fromEntries(new URLSearchParams(location.search)); // { level: 'advanced', track: 'react' }`]],
      err: ['String-concatenating query parameters']
    }),
    t('webapi-page-lifecycle', 'Page Visibility, Lifecycle & Fullscreen/PiP APIs', 'I', {
      one: 'Detect when the page is hidden/shown (visibilitychange), frozen or restored from bfcache (pageshow/pagehide), and control fullscreen and picture-in-picture.',
      ex: `Pause videos, polling and animations when document.visibilityState === 'hidden'; flush analytics with sendBeacon on pagehide/visibilitychange (unload is unreliable and blocks bfcache). Back/forward cache restores pages instantly — pageshow with event.persisted tells you; avoid unload listeners to stay eligible.

element.requestFullscreen(), document.exitFullscreen(), video.requestPictureInPicture() and the Document PiP API (any HTML in a PiP window).`,
      pts: ['visibilitychange to pause work', 'sendBeacon on pagehide', 'Avoid unload (bfcache)', 'Fullscreen and PiP APIs'],
      code: ['javascript', `document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    stopPolling();                                         // save battery/network
    navigator.sendBeacon('/analytics', JSON.stringify(sessionStats)); // reliable send
  } else {
    startPolling();                                        // resume
  }
});
window.addEventListener('pageshow', (e) => {
  if (e.persisted) refreshStaleData();                     // restored from bfcache
});
document.querySelector('#presentBtn').onclick = () => document.querySelector('#slides').requestFullscreen(); // fullscreen`],
      iq: [['Why avoid the unload event?', 'It is unreliable on mobile and makes pages ineligible for the back/forward cache.']],
      cq: [['Pause a video when the tab is hidden.', `document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });`]],
      err: ['Sending analytics with synchronous XHR in unload']
    }),
    t('webapi-webauthn-passkeys', 'WebAuthn & Passkeys', 'A', {
      one: 'WebAuthn lets users sign in with public-key credentials (passkeys) unlocked by biometrics or device PIN — phishing-resistant, passwordless authentication.',
      ex: `Registration: server sends a challenge → navigator.credentials.create({ publicKey }) → authenticator creates a key pair, returns the public key + attestation → server stores it. Login: navigator.credentials.get({ publicKey: { challenge } }) → signed assertion → server verifies with the public key.

Passkeys sync across devices (iCloud Keychain, Google Password Manager). Conditional UI (autocomplete="username webauthn") shows passkeys in autofill. Use libraries (SimpleWebAuthn) for encoding and verification.`,
      pts: ['Public-key, phishing-resistant', 'create() to register, get() to sign in', 'Passkeys sync across devices', 'Use SimpleWebAuthn helpers'],
      flow: ['Server sends challenge', 'Browser asks for biometric', 'Authenticator signs challenge', 'Server verifies with public key', 'Session created'],
      code: ['javascript', `import { startAuthentication } from '@simplewebauthn/browser';
async function loginWithPasskey() {
  const options = await fetch('/api/webauthn/login-options').then((r) => r.json()); // challenge from server
  const assertion = await startAuthentication({ optionsJSON: options });             // biometric prompt
  const res = await fetch('/api/webauthn/verify', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assertion)                                                  // signed response
  });
  if (res.ok) location.href = '/dashboard';                                          // logged in
}
// <input name="username" autocomplete="username webauthn"> enables passkey autofill`],
      iq: [['Why are passkeys phishing-resistant?', 'Credentials are bound to the origin; a fake site cannot request a signature for the real site’s credential.']],
      cq: [['Feature-detect platform authenticator.', `const ok = await PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.(); // Face ID / Windows Hello available?`]],
      err: ['Implementing WebAuthn crypto by hand']
    }),
    t('webapi-permissions-capabilities', 'Permissions API & Project Fugu Capabilities', 'A', {
      one: 'The Permissions API queries permission states; Project Fugu added powerful capabilities like File System Access, Web Bluetooth/USB/Serial/HID, Badging, Contact Picker, Idle Detection and Window Controls Overlay.',
      ex: `navigator.permissions.query({ name }) returns granted/denied/prompt and fires change events — use it to show appropriate UI before prompting. Fugu APIs are mostly Chromium-only, so always feature-detect and progressively enhance.

Examples: Web Serial for IoT dashboards, WebHID for game controllers, Badging API for unread counts on installed PWAs, Compute Pressure for adaptive video quality.`,
      pts: ['Query before prompting', 'Fugu APIs mostly Chromium', 'Feature-detect everything', 'Progressive enhancement'],
      code: ['javascript', `async function canUseCamera() {
  try {
    const status = await navigator.permissions.query({ name: 'camera' }); // may be unsupported
    status.onchange = () => console.log('camera permission:', status.state); // react to changes
    return status.state !== 'denied';
  } catch { return true; }                                                // unknown: try and handle errors
}
if ('setAppBadge' in navigator) navigator.setAppBadge(5);                // badge on installed app icon
if ('serial' in navigator) console.log('Web Serial available');          // capability check`],
      iq: [['Why feature-detect Fugu APIs?', 'They are not supported in all browsers (especially Safari/Firefox), so apps must degrade gracefully.']],
      cq: [['Clear the app badge when messages are read.', `navigator.clearAppBadge?.();`]],
      err: ['Building core flows on Chromium-only APIs']
    })
  )
];
