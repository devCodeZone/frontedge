// Testing — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Foundations',
    t('test-why-strategy', 'Why Test & Testing Strategy (pyramid, trophy)', 'B', {
      one: 'Tests give confidence to change code; a strategy balances fast unit tests, integration/component tests and a few end-to-end tests, plus static checks (TypeScript, ESLint).',
      ex: `Testing pyramid: many unit, fewer integration, few E2E. Kent C. Dodds' testing trophy emphasises integration tests for frontend: static analysis → unit → integration (most) → E2E. Write tests that resemble how users use the software, test behaviour not implementation, and cover critical user journeys (login, checkout) end-to-end.

Good tests are fast, deterministic (no flakiness), isolated and readable (Arrange–Act–Assert).`,
      pts: ['Static → unit → integration → E2E', 'Test behaviour, not internals', 'Critical flows end-to-end', 'Arrange–Act–Assert'],
      dia: `flowchart BT
  S["Static: TypeScript, ESLint"] --> U["Unit: pure functions, hooks"]
  U --> I["Integration: components + MSW (most value)"]
  I --> E["E2E: critical journeys in a real browser"]`,
      code: ['javascript', `import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';
describe('formatPrice', () => {
  it('formats paise as rupees', () => {
    // Arrange
    const paise = 49999;
    // Act
    const text = formatPrice(paise);
    // Assert
    expect(text).toBe('₹499.99');
  });
});`],
      iq: [['What should you test in a frontend app?', 'User-visible behaviour, critical flows, business logic, edge cases and accessibility — not implementation details.'],
           ['What is a flaky test?', 'A test that passes and fails intermittently without code changes, often due to timing, shared state or network.']],
      cq: [['Name a test by behaviour.', `it('disables Save while the form is submitting', ...) // describes what the user experiences`]],
      err: ['Testing private state and implementation details']
    }),
    t('test-vitest-jest', 'Unit Testing with Vitest/Jest: describe, it, expect, matchers', 'B', {
      one: 'Vitest (Vite-native) and Jest are test runners providing describe/it/expect, matchers, watch mode, coverage and mocking.',
      ex: `Matchers: toBe (===), toEqual (deep), toStrictEqual, toMatchObject, toContain, toHaveLength, toThrow, toBeCloseTo (floats), toHaveBeenCalledWith. Hooks: beforeEach/afterEach for setup/cleanup. it.each for table-driven tests. Environments: node or jsdom/happy-dom for DOM.

Vitest shares Vite config (aliases, plugins) and is fast; Jest is common in older React/Angular projects. Run vitest --coverage for reports.`,
      pts: ['describe / it / expect', 'toBe vs toEqual', 'it.each for tables', 'jsdom/happy-dom for DOM'],
      code: ['javascript', `import { describe, it, expect, beforeEach } from 'vitest';
import { slugify } from './slugify';
describe('slugify', () => {
  it.each([                                   // table-driven cases
    ['React Hooks', 'react-hooks'],
    ['  Next.js 15 ', 'next-js-15'],
    ['ES2025!', 'es2025']
  ])('slugify(%s) → %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);    // strict equality for strings
  });
  it('throws on non-strings', () => {
    expect(() => slugify(null)).toThrow(TypeError); // assert errors
  });
});`],
      iq: [['toBe vs toEqual?', 'toBe uses Object.is (same reference/value); toEqual recursively compares structure.']],
      cq: [['vitest config with jsdom.', `// vitest.config.js
export default { test: { environment: 'jsdom', setupFiles: ['./test/setup.js'], coverage: { provider: 'v8' } } };`]],
      err: ['Using toBe for objects/arrays']
    }),
    t('test-mocking', 'Mocks, Spies, Stubs & Fake Timers', 'I', {
      one: 'Test doubles replace real dependencies: spies observe calls, stubs return canned values, mocks replace modules; fake timers control setTimeout/Date.',
      ex: `vi.fn()/jest.fn() creates mock functions; vi.spyOn(obj, 'method') wraps real methods; vi.mock('./api') replaces modules. mockResolvedValue for async functions. vi.useFakeTimers() + vi.advanceTimersByTime(300) tests debounce; vi.setSystemTime for dates.

Mock at boundaries (network, time, randomness), not internal functions. Over-mocking produces tests that pass while the app is broken. Restore mocks after each test.`,
      pts: ['vi.fn / spyOn / mock', 'Mock boundaries (network, time)', 'Fake timers for debounce', 'Restore after each test'],
      code: ['javascript', `import { vi, it, expect, afterEach } from 'vitest';
import { debounce } from './debounce';
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); }); // clean state
it('calls once after the wait', () => {
  vi.useFakeTimers();                         // control time
  const fn = vi.fn();                         // mock function (spy)
  const d = debounce(fn, 300);
  d('a'); d('b'); d('c');                     // rapid calls
  expect(fn).not.toHaveBeenCalled();          // nothing yet
  vi.advanceTimersByTime(300);                // jump forward 300ms
  expect(fn).toHaveBeenCalledTimes(1);        // called once
  expect(fn).toHaveBeenCalledWith('c');       // with the last args
});`],
      iq: [['Mock vs stub vs spy?', 'Spy records calls (optionally to the real implementation); stub returns predefined responses; mock is a replaced implementation with expectations.']],
      cq: [['Mock an API module.', `vi.mock('./api', () => ({ getTerms: vi.fn().mockResolvedValue([{ id: 'a', name: 'ref' }]) })); // module replaced`]],
      err: ['Mocking the thing you are testing']
    }),
    t('test-async', 'Testing Async Code', 'I', {
      one: 'Test promises with async/await and resolves/rejects matchers, wait for UI updates with findBy/waitFor, and control timers and network deterministically.',
      ex: `Always await async assertions (forgetting await makes tests pass falsely). await expect(promise).rejects.toThrow('msg'). In UI tests use findBy* (polls until found) or waitFor for assertions that eventually pass. Avoid arbitrary sleeps; mock network with MSW and timers with fake timers.`,
      pts: ['Always await', 'resolves / rejects matchers', 'findBy / waitFor for UI', 'No arbitrary sleeps'],
      code: ['javascript', `import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
it('rejects on 404', async () => {
  await expect(fetchTerm('missing')).rejects.toThrow('Not found'); // awaited rejection
});
it('shows loaded terms', async () => {
  render(<TermList />);                                         // starts fetching (mocked by MSW)
  expect(screen.getByText(/loading/i)).toBeInTheDocument();     // initial state
  expect(await screen.findByText('Closures')).toBeInTheDocument(); // waits for data
});`],
      iq: [['Why might an async test pass incorrectly?', 'The assertion isn’t awaited, so the test finishes before the promise rejects.']],
      cq: [['waitFor an element to disappear.', `await waitForElementToBeRemoved(() => screen.queryByText(/loading/i)); // until spinner is gone`]],
      err: ['setTimeout sleeps in tests']
    })
  ),
  m('2. Component & Integration Testing',
    L('test-rtl-playwright'),
    t('test-testing-library', 'Testing Library Queries & user-event', 'I', {
      one: 'Testing Library renders components and queries them like users do (getByRole, getByLabelText, getByText), with user-event simulating realistic interactions.',
      ex: `Query priority: getByRole (with name) > getByLabelText > getByPlaceholderText > getByText > getByDisplayValue > getByAltText > getByTitle > getByTestId (last resort). Variants: getBy (throws if missing), queryBy (returns null — for asserting absence), findBy (async), *AllBy for multiple.

userEvent.setup() then await user.type / click / keyboard / tab simulates full event sequences. jest-dom matchers: toBeInTheDocument, toBeVisible, toBeDisabled, toHaveAccessibleName. Available for React, Angular, Vue, Svelte.`,
      pts: ['Prefer getByRole with name', 'queryBy for absence', 'findBy for async', 'user-event over fireEvent'],
      code: ['jsx', `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
it('filters terms as the user types', async () => {
  const user = userEvent.setup();
  render(<SearchableTerms terms={[{ id: '1', name: 'Closures' }, { id: '2', name: 'Promises' }]} />);
  await user.type(screen.getByRole('searchbox', { name: /search/i }), 'clo'); // realistic typing
  expect(screen.getByRole('listitem')).toHaveTextContent('Closures');         // one result
  expect(screen.queryByText('Promises')).not.toBeInTheDocument();            // absence via queryBy
});`],
      iq: [['getBy vs queryBy vs findBy?', 'getBy throws if not found, queryBy returns null (absence checks), findBy returns a promise that waits.'],
           ['Why prefer getByRole?', 'It matches how assistive technology sees the page and verifies accessible names.']],
      cq: [['Test keyboard navigation.', `await user.tab(); expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus(); // focus order`]],
      err: ['data-testid everywhere']
    }),
    t('test-msw', 'Mock Service Worker (MSW) for API Mocking', 'I', {
      one: 'MSW intercepts network requests at the network level (service worker in the browser, interceptors in Node) so tests, Storybook and local development use realistic mocked APIs.',
      ex: `Define handlers with http.get('/api/terms', () => HttpResponse.json([...])). Use setupServer in tests (Node) and setupWorker in the browser. Override per test (server.use) for error/empty states. Your app code stays unchanged — fetch/axios/GraphQL all work.

Great for building frontend before backend is ready, and for testing loading/error paths deterministically.`,
      pts: ['Network-level interception', 'Same handlers for tests, dev, Storybook', 'server.use for per-test overrides', 'No app code changes'],
      code: ['javascript', `import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
export const handlers = [
  http.get('/api/terms', async ({ request }) => {
    const q = new URL(request.url).searchParams.get('q') ?? '';
    await delay(100);                                         // realistic latency
    return HttpResponse.json([{ id: 'js-closures', name: 'Closures' }].filter((t) => t.name.toLowerCase().includes(q)));
  })
];
export const server = setupServer(...handlers);
// test/setup.js
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));  // fail on unmocked calls
afterEach(() => server.resetHandlers());                           // remove per-test overrides
afterAll(() => server.close());
// in a test: server.use(http.get('/api/terms', () => HttpResponse.json({ msg: 'down' }, { status: 500 })));`],
      iq: [['Why MSW instead of mocking fetch?', 'It intercepts real requests so your code under test stays unchanged and works with any HTTP client.']],
      cq: [['Mock a GraphQL query.', `import { graphql } from 'msw';
graphql.query('Terms', () => HttpResponse.json({ data: { terms: [] } })); // by operation name`]],
      err: ['Allowing unhandled real requests in tests']
    }),
    t('test-hooks-components-frameworks', 'Testing Hooks, Components & Framework Specifics', 'I', {
      one: 'Test custom hooks with renderHook, components with providers (router, store, query client), and framework specifics like Angular TestBed or Vue Test Utils.',
      ex: `Create a renderWithProviders helper that wraps components in QueryClientProvider, Router (MemoryRouter), Theme and Store so tests mirror the app. renderHook(() => useCounter()) with act() for state updates. Reset stores and query caches between tests.

For Server Components and complex routing prefer E2E. Snapshot tests should be small and intentional.`,
      pts: ['renderWithProviders helper', 'renderHook for custom hooks', 'Fresh QueryClient per test', 'E2E for server components'],
      code: ['jsx', `import { renderHook, act, render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';
export function renderWithProviders(ui, { route = '/' } = {}) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } }); // fresh cache, no retries
  return render(
    <QueryClientProvider client={qc}><MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter></QueryClientProvider>
  );
}
it('useToggle toggles', () => {
  const { result } = renderHook(() => useToggle(false));  // render the hook
  act(() => result.current.toggle());                      // state update inside act
  expect(result.current.on).toBe(true);
});`],
      iq: [['Why disable retries in test QueryClients?', 'Retries delay failure tests and cause timeouts; tests should fail fast and deterministically.']],
      cq: [['Test a component that reads route params.', `renderWithProviders(<Routes><Route path="/term/:id" element={<TermPage />} /></Routes>, { route: '/term/js-closures' });`]],
      err: ['Shared QueryClient leaking cache between tests']
    }),
    t('test-snapshot-visual', 'Snapshot & Visual Regression Testing', 'I', {
      one: 'Snapshot tests store serialised output and flag changes; visual regression tests compare screenshots (Playwright, Chromatic, Percy) to catch unintended UI changes.',
      ex: `Jest/Vitest snapshots are cheap but large snapshots get blindly updated — keep them small (inline snapshots for formatted values). Visual regression captures pixels across browsers/viewports; Playwright's toHaveScreenshot compares against baselines, Chromatic integrates with Storybook.

Stabilise visuals: fixed data, disabled animations, consistent fonts and masks for dynamic regions (dates, ads).`,
      pts: ['Small inline snapshots', 'Screenshot diffs for UI', 'Stabilise dynamic content', 'Review diffs, don’t blindly update'],
      code: ['javascript', `import { test, expect } from '@playwright/test';
test('term card looks right', async ({ page }) => {
  await page.goto('/term/js-closures');
  await page.emulateMedia({ reducedMotion: 'reduce' });            // disable animations
  await expect(page.locator('.term-head')).toHaveScreenshot('term-head.png', {
    mask: [page.locator('time')],                                  // hide dynamic dates
    maxDiffPixelRatio: 0.01                                        // tolerate tiny differences
  });
});
// Unit inline snapshot:
// expect(formatPrice(49999)).toMatchInlineSnapshot('"₹499.99"');`],
      iq: [['Downside of large snapshot tests?', 'They are noisy, rarely reviewed and get updated without thought, so they catch few real bugs.']],
      cq: [['Update Playwright baselines intentionally.', `npx playwright test --update-snapshots   # after reviewing intended UI changes`]],
      err: ['Snapshotting entire pages in unit tests']
    }),
    t('test-accessibility', 'Accessibility Testing (axe, Testing Library, manual)', 'I', {
      one: 'Automate accessibility checks with axe (jest-axe, @axe-core/playwright), query by roles in tests, and complement with manual keyboard and screen-reader testing.',
      ex: `Automated tools catch ~30–50% of issues (contrast, missing labels, invalid ARIA, landmark problems). Run axe in component tests and E2E pages in CI. Manual testing: tab through every flow, check focus visibility and order, use NVDA/VoiceOver, zoom to 200%, test reduced motion and forced colours.`,
      pts: ['axe in unit and E2E tests', 'Role queries double as a11y checks', 'Manual keyboard + screen reader', 'Automation catches only part'],
      code: ['javascript', `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('home page has no detectable a11y violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])        // WCAG levels to check
    .analyze();
  expect(results.violations).toEqual([]);              // fail on any violation
});`],
      iq: [['Can automated tools guarantee accessibility?', 'No — they find a subset of issues; manual keyboard and screen-reader testing is essential.']],
      cq: [['jest-axe in a component test.', `import { axe } from 'jest-axe';
const { container } = render(<SignupForm />); expect(await axe(container)).toHaveNoViolations();`]],
      err: ['Relying only on Lighthouse a11y score']
    })
  ),
  m('3. End-to-End & Process',
    t('test-playwright-e2e', 'End-to-End Testing with Playwright', 'I', {
      one: 'Playwright drives real Chromium, Firefox and WebKit to test complete user journeys with auto-waiting locators, network control, tracing and parallel runs.',
      ex: `Locators (getByRole, getByLabel, getByText) auto-wait for elements to be actionable; web-first assertions (toBeVisible, toHaveURL) retry until timeout — no manual sleeps. Reuse login via storageState, mock or route network calls (page.route), test multiple viewports/devices, and debug with UI mode and the trace viewer.

Run critical flows on every PR and the full suite nightly. Cypress is an alternative with an interactive runner.`,
      pts: ['Auto-waiting locators', 'Web-first assertions', 'storageState for auth', 'Trace viewer for debugging'],
      code: ['javascript', `import { test, expect } from '@playwright/test';
test.use({ storageState: 'e2e/.auth/user.json' });                 // already logged in
test('user takes a mock test', async ({ page }) => {
  await page.goto('/#/mock');
  await page.getByRole('button', { name: 'By company' }).click();  // choose mode
  await page.getByLabel('Company').selectOption('tcs');            // select TCS
  await page.getByRole('button', { name: 'Start test' }).click();
  await page.locator('.option').first().click();                   // answer Q1
  await expect(page.locator('.why')).toBeVisible();                // explanation appears (auto-wait)
});
test('shows error state when API fails', async ({ page }) => {
  await page.route('**/api/news*', (r) => r.fulfill({ status: 500 })); // mock failure
  await page.goto('/#/news');
  await expect(page.getByText(/isn't available/i)).toBeVisible();
});`],
      iq: [['How does Playwright avoid flaky waits?', 'Locators auto-wait for actionability and assertions retry until they pass or time out.']],
      cq: [['Generate tests by recording.', `npx playwright codegen http://localhost:5173   # records actions into test code`]],
      err: ['page.waitForTimeout sleeps', 'Testing everything only via E2E']
    }),
    t('test-cypress', 'Cypress', 'B', {
      one: 'Cypress is an E2E and component testing tool running inside the browser with a time-travel debugger, automatic waiting and network stubbing.',
      ex: `cy.visit, cy.get / cy.findByRole (Testing Library plugin), .click, .type, .should('be.visible'). cy.intercept stubs or spies on network requests. Commands are chained and asynchronous (not promises). Component testing mounts React/Angular/Vue components in a real browser.

Trade-offs vs Playwright: great DX/debugging, but historically limited multi-tab/origin support and slower parallelisation (improved over time).`,
      pts: ['Runs in the browser', 'cy.intercept for network', 'Time-travel debugging', 'Component testing mode'],
      code: ['javascript', `describe('Search', () => {
  it('finds a term', () => {
    cy.intercept('GET', '/api/terms*', { fixture: 'terms.json' }).as('terms'); // stub API
    cy.visit('/');
    cy.get('input[aria-label="Search terms"]').type('closure');               // type
    cy.wait('@terms');                                                         // wait for stubbed call
    cy.contains('Closures').should('be.visible').click();                      // assert + click
    cy.url().should('include', '/term/js-closures');                           // navigation happened
  });
});`],
      iq: [['Cypress vs Playwright?', 'Both do E2E; Playwright supports more browsers (WebKit), multi-tab and parallelism out of the box; Cypress offers an interactive in-browser runner and time-travel debugging.']],
      cq: [['Custom login command.', `Cypress.Commands.add('login', () => cy.request('POST', '/api/test-login').then(() => cy.visit('/')));`]],
      err: ['Using cy.wait(5000) instead of aliases']
    }),
    t('test-coverage-tdd', 'Coverage, TDD/BDD & Testing in CI', 'I', {
      one: 'Coverage measures executed code (not quality); TDD writes tests first (red–green–refactor); BDD describes behaviour in business language; CI runs tests on every change.',
      ex: `Aim for meaningful coverage of logic and critical paths rather than 100%. Coverage thresholds in CI prevent drops. TDD shines for pure logic (utilities, reducers, validators). BDD tools (Cucumber/Gherkin) map "Given/When/Then" scenarios to steps.

CI: run lint + typecheck + unit tests on every PR, E2E against preview deployments, shard large suites, retry flaky tests sparingly and fix root causes.`,
      pts: ['Coverage ≠ quality', 'Red → green → refactor', 'Given/When/Then', 'Tests gate every PR'],
      flow: ['Red: write failing test', 'Green: minimal code to pass', 'Refactor safely', 'Repeat'],
      code: ['yaml', `# .github/workflows/test.yml
name: test
on: [pull_request]
jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx vitest run --coverage            # unit + coverage
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npx playwright install --with-deps
      - run: npx playwright test --shard=1/2      # split across machines`],
      iq: [['Is 100% coverage a good goal?', 'Not usually — it encourages testing trivial code; focus on critical logic and behaviour.'],
           ['What is TDD?', 'Test-Driven Development: write a failing test, implement the minimum to pass, then refactor.']],
      cq: [['Enforce coverage thresholds.', `// vitest.config.js → test: { coverage: { thresholds: { lines: 80, branches: 70 } } }`]],
      err: ['Ignoring flaky tests by retrying forever']
    }),
    t('test-storybook', 'Storybook: component development, docs & interaction tests', 'I', {
      one: 'Storybook renders components in isolation as "stories" for development, documentation, visual review and interaction/accessibility testing.',
      ex: `Each story captures a component state (Default, Loading, Error, Long text). Args/controls let designers tweak props; autodocs generate documentation. Play functions script interactions (fill a form) and run as tests with the test runner/Vitest addon; a11y and visual testing (Chromatic) integrate.

Essential for design systems and teams collaborating with designers (Figma links).`,
      pts: ['Stories = component states', 'Controls + autodocs', 'Play functions as tests', 'Design system workbench'],
      code: ['jsx', `// TermCard.stories.jsx
import { expect, userEvent, within } from 'storybook/test';
import { TermCard } from './TermCard';
export default { title: 'Learn/TermCard', component: TermCard, tags: ['autodocs'] }; // docs page
export const Default = { args: { term: { id: 'js-closures', name: 'Closures', level: 'Intermediate', one: 'A function that remembers…' } } };
export const LongName = { args: { term: { ...Default.args.term, name: 'Very long term name that should wrap nicely on small screens' } } };
export const SaveFlow = {
  args: Default.args,
  play: async ({ canvasElement }) => {                       // interaction test
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /save/i }));
    await expect(canvas.getByRole('button', { name: /saved/i })).toBeInTheDocument();
  }
};`],
      iq: [['Why use Storybook?', 'To build, document and test UI components in isolation across all states, improving reuse and design collaboration.']],
      cq: [['Run Storybook tests in CI.', `npx storybook build && npx concurrently -k "npx http-server storybook-static -p 6006" "npx wait-on tcp:6006 && npx test-storybook"`]],
      err: ['Stories that depend on real APIs']
    })
  )
];
