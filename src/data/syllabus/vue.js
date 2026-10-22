// Vue 3 — complete syllabus
import { t, m, legacyPicker } from '../normalize.js';
import fw from '../terms/frameworks.js';
const L = legacyPicker(fw);

export default [
  m('1. Fundamentals',
    t('vue-intro-setup', 'What is Vue & Project Setup (create-vue, SFC)', 'B', {
      one: 'Vue is a progressive JavaScript framework for building UIs with reactive data and Single-File Components (.vue files combining template, script and style).',
      ex: `Progressive: drop it into a page via CDN or build full SPAs/SSR apps with Vue Router, Pinia and Nuxt. Scaffold with npm create vue@latest (Vite-based, optional TypeScript, router, Pinia, Vitest, Playwright).

An SFC has <template>, <script setup> and <style scoped>. Vue compiles templates into optimised render functions with static hoisting and patch flags; Vapor mode (opt-in) compiles to direct DOM operations without a virtual DOM.`,
      pts: ['Progressive adoption', 'Single-File Components', 'create-vue with Vite', 'Compiler-optimised templates'],
      code: ['html', `<!-- TermCard.vue -->
<script setup>
import { ref } from 'vue';                       // reactive primitive
const props = defineProps({ name: String });     // component props
const saved = ref(false);                        // local state
</script>

<template>
  <article class="card">
    <h3>{{ props.name }}</h3>                     <!-- interpolation -->
    <button @click="saved = !saved">{{ saved ? 'Saved' : 'Save' }}</button> <!-- event -->
  </article>
</template>

<style scoped>
.card { padding: 16px; border-radius: 12px; }   /* scoped to this component */
</style>`],
      iq: [['What is an SFC?', 'A .vue file containing template, script and style for one component, compiled by the Vue toolchain.'],
           ['Why is Vue called progressive?', 'You can adopt it incrementally — from enhancing a static page to full SPA/SSR applications.']],
      cq: [['Create a new Vue project.', `npm create vue@latest frontedge-vue   # choose TS, Router, Pinia, Vitest
cd frontedge-vue && npm install && npm run dev`]],
      err: ['Mixing Options and Composition API styles randomly']
    }),
    t('vue-template-syntax', 'Template Syntax: interpolation, v-bind, v-on, v-model', 'B', {
      one: 'Vue templates use {{ }} for text, v-bind (:) for attributes/props, v-on (@) for events and v-model for two-way binding on inputs and components.',
      ex: `:class and :style accept objects/arrays ({ active: isActive }). Event modifiers: @submit.prevent, @click.stop, @keyup.enter, .once. v-model modifiers: .trim, .number, .lazy. On components, v-model maps to modelValue prop + update:modelValue event (defineModel() simplifies it).

Templates compile to render functions; expressions should be simple — move logic to computed.`,
      pts: [': is v-bind, @ is v-on', 'Event modifiers like .prevent', 'v-model with .trim/.number', 'defineModel for component v-model'],
      code: ['html', `<script setup>
import { ref } from 'vue';
const query = ref('');
const age = ref(18);
const isActive = ref(true);
function search() { console.log('search', query.value); }
</script>
<template>
  <form @submit.prevent="search">                           <!-- prevent default submit -->
    <input v-model.trim="query" :aria-label="'Search terms'"> <!-- two-way + trimmed -->
    <input v-model.number="age" type="number">               <!-- converts to number -->
    <button :class="{ primary: isActive }" :disabled="!query">Go</button> <!-- bindings -->
  </form>
  <p @click.once="isActive = false">Click once</p>           <!-- one-time handler -->
</template>`],
      iq: [['What does v-model do on a component?', 'Binds the modelValue prop and listens for update:modelValue events (customisable names).']],
      cq: [['Custom input with defineModel.', `<script setup>
const model = defineModel();          // two-way bound value from parent v-model
</script>
<template><input v-model="model" /></template>`]],
      err: ['Complex logic inside template expressions']
    }),
    t('vue-directives', 'Directives: v-if, v-show, v-for, key & custom directives', 'B', {
      one: 'Built-in directives control rendering: v-if/v-else (conditional creation), v-show (CSS toggle), v-for (lists with :key), v-html, v-once, v-memo; custom directives encapsulate DOM behaviour.',
      ex: `v-if destroys/creates elements (cheaper initial cost); v-show toggles display (cheaper frequent toggling). v-for="item in items" :key="item.id" — keys must be stable. Don't use v-if and v-for on the same element (v-if has higher priority in Vue 3); filter with computed instead.

v-html renders raw HTML (XSS risk). Custom directives (v-focus) use hooks like mounted/updated/unmounted.`,
      pts: ['v-if vs v-show', 'v-for needs stable :key', 'Avoid v-if with v-for on same element', 'Custom directives for DOM behaviour'],
      code: ['html', `<script setup>
import { ref, computed } from 'vue';
const terms = ref([{ id: 1, name: 'ref', done: true }, { id: 2, name: 'computed', done: false }]);
const open = ref(false);
const pending = computed(() => terms.value.filter((t) => !t.done)); // filter instead of v-if in v-for
const vFocus = { mounted: (el) => el.focus() };                      // custom directive (script setup naming)
</script>
<template>
  <input v-focus placeholder="Auto-focused">                          <!-- custom directive -->
  <ul><li v-for="t in pending" :key="t.id">{{ t.name }}</li></ul>     <!-- list with key -->
  <p v-if="pending.length === 0">All done</p>                         <!-- created only when true -->
  <div v-show="open">Panel</div>                                      <!-- toggled via display -->
</template>`],
      iq: [['v-if vs v-show?', 'v-if adds/removes elements (and components); v-show keeps them and toggles CSS display.']],
      cq: [['Click-outside custom directive.', `const vClickOutside = {
  mounted(el, binding) { el._h = (e) => !el.contains(e.target) && binding.value(e); document.addEventListener('click', el._h); },
  unmounted(el) { document.removeEventListener('click', el._h); } // cleanup
};`]],
      err: ['v-html with user content', 'Index as key']
    }),
    t('vue-components-props-emits', 'Components: props, emits, slots', 'B', {
      one: 'Components receive data via props (defineProps), notify parents via events (defineEmits) and accept content via slots (default, named, scoped).',
      ex: `Props are read-only; validate with types/required/default (or TS types). Emit events in kebab-case listened as @update-item. Slots: <slot> for default content, <slot name="footer">, scoped slots pass data back to the parent (<slot :item="item">) — the basis of flexible list/table components.

Fallthrough attributes (class, listeners) apply to the root element automatically; control with inheritAttrs and $attrs.`,
      pts: ['defineProps / defineEmits', 'Props are read-only', 'Named and scoped slots', 'Fallthrough attributes'],
      flow: ['Parent passes props', 'Child renders and exposes slots', 'Child emits event', 'Parent handler updates state'],
      code: ['html', `<!-- TermList.vue -->
<script setup lang="ts">
const props = defineProps<{ items: { id: string; name: string }[] }>(); // typed props
const emit = defineEmits<{ select: [id: string] }>();                    // typed event
</script>
<template>
  <ul>
    <li v-for="item in props.items" :key="item.id" @click="emit('select', item.id)">
      <slot name="row" :item="item">{{ item.name }}</slot>  <!-- scoped slot with fallback -->
    </li>
  </ul>
</template>
<!-- Parent -->
<!-- <TermList :items="terms" @select="open">
       <template #row="{ item }"><strong>{{ item.name }}</strong></template>
     </TermList> -->`],
      iq: [['What is a scoped slot?', 'A slot that passes data from the child to the parent’s slot content, letting the parent customise rendering with child data.']],
      cq: [['Prop with default and validator.', `defineProps({ size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) } })`]],
      err: ['Mutating props directly']
    }),
    t('vue-options-api', 'Options API (data, methods, computed, watch)', 'B', {
      one: 'The original Vue API organises a component by options: data(), methods, computed, watch, props and lifecycle hooks, with this referring to the component instance.',
      ex: `Still fully supported and common in Vue 2 → Vue 3 codebases. Logic for one feature gets spread across options, which is why the Composition API was introduced for larger components and reuse (composables replace mixins).

Know how to read and convert between both styles.`,
      pts: ['data/methods/computed/watch', 'this = instance', 'Mixins (legacy) → composables', 'Still supported'],
      code: ['javascript', `export default {
  props: { initial: { type: Number, default: 0 } },  // props
  data() { return { count: this.initial }; },        // reactive state
  computed: { double() { return this.count * 2; } }, // cached derived value
  watch: { count(newV, oldV) { console.log(oldV, '→', newV); } }, // react to changes
  methods: { inc() { this.count++; } },              // functions
  mounted() { console.log('mounted'); }              // lifecycle hook
};`],
      iq: [['Options vs Composition API?', 'Options organises by option type; Composition organises by logical concern and enables better reuse and TypeScript inference.']],
      cq: [['Convert data + computed to Composition API.', `const count = ref(props.initial);                 // data
const double = computed(() => count.value * 2);    // computed`]],
      err: ['Arrow functions for methods (this is lost)']
    }),
    L('vue-composition'),
    t('vue-lifecycle', 'Lifecycle Hooks', 'B', {
      one: 'Hooks run at component stages: onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onErrorCaptured, plus onActivated/onDeactivated for KeepAlive.',
      ex: `onMounted: DOM is available (measure, focus, third-party libs). onUnmounted: cleanup timers/listeners/subscriptions. setup itself runs before mount (no DOM yet). In SSR, only setup and serverPrefetch run on the server — mounted hooks are client-only.`,
      pts: ['onMounted for DOM work', 'onUnmounted for cleanup', 'setup runs first', 'Mounted hooks are client-only'],
      flow: ['setup', 'onBeforeMount', 'onMounted', 'onUpdated on changes', 'onUnmounted'],
      code: ['html', `<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
const width = ref(0);
const update = () => (width.value = window.innerWidth);      // handler
onMounted(() => { update(); window.addEventListener('resize', update); }); // DOM ready
onUnmounted(() => window.removeEventListener('resize', update));          // cleanup
</script>
<template><p>Width: {{ width }}</p></template>`],
      iq: [['Where should you fetch data in Vue?', 'In setup (top-level await with Suspense) or onMounted for client-only; in Nuxt use useFetch/useAsyncData.']],
      cq: [['Template ref + onMounted focus.', `const input = ref(null);                 // <input ref="input">
onMounted(() => input.value.focus());    // element available after mount`]],
      err: ['Accessing DOM in setup before mount']
    })
  ),
  m('2. Reactivity & Reuse',
    t('vue-reactivity-deep', 'Reactivity in Depth: Proxy, shallowRef, toRefs, nextTick', 'A', {
      one: 'Vue 3 reactivity uses Proxies to track property reads (effects) and trigger updates on writes; helpers control depth and conversion.',
      ex: `reactive() returns a deep Proxy; ref() wraps any value (.value). Destructuring a reactive object loses reactivity — use toRefs/toRef. shallowRef/shallowReactive only track top-level changes (large immutable data, performance). markRaw opts objects out (third-party instances).

DOM updates are batched asynchronously: after changing state, await nextTick() before reading updated DOM. watchEffect auto-tracks; watch with { deep: true, immediate: true } options.`,
      pts: ['Proxy-based tracking', 'toRefs for destructuring', 'shallowRef for big data', 'nextTick before reading DOM'],
      flow: ['Effect reads reactive property', 'Dependency tracked', 'Property written', 'Effects scheduled', 'DOM patched next tick'],
      code: ['javascript', `import { reactive, toRefs, shallowRef, nextTick, watch } from 'vue';
const state = reactive({ user: { name: 'Riya' }, count: 0 }); // deep reactive proxy
const { count } = toRefs(state);                 // stays linked to state.count
count.value++;                                   // updates state.count
const bigList = shallowRef([]);                  // only .value replacement is tracked
bigList.value = await fetchHugeList();           // triggers once
watch(() => state.user.name, (n, o) => console.log(o, '→', n)); // watch a getter
state.user.name = 'Aman';
await nextTick();                                // DOM now reflects the change`],
      iq: [['Why does destructuring reactive() break reactivity?', 'You copy plain values out of the proxy; use toRefs to create refs linked to the source.'],
           ['What is nextTick for?', 'Waiting until Vue has flushed batched DOM updates after state changes.']],
      cq: [['Watch multiple sources.', `watch([firstName, lastName], ([f, l]) => (full.value = f + ' ' + l)); // array of sources`]],
      err: ['Replacing a reactive() object entirely (loses reactivity)']
    }),
    t('vue-composables', 'Composables', 'I', {
      one: 'Composables are functions using Composition API (ref, computed, watch, lifecycle) to encapsulate and reuse stateful logic — Vue’s equivalent of React custom hooks.',
      ex: `Name them useXxx, return refs (so destructuring stays reactive), accept refs/getters as inputs (toValue unwraps them), and clean up side effects with onUnmounted/onScopeDispose. VueUse provides 200+ ready composables (useLocalStorage, useMouse, useFetch).`,
      pts: ['useXxx naming', 'Return refs', 'Accept refs/getters via toValue', 'Cleanup with onScopeDispose'],
      code: ['javascript', `import { ref, watchEffect, toValue, onScopeDispose } from 'vue';
export function useFetch(url) {                          // url can be a string, ref or getter
  const data = ref(null), error = ref(null), loading = ref(false);
  let controller;
  watchEffect(async () => {                              // re-runs when url changes
    controller?.abort(); controller = new AbortController(); // cancel stale request
    loading.value = true; error.value = null;
    try { data.value = await fetch(toValue(url), { signal: controller.signal }).then((r) => r.json()); }
    catch (e) { if (e.name !== 'AbortError') error.value = e; }
    finally { loading.value = false; }
  });
  onScopeDispose(() => controller?.abort());             // cleanup on unmount
  return { data, error, loading };                       // refs
}
// const { data, loading } = useFetch(() => '/api/terms/' + id.value);`],
      iq: [['Composables vs mixins?', 'Composables have explicit inputs/outputs, no name collisions and clear origin of properties; mixins merged implicitly.']],
      cq: [['useToggle composable.', `export const useToggle = (init = false) => { const on = ref(init); return { on, toggle: () => (on.value = !on.value) }; };`]],
      err: ['Returning reactive() objects that callers destructure']
    }),
    t('vue-provide-inject', 'provide / inject', 'I', {
      one: 'provide() makes a value available to all descendants and inject() reads it, avoiding prop drilling for themes, config and services.',
      ex: `Provide refs or reactive objects so injected values stay reactive. Use Symbol keys (InjectionKey for TypeScript typing) to avoid collisions, provide readonly() data plus mutation functions to keep updates centralised, and give inject a default.

App-level provide (app.provide) works for plugins. For larger shared state use Pinia.`,
      pts: ['Ancestor provides, descendant injects', 'Provide refs for reactivity', 'Symbol/InjectionKey keys', 'readonly + mutation functions'],
      code: ['javascript', `// theme.js
import { inject, provide, readonly, ref } from 'vue';
const ThemeKey = Symbol('theme');                        // unique key
export function provideTheme() {
  const theme = ref('dark');
  const toggle = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark');
  provide(ThemeKey, { theme: readonly(theme), toggle }); // read-only state + updater
}
export function useTheme() {
  const ctx = inject(ThemeKey);                          // from nearest provider
  if (!ctx) throw new Error('provideTheme() missing');   // helpful error
  return ctx;
}`],
      iq: [['provide/inject vs Pinia?', 'provide/inject scopes values to a subtree (component libraries, contexts); Pinia is a global store with devtools and plugins.']],
      cq: [['Typed injection key.', `import type { InjectionKey, Ref } from 'vue';
export const UserKey: InjectionKey<Ref<string>> = Symbol('user'); // inject(UserKey) is typed`]],
      err: ['Providing plain values expecting reactivity']
    })
  ),
  m('3. Ecosystem',
    t('vue-router', 'Vue Router', 'B', {
      one: 'Vue Router maps URLs to components with nested routes, dynamic params, navigation guards and lazy loading.',
      ex: `createRouter({ history: createWebHistory(), routes }). <RouterView> renders matched components, <RouterLink to> navigates. useRoute() reads params/query, useRouter() navigates. Lazy routes: component: () => import('./views/Admin.vue'). Guards: router.beforeEach for auth, per-route beforeEnter, in-component onBeforeRouteLeave for unsaved changes.

Typed routes are available via unplugin-vue-router / Nuxt file-based routing.`,
      pts: ['RouterView + RouterLink', 'useRoute / useRouter', 'Lazy route components', 'beforeEach guards'],
      code: ['javascript', `import { createRouter, createWebHistory } from 'vue-router';
const routes = [
  { path: '/', component: () => import('./views/Home.vue') },                    // lazy
  { path: '/term/:id', component: () => import('./views/Term.vue'), props: true }, // param as prop
  { path: '/admin', component: () => import('./views/Admin.vue'), meta: { auth: true } },
  { path: '/:pathMatch(.*)*', component: () => import('./views/NotFound.vue') }    // 404
];
export const router = createRouter({ history: createWebHistory(), routes });
router.beforeEach((to) => {                                                        // global guard
  if (to.meta.auth && !isLoggedIn()) return { path: '/login', query: { next: to.fullPath } }; // redirect
});`],
      iq: [['createWebHistory vs createWebHashHistory?', 'Web history uses clean URLs (needs server fallback to index.html); hash history uses #/paths and works on any static host.']],
      cq: [['Navigate with query params.', `const router = useRouter(); router.push({ path: '/mock', query: { level: 'senior' } });`]],
      err: ['No server fallback for history mode (404 on refresh)']
    }),
    t('vue-pinia', 'Pinia State Management', 'I', {
      one: 'Pinia is Vue’s official store: define stores with state, getters and actions (or setup syntax), with devtools, TypeScript support and SSR.',
      ex: `defineStore('cart', () => { … }) setup stores use ref/computed/functions like composables. Use storeToRefs to destructure reactive state. Actions can be async. Plugins add persistence (pinia-plugin-persistedstate). Pinia replaced Vuex (no mutations, simpler API).`,
      pts: ['Official store, replaces Vuex', 'Setup or options syntax', 'storeToRefs for destructuring', 'Plugins for persistence'],
      code: ['javascript', `import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
export const useSavedStore = defineStore('saved', () => {    // setup store
  const ids = ref([]);                                        // state
  const count = computed(() => ids.value.length);             // getter
  function toggle(id) {                                       // action
    ids.value = ids.value.includes(id) ? ids.value.filter((x) => x !== id) : [...ids.value, id];
  }
  return { ids, count, toggle };
});
// In a component:
// const store = useSavedStore();
// const { count } = storeToRefs(store);   // reactive destructuring
// store.toggle('vue-pinia');`],
      iq: [['Pinia vs Vuex?', 'Pinia has no mutations, better TypeScript inference, modular stores by default and a composable-like API.']],
      cq: [['Reset a setup store.', `function $reset() { ids.value = []; } // setup stores must implement reset manually`]],
      err: ['Destructuring store without storeToRefs']
    }),
    t('vue-built-ins', 'Built-in Components: Transition, KeepAlive, Teleport, Suspense', 'I', {
      one: 'Vue ships components for animations (Transition, TransitionGroup), caching component state (KeepAlive), rendering elsewhere in the DOM (Teleport) and async loading states (Suspense).',
      ex: `<Transition name="fade"> applies enter/leave classes (fade-enter-from, fade-leave-to) for CSS animations. <TransitionGroup> animates lists. <KeepAlive> caches inactive components (tabs) preserving state; include/exclude/max control it. <Teleport to="body"> renders modals outside overflow containers. <Suspense> shows fallback while async setup/components resolve (experimental).`,
      pts: ['Transition classes for CSS animation', 'KeepAlive preserves tab state', 'Teleport for modals', 'Suspense for async setup'],
      code: ['html', `<template>
  <Transition name="fade">                                  <!-- animates enter/leave -->
    <p v-if="show">Saved!</p>
  </Transition>
  <KeepAlive :max="5">                                      <!-- cache up to 5 tab components -->
    <component :is="tabs[current]" />
  </KeepAlive>
  <Teleport to="body">                                      <!-- render at the end of body -->
    <div v-if="modalOpen" class="modal" role="dialog">Modal</div>
  </Teleport>
</template>
<style>
.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>`],
      iq: [['When use KeepAlive?', 'When switching between components (tabs) should preserve their state instead of re-creating them.']],
      cq: [['Animate list reordering.', `<TransitionGroup name="list" tag="ul"><li v-for="t in terms" :key="t.id">{{ t.name }}</li></TransitionGroup>
<!-- CSS: .list-move { transition: transform .3s; } -->`]],
      err: ['Missing keys inside TransitionGroup']
    }),
    t('vue-nuxt', 'Nuxt: SSR, file routing & data fetching', 'I', {
      one: 'Nuxt is the full-stack Vue framework with file-based routing, SSR/SSG/hybrid rendering, auto-imports, server API routes (Nitro) and data fetching composables.',
      ex: `pages/term/[id].vue becomes /term/:id. useFetch/useAsyncData fetch on the server and hydrate without double requests. server/api/*.ts defines endpoints. routeRules configure per-route rendering (prerender, swr, isr, ssr: false). Modules add features (Tailwind, i18n, image, content). useHead/useSeoMeta for SEO.

Deploy anywhere via Nitro presets (Vercel, Netlify, Node, Cloudflare).`,
      pts: ['File routing + auto-imports', 'useFetch avoids double fetching', 'routeRules for hybrid rendering', 'server/api endpoints'],
      code: ['html', `<!-- pages/term/[id].vue -->
<script setup>
const route = useRoute();                                       // auto-imported
const { data: term, error } = await useFetch('/api/terms/' + route.params.id); // SSR + hydration
useSeoMeta({ title: () => term.value?.name, description: () => term.value?.oneLiner }); // SEO
</script>
<template>
  <p v-if="error">Not found</p>
  <article v-else><h1>{{ term.name }}</h1></article>
</template>
<!-- server/api/terms/[id].get.ts: export default defineEventHandler((e) => getTerm(getRouterParam(e, 'id'))) -->`],
      iq: [['Why use useFetch instead of fetch in Nuxt pages?', 'It runs on the server during SSR, transfers the result to the client and avoids fetching again during hydration.']],
      cq: [['Prerender some routes and cache others.', `export default defineNuxtConfig({ routeRules: { '/': { prerender: true }, '/term/**': { swr: 3600 } } }); // hybrid`]],
      err: ['Using browser APIs in setup during SSR']
    }),
    t('vue-testing-ts', 'Testing & TypeScript in Vue', 'I', {
      one: 'Test Vue components with Vitest + Vue Test Utils or Testing Library, E2E with Playwright/Cypress, and use TypeScript with <script setup lang="ts"> and vue-tsc.',
      ex: `mount(Component, { props, global: { plugins: [pinia, router] } }) renders a component; trigger events with await wrapper.trigger('click'); assert emitted events with wrapper.emitted(). createTestingPinia stubs stores.

TS: defineProps<{…}>(), defineEmits<{…}>(), typed refs (ref<User | null>(null)), vue-tsc --noEmit for type-checking SFCs, Volar (Vue - Official) extension for editor support.`,
      pts: ['Vitest + Vue Test Utils', 'createTestingPinia', 'Type-based defineProps/defineEmits', 'vue-tsc for type checks'],
      code: ['javascript', `import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TermList from './TermList.vue';
describe('TermList', () => {
  it('emits select with the id', async () => {
    const wrapper = mount(TermList, { props: { items: [{ id: 'a', name: 'ref' }] } }); // render with props
    await wrapper.find('li').trigger('click');                    // simulate click
    expect(wrapper.emitted('select')[0]).toEqual(['a']);          // assert event payload
  });
});`],
      iq: [['How do you type-check .vue files?', 'Run vue-tsc --noEmit; editors use the Vue - Official (Volar) extension.']],
      cq: [['Typed template ref.', `const input = ref<HTMLInputElement | null>(null); // <input ref="input">`]],
      err: ['Testing internal state instead of rendered output']
    })
  )
];
