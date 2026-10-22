// Next.js — complete syllabus (App Router first, Pages Router for legacy)
import { t, m, legacyPicker } from '../normalize.js';
import fw from '../terms/frameworks.js';
const L = legacyPicker(fw);

export default [
  m('1. Getting Started',
    t('next-intro', 'What is Next.js & Why Use It', 'B', {
      one: 'Next.js is a React framework that adds file-based routing, server rendering, data fetching, caching, image/font optimisation and API endpoints on top of React.',
      ex: `React alone renders UI; Next.js decides how pages are routed, rendered (static, dynamic, streamed), cached and deployed. The App Router (app/ directory) is built on React Server Components, layouts, streaming and Server Actions. The older Pages Router (pages/) is still supported.

Benefits: SEO-friendly HTML, fast first load, less client JS, full-stack features (route handlers, server actions, middleware) and first-class deployment on Vercel or any Node host.`,
      pts: ['React framework', 'App Router = Server Components + layouts', 'Full-stack: route handlers + actions', 'SEO and performance by default'],
      flow: ['Request URL', 'Router matches app folder', 'Server Components render', 'HTML streamed', 'Client components hydrate'],
      code: ['jsx', `// app/page.jsx — the home route "/"
export default function HomePage() {          // a Server Component by default
  return (
    <main>
      <h1>FrontEdge</h1>                      {/* rendered to HTML on the server */}
      <p>Learn every frontend term.</p>
    </main>
  );
}`],
      iq: [['Why choose Next.js over plain React (Vite)?', 'You get routing, SSR/SSG/ISR, server components, data caching, image/font optimisation and backend endpoints out of the box.'],
           ['App Router vs Pages Router?', 'App Router uses React Server Components, nested layouts, streaming and Server Actions; Pages Router uses getServerSideProps/getStaticProps and client components only.']],
      cq: [['Create a new Next.js app.', `npx create-next-app@latest frontedge-next   # prompts: TypeScript, ESLint, Tailwind, App Router
cd frontedge-next && npm run dev             # http://localhost:3000`]],
      err: ['Treating Next.js like a client-only SPA']
    }),
    t('next-project-structure', 'Project Structure & Special Files', 'B', {
      one: 'The app/ directory maps folders to URL segments; special files (page, layout, loading, error, not-found, route, template, default) define each segment’s UI and behaviour.',
      ex: `app/page.js → "/", app/blog/page.js → "/blog". layout.js wraps children and persists across navigation; template.js re-mounts on navigation. loading.js shows an instant Suspense fallback, error.js is an error boundary (client component), not-found.js renders 404s, route.js defines API endpoints, global-error.js catches root errors.

public/ serves static files, next.config.js configures the framework, middleware.ts (proxy) runs before requests. Colocate components and tests inside route folders — only page/route files become public routes.`,
      pts: ['Folders = URL segments', 'page.js makes a route public', 'layout persists, template re-mounts', 'loading/error/not-found per segment'],
      dia: `flowchart TD
  A["app/"] --> L["layout.js (root, required)"]
  A --> P["page.js → /"]
  A --> B["blog/"]
  B --> BL["layout.js"]
  B --> BP["page.js → /blog"]
  B --> S["[slug]/page.js → /blog/:slug"]
  B --> LD["loading.js / error.js"]`,
      code: ['jsx', `// app/layout.jsx — root layout (must render <html> and <body>)
export const metadata = { title: 'FrontEdge', description: 'Frontend syllabus' }; // default SEO
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>FrontEdge</header>        {/* persists across pages */}
        {children}                        {/* the active page */}
      </body>
    </html>
  );
}
// app/blog/loading.jsx — instant fallback while blog pages load
export function Loading() { return <p>Loading posts…</p>; }`],
      iq: [['layout.js vs template.js?', 'Layouts persist state between navigations; templates create a new instance on each navigation.'],
           ['How do you colocate non-route files?', 'Any file other than special files is not routable; use private folders (_components) for clarity.']],
      cq: [['Custom 404 for a segment.', `// app/blog/[slug]/not-found.jsx
export default function NotFound() { return <h2>Post not found</h2>; }
// in page.jsx: import { notFound } from 'next/navigation'; if (!post) notFound();`]],
      err: ['Putting <html> in nested layouts']
    }),
    t('next-routing-navigation', 'Routing & Navigation: Link, useRouter, redirect', 'B', {
      one: 'Navigate with <Link> (prefetching, client-side transitions), programmatically with useRouter (client) or redirect() (server), and read URL state with usePathname/useSearchParams.',
      ex: `<Link href="/learn"> prefetches routes in the viewport (in production) and performs soft navigation keeping layouts mounted. useRouter().push/replace/refresh/back for client navigation; redirect('/login') and permanentRedirect in Server Components/Actions/route handlers.

usePathname for active links, useSearchParams for query strings (wrap in Suspense for static pages), searchParams prop in pages on the server.`,
      pts: ['Link prefetches and soft-navigates', 'useRouter in client components', 'redirect() on the server', 'usePathname for active nav'],
      code: ['jsx', `'use client';                                         // hooks need a client component
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
export function Nav() {
  const pathname = usePathname();                      // e.g. "/learn"
  const router = useRouter();
  return (
    <nav>
      <Link href="/learn" aria-current={pathname === '/learn' ? 'page' : undefined}>Learn</Link> {/* prefetch + soft nav */}
      <button onClick={() => router.push('/mock?level=senior')}>Start mock</button> {/* programmatic */}
    </nav>
  );
}
// Server side: import { redirect } from 'next/navigation'; if (!session) redirect('/login');`],
      iq: [['Why use Link instead of <a>?', 'Link enables client-side navigation without full reloads and prefetches route code/data.'],
           ['Which router import is for the App Router?', 'next/navigation (next/router is for the Pages Router).']],
      cq: [['Update query param from a client component.', `const params = useSearchParams();
const next = new URLSearchParams(params); next.set('page', '2');
router.replace(pathname + '?' + next.toString(), { scroll: false }); // keep scroll position`]],
      err: ['Importing useRouter from next/router in App Router']
    }),
    t('next-dynamic-routes', 'Dynamic Routes, Catch-all & generateStaticParams', 'I', {
      one: 'Folders in brackets create dynamic segments: [slug], catch-all [...slug] and optional catch-all [[...slug]]; generateStaticParams prebuilds known params.',
      ex: `app/term/[id]/page.js receives params.id (params is a Promise in Next 15+, so await it). [...slug] matches /docs/a/b/c as an array. generateStaticParams returns the list of params to render at build time (SSG); others render on demand unless dynamicParams = false (then 404).

Use generateMetadata for per-page SEO based on params.`,
      pts: ['[id] = dynamic segment', '[...slug] = catch-all array', 'params is async in Next 15+', 'generateStaticParams for SSG'],
      code: ['jsx', `// app/term/[id]/page.jsx
export async function generateStaticParams() {             // build-time list
  const terms = await fetch('https://api.example.com/terms').then((r) => r.json());
  return terms.map((t) => ({ id: t.id }));                 // one page per term
}
export async function generateMetadata({ params }) {        // per-page SEO
  const { id } = await params;
  return { title: id + ' | FrontEdge' };
}
export default async function TermPage({ params }) {
  const { id } = await params;                             // await params (Next 15+)
  const term = await fetch('https://api.example.com/terms/' + id).then((r) => r.json());
  return <h1>{term.name}</h1>;
}`],
      iq: [['[...slug] vs [[...slug]]?', 'Catch-all requires at least one segment; optional catch-all also matches the base path with no segments.']],
      cq: [['Return 404 for unknown params.', `export const dynamicParams = false;   // only params from generateStaticParams are allowed`]],
      err: ['Accessing params.id synchronously in Next 15+']
    }),
    t('next-advanced-routing', 'Route Groups, Parallel & Intercepting Routes', 'A', {
      one: 'Advanced App Router features: (groups) organise routes without changing URLs, @slots render parallel routes in one layout, and (.)intercepting routes show a route in a modal while keeping context.',
      ex: `(marketing)/about/page.js → /about; groups can have their own layouts (auth vs dashboard). Parallel routes: @analytics and @team folders become props of the layout and render side by side, each with independent loading/error states; default.js handles unmatched slots.

Intercepting routes ((.)photo/[id]) render a route inside the current layout (e.g. photo modal in a feed) on soft navigation, while a hard refresh shows the full page.`,
      pts: ['(group) does not affect URL', '@slot = parallel route prop', 'default.js for unmatched slots', '(.) intercepts for modals'],
      code: ['jsx', `// app/(dashboard)/layout.jsx — receives parallel slots as props
export default function DashboardLayout({ children, analytics, team }) { // @analytics, @team folders
  return (
    <div className="grid">
      <main>{children}</main>
      <aside>{analytics}</aside>          {/* app/(dashboard)/@analytics/page.jsx */}
      <aside>{team}</aside>               {/* app/(dashboard)/@team/page.jsx */}
    </div>
  );
}
// app/feed/(.)photo/[id]/page.jsx → shows photo in a modal over the feed
// app/photo/[id]/page.jsx          → full page on refresh / direct visit`],
      iq: [['Use case for intercepting routes?', 'Opening an item (photo, product) in a modal with a shareable URL, while direct visits show the full page.']],
      cq: [['Separate layouts for auth pages.', `app/(auth)/login/page.jsx     // uses app/(auth)/layout.jsx (centered card)
app/(app)/dashboard/page.jsx  // uses app/(app)/layout.jsx (sidebar)`]],
      err: ['Missing default.js causing 404 for slots on refresh']
    })
  ),
  m('2. Rendering',
    t('next-server-client-components', 'Server vs Client Components in Next.js', 'B', {
      one: 'In the App Router, components are Server Components by default; add "use client" for interactivity (state, effects, events, browser APIs).',
      ex: `Server Components can be async, access databases and secrets, and ship no JS. Client Components hydrate and handle interaction. Keep client components small "islands" at the leaves; pass server-fetched data to them as props.

You can render Server Components inside Client Components by passing them as children. Use the server-only package to prevent server modules from being imported in client code, and client-only for the reverse.`,
      pts: ['Server by default', '"use client" for interactivity', 'Push client boundaries to leaves', 'server-only package guards secrets'],
      flow: ['Server Component fetches data', 'Renders HTML', 'Client island receives props', 'Hydrates for interaction'],
      code: ['jsx', `// app/learn/page.jsx (server)
import 'server-only';                                   // build error if imported by client code
import { LikeButton } from './LikeButton';
export default async function Learn() {
  const terms = await db.term.findMany({ take: 20 });   // direct DB access, no API needed
  return terms.map((t) => (
    <article key={t.id}><h2>{t.name}</h2><LikeButton id={t.id} initial={t.likes} /></article> // island
  ));
}
// app/learn/LikeButton.jsx
'use client';
import { useState } from 'react';
export function LikeButton({ id, initial }) {
  const [likes, setLikes] = useState(initial);          // client state
  return <button onClick={() => setLikes(likes + 1)}>♥ {likes}</button>;
}`],
      iq: [['What can’t Server Components do?', 'Use state, effects, event handlers, browser APIs or context consumers.'],
           ['How do you keep client bundles small?', 'Mark only interactive leaves with "use client" and keep data fetching in Server Components.']],
      cq: [['Use a client-only library (e.g. a chart) safely.', `import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('./Chart'), { ssr: false }); // from a client component: skip SSR`]],
      err: ['Putting "use client" at the top of the whole app']
    }),
    L('next-rendering'),
    t('next-streaming', 'Streaming & Suspense in Next.js', 'I', {
      one: 'Next.js streams HTML: the shell renders immediately and slow parts arrive later through Suspense boundaries and loading.js.',
      ex: `Wrap slow async Server Components in <Suspense fallback={…}> or add loading.js to a segment; the server sends the fallback first, then streams the component HTML when its data resolves. Users see content sooner (better TTFB/LCP) and can interact with ready parts.

Start independent fetches in parallel (Promise.all or separate Suspense boundaries) to avoid waterfalls.`,
      pts: ['Shell first, slow parts later', 'Suspense or loading.js', 'Parallel boundaries avoid waterfalls', 'Improves perceived performance'],
      flow: ['Request', 'Send shell + fallbacks', 'Data resolves on server', 'Stream component HTML', 'Swap fallback in browser'],
      code: ['jsx', `import { Suspense } from 'react';
export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>                                   {/* sent immediately */}
      <Suspense fallback={<p>Loading stats…</p>}><Stats /></Suspense>      {/* streams later */}
      <Suspense fallback={<p>Loading activity…</p>}><Activity /></Suspense> {/* in parallel */}
    </>
  );
}
async function Stats() {
  const s = await fetch('https://api.example.com/stats', { cache: 'no-store' }).then((r) => r.json()); // slow API
  return <p>{s.users} users</p>;
}`],
      iq: [['How does streaming improve UX?', 'Users see meaningful content immediately instead of waiting for the slowest data source.']],
      cq: [['Avoid sequential fetches in one component.', `const [user, posts] = await Promise.all([getUser(id), getPosts(id)]); // parallel, not two awaits`]],
      err: ['One giant await at the top of the page blocking everything']
    }),
    t('next-runtimes', 'Node.js vs Edge Runtime', 'A', {
      one: 'Routes and middleware can run on the Node.js runtime (full APIs, default) or the Edge runtime (lightweight, globally distributed, limited APIs).',
      ex: `Edge: fast cold starts, runs close to users, Web APIs only (fetch, Request/Response, crypto) — no fs or most Node packages, smaller size limits. Good for middleware, redirects, geolocation personalisation, A/B tests.

Node.js: full ecosystem (database drivers, Prisma, file system), needed for most server work. Set per route: export const runtime = 'edge'. Middleware historically ran on Edge; newer versions support Node.`,
      pts: ['Node = full APIs (default)', 'Edge = fast, limited Web APIs', 'Edge good for middleware/personalisation', 'Many DB drivers need Node'],
      code: ['javascript', `// app/api/geo/route.js
export const runtime = 'edge';                       // run at the edge
export function GET(request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'IN'; // geo header from the platform
  return Response.json({ country, time: Date.now() }); // Web standard Response
}`],
      iq: [['When not to use Edge runtime?', 'When you need Node APIs (fs, native modules), heavy computation or database drivers that require TCP sockets.']],
      cq: [['Force Node runtime for a route using Prisma.', `export const runtime = 'nodejs';   // Prisma needs Node APIs`]],
      err: ['Importing Node-only packages in edge routes']
    })
  ),
  m('3. Data Fetching & Caching',
    t('next-data-fetching', 'Data Fetching in the App Router', 'I', {
      one: 'Fetch data directly in async Server Components with fetch or any server library; client components use TanStack Query/SWR or receive data as props.',
      ex: `Server-side fetching keeps secrets on the server, avoids client waterfalls and sends ready HTML. Identical fetch calls in one render are deduplicated (request memoisation), and React cache() dedupes non-fetch functions (DB queries).

Pass promises to client components and read them with use() for streaming. Avoid calling your own route handlers from Server Components — call the underlying function directly.`,
      pts: ['async Server Components fetch directly', 'Request memoisation dedupes', 'cache() for DB functions', 'Don’t fetch your own API from the server'],
      code: ['jsx', `import { cache } from 'react';
export const getTerm = cache(async (id) => {             // deduped within one request
  return db.term.findUnique({ where: { id } });          // direct DB query
});
export default async function Page({ params }) {
  const { id } = await params;
  const term = await getTerm(id);                        // called here...
  return <><h1>{term.name}</h1><Related id={id} /></>;
}
async function Related({ id }) {
  const term = await getTerm(id);                        // ...and here: only one DB hit
  return <p>{term.related.length} related terms</p>;
}`],
      iq: [['Why not call /api routes from Server Components?', 'It adds an unnecessary HTTP hop; call the data function directly on the server.']],
      cq: [['Stream a promise to a client component.', `// server: <Comments promise={getComments(id)} />  (no await)
'use client';
import { use } from 'react';
export function Comments({ promise }) { const list = use(promise); return list.map((c) => <p key={c.id}>{c.text}</p>); }`]],
      err: ['Fetching in client useEffect when the server could do it']
    }),
    t('next-caching', 'Caching in Next.js (data cache, full route cache, router cache, "use cache")', 'A', {
      one: 'Next.js layers several caches: request memoisation, the Data Cache for fetch results, the Full Route Cache for rendered output and the client Router Cache, plus the newer "use cache" directive.',
      ex: `Defaults changed over versions: in Next 15 fetch is NOT cached by default (opt in with cache: 'force-cache' or next: { revalidate }), and pages using dynamic APIs (cookies, headers, searchParams) render per request. Static pages are cached as HTML + RSC payload (Full Route Cache). The client Router Cache keeps visited segments for fast back/forward.

The "use cache" directive (with cacheLife and cacheTag) caches functions or components explicitly in newer versions with Cache Components. Invalidate with revalidatePath / revalidateTag (on demand) or time-based revalidate. Always check the docs for the version you use.`,
      pts: ['Request memo → Data Cache → Full Route Cache → Router Cache', 'Next 15: fetch uncached by default', 'Dynamic APIs make routes dynamic', 'Invalidate with tags/paths'],
      dia: `flowchart LR
  R["Request"] --> M["Request memoisation (per render)"]
  M --> D["Data Cache (fetch results, persistent)"]
  R --> F["Full Route Cache (HTML + RSC, static routes)"]
  B["Browser"] --> RC["Router Cache (visited segments)"]
  RV["revalidateTag / revalidatePath"] -. invalidates .-> D
  RV -. invalidates .-> F`,
      code: ['jsx', `// cache this fetch for 1 hour and tag it
const terms = await fetch('https://api.example.com/terms', {
  next: { revalidate: 3600, tags: ['terms'] }          // time-based + tag for on-demand invalidation
}).then((r) => r.json());
// always fresh
const live = await fetch('https://api.example.com/stats', { cache: 'no-store' });
// newer explicit caching (Cache Components)
async function getPopularTerms() {
  'use cache';                                          // cache this function's result
  // cacheLife('hours'); cacheTag('terms');
  return db.term.findMany({ orderBy: { views: 'desc' }, take: 10 });
}`],
      iq: [['Why might data look stale in Next.js?', 'It was served from the Data/Full Route/Router cache; revalidate it or opt out with no-store/dynamic rendering.'],
           ['What makes a route dynamic?', 'Using cookies(), headers(), searchParams, uncached fetches, or dynamic = "force-dynamic".']],
      cq: [['Invalidate after an admin edit.', `'use server';
import { revalidateTag } from 'next/cache';
export async function updateTerm(id, data) { await db.term.update({ where: { id }, data }); revalidateTag('terms'); } // refresh tagged data`]],
      err: ['Assuming caching defaults from an older Next.js version']
    }),
    L('next-server-actions'),
    t('next-forms-mutations', 'Forms & Mutations with Server Actions', 'I', {
      one: 'Handle form submissions with Server Actions plus useActionState for errors/pending state, useFormStatus for buttons and useOptimistic for instant UI.',
      ex: `Pattern: define 'use server' action → validate with Zod → check auth → mutate DB → revalidatePath/Tag → return state or redirect. In the client form, useActionState(action, initial) gives [state, formAction, isPending]. Forms work before JS loads (progressive enhancement) when the action is passed directly to <form action>.

Return field errors instead of throwing for expected validation failures.`,
      pts: ['Validate + authorise in the action', 'useActionState for errors', 'revalidate after mutation', 'Progressive enhancement'],
      flow: ['Form submits FormData', 'Server Action validates and saves', 'revalidatePath refreshes data', 'Returns state or redirects', 'UI shows result'],
      code: ['jsx', `// app/feedback/actions.js
'use server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
const Schema = z.object({ message: z.string().min(10, 'Please write at least 10 characters') });
export async function sendFeedback(prev, formData) {
  const parsed = Schema.safeParse({ message: formData.get('message') }); // validate input
  if (!parsed.success) return { error: parsed.error.issues[0].message };  // expected error → state
  await db.feedback.create({ data: parsed.data });                         // save
  revalidatePath('/feedback');                                             // refresh list
  return { ok: true };
}
// app/feedback/Form.jsx
'use client';
import { useActionState } from 'react';
import { sendFeedback } from './actions';
export function FeedbackForm() {
  const [state, action, pending] = useActionState(sendFeedback, {});
  return <form action={action}><textarea name="message" /><button disabled={pending}>Send</button>{state.error && <p role="alert">{state.error}</p>}</form>;
}`],
      iq: [['How do Server Actions support progressive enhancement?', 'The form posts to the action endpoint natively, so it works without JavaScript; with JS it is enhanced to client-side transitions.']],
      cq: [['Pending-aware submit button.', `'use client';
import { useFormStatus } from 'react-dom';
export function Submit() { const { pending } = useFormStatus(); return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>; } // reads parent form`]],
      err: ['No auth check inside actions']
    }),
    t('next-route-handlers', 'Route Handlers (API routes)', 'I', {
      one: 'route.js files export HTTP method functions (GET, POST, PUT, DELETE) using Web Request/Response APIs to build API endpoints inside the app directory.',
      ex: `Use them for webhooks (Stripe, GitHub), public APIs for mobile apps, OAuth callbacks, file downloads, streaming (AI chat) and endpoints called from client components. Read JSON with await request.json(), query with request.nextUrl.searchParams, cookies/headers via next/headers.

GET handlers can be static (cached) when they don't use dynamic APIs. A route.js cannot sit next to page.js in the same segment.`,
      pts: ['Export GET/POST/... functions', 'Web Request/Response', 'Webhooks, mobile APIs, streaming', 'Not in the same folder as page.js'],
      code: ['javascript', `// app/api/terms/route.js
import { NextResponse } from 'next/server';
export async function GET(request) {
  const q = request.nextUrl.searchParams.get('q') ?? '';          // query string
  const results = await searchTerms(q);                            // your data function
  return NextResponse.json(results, { headers: { 'Cache-Control': 's-maxage=60' } }); // CDN cache 60s
}
export async function POST(request) {
  const body = await request.json();                               // parse JSON body
  if (!body.name) return NextResponse.json({ error: 'name required' }, { status: 400 }); // validate
  const term = await createTerm(body);                             // save
  return NextResponse.json(term, { status: 201 });                 // created
}`],
      iq: [['Route handlers vs Server Actions?', 'Actions are for mutations from your own UI; route handlers are general HTTP endpoints for any client, webhooks or streaming.']],
      cq: [['Verify a webhook signature.', `export async function POST(req) {
  const raw = await req.text();                                     // raw body needed for signatures
  const ok = verifySignature(raw, req.headers.get('x-signature'));  // HMAC check
  if (!ok) return new Response('Invalid signature', { status: 401 });
  await handleEvent(JSON.parse(raw)); return new Response('ok');
}`]],
      err: ['Calling your own route handler from Server Components']
    })
  ),
  m('4. Optimisation & SEO',
    t('next-image', 'next/image: Image Optimisation', 'B', {
      one: 'The <Image> component automatically resizes, converts (AVIF/WebP), lazy-loads and reserves space for images to prevent layout shift.',
      ex: `Required: src, alt and width/height (or fill with a sized parent). It generates srcset and sizes so devices download appropriately sized files. Use priority (or preload/fetchPriority in newer versions) for the LCP image. Remote images need images.remotePatterns in next.config. placeholder="blur" shows a blurred preview.`,
      pts: ['Auto srcset + modern formats', 'width/height or fill', 'priority for the LCP image', 'remotePatterns for external hosts'],
      code: ['jsx', `import Image from 'next/image';
import hero from './hero.jpg';                     // static import gives width/height/blur
export function Hero() {
  return (
    <Image
      src={hero}                                   // local image
      alt="Developer learning on a laptop"         // required alt
      priority                                     // preload: this is the LCP image
      placeholder="blur"                           // blurred preview while loading
      sizes="(max-width: 768px) 100vw, 50vw"       // how wide it renders
    />
  );
}
// next.config.js → images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }] }`],
      iq: [['What does next/image optimise?', 'Resizing per device, modern formats, lazy loading, size reservation (CLS) and caching via the image optimiser.']],
      cq: [['Cover-fill a card image.', `<div style={{ position: 'relative', aspectRatio: '4/3' }}>
  <Image src={url} alt={title} fill sizes="300px" style={{ objectFit: 'cover' }} /> {/* fill parent */}
</div>`]],
      err: ['Lazy-loading the hero image']
    }),
    t('next-font-script', 'next/font & next/script', 'I', {
      one: 'next/font self-hosts Google or local fonts with zero layout shift; next/script loads third-party scripts with strategies (beforeInteractive, afterInteractive, lazyOnload, worker).',
      ex: `next/font downloads fonts at build time, serves them from your domain (no Google requests, better privacy), and adds size-adjusted fallbacks to avoid CLS. Expose them as CSS variables for Tailwind.

next/script controls when analytics, chat widgets or tag managers load: afterInteractive (default), lazyOnload (idle), beforeInteractive (critical, root layout only).`,
      pts: ['Self-hosted fonts, no CLS', 'Font variables for CSS/Tailwind', 'Script strategies control timing', 'lazyOnload for non-critical widgets'],
      code: ['jsx', `import { Inter, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' }); // self-hosted
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable + ' ' + mono.variable}>  {/* CSS variables */}
      <body>
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" strategy="afterInteractive" /> {/* analytics */}
        <Script src="https://widget.example.com/chat.js" strategy="lazyOnload" />                        {/* idle */}
      </body>
    </html>
  );
}`],
      iq: [['Why use next/font instead of a Google Fonts <link>?', 'Fonts are self-hosted, preloaded with fallback metrics (no CLS) and there are no external requests.']],
      cq: [['Run code after a script loads.', `<Script src="/maps.js" onLoad={() => initMap()} /> {/* client component callback */}`]],
      err: ['Loading many font weights']
    }),
    t('next-metadata-seo', 'Metadata API, Sitemaps, Robots & OG Images', 'I', {
      one: 'Export metadata or generateMetadata from layouts/pages for titles and social tags; add sitemap.js, robots.js and opengraph-image files for SEO.',
      ex: `Static: export const metadata = { title, description, openGraph, alternates: { canonical } }. Dynamic: export async function generateMetadata({ params }). Title templates in the root layout: title: { template: '%s | FrontEdge', default: 'FrontEdge' }.

app/sitemap.js returns URLs, app/robots.js returns rules, opengraph-image.jsx generates social images with ImageResponse. JSON-LD can be rendered as a script tag in the page.`,
      pts: ['metadata / generateMetadata', 'Title templates', 'sitemap.js and robots.js', 'Generated OG images'],
      code: ['jsx', `// app/layout.jsx
export const metadata = {
  metadataBase: new URL('https://frontedge.app'),            // base for relative URLs
  title: { template: '%s | FrontEdge', default: 'FrontEdge' }, // per-page titles fill %s
  openGraph: { siteName: 'FrontEdge', type: 'website' }
};
// app/sitemap.js
export default async function sitemap() {
  const terms = await getAllTermIds();
  return terms.map((id) => ({ url: 'https://frontedge.app/term/' + id, changeFrequency: 'weekly' })); // one entry per term
}
// app/robots.js
export default function robots() {
  return { rules: { userAgent: '*', allow: '/', disallow: '/admin' }, sitemap: 'https://frontedge.app/sitemap.xml' };
}`],
      iq: [['How do you set different titles per page?', 'Export metadata.title or generateMetadata in each page; a title template in the layout formats them.']],
      cq: [['Canonical URL for a dynamic page.', `export async function generateMetadata({ params }) {
  const { id } = await params;
  return { alternates: { canonical: '/term/' + id } }; // resolved with metadataBase
}`]],
      err: ['Client-side document.title for SEO']
    }),
    t('next-bundle-performance', 'Performance & Bundle Optimisation in Next.js', 'A', {
      one: 'Keep Next.js apps fast: minimise client components, lazy-load heavy client code with next/dynamic, analyse bundles, cache data and use streaming/PPR.',
      ex: `Every "use client" boundary adds JS — keep it small. next/dynamic lazy-loads heavy components (charts, editors, maps). @next/bundle-analyzer shows what ships. optimizePackageImports helps tree-shake icon/UI libraries. Avoid importing large libraries in shared layouts.

Use Server Components for data, cache expensive work, stream slow parts, prefer next/image and next/font, and monitor Core Web Vitals (Speed Insights / useReportWebVitals).`,
      pts: ['Fewer, smaller client components', 'next/dynamic for heavy widgets', 'Bundle analyzer', 'Monitor Web Vitals'],
      code: ['jsx', `'use client';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('./CodeEditor'), {   // separate chunk
  ssr: false,                                            // browser-only library
  loading: () => <p>Loading editor…</p>                  // placeholder
});
export function Playground({ show }) {
  return show ? <Editor /> : <button>Open editor</button>; // only downloaded when shown
}
// next.config.js → experimental: { optimizePackageImports: ['lucide-react'] }`],
      iq: [['How do you find what makes a Next.js bundle large?', 'Run @next/bundle-analyzer (or the built-in analyzer) and inspect client chunks.']],
      cq: [['Report Web Vitals.', `'use client';
import { useReportWebVitals } from 'next/web-vitals';
export function Vitals() { useReportWebVitals((m) => navigator.sendBeacon('/vitals', JSON.stringify(m))); return null; }`]],
      err: ['Huge client providers wrapping the entire app']
    })
  ),
  m('5. Advanced & Production',
    t('next-middleware', 'Middleware (Proxy): auth, redirects, i18n, A/B tests', 'I', {
      one: 'middleware.ts (renamed proxy in newer versions) runs before a request completes, letting you rewrite, redirect, set headers/cookies or block requests.',
      ex: `Use for: redirecting unauthenticated users, locale detection, A/B test bucketing via cookies, bot protection, geolocation-based rewrites and adding security headers. Limit it with a matcher config so it doesn't run on static assets.

Keep it fast and lightweight (it runs on every matched request); do real authorisation checks again near the data (Server Components/Actions) — middleware alone is not a security boundary.`,
      pts: ['Runs before routing', 'Redirect / rewrite / headers', 'matcher limits scope', 'Not the only auth check'],
      flow: ['Request arrives', 'Middleware checks cookie/geo', 'Redirect, rewrite or continue', 'Route renders'],
      code: ['typescript', `// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
export function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;             // read cookie
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const url = new URL('/login', req.url);                      // build redirect URL
    url.searchParams.set('next', req.nextUrl.pathname);          // remember destination
    return NextResponse.redirect(url);                           // send to login
  }
  const res = NextResponse.next();                               // continue
  if (!req.cookies.get('ab')) res.cookies.set('ab', Math.random() < 0.5 ? 'A' : 'B'); // A/B bucket
  return res;
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }; // skip assets`],
      iq: [['Is middleware enough to secure data?', 'No — always verify authorisation where data is read or mutated; middleware can be bypassed by misconfigured matchers.']],
      cq: [['Rewrite to a localized path.', `const lang = req.headers.get('accept-language')?.startsWith('hi') ? 'hi' : 'en';
return NextResponse.rewrite(new URL('/' + lang + req.nextUrl.pathname, req.url)); // URL unchanged for user`]],
      err: ['Heavy DB queries in middleware']
    }),
    t('next-auth', 'Authentication in Next.js (Auth.js, sessions, protection)', 'I', {
      one: 'Implement login with libraries like Auth.js (NextAuth), Clerk or Better Auth, store sessions in secure cookies, and protect pages, actions and route handlers.',
      ex: `Typical setup: OAuth providers (Google, GitHub) or credentials, a session strategy (JWT cookie or database sessions), a helper to read the session on the server (auth()), middleware for coarse redirects, and per-request authorisation checks in Server Components, Server Actions and route handlers.

Store tokens in HttpOnly cookies, never in localStorage. Add CSRF protection (built into Auth.js), role-based checks and session expiry.`,
      pts: ['Auth library over hand-rolled', 'HttpOnly session cookies', 'Check auth in every action/handler', 'Middleware for redirects only'],
      code: ['typescript', `// auth.ts (Auth.js v5)
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [GitHub] }); // config
// app/api/auth/[...nextauth]/route.ts
// export const { GET, POST } = handlers;
// app/dashboard/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
export default async function Dashboard() {
  const session = await auth();                       // read session on the server
  if (!session) redirect('/login');                   // protect the page
  return <h1>Welcome {session.user?.name}</h1>;
}`],
      iq: [['Where must authorisation be checked?', 'Wherever data is accessed or changed: Server Components, Server Actions, route handlers — not just in the UI or middleware.']],
      cq: [['Protect a Server Action.', `'use server';
export async function deleteTerm(id: string) {
  const session = await auth();
  if (session?.user?.role !== 'admin') throw new Error('Forbidden');  // authorise
  await db.term.delete({ where: { id } });
}`]],
      err: ['Hiding buttons as the only protection']
    }),
    t('next-config-env', 'next.config, Environment Variables, Redirects & Headers', 'I', {
      one: 'next.config.js configures images, redirects, rewrites, headers, output and experimental flags; environment variables are server-only unless prefixed NEXT_PUBLIC_.',
      ex: `.env.local holds secrets for development (never committed). process.env.DB_URL is available only on the server; NEXT_PUBLIC_ variables are inlined into the client bundle at build time (so changing them needs a rebuild). Set production variables in your host (Vercel dashboard).

redirects() for moved pages (SEO 301/308), rewrites() to proxy paths (avoid CORS), headers() for security headers like CSP.`,
      pts: ['NEXT_PUBLIC_ = exposed to browser', 'Secrets stay server-only', 'redirects / rewrites / headers', 'Public vars inlined at build'],
      code: ['javascript', `// next.config.js
module.exports = {
  images: { remotePatterns: [{ protocol: 'https', hostname: 'images.example.com' }] }, // allowed image hosts
  async redirects() {
    return [{ source: '/docs/:path*', destination: '/learn/:path*', permanent: true }]; // 308 redirect
  },
  async rewrites() {
    return [{ source: '/api/proxy/:path*', destination: 'https://api.example.com/:path*' }]; // same-origin proxy
  },
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'DENY' }] }]; // security header
  }
};
// .env.local → DATABASE_URL=... (server)   NEXT_PUBLIC_SITE_NAME=FrontEdge (client)`],
      iq: [['Why might NEXT_PUBLIC_ changes not appear?', 'They are inlined at build time; you must rebuild/redeploy.']],
      cq: [['Use a server secret safely.', `// app/api/ai/route.js — process.env.GROQ_API_KEY is only available on the server
const key = process.env.GROQ_API_KEY;   // never prefix secrets with NEXT_PUBLIC_`]],
      err: ['Putting API keys in NEXT_PUBLIC_ variables']
    }),
    t('next-i18n', 'Internationalisation in the App Router', 'I', {
      one: 'Build multilingual Next.js apps with a [locale] segment, middleware-based locale detection, dictionaries loaded on the server and hreflang metadata.',
      ex: `Structure: app/[lang]/page.js; middleware reads Accept-Language or a cookie and redirects to /hi or /en; a getDictionary(lang) server function imports JSON per locale (only the needed locale ships). Libraries: next-intl, i18next. Generate static params for each locale and set alternates.languages in metadata.`,
      pts: ['[lang] route segment', 'Detect locale in middleware', 'Server-loaded dictionaries', 'hreflang alternates'],
      code: ['jsx', `// app/[lang]/dictionaries.js
import 'server-only';
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((m) => m.default),   // lazy per locale
  hi: () => import('./dictionaries/hi.json').then((m) => m.default)
};
export const getDictionary = (lang) => dictionaries[lang]();
// app/[lang]/page.jsx
export async function generateStaticParams() { return [{ lang: 'en' }, { lang: 'hi' }]; } // prebuild both
export default async function Home({ params }) {
  const { lang } = await params;
  const t = await getDictionary(lang);                                  // only this locale's strings
  return <h1>{t.home.title}</h1>;
}`],
      iq: [['How do you avoid shipping all translations to the client?', 'Load dictionaries on the server per locale and pass only needed strings to client components.']],
      cq: [['hreflang alternates in metadata.', `export const metadata = { alternates: { languages: { en: '/en', hi: '/hi' } } }; // SEO alternates`]],
      err: ['Bundling every language into client JS']
    }),
    t('next-deployment', 'Deploying Next.js (Vercel, Node, static export, Docker)', 'I', {
      one: 'Deploy Next.js to Vercel (zero-config), any Node server (next start / output: "standalone"), containers (Docker), or as static files (output: "export") with limited features.',
      ex: `Vercel handles ISR, image optimisation, edge middleware, preview deployments per branch and environment variables. Self-hosting: output: 'standalone' produces a minimal Node server for Docker; configure caching (shared cache handler for multiple instances) and image optimisation.

Static export (output: 'export') produces HTML/CSS/JS for any static host (S3, GitHub Pages) but no server features (no SSR on request, actions, middleware, image optimisation by default).`,
      pts: ['Vercel = zero config', 'standalone output for Docker', 'Static export = no server features', 'Set env vars per environment'],
      code: ['dockerfile', `# Dockerfile (Next.js standalone)
FROM node:22-alpine AS build          # build stage
WORKDIR /app
COPY package*.json ./
RUN npm ci                            # install exact deps
COPY . .
RUN npm run build                     # next.config.js has output: 'standalone'
FROM node:22-alpine                   # small runtime image
WORKDIR /app
COPY --from=build /app/.next/standalone ./        # minimal server + deps
COPY --from=build /app/.next/static ./.next/static # static assets
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]             # start the app`],
      iq: [['What features are lost with static export?', 'On-demand SSR, Server Actions, route handlers with dynamic behaviour, middleware, ISR and default image optimisation.']],
      cq: [['Deploy from CLI to Vercel production.', `npx vercel --prod          # build and deploy current folder`]],
      err: ['Using output: export and expecting API routes to work']
    }),
    t('next-pages-router', 'Pages Router (legacy): getServerSideProps, getStaticProps, _app', 'I', {
      one: 'The original Next.js router: files in pages/ become routes, with getStaticProps (SSG), getStaticPaths, getServerSideProps (SSR) and API routes in pages/api.',
      ex: `Many production apps still use it. Data functions run on the server and pass props to the page component; revalidate in getStaticProps enables ISR. _app.js wraps all pages (global CSS, providers); _document.js customises <html>. Routing uses next/router.

Migration to the App Router can be incremental: both directories can coexist.`,
      pts: ['pages/ = routes', 'getStaticProps / getServerSideProps', '_app and _document', 'Can coexist with app/'],
      code: ['jsx', `// pages/term/[id].jsx
export async function getStaticPaths() {                       // which ids to prebuild
  const ids = await getPopularIds();
  return { paths: ids.map((id) => ({ params: { id } })), fallback: 'blocking' }; // others built on demand
}
export async function getStaticProps({ params }) {              // runs at build / revalidation
  const term = await getTerm(params.id);
  if (!term) return { notFound: true };                         // 404
  return { props: { term }, revalidate: 3600 };                 // ISR every hour
}
export default function TermPage({ term }) {                    // receives props
  return <h1>{term.name}</h1>;
}`],
      iq: [['getStaticProps vs getServerSideProps?', 'getStaticProps runs at build time (and on revalidation); getServerSideProps runs on every request.'],
           ['Can you migrate gradually to App Router?', 'Yes — pages/ and app/ can coexist; move routes one at a time.']],
      cq: [['API route in Pages Router.', `// pages/api/hello.js
export default function handler(req, res) { res.status(200).json({ hello: 'world' }); } // Node-style req/res`]],
      err: ['Mixing next/router and next/navigation APIs']
    }),
    t('next-turbopack-testing', 'Turbopack, Testing & Debugging Next.js', 'I', {
      one: 'Turbopack is Next.js’s Rust-based bundler for fast dev and builds; test Next.js apps with Vitest/Jest + Testing Library and Playwright; debug with server logs and DevTools.',
      ex: `next dev --turbopack (default in newer versions) gives fast startup and HMR. Unit-test client components with Testing Library; async Server Components are best covered with E2E tests (Playwright) because test runners don't fully support them yet. Mock data functions, not fetch internals.

Debug: server console for Server Components/Actions, browser DevTools for client, NODE_OPTIONS=--inspect for breakpoints, React DevTools for component trees.`,
      pts: ['Turbopack for fast dev/builds', 'Unit-test client components', 'E2E for Server Components', 'Server logs vs browser logs'],
      code: ['typescript', `// e2e/term.spec.ts — Playwright test against the running app
import { test, expect } from '@playwright/test';
test('term page shows definition and code', async ({ page }) => {
  await page.goto('/term/js-closures');                        // navigate
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Closures'); // server-rendered heading
  await page.getByRole('tab', { name: 'Code' }).click();       // client interaction
  await expect(page.locator('pre')).toBeVisible();             // code appears
});`],
      iq: [['Why can’t you easily unit-test async Server Components?', 'Test renderers do not fully support async components and server-only APIs yet, so E2E tests are recommended.']],
      cq: [['Enable Turbopack for dev.', `"scripts": { "dev": "next dev --turbopack" }   // package.json`]],
      err: ['Looking for Server Component logs in the browser console']
    })
  )
];
