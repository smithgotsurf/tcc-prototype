# TCC Prototype

Top Choice Concrete — estimate management web app prototype. React SPA deployed to GitHub Pages.

## Dev commands

- `npm run dev` — start Vite dev server (port 5173)
- `npm run build` — production build

## Tech stack

- React 19, Vite 6, react-router-dom v7 (HashRouter)
- No TypeScript, no tests — prototype-grade code
- Deployed to GitHub Pages; HashRouter + `base: '/tcc-prototype/'` in vite.config.js

## Project structure

```
src/
  main.jsx            — HashRouter, App mount
  App.jsx             — route definitions (/ and /view/:id)
  useEstimates.js     — estimates hook (localStorage CRUD, seed data init)
  data.js             — BUSINESS config, STATUS_CONFIG, DEFAULT_TERMS, LINE_ITEM_PRESETS, SEED_ESTIMATES
  app.css             — global styles + CSS variables
  estimator/
    EstimatorShell.jsx — estimator portal shell, screen state routing
    EstimateList.jsx   — dashboard with search, filter, stats
    EstimateDetail.jsx — single estimate view with actions
    NewEstimate.jsx    — create/edit estimate form
  customer/
    CustomerView.jsx   — customer-facing estimate presentation
    AcceptedScreen.jsx — post-acceptance confirmation
    DeclineFlow.jsx    — decline reason selection
    DeclinedScreen.jsx — post-decline confirmation
    SignaturePad.jsx   — canvas-based signature capture (touch + mouse)
  shared/
    StatusBadge.jsx    — colored status badge component
    Toast.jsx          — toast notification component
    Icon.jsx           — SVG icon helper
    helpers.js         — fmt(), shortDate(), fullDate(), daysUntil(), estimateTotal()
docs/plans/            — original project spec (claude-code-prompt.md)
```

## Routing

Routes defined in `App.jsx` inside a HashRouter (wrapped in `main.jsx`).

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | EstimatorShell | Estimator portal (list, detail, new screens) |
| `/view/:id` | CustomerView | Customer-facing estimate view |

EstimatorShell manages its own internal screen state (`list`, `detail`, `new`) rather than using sub-routes.

## Data persistence

All data stored in localStorage under key `tcc-estimates`. The `useEstimates` hook handles load/save:

```js
const { estimates, addEstimate, updateEstimate, nextId, resetData } = useEstimates();
```

Seed data auto-populates on first load from `SEED_ESTIMATES` in `data.js`.

## Estimate statuses

`draft` → `sent` → `accepted` | `declined` | `expired`

Status colors and labels configured in `STATUS_CONFIG` (data.js). Rendered via `<StatusBadge status={...} />`.

## Coding conventions

- Short CSS class names and inline styles for one-off styling
- CSS variables for theme colors (see `:root` in app.css)
- Compact JSX — keep components concise
- Shared utilities in `shared/helpers.js`; shared components in `shared/`
- Default exports for all components; named exports for data/helpers

## Styling

- CSS variables for theme: gold `#C8981E`, cream `#F7F5F0`, grays, green, red
- Google Fonts: Cormorant Garamond (serif headings), DM Sans (body)
- Mobile-first responsive design (primary use is on phones in the field)
- Light/clean theme for customer view; cream-based palette for estimator portal
