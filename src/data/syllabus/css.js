// CSS — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import web from '../terms/web.js';
const L = legacyPicker(web);

export default [
  m('1. Foundations',
    t('css-syntax-adding', 'CSS Syntax & Ways to Add CSS', 'B', {
      one: 'A CSS rule is a selector plus a declaration block of property: value pairs; CSS can be added inline, in a <style> tag or via an external stylesheet.',
      ex: `selector { property: value; } — e.g. h1 { color: navy; }. External stylesheets (<link rel="stylesheet">) are cached and reusable, which makes them the default choice. Internal <style> is handy for critical CSS. Inline style="" has the highest specificity and is hard to maintain.

@import inside CSS creates request chains that delay rendering — prefer <link> or bundler imports. Comments use /* */.`,
      pts: ['Rule = selector + declarations', 'External stylesheet = cacheable', 'Inline styles beat most selectors', 'Avoid CSS @import chains'],
      flow: ['Selector picks elements', 'Declarations set properties', 'Cascade resolves conflicts', 'Computed styles applied'],
      code: ['html', `<link rel="stylesheet" href="/styles.css">   <!-- external: cached, reusable -->
<style>
  h1 { color: navy; font-size: 2rem; }      /* internal rule: selector { property: value; } */
</style>
<p style="margin-top: 0">Inline style</p>   <!-- inline: highest priority, hard to maintain -->`],
      iq: [['Why avoid @import in CSS?', 'Imported files are discovered only after the parent CSS downloads, creating sequential requests that delay rendering.'],
           ['Which has priority: inline or stylesheet?', 'Inline styles win over normal stylesheet rules unless the stylesheet uses !important.']],
      cq: [['Apply a style from JS the right way.', `el.classList.add('is-active');           // prefer toggling classes
el.style.setProperty('--progress', '40%'); // or set a CSS variable for dynamic values`]],
      err: ['Overusing inline styles', 'Missing semicolons breaking the next declaration']
    }),
    t('css-cascade-specificity', 'Cascade, Specificity & !important', 'B', {
      one: 'When rules conflict, the cascade decides the winner by origin/importance, cascade layers, specificity and finally source order.',
      ex: `Specificity is counted as (IDs, classes/attributes/pseudo-classes, elements/pseudo-elements): #nav .item a = (1,1,1). Higher wins regardless of order; if equal, the later rule wins. Inline styles beat selectors; !important flips priority and should be a last resort.

:where() has zero specificity, :is() and :not() take the specificity of their most specific argument. Cascade layers (@layer) are evaluated before specificity, which helps tame conflicts in large codebases.`,
      pts: ['Order: importance → layers → specificity → source order', 'Specificity = (ID, class, element)', ':where() = 0 specificity', 'Avoid !important wars'],
      flow: ['Origin and !important', 'Cascade layer order', 'Specificity (ID, class, type)', 'Source order: last wins'],
      code: ['css', `p { color: black; }                 /* (0,0,1) */
.intro { color: blue; }             /* (0,1,0) beats p */
#hero .intro { color: green; }      /* (1,1,0) beats .intro */
:where(#hero) .intro { color: red; }/* (0,1,0) — :where adds nothing */
.intro { color: purple !important; }/* important beats all normal rules */`],
      iq: [['Calculate specificity of ul#menu li.active a:hover.', 'IDs 1; classes/pseudo-classes 2 (.active, :hover); elements 3 (ul, li, a) → (1,2,3).'],
           ['How do you override a style without !important?', 'Increase specificity slightly, place the rule later, or use cascade layers so your layer wins.'],
           [':is() vs :where()?', 'Both match any selector in the list; :is takes the highest specificity of its arguments, :where always has zero.']],
      cq: [['Write a reset that is easy to override.', `:where(ul, ol) { margin: 0; padding: 0; }  /* zero specificity: any class overrides it */`]],
      err: ['Using IDs for styling', '!important everywhere']
    }),
    t('css-inheritance', 'Inheritance: inherit, initial, unset, revert', 'B', {
      one: 'Some properties (color, font, line-height) inherit from the parent by default; keywords inherit, initial, unset and revert control it explicitly.',
      ex: `Typography properties inherit; box properties (margin, padding, border, width, background) do not. inherit forces inheritance, initial resets to the spec default, unset acts as inherit for inherited properties and initial for others, revert rolls back to the browser's default stylesheet.

all: unset (or revert) is a quick way to strip styles from an element such as a button.`,
      pts: ['Text properties inherit; box properties do not', 'initial = spec default', 'revert = browser default', 'all: unset resets everything'],
      code: ['css', `body { color: #222; font-family: system-ui; }   /* children inherit these */
.card { border: 1px solid #ddd; }              /* NOT inherited by children */
.card a { color: inherit; }                    /* link takes the card's text colour */
button.reset { all: unset; cursor: pointer; }  /* strip native button styles */`],
      iq: [['Does margin inherit?', 'No. Box-model properties are not inherited.'],
           ['initial vs revert?', 'initial uses the CSS spec default (display: inline); revert uses the browser stylesheet value (display: block for div).']],
      cq: [['Make all form controls use the page font.', `button, input, select, textarea { font: inherit; } /* controls don't inherit fonts by default */`]],
      err: ['Expecting form controls to inherit fonts automatically']
    }),
    t('css-selectors-basic', 'Basic Selectors & Combinators', 'B', {
      one: 'Selectors target elements by type, class, id, attribute or relationship: descendant (space), child (>), adjacent sibling (+) and general sibling (~).',
      ex: `Type (p), class (.btn), id (#app), universal (*), grouping (h1, h2). Combinators: "nav a" matches any a inside nav; "ul > li" only direct children; "h2 + p" the paragraph right after an h2; "h2 ~ p" all following sibling paragraphs.

Selectors are matched right-to-left by the browser, but modern engines are fast — readability matters more than micro-optimising selectors.`,
      pts: ['.class, #id, type, *', 'space = descendant, > = child', '+ adjacent sibling, ~ general sibling', 'Group with commas'],
      code: ['css', `nav a { text-decoration: none; }       /* any link inside nav */
ul > li { list-style: square; }         /* only direct children of ul */
h2 + p { margin-top: 0; }               /* paragraph immediately after h2 */
h2 ~ p { color: #555; }                 /* all later sibling paragraphs */
h1, h2, h3 { line-height: 1.2; }        /* grouping */`],
      iq: [['Difference between "div p" and "div > p"?', '"div p" matches p at any depth inside div; "div > p" only direct children.'],
           ['How do browsers match selectors?', 'Right to left: find elements matching the rightmost part, then check ancestors/siblings.']],
      cq: [['Add spacing between stacked items except the first (lobotomised owl).', `.stack > * + * { margin-top: 1rem; }   /* every child that follows another child */`]],
      err: ['Deeply nested selectors like .a .b .c .d a']
    }),
    t('css-attribute-selectors', 'Attribute Selectors', 'I', {
      one: 'Select elements by attribute presence or value: [attr], [attr="x"], [attr^="x"], [attr$="x"], [attr*="x"], [attr~="x"], with an i flag for case-insensitivity.',
      ex: `Useful for styling by state or data: [aria-expanded="true"], [data-variant="primary"], external links a[href^="http"], file links a[href$=".pdf"], inputs [type="email"].

Styling via ARIA/data attributes keeps state and style in sync and avoids extra classes.`,
      pts: ['^= starts with, $= ends with, *= contains', '[x="y" i] case-insensitive', 'Style ARIA state attributes', 'Great for data-* variants'],
      code: ['css', `a[href^="http"]::after { content: " ↗"; }      /* external links */
a[href$=".pdf" i]::after { content: " (PDF)"; } /* PDF links, any case */
button[aria-expanded="true"] .chevron { rotate: 180deg; } /* open state */
.btn[data-variant="danger"] { background: crimson; } /* data-driven variant */
input[type="email"]:invalid { border-color: red; } /* specific input type */`],
      iq: [['Why style with [aria-expanded] instead of a class?', 'The ARIA attribute is the single source of truth for both accessibility and styling, so they cannot get out of sync.']],
      cq: [['Highlight required fields.', `label:has(+ input[required])::after { content: " *"; color: crimson; } /* asterisk on required */`]],
      err: ['Forgetting quotes around values with spaces']
    }),
    t('css-pseudo-classes', 'Pseudo-classes (:hover, :focus-visible, :nth-child, :not, :is)', 'I', {
      one: 'Pseudo-classes select elements by state or position: :hover, :focus, :focus-visible, :active, :checked, :disabled, :first-child, :nth-child(), :not(), :is(), :where(), :empty.',
      ex: `Interaction: :hover, :active, :focus, :focus-visible (keyboard focus only — use it for focus rings), :focus-within (parent of a focused element). Form state: :checked, :disabled, :required, :valid, :invalid, :user-invalid, :placeholder-shown.

Structural: :first-child, :last-child, :nth-child(2n+1), :nth-of-type, :only-child, :empty, :root. Logical: :not(), :is(), :where(), :has(). :nth-child(n of .selector) filters by selector in modern browsers.`,
      pts: [':focus-visible for keyboard focus rings', ':focus-within styles parents', ':nth-child(an+b)', ':is/:where reduce repetition'],
      code: ['css', `button:hover { filter: brightness(1.1); }        /* pointer over */
button:focus-visible { outline: 3px solid #4dabf7; } /* keyboard focus only */
.field:focus-within { box-shadow: 0 0 0 2px #4dabf7; } /* parent of focused input */
tr:nth-child(even) { background: #f6f7f9; }      /* zebra rows */
li:not(:last-child) { border-bottom: 1px solid #eee; } /* separators */
:is(h1, h2, h3):hover { color: teal; }           /* shorthand for three selectors */
.list:empty::before { content: "No items yet"; } /* empty state */`],
      iq: [[':focus vs :focus-visible?', ':focus matches any focus (including mouse click); :focus-visible matches when the browser decides a focus indicator is needed, typically keyboard use.'],
           ['What does :nth-child(3n+1) select?', 'Elements 1, 4, 7, 10… (every third starting at the first).']],
      cq: [['Style every 3rd card in a grid, starting at the 2nd.', `.card:nth-child(3n + 2) { border-color: gold; }   /* 2, 5, 8, ... */`]],
      err: ['Removing outline on :focus without a replacement']
    }),
    t('css-pseudo-elements', 'Pseudo-elements (::before, ::after, ::placeholder, ::marker)', 'I', {
      one: 'Pseudo-elements style a part of an element or insert generated content: ::before, ::after, ::first-line, ::first-letter, ::placeholder, ::marker, ::selection, ::backdrop.',
      ex: `::before and ::after require a content property (can be "") and are used for decorative icons, overlays, badges and clearfix. They are not in the DOM, so do not put essential text in them (screen readers may or may not read it).

::marker styles list bullets, ::placeholder styles input hints, ::selection styles highlighted text, ::backdrop styles the layer behind dialogs/fullscreen, ::file-selector-button styles file inputs.`,
      pts: ['::before/::after need content', 'Decorative only — not essential text', '::marker for bullets', 'Double colon for pseudo-elements'],
      code: ['css', `.badge::after {                     /* generated element after content */
  content: attr(data-count);         /* text from an attribute */
  margin-left: .25rem;               /* spacing */
  padding: 0 .4rem;                  /* pill padding */
  border-radius: 99px;               /* pill shape */
  background: crimson; color: #fff;  /* colours */
}
li::marker { color: #7cf2c8; }       /* bullet colour */
input::placeholder { color: #888; }  /* hint text */
::selection { background: #ffe066; } /* highlighted text */`],
      iq: [['Single vs double colon?', 'Double colon (::before) is the CSS3 syntax for pseudo-elements; single colon is for pseudo-classes (legacy browsers accepted :before).'],
           ['Why does ::before not show?', 'It needs a content property; also it does not work on replaced elements like img or input.']],
      cq: [['Overlay gradient on a card image.', `.card { position: relative; }                     /* containing block */
.card::after {                                    /* overlay layer */
  content: ""; position: absolute; inset: 0;      /* cover the card */
  background: linear-gradient(transparent, rgb(0 0 0 / .6)); /* bottom shade */
}`]],
      err: ['::before on <img> or <input>', 'Essential content in generated text']
    })
  ),
  m('2. Box Model, Units & Values',
    t('css-box-model', 'The Box Model & box-sizing', 'B', {
      one: 'Every element is a box made of content, padding, border and margin; box-sizing decides whether width includes padding and border.',
      ex: `With the default content-box, width: 200px plus padding 20px and border 2px renders 244px wide. With box-sizing: border-box, the 200px includes padding and border — far more intuitive, which is why most resets apply it globally.

Margins create space outside the border and can be negative or auto (margin-inline: auto centres a block). Padding is inside, takes the background colour, and cannot be negative. Outline is drawn outside the border without affecting layout.`,
      pts: ['content → padding → border → margin', 'border-box is the sensible default', 'margin: auto centres blocks', 'outline does not take space'],
      dia: `flowchart LR
  M["margin"] --> B["border"] --> P["padding"] --> C["content"]`,
      code: ['css', `*, *::before, *::after { box-sizing: border-box; } /* width includes padding + border */
.card {
  width: 300px;                 /* total visible width = 300px */
  padding: 16px;                /* inner spacing (inside the border) */
  border: 1px solid #ddd;       /* border */
  margin: 24px auto;            /* vertical space + horizontal centring */
}`],
      iq: [['Calculate rendered width: content-box, width 200, padding 10, border 5.', '200 + 10×2 + 5×2 = 230px.'],
           ['Padding vs margin?', 'Padding is space inside the border (background shows); margin is space outside, transparent, and can collapse.']],
      cq: [['Centre a fixed-width block horizontally.', `.container { max-width: 1100px; margin-inline: auto; padding-inline: 16px; } /* centred with side gutters */`]],
      err: ['Forgetting box-sizing and getting overflow', 'Using margin for spacing inside a card']
    }),
    t('css-margin-collapse', 'Margin Collapsing', 'I', {
      one: 'Adjacent vertical margins of block elements combine into a single margin equal to the larger one instead of adding up.',
      ex: `Happens between siblings (a 20px bottom + 30px top = 30px gap), between parent and first/last child when nothing separates them (child margin "leaks" out of the parent), and on empty blocks.

It does not happen in flex or grid containers, with padding/border on the parent, or for horizontal margins. Using gap in flex/grid layouts avoids collapse surprises entirely.`,
      pts: ['Only vertical block margins collapse', 'Larger margin wins', 'Child margin can escape parent', 'Flex/grid gap avoids it'],
      code: ['css', `h2 { margin-bottom: 20px; }       /* gap below heading */
p  { margin-top: 30px; }          /* actual gap = 30px, not 50px */
.parent { padding-top: 1px; }     /* stops the child's margin escaping the parent */
.stack { display: flex; flex-direction: column; gap: 16px; } /* gap never collapses */`],
      iq: [['Why does my child margin push the parent down?', 'Parent–child margin collapse: with no padding/border between them, the child’s top margin collapses through the parent.'],
           ['How to prevent margin collapse?', 'Use padding/border on the parent, display: flow-root, flex/grid layouts, or gap instead of margins.']],
      cq: [['Stop collapse without visible changes.', `.parent { display: flow-root; } /* new block formatting context: margins stay inside */`]],
      err: ['Adding both top and bottom margins to stacked elements']
    }),
    t('css-units', 'CSS Units: px, em, rem, %, vw/vh, dvh, ch', 'B', {
      one: 'Absolute units (px) are fixed; relative units scale: em (parent font size), rem (root font size), % (parent), vw/vh (viewport), dvh/svh/lvh (dynamic mobile viewport), ch (character width).',
      ex: `Use rem for font sizes and spacing so the UI respects the user's browser font setting. em is useful for components that should scale with their own text (button padding). % depends on the property (width uses the parent's width).

100vh on mobile includes the area behind browser toolbars, causing overflow — use 100dvh (dynamic) or svh (small). ch is great for readable line lengths (max-width: 65ch). Container query units (cqw, cqi) scale with a container.`,
      pts: ['rem for typography and spacing', 'em scales with the element font', '100dvh instead of 100vh on mobile', 'max-width: 65ch for readability'],
      code: ['css', `html { font-size: 100%; }              /* respects user setting (usually 16px) */
h1 { font-size: 2.5rem; }              /* 40px if root is 16px */
.btn { font-size: 1rem; padding: .5em 1em; } /* padding scales with the button text */
.hero { min-height: 100dvh; }          /* full screen on mobile without overflow */
article { max-width: 65ch; }           /* ~65 characters per line */
.sidebar { width: 25%; }               /* quarter of the parent width */`],
      iq: [['em vs rem?', 'em is relative to the element’s (or parent’s, for font-size) font size and compounds when nested; rem is relative to the root font size and does not compound.'],
           ['Why not 100vh on mobile?', 'Mobile browsers’ dynamic toolbars make 100vh taller than the visible area; dvh/svh fix it.']],
      cq: [['Fluid font size between 1rem and 2rem.', `h2 { font-size: clamp(1.25rem, 1rem + 2vw, 2rem); } /* min, preferred, max */`]],
      err: ['Setting html font-size: 62.5% and breaking user preferences', 'Nested em compounding unexpectedly']
    }),
    t('css-colors', 'Colors: hex, rgb, hsl, oklch, color-mix', 'B', {
      one: 'CSS colours can be written as names, hex, rgb(), hsl(), and modern perceptual spaces like oklch(), with color-mix() and relative colours for derivations.',
      ex: `Modern space-separated syntax: rgb(0 0 0 / 50%). hsl is easy to reason about (hue, saturation, lightness). oklch(L C H) is perceptually uniform — equal lightness steps look equal — and supports wide-gamut displays; great for design-system palettes.

color-mix(in oklch, var(--brand) 70%, white) creates tints/shades. Relative colour syntax: oklch(from var(--brand) calc(l - 0.1) c h). currentColor reuses the text colour. Always check contrast (4.5:1 for body text).`,
      pts: ['rgb(0 0 0 / 50%) modern syntax', 'oklch for perceptual palettes', 'color-mix for tints/shades', 'currentColor for icons'],
      code: ['css', `:root {
  --brand: oklch(70% 0.15 160);                         /* mint green, perceptual */
  --brand-dark: oklch(from var(--brand) calc(l - .2) c h); /* relative colour: darker */
  --brand-soft: color-mix(in oklch, var(--brand) 20%, white); /* light tint */
}
.btn { background: var(--brand); color: #08241a; }       /* solid button */
.overlay { background: rgb(0 0 0 / 40%); }               /* 40% transparent black */
.icon { fill: currentColor; }                            /* follows text colour */`],
      iq: [['Why is oklch better than hsl for palettes?', 'HSL lightness is not perceptually uniform (yellow at 50% looks brighter than blue); oklch keeps perceived lightness consistent.'],
           ['What is currentColor?', 'A keyword equal to the element’s computed color value, handy for borders and SVG icons.']],
      cq: [['Generate hover colours from one variable.', `.btn { --c: #4dabf7; background: var(--c); }               /* base */
.btn:hover { background: color-mix(in srgb, var(--c) 85%, black); } /* 15% darker */`]],
      err: ['Low-contrast grey text']
    }),
    t('css-display', 'The display Property', 'B', {
      one: 'display sets how an element participates in layout: block, inline, inline-block, flex, grid, none, contents, flow-root, and more.',
      ex: `Outer display (block/inline) decides how it sits among siblings; inner display (flow, flex, grid) decides how its children are laid out. inline elements ignore width/height and vertical margins; inline-block flows inline but accepts box sizing.

display: none removes the element from layout and the accessibility tree. display: contents removes the element's box but keeps its children (useful for grid), though older browsers broke its accessibility. flow-root creates a new block formatting context (contains floats, stops margin collapse).`,
      pts: ['inline ignores width/height', 'inline-block = inline flow + box sizing', 'none removes from a11y tree', 'flow-root contains floats'],
      code: ['css', `.tag { display: inline-block; padding: 2px 8px; }  /* inline but sized */
.row { display: flex; gap: 8px; }                  /* flex container */
.grid { display: grid; grid-template-columns: 1fr 1fr; } /* grid container */
.wrapper { display: contents; }                    /* its children join the parent grid */
.modal[hidden] { display: none; }                  /* hidden completely */`],
      iq: [['inline vs inline-block?', 'Both flow with text, but inline-block respects width, height and vertical padding/margins.'],
           ['display:none vs visibility:hidden vs opacity:0?', 'none removes it from layout and a11y; visibility hidden keeps space, removes from a11y; opacity 0 keeps space and stays interactive/announced.']],
      cq: [['Hide visually but keep for screen readers.', `.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; } /* visually hidden */`]],
      err: ['Using display:none for content screen readers should read']
    }),
    t('css-overflow', 'Overflow, Scrolling & text-overflow', 'B', {
      one: 'overflow controls content that does not fit: visible, hidden, clip, scroll or auto; text-overflow: ellipsis truncates single lines.',
      ex: `overflow: auto shows scrollbars only when needed. hidden clips and still allows programmatic scroll; clip clips without creating a scroll container. overflow-x/overflow-y control axes independently. scrollbar-gutter: stable reserves space to avoid layout jumps.

Single-line ellipsis needs white-space: nowrap + overflow: hidden + text-overflow: ellipsis. Multi-line truncation uses line-clamp (-webkit-line-clamp). overscroll-behavior: contain stops scroll chaining in modals and chat panes.`,
      pts: ['auto = scrollbars only when needed', 'Ellipsis needs nowrap + hidden', 'line-clamp for multi-line', 'overscroll-behavior: contain for nested scrollers'],
      code: ['css', `.title {
  white-space: nowrap;        /* keep on one line */
  overflow: hidden;           /* hide the rest */
  text-overflow: ellipsis;    /* show … */
}
.excerpt {
  display: -webkit-box;       /* required for line clamp */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;      /* max 3 lines */
  overflow: hidden;           /* hide extra lines */
}
.chat { overflow-y: auto; overscroll-behavior: contain; } /* scroll inside without scrolling page */`],
      iq: [['Why doesn’t my ellipsis work?', 'It needs a constrained width, white-space: nowrap and overflow: hidden; in flex items also add min-width: 0.'],
           ['hidden vs clip?', 'hidden still makes the element a scroll container (scrollable via JS); clip does not and supports overflow-clip-margin.']],
      cq: [['Ellipsis inside a flex row.', `.row { display: flex; } .row .name { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } /* min-width:0 lets it shrink */`]],
      err: ['Forgetting min-width: 0 on flex children']
    }),
    t('css-sizing-functions', 'Sizing: min/max, aspect-ratio, calc(), min(), max(), clamp()', 'I', {
      one: 'Intrinsic and mathematical sizing tools: min-/max-width, aspect-ratio, fit-content, calc() and the comparison functions min(), max() and clamp().',
      ex: `calc() mixes units: calc(100% - 2rem). min(a, b) picks the smaller (width: min(100%, 700px) = responsive max-width in one line). max() picks the larger. clamp(min, preferred, max) bounds a fluid value — ideal for typography and spacing.

aspect-ratio: 16 / 9 keeps proportions for media, cards and placeholders. Intrinsic keywords: min-content, max-content, fit-content(). Combine with object-fit: cover for images.`,
      pts: ['calc() mixes units', 'min()/max()/clamp() for fluid design', 'aspect-ratio replaces padding hacks', 'fit-content / min-content / max-content'],
      code: ['css', `.container { width: min(100% - 2rem, 1100px); margin-inline: auto; } /* responsive with gutters */
.video { aspect-ratio: 16 / 9; width: 100%; }        /* keeps 16:9 */
.avatar { width: 48px; aspect-ratio: 1; object-fit: cover; border-radius: 50%; } /* square crop */
h1 { font-size: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); } /* fluid heading */
.sidebar { width: max(240px, 20%); }                  /* never narrower than 240px */
.tag { width: fit-content; }                          /* shrink to content */`],
      iq: [['What does clamp(1rem, 2vw, 2rem) mean?', 'Use 2vw, but never less than 1rem nor more than 2rem.'],
           ['How did we keep aspect ratios before aspect-ratio?', 'The padding-top percentage hack (padding-top: 56.25% for 16:9) on a wrapper.']],
      cq: [['Card image that always fills a 4:3 box.', `.card img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; } /* crop to fill */`]],
      err: ['Missing spaces around + and - inside calc()']
    })
  ),
  m('3. Typography',
    t('css-fonts', 'Fonts: font-family, @font-face, font-display, variable fonts', 'I', {
      one: 'Control typefaces with font stacks, load custom fonts with @font-face, manage loading with font-display, and use variable fonts for many weights in one file.',
      ex: `A font stack lists fallbacks: font-family: Inter, system-ui, sans-serif. @font-face declares a custom font; serve WOFF2. font-display: swap shows fallback text immediately and swaps when loaded (avoids invisible text); optional avoids layout shift by only using the font if it loads very fast.

Reduce CLS from font swaps with size-adjust / ascent-override on the fallback. Variable fonts contain a weight/width axis in one file (font-weight: 100 900). Preload only the critical font file. Subset fonts to needed characters.`,
      pts: ['WOFF2 format', 'font-display: swap or optional', 'Variable fonts = one file, many weights', 'size-adjust fallback reduces CLS'],
      code: ['css', `@font-face {
  font-family: "Inter";                          /* name used in font-family */
  src: url("/fonts/Inter-var.woff2") format("woff2"); /* compressed web font */
  font-weight: 100 900;                          /* variable weight range */
  font-display: swap;                            /* show fallback text immediately */
}
@font-face {
  font-family: "Inter Fallback";                 /* metric-matched fallback */
  src: local("Arial");                           /* use installed Arial */
  size-adjust: 107%;                             /* match Inter's width to reduce shift */
}
body { font-family: "Inter", "Inter Fallback", system-ui, sans-serif; } /* stack */
strong { font-weight: 650; }                     /* any weight with variable fonts */`],
      iq: [['What is FOIT vs FOUT?', 'Flash of Invisible Text (text hidden while font loads) vs Flash of Unstyled Text (fallback shown then swapped). font-display controls which happens.'],
           ['Why use variable fonts?', 'One file covers many weights/styles, reducing requests and enabling fine-grained weights.']],
      cq: [['Use the system font stack (zero download).', `body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; } /* native fonts */`]],
      err: ['Loading 6 separate weight files', 'No font-display, causing invisible text']
    }),
    t('css-text-styling', 'Text Styling: line-height, spacing, wrapping, alignment', 'B', {
      one: 'Properties that control readable text: line-height, letter-spacing, word-spacing, text-align, text-transform, text-decoration, white-space, word-break, hyphens and text-wrap.',
      ex: `Use unitless line-height (1.5) so it scales with font size. Body text: 16px+ and 45–75 characters per line. text-wrap: balance evens out headings; text-wrap: pretty avoids orphans in paragraphs.

overflow-wrap: anywhere / word-break: break-word prevents long URLs from overflowing. hyphens: auto needs a lang attribute. text-decoration supports thickness, offset and colour. text-underline-offset improves link readability.`,
      pts: ['Unitless line-height ~1.5', 'text-wrap: balance for headings', 'overflow-wrap: anywhere for long words', 'Line length 45–75ch'],
      code: ['css', `body { font-size: 1rem; line-height: 1.6; }      /* unitless: scales with font size */
h1, h2 { text-wrap: balance; line-height: 1.15; } /* balanced headline lines */
p { text-wrap: pretty; max-width: 65ch; }        /* avoid orphans, readable width */
a { text-decoration-thickness: 2px; text-underline-offset: 3px; } /* nicer underlines */
.url { overflow-wrap: anywhere; }                /* break long URLs */
.label { text-transform: uppercase; letter-spacing: .08em; } /* small caps label */`],
      iq: [['Why unitless line-height?', 'Children inherit the ratio and recompute it for their own font size; a length value would be inherited as a fixed size.']],
      cq: [['Prevent long words from breaking layout in a chat bubble.', `.bubble { overflow-wrap: anywhere; hyphens: auto; } /* wrap long tokens */`]],
      err: ['line-height in px for body text']
    })
  ),
  m('4. Layout',
    t('css-position', 'Positioning: static, relative, absolute, fixed, sticky', 'B', {
      one: 'position changes how an element is placed: relative (offset from itself), absolute (relative to the nearest positioned ancestor), fixed (viewport), sticky (switches to fixed within its container).',
      ex: `absolute removes the element from flow and positions it against the nearest ancestor that has position other than static (the containing block) — usually a parent with position: relative. fixed positions against the viewport (but a transformed ancestor becomes its containing block!).

sticky needs a threshold (top: 0) and sticks only within its scrolling container; it fails if an ancestor has overflow: hidden. inset: 0 is shorthand for top/right/bottom/left.`,
      pts: ['absolute → nearest positioned ancestor', 'fixed → viewport (unless a transformed ancestor)', 'sticky needs top and no overflow:hidden ancestor', 'inset shorthand'],
      dia: `flowchart TD
  P{"position value"} --> S["static: normal flow"]
  P --> R["relative: offset from own spot, keeps space"]
  P --> A["absolute: removed from flow, nearest positioned ancestor"]
  P --> F["fixed: viewport"]
  P --> ST["sticky: normal until threshold, then sticks in container"]`,
      code: ['css', `.card { position: relative; }               /* containing block for children */
.card .badge {
  position: absolute; top: 8px; right: 8px;  /* top-right corner of .card */
}
.header { position: sticky; top: 0; z-index: 10; } /* sticks while scrolling */
.fab { position: fixed; right: 16px; bottom: 16px; } /* floating action button */
.overlay { position: fixed; inset: 0; }      /* covers the whole viewport */`],
      iq: [['Why isn’t position: sticky working?', 'Missing top/bottom threshold, an ancestor with overflow hidden/auto, or the parent is no taller than the sticky element.'],
           ['What is the containing block for absolute elements?', 'The padding box of the nearest ancestor with position other than static (or with transform/filter/contain).']],
      cq: [['Centre an absolutely positioned modal.', `.modal { position: fixed; inset: 0; margin: auto; width: min(90vw, 500px); height: fit-content; } /* centred */`]],
      err: ['Fixed element broken by a transformed parent', 'Sticky inside overflow:hidden']
    }),
    t('css-z-index-stacking', 'z-index & Stacking Contexts', 'I', {
      one: 'z-index orders overlapping positioned elements, but only within the same stacking context; properties like opacity, transform and isolation create new contexts.',
      ex: `A stacking context is a self-contained layer group. Children can never escape their parent's context: a child with z-index 9999 inside a parent context with z-index 1 still sits below a sibling context with z-index 2.

Created by: positioned elements with z-index, opacity < 1, transform, filter, will-change, isolation: isolate, position fixed/sticky, flex/grid children with z-index, contain. Use a small z-index scale (tokens) and isolation: isolate on components. Dialogs and popovers use the top layer instead.`,
      pts: ['z-index works within a stacking context', 'opacity/transform/filter create contexts', 'isolation: isolate to contain components', 'Use a z-index token scale'],
      dia: `flowchart TD
  ROOT["Root context"] --> A["Header context z 10"]
  ROOT --> B["Card context z 1"]
  B --> B1["Tooltip z 9999 — still below Header"]`,
      code: ['css', `:root { --z-dropdown: 100; --z-sticky: 200; --z-modal: 1000; } /* z-index scale */
.header { position: sticky; top: 0; z-index: var(--z-sticky); }   /* above content */
.card { isolation: isolate; }                 /* new context: inner z-indexes stay inside */
.card .shine { position: absolute; z-index: -1; } /* behind card content but inside the card */`],
      iq: [['Why doesn’t z-index: 9999 bring my dropdown to the front?', 'It is inside a parent stacking context with a lower order, or it is not positioned.'],
           ['Name properties that create a stacking context.', 'opacity < 1, transform, filter, position fixed/sticky, z-index on positioned/flex/grid items, isolation: isolate, will-change, contain.']],
      cq: [['Render a dropdown outside a clipped parent.', `/* Use the popover attribute (top layer) or a React portal to document.body */
.menu[popover] { margin: 0; inset: auto; }        /* top layer: z-index not needed */`]],
      err: ['Escalating z-index numbers', 'Unexpected contexts from transform']
    }),
    L('css-layout'),
    t('css-flexbox', 'Flexbox in Depth', 'I', {
      one: 'A one-dimensional layout model: a flex container distributes space among items along a main axis and aligns them on the cross axis.',
      ex: `Container: display: flex, flex-direction (row/column), flex-wrap, justify-content (main axis: start, center, space-between…), align-items (cross axis: stretch, center…), align-content (multiple lines), gap.

Items: flex-grow (take free space), flex-shrink (give up space), flex-basis (starting size), shorthand flex: 1 (= 1 1 0%), align-self, order (visual only — keep DOM order logical for accessibility). min-width: auto prevents shrinking below content; set min-width: 0 for truncation.`,
      pts: ['justify = main axis, align = cross axis', 'flex: 1 = grow evenly', 'gap for spacing', 'min-width: 0 to allow shrinking'],
      flow: ['flex-basis sets starting size', 'Free space is calculated', 'grow shares extra space', 'shrink removes overflow', 'align on cross axis'],
      code: ['css', `.nav {
  display: flex;                   /* flex container */
  align-items: center;             /* vertical centre (cross axis) */
  justify-content: space-between;  /* ends of the main axis */
  gap: 12px;                       /* spacing between items */
  flex-wrap: wrap;                 /* allow wrapping on small screens */
}
.nav .search { flex: 1; min-width: 0; } /* take remaining space, allow shrinking */
.nav .logo { flex-shrink: 0; }          /* never shrink the logo */
.card-footer { margin-top: auto; }      /* in a column flex card: push to bottom */`],
      iq: [['What does flex: 1 mean?', 'flex-grow 1, flex-shrink 1, flex-basis 0% — items share free space equally.'],
           ['justify-content vs align-items?', 'justify-content aligns along the main axis; align-items along the cross axis.'],
           ['Why use order carefully?', 'It changes visual order only; keyboard and screen-reader order still follow the DOM.']],
      cq: [['Sticky footer layout with flexbox.', `body { min-height: 100dvh; display: flex; flex-direction: column; } /* full-height column */
main { flex: 1; }                                                    /* main grows, footer stays at bottom */`]],
      err: ['Using margins instead of gap', 'Text overflow because of min-width:auto']
    }),
    t('css-grid', 'CSS Grid in Depth (tracks, areas, auto-fit, subgrid)', 'I', {
      one: 'A two-dimensional layout system with rows and columns: define tracks, place items by line numbers or named areas, and auto-place the rest.',
      ex: `grid-template-columns: repeat(3, 1fr) creates three equal columns; fr shares free space. minmax(200px, 1fr) sets bounds. repeat(auto-fit, minmax(220px, 1fr)) makes responsive galleries without media queries.

Place items with grid-column: 1 / -1 (full width) or span 2, or name regions with grid-template-areas. grid-auto-flow: dense backfills gaps. subgrid lets nested grids align to the parent tracks (card titles line up). place-items: center centres everything.`,
      pts: ['fr distributes free space', 'repeat(auto-fit, minmax()) = responsive grid', 'grid-template-areas for page layouts', 'subgrid aligns nested content'],
      code: ['css', `.gallery {
  display: grid;                                            /* grid container */
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* responsive columns */
  gap: 16px;                                                /* gutters */
}
.gallery .featured { grid-column: span 2; }                 /* takes two columns */
.page {
  display: grid;
  grid-template-columns: 240px 1fr;                         /* sidebar + content */
  grid-template-areas: "side main";                         /* named areas */
}
@media (max-width: 700px) { .page { grid-template-columns: 1fr; grid-template-areas: "main" "side"; } } /* stack */
.cards { display: grid; grid-template-rows: auto; }
.card { display: grid; grid-row: span 3; grid-template-rows: subgrid; } /* align rows across cards */`],
      iq: [['auto-fit vs auto-fill?', 'Both create as many tracks as fit; auto-fit collapses empty tracks so items stretch, auto-fill keeps empty tracks.'],
           ['What does 1fr mean?', 'One fraction of the remaining free space in the grid container.'],
           ['What problem does subgrid solve?', 'Aligning content (titles, buttons) across sibling cards by letting children use the parent grid’s tracks.']],
      cq: [['Full-bleed element inside a centred grid layout.', `.content { display: grid; grid-template-columns: 1fr min(65ch, 100%) 1fr; } /* centre column */
.content > * { grid-column: 2; }            /* normal content in the middle */
.content > .full { grid-column: 1 / -1; }   /* spans edge to edge */`]],
      err: ['Using grid for simple one-row toolbars where flex is simpler']
    }),
    t('css-float-legacy', 'Floats & Legacy Layout (clearfix)', 'B', {
      one: 'float moves an element left/right so text wraps around it; once used for whole layouts, now mainly for wrapping text around images.',
      ex: `Floated elements are removed from normal flow, so parents collapse to zero height unless cleared (clearfix or display: flow-root). clear: both moves an element below floats.

You will still meet float layouts and clearfix hacks in legacy codebases and email templates. shape-outside lets text wrap around non-rectangular shapes.`,
      pts: ['Floats are for text wrap now', 'Parent collapse fixed by flow-root', 'clear: both', 'Recognise clearfix in legacy code'],
      code: ['css', `.article img { float: left; margin: 0 1rem 1rem 0; } /* text wraps on the right */
.clearfix::after { content: ""; display: table; clear: both; } /* classic clearfix */
.container { display: flow-root; }                   /* modern: contains floats */
.avatar { float: left; shape-outside: circle(); }    /* wrap text around a circle */`],
      iq: [['Why does a parent with floated children have zero height?', 'Floats are out of flow; the parent does not contain them unless it creates a new block formatting context.']],
      cq: [['Two-column legacy layout with floats.', `.col { float: left; width: 50%; } .row::after { content: ""; display: table; clear: both; } /* clear floats */`]],
      err: ['Building new layouts with floats']
    }),
    t('css-multicolumn-centering', 'Centering Techniques & Multi-column Layout', 'B', {
      one: 'Common ways to centre content (grid place-items, flex, margin auto, absolute + transform) and the multi-column module for newspaper-style text.',
      ex: `Centre both axes: display: grid; place-items: center. Flex: justify-content + align-items: center. Horizontal block: margin-inline: auto. Absolute: inset: 0; margin: auto (with a size) or top/left 50% + translate(-50%, -50%).

Multi-column: columns: 3 18rem flows text into columns; break-inside: avoid keeps cards intact (masonry-like layouts).`,
      pts: ['grid + place-items: center', 'margin-inline: auto for blocks', 'translate(-50%,-50%) for absolute', 'columns + break-inside: avoid'],
      code: ['css', `.center-grid { display: grid; place-items: center; min-height: 100dvh; } /* both axes */
.center-flex { display: flex; justify-content: center; align-items: center; } /* flex way */
.center-abs { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); } /* absolute way */
.masonry { columns: 3 16rem; column-gap: 16px; }         /* up to 3 columns of ≥16rem */
.masonry > .card { break-inside: avoid; margin-bottom: 16px; } /* don't split cards */`],
      iq: [['Most robust way to centre a div both ways?', 'Make the parent display: grid; place-items: center.']],
      cq: [['Centre text inside a fixed-height button.', `.btn { display: inline-flex; align-items: center; justify-content: center; height: 44px; } /* centred label */`]],
      err: ['Using line-height hacks for vertical centring of multi-line text']
    })
  ),
  m('5. Responsive Design',
    t('css-media-queries', 'Media Queries & Mobile-first Responsive Design', 'B', {
      one: 'Media queries apply styles based on viewport width, orientation, pointer type, colour scheme and more; mobile-first writes base styles for small screens and adds min-width queries.',
      ex: `Mobile-first: default CSS targets phones, then @media (min-width: 768px) enhances for larger screens. Range syntax: @media (600px <= width < 1024px). Breakpoints should follow content, not specific devices.

Feature queries beyond width: (hover: hover) and (pointer: fine) for mouse users, (orientation: landscape), (prefers-color-scheme: dark), (prefers-reduced-motion: reduce), (prefers-contrast: more), print media.`,
      pts: ['Mobile-first with min-width', 'Range syntax width >= 600px', '(hover: hover) for hover-only effects', 'Breakpoints follow content'],
      code: ['css', `.grid { display: grid; gap: 12px; }                      /* phones: one column */
@media (min-width: 640px) { .grid { grid-template-columns: 1fr 1fr; } }  /* tablets */
@media (width >= 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } } /* desktops, range syntax */
@media (hover: hover) { .card:hover { transform: translateY(-2px); } }   /* only real hover devices */
@media print { nav, .ads { display: none; } }             /* clean printouts */`],
      iq: [['Mobile-first vs desktop-first?', 'Mobile-first uses min-width queries adding complexity as space grows (less CSS for phones); desktop-first uses max-width to remove things.'],
           ['How do you avoid sticky hover states on touch devices?', 'Wrap hover styles in @media (hover: hover).']],
      cq: [['Read a media query in JS.', `const mq = matchMedia('(min-width: 768px)');        // MediaQueryList
const update = () => console.log(mq.matches ? 'desktop' : 'mobile'); // react to state
mq.addEventListener('change', update); update();    // listen + run once`]],
      err: ['Device-specific breakpoints', 'Hover-only interactions on touch screens']
    }),
    t('css-container-queries', 'Container Queries & Container Units', 'I', {
      one: 'Container queries style a component based on the size of its container rather than the viewport, making components truly reusable.',
      ex: `Mark an ancestor with container-type: inline-size (optionally container-name). Children then use @container (min-width: 400px) { … }. The same card can be compact in a sidebar and wide in the main column without knowing the page layout.

Container units: cqw, cqh, cqi, cqmin scale with the container (font-size: clamp(1rem, 4cqi, 1.5rem)). Style queries (@container style(--variant: dark)) query custom property values.`,
      pts: ['container-type: inline-size on the wrapper', '@container (min-width) in children', 'cqi units for fluid component text', 'Component-level responsiveness'],
      flow: ['Wrapper gets container-type', 'Browser measures container width', '@container rules evaluated', 'Component switches layout'],
      code: ['css', `.card-wrap { container: card / inline-size; }    /* name "card", track width */
.card { display: grid; gap: 8px; }                /* stacked by default */
.card h3 { font-size: clamp(1rem, 5cqi, 1.5rem); } /* scales with container width */
@container card (min-width: 420px) {              /* when THIS container is wide */
  .card { grid-template-columns: 140px 1fr; }     /* side-by-side layout */
}`],
      iq: [['Why are container queries better than media queries for components?', 'Components respond to the space they actually get, so they work anywhere (sidebar, modal, grid) without page-specific breakpoints.'],
           ['Can an element query its own size?', 'No — it queries an ancestor container, to avoid layout loops.']],
      cq: [['Responsive product card used in both a grid and a sidebar.', `.product-slot { container-type: inline-size; }        /* each slot is a container */
@container (min-width: 300px) { .product { flex-direction: row; } } /* row layout when roomy */`]],
      err: ['Setting container-type on the element you are styling instead of its parent']
    }),
    t('css-responsive-techniques', 'Fluid Layouts, Responsive Typography & Viewport Units', 'I', {
      one: 'Techniques for interfaces that adapt smoothly: fluid type with clamp(), intrinsic grids, responsive images, dynamic viewport units and safe-area insets.',
      ex: `Instead of many breakpoints, use intrinsic layouts (auto-fit grids, flex-wrap) and fluid values (clamp). Respect notches with env(safe-area-inset-*) and viewport-fit=cover. Use dvh for full-height mobile sections.

Test at 320px wide, landscape phones, 200% zoom and large text settings.`,
      pts: ['Intrinsic layouts reduce breakpoints', 'clamp() for fluid type and spacing', 'env(safe-area-inset-bottom) for notches', 'Test 320px and 200% zoom'],
      code: ['css', `:root {
  --space: clamp(1rem, 0.6rem + 1.5vw, 2rem);      /* fluid spacing token */
  --step-3: clamp(1.6rem, 1.2rem + 2vw, 2.6rem);   /* fluid heading size */
}
.section { padding: var(--space); }               /* spacing grows with screen */
.tabbar { padding-bottom: env(safe-area-inset-bottom); } /* clear the iPhone home indicator */
.hero { min-height: 100svh; }                      /* small viewport height: never hidden */`],
      iq: [['svh vs lvh vs dvh?', 'svh = smallest viewport (toolbars shown), lvh = largest (toolbars hidden), dvh = dynamic, updates as toolbars move.']],
      cq: [['Responsive grid with no media queries.', `.grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); } /* never overflows */`]],
      err: ['Fixed pixel widths causing horizontal scroll']
    }),
    t('css-user-preferences', 'User Preferences: dark mode, reduced motion, contrast', 'I', {
      one: 'Media features that adapt UI to user settings: prefers-color-scheme, prefers-reduced-motion, prefers-contrast, forced-colors and prefers-reduced-transparency.',
      ex: `Implement dark mode with CSS variables swapped under @media (prefers-color-scheme: dark) and/or a [data-theme] attribute for a manual toggle. color-scheme: light dark makes native controls match; light-dark(a, b) picks per scheme.

Wrap non-essential animation in @media (prefers-reduced-motion: no-preference) — vestibular disorders make motion harmful. forced-colors: active (Windows High Contrast) overrides colours; use system colours like CanvasText and test it.`,
      pts: ['Tokens + prefers-color-scheme', 'color-scheme for native controls', 'Respect reduced motion', 'Test forced-colors mode'],
      code: ['css', `:root { color-scheme: light dark; --bg: #fff; --text: #111; }  /* light defaults */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #0f1115; --text: #e8ecf3; } /* auto dark unless user chose light */
}
:root[data-theme="dark"] { --bg: #0f1115; --text: #e8ecf3; }      /* manual toggle */
body { background: var(--bg); color: var(--text); }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } /* minimise motion */
}`],
      iq: [['How do you support both system dark mode and a manual toggle?', 'Default tokens follow prefers-color-scheme, and a data-theme attribute set by the toggle overrides them; persist the choice in localStorage.']],
      cq: [['Theme toggle in JS.', `const root = document.documentElement;             // <html>
btn.onclick = () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark'; // flip
  root.dataset.theme = next;                       // apply
  try { localStorage.setItem('theme', next); } catch {} // remember choice
};`]],
      err: ['Dark mode by inverting with filter: invert()', 'Ignoring reduced motion']
    })
  ),
  m('6. Visual Effects & Motion',
    t('css-backgrounds-gradients', 'Backgrounds & Gradients', 'B', {
      one: 'background properties set colours, images, size, position and repeat; gradients (linear, radial, conic) are generated images.',
      ex: `background-size: cover fills the box (cropping), contain fits fully. Multiple backgrounds stack comma-separated (first is on top). background-clip: text creates gradient text.

Gradients: linear-gradient(135deg, a, b), radial-gradient(circle at top, a, transparent 60%), conic-gradient for pie charts. Hard stops create stripes. Use image-set() for resolution-aware backgrounds.`,
      pts: ['cover vs contain', 'Multiple layered backgrounds', 'linear / radial / conic gradients', 'background-clip: text'],
      code: ['css', `.hero {
  background:
    radial-gradient(circle at 20% 20%, rgb(124 242 200 / .25), transparent 40%), /* glow layer on top */
    url("/hero.webp") center / cover no-repeat,                                 /* photo below */
    #0f1115;                                                                    /* base colour */
}
.gradient-text {
  background: linear-gradient(90deg, #7cf2c8, #4dabf7); /* gradient image */
  background-clip: text; color: transparent;            /* show gradient through text */
}
.pie { background: conic-gradient(#7cf2c8 0 60%, #333 0); border-radius: 50%; } /* 60% pie */`],
      iq: [['background-size cover vs contain?', 'cover fills the whole box (may crop); contain shows the whole image (may leave empty space).']],
      cq: [['Striped progress bar with a gradient.', `.bar { background: repeating-linear-gradient(45deg, #7cf2c8 0 10px, #5fd9b0 10px 20px); } /* stripes */`]],
      err: ['Text on images without contrast overlay']
    }),
    t('css-borders-shadows', 'Borders, Radius, Shadows & Outlines', 'B', {
      one: 'border, border-radius, box-shadow, text-shadow and outline add edges, rounding, depth and focus indicators.',
      ex: `border-radius: 50% makes circles; percentages and elliptical radii are possible. box-shadow supports multiple layers and inset; layered soft shadows look more natural. drop-shadow() filter follows transparent shapes (PNG/SVG).

outline does not affect layout and supports outline-offset — ideal for focus rings. Corner shapes (corner-shape: squircle) are arriving in newer browsers.`,
      pts: ['Layered shadows look natural', 'outline + outline-offset for focus', 'drop-shadow for transparent images', '50% radius = circle'],
      code: ['css', `.card {
  border: 1px solid rgb(0 0 0 / .08);                      /* subtle border */
  border-radius: 16px;                                     /* rounded corners */
  box-shadow: 0 1px 2px rgb(0 0 0 / .06), 0 8px 24px rgb(0 0 0 / .08); /* two-layer depth */
}
.input:focus-visible { outline: 2px solid #4dabf7; outline-offset: 2px; } /* accessible ring */
.logo { filter: drop-shadow(0 2px 4px rgb(0 0 0 / .3)); } /* follows PNG transparency */`],
      iq: [['outline vs border for focus?', 'outline does not change layout or size, so it will not shift content when focus changes.']],
      cq: [['Pill button with inner shadow when pressed.', `.btn { border-radius: 999px; } .btn:active { box-shadow: inset 0 2px 4px rgb(0 0 0 / .2); } /* pressed */`]],
      err: ['Removing outline with no replacement']
    }),
    t('css-transforms', 'Transforms (translate, scale, rotate) & 3D', 'I', {
      one: 'transform moves, scales, rotates or skews an element visually without affecting layout; individual properties translate, scale and rotate can be set separately.',
      ex: `Transforms happen after layout, so siblings do not move — and transform/opacity animations can run on the compositor (smooth). transform-origin sets the pivot point. Individual transform properties (translate: 10px; rotate: 45deg; scale: 1.1) compose without overwriting each other.

3D: perspective, rotateY, transform-style: preserve-3d, backface-visibility: hidden (card flips). Note: transform creates a stacking context and a containing block for fixed descendants.`,
      pts: ['Does not affect layout', 'GPU-friendly for animation', 'transform-origin = pivot', 'Individual translate/rotate/scale properties'],
      code: ['css', `.card:hover { translate: 0 -4px; scale: 1.02; }      /* lift + grow, no layout shift */
.icon { rotate: 45deg; transform-origin: center; }    /* rotate around centre */
.flip { perspective: 800px; }                          /* 3D depth for children */
.flip-inner { transition: transform .5s; transform-style: preserve-3d; } /* keep 3D for children */
.flip:hover .flip-inner { transform: rotateY(180deg); } /* flip the card */
.face { backface-visibility: hidden; }                 /* hide the back side */`],
      iq: [['Why animate transform instead of top/left?', 'top/left trigger layout every frame; transform is applied at composite time, often on the GPU, giving smooth 60fps.']],
      cq: [['Card flip with front/back faces.', `.back { transform: rotateY(180deg); position: absolute; inset: 0; } /* starts facing away */`]],
      err: ['Animating width/height/top/left']
    }),
    t('css-transitions', 'Transitions', 'B', {
      one: 'Transitions animate a property smoothly when its value changes, defined by property, duration, timing function and delay.',
      ex: `transition: transform 200ms ease-out; Only animatable properties transition. Avoid transition: all — it animates unexpected properties and costs performance. Timing functions: ease, linear, ease-in-out, cubic-bezier(), steps(), and linear() for spring-like curves.

New: transition-behavior: allow-discrete and @starting-style allow transitioning display/overlay for entry/exit animations of dialogs and popovers. Listen to transitionend in JS.`,
      pts: ['List specific properties, not all', 'Prefer transform and opacity', '@starting-style for entry animations', 'transitionend event'],
      code: ['css', `.btn { transition: background-color .2s ease, transform .15s ease-out; } /* specific properties */
.btn:active { transform: scale(.97); }                  /* press feedback */
.toast { opacity: 1; translate: 0; transition: opacity .3s, translate .3s, display .3s allow-discrete; }
@starting-style { .toast { opacity: 0; translate: 0 20px; } } /* initial state when it appears */
.toast[hidden] { display: none; opacity: 0; }           /* exit state, display transitions too */`],
      iq: [['Transition vs animation?', 'Transitions animate between two states triggered by a change; animations use @keyframes, can loop and run without a trigger.']],
      cq: [['Run code after a transition ends.', `panel.addEventListener('transitionend', (e) => {   // fires per property
  if (e.propertyName === 'opacity') panel.hidden = true; // hide when fade-out ends
}, { once: true });`]],
      err: ['transition: all', 'Long durations for UI feedback (> 300ms)']
    }),
    t('css-animations', 'Keyframe Animations', 'I', {
      one: '@keyframes defines animation steps; the animation property applies them with duration, timing, delay, iteration count, direction and fill mode.',
      ex: `animation: spin 1s linear infinite; fill-mode forwards keeps the end state. Animate transform/opacity for performance. Respect prefers-reduced-motion. The Web Animations API (element.animate()) gives JS control with the same engine.

Useful patterns: skeleton shimmer, spinners, attention pulses, staggered entrances (animation-delay calc with a custom property index).`,
      pts: ['@keyframes from/to or percentages', 'fill-mode forwards keeps end state', 'element.animate() in JS', 'Respect reduced motion'],
      code: ['css', `@keyframes shimmer {                                  /* define steps */
  from { background-position: 200% 0; }               /* start */
  to   { background-position: -200% 0; }              /* end */
}
.skeleton {
  background: linear-gradient(90deg, #eee 25%, #f6f6f6 50%, #eee 75%); /* highlight band */
  background-size: 200% 100%;                         /* wider than the box */
  animation: shimmer 1.2s linear infinite;            /* loop forever */
}
.item { animation: fade-up .4s ease both; animation-delay: calc(var(--i) * 60ms); } /* stagger */
@keyframes fade-up { from { opacity: 0; translate: 0 8px; } }  /* "to" = current styles */`],
      iq: [['What does animation-fill-mode: both do?', 'Applies the first keyframe during the delay and keeps the last keyframe after the animation ends.']],
      cq: [['Animate with the Web Animations API.', `el.animate(                                   // returns an Animation object
  [{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], // keyframes
  { duration: 400, easing: 'ease-out' }         // timing
);`]],
      err: ['Infinite animations distracting users', 'Animating layout properties']
    }),
    t('css-filters-clip-mask', 'Filters, Blend Modes, clip-path & Masks', 'I', {
      one: 'filter (blur, brightness, grayscale), backdrop-filter (frosted glass), mix-blend-mode, clip-path shapes and mask images create visual effects without images.',
      ex: `backdrop-filter: blur(12px) blurs what is behind a translucent element (glassmorphism). filter applies to the element itself. mix-blend-mode blends with the background (multiply, screen, difference).

clip-path: polygon()/circle()/inset() cuts shapes and is animatable; mask-image with gradients fades edges. Effects can be GPU-heavy — test on low-end phones.`,
      pts: ['backdrop-filter for frosted glass', 'clip-path shapes are animatable', 'mask-image gradient fades', 'Check performance on mobile'],
      code: ['css', `.glass { background: rgb(255 255 255 / .1); backdrop-filter: blur(12px) saturate(1.4); } /* frosted panel */
.img:hover { filter: grayscale(0); } .img { filter: grayscale(1); transition: filter .3s; }     /* colour on hover */
.hexagon { clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); }          /* hex shape */
.fade-edges { mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent); } /* soft edges */`],
      iq: [['filter vs backdrop-filter?', 'filter affects the element and its content; backdrop-filter affects the area behind the element.']],
      cq: [['Reveal animation with clip-path.', `.reveal { clip-path: inset(0 100% 0 0); transition: clip-path .6s; } .reveal.on { clip-path: inset(0); } /* wipe in */`]],
      err: ['Heavy blur on large areas hurting scroll performance']
    })
  ),
  m('7. Modern CSS',
    L('css-modern'),
    t('css-custom-properties', 'Custom Properties (CSS Variables) & @property', 'I', {
      one: 'Custom properties (--name: value) are runtime variables that cascade and inherit, readable with var() and changeable from JS; @property registers typed, animatable variables.',
      ex: `Define tokens on :root, override them in components or themes, and read with var(--name, fallback). Unlike Sass variables they exist at runtime, so a single class or JS call can retheme a whole subtree.

@property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; } makes variables typed and animatable (e.g. animated gradients). Set from JS: el.style.setProperty('--x', '20px').`,
      pts: ['Runtime, cascading variables', 'var(--x, fallback)', 'Scoped overrides per component/theme', '@property for typed, animatable values'],
      code: ['css', `:root { --radius: 12px; --brand: #7cf2c8; }        /* global tokens */
.btn { border-radius: var(--radius); background: var(--brand); }
.btn.danger { --brand: crimson; }                   /* override only for this variant */
@property --angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; } /* typed variable */
.spinner { background: conic-gradient(from var(--angle), #7cf2c8, transparent); animation: rot 1s linear infinite; }
@keyframes rot { to { --angle: 360deg; } }          /* animating a variable works because it is typed */`],
      iq: [['CSS variables vs Sass variables?', 'Sass variables compile away to static values; CSS variables exist at runtime, cascade, inherit and can change via media queries or JS.']],
      cq: [['Drive a progress bar from JS with a variable.', `bar.style.setProperty('--p', 65 + '%'); /* CSS: .bar::after { width: var(--p); } */`]],
      err: ['Missing fallback for optional variables']
    }),
    t('css-nesting', 'Native CSS Nesting', 'I', {
      one: 'Write nested rules directly in CSS (like Sass): child selectors, & for the parent, and nested media/container queries.',
      ex: `.card { & h3 { } &:hover { } .dark & { } @media (min-width: 600px) { } }. & represents the parent selector. Nested selectors can start with a class or element directly in modern browsers.

Nesting improves organisation but deep nesting increases specificity and coupling — keep to 2–3 levels.`,
      pts: ['& = parent selector', 'Nested @media inside rules', 'Keep nesting shallow', 'Supported in all modern browsers'],
      code: ['css', `.card {
  padding: 16px;                       /* base */
  & h3 { margin: 0; }                  /* .card h3 */
  &:hover { border-color: teal; }      /* .card:hover */
  &.is-active { outline: 2px solid; }  /* .card.is-active */
  .theme-dark & { background: #111; }  /* .theme-dark .card */
  @media (width >= 600px) { padding: 24px; } /* nested media query */
}`],
      iq: [['Does native nesting replace Sass?', 'For nesting, mostly yes; Sass still offers mixins, functions and loops, though CSS is gaining many of these.']],
      cq: [['Nested states for a button.', `.btn { &:disabled { opacity: .5; } &:focus-visible { outline: 2px solid; } } /* grouped states */`]],
      err: ['Nesting 5+ levels deep']
    }),
    t('css-has-selector', 'The :has() Relational Selector', 'I', {
      one: ':has() matches an element if it contains (or is followed by) something matching the argument — the long-awaited "parent selector".',
      ex: `form:has(:invalid) styles a form with errors; .card:has(img) styles cards with images; label:has(+ input:checked) styles a label based on the next sibling; body:has(dialog[open]) prevents page scroll.

It removes a lot of JS that toggled classes on parents. Keep selectors inside :has() reasonably specific for performance.`,
      pts: ['Parent / previous-sibling selection', 'Replaces many JS class toggles', 'Works with :not() and state pseudo-classes', 'Supported in all modern browsers'],
      code: ['css', `.card:has(img) { padding-top: 0; }                 /* cards that contain an image */
form:has(:user-invalid) .submit { opacity: .5; }    /* dim submit when invalid fields exist */
body:has(dialog[open]) { overflow: hidden; }        /* lock scroll when a modal is open */
.field:has(input:focus-visible) { box-shadow: 0 0 0 2px #4dabf7; } /* highlight focused field group */
.grid:has(> :nth-child(5)) { grid-template-columns: repeat(3, 1fr); } /* quantity query */`],
      iq: [['What can :has() replace?', 'JS that adds classes to parents based on children state: error forms, cards with media, checked toggles, open modals.']],
      cq: [['Style a todo item when its checkbox is checked.', `li:has(input[type="checkbox"]:checked) { text-decoration: line-through; opacity: .6; } /* done items */`]],
      err: ['Very broad :has() on body with complex selectors']
    }),
    t('css-cascade-layers', 'Cascade Layers (@layer)', 'A', {
      one: '@layer groups styles into ordered layers; later layers win regardless of selector specificity, making large CSS predictable.',
      ex: `Declare order once: @layer reset, base, components, utilities; then put rules in layers. A simple .mt-0 utility in the utilities layer beats a highly specific selector in components. Unlayered styles beat all layers.

Import third-party CSS into a low layer: @import url(lib.css) layer(vendor). !important reverses layer order (earlier layers' important rules win).`,
      pts: ['Layer order beats specificity', 'Unlayered CSS wins over layered', 'Vendor CSS into a low layer', 'Important reverses layer order'],
      flow: ['reset layer', 'base layer', 'components layer', 'utilities layer wins'],
      code: ['css', `@layer reset, base, components, utilities;        /* declare order: last wins */
@import url("vendor.css") layer(reset);           /* tame third-party CSS */
@layer components {
  #app .card .title { color: navy; }              /* very specific */
}
@layer utilities {
  .text-red { color: crimson; }                   /* still wins: later layer */
}`],
      iq: [['How do layers change specificity battles?', 'The layer order is compared first; specificity only matters within the same layer.']],
      cq: [['Put a CSS framework below your own styles.', `@import url("bootstrap.css") layer(framework);   /* framework layer */
@layer framework, app;                             /* app layer overrides framework */`]],
      err: ['Forgetting unlayered styles beat all layers']
    }),
    t('css-view-transitions', 'View Transitions API', 'A', {
      one: 'Animate between page states (or full page navigations) by letting the browser snapshot old and new views and cross-fade/morph them.',
      ex: `Same-document: document.startViewTransition(() => updateDOM()). The browser captures the old view, runs your update, captures the new view and animates using ::view-transition-old/new pseudo-elements. Give shared elements a view-transition-name to morph them (thumbnail → hero image).

Cross-document (MPA): @view-transition { navigation: auto; } in both pages. Frameworks (Next.js, Astro, React's <ViewTransition>) integrate it. Respect reduced motion.`,
      pts: ['startViewTransition(callback)', 'view-transition-name for shared elements', '@view-transition for page navigations', 'Customise via ::view-transition pseudo-elements'],
      flow: ['Snapshot old state', 'Run DOM update', 'Snapshot new state', 'Animate old to new', 'Pseudo-elements removed'],
      code: ['css', `/* CSS */
.thumb { view-transition-name: product-photo; }      /* same name on list & detail images */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: .3s; } /* page fade speed */
@view-transition { navigation: auto; }               /* cross-document transitions (MPA) */

/* JS (same-document) */
/* function go(render) {
     if (!document.startViewTransition) return render();   // fallback
     document.startViewTransition(() => render());          // animated update
   } */`],
      iq: [['How does the browser animate between views?', 'It takes screenshots of old and new states into a pseudo-element tree and animates them with CSS animations you can customise.']],
      cq: [['Animated list filter.', `filterBtn.onclick = () => document.startViewTransition(() => applyFilter('react')); // smooth re-layout`]],
      err: ['Duplicate view-transition-name on the same page (must be unique)']
    }),
    t('css-scroll-features', 'Scroll Snap, Scroll-driven Animations & smooth scrolling', 'A', {
      one: 'Native scroll features: scroll-snap for carousels, scroll-behavior for smooth anchors, and scroll-driven animations tied to scroll position.',
      ex: `Scroll snap: container scroll-snap-type: x mandatory; children scroll-snap-align: start — a CSS-only carousel. scroll-padding/scroll-margin offset anchors under sticky headers.

Scroll-driven animations: animation-timeline: scroll() (page scroll progress) or view() (element visibility) link keyframes to scrolling, replacing scroll listeners for progress bars and reveal effects — running off the main thread.`,
      pts: ['scroll-snap for carousels', 'scroll-margin-top for sticky headers', 'animation-timeline: scroll() / view()', 'Runs off the main thread'],
      code: ['css', `.carousel { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; } /* snap container */
.carousel > * { flex: 0 0 85%; scroll-snap-align: center; }     /* each slide snaps centred */
html { scroll-behavior: smooth; scroll-padding-top: 72px; }      /* smooth + offset for header */
.progress { position: fixed; top: 0; height: 4px; background: #7cf2c8;
  transform-origin: left; animation: grow linear; animation-timeline: scroll(); } /* reading progress */
@keyframes grow { from { scale: 0 1; } to { scale: 1 1; } }
.reveal { animation: fade-in linear both; animation-timeline: view(); animation-range: entry 0% cover 30%; } /* fade when entering */
@keyframes fade-in { from { opacity: 0; translate: 0 20px; } }`],
      iq: [['Why are scroll-driven animations better than scroll listeners?', 'They are declarative and run on the compositor, avoiding main-thread work and jank.']],
      cq: [['Horizontal snap gallery for mobile.', `.gallery { display: grid; grid-auto-flow: column; grid-auto-columns: 80%; overflow-x: auto; scroll-snap-type: x mandatory; } /* swipeable */`]],
      err: ['scroll-snap mandatory on content taller than the viewport (traps users)']
    }),
    t('css-anchor-positioning', 'Anchor Positioning', 'A', {
      one: 'CSS anchor positioning tethers an element (tooltip, menu) to another element (the anchor) with fallbacks when it would overflow — no JS positioning library needed.',
      ex: `Give the anchor anchor-name: --btn; the positioned element uses position-anchor: --btn and position-area: bottom (or top: anchor(bottom)). position-try-fallbacks: flip-block flips it when there is no space.

Pairs naturally with the popover attribute. Support landed across major browsers in 2025–2026; keep a fallback for older browsers (e.g. Floating UI).`,
      pts: ['anchor-name on the trigger', 'position-anchor + position-area on the popup', 'position-try-fallbacks for overflow', 'Replaces JS positioning libs'],
      code: ['css', `.menu-btn { anchor-name: --menu; }                  /* declare the anchor */
.menu[popover] {
  position-anchor: --menu;                           /* attach to the button */
  position-area: bottom span-right;                  /* below, aligned to start */
  margin: 4px 0 0;                                   /* small gap */
  position-try-fallbacks: flip-block;                /* flip above if no room below */
}`],
      iq: [['What problem does anchor positioning solve?', 'Positioning floating UI relative to another element and keeping it on screen, previously requiring JS measurement on scroll/resize.']],
      cq: [['Tooltip above a button.', `.tip { position: absolute; position-anchor: --b; bottom: anchor(top); justify-self: anchor-center; } /* centred above */`]],
      err: ['Not providing a fallback for unsupported browsers']
    }),
    t('css-logical-properties', 'Logical Properties & Writing Modes', 'I', {
      one: 'Logical properties (margin-inline, padding-block, inset-inline-start) follow text direction instead of physical left/right, so layouts adapt to RTL languages automatically.',
      ex: `inline = text direction axis (left↔right in English), block = stacking axis (top↔bottom). margin-inline-start becomes margin-left in LTR and margin-right in RTL. Shorthands: padding-inline: 1rem, inset: 0, border-block-end.

Also width/height map to inline-size/block-size. Use them by default for international products.`,
      pts: ['inline = text direction, block = flow direction', 'Auto-flip for RTL', 'inline-size / block-size', 'Use by default for i18n'],
      code: ['css', `.card { padding-inline: 16px; padding-block: 12px; }  /* left/right and top/bottom */
.icon { margin-inline-end: 8px; }                     /* right in LTR, left in RTL */
.sidebar { border-inline-start: 3px solid teal; }     /* leading edge */
.box { inline-size: 300px; max-block-size: 50vh; }    /* width / max-height */`],
      iq: [['Why use logical properties?', 'They adapt automatically to RTL and vertical writing modes, avoiding separate RTL stylesheets.']],
      cq: [['Convert margin-left: auto (push right) logically.', `.push-end { margin-inline-start: auto; } /* pushes to the end in any direction */`]],
      err: ['Hard-coded left/right in multilingual apps']
    }),
    t('css-supports-feature-detection', '@supports, Feature Detection & Progressive Enhancement', 'I', {
      one: '@supports applies CSS only when the browser supports a property/value or selector, enabling progressive enhancement.',
      ex: `@supports (display: grid) { … }, @supports selector(:has(a)) { … }, @supports not (…). Write a solid baseline first, then enhance. In JS: CSS.supports('container-type', 'inline-size').

Check support on caniuse.com and Baseline (web-features) status; tools like browserslist + autoprefixer/Lightning CSS add prefixes and lower syntax automatically.`,
      pts: ['Baseline first, enhance with @supports', 'selector() for selector support', 'CSS.supports() in JS', 'Check Baseline status'],
      code: ['css', `.layout { display: flex; flex-wrap: wrap; }                     /* baseline */
@supports (display: grid) {
  .layout { display: grid; grid-template-columns: repeat(3, 1fr); } /* enhanced */
}
@supports selector(:has(*)) {
  .form:has(:invalid) .hint { display: block; }                    /* only where :has works */
}`],
      iq: [['What is progressive enhancement?', 'Building a working baseline for all browsers, then layering advanced features where supported.']],
      cq: [['Feature-detect in JS.', `if (CSS.supports('anchor-name', '--a')) document.documentElement.classList.add('has-anchor'); // flag class`]],
      err: ['Shipping features without fallbacks for important flows']
    })
  ),
  m('8. Architecture, Tooling & Performance',
    t('css-methodologies', 'CSS Architecture: BEM, OOCSS, ITCSS, Utility-first', 'I', {
      one: 'Naming and organisation strategies that keep large CSS codebases maintainable: BEM (block__element--modifier), OOCSS, ITCSS layering, SMACSS and utility-first.',
      ex: `BEM: .card, .card__title, .card--featured — flat, explicit, low-specificity class names. OOCSS separates structure from skin. ITCSS orders CSS from generic to specific (settings → tools → generic → elements → objects → components → utilities), which maps well to cascade layers.

Modern teams often combine component-scoped styles (CSS Modules, framework scoping) with utilities (Tailwind) and design tokens.`,
      pts: ['BEM: block__element--modifier', 'Keep specificity low and flat', 'ITCSS: generic → specific', 'Combine with tokens and layers'],
      code: ['css', `.card { padding: 16px; }                 /* block */
.card__title { font-weight: 600; }       /* element of the block */
.card__img { border-radius: 8px; }       /* another element */
.card--featured { border: 2px solid gold; } /* modifier: variant of the block */`],
      iq: [['What problem does BEM solve?', 'Naming collisions and specificity conflicts by making class names explicit, unique and flat.']],
      cq: [['BEM markup for a search form.', `<form class="search search--compact"><input class="search__input"><button class="search__btn">Go</button></form> <!-- block, elements, modifier -->`]],
      err: ['Mixing many naming systems in one project']
    }),
    t('css-preprocessors', 'Sass/SCSS & Preprocessors', 'B', {
      one: 'Sass (SCSS) extends CSS with variables, nesting, mixins, functions, loops and partials, compiled to plain CSS at build time.',
      ex: `Still common in enterprise (Angular projects default to SCSS). Features: $variables (compile-time), @mixin/@include for reusable blocks, @use/@forward modules (replacing @import), functions, maps and @each loops for generating utilities.

Native CSS now covers variables, nesting and many functions, so new projects rely less on Sass — but you must read and maintain it.`,
      pts: ['$vars compile to static values', '@mixin / @include', '@use instead of @import', 'Native CSS covers many features now'],
      code: ['scss', `@use "sass:math";                         // built-in module
$space: 8px;                               // compile-time variable
@mixin flex-center {                       // reusable block
  display: flex; align-items: center; justify-content: center;
}
.btn {
  padding: $space math.div($space * 3, 2); // 8px 12px
  @include flex-center;                    // paste the mixin
  &:hover { opacity: .9; }                 // nesting with &
}
@each $name, $color in (primary: teal, danger: crimson) { // loop over a map
  .text-#{$name} { color: $color; }        // generates .text-primary, .text-danger
}`],
      iq: [['Sass variables vs CSS variables?', 'Sass variables are resolved at compile time; CSS variables exist at runtime and can change with the cascade or JS.'],
           ['@use vs @import in Sass?', '@use loads a module once with namespacing; @import (deprecated) duplicates and pollutes the global scope.']],
      cq: [['Responsive mixin.', `@mixin md { @media (min-width: 768px) { @content; } }  // wrapper mixin
.grid { display: block; @include md { display: grid; } } // usage`]],
      err: ['Deep nesting producing heavy selectors']
    }),
    t('css-modules-css-in-js', 'Scoped Styles: CSS Modules, CSS-in-JS & Framework Scoping', 'I', {
      one: 'Techniques to scope CSS to components: CSS Modules (hashed class names), CSS-in-JS (styled-components, Emotion, zero-runtime vanilla-extract/Panda), Angular/Vue scoped styles and Shadow DOM.',
      ex: `CSS Modules: import styles from './Card.module.css' and use className={styles.title}; classes are hashed at build time so they never collide. Runtime CSS-in-JS generates styles in JS during render, which costs performance and complicates Server Components; zero-runtime libraries extract static CSS at build time.

Angular uses emulated encapsulation (attribute selectors) by default; Vue uses <style scoped>.`,
      pts: ['CSS Modules = build-time scoping', 'Runtime CSS-in-JS costs performance', 'Zero-runtime alternatives', 'Angular/Vue built-in scoping'],
      code: ['jsx', `// Card.module.css → .title { font-weight: 600; }
import styles from './Card.module.css';            // object of hashed class names

export function Card({ title }) {                   // React component
  return <h3 className={styles.title}>{title}</h3>; // e.g. class="Card_title__a8f3k"
}`],
      iq: [['Why are CSS Modules popular in React apps?', 'They give local scoping with plain CSS and zero runtime cost.'],
           ['Downside of runtime CSS-in-JS?', 'Style generation during render adds JS work, larger bundles and issues with streaming/Server Components.']],
      cq: [['Combine conditional module classes.', `<button className={[styles.btn, active && styles.active].filter(Boolean).join(' ')}>Go</button> // join truthy classes`]],
      err: ['Global styles leaking into components']
    }),
    t('css-tailwind', 'Utility-first CSS & Tailwind', 'I', {
      one: 'Utility-first CSS styles elements with small single-purpose classes (flex, p-4, text-sm); Tailwind generates only the utilities you use.',
      ex: `Benefits: no naming, consistent design tokens, styles co-located with markup, tiny production CSS. Variants: hover:, md:, dark:, focus-visible:, group-hover:. Tailwind v4 is configured in CSS (@theme) and uses a fast Rust engine.

Downsides: long class lists — extract components (React/Angular) rather than @apply everywhere. Use clsx/cn helpers for conditional classes.`,
      pts: ['Small composable utilities', 'Responsive/state variants', 'Only used classes ship', 'Extract components for repetition'],
      code: ['jsx', `export function Button({ children, danger }) {                // reusable component
  return (
    <button
      className={\`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium
        \${danger ? 'bg-red-600 text-white' : 'bg-emerald-300 text-emerald-950'}
        hover:opacity-90 focus-visible:outline focus-visible:outline-2 md:text-base\`}  // utilities + variants
    >
      {children}
    </button>
  );
}`],
      iq: [['How does Tailwind keep CSS small?', 'It scans source files and generates only the utility classes actually used.'],
           ['When use @apply?', 'Sparingly — for third-party markup you cannot add classes to; prefer components for reuse.']],
      cq: [['Dark mode card with Tailwind.', `<div className="rounded-2xl bg-white p-4 shadow dark:bg-slate-900 dark:text-slate-100">Card</div> {/* dark variant */}`]],
      err: ['Building huge @apply component layers, recreating BEM']
    }),
    t('css-postcss-tooling', 'PostCSS, Autoprefixer, Lightning CSS & Resets', 'I', {
      one: 'Build tools that transform CSS: PostCSS plugins (autoprefixer, nesting), Lightning CSS (fast minify/prefix/lower), plus resets/normalize for consistent baselines.',
      ex: `Autoprefixer adds vendor prefixes based on your browserslist targets. Lightning CSS (built into Vite options) parses, prefixes, lowers modern syntax and minifies very fast. A reset (modern-normalize or a custom reset) removes browser inconsistencies: box-sizing, margins, media max-width, form font inheritance.`,
      pts: ['browserslist defines targets', 'Autoprefixer adds prefixes', 'Lightning CSS = fast transform + minify', 'Use a small modern reset'],
      code: ['css', `/* Modern minimal reset */
*, *::before, *::after { box-sizing: border-box; }      /* intuitive sizing */
* { margin: 0; }                                        /* remove default margins */
html { -webkit-text-size-adjust: 100%; }                /* stop iOS font inflation */
body { line-height: 1.5; -webkit-font-smoothing: antialiased; } /* readable text */
img, picture, video, canvas, svg { display: block; max-width: 100%; } /* responsive media */
input, button, textarea, select { font: inherit; }      /* controls use page font */
p, h1, h2, h3 { overflow-wrap: break-word; }            /* avoid overflow */`],
      iq: [['What is browserslist?', 'A shared config of target browsers used by Autoprefixer, Babel, Lightning CSS and others to decide what to transform.']],
      cq: [['browserslist config in package.json.', `"browserslist": ["> 0.5%", "last 2 versions", "not dead"]   // target browsers`]],
      err: ['Hand-writing vendor prefixes']
    }),
    t('css-design-tokens-theming', 'Design Tokens & Theming', 'I', {
      one: 'Design tokens are named design decisions (colours, spacing, radii, typography) stored centrally and exposed as CSS variables to theme entire products.',
      ex: `Layer tokens: primitive (--blue-500), semantic (--color-bg, --color-text, --color-accent) and component (--btn-bg). Components use semantic tokens only, so themes (dark, brand, high-contrast) just remap semantic tokens.

Tools: Style Dictionary or Tokens Studio (Figma) export tokens to CSS/JS/Android/iOS. Keep a small spacing and type scale.`,
      pts: ['Primitive → semantic → component tokens', 'Components consume semantic tokens', 'Themes remap tokens', 'Export from Figma with tooling'],
      flow: ['Primitive tokens', 'Semantic tokens', 'Component tokens', 'Themes swap semantic values'],
      code: ['css', `:root {
  --blue-500: #3b82f6; --gray-900: #111827; --white: #fff;   /* primitives */
  --color-bg: var(--white); --color-text: var(--gray-900);   /* semantic (light) */
  --color-accent: var(--blue-500);
  --space-1: 4px; --space-2: 8px; --space-4: 16px;           /* spacing scale */
}
[data-theme="dark"] { --color-bg: var(--gray-900); --color-text: var(--white); } /* only semantic changes */
.btn { background: var(--color-accent); padding: var(--space-2) var(--space-4); } /* component uses semantic */`],
      iq: [['Why separate primitive and semantic tokens?', 'Semantic tokens describe intent (background, danger) so themes can change values without touching components.']],
      cq: [['Brand theming for white-label clients.', `[data-brand="ups"] { --color-accent: #ffb500; } [data-brand="acme"] { --color-accent: #e11d48; } /* per brand */`]],
      err: ['Components using raw hex values']
    }),
    t('css-performance', 'CSS Performance: critical CSS, contain, content-visibility, will-change', 'A', {
      one: 'Techniques to make CSS load and render faster: inline critical CSS, avoid render-blocking, reduce reflows, and use containment and content-visibility.',
      ex: `CSS is render-blocking: inline the above-the-fold critical CSS and load the rest asynchronously; remove unused CSS. Avoid layout thrashing by animating transform/opacity.

contain: layout paint style isolates a component's rendering. content-visibility: auto skips rendering offscreen sections (huge win for long pages) — pair with contain-intrinsic-size to avoid scrollbar jumps. will-change hints upcoming animations but overuse wastes memory.`,
      pts: ['Critical CSS inline, rest async', 'content-visibility: auto for long pages', 'contain isolates work', 'will-change sparingly'],
      code: ['css', `.feed-item {
  content-visibility: auto;              /* skip rendering while offscreen */
  contain-intrinsic-size: auto 320px;    /* estimated height to keep scrollbar stable */
}
.widget { contain: layout paint; }       /* changes inside don't affect outside layout */
.drawer.opening { will-change: transform; } /* hint only while animating */`],
      iq: [['Why is CSS render-blocking?', 'The browser needs the CSSOM to build the render tree; rendering waits for stylesheets in the head.'],
           ['What does content-visibility: auto do?', 'Skips layout and paint of offscreen content until it is near the viewport.']],
      cq: [['Load non-critical CSS without blocking.', `<link rel="stylesheet" href="/rest.css" media="print" onload="this.media='all'"> <!-- loads async then applies -->`]],
      err: ['will-change on many elements permanently', 'Huge unused CSS frameworks']
    })
  )
];
