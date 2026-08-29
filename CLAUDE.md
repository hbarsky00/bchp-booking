# BitStay — working notes

Vite + React 19 + TypeScript, MUI 7. Booking and rentals front end: stays, commercial
space, a shop, and an admin dashboard. Settlement is crypto-flavoured (BSV, stablecoin,
proof-of-stay tokens).

## Before touching any UI

**Read `DESIGN_SYSTEM.md` first.** It is the authoritative visual spec, not a summary.
Colour and radius values live in `src/app/tokens.ts`; how components consume them lives
in `src/app/theme.ts`. Change those two files, not individual pages.

The traps that have already cost real time:

- A bare numeric `borderRadius` in `sx` is **multiplied** by `theme.shape.borderRadius`.
  `borderRadius: 4` renders 32px. Use `` `${r.md}px` ``.
- A `backgroundImage` in a theme component override paints over any `bgcolor` a page
  sets in `sx`, silently recolouring every custom button.
- MUI maps `subtitle1/2` and `body1/2` onto `<h6>`, corrupting the heading outline.
  Already remapped in the theme — don't undo it.
- `AnimatePresence` with an exit animation on the router deadlocks: two pages stay
  mounted and the browser shows the stale one. The transition is enter-only on purpose.
- Never signal state with `opacity` on a container; it drags contained text below AA.
- Images go through `<Photo>`, never a bare `<img>` or `CardMedia` — it owns the
  skeleton, the fade-in and the error fallback. A cached image never fires `onLoad`,
  so `Photo` settles from the element on mount; don't remove that.

## Commands

```bash
npm run dev        # dev server
npm run build      # typecheck + production build
npm run preview    # serve the build
```

Dev server is registered as `bchp-booking-dev` (:5430) and `bchp-booking-preview`
(:4174) in the parent directory's `.claude/launch.json`.

## Verifying

`npm run build` must pass, then check the pages in a browser at desktop **and** 390px —
several defects here only appeared on mobile. For visual/a11y regressions:

```bash
node ~/Documents/impeccable/cli/bin/cli.js detect http://localhost:4174/<route> --viewport 390x844 --json
```

If the preview server is down, every scan returns `[]`, which reads as a perfect score.
Always confirm the server responds before trusting a clean result.

## State of the app

UI is complete and navigable. **All data is hardcoded** — there is no backend, auth, or
real payment processing; the payment and confirmation screens are simulations.

Known bug, unfixed: Shop's cart (`productQuantities`) and the ShoppingCart page
(`cartItems`) are separate state with no connection, so adding to cart does nothing.
Fixing it needs shared cart state.

## Git

Remote is `hbarsky00/bchp-booking` (`origin`). Push only there, and only when asked.
