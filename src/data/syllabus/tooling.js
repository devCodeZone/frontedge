// Build Tools & Tooling — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Packages & Node',
    t('tool-node-for-frontend', 'Node.js for Frontend Developers (nvm, npx, scripts)', 'B', {
      one: 'Node.js runs JavaScript outside the browser and powers frontend tooling (dev servers, bundlers, linters, tests); manage versions with nvm/fnm/Volta and run tools with npm scripts and npx.',
      ex: `Use an LTS version (Node 22/24) and pin it per project (.nvmrc or "engines"/volta in package.json) so the team and CI match. npx runs package binaries without global installs (npx vitest). npm scripts (npm run build) are the project's command interface; pre/post scripts run automatically (prebuild).

Global installs can cause "command not found" PATH issues — prefer npx or project-local binaries.`,
      pts: ['Use Node LTS', 'Pin version with .nvmrc', 'npx for local binaries', 'npm scripts as the interface'],
      code: ['bash', `node -v                      # check version (v22.x LTS)
nvm install 22 && nvm use 22 # install/switch versions (nvm-windows: nvm use 22.x)
echo "22" > .nvmrc           # pin for the project
npx vitest --version         # run a local tool without global install
npm run build                # runs "prebuild" automatically first if defined`],
      iq: [['Why pin Node versions?', 'Different versions can change behaviour and native module compatibility; pinning keeps dev, CI and production consistent.']],
      cq: [['Fix "command not recognized" after npm i -g.', `npx vercel login    # run through npx, or add "npm config get prefix" folder to PATH and restart the terminal`]],
      err: ['Different Node versions across the team']
    }),
    t('tool-package-managers', 'Package Managers: npm, pnpm, Yarn, Bun', 'B', {
      one: 'Package managers install dependencies from the npm registry, resolve versions and write lockfiles; pnpm uses a content-addressed store and strict node_modules, Bun is an all-in-one fast runtime/toolkit.',
      ex: `npm (bundled with Node) is universal. pnpm saves disk space and prevents phantom dependencies (code using packages it didn't declare) and has excellent workspace support. Yarn (Berry) offers Plug'n'Play. Bun installs very fast and runs scripts/tests.

Commit exactly one lockfile; use npm ci / pnpm install --frozen-lockfile in CI. Corepack pins the package manager version via the packageManager field.`,
      pts: ['One lockfile, committed', 'pnpm prevents phantom deps', 'Frozen installs in CI', 'Corepack pins manager version'],
      code: ['bash', `npm install zod                 # add dependency (updates package-lock.json)
npm install -D vitest           # dev dependency
npm ci                          # CI: exact install from lockfile
pnpm add zod                    # pnpm equivalent
pnpm install --frozen-lockfile  # pnpm CI install
corepack enable && corepack use pnpm@9  # pin package manager via packageManager field`],
      iq: [['dependencies vs devDependencies?', 'dependencies are needed at runtime; devDependencies are only for development/build (tests, bundlers, linters).'],
           ['What is a phantom dependency?', 'Importing a package you didn’t declare that happens to be hoisted by another dependency; it breaks when that dependency changes.']],
      cq: [['Find why a package is installed.', `npm explain react-is      # or: pnpm why react-is`]],
      err: ['Mixing npm and yarn lockfiles']
    }),
    t('tool-package-json-semver', 'package.json & Semantic Versioning', 'B', {
      one: 'package.json describes a project (name, scripts, dependencies, type, exports, engines); semantic versioning MAJOR.MINOR.PATCH with ^ and ~ ranges controls which updates are allowed.',
      ex: `^1.4.2 allows 1.x.x (minor + patch), ~1.4.2 allows 1.4.x (patch), exact 1.4.2 pins. MAJOR = breaking, MINOR = features, PATCH = fixes. "type": "module" makes .js files ESM. "exports" defines public entry points of a library; "browserslist", "engines", "overrides" (force a transitive version) and "packageManager" are common fields.

Lockfiles freeze the exact resolved tree regardless of ranges.`,
      pts: ['^ = minor+patch, ~ = patch', 'MAJOR.MINOR.PATCH meaning', '"type": "module"', 'overrides for transitive fixes'],
      code: ['json', `{
  "name": "frontedge",
  "version": "1.2.0",
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "test": "vitest" },
  "dependencies": { "react": "^18.3.1" },
  "devDependencies": { "vite": "~5.4.11" },
  "engines": { "node": ">=20" },
  "overrides": { "semver": "7.6.3" },
  "packageManager": "npm@10.9.0"
}`],
      iq: [['What does ^2.3.1 allow?', '>=2.3.1 and <3.0.0.'],
           ['What is a breaking change in semver?', 'A change requiring consumers to modify their code; it requires a major version bump.']],
      cq: [['Check outdated dependencies.', `npm outdated          # shows current, wanted (by range) and latest`]],
      err: ['Updating majors without reading changelogs']
    })
  ),
  m('2. Build Tools',
    t('tool-transpilers', 'Transpilers: Babel, SWC, esbuild & TypeScript', 'I', {
      one: 'Transpilers convert modern JS/TS/JSX into code target browsers understand; Babel is plugin-based and flexible, SWC and esbuild are Rust/Go-based and much faster.',
      ex: `Transpiling handles syntax (JSX, TS types, optional chaining for old targets); polyfills (core-js) handle missing APIs. Targets come from browserslist. Babel powers many plugins (React Compiler, styled-components). SWC is used by Next.js, Vite's React plugin (SWC variant), Deno; esbuild by Vite for dev and dependency pre-bundling.

TypeScript's tsc can also emit JS, but most projects only type-check with tsc and let faster tools transpile.`,
      pts: ['Syntax transform vs polyfills', 'Targets via browserslist', 'SWC/esbuild ~20–100× faster', 'tsc for type-checking'],
      flow: ['TS/JSX/modern JS', 'Parse to AST', 'Apply transforms', 'Emit target JS + source maps'],
      code: ['javascript', `// babel.config.js — classic setup
export default {
  presets: [
    ['@babel/preset-env', { targets: '> 0.5%, not dead', useBuiltIns: 'usage', corejs: 3 }], // syntax + needed polyfills
    ['@babel/preset-react', { runtime: 'automatic' }],                                     // JSX without importing React
    '@babel/preset-typescript'                                                              // strip TS types
  ]
};
// esbuild one-liner: npx esbuild src/app.tsx --bundle --minify --target=es2020 --outfile=dist/app.js`],
      iq: [['Transpiling vs polyfilling?', 'Transpiling rewrites syntax; polyfills add missing runtime APIs (e.g. Promise.withResolvers).']],
      cq: [['Use the SWC React plugin in Vite.', `import react from '@vitejs/plugin-react-swc'; export default { plugins: [react()] }; // faster transforms`]],
      err: ['Shipping huge polyfill bundles to modern browsers']
    }),
    L('tool-vite-webpack'),
    t('tool-webpack-config', 'Webpack Concepts: entry, output, loaders, plugins, chunks', 'I', {
      one: 'Webpack builds a dependency graph from entry points, transforms files with loaders, extends the build with plugins and emits chunks to an output directory.',
      ex: `Core config: entry, output (filename with [contenthash]), module.rules (loaders: babel-loader, css-loader, ts-loader, asset modules), plugins (HtmlWebpackPlugin, MiniCssExtractPlugin, DefinePlugin), resolve.alias, optimization.splitChunks (vendor chunks), devServer, mode (development/production).

Still widespread in enterprise apps (older Angular CLI, CRA ejects, custom setups). Rspack is a faster, mostly compatible replacement.`,
      pts: ['entry → graph → output', 'Loaders transform files', 'Plugins extend build', 'splitChunks + contenthash'],
      code: ['javascript', `// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'production',                                    // minify + optimise
  entry: './src/index.js',                               // start of the graph
  output: { filename: '[name].[contenthash].js', clean: true }, // cache-busting names
  module: {
    rules: [
      { test: /\\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' }, // transpile JS
      { test: /\\.css$/, use: ['style-loader', 'css-loader'] },          // import CSS
      { test: /\\.(png|svg)$/, type: 'asset' }                           // images
    ]
  },
  plugins: [new HtmlWebpackPlugin({ template: './index.html' })],      // inject bundles into HTML
  optimization: { splitChunks: { chunks: 'all' } }                     // vendor/shared chunks
};`],
      iq: [['Loader vs plugin?', 'Loaders transform individual modules (files); plugins hook into the whole compilation (emit HTML, extract CSS, define env).']],
      cq: [['Analyse a webpack bundle.', `npx webpack --profile --json > stats.json && npx webpack-bundle-analyzer stats.json`]],
      err: ['No contenthash → stale caches']
    }),
    t('tool-rollup-libraries', 'Building Libraries: Rollup, tsup, package exports', 'A', {
      one: 'Libraries are built differently from apps: output ESM (and optionally CJS), type declarations, tree-shakable modules and correct package.json exports, using Rollup, tsup, Vite library mode or unbuild.',
      ex: `Mark framework deps as peerDependencies and externals (don't bundle React). Emit .d.ts files. Set "sideEffects": false (or list CSS files) for tree shaking. Use "exports" with "import"/"require"/"types" conditions. Check with publint and arethetypeswrong.

Publish design systems to npm/private registries with changesets for versioning.`,
      pts: ['ESM-first output + types', 'peerDependencies + externals', 'exports map', 'sideEffects for tree shaking'],
      code: ['json', `{
  "name": "@jagma/ui",
  "version": "0.4.0",
  "type": "module",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
    "./styles.css": "./dist/styles.css"
  },
  "sideEffects": ["*.css"],
  "peerDependencies": { "react": ">=18" },
  "scripts": { "build": "tsup src/index.ts --format esm,cjs --dts --external react" }
}`],
      iq: [['Why peerDependencies for React in a component library?', 'So the app provides a single React instance; bundling a second copy breaks hooks and bloats bundles.']],
      cq: [['Vite library mode config.', `export default { build: { lib: { entry: 'src/index.ts', formats: ['es'] }, rollupOptions: { external: ['react', 'react-dom'] } } };`]],
      err: ['Bundling React inside a library']
    }),
    t('tool-source-maps-env', 'Source Maps, Environment Variables & Build Modes', 'I', {
      one: 'Source maps map minified code back to original sources for debugging; environment variables and build modes configure behaviour per environment without code changes.',
      ex: `Enable source maps in production builds but consider uploading them privately to error trackers (Sentry) instead of serving them publicly. Vite: import.meta.env.MODE, .env, .env.production, VITE_ prefix for client exposure. Webpack: DefinePlugin / process.env replacement. Next.js: NEXT_PUBLIC_ prefix.

Never put secrets in client-exposed variables; build-time variables require a rebuild to change.`,
      pts: ['Source maps for debugging', 'Upload maps privately to Sentry', 'Mode-specific .env files', 'Client prefixes are public'],
      code: ['javascript', `// vite.config.js
export default ({ mode }) => ({
  build: { sourcemap: mode === 'production' ? 'hidden' : true }, // hidden: generate but don't reference in bundle
  define: { __APP_VERSION__: JSON.stringify(process.env.npm_package_version) } // compile-time constant
});
// usage
console.log(import.meta.env.MODE, import.meta.env.VITE_API_URL, __APP_VERSION__);
// .env.production → VITE_API_URL=https://api.frontedge.app`],
      iq: [['What are hidden source maps?', 'Maps generated without the sourceMappingURL comment, so browsers don’t load them but error trackers can use them.']],
      cq: [['Upload source maps to Sentry in CI.', `npx @sentry/cli sourcemaps upload --release $GIT_SHA ./dist   # then delete maps from the public dist`]],
      err: ['Public source maps exposing proprietary code (if that matters)']
    }),
    t('tool-browserslist-polyfills', 'Browser Support: browserslist, Baseline & polyfills', 'I', {
      one: 'Decide which browsers you support (browserslist query or Baseline target) so tools transpile, prefix and polyfill only what is needed.',
      ex: `browserslist (in package.json or .browserslistrc) drives Babel/SWC targets, Autoprefixer, Lightning CSS and some bundlers. "Baseline" (web-features) labels features as Newly or Widely available across major browsers — useful for deciding when to adopt APIs.

Polyfill selectively (core-js usage mode, polyfill per feature-detect) rather than shipping everything; consider differential serving or dropping very old browsers based on analytics.`,
      pts: ['Explicit browser targets', 'Baseline widely-available features', 'Selective polyfills', 'Decide with real analytics'],
      code: ['text', `# .browserslistrc
> 0.5% in IN          # popular in India
last 2 versions
not dead
not op_mini all
# check: npx browserslist   → prints resolved browsers`],
      iq: [['What does "Baseline widely available" mean?', 'The feature has worked across all major browsers (Chrome, Edge, Firefox, Safari) for at least ~30 months.']],
      cq: [['Polyfill only when missing.', `if (!('groupBy' in Object)) await import('core-js/actual/object/group-by'); // load on demand`]],
      err: ['Targeting IE11 by default in 2026']
    })
  ),
  m('3. Code Quality',
    t('tool-eslint', 'ESLint (flat config, plugins, rules)', 'B', {
      one: 'ESLint statically analyses code to find bugs and enforce conventions; modern projects use the flat config (eslint.config.js) with plugins for TypeScript, React hooks, a11y and imports.',
      ex: `Key plugins: typescript-eslint (type-aware rules like no-floating-promises), eslint-plugin-react-hooks (rules of hooks, exhaustive deps), jsx-a11y, import/unused-imports, @angular-eslint, eslint-plugin-vue. Run in editors (VS Code extension), pre-commit hooks and CI (--max-warnings 0).

Leave formatting to Prettier (eslint-config-prettier disables conflicting rules). Faster alternatives: Biome and Oxlint.`,
      pts: ['Flat config eslint.config.js', 'TS, hooks and a11y plugins', 'Formatting → Prettier', 'Run in editor, hooks and CI'],
      code: ['javascript', `// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
export default tseslint.config(
  js.configs.recommended,                                   // core JS rules
  ...tseslint.configs.recommended,                          // TypeScript rules
  jsxA11y.flatConfigs.recommended,                          // accessibility in JSX
  { plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',                // hooks at top level
      'react-hooks/exhaustive-deps': 'warn',                // effect dependencies
      'no-console': ['warn', { allow: ['warn', 'error'] }]  // project convention
    } },
  { ignores: ['dist/**'] }
);`],
      iq: [['ESLint vs Prettier?', 'ESLint finds code-quality problems and bugs; Prettier formats code style. Use both without overlapping rules.']],
      cq: [['Lint in CI strictly.', `npx eslint . --max-warnings 0   # fail on any warning`]],
      err: ['Disabling exhaustive-deps instead of fixing effects']
    }),
    t('tool-prettier-editorconfig', 'Prettier, EditorConfig & VS Code Setup', 'B', {
      one: 'Prettier auto-formats code consistently; EditorConfig shares basic editor settings; VS Code settings/extensions make format-on-save and linting automatic for the whole team.',
      ex: `Commit .prettierrc and .editorconfig, add "format": "prettier --write ." script, and recommend extensions in .vscode/extensions.json (ESLint, Prettier, Tailwind IntelliSense, Vue/Angular language services, GitLens, Error Lens). Use workspace settings for format on save and default formatter.

Separate VS Code profiles help when sharing a machine between developers or projects.`,
      pts: ['Prettier for formatting', '.editorconfig basics', 'Format on save', 'Recommended extensions file'],
      code: ['json', `// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
  "files.eol": "\\n"
}
// .prettierrc
{ "singleQuote": true, "semi": true, "printWidth": 100, "trailingComma": "es5" }`],
      iq: [['Why commit formatter config?', 'Everyone (and CI) formats identically, eliminating style debates and noisy diffs.']],
      cq: [['Check formatting in CI.', `npx prettier --check .   # fails if files are not formatted`]],
      err: ['Formatting-only changes mixed into feature PRs']
    }),
    t('tool-git-hooks', 'Git Hooks: Husky, lint-staged & commitlint', 'I', {
      one: 'Git hooks run scripts at commit/push time; Husky manages them, lint-staged lints/formats only staged files, and commitlint enforces commit message conventions.',
      ex: `pre-commit → lint-staged runs ESLint --fix and Prettier on changed files (fast). commit-msg → commitlint checks Conventional Commits (feat:, fix:, chore:) enabling automatic changelogs/versioning. pre-push → run tests or typecheck.

Hooks are a convenience — CI must still enforce the same checks.`,
      pts: ['pre-commit with lint-staged', 'commit-msg with commitlint', 'Conventional Commits', 'CI still enforces'],
      code: ['bash', `npm i -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init                                            # creates .husky/pre-commit
echo "npx lint-staged" > .husky/pre-commit                # run on staged files
echo "npx --no -- commitlint --edit \\$1" > .husky/commit-msg # check message
# package.json:
# "lint-staged": { "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"], "*.{css,md,json}": "prettier --write" }
# commitlint.config.js: export default { extends: ['@commitlint/config-conventional'] };`],
      iq: [['Why lint-staged instead of linting everything on commit?', 'It only checks changed files, keeping commits fast.']],
      cq: [['Example Conventional Commit.', `git commit -m "feat(mock): add company-wise interview patterns"`]],
      err: ['Hooks that take minutes (people bypass them)']
    }),
    t('tool-biome-oxc', 'Rust-based Toolchain: Biome, Oxc, Rolldown, Turbopack, Rspack', 'I', {
      one: 'A new generation of frontend tools written in Rust (and Go) dramatically speeds up linting, formatting, transpiling and bundling.',
      ex: `Biome = formatter + linter in one fast binary (Prettier/ESLint alternative). Oxc (oxlint) = very fast linter and parser; Rolldown = Rust Rollup replacing Rollup/esbuild inside Vite; Turbopack = Next.js bundler; Rspack = Webpack-compatible bundler; Lightning CSS = CSS transformer; SWC = transpiler. Vite+ / VoidZero unify much of this.

Evaluate maturity and plugin needs before migrating large projects.`,
      pts: ['10–100× faster tooling', 'Biome = lint + format', 'Rolldown powers future Vite', 'Check plugin compatibility'],
      code: ['bash', `npx @biomejs/biome init                     # create biome.json
npx @biomejs/biome check --write ./src      # format + lint + organise imports
npx oxlint@latest                           # ultra-fast lint pass (can run before ESLint)`],
      iq: [['Why are Rust-based tools faster?', 'Native compiled code, parallelism and efficient memory use compared with JS-based tools running on Node.']],
      cq: [['Biome config basics.', `{ "formatter": { "indentStyle": "space" }, "linter": { "rules": { "recommended": true } } } // biome.json`]],
      err: ['Running two formatters that fight each other']
    })
  ),
  m('4. Scaling Codebases',
    t('tool-monorepos', 'Monorepos: workspaces, Nx, Turborepo', 'A', {
      one: 'A monorepo holds multiple apps and packages in one repository with shared tooling; workspaces link packages, and Nx/Turborepo add task caching, affected builds and dependency graphs.',
      ex: `Structure: apps/web, apps/admin, packages/ui, packages/config, packages/api-client. npm/pnpm/yarn workspaces symlink internal packages. Turborepo caches task outputs (local and remote) and runs tasks in dependency order; Nx adds generators, affected commands (only test what changed), module boundary rules and plugins for Angular/React/Next.

Benefits: atomic changes across apps, shared design system, consistent tooling. Costs: CI complexity, tooling knowledge.`,
      pts: ['apps/ + packages/', 'Workspaces link packages', 'Task caching + affected builds', 'Enforce boundaries'],
      dia: `flowchart TD
  R["monorepo"] --> A1["apps/web (Next.js)"]
  R --> A2["apps/admin (Angular)"]
  R --> P1["packages/ui"]
  R --> P2["packages/api-client"]
  A1 --> P1
  A1 --> P2
  A2 --> P2`,
      code: ['json', `// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "test": { "dependsOn": ["^build"] },
    "lint": {}
  }
}
// pnpm-workspace.yaml → packages: ["apps/*", "packages/*"]
// apps/web/package.json → "dependencies": { "@jagma/ui": "workspace:*" }`],
      iq: [['Monorepo vs polyrepo?', 'Monorepo: shared code/tooling and atomic cross-project changes; polyrepo: independent repos with separate versioning and simpler per-repo CI.']],
      cq: [['Run only affected projects in Nx.', `npx nx affected -t test build --base=origin/main   # test/build what changed`]],
      err: ['Circular dependencies between packages']
    }),
    t('tool-module-federation', 'Module Federation & Micro-frontend Builds', 'A', {
      one: 'Module Federation lets separately built and deployed applications load each other’s modules at runtime, sharing dependencies like React — a common way to implement micro-frontends.',
      ex: `A host (shell) declares remotes; remotes expose modules (./Checkout). Shared singletons (react, react-dom, design system) avoid duplicate copies; version mismatches need care. Module Federation 2.0 works with Webpack, Rspack and Vite (via plugins) and adds type hints and a runtime API.

Alternatives: build-time integration (packages), iframes, Web Components, import maps (single-spa / native ES modules).`,
      pts: ['Host loads remotes at runtime', 'Shared singleton dependencies', 'Independent deploys', 'Alternatives: import maps, web components'],
      flow: ['Shell loads remoteEntry.js', 'Negotiates shared deps', 'Imports exposed module', 'Renders remote component'],
      code: ['javascript', `// rspack/webpack config of the remote (checkout team)
new ModuleFederationPlugin({
  name: 'checkout',
  filename: 'remoteEntry.js',                       // manifest loaded by hosts
  exposes: { './Checkout': './src/Checkout.jsx' },  // public module
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } } // one React
});
// host (shell)
new ModuleFederationPlugin({
  name: 'shell',
  remotes: { checkout: 'checkout@https://checkout.example.com/remoteEntry.js' }, // runtime URL
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } }
});
// usage in host: const Checkout = React.lazy(() => import('checkout/Checkout'));`],
      iq: [['Main risks of Module Federation?', 'Shared dependency version conflicts, runtime failures if a remote is down, harder debugging and cross-team contract drift.']],
      cq: [['Fallback if a remote fails to load.', `const Checkout = lazy(() => import('checkout/Checkout').catch(() => ({ default: () => <p>Checkout unavailable</p> })));`]],
      err: ['Duplicate React instances across remotes']
    }),
    t('tool-devtools-debugging', 'Chrome DevTools & Debugging Mastery', 'I', {
      one: 'DevTools panels (Elements, Console, Sources, Network, Performance, Memory, Application, Lighthouse) plus breakpoints and framework devtools are the core debugging toolkit.',
      ex: `Sources: breakpoints, conditional/logpoints, DOM-change and XHR/fetch breakpoints, "Pause on exceptions", blackboxing library code, local overrides (edit production files). Console: $0 (selected element), copy(), monitorEvents, console.table/time. Network: throttling, block request, replay XHR, initiator chain. Application: storage, service workers, cache, manifest. Rendering tab: paint flashing, layout shift regions, emulate prefers-color-scheme/reduced motion.

React DevTools, Angular DevTools and Vue DevTools inspect component trees, props/state and profiling. VS Code can debug the browser directly.`,
      pts: ['Breakpoints > console.log', 'Network throttling and blocking', 'Application tab for storage/SW', 'Framework devtools for state'],
      code: ['javascript', `// Useful console helpers
$0                                   // currently selected element in Elements panel
copy(JSON.stringify(state, null, 2)) // copy data to clipboard
console.table(terms.slice(0, 5))      // tabular output
console.time('render'); render(); console.timeEnd('render'); // quick timing
monitorEvents(window, 'resize')      // log events on a target
debugger;                            // pause here when DevTools is open`],
      iq: [['How do you debug an event listener you can’t find?', 'Use Elements → Event Listeners panel, or Sources → Event Listener Breakpoints (e.g. Mouse → click).']],
      cq: [['Debug in VS Code.', `// .vscode/launch.json: { "type": "chrome", "request": "launch", "url": "http://localhost:5173", "webRoot": "\${workspaceFolder}/src" }`]],
      err: ['console.log-only debugging for complex async bugs']
    })
  )
];
