// JavaScript — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import js from '../terms/javascript.js';
const L = legacyPicker(js);

export default [
  m('1. Language Basics',
    t('js-how-js-runs', 'How JavaScript Runs: Engines, JIT & Runtimes', 'B', {
      one: 'JavaScript code is executed by an engine (V8, SpiderMonkey, JavaScriptCore) that parses, compiles (JIT) and runs it inside a runtime such as a browser or Node.js.',
      ex: `The engine parses source into an AST, an interpreter (V8's Ignition) produces bytecode and starts running quickly, and an optimising compiler (TurboFan) compiles hot functions to machine code using type feedback. If assumptions break (a function suddenly receives strings instead of numbers), the code is de-optimised.

The engine provides the language (call stack, heap, garbage collector). The runtime adds APIs: browsers provide the DOM, fetch, timers and the event loop; Node.js provides fs, http, process. JavaScript is single-threaded per agent, dynamically typed and garbage-collected.`,
      pts: ['Engine = parser + interpreter + JIT compiler + GC', 'Runtime adds APIs (DOM, fetch, timers)', 'Single-threaded with an event loop', 'Consistent types keep code optimised'],
      flow: ['Source code', 'Parse to AST', 'Bytecode interpreter', 'Hot code optimised by JIT', 'Machine code runs'],
      code: ['javascript', `function add(a, b) {        // a function the engine will profile
  return a + b;              // same types each time = easy to optimise
}
for (let i = 0; i < 1e6; i++) {
  add(i, 1);                 // "hot" function → JIT compiles to fast machine code
}
add('1', 2);                 // different types → may trigger de-optimisation
console.log(typeof window);  // "object" in browsers, "undefined" in Node (runtime APIs differ)`],
      iq: [['What is the difference between the JS engine and the runtime?', 'The engine executes the language; the runtime (browser, Node, Deno, Bun) supplies APIs like DOM, timers, fetch and the event loop.'],
           ['What is JIT compilation?', 'Just-in-time compilation: code starts interpreted, and frequently executed code is compiled to optimised machine code at runtime.'],
           ['Is JavaScript interpreted or compiled?', 'Both: modern engines interpret bytecode and JIT-compile hot paths.']],
      cq: [['Detect the runtime environment.', `const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'; // DOM exists
const isNode = typeof process !== 'undefined' && !!process.versions?.node;          // Node globals
console.log({ isBrowser, isNode });`]],
      err: ['Confusing browser APIs (setTimeout, fetch) with the language itself']
    }),
    t('js-variables', 'Variables: var, let, const', 'B', {
      one: 'var is function-scoped and hoisted as undefined; let and const are block-scoped, with const preventing reassignment of the binding.',
      ex: `Use const by default, let when you need to reassign, and avoid var. const does not make objects immutable: const user = {} still allows user.name = 'A'. It only blocks user = otherObject.

let/const live in the Temporal Dead Zone until declared, can't be redeclared in the same scope and don't create properties on the global object (var at top level creates window.x).`,
      pts: ['const by default, let when reassigning', 'const ≠ immutable object', 'let/const are block-scoped', 'var leaks out of blocks'],
      code: ['javascript', `const PI = 3.14159;            // cannot be reassigned
let count = 0;                 // can be reassigned
count += 1;                    // OK
const user = { name: 'Riya' }; // const binding to an object
user.name = 'Aman';            // allowed: we mutate the object, not the binding
// user = {};                  // TypeError: assignment to constant variable
if (true) { var leak = 1; let safe = 2; } // var ignores blocks
console.log(leak);             // 1
// console.log(safe);          // ReferenceError: block-scoped`],
      iq: [['Can you change a const array?', 'Yes, you can push/modify elements; you cannot reassign the variable to a new array.'],
           ['Why avoid var?', 'Function scope, hoisting as undefined, redeclaration and global-object pollution cause bugs.']],
      cq: [['Make an object truly read-only.', `const config = Object.freeze({ api: '/v1', retries: 3 }); // shallow freeze
config.retries = 5;                                        // ignored (TypeError in strict mode)
console.log(config.retries);                               // 3`]],
      err: ['Assuming const makes objects immutable']
    }),
    t('js-data-types', 'Data Types: Primitives vs Reference Types', 'B', {
      one: 'JavaScript has 7 primitive types (string, number, bigint, boolean, undefined, null, symbol) that are copied by value, and objects (including arrays and functions) that are handled by reference.',
      ex: `Primitives are immutable values; assigning copies the value. Objects live on the heap and variables hold a reference — copying the variable copies the reference, so both point to the same object. That is why mutating an object passed to a function changes the caller's object, and why React needs new references to detect changes.

typeof returns "string", "number", "bigint", "boolean", "undefined", "symbol", "object" (also for null — a historic bug), and "function". Use Array.isArray for arrays and x === null for null.`,
      pts: ['7 primitives, everything else is an object', 'Primitives copy by value', 'Objects share by reference', 'typeof null === "object"'],
      dia: `flowchart LR
  A["let a = 5"] --> V1["5"]
  B["let b = a"] --> V2["5 (copy)"]
  O1["const o1 = obj"] --> H["Heap object"]
  O2["const o2 = o1"] --> H`,
      code: ['javascript', `let a = 5;                 // primitive
let b = a;                 // copy of the value
b = 10;                    // a is still 5
const p1 = { score: 1 };   // object on the heap
const p2 = p1;             // copies the REFERENCE
p2.score = 99;             // mutates the shared object
console.log(p1.score);     // 99
console.log(typeof null, Array.isArray([]), typeof (() => {})); // "object" true "function"`],
      iq: [['Name the primitive types.', 'string, number, bigint, boolean, undefined, null, symbol.'],
           ['Is JavaScript pass-by-reference?', 'It is pass-by-value; for objects the value passed is a reference, so mutations are visible but reassignment is not.'],
           ['Why does typeof null return "object"?', 'A bug from the first JS implementation kept for backward compatibility.']],
      cq: [['Write a reliable type checker.', `const typeOf = (v) =>                                 // returns lowercase type name
  Object.prototype.toString.call(v).slice(8, -1).toLowerCase(); // "[object Array]" → "array"
console.log(typeOf([]), typeOf(null), typeOf(new Date())); // array null date`]],
      err: ['Mutating props/state objects in React', 'Using typeof to detect arrays']
    }),
    t('js-type-coercion', 'Type Coercion, == vs ===, Truthy & Falsy', 'B', {
      one: 'JavaScript automatically converts types in some operations (coercion); === compares without conversion while == converts first.',
      ex: `Falsy values: false, 0, -0, 0n, "", null, undefined, NaN. Everything else is truthy — including "0", "false", [] and {}. + with a string concatenates ("1" + 2 = "12"), while -, *, / convert to numbers ("5" - 2 = 3).

== follows complex rules (null == undefined is true, "" == 0 is true). Always use === except the idiom x == null (checks both null and undefined). Use explicit conversion: Number(), String(), Boolean() or !!.`,
      pts: ['8 falsy values', '[] and {} are truthy', 'Prefer ===', 'x == null checks null or undefined'],
      code: ['javascript', `console.log('1' + 2);          // "12"  (string concatenation)
console.log('5' - 2);          // 3     (numeric conversion)
console.log(0 == '');          // true  (coercion)
console.log(0 === '');         // false (no coercion)
console.log(null == undefined);// true  (special rule)
console.log(Boolean([]), !!'0'); // true true — non-empty string and arrays are truthy
console.log(NaN === NaN, Number.isNaN(NaN)); // false true`],
      iq: [['List all falsy values.', 'false, 0, -0, 0n, "", null, undefined, NaN.'],
           ['What is [] + {}?', '"[object Object]" — both convert to strings ("" + "[object Object]").'],
           ['How do you check for NaN?', 'Number.isNaN(x) or Object.is(x, NaN); NaN !== NaN.']],
      cq: [['Safely parse a numeric query param with a default.', `const page = Number.parseInt(params.get('page') ?? '', 10); // NaN if missing/invalid
const safePage = Number.isFinite(page) && page > 0 ? page : 1;  // fallback to 1`]],
      err: ['if (value) treating 0 as missing', 'Using == in comparisons']
    }),
    t('js-operators', 'Operators: logical, ??, ?., spread, exponent, comma', 'B', {
      one: 'Arithmetic, comparison, logical (&&, ||, !), nullish coalescing (??), optional chaining (?.), logical assignment (||=, &&=, ??=), ternary and spread operators.',
      ex: `|| returns the first truthy operand (beware 0 and ""); ?? returns the right side only when the left is null or undefined — ideal for defaults. && returns the first falsy operand or the last value (used for conditional rendering).

?. stops and returns undefined when a value is null/undefined: user?.address?.city, arr?.[0], fn?.(). Logical assignment: settings.theme ??= 'dark'. ** is exponentiation. typeof, instanceof, in and delete are operators too.`,
      pts: ['?? only for null/undefined', '|| treats 0 and "" as missing', '?. for safe access', '??= assigns defaults'],
      code: ['javascript', `const qty = 0;
console.log(qty || 10);          // 10 — 0 is falsy (bug if 0 is valid)
console.log(qty ?? 10);          // 0  — only null/undefined fall back
const user = { profile: null };
console.log(user.profile?.city); // undefined, no TypeError
const opts = {};
opts.retries ??= 3;              // set only if missing
console.log(2 ** 10);            // 1024
const isAdmin = user.role === 'admin' ? 'yes' : 'no'; // ternary`],
      iq: [['|| vs ??', '|| falls back on any falsy value; ?? only on null or undefined.'],
           ['What does a?.b() return if a is null?', 'undefined — the call is short-circuited without throwing.']],
      cq: [['Read a deeply nested config safely with defaults.', `const timeout = config?.network?.timeout ?? 5000; // default only when missing`]],
      err: ['count || default when 0 is valid', 'Mixing ?? with || without parentheses (SyntaxError)']
    }),
    t('js-control-flow-loops', 'Control Flow & Loops (if, switch, for, for…of, for…in)', 'B', {
      one: 'Conditionals (if/else, switch, ternary) choose paths; loops (for, while, do…while, for…of, for…in) repeat work; break/continue control iteration.',
      ex: `for…of iterates values of iterables (arrays, strings, Maps, Sets); for…in iterates enumerable property keys of objects (including inherited ones) — avoid it for arrays. Array methods (map, filter, forEach) are often clearer, but plain loops allow break/continue and await in sequence.

switch uses strict equality; remember break to avoid fall-through. Labels can break outer loops.`,
      pts: ['for…of = values, for…in = keys', 'Don’t use for…in on arrays', 'switch needs break', 'forEach can’t break; for…of can'],
      code: ['javascript', `const langs = ['js', 'ts', 'css'];
for (const lang of langs) {             // values
  if (lang === 'ts') continue;          // skip ts
  console.log(lang);                    // js, css
}
const user = { name: 'A', role: 'dev' };
for (const key in user) console.log(key, user[key]); // object keys
switch (user.role) {                    // strict comparison
  case 'admin': console.log('full'); break;  // break prevents fall-through
  case 'dev':   console.log('code'); break;
  default:      console.log('read');
}`],
      iq: [['for…in vs for…of?', 'for…in loops over enumerable property names (including inherited); for…of loops over values of an iterable.'],
           ['How do you break out of forEach?', 'You cannot (except by throwing); use for…of, some() or every().']],
      cq: [['Find the first even number and stop early.', `for (const n of [3, 7, 8, 10]) {   // iterate values
  if (n % 2 === 0) { console.log(n); break; } // 8, then exit loop
}`]],
      err: ['Using for…in on arrays', 'Missing break in switch']
    }),
    t('js-strings', 'Strings & Template Literals', 'B', {
      one: 'Strings are immutable UTF-16 text values with methods like slice, includes, split, replaceAll, padStart, trim and at; template literals add interpolation and multi-line strings.',
      ex: `Template literals use backticks: \`Hello \${name}\`. Tagged templates (sql\`…\`, styled.div\`…\`) pass parts to a function. String methods return new strings — they never mutate.

Common methods: length, at(-1), slice(start, end), substring, includes, startsWith, indexOf, split, join (array), replace/replaceAll, toUpperCase, trim, padStart, repeat, localeCompare, normalize. Emojis may take two code units; use [...str] or Intl.Segmenter to count characters.`,
      pts: ['Strings are immutable', 'Template literals interpolate', 'replaceAll / at / padStart', 'Use Intl.Segmenter for user-perceived characters'],
      code: ['javascript', `const name = 'Sujata';
const msg = \`Hello, \${name}! You have \${2 + 3} new terms.\`; // interpolation
console.log(msg);
const slug = '  React Hooks Guide '.trim().toLowerCase().replaceAll(' ', '-'); // "react-hooks-guide"
console.log('invoice-7'.padStart(12, '0'));   // "000invoice-7"
console.log('frontend'.at(-1));               // "d" — last character
console.log('a,b,c'.split(','));              // ["a", "b", "c"]
console.log([...'👍🏽'].length);                // count code points, not UTF-16 units`],
      iq: [['Are strings mutable?', 'No — methods return new strings.'],
           ['slice vs substring?', 'Both extract; slice supports negative indexes, substring swaps arguments if start > end and treats negatives as 0.']],
      cq: [['Capitalise each word.', `const title = (s) => s.split(' ')                       // words
  .map((w) => w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w) // capitalise
  .join(' ');                                            // back to string
console.log(title('hello frontend world'));              // "Hello Frontend World"`],
           ['Check if a string is a palindrome.', `const isPal = (s) => {                         // ignore case & non-letters
  const c = s.toLowerCase().replace(/[^a-z0-9]/g, ''); // clean
  return c === [...c].reverse().join('');      // compare with reversed
};
console.log(isPal('A man, a plan, a canal: Panama')); // true`]],
      err: ['Building HTML with template literals and user input (XSS)']
    }),
    t('js-numbers-math', 'Numbers, Math, BigInt & Floating-point', 'B', {
      one: 'Numbers are 64-bit floating point (IEEE 754); use Number methods for parsing/checks, Math for calculations and BigInt for integers beyond 2^53.',
      ex: `0.1 + 0.2 !== 0.3 because of binary floating point; compare with a tolerance (Number.EPSILON) or work in integer units (paise, cents). Safe integers go up to Number.MAX_SAFE_INTEGER (2^53 − 1); larger IDs (e.g. Twitter IDs) must be strings or BigInt (123n).

parseInt('08', 10) parses leading digits; Number('08px') is NaN. toFixed returns a string. Use Intl.NumberFormat for currency display. Math: round, floor, ceil, trunc, max, min, random, abs, pow.`,
      pts: ['0.1 + 0.2 ≠ 0.3', 'Money in integer minor units', 'BigInt for big integers (123n)', 'Intl.NumberFormat for display'],
      code: ['javascript', `console.log(0.1 + 0.2);                          // 0.30000000000000004
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true — compare with tolerance
const pricePaise = 49999;                         // store money as integers
console.log((pricePaise / 100).toFixed(2));       // "499.99" (string)
console.log(Number.MAX_SAFE_INTEGER);             // 9007199254740991
console.log(9007199254740993n + 1n);              // BigInt arithmetic
console.log(parseInt('42px', 10), Number('42px'));// 42 NaN
const rnd = Math.floor(Math.random() * 6) + 1;    // dice roll 1–6`],
      iq: [['Why is 0.1 + 0.2 not 0.3?', '0.1 and 0.2 cannot be represented exactly in binary floating point; tiny rounding errors appear.'],
           ['parseInt vs Number?', 'parseInt reads leading digits and ignores the rest; Number converts the whole string or returns NaN.']],
      cq: [['Random integer between min and max inclusive.', `const randInt = (min, max) =>                   // inclusive range
  Math.floor(Math.random() * (max - min + 1)) + min; // scale, shift, floor
console.log(randInt(5, 10));`]],
      err: ['Using floats for money', 'parseInt without radix']
    }),
    t('js-arrays', 'Arrays: creation, mutation & immutable updates', 'B', {
      one: 'Arrays are ordered lists with mutating methods (push, pop, shift, unshift, splice, sort, reverse) and non-mutating ones (slice, concat, map, filter, toSorted, with).',
      ex: `Know which methods mutate: push/pop/shift/unshift/splice/sort/reverse/fill/copyWithin. In React/Redux state, use immutable patterns: [...arr, item], arr.filter(x => x.id !== id), arr.map(x => x.id === id ? {...x, done: true} : x), toSorted(), toSpliced(), with().

Create with literals, Array.from({length: 5}, (_, i) => i), Array.of. includes / indexOf / findIndex / findLast search. flat() flattens nested arrays.`,
      pts: ['Know mutating vs non-mutating methods', 'Immutable updates for UI state', 'Array.from for ranges and iterables', 'toSorted/toSpliced/with (ES2023)'],
      code: ['javascript', `const todos = [{ id: 1, done: false }, { id: 2, done: false }];
const added = [...todos, { id: 3, done: false }];              // add (new array)
const removed = todos.filter((t) => t.id !== 1);               // remove
const toggled = todos.map((t) => (t.id === 2 ? { ...t, done: true } : t)); // update one
const sorted = [3, 1, 2].toSorted((a, b) => a - b);            // copy sorted
const range = Array.from({ length: 5 }, (_, i) => i + 1);      // [1,2,3,4,5]
console.log([1, [2, [3]]].flat(Infinity));                     // [1,2,3]
console.log(todos.length);                                     // still 2 — original untouched`],
      iq: [['Which array methods mutate?', 'push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin.'],
           ['Why does [10, 2, 1].sort() give [1, 10, 2]?', 'Default sort compares strings; pass (a, b) => a - b for numbers.']],
      cq: [['Remove duplicates from an array of objects by id.', `const unique = [...new Map(items.map((i) => [i.id, i])).values()]; // last item per id wins`],
           ['Chunk an array into groups of n.', `const chunk = (arr, n) => Array.from(          // number of chunks
  { length: Math.ceil(arr.length / n) },
  (_, i) => arr.slice(i * n, i * n + n));       // slice each group
console.log(chunk([1, 2, 3, 4, 5], 2));         // [[1,2],[3,4],[5]]`]],
      err: ['sort() without comparator for numbers', 'Mutating state arrays with push']
    }),
    t('js-array-methods', 'Array Iteration Methods: map, filter, reduce, find, some, every', 'B', {
      one: 'Higher-order array methods that transform (map), select (filter), aggregate (reduce), search (find, findIndex, some, every) and flatten (flatMap) data declaratively.',
      ex: `map returns a new array of the same length; filter returns matching items; reduce folds an array into one value (sum, object grouping, max); find returns the first match or undefined; some/every return booleans and short-circuit.

Chain them for readable pipelines, but avoid repeated passes on huge arrays in hot paths. forEach is only for side effects and returns undefined. Always pass an initial value to reduce.`,
      pts: ['map → same length', 'filter → subset', 'reduce → single value (give initial value)', 'some/every short-circuit'],
      flow: ['Input array', 'filter: keep matching', 'map: transform each', 'reduce: combine to one value'],
      code: ['javascript', `const orders = [
  { item: 'Course', price: 499, paid: true },
  { item: 'Book',   price: 299, paid: false },
  { item: 'Mentor', price: 999, paid: true }
];
const paidTotal = orders
  .filter((o) => o.paid)                    // keep paid orders
  .map((o) => o.price)                      // take prices
  .reduce((sum, p) => sum + p, 0);          // add up, starting at 0
console.log(paidTotal);                     // 1498
console.log(orders.find((o) => o.price > 500)?.item); // "Mentor"
console.log(orders.some((o) => !o.paid));   // true — at least one unpaid
console.log(orders.every((o) => o.price > 100)); // true`],
      iq: [['map vs forEach?', 'map returns a new transformed array; forEach returns undefined and is for side effects.'],
           ['Why give reduce an initial value?', 'Without it, reduce uses the first element and throws on empty arrays; the initial value also fixes the accumulator type.']],
      cq: [['Polyfill Array.prototype.map.', `Array.prototype.myMap = function (cb, thisArg) { // add to all arrays
  const out = [];                                 // result array
  for (let i = 0; i < this.length; i++) {         // walk indexes
    if (i in this) out[i] = cb.call(thisArg, this[i], i, this); // skip holes, call callback
  }
  return out;                                     // new array
};`],
           ['Count word frequencies with reduce.', `const freq = 'a b a c b a'.split(' ').reduce((acc, w) => { // accumulator object
  acc[w] = (acc[w] || 0) + 1;                     // increment count
  return acc;                                     // pass along
}, {});                                           // start empty
console.log(freq);                                // { a: 3, b: 2, c: 1 }`]],
      err: ['Using map for side effects', 'reduce without initial value']
    }),
    t('js-objects', 'Objects: literals, properties, methods & iteration', 'B', {
      one: 'Objects store key–value properties; create them with literals, access with dot or bracket notation, and iterate with Object.keys/values/entries.',
      ex: `Shorthand properties ({ name }), computed keys ({ [key]: value }), methods ({ greet() {} }), getters/setters. Bracket notation is needed for dynamic or non-identifier keys (obj['first-name']).

Object.keys/values/entries return arrays; Object.fromEntries converts back (great for transforming objects). Check own properties with Object.hasOwn(obj, key). delete removes a property. Property order: integer keys ascending, then string keys in insertion order.`,
      pts: ['Shorthand and computed keys', 'Object.entries + fromEntries to transform', 'Object.hasOwn for own keys', 'Bracket notation for dynamic keys'],
      code: ['javascript', `const key = 'role';
const name = 'Riya';
const user = {
  name,                                  // shorthand for name: name
  [key]: 'developer',                    // computed key → role
  greet() { return 'Hi ' + this.name; }  // method shorthand
};
console.log(user['role'], user.greet()); // bracket access, method call
const prices = { a: 100, b: 200 };
const withGst = Object.fromEntries(      // object → entries → transform → object
  Object.entries(prices).map(([k, v]) => [k, v * 1.18]));
console.log(withGst, Object.hasOwn(user, 'name')); // { a: 118, b: 236 } true`],
      iq: [['Dot vs bracket notation?', 'Dot needs a valid identifier known in advance; brackets accept any string or variable expression.'],
           ['How do you check if a key exists?', 'Object.hasOwn(obj, key) for own properties; key in obj also checks the prototype chain.']],
      cq: [['Pick only certain keys from an object.', `const pick = (obj, keys) =>                         // returns a new object
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]])); // keep listed keys
console.log(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']));   // { a: 1, c: 3 }`]],
      err: ['Using objects as maps with user-supplied keys (prototype pollution) — use Map']
    }),
    t('js-object-static-methods', 'Object Utilities: assign, freeze, seal, structuredClone', 'I', {
      one: 'Built-in helpers to copy, merge, lock and inspect objects: Object.assign, spread, Object.freeze, Object.seal, Object.preventExtensions, structuredClone, Object.groupBy.',
      ex: `Spread ({...a, ...b}) and Object.assign perform shallow merges — nested objects are shared. structuredClone(obj) makes a deep copy (supports Dates, Maps, Sets, cycles; not functions or DOM nodes).

freeze: no add/remove/change (shallow). seal: no add/remove, changes allowed. preventExtensions: no adding. Object.is compares like === but treats NaN as equal and +0/−0 as different.`,
      pts: ['Spread/assign = shallow', 'structuredClone = deep copy', 'freeze > seal > preventExtensions', 'Object.is(NaN, NaN) is true'],
      code: ['javascript', `const defaults = { theme: 'dark', layout: { cols: 2 } };
const prefs = { ...defaults, theme: 'light' };   // shallow merge, override theme
prefs.layout.cols = 3;                           // ⚠ also changes defaults.layout (shared)
const deep = structuredClone(defaults);          // independent deep copy
deep.layout.cols = 4;                            // defaults untouched
const frozen = Object.freeze({ a: 1 });          // cannot change
const sealed = Object.seal({ a: 1 });            // can change, cannot add
sealed.a = 2; sealed.b = 3;                      // a updates, b ignored
console.log(Object.is(NaN, NaN), Object.is(0, -0)); // true false`],
      iq: [['Shallow vs deep copy?', 'Shallow copies top-level properties (nested objects shared); deep copies recursively create new nested objects.'],
           ['Limitations of JSON.parse(JSON.stringify(x)) as deep copy?', 'Loses functions, undefined, Dates (become strings), Maps/Sets, and fails on circular references; prefer structuredClone.']],
      cq: [['Deep freeze an object.', `function deepFreeze(o) {                         // recursive freeze
  Object.values(o).forEach((v) => {               // each property value
    if (v && typeof v === 'object') deepFreeze(v); // recurse into objects
  });
  return Object.freeze(o);                        // freeze this level
}`]],
      err: ['Assuming spread deep-copies nested data']
    }),
    t('js-destructuring-spread', 'Destructuring, Spread & Rest', 'B', {
      one: 'Destructuring unpacks values from arrays/objects into variables; spread (...) expands iterables/objects; rest (...) collects remaining items.',
      ex: `Object destructuring with renaming and defaults: const { name: fullName = 'Guest', ...rest } = user. Array destructuring by position: const [first, , third] = arr; swap: [a, b] = [b, a]. Nested destructuring works too.

Spread copies arrays/objects and passes arguments (Math.max(...nums)). Rest parameters (...args) replace the old arguments object. Destructuring in function parameters makes options objects self-documenting.`,
      pts: ['Rename and default while destructuring', 'Rest gathers, spread expands', 'Swap with [a, b] = [b, a]', 'Destructure function parameters'],
      code: ['javascript', `const user = { id: 7, name: 'Riya', role: 'dev', city: 'Pune' };
const { name: fullName, role = 'guest', ...others } = user; // rename, default, rest
console.log(fullName, role, others);       // "Riya" "dev" { id: 7, city: 'Pune' }
const [first, , third = 0] = [10, 20];     // skip 2nd, default for 3rd
let a = 1, b = 2; [a, b] = [b, a];         // swap
function createUser({ name, isAdmin = false } = {}) { // destructured params with defaults
  return { name, isAdmin };
}
const sum = (...nums) => nums.reduce((s, n) => s + n, 0); // rest parameter
console.log(sum(...[1, 2, 3]));            // spread into arguments → 6`],
      iq: [['Rest vs spread?', 'Same syntax; rest collects items into an array/object (in parameters or destructuring), spread expands them (in calls, literals).'],
           ['What happens destructuring undefined?', 'TypeError — provide a default: function f({ a } = {}).']],
      cq: [['Remove a property immutably.', `const { password, ...safeUser } = user; // safeUser has everything except password`]],
      err: ['Destructuring from possibly undefined values without defaults']
    }),
    t('js-json', 'JSON: stringify, parse & pitfalls', 'B', {
      one: 'JSON is a text format for data; JSON.stringify converts values to JSON strings and JSON.parse converts them back.',
      ex: `JSON supports objects, arrays, strings, numbers, booleans and null — not undefined, functions, Symbols, Dates (become ISO strings), Map/Set (become {}), BigInt (throws) or NaN/Infinity (become null).

stringify(value, replacer, space) can filter keys and pretty-print; toJSON() customises output. parse(text, reviver) can revive Dates. Always wrap JSON.parse in try/catch when the input is external (localStorage, APIs).`,
      pts: ['undefined/functions are dropped', 'Dates become strings', 'Wrap parse in try/catch', 'replacer / reviver / space arguments'],
      code: ['javascript', `const data = { name: 'A', when: new Date(0), skip: undefined, fn() {} };
const json = JSON.stringify(data, null, 2);       // pretty-print with 2 spaces
console.log(json);                                // skip and fn are gone, date is an ISO string
const back = JSON.parse(json, (key, value) =>     // reviver runs for every key
  key === 'when' ? new Date(value) : value);      // turn the string back into a Date
function safeParse(text, fallback = null) {       // never crash on bad JSON
  try { return JSON.parse(text); } catch { return fallback; }
}
console.log(safeParse('{bad json}', {}));         // {}`],
      iq: [['What does JSON.stringify do with undefined?', 'Omits it in objects and converts it to null in arrays.'],
           ['How to serialise a Map?', 'JSON.stringify([...map]) or Object.fromEntries(map), then rebuild with new Map(entries).']],
      cq: [['Persist a Map in localStorage.', `localStorage.setItem('cart', JSON.stringify([...cart]));        // Map → array of entries
const restored = new Map(JSON.parse(localStorage.getItem('cart') || '[]')); // back to Map`]],
      err: ['JSON.parse without try/catch on external data']
    }),
    t('js-dates-temporal', 'Dates: Date object, time zones & Temporal', 'I', {
      one: 'The Date object represents a timestamp in ms since 1970 UTC; formatting uses Intl.DateTimeFormat; the newer Temporal API fixes Date’s design problems.',
      ex: `Date months are 0-based, objects are mutable and parsing non-ISO strings is inconsistent across browsers. Store and transmit dates as ISO 8601 strings in UTC (toISOString()), and format for users with Intl.DateTimeFormat or toLocaleDateString with a timeZone.

Temporal (shipping in modern browsers from 2025–2026, polyfill available) provides immutable PlainDate, ZonedDateTime, Instant and Duration types with real time-zone and calendar support. Libraries like date-fns or Day.js remain common.`,
      pts: ['Months are 0-based', 'Store ISO UTC strings', 'Format with Intl', 'Temporal is the modern replacement'],
      code: ['javascript', `const now = new Date();                          // current moment
console.log(now.toISOString());                   // "2026-10-22T16:30:00.000Z" (UTC)
const d = new Date(2026, 0, 26);                  // 26 January 2026 — month 0 = Jan
const fmt = new Intl.DateTimeFormat('en-IN', {    // Indian English formatting
  dateStyle: 'medium', timeZone: 'Asia/Kolkata'   // explicit time zone
});
console.log(fmt.format(d));                        // "26 Jan 2026"
const days = Math.round((new Date('2026-12-31') - new Date('2026-10-22')) / 86400000); // difference in days
console.log(days);
// Temporal (modern): Temporal.Now.plainDateISO().add({ days: 7 }).toString()`],
      iq: [['Why store dates in UTC?', 'It avoids ambiguity across time zones and daylight-saving changes; convert to local time only for display.'],
           ['What problems does Temporal solve?', 'Mutability, 0-based months, poor time-zone support and unreliable parsing in Date.']],
      cq: [['Format "time ago".', `const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' }); // localized relative time
const minsAgo = (date) => Math.round((date - Date.now()) / 60000);  // negative = past
console.log(rtf.format(minsAgo(new Date(Date.now() - 5 * 60000)), 'minute')); // "5 minutes ago"`]],
      err: ['Parsing "22/10/2026" with new Date()', 'Forgetting months are 0-based']
    }),
    t('js-regex', 'Regular Expressions', 'I', {
      one: 'Regular expressions are patterns for matching text, used with test, match, matchAll, replace, split and search.',
      ex: `Syntax: character classes (\\d \\w \\s [a-z]), quantifiers (+ * ? {2,4}), anchors (^ $), groups ((…), named (?<year>\\d{4})), alternation (a|b), lookahead (?=…) / lookbehind (?<=…). Flags: g global, i case-insensitive, m multiline, s dotAll, u unicode, v unicodeSets, y sticky, d indices.

Use regex for validation hints and parsing, but avoid catastrophic backtracking patterns like (a+)+ on user input (ReDoS). Escape user input before building a RegExp (RegExp.escape in ES2025).`,
      pts: ['test for boolean, matchAll for all matches', 'Named groups (?<name>…)', 'Escape user input', 'Beware ReDoS'],
      code: ['javascript', `const pin = /^\\d{6}$/;                                  // exactly 6 digits (Indian PIN code)
console.log(pin.test('122018'));                        // true
const dateRe = /(?<d>\\d{2})-(?<m>\\d{2})-(?<y>\\d{4})/; // named groups
const { d, m, y } = '22-10-2026'.match(dateRe).groups;  // destructure groups
console.log(\`\${y}-\${m}-\${d}\`);                          // "2026-10-22"
const tags = [...'#react #angular'.matchAll(/#(\\w+)/g)].map((x) => x[1]); // all hashtags
console.log(tags);                                      // ["react", "angular"]
console.log('a1b2'.replace(/\\d/g, (n) => n * 2));      // "a2b4" — function replacer`],
      iq: [['test vs match vs matchAll?', 'test returns a boolean; match returns the first match (or all strings with g); matchAll returns an iterator of all matches with groups.'],
           ['What is ReDoS?', 'Regular-expression denial of service: crafted input causing exponential backtracking that freezes the thread.']],
      cq: [['Validate a strong password.', `const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$/; // lookaheads for each rule
console.log(strong.test('Front@2026'));                                  // true`]],
      err: ['Reusing a /g regex with test() (lastIndex state)', 'Unescaped user input in RegExp']
    })
  ),
  m('2. Functions & Scope',
    t('js-functions', 'Functions: declarations, expressions, arrows & parameters', 'B', {
      one: 'Functions are reusable callable objects defined as declarations, expressions or arrow functions, with default, rest and destructured parameters.',
      ex: `Declarations (function add() {}) are hoisted; expressions (const add = function () {}) and arrows (const add = () => {}) are not usable before definition. Arrow functions have concise syntax, implicit return and lexical this/arguments — great for callbacks, not for object methods or constructors.

Functions are first-class: store them in variables, pass them as arguments, return them. Default parameters (a = 1), rest (...args), and returning objects from arrows requires parentheses: () => ({ ok: true }).`,
      pts: ['Declarations are hoisted', 'Arrows: lexical this, no arguments, not constructible', 'Functions are first-class values', 'Wrap object literals in () for implicit return'],
      code: ['javascript', `function area(w, h = w) { return w * h; }   // declaration with default param
const greet = function (name) {              // function expression
  return 'Hi ' + name;
};
const double = (n) => n * 2;                 // arrow with implicit return
const toObj = (id) => ({ id });              // parentheses to return an object
const log = (...items) => console.log(items.length, items); // rest parameter
console.log(area(3), greet('Riya'), double(4), toObj(1)); // 9 "Hi Riya" 8 {id:1}
log('a', 'b');                               // 2 ["a","b"]`],
      iq: [['Function declaration vs expression?', 'Declarations are hoisted with their body; expressions are assigned at runtime and cannot be called before that line.'],
           ['When not to use arrow functions?', 'Object methods needing this, constructors, prototype methods, and when you need arguments.']],
      cq: [['Write a function that runs only after n calls.', `const after = (n, fn) => (...args) =>     // returns a wrapper
  --n <= 0 ? fn(...args) : undefined;     // count down, then run
const ready = after(3, () => 'go');
console.log(ready(), ready(), ready());   // undefined undefined "go"`]],
      err: ['Arrow function as an object method using this']
    }),
    L('js-hoisting-scope'),
    t('js-execution-context', 'Execution Context, Call Stack & Lexical Environment', 'I', {
      one: 'Every function call creates an execution context (with its variables, this and outer scope reference) pushed onto the call stack; scope lookup follows the lexical environment chain.',
      ex: `The global execution context is created first. Each call creates a new context with a creation phase (hoisting declarations, setting this) and an execution phase. Contexts stack: the top runs, returns, and is popped. Too deep recursion causes "Maximum call stack size exceeded".

The lexical environment stores bindings plus a reference to the outer environment where the function was DEFINED (not called) — this chain is the scope chain and the foundation of closures.`,
      pts: ['Call = new execution context', 'Call stack is LIFO', 'Scope is lexical (where defined)', 'Stack overflow from deep recursion'],
      dia: `flowchart BT
  G["Global context"] --> A["main() context"]
  A --> B["fetchUser() context"]
  B --> C["parse() context: runs now, top of stack"]`,
      code: ['javascript', `const city = 'Gurugram';          // global scope
function outer() {
  const team = 'Frontend';         // outer's environment
  function inner() {
    return team + ' @ ' + city;    // looks up: inner → outer → global
  }
  return inner();                  // inner context pushed, then popped
}
console.log(outer());              // "Frontend @ Gurugram"
function recurse(n) { return recurse(n + 1); } // no base case
// recurse(0);                     // RangeError: Maximum call stack size exceeded`],
      iq: [['What is lexical scoping?', 'Variable access is determined by where functions are written in the source, not where they are called.'],
           ['What is a stack overflow in JS?', 'The call stack exceeds its limit, usually from unbounded recursion.']],
      cq: [['Print the current call stack.', `function where() { console.trace('called from'); } // logs the stack in DevTools
function a() { where(); } a();`]],
      err: ['Thinking scope is dynamic (based on call site)']
    }),
    L('js-closures'),
    L('js-this'),
    t('js-higher-order-callbacks', 'Higher-order Functions, Callbacks & IIFE', 'B', {
      one: 'Higher-order functions take or return functions; callbacks are functions passed to be called later; an IIFE runs immediately to create a private scope.',
      ex: `map, filter, addEventListener, setTimeout and Promise.then all accept callbacks. Returning functions enables factories, currying and middleware.

Callback-based async code nests deeply ("callback hell") and handles errors awkwardly (Node's error-first callbacks) — promises and async/await replaced it. An IIFE ((() => { … })()) was the pre-module way to avoid globals and is still handy for top-level async in scripts.`,
      pts: ['Functions as arguments and return values', 'Callbacks run later', 'Callback hell → promises', 'IIFE creates private scope'],
      code: ['javascript', `function withLogging(fn) {                 // higher-order: takes a function
  return (...args) => {                      // returns a new function
    console.log('calling', fn.name, args);   // extra behaviour
    return fn(...args);                      // call original
  };
}
const add = (a, b) => a + b;
const loggedAdd = withLogging(add);          // decorated function
loggedAdd(2, 3);                             // logs, returns 5
(() => {                                     // IIFE: runs immediately
  const secret = 42;                         // not visible outside
  console.log('init', secret);
})();`],
      iq: [['What is a higher-order function?', 'A function that takes another function as an argument and/or returns a function.'],
           ['What is callback hell and how is it solved?', 'Deeply nested callbacks that are hard to read and handle errors in; solved by promises, async/await and modular functions.']],
      cq: [['Convert a callback API to a promise (promisify).', `const promisify = (fn) => (...args) =>       // wraps an error-first callback API
  new Promise((resolve, reject) =>
    fn(...args, (err, data) => (err ? reject(err) : resolve(data)))); // settle by callback result`]],
      err: ['Calling the callback instead of passing it: onClick={handle()}']
    }),
    t('js-currying-composition', 'Currying, Partial Application & Composition', 'I', {
      one: 'Currying turns f(a, b, c) into f(a)(b)(c); partial application pre-fills some arguments; composition chains functions so the output of one feeds the next.',
      ex: `Currying and partial application create specialised functions (const add10 = add(10)). bind can partially apply too. compose(f, g)(x) = f(g(x)) runs right-to-left; pipe runs left-to-right and reads naturally.

These functional techniques appear in interviews (implement curry with variable arity), Redux middleware, RxJS pipe and utility libraries.`,
      pts: ['curry: one argument at a time', 'partial: pre-fill some args', 'pipe = left-to-right composition', 'Common interview implementation'],
      code: ['javascript', `const curry = (fn) =>                         // generic curry
  function curried(...args) {                  // collects arguments
    return args.length >= fn.length            // enough arguments?
      ? fn.apply(this, args)                   // call original
      : (...more) => curried.apply(this, [...args, ...more]); // wait for more
  };
const volume = curry((l, w, h) => l * w * h);
console.log(volume(2)(3)(4), volume(2, 3)(4)); // 24 24
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x); // left-to-right
const slugify = pipe((s) => s.trim(), (s) => s.toLowerCase(), (s) => s.replaceAll(' ', '-'));
console.log(slugify(' React Hooks '));         // "react-hooks"`],
      iq: [['Currying vs partial application?', 'Currying always produces unary functions in sequence; partial application fixes some arguments and returns a function for the rest.'],
           ['compose vs pipe?', 'compose applies right-to-left (f(g(x))); pipe applies left-to-right.']],
      cq: [['Implement infinite currying sum(1)(2)(3)().', `const sum = (a) => (b) => b === undefined ? a : sum(a + b); // stop on empty call
console.log(sum(1)(2)(3)());                                // 6`]],
      err: ['Using curry on functions with default or rest params (fn.length is wrong)']
    }),
    t('js-recursion', 'Recursion', 'I', {
      one: 'A recursive function calls itself on smaller inputs until it reaches a base case; ideal for trees, nested data and divide-and-conquer.',
      ex: `Every recursion needs a base case and progress toward it. Frontend uses: rendering nested comments/menus, traversing the DOM, deep clone/flatten, file explorers, JSON tree viewers.

Each call adds a stack frame; very deep inputs can overflow the stack, so convert to an iterative approach with an explicit stack/queue for unbounded depth. JS engines (except Safari) do not implement tail-call optimisation.`,
      pts: ['Base case + smaller subproblem', 'Natural for trees and nested data', 'Deep inputs can overflow the stack', 'Iterative version with explicit stack'],
      flow: ['Call with input', 'Base case? return', 'Else split into smaller input', 'Recursive call', 'Combine results'],
      code: ['javascript', `const menu = [{ label: 'Learn', children: [{ label: 'React', children: [] }] }, { label: 'Mock', children: [] }];
function countItems(items) {                 // recursive tree walk
  return items.reduce(                        // sum over this level
    (n, item) => n + 1 + countItems(item.children), // 1 for item + its subtree
    0);                                       // base: empty array → 0
}
console.log(countItems(menu));                // 3
function flatten(arr) {                       // deep flatten
  return arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x) : x), []); // recurse on arrays
}
console.log(flatten([1, [2, [3, [4]]]]));     // [1,2,3,4]`],
      iq: [['Every recursive function needs?', 'A base case that stops recursion and a recursive step that moves toward it.'],
           ['How to avoid stack overflow with recursion?', 'Use iteration with an explicit stack/queue, trampolines, or limit depth.']],
      cq: [['Render nested comments recursively in React.', `function Comments({ list }) {                              // recursive component
  return <ul>{list.map((c) => (
    <li key={c.id}>{c.text}{c.replies?.length > 0 && <Comments list={c.replies} />}</li> // recurse on replies
  ))}</ul>;
}`]],
      err: ['Missing base case → infinite recursion']
    }),
    t('js-pure-functions-immutability', 'Pure Functions, Side Effects & Immutability', 'I', {
      one: 'A pure function returns the same output for the same input and has no side effects; immutability means never changing existing data but creating new copies.',
      ex: `Side effects include mutating arguments, network calls, DOM changes, logging, timers and randomness. Keeping core logic pure makes it predictable, testable and cache-friendly (memoisation).

React render functions and Redux reducers must be pure. Immutable updates create new references, which lets frameworks detect changes cheaply with ===. Tools: spread, map/filter, structuredClone, Immer.`,
      pts: ['Same input → same output', 'No external mutation or I/O', 'Reducers and render must be pure', 'New references signal change'],
      code: ['javascript', `// ❌ impure: mutates the argument and depends on external state
let taxRate = 0.18;
function addTaxBad(cart) { cart.total *= 1 + taxRate; return cart; }
// ✅ pure: no mutation, all inputs are parameters
function addTax(cart, rate) {
  return { ...cart, total: cart.total * (1 + rate) }; // new object
}
const cart = { total: 100 };
const taxed = addTax(cart, 0.18);
console.log(cart.total, taxed.total, cart === taxed); // 100 118 false`],
      iq: [['Why must React components be pure during render?', 'React may render multiple times, pause or discard renders; side effects in render cause bugs and inconsistent UI.'],
           ['Benefits of immutability?', 'Predictable state, easy change detection by reference, undo/redo, time-travel debugging and safer concurrency.']],
      cq: [['Immutably update a nested property.', `const next = { ...state, user: { ...state.user, address: { ...state.user.address, city: 'Pune' } } }; // copy each level`]],
      err: ['Mutating props or state then wondering why the UI did not update']
    }),
    t('js-memoization', 'Memoization & Caching Functions', 'I', {
      one: 'Memoization caches a function’s results by its arguments so repeated calls with the same input return instantly.',
      ex: `Works only for pure functions. Use a Map keyed by the argument (or a serialised key for multiple args). Unbounded caches leak memory — add size limits (LRU) or WeakMap keyed by objects.

Frontend uses: expensive selectors (reselect), React useMemo/React Compiler, recursive algorithms (fibonacci), API response caching. Interviewers often ask you to implement memoize and an LRU cache.`,
      pts: ['Only for pure functions', 'Map keyed by arguments', 'Bound cache size (LRU)', 'WeakMap for object keys'],
      code: ['javascript', `function memoize(fn) {
  const cache = new Map();                      // key → result
  return function (...args) {
    const key = JSON.stringify(args);           // simple key for primitive args
    if (cache.has(key)) return cache.get(key);  // hit
    const result = fn.apply(this, args);        // miss: compute
    cache.set(key, result);                     // store
    return result;
  };
}
const fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2))); // memoized recursion
console.log(fib(80));                           // instant instead of exponential time`],
      iq: [['When is memoization harmful?', 'When results are cheap to compute, inputs rarely repeat, or the cache grows unbounded and leaks memory.']],
      cq: [['Implement an LRU cache with Map.', `class LRU {
  constructor(limit) { this.limit = limit; this.map = new Map(); } // Map keeps insertion order
  get(k) {
    if (!this.map.has(k)) return undefined;   // miss
    const v = this.map.get(k);                // read
    this.map.delete(k); this.map.set(k, v);   // move to most-recent position
    return v;
  }
  set(k, v) {
    this.map.delete(k); this.map.set(k, v);   // insert as most recent
    if (this.map.size > this.limit) this.map.delete(this.map.keys().next().value); // evict oldest
  }
}`]],
      err: ['Memoizing impure functions']
    }),
    L('js-debounce-throttle')
  ),
  m('3. Objects, Classes & OOP',
    L('js-prototypes'),
    t('js-classes', 'ES6 Classes in Depth (fields, private, static, getters)', 'I', {
      one: 'Classes provide constructor functions with methods, public/private fields (#), static members, getters/setters and inheritance via extends/super.',
      ex: `Class bodies run in strict mode and classes must be called with new. Public fields (count = 0) are created per instance; arrow-function fields bind this automatically (useful for event handlers) but are not on the prototype. #private fields and methods are truly inaccessible outside the class; static blocks run once at class evaluation.

Getters/setters expose computed or validated properties. instanceof checks the prototype chain. Prefer composition over deep inheritance trees.`,
      pts: ['#private fields are hard-private', 'static members on the class', 'Arrow fields auto-bind this', 'super() before using this in derived constructors'],
      code: ['javascript', `class Account {
  static #count = 0;                       // private static counter
  #balance = 0;                            // private instance field
  owner;                                   // public field
  constructor(owner) { this.owner = owner; Account.#count++; } // runs on new
  get balance() { return this.#balance; }  // read-only accessor
  deposit = (amt) => {                     // arrow field: 'this' bound to instance
    if (amt <= 0) throw new RangeError('Invalid amount'); // validation
    this.#balance += amt;
    return this;                           // enable chaining
  };
  static get count() { return Account.#count; } // static getter
}
class Savings extends Account {
  constructor(owner, rate) { super(owner); this.rate = rate; } // super first
}
const s = new Savings('Riya', 0.07);
s.deposit(500).deposit(250);
console.log(s.balance, Account.count, s instanceof Account); // 750 1 true`],
      iq: [['#private vs TypeScript private?', '#private is enforced at runtime by the language; TS private is compile-time only.'],
           ['Why must super() be called before this in a subclass?', 'The parent constructor creates and initialises the object; this is uninitialised until then.']],
      cq: [['Implement an EventEmitter class.', `class Emitter {
  #handlers = new Map();                                   // event → Set of callbacks
  on(evt, fn) {
    if (!this.#handlers.has(evt)) this.#handlers.set(evt, new Set()); // create set
    this.#handlers.get(evt).add(fn);                       // register
    return () => this.#handlers.get(evt).delete(fn);       // return unsubscribe
  }
  emit(evt, ...args) { this.#handlers.get(evt)?.forEach((fn) => fn(...args)); } // notify all
}`]],
      err: ['Deep inheritance hierarchies', 'Forgetting new (TypeError)']
    }),
    t('js-property-descriptors', 'Property Descriptors, Getters & Setters', 'A', {
      one: 'Each property has a descriptor (value, writable, enumerable, configurable or get/set) that controls how it behaves; Object.defineProperty sets them.',
      ex: `Data descriptors have value + writable; accessor descriptors have get/set. enumerable controls appearance in for…in, Object.keys and JSON.stringify; configurable controls deletion and redefinition. Defaults via defineProperty are all false.

Vue 2's reactivity used getters/setters through defineProperty; Vue 3 switched to Proxy. Useful for computed properties, read-only constants and lazy values.`,
      pts: ['value/writable/enumerable/configurable', 'get/set accessors', 'defineProperty defaults to false', 'Object.getOwnPropertyDescriptor to inspect'],
      code: ['javascript', `const user = { first: 'Riya', last: 'Sharma' };
Object.defineProperty(user, 'fullName', {     // accessor property
  get() { return this.first + ' ' + this.last; },          // computed on read
  set(v) { [this.first, this.last] = v.split(' '); },      // parse on write
  enumerable: false                            // hide from keys/JSON
});
Object.defineProperty(user, 'id', { value: 7, writable: false }); // read-only data property
user.fullName = 'Aman Verma';                  // calls setter
console.log(user.first, user.fullName, Object.keys(user)); // "Aman" "Aman Verma" ["first","last"]
console.log(Object.getOwnPropertyDescriptor(user, 'id')); // { value: 7, writable: false, ... }`],
      iq: [['What does enumerable: false do?', 'Hides the property from for…in, Object.keys and JSON.stringify, while it can still be accessed directly.']],
      cq: [['Lazy getter that computes once.', `const obj = {
  get heavy() {                                          // first access
    const value = expensiveCompute();                    // compute once
    Object.defineProperty(this, 'heavy', { value });     // replace getter with a plain value
    return value;
  }
};`]],
      err: ['Expecting defineProperty properties to be enumerable/writable by default']
    }),
    t('js-symbols-iterators-generators', 'Symbols, Iterators & Generators', 'A', {
      one: 'Symbols are unique property keys; the iterator protocol (Symbol.iterator + next()) powers for…of and spread; generators (function*) produce iterators lazily with yield.',
      ex: `Symbol('id') is always unique — good for hidden metadata keys. Well-known symbols customise behaviour: Symbol.iterator, Symbol.asyncIterator, Symbol.toPrimitive.

An iterable has a [Symbol.iterator]() method returning { next() { return { value, done } } }. Generators simplify that: yield pauses and resumes. They are lazy (infinite sequences), and power pagination helpers, sagas (redux-saga) and async iteration (async function* with for await). ES2025 iterator helpers add map/filter/take on iterators.`,
      pts: ['Symbols are unique keys', 'Iterable = has [Symbol.iterator]', 'Generators pause with yield', 'Lazy and composable sequences'],
      code: ['javascript', `function* idGenerator(prefix) {         // generator function
  let i = 1;
  while (true) yield prefix + i++;       // infinite, lazily produced
}
const ids = idGenerator('user-');
console.log(ids.next().value, ids.next().value); // "user-1" "user-2"
class Range {                            // custom iterable
  constructor(from, to) { this.from = from; this.to = to; }
  *[Symbol.iterator]() {                 // generator method as iterator
    for (let n = this.from; n <= this.to; n++) yield n;
  }
}
console.log([...new Range(1, 5)]);       // [1,2,3,4,5] — spread uses the iterator
const hidden = Symbol('meta');           // unique key
const obj = { [hidden]: 'secret' };      // not in Object.keys / JSON`],
      iq: [['What makes an object iterable?', 'A [Symbol.iterator] method returning an iterator with next() → { value, done }.'],
           ['Why use generators?', 'To produce values lazily, model infinite sequences, pause/resume logic, and implement custom iteration simply.']],
      cq: [['Paginate an API with an async generator.', `async function* fetchAll(url) {              // async generator
  let next = url;
  while (next) {
    const res = await fetch(next).then((r) => r.json()); // one page
    yield* res.items;                          // emit each item
    next = res.nextPageUrl;                    // follow cursor
  }
}
for await (const item of fetchAll('/api/terms')) console.log(item); // consume lazily`]],
      err: ['Spreading an infinite generator']
    }),
    t('js-map-set-weak', 'Map, Set, WeakMap, WeakSet & WeakRef', 'I', {
      one: 'Map stores key–value pairs with any key type; Set stores unique values; WeakMap/WeakSet hold object keys weakly so they can be garbage-collected.',
      ex: `Map preserves insertion order, has size, fast add/delete and safe keys (no prototype collisions) — better than objects for dynamic dictionaries. Set deduplicates and (ES2025) supports union, intersection, difference.

WeakMap keys must be objects and do not prevent garbage collection — ideal for caching data about DOM nodes or private data per object. They are not iterable. WeakRef and FinalizationRegistry offer weak references for advanced caches (use rarely).`,
      pts: ['Map: any key type, ordered, size', 'Set: unique values + set operations', 'WeakMap: object keys, GC-friendly', 'Weak collections are not iterable'],
      code: ['javascript', `const visits = new Map();                    // dictionary with any keys
visits.set('/home', 3).set('/learn', 5);     // chainable set
console.log(visits.get('/learn'), visits.size); // 5 2
const tags = new Set(['react', 'js', 'react']); // duplicates removed
console.log(tags.has('js'), [...tags]);      // true ["react","js"]
const meta = new WeakMap();                  // object → data, no leaks
const btn = document.createElement('button');
meta.set(btn, { clicks: 0 });                // attach data to a DOM node
// when btn is removed and unreferenced, its entry can be garbage-collected`],
      iq: [['Map vs Object?', 'Map accepts any key type, keeps insertion order, has size, is optimised for frequent add/remove and has no prototype key collisions.'],
           ['Why can’t you iterate a WeakMap?', 'Entries may disappear at any time due to garbage collection, so iteration would be non-deterministic.']],
      cq: [['Group items by category using Map.', `const byCat = Map.groupBy(products, (p) => p.category); // ES2024: Map of arrays
for (const [cat, items] of byCat) console.log(cat, items.length); // iterate in insertion order`]],
      err: ['Using objects as hash maps with user keys like "__proto__"']
    }),
    t('js-proxy-reflect', 'Proxy & Reflect', 'A', {
      one: 'A Proxy wraps an object and intercepts operations (get, set, has, deleteProperty, apply) via traps; Reflect provides default implementations of those operations.',
      ex: `Use cases: validation, logging, default values, negative array indexes, change tracking and reactivity (Vue 3, MobX and Immer use Proxies). Inside traps, call Reflect.get/set to perform the default behaviour correctly (including receivers and getters).

Proxies add overhead, so avoid them in hot paths, and remember identity: proxy !== target.`,
      pts: ['Traps intercept operations', 'Reflect does the default behaviour', 'Powers Vue 3 reactivity and Immer', 'Performance overhead'],
      flow: ['Code reads proxy.prop', 'get trap runs', 'Custom logic (track, validate)', 'Reflect.get returns real value'],
      code: ['javascript', `function reactive(target, onChange) {
  return new Proxy(target, {
    get(obj, key, receiver) {                  // intercept reads
      return Reflect.get(obj, key, receiver);  // default behaviour
    },
    set(obj, key, value, receiver) {           // intercept writes
      if (key === 'age' && value < 0) throw new RangeError('age must be ≥ 0'); // validation
      const ok = Reflect.set(obj, key, value, receiver); // perform the write
      onChange(key, value);                    // notify (like a UI re-render)
      return ok;                               // must return true on success
    }
  });
}
const state = reactive({ age: 30 }, (k, v) => console.log('changed', k, v));
state.age = 31;                                // logs "changed age 31"`],
      iq: [['How does Vue 3 reactivity work?', 'reactive() returns a Proxy; get traps track which effects read a property and set traps trigger those effects.'],
           ['Why use Reflect inside traps?', 'It forwards the operation with correct semantics (receiver, getters/setters) and returns a status boolean.']],
      cq: [['Negative array indexes with Proxy.', `const arr = new Proxy([1, 2, 3], {
  get: (t, k, r) => Reflect.get(t, typeof k === 'string' && k < 0 ? t.length + Number(k) : k, r) // map -1 to last
});
console.log(arr[-1]);                            // 3`]],
      err: ['Forgetting to return true from set trap (TypeError in strict mode)']
    }),
    t('js-oop-design-patterns', 'OOP Principles & Design Patterns in JS', 'I', {
      one: 'Encapsulation, inheritance, polymorphism and composition, plus common patterns: module, singleton, factory, observer/pub-sub, strategy, decorator and adapter.',
      ex: `JS supports both OOP and functional styles. Favour composition (combining small objects/functions) over deep inheritance. Patterns you will meet in frontend code: Observer (event emitters, RxJS), Pub/Sub (message buses), Singleton (a single API client/store), Factory (creating components/services), Strategy (pluggable validators/payment methods), Decorator (HOCs, wrappers), Adapter (normalising third-party APIs), Facade (simplified service layers).`,
      pts: ['Composition over inheritance', 'Observer / pub-sub for events', 'Strategy for swappable logic', 'Adapter/Facade around third-party APIs'],
      code: ['javascript', `// Strategy: swap validation rules without if/else chains
const validators = {
  email: (v) => /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(v), // email rule
  phone: (v) => /^\\d{10}$/.test(v),                       // phone rule
  required: (v) => v.trim() !== ''                         // non-empty rule
};
function validate(value, rules) {                          // context uses strategies
  return rules.filter((r) => !validators[r](value));        // failed rule names
}
console.log(validate('abc', ['required', 'email']));        // ["email"]
// Singleton via ES module: the module is evaluated once
export const api = { baseUrl: '/api', get: (p) => fetch('/api' + p) }; // shared instance`],
      iq: [['Composition vs inheritance?', 'Composition builds behaviour by combining objects/functions (has-a); inheritance extends classes (is-a). Composition is more flexible and less coupled.'],
           ['Observer vs Pub/Sub?', 'Observer: subjects notify observers directly. Pub/Sub: publishers and subscribers communicate through a broker/channel and do not know each other.']],
      cq: [['Simple pub/sub bus.', `const bus = { topics: {},
  subscribe(t, fn) { (this.topics[t] ||= []).push(fn); return () => (this.topics[t] = this.topics[t].filter((f) => f !== fn)); }, // add + unsubscribe
  publish(t, data) { (this.topics[t] || []).forEach((fn) => fn(data)); } // notify all
};
const off = bus.subscribe('login', (u) => console.log('hello', u)); bus.publish('login', 'Riya'); off();`]],
      err: ['Overengineering small apps with patterns']
    })
  ),
  m('4. Asynchronous JavaScript',
    L('js-event-loop'),
    t('js-callbacks-to-promises', 'From Callbacks to Promises', 'B', {
      one: 'Async work first used callbacks; promises represent a future result with chaining and centralised error handling, solving callback hell and inversion of control.',
      ex: `With callbacks you hand control to another function and trust it to call you once, with errors handled separately at every level. A promise is an object you hold: it settles once (fulfilled or rejected), then handlers run as microtasks; errors propagate down the chain to a single catch.

Create promises with new Promise((resolve, reject) => …) only when wrapping callback APIs; otherwise return existing promises (fetch, async functions).`,
      pts: ['Callbacks → nesting and inversion of control', 'Promises settle exactly once', 'Errors propagate to catch', 'Wrap legacy callbacks with new Promise'],
      code: ['javascript', `// Callback style (nested)
getUser(1, (err, user) => {
  if (err) return console.error(err);           // handle error at every level
  getPosts(user.id, (err2, posts) => {
    if (err2) return console.error(err2);
    console.log(posts);
  });
});
// Promise style (flat)
getUserP(1)                                     // returns a promise
  .then((user) => getPostsP(user.id))           // return next promise → chain
  .then((posts) => console.log(posts))          // final value
  .catch((err) => console.error(err));          // one place for all errors`],
      iq: [['What is inversion of control with callbacks?', 'You give your continuation to third-party code that may call it zero, multiple times or at the wrong time.']],
      cq: [['Wrap setTimeout in a promise.', `const delay = (ms, value) => new Promise((res) => setTimeout(() => res(value), ms)); // resolves after ms
delay(500, 'ready').then(console.log);           // "ready" after 0.5s`]],
      err: ['Creating new Promise around code that already returns a promise (promise constructor anti-pattern)']
    }),
    L('js-promises-async'),
    t('js-timers-scheduling', 'Timers & Scheduling: setTimeout, setInterval, rAF, requestIdleCallback', 'I', {
      one: 'APIs to schedule work later: setTimeout (once), setInterval (repeat), requestAnimationFrame (before next paint), requestIdleCallback (when idle) and scheduler.postTask/yield.',
      ex: `Timers are minimum delays, not exact — a busy main thread delays them, and background tabs throttle them heavily. Prefer recursive setTimeout over setInterval for polling so calls do not overlap. Always clear timers in cleanup functions.

requestAnimationFrame syncs visual updates with the display refresh (60/120Hz) and pauses in background tabs. requestIdleCallback runs low-priority work during idle time. scheduler.yield() (Chrome) breaks long tasks to improve INP.`,
      pts: ['Delays are minimums, not guarantees', 'Clear timers on cleanup', 'rAF for animations', 'Recursive setTimeout for safe polling'],
      code: ['javascript', `const id = setTimeout(() => console.log('once'), 1000); // run once after ≥1s
clearTimeout(id);                                        // cancel it
function poll() {                                        // safe polling
  fetch('/api/status').finally(() => setTimeout(poll, 5000)); // schedule next only after finishing
}
let x = 0;
function frame() {                                       // animation loop
  x += 2;                                                // update position
  box.style.transform = \`translateX(\${x}px)\`;          // apply before paint
  if (x < 300) requestAnimationFrame(frame);             // continue next frame
}
requestAnimationFrame(frame);                            // start
requestIdleCallback((deadline) => {                      // low-priority work
  while (deadline.timeRemaining() > 1) doBackgroundTask(); // use idle time only
});`],
      iq: [['setInterval vs recursive setTimeout?', 'setInterval fires regardless of whether the previous work finished; recursive setTimeout schedules the next run only after the current one completes.'],
           ['Why use requestAnimationFrame for animation?', 'It runs right before paint at the display refresh rate and pauses when the tab is hidden, giving smooth and efficient animation.']],
      cq: [['Countdown timer that stays accurate.', `function countdown(endTime, onTick) {          // endTime = timestamp
  const tick = () => {
    const left = Math.max(0, endTime - Date.now()); // compute from the clock, not counts
    onTick(Math.ceil(left / 1000));               // seconds remaining
    if (left > 0) setTimeout(tick, 250);          // re-check frequently
  };
  tick();
}`]],
      err: ['Counting interval ticks for time (drifts)', 'Forgetting clearInterval on unmount']
    }),
    t('js-async-patterns', 'Async Patterns: parallel, sequential, race, concurrency limits', 'A', {
      one: 'Techniques for orchestrating multiple async operations: sequential awaits, Promise.all parallelism, race/any for timeouts, and pools to limit concurrency.',
      ex: `Sequential (await in a for…of) when each step depends on the previous; Promise.all for independent requests; Promise.allSettled when partial failures are acceptable; Promise.race with a timeout promise or AbortSignal.timeout; Promise.any for the fastest successful mirror.

Unbounded parallelism (1,000 fetches at once) overwhelms servers and browsers — use a concurrency pool. Async iteration (for await) processes streams. Always handle cancellation with AbortController.`,
      pts: ['Independent work → Promise.all', 'Dependent work → sequential awaits', 'Timeouts with race/AbortSignal', 'Limit concurrency with a pool'],
      code: ['javascript', `async function mapLimit(items, limit, worker) {  // run at most 'limit' tasks at once
  const results = new Array(items.length);       // keep order
  let next = 0;                                   // shared index
  async function run() {                          // one lane
    while (next < items.length) {
      const i = next++;                           // claim an item
      results[i] = await worker(items[i]);        // process it
    }
  }
  await Promise.all(Array.from({ length: limit }, run)); // start 'limit' lanes
  return results;
}
const pages = await mapLimit([1, 2, 3, 4, 5, 6], 2, (p) => fetch('/api?page=' + p).then((r) => r.json())); // 2 at a time`],
      iq: [['How do you add a timeout to a fetch?', 'Pass signal: AbortSignal.timeout(ms), or race the fetch against a rejecting timer promise.'],
           ['Promise.any vs Promise.race?', 'race settles with the first settled promise (even a rejection); any resolves with the first fulfilled and rejects only if all reject (AggregateError).']],
      cq: [['Run async tasks strictly in sequence.', `for (const id of ids) {                 // one after another
  await save(id);                       // waits before the next iteration
}`]],
      err: ['await inside map (creates parallel work without awaiting)', 'Unbounded parallel requests']
    }),
    t('js-abort-controller', 'AbortController & Cancellation', 'I', {
      one: 'AbortController creates a signal you pass to fetch, event listeners and your own async functions so they can be cancelled.',
      ex: `controller.abort(reason) aborts every operation using controller.signal: fetch rejects with an AbortError, listeners added with { signal } are removed. AbortSignal.timeout(ms) auto-aborts; AbortSignal.any([s1, s2]) combines signals.

Use it to cancel stale search requests, avoid setting state after unmount (React effect cleanup), and implement Stop buttons for streaming AI responses. Check signal.aborted or listen to its abort event in custom async code.`,
      pts: ['One controller cancels many operations', 'fetch rejects with AbortError', 'AbortSignal.timeout(ms)', 'Removes listeners too'],
      code: ['javascript', `let controller;                                    // current request controller
async function search(q) {
  controller?.abort();                             // cancel the previous search
  controller = new AbortController();              // new controller for this query
  try {
    const res = await fetch('/api/search?q=' + encodeURIComponent(q), {
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]) // manual OR 5s timeout
    });
    return await res.json();                       // results for the latest query only
  } catch (e) {
    if (e.name === 'AbortError') return null;      // expected: newer query started
    throw e;                                       // real errors bubble up
  }
}
const ac = new AbortController();
window.addEventListener('resize', onResize, { signal: ac.signal }); // listener tied to signal
ac.abort();                                        // removes the listener`],
      iq: [['How do you prevent race conditions in search-as-you-type?', 'Abort the previous request (AbortController) or ignore results that are not for the latest query.']],
      cq: [['Make your own async function cancellable.', `function wait(ms, { signal } = {}) {               // supports cancellation
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(signal.reason);   // already aborted
    const id = setTimeout(resolve, ms);                  // normal path
    signal?.addEventListener('abort', () => { clearTimeout(id); reject(signal.reason); }, { once: true }); // cancel path
  });
}`]],
      err: ['Treating AbortError as a real failure in UI']
    }),
    t('js-error-handling', 'Error Handling: try/catch, custom errors, global handlers', 'I', {
      one: 'Handle failures with try/catch/finally, throw Error subclasses with context, and catch unexpected errors globally (error and unhandledrejection events).',
      ex: `Built-in errors: Error, TypeError, ReferenceError, RangeError, SyntaxError, AggregateError. Create custom errors (class ApiError extends Error) with extra fields like status, and use the cause option to chain errors.

Async errors need try/catch around await or .catch. Errors thrown in setTimeout callbacks are not caught by an outer try. Report global errors to monitoring (Sentry) via window.onerror and unhandledrejection; in React use error boundaries.`,
      pts: ['Throw Error objects, never strings', 'Custom error classes with context', 'Error cause for chaining', 'Global handlers for reporting'],
      code: ['javascript', `class ApiError extends Error {                       // custom error type
  constructor(message, status, options) {
    super(message, options);                         // options.cause keeps the original error
    this.name = 'ApiError';                          // readable name
    this.status = status;                            // extra context
  }
}
async function getJSON(url) {
  try {
    const res = await fetch(url);                    // may reject on network failure
    if (!res.ok) throw new ApiError('Request failed', res.status); // HTTP error
    return await res.json();
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null; // handle expected case
    throw new Error('Could not load ' + url, { cause: err }); // wrap and rethrow
  } finally {
    console.log('request finished');                 // always runs
  }
}
window.addEventListener('unhandledrejection', (e) => reportToMonitoring(e.reason)); // catch-all`],
      iq: [['Why throw Error objects instead of strings?', 'Error objects carry a stack trace, name and message, and work with instanceof.'],
           ['Can try/catch catch errors in a setTimeout callback?', 'No — the callback runs later on a different stack; handle errors inside it.']],
      cq: [['Retry only on network errors.', `try { return await fetchData(); }
catch (e) { if (e instanceof TypeError) return await fetchData(); throw e; } // fetch network failures are TypeErrors`]],
      err: ['Swallowing errors with empty catch blocks', 'Throwing strings']
    })
  ),
  m('5. JavaScript in the Browser',
    t('js-dom-selection-manipulation', 'DOM Selection & Manipulation', 'B', {
      one: 'Find elements with querySelector/querySelectorAll/getElementById and change them with textContent, classList, attributes, append, remove and replaceChildren.',
      ex: `querySelector returns the first match (or null); querySelectorAll returns a static NodeList (supports forEach). getElementsByClassName returns a live HTMLCollection.

Use textContent for text (safe), innerHTML only with trusted/sanitised HTML. Create nodes with document.createElement, insert with append/prepend/before/after/insertAdjacentHTML, remove with el.remove(). Batch changes (DocumentFragment, replaceChildren) to avoid repeated reflows. classList.add/remove/toggle and dataset manage state.`,
      pts: ['querySelector(All) with CSS selectors', 'textContent over innerHTML', 'classList and dataset for state', 'Batch DOM writes'],
      code: ['javascript', `const list = document.querySelector('#todo-list');      // first match or null
const items = ['Learn DOM', 'Build app'];
const frag = document.createDocumentFragment();         // off-DOM container
for (const text of items) {
  const li = document.createElement('li');              // new element
  li.textContent = text;                                // safe text
  li.classList.add('todo');                             // add a class
  li.dataset.done = 'false';                            // data-done attribute
  frag.append(li);                                      // add to fragment
}
list.replaceChildren(frag);                             // one DOM update
list.firstElementChild.classList.toggle('done');        // toggle a class
document.querySelectorAll('.todo').forEach((el) => el.setAttribute('role', 'listitem')); // update all`],
      iq: [['NodeList vs HTMLCollection?', 'querySelectorAll returns a static NodeList; getElementsBy* return live HTMLCollections that update with the DOM.'],
           ['Why is innerHTML risky?', 'It parses strings as HTML; inserting user input enables XSS. It also destroys existing nodes and listeners.']],
      cq: [['Remove all children efficiently.', `el.replaceChildren();          // clears all child nodes in one call`]],
      err: ['innerHTML += in loops (slow + XSS)', 'Not checking querySelector for null']
    }),
    t('js-events', 'Events: listeners, options, propagation & custom events', 'B', {
      one: 'addEventListener registers handlers for events like click, input, submit, keydown; options (once, passive, capture, signal) control behaviour.',
      ex: `The event object provides target, currentTarget, type, key, preventDefault() and stopPropagation(). passive: true on scroll/touch listeners tells the browser you won't call preventDefault, keeping scrolling smooth. once: true auto-removes the listener.

Common events: click, input (every change), change (committed change), submit, keydown (use event.key), focus/blur (focusin/focusout bubble), pointerdown/move/up (unified mouse/touch/pen), DOMContentLoaded, load, visibilitychange. Dispatch custom events with new CustomEvent('name', { detail }).`,
      pts: ['Use event.key, not keyCode', 'passive for scroll/touch', 'Pointer events unify input types', 'CustomEvent for component communication'],
      code: ['javascript', `const input = document.querySelector('#search');
input.addEventListener('input', (e) => {               // fires on every keystroke
  console.log(e.target.value);                         // current text
});
document.addEventListener('keydown', (e) => {          // global shortcut
  if (e.key === '/' && document.activeElement !== input) {
    e.preventDefault();                                // stop typing "/" elsewhere
    input.focus();                                     // focus search
  }
});
window.addEventListener('scroll', onScroll, { passive: true }); // smooth scrolling
btn.addEventListener('click', () => console.log('first click only'), { once: true }); // auto-removed
el.dispatchEvent(new CustomEvent('cart:add', { detail: { id: 7 }, bubbles: true })); // custom event`],
      iq: [['input vs change events?', 'input fires on every value change; change fires when the change is committed (blur for text, selection for select/checkbox).'],
           ['What does passive: true do?', 'Promises the handler will not call preventDefault, allowing the browser to scroll immediately.']],
      cq: [['Detect Ctrl/Cmd + K shortcut.', `document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); } // cross-platform
});`]],
      err: ['Using keyCode (deprecated)', 'Adding listeners repeatedly without removing']
    }),
    t('js-bom', 'Browser Object Model: window, location, history, navigator', 'B', {
      one: 'Browser globals beyond the DOM: window (global object, size, scroll), location (URL), history (navigation stack), navigator (device/browser info), screen and alert/confirm/prompt.',
      ex: `location.href, pathname, search and hash read the URL; location.assign() navigates, location.replace() navigates without a history entry, location.reload() reloads. history.pushState/replaceState change the URL without reloading (SPA routing) and popstate fires on back/forward.

navigator.language, onLine, clipboard, geolocation, userAgentData (prefer feature detection over user-agent sniffing). window.innerWidth, scrollY, matchMedia, open(). Avoid alert/confirm in modern UI — they block the thread.`,
      pts: ['location reads/changes URL', 'history.pushState for SPA routing', 'navigator for capabilities', 'Feature detection > UA sniffing'],
      code: ['javascript', `console.log(location.pathname, location.search);     // "/learn" "?tab=code"
const params = new URLSearchParams(location.search); // parse query string
console.log(params.get('tab'));                      // "code"
history.pushState({ tab: 'quiz' }, '', '?tab=quiz'); // change URL without reload
window.addEventListener('popstate', (e) => {         // back/forward pressed
  console.log('state', e.state);                     // restore UI from state
});
console.log(navigator.language, navigator.onLine);   // "en-IN" true
window.addEventListener('offline', () => console.log('You are offline')); // connectivity`],
      iq: [['location.assign vs replace?', 'assign adds a history entry; replace navigates without one (back button skips it).'],
           ['How do SPAs change URLs without reloading?', 'history.pushState/replaceState (or the Navigation API) plus listening to popstate.']],
      cq: [['Update a query param without reload.', `const url = new URL(location.href);         // mutable URL object
url.searchParams.set('page', '2');          // set param
history.replaceState(null, '', url);        // update address bar silently`]],
      err: ['User-agent sniffing for features']
    }),
    t('js-forms-js', 'Working with Forms in JavaScript', 'B', {
      one: 'Read and control forms with FormData, form.elements, input events, validation APIs and submit handling.',
      ex: `new FormData(form) captures all named fields (including files); Object.fromEntries(formData) converts to an object (multi-value fields need getAll). form.elements.email accesses a control by name. Reset with form.reset().

Handle submit (not button click) so Enter key works. Show validation with the Constraint Validation API. For large forms, libraries (React Hook Form, Angular reactive forms) manage state and validation.`,
      pts: ['Listen to submit, not click', 'FormData for all fields + files', 'getAll for checkboxes/multi-select', 'Validate before sending'],
      code: ['javascript', `const form = document.querySelector('#profile');
form.addEventListener('submit', async (e) => {          // Enter key also triggers this
  e.preventDefault();                                   // no page reload
  const fd = new FormData(form);                        // all named fields
  const data = Object.fromEntries(fd);                  // single values
  data.skills = fd.getAll('skills');                    // multiple checkboxes
  if (!form.checkValidity()) return form.reportValidity(); // show native errors
  const res = await fetch('/api/profile', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)                          // send JSON
  });
  if (res.ok) form.reset();                             // clear on success
});`],
      iq: [['Why listen to submit instead of button click?', 'Submit fires for Enter key, button clicks and form.requestSubmit(), and runs native validation.']],
      cq: [['Warn before leaving with unsaved changes.', `let dirty = false;
form.addEventListener('input', () => (dirty = true));              // mark changed
window.addEventListener('beforeunload', (e) => { if (dirty) e.preventDefault(); }); // browser confirm`]],
      err: ['Reading values with many querySelector calls instead of FormData']
    })
  ),
  m('6. Modules, Runtime & Memory',
    t('js-modules', 'ES Modules vs CommonJS, import/export & dynamic import', 'I', {
      one: 'ES Modules (import/export) are the standard module system with static structure, live bindings and async loading; CommonJS (require/module.exports) is Node’s legacy system.',
      ex: `Named exports (export const a) and default export (export default fn). Imports are hoisted, static and read-only live bindings — enabling tree shaking. Modules run in strict mode once per URL and have their own scope.

Dynamic import('./heavy.js') returns a promise and creates a code-split chunk. Top-level await works in modules. CommonJS loads synchronously at runtime; interop issues arise when mixing them (default export wrapping). package.json "type": "module" makes .js files ESM in Node.`,
      pts: ['Static imports enable tree shaking', 'Modules run once (singletons)', 'import() for lazy loading', 'Top-level await in ESM'],
      code: ['javascript', `// math.js
export const add = (a, b) => a + b;              // named export
export default function multiply(a, b) {         // default export
  return a * b;
}
// app.js
import multiply, { add } from './math.js';       // default + named import
import * as utils from './utils.js';             // namespace import
console.log(add(2, 3), multiply(2, 3));
button.addEventListener('click', async () => {
  const { renderChart } = await import('./chart.js'); // loaded only when needed
  renderChart();
});
const config = await fetch('/config.json').then((r) => r.json()); // top-level await (ESM only)`],
      iq: [['ESM vs CommonJS?', 'ESM is static, async, has live bindings and supports tree shaking; CommonJS is dynamic, synchronous, copies values and is Node-specific.'],
           ['Named vs default exports?', 'Named exports must be imported by name (better refactoring/tree shaking); default exports can be imported under any name.']],
      cq: [['Re-export from an index (barrel) file.', `export { Button } from './Button.js';   // re-export named
export { default as Card } from './Card.js'; // re-export default as named`]],
      err: ['Huge barrel files that hurt tree shaking', 'Mixing require and import in the same file']
    }),
    t('js-strict-mode', 'Strict Mode', 'B', {
      one: '"use strict" opts into a safer JavaScript variant that turns silent mistakes into errors; modules and classes are strict automatically.',
      ex: `In strict mode: assigning to undeclared variables throws (no accidental globals), this is undefined in plain function calls, writing to read-only properties throws, duplicate parameter names are errors, with is forbidden, and octal literals are disallowed.

Since ES modules and class bodies are always strict, modern bundled code is already strict.`,
      pts: ['No accidental globals', 'this is undefined in plain calls', 'Silent failures become errors', 'Modules/classes are always strict'],
      code: ['javascript', `'use strict';                        // enable for this script/function
function demo() {
  // total = 10;                     // ReferenceError: total is not defined (no implicit global)
  console.log(this);                 // undefined (not window)
}
demo();
const frozen = Object.freeze({ a: 1 });
// frozen.a = 2;                     // TypeError in strict mode (silently ignored otherwise)`],
      iq: [['Name three behaviours changed by strict mode.', 'Assigning undeclared variables throws, this is undefined in functions called without a receiver, and writes to non-writable properties throw.']],
      cq: [['Check if code runs in strict mode.', `const isStrict = (function () { return !this; })(); // this is undefined only in strict mode
console.log(isStrict);`]],
      err: ['Relying on sloppy-mode globals in legacy scripts']
    }),
    t('js-memory-gc', 'Memory Management, Garbage Collection & Leaks', 'A', {
      one: 'JavaScript frees memory automatically via mark-and-sweep garbage collection; leaks happen when unneeded objects stay reachable.',
      ex: `The GC starts from roots (globals, the stack) and marks everything reachable; unreachable objects are freed. V8 uses generational collection (young objects collected often).

Common SPA leaks: listeners on window/document never removed, intervals not cleared, detached DOM nodes still referenced, growing caches/Maps, closures capturing large data, subscriptions (RxJS, WebSocket) not unsubscribed. Diagnose with the DevTools Memory panel (heap snapshots, allocation timeline) and the Performance monitor.`,
      pts: ['Reachable = kept alive', 'Remove listeners and clear timers', 'Detached DOM nodes leak', 'Use heap snapshots to find leaks'],
      flow: ['Start from roots', 'Mark reachable objects', 'Sweep unmarked objects', 'Memory reclaimed'],
      code: ['javascript', `// ❌ Leak: listener and interval live forever after the widget is removed
function mountBad(el) {
  window.addEventListener('resize', () => el.style.width = innerWidth + 'px'); // holds el
  setInterval(() => el.textContent = Date.now(), 1000);  // holds el
}
// ✅ Return a cleanup function and call it on unmount
function mount(el) {
  const ac = new AbortController();                     // one switch for listeners
  window.addEventListener('resize', () => (el.style.width = innerWidth + 'px'), { signal: ac.signal });
  const id = setInterval(() => (el.textContent = Date.now()), 1000);
  return () => { ac.abort(); clearInterval(id); };      // release everything
}`],
      iq: [['How does mark-and-sweep work?', 'The GC marks objects reachable from roots, then sweeps (frees) unmarked objects, handling circular references naturally.'],
           ['How do you find a memory leak?', 'Take heap snapshots before/after an action in DevTools, compare retained objects, and inspect retainer paths (look for detached nodes).']],
      cq: [['Cache DOM-related data without leaking.', `const cache = new WeakMap();                    // entries vanish with their keys
function info(el) {
  if (!cache.has(el)) cache.set(el, el.getBoundingClientRect()); // compute once per element
  return cache.get(el);
}`]],
      err: ['Never unsubscribing from observables/websockets']
    })
  ),
  m('7. Interview Essentials',
    t('js-es6-overview', 'ES6+ Features Overview (ES2015–ES2022)', 'B', {
      one: 'The modern JavaScript baseline: let/const, arrows, classes, modules, template literals, destructuring, spread/rest, promises, Map/Set, symbols, iterators, async/await, optional chaining, nullish coalescing, private fields and top-level await.',
      ex: `ES2015 (ES6) was the big modernisation. Later yearly releases added: ES2016 includes and **; ES2017 async/await, Object.entries/values; ES2018 rest/spread for objects, async iteration, Promise.finally; ES2019 flat/flatMap, Object.fromEntries; ES2020 ?. ??, BigInt, Promise.allSettled, globalThis, dynamic import; ES2021 replaceAll, ||= &&= ??=, numeric separators (1_000_000), Promise.any; ES2022 class fields and #private, top-level await, at(), Object.hasOwn, error cause.

Interviews often ask "what is new in ES6" or to convert old code to modern syntax.`,
      pts: ['ES2015: let/const, arrows, classes, modules, promises', 'ES2017: async/await', 'ES2020: ?. and ??', 'ES2022: #private, top-level await, at()'],
      code: ['javascript', `const budget = 1_000_000;                     // ES2021 numeric separators
const { name, ...rest } = { name: 'A', age: 3 }; // ES2018 object rest
const city = user?.address?.city ?? 'Unknown';    // ES2020
settings.theme ||= 'dark';                        // ES2021 logical assignment
const last = [1, 2, 3].at(-1);                    // ES2022 at()
class Store { #items = []; static create() { return new Store(); } } // ES2022 private + static
const results = await Promise.allSettled([p1, p2]); // ES2020 (top-level await: ES2022)`],
      iq: [['Name 5 ES6 features.', 'let/const, arrow functions, classes, template literals, destructuring, spread/rest, default params, modules, promises, Map/Set, symbols, iterators/generators.']],
      cq: [['Convert ES5 to modern JS.', `// ES5: var self = this; items.forEach(function (i) { self.total += i.price; });
items.forEach((i) => { this.total += i.price; }); // arrow keeps lexical this`]],
      err: ['Using var and function() callbacks in new code']
    }),
    L('js-es-new'),
    t('js-polyfills', 'Writing Polyfills (bind, map, reduce, Promise.all, flat)', 'I', {
      one: 'A polyfill implements a missing built-in feature using existing JavaScript — a very common frontend interview exercise.',
      ex: `Interviewers test your understanding of this, prototypes, callbacks and edge cases by asking you to implement Array.prototype.map/filter/reduce, Function.prototype.bind/call/apply, Promise.all/allSettled/race, Array.prototype.flat, debounce/throttle, deep clone and EventEmitter.

Good polyfills check if the feature exists first, follow the spec signature (callback args, thisArg, initial values), handle sparse arrays and throw the same errors. In production use core-js via your bundler instead of hand-written polyfills.`,
      pts: ['Feature-detect before defining', 'Match spec signature and edge cases', 'Tests this, prototypes and callbacks knowledge', 'Use core-js in production'],
      code: ['javascript', `if (!Array.prototype.myReduce) {                         // only define if missing
  Array.prototype.myReduce = function (cb, ...init) {    // optional initial value
    if (typeof cb !== 'function') throw new TypeError(cb + ' is not a function');
    let i = 0;                                            // start index
    let acc;                                              // accumulator
    if (init.length) acc = init[0];                       // initial value given
    else {
      while (i < this.length && !(i in this)) i++;        // skip holes
      if (i >= this.length) throw new TypeError('Reduce of empty array with no initial value');
      acc = this[i++];                                    // first element as initial value
    }
    for (; i < this.length; i++) {
      if (i in this) acc = cb(acc, this[i], i, this);     // call reducer for existing items
    }
    return acc;                                           // final value
  };
}
console.log([1, 2, 3].myReduce((a, b) => a + b));        // 6`],
      iq: [['Why check i in this in array polyfills?', 'To skip holes in sparse arrays like the native methods do.']],
      cq: [['Polyfill Function.prototype.call.', `Function.prototype.myCall = function (ctx = globalThis, ...args) { // ctx defaults to global
  const key = Symbol('fn');             // unique temporary key
  ctx[key] = this;                      // attach the function to the context object
  const result = ctx[key](...args);     // call it → this = ctx
  delete ctx[key];                      // clean up
  return result;
};`],
           ['Polyfill Array.prototype.flat.', `Array.prototype.myFlat = function (depth = 1) {             // default depth 1
  return depth < 1 ? this.slice() : this.reduce((acc, v) =>   // stop at depth 0
    acc.concat(Array.isArray(v) ? v.myFlat(depth - 1) : v), []); // recurse into arrays
};`]],
      err: ['Ignoring thisArg and index arguments']
    }),
    t('js-deep-clone-equal', 'Deep Clone & Deep Equality', 'I', {
      one: 'Deep clone creates a fully independent copy of nested data; deep equality compares structures recursively rather than by reference.',
      ex: `structuredClone handles most data (including Dates, Maps, Sets, typed arrays and circular references) but not functions, DOM nodes or class prototypes. A hand-written clone must handle arrays vs objects, Dates, and cycles (track visited with a WeakMap).

Deep equality is needed in tests (expect(…).toEqual) and memo comparisons. Compare types, keys length and recursively each value; handle NaN, Dates and arrays.`,
      pts: ['structuredClone for most cases', 'Track cycles with WeakMap', 'Deep equal: types → keys → values', 'Handle Dates and NaN'],
      code: ['javascript', `function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value; // primitives as-is
  if (value instanceof Date) return new Date(value);           // copy dates
  if (seen.has(value)) return seen.get(value);                 // circular reference
  const copy = Array.isArray(value) ? [] : {};                 // same shape
  seen.set(value, copy);                                       // remember before recursing
  for (const key of Object.keys(value)) copy[key] = deepClone(value[key], seen); // recurse
  return copy;
}
function deepEqual(a, b) {
  if (Object.is(a, b)) return true;                            // same value (handles NaN)
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false; // type mismatch
  const ka = Object.keys(a), kb = Object.keys(b);
  if (ka.length !== kb.length) return false;                   // different key counts
  return ka.every((k) => deepEqual(a[k], b[k]));               // compare each key
}
console.log(deepEqual({ x: [1, { y: 2 }] }, { x: [1, { y: 2 }] })); // true`],
      iq: [['Why does {a:1} === {a:1} return false?', 'Objects are compared by reference; two literals are different objects.']],
      cq: [['Shallow equal for React props.', `const shallowEqual = (a, b) =>                          // compare one level
  Object.keys(a).length === Object.keys(b).length &&
  Object.keys(a).every((k) => Object.is(a[k], b[k]));     // same values by Object.is`]],
      err: ['JSON clone for data with Dates/undefined']
    }),
    t('js-output-questions', 'Tricky Output-based Questions', 'I', {
      one: 'Interview puzzles that test hoisting, closures, this, coercion, event loop order and reference semantics by asking "what does this print?".',
      ex: `Approach: (1) identify hoisting and TDZ, (2) check what this is bound to, (3) list sync logs, then microtasks, then macrotasks, (4) watch for coercion with + and ==, (5) remember objects are references.

Practise explaining WHY — interviewers care about the reasoning more than the answer.`,
      pts: ['Sync → microtasks → macrotasks', 'var in loops shares one binding', 'this depends on call-site', '+ with strings concatenates'],
      code: ['javascript', `// Q1
console.log(typeof typeof 1);                 // "string" — typeof returns a string
// Q2
const a = {}; const b = { key: 'b' }; const c = { key: 'c' };
a[b] = 123; a[c] = 456;                       // both keys become "[object Object]"
console.log(a[b]);                            // 456
// Q3
console.log([1, 2, 3] + [4, 5]);              // "1,2,34,5"
// Q4
const obj = { name: 'x', getName: () => this?.name }; // arrow: this is not obj
console.log(obj.getName());                   // undefined
// Q5
async function f() { console.log(1); await null; console.log(3); }
f(); console.log(2);                          // 1 2 3`],
      iq: [['What is printed: console.log(1 < 2 < 3, 3 > 2 > 1)?', 'true false — 3 > 2 is true, then true > 1 → 1 > 1 → false.'],
           ['What does [] == ![] return?', 'true: ![] is false → 0; [] converts to "" → 0; 0 == 0.']],
      cq: [['Predict: for (var i=0;i<3;i++){ setTimeout(()=>console.log(i)) }', `// 3 3 3 — one shared var i; callbacks run after the loop ends
// Fix: use let (new binding per iteration) → 0 1 2`]],
      err: ['Answering without explaining the reasoning']
    }),
    t('js-dsa-frontend', 'DSA for Frontend Interviews (arrays, strings, hashing)', 'I', {
      one: 'Common coding-round problems for frontend roles: two pointers, sliding window, hash maps, sorting, stacks/queues, trees (DOM-like) and Big-O analysis.',
      ex: `Typical questions: two-sum, anagram check, longest substring without repeats, valid parentheses (stack), flatten nested arrays/objects, group anagrams, merge intervals, top-k frequent items, BFS/DFS on a tree (DOM traversal), implementing debounce/LRU.

Explain complexity: O(1) constant, O(log n) binary search, O(n) single pass, O(n log n) sorting, O(n²) nested loops. Prefer Map/Set for O(1) lookups.`,
      pts: ['Hash maps for O(1) lookup', 'Sliding window for substrings', 'Stack for brackets/undo', 'State Big-O for every solution'],
      code: ['javascript', `// Two-sum in O(n) with a Map
function twoSum(nums, target) {
  const seen = new Map();                         // value → index
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];                // complement
    if (seen.has(need)) return [seen.get(need), i]; // found pair
    seen.set(nums[i], i);                         // remember current
  }
  return [];                                      // no pair
}
// Valid parentheses with a stack
function isValid(s) {
  const pairs = { ')': '(', ']': '[', '}': '{' }; // closing → opening
  const stack = [];
  for (const ch of s) {
    if ('([{'.includes(ch)) stack.push(ch);       // push openers
    else if (stack.pop() !== pairs[ch]) return false; // mismatch
  }
  return stack.length === 0;                      // all closed
}
console.log(twoSum([2, 7, 11], 9), isValid('{[()]}')); // [0,1] true`],
      iq: [['Time complexity of Array.includes vs Set.has?', 'includes is O(n); Set.has is O(1) on average.']],
      cq: [['Longest substring without repeating characters (sliding window).', `function longestUnique(s) {
  const last = new Map(); let start = 0, best = 0;       // char → last index, window start
  for (let i = 0; i < s.length; i++) {
    if (last.has(s[i]) && last.get(s[i]) >= start) start = last.get(s[i]) + 1; // shrink window
    last.set(s[i], i);                                   // update position
    best = Math.max(best, i - start + 1);                // window size
  }
  return best;
}
console.log(longestUnique('abcabcbb'));                  // 3`]],
      err: ['Nested loops where a Map would make it O(n)']
    })
  )
];
