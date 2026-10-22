// categories.js — every learning track in the app, with a staged roadmap for each.
// Roadmap stages render as a vertical diagram on the category's Roadmap page.
// To add a track: push a new object here, then add terms with the same `id` in src/data/terms/.

export const CATEGORIES = [
  {
    id: 'html', name: 'HTML5', icon: '🧱', color: '#ff7a59',
    desc: 'Semantic structure, forms, media and the document model every UI sits on.',
    roadmap: [
      { stage: 'Basics', items: ['Document structure', 'Headings & text', 'Links & images', 'Lists & tables'] },
      { stage: 'Semantics', items: ['header/main/nav/article', 'Forms & validation', 'ARIA basics'] },
      { stage: 'Modern', items: ['<dialog>, <details>, popover', 'Responsive images (srcset)', 'Meta & SEO tags'] },
      { stage: 'Pro', items: ['Critical rendering path', 'Resource hints (preload/preconnect)', 'Web Components markup'] }
    ]
  },
  {
    id: 'css', name: 'CSS3 & Modern CSS', icon: '🎨', color: '#4dabf7',
    desc: 'Box model to container queries, layers, :has(), nesting and design systems.',
    roadmap: [
      { stage: 'Basics', items: ['Selectors & specificity', 'Box model', 'Units (rem, %, vw)', 'Colors & fonts'] },
      { stage: 'Layout', items: ['Flexbox', 'CSS Grid', 'Positioning & z-index', 'Media queries'] },
      { stage: 'Modern', items: ['Custom properties', 'Container queries', ':has() & nesting', 'Cascade layers'] },
      { stage: 'Pro', items: ['View Transitions', 'Scroll-driven animations', 'Tailwind / CSS-in-JS trade-offs', 'Design tokens'] }
    ]
  },
  {
    id: 'javascript', name: 'JavaScript (ES2025+)', icon: '⚡', color: '#ffd43b',
    desc: 'The language core: scope, closures, this, prototypes, async, modules and new ES features.',
    roadmap: [
      { stage: 'Basics', items: ['Types & coercion', 'Functions', 'Arrays & objects', 'DOM manipulation'] },
      { stage: 'Core', items: ['Scope & hoisting', 'Closures', 'this & call/apply/bind', 'Prototypes & classes'] },
      { stage: 'Async', items: ['Event loop', 'Promises', 'async/await', 'Fetch & AbortController'] },
      { stage: 'Pro', items: ['Debounce/throttle', 'Memory leaks & GC', 'ES modules', 'New ES2024-25 APIs'] }
    ]
  },
  {
    id: 'typescript', name: 'TypeScript', icon: '🔷', color: '#3178c6',
    desc: 'Types that scale large codebases: generics, narrowing, utility and mapped types.',
    roadmap: [
      { stage: 'Basics', items: ['Primitive & object types', 'Interfaces vs types', 'Union & literal types'] },
      { stage: 'Core', items: ['Generics', 'Narrowing & type guards', 'Utility types'] },
      { stage: 'Advanced', items: ['Mapped & conditional types', 'infer', 'Template literal types'] },
      { stage: 'Pro', items: ['tsconfig strictness', 'Typing React/Angular apps', 'Declaration files (.d.ts)'] }
    ]
  },
  {
    id: 'jquery', name: 'jQuery (Legacy)', icon: '💲', color: '#0769ad',
    desc: 'Still in many enterprise apps — selectors, events, AJAX and how to migrate away.',
    roadmap: [
      { stage: 'Basics', items: ['$() selectors', 'DOM manipulation', 'Events & delegation'] },
      { stage: 'Core', items: ['$.ajax / deferreds', 'Animations', 'Plugins'] },
      { stage: 'Migration', items: ['Vanilla JS equivalents', 'Incremental migration to React/Angular'] }
    ]
  },
  {
    id: 'react', name: 'React 19', icon: '⚛️', color: '#61dafb',
    desc: 'Components, hooks, rendering, Server Components, Actions and the React Compiler.',
    roadmap: [
      { stage: 'Basics', items: ['JSX', 'Components & props', 'State (useState)', 'Lists & keys'] },
      { stage: 'Hooks', items: ['useEffect', 'useRef', 'useMemo / useCallback', 'Custom hooks'] },
      { stage: 'Architecture', items: ['Context', 'Reconciliation & Virtual DOM', 'Error boundaries', 'Suspense & lazy'] },
      { stage: 'React 19+', items: ['Server Components', 'Actions & useActionState', 'use() hook', 'React Compiler'] }
    ]
  },
  {
    id: 'nextjs', name: 'Next.js', icon: '▲', color: '#868e96',
    desc: 'App Router, rendering strategies, caching, Server Actions and deployment.',
    roadmap: [
      { stage: 'Basics', items: ['File-based routing', 'Layouts', 'Link & navigation'] },
      { stage: 'Rendering', items: ['SSR / SSG / ISR', 'Server vs Client components', 'Streaming'] },
      { stage: 'Data', items: ['fetch caching', 'Server Actions', 'Route handlers'] },
      { stage: 'Pro', items: ['Middleware', 'Partial Prerendering', 'Image & font optimisation', 'Edge runtime'] }
    ]
  },
  {
    id: 'angular', name: 'Angular (v17–20+)', icon: '🅰️', color: '#dd0031',
    desc: 'Standalone components, signals, control flow, DI, RxJS and zoneless change detection.',
    roadmap: [
      { stage: 'Basics', items: ['Components & templates', 'Data binding', 'Directives & pipes'] },
      { stage: 'Core', items: ['Dependency Injection', 'Services', 'Routing', 'Reactive forms'] },
      { stage: 'Reactive', items: ['RxJS operators', 'Signals & computed', 'HttpClient & interceptors'] },
      { stage: 'Modern', items: ['Standalone APIs', '@if/@for control flow', '@defer', 'Zoneless change detection'] }
    ]
  },
  {
    id: 'vue', name: 'Vue 3', icon: '🟩', color: '#42b883',
    desc: 'Composition API, reactivity with ref/reactive, and Nuxt basics.',
    roadmap: [
      { stage: 'Basics', items: ['Template syntax', 'Components & props', 'Events & v-model'] },
      { stage: 'Core', items: ['Composition API', 'ref vs reactive', 'computed & watch'] },
      { stage: 'Pro', items: ['Pinia', 'Vue Router', 'Nuxt SSR'] }
    ]
  },
  {
    id: 'state', name: 'State Management', icon: '🗃️', color: '#b197fc',
    desc: 'Redux Toolkit, Zustand, NgRx, TanStack Query and when you need none of them.',
    roadmap: [
      { stage: 'Local', items: ['Component state', 'Lifting state', 'Context / services'] },
      { stage: 'Global', items: ['Redux Toolkit', 'Zustand', 'NgRx / signals store'] },
      { stage: 'Server state', items: ['TanStack Query', 'Caching & invalidation', 'Optimistic updates'] }
    ]
  },
  {
    id: 'webapis', name: 'Browser & Web APIs', icon: '🌐', color: '#20c997',
    desc: 'DOM, storage, observers, workers, Web Components and the platform APIs you must know.',
    roadmap: [
      { stage: 'Basics', items: ['DOM & events', 'Event bubbling & delegation', 'localStorage / sessionStorage'] },
      { stage: 'Observers', items: ['IntersectionObserver', 'ResizeObserver', 'MutationObserver'] },
      { stage: 'Advanced', items: ['Web Workers', 'Service Workers', 'IndexedDB', 'Broadcast Channel'] },
      { stage: 'Pro', items: ['Web Components & Shadow DOM', 'Clipboard / Share / Notifications', 'WebAuthn passkeys'] }
    ]
  },
  {
    id: 'networking', name: 'APIs & Networking', icon: '🔌', color: '#fab005',
    desc: 'REST, GraphQL, WebSockets, SSE, HTTP caching, CORS and auth tokens.',
    roadmap: [
      { stage: 'Basics', items: ['HTTP methods & status codes', 'fetch API', 'JSON'] },
      { stage: 'Core', items: ['REST design', 'CORS', 'Auth: cookies vs JWT', 'HTTP caching headers'] },
      { stage: 'Real-time', items: ['WebSockets', 'Server-Sent Events', 'Polling strategies'] },
      { stage: 'Pro', items: ['GraphQL', 'HTTP/2 & HTTP/3', 'BFF pattern', 'Retry & backoff'] }
    ]
  },
  {
    id: 'performance', name: 'Performance', icon: '🚀', color: '#ff6b6b',
    desc: 'Core Web Vitals (LCP, INP, CLS), rendering, code splitting and profiling.',
    roadmap: [
      { stage: 'Measure', items: ['Lighthouse', 'Core Web Vitals', 'DevTools Performance panel'] },
      { stage: 'Load', items: ['Code splitting', 'Lazy loading', 'Image optimisation', 'Caching & CDN'] },
      { stage: 'Runtime', items: ['Reflow & repaint', 'Long tasks & INP', 'Virtualised lists', 'Memoisation'] },
      { stage: 'Pro', items: ['RUM monitoring', 'Performance budgets', 'Edge rendering'] }
    ]
  },
  {
    id: 'security', name: 'Web Security', icon: '🛡️', color: '#e64980',
    desc: 'XSS, CSRF, CSP, CORS, secure auth storage and OWASP for frontend.',
    roadmap: [
      { stage: 'Basics', items: ['Same-origin policy', 'HTTPS', 'Input sanitisation'] },
      { stage: 'Attacks', items: ['XSS', 'CSRF', 'Clickjacking', 'Supply-chain risk'] },
      { stage: 'Defence', items: ['Content Security Policy', 'HttpOnly/SameSite cookies', 'Subresource Integrity'] }
    ]
  },
  {
    id: 'testing', name: 'Testing', icon: '🧪', color: '#94d82d',
    desc: 'Unit, integration and E2E with Jest/Vitest, Testing Library, Playwright.',
    roadmap: [
      { stage: 'Basics', items: ['Test pyramid', 'Jest / Vitest', 'Assertions & mocks'] },
      { stage: 'UI', items: ['React/Angular Testing Library', 'User-centric queries', 'MSW for API mocks'] },
      { stage: 'E2E', items: ['Playwright / Cypress', 'Visual regression', 'CI pipelines'] }
    ]
  },
  {
    id: 'tooling', name: 'Build Tools & Tooling', icon: '🛠️', color: '#adb5bd',
    desc: 'npm/pnpm, Vite, Webpack, Babel/SWC, ESLint, Prettier and monorepos.',
    roadmap: [
      { stage: 'Basics', items: ['npm & package.json', 'Semantic versioning', 'Scripts'] },
      { stage: 'Bundling', items: ['Vite', 'Webpack', 'Tree shaking', 'Source maps'] },
      { stage: 'Quality', items: ['ESLint', 'Prettier', 'Husky & lint-staged'] },
      { stage: 'Pro', items: ['Monorepos (Nx, Turborepo)', 'Module Federation / micro-frontends'] }
    ]
  },
  {
    id: 'a11y', name: 'Accessibility', icon: '♿', color: '#74c0fc',
    desc: 'WCAG 2.2, ARIA, keyboard navigation and screen-reader friendly UI.',
    roadmap: [
      { stage: 'Basics', items: ['Semantic HTML', 'Alt text', 'Color contrast'] },
      { stage: 'Core', items: ['Keyboard & focus management', 'ARIA roles/states', 'Forms & labels'] },
      { stage: 'Pro', items: ['WCAG 2.2 AA audit', 'axe / Lighthouse', 'Screen-reader testing'] }
    ]
  },
  {
    id: 'pwa', name: 'PWA & Mobile Web', icon: '📱', color: '#63e6be',
    desc: 'Installable, offline-first apps; responsive design; Capacitor / React Native bridges.',
    roadmap: [
      { stage: 'Basics', items: ['Responsive design', 'Viewport & touch', 'Web app manifest'] },
      { stage: 'Core', items: ['Service worker caching', 'Offline strategies', 'Push notifications'] },
      { stage: 'Pro', items: ['TWA / Capacitor store builds', 'React Native vs PWA', 'App-like UX'] }
    ]
  },
  {
    id: 'devops', name: 'Git, CI/CD & Deployment', icon: '🚢', color: '#ffa94d',
    desc: 'Git workflows, pull requests, CI pipelines, Vercel/Netlify and feature flags.',
    roadmap: [
      { stage: 'Git', items: ['Branching', 'Rebase vs merge', 'Resolving conflicts'] },
      { stage: 'CI/CD', items: ['GitHub Actions', 'Preview deployments', 'Env variables & secrets'] },
      { stage: 'Pro', items: ['Feature flags & A/B testing', 'Monitoring (Sentry)', 'Rollbacks'] }
    ]
  },
  {
    id: 'sysdesign', name: 'Frontend System Design', icon: '🏗️', color: '#da77f2',
    desc: 'Designing large UIs: rendering choices, component architecture, micro-frontends.',
    roadmap: [
      { stage: 'Foundations', items: ['Requirements & constraints', 'Rendering strategy (CSR/SSR/SSG)', 'Component architecture'] },
      { stage: 'Scale', items: ['Design systems', 'State & data flow', 'Micro-frontends'] },
      { stage: 'Interview', items: ['Design a news feed', 'Design autocomplete', 'Design a chat app'] }
    ]
  },
  {
    id: 'ai', name: 'AI-Integrated Frontend', icon: '🤖', color: '#7cf2c8',
    desc: 'LLM APIs, streaming UIs, RAG, tool calling, AI SDKs, on-device AI and prompt engineering for devs.',
    roadmap: [
      { stage: 'Foundations', items: ['LLM, tokens & context window', 'Prompt engineering', 'Calling Gemini / Claude / OpenAI APIs safely'] },
      { stage: 'UI Patterns', items: ['Streaming responses (SSE)', 'Chat UI state', 'Generative UI', 'AI SDKs (Vercel AI SDK)'] },
      { stage: 'Intelligence', items: ['Embeddings & vector search', 'RAG', 'Tool / function calling', 'AI agents & MCP'] },
      { stage: 'Pro', items: ['On-device AI (WebGPU, Chrome built-in AI)', 'Cost & latency', 'Guardrails & prompt injection', 'AI coding assistants in workflow'] }
    ]
  }
];

// quick lookup map: CATEGORY_MAP.react → the React category object
export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
