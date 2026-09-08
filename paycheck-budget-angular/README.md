# Paycheck Ledger — Angular edition

The same envelope-budgeting app as [`../paycheck-budget-app`](../paycheck-budget-app),
rebuilt from scratch as a proper [Angular](https://angular.dev) project
(v22, the current release) instead of one hand-rolled HTML file. It's meant
as a learning reference: same product, same visual design, but structured
the way a real Angular app is structured.

## Run it

```bash
npm install
ng serve
```

Then open `http://localhost:4200`. Data is saved to your browser's
`localStorage`, same as the plain-HTML version, and the app opens with a
sample paycheck and envelopes already filled in.

```bash
ng test    # unit tests (Vitest)
ng build   # production build, output in dist/
```

> **Node version:** Angular 22's CLI requires Node `^22.22.3 || ^24.15.0 ||
> >=26.0.0`. If `ng` refuses to run, that's almost always why — check
> `node -v` first.

## How it's organized

```
src/app/
  models/budget.model.ts     Plain TS interfaces + the envelope-status rule
  util/                       Pure functions: date math, sample seed data
  services/
    budget.ts                 All app state, as one signal + methods that update it
    ui-state.ts                Which sheet is open, which envelope is expanded, the toast
  pipes/days-until-pipe.ts    Custom pipe: an ISO date → "in 11 days"
  components/                 Reusable pieces (header, cards, sheets, toast)
  pages/                      The two routed screens: Envelopes and History
  app.ts / app.html           Root shell: header, summary card, tab nav, <router-outlet>
  app.routes.ts               Route table, lazy-loading each page
```

## Angular concepts this project leans on

If you're learning Angular from this code, these are the ideas worth
following through the files:

- **Signals for state, not RxJS.** `Budget` (`services/budget.ts`) holds all
  app data in one `signal<BudgetState>`. Every method (`addExpense`,
  `gotPaid`, …) calls `.update()` or `.set()` with a *new* object — nothing
  is mutated in place. `computed()` derives things like `totals` from that
  signal, and recalculates automatically whenever it changes.
- **`@Service()` for injectables.** Angular 22 introduces `@Service()` as
  the class decorator for anything you'd `inject()` elsewhere (what used to
  be `@Injectable()`). Both `Budget` and `UiState` use it.
- **No NgModules.** Every component is standalone by default (there's no
  `standalone: true` to write anymore) and lists exactly what it needs in
  its own `imports` array. `app.config.ts` wires up the whole app with
  `provideRouter` instead of a root `AppModule`.
- **Function-based inputs/outputs.** `EnvelopeItem` and `HistoryCard` are
  "dumb" components: they take data through `input()` / `input.required()`
  and report events through `output()`, and never inject a service
  themselves. Everything else (`Header`, `PayPeriodCard`, the sheets, the
  pages) injects `Budget`/`UiState` directly instead, which is the more
  common shape for a "smart" component wired straight to app state.
- **The new control-flow syntax.** Templates use `@if` / `@else` / `@for`
  (with `track`) instead of `*ngIf` / `*ngFor`.
- **Reactive Forms.** The two overlay sheets (`SettingsSheet`,
  `EnvelopeFormSheet`) build their forms with `FormBuilder` and validate
  with `Validators`, rather than two-way `ngModel` bindings.
- **`effect()` for side effects.** `Budget` persists to `localStorage`
  inside an `effect()` that reruns whenever the state signal changes; each
  sheet component uses an `effect()` to reset its form whenever it opens.
- **Routing without a router-heavy app.** `app.routes.ts` lazy-loads
  `EnvelopesPage` and `HistoryPage` with `loadComponent`, and `app.html`
  drives the tabs with `routerLink` / `routerLinkActive` — the same
  Envelopes/History switch the plain-HTML version did by hand with a
  `hidden` attribute.
- **Style encapsulation.** Each component's `.css` file is scoped to that
  component by Angular's default view encapsulation. Classes used by more
  than one component (buttons, form fields, the sheet/backdrop shell) live
  in the global `src/styles.css` instead — worth comparing against how the
  plain-HTML version had to prefix everything by hand to avoid collisions.

## Where this diverges from the plain-HTML version

The product is identical — same envelopes, same rollover math, same
"I got paid" flow — but a few things are structured differently because a
framework changes what's cheap:

- State lives in a service instead of a handful of closures; every
  component reads it through the same computed signals.
- The accordion, the two sheets, and the tab switch are driven by
  `UiState` + the router instead of manual DOM class toggling.
- Currency and dates go through Angular's built-in `CurrencyPipe` and
  `DatePipe` rather than hand-rolled `Intl` calls.

## A few ideas to extend it

Good next steps if you want to keep learning on this codebase:

- Add a real unit test for `EnvelopeItem`'s quick-add form (it's currently
  only covered indirectly through `Budget`'s tests).
- Extract the repeated inline SVG icons into a small `IconComponent`.
- Add an Angular `Resolver` or a route guard that warns before leaving the
  Envelopes page with an unsaved add-envelope form still open.
- Swap `localStorage` for a `Resource`-backed sync to a real backend.
