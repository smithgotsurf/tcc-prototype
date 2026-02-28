# Claude Code Prompt — Top Choice Concrete Estimate System

## Context

I'm building a React SPA prototype for a residential concrete business called **Top Choice Concrete**, located in Benson, NC, serving Eastern NC, Northern SC, and Southern VA. This replaces their current paper-based estimating workflow.

I have an existing prototype React project at `[PATH_TO_YOUR_OTHER_PROJECT]` that is set up for GitHub Pages hosting — use that as a reference for project structure, build config, and deployment setup (gh-pages branch, HashRouter, etc).

## Tech Stack & Hosting

- React (Vite) with TypeScript
- Tailwind CSS for styling
- React Router (HashRouter for GitHub Pages compatibility)
- LocalStorage for prototype data persistence (no backend)
- GitHub Pages deployment via `gh-pages` npm package
- Mobile-first responsive design (primarily used on phones in the field, but also usable on desktop)

## App Overview

Two main experiences served from the same SPA:

1. **Estimator Portal** (`/` and `/estimates/*`) — used by the business owner/estimator in the field to create and manage project estimates
2. **Customer View** (`/view/:estimateId`) — a shareable link the customer receives to review, accept, and sign an estimate

## Data Model

Design a TypeScript data model for estimates with at least these concepts:

```
Estimate:
  - id (generated, human-readable like EST-2025-001)
  - status: draft | sent | viewed | accepted | declined | expired
  - customer info (name, address, phone, email)
  - job site address (may differ from customer address)
  - line items (description, quantity, unit [sqft, lnft, cu yd, each, hr, job], unit rate, calculated total)
  - notes (internal notes from estimator)
  - customer-visible notes / scope description
  - attached images (stored as base64 or object URLs for prototype)
  - terms and conditions (default set, editable per estimate)
  - expiration date
  - deposit percentage (default 50%)
  - created/updated timestamps
  - customer signature (base64 data URL from canvas)
  - acceptance/decline date
  - decline reason (if applicable)
```

## Estimator Portal Features

### Estimate List / Dashboard
- List all estimates with search and filter by status
- Summary cards showing customer name, job address, total, status badge, expiration
- Quick-action buttons (duplicate, send, etc)
- Sort by date, amount, status
- Simple stats at top (total pending value, accepted this month, etc)

### Create / Edit Estimate
- Step-by-step or tabbed form: Customer Info → Line Items → Photos → Notes → Review
- Line items: add/remove/reorder, with description, qty, unit selector, rate — auto-calc line total and grand total
- Common line item templates/presets for concrete work (e.g., "4\" slab w/ fiber mesh", "Remove existing concrete", "Broom finish", "Stamped finish", "Rebar grid", "Expansion joints", "Sealer application") — user can pick from presets or type custom
- Photo capture/upload — support camera on mobile, file upload on desktop
- Internal notes (not shown to customer) and customer-visible scope notes
- Configurable expiration (15/30/45/60 day presets or custom)
- Configurable deposit percentage
- Preview what the customer will see before sending

### Estimate Detail View
- Full view of all estimate data
- Status timeline/history
- Action buttons based on status:
  - Draft → Send to Customer (simulated — generates shareable link)
  - Sent → Resend / Mark as Viewed
  - Any → Duplicate, Edit (if draft), Delete/Archive

### Settings (simple)
- Business info (pre-filled for Top Choice Concrete)
- Default terms and conditions
- Default expiration period
- Default deposit percentage
- Line item presets management

## Customer View Features

This is a clean, professional, read-only view that the customer accesses via a shared link.

### Estimate Presentation
- Business header/branding for Top Choice Concrete
- Customer and job site info
- Full itemized scope of work with quantities and pricing
- Grand total with deposit amount highlighted
- Customer-visible project notes
- Attached photos (viewable in a simple lightbox)
- Terms and conditions (collapsible)
- Expiration date with visual urgency if close to expiring
- Estimate status shown clearly

### Accept Flow
- Checkbox to agree to terms and conditions
- Signature capture pad (canvas-based, works with touch and mouse)
- Clear / redo signature
- Confirm acceptance → success screen with next steps

### Decline Flow
- Optional reason selection (price, timing, went with competitor, project cancelled, other)
- Optional comment field
- Confirm decline → acknowledgment screen

## Design Direction

- **Mobile-first** — the estimator will primarily use this on a phone at job sites
- Clean, professional, trustworthy feel — this represents the business to customers
- Dark theme for the estimator portal (easier on eyes in outdoor/bright conditions, feels like a tool)
- Light/clean theme for customer view (professional, approachable, like receiving a proper business document)
- Use a concrete/construction-appropriate color palette — slate blues, warm grays, earth tones, with green for positive actions and clear status colors
- Smooth transitions between views
- Touch-friendly tap targets (minimum 44px)
- The customer view should look polished enough that a homeowner takes the business seriously

## Business Details (hardcode for prototype)

```
Business: Top Choice Concrete
Location: Benson, NC
Service Area: Eastern NC, Northern SC, Southern VA
Phone: (919) 555-0100  [placeholder]
Email: info@topchoiceconcrete.com  [placeholder]
Tagline: "Quality Residential Concrete — Driveways, Patios, Sidewalks & More"
```

## Prototype Data

Seed the app with 5-8 realistic mock estimates across all statuses showing typical residential concrete jobs:
- Driveway replacement
- Stamped patio
- Sidewalk pour
- Garage floor / epoxy
- Pool deck
- Foundation repair
- Retaining wall

Use realistic but fictional customer names, Benson/Clayton/Smithfield NC area addresses, and realistic pricing for the region.

## Key Implementation Notes

- All data persisted in localStorage — wrap in a simple service/hook so it's easy to swap for a real API later
- Generate estimate IDs sequentially (EST-2025-001, etc)
- The "send to customer" action should generate a shareable URL (the `/view/:id` route) and copy it to clipboard
- Images stored as base64 data URLs in localStorage for the prototype (warn about storage limits if needed)
- Signature pad should work well on both touch devices and mouse
- Include a "Reset Demo Data" option somewhere to restore the seed data
- Make sure the GitHub Pages deployment works correctly with HashRouter

## What NOT to Build (keep scope tight)

- No authentication/login (prototype only)
- No real email sending
- No payment processing
- No PDF generation (future feature)
- No real-time notifications
- No multi-user / permissions
