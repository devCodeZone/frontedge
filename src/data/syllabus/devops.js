// Git, CI/CD & Deployment — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Git',
    t('devops-git-basics', 'Git Basics: init, clone, add, commit, push, pull', 'B', {
      one: 'Git tracks changes in snapshots: working directory → staging area (add) → local repository (commit) → remote (push), and pull brings others’ changes.',
      ex: `Core commands: git init/clone, status, add, commit -m, log --oneline, diff, push, pull (= fetch + merge/rebase), remote -v. Configure identity (user.name/user.email) per repo when sharing a machine between accounts, and use .gitignore for node_modules, dist and .env files.

Write small, focused commits with clear messages. Never commit secrets.`,
      pts: ['Working dir → staging → commit → remote', 'status/diff before commit', '.gitignore secrets and builds', 'Per-repo identity on shared machines'],
      flow: ['Edit files', 'git add (stage)', 'git commit (snapshot)', 'git push (share)', 'git pull (update)'],
      code: ['bash', `git config user.name "Dev Code Zone"                 # identity for THIS repo only
git config user.email "you@example.com"
git init && git add . && git commit -m "feat: initial FrontEdge app" # first commit
git branch -M main                                     # name the branch main
git remote add origin https://github.com/devCodeZone/frontedge.git # link GitHub repo
git push -u origin main                                # upload and set upstream
git status && git log --oneline -5                     # check state and history`],
      iq: [['git fetch vs git pull?', 'fetch downloads remote changes without merging; pull fetches and integrates (merge or rebase) into your branch.'],
           ['What is the staging area?', 'An intermediate area where you choose which changes go into the next commit.']],
      cq: [['Undo staging a file.', `git restore --staged src/App.jsx   # unstage, keep changes in working directory`]],
      err: ['Committing node_modules or .env', 'Wrong global identity on a shared laptop']
    }),
    t('devops-git-branching', 'Branching, Merging, Rebasing & Conflicts', 'B', {
      one: 'Branches isolate work; merge combines histories with a merge commit, rebase replays commits on a new base for linear history; conflicts happen when the same lines changed in both.',
      ex: `Create feature branches (git switch -c feat/mock-tests), keep them short-lived, sync with main regularly (git pull --rebase or merge main). Resolve conflicts by editing the marked sections (<<<<<<< ======= >>>>>>>), testing, then git add + continue.

Golden rule: don't rebase commits already pushed and shared with others (unless you coordinate and use --force-with-lease). Squash merges keep main history clean.`,
      pts: ['Short-lived feature branches', 'Rebase local, merge shared', 'Resolve conflicts + test', 'force-with-lease, never plain force'],
      dia: `gitGraph
  commit id: "init"
  branch feat
  commit id: "add mock"
  checkout main
  commit id: "fix nav"
  checkout feat
  merge main
  commit id: "polish"
  checkout main
  merge feat`,
      code: ['bash', `git switch -c feat/company-mocks          # new branch from current main
git add -A && git commit -m "feat(mock): company patterns"
git fetch origin && git rebase origin/main # replay my commits on latest main
# conflict? edit files, then:
git add src/data/mock.js && git rebase --continue
git push --force-with-lease                # safe force push of my own branch
git switch main && git merge --squash feat/company-mocks # or squash-merge via PR`],
      iq: [['Merge vs rebase?', 'Merge preserves history with a merge commit; rebase rewrites commits onto a new base for linear history (avoid on shared branches).'],
           ['What is --force-with-lease?', 'A force push that fails if the remote has commits you haven’t seen, preventing overwriting teammates’ work.']],
      cq: [['Abort a messy merge.', `git merge --abort   # or: git rebase --abort`]],
      err: ['git push --force on shared branches', 'Long-lived branches drifting from main']
    }),
    t('devops-git-advanced', 'Advanced Git: stash, cherry-pick, reset vs revert, reflog, bisect', 'I', {
      one: 'Power tools: stash shelves changes, cherry-pick copies commits, reset moves branch pointers (rewrites history), revert creates undo commits, reflog recovers lost commits and bisect finds the commit that introduced a bug.',
      ex: `reset --soft (keep changes staged), --mixed (keep unstaged), --hard (discard!). Use revert on shared branches. reflog lists where HEAD has been — rescue after a bad reset. bisect performs a binary search between a good and bad commit (can be automated with a test script). git blame / log -S find who changed what.`,
      pts: ['stash for context switching', 'revert on shared history', 'reflog to recover', 'bisect to find regressions'],
      code: ['bash', `git stash push -m "wip: chat ui"           # shelve unfinished work
git stash pop                               # bring it back
git cherry-pick a1b2c3d                     # apply one commit from another branch
git revert 9f8e7d6                          # undo a pushed commit safely (new commit)
git reset --soft HEAD~1                     # undo last local commit, keep changes staged
git reflog                                  # find a "lost" commit hash
git bisect start && git bisect bad && git bisect good v1.0.0 # binary search for the bug
git bisect run npm test                     # automate with tests; then: git bisect reset`],
      iq: [['reset vs revert?', 'reset moves the branch pointer and can discard history (local use); revert adds a new commit that undoes changes (safe for shared branches).']],
      cq: [['Recover a branch deleted by mistake.', `git reflog | grep feat/mock     # find its last commit
git branch feat/mock <hash>      # recreate the branch`]],
      err: ['git reset --hard without checking for uncommitted work']
    }),
    t('devops-pr-review', 'Pull Requests, Code Review & Conventional Commits', 'B', {
      one: 'Pull requests propose changes for review, run CI and document decisions; conventional commits (feat:, fix:, chore:) standardise messages for changelogs and semantic versioning.',
      ex: `Good PRs: small and focused, clear title/description (what, why, how to test, screenshots), linked issue, passing checks, self-reviewed diff. Reviewers check correctness, readability, tests, accessibility, performance and security — be kind and specific; use suggestions.

Branch protection: required reviews and status checks, no direct pushes to main. Conventional Commits + semantic-release/changesets automate versions and release notes.`,
      pts: ['Small focused PRs', 'Description + screenshots + test steps', 'Branch protection rules', 'feat:/fix: messages → automated releases'],
      code: ['markdown', `## What
Adds company-wise mock test patterns (TCS, Infosys, Publicis Sapient…).

## Why
Users asked for interview prep by company.

## How to test
1. npm run dev → open /#/mock → "By company"
2. Pick TCS → Start test → answer questions → see results

## Screenshots
(before / after)

## Checklist
- [x] Tests added  - [x] a11y checked (keyboard + labels)  - [x] No secrets committed`],
      iq: [['What makes a good code review?', 'Focus on correctness, clarity, tests and risks; be specific and respectful; approve when good enough rather than perfect.']],
      cq: [['Open a PR from the terminal.', `gh pr create --title "feat(mock): company patterns" --body-file .github/pr.md --base main`]],
      err: ['2,000-line PRs', 'Vague commit messages like "changes"']
    })
  ),
  m('2. CI/CD & Deployment',
    L('devops-git-ci'),
    t('devops-github-actions', 'GitHub Actions in Depth', 'I', {
      one: 'GitHub Actions runs workflows (YAML) on events like push or pull_request using jobs, steps, reusable actions, secrets, caching, matrices and environments.',
      ex: `Workflows live in .github/workflows. Use actions/setup-node with cache, matrices to test multiple Node versions/browsers, needs: to order jobs, environments with required reviewers for production, secrets via \${{ secrets.NAME }}, OIDC for cloud deploys without long-lived keys, concurrency to cancel outdated runs, and artifacts to pass build outputs.

Pin third-party actions to versions/SHAs for supply-chain safety.`,
      pts: ['Events → jobs → steps', 'Cache + matrix + concurrency', 'Secrets and environments', 'Pin action versions'],
      code: ['yaml', `name: ci
on: { pull_request: {}, push: { branches: [main] } }
concurrency: { group: ci-\${{ github.ref }}, cancel-in-progress: true }   # cancel stale runs
jobs:
  test:
    runs-on: ubuntu-latest
    strategy: { matrix: { node: [20, 22] } }                       # two Node versions
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: \${{ matrix.node }}, cache: npm }      # cached installs
      - run: npm ci
      - run: npm run lint && npm test -- --run && npm run build
  deploy:
    needs: test                                                     # only after tests pass
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production                                         # can require approval
    steps:
      - uses: actions/checkout@v4
      - run: npx vercel deploy --prod --token=\${{ secrets.VERCEL_TOKEN }}`],
      iq: [['How do you keep secrets safe in CI?', 'Store them as encrypted secrets/environment secrets, never echo them, limit permissions, prefer OIDC short-lived credentials.']],
      cq: [['Upload a build artifact.', `- uses: actions/upload-artifact@v4
  with: { name: dist, path: dist/ }`]],
      err: ['Using unpinned third-party actions']
    }),
    t('devops-hosting-platforms', 'Deploying Frontends: Vercel, Netlify, Cloudflare, static hosting', 'B', {
      one: 'Frontend hosting platforms build from Git, deploy to a global CDN, create preview URLs per PR and run serverless/edge functions; static sites can also go to S3+CloudFront, GitHub Pages or Firebase Hosting.',
      ex: `Vercel: zero-config for Next.js/Vite, serverless functions in /api, env vars per environment (Production/Preview/Development), preview deployments for every branch, instant rollbacks, analytics. Netlify and Cloudflare Pages are similar. SPAs need a fallback rewrite to index.html for client routes (not needed for hash routing).

Connect the Git repo once; every push to main deploys production and every PR gets a preview link for review.`,
      pts: ['Git-connected auto deploys', 'Preview URL per PR', 'Env vars per environment', 'SPA rewrite to index.html'],
      flow: ['git push', 'Platform builds (npm run build)', 'Uploads to CDN', 'Preview or production URL', 'Instant rollback if needed'],
      code: ['json', `// vercel.json for an SPA using history routing + API functions
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
  "headers": [{ "source": "/sw.js", "headers": [{ "key": "Cache-Control", "value": "no-cache" }] }]
}`],
      iq: [['What is a preview deployment?', 'A unique URL built from a branch/PR so reviewers can test changes before merging to production.']],
      cq: [['Add an env var with the Vercel CLI.', `npx vercel env add GROQ_API_KEY production   # paste value when prompted, then redeploy`]],
      err: ['Forgetting to redeploy after changing env vars']
    }),
    t('devops-env-config', 'Environments, Config & Secrets Management', 'I', {
      one: 'Separate development, preview/staging and production with environment-specific configuration and secrets stored in the platform — never in the repository.',
      ex: `Local: .env.local (git-ignored) with .env.example committed as documentation. Platform: env vars per environment (Vercel/Netlify/GitHub). Build-time vs runtime config: public build-time variables are baked into bundles; server-only secrets are read at runtime by functions. Rotate secrets regularly and immediately if leaked.

Staging should mirror production (data shape, config) with test credentials. Feature flags decouple deploy from release.`,
      pts: ['.env.local ignored, .env.example committed', 'Per-environment variables', 'Build-time public vs runtime secret', 'Rotate leaked keys immediately'],
      code: ['bash', `# .env.example (committed) — documents required variables, no real values
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your_key_here
VITE_PUBLIC_SITE_URL=https://frontedge.vercel.app
# .gitignore
.env*
!.env.example                 # keep the example file tracked`],
      iq: [['Why commit .env.example?', 'New developers and CI know which variables are needed without exposing secret values.']],
      cq: [['Fail fast if a required variable is missing (server).', `if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY is not set'); // clear startup error`]],
      err: ['Same secrets for dev and prod']
    }),
    t('devops-docker-frontend', 'Docker for Frontend Apps', 'I', {
      one: 'Docker packages an app with its runtime into an image for consistent builds and deployments; frontends use multi-stage builds (Node build → nginx or Node runtime).',
      ex: `Static SPA: build with Node, serve dist/ with nginx (add SPA fallback and caching headers). SSR apps (Next.js/Nuxt/Angular SSR): run a Node server (Next standalone output). Use .dockerignore (node_modules, .git), small base images (alpine/distroless), non-root users and build args only for public config.

Containers are deployed to Kubernetes, ECS, Cloud Run, Azure Container Apps or any VM.`,
      pts: ['Multi-stage builds', 'nginx for static, Node for SSR', '.dockerignore + small images', 'Non-root user'],
      code: ['dockerfile', `# Static SPA (Vite) served by nginx
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                                   # reproducible install
COPY . .
RUN npm run build                            # outputs dist/
FROM nginx:1.27-alpine                       # tiny web server image
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf # try_files $uri /index.html; for SPA routes
EXPOSE 80`],
      iq: [['Why multi-stage Docker builds?', 'Build tools stay in the first stage; the final image contains only what is needed to run, making it smaller and more secure.']],
      cq: [['Run the container locally.', `docker build -t frontedge . && docker run -p 8080:80 frontedge   # open http://localhost:8080`]],
      err: ['Shipping node_modules and source code in the final image']
    }),
    t('devops-feature-flags-ab', 'Feature Flags, A/B Testing & Personalisation', 'I', {
      one: 'Feature flags toggle features at runtime without deploying; A/B testing randomly assigns variants and measures impact; personalisation targets content to segments (e.g. Adobe Target, Optimizely, LaunchDarkly).',
      ex: `Flags enable trunk-based development, gradual rollouts (5% → 50% → 100%), kill switches and beta programs. Evaluate flags server-side or at the edge to avoid flicker; cache flag values; clean up old flags (tech debt).

A/B tests need a hypothesis, primary metric, sample size and sufficient duration; avoid peeking early. Client-side testing tools inject changes after load (flicker risk, performance cost) — prefer server-side/edge or SDK-based experiments in SPAs, fire impression/conversion events reliably and respect consent.`,
      pts: ['Deploy ≠ release', 'Gradual rollouts + kill switch', 'Server/edge evaluation avoids flicker', 'Hypothesis + metric + sample size'],
      flow: ['Define hypothesis and metric', 'Bucket users consistently', 'Render variant (server or edge)', 'Track impressions and conversions', 'Analyse significance and roll out'],
      code: ['javascript', `// Deterministic bucketing so a user always sees the same variant
async function bucket(userId, experiment, splits = { A: 50, B: 50 }) {
  const data = new TextEncoder().encode(userId + ':' + experiment);  // stable input
  const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', data))[0]; // 0..255
  const pct = (hash / 256) * 100;                                     // 0..100
  let acc = 0;
  for (const [variant, weight] of Object.entries(splits)) {
    acc += weight;
    if (pct < acc) return variant;                                     // pick by cumulative weight
  }
  return 'A';
}
const variant = await bucket(user.id, 'mock-cta');                    // "A" or "B"
track('experiment_impression', { experiment: 'mock-cta', variant });  // log exposure`],
      iq: [['What causes flicker in A/B tests and how to avoid it?', 'Client-side scripts modify the page after it renders; avoid by deciding variants server-side/edge or loading the tool synchronously with a short anti-flicker timeout.'],
           ['Feature flag vs config?', 'Flags are dynamic, targeted switches for features/experiments that change without deploys; config is static environment settings.']],
      cq: [['Kill switch check with fallback.', `const enabled = (await flags.get('ai-mentor')) ?? false; // default off if the flag service fails`]],
      err: ['Never removing old flags', 'Stopping tests early when results look good']
    }),
    t('devops-monitoring-observability', 'Monitoring, Error Tracking & Analytics', 'I', {
      one: 'Observe production frontends with error tracking (Sentry), real-user performance monitoring, logs, uptime checks, product analytics (GA4, Mixpanel, PostHog) and session replay — with privacy controls.',
      ex: `Error tracking captures stack traces with source maps, release versions, breadcrumbs and user context; alert on new/regressed errors. RUM tracks Core Web Vitals per release. Product analytics measures funnels and feature adoption (events with consistent names and properties). Session replay helps reproduce bugs but must mask PII and respect consent.

Tag every deploy with a release/commit SHA to correlate regressions.`,
      pts: ['Sentry + source maps + releases', 'RUM per release', 'Consistent analytics events', 'Mask PII, respect consent'],
      code: ['javascript', `import * as Sentry from '@sentry/react';
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,            // public DSN is OK to expose
  release: import.meta.env.VITE_RELEASE,           // e.g. git SHA from CI
  integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration({ maskAllText: true })], // perf + masked replay
  tracesSampleRate: 0.1,                           // sample 10% of transactions
  replaysOnErrorSampleRate: 1.0                    // replay sessions with errors
});
function track(event, props = {}) {                // analytics wrapper
  if (!hasConsent('analytics')) return;            // privacy first
  window.gtag?.('event', event, props);            // send to GA4
}`],
      iq: [['Why upload source maps to your error tracker?', 'Minified stack traces become readable original file/line references without publicly exposing maps.']],
      cq: [['Capture a handled error with context.', `try { await save(); } catch (e) { Sentry.captureException(e, { tags: { feature: 'mock' } }); showToast('Could not save'); }`]],
      err: ['Logging PII to analytics', 'No release tags']
    }),
    t('devops-release-strategies', 'Release Strategies: canary, blue-green, rollback, versioning', 'A', {
      one: 'Ship safely with canary releases (small % of users first), blue-green deployments (switch traffic between two environments), instant rollbacks, semantic versioning and release notes.',
      ex: `Frontend specifics: immutable deployments (each build at a unique URL) make rollbacks instant; keep old asset files available for users with open tabs (or handle chunk-load errors by reloading); version APIs to avoid breaking old clients; communicate updates (service worker update prompt).

Combine with feature flags for gradual exposure and automated rollback on error-rate spikes.`,
      pts: ['Canary → monitor → expand', 'Immutable deploys = instant rollback', 'Handle chunk-load errors after deploy', 'Release notes + semver'],
      dia: `flowchart LR
  B["Build v2"] --> C["Canary 5% traffic"]
  C --> M{"Errors and vitals OK?"}
  M -- Yes --> F["100% rollout"]
  M -- No --> R["Rollback to v1 instantly"]`,
      code: ['javascript', `// After a deploy, old tabs may request deleted chunks → reload once
window.addEventListener('vite:preloadError', (event) => {     // Vite emits this on failed dynamic import
  if (!sessionStorage.getItem('reloaded-after-deploy')) {
    sessionStorage.setItem('reloaded-after-deploy', '1');    // avoid infinite reload loops
    location.reload();                                        // fetch the new index + chunks
  }
});`],
      iq: [['Blue-green vs canary?', 'Blue-green switches all traffic between two full environments at once; canary gradually shifts a small percentage to the new version while monitoring.']],
      cq: [['Instant rollback on Vercel.', `npx vercel rollback <deployment-url>   # or "Promote" a previous deployment in the dashboard`]],
      err: ['Deleting old assets immediately after deploy']
    })
  )
];
