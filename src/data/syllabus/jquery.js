// jQuery — complete syllabus (legacy but still common in enterprise/CMS projects)
import { t, m, legacyPicker } from '../normalize.js';
import web from '../terms/web.js';
const L = legacyPicker(web);

export default [
  m('1. Core',
    t('jq-intro', 'What is jQuery & Why It Still Matters', 'B', {
      one: 'jQuery is a small JavaScript library (2006) that simplified DOM selection, events, animation and AJAX across inconsistent old browsers.',
      ex: `Its $() function wraps elements in a jQuery object with chainable methods. It solved cross-browser problems that modern browsers have fixed, so new projects rarely need it.

You still meet it in WordPress/Drupal/Adobe Experience Manager sites, Bootstrap 3–4 plugins, enterprise portals, A/B testing scripts (Adobe Target/Optimizely snippets) and legacy admin panels. Knowing it lets you maintain and migrate these safely. jQuery 4 dropped old IE support and deprecated APIs.`,
      pts: ['$() wraps elements', 'Chainable API', 'Still common in CMS/legacy apps', 'jQuery 4 removed old APIs'],
      code: ['javascript', `$(function () {                         // shorthand for "DOM ready"
  $('.btn')                             // select all .btn elements
    .addClass('ready')                  // add a class to all
    .text('Click me')                   // set text on all
    .on('click', function () {          // attach click handler
      $(this).toggleClass('active');    // this = the clicked DOM element
    });
});`],
      iq: [['Why was jQuery popular?', 'It normalised browser differences and offered a concise API for DOM, events, animation and AJAX.'],
           ['Should you use jQuery in a new React app?', 'No — React manages the DOM; direct jQuery manipulation conflicts with it. Use native APIs or React patterns.']],
      cq: [['Check if jQuery is loaded and its version.', `if (window.jQuery) console.log('jQuery', jQuery.fn.jquery); // e.g. "3.7.1"`]],
      err: ['Mixing jQuery DOM changes with React/Angular-managed DOM']
    }),
    L('jquery-basics'),
    t('jq-selectors-traversal', 'Selectors & DOM Traversal', 'B', {
      one: 'jQuery accepts CSS selectors plus traversal methods like find, children, parent, closest, siblings, next, prev, eq, first, last, filter and not.',
      ex: `$('#id'), $('.class'), $('ul > li:first-child'). Traversal: .find() searches descendants, .children() direct children, .closest() nearest ancestor matching (great for delegation), .siblings(), .next()/.prev(), .eq(i) by index, .filter()/.not() refine sets, .end() returns to the previous set in a chain.

Cache selections in variables ($list = $('#list')) instead of re-querying in loops.`,
      pts: ['CSS selectors inside $()', 'closest() for ancestors', 'eq(i) by index', 'Cache jQuery objects'],
      code: ['javascript', `const $list = $('#todo');                     // cache the selection
$list.find('li').filter('.done').addClass('muted'); // descendants → filter → modify
$list.children().first().css('font-weight', '600'); // first direct child
$('.delete').on('click', function () {
  $(this).closest('li').remove();              // remove the row containing the button
});
const third = $list.find('li').eq(2).text();   // text of the 3rd item`],
      iq: [['find() vs children()?', 'find searches all descendants; children only direct children.'],
           ['What does .end() do?', 'Returns to the previous jQuery set in a chain, undoing the last traversal.']],
      cq: [['Vanilla equivalent of $(el).closest(".card").find(".title").text().', `el.closest('.card')?.querySelector('.title')?.textContent; // native traversal`]],
      err: ['Re-querying the same selector in a loop']
    }),
    t('jq-dom-manipulation', 'DOM Manipulation: html, text, attr, prop, css, append', 'B', {
      one: 'Methods to read/write content and attributes: .text(), .html(), .val(), .attr(), .prop(), .css(), .addClass(), .append(), .prepend(), .before(), .after(), .remove(), .empty().',
      ex: `Getters return the first element's value; setters apply to all. .text() is safe; .html() parses HTML (XSS risk with user data). .attr() reads HTML attributes; .prop() reads live DOM properties (use prop for checked, disabled, selected). .val() for form values. .data() reads data-* attributes (cached, type-converted).

Build elements with $('<li>', { text: name, class: 'item' }) rather than concatenating strings.`,
      pts: ['text() safe, html() risky', 'prop() for checked/disabled', 'Getter: first element; setter: all', 'Create elements with $("<tag>", props)'],
      code: ['javascript', `$('#title').text('Welcome');                         // safe text
$('#agree').prop('checked', true);                    // property (live state)
$('#link').attr('href', '/learn');                    // HTML attribute
$('.card').css({ borderRadius: '12px', padding: 16 }); // multiple styles
const name = 'Riya <script>';                          // untrusted input
$('<li>', { text: name, class: 'user' }).appendTo('#users'); // safe element creation
$('#old-banner').remove();                             // delete element + data/events
console.log($('#email').val());                        // read input value`],
      iq: [['attr() vs prop()?', 'attr reads the HTML attribute (initial value); prop reads the current DOM property (e.g. whether a checkbox is checked now).']],
      cq: [['Toggle disabled on a submit button based on a checkbox.', `$('#agree').on('change', function () {          // checkbox changes
  $('#submit').prop('disabled', !this.checked);   // enable only when checked
});`]],
      err: ['.html(userInput) causing XSS', 'Using attr("checked") to read current state']
    }),
    t('jq-events', 'Events: on/off, delegation, trigger & namespaces', 'I', {
      one: '.on() binds handlers (directly or delegated), .off() removes them, .trigger() fires events, and namespaces (click.menu) group handlers for easy removal.',
      ex: `Delegation: $(document).on('click', '.item', fn) works for elements added later. Event namespaces (.on('click.modal')) let you remove only your handlers (.off('.modal')) without breaking others' — important when many plugins share a page.

The handler receives a normalised event (e.preventDefault(), e.stopPropagation(), e.target). return false does both preventDefault and stopPropagation. .one() runs once.`,
      pts: ['Delegate for dynamic elements', 'Namespaces for safe removal', 'return false = prevent + stop', '.one() runs once'],
      code: ['javascript', `$('#list').on('click.todo', 'li', function (e) {   // delegated + namespaced
  $(this).toggleClass('done');                     // the li that was clicked
});
$('#form').on('submit', function (e) {
  e.preventDefault();                              // stop page reload
  $(this).trigger('form:saved', [{ id: 1 }]);      // custom event with data
});
$('#form').on('form:saved', (e, data) => console.log('saved', data.id)); // listen to custom event
$('#list').off('.todo');                           // remove only our handlers`],
      iq: [['Why use event namespaces?', 'To remove or rebind only your handlers without affecting other code on the same elements.']],
      cq: [['Close a dropdown when clicking outside.', `$(document).on('click.dropdown', (e) => {         // global click
  if (!$(e.target).closest('.dropdown').length) $('.dropdown').removeClass('open'); // outside → close
});`]],
      err: ['Binding handlers inside loops repeatedly (duplicate handlers)']
    }),
    t('jq-ajax', 'AJAX with jQuery ($.ajax, $.get, Deferreds)', 'I', {
      one: '$.ajax, $.get, $.post and $.getJSON make HTTP requests and return jqXHR objects (Deferreds) that support done/fail/always and await.',
      ex: `$.ajax({ url, method, data, dataType, headers }) sends requests; data objects are form-encoded by default — use contentType: 'application/json' and JSON.stringify for JSON APIs. jqXHR implements a Promise-like interface, so modern code can await it.

Global handlers ($(document).ajaxError) and $.ajaxSetup apply defaults (headers, CSRF tokens). Modern replacement: fetch.`,
      pts: ['Returns thenable jqXHR', 'Form-encoded by default', 'ajaxSetup for global defaults', 'Replace with fetch in new code'],
      code: ['javascript', `async function saveProfile(profile) {
  try {
    const res = await $.ajax({                 // jqXHR is awaitable
      url: '/api/profile',
      method: 'POST',
      contentType: 'application/json',         // send JSON, not form data
      data: JSON.stringify(profile),           // serialise body
      headers: { 'X-CSRF-Token': $('meta[name=csrf]').attr('content') } // CSRF token
    });
    console.log('Saved', res);
  } catch (xhr) {
    console.error('Failed', xhr.status, xhr.responseText); // error details
  }
}
// Equivalent with fetch:
// await fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });`],
      iq: [['What is a jQuery Deferred?', 'jQuery’s promise-like object with done/fail/always and then, predating native Promises.']],
      cq: [['Load HTML fragment into a div.', `$('#panel').load('/partials/help.html #content'); // fetch and insert part of a page`]],
      err: ['Sending JSON without contentType', 'Ignoring errors']
    }),
    t('jq-effects', 'Effects & Animations (show, fadeIn, slideToggle, animate)', 'B', {
      one: 'Built-in visual effects (show/hide, fadeIn/fadeOut, slideUp/slideDown/slideToggle) and .animate() for numeric CSS properties.',
      ex: `Effects queue by default; .stop() clears queued animations to avoid "animation buildup" on rapid hovers. Durations: 'fast', 'slow' or ms; callbacks run after completion. jQuery animations run on the main thread with timers — for performance, prefer CSS transitions/animations toggled via classes.`,
      pts: ['Effects queue — use stop()', 'Callbacks after completion', 'Prefer CSS transitions for performance', 'slideToggle for accordions'],
      code: ['javascript', `$('.faq-question').on('click', function () {
  $(this).next('.faq-answer')       // the answer after the question
    .stop(true, true)               // clear queue, jump to end
    .slideToggle(200);              // open/close in 200ms
});
$('#toast').fadeIn('fast').delay(2000).fadeOut('slow'); // chained queue
// Modern alternative: $('#toast').addClass('visible') with a CSS transition`],
      iq: [['Why use .stop() before animations?', 'To prevent queued animations from piling up when events fire rapidly.']],
      cq: [['Smooth scroll to a section with jQuery.', `$('html, body').animate({ scrollTop: $('#pricing').offset().top - 70 }, 400); // offset for header`]],
      err: ['Animating layout properties on large lists']
    }),
    t('jq-utilities-plugins', 'Utilities & Writing Plugins ($.each, $.extend, $.fn)', 'I', {
      one: 'Helpers like $.each, $.map, $.extend, $.isPlainObject, $.Deferred, and the plugin pattern of adding methods to $.fn.',
      ex: `$.extend(true, {}, defaults, options) deep-merges options (classic plugin pattern). Plugins add to $.fn so every jQuery object can call them, should return this for chaining, and must not assume $ is jQuery (wrap in an IIFE passing jQuery).

Many legacy UIs depend on plugins (sliders, date pickers, DataTables, Select2). When migrating, wrap them in a component and destroy them on unmount.`,
      pts: ['$.extend for merging options', 'Plugins live on $.fn', 'Return this for chaining', 'Destroy plugins on teardown'],
      code: ['javascript', `(function ($) {                               // IIFE: safe $ alias
  $.fn.highlight = function (options) {         // plugin method on all jQuery objects
    const settings = $.extend({ color: '#ffe066', duration: 800 }, options); // defaults + overrides
    return this.each(function () {              // each matched element; return for chaining
      const $el = $(this);
      $el.css('background', settings.color);    // apply highlight
      setTimeout(() => $el.css('background', ''), settings.duration); // remove later
    });
  };
})(jQuery);
$('.new-item').highlight({ color: '#b2f2bb' }).addClass('seen'); // chainable`],
      iq: [['How do you write a jQuery plugin?', 'Attach a function to $.fn, merge options with defaults, iterate with this.each and return this.']],
      cq: [['Avoid $ conflicts with other libraries.', `const jq = jQuery.noConflict();   // release $ to another library
jq('.btn').hide();                  // use jq instead`]],
      err: ['Not returning this (breaks chaining)']
    }),
    t('jq-migration', 'Migrating from jQuery to Vanilla JS / Frameworks', 'I', {
      one: 'Strategies to remove jQuery: map APIs to native equivalents, migrate page by page, wrap legacy widgets, and stop adding new jQuery code.',
      ex: `Native equivalents: $(sel) → querySelectorAll; .on → addEventListener (+ closest for delegation); .addClass → classList; .css → style/classes; $.ajax → fetch; .animate → CSS transitions / Web Animations; .data → dataset; $.extend → spread/structuredClone; $.each → forEach.

Incremental approach: add a modern framework island for new features, keep jQuery for old pages, use jQuery Migrate to find deprecated API usage, write tests around critical flows, then remove pages/widgets one at a time and finally the library.`,
      pts: ['Map each API to native', 'Migrate incrementally', 'jQuery Migrate finds deprecated usage', 'Test critical flows first'],
      code: ['javascript', `// jQuery                                   // Vanilla
// $('.item').addClass('on');
document.querySelectorAll('.item').forEach((el) => el.classList.add('on'));
// $('#list').on('click', '.del', fn);
document.querySelector('#list').addEventListener('click', (e) => {
  const btn = e.target.closest('.del');      // delegated match
  if (btn) btn.closest('li').remove();       // same behaviour
});
// $.getJSON('/api/x', cb);
fetch('/api/x').then((r) => r.json()).then(console.log);`],
      iq: [['How would you migrate a large jQuery app to React?', 'Incrementally: mount React islands for new features, share state via events/stores, wrap and later replace widgets, cover with tests, and remove jQuery once unused.']],
      cq: [['Vanilla replacement for $(document).ready.', `if (document.readyState !== 'loading') init();         // already parsed
else document.addEventListener('DOMContentLoaded', init); // wait for parsing`]],
      err: ['Big-bang rewrites without tests']
    })
  )
];
