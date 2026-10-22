// TypeScript — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import fw from '../terms/frameworks.js';
const L = legacyPicker(fw);

export default [
  m('1. Basics',
    t('ts-what-why', 'What is TypeScript & How It Compiles', 'B', {
      one: 'TypeScript is a typed superset of JavaScript: you add static types, the compiler checks them, then erases them to produce plain JavaScript.',
      ex: `Types catch bugs before runtime (typos, wrong argument types, missing null checks), power editor autocomplete and make refactoring large codebases safe. Types disappear at runtime — TS does not validate API responses by itself.

tsc type-checks and emits JS; modern bundlers (Vite, esbuild, SWC) strip types quickly and run tsc --noEmit separately for checking. Node can now run TS files directly by stripping types. Gradual adoption: rename .js to .ts, enable strict step by step.`,
      pts: ['Superset of JavaScript', 'Types erased at compile time', 'No runtime validation by default', 'tsc --noEmit for type checking in CI'],
      flow: ['Write .ts with types', 'Type checker finds errors', 'Types erased', 'Plain JavaScript runs'],
      code: ['typescript', `function total(price: number, qty: number): number { // annotated params and return type
  return price * qty;                                // checked arithmetic
}
total(499, 2);                                        // ✅
// total('499', 2);                                   // ❌ compile error: string not assignable to number
const user = { name: 'Riya', age: 28 };               // type inferred: { name: string; age: number }
// user.nmae;                                         // ❌ typo caught: did you mean 'name'?`],
      iq: [['Does TypeScript run in the browser?', 'No — browsers run the compiled JavaScript; types are removed.'],
           ['Does TypeScript validate API data at runtime?', 'No; use runtime validators like Zod to check external data.'],
           ['Benefits of TypeScript?', 'Early error detection, better tooling/autocomplete, self-documenting code and safer refactors.']],
      cq: [['Type-check a project without emitting files.', `npx tsc --noEmit        # report type errors only (bundler handles output)`]],
      err: ['Assuming types protect against bad API responses']
    }),
    t('ts-basic-types', 'Basic Types: primitives, arrays, tuples, any, unknown, never, void', 'B', {
      one: 'Core types: string, number, boolean, bigint, symbol, null, undefined, arrays (T[]), tuples ([T, U]), any (opt-out), unknown (safe unknown), void (no return) and never (impossible).',
      ex: `Prefer unknown over any: unknown forces you to narrow before use, any silently disables checking and spreads. void is for functions that return nothing; never is for functions that never return (throw/infinite loop) and for exhaustive checks.

Tuples have fixed length and positional types (useState returns a tuple). readonly arrays prevent mutation: readonly string[]. object type means non-primitive.`,
      pts: ['unknown over any', 'Tuples: fixed positional types', 'void vs never', 'readonly arrays'],
      code: ['typescript', `let title: string = 'FrontEdge';            // primitive annotation (often inferred)
let scores: number[] = [90, 85];             // array of numbers
let pair: [string, number] = ['age', 30];    // tuple: position matters
const tags: readonly string[] = ['ts'];      // cannot push/splice
let data: unknown = JSON.parse('{"a":1}');   // must narrow before use
if (typeof data === 'object' && data !== null && 'a' in data) console.log(data.a); // narrowed
function log(msg: string): void { console.log(msg); }        // returns nothing
function fail(msg: string): never { throw new Error(msg); }  // never returns`],
      iq: [['any vs unknown?', 'any disables type checking; unknown accepts any value but requires narrowing before operations.'],
           ['void vs never?', 'void means the function returns no useful value; never means it never completes normally.']],
      cq: [['Type a function returning a tuple like useState.', `function useToggle(initial: boolean): [boolean, () => void] { // tuple return type
  let v = initial;
  return [v, () => { v = !v; }];
}`]],
      err: ['Using any to silence errors']
    }),
    t('ts-type-inference', 'Type Inference & Annotations', 'B', {
      one: 'TypeScript infers types from values and context, so you annotate mainly function parameters, public APIs and places where inference is too wide.',
      ex: `const x = 'a' infers the literal type 'a'; let x = 'a' infers string (widening). Return types are inferred, but explicit return types on exported functions document intent and catch accidental changes. Contextual typing infers callback parameters (arr.map(n => n * 2)).

as const freezes literals into readonly literal types — great for config objects and action types.`,
      pts: ['Annotate params and public APIs', 'const narrows, let widens', 'Contextual typing for callbacks', 'as const for literal configs'],
      code: ['typescript', `const mode = 'dark';                       // type: "dark" (literal)
let theme = 'dark';                         // type: string (widened)
const nums = [1, 2, 3];                     // number[]
const doubled = nums.map((n) => n * 2);     // n inferred as number from context
const ROUTES = { home: '/', learn: '/learn' } as const; // readonly literal values
type Route = (typeof ROUTES)[keyof typeof ROUTES];       // "/" | "/learn"
export function slug(s: string): string {   // explicit return type on public API
  return s.toLowerCase();
}`],
      iq: [['When should you add explicit types?', 'Function parameters, exported/public APIs, empty arrays/objects, and when inference is too broad.'],
           ['What does as const do?', 'Makes properties readonly and infers literal types instead of widened primitives.']],
      cq: [['Type an empty array that will hold users.', `const users: User[] = [];  // without annotation it would be any[] / never[]`]],
      err: ['Annotating everything redundantly']
    }),
    t('ts-functions', 'Typing Functions: optional, default, rest, overloads, callbacks', 'B', {
      one: 'Annotate parameters and returns, mark optional params with ?, type callbacks with function types, and use overloads for multiple call signatures.',
      ex: `Optional parameters (b?: number) must come after required ones. Function types: type Handler = (e: MouseEvent) => void. Rest parameters: (...ids: number[]). Overloads declare several signatures above one implementation (e.g. a function returning string for string input and number for number input). Often a union or generic is simpler than overloads.`,
      pts: ['Optional params with ?', 'Function type aliases', 'Overloads for distinct signatures', 'Prefer generics/unions when possible'],
      code: ['typescript', `type Formatter = (value: number, currency?: string) => string;   // function type
const formatPrice: Formatter = (value, currency = 'INR') =>       // params typed from Formatter
  new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(value);
function sum(...nums: number[]): number {                         // rest parameter
  return nums.reduce((a, b) => a + b, 0);
}
function parse(input: string): string[];                          // overload 1
function parse(input: number): number[];                          // overload 2
function parse(input: string | number) {                          // implementation
  return typeof input === 'string' ? input.split(',') : [input];
}
const parts = parse('a,b');                                       // string[]`],
      iq: [['When use overloads?', 'When the return type depends on argument types in ways a union cannot express and generics are not a better fit.']],
      cq: [['Type an event handler prop.', `type ButtonProps = { onPress: (id: string) => void }; // callback type
const handle: ButtonProps['onPress'] = (id) => console.log(id); // id inferred as string`]],
      err: ['Optional params before required ones']
    }),
    t('ts-interfaces-types', 'Interfaces vs Type Aliases', 'B', {
      one: 'Both describe object shapes; interfaces can be extended and merged, type aliases can also represent unions, tuples, primitives and computed types.',
      ex: `interface User { id: number } can be extended (interface Admin extends User) and re-opened (declaration merging, used to augment library types). type User = { id: number } can use unions (type Id = string | number), intersections (A & B), mapped and conditional types.

Rule of thumb: interfaces for public object contracts and class shapes, types for unions and composition. Mark properties optional (?) or readonly. Index signatures: [key: string]: number.`,
      pts: ['interface: extend + declaration merging', 'type: unions, tuples, mapped types', 'readonly and optional props', 'Index signatures for dictionaries'],
      code: ['typescript', `interface User {                           // object contract
  readonly id: number;                     // cannot be reassigned
  name: string;
  email?: string;                          // optional
}
interface Admin extends User {             // extension
  permissions: string[];
}
type Status = 'idle' | 'loading' | 'error'; // union — only with type
type WithTimestamps<T> = T & { createdAt: Date }; // intersection
type Scores = { [subject: string]: number }; // index signature
const a: Admin = { id: 1, name: 'Riya', permissions: ['all'] };`],
      iq: [['interface vs type?', 'Interfaces support extends and declaration merging; types support unions, tuples and advanced compositions. Both describe objects.'],
           ['What is declaration merging?', 'Multiple interface declarations with the same name merge into one — used to augment library types like Window.']],
      cq: [['Add a property to the global Window type.', `declare global {                       // augment global scope
  interface Window { analytics?: { track(e: string): void } } // merge into Window
}
export {};                              // make this file a module`]],
      err: ['Mixing interface and type inconsistently in one codebase']
    }),
    t('ts-union-intersection-literals', 'Union, Intersection & Literal Types', 'B', {
      one: 'Unions (A | B) mean "one of", intersections (A & B) mean "all of", and literal types restrict values to exact strings/numbers.',
      ex: `type Size = 'sm' | 'md' | 'lg' replaces enums in most modern code. With a union you can only access members common to all variants until you narrow. Intersections merge object types (props & HTML attributes).

Template literal types build string unions: type Event = \`on\${Capitalize<'click' | 'hover'>}\` → 'onClick' | 'onHover'.`,
      pts: ['Union = one of', 'Intersection = all of', 'String literal unions instead of enums', 'Narrow unions before using variant-specific members'],
      code: ['typescript', `type Size = 'sm' | 'md' | 'lg';                     // literal union
type Variant = 'primary' | 'ghost';
type ButtonProps = { size?: Size; variant?: Variant } & React.ButtonHTMLAttributes<HTMLButtonElement>; // intersection
function pad(size: Size): number {
  return size === 'sm' ? 4 : size === 'md' ? 8 : 12;  // all cases known
}
type Id = string | number;
function show(id: Id) {
  // id.toUpperCase();                               // ❌ number has no toUpperCase
  return typeof id === 'string' ? id.toUpperCase() : id.toFixed(0); // narrowed
}`],
      iq: [['Why prefer literal unions over enums?', 'They have zero runtime cost, are simple strings in JSON, and work naturally with narrowing.']],
      cq: [['Type allowed HTTP methods.', `type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';             // literal union
function request(url: string, method: Method = 'GET') { return fetch(url, { method }); }`]],
      err: ['Accessing variant-only properties on a union without narrowing']
    }),
    t('ts-enums', 'Enums, const enums & alternatives', 'I', {
      one: 'Enums define named constants (numeric or string); they generate runtime objects, so many teams prefer union types or as const objects.',
      ex: `Numeric enums auto-increment and create reverse mappings; string enums are clearer in logs. const enum inlines values but breaks with isolatedModules/bundlers. The newer erasableSyntaxOnly / Node type-stripping mode disallows enums because they emit code.

Alternative: const Role = { Admin: 'admin', User: 'user' } as const; type Role = (typeof Role)[keyof typeof Role]; — gives both a runtime object and a union type.`,
      pts: ['Enums emit runtime code', 'String enums > numeric enums', 'as const object = modern alternative', 'Avoid const enum with bundlers'],
      code: ['typescript', `enum Status { Active = 'active', Blocked = 'blocked' }   // string enum (runtime object)
const s: Status = Status.Active;
const Role = { Admin: 'admin', Editor: 'editor' } as const; // object alternative
type Role = (typeof Role)[keyof typeof Role];            // "admin" | "editor"
function can(role: Role) { return role === Role.Admin; } // works with plain strings from JSON`],
      iq: [['Disadvantages of enums?', 'Runtime output, numeric enum unsafety (any number assignable in older TS), incompatibility with type-stripping tools.']],
      cq: [['Iterate over all values of an as-const object.', `const ALL_ROLES = Object.values(Role);   // ["admin", "editor"] with literal types`]],
      err: ['Using numeric enums for API values']
    }),
    t('ts-assertions', 'Type Assertions, Non-null Assertion & satisfies', 'I', {
      one: 'as tells the compiler to treat a value as a type (no runtime check), ! asserts non-null, and satisfies validates a value against a type without changing its inferred type.',
      ex: `document.getElementById('app') as HTMLDivElement is common for DOM lookups. Assertions can hide real bugs — prefer narrowing (if (el instanceof HTMLDivElement)). The ! operator (user!.name) removes null/undefined from a type; use it only when you are certain.

satisfies (TS 4.9) checks a value matches a type while keeping the precise inferred literal types — ideal for config maps.`,
      pts: ['as = compile-time only', 'Prefer narrowing over assertions', '! removes null/undefined', 'satisfies keeps precise types'],
      code: ['typescript', `const canvas = document.getElementById('c') as HTMLCanvasElement; // trust me: it's a canvas
const input = document.querySelector('input');                    // HTMLInputElement | null
console.log(input!.value);                                        // non-null assertion (risky)
type Theme = Record<string, string>;
const palette = { mint: '#7cf2c8', amber: '#ffb86b' } satisfies Theme; // checked against Theme
palette.mint.toUpperCase();                                       // still knows the key exists`],
      iq: [['Type assertion vs type casting?', 'Assertions only affect compile-time checking; there is no runtime conversion or check.'],
           ['as Type vs satisfies Type?', 'as overrides the inferred type; satisfies checks compatibility but keeps the inferred type.']],
      cq: [['Safer DOM lookup helper.', `function $(sel: string): HTMLElement {
  const el = document.querySelector<HTMLElement>(sel);  // generic querySelector
  if (!el) throw new Error('Missing element ' + sel);   // runtime guarantee
  return el;                                            // narrowed to HTMLElement
}`]],
      err: ['as any to bypass errors', 'Overusing !']
    })
  ),
  m('2. Narrowing & Type Safety',
    t('ts-narrowing', 'Narrowing: typeof, instanceof, in, equality, truthiness', 'I', {
      one: 'Narrowing refines a broad type (union, unknown) to a specific one using runtime checks the compiler understands.',
      ex: `typeof for primitives, instanceof for classes (Date, Error), in for property existence, equality checks (=== null, === 'admin'), truthiness checks, Array.isArray, and control-flow analysis (early returns).

The compiler tracks narrowing through if/else, switch, ternaries and returns. Narrowing works on const and local variables; properties of objects can be invalidated by function calls.`,
      pts: ['typeof / instanceof / in', 'Early returns narrow the rest', 'Equality and truthiness checks', 'Array.isArray narrows arrays'],
      flow: ['Value of union type', 'Runtime check', 'Compiler refines type in branch', 'Safe member access'],
      code: ['typescript', `function describe(x: string | number | Date | null) {
  if (x === null) return 'nothing';               // null removed below
  if (typeof x === 'string') return x.trim();     // x: string
  if (x instanceof Date) return x.toISOString();  // x: Date
  return x.toFixed(2);                            // x: number (only option left)
}
type Fish = { swim(): void }; type Bird = { fly(): void };
function move(pet: Fish | Bird) {
  if ('swim' in pet) pet.swim();                  // narrowed to Fish
  else pet.fly();                                 // Bird
}`],
      iq: [['What is control-flow analysis?', 'The compiler follows branches and returns to know which types remain possible at each point.']],
      cq: [['Narrow unknown error in catch.', `try { risky(); }
catch (e: unknown) {                                   // catch variables are unknown in strict TS
  const msg = e instanceof Error ? e.message : String(e); // narrow before use
  console.error(msg);
}`]],
      err: ['Using as instead of narrowing']
    }),
    t('ts-type-guards', 'Custom Type Guards & Assertion Functions', 'I', {
      one: 'User-defined type guards (value is T) and assertion functions (asserts value is T) let your own runtime checks narrow types.',
      ex: `function isUser(x: unknown): x is User { … } — when it returns true, TS narrows x to User. asserts functions throw if the condition fails and narrow afterwards (assertIsDefined). Array.filter with a type predicate removes null values with correct types (TS 5.5 infers simple predicates automatically).

Guards must be correct — TS trusts them. For complex external data, generate guards from schemas (Zod's safeParse).`,
      pts: ['x is T return type', 'asserts x is T throws or narrows', 'filter with predicates removes null', 'Guards must be accurate'],
      code: ['typescript', `interface User { id: number; name: string }
function isUser(x: unknown): x is User {               // type predicate
  return typeof x === 'object' && x !== null &&
    typeof (x as any).id === 'number' && typeof (x as any).name === 'string';
}
function assertDefined<T>(v: T, msg = 'Missing value'): asserts v is NonNullable<T> {
  if (v == null) throw new Error(msg);                 // throws if null/undefined
}
const raw: unknown = JSON.parse('{"id":1,"name":"Riya"}');
if (isUser(raw)) console.log(raw.name);                // raw: User here
const el = document.querySelector('#app');
assertDefined(el); el.append('ready');                 // el: Element after the assert
const ids = [1, null, 3].filter((x): x is number => x !== null); // number[]`],
      iq: [['What is a type predicate?', 'A return type like x is User that tells the compiler the argument’s type when the function returns true.']],
      cq: [['Remove undefined from an array with correct typing.', `const defined = <T,>(x: T | undefined): x is T => x !== undefined; // generic predicate
const names = ['a', undefined, 'b'].filter(defined);                // string[]`]],
      err: ['Writing a guard that returns true for invalid data']
    }),
    t('ts-discriminated-unions', 'Discriminated Unions & Exhaustiveness (never)', 'I', {
      one: 'A discriminated union is a union of object types sharing a literal "tag" property; switching on the tag narrows each case, and never ensures every case is handled.',
      ex: `Perfect for UI state machines (idle/loading/success/error), Redux actions and API results. Each variant carries only the data valid for it — no more "loading true but data also set" impossible states.

In the default branch assign the value to a never variable: if someone adds a new variant, the compiler errors until it is handled.`,
      pts: ['Shared literal tag property', 'switch on tag narrows', 'Make impossible states unrepresentable', 'never check for exhaustiveness'],
      code: ['typescript', `type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: string[] }            // data only exists on success
  | { status: 'error'; error: string };              // error only on error
function render(s: State): string {
  switch (s.status) {                                 // discriminant
    case 'idle': return 'Start';
    case 'loading': return 'Loading…';
    case 'success': return s.data.join(', ');         // s narrowed: has data
    case 'error': return 'Error: ' + s.error;         // s narrowed: has error
    default: {
      const unreachable: never = s;                   // compile error if a case is missing
      return unreachable;
    }
  }
}`],
      iq: [['Why use discriminated unions for async state?', 'They prevent impossible combinations (data + error + loading) and force each state to be handled.']],
      cq: [['Type Redux-style actions.', `type Action = { type: 'add'; text: string } | { type: 'remove'; id: number }; // tagged actions
function reducer(state: string[], a: Action) {
  return a.type === 'add' ? [...state, a.text] : state.filter((_, i) => i !== a.id); // narrowed payloads
}`]],
      err: ['Using several booleans (isLoading, isError) instead of a status union']
    })
  ),
  m('3. Generics & Advanced Types',
    L('ts-generics'),
    t('ts-keyof-typeof-indexed', 'keyof, typeof & Indexed Access Types', 'I', {
      one: 'keyof T gives a union of T’s keys, typeof value captures a value’s type, and T[K] looks up the type of a property.',
      ex: `These let you derive types from existing values and types instead of duplicating them. typeof config creates a type from a runtime object; keyof typeof config gives its keys; (typeof arr)[number] gives the element type of an array; ReturnType<typeof fn> gives a function's return type.

Deriving types keeps a single source of truth.`,
      pts: ['keyof → key union', 'typeof value → type', 'T[K] → property type', 'Derive instead of duplicate'],
      code: ['typescript', `const config = { apiUrl: '/api', retries: 3, debug: false };
type Config = typeof config;                    // { apiUrl: string; retries: number; debug: boolean }
type ConfigKey = keyof Config;                  // "apiUrl" | "retries" | "debug"
type Retries = Config['retries'];               // number
const LANGS = ['js', 'ts', 'css'] as const;
type Lang = (typeof LANGS)[number];             // "js" | "ts" | "css"
function get<K extends ConfigKey>(key: K): Config[K] { return config[key]; } // typed getter
const r = get('retries');                       // number`],
      iq: [['How do you get the element type of an array type?', 'Indexed access with number: Arr[number].']],
      cq: [['Type of a function’s resolved return value.', `type User = Awaited<ReturnType<typeof fetchUser>>; // unwrap Promise<User> → User`]],
      err: ['Duplicating types that could be derived']
    }),
    L('ts-utility-types'),
    t('ts-mapped-conditional', 'Mapped Types, Conditional Types & infer', 'A', {
      one: 'Mapped types transform every property of a type ({ [K in keyof T]: … }); conditional types choose types with T extends U ? X : Y; infer extracts parts of types.',
      ex: `Mapped types can add/remove modifiers (readonly, ?), remap keys with as (\`get\${Capitalize<K>}\`) and filter keys (as never). Conditional types distribute over unions (T extends any ? T[] : never turns A | B into A[] | B[]).

infer captures types inside patterns: element types, function parameters, promise values, route params from string literals. These power utility types and libraries like tRPC, Zod and React Hook Form.`,
      pts: ['[K in keyof T] iterates keys', 'Key remapping with as', 'Conditional types distribute over unions', 'infer extracts nested types'],
      code: ['typescript', `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]; // remap keys to getXxx
};
type UserGetters = Getters<{ name: string; age: number }>;     // { getName(): string; getAge(): number }
type Nullable<T> = { [K in keyof T]: T[K] | null };            // add null to every prop
type ElementOf<T> = T extends readonly (infer E)[] ? E : never; // infer element
type A = ElementOf<string[]>;                                  // string
type Params<P extends string> = P extends \`\${string}:\${infer Name}/\${infer Rest}\`
  ? Name | Params<\`/\${Rest}\`> : P extends \`\${string}:\${infer Name}\` ? Name : never; // route params
type R = Params<'/users/:id/posts/:postId'>;                   // "id" | "postId"`],
      iq: [['What is a distributive conditional type?', 'When the checked type is a naked type parameter, the conditional applies to each union member separately.'],
           ['What does infer do?', 'Declares a type variable inside a conditional type pattern to capture part of the matched type.']],
      cq: [['Write your own ReturnType.', `type MyReturn<F> = F extends (...args: any[]) => infer R ? R : never; // capture the return type
type X = MyReturn<() => Promise<number>>;                              // Promise<number>`]],
      err: ['Over-clever types that are hard to read and slow to compile']
    }),
    t('ts-template-literal-types', 'Template Literal Types', 'A', {
      one: 'Template literal types build string types from other types using backtick syntax, combined with Uppercase, Lowercase, Capitalize and Uncapitalize.',
      ex: `type Color = 'red' | 'blue'; type Shade = 100 | 500; type Token = \`\${Color}-\${Shade}\` produces all four combinations. Useful for CSS tokens, event names (on\${Capitalize<E>}), i18n keys, API routes and typed string patterns.

Combine with infer to parse strings at the type level (route params). Large combinations can explode in size — keep unions small.`,
      pts: ['Backtick types combine unions', 'Intrinsic string helpers', 'Typed event names and tokens', 'Watch combinatorial explosion'],
      code: ['typescript', `type Side = 'top' | 'right' | 'bottom' | 'left';
type MarginProp = \`margin-\${Side}\`;                 // "margin-top" | "margin-right" | ...
type Events = 'click' | 'focus';
type Handlers = { [E in Events as \`on\${Capitalize<E>}\`]?: () => void }; // onClick, onFocus
type Px = \`\${number}px\`;                            // any number followed by px
const w: Px = '24px';                                 // ✅
// const h: Px = '24';                                // ❌ missing px`],
      iq: [['Give a real use of template literal types.', 'Typing CSS spacing tokens, event handler names, or i18n keys like "home.title".']],
      cq: [['Type-safe i18n keys from a nested object.', `type Paths<T, P extends string = ''> = { [K in keyof T & string]:
  T[K] extends object ? Paths<T[K], \`\${P}\${K}.\`> : \`\${P}\${K}\` }[keyof T & string]; // dot paths
type Key = Paths<{ home: { title: string; cta: string } }>;   // "home.title" | "home.cta"`]],
      err: ['Huge unions slowing the compiler']
    }),
    t('ts-branded-recursive', 'Branded Types, Recursive Types & Variance Basics', 'A', {
      one: 'Branded types add a phantom tag to prevent mixing structurally identical values (UserId vs OrderId); recursive types describe nested structures like JSON and trees.',
      ex: `TypeScript is structural: any string fits where UserId = string is expected. A brand (string & { __brand: 'UserId' }) makes UserId incompatible with plain strings and OrderId, created only via a validating function.

Recursive types: type Json = string | number | boolean | null | Json[] | { [k: string]: Json }. Variance: function parameters are checked contravariantly with strictFunctionTypes; arrays are covariant (a known unsoundness).`,
      pts: ['Structural typing allows accidental mixing', 'Brands create nominal-like types', 'Recursive types for trees/JSON', 'strictFunctionTypes for safer callbacks'],
      code: ['typescript', `type Brand<T, B> = T & { readonly __brand: B };   // phantom brand
type UserId = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;
const toUserId = (s: string): UserId => s as UserId; // the only way to create one
function loadUser(id: UserId) { /* ... */ }
loadUser(toUserId('u_1'));                         // ✅
// loadUser('o_9' as OrderId);                     // ❌ OrderId not assignable to UserId
type TreeNode = { label: string; children: TreeNode[] }; // recursive type
type Json = string | number | boolean | null | Json[] | { [key: string]: Json };`],
      iq: [['What is structural typing?', 'Compatibility is based on shape, not declared names — two types with the same members are interchangeable.']],
      cq: [['Branded positive number with validation.', `type Positive = number & { __brand: 'Positive' };
const positive = (n: number): Positive => { if (n <= 0) throw new RangeError('must be > 0'); return n as Positive; }; // validate then brand`]],
      err: ['Mixing IDs of different entities']
    })
  ),
  m('4. Classes, Modules & Configuration',
    t('ts-classes', 'Classes in TypeScript: modifiers, abstract, implements', 'I', {
      one: 'TypeScript adds access modifiers (public, private, protected), readonly, parameter properties, abstract classes and implements to JavaScript classes.',
      ex: `private/protected are compile-time only; JavaScript #private is enforced at runtime. Parameter properties (constructor(private api: ApiClient)) declare and assign in one step — heavily used in Angular services. abstract classes cannot be instantiated and can declare abstract methods subclasses must implement. implements checks a class against an interface.`,
      pts: ['private (TS) vs #private (JS)', 'Parameter properties', 'abstract classes/methods', 'implements interface contracts'],
      code: ['typescript', `interface Repo<T> { getAll(): Promise<T[]> }                 // contract
abstract class BaseRepo<T> implements Repo<T> {
  constructor(protected readonly baseUrl: string) {}          // parameter property
  async getAll(): Promise<T[]> {
    const res = await fetch(this.baseUrl + this.path());      // uses subclass path
    return res.json();
  }
  protected abstract path(): string;                          // subclasses must implement
}
class TermRepo extends BaseRepo<{ id: string }> {
  protected path() { return '/terms'; }                       // implementation
}
const repo = new TermRepo('/api');                            // ✅
// new BaseRepo('/api');                                      // ❌ cannot instantiate abstract class`],
      iq: [['private vs #private?', 'TS private is erased at compile time (accessible at runtime); #private is enforced by JavaScript.'],
           ['Abstract class vs interface?', 'Abstract classes can contain implementation and state; interfaces only describe shape and emit no code.']],
      cq: [['Singleton service class.', `class Config {
  private static instance?: Config;                       // cached instance
  private constructor(public readonly env: string) {}     // no external new
  static get() { return (this.instance ??= new Config('prod')); } // lazily create once
}`]],
      err: ['Relying on TS private for security']
    }),
    t('ts-decorators', 'Decorators', 'A', {
      one: 'Decorators are functions applied with @ to classes, methods, accessors or fields to add metadata or wrap behaviour; Angular relies heavily on them.',
      ex: `TypeScript 5 implements standard (TC39 stage 3) decorators: a method decorator receives the method and a context object and can return a replacement. Angular still uses the legacy experimentalDecorators style (@Component, @Injectable, @Input) with its compiler.

Common uses: logging, memoization, validation, dependency injection, ORMs (TypeORM), NestJS controllers.`,
      pts: ['@decorator syntax', 'TS 5 standard decorators', 'Angular uses legacy decorators', 'Wrap methods or add metadata'],
      code: ['typescript', `function log(target: Function, context: ClassMethodDecoratorContext) { // standard decorator
  const name = String(context.name);                    // method name
  return function (this: unknown, ...args: unknown[]) { // replacement method
    console.log('→', name, args);                       // before
    const result = target.apply(this, args);            // call original
    console.log('←', name, result);                     // after
    return result;
  };
}
class Cart {
  @log add(price: number, qty: number) { return price * qty; } // decorated method
}
new Cart().add(499, 2);                                 // logs call and result`],
      iq: [['What are decorators used for in Angular?', 'Attaching metadata (@Component, @Injectable, @Input, @HostListener) that the Angular compiler reads to build components and DI.']],
      cq: [['Memoize decorator.', `function memo(target: Function, ctx: ClassMethodDecoratorContext) {
  const cache = new Map<string, unknown>();                       // shared per method
  return function (this: unknown, ...a: unknown[]) {
    const k = JSON.stringify(a);                                  // cache key
    if (!cache.has(k)) cache.set(k, target.apply(this, a));       // compute once
    return cache.get(k);
  };
}`]],
      err: ['Mixing legacy and standard decorator configs']
    }),
    t('ts-modules-declarations', 'Modules, Declaration Files (.d.ts) & @types', 'I', {
      one: 'TypeScript uses ES modules; .d.ts files describe the types of JavaScript code, and @types packages provide types for libraries that do not ship their own.',
      ex: `If a library lacks types, install @types/library or write a declaration: declare module 'legacy-lib' { export function run(): void }. Declare non-code imports: declare module '*.svg'. Global augmentation adds to Window or third-party interfaces.

import type { User } from './types' imports types only (erased, avoids runtime cycles). verbatimModuleSyntax enforces explicit type imports.`,
      pts: ['.d.ts = types only, no code', '@types/* packages', 'declare module for untyped imports', 'import type for type-only imports'],
      code: ['typescript', `// types/assets.d.ts
declare module '*.svg' {                    // allow importing SVG files
  const src: string;                        // the bundler returns a URL string
  export default src;
}
declare module 'legacy-chart' {             // untyped JS library
  export function draw(el: HTMLElement, data: number[]): void;
}
// usage.ts
import type { User } from './models';       // erased at compile time
import logo from './logo.svg';              // typed as string`],
      iq: [['What is a .d.ts file?', 'A declaration file containing only type information that describes JavaScript code for the compiler.']],
      cq: [['Type environment variables in Vite.', `/// <reference types="vite/client" />
interface ImportMetaEnv { readonly VITE_API_URL: string }  // your variables
interface ImportMeta { readonly env: ImportMetaEnv }`]],
      err: ['Using any for untyped libraries instead of a small declaration']
    }),
    t('ts-tsconfig', 'tsconfig.json & Strict Mode Options', 'I', {
      one: 'tsconfig.json configures the compiler: target, module, moduleResolution, lib, paths and strictness flags like strict, noUncheckedIndexedAccess and exactOptionalPropertyTypes.',
      ex: `strict: true enables strictNullChecks, noImplicitAny, strictFunctionTypes and more — always enable it in new projects. Extra safety: noUncheckedIndexedAccess (arr[i] may be undefined), noImplicitOverride, noFallthroughCasesInSwitch.

For bundler projects: "module": "ESNext", "moduleResolution": "bundler", "noEmit": true, "isolatedModules": true, "jsx": "react-jsx". paths sets import aliases (@/components) — the bundler needs matching config. skipLibCheck speeds up builds.`,
      pts: ['Always strict: true', 'moduleResolution: bundler for Vite/Next', 'paths aliases need bundler config too', 'noUncheckedIndexedAccess for safer indexing'],
      code: ['json', `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src"]
}`],
      iq: [['What does strictNullChecks do?', 'Makes null and undefined distinct types that must be handled explicitly instead of being assignable to everything.'],
           ['Why isolatedModules?', 'Ensures each file can be transpiled independently, which tools like esbuild/SWC/Babel require.']],
      cq: [['What breaks with noUncheckedIndexedAccess?', `const arr = [1, 2];
const first = arr[0];      // type: number | undefined
console.log(first?.toFixed(1)); // must handle undefined`]],
      err: ['Disabling strict to make errors go away']
    })
  ),
  m('5. TypeScript with Frameworks & APIs',
    t('ts-react', 'TypeScript with React', 'I', {
      one: 'Typing React components: props types, children, events, hooks (useState, useRef, useReducer), context and generic components.',
      ex: `Type props with a type/interface and destructure them. children: React.ReactNode. Events: React.ChangeEvent<HTMLInputElement>, React.FormEvent<HTMLFormElement>. useState<User | null>(null) when the initial value does not reveal the type. useRef<HTMLDivElement>(null) for DOM refs.

Extend native element props: React.ComponentProps<'button'>. Generic components (<List<T> items renderItem />). Avoid React.FC for most cases (implicit children history, generics friction).`,
      pts: ['Props as type + destructuring', 'ComponentProps<"button"> to extend', 'Typed events and refs', 'Generic components for lists/tables'],
      code: ['tsx', `import { useRef, useState, type ComponentProps, type ReactNode } from 'react';
type ButtonProps = ComponentProps<'button'> & { variant?: 'primary' | 'ghost' }; // native + custom props
export function Button({ variant = 'primary', ...rest }: ButtonProps) {
  return <button data-variant={variant} {...rest} />;            // forwards onClick, disabled...
}
type ListProps<T> = { items: T[]; render: (item: T) => ReactNode }; // generic props
export function List<T>({ items, render }: ListProps<T>) {
  return <ul>{items.map((it, i) => <li key={i}>{render(it)}</li>)}</ul>;
}
export function Search() {
  const [q, setQ] = useState('');                                 // inferred string
  const inputRef = useRef<HTMLInputElement>(null);                // DOM ref
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value); // typed event
  return <input ref={inputRef} value={q} onChange={onChange} />;
}`],
      iq: [['How do you type children?', 'children: React.ReactNode (or a narrower type if needed).'],
           ['Why avoid React.FC?', 'It historically added implicit children and complicates generic components; plain functions with typed props are clearer.']],
      cq: [['Type a reducer with discriminated actions.', `type Action = { type: 'inc' } | { type: 'set'; value: number };
function reducer(s: number, a: Action): number {
  return a.type === 'inc' ? s + 1 : a.value;   // a.value only on 'set'
}
const [count, dispatch] = useReducer(reducer, 0); // dispatch accepts only valid actions`]],
      err: ['any for event types', 'useState([]) inferring never[]']
    }),
    t('ts-angular', 'TypeScript in Angular (strict templates, typed forms)', 'I', {
      one: 'Angular is written in TypeScript: strict mode, strict template type-checking, typed reactive forms, typed HttpClient and signal types.',
      ex: `Enable strict and strictTemplates so the compiler checks template bindings ([user]="..." and pipes) against component types. Typed forms (Angular 14+): new FormControl('', { nonNullable: true }) is FormControl<string>; FormBuilder infers group types.

HttpClient.get<User[]>() types responses (still no runtime validation). input<string>() / input.required<User>() and signal<T>() carry types through templates.`,
      pts: ['strictTemplates checks bindings', 'Typed reactive forms', 'Typed HttpClient generics', 'Signal inputs are typed'],
      code: ['typescript', `import { Component, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
@Component({ selector: 'app-profile', standalone: true, imports: [ReactiveFormsModule],
  template: \`<form [formGroup]="form"><input formControlName="email"></form>\` })
export class ProfileComponent {
  user = input.required<{ id: number; name: string }>();     // required typed input
  saving = signal(false);                                    // WritableSignal<boolean>
  form = new FormBuilder().nonNullable.group({               // typed form group
    email: [''], age: [18]                                   // FormControl<string>, FormControl<number>
  });
  submit() {
    const { email, age } = this.form.getRawValue();          // { email: string; age: number }
    console.log(email.toLowerCase(), age + 1);
  }
}`],
      iq: [['What does strictTemplates catch?', 'Wrong input types, misspelled properties, unsafe null access and pipe mismatches inside templates.']],
      cq: [['Typed HTTP service method.', `getTerms() { return this.http.get<Term[]>('/api/terms'); } // Observable<Term[]>`]],
      err: ['Disabling strictTemplates']
    }),
    t('ts-runtime-validation', 'Typing APIs & Runtime Validation (Zod)', 'I', {
      one: 'Types are erased at runtime, so validate external data (API responses, forms, env vars, localStorage) with schema libraries like Zod and infer TS types from the schema.',
      ex: `Define a schema once: const User = z.object({ id: z.number(), email: z.string().email() }); type User = z.infer<typeof User>. Use User.parse(data) (throws) or safeParse (returns success/error). This gives a single source of truth for types and validation.

Alternatives: Valibot (smaller), ArkType, Yup. Generate types from OpenAPI (openapi-typescript) or use end-to-end typed RPC (tRPC).`,
      pts: ['Never trust external data', 'Schema → inferred type', 'safeParse for graceful errors', 'Also validate env vars and storage'],
      flow: ['fetch JSON (unknown)', 'schema.safeParse', 'Valid: typed data', 'Invalid: show error and log'],
      code: ['typescript', `import { z } from 'zod';
const TermSchema = z.object({                    // runtime schema
  id: z.string(),
  name: z.string().min(1),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  tags: z.array(z.string()).default([])          // default when missing
});
type Term = z.infer<typeof TermSchema>;          // static type from the schema
async function getTerm(id: string): Promise<Term> {
  const json: unknown = await fetch('/api/terms/' + id).then((r) => r.json()); // untrusted
  const result = TermSchema.safeParse(json);     // validate
  if (!result.success) throw new Error('Bad API data: ' + result.error.message); // fail loudly
  return result.data;                            // fully typed and validated
}`],
      iq: [['Why validate if you already have TS types?', 'Types are compile-time only; servers, users and storage can send anything at runtime.']],
      cq: [['Validate environment variables at startup.', `const Env = z.object({ VITE_API_URL: z.string().url() }); // schema
export const env = Env.parse(import.meta.env);                // throws early if misconfigured`]],
      err: ['Casting fetch results with as User']
    })
  )
];
