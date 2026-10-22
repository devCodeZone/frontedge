// Accessibility — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import eng from '../terms/engineering.js';
const L = legacyPicker(eng);

export default [
  m('1. Foundations',
    t('a11y-why-wcag', 'Why Accessibility Matters & WCAG (POUR, levels)', 'B', {
      one: 'Accessibility (a11y) makes products usable by people with disabilities; WCAG defines testable success criteria grouped under Perceivable, Operable, Understandable and Robust (POUR) at levels A, AA and AAA.',
      ex: `Over a billion people have disabilities (visual, auditory, motor, cognitive), and everyone benefits situationally (bright sunlight, broken arm, noisy train). Many laws require WCAG 2.1/2.2 AA: ADA (US), EAA (EU, from June 2025), Section 508, India's RPwD Act and GIGW guidelines for government sites.

AA is the usual target. Accessibility also improves SEO, usability and code quality. Build it in from design — retrofitting is expensive.`,
      pts: ['POUR principles', 'Target WCAG 2.2 AA', 'Legal requirements (ADA, EAA, RPwD)', 'Shift left: design + code'],
      dia: `flowchart LR
  P["Perceivable: alt text, captions, contrast"] --> O["Operable: keyboard, time, no seizures"]
  O --> U["Understandable: clear labels, predictable, errors"]
  U --> R["Robust: valid semantics, works with AT"]`,
      code: ['html', `<!-- Small changes, big impact -->
<html lang="en">                                         <!-- correct pronunciation -->
<img src="chart.png" alt="Signups grew 40% in Q3">       <!-- Perceivable -->
<button>Save changes</button>                            <!-- Operable: real button, keyboard ready -->
<label for="email">Email</label><input id="email" type="email" aria-describedby="e-hint">
<p id="e-hint">We'll send your certificate here.</p>     <!-- Understandable -->`],
      iq: [['What does POUR stand for?', 'Perceivable, Operable, Understandable, Robust — the four WCAG principles.'],
           ['Which WCAG level do most organisations target?', 'Level AA of WCAG 2.1 or 2.2.']],
      cq: [['Quick audit command.', `npx @axe-core/cli https://frontedge.vercel.app --tags wcag2aa   # automated WCAG AA check`]],
      err: ['Treating accessibility as a final QA step']
    }),
    t('a11y-semantic-structure', 'Semantic HTML, Landmarks & Headings for Accessibility', 'B', {
      one: 'Native semantic elements give assistive technology roles, names and states for free; landmarks and a logical heading outline let screen-reader users navigate quickly.',
      ex: `Screen-reader users jump by headings (H key), landmarks (D/R keys) and form controls. Use header, nav (with aria-label when multiple), main, aside, footer, section with heading, one h1 and nested headings. Lists announce item counts; tables need th/scope/caption.

The accessibility tree is derived from the DOM; CSS display:none/visibility:hidden remove nodes; aria-hidden removes from AT only.`,
      pts: ['Landmarks for navigation', 'Logical heading levels', 'Lists/tables with proper markup', 'Accessibility tree from DOM'],
      code: ['html', `<header><a href="#main" class="skip-link">Skip to content</a></header>  <!-- skip link -->
<nav aria-label="Primary">…</nav>                                         <!-- labelled landmark -->
<main id="main" tabindex="-1">                                            <!-- skip target -->
  <h1>React Track</h1>
  <section aria-labelledby="hooks-h"><h2 id="hooks-h">Hooks</h2>…</section> <!-- named region -->
</main>
<footer>…</footer>`],
      iq: [['How do screen-reader users navigate pages?', 'By headings, landmarks, links and form controls lists — not by reading everything linearly.']],
      cq: [['Visible-on-focus skip link CSS.', `.skip-link { position: absolute; left: -9999px; } .skip-link:focus { left: 16px; top: 16px; } /* appears when tabbed to */`]],
      err: ['Divs styled as headings']
    }),
    L('a11y-aria'),
    t('a11y-accessible-names', 'Accessible Names & Descriptions', 'I', {
      one: 'Every interactive element needs an accessible name (what it is called) computed from content, labels, aria-labelledby, aria-label, alt or title; descriptions add extra context.',
      ex: `Name computation order (simplified): aria-labelledby > aria-label > native label (label/for, alt, caption, legend) > text content > title. Icon-only buttons need aria-label (or visually hidden text). Names should be concise and match visible text (WCAG 2.5.3 Label in Name — voice users say what they see).

aria-describedby links hints/errors. Check names in DevTools' Accessibility pane.`,
      pts: ['Every control needs a name', 'Icon buttons need aria-label', 'Name should include visible text', 'aria-describedby for hints'],
      code: ['html', `<button aria-label="Close dialog"><svg aria-hidden="true">…</svg></button>  <!-- icon-only button -->
<button><svg aria-hidden="true">…</svg><span class="sr-only">Delete term</span></button> <!-- hidden text name -->
<h2 id="pricing">Pricing</h2>
<section aria-labelledby="pricing">…</section>                               <!-- name from heading -->
<input id="pw" type="password" aria-describedby="pw-rules">
<p id="pw-rules">At least 8 characters with a number.</p>                     <!-- description -->`],
      iq: [['aria-label vs aria-labelledby?', 'aria-label provides a string; aria-labelledby references existing visible element(s) whose text becomes the name (preferred when visible text exists).']],
      cq: [['Find buttons without names (console).', `[...document.querySelectorAll('button, [role=button], a[href]')].filter((el) => !el.textContent.trim() && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')).forEach((el) => console.warn('Unnamed', el));`]],
      err: ['aria-label that differs from visible text']
    })
  ),
  m('2. Interaction',
    t('a11y-keyboard', 'Keyboard Accessibility & Focus Order', 'B', {
      one: 'Everything must work with a keyboard: reachable with Tab, operable with Enter/Space/arrow keys, in a logical order, with a clearly visible focus indicator and no keyboard traps.',
      ex: `Use native elements (button, a, input) for built-in keyboard support. tabindex="0" adds custom widgets to the tab order; tabindex="-1" allows programmatic focus; avoid positive values. DOM order should match visual order (beware CSS order/grid reordering).

Composite widgets (tabs, menus, listboxes, grids) use a roving tabindex: one Tab stop, arrows move inside. Visible focus: :focus-visible styles with sufficient contrast; WCAG 2.2 adds Focus Not Obscured (sticky headers mustn't hide focused elements).`,
      pts: ['Native elements first', 'Logical DOM order', 'Visible :focus-visible', 'Roving tabindex for widgets'],
      code: ['javascript', `// Roving tabindex for a toolbar: one Tab stop, arrows move focus
const buttons = [...document.querySelectorAll('[role="toolbar"] button')];
buttons.forEach((b, i) => (b.tabIndex = i === 0 ? 0 : -1));   // only first is tabbable
document.querySelector('[role="toolbar"]').addEventListener('keydown', (e) => {
  const i = buttons.indexOf(document.activeElement);
  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1
    : (i + (e.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length; // wrap around
  buttons[i].tabIndex = -1; buttons[next].tabIndex = 0;       // move the tab stop
  buttons[next].focus();                                       // move focus
});`],
      iq: [['What is a keyboard trap?', 'A component where focus can enter but not leave using the keyboard (WCAG failure), except intended modal focus trapping with an exit.'],
           ['What is a roving tabindex?', 'A pattern where only one item in a composite widget has tabindex 0 and arrow keys move focus among items.']],
      cq: [['Accessible focus style.', `:focus-visible { outline: 3px solid #1d4ed8; outline-offset: 2px; } /* high contrast, not removed */`]],
      err: ['outline: none without replacement', 'Clickable divs']
    }),
    t('a11y-focus-management', 'Focus Management in SPAs, Modals & Dynamic Content', 'I', {
      one: 'Move focus deliberately when UI changes: into dialogs and back to the trigger on close, to new page headings after client-side navigation, and to errors after failed submits.',
      ex: `SPAs don't reload, so screen-reader users may not know the page changed: on route change, focus the main h1 (tabindex="-1") or announce the title. Modals: focus the first field or the dialog, trap focus inside (native <dialog> does), Esc closes, return focus to the opener. Deleting an item: move focus to the next item or the list heading. Form errors: focus the first invalid field or an error summary.

The inert attribute disables interaction with background content.`,
      pts: ['Focus heading on route change', 'Dialogs: trap + restore focus', 'Error summary focus', 'inert for background'],
      flow: ['User opens dialog', 'Save trigger element', 'Focus inside dialog', 'Background inert', 'Close: restore focus to trigger'],
      code: ['jsx', `function useRouteFocus(pathname) {
  useEffect(() => {
    const h1 = document.querySelector('main h1');
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: false }); } // announce new page
  }, [pathname]);
}
function DeleteButton({ onDelete, nextFocusRef }) {
  return <button onClick={async () => { await onDelete(); nextFocusRef.current?.focus(); }}>Delete</button>; // don't lose focus
}`],
      iq: [['Why focus management after route changes?', 'Without a page load, assistive tech isn’t notified; focusing the new heading orients users.']],
      cq: [['Return focus after closing a modal.', `const opener = document.activeElement; dialog.showModal(); dialog.addEventListener('close', () => opener.focus(), { once: true });`]],
      err: ['Focus lost to <body> after deleting an item']
    }),
    t('a11y-forms', 'Accessible Forms & Error Handling', 'B', {
      one: 'Accessible forms have visible labels, grouped related fields, clear instructions, accessible error messages linked to fields and don’t rely on colour alone.',
      ex: `Label every input; group radios with fieldset/legend; mark required fields in text (not just *); put hints before or linked to inputs; validate on submit (or blur) rather than every keystroke; link errors with aria-describedby and aria-invalid="true"; provide an error summary with links; announce async results with live regions.

WCAG 2.2 adds Redundant Entry (don't ask for the same info twice) and Accessible Authentication (allow paste/password managers, no cognitive puzzles).`,
      pts: ['Visible labels always', 'aria-invalid + aria-describedby errors', 'Error summary with links', 'Allow paste and autofill'],
      code: ['html', `<form novalidate>
  <div role="alert" id="summary" tabindex="-1" hidden>          <!-- error summary, focused on failure -->
    <h2>Please fix 1 error</h2><a href="#email">Enter a valid email</a>
  </div>
  <label for="email">Email (required)</label>
  <input id="email" type="email" autocomplete="email" required
         aria-invalid="true" aria-describedby="email-err">       <!-- linked error -->
  <p id="email-err" class="error">Enter a valid email like name@example.com</p>
  <button>Create account</button>
</form>`],
      iq: [['How should form errors be announced?', 'Link messages to fields (aria-describedby), set aria-invalid, focus the first error or a summary, and avoid colour-only indicators.']],
      cq: [['Focus the error summary after validation fails.', `summary.hidden = false; summary.focus(); // screen readers read it immediately (role=alert)`]],
      err: ['Placeholder-only labels', 'Disabling paste in password fields']
    }),
    t('a11y-widget-patterns', 'Accessible Widget Patterns (ARIA APG): tabs, menus, combobox, modal', 'A', {
      one: 'The WAI-ARIA Authoring Practices Guide (APG) defines roles, states and keyboard behaviour for custom widgets like tabs, menus, comboboxes, accordions, dialogs, tooltips and carousels.',
      ex: `Tabs: role=tablist/tab/tabpanel, aria-selected, aria-controls, arrows switch tabs. Combobox (autocomplete): input role=combobox, aria-expanded, aria-controls listbox, aria-activedescendant for highlighted option, Enter selects, Esc closes. Menu buttons: aria-haspopup, aria-expanded. Tooltips appear on focus and hover, dismiss on Esc.

Prefer headless accessible libraries (Radix, React Aria, Angular CDK, Headless UI) over hand-rolling complex widgets.`,
      pts: ['Follow APG patterns', 'Roles + states + keyboard', 'aria-activedescendant for comboboxes', 'Use proven headless libraries'],
      code: ['jsx', `function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  const onKey = (e) => {
    if (e.key === 'ArrowRight') setActive((a) => (a + 1) % tabs.length);              // next tab
    if (e.key === 'ArrowLeft') setActive((a) => (a - 1 + tabs.length) % tabs.length); // previous tab
  };
  return (<>
    <div role="tablist" aria-label="Term sections" onKeyDown={onKey}>
      {tabs.map((t, i) => (
        <button key={t.id} role="tab" id={'tab-' + t.id} aria-selected={i === active}
          aria-controls={'panel-' + t.id} tabIndex={i === active ? 0 : -1}        // roving tabindex
          onClick={() => setActive(i)} ref={(el) => i === active && el?.focus()}>{t.label}</button>
      ))}
    </div>
    <div role="tabpanel" id={'panel-' + tabs[active].id} aria-labelledby={'tab-' + tabs[active].id} tabIndex={0}>
      {tabs[active].content}
    </div>
  </>);
}`],
      iq: [['What is aria-activedescendant?', 'An attribute that tells AT which descendant option is active while DOM focus stays on the container/input (used in comboboxes and listboxes).']],
      cq: [['Disclosure (accordion) button attributes.', `<button aria-expanded="false" aria-controls="faq1">What is a closure?</button><div id="faq1" hidden>…</div>`]],
      err: ['Adding role=menu to site navigation links']
    }),
    t('a11y-live-regions', 'Live Regions & Dynamic Announcements', 'I', {
      one: 'ARIA live regions (aria-live, role="status", role="alert") announce dynamic content changes like toasts, form results, loading states and chat messages to screen-reader users.',
      ex: `The live region must exist in the DOM before content changes. polite waits for the user to pause; assertive interrupts (use sparingly — errors only). role="status" = polite, role="alert" = assertive. Keep messages short; don't announce every keystroke or streaming token (announce on completion or in chunks).

Frameworks offer helpers: Angular CDK LiveAnnouncer, React Aria announce.`,
      pts: ['Region must pre-exist', 'polite vs assertive', 'role=status / role=alert', 'Don’t over-announce'],
      code: ['jsx', `function useAnnouncer() {
  const [msg, setMsg] = useState('');
  const announce = (text) => { setMsg(''); setTimeout(() => setMsg(text), 50); }; // reset so repeats are read
  const region = <div role="status" aria-live="polite" className="sr-only">{msg}</div>; // render once, always
  return { announce, region };
}
function SaveButton() {
  const { announce, region } = useAnnouncer();
  return <>{region}<button onClick={async () => { await save(); announce('Term saved to your list'); }}>Save</button></>;
}`],
      iq: [['Why might a live region not announce?', 'It was added to the DOM at the same time as its content, or the content didn’t change.']],
      cq: [['Announce search result count.', `<p role="status">{results.length} results for “{query}”</p> {/* updates politely */}`]],
      err: ['aria-live="assertive" for routine updates']
    })
  ),
  m('3. Visual & Media',
    t('a11y-color-contrast', 'Colour Contrast & Use of Colour', 'B', {
      one: 'Text needs sufficient contrast with its background (4.5:1 normal, 3:1 large text and UI components), and colour must never be the only way to convey information.',
      ex: `Check contrast with DevTools colour picker, axe or WebAIM. Large text = 24px regular or 18.66px bold. UI components (input borders, icons, focus rings) need 3:1. Don't indicate errors only with red, links only with colour, or chart series only by hue — add text, icons, underlines or patterns.

Design tokens should bake in accessible pairings for light and dark themes. APCA is a newer contrast model under discussion for future WCAG.`,
      pts: ['4.5:1 body text', '3:1 large text and UI', 'Never colour alone', 'Accessible token pairs'],
      code: ['javascript', `// Relative luminance contrast ratio (WCAG 2.x formula)
function luminance(hex) {
  const [r, g, b] = hex.match(/\\w\\w/g).map((h) => parseInt(h, 16) / 255) // 0..1 channels
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); // linearise
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;                           // weighted sum
}
function contrast(a, b) {
  const [L1, L2] = [luminance(a), luminance(b)].sort((x, y) => y - x);   // lighter first
  return ((L1 + 0.05) / (L2 + 0.05)).toFixed(2);                         // ratio
}
console.log(contrast('#8f99ad', '#0f1115'));   // check muted text on dark background`],
      iq: [['What contrast does body text need for AA?', 'At least 4.5:1 (3:1 for large text).']],
      cq: [['Error state not relying on colour.', `<p class="error"><svg aria-hidden="true">⚠</svg> Error: Enter a valid email</p> <!-- icon + text + colour -->`]],
      err: ['Light grey text on white']
    }),
    t('a11y-images-media', 'Accessible Images, Icons, Video & Audio', 'B', {
      one: 'Provide text alternatives for images, hide decorative ones, caption videos, transcribe audio, avoid auto-playing media and give users control over motion.',
      ex: `alt describes purpose (empty for decorative). Complex images (charts) need longer descriptions (adjacent text or a data table). SVG icons: aria-hidden="true" when decorative; role="img" + label when meaningful. Video: captions (WebVTT), audio description for important visuals, accessible player controls. Audio: transcripts.

No flashing more than 3 times per second; pause/stop controls for auto-moving content (carousels) longer than 5 seconds.`,
      pts: ['Meaningful alt or empty alt', 'Charts need text/data alternatives', 'Captions + transcripts', 'Pause controls for motion'],
      code: ['html', `<figure>
  <img src="vitals-chart.png" alt="Bar chart of Core Web Vitals; details in the table below">
  <figcaption>LCP improved from 3.8s to 2.1s after image optimisation.</figcaption>
</figure>
<table><caption>Core Web Vitals before and after</caption>…</table>   <!-- data alternative -->
<button class="carousel-pause" aria-pressed="false">Pause slideshow</button> <!-- user control -->
<video controls><track kind="captions" src="intro.vtt" srclang="en" label="English" default></video>`],
      iq: [['How do you make a chart accessible?', 'Provide a text summary of key insights and the underlying data (table), ensure colours aren’t the only differentiator, and support keyboard focus for interactive points.']],
      cq: [['Decorative inline SVG.', `<svg aria-hidden="true" focusable="false">…</svg> <!-- ignored by screen readers -->`]],
      err: ['alt="image" or file names as alt text']
    }),
    t('a11y-responsive-zoom-motion', 'Zoom, Reflow, Target Size & Motion', 'I', {
      one: 'Content must work at 200% text zoom and 400% page zoom (reflow without horizontal scrolling at 320px), touch targets need adequate size (24×24px minimum, 44px recommended), and motion should respect user preferences.',
      ex: `Use relative units, flexible layouts and avoid fixed heights that clip text. Don't disable pinch zoom. WCAG 2.2 Target Size (Minimum) requires 24×24 CSS px (or spacing). Respect prefers-reduced-motion for parallax, auto-animations and transitions; avoid vestibular triggers. Text spacing overrides (line-height 1.5, letter-spacing) must not break layouts.`,
      pts: ['Reflow at 320px', 'Never block zoom', '24px min targets (44 ideal)', 'Respect reduced motion'],
      code: ['css', `.icon-btn { min-width: 44px; min-height: 44px; display: inline-grid; place-items: center; } /* comfortable tap area */
.card { min-height: 0; }                     /* avoid fixed heights that clip zoomed text */
@media (prefers-reduced-motion: reduce) {
  .parallax { transform: none !important; }  /* disable motion effects */
  * { scroll-behavior: auto !important; }
}`],
      iq: [['What does WCAG reflow require?', 'Content usable without two-dimensional scrolling at 320 CSS px width (equivalent to 400% zoom on 1280px).']],
      cq: [['Test text spacing quickly.', `document.body.style.cssText += 'line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important'; // nothing should clip`]],
      err: ['user-scalable=no', 'Tiny close buttons on mobile']
    })
  ),
  m('4. Testing & Process',
    t('a11y-screen-readers', 'Screen Readers & Assistive Technology Testing', 'I', {
      one: 'Test with real assistive technology: NVDA/JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android), plus keyboard-only, voice control and zoom.',
      ex: `Basic NVDA: Insert+Space toggles modes, H next heading, D landmark, Tab controls, Insert+F7 elements list. VoiceOver: Cmd+F5 to start, VO (Ctrl+Option) + arrows, rotor (VO+U). Mobile: swipe to move, double-tap to activate.

Common screen reader + browser pairs: NVDA + Chrome/Firefox, JAWS + Chrome, VoiceOver + Safari. Check names, roles, states, reading order, announcements and focus management on key flows.`,
      pts: ['NVDA/JAWS/VoiceOver/TalkBack', 'Navigate by headings/landmarks', 'Verify names, roles, states', 'Test key flows end-to-end'],
      code: ['text', `NVDA quick test checklist (Chrome):
1. Insert+F7 → Headings list: is the outline logical?
2. D → jump landmarks: header, nav, main, footer present?
3. Tab through: every control announces name + role + state?
4. Open a dialog: focus moves inside, Esc closes, focus returns?
5. Submit invalid form: error announced and focused?
6. Trigger a toast: live region announces it once?          `],
      iq: [['Why test with screen readers if axe passes?', 'Automated tools cannot judge reading order, meaningful names, focus flow or whether announcements make sense.']],
      cq: [['Start VoiceOver on Mac.', `Cmd + F5   # toggle VoiceOver; VO keys = Ctrl + Option`]],
      err: ['Never testing with assistive tech']
    }),
    t('a11y-wcag22-audit', 'WCAG 2.2 Updates & Running an Accessibility Audit', 'I', {
      one: 'WCAG 2.2 (2023) added criteria such as Focus Not Obscured, Dragging Movements, Target Size, Consistent Help, Redundant Entry and Accessible Authentication; audits combine automated, manual and user testing.',
      ex: `New AA criteria: 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements (provide click alternatives to drag), 2.5.8 Target Size (Minimum), 3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication (Minimum). 4.1.1 Parsing was removed.

Audit process: define scope and target level → automated scan (axe, Lighthouse) → manual checks per criterion (keyboard, screen reader, zoom, contrast) → document issues with severity, WCAG reference and fix guidance → retest → publish an accessibility statement. WCAG 3.0 is in development.`,
      pts: ['Know the 2.2 additions', 'Automated + manual + users', 'Prioritise by impact', 'Accessibility statement'],
      flow: ['Define scope and level', 'Automated scan', 'Manual criterion checks', 'Report with severity', 'Fix and retest'],
      code: ['css', `/* 2.4.11 Focus Not Obscured: keep focused elements visible under sticky headers */
html { scroll-padding-top: 80px; }          /* account for a 72px sticky header */
/* 2.5.7 Dragging Movements: sortable lists also get Move up/down buttons */
/* 2.5.8 Target Size: at least 24x24px */
.chip { min-height: 24px; padding: 4px 10px; }`],
      iq: [['Name three new WCAG 2.2 criteria.', 'Focus Not Obscured, Dragging Movements, Target Size (Minimum), Consistent Help, Redundant Entry, Accessible Authentication.']],
      cq: [['Drag alternative for reordering.', `<li>React <button aria-label="Move React up">↑</button><button aria-label="Move React down">↓</button></li> <!-- non-drag option -->`]],
      err: ['Drag-only interactions']
    })
  )
];
