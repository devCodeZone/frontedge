// Angular — complete syllabus (v17–v20+, standalone & signals first)
import { t, m, legacyPicker } from '../normalize.js';
import fw from '../terms/frameworks.js';
const L = legacyPicker(fw);

export default [
  m('1. Fundamentals',
    t('ng-intro-cli', 'What is Angular & the Angular CLI', 'B', {
      one: 'Angular is a full TypeScript framework by Google with components, dependency injection, routing, forms, HTTP and testing built in; the Angular CLI scaffolds, serves, builds and updates projects.',
      ex: `Unlike React (a library), Angular is opinionated and batteries-included — popular in enterprises (banking, logistics, large portals). Modern Angular (v17+) uses standalone components, signals, new control flow (@if/@for), deferrable views, esbuild/Vite-based builds and optional zoneless change detection.

CLI: ng new, ng serve, ng generate component|service|guard, ng build, ng test, ng update (guided version upgrades), ng add (install libraries with schematics).`,
      pts: ['Full framework, TypeScript-first', 'Standalone + signals in modern Angular', 'CLI generators and ng update', 'Enterprise favourite'],
      flow: ['ng new', 'ng generate', 'ng serve (dev)', 'ng test', 'ng build (production)'],
      code: ['bash', `npm install -g @angular/cli          # install the CLI
ng new frontedge --style=scss --ssr  # new project with SCSS and SSR
cd frontedge && ng serve -o          # dev server + open browser
ng generate component term-card      # creates standalone component files
ng generate service data/terms       # creates an injectable service
ng update @angular/core @angular/cli # upgrade versions with migrations`],
      iq: [['Angular vs React?', 'Angular is a complete framework (DI, router, forms, HTTP, testing) with strong conventions; React is a UI library composed with other libraries.'],
           ['What does ng update do?', 'Updates Angular packages and runs automatic code migrations for breaking changes.']],
      cq: [['Build for production.', `ng build --configuration production   # optimised bundles in dist/`]],
      err: ['Skipping ng update migrations when upgrading']
    }),
    t('ng-components', 'Components: decorator, template, styles, standalone', 'B', {
      one: 'A component is a TypeScript class with a @Component decorator defining its selector, template, styles and imports; standalone components are the default since v19.',
      ex: `selector is the custom tag (<app-term-card>). template/templateUrl holds HTML; styles/styleUrl hold CSS scoped to the component (emulated encapsulation). imports lists the components, directives and pipes used in the template (no NgModule needed).

Components should be small and focused: presentational (inputs/outputs) vs container (data, services). Use ChangeDetectionStrategy.OnPush for performance.`,
      pts: ['@Component metadata', 'Standalone with imports array', 'Scoped styles by default', 'OnPush for performance'],
      code: ['typescript', `import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'app-term-card',                       // used as <app-term-card>
  imports: [],                                     // other components/pipes used in template
  template: \`
    <article class="card">
      <h3>{{ name() }}</h3>                         <!-- read a signal input -->
      <p>{{ oneLiner() }}</p>
    </article>\`,
  styles: [\`.card { padding: 16px; border-radius: 12px; }\`], // scoped to this component
  changeDetection: ChangeDetectionStrategy.OnPush   // check only when inputs/signals change
})
export class TermCardComponent {
  name = input.required<string>();                 // required input signal
  oneLiner = input('');                            // optional with default
}`],
      iq: [['What is a standalone component?', 'A component that declares its own dependencies in imports without belonging to an NgModule.'],
           ['How are component styles scoped?', 'Emulated view encapsulation adds unique attributes to elements and selectors (ShadowDom and None are alternatives).']],
      cq: [['Bootstrap a standalone app.', `import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
bootstrapApplication(AppComponent, appConfig);   // no AppModule needed`]],
      err: ['Huge components mixing data loading and presentation']
    }),
    t('ng-data-binding', 'Data Binding: interpolation, property, event, two-way', 'B', {
      one: 'Angular binds data between class and template: {{ }} interpolation, [property] binding, (event) binding and [(ngModel)]/model() two-way binding.',
      ex: `Interpolation renders text; [disabled]="isSaving()" sets DOM properties; [attr.aria-label] sets attributes; [class.active] and [style.width.px] toggle classes/styles; (click)="save()" listens to events with $event; [(value)] combines [value] and (valueChange).

Templates should call cheap functions/signals only — heavy logic belongs in computed signals or pipes.`,
      pts: ['{{ }} text', '[prop] DOM properties', '(event) handlers with $event', '[(x)] two-way binding'],
      dia: `flowchart LR
  C["Component class"] -- "{{ }} and [prop]" --> T["Template / DOM"]
  T -- "(event)" --> C
  C <-- "[(ngModel)] / model()" --> T`,
      code: ['typescript', `@Component({
  selector: 'app-search',
  imports: [FormsModule],
  template: \`
    <h2>{{ title }}</h2>                                     <!-- interpolation -->
    <input [(ngModel)]="query" [attr.aria-label]="title">    <!-- two-way + attribute binding -->
    <button [disabled]="!query" (click)="search($event)"
            [class.primary]="query.length > 2">Search</button> <!-- property, event, class binding -->
    <div [style.width.%]="progress">Progress</div>           <!-- style binding with unit -->\`
})
export class SearchComponent {
  title = 'Search terms';
  query = '';
  progress = 40;
  search(e: MouseEvent) { console.log('searching', this.query, e.type); } // receives $event
}`],
      iq: [['Property binding vs attribute binding?', '[prop] sets DOM properties; [attr.x] sets HTML attributes (needed for aria-*, colspan, etc.).'],
           ['What does [(ngModel)] desugar to?', '[ngModel]="x" (ngModelChange)="x = $event".']],
      cq: [['Two-way binding on a custom component with model().', `export class Rating { value = model(0); }          // creates value input + valueChange output
// parent: <app-rating [(value)]="stars" />`]],
      err: ['Calling expensive methods in templates']
    }),
    t('ng-control-flow', 'Built-in Control Flow: @if, @for, @switch, @let', 'B', {
      one: 'Angular’s template control flow blocks (v17+) replace *ngIf/*ngFor/*ngSwitch with faster, more readable @if, @for (with required track), @switch and @let.',
      ex: `@if (user(); as u) { … } @else { … }. @for (item of items(); track item.id; let i = $index) { … } @empty { … } — track is mandatory for efficient DOM reuse. @switch (status) { @case ('ok') { … } @default { … } }. @let declares template variables.

ng generate @angular/core:control-flow migrates old syntax automatically.`,
      pts: ['@for requires track', '@empty for empty lists', '@let template variables', 'Migration schematic available'],
      code: ['html', `@if (terms().length) {                                   <!-- condition -->
  <ul>
    @for (t of terms(); track t.id; let i = $index) {     <!-- track by id, index variable -->
      <li>{{ i + 1 }}. {{ t.name }}</li>
    } @empty {
      <li>No terms</li>                                    <!-- shown when list is empty -->
    }
  </ul>
} @else {
  <p>Loading…</p>
}
@switch (level()) {                                       <!-- switch on a value -->
  @case ('Beginner') { <span class="green">B</span> }
  @default { <span>?</span> }
}
@let total = terms().length;                              <!-- template variable -->
<p>Total: {{ total }}</p>`],
      iq: [['Why is track required in @for?', 'It lets Angular identify items across changes and reuse DOM nodes instead of recreating them.'],
           ['Benefits of new control flow over *ngIf?', 'No imports needed, better type narrowing, faster runtime, and @empty/@else built in.']],
      cq: [['Old vs new syntax.', `<!-- old --> <li *ngFor="let t of terms; trackBy: byId">{{ t.name }}</li>
<!-- new --> @for (t of terms; track t.id) { <li>{{ t.name }}</li> }`]],
      err: ['track $index on reorderable lists']
    }),
    t('ng-directives', 'Directives: attribute, structural & custom directives', 'I', {
      one: 'Directives add behaviour to elements: attribute directives (ngClass, ngStyle, custom highlight), structural directives (ngTemplateOutlet, custom *if-like) and component directives.',
      ex: `Custom attribute directive: @Directive({ selector: '[appAutofocus]' }) with inject(ElementRef), host bindings/listeners via the host metadata property. Directive composition API (hostDirectives) reuses behaviour across components.

Structural directives manipulate templates with TemplateRef and ViewContainerRef (e.g. *appHasRole="'admin'").`,
      pts: ['Attribute directives change behaviour/appearance', 'host property for bindings/listeners', 'Structural directives use TemplateRef', 'hostDirectives for composition'],
      code: ['typescript', `import { Directive, ElementRef, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
@Directive({
  selector: '[appAutofocus]',                     // used as an attribute
  host: { '(keydown.escape)': 'blur()' }          // host listener without decorators
})
export class AutofocusDirective {
  private el = inject(ElementRef<HTMLElement>);   // the host element
  ngAfterViewInit() { this.el.nativeElement.focus(); } // focus after render
  blur() { this.el.nativeElement.blur(); }
}
@Directive({ selector: '[appHasRole]' })
export class HasRoleDirective {                    // structural: <div *appHasRole="'admin'">
  appHasRole = input.required<string>();
  private tpl = inject(TemplateRef);              // the element as a template
  private vcr = inject(ViewContainerRef);         // where to render it
  constructor() {
    effect(() => {
      this.vcr.clear();                           // remove existing view
      if (currentUserRole() === this.appHasRole()) this.vcr.createEmbeddedView(this.tpl); // render if allowed
    });
  }
}`],
      iq: [['Component vs directive?', 'A component is a directive with a template; directives add behaviour to existing elements.']],
      cq: [['Click-outside directive.', `@Directive({ selector: '[appClickOutside]', host: { '(document:click)': 'onDoc($event)' } })
export class ClickOutside { out = output<void>(); el = inject(ElementRef);
  onDoc(e: Event) { if (!this.el.nativeElement.contains(e.target)) this.out.emit(); } } // emit when outside`]],
      err: ['Direct DOM manipulation instead of Renderer/bindings for SSR-safe code']
    }),
    t('ng-pipes', 'Pipes: built-in, custom, pure vs impure, async pipe', 'B', {
      one: 'Pipes transform values in templates: date, currency, uppercase, percent, json, async, plus custom pipes; pure pipes run only when inputs change.',
      ex: `{{ price | currency:'INR' }}, {{ created | date:'mediumDate' }}, {{ obs$ | async }} (subscribes and unsubscribes automatically). Custom pipes implement PipeTransform. Pure pipes (default) are memoised by input reference — great for performance; impure pipes run on every change detection (avoid).

Prefer pipes or computed signals over calling methods in templates.`,
      pts: ['Built-in date/currency/async pipes', 'Custom PipeTransform', 'Pure = memoised by input', 'async pipe manages subscriptions'],
      code: ['typescript', `import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'readingTime' })                         // pure by default
export class ReadingTimePipe implements PipeTransform {
  transform(text: string, wpm = 200): string {          // value + optional argument
    const minutes = Math.ceil(text.split(/\\s+/).length / wpm); // compute minutes
    return minutes + ' min read';
  }
}
// template:
// {{ term.explanation | readingTime }}               → "2 min read"
// {{ 49999 | currency:'INR':'symbol':'1.0-0' }}       → "₹49,999"
// {{ terms$ | async | json }}                         → subscribes for you`],
      iq: [['Pure vs impure pipes?', 'Pure pipes recompute only when input references change; impure pipes run every change detection cycle.']],
      cq: [['Truncate pipe with ellipsis.', `@Pipe({ name: 'truncate' }) export class TruncatePipe implements PipeTransform {
  transform(v: string, n = 80) { return v.length > n ? v.slice(0, n) + '…' : v; } }`]],
      err: ['Impure pipes for filtering large lists']
    }),
    t('ng-inputs-outputs', 'Component Communication: input(), output(), model()', 'B', {
      one: 'Parents pass data with inputs and children notify parents with outputs; signal-based input(), output() and model() replace @Input/@Output decorators.',
      ex: `input<T>() returns a read-only signal; input.required<T>() forces the parent to bind it; transform and alias options exist. output<T>() returns an emitter (this.saved.emit(value)). model() creates two-way bindable inputs.

Other communication: shared services with signals/subjects, @ViewChild/viewChild() to call child APIs, content projection, router state.`,
      pts: ['input() read-only signal', 'output().emit()', 'model() for two-way', 'Services for distant components'],
      flow: ['Parent binds [input]', 'Child reads input()', 'Child emits output', 'Parent handles (event)'],
      code: ['typescript', `@Component({
  selector: 'app-term-row',
  template: \`<li>{{ term().name }} <button (click)="save.emit(term().id)">Save</button></li>\`
})
export class TermRowComponent {
  term = input.required<{ id: string; name: string }>();   // from parent
  save = output<string>();                                  // to parent
}
@Component({
  selector: 'app-term-list',
  imports: [TermRowComponent],
  template: \`@for (t of terms; track t.id) { <app-term-row [term]="t" (save)="onSave($event)" /> }\`
})
export class TermListComponent {
  terms = [{ id: 'js-closures', name: 'Closures' }];
  onSave(id: string) { console.log('saved', id); }          // handles child event
}`],
      iq: [['@Input vs input()?', 'input() returns a signal (reactive, works with computed/effect, better type inference); @Input is the decorator-based legacy API.']],
      cq: [['Transform an input string to boolean.', `disabled = input(false, { transform: booleanAttribute }); // <app-x disabled> works`]],
      err: ['Mutating input objects inside the child']
    }),
    t('ng-lifecycle-hooks', 'Lifecycle Hooks', 'I', {
      one: 'Angular calls lifecycle hooks at key moments: ngOnChanges, ngOnInit, ngDoCheck, ngAfterContentInit/Checked, ngAfterViewInit/Checked, ngOnDestroy, plus afterNextRender/afterRender.',
      ex: `ngOnInit: initialisation after inputs are set (fetch data). ngOnChanges: when @Input values change (with SimpleChanges). ngAfterViewInit: view and child views ready (access viewChild). ngOnDestroy: cleanup (or use DestroyRef / takeUntilDestroyed). afterNextRender runs browser-only code safely in SSR apps.

With signals, many hooks are replaced by computed/effect and input signals.`,
      pts: ['ngOnInit for init logic', 'ngAfterViewInit for view children', 'ngOnDestroy / DestroyRef for cleanup', 'afterNextRender for browser-only code'],
      flow: ['constructor', 'ngOnChanges', 'ngOnInit', 'ngAfterContentInit', 'ngAfterViewInit', 'ngOnDestroy'],
      code: ['typescript', `import { Component, DestroyRef, OnInit, afterNextRender, inject } from '@angular/core';
@Component({ selector: 'app-clock', template: '{{ now }}' })
export class ClockComponent implements OnInit {
  now = new Date().toLocaleTimeString();
  private destroyRef = inject(DestroyRef);
  constructor() {
    afterNextRender(() => console.log('Browser only: DOM is ready')); // safe with SSR
  }
  ngOnInit() {                                               // inputs ready
    const id = setInterval(() => (this.now = new Date().toLocaleTimeString()), 1000);
    this.destroyRef.onDestroy(() => clearInterval(id));       // cleanup on destroy
  }
}`],
      iq: [['constructor vs ngOnInit?', 'Constructor is for DI and simple field setup; ngOnInit runs after input bindings are set, for initialisation logic.']],
      cq: [['React to input changes with ngOnChanges.', `ngOnChanges(changes: SimpleChanges) {
  if (changes['termId'] && !changes['termId'].firstChange) this.load(changes['termId'].currentValue); // reload on change
}`]],
      err: ['Accessing view children in ngOnInit']
    }),
    t('ng-view-content-projection', 'Content Projection, ViewChild & Template References', 'I', {
      one: 'ng-content projects parent markup into a component; viewChild/contentChild query elements and components; ng-template, ng-container and ngTemplateOutlet render templates dynamically.',
      ex: `<ng-content select="[card-title]"> creates named slots. viewChild('input') (signal query) accesses elements in the component's own template; contentChild accesses projected content. Template reference variables (#box) refer to elements in templates.

<ng-template #tpl let-item> defines reusable template fragments rendered with *ngTemplateOutlet and a context — powerful for customisable tables/lists. <ng-container> groups without adding DOM.`,
      pts: ['ng-content with select = slots', 'viewChild/contentChild signal queries', '#ref template variables', 'ngTemplateOutlet for custom rendering'],
      code: ['typescript', `@Component({
  selector: 'app-card',
  template: \`
    <header><ng-content select="[card-title]" /></header>   <!-- named slot -->
    <section><ng-content /></section>                         <!-- default slot -->\`
})
export class CardComponent {}
@Component({
  selector: 'app-list',
  imports: [NgTemplateOutlet],
  template: \`
    @for (item of items(); track item.id) {
      <ng-container *ngTemplateOutlet="rowTpl() ?? defaultRow; context: { $implicit: item }" />
    }
    <ng-template #defaultRow let-item><li>{{ item.name }}</li></ng-template>\`
})
export class ListComponent {
  items = input<{ id: string; name: string }[]>([]);
  rowTpl = input<TemplateRef<unknown>>();                   // parent can pass a custom row template
  search = viewChild<ElementRef<HTMLInputElement>>('search'); // signal-based view query
}`],
      iq: [['viewChild vs contentChild?', 'viewChild queries the component’s own template; contentChild queries content projected into it via ng-content.']],
      cq: [['Focus an input via viewChild.', `input = viewChild.required<ElementRef<HTMLInputElement>>('q'); // <input #q>
focus() { this.input().nativeElement.focus(); }`]],
      err: ['Querying view children before ngAfterViewInit (decorator API)']
    })
  ),
  m('2. Services & Dependency Injection',
    t('ng-services', 'Services & Business Logic', 'B', {
      one: 'Services are injectable classes that hold business logic, data access and shared state, keeping components focused on presentation.',
      ex: `@Injectable({ providedIn: 'root' }) creates an app-wide singleton. Services call APIs (HttpClient), cache data, expose state as signals or observables, and are injected with inject(). Provide them at component level for per-instance state.

Facade services hide complex store/API logic behind a simple API for components.`,
      pts: ['providedIn root = singleton', 'inject() in components', 'State via signals/observables', 'Facades simplify components'],
      code: ['typescript', `import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })                     // one instance for the app
export class SavedTermsService {
  private http = inject(HttpClient);
  private _saved = signal<string[]>([]);                // private writable state
  saved = this._saved.asReadonly();                      // read-only for components
  count = computed(() => this._saved().length);          // derived state
  toggle(id: string) {
    this._saved.update((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])); // immutable update
    this.http.post('/api/saved', { ids: this._saved() }).subscribe(); // persist
  }
}`],
      iq: [['Why move logic from components to services?', 'Reuse, testability, separation of concerns and shared state across components.']],
      cq: [['Use the service in a component.', `export class SavedBadge { saved = inject(SavedTermsService); } // template: {{ saved.count() }}`]],
      err: ['HTTP calls directly inside many components']
    }),
    L('angular-di'),
    t('ng-providers-hierarchy', 'Providers & Injector Hierarchy (useClass, useValue, useFactory)', 'A', {
      one: 'Providers tell Angular how to create a dependency (useClass, useValue, useFactory, useExisting); injectors form a hierarchy from environment/root to components.',
      ex: `Resolution walks up from the component's element injector to its parents, then the environment injector (route providers) and root. Resolution modifiers: inject(X, { optional: true, self: true, skipSelf: true, host: true }).

Use useValue for config, useFactory for computed instances, multi: true for plugin lists (HTTP_INTERCEPTORS legacy). Route-level providers scope services to lazy feature areas.`,
      pts: ['useClass / useValue / useFactory / useExisting', 'Element → environment → root', 'optional / self / skipSelf', 'Route providers for features'],
      dia: `flowchart BT
  C["Component element injector"] --> P["Parent component injector"]
  P --> R["Route environment injector"]
  R --> ROOT["Root injector"]
  ROOT --> PL["Platform injector"]`,
      code: ['typescript', `export const API_BASE = new InjectionToken<string>('API_BASE');   // non-class token
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_BASE, useValue: 'https://api.example.com' },   // value
    { provide: Logger, useClass: environment.production ? SilentLogger : ConsoleLogger }, // swap class
    { provide: Storage, useFactory: () => (typeof localStorage !== 'undefined' ? localStorage : new MemoryStorage()) } // factory (SSR safe)
  ]
};
@Component({ selector: 'app-editor', template: '', providers: [DraftService] }) // new instance per editor
export class EditorComponent { draft = inject(DraftService); parent = inject(EditorComponent, { optional: true, skipSelf: true }); }`],
      iq: [['How do you get a separate service instance per component?', 'Add the service to the component’s providers array.']],
      cq: [['Provide a mock in tests.', `TestBed.configureTestingModule({ providers: [{ provide: TermsApi, useValue: { getAll: () => of([]) } }] }); // fake`]],
      err: ['Accidentally creating multiple instances of a "singleton"']
    })
  ),
  m('3. Routing',
    t('ng-routing', 'Angular Router: routes, params, navigation', 'B', {
      one: 'The Angular Router maps URL paths to components via a Routes array, renders them in <router-outlet>, and navigates with routerLink or Router.navigate.',
      ex: `provideRouter(routes, withComponentInputBinding()) in app config. Route params (:id), query params and data can bind directly to component inputs with withComponentInputBinding. Nested child routes render in nested outlets. routerLinkActive highlights active links. Wildcard ** handles 404s. Redirects with redirectTo.`,
      pts: ['Routes array + router-outlet', 'routerLink / Router.navigate', 'Params as component inputs', 'Child routes and ** fallback'],
      flow: ['URL changes', 'Router matches route config', 'Guards and resolvers run', 'Component renders in router-outlet'],
      code: ['typescript', `export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'FrontEdge' },              // page title support
  { path: 'term/:id', component: TermComponent },                          // param route
  { path: 'learn', loadChildren: () => import('./learn/learn.routes') },  // lazy feature routes
  { path: '**', component: NotFoundComponent }                            // 404
];
// app.config.ts: provideRouter(routes, withComponentInputBinding())
@Component({ selector: 'app-term', template: '<h1>{{ id() }}</h1>' })
export class TermComponent { id = input.required<string>(); }              // route param bound to input
// template: <a routerLink="/term/js-closures" routerLinkActive="active">Closures</a>
// code: inject(Router).navigate(['/term', id], { queryParams: { tab: 'code' } });`],
      iq: [['How do you read route params in modern Angular?', 'Bind them to inputs with withComponentInputBinding, or inject ActivatedRoute and use paramMap.']],
      cq: [['Read query params reactively.', `const tab = toSignal(inject(ActivatedRoute).queryParamMap.pipe(map((p) => p.get('tab') ?? 'learn'))); // signal`]],
      err: ['Putting ** route before others']
    }),
    t('ng-guards-resolvers', 'Route Guards & Resolvers (functional)', 'I', {
      one: 'Guards decide whether navigation can proceed (canActivate, canMatch, canDeactivate, canActivateChild); resolvers fetch data before a route activates.',
      ex: `Functional guards are plain functions using inject(): return true, false, or a UrlTree to redirect. canMatch prevents lazy chunks from even loading for unauthorised users. canDeactivate warns about unsaved changes. Resolvers (ResolveFn) preload data; consider showing skeletons instead for faster perceived navigation.

Guards improve UX; the backend must still enforce authorisation.`,
      pts: ['Return true/false/UrlTree', 'canMatch blocks lazy loading', 'canDeactivate for unsaved changes', 'Backend still authorises'],
      code: ['typescript', `export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);                         // DI in a function
  return auth.isLoggedIn() ? true                           // allow
    : inject(Router).createUrlTree(['/login'], { queryParams: { next: state.url } }); // redirect
};
export const unsavedGuard: CanDeactivateFn<{ dirty: () => boolean }> = (cmp) =>
  !cmp.dirty() || confirm('Discard unsaved changes?');      // ask before leaving
export const termResolver: ResolveFn<Term> = (route) =>
  inject(TermsApi).get(route.paramMap.get('id')!);          // data before activation
// routes: { path: 'admin', canMatch: [authGuard], loadComponent: () => import('./admin') }
//         { path: 'term/:id', resolve: { term: termResolver }, component: TermComponent }`],
      iq: [['canActivate vs canMatch?', 'canActivate runs after a route matches (chunk may already load); canMatch decides whether the route matches at all, preventing lazy loading.']],
      cq: [['Role-based guard factory.', `export const roleGuard = (role: string): CanActivateFn => () => inject(AuthService).hasRole(role); // reusable`]],
      err: ['Relying on guards for security']
    }),
    t('ng-lazy-loading', 'Lazy Loading Routes & Components', 'I', {
      one: 'Load feature code only when needed with loadComponent and loadChildren, and preload strategically with PreloadAllModules or custom strategies.',
      ex: `loadComponent: () => import('./admin.component').then(m => m.AdminComponent) splits a component into its own chunk; loadChildren loads a routes file for a feature area. withPreloading(PreloadAllModules) loads lazy chunks in the background after startup; custom strategies preload only flagged routes.

Combine with @defer for in-template lazy loading.`,
      pts: ['loadComponent for single routes', 'loadChildren for feature routes', 'Preloading strategies', 'Smaller initial bundle'],
      code: ['typescript', `export const routes: Routes = [
  { path: 'mock', loadComponent: () => import('./mock/mock.component').then((m) => m.MockComponent) }, // one component chunk
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES) }   // feature chunk
];
export const appConfig = { providers: [provideRouter(routes, withPreloading(PreloadAllModules))] }; // background preload`],
      iq: [['Why lazy-load routes?', 'To reduce the initial bundle and speed up first load; features download when visited.']],
      cq: [['Default export shorthand.', `{ path: 'news', loadComponent: () => import('./news.component') } // works if the component is the default export`]],
      err: ['Importing lazy feature code eagerly from shared files']
    })
  ),
  m('4. Forms',
    t('ng-template-driven-forms', 'Template-driven Forms (ngModel)', 'B', {
      one: 'Template-driven forms build the form model from directives in the template (ngModel, ngForm) — simple and quick for small forms.',
      ex: `Import FormsModule; bind [(ngModel)] with a name attribute; read validity via #f="ngForm" and #email="ngModel". Validation uses HTML attributes (required, minlength, email). State classes (ng-valid, ng-touched, ng-dirty) help styling.

For complex, dynamic or heavily validated forms, reactive forms are preferable.`,
      pts: ['FormsModule + ngModel', 'name attribute required', 'HTML validation attributes', 'Best for small forms'],
      code: ['html', `<form #f="ngForm" (ngSubmit)="save(f.value)">                <!-- form model from template -->
  <input name="email" ngModel required email #email="ngModel"> <!-- registered control -->
  @if (email.invalid && email.touched) {
    <small>Enter a valid email</small>                           <!-- validation message -->
  }
  <button [disabled]="f.invalid">Save</button>                   <!-- form validity -->
</form>`],
      iq: [['Template-driven vs reactive forms?', 'Template-driven: model defined in the template, async and simple. Reactive: model defined in TypeScript, synchronous, explicit, testable and better for complex forms.']],
      cq: [['Reset a template-driven form.', `save(form: NgForm) { console.log(form.value); form.resetForm(); } // clears values and states`]],
      err: ['Forgetting the name attribute with ngModel inside a form']
    }),
    t('ng-reactive-forms', 'Reactive Forms (FormGroup, FormControl, FormArray, typed)', 'I', {
      one: 'Reactive forms define the form model in TypeScript with FormControl, FormGroup and FormArray, giving explicit, typed and testable forms.',
      ex: `Use FormBuilder (nonNullable) to create typed groups. Bind with [formGroup] and formControlName. valueChanges/statusChanges observables react to edits (debounce search, conditional fields). FormArray handles dynamic lists (multiple phone numbers). patchValue/setValue update, getRawValue includes disabled controls.

Signal Forms (experimental in newer Angular) bring a signal-based API.`,
      pts: ['Model in TypeScript', 'Typed with nonNullable builder', 'FormArray for dynamic fields', 'valueChanges for reactions'],
      code: ['typescript', `@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name">
      <div formArrayName="skills">
        @for (c of skills.controls; track $index) { <input [formControlName]="$index"> }
      </div>
      <button type="button" (click)="addSkill()">Add skill</button>
      <button [disabled]="form.invalid">Save</button>
    </form>\`
})
export class ProfileFormComponent {
  private fb = inject(FormBuilder).nonNullable;                 // typed, non-null controls
  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]], // FormControl<string>
    skills: this.fb.array([this.fb.control('Angular')])          // FormArray<FormControl<string>>
  });
  get skills() { return this.form.controls.skills; }
  addSkill() { this.skills.push(this.fb.control('')); }         // dynamic field
  submit() { console.log(this.form.getRawValue()); }            // { name: string; skills: string[] }
}`],
      iq: [['setValue vs patchValue?', 'setValue requires all controls; patchValue updates only the provided ones.']],
      cq: [['Debounced search from a FormControl.', `search = new FormControl('', { nonNullable: true });
results = toSignal(this.search.valueChanges.pipe(debounceTime(300), switchMap((q) => this.api.search(q))), { initialValue: [] });`]],
      err: ['Using untyped FormGroup in new code']
    }),
    t('ng-form-validation', 'Form Validation: built-in, custom & async validators', 'I', {
      one: 'Validators check control values: built-in (required, email, min, pattern), custom sync functions returning error objects, cross-field validators and async validators for server checks.',
      ex: `A validator returns null (valid) or an error map ({ weakPassword: true }). Apply cross-field validators to the FormGroup (password confirmation). Async validators return an Observable/Promise (check username availability) — debounce them and set updateOn: 'blur' to reduce requests.

Show errors only after touched/dirty and connect messages with aria-describedby.`,
      pts: ['Return null or error map', 'Group validators for cross-field rules', 'Async validators for server checks', 'Show errors after touch'],
      code: ['typescript', `export const strongPassword: ValidatorFn = (c) =>
  /^(?=.*[A-Z])(?=.*\\d).{8,}$/.test(c.value ?? '') ? null : { weakPassword: true }; // sync validator
export const matchPasswords: ValidatorFn = (group) =>
  group.get('password')?.value === group.get('confirm')?.value ? null : { mismatch: true }; // cross-field
export function usernameTaken(api: UsersApi): AsyncValidatorFn {
  return (c) => timer(400).pipe(                              // debounce
    switchMap(() => api.exists(c.value)),                     // server check
    map((exists) => (exists ? { taken: true } : null))        // error or valid
  );
}
form = new FormGroup({
  username: new FormControl('', { validators: Validators.required, asyncValidators: usernameTaken(inject(UsersApi)), updateOn: 'blur' }),
  password: new FormControl('', strongPassword),
  confirm: new FormControl('')
}, { validators: matchPasswords });`],
      iq: [['How do you validate that two fields match?', 'Apply a validator to the parent FormGroup that compares both controls.']],
      cq: [['Display a specific error message.', `@if (form.controls.password.hasError('weakPassword') && form.controls.password.touched) {
  <small>Use 8+ chars with a capital letter and a number</small> }`]],
      err: ['Async validator firing on every keystroke']
    })
  ),
  m('5. HTTP & Data',
    t('ng-httpclient', 'HttpClient: requests, typing, errors, interceptors', 'I', {
      one: 'HttpClient performs HTTP requests returning typed Observables; configure it with provideHttpClient(withFetch(), withInterceptors([...])).',
      ex: `this.http.get<Term[]>('/api/terms', { params }) returns a cold Observable — nothing happens until subscribed (async pipe, toSignal, subscribe). Handle errors with catchError and retry. Functional interceptors add auth headers, handle 401 refresh, show loaders or log.

withFetch uses the Fetch API (recommended for SSR). Use HttpParams/HttpHeaders, and HttpContext for per-request interceptor flags.`,
      pts: ['Typed generics, cold observables', 'catchError + retry', 'Functional interceptors', 'withFetch for SSR'],
      code: ['typescript', `@Injectable({ providedIn: 'root' })
export class TermsApi {
  private http = inject(HttpClient);
  search(q: string) {
    return this.http.get<Term[]>('/api/terms', { params: { q } }).pipe( // typed response
      retry({ count: 2, delay: 500 }),                                   // retry transient failures
      catchError((err: HttpErrorResponse) => {                          // map errors
        console.error('Search failed', err.status);
        return of([]);                                                   // fallback value
      })
    );
  }
}
// app.config.ts → provideHttpClient(withFetch(), withInterceptors([authInterceptor]))`],
      iq: [['Why doesn’t my HTTP request fire?', 'HttpClient observables are cold; the request only runs when subscribed.']],
      cq: [['Global loading indicator interceptor.', `export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderService); loader.start();          // increment counter
  return next(req).pipe(finalize(() => loader.stop()));          // decrement when done
};`]],
      err: ['Nested subscribes instead of switchMap']
    }),
    t('ng-resource', 'resource(), httpResource() & Signal-based Data Loading', 'A', {
      one: 'resource() and httpResource() (Angular 19–20+) load async data into signals with built-in loading, error and reload state, re-running when their signal parameters change.',
      ex: `httpResource(() => \`/api/terms/\${id()}\`) automatically refetches when id() changes and exposes value(), isLoading(), error(), hasValue() and reload(). resource({ params, loader }) works with any Promise-based loader and an AbortSignal; rxResource uses Observables.

They complement signals for reactive UI without manual subscriptions. Check the API status (developer preview/stable) for your Angular version.`,
      pts: ['Data as signals', 'Auto refetch on param change', 'value / isLoading / error / reload', 'Cancels stale requests'],
      flow: ['Param signal changes', 'Previous request aborted', 'Loader runs', 'value and status signals update'],
      code: ['typescript', `@Component({
  selector: 'app-term-page',
  template: \`
    @if (term.isLoading()) { <p>Loading…</p> }
    @else if (term.error()) { <p>Failed. <button (click)="term.reload()">Retry</button></p> }
    @else if (term.hasValue()) { <h1>{{ term.value().name }}</h1> }\`
})
export class TermPageComponent {
  id = input.required<string>();                                 // route param
  term = httpResource<Term>(() => '/api/terms/' + this.id());    // refetches when id changes
}`],
      iq: [['Benefit of httpResource over subscribe?', 'Declarative loading/error state as signals, automatic refetch and cancellation, no manual subscription management.']],
      cq: [['resource with fetch.', `user = resource({
  params: () => ({ id: this.userId() }),                         // reactive params
  loader: ({ params, abortSignal }) => fetch('/api/users/' + params.id, { signal: abortSignal }).then((r) => r.json())
});`]],
      err: ['Using effects to fetch data into signals manually']
    })
  ),
  m('6. Reactivity & Change Detection',
    L('angular-signals'),
    t('ng-linked-signal-effects', 'computed, linkedSignal & effect best practices', 'A', {
      one: 'computed() derives read-only values, linkedSignal() derives a writable value that resets when its source changes, and effect() is reserved for side effects.',
      ex: `Prefer computed for anything derivable. linkedSignal fits "selected item that resets when the list changes" or "editable copy of input". effect() should sync with the outside world (localStorage, logging, imperative APIs) — not set other signals (use computed/linkedSignal instead).

Signals compare with Object.is by default; provide an equal function for custom equality. untracked() reads a signal without creating a dependency.`,
      pts: ['computed for derivations', 'linkedSignal = writable derived state', 'effect only for side effects', 'untracked to avoid dependencies'],
      code: ['typescript', `export class TermPicker {
  terms = input<Term[]>([]);
  selected = linkedSignal(() => this.terms()[0]?.id ?? null);      // resets when terms change, still writable
  selectedTerm = computed(() => this.terms().find((t) => t.id === this.selected())); // derived
  constructor() {
    effect(() => {                                                   // side effect: persist
      const id = this.selected();
      if (id) localStorage.setItem('lastTerm', id);
    });
  }
  pick(id: string) { this.selected.set(id); }                        // user override
}`],
      iq: [['Why avoid setting signals inside effect()?', 'It creates hidden data flows and possible loops; derived values should be computed or linkedSignal.']],
      cq: [['Read a signal without tracking.', `effect(() => { const q = this.query(); const page = untracked(this.page); log(q, page); }); // only q is a dependency`]],
      err: ['effect() used as computed']
    }),
    L('angular-rxjs'),
    t('ng-rxjs-subjects', 'Subjects, BehaviorSubject, ReplaySubject & multicasting', 'I', {
      one: 'Subjects are Observables you can push values into; BehaviorSubject holds a current value, ReplaySubject replays recent values, and share/shareReplay multicast one source to many subscribers.',
      ex: `Subject: event bus with no initial value. BehaviorSubject(initial): late subscribers get the latest value — classic service state before signals. ReplaySubject(n): replays the last n values. AsyncSubject: emits the last value on complete.

shareReplay({ bufferSize: 1, refCount: true }) caches an HTTP response for multiple subscribers. Expose subjects as asObservable() to prevent outside .next(). Many such state cases are now simpler with signals.`,
      pts: ['Subject = multicast event source', 'BehaviorSubject has current value', 'shareReplay caches results', 'Expose asObservable()'],
      code: ['typescript', `@Injectable({ providedIn: 'root' })
export class CartStore {
  private items$ = new BehaviorSubject<string[]>([]);          // current value + stream
  readonly items = this.items$.asObservable();                 // read-only for consumers
  readonly count = this.items.pipe(map((i) => i.length));      // derived stream
  add(id: string) { this.items$.next([...this.items$.value, id]); } // push new state
}
// cache an HTTP call for all subscribers
config$ = this.http.get<Config>('/api/config').pipe(shareReplay({ bufferSize: 1, refCount: true }));`],
      iq: [['Subject vs BehaviorSubject?', 'Subject has no current value; BehaviorSubject requires an initial value and emits the latest value to new subscribers.']],
      cq: [['Convert BehaviorSubject state to a signal.', `count = toSignal(this.store.count, { initialValue: 0 }); // use in template as count()`]],
      err: ['Exposing subjects publicly']
    }),
    t('ng-change-detection', 'Change Detection: Zone.js, OnPush & Zoneless', 'A', {
      one: 'Change detection syncs component state to the DOM; Default strategy checks everything after any async event (Zone.js), OnPush checks only on input/event/signal changes, and zoneless relies on signals and explicit notifications.',
      ex: `Zone.js patches async APIs (timers, events, XHR) to know when to run change detection across the whole tree. OnPush skips a subtree unless an input reference changes, an event fires inside it, the async pipe emits or a signal it reads changes — big performance win with immutable data.

Zoneless (provideZonelessChangeDetection, stable in v20) removes Zone.js: smaller bundles, clearer debugging; requires signals/async pipe/markForCheck for updates. Avoid mutating objects with OnPush.`,
      pts: ['Default = check all after async events', 'OnPush = check on input/event/signal', 'Zoneless removes Zone.js', 'Immutable data with OnPush'],
      dia: `flowchart TD
  E["Async event: click, timer, HTTP"] --> Z{"Zone.js present?"}
  Z -- Yes --> CD["Run change detection from root"]
  Z -- "No (zoneless)" --> S["Signal/markForCheck schedules CD"]
  CD --> O{"Component OnPush?"}
  O -- "Yes and no inputs/signals changed" --> SKIP["Skip subtree"]
  O -- "Default or changed" --> CHECK["Check and update DOM"]`,
      code: ['typescript', `// app.config.ts — zoneless (Angular 20+)
export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideRouter(routes)]
};
@Component({
  selector: 'app-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,   // only re-check when needed
  template: '<button (click)="inc()">{{ count() }}</button>'
})
export class CounterComponent {
  count = signal(0);                                 // signal change schedules an update
  inc() { this.count.update((c) => c + 1); }
}`],
      iq: [['Why might an OnPush component not update?', 'An input object was mutated instead of replaced, or state changed outside signals/async pipe without markForCheck.'],
           ['What does zoneless change detection require?', 'State updates via signals, async pipe, event handlers or explicit markForCheck — not relying on Zone.js patches.']],
      cq: [['Trigger update after a third-party callback (non-signal).', `private cdr = inject(ChangeDetectorRef);
widget.on('change', (v) => { this.value = v; this.cdr.markForCheck(); }); // tell Angular to check`]],
      err: ['Mutating arrays with OnPush']
    }),
    t('ng-defer', 'Deferrable Views (@defer)', 'I', {
      one: '@defer lazily loads parts of a template (and their dependencies) based on triggers like viewport, interaction, idle, hover, timer or a condition.',
      ex: `@defer (on viewport) { <heavy-chart /> } @placeholder { <div class="skeleton"></div> } @loading (minimum 300ms) { <spinner/> } @error { <p>Failed</p> }. Components inside a defer block are split into separate chunks automatically.

prefetch on idle downloads early but renders on the trigger. With SSR, incremental hydration (hydrate on viewport) keeps server HTML and hydrates later.`,
      pts: ['Template-level lazy loading', 'Triggers: viewport, interaction, idle, timer, when', '@placeholder / @loading / @error', 'Incremental hydration with SSR'],
      code: ['html', `@defer (on viewport; prefetch on idle) {          <!-- load when visible, prefetch when idle -->
  <app-comments [termId]="id()" />                   <!-- split into its own chunk -->
} @placeholder {
  <div class="skeleton">Comments</div>               <!-- shown before trigger -->
} @loading (minimum 300ms) {
  <p>Loading comments…</p>                           <!-- avoids flicker -->
} @error {
  <p>Could not load comments.</p>
}`],
      iq: [['What makes @defer different from lazy routes?', 'It lazy-loads part of a template inside a page, with declarative triggers and placeholders.']],
      cq: [['Load a chat widget on interaction.', `@defer (on interaction(chatBtn)) { <app-chat /> } @placeholder { <button #chatBtn>Open chat</button> }`]],
      err: ['Deferring above-the-fold critical content']
    })
  ),
  m('7. Architecture & Production',
    t('ng-modules-standalone', 'NgModules vs Standalone (migration)', 'I', {
      one: 'Older Angular apps organise code in NgModules (declarations, imports, providers); modern apps use standalone components, functional providers and route-level lazy loading.',
      ex: `NgModule concepts still matter for legacy codebases: declarations (components belonging to the module), imports (other modules), exports, providers, bootstrap, SharedModule/CoreModule patterns, forRoot/forChild.

Migrate with ng generate @angular/core:standalone (convert → remove modules → bootstrap). Standalone reduces boilerplate and improves tree shaking. Both can coexist (importProvidersFrom for module-based libraries).`,
      pts: ['NgModule: declarations/imports/exports/providers', 'Standalone is the modern default', 'Automatic migration schematic', 'importProvidersFrom for legacy modules'],
      code: ['typescript', `// Legacy
@NgModule({
  declarations: [AppComponent, TermCardComponent],   // components owned by this module
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent]
})
export class AppModule {}
// Modern
bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideRouter(routes), importProvidersFrom(LegacyChartsModule)] // bridge old module
});`],
      iq: [['What is forRoot/forChild?', 'Static methods that provide module providers once at the root (forRoot) and configuration-only for feature modules (forChild), mainly for the router.']],
      cq: [['Run the standalone migration.', `ng generate @angular/core:standalone   # choose: convert, remove modules, bootstrap`]],
      err: ['Declaring a component in two NgModules']
    }),
    t('ng-state-ngrx', 'State Management: NgRx Store, Effects & Signal Store', 'A', {
      one: 'NgRx brings Redux-style state to Angular: Store (actions, reducers, selectors), Effects for side effects, Entity for collections and the newer SignalStore for signal-based state.',
      ex: `Store flow: component dispatches an action → reducer returns new state → selectors derive data → components read via store.selectSignal. Effects listen to actions and call APIs, dispatching success/failure actions. DevTools enable time-travel debugging.

@ngrx/signals SignalStore offers a lighter, signal-native API (withState, withComputed, withMethods). For small apps, services with signals are enough.`,
      pts: ['Actions → reducers → selectors', 'Effects for side effects', 'SignalStore is lighter', 'Services+signals for small apps'],
      flow: ['Component dispatches action', 'Reducer updates state', 'Effect calls API', 'Success action updates state', 'Selector signal updates UI'],
      code: ['typescript', `import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
export const TermsStore = signalStore(
  { providedIn: 'root' },
  withState({ terms: [] as Term[], loading: false, query: '' }),         // state
  withComputed(({ terms, query }) => ({                                  // derived signals
    filtered: computed(() => terms().filter((t) => t.name.toLowerCase().includes(query().toLowerCase())))
  })),
  withMethods((store, api = inject(TermsApi)) => ({                      // actions
    setQuery: (query: string) => patchState(store, { query }),
    async load() {
      patchState(store, { loading: true });
      patchState(store, { terms: await firstValueFrom(api.all()), loading: false });
    }
  }))
);
// component: store = inject(TermsStore); template: @for (t of store.filtered(); track t.id) {...}`],
      iq: [['When is NgRx worth it?', 'Large apps with complex shared state, many teams, and a need for strict patterns and debugging tools.']],
      cq: [['Classic selector with createSelector.', `export const selectSaved = createSelector(selectTerms, selectSavedIds, (terms, ids) => terms.filter((t) => ids.includes(t.id))); // memoised`]],
      err: ['NgRx for trivial local UI state']
    }),
    t('ng-ssr-hydration', 'Angular SSR, Hydration & Incremental Hydration', 'A', {
      one: 'Angular SSR renders pages on the server (or prerenders at build time); hydration reuses the server DOM, and incremental hydration hydrates @defer blocks on triggers.',
      ex: `ng new --ssr or ng add @angular/ssr. provideClientHydration(withEventReplay(), withIncrementalHydration()) avoids re-rendering and replays early clicks. Server render modes per route (Server, Client, Prerender) via server routes config.

Write SSR-safe code: avoid direct window/document access during render (use afterNextRender, isPlatformBrowser, inject(DOCUMENT)), and use TransferState/HttpClient caching to avoid duplicate requests.`,
      pts: ['SSR or prerender per route', 'Hydration reuses DOM', 'Event replay for early clicks', 'Guard browser-only code'],
      code: ['typescript', `export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),                                   // fetch for server/client
    provideClientHydration(withEventReplay(), withIncrementalHydration()) // reuse DOM, replay clicks
  ]
};
@Component({ selector: 'app-theme', template: '' })
export class ThemeComponent {
  constructor() {
    afterNextRender(() => {                                           // runs only in the browser
      document.documentElement.dataset.theme = localStorage.getItem('theme') ?? 'dark';
    });
  }
}
// template: @defer (hydrate on viewport) { <app-comments /> }`],
      iq: [['What causes hydration errors in Angular?', 'DOM differences between server and client: direct DOM manipulation, browser-only values during render, invalid HTML.']],
      cq: [['Check platform before using window.', `private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
width = this.isBrowser ? window.innerWidth : 1024; // safe default on server`]],
      err: ['Accessing localStorage in constructors with SSR']
    }),
    t('ng-testing', 'Testing Angular: TestBed, harnesses, Jest/Vitest', 'I', {
      one: 'Test Angular with TestBed for components/services, component harnesses for stable UI interactions, HttpTestingController for HTTP and Playwright/Cypress for E2E.',
      ex: `Configure TestBed with the standalone component in imports and mock providers. fixture.detectChanges() (or autoDetect) renders; query via DebugElement or Testing Library for Angular. provideHttpClientTesting + HttpTestingController asserts and flushes requests.

Karma is deprecated — newer projects use Jest or Vitest runners (experimental builder support) and Web Test Runner. Angular Material provides harnesses.`,
      pts: ['TestBed + mocked providers', 'HttpTestingController', 'Component harnesses', 'Jest/Vitest replacing Karma'],
      code: ['typescript', `describe('TermCardComponent', () => {
  it('shows the term name', async () => {
    await TestBed.configureTestingModule({ imports: [TermCardComponent] }).compileComponents(); // standalone
    const fixture = TestBed.createComponent(TermCardComponent);
    fixture.componentRef.setInput('name', 'Closures');       // set signal input
    fixture.detectChanges();                                   // render
    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Closures'); // assert DOM
  });
});
describe('TermsApi', () => {
  it('calls /api/terms', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const api = TestBed.inject(TermsApi); const http = TestBed.inject(HttpTestingController);
    api.search('js').subscribe((r) => expect(r.length).toBe(1));
    http.expectOne('/api/terms?q=js').flush([{ id: 'a' }]);     // respond to the request
  });
});`],
      iq: [['How do you test HTTP services in Angular?', 'Use provideHttpClientTesting and HttpTestingController to expect requests and flush mock responses.']],
      cq: [['Mock a service dependency.', `providers: [{ provide: TermsApi, useValue: { search: () => of([]) } }] // fake implementation`]],
      err: ['Testing private implementation details']
    }),
    t('ng-performance-security', 'Angular Performance & Security', 'A', {
      one: 'Optimise Angular with OnPush/signals, track in @for, lazy loading, @defer, pure pipes and bundle budgets; secure it with built-in sanitisation, strict CSP and careful bypassSecurityTrust usage.',
      ex: `Performance: avoid function calls in templates, use computed signals, virtual scrolling (CDK ScrollingModule) for long lists, NgOptimizedImage for images, preloading strategies, and analyse bundles (source-map-explorer, esbuild metafile). Set budgets in angular.json.

Security: Angular escapes interpolation and sanitises [innerHTML], URLs and styles automatically. bypassSecurityTrustHtml disables this — use only with trusted/sanitised content. Enable CSP with nonces (autoCsp), use HttpClient XSRF support, and avoid ElementRef.nativeElement.innerHTML.`,
      pts: ['OnPush + signals + track', 'Virtual scroll and @defer', 'NgOptimizedImage', 'Built-in sanitisation; avoid bypass'],
      code: ['typescript', `import { NgOptimizedImage } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
@Component({
  selector: 'app-feed',
  imports: [NgOptimizedImage, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <img ngSrc="/hero.avif" width="1200" height="600" priority alt="Hero">   <!-- optimised LCP image -->
    <cdk-virtual-scroll-viewport itemSize="56" style="height: 500px">      <!-- render visible rows only -->
      <div *cdkVirtualFor="let t of terms(); trackBy: byId">{{ t.name }}</div>
    </cdk-virtual-scroll-viewport>
    <div [innerHTML]="safeHtml"></div>                                       <!-- sanitised automatically -->\`
})
export class FeedComponent {
  terms = input<Term[]>([]);
  safeHtml = '<b>Bold</b><script>alert(1)</script>';                       // script is stripped by Angular
  byId = (_: number, t: Term) => t.id;
}`],
      iq: [['Does Angular protect against XSS?', 'Yes, it treats values as untrusted and sanitises HTML/URL/style bindings; bypassSecurityTrust* disables that protection.']],
      cq: [['Set bundle budgets.', `"budgets": [{ "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" }] // angular.json`]],
      err: ['bypassSecurityTrustHtml on user content']
    }),
    t('ng-material-cdk-i18n', 'Angular Material, CDK, Animations & i18n', 'I', {
      one: 'Angular Material provides accessible Material Design components, the CDK provides unstyled behaviour (overlay, drag-drop, a11y, virtual scroll), plus built-in animations and i18n tooling.',
      ex: `ng add @angular/material sets up theming (Material 3 tokens via SCSS/CSS variables). CDK primitives: Overlay, Portal, DragDrop, A11yModule (FocusTrap, LiveAnnouncer), Clipboard, Layout (BreakpointObserver).

Animations: @angular/animations (being replaced by native CSS + animate.enter/animate.leave in newer versions). i18n: mark text with i18n attributes and $localize, extract with ng extract-i18n, build per locale — or use runtime libraries like Transloco.`,
      pts: ['Material components + theming', 'CDK behaviour primitives', 'Native i18n with $localize', 'Transloco for runtime switching'],
      code: ['typescript', `import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { LiveAnnouncer } from '@angular/cdk/a11y';
@Component({
  selector: 'app-roadmap-editor',
  imports: [DragDropModule],
  template: \`
    <ul cdkDropList (cdkDropListDropped)="drop($event)">          <!-- sortable list -->
      @for (s of steps; track s) { <li cdkDrag i18n>{{ s }}</li> }  <!-- draggable items -->
    </ul>\`
})
export class RoadmapEditorComponent {
  steps = ['HTML', 'CSS', 'JavaScript', 'Angular'];
  private announcer = inject(LiveAnnouncer);
  drop(e: CdkDragDrop<string[]>) {
    moveItemInArray(this.steps, e.previousIndex, e.currentIndex);  // reorder
    this.announcer.announce('Moved to position ' + (e.currentIndex + 1)); // screen reader feedback
  }
}`],
      iq: [['Material vs CDK?', 'Material is styled Material Design components; CDK provides the underlying unstyled behaviours you can use with your own design.']],
      cq: [['Responsive check with BreakpointObserver.', `isHandset = toSignal(inject(BreakpointObserver).observe(Breakpoints.Handset).pipe(map((r) => r.matches)), { initialValue: false });`]],
      err: ['Overriding Material internals with deep CSS selectors']
    }),
    t('ng-upgrades-versions', 'Angular Versions, Upgrades & AngularJS Differences', 'I', {
      one: 'Angular ships a major version every ~6 months with an update guide and schematics; AngularJS (1.x) is a different, end-of-life framework.',
      ex: `Upgrade one major at a time with ng update and the official update guide (angular.dev/update-guide); run tests between steps. Recent milestones: v14 typed forms + standalone (preview), v16 signals (preview), v17 control flow/defer/new build system, v18 zoneless preview, v19 standalone default + incremental hydration, v20 stable signals APIs & zoneless.

AngularJS used scopes, controllers and two-way digest cycles in JavaScript; migration paths include ngUpgrade (hybrid) or rewrites.`,
      pts: ['Upgrade one major at a time', 'Use the update guide + schematics', 'Know recent version milestones', 'AngularJS ≠ Angular'],
      code: ['bash', `ng version                                   # check current versions
ng update                                    # list available updates
ng update @angular/core@19 @angular/cli@19   # one major version at a time
ng update @angular/material@19               # update libraries too
npm test && ng build                         # verify before the next step`],
      iq: [['Angular vs AngularJS?', 'AngularJS (1.x) is a JavaScript MVC framework with scopes and digest cycles (EOL 2021); Angular (2+) is a TypeScript component-based rewrite.']],
      cq: [['Check what changed for your upgrade.', `# Visit angular.dev/update-guide, choose from/to versions and app complexity for a checklist`]],
      err: ['Jumping several majors at once without migrations']
    })
  )
];
