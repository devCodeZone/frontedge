// frameworks.js — TypeScript, Angular, Next.js, Vue terms

export default [
  {
    id: 'ts-generics', cat: 'typescript', name: 'Generics', level: 'Intermediate',
    oneLiner: 'Type parameters that let one function, class or type work with many types while keeping full type safety.',
    explanation: `A generic is a placeholder type (by convention T, K, V) filled in when the code is used. Instead of losing information with any, generics carry the exact type through: identity<string>('a') returns string.

Constraints (T extends { id: string }) restrict which types are allowed. Defaults (T = unknown) provide a fallback. Generics are everywhere in frontend: useState<User | null>, Promise<T>, Array<T>, Angular's HttpClient.get<T>(), React component props, API response wrappers.`,
    diagram: `flowchart LR
  D["function first of T: takes T array, returns T"] --> C1["first([1,2]) → T = number"]
  D --> C2["first(['a']) → T = string"]
  D --> C3["first(users) → T = User"]`,
    code: { lang: 'typescript', src: `interface ApiResponse<T> {                       // generic interface: T = shape of 'data'
  data: T;                                       // payload typed by the caller
  error: string | null;                          // union type: a message or null
}                                                // end interface

async function getJson<T>(url: string): Promise<ApiResponse<T>> { // T flows into the return type
  try {                                          // network can fail
    const res = await fetch(url);                // standard fetch
    const data = (await res.json()) as T;        // 'as T' asserts the parsed JSON shape
    return { data, error: null };                // success object
  } catch (e) {                                  // any error
    return { data: null as unknown as T, error: String(e) }; // keep the type contract
  }                                              // end try/catch
}                                                // end getJson

interface User { id: number; name: string }      // a concrete type
const res = await getJson<User[]>('/api/users'); // T = User[]
res.data[0].name;                                // fully typed: editor autocompletes .name

function pluck<T, K extends keyof T>(obj: T, key: K): T[K] { // K must be a key of T
  return obj[key];                               // return type is the type of that property
}                                                // end pluck
pluck({ id: 1, name: 'A' }, 'name');             // returns string; 'age' would be a compile error` },
    interview: [
      { q: 'Why generics instead of any?', a: 'any disables type checking; generics keep the relationship between input and output types so errors are caught at compile time.' },
      { q: 'What does K extends keyof T mean?', a: 'K is constrained to the union of T\'s property names, so only valid keys can be passed.' },
      { q: 'What is unknown vs any?', a: 'unknown is the type-safe top type: you must narrow it before use. any opts out of checking entirely.' }
    ],
    coding: [
      { q: 'Write a generic useFetch hook signature in React + TS.', a: `function useFetch<T>(url: string) {                       // T = expected response shape
  const [data, setData] = useState<T | null>(null);          // state typed with the generic
  const [error, setError] = useState<Error | null>(null);    // error state
  useEffect(() => {                                          // fetch on url change
    fetch(url).then((r) => r.json() as Promise<T>).then(setData).catch(setError); // typed chain
  }, [url]);                                                 // dependency
  return { data, error };                                    // inferred return type
}                                                            // end useFetch` }
    ],
    roadmap: ['Basic types', 'Interfaces & type aliases', 'Generics', 'Constraints & keyof', 'Utility types', 'Conditional & mapped types'],
    related: ['ts-utility-types', 'js-prototypes']
  },
  {
    id: 'ts-utility-types', cat: 'typescript', name: 'Utility, Mapped & Conditional Types', level: 'Advanced',
    oneLiner: 'Built-in and custom type transformers (Partial, Pick, Omit, Record, ReturnType…) that derive new types from existing ones.',
    explanation: `Utility types avoid duplicating type definitions. Partial<T> makes all props optional (great for update payloads), Required<T> the opposite, Pick/Omit select or drop props, Record<K, V> builds dictionaries, Readonly<T> freezes, ReturnType/Parameters extract function signatures, Awaited<T> unwraps promises, NonNullable removes null/undefined.

Under the hood they are mapped types ({ [K in keyof T]?: T[K] }) and conditional types (T extends U ? X : Y), often with infer to capture parts of a type. The satisfies operator (TS 4.9+) checks a value matches a type without widening it.`,
    diagram: `flowchart LR
  U["User: id, name, email"] --> P["Partial of User: all optional"]
  U --> PK["Pick of User, name: only name"]
  U --> O["Omit of User, email: id, name"]
  U --> R["Readonly of User: cannot reassign"]`,
    code: { lang: 'typescript', src: `interface User { id: number; name: string; email: string } // base type

type UserUpdate = Partial<Omit<User, 'id'>>;   // id can't change; other fields optional
const patch: UserUpdate = { name: 'New' };     // valid: email omitted is fine

type Roles = 'admin' | 'dev' | 'qa';           // string literal union
const perms: Record<Roles, string[]> = {       // dictionary with EXACT keys
  admin: ['all'], dev: ['code'], qa: ['test']  // missing a role would be an error
};                                             // end perms

type MyPartial<T> = { [K in keyof T]?: T[K] }; // mapped type: how Partial is built

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T; // conditional + infer
type A = UnwrapPromise<Promise<number>>;       // number

const config = { theme: 'dark', retries: 3 } satisfies Record<string, string | number>; // checked, not widened
config.retries.toFixed();                       // still known as number thanks to satisfies` },
    interview: [
      { q: 'Omit vs Exclude?', a: 'Omit removes keys from an object type; Exclude removes members from a union type.' },
      { q: 'What is infer?', a: 'A keyword in conditional types that captures a type into a variable, e.g. extracting the resolved type of a Promise.' },
      { q: 'What does satisfies do?', a: 'Validates that an expression matches a type while keeping its most specific inferred type.' }
    ],
    coding: [
      { q: 'Create a DeepReadonly<T> type.', a: `type DeepReadonly<T> = {                          // mapped type over every key
  readonly [K in keyof T]: T[K] extends object     // is the property an object?
    ? DeepReadonly<T[K]>                           // yes → recurse
    : T[K];                                        // no → keep primitive type
};                                                 // end DeepReadonly` }
    ],
    roadmap: ['keyof & indexed access', 'Built-in utility types', 'Mapped types', 'Conditional types', 'infer', 'Template literal types'],
    related: ['ts-generics']
  },
  {
    id: 'angular-signals', cat: 'angular', name: 'Signals, computed & effect', level: 'Intermediate', version: 'Angular 17–20',
    oneLiner: 'Angular\'s fine-grained reactive primitive: a value wrapper that notifies exactly the views and computations that read it.',
    explanation: `signal(initial) creates a writable signal; read it by calling it (count()), update with set() or update(). computed() derives a read-only signal that recalculates lazily when its dependencies change. effect() runs side effects when signals it reads change.

Signals let Angular know precisely what changed, enabling zoneless change detection (stable in Angular 20) — no more Zone.js patching every async API. Signal-based APIs now include input(), output(), model(), viewChild(), linkedSignal() and resource()/httpResource() for async data.

RxJS is still valuable for event streams; toSignal() and toObservable() bridge the two.`,
    diagram: `flowchart LR
  S["signal: price"] --> C["computed: total = price × qty"]
  Q["signal: qty"] --> C
  C --> V["Template reads total()"]
  C --> E["effect: save to localStorage"]
  V --> CD["Only this view re-renders"]`,
    code: { lang: 'typescript', src: `import { Component, computed, effect, signal } from '@angular/core'; // signal APIs

@Component({                                        // decorator turns the class into a component
  selector: 'app-cart',                             // HTML tag name: <app-cart>
  standalone: true,                                 // no NgModule needed (default from v19)
  template: \`
    <p>Qty: {{ qty() }} | Total: ₹{{ total() }}</p>
    <button (click)="add()">Add one</button>
  \`                                                // template reads signals by calling them
})                                                  // end decorator
export class CartComponent {                        // component class
  price = signal(499);                              // writable signal with initial value 499
  qty = signal(1);                                  // another writable signal
  total = computed(() => this.price() * this.qty());// derived, cached, recalculates only when inputs change

  constructor() {                                   // effects must be created in an injection context
    effect(() => {                                  // runs once now, then whenever qty() changes
      console.log('Cart quantity is', this.qty());  // side effect (logging, storage, analytics)
    });                                             // end effect
  }                                                 // end constructor

  add() {                                           // click handler
    this.qty.update((q) => q + 1);                  // update() receives the current value
  }                                                 // end add
}                                                   // end class` },
    interview: [
      { q: 'Signals vs RxJS Observables?', a: 'Signals are synchronous, always have a current value and are ideal for UI state. Observables model streams over time (events, websockets) with rich operators. Use both, bridged by toSignal/toObservable.' },
      { q: 'What is zoneless change detection?', a: 'Running Angular without Zone.js; change detection is triggered by signals, events and markForCheck, giving smaller bundles and better performance.' },
      { q: 'What is linkedSignal?', a: 'A writable signal whose value resets based on a source signal — e.g. a selected item that resets when the list changes.' },
      { q: 'What is the new control flow?', a: '@if, @for (with required track) and @switch blocks replacing *ngIf/*ngFor, plus @defer for lazy-loading template parts.' }
    ],
    coding: [
      { q: 'Convert an HTTP observable to a signal.', a: `import { toSignal } from '@angular/core/rxjs-interop'; // bridge helper
users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] }); // subscribes & unsubscribes automatically
// template: @for (u of users(); track u.id) { <li>{{ u.name }}</li> }` }
    ],
    roadmap: ['Components & templates', 'Change detection & Zone.js', 'signal / computed / effect', 'Signal inputs & model()', 'resource() / httpResource()', 'Zoneless apps'],
    related: ['angular-rxjs', 'angular-di']
  },
  {
    id: 'angular-rxjs', cat: 'angular', name: 'RxJS Observables & Operators', level: 'Intermediate',
    oneLiner: 'A library for composing async event streams using Observables and pipeable operators like map, switchMap and debounceTime.',
    explanation: `An Observable is a lazy stream that can emit many values over time; nothing happens until you subscribe. Operators are pure functions combined with pipe().

Must-know flattening operators: switchMap (cancel previous inner request — search boxes), mergeMap (run all in parallel), concatMap (queue in order — saving forms), exhaustMap (ignore new until current finishes — login button).

Subjects are both observer and observable; BehaviorSubject holds a current value. Always unsubscribe (async pipe, takeUntilDestroyed) to avoid leaks.`,
    diagram: `flowchart LR
  I["input keystrokes"] --> D["debounceTime 300"]
  D --> DU["distinctUntilChanged"]
  DU --> SW["switchMap → http.get"]
  SW --> R["results rendered via async pipe"]
  SW -. "new term cancels old request" .-> SW`,
    code: { lang: 'typescript', src: `import { Component, inject } from '@angular/core';          // DI helper
import { HttpClient } from '@angular/common/http';         // HTTP service
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // reactive input
import { AsyncPipe } from '@angular/common';               // subscribes in the template
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs'; // operators

@Component({                                                // component metadata
  selector: 'app-search', standalone: true,                 // tag + standalone
  imports: [ReactiveFormsModule, AsyncPipe],                // template dependencies
  template: \`<input [formControl]="q" />
    @for (r of results$ | async; track r.id) { <p>{{ r.name }}</p> }\`
})                                                          // end metadata
export class SearchComponent {                              // class
  private http = inject(HttpClient);                        // inject() instead of constructor params
  q = new FormControl('', { nonNullable: true });           // the search box control
  results$ = this.q.valueChanges.pipe(                      // stream of typed values
    debounceTime(300),                                      // wait for a 300 ms pause in typing
    distinctUntilChanged(),                                 // skip if the text did not change
    filter((t) => t.length > 1),                            // ignore 0–1 character queries
    switchMap((t) => this.http.get<any[]>('/api/search?q=' + t)) // cancel old request, start new
  );                                                        // async pipe subscribes/unsubscribes
}                                                           // end class` },
    interview: [
      { q: 'switchMap vs mergeMap vs concatMap vs exhaustMap?', a: 'switchMap cancels previous; mergeMap runs concurrently; concatMap queues sequentially; exhaustMap ignores new emissions while busy.' },
      { q: 'Cold vs hot observable?', a: 'Cold starts producing per subscriber (HTTP call). Hot shares one producer among subscribers (DOM events, Subjects, shareReplay).' },
      { q: 'How do you avoid memory leaks with subscriptions?', a: 'Use the async pipe, takeUntilDestroyed(), toSignal(), or unsubscribe in ngOnDestroy.' }
    ],
    coding: [
      { q: 'Prevent double login submissions.', a: `loginClicks$.pipe(                       // stream of button clicks
  exhaustMap(() => this.auth.login(form)) // ignore clicks while a login request is in flight
).subscribe();                            // start listening` }
    ],
    roadmap: ['Observables & subscribe', 'Operators & pipe', 'Flattening operators', 'Subjects', 'Error handling (catchError, retry)', 'Interop with signals'],
    related: ['angular-signals', 'js-debounce-throttle']
  },
  {
    id: 'angular-di', cat: 'angular', name: 'Dependency Injection & Interceptors', level: 'Intermediate',
    oneLiner: 'Angular creates and supplies service instances for you through hierarchical injectors; interceptors hook into every HTTP request.',
    explanation: `Instead of creating dependencies with new, a class declares what it needs and Angular's injector provides it. providedIn: 'root' makes a tree-shakable singleton. Providers can be scoped to a component, route or environment injector.

The inject() function (instead of constructor parameters) works in components, services, guards and functional interceptors. InjectionToken lets you inject non-class values like config.

Functional HTTP interceptors (withInterceptors) are the modern way to add auth headers, handle 401 refresh logic, log, or show loaders globally.`,
    diagram: `flowchart TD
  R["Root injector: AuthService singleton"] --> RT["Route injector"]
  RT --> C1["Component A"]
  RT --> C2["Component B: own provider → own instance"]
  H["HttpClient request"] --> I1["authInterceptor adds token"]
  I1 --> I2["errorInterceptor handles 401"]
  I2 --> S["Server"]`,
    code: { lang: 'typescript', src: `import { HttpInterceptorFn } from '@angular/common/http'; // type for functional interceptors
import { inject } from '@angular/core';                    // DI function
import { AuthService } from './auth.service';             // our token store

export const authInterceptor: HttpInterceptorFn = (req, next) => { // runs for every request
  const token = inject(AuthService).token();               // get the current token (a signal)
  if (!token) return next(req);                            // no token → pass through unchanged
  const authReq = req.clone({                              // requests are immutable → clone
    setHeaders: { Authorization: 'Bearer ' + token }       // add the auth header
  });                                                      // end clone
  return next(authReq);                                    // continue the chain
};                                                         // end interceptor

// app.config.ts
// provideHttpClient(withInterceptors([authInterceptor]))  // register globally` },
    interview: [
      { q: 'What does providedIn root do?', a: 'Registers a singleton in the root injector and allows it to be tree-shaken if unused.' },
      { q: 'inject() vs constructor injection?', a: 'Same DI system; inject() works in functions (guards, interceptors), simplifies inheritance and is the modern recommended style.' },
      { q: 'Why clone a request in an interceptor?', a: 'HttpRequest objects are immutable to keep the chain predictable; clone() returns a modified copy.' }
    ],
    coding: [
      { q: 'Provide a config value with InjectionToken.', a: `export const API_URL = new InjectionToken<string>('API_URL'); // typed token
// providers: [{ provide: API_URL, useValue: 'https://api.example.com' }] // register value
private api = inject(API_URL);                                 // read it anywhere` }
    ],
    roadmap: ['Services', 'Injectors hierarchy', 'providedIn & providers', 'inject()', 'InjectionToken', 'Functional interceptors & guards'],
    related: ['angular-signals', 'net-auth-jwt']
  },
  {
    id: 'next-rendering', cat: 'nextjs', name: 'Rendering: SSR, SSG, ISR, CSR & PPR', level: 'Intermediate',
    oneLiner: 'Strategies for WHEN and WHERE a page\'s HTML is produced: per request, at build time, revalidated over time, in the browser, or a mix.',
    explanation: `CSR (client-side rendering): empty HTML + JS builds the page in the browser. Simple, but slower first paint and weaker SEO.
SSR (server-side rendering): HTML generated per request — fresh and SEO-friendly, but costs server time.
SSG (static site generation): HTML built once at build time — fastest via CDN, but stale until rebuild.
ISR (incremental static regeneration): static pages regenerated in the background after a revalidate interval or on-demand (revalidatePath/revalidateTag).
PPR (Partial Prerendering): a static shell is served instantly while dynamic holes stream in via Suspense.

In the Next.js App Router, the choice is driven by data fetching and caching options per route/segment, not by special functions like getServerSideProps (Pages Router).`,
    diagram: `flowchart TD
  Q{"Does the data change per user or request?"} -- Yes --> SSR["SSR / dynamic rendering"]
  Q -- No --> Q2{"Changes occasionally?"}
  Q2 -- Yes --> ISR["ISR: revalidate N seconds or on demand"]
  Q2 -- No --> SSG["SSG at build time"]
  SSR --> PPR["PPR: static shell + streamed dynamic parts"]
  I{"Highly interactive, no SEO need?"} -- Yes --> CSR["CSR inside a client component"]`,
    code: { lang: 'jsx', src: `// app/blog/[slug]/page.jsx — Next.js App Router
export const revalidate = 3600;                       // ISR: regenerate this page at most once per hour

export async function generateStaticParams() {        // SSG: pre-build these slugs at build time
  const posts = await fetch('https://cms.example.com/posts').then((r) => r.json()); // list posts
  return posts.map((p) => ({ slug: p.slug }));        // one page per slug
}                                                     // end generateStaticParams

export default async function BlogPost({ params }) {  // server component receives route params
  const { slug } = await params;                      // params is async in Next.js 15+
  const post = await fetch('https://cms.example.com/posts/' + slug, {
    next: { tags: ['post-' + slug] }                  // tag the cache so we can revalidate on demand
  }).then((r) => r.json());                           // parse JSON
  return <article><h1>{post.title}</h1><div>{post.body}</div></article>; // rendered HTML
}                                                     // end BlogPost

// Elsewhere (e.g. a CMS webhook route): revalidateTag('post-my-slug') refreshes just that page.` },
    interview: [
      { q: 'SSR vs SSG?', a: 'SSR renders on every request (fresh data, more server cost). SSG renders once at build (fastest, can go stale).' },
      { q: 'What is ISR?', a: 'Serving a static page and regenerating it in the background after a time interval or on-demand revalidation.' },
      { q: 'What is hydration?', a: 'Attaching React event handlers and state to server-rendered HTML in the browser so it becomes interactive.' },
      { q: 'What is Partial Prerendering?', a: 'Serving a prerendered static shell immediately while dynamic Suspense sections stream from the server in the same response.' }
    ],
    coding: [
      { q: 'Force a route to be dynamic (always SSR).', a: `export const dynamic = 'force-dynamic';  // opt out of static caching for this route
// Reading cookies() or headers() in a server component also makes it dynamic automatically.` }
    ],
    roadmap: ['CSR', 'SSR & hydration', 'SSG', 'ISR & revalidation', 'Streaming & Suspense', 'PPR'],
    related: ['react-server-components', 'next-server-actions', 'perf-core-web-vitals']
  },
  {
    id: 'next-server-actions', cat: 'nextjs', name: 'Server Actions & Route Handlers', level: 'Advanced',
    oneLiner: 'Server Actions are async server functions callable directly from components/forms; Route Handlers are API endpoints in the app directory.',
    explanation: `Mark a function with 'use server' and it becomes a Server Action: the client gets a secure reference, and calling it sends a POST to the server. Use them for mutations (create, update, delete), then call revalidatePath/revalidateTag or redirect.

Treat every Server Action like a public API endpoint: validate input (e.g. with Zod) and check authentication/authorisation inside the action.

Route Handlers (app/api/x/route.js exporting GET/POST…) are for webhooks, public APIs, third-party callbacks, or streaming responses (like AI chat).`,
    diagram: `flowchart LR
  F["form action = createTodo"] --> P["POST to server"]
  P --> V["Validate + auth check"]
  V --> DB["Write to database"]
  DB --> RV["revalidatePath('/todos')"]
  RV --> UI["Fresh server-rendered UI"]`,
    code: { lang: 'jsx', src: `// app/todos/actions.js
'use server';                                          // every export here is a Server Action
import { revalidatePath } from 'next/cache';           // refresh cached pages after mutation
import { db } from '@/lib/db';                         // server-only database client

export async function createTodo(formData) {           // receives FormData from the form
  const title = String(formData.get('title') || '').trim(); // read + sanitise input
  if (title.length < 3) return { error: 'Too short' }; // validate: never trust the client
  await db.todo.create({ data: { title } });           // write to the database
  revalidatePath('/todos');                            // re-render the todos page with fresh data
  return { ok: true };                                 // result for useActionState
}                                                      // end createTodo

// app/todos/page.jsx (server component)
// <form action={createTodo}><input name="title" /><button>Add</button></form>
// Works even before JavaScript loads (progressive enhancement).` },
    interview: [
      { q: 'Are Server Actions secure by default?', a: 'They use unguessable IDs and POST, but they are still public endpoints — always validate input and check auth inside.' },
      { q: 'When use a Route Handler instead?', a: 'For webhooks, public REST endpoints, non-form clients (mobile apps), or custom streaming responses.' }
    ],
    coding: [
      { q: 'Create a streaming route handler.', a: `export async function GET() {                         // app/api/stream/route.js
  const stream = new ReadableStream({                   // web standard stream
    start(controller) {                                 // called once
      ['Hello', ' ', 'world'].forEach((w) => controller.enqueue(new TextEncoder().encode(w))); // push chunks
      controller.close();                               // end of stream
    }                                                   // end start
  });                                                   // end stream
  return new Response(stream);                          // send chunks as they arrive
}                                                       // end GET` }
    ],
    roadmap: ['Forms', 'use server', 'Validation (Zod)', 'Revalidation', 'Route handlers', 'Streaming responses'],
    related: ['react-actions', 'next-rendering', 'ai-streaming']
  },
  {
    id: 'vue-composition', cat: 'vue', name: 'Composition API: ref, reactive, computed, watch', level: 'Intermediate',
    oneLiner: 'Vue 3\'s function-based way to organise component logic using reactive primitives inside <script setup>.',
    explanation: `ref() wraps any value (access .value in script; auto-unwrapped in templates). reactive() makes an object deeply reactive (but cannot be reassigned or destructured without toRefs). computed() caches derived values. watch() and watchEffect() run side effects when reactive sources change.

Logic can be extracted into composables (useMouse, useFetch) — Vue's equivalent of React custom hooks. Vue's reactivity is proxy-based and fine-grained, so components update without a virtual-DOM diff of unrelated parts. Vue's "Vapor mode" compiles templates to direct DOM updates without a virtual DOM.`,
    diagram: `flowchart LR
  R["ref count"] --> C["computed double"]
  R --> W["watch → side effect"]
  C --> T["template re-renders only bindings that changed"]`,
    code: { lang: 'html', src: `<script setup>                                   <!-- compile-time sugar: top-level bindings go to the template -->
import { ref, computed, watch } from 'vue';        // reactivity APIs
const count = ref(0);                              // reactive primitive; read/write via count.value
const double = computed(() => count.value * 2);    // cached derived value
watch(count, (now, before) => {                    // react to changes of count
  console.log('count changed', before, '→', now);  // side effect
});                                                // end watch
function inc() { count.value++; }                  // mutate → UI updates automatically
</script>

<template>
  <button @click="inc">{{ count }} × 2 = {{ double }}</button> <!-- @click = v-on:click; refs auto-unwrap -->
</template>` },
    interview: [
      { q: 'ref vs reactive?', a: 'ref works for any type and needs .value in script; reactive works only for objects and loses reactivity if destructured or replaced.' },
      { q: 'watch vs watchEffect?', a: 'watch tracks explicit sources and gives old/new values; watchEffect tracks whatever it reads automatically and runs immediately.' },
      { q: 'What is a composable?', a: 'A function using Composition API to encapsulate reusable stateful logic, like a React custom hook.' }
    ],
    coding: [
      { q: 'Write a useCounter composable.', a: `import { ref } from 'vue';                // reactive primitive
export function useCounter(start = 0) {   // composable function
  const n = ref(start);                   // state
  const inc = () => n.value++;            // action
  return { n, inc };                      // expose to components
}                                         // end composable` }
    ],
    roadmap: ['Options API', 'script setup', 'ref / reactive', 'computed / watch', 'Composables', 'Pinia & Nuxt'],
    related: ['react-hooks-core', 'angular-signals']
  }
];
