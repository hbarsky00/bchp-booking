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
- Every checkout screen renders `<CheckoutHeader>` and nothing else supplies a back
  button or a step count. See the "Checkout" section of `DESIGN_SYSTEM.md`.
- **A screen may not display data it invented.** This app shipped with a payment summary
  naming a room that is in no database, a confirmation calendar fixed to one month, and
  a statistics card contradicting the bookings listed beside it — all of it looking
  exactly like real data. If a value isn't in the booking, the draft or the API, render
  an empty state instead.

## Things that are not addressable but should be

`/property-details` reads its unit from `?unit=<id>` and refetches when arriving cold, so
listings can be shared and refreshed. `/guest-details`, `/payment-method` and
`/booking-confirmed` still depend on router state or the saved draft: entering them
directly redirects out, on purpose. If you add a step, decide which of the two it is.

## Editing this codebase

**Never hand-roll a string replacement in a throwaway script.** Every silent no-op here
came from the same mistake: an `old` string copied from truncated terminal output, so the
replace matched nothing, rewrote the file unchanged, and the build still passed — making
the change look done when it was not. It happened three times in one session.

Use `scripts/patch.py`, which raises unless the edit actually applies:

    PYTHONPATH=scripts python3 -c "
    from patch import replace, must_contain
    replace('src/app/pages/Shop.tsx', 'variant=\\"contained\\"', 'variant=\\"soft\\"', count=2)
    must_contain('src/app/pages/Shop.tsx', 'variant=\\"soft\\"')
    "

`replace` / `sub` demand an exact occurrence count. `replace_lines` takes `expect_first`
and `expect_last` guards, because line numbers drift and an unguarded range edit will
happily overwrite the wrong region. Finish with `must_contain` / `must_not_contain`.

**A passing build is not proof an edit landed.** Confirm it is in the file, then confirm
it in the browser.

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

## Admin authentication

One administrator, no sign-up. Guests book without an account; `/admin` is the only gated
area, and `/login` is the only door into it.

- **The credential is never in the repo.** `ADMIN_PASSWORD_HASH` holds an scrypt hash, and
  `.env` is gitignored. Generate a hash with `npm run admin:password` — it prompts, so the
  password never lands in shell history.
- **The session is an HttpOnly cookie**, signed with `SESSION_SECRET` (32+ chars, fails
  closed if unset). `document.cookie` cannot see it. This replaced a shared token kept in
  sessionStorage, which any injected script could read and replay.
- **The database is the source of truth**, seeded from `ADMIN_EMAIL` /
  `ADMIN_PASSWORD_HASH` on first sign-in. After that the env vars are ignored, which is
  what lets the password be changed from the dashboard without a redeploy.
- **`session_epoch`** is embedded in every cookie and bumped on any password change, so
  changing the password signs out every other device.
- **Lockout after 8 failed attempts, 15 minutes**, counted in the database because
  serverless instances share no memory.
- **Reset links** are single-use, hashed at rest, and expire in 30 minutes. With
  `RESEND_API_KEY` + `RESET_EMAIL_FROM` set they are emailed; otherwise the link is written
  to the function log, which only the site owner can read.

Required environment variables: `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`.
Optional: `RESEND_API_KEY`, `RESET_EMAIL_FROM`. `ADMIN_TOKEN` is dead — delete it.

**Locked out with no mail configured?** Delete the row (`delete from admin_users;`) and the
next sign-in re-seeds it from the environment.

Watch out: Postgres cannot infer a type for a parameter that is both assigned to a column
and compared against another parameter. Every placeholder in the auth queries is cast
explicitly (`$1::int`); without that, `recordFailure` threw on every wrong password, which
turned a 401 into a 500 and meant the lockout never engaged.

## Database

Netlify managed Postgres. `NETLIFY_DATABASE_URL` is injected by Netlify in builds,
deploys and `netlify dev` — there is no secret in the repo and nothing to configure.

```bash
npx netlify database status                  # applied + pending migrations
npx netlify database migrations new -d "..." # creates an EMPTY sql file, write it yourself
npx netlify database migrations apply        # local
npx netlify dev                              # local Postgres + functions on one port
```

Migrations live in `netlify/database/migrations/` and **apply automatically on deploy**.
`migrations new` does not diff `db/schema.ts` — it scaffolds an empty file, so the SQL is
hand-written. `db/schema.ts` documents the shape; it is not the source of migrations.

**Do not use Drizzle for queries here.** Its node-postgres adapter fails every query
against the pool `getDatabase()` returns under `netlify dev`. Use the connection's own
`sql` tagged template via `netlify/lib/db.mts` — it parameterises interpolated values,
and it works on both the local `server` driver and the deployed `serverless` one.

API:
- `/api/products`, `/api/cart` — shop catalogue and the persistent cart
- `/api/units` — stays; with `?checkIn&checkOut` each carries real `available`
- `/api/bookings` — GET by `?reference` or `?guestKey`, POST to create, PATCH to cancel
- `/api/admin` — every booking incl. guest PII. **Gated on `ADMIN_TOKEN` and fails
  closed**: unset variable means the endpoint refuses, never defaults to public.

**Double-booking is prevented by a row lock, not a constraint.** The booking transaction
does `select … from units where id = $1 for update` before checking overlap, so every
booking for a unit serialises. A GiST exclusion constraint would be better, but the local
dev database is PGlite (Postgres in WASM) with no contrib extensions, so `btree_gist`
would only exist in production. Stays are half-open `[check_in, check_out)`, so one guest
may arrive the day another leaves.

## State of the app

The shop cart is real: it persists in Postgres and is shared between Shop and the Cart
page. Carts are keyed by an id the browser mints into `localStorage` — there is no auth
yet, so a cart is per-browser.

Stays, availability, bookings and the admin dashboard are all real too. Search reflects
what is genuinely free, paying writes a booking, cancelling frees the dates.

**Still simulated:** payment itself. No money moves — choosing BSV or a card just records
`payment_method` and marks the booking paid. Guest identity is a browser-minted key in
`localStorage`, so bookings and carts are per-browser; there is no login, no email is
ever sent, and clearing site data orphans a booking (it survives in the database and is
still reachable by its reference).

## Git

Remote is `hbarsky00/bchp-booking` (`origin`). Push only there, and only when asked.
