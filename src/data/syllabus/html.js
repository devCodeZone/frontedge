// HTML5 — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import web from '../terms/web.js';
const L = legacyPicker(web);

export default [
  m('1. Foundations',
    t('html-how-browsers-render', 'What is HTML & How Browsers Render It', 'B', {
      one: 'HTML (HyperText Markup Language) describes the structure and meaning of web content; the browser parses it into the DOM and renders it.',
      ex: `HTML is not a programming language — it is a markup language made of elements (tags) that describe content: headings, paragraphs, links, images, forms. CSS styles it and JavaScript adds behaviour.

When a page loads, the browser downloads the HTML, the parser reads it top to bottom and builds the DOM (Document Object Model) tree. CSS is parsed into the CSSOM. Together they form the render tree, which goes through layout (sizes and positions) and paint (pixels). A blocking <script> pauses parsing, which is why script placement and defer/async matter.`,
      pts: ['HTML = structure & meaning; CSS = presentation; JS = behaviour', 'Parser builds the DOM tree top-down', 'DOM + CSSOM → render tree → layout → paint → composite', 'Blocking scripts pause HTML parsing'],
      flow: ['Download HTML bytes', 'Tokenise tags', 'Build DOM tree', 'Parse CSS into CSSOM', 'Render tree', 'Layout', 'Paint and composite'],
      code: ['html', `<!DOCTYPE html>                       <!-- tells the browser: use standards mode -->
<html lang="en">                      <!-- root element; lang helps screen readers & SEO -->
  <head>                              <!-- metadata, not shown on the page -->
    <meta charset="UTF-8">            <!-- character encoding: supports every language -->
    <title>My first page</title>      <!-- text in the browser tab and search results -->
  </head>                             <!-- end of head -->
  <body>                              <!-- everything visible goes here -->
    <h1>Hello, web!</h1>              <!-- main heading -->
    <p>HTML gives content structure.</p> <!-- a paragraph -->
  </body>                             <!-- end of body -->
</html>                               <!-- end of document -->`],
      iq: [['Is HTML a programming language?', 'No. It is a markup language that describes structure and meaning; it has no logic, variables or loops.'],
           ['What is the DOM?', 'The Document Object Model: a tree of objects the browser builds from HTML, which JavaScript can read and modify.'],
           ['What is the critical rendering path?', 'The steps from receiving HTML/CSS/JS to pixels: DOM, CSSOM, render tree, layout, paint, composite. Optimising it speeds up first render.']],
      cq: [['Write the minimal valid HTML5 document.', `<!DOCTYPE html>                <!-- standards mode -->
<html lang="en">               <!-- root with language -->
<head>                         <!-- metadata -->
  <meta charset="UTF-8">       <!-- encoding -->
  <title>Page</title>          <!-- required title -->
</head>                        <!-- end head -->
<body></body>                  <!-- visible content -->
</html>                        <!-- end root -->`]],
      err: ['Thinking HTML controls appearance — that is CSS’s job', 'Putting blocking scripts in <head> without defer']
    }),
    t('html-document-structure', 'Document Structure: DOCTYPE, html, head, body', 'B', {
      one: 'Every HTML page has a DOCTYPE declaration, a root <html> element, a <head> for metadata and a <body> for visible content.',
      ex: `<!DOCTYPE html> switches the browser into standards mode. Without it, browsers fall back to "quirks mode" and emulate old, inconsistent behaviour (box model differences, odd table sizing).

<html lang="…"> is the root and declares the page language. <head> holds metadata: charset, viewport, title, links to CSS, scripts, SEO tags. <body> holds everything the user sees. Browsers auto-insert missing head/body tags, but writing them explicitly keeps documents predictable.`,
      pts: ['DOCTYPE prevents quirks mode', 'lang attribute on <html> is important for accessibility', '<head> = metadata, <body> = content', 'Only one <head> and one <body>'],
      flow: ['DOCTYPE', 'html lang', 'head: meta, title, links', 'body: visible content'],
      code: ['html', `<!DOCTYPE html>                                  <!-- standards mode, no quirks -->
<html lang="hi">                                 <!-- page language: Hindi -->
  <head>                                         <!-- start metadata -->
    <meta charset="UTF-8">                       <!-- must be in the first 1024 bytes -->
    <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- mobile scaling -->
    <title>Profile</title>                       <!-- tab title -->
    <link rel="stylesheet" href="styles.css">    <!-- external CSS -->
    <script src="app.js" defer></script>         <!-- defer: run after parsing, keep order -->
  </head>                                        <!-- end metadata -->
  <body>                                         <!-- visible content starts -->
    <main>Content</main>                         <!-- primary content -->
  </body>                                        <!-- end visible content -->
</html>                                          <!-- end document -->`],
      iq: [['What happens if you omit the DOCTYPE?', 'The browser renders in quirks mode, emulating legacy behaviour such as a different box model, causing layout bugs.'],
           ['Why put lang on the html element?', 'Screen readers choose the correct pronunciation, browsers offer translation, and search engines understand the language.'],
           ['Can you put a <div> in <head>?', 'No. Body-content elements in head make the parser close head early and start body implicitly.']],
      cq: [['Add right-to-left support for an Arabic page.', `<html lang="ar" dir="rtl">   <!-- dir=rtl flips text direction and layout flow -->`]],
      err: ['Missing viewport meta, so mobile shows a zoomed-out desktop page', 'Multiple <title> tags']
    }),
    t('html-elements-attributes', 'Elements, Tags & Attributes', 'B', {
      one: 'An element is an opening tag, content and closing tag; attributes are name="value" pairs in the opening tag that configure it.',
      ex: `Elements can nest to form a tree: <p>Hello <strong>world</strong></p>. Some elements are void (self-closing) and have no content or closing tag: <img>, <br>, <input>, <meta>, <link>, <hr>.

Attributes add information: href on links, src/alt on images, type on inputs. Boolean attributes (disabled, checked, required, hidden) are true just by being present — disabled="false" still disables! Attribute values should be quoted.`,
      pts: ['Element = tags + content', 'Void elements: img, br, input, meta, link, hr', 'Boolean attributes are true when present', 'Always quote attribute values'],
      flow: ['Opening tag with attributes', 'Content / child elements', 'Closing tag'],
      code: ['html', `<a href="/about" title="About us">About</a>    <!-- element with two attributes -->
<img src="logo.png" alt="Company logo">         <!-- void element: no closing tag -->
<input type="checkbox" checked>                  <!-- boolean attribute: present = true -->
<button disabled>Save</button>                   <!-- disabled even without a value -->
<p>Text with <em>nested</em> element.</p>       <!-- nesting forms the DOM tree -->`],
      iq: [['Difference between a tag and an element?', 'A tag is the markup (<p>); an element is the complete thing: opening tag, content and closing tag, represented as a DOM node.'],
           ['What are void elements?', 'Elements that cannot have content and have no closing tag, like img, br, input, meta, link.'],
           ['Attribute vs property?', 'Attributes are in HTML source; properties are on the DOM object. Some sync (id), some do not (input value attribute is the default, value property is current).']],
      cq: [['Read and change an attribute with JS.', `const link = document.querySelector('a');   // find the first link
console.log(link.getAttribute('href'));      // read the HTML attribute
link.setAttribute('target', '_blank');       // add/replace an attribute
link.removeAttribute('title');               // remove an attribute`]],
      err: ['Writing disabled="false" expecting it to enable the element', 'Improper nesting like <p><div></div></p>']
    }),
    t('html-global-attributes', 'Global Attributes (id, class, data-*, hidden, tabindex…)', 'B', {
      one: 'Attributes that can be used on any HTML element, such as id, class, style, title, lang, dir, hidden, tabindex, data-* and contenteditable.',
      ex: `id must be unique per page (used for anchors, labels, JS lookups). class groups elements for CSS/JS. data-* attributes store custom data readable via element.dataset. hidden removes an element from rendering and the accessibility tree.

tabindex controls keyboard focus: 0 adds an element to the natural tab order, -1 makes it focusable only via JS, positive values create confusing orders and should be avoided. Others: title (tooltip), lang/dir, contenteditable, draggable, spellcheck, inert, translate, accesskey, autofocus, popover.`,
      pts: ['id unique; class reusable', 'data-* → element.dataset (camelCase)', 'tabindex="0" focusable, "-1" programmatic only', 'Avoid positive tabindex'],
      code: ['html', `<article id="post-42" class="card featured"          <!-- unique id + two classes -->
         data-author-id="7" data-likes="120">           <!-- custom data attributes -->
  <p contenteditable="true">Edit me inline</p>        <!-- user can edit this text -->
  <span title="Shown on hover">Tooltip</span>          <!-- native tooltip -->
  <div tabindex="0">Focusable box</div>                <!-- joins Tab order -->
  <p hidden>Not rendered</p>                           <!-- hidden from everyone -->
</article>
<script>
  const post = document.getElementById('post-42');      // look up by id
  console.log(post.dataset.authorId, post.dataset.likes); // "7" "120" (always strings)
</script>`],
      iq: [['How do you read data-user-id in JS?', 'element.dataset.userId — hyphenated names become camelCase and values are strings.'],
           ['hidden vs display:none vs visibility:hidden?', 'hidden attribute behaves like display:none (removed from layout and accessibility tree); visibility:hidden keeps the space but hides it.'],
           ['Why avoid positive tabindex?', 'It overrides the natural DOM order and creates an unpredictable keyboard order for users.']],
      cq: [['Filter cards by data-category with JS.', `document.querySelectorAll('.card').forEach((card) => {  // loop all cards
  const show = card.dataset.category === 'react';        // compare custom data
  card.hidden = !show;                                    // toggle the hidden attribute
});`]],
      err: ['Duplicate ids on a page', 'Storing objects in data-* without JSON.stringify']
    }),
    t('html-comments-entities', 'Comments & Character Entities', 'B', {
      one: 'Comments (<!-- -->) are ignored by the browser; entities like &lt; &amp; &nbsp; display reserved or special characters.',
      ex: `Comments document markup but remain visible in View Source, so never put secrets in them.

Characters like < and & have special meaning, so to show them as text use entities: &lt; &gt; &amp; &quot; &apos;. &nbsp; is a non-breaking space (keeps words together). With UTF-8 you can type most symbols (₹ © —) directly, but escaping < and & in text is still required.`,
      pts: ['Comments are visible in page source', '&lt; &gt; &amp; &quot; escape reserved characters', '&nbsp; = non-breaking space', 'UTF-8 lets you type most symbols directly'],
      code: ['html', `<!-- Navigation starts here (visible in View Source!) -->  <!-- an HTML comment -->
<p>5 &lt; 10 &amp;&amp; 10 &gt; 5</p>          <!-- renders: 5 < 10 && 10 > 5 -->
<p>Price:&nbsp;₹499</p>                          <!-- nbsp keeps "Price:" and amount together -->
<p>&copy; 2026 FrontEdge</p>                     <!-- © symbol via named entity -->
<code>&lt;div&gt;</code>                         <!-- show a tag as text -->`],
      iq: [['Why escape < in text?', 'The parser treats < as the start of a tag; &lt; renders the literal character safely.'],
           ['What is &nbsp; used for?', 'A space that prevents a line break between words, e.g. "10 kg" or "Mr. Sharma".'],
           ['Are HTML comments safe for sensitive notes?', 'No — anyone can read them in the page source.']],
      cq: [['Escape user text before inserting as HTML (prefer textContent).', `function escapeHtml(s) {                      // converts special characters
  return s.replace(/&/g, '&amp;')              // & first, so we don't double-escape
          .replace(/</g, '&lt;')               // less-than
          .replace(/>/g, '&gt;')               // greater-than
          .replace(/"/g, '&quot;');            // double quote (for attributes)
}`]],
      err: ['Leaving TODOs with internal URLs or keys in comments', 'Using many &nbsp; for layout spacing instead of CSS']
    }),
    t('html-head-meta', 'The <head>: title, meta charset & viewport', 'B', {
      one: 'The head holds metadata: the page title, character encoding, responsive viewport settings and links to resources.',
      ex: `<title> appears in tabs, bookmarks and search results — make it unique and descriptive. <meta charset="UTF-8"> must appear early so the browser decodes text correctly.

<meta name="viewport" content="width=device-width, initial-scale=1"> is essential for mobile: without it phones render a 980px-wide desktop page zoomed out. Avoid user-scalable=no — blocking zoom hurts accessibility. Other head content: description, theme-color, icons, manifest, stylesheets, scripts, preload hints and social meta tags.`,
      pts: ['Unique, descriptive <title>', 'charset first', 'viewport meta is required for responsive design', 'Never disable zoom'],
      code: ['html', `<head>                                                       <!-- metadata container -->
  <meta charset="UTF-8">                                     <!-- decode text as UTF-8 -->
  <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- responsive on phones -->
  <title>React Hooks Explained | FrontEdge</title>           <!-- tab + search title -->
  <meta name="description" content="Learn useState and useEffect with diagrams."> <!-- search snippet -->
  <meta name="theme-color" content="#0f1115">                <!-- mobile browser UI colour -->
  <link rel="icon" href="/favicon.svg">                      <!-- tab icon -->
</head>                                                      <!-- end head -->`],
      iq: [['What does the viewport meta tag do?', 'Sets the layout viewport width to the device width and the initial zoom, so responsive CSS works on mobile.'],
           ['Why not use user-scalable=no?', 'It prevents pinch-zoom, failing WCAG for users with low vision.'],
           ['Where should meta charset go?', 'As early as possible in head (within the first 1024 bytes).']],
      cq: [['Change the page title dynamically.', `document.title = '(3) New messages';   // updates tab text immediately`]],
      err: ['Same title on every page', 'Missing viewport tag']
    })
  ),
  m('2. Text & Content',
    t('html-headings-paragraphs', 'Headings & Paragraphs', 'B', {
      one: '<h1>–<h6> define a hierarchy of section headings and <p> marks paragraphs of text.',
      ex: `Headings create the document outline that screen-reader users navigate by. Use one <h1> for the page topic, then h2 for sections, h3 for sub-sections — never skip levels just to get a smaller font. Style with CSS instead.

<p> is for paragraphs; browsers add margins by default. Do not use empty paragraphs or <br><br> for spacing.`,
      pts: ['One h1 per page (recommended)', 'Do not skip heading levels', 'Choose headings for meaning, not size', 'Use CSS margins, not empty <p>'],
      flow: ['h1 page topic', 'h2 section', 'h3 sub-section', 'p paragraphs'],
      code: ['html', `<h1>Learn JavaScript</h1>             <!-- page topic -->
<h2>Closures</h2>                     <!-- section -->
<p>A closure remembers its scope.</p> <!-- paragraph -->
<h3>Use cases</h3>                    <!-- sub-section of Closures -->
<p>Debounce, memoize, modules.</p>    <!-- paragraph -->
<h2>Promises</h2>                     <!-- next section, back to h2 -->`],
      iq: [['Why does heading order matter?', 'Assistive tech builds an outline from headings; skipping levels or using headings for styling confuses navigation and SEO.'],
           ['Can you have multiple h1?', 'HTML allows it, but one h1 per page is recommended for clarity and accessibility.']],
      cq: [['List all headings on a page with JS (outline checker).', `document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((h) => { // every heading
  console.log(h.tagName, h.textContent.trim());                  // e.g. "H2 Closures"
});`]],
      err: ['Using <h4> because it "looks right"', 'Bold <p> instead of a real heading']
    }),
    t('html-text-formatting', 'Text-level Semantics (strong, em, mark, code, time…)', 'B', {
      one: 'Inline elements that add meaning to text: strong (importance), em (emphasis), mark (highlight), code, kbd, abbr, time, sub/sup, small, del/ins.',
      ex: `Use semantic elements over purely visual ones. <strong> means importance and <em> means stress emphasis; <b> and <i> are for stylistic offset without extra importance (keywords, foreign words).

<code> for code, <kbd> for keyboard input, <samp> for program output, <pre> preserves whitespace, <abbr title> expands abbreviations, <time datetime> gives machine-readable dates, <mark> highlights search matches, <del>/<ins> show edits, <sub>/<sup> for H₂O and x².`,
      pts: ['strong/em carry meaning; b/i are stylistic', '<time datetime="2026-10-22"> is machine readable', '<pre> keeps whitespace; combine with <code>', '<mark> for search highlights'],
      code: ['html', `<p><strong>Warning:</strong> do not mutate state.</p>     <!-- importance -->
<p>You <em>must</em> add a key.</p>                        <!-- spoken emphasis -->
<p>Press <kbd>Ctrl</kbd> + <kbd>S</kbd> to save.</p>       <!-- keyboard keys -->
<p>Call <code>useState()</code> at the top level.</p>      <!-- inline code -->
<p><abbr title="Document Object Model">DOM</abbr></p>     <!-- abbreviation with expansion -->
<p>Released <time datetime="2024-12-05">5 Dec 2024</time></p> <!-- machine-readable date -->
<p>H<sub>2</sub>O and E = mc<sup>2</sup></p>              <!-- subscript / superscript -->
<p>Results for <mark>react</mark></p>                       <!-- highlighted match -->
<pre><code>const a = 1;
  const b = 2;</code></pre>                                  <!-- preserved whitespace -->`],
      iq: [['strong vs b?', 'strong marks importance (semantic); b is stylistic offset with no added importance.'],
           ['Why use <time datetime>?', 'Machines (search engines, calendars, scripts) can read an unambiguous date while humans see a friendly format.']],
      cq: [['Highlight search matches in text safely.', `function highlight(el, word) {                        // el = element, word = search text
  const text = el.textContent;                          // read plain text (no HTML)
  el.textContent = '';                                  // clear
  text.split(new RegExp('(' + word + ')', 'gi')).forEach((part) => { // keep matches
    const node = part.toLowerCase() === word.toLowerCase()
      ? Object.assign(document.createElement('mark'), { textContent: part }) // wrap match
      : document.createTextNode(part);                  // plain text node
    el.append(node);                                    // append safely (no innerHTML)
  });
}`]],
      err: ['Using <i> for icons', 'Using <br> repeatedly for spacing']
    }),
    t('html-lists', 'Lists: ul, ol, li, dl', 'B', {
      one: '<ul> for unordered lists, <ol> for ordered/numbered lists and <dl> for term–description pairs.',
      ex: `Lists tell screen readers how many items exist ("list, 5 items"). Navigation menus are typically a <ul> of links inside <nav>.

<ol> supports start, reversed and type attributes. <dl> contains <dt> (term) and <dd> (description) pairs — ideal for glossaries, metadata and FAQs. Only <li> may be a direct child of ul/ol.`,
      pts: ['Only <li> directly inside ul/ol', 'Menus = nav > ul > li > a', 'ol: start, reversed, type', 'dl/dt/dd for key–value content'],
      code: ['html', `<nav aria-label="Main">           <!-- navigation landmark -->
  <ul>                            <!-- unordered list of links -->
    <li><a href="/">Home</a></li>  <!-- list item -->
    <li><a href="/learn">Learn</a></li>
  </ul>
</nav>
<ol start="3">                    <!-- numbering starts at 3 -->
  <li>Install Node</li>           <!-- 3. -->
  <li>Run npm install</li>        <!-- 4. -->
</ol>
<dl>                              <!-- description list -->
  <dt>DOM</dt>                    <!-- term -->
  <dd>Tree of page objects.</dd>  <!-- description -->
</dl>`],
      iq: [['When use dl instead of ul?', 'For name–value groups such as glossaries, product specs or metadata.'],
           ['Why build menus with lists?', 'Screen readers announce the count and users can skip the list; it is semantically a list of links.']],
      cq: [['Render an array as a list safely in vanilla JS.', `const ul = document.createElement('ul');           // create list
['HTML', 'CSS', 'JS'].forEach((t) => {             // loop data
  const li = document.createElement('li');         // create item
  li.textContent = t;                              // safe text
  ul.append(li);                                   // add to list
});
document.body.append(ul);                          // put list on the page`]],
      err: ['Putting <div> directly inside <ul>', 'Removing list semantics with list-style:none in Safari without role="list"']
    }),
    t('html-links', 'Links & Anchors (href, target, rel, download)', 'B', {
      one: 'The <a> element creates hyperlinks to pages, page fragments, files, email addresses or phone numbers.',
      ex: `href can be absolute (https://…), relative (/about, ../img), a fragment (#section), mailto:, tel: or a download. target="_blank" opens a new tab — modern browsers imply rel="noopener", but adding rel="noopener noreferrer" is still good practice for older browsers and privacy.

download suggests saving instead of navigating. rel values: nofollow / sponsored / ugc (SEO), noopener, noreferrer. Link text must make sense out of context — avoid "click here". Use <button> for actions and <a> for navigation.`,
      pts: ['Links navigate; buttons act', 'Descriptive link text', 'target=_blank + rel="noopener noreferrer"', '#id jumps to an element with that id'],
      code: ['html', `<a href="/docs/react">React docs</a>                       <!-- relative link -->
<a href="#faq">Jump to FAQ</a>                             <!-- in-page fragment -->
<a href="https://react.dev" target="_blank" rel="noopener noreferrer">react.dev</a> <!-- new tab safely -->
<a href="/files/cv.pdf" download="Sujata-CV.pdf">Download CV</a> <!-- save with a file name -->
<a href="mailto:hello@example.com?subject=Hi">Email us</a> <!-- opens mail app -->
<a href="tel:+911234567890">Call</a>                       <!-- dials on phones -->
<h2 id="faq">FAQ</h2>                                      <!-- fragment target -->`],
      iq: [['Why use rel=noopener?', 'Without it the opened page can access window.opener and redirect your tab (reverse tabnabbing).'],
           ['Link vs button?', 'A link navigates to a URL; a button performs an action. Using the wrong one breaks keyboard/screen-reader expectations.'],
           ['What is a fragment identifier?', 'The #part of a URL that scrolls to the element with that id and is not sent to the server.']],
      cq: [['Smooth-scroll to fragment links.', `html { scroll-behavior: smooth; }        /* CSS-only smooth scrolling */
:target { scroll-margin-top: 80px; }     /* keep target below a sticky header */`]],
      err: ['"Click here" link text', 'Using <a href="#"> with onclick instead of a button']
    }),
    t('html-quotes-whitespace', 'Quotes, Line Breaks & Whitespace', 'B', {
      one: '<blockquote> and <q> mark quotations, <cite> names a source, <br> forces a line break and <hr> marks a thematic break; normal HTML collapses whitespace.',
      ex: `Browsers collapse multiple spaces and newlines into one space. Use CSS (white-space, margins) for spacing, <br> only where a line break is part of content (addresses, poems), and <pre> when whitespace matters.

<blockquote cite="url"> is for long quotes, <q> for inline quotes (browser adds quotation marks), <cite> for titles of works. <hr> represents a topic change, not just a line — style it with CSS. <wbr> suggests where a long word may break.`,
      pts: ['Whitespace collapses by default', '<br> for meaningful line breaks only', '<hr> = thematic break', 'blockquote (block) vs q (inline)'],
      code: ['html', `<blockquote cite="https://react.dev">        <!-- long quotation -->
  <p>React lets you build UIs out of components.</p>
  <footer>— <cite>React docs</cite></footer> <!-- source title -->
</blockquote>
<p>He said <q>ship it</q> and left.</p>         <!-- inline quote with auto quotes -->
<address>Sector 44,<br>Gurugram</address>        <!-- br is part of the address content -->
<hr>                                             <!-- topic change -->
<p>super<wbr>long<wbr>identifier</p>            <!-- optional break points -->`],
      iq: [['Why do extra spaces disappear in HTML?', 'The HTML whitespace processing model collapses sequences of whitespace into a single space unless CSS white-space or <pre> preserves it.'],
           ['Is <hr> just a horizontal line?', 'Semantically it is a thematic break between paragraph-level content; its appearance is styling.']],
      cq: [['Preserve line breaks of user-entered text without <br>.', `.comment { white-space: pre-line; }   /* keeps newlines, collapses extra spaces */`]],
      err: ['Using multiple <br> for vertical spacing', 'Using blockquote just to indent text']
    })
  ),
  m('3. Images & Media',
    t('html-images', 'Images: img, alt, width & height', 'B', {
      one: '<img> embeds an image; alt describes it for screen readers and failed loads; width/height reserve space and prevent layout shift.',
      ex: `alt text should convey the image's purpose: describe informative images, use alt="" for decorative ones (so screen readers skip them), and describe the destination for linked images.

Always set width and height attributes (intrinsic size): the browser computes the aspect ratio and reserves space, preventing CLS. Use loading="lazy" for below-the-fold images, decoding="async", and fetchpriority="high" for the LCP hero image. Prefer modern formats: AVIF, WebP; SVG for icons and logos.`,
      pts: ['Every img needs alt (empty for decorative)', 'width + height prevent CLS', 'loading="lazy" below the fold only', 'fetchpriority="high" for the hero'],
      flow: ['Browser reads width/height', 'Reserves aspect-ratio space', 'Downloads image (lazy if offscreen)', 'Decodes and paints without layout shift'],
      code: ['html', `<img src="/hero.avif" alt="Developer studying React on a laptop"   <!-- informative alt -->
     width="1200" height="600"                                       <!-- reserves 2:1 space -->
     fetchpriority="high">                                           <!-- LCP image loads first -->
<img src="/divider.svg" alt="">                                      <!-- decorative: empty alt -->
<img src="/card.webp" alt="Closures diagram" width="400" height="300"
     loading="lazy" decoding="async">                                <!-- deferred offscreen image -->
<style>img { max-width: 100%; height: auto; }</style>                <!-- responsive scaling -->`],
      iq: [['When should alt be empty?', 'For purely decorative images that add no information, so assistive tech ignores them.'],
           ['Why set width and height if CSS resizes the image?', 'The browser uses them to compute aspect ratio and reserve space before the image loads, preventing layout shift.'],
           ['Should you lazy-load the hero image?', 'No — it delays the LCP. Lazy-load only below-the-fold images.']],
      cq: [['Show a fallback when an image fails to load.', `document.querySelectorAll('img').forEach((img) => {   // every image
  img.addEventListener('error', () => {                // fires on 404 / decode error
    img.src = '/placeholder.svg';                      // swap to a placeholder
    img.alt = img.alt || 'Image unavailable';          // keep accessible text
  }, { once: true });                                  // avoid infinite loop if placeholder fails
});`]],
      err: ['Missing alt attribute', 'Lazy-loading the LCP image', 'Huge images scaled down in CSS']
    }),
    t('html-responsive-images', 'Responsive Images: srcset, sizes & picture', 'I', {
      one: 'srcset/sizes let the browser pick the best-sized image for the screen; <picture> switches formats or art direction.',
      ex: `With srcset of width descriptors (img-400.jpg 400w, img-800.jpg 800w) and sizes describing how wide the image renders ("(max-width: 600px) 100vw, 50vw"), the browser chooses the smallest file that looks sharp on the device's DPR.

<picture> with <source type="image/avif"> lets browsers use modern formats with fallbacks; <source media> enables art direction (a cropped image on mobile). The <img> inside picture is required and carries alt, width and height.`,
      pts: ['srcset w-descriptors + sizes = resolution switching', 'x-descriptors (1x, 2x) for fixed-size images', '<picture> for format fallback and art direction', 'Inner <img> keeps alt and dimensions'],
      flow: ['Browser reads sizes', 'Calculates rendered width × DPR', 'Picks closest srcset candidate', 'Downloads only that file'],
      code: ['html', `<picture>                                                     <!-- container for sources -->
  <source type="image/avif" srcset="hero-800.avif 800w, hero-1600.avif 1600w"
          sizes="(max-width: 700px) 100vw, 700px">           <!-- AVIF if supported -->
  <source type="image/webp" srcset="hero-800.webp 800w, hero-1600.webp 1600w"
          sizes="(max-width: 700px) 100vw, 700px">           <!-- else WebP -->
  <img src="hero-800.jpg"                                     <!-- final fallback JPEG -->
       srcset="hero-800.jpg 800w, hero-1600.jpg 1600w"        <!-- JPEG candidates -->
       sizes="(max-width: 700px) 100vw, 700px"                <!-- rendered width hint -->
       width="1600" height="900" alt="Course banner">         <!-- ratio + alt -->
</picture>`],
      iq: [['What does the sizes attribute do?', 'Tells the browser how wide the image will be displayed so it can choose a srcset candidate before CSS loads.'],
           ['Resolution switching vs art direction?', 'Resolution switching serves the same image at different sizes; art direction serves different crops/compositions by media query using <picture>.']],
      cq: [['Logo that is sharp on retina screens.', `<img src="logo.png" srcset="logo.png 1x, logo@2x.png 2x" width="120" height="40" alt="FrontEdge"> <!-- 2x for high-DPR -->`]],
      err: ['srcset with w descriptors but no sizes (defaults to 100vw)', 'Putting alt on <source>']
    }),
    t('html-figure', 'figure & figcaption', 'B', {
      one: '<figure> groups self-contained content (image, diagram, code, chart) with an optional <figcaption> caption.',
      ex: `A figure is referenced from the main content but could be moved elsewhere (like a figure in a book). figcaption provides an accessible caption associated with the figure.

Use it for images with captions, code listings, diagrams, quotes with attribution and charts. Do not use it for every image — only when the content is self-contained and captioned.`,
      pts: ['Self-contained content + caption', 'figcaption first or last child', 'Works for code, charts, images, quotes'],
      code: ['html', `<figure>                                                   <!-- self-contained unit -->
  <img src="event-loop.svg" alt="Event loop: stack, microtasks, macrotasks"
       width="800" height="450">                           <!-- the content -->
  <figcaption>Figure 2: How the event loop schedules tasks.</figcaption> <!-- visible caption -->
</figure>`],
      iq: [['figcaption vs alt?', 'alt replaces the image for non-visual users; figcaption is a visible caption for everyone. They can differ and both may be present.']],
      cq: [['Caption a code example.', `<figure>
  <pre><code>const x = 1;</code></pre>            <!-- code listing -->
  <figcaption>Listing 1: declaring a constant</figcaption> <!-- caption -->
</figure>`]],
      err: ['Using figure for decorative images']
    }),
    t('html-audio-video', 'Audio & Video (controls, track, captions)', 'B', {
      one: '<video> and <audio> embed media natively with controls, multiple sources and <track> for captions/subtitles.',
      ex: `Attributes: controls, autoplay (browsers only allow muted autoplay), muted, loop, playsinline (iOS inline play), preload (none/metadata/auto), poster (video thumbnail).

Provide multiple <source> formats (MP4/H.264 widely supported, WebM). Add <track kind="captions" srclang="en" src="captions.vtt"> for accessibility — captions are a WCAG requirement for prerecorded video with speech. JS API: play(), pause(), currentTime, volume, events like timeupdate and ended.`,
      pts: ['Autoplay only works when muted', 'playsinline for iOS', '<track> WebVTT captions', 'preload="none" saves data'],
      code: ['html', `<video controls width="640" height="360"                <!-- native player UI + size -->
       poster="/thumb.jpg" preload="metadata" playsinline> <!-- thumbnail, light preload, iOS inline -->
  <source src="/intro.webm" type="video/webm">          <!-- first choice -->
  <source src="/intro.mp4" type="video/mp4">            <!-- fallback format -->
  <track kind="captions" src="/intro.en.vtt" srclang="en" label="English" default> <!-- captions -->
  Your browser does not support video.                  <!-- legacy fallback text -->
</video>
<script>
  const v = document.querySelector('video');            // get the element
  v.addEventListener('ended', () => console.log('done')); // media events
</script>`],
      iq: [['Why does autoplay sometimes fail?', 'Browser policies block autoplay with sound; muted autoplay or a user gesture is required.'],
           ['captions vs subtitles?', 'Captions include speech plus sound cues for deaf/hard-of-hearing users; subtitles translate dialogue.']],
      cq: [['Custom play/pause button.', `const v = document.querySelector('video');          // media element
const btn = document.querySelector('#toggle');      // our button
btn.addEventListener('click', () => {               // on click
  v.paused ? v.play() : v.pause();                  // toggle state
  btn.textContent = v.paused ? 'Play' : 'Pause';    // update label
});`]],
      err: ['No captions on videos with speech', 'Autoplaying video with sound']
    }),
    t('html-iframe', 'iframe & Embedding (sandbox, allow, loading)', 'I', {
      one: '<iframe> embeds another HTML page; sandbox and allow attributes restrict what the embedded page can do.',
      ex: `iframes are used for YouTube/Maps embeds, payment widgets, ads and micro-frontends. Every iframe is a separate document with its own JS context — heavy for performance.

Security: sandbox (empty = most restricted; add tokens like allow-scripts, allow-forms selectively), allow="camera; fullscreen" (Permissions Policy), referrerpolicy. Sites protect themselves from being framed with X-Frame-Options or CSP frame-ancestors. Use loading="lazy" and a title attribute for accessibility. Communicate across frames with postMessage, always checking event.origin.`,
      pts: ['Each iframe = separate document (costly)', 'sandbox restricts capabilities', 'title attribute required for a11y', 'postMessage + origin check for communication'],
      code: ['html', `<iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID"  <!-- privacy-enhanced embed -->
        title="React tutorial video"                            <!-- accessible name -->
        width="560" height="315" loading="lazy"                 <!-- lazy-load offscreen -->
        allow="encrypted-media; picture-in-picture; fullscreen" <!-- granted features -->
        referrerpolicy="strict-origin-when-cross-origin">       <!-- limit referrer data -->
</iframe>
<iframe src="/untrusted.html" sandbox="allow-scripts" title="Preview"></iframe> <!-- scripts only, no forms/top navigation -->`],
      iq: [['What does sandbox do?', 'Applies restrictions (no scripts, forms, popups, top navigation, same-origin) unless re-enabled with specific tokens.'],
           ['How do iframes communicate with the parent?', 'window.postMessage; the receiver must validate event.origin before trusting data.'],
           ['How does a site prevent being iframed?', 'CSP frame-ancestors or X-Frame-Options: DENY/SAMEORIGIN headers.']],
      cq: [['Safely receive messages from an iframe.', `window.addEventListener('message', (event) => {       // listen for postMessage
  if (event.origin !== 'https://widget.example.com') return; // ignore unknown origins
  console.log('Data from widget:', event.data);       // trusted data
});`]],
      err: ['allow-scripts + allow-same-origin together on same-origin content (sandbox can be removed)', 'Not checking event.origin']
    }),
    t('html-svg-canvas', 'Inline SVG vs Canvas', 'I', {
      one: 'SVG is a vector, DOM-based graphics format; <canvas> is a pixel bitmap you draw on with JavaScript.',
      ex: `SVG elements (circle, path, text) are part of the DOM: styleable with CSS, accessible, scalable without blur and good for icons, logos, charts with fewer elements and illustrations.

Canvas is an immediate-mode drawing surface: fast for thousands of objects, games, image editing and real-time visualisations, but nothing is in the DOM, so you must handle accessibility, hit-testing and redrawing yourself. Use OffscreenCanvas in a Worker for heavy drawing.`,
      pts: ['SVG: vector, DOM, CSS, accessible', 'Canvas: pixels, JS-drawn, fast for many objects', 'SVG icons: use currentColor', 'Canvas needs manual accessibility'],
      dia: `flowchart TD
  Q{"Many thousands of moving objects or pixel work?"} -- Yes --> CV["Canvas / WebGL"]
  Q -- No --> S{"Needs CSS styling, events per shape, crisp scaling?"}
  S -- Yes --> SVG["Inline SVG"]
  S -- No --> IMG["Plain img"]`,
      code: ['html', `<svg width="48" height="48" viewBox="0 0 24 24" role="img" aria-label="Check"> <!-- scalable icon -->
  <path d="M5 12l4 4 10-10" fill="none" stroke="currentColor" stroke-width="2"/> <!-- inherits text colour -->
</svg>
<canvas id="c" width="300" height="150"></canvas>   <!-- bitmap surface -->
<script>
  const ctx = document.getElementById('c').getContext('2d'); // 2D drawing context
  ctx.fillStyle = '#7cf2c8';                                   // set fill colour
  ctx.fillRect(20, 20, 120, 60);                               // draw a rectangle
  ctx.font = '16px sans-serif';                                // set font
  ctx.fillStyle = '#000';                                      // text colour
  ctx.fillText('Hello canvas', 30, 55);                        // draw text
</script>`],
      iq: [['When choose canvas over SVG?', 'When rendering many objects or doing pixel manipulation (games, heatmaps, image editing) where DOM nodes would be too slow.'],
           ['How to make SVG icons accessible?', 'role="img" with aria-label (or <title>) for meaningful icons; aria-hidden="true" for decorative ones.']],
      cq: [['Make a canvas sharp on retina displays.', `const c = document.getElementById('c');        // canvas element
const dpr = window.devicePixelRatio || 1;      // e.g. 2 on retina
c.width = 300 * dpr; c.height = 150 * dpr;     // backing store in device pixels
c.style.width = '300px'; c.style.height = '150px'; // CSS size stays the same
c.getContext('2d').scale(dpr, dpr);            // draw in CSS pixel units`]],
      err: ['Blurry canvas on high-DPR screens', 'Huge inline SVGs duplicated across pages instead of a sprite']
    })
  ),
  m('4. Tables',
    t('html-tables', 'Tables: thead, tbody, th, scope, caption, colspan', 'B', {
      one: 'Tables display tabular data in rows and columns using table, caption, thead, tbody, tfoot, tr, th and td.',
      ex: `Use tables for data, never for page layout. <caption> titles the table. <th scope="col"> and <th scope="row"> link headers to cells so screen readers announce "Price, ₹499". colspan/rowspan merge cells.

For responsive tables, wrap the table in a container with overflow-x: auto, or reflow cells into cards on small screens. Large data grids need virtualisation and ARIA grid patterns.`,
      pts: ['Tables for data only, not layout', 'caption + th scope for accessibility', 'thead/tbody/tfoot group rows', 'Wrap in overflow-x:auto for mobile'],
      code: ['html', `<div style="overflow-x:auto">                <!-- horizontal scroll on small screens -->
<table>                                        <!-- data table -->
  <caption>Course pricing</caption>           <!-- accessible title -->
  <thead>                                      <!-- header rows -->
    <tr><th scope="col">Plan</th><th scope="col">Price</th></tr> <!-- column headers -->
  </thead>
  <tbody>                                      <!-- body rows -->
    <tr><th scope="row">Basic</th><td>Free</td></tr>   <!-- row header + cell -->
    <tr><th scope="row">Pro</th><td>₹499</td></tr>
  </tbody>
  <tfoot><tr><td colspan="2">Prices include GST</td></tr></tfoot> <!-- spans 2 columns -->
</table>
</div>`],
      iq: [['Why not use tables for layout?', 'It breaks semantics for screen readers, is hard to make responsive and mixes structure with presentation.'],
           ['What does scope do on th?', 'Defines whether the header applies to a column or a row, so assistive tech associates cells correctly.']],
      cq: [['Build a table from JSON.', `function renderTable(rows) {                       // rows = [{name, price}]
  const tbody = document.querySelector('tbody');   // target body
  tbody.replaceChildren(...rows.map((r) => {       // replace all rows at once
    const tr = document.createElement('tr');       // new row
    [r.name, r.price].forEach((v) => {             // each value
      const td = document.createElement('td');     // new cell
      td.textContent = v;                          // safe text
      tr.append(td);                               // add cell
    });
    return tr;                                     // row element
  }));
}`]],
      err: ['No th/scope', 'Layout tables']
    })
  ),
  m('5. Forms',
    t('html-forms', 'Forms: form, action, method, enctype', 'B', {
      one: '<form> collects user input and submits it to a URL (action) using GET or POST (method).',
      ex: `On submit, the browser serialises named controls (name="email") into key/value pairs. GET appends them to the URL (good for search/filters, bookmarkable); POST sends them in the request body (for creating/changing data). enctype="multipart/form-data" is required for file uploads.

In SPAs you usually intercept the submit event, call event.preventDefault(), and send data with fetch using new FormData(form). Only controls with a name are submitted; disabled controls are not submitted.`,
      pts: ['Only named, enabled controls submit', 'GET for queries, POST for changes', 'multipart/form-data for files', 'FormData(form) collects values in JS'],
      flow: ['User fills named controls', 'Submit button or Enter', 'Browser validates constraints', 'submit event fires', 'Data sent via GET or POST'],
      code: ['html', `<form id="signup" action="/api/signup" method="post">   <!-- POST to this URL -->
  <label for="email">Email</label>                       <!-- visible label -->
  <input id="email" name="email" type="email" required>  <!-- named + validated -->
  <button type="submit">Sign up</button>                 <!-- submits the form -->
</form>
<script>
  document.getElementById('signup').addEventListener('submit', async (e) => { // intercept submit
    e.preventDefault();                                  // stop full page reload
    const data = new FormData(e.target);                 // gather named values
    const res = await fetch('/api/signup', { method: 'POST', body: data }); // send via fetch
    console.log(res.ok ? 'Done' : 'Failed');             // handle result
  });
</script>`],
      iq: [['GET vs POST for forms?', 'GET puts data in the URL (cacheable, bookmarkable, length-limited, visible); POST sends it in the body for non-idempotent actions and sensitive data.'],
           ['Why is my input not submitted?', 'It has no name attribute, is disabled, or is outside the form (use the form attribute to associate it).'],
           ['How do you upload files?', 'method="post" + enctype="multipart/form-data", or send FormData with fetch.']],
      cq: [['Convert FormData to a JSON object.', `const obj = Object.fromEntries(new FormData(form)); // [[key,value]] → { key: value }
await fetch('/api', {                                    // send JSON
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(obj)
});`]],
      err: ['Missing name attributes', 'Forgetting preventDefault in SPA forms']
    }),
    t('html-input-types', 'Input Types (email, number, date, range, file…)', 'B', {
      one: 'The type attribute changes an input’s behaviour, keyboard and validation: text, email, password, number, tel, url, search, date, time, color, range, file, checkbox, radio, hidden.',
      ex: `Correct types give free validation and the right mobile keyboard (email shows @, tel shows a keypad). type="number" is for real quantities — for IDs, OTPs and card numbers use type="text" with inputmode="numeric" because number inputs strip leading zeros and allow e/±.

Radios with the same name form one group (only one selected). Checkboxes are independent. file supports accept="image/*" and multiple. hidden sends values without display (never trust it — users can edit it).`,
      pts: ['Right type = right keyboard + validation', 'OTP/PIN: type=text + inputmode=numeric', 'Radios share a name', 'file: accept, multiple, capture'],
      code: ['html', `<input type="email" name="email" autocomplete="email">           <!-- @ keyboard + format check -->
<input type="tel" name="phone" autocomplete="tel">               <!-- phone keypad -->
<input type="text" name="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6"> <!-- OTP -->
<input type="number" name="qty" min="1" max="10" step="1">       <!-- quantity with limits -->
<input type="date" name="dob">                                   <!-- native date picker -->
<input type="range" name="volume" min="0" max="100">             <!-- slider -->
<input type="file" name="avatar" accept="image/*">               <!-- images only -->
<label><input type="radio" name="plan" value="free" checked> Free</label> <!-- radio group -->
<label><input type="radio" name="plan" value="pro"> Pro</label>  <!-- same name = one choice -->
<label><input type="checkbox" name="terms" required> I agree</label> <!-- independent checkbox -->`],
      iq: [['Why not use type="number" for phone numbers?', 'Number inputs drop leading zeros, allow e and +/-, show spinners and scroll-wheel changes — use tel or text with inputmode.'],
           ['What does inputmode do?', 'Hints which virtual keyboard to show (numeric, decimal, email, url, search) without changing validation.']],
      cq: [['Preview a selected image before upload.', `const input = document.querySelector('input[type=file]'); // file input
input.addEventListener('change', () => {                    // user picked a file
  const file = input.files[0];                              // first file
  if (!file) return;                                        // nothing selected
  const img = document.querySelector('#preview');           // preview <img>
  img.src = URL.createObjectURL(file);                      // temporary local URL
  img.onload = () => URL.revokeObjectURL(img.src);          // free memory after load
});`]],
      err: ['type=number for OTP or phone', 'Trusting hidden inputs']
    }),
    t('html-labels-fieldset', 'Labels, fieldset & legend', 'B', {
      one: '<label> gives a control its accessible name and bigger click target; <fieldset> + <legend> group related controls.',
      ex: `Associate labels explicitly (for="id" matching the input id) or implicitly by wrapping the input. Clicking the label focuses/toggles the control. Placeholders are NOT labels — they disappear while typing and often have poor contrast.

Use <fieldset> with a <legend> for radio groups and logical sections (Shipping address); screen readers announce the legend with each control. disabled on a fieldset disables everything inside.`,
      pts: ['Every input needs a label', 'Placeholder ≠ label', 'fieldset + legend for radio groups', 'Disabled fieldset disables children'],
      code: ['html', `<label for="name">Full name</label>                 <!-- explicit association -->
<input id="name" name="name" autocomplete="name">   <!-- matching id -->

<fieldset>                                          <!-- group of related controls -->
  <legend>Preferred framework</legend>              <!-- group label read with each option -->
  <label><input type="radio" name="fw" value="react"> React</label>     <!-- implicit label -->
  <label><input type="radio" name="fw" value="angular"> Angular</label> <!-- implicit label -->
</fieldset>`],
      iq: [['Why are placeholders not a substitute for labels?', 'They disappear on input, are often low-contrast, and are not reliably announced as the accessible name.'],
           ['When do you need fieldset/legend?', 'For groups of related controls, especially radio buttons and checkboxes, so the group question is announced.']],
      cq: [['Find inputs without labels (quick audit).', `document.querySelectorAll('input, select, textarea').forEach((el) => { // all controls
  const labelled = el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'); // any name?
  if (!labelled && el.type !== 'hidden') console.warn('No label:', el);  // report it
});`]],
      err: ['Using placeholder as the only label', 'Radio groups without a legend']
    }),
    t('html-select-textarea', 'select, option, optgroup, textarea & datalist', 'B', {
      one: '<select> offers predefined options, <textarea> accepts multi-line text, and <datalist> suggests values for a text input.',
      ex: `<select> contains <option value> items, optionally grouped with <optgroup label>. multiple allows several selections. The first option can act as a prompt (value="" disabled selected).

<textarea rows cols> for longer text; control resizing with CSS resize. <datalist id> + <input list> gives native autocomplete suggestions while still allowing free text. Modern browsers are adding customizable <select> styling (appearance: base-select).`,
      pts: ['option value is what gets submitted', 'optgroup groups options', 'datalist = suggestions + free text', 'textarea for multi-line input'],
      code: ['html', `<label for="city">City</label>
<select id="city" name="city" required>               <!-- dropdown -->
  <option value="" disabled selected>Choose…</option> <!-- prompt, forces a choice -->
  <optgroup label="NCR">                              <!-- group heading -->
    <option value="ggn">Gurugram</option>            <!-- submitted value: ggn -->
    <option value="del">Delhi</option>
  </optgroup>
</select>
<label for="fw">Framework</label>
<input id="fw" name="fw" list="fw-list">              <!-- free text + suggestions -->
<datalist id="fw-list"><option value="React"><option value="Angular"><option value="Vue"></datalist>
<label for="bio">Bio</label>
<textarea id="bio" name="bio" rows="4" maxlength="300"></textarea> <!-- multi-line -->`],
      iq: [['select vs datalist?', 'select restricts to listed options; datalist only suggests values and still allows any text.'],
           ['How do you get all selected values from select multiple?', 'Array.from(select.selectedOptions, (o) => o.value).']],
      cq: [['Populate a select from an API.', `const res = await fetch('/api/cities');              // fetch options
const cities = await res.json();                       // [{id, name}]
const select = document.querySelector('#city');        // target select
cities.forEach((c) => select.add(new Option(c.name, c.id))); // Option(text, value)`]],
      err: ['Building a custom dropdown without keyboard support', 'Missing labels on selects']
    }),
    t('html-buttons', 'Buttons: submit, button, reset', 'B', {
      one: '<button> triggers actions; its type decides behaviour inside forms: submit (default), button (no default) or reset.',
      ex: `A <button> inside a form defaults to type="submit" — a classic bug is a "Show password" button that unexpectedly submits the form. Always set type="button" for non-submit buttons.

Buttons are focusable and activate with Enter and Space natively. Disabled buttons are not focusable — consider aria-disabled with an explanation instead. Use <a> for navigation, <button> for actions. Buttons can also target forms or popovers via form, formaction, popovertarget and commandfor attributes.`,
      pts: ['Default type is submit inside forms', 'type="button" for JS actions', 'Native keyboard support', 'Never use div as a button'],
      code: ['html', `<form>
  <input name="q" aria-label="Search">
  <button type="submit">Search</button>              <!-- submits the form -->
  <button type="button" id="clear">Clear</button>    <!-- does NOT submit -->
  <button type="reset">Reset</button>                <!-- restores default values -->
</form>
<script>
  document.getElementById('clear').addEventListener('click', (e) => { // JS action
    e.target.form.q.value = '';                      // clear the field via form reference
  });
</script>`],
      iq: [['What is the default type of a button in a form?', 'submit.'],
           ['Why is <div onclick> a bad button?', 'Not focusable, no Enter/Space activation, not announced as a button — you must recreate everything with role, tabindex and key handlers.']],
      cq: [['Prevent double submit by disabling the button while sending.', `form.addEventListener('submit', async (e) => {      // handle submit
  e.preventDefault();                               // SPA handling
  const btn = form.querySelector('[type=submit]');  // submit button
  btn.disabled = true;                              // block double clicks
  try { await fetch('/api', { method: 'POST', body: new FormData(form) }); } // send
  finally { btn.disabled = false; }                 // re-enable always
});`]],
      err: ['Missing type="button" on JS buttons inside forms', 'Icon-only buttons without an accessible name']
    }),
    t('html-form-validation', 'Native Form Validation & Constraint API', 'I', {
      one: 'HTML attributes like required, minlength, pattern, min/max and type validate input natively; the Constraint Validation API lets JS customise it.',
      ex: `The browser blocks submission and shows messages when constraints fail. CSS pseudo-classes :valid, :invalid and :user-invalid (only after interaction) style states.

JS API: input.checkValidity(), reportValidity(), validity (valueMissing, typeMismatch, patternMismatch, tooShort…), setCustomValidity('message'). novalidate on the form disables the native UI so you can show your own messages. Client validation is UX only — always validate again on the server.`,
      pts: ['required, minlength, maxlength, pattern, min, max, step', ':user-invalid styles only after interaction', 'setCustomValidity for custom rules', 'Server must validate again'],
      flow: ['User submits', 'Browser checks constraints', 'Invalid: show message and focus field', 'Valid: submit event fires'],
      code: ['html', `<form novalidate id="f">                                   <!-- we show our own messages -->
  <input name="username" required minlength="3" pattern="[a-z0-9_]+" aria-describedby="u-err"> <!-- rules -->
  <span id="u-err" class="error" aria-live="polite"></span>  <!-- message region -->
  <button>Save</button>
</form>
<script>
  const f = document.getElementById('f');                   // the form
  f.addEventListener('submit', (e) => {                     // on submit
    const u = f.username;                                   // the input
    const err = document.getElementById('u-err');           // message element
    if (!u.checkValidity()) {                               // any constraint failed?
      e.preventDefault();                                   // block submit
      err.textContent = u.validity.patternMismatch          // choose a message
        ? 'Use lowercase letters, numbers or _' : u.validationMessage; // or browser text
      u.focus();                                            // move focus to the problem
    }
  });
</script>`],
      iq: [['Is client-side validation enough?', 'No — it improves UX but can be bypassed; the server must validate.'],
           [':invalid vs :user-invalid?', ':invalid matches immediately (even untouched fields); :user-invalid matches only after the user interacts.'],
           ['How do you add a custom rule like "passwords must match"?', 'Call confirm.setCustomValidity(match ? "" : "Passwords differ") on input; an empty string marks it valid.']],
      cq: [['Password confirmation with setCustomValidity.', `const pw = form.password, confirmPw = form.confirm; // two inputs
confirmPw.addEventListener('input', () => {             // validate on typing
  confirmPw.setCustomValidity(                           // set or clear the error
    confirmPw.value === pw.value ? '' : 'Passwords do not match');
});`]],
      err: ['Relying only on client validation', 'Showing errors before the user has typed']
    }),
    t('html-form-ux-attributes', 'Form UX Attributes: autocomplete, inputmode, enterkeyhint, readonly vs disabled', 'I', {
      one: 'Attributes that make forms faster and friendlier: autocomplete tokens, inputmode, enterkeyhint, autofocus, spellcheck, readonly and disabled.',
      ex: `autocomplete with standard tokens (name, email, tel, street-address, postal-code, cc-number, new-password, current-password, one-time-code) lets browsers and password managers autofill correctly — a big conversion boost.

readonly fields are focusable and submitted; disabled fields are neither focusable nor submitted. enterkeyhint changes the mobile Enter key label (search, send, next, done). Use autofocus sparingly — it can disorient screen-reader users.`,
      pts: ['Use standard autocomplete tokens', 'readonly: submitted, focusable; disabled: neither', 'enterkeyhint="search|send|next"', 'new-password vs current-password'],
      code: ['html', `<input name="email" type="email" autocomplete="email" spellcheck="false"> <!-- autofill email -->
<input name="pw" type="password" autocomplete="new-password">     <!-- password manager suggests a strong one -->
<input name="pin" autocomplete="postal-code" inputmode="numeric">  <!-- PIN code keypad -->
<input name="q" type="search" enterkeyhint="search">               <!-- Enter key says "Search" -->
<input name="id" value="EMP-102" readonly>                         <!-- visible, submitted, not editable -->
<input name="plan" value="Pro" disabled>                           <!-- not submitted, not focusable -->`],
      iq: [['readonly vs disabled?', 'readonly values are submitted and focusable but not editable; disabled values are not submitted and not focusable.'],
           ['Why use autocomplete tokens?', 'They enable reliable autofill and password-manager integration, reducing typing and errors.']],
      cq: [['Login form optimised for password managers.', `<form>
  <input name="username" autocomplete="username">          <!-- identifies the account -->
  <input name="password" type="password" autocomplete="current-password"> <!-- fill saved password -->
  <button>Sign in</button>
</form>`]],
      err: ['autocomplete="off" on login forms', 'Using disabled for values that must be submitted']
    }),
    t('html-output-progress-meter', 'output, progress & meter', 'B', {
      one: '<progress> shows task completion, <meter> shows a measurement within a known range, and <output> shows a calculation result.',
      ex: `<progress value="40" max="100"> is for loading/upload progress; without value it is indeterminate (spinner-like). <meter> is for gauges such as disk usage or password strength, with low/high/optimum thresholds the browser can colour.

<output for="a b"> semantically links a result to the inputs that produced it and is announced to screen readers when it changes.`,
      pts: ['progress = task completion', 'meter = scalar in a range', 'progress without value = indeterminate', 'output links results to inputs'],
      code: ['html', `<progress id="up" value="0" max="100">0%</progress>           <!-- upload progress -->
<meter value="0.8" min="0" max="1" low="0.3" high="0.7" optimum="0.2">80%</meter> <!-- disk usage gauge -->
<form oninput="total.value = Number(a.value) * Number(b.value)"> <!-- recalc on input -->
  <input id="a" name="a" type="number" value="2"> ×             <!-- operand 1 -->
  <input id="b" name="b" type="number" value="3"> =             <!-- operand 2 -->
  <output name="total" for="a b">6</output>                     <!-- result linked to inputs -->
</form>`],
      iq: [['progress vs meter?', 'progress shows how much of a task is done; meter shows a value within a range (not a task).']],
      cq: [['Update progress during an XHR upload.', `const xhr = new XMLHttpRequest();                   // XHR supports upload progress
xhr.upload.onprogress = (e) => {                     // fires as bytes are sent
  if (e.lengthComputable) document.getElementById('up').value = (e.loaded / e.total) * 100; // percent
};
xhr.open('POST', '/upload'); xhr.send(new FormData(form)); // start upload`]],
      err: ['Using meter for loading progress']
    })
  ),
  m('6. Semantic Structure',
    L('html-semantic'),
    t('html-block-inline', 'Block vs Inline & Content Categories', 'B', {
      one: 'Block-level elements start on a new line and take full width; inline elements flow within text. HTML5 defines content categories (flow, phrasing, interactive) that decide valid nesting.',
      ex: `Display behaviour is controlled by CSS (display), but HTML content models still define what can go where: phrasing content (span, a, strong) goes inside paragraphs; flow content (div, section, ul) cannot go inside <p>. Interactive content (a, button) must not be nested inside other interactive content.

<div> and <span> are generic containers with no meaning — use them only for styling/scripting hooks when no semantic element fits.`,
      pts: ['div = generic block, span = generic inline', 'No block elements inside <p>', 'No interactive inside interactive (button in a)', 'CSS display can change rendering, not semantics'],
      code: ['html', `<div>Block: starts on a new line</div>              <!-- generic block container -->
<p>Inline <span class="tag">span</span> and <a href="#">link</a> flow in text.</p> <!-- phrasing content -->
<!-- ❌ invalid: <p><div>…</div></p>  the parser closes the p early -->
<!-- ❌ invalid: <a href="/x"><button>Go</button></a>  nested interactive -->
<a href="/course" class="card">                     <!-- ✅ a can wrap block content in HTML5 -->
  <h3>React course</h3><p>Start learning</p>
</a>`],
      iq: [['Can an <a> contain block elements?', 'Yes in HTML5 (transparent content model), as long as it contains no interactive content.'],
           ['What happens with <p><div></div></p>?', 'The parser auto-closes the <p> before the div, producing an unexpected DOM and an empty paragraph.']],
      cq: [['Check whether an element is block or inline at runtime.', `const display = getComputedStyle(el).display;     // computed CSS display value
console.log(display);                               // "block", "inline", "flex"...`]],
      err: ['div soup instead of semantic elements', 'Nesting buttons inside links']
    })
  ),
  m('7. Modern Interactive Elements',
    t('html-dialog', 'The <dialog> Element (modals)', 'I', {
      one: '<dialog> is a native modal/non-modal dialog with focus management, Escape to close, a ::backdrop and top-layer rendering.',
      ex: `dialog.showModal() opens it as a modal: content behind becomes inert, focus moves inside, Esc closes it and it renders in the top layer (no z-index fights). dialog.show() opens it non-modally. A <form method="dialog"> inside closes it and sets dialog.returnValue to the button value.

Style the backdrop with ::backdrop. Listen to the close event. The closedby attribute (any/closerequest/none) controls light-dismiss in newer browsers. Prefer this over hand-built modals that miss focus trapping.`,
      pts: ['showModal() = modal with inert background', 'Esc closes, focus handled', '::backdrop pseudo-element', 'form method="dialog" closes with returnValue'],
      flow: ['showModal()', 'Top layer + inert page', 'Focus moves into dialog', 'Esc or form method=dialog', 'close event, focus returns'],
      code: ['html', `<button id="open">Delete account</button>                <!-- trigger -->
<dialog id="confirm" aria-labelledby="t">                 <!-- native dialog -->
  <h2 id="t">Delete account?</h2>                         <!-- accessible title -->
  <form method="dialog">                                  <!-- closes the dialog on submit -->
    <button value="cancel">Cancel</button>                <!-- returnValue = cancel -->
    <button value="ok">Delete</button>                    <!-- returnValue = ok -->
  </form>
</dialog>
<style>dialog::backdrop { background: rgb(0 0 0 / .5); }</style> <!-- dim the page -->
<script>
  const d = document.getElementById('confirm');           // dialog element
  document.getElementById('open').onclick = () => d.showModal(); // open as modal
  d.addEventListener('close', () => {                     // fires after closing
    if (d.returnValue === 'ok') console.log('Deleting…'); // act on the choice
  });
</script>`],
      iq: [['show() vs showModal()?', 'showModal makes the rest of the page inert, renders in the top layer with a backdrop and Esc closes it; show() is non-modal.'],
           ['Why prefer native dialog over a div modal?', 'It provides focus management, inert background, Esc handling, top-layer stacking and correct semantics for free.']],
      cq: [['Close a modal dialog when clicking the backdrop.', `d.addEventListener('click', (e) => {          // clicks inside dialog element
  if (e.target === d) d.close();               // the dialog itself = backdrop area was clicked
});`]],
      err: ['Using open attribute directly (no modal behaviour)', 'Forgetting a visible close button']
    }),
    t('html-details-summary', '<details> & <summary> (native accordion)', 'B', {
      one: '<details> creates a disclosure widget that toggles content open/closed; <summary> is its clickable label.',
      ex: `It works without JavaScript, is keyboard accessible and announced as expanded/collapsed. The open attribute controls state and a toggle event fires on change.

Giving several details the same name attribute makes an exclusive accordion (only one open at a time). Content inside closed details is findable with Ctrl+F in modern browsers (they auto-expand).`,
      pts: ['Zero-JS accordion', 'open attribute + toggle event', 'name="group" = exclusive accordion', 'Style marker with ::marker or summary::-webkit-details-marker'],
      code: ['html', `<details name="faq" open>                         <!-- open by default; grouped by name -->
  <summary>What is a closure?</summary>          <!-- clickable label -->
  <p>A function that remembers its outer scope.</p> <!-- revealed content -->
</details>
<details name="faq">                              <!-- same name: opening this closes the other -->
  <summary>What is hoisting?</summary>
  <p>Declarations are processed before execution.</p>
</details>
<script>
  document.querySelectorAll('details').forEach((d) =>     // each disclosure
    d.addEventListener('toggle', () => console.log(d.open))); // true/false on change
</script>`],
      iq: [['How do you build an accordion with no JS?', 'Use <details>/<summary>; add the same name attribute for exclusive behaviour.']],
      cq: [['Expand all / collapse all button.', `const all = document.querySelectorAll('details');        // all disclosures
btn.onclick = () => {
  const open = [...all].some((d) => !d.open);             // open if any is closed
  all.forEach((d) => (d.open = open));                    // set state on each
};`]],
      err: ['Putting interactive elements inside <summary>']
    }),
    t('html-popover', 'Popover API (popover attribute)', 'I', {
      one: 'The popover attribute turns any element into a top-layer popup (menu, tooltip, toast) that can be toggled by a button with no JavaScript.',
      ex: `<div popover id="menu"> plus <button popovertarget="menu"> toggles it. popover="auto" gives light-dismiss (click outside or Esc closes it) and closes other auto popovers; popover="manual" stays until explicitly closed (toasts). "hint" is for tooltips.

It renders in the top layer, so no z-index battles. Pair it with CSS anchor positioning to place it next to its trigger. JS: el.showPopover(), hidePopover(), togglePopover(), and the toggle event.`,
      pts: ['popover + popovertarget = zero-JS toggle', 'auto: light dismiss; manual: explicit', 'Top layer: no z-index issues', 'Pairs with CSS anchor positioning'],
      code: ['html', `<button popovertarget="profile-menu">Profile ▾</button>  <!-- toggles the popover -->
<div id="profile-menu" popover>                          <!-- auto popover: light-dismiss -->
  <a href="/settings">Settings</a>
  <button popovertarget="profile-menu" popovertargetaction="hide">Close</button> <!-- explicit close -->
</div>
<div id="toast" popover="manual">Saved ✓</div>           <!-- stays until hidden -->
<script>
  const toast = document.getElementById('toast');         // manual popover
  function notify() {                                      // show a toast
    toast.showPopover();                                   // open in top layer
    setTimeout(() => toast.hidePopover(), 2000);           // hide after 2 s
  }
</script>`],
      iq: [['popover vs dialog?', 'dialog is for modal/blocking interactions; popover is for non-modal overlays like menus, tooltips and toasts with light-dismiss.'],
           ['What is the top layer?', 'A browser rendering layer above all page content used by fullscreen, modal dialogs and popovers, unaffected by z-index or overflow.']],
      cq: [['Feature-detect popover support.', `const supported = HTMLElement.prototype.hasOwnProperty('popover'); // true in modern browsers
if (!supported) loadPolyfill();                                     // fallback path`]],
      err: ['Using popover for content that should be modal']
    }),
    t('html-template-slot', '<template> & <slot>', 'I', {
      one: '<template> holds inert HTML that is not rendered until cloned by JS; <slot> marks insertion points inside Web Component shadow DOM.',
      ex: `Content inside <template> is parsed but not rendered, scripts do not run and images do not load. Clone it with template.content.cloneNode(true) to stamp repeated UI (rows, cards) efficiently.

<slot> is used in shadow DOM: light-DOM children of a custom element are projected into matching named slots. Declarative shadow DOM (<template shadowrootmode="open">) lets servers render shadow roots without JS.`,
      pts: ['template content is inert', 'Clone with content.cloneNode(true)', 'slot projects children into shadow DOM', 'shadowrootmode = declarative shadow DOM'],
      code: ['html', `<template id="row-tpl">                                  <!-- inert blueprint -->
  <li class="row"><strong class="name"></strong> <span class="role"></span></li>
</template>
<ul id="team"></ul>
<script>
  const tpl = document.getElementById('row-tpl');         // the template
  const list = document.getElementById('team');           // target list
  [{ name: 'Riya', role: 'Dev' }, { name: 'Aman', role: 'QA' }].forEach((p) => { // data
    const node = tpl.content.cloneNode(true);             // deep clone the fragment
    node.querySelector('.name').textContent = p.name;     // fill safely
    node.querySelector('.role').textContent = p.role;
    list.append(node);                                    // insert into DOM
  });
</script>`],
      iq: [['Why use template instead of building strings?', 'It is parsed once, inert until used, faster to clone and safer than concatenating HTML strings.'],
           ['What does slot do?', 'Defines where a custom element’s light-DOM children appear inside its shadow DOM.']],
      cq: [['Custom element using a named slot.', `customElements.define('fe-card', class extends HTMLElement { // define element
  constructor() {
    super();                                                  // required first
    this.attachShadow({ mode: 'open' }).innerHTML =           // create shadow root
      '<h3><slot name="title">Untitled</slot></h3><slot></slot>'; // named + default slots
  }
});
// <fe-card><span slot="title">Hooks</span><p>Body text</p></fe-card>`]],
      err: ['Expecting scripts inside template to run on page load']
    })
  ),
  m('8. Metadata, SEO & Loading',
    t('html-seo-meta', 'SEO Meta Tags: description, canonical, robots, Open Graph', 'I', {
      one: 'Meta and link tags that control how search engines index pages and how links look when shared on social media.',
      ex: `Key tags: <title>, <meta name="description"> (search snippet), <link rel="canonical"> (the preferred URL, avoids duplicate content), <meta name="robots" content="noindex,nofollow"> (exclude pages).

Open Graph (og:title, og:description, og:image, og:url, og:type) controls previews on WhatsApp, LinkedIn and Facebook; Twitter/X uses twitter:card. SPAs must render these on the server (SSR/SSG) because many crawlers and link-preview bots do not run JavaScript.`,
      pts: ['Unique title + description per page', 'canonical avoids duplicate content', 'og:image ~1200×630 for previews', 'Render meta server-side for crawlers'],
      code: ['html', `<title>Closures in JavaScript | FrontEdge</title>                    <!-- search title -->
<meta name="description" content="Understand closures with diagrams and interview questions."> <!-- snippet -->
<link rel="canonical" href="https://frontedge.app/term/js-closures">  <!-- preferred URL -->
<meta name="robots" content="index,follow">                          <!-- allow indexing -->
<meta property="og:title" content="Closures in JavaScript">          <!-- share title -->
<meta property="og:description" content="Diagrams + interview Q&A"> <!-- share text -->
<meta property="og:image" content="https://frontedge.app/og/closures.png"> <!-- 1200x630 image -->
<meta property="og:type" content="article">                          <!-- content type -->
<meta name="twitter:card" content="summary_large_image">             <!-- big X/Twitter card -->`],
      iq: [['What is a canonical URL?', 'The URL you want indexed when the same content is reachable at several URLs (query params, http/https, trailing slashes).'],
           ['Why do SPA link previews often fail?', 'Social bots usually do not execute JS, so meta tags must be present in the server-sent HTML.']],
      cq: [['Set meta tags per route in React 19.', `function Article({ post }) {                       // React 19 hoists these into <head>
  return (<>
    <title>{post.title}</title>                     {/* document title */}
    <meta name="description" content={post.summary} /> {/* description */}
    <article>{post.body}</article>
  </>);
}`]],
      err: ['Same description on all pages', 'Client-only meta tags in a CSR app']
    }),
    t('html-structured-data', 'Structured Data (JSON-LD, schema.org)', 'I', {
      one: 'JSON-LD scripts describe page content (article, product, FAQ, course) using schema.org vocabulary so search engines can show rich results.',
      ex: `Add <script type="application/ld+json"> with an object like { "@context": "https://schema.org", "@type": "Course", ... }. Google may display rich results: ratings, FAQs, breadcrumbs, events, prices.

Data must match visible content. Validate with Google's Rich Results Test. Common types: Organization, WebSite (sitelinks search box), BreadcrumbList, Article, Product, FAQPage, Course, Event, JobPosting.`,
      pts: ['JSON-LD preferred format', 'schema.org types and properties', 'Must match visible content', 'Validate with Rich Results Test'],
      code: ['html', `<script type="application/ld+json">        <!-- not executed: data for crawlers -->
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Frontend Mastery",
  "description": "Complete frontend syllabus with interview prep.",
  "provider": { "@type": "Organization", "name": "JAGMA Technologies" }
}
</script>`],
      iq: [['Does structured data guarantee rich results?', 'No — it makes pages eligible; search engines decide whether to show them.']],
      cq: [['Generate BreadcrumbList JSON-LD in JS (SSR).', `const crumbs = [{ name: 'Learn', url: '/learn' }, { name: 'React', url: '/learn/react' }]; // trail
const ld = {                                              // schema object
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url }))
};
const html = '<script type="application/ld+json">' + JSON.stringify(ld) + '</' + 'script>'; // inject in SSR`]],
      err: ['Marking up content not visible to users']
    }),
    t('html-resource-hints', 'Resource Hints: preload, preconnect, prefetch, modulepreload', 'I', {
      one: '<link rel> hints that tell the browser to fetch or connect early: preload (needed now), preconnect (warm a connection), prefetch (next navigation), modulepreload (JS modules).',
      ex: `preload with as="image|font|style|script" fetches a critical resource early at high priority — fonts need crossorigin. preconnect performs DNS + TCP + TLS to a third-party origin ahead of time; dns-prefetch does only DNS.

prefetch downloads resources likely needed for the next page at low priority. modulepreload fetches and parses ES modules and their dependencies. The Speculation Rules API (<script type="speculationrules">) can prerender likely next pages. Overusing hints competes with critical resources.`,
      pts: ['preload = current page, high priority', 'preconnect for critical third-party origins', 'prefetch = future navigation', 'Fonts preload need crossorigin'],
      code: ['html', `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <!-- warm connection early -->
<link rel="dns-prefetch" href="https://api.example.com">            <!-- DNS lookup only -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin> <!-- critical font -->
<link rel="preload" href="/hero.avif" as="image" fetchpriority="high"> <!-- LCP image -->
<link rel="modulepreload" href="/assets/app.js">                     <!-- ES module + deps -->
<link rel="prefetch" href="/learn/react">                            <!-- likely next page, low priority -->`],
      iq: [['preload vs prefetch?', 'preload fetches something the current page needs soon at high priority; prefetch fetches something a future page may need at idle priority.'],
           ['Why does a preloaded font download twice?', 'Missing crossorigin attribute — fonts are fetched in CORS mode, so the preload does not match.']],
      cq: [['Prefetch a route when a link is hovered.', `document.querySelectorAll('a[data-prefetch]').forEach((a) => { // opt-in links
  a.addEventListener('mouseenter', () => {                       // user shows intent
    const l = document.createElement('link');                    // create hint
    l.rel = 'prefetch'; l.href = a.href;                         // prefetch target
    document.head.append(l);                                     // browser fetches at low priority
  }, { once: true });                                            // only once per link
});`]],
      err: ['Preloading too many resources', 'Preloading resources that are never used (console warning)']
    }),
    t('html-script-loading', 'Script Loading: defer, async, type="module"', 'I', {
      one: 'defer and async download scripts without blocking HTML parsing; defer runs in order after parsing, async runs as soon as downloaded; modules are deferred by default.',
      ex: `A plain <script> blocks the parser while downloading and executing. defer: download in parallel, execute in document order right before DOMContentLoaded — best for app code. async: execute as soon as it arrives, order not guaranteed — good for independent scripts like analytics.

type="module" scripts are deferred by default, support import/export, run in strict mode and are fetched with CORS. nomodule provided fallbacks for old browsers. Inline scripts cannot be deferred.`,
      pts: ['Plain script blocks parsing', 'defer: ordered, after parsing', 'async: whenever ready, unordered', 'type=module is deferred by default'],
      dia: `flowchart LR
  subgraph N["script (normal)"]
    N1["Parse"] --> N2["STOP: download + run"] --> N3["Parse rest"]
  end
  subgraph D["defer"]
    D1["Parse + download in parallel"] --> D2["Run in order after parsing"]
  end
  subgraph A["async"]
    A1["Parse + download in parallel"] --> A2["Run immediately when ready"]
  end`,
      code: ['html', `<script src="/analytics.js" async></script>      <!-- independent: run whenever ready -->
<script src="/vendor.js" defer></script>         <!-- runs 1st after parsing -->
<script src="/app.js" defer></script>            <!-- runs 2nd: order preserved -->
<script type="module" src="/main.js"></script>   <!-- ES module: deferred automatically -->
<script type="module">
  import { greet } from '/utils.js';             // native import in the browser
  greet();                                       // runs after parsing
</script>`],
      iq: [['defer vs async?', 'Both download without blocking; defer executes in order after parsing finishes, async executes immediately when downloaded in any order.'],
           ['When should you use async?', 'For scripts that do not depend on the DOM or other scripts, such as analytics.'],
           ['Are module scripts blocking?', 'No, they behave like defer by default (or async if you add async).']],
      cq: [['Load a script dynamically and await it.', `function loadScript(src) {                          // returns a promise
  return new Promise((resolve, reject) => {         // wrap events in a promise
    const s = document.createElement('script');     // create element
    s.src = src; s.async = true;                     // dynamic scripts are async
    s.onload = resolve; s.onerror = reject;          // settle on load/error
    document.head.append(s);                         // start download
  });
}
await loadScript('https://cdn.example.com/chart.js'); // usage`]],
      err: ['Using async for scripts that depend on each other', 'Large blocking scripts in head']
    }),
    t('html-favicons-manifest', 'Favicons, Touch Icons & Web App Manifest Links', 'B', {
      one: 'Icons and manifest links that brand your site in tabs, bookmarks, home screens and installed PWAs.',
      ex: `Modern minimal set: an SVG favicon (supports dark mode via media queries inside), an ICO/PNG fallback, an apple-touch-icon (180×180) for iOS home screens and a manifest.webmanifest with 192 and 512 icons (plus a maskable icon) for Android installs.

theme-color meta sets the browser UI colour; it can vary with media="(prefers-color-scheme: dark)".`,
      pts: ['SVG favicon + PNG/ICO fallback', 'apple-touch-icon 180×180', 'manifest icons 192 & 512 + maskable', 'theme-color can follow dark mode'],
      code: ['html', `<link rel="icon" href="/favicon.ico" sizes="32x32">            <!-- legacy fallback -->
<link rel="icon" href="/icon.svg" type="image/svg+xml">         <!-- crisp at any size -->
<link rel="apple-touch-icon" href="/apple-touch-icon.png">      <!-- iOS home screen 180x180 -->
<link rel="manifest" href="/manifest.webmanifest">              <!-- PWA install metadata -->
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)"> <!-- light UI -->
<meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)">  <!-- dark UI -->`],
      iq: [['What is a maskable icon?', 'An icon with safe-zone padding so Android can crop it into circles/squircles without cutting the logo.']],
      cq: [['Show an unread count in the favicon/badge.', `if ('setAppBadge' in navigator) navigator.setAppBadge(3); // installed PWA badge
document.title = '(3) FrontEdge';                         // fallback: count in title`]],
      err: ['Only a 16px favicon for all contexts']
    }),
    t('html-i18n', 'Internationalisation: lang, dir, hreflang', 'I', {
      one: 'Attributes and tags that make HTML work across languages and scripts: lang, dir (ltr/rtl/auto), hreflang alternates and <bdi>.',
      ex: `lang on <html> (and on any element whose language differs) improves pronunciation, hyphenation, fonts and translation. dir="rtl" for Arabic/Urdu/Hebrew; dir="auto" lets the browser detect direction for user-generated text. <bdi> isolates text of unknown direction (usernames).

For multilingual sites, <link rel="alternate" hreflang="hi" href="…"> tells search engines which page serves which language/region. Use CSS logical properties (margin-inline-start) so layouts flip automatically for RTL.`,
      pts: ['lang on html + on mixed-language parts', 'dir="rtl" / "auto"', 'hreflang alternates for SEO', 'Logical CSS properties flip with direction'],
      code: ['html', `<html lang="en">
<head>
  <link rel="alternate" hreflang="hi" href="https://site.com/hi/">   <!-- Hindi version -->
  <link rel="alternate" hreflang="en" href="https://site.com/en/">   <!-- English version -->
  <link rel="alternate" hreflang="x-default" href="https://site.com/"> <!-- fallback -->
</head>
<body>
  <p>Welcome! <span lang="hi">नमस्ते</span></p>                 <!-- inline language change -->
  <p dir="auto">مرحبا بك</p>                                    <!-- browser detects RTL -->
  <p>User <bdi>علي</bdi>: 5 posts</p>                           <!-- isolates unknown-direction text -->
</body>
</html>`],
      iq: [['What is hreflang for?', 'Telling search engines which URL to show for each language/region to avoid duplicate-content issues and show the right version.']],
      cq: [['Format a price for the user’s locale.', `const price = new Intl.NumberFormat(navigator.language, { // user's locale
  style: 'currency', currency: 'INR'                       // currency formatting
}).format(49999);                                          // e.g. "₹49,999.00"`]],
      err: ['Hard-coding left/right margins for RTL layouts']
    })
  ),
  m('9. Under the Hood & Best Practices',
    t('html-parsing-dom', 'HTML Parsing, DOM Construction & Quirks Mode', 'A', {
      one: 'The HTML parser is error-tolerant: it tokenises markup, builds the DOM with tree-construction rules, auto-fixes errors and may switch to quirks mode.',
      ex: `The tokenizer emits start tags, end tags, text and comments; the tree builder inserts nodes, auto-closing elements (p closes when a block starts), adding implied tbody/head/body and fixing misnested tags. This is why invalid HTML still "works" but may produce a surprising DOM.

The preload scanner looks ahead for resources (images, scripts, CSS) while the main parser is blocked. document.write and parser-blocking scripts hurt performance. Inspect the real DOM in DevTools — it can differ from your source.`,
      pts: ['Parser auto-corrects invalid markup', 'Implied tbody/head/body', 'Preload scanner fetches resources early', 'DevTools shows the corrected DOM'],
      flow: ['Bytes decoded to characters', 'Tokenizer emits tokens', 'Tree builder applies insertion rules', 'Errors auto-fixed', 'DOM ready → DOMContentLoaded'],
      code: ['html', `<table><tr><td>Cell</td></tr></table>      <!-- parser inserts an implied <tbody> -->
<p>One<div>Two</div></p>                     <!-- p auto-closes before div; stray </p> becomes <p></p> -->
<script>
  console.log(document.querySelector('table > tbody')); // exists even though we never wrote it
  console.log(document.compatMode);           // "CSS1Compat" = standards, "BackCompat" = quirks
</script>`],
      iq: [['Why does table > tr not match in CSS?', 'The parser inserts an implied tbody, so tr is a child of tbody, not table.'],
           ['What is the preload scanner?', 'A secondary parser that scans ahead to start downloading resources while the main parser is blocked by scripts.']],
      cq: [['Detect quirks mode.', `if (document.compatMode === 'BackCompat') {   // quirks mode
  console.warn('Add <!DOCTYPE html> at the top'); // fix advice
}`]],
      err: ['Assuming source HTML equals the DOM']
    }),
    t('html-web-components-markup', 'Custom Elements in HTML Markup', 'I', {
      one: 'Custom elements (<my-widget>) are user-defined tags registered with customElements.define, usable directly in HTML.',
      ex: `Names must contain a hyphen. Before definition they are HTMLUnknownElement-like "undefined" elements; style them with :not(:defined) to avoid flashes. They work in any framework and in plain HTML, which makes them great for design systems and embeddable widgets.

Attributes pass string data; properties pass rich data via JS. Observe attributes with static observedAttributes + attributeChangedCallback. See the Web APIs track for shadow DOM details.`,
      pts: ['Names must contain a hyphen', ':not(:defined) to hide before upgrade', 'Framework-agnostic', 'Attributes = strings, properties = any data'],
      code: ['html', `<fe-rating value="4"></fe-rating>                    <!-- custom element in markup -->
<style>fe-rating:not(:defined) { visibility: hidden; }</style> <!-- avoid flash before JS -->
<script>
  class FeRating extends HTMLElement {                 // extend the base element
    static observedAttributes = ['value'];             // attributes to watch
    attributeChangedCallback() { this.render(); }      // re-render on change
    connectedCallback() { this.render(); }             // added to the DOM
    render() {
      const v = Number(this.getAttribute('value') || 0);  // read attribute
      this.textContent = '★'.repeat(v) + '☆'.repeat(5 - v); // draw stars
      this.setAttribute('aria-label', v + ' out of 5');   // accessible text
    }
  }
  customElements.define('fe-rating', FeRating);         // register the tag
</script>`],
      iq: [['Why must custom element names contain a hyphen?', 'To avoid clashing with current or future standard HTML elements.']],
      cq: [['Wait until a custom element is defined.', `await customElements.whenDefined('fe-rating'); // resolves after define()
document.querySelector('fe-rating').setAttribute('value', '5'); // safe to use`]],
      err: ['Forgetting the hyphen in the name']
    }),
    t('html-validation-best-practices', 'Valid HTML, Deprecated Elements & Best Practices', 'B', {
      one: 'Writing valid, semantic, accessible markup: validate with the W3C validator, avoid deprecated elements and follow a quality checklist.',
      ex: `Deprecated/obsolete: <font>, <center>, <marquee>, <frame>, <big>, align/bgcolor attributes — use CSS instead. Validation catches unclosed tags, duplicate ids and invalid nesting that cause subtle bugs.

Checklist: DOCTYPE + lang + charset + viewport; one h1 and logical headings; landmarks; alt on images; labels on inputs; buttons for actions, links for navigation; width/height on media; defer scripts; no inline styles for layout; unique ids; meaningful link text.`,
      pts: ['Validate with validator.w3.org', 'No presentational elements', 'Semantic + accessible by default', 'Unique ids, proper nesting'],
      code: ['html', `<!-- ❌ Old way -->
<center><font color="red" size="5">Sale!</font></center>        <!-- deprecated presentational tags -->
<!-- ✅ Modern way -->
<p class="sale">Sale!</p>                                       <!-- semantic element -->
<style>.sale { text-align: center; color: #c00; font-size: 1.5rem; }</style> <!-- presentation in CSS -->`],
      iq: [['Why validate HTML if browsers fix errors?', 'Each browser\'s error recovery can produce unexpected DOMs, breaking CSS selectors, JS and accessibility.']],
      cq: [['Find duplicate ids on a page.', `const seen = {};                                   // id → count
document.querySelectorAll('[id]').forEach((el) => {  // every element with an id
  seen[el.id] = (seen[el.id] || 0) + 1;              // count occurrences
});
console.log(Object.keys(seen).filter((id) => seen[id] > 1)); // duplicates`]],
      err: ['Using <b>/<center> for styling', 'Ignoring validator warnings']
    })
  )
];
