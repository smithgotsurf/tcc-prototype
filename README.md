# Top Choice Concrete - Prototype

An estimate management web app prototype for **Top Choice Concrete** — a residential concrete business in Benson, NC.

Hosted at: [https://smithgotsurf.github.io/tcc-prototype/](https://smithgotsurf.github.io/tcc-prototype/)

✨Vibe✨ coded with Claude

## Tech

- React 19
- react-router-dom v7 (HashRouter)
- Vite

## Project Structure

```
src/
├── main.jsx                # HashRouter + App mount
├── App.jsx                 # Route definitions (estimator + customer)
├── useEstimates.js         # Estimates hook (localStorage persistence)
├── data.js                 # Business config, seed data, presets
├── app.css                 # Global styles
├── estimator/
│   ├── EstimatorShell.jsx  # Estimator portal shell + screen routing
│   ├── EstimateList.jsx    # Dashboard / list view
│   ├── EstimateDetail.jsx  # Single estimate detail view
│   └── NewEstimate.jsx     # Create/edit estimate form
├── customer/
│   ├── CustomerView.jsx    # Customer-facing estimate view
│   ├── AcceptedScreen.jsx  # Post-acceptance confirmation
│   ├── DeclineFlow.jsx     # Decline reason flow
│   ├── DeclinedScreen.jsx  # Post-decline confirmation
│   └── SignaturePad.jsx    # Canvas signature capture
└── shared/
    ├── StatusBadge.jsx     # Estimate status badge component
    ├── Toast.jsx           # Toast notification component
    ├── Icon.jsx            # SVG icon component
    └── helpers.js          # Formatting utilities (currency, dates)
```

## Dev

```bash
npm run dev   # starts on port 5173
```
