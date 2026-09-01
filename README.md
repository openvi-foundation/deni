# Deni

A full-featured admin dashboard template for [OpenVue](https://openvue.dev), built with Vite, Vue 3 and TypeScript.

Deni is a starting point for real admin applications, not a component gallery. Every page is assembled the way a product would be: a consistent page header, bordered panels, dense data tables with designed empty and loading states, and a quiet visual language that stays out of the way of the data.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173.

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run type-check` | `vue-tsc --build` |

## What is included

**Shell** — collapsible sidebar with grouped navigation, topbar with command-palette search (`⌘K` / `Ctrl+K`), breadcrumbs, notifications popover, account menus, and an appearance drawer.

**Pages**

| Route | Page |
| --- | --- |
| `/` | Dashboard — metrics, revenue and order charts, recent orders, traffic sources, activity feed |
| `/products` | Product list — full CRUD with search, filters, sorting, multi-select, bulk delete and CSV export |
| `/products/:id` | Product detail — tabbed overview, inventory and history |
| `/orders` | Orders — status filter, footer totals via `ColumnGroup` |
| `/orders/:id` | Order detail — line items, addresses, fulfilment timeline |
| `/customers` | Customers — multi-select role filter, avatars |
| `/customers/:id` | Customer detail — profile, related orders |
| `/analytics` | Charts — line, bar, doughnut, radar |
| `/calendar` | Calendar — inline date picker with event markers |
| `/inbox` | Inbox — split view, list and reader |
| `/forms/layout` | Every OpenVue input, with the label patterns used across the template |
| `/forms/validation` | Schema validation with `@openvue/forms` and a zod resolver |
| `/profile`, `/settings` | Account and workspace settings |
| `/auth/login`, `/auth/register`, `/auth/forgot-password` | Authentication pages |
| `/errors/401`, `/errors/403`, `/errors/404`, `/errors/500`, `/errors/maintenance` | Error and maintenance pages |
| `*` | Not found |

## Theming and layout

Deni uses OpenVue's presets as they ship — there is no `definePreset` layer and no component CSS is overridden. Everything is driven at runtime through the library's own APIs (`usePreset`, `updatePrimaryPalette`, `updateSurfacePalette`), and the shell reads semantic tokens (`--p-content-background`, `--p-text-color`, …) rather than raw ramp steps, so it follows whichever preset and scheme are active.

The **appearance drawer** in the topbar controls:

| Setting | Options |
| --- | --- |
| Colour scheme | Light · **Dim** · Dark |
| Preset | Aura · Lara · Material · Nora |
| Primary | 6 accents, or unset to keep the preset's own |
| Surface | 5 neutral ramps |
| Menu mode | Static · Overlay · Slim |
| Menu theme | Light · Dark, independent of the app scheme |
| Layout | Boxed or full width |
| Ripple | On · off |

**Everything persists.** All of it is stored as one JSON object under `deni-preferences` (see `src/composables/usePreferences.ts`) and restored on boot. The colour scheme is applied by a small inline script in `index.html` before the app mounts, so there is no flash of the wrong theme. If you change the storage key or the scheme class names, update that script too.

**Dim** is a third scheme, not a variant of dark. Dim and dark both apply `.app-dark` — keeping every OpenVue component correct — and are distinguished by shifting the dark surface ramp one step lighter, so the shell and the library's own components stay in agreement.

**Menu modes** apply on desktop only; below 1024px every mode collapses to overlay.

> Note: in the light scheme, the active tab label in `Tabs` is drawn in the primary colour on white, which falls below 4.5:1 for several presets. That is how the OpenVue presets ship, and this template deliberately does not restyle library components.

Chart.js datasets read the same tokens and re-render when the theme changes.

## Structure

```
src/
  assets/styles/    Layout and shell SCSS, token-driven
  components/       PageHeader, PagePanel, MetricTile, EmptyState, StatusTag, AuthCard
  composables/      Preferences, theming, async data, table state
  data/             In-browser collections backing the demo CRUD
  layout/           AppLayout, sidebar, topbar, breadcrumb, search, configurator
  router/           Routes with lazy imports and two layouts
  service/          Typed loaders and query helpers over the JSON fixtures
  types/            Domain types
  utils/            Formatting and id helpers
  views/            One folder per section
public/demo/data/   JSON fixtures
```

## Data

The template ships with no backend. Data flows through three layers, and it is worth knowing which of them survive when you connect a real API.

| Layer | File | Role |
| --- | --- | --- |
| Transport | `src/service/http.ts`, `src/service/index.ts` | Fetches `public/demo/data/*.json`, caches per dataset, and adds a deliberate delay so loading and empty states stay visible |
| Query | `src/service/query.ts` | Applies paging, sorting, search and filters to an in-memory array — the same parameters a paginated endpoint would take |
| Collections | `src/data/collection.ts`, `src/data/collections.ts` | Holds each dataset in memory, mirrors it to `localStorage`, and records a change journal so created, edited and deleted rows survive a reload |

Views never touch these directly. They consume `useAsyncData` (read-only pages), `useLazyTable` (server-style paged tables) and `useEntity` (detail pages), so replacing the layers below leaves the pages unchanged.

### Wiring a real backend

1. **Replace `src/service/index.ts`.** Each getter returns a typed promise; point them at your API. Keep the signatures and every read-only page keeps working.
2. **Move `query.ts` server-side.** `QueryParams` maps directly to a paginated endpoint — `first`, `rows`, `sortField`, `sortOrder`, `search`, `match`. Send those as query parameters and return `{ rows, total }`. `useLazyTable` needs no changes.
3. **Delete `src/data/`.** The collection layer exists only so the demo's CRUD persists across reloads without a server; it is not a state-management pattern to build on. With an API, `create`, `update` and `remove` become requests, and the `localStorage` mirroring, schema versioning and change journal go away. `useEntity` takes a `Collection`, so it is the one composable that changes with it.

The **Restore demo data** action in the appearance drawer discards the mirrored state and reloads the fixtures. It goes away with `src/data/` as well.

## Conventions

4-space indent, single quotes, semicolons, no trailing commas. Every component is `<script setup lang="ts">` with typed props and emits. Shared behaviour lives in composables. Status values render through `StatusTag`, which owns the status-to-severity map. The source carries no comments — names and structure are meant to carry the meaning.

## License

MIT.
