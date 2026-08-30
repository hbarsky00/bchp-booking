# BitStay Design System

The authoritative reference for this app's visual language. **Read this before changing
any UI.** If a change conflicts with this document, either the change is wrong or this
document needs updating first — never let the two disagree silently.

Two files enforce everything here:

| File | Owns |
| --- | --- |
| `src/app/tokens.ts` | Every colour and radius value. The only place raw hex or px radii may appear. |
| `src/app/theme.ts` | How MUI components consume those tokens: type scale, shape, per-component overrides. |

---

## Non-negotiables

1. **No raw hex in a page or component.** Import `c` from `tokens.ts`. A grep for
   `#[0-9a-fA-F]{6}` outside `tokens.ts` must return nothing.
2. **No bare numeric `borderRadius` in `sx`.** MUI multiplies it by
   `theme.shape.borderRadius`, so `borderRadius: 4` renders 32px, not 4px. Always write
   `` borderRadius: `${r.md}px` `` or use a `theme.shape`-driven component default.
3. **Never set `backgroundImage` in a theme component override.** It paints over any
   `bgcolor` a page sets in `sx`, silently recolouring every custom button.
4. **Text must clear WCAG AA** — 4.5:1 body, 3:1 large. The scale below is pre-checked;
   colours outside it are not.
5. **Every animation respects `prefers-reduced-motion`.**
6. **No exit animation on route transitions.** See "Routing" below — this caused a real
   outage where two pages stayed mounted at once.

---

## Brand

**BitStay.** The mark is a roofline over two uprights — shelter, and the two stems of ₿.
It lives in `src/app/components/BitStayMark.tsx` as inline SVG; use that, never a raster
copy, so it stays crisp and can invert on dark surfaces.

Generated assets in `public/` (regenerate with the Pillow script in the commit history
if the mark ever changes): `favicon.ico` (16–256), `apple-touch-icon.png`, `icon-192`,
`icon-512`, `og-image.png` (1200×630), `site.webmanifest`.

The wordmark is Figtree 800 at `-0.035em` tracking. Never letterspace it loosely and
never render "Bitstay" or "BITSTAY" — the internal capital S is part of the name.

## Colour

Warm hospitality: stone neutrals carry the interface, one coral carries action, green
carries on-chain trust. Coral is deliberately darker than the coral common on travel
sites, which fails AA the moment it holds a label.

### Neutrals — `c.stone*`
| Token | Hex | Use |
| --- | --- | --- |
| `stone50` | `#FAF9F7` | Section wash, hover fill |
| `stone100` | `#F4F2EE` | Inset panels, icon tiles |
| `stone200` | `#E7E3DC` | **Every border and divider** |
| `stone300` | `#D5CFC5` | Input borders, stronger hairlines |
| `stone500` | `#857C70` | Disabled only — **4.1:1, never body text** |
| `stone600` | `#645C52` | Secondary text (`text.secondary`) |
| `stone800` | `#332F2A` | — |
| `stone900` | `#1C1917` | Primary text, avatars, star glyphs |

### Action — `c.coral*`
| Token | Hex | Use |
| --- | --- | --- |
| `coral50` / `coral100` | `#FFF5F5` / `#FFE4E6` | Selected-state tint |
| `coral500` | `#E14A63` | Saved heart, logo gradient stop. **Not for text or as a bed for white text** (3.9:1) |
| `coral600` | `#C92A4B` | `primary.main`. White text = 5.4:1 |
| `coral700` | `#A11D3C` | Hover, `primary.dark` |
| `coral800` | `#7C1631` | Pressed |

### Trust / status
`green700` (`#0F6B47`) is `success.main` and the on-chain verified mark.
`amber500` (`#C77F1A`) is `warning.main` and **takes ink text, not white** (white is 3.2:1).
`red600` (`#B93030`) is `error.main`.

---

## Radius — `r`

| Token | px | Use |
| --- | --- | --- |
| `r.none` | 0 | Full-bleed |
| `r.sm` | 6 | Small thumbnails (≤64px) |
| `r.md` | 8 | **Default.** Images, cards, buttons, inputs, icon tiles |
| `r.lg` | 10 | Hero and other large surfaces |
| `r.xl` | 12 | Rare, largest panels |
| `r.pill` | 999 | Chips, badges, the header search recall |

`theme.shape.borderRadius` is `r.md` (8). **Images never exceed `r.md`** — big soft
corners on photography were explicitly rejected.

---

## Type

**Figtree**, one family. Hierarchy comes from size, weight and tracking — never from a
second typeface. Do not switch to Inter, Roboto, or Space Grotesk; all are flagged as
generic-AI defaults.

| Role | Weight | Size | Tracking |
| --- | --- | --- | --- |
| `h1` | 800 | `clamp(1.75rem, 1.2rem + 2.4vw, 2.75rem)` | −0.03em |
| `h2` | 700 | `clamp(1.5rem, 1.15rem + 1.6vw, 2rem)` | −0.022em |
| `h3` | 700 | `clamp(1.3rem, 1.1rem + 0.9vw, 1.625rem)` | −0.018em |
| `h4` | 700 | `clamp(1.15rem, 1.05rem + 0.5vw, 1.375rem)` | −0.014em |
| `h5` | 600 | 1.125rem | −0.01em |
| `h6` | 600 | 1rem | −0.006em |
| `body1` | 400 | 1rem / 1.55 | — |
| `body2` | 400 | 0.9375rem / 1.5 | — |

Headings are fluid; they must never be fixed-size (a 2.5rem `h1` ate a third of a phone
screen). Prose is capped at **56ch** via a `MuiTypography` override.

### Semantics
MUI maps `subtitle1`, `subtitle2`, `body1` and `body2` onto `<h6>` by default, which
silently corrupts the heading outline. `theme.ts` remaps them to `<p>`. Consequences:

- Section and card titles: `variant="h5|h6" component="h2"`.
- **A price is not a heading.** Use `component="p"` and add `className="tnum"` for
  tabular figures.

---

## Navigation and structure

Primary nav is **places you browse**: Stays, Commercial, Shop, Trips. Account-level
destinations (Help centre, Contact support, Admin) live in the avatar menu — they are
not peers of Stays, and putting them in the bar pushed the mobile bottom nav to six
cramped items.

Every page ships a skip link, a `<main id="main">` landmark and `<nav>` regions. Without
them a keyboard user tabs the whole header on every route (WCAG 2.4.1).

## Accessibility floor

Non-negotiable, all verified per route in the browser:

- **Every icon-only control has an `aria-label`**, and it names its object: `Remove
  Bottled Water from cart`, not `Remove`.
- **Every input has an accessible name.** A `<Typography>` sitting above a field is not
  a label, and neither is a placeholder — it disappears on input and is announced
  inconsistently. Use MUI's `label` prop or `inputProps={{ 'aria-label': … }}`.
- One `<h1>` per page; section titles are `h2`.

## Spacing and layout

8px base (`spacing: 8`). Page gutters `py: {xs: 3, md: 5}`; mobile adds `pb: 12` to clear
the bottom nav. Listing grids: `spacing={{xs: 3, md: 4}}`, `rowSpacing={{xs: 4, md: 5}}`.

Page headers must be wrap-safe — `flexWrap: 'wrap'` with a `gap`, or a trailing chip
collides with a wrapping `h1`.

---

## Components

**Buttons — three tiers, and the tiers are the point.**

| Tier | Use | Looks like |
| --- | --- | --- |
| `variant="contained"` | **One per screen.** The single action the page exists for. | Filled coral |
| `variant="soft"` | An action repeated in a list — add to cart, per-row view. | Coral-tinted fill, coral text |
| `variant="outlined"` | Secondary or escape — back, skip, cancel. | Hairline border, ink text |

A product grid rendering twelve filled "Add to cart" buttons leaves the page's real
primary with nothing to stand out against; that is what `soft` exists to prevent. If a
screen shows more than one filled button, one of them is wrong.

All tiers: `r.md`, no elevation, `minHeight: 44` (thumb target), sentence case. Never add
a gradient in the theme — it paints over any `bgcolor` a page sets.

**Cards** — `elevation={0}`, `1px solid stone200`, `r.lg`. Depth comes from the border,
not shadow. A 1px border under a wide shadow blur is a recognised generated-UI tell.

**Listing cards** — no card chrome at all. The photo *is* the card: `r.md`, `20/19`
aspect, `objectFit: cover`, hover `scale(1.045)` over 0.45s. Below it, in order: title +
rating on one line, meta line, then `$price night`. Interactive wrapper needs
`role="button"`, `tabIndex`, `aria-label`, and Enter/Space handling.

**Inputs** — `r.md`, white fill, `stone300` border, `stone500` on hover.

**Chips** — pill, `minHeight: 28`, 4px vertical padding. Zero vertical inset was a
94-instance finding.

**Images — always `<Photo>`** (`src/app/components/Photo.tsx`). Never render a bare
`<img>` or `CardMedia`. `Photo` reserves the final box, shows a wave `Skeleton` behind it
while loading, and falls back to a broken-image glyph on error, so nothing reflows and a
dead URL degrades quietly.

```tsx
<Photo src={unit.image} alt={unit.name} ratio="20 / 19" />          {/* fluid  */}
<Photo src={item.image} alt={item.name} radius={r.sm} sx={{ width: 64, height: 64 }} />
```

`ratio` for fluid images, `sx` width/height for fixed ones, `eager` for anything above
the fold. Two rules inside it are load-bearing, both learned the hard way:

- It settles its own state from the element on mount. A cached image is already
  `complete` before React attaches `onLoad`, so that event never fires and the photo
  would otherwise sit invisible behind a skeleton forever.
- **The image is never transparent at rest and its opacity is never animated.** The
  skeleton sits *behind* it, so an unloaded image is simply unpainted. Any fade that
  starts from `opacity: 0` pins the photo invisible whenever animations are throttled —
  a background tab is enough — and a loaded image must never depend on an animation
  running in order to be seen.

**Loading states — skeletons, never spinners.** A skeleton occupies the same box as the
content it replaces. `LoadingFallback` is the route-level fallback and mimics the shell
(header, title block, card grid) rather than centring a spinner on an empty page.

**Never** signal state with `opacity` on a container — it drags all contained text below
AA. Grayscale the image instead and keep the label at full contrast.

---

## Motion

Enter 0.26s, `cubic-bezier(.22, 1, .36, 1)`. Reduced-motion: 0.12s, no travel.
Animate `transform`, `opacity` and `filter` only — never `width`, `height` or `margin`.

### Routing — do not change without reading this
`App.tsx` uses a single `motion.div` keyed on `location.pathname`, **with no
`AnimatePresence` and no exit animation**. With `AnimatePresence mode="wait"`, a lazy
page suspending inside it meant the outgoing route's exit never completed: two pages
stayed mounted and the browser painted the stale one on top. Adding an exit animation
back reintroduces that.

---

## Checks

```bash
npm run build                              # typecheck + build
grep -rE "#[0-9a-fA-F]{6}" src/app/pages   # must be empty
```

Visual and accessibility regressions are caught with the impeccable detector:

```bash
node ~/Documents/impeccable/cli/bin/cli.js detect http://localhost:4174/book-stay --viewport 390x844
```

Findings under `layout-transition` and `clipped-overflow-container` are MUI's own
Accordion/Collapse/Tabs CSS and are accepted. Everything else is ours and should be zero.
