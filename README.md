# BCHP Booking

Booking and rentals front end for BCHP — stays, commercial rentals, a shop, and an admin
dashboard. React + TypeScript on Vite, with Material UI (Material Design 3 theme) for the
entire interface.

## Stack

- **React 19** + **TypeScript**, bundled by **Vite 7**
- **MUI 7** (`@mui/material`, `@mui/icons-material`) — the sole UI layer; theme in `src/app/theme.ts`
- **React Router 7** — all routes in `src/app/App.tsx`, every page lazy-loaded
- **Motion** (`motion/react`) — page transitions
- Fonts: Raleway (headings) + Roboto (body), loaded in `src/styles/fonts.css`

## Getting started

```bash
npm install
npm run dev
```

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Dev server with HMR                   |
| `npm run build`   | Typecheck, then production build       |
| `npm run preview` | Serve the production build locally    |
| `npm run typecheck` | Types only, no emit                 |

## Layout

```
src/
  main.tsx              entry point
  app/
    App.tsx             routes + providers
    theme.ts            MUI Material Design 3 theme
    components/         Layout, PageTransition, ScrollToTop, LoadingFallback
    pages/              15 route components
  styles/               font imports
```

`@` is aliased to `src/`.

## Routes

`/book-stay` (default) · `/shop` · `/commercial-rental` · `/search-results` ·
`/property-details` · `/guest-details` · `/payment-method` · `/processing-payment` ·
`/booking-confirmed` · `/shopping-cart` · `/my-bookings` · `/booking-details/:id` ·
`/admin` · `/contact-support` · `/faqs`

`/property-details` expects a selected unit in router state and redirects to
`/search-results` when opened directly — that is intentional.

## Status

The UI is complete and navigable, but all data is hardcoded in the page components.
There is no backend, auth, or payment processing yet; the payment and booking flows are
front-end simulations.
