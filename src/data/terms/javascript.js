// javascript.js — JavaScript core terms
// Term shape: id, cat, name, level, oneLiner, explanation, diagram (Mermaid), code {lang, src},
// interview [{q,a}], coding [{q,a}], roadmap [steps], related [ids]

export default [
  {
    id: 'js-closures', cat: 'javascript', name: 'Closures', level: 'Intermediate',
    oneLiner: 'A function that remembers the variables of the scope it was created in, even after that scope has finished running.',
    explanation: `Every time a function is created, JavaScript attaches a hidden reference to its surrounding lexical environment. When the outer function returns, its variables would normally be garbage-collected — but if an inner function still references them, they stay alive. That preserved environment is the closure.

Why it matters: closures power data privacy (module pattern), function factories, memoisation, debounce/throttle, React hooks (each render's handlers close over that render's state) and event handlers.

Common pitfall: stale closures. In React, a setInterval callback created on the first render keeps seeing the first render's state unless you use a functional updater or a ref.`,
    diagram: `flowchart TD
  A["makeCounter() is called"] --> B["Local variable count = 0 is created"]
  B --> C["Inner function increment is created and captures count"]
  C --> D["makeCounter returns increment"]
  D --> E["Outer scope finishes, but count is NOT garbage-collected"]
  E --> F["Each call to increment reads and updates the same count"]`,
    code: { lang: 'javascript', src: `// makeCounter is a "factory" — every call creates a brand-new private counter
function makeCounter() {              // 'function' declares a reusable block of code named makeCounter
  let count = 0;                      // 'let' creates a block-scoped variable; only code inside can see it
  return function increment() {       // return an inner function; it CLOSES OVER 'count'
    count = count + 1;                // update the captured variable (it survives between calls)
    return count;                     // give the new value back to the caller
  };                                  // end of inner function
}                                     // end of makeCounter — its scope is kept alive by the closure

const counterA = makeCounter();       // counterA holds its own private 'count'
const counterB = makeCounter();       // counterB gets a completely separate 'count'

console.log(counterA());              // 1 — counterA's count goes 0 → 1
console.log(counterA());              // 2 — same closure, so it remembers 1 → 2
console.log(counterB());              // 1 — counterB is independent of counterA
// console.log(count);                // ReferenceError: 'count' is private; outside code cannot touch it` },
    interview: [
      { q: 'What is a closure?', a: 'A function bundled together with references to its surrounding lexical scope, so it can access outer variables even after the outer function has returned.' },
      { q: 'Give real use-cases of closures.', a: 'Data privacy / module pattern, function factories, currying, memoisation caches, debounce and throttle, event handlers, and React hooks capturing render-time values.' },
      { q: 'Can closures cause memory leaks?', a: 'Yes. If a long-lived closure (e.g. a global event listener) references a large object, that object cannot be garbage-collected. Remove listeners and null out references when done.' },
      { q: 'Explain the classic var-in-loop closure bug.', a: 'With var, all callbacks share one function-scoped i, so setTimeout logs the final value. let creates a new binding per iteration, so each callback captures its own i.' },
      { q: 'What is a stale closure in React?', a: 'A callback that captured an old render\'s state/props. Fix with functional state updates, correct dependency arrays, or useRef for the latest value.' }
    ],
    coding: [
      { q: 'Write a function once(fn) that allows fn to run only one time.', a: `function once(fn) {                     // takes any function fn
  let called = false;                   // closure flag: has fn run yet?
  let result;                           // closure cache for the first result
  return function (...args) {           // returned wrapper accepts any arguments
    if (!called) {                      // only the first call enters
      called = true;                    // flip the flag so later calls skip
      result = fn.apply(this, args);    // run fn with the same 'this' and arguments
    }                                   // end if
    return result;                      // always return the first result
  };                                    // end wrapper
}                                       // end once

const init = once(() => 'ready');       // wrap a function
console.log(init(), init());            // 'ready' 'ready' — body ran only once` },
      { q: 'Fix: for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)) prints 3,3,3.', a: `for (let i = 0; i < 3; i++) {          // 'let' makes a NEW i for every loop iteration
  setTimeout(() => console.log(i), 0);  // each arrow function closes over its own i
}                                       // prints 0, 1, 2

// pre-ES6 fix using an IIFE (Immediately Invoked Function Expression)
for (var j = 0; j < 3; j++) {           // 'var' shares ONE j across all iterations
  (function (k) {                       // IIFE creates a new scope with parameter k
    setTimeout(() => console.log(k), 0);// callback closes over k, a copy of j at that moment
  })(j);                                // invoke immediately, passing current j
}                                       // prints 0, 1, 2` },
      { q: 'Implement a memoize(fn) using a closure.', a: `function memoize(fn) {                  // higher-order function
  const cache = new Map();              // closure-held cache: key → result
  return function (arg) {               // wrapper for single-argument functions
    if (cache.has(arg)) return cache.get(arg); // cache hit: skip the expensive work
    const value = fn(arg);              // cache miss: compute
    cache.set(arg, value);              // store for next time
    return value;                       // return computed result
  };                                    // end wrapper
}                                       // end memoize` }
    ],
    roadmap: ['Scope & lexical environment', 'Functions as values', 'Closures', 'Module pattern & factories', 'Debounce / memoize', 'Stale closures in React hooks'],
    related: ['js-event-loop', 'js-debounce-throttle', 'react-hooks-core']
  },
  {
    id: 'js-event-loop', cat: 'javascript', name: 'Event Loop', level: 'Intermediate',
    oneLiner: 'The mechanism that lets single-threaded JavaScript run async work by moving finished tasks from queues onto the call stack.',
    explanation: `JavaScript runs on one main thread with one call stack. Browser APIs (timers, fetch, DOM events) do their waiting outside that thread. When they finish, their callbacks are queued.

The event loop repeats: (1) run everything on the call stack until empty, (2) drain the ENTIRE microtask queue (Promise callbacks, queueMicrotask, MutationObserver), (3) let the browser render if needed, (4) take ONE macrotask (setTimeout, setInterval, I/O, UI events) and repeat.

That is why Promise.then always runs before setTimeout(fn, 0), and why an infinite chain of microtasks can freeze the page — rendering never gets a turn. Long tasks over 50 ms hurt INP (Interaction to Next Paint).`,
    diagram: `flowchart TD
  S["Call Stack runs sync code"] --> E{"Stack empty?"}
  E -- No --> S
  E -- Yes --> M["Drain ALL microtasks: Promise.then, queueMicrotask"]
  M --> R["Browser may render: style, layout, paint"]
  R --> T["Take ONE macrotask: setTimeout, events, I/O"]
  T --> S
  W["Web APIs: timers, fetch, DOM events"] -. "callback ready" .-> T
  W -. "promise resolved" .-> M`,
    code: { lang: 'javascript', src: `console.log('1: sync start');               // runs immediately on the call stack

setTimeout(() => {                           // schedules a MACROtask via the browser timer API
  console.log('5: setTimeout (macrotask)');  // runs last: macrotasks wait for microtasks
}, 0);                                       // 0 ms means "as soon as possible", not "now"

Promise.resolve().then(() => {               // already-resolved promise → callback goes to MICROtask queue
  console.log('3: promise.then (microtask)');// runs right after sync code finishes
});                                          // end then

queueMicrotask(() => {                       // explicit microtask scheduling
  console.log('4: queueMicrotask');          // microtasks run in FIFO order
});                                          // end queueMicrotask

console.log('2: sync end');                  // still synchronous, so prints second

// Output order: 1, 2, 3, 4, 5` },
    interview: [
      { q: 'Is JavaScript single-threaded?', a: 'The main JS execution is single-threaded (one call stack). The browser itself is multi-threaded, and Web Workers give you extra JS threads with no shared DOM.' },
      { q: 'Difference between microtasks and macrotasks?', a: 'Microtasks (promises, queueMicrotask, MutationObserver) are drained completely after each task. Macrotasks (setTimeout, setInterval, events, I/O) are taken one per loop iteration.' },
      { q: 'Why does setTimeout(fn, 0) not run immediately?', a: 'It only queues fn as a macrotask. It runs after the current stack and all microtasks finish, and browsers clamp nested timers to ≥4 ms.' },
      { q: 'How does the event loop relate to INP?', a: 'Long synchronous tasks block the loop, so input events wait. Break work into chunks (scheduler.yield, setTimeout, requestIdleCallback) or move it to a Worker.' },
      { q: 'Where does requestAnimationFrame fit?', a: 'rAF callbacks run just before the browser paints a frame, after microtasks — ideal for visual updates.' }
    ],
    coding: [
      { q: 'Predict the output: console.log(a); setTimeout(b); Promise.resolve().then(c); console.log(d)', a: `// Order: a, d, c, b
console.log('a');                         // sync → 1st
setTimeout(() => console.log('b'));       // macrotask → last
Promise.resolve().then(() => console.log('c')); // microtask → after sync code
console.log('d');                         // sync → 2nd` },
      { q: 'Break a heavy loop into chunks so the UI stays responsive.', a: `async function processInChunks(items, work, chunk = 500) { // chunk = items per slice
  for (let i = 0; i < items.length; i += chunk) {          // walk the array slice by slice
    items.slice(i, i + chunk).forEach(work);               // do a small amount of sync work
    await new Promise((r) => setTimeout(r, 0));            // yield: let rendering & input run
  }                                                        // end for
}                                                          // end function` }
    ],
    roadmap: ['Call stack', 'Web APIs', 'Callback (macrotask) queue', 'Microtask queue', 'Rendering steps & rAF', 'Long tasks & INP'],
    related: ['js-promises-async', 'perf-core-web-vitals', 'webapi-workers']
  },
  {
    id: 'js-promises-async', cat: 'javascript', name: 'Promises & async/await', level: 'Intermediate',
    oneLiner: 'A Promise is an object representing a future value; async/await is syntax that lets you write promise code like synchronous code.',
    explanation: `A Promise is in one of three states: pending, fulfilled or rejected. Once settled it never changes. You attach handlers with .then, .catch and .finally — each returns a new promise, which is what makes chaining work.

async functions always return a promise. await pauses that function (not the thread) until the promise settles, then resumes it as a microtask. Errors become exceptions you can catch with try/catch.

Combinators you must know: Promise.all (fail-fast, all results), Promise.allSettled (every outcome), Promise.race (first to settle), Promise.any (first to fulfil). Newer: Promise.withResolvers() (ES2024) gives you the promise plus its resolve/reject functions.`,
    diagram: `flowchart LR
  P["new Promise"] --> PE["pending"]
  PE -- "resolve(value)" --> F["fulfilled"]
  PE -- "reject(error)" --> R["rejected"]
  F --> T[".then handler"]
  R --> C[".catch handler"]
  T --> FI[".finally"]
  C --> FI`,
    code: { lang: 'javascript', src: `// Fetch a user and their posts in parallel, with a timeout and proper error handling
async function loadDashboard(userId) {                        // 'async' → this function returns a Promise
  const controller = new AbortController();                   // lets us cancel the fetch requests
  const timer = setTimeout(() => controller.abort(), 5000);   // abort if it takes longer than 5 s
  try {                                                       // errors from awaited promises land in catch
    const [user, posts] = await Promise.all([                 // run both requests at the same time
      fetch('/api/users/' + userId, { signal: controller.signal }).then((r) => r.json()), // request 1
      fetch('/api/posts?user=' + userId, { signal: controller.signal }).then((r) => r.json()) // request 2
    ]);                                                       // await resumes when BOTH succeed
    return { user, posts };                                   // resolved value of loadDashboard()
  } catch (err) {                                             // any rejection (network, abort, JSON) ends here
    if (err.name === 'AbortError') throw new Error('Request timed out'); // clearer message for timeouts
    throw err;                                                // re-throw so the caller can handle it
  } finally {                                                 // always runs, success or failure
    clearTimeout(timer);                                      // clean up the timer to avoid leaks
  }                                                           // end try/catch/finally
}                                                             // end loadDashboard` },
    interview: [
      { q: 'Promise.all vs Promise.allSettled?', a: 'all rejects as soon as one promise rejects; allSettled waits for every promise and returns {status, value|reason} for each.' },
      { q: 'What does an async function return?', a: 'Always a Promise. A returned value becomes the fulfilled value; a thrown error becomes the rejection.' },
      { q: 'Does await block the main thread?', a: 'No. It suspends only that async function; the rest of the program keeps running and the function resumes as a microtask.' },
      { q: 'How do you run awaits in parallel?', a: 'Start the promises first, then await Promise.all([...]). Sequential awaits in a loop run one after another.' },
      { q: 'What is an unhandled rejection?', a: 'A rejected promise with no catch handler. Browsers fire an unhandledrejection event; in Node it can crash the process.' }
    ],
    coding: [
      { q: 'Implement a promisified sleep(ms).', a: `const sleep = (ms) =>                          // arrow function taking milliseconds
  new Promise((resolve) => setTimeout(resolve, ms)); // resolve after ms; nothing to reject

await sleep(1000);                              // pause the current async function for 1 s` },
      { q: 'Write retry(fn, times) that retries a failing async function with exponential backoff.', a: `async function retry(fn, times = 3, delay = 300) {  // fn returns a promise
  for (let attempt = 0; attempt <= times; attempt++) { // try 'times' extra attempts
    try {                                              // attempt the call
      return await fn();                               // success → return immediately
    } catch (err) {                                    // failure path
      if (attempt === times) throw err;                // out of attempts → give up
      await new Promise((r) => setTimeout(r, delay * 2 ** attempt)); // wait 300, 600, 1200...
    }                                                  // end catch
  }                                                    // end for
}                                                      // end retry` },
      { q: 'Polyfill Promise.all.', a: `function promiseAll(list) {                     // list: array of values or promises
  return new Promise((resolve, reject) => {     // outer promise we control
    const results = [];                         // keeps results in original order
    let done = 0;                               // count of fulfilled items
    if (list.length === 0) resolve(results);    // empty input resolves immediately
    list.forEach((item, i) => {                 // subscribe to every item
      Promise.resolve(item).then((v) => {       // wrap non-promises too
        results[i] = v;                         // place value at its index
        if (++done === list.length) resolve(results); // all done → resolve
      }, reject);                               // first rejection rejects the whole thing
    });                                         // end forEach
  });                                           // end new Promise
}                                               // end promiseAll` }
    ],
    roadmap: ['Callbacks & callback hell', 'Promise states', 'Chaining', 'Combinators', 'async/await + try/catch', 'AbortController & cancellation'],
    related: ['js-event-loop', 'net-fetch-rest', 'ai-streaming']
  },
  {
    id: 'js-this', cat: 'javascript', name: 'this, call, apply & bind', level: 'Intermediate',
    oneLiner: '`this` is decided by HOW a function is called; call/apply/bind let you set it explicitly.',
    explanation: `Rules in priority order: (1) new binding — inside a constructor called with new, this is the new object. (2) Explicit — fn.call(obj), fn.apply(obj, args), fn.bind(obj). (3) Implicit — obj.method() makes this = obj. (4) Default — plain fn() gives undefined in strict mode (window in sloppy mode).

Arrow functions do NOT have their own this; they use the this of the surrounding scope. That is why arrows are great for callbacks inside class methods, and bad as object methods that need this.

call passes args one by one, apply takes an array, bind returns a new permanently-bound function.`,
    diagram: `flowchart TD
  A{"How was the function called?"} -->|"with new"| N["this = new object"]
  A -->|"call / apply / bind"| X["this = the object you passed"]
  A -->|"obj.method()"| I["this = obj"]
  A -->|"plain fn()"| D["this = undefined in strict mode"]
  A -->|"arrow function"| L["this = this of outer scope"]`,
    code: { lang: 'javascript', src: `'use strict';                                   // strict mode: default 'this' is undefined, not window
const user = {                                  // a plain object literal
  name: 'Sujata',                               // a property
  greet(greeting) {                             // shorthand method — a normal function
    return greeting + ', ' + this.name;         // 'this' depends on how greet is called
  }                                             // end greet
};                                              // end user

console.log(user.greet('Hi'));                  // implicit binding → this = user → "Hi, Sujata"

const loose = user.greet;                       // copy the function reference out of the object
// loose('Hi');                                 // TypeError: 'this' is undefined (lost binding)

const admin = { name: 'Admin' };                // another object to borrow the method for
console.log(user.greet.call(admin, 'Hello'));   // call: this = admin, args listed → "Hello, Admin"
console.log(user.greet.apply(admin, ['Hey']));  // apply: same but args as an array
const bound = user.greet.bind(admin);           // bind: returns a NEW function locked to admin
console.log(bound('Yo'));                       // "Yo, Admin" — no matter how it is called later` },
    interview: [
      { q: 'What decides the value of this?', a: 'The call-site: new > explicit (call/apply/bind) > implicit (obj.fn()) > default. Arrow functions inherit this lexically.' },
      { q: 'call vs apply vs bind?', a: 'call(this, a, b) invokes now with listed args; apply(this, [a, b]) invokes now with an array; bind(this, a) returns a new function to call later.' },
      { q: 'Can you rebind an arrow function?', a: 'No. call/apply/bind cannot change an arrow function\'s this.' },
      { q: 'Why do React class components bind handlers?', a: 'Passing this.handleClick to onClick loses the implicit binding. Binding in the constructor or using class-field arrows keeps this pointing at the component.' }
    ],
    coding: [
      { q: 'Polyfill Function.prototype.bind.', a: `Function.prototype.myBind = function (ctx, ...preset) { // add to every function
  const fn = this;                                     // 'this' here is the function being bound
  return function (...later) {                         // the new bound function
    return fn.apply(ctx, [...preset, ...later]);       // call original with fixed ctx + all args
  };                                                   // end returned function
};                                                     // end myBind` }
    ],
    roadmap: ['Execution context', 'Four binding rules', 'Arrow functions', 'call/apply/bind', 'Polyfilling bind'],
    related: ['js-closures', 'js-prototypes']
  },
  {
    id: 'js-prototypes', cat: 'javascript', name: 'Prototypes & Classes', level: 'Intermediate',
    oneLiner: 'Objects inherit from other objects through a prototype chain; ES6 class is syntax sugar over it.',
    explanation: `Every object has an internal [[Prototype]] link (reachable via Object.getPrototypeOf). When you read a property that is not on the object itself, JavaScript walks up this chain until it finds it or reaches null.

Constructor functions put shared methods on Fn.prototype so all instances share one copy. ES6 class syntax does exactly this, plus extends/super, private fields (#field), static members and static blocks.

Interview favourite: hasOwnProperty / Object.hasOwn checks only the object itself, while the in operator checks the whole chain.`,
    diagram: `flowchart BT
  I["dog instance: name"] -->|"[[Prototype]]"| D["Dog.prototype: bark()"]
  D -->|"[[Prototype]]"| A["Animal.prototype: eat()"]
  A -->|"[[Prototype]]"| O["Object.prototype: toString()"]
  O -->|"[[Prototype]]"| N["null — end of chain"]`,
    code: { lang: 'javascript', src: `class Animal {                                 // 'class' creates a constructor + prototype
  #energy = 10;                                // '#' = truly private field (ES2022)
  constructor(name) {                          // runs when you call 'new Animal(...)'
    this.name = name;                          // own property stored on each instance
  }                                            // end constructor
  eat() {                                      // method lives on Animal.prototype (shared)
    this.#energy += 5;                         // private field accessible only inside the class
    return this.name + ' eats';                // return a description
  }                                            // end eat
  static create(name) {                        // 'static' = on the class itself, not instances
    return new Animal(name);                   // factory helper
  }                                            // end create
}                                              // end Animal

class Dog extends Animal {                     // 'extends' links Dog.prototype → Animal.prototype
  bark() {                                     // method on Dog.prototype
    return this.name + ' barks';               // 'this' is the dog instance
  }                                            // end bark
}                                              // end Dog

const d = new Dog('Bruno');                    // creates object whose prototype is Dog.prototype
console.log(d.bark(), d.eat());                // bark found on Dog.prototype, eat found one level up
console.log(Object.hasOwn(d, 'eat'));          // false — eat is inherited, not an own property` },
    interview: [
      { q: 'What is the prototype chain?', a: 'A linked list of objects used for property lookup; each object points to its prototype until null.' },
      { q: '__proto__ vs prototype?', a: 'prototype is a property on constructor functions used for instances created with new. __proto__ (or Object.getPrototypeOf) is the actual link on an object.' },
      { q: 'Are JS classes real classes?', a: 'They are syntax over prototypal inheritance, with some extras: they must be called with new, are strict mode, and support private #fields.' }
    ],
    coding: [
      { q: 'Implement inheritance without class syntax.', a: `function Animal(name) { this.name = name; }      // constructor sets own property
Animal.prototype.eat = function () {              // shared method on the prototype
  return this.name + ' eats';                     // uses instance's name
};                                                // end eat
function Dog(name) { Animal.call(this, name); }   // call parent constructor with this dog
Dog.prototype = Object.create(Animal.prototype);  // link Dog.prototype → Animal.prototype
Dog.prototype.constructor = Dog;                  // repair the constructor pointer
new Dog('Max').eat();                             // 'Max eats' via the chain` }
    ],
    roadmap: ['Objects & properties', 'Constructor functions', 'Prototype chain', 'ES6 classes', 'Private fields & static blocks'],
    related: ['js-this', 'ts-generics']
  },
  {
    id: 'js-debounce-throttle', cat: 'javascript', name: 'Debounce & Throttle', level: 'Intermediate',
    oneLiner: 'Debounce runs a function only after events STOP for N ms; throttle runs it at most once every N ms.',
    explanation: `Both limit how often a costly handler runs during bursts of events like typing, scrolling or resizing.

Debounce: wait until the user pauses. Perfect for search-as-you-type — one API call after typing stops, not one per keystroke.

Throttle: guarantee a steady maximum rate. Perfect for scroll position tracking, infinite scroll checks, or drag handlers.

Both are built on closures holding a timer id or a last-run timestamp. In React, create them once with useMemo/useRef so every render does not create a new debounced function.`,
    diagram: `flowchart LR
  E["Keystrokes: k k k k pause"] --> D["Debounce 300ms"]
  D --> D1["Fires ONCE after the pause"]
  E2["Scroll events every 5ms"] --> T["Throttle 200ms"]
  T --> T1["Fires at most every 200ms"]`,
    code: { lang: 'javascript', src: `function debounce(fn, wait = 300) {          // fn = work to delay, wait = quiet period in ms
  let timer;                                 // closure variable holding the pending timeout id
  return function (...args) {                // the debounced version the caller uses
    clearTimeout(timer);                     // cancel the previous pending call (user is still typing)
    timer = setTimeout(() => {               // schedule a fresh call
      fn.apply(this, args);                  // run with original 'this' and latest arguments
    }, wait);                                // only fires if no new call arrives within 'wait'
  };                                         // end wrapper
}                                            // end debounce

function throttle(fn, limit = 200) {         // limit = minimum gap between runs
  let last = 0;                              // timestamp of the last run
  return function (...args) {                // throttled wrapper
    const now = Date.now();                  // current time in ms
    if (now - last >= limit) {               // enough time passed since the last run?
      last = now;                            // record this run
      fn.apply(this, args);                  // execute immediately
    }                                        // otherwise ignore this event
  };                                         // end wrapper
}                                            // end throttle

const search = debounce((q) => console.log('API call for', q), 400); // one call after typing stops
window.addEventListener('scroll', throttle(() => console.log(scrollY), 200)); // max 5 logs/second` },
    interview: [
      { q: 'Debounce vs throttle — when to use each?', a: 'Debounce for "final value after user stops" (search, resize end, autosave). Throttle for "regular updates during activity" (scroll, mousemove, drag).' },
      { q: 'What is leading vs trailing debounce?', a: 'Trailing fires after the pause (default). Leading fires on the first event, then ignores events until the pause ends.' },
      { q: 'How do you debounce in React correctly?', a: 'Create the debounced function once (useMemo/useRef) and cancel it in a useEffect cleanup on unmount.' }
    ],
    coding: [
      { q: 'Write a useDebouncedValue React hook.', a: `import { useEffect, useState } from 'react';     // React hooks we need
export function useDebouncedValue(value, delay = 300) { // returns value after it stops changing
  const [debounced, setDebounced] = useState(value);    // state holding the delayed value
  useEffect(() => {                                     // re-run whenever value or delay changes
    const id = setTimeout(() => setDebounced(value), delay); // update after the delay
    return () => clearTimeout(id);                      // cleanup: cancel if value changes again
  }, [value, delay]);                                   // dependencies
  return debounced;                                     // stable, delayed value
}                                                       // end hook` }
    ],
    roadmap: ['Closures', 'Timers', 'Debounce', 'Throttle', 'Leading/trailing options', 'Use in React/Angular (RxJS debounceTime)'],
    related: ['js-closures', 'perf-core-web-vitals', 'angular-rxjs']
  },
  {
    id: 'js-hoisting-scope', cat: 'javascript', name: 'Hoisting, Scope & TDZ', level: 'Beginner',
    oneLiner: 'Declarations are registered before code runs; var is initialised as undefined, let/const stay in a Temporal Dead Zone until their line.',
    explanation: `Before executing a scope, the engine scans it and registers declarations. Function declarations are hoisted completely (you can call them before they appear). var is hoisted and set to undefined. let, const and class are hoisted but uninitialised — touching them before the declaration line throws a ReferenceError. That gap is the Temporal Dead Zone (TDZ).

Scope types: global, function (var), block (let/const inside {}), and module scope. Prefer const by default, let when reassigning, and avoid var.`,
    diagram: `flowchart TD
  A["Creation phase: scan scope"] --> B["function declarations → fully available"]
  A --> C["var → hoisted as undefined"]
  A --> D["let / const / class → hoisted, TDZ"]
  D --> E["Execution reaches declaration line → initialised"]`,
    code: { lang: 'javascript', src: `console.log(sayHi());        // works: function declarations are fully hoisted
function sayHi() {           // declaration form — hoisted with its body
  return 'hi';               // return a string
}                            // end sayHi

console.log(a);              // undefined: 'var a' is hoisted and initialised to undefined
var a = 5;                   // assignment happens here, at runtime

// console.log(b);           // ReferenceError: b is in the Temporal Dead Zone
let b = 10;                  // TDZ ends; b is now usable

if (true) {                  // a block creates a new block scope
  const c = 1;               // const is block-scoped
  var d = 2;                 // var ignores blocks → function/global scoped
}                            // end block
// console.log(c);           // ReferenceError: c lives only inside the block
console.log(d);              // 2 — var leaked out of the block` },
    interview: [
      { q: 'What is hoisting?', a: 'The behaviour where declarations are processed before code executes, so they exist from the start of their scope.' },
      { q: 'What is the Temporal Dead Zone?', a: 'The period between entering a scope and the let/const/class declaration line, during which accessing the binding throws.' },
      { q: 'var vs let vs const?', a: 'var: function-scoped, re-declarable, hoisted as undefined. let: block-scoped, reassignable. const: block-scoped, not reassignable (object contents can still change).' }
    ],
    coding: [
      { q: 'Predict: var x = 1; function f(){ console.log(x); var x = 2; } f();', a: `// Prints undefined — inside f, 'var x' is hoisted to the top of f,
// shadowing the outer x, and it is undefined until the assignment line.
var x = 1;                    // global x
function f() {                // new function scope
  console.log(x);             // local hoisted x → undefined
  var x = 2;                  // local assignment
}                             // end f
f();                          // logs undefined` }
    ],
    roadmap: ['Execution context', 'Hoisting', 'Block scope', 'TDZ', 'Closures'],
    related: ['js-closures']
  },
  {
    id: 'js-es-new', cat: 'javascript', name: 'Newest ECMAScript Features (ES2023–ES2025)', level: 'Advanced', version: 'ES2025',
    oneLiner: 'Recent additions like immutable array methods, Object.groupBy, Set methods, Promise.withResolvers, Iterator helpers and RegExp improvements.',
    explanation: `Interviewers increasingly ask "what is new in JavaScript?". Key additions:

ES2023: toSorted, toReversed, toSpliced, with (non-mutating array copies), findLast / findLastIndex, hashbang support.
ES2024: Object.groupBy / Map.groupBy, Promise.withResolvers, Array buffer resizing, Atomics.waitAsync, RegExp v flag.
ES2025: Set methods (union, intersection, difference, symmetricDifference, isSubsetOf…), Iterator helpers (map, filter, take, drop on iterators), Promise.try, RegExp.escape, JSON modules / import attributes, Float16Array.

Immutable array methods matter a lot in React and Redux, where you must not mutate state.`,
    diagram: `flowchart LR
  A["ES2023: toSorted, with, findLast"] --> B["ES2024: groupBy, withResolvers"]
  B --> C["ES2025: Set methods, Iterator helpers, Promise.try"]
  C --> D["Next: Temporal API, decorators, explicit resource management"]`,
    code: { lang: 'javascript', src: `const scores = [40, 10, 30];                       // original array
const sorted = scores.toSorted((a, b) => a - b);   // ES2023: returns a NEW sorted array
console.log(scores, sorted);                       // [40,10,30] untouched, [10,30,40]

const updated = scores.with(1, 99);                // ES2023: copy with index 1 replaced
console.log(updated);                              // [40, 99, 30]

const people = [{ n: 'A', role: 'dev' }, { n: 'B', role: 'qa' }, { n: 'C', role: 'dev' }]; // sample data
const byRole = Object.groupBy(people, (p) => p.role); // ES2024: group into an object by key
console.log(byRole.dev.length);                    // 2

const { promise, resolve } = Promise.withResolvers(); // ES2024: promise + its resolve fn
setTimeout(() => resolve('done'), 100);            // resolve it from outside
promise.then(console.log);                         // 'done'

const frontend = new Set(['js', 'css', 'react']);  // a Set of skills
const backend = new Set(['js', 'node']);           // another Set
console.log(frontend.intersection(backend));       // ES2025: Set {'js'} — common items
console.log(frontend.union(backend).size);         // ES2025: 4 unique skills` },
    interview: [
      { q: 'Difference between sort and toSorted?', a: 'sort mutates the original array in place; toSorted returns a new sorted copy, which is safer for React/Redux state.' },
      { q: 'What does Object.groupBy return?', a: 'A null-prototype object whose keys are the callback results and whose values are arrays of matching items. Map.groupBy returns a Map instead.' },
      { q: 'What is the Temporal API?', a: 'A modern, immutable date/time API replacing Date, with time zones and calendars built in. Rolling out in browsers in 2025–2026.' }
    ],
    coding: [
      { q: 'Remove duplicates and find common tags between two arrays.', a: `const a = ['js', 'ts', 'js'];                 // input with duplicates
const b = ['ts', 'react'];                    // second input
const unique = [...new Set(a)];               // Set drops duplicates → ['js','ts']
const common = [...new Set(a).intersection(new Set(b))]; // ES2025 → ['ts']` }
    ],
    roadmap: ['ES6 essentials', 'ES2020–22 (optional chaining, ??, top-level await)', 'ES2023 immutable arrays', 'ES2024 groupBy', 'ES2025 Set & Iterator helpers', 'Upcoming: Temporal'],
    related: ['js-promises-async', 'state-redux-toolkit']
  }
];
