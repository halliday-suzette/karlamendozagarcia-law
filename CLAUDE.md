# Sitio web — Lic. Karla Mendoza García

Single-page Astro brochure site for a Nicaraguan attorney (León, Nicaragua). Static
output, deployed to GitHub Pages. All visible copy is in Nicaraguan Spanish
(`lang="es-NI"`) — match that register in any new copy, not neutral/Latin American
Spanish.

## Stack and why it looks the way it does

- **Astro 7**, static output, no UI framework — interactivity (mobile nav toggle,
  scroll-reveal) is plain vanilla JS in component `<script>` tags.
- **Tailwind CSS v4** via `@tailwindcss/vite` (see `astro.config.mjs`) — **not**
  `@astrojs/tailwind`. That integration's peer range tops out at Astro 5 and doesn't
  support Astro 7, so don't try to add it.
- **There is no `tailwind.config.mjs`.** Tailwind v4 is configured CSS-first: theme
  colors and font families live in the `@theme` block at the top of
  [`src/styles/global.css`](src/styles/global.css). Add new theme tokens there, not in
  a JS config file.
- Deployed via GitHub Pages (project page, not a `username.github.io` root repo), so
  `astro.config.mjs` sets both `site` and `base: '/karlamendozagarcia-law'`. Any
  internal link that isn't a `#fragment` or `mailto:`/`tel:` needs to be base-aware —
  see the favicon link in `Layout.astro` for the pattern
  (`import.meta.env.BASE_URL.replace(/\/$/, "")` + path; **`BASE_URL` is not
  guaranteed to have a trailing slash**, concatenating naively breaks the URL).
- `.github/workflows/deploy.yml` builds and deploys on push to `main` via
  `withastro/action`. Repo's GitHub Pages source must be set to "GitHub Actions" for
  it to take effect (Settings → Pages).

## Fonts

Three Google Fonts, loaded via `<link>` in `Layout.astro`'s `<head>`, mapped to
Tailwind's built-in `font-serif` / `font-sans` / `font-mono` utilities via `--font-*`
vars in `global.css`'s `@theme` block:

- `font-serif` → Fraunces — nav brand, all headings (h1–h3), pull-quote blockquotes.
- `font-sans` → Public Sans — body copy; this is the `<body>` default, so plain text
  doesn't need the class explicitly.
- `font-mono` → IBM Plex Mono — anything credential/registry-stamp-like: the carné
  number, timeline dates, eyebrow labels, section labels (CORREO, TELÉFONO, etc).

**Gotcha:** the Google Fonts URL only requests specific weight/style combinations
(currently Fraunces 400/500/600 roman + 500 italic, Public Sans 400/500/600/700, IBM
Plex Mono 400/500/600). If you add a `font-bold`/`font-semibold`/etc. to an element
using one of these families, the weight must already be in that URL string in
`Layout.astro`, or the browser silently substitutes the nearest loaded weight instead
of the one you asked for — it doesn't error, it just quietly renders slightly wrong.
When changing font weights, update the Google Fonts URL and the element together.
(IBM Plex Mono 600 was added specifically for the seal graphic's carné number; since
that graphic was removed — see Content notes — nothing currently uses weight 600 on
`font-mono`. Harmless to leave in the URL, fine to trim if you're touching that line
anyway.)

## Structure

```
src/
  layouts/Layout.astro   — <head>: title/meta, JSON-LD (schema.org Attorney, includes
                            her portrait as `image`), fonts, favicon, skip-link;
                            global scroll-reveal IntersectionObserver
  components/
    Nav.astro              — sticky nav, KMG monogram, hamburger toggle (md: breakpoint)
    Hero.astro              — full-bleed background photo (src/assets/images/lady-justice-hero.webp,
                               via astro:assets <Image>) with gradient scrim, name/title/chips/CTA
    About.astro               — "Perfil Profesional" section: portrait (karla-professional-photo.png)
                                 + heading/intro in a two-col layout up top, then bio copy + timeline
    WorkingStyle.astro          — "Su compromiso con cada cliente"
    Credentials.astro            — "Formación y credenciales": single-column info list
                                    (Formación académica / Afiliación profesional / Credencial
                                    oficial) — no graphic, see Content notes below
    InternationalClients.astro    — "¿Se encuentra fuera de Nicaragua?": 2 intro
                                     paragraphs + 2-col brass-bullet checklist + closing
                                     paragraph with an inline #contacto link ("escríbame")
    Practice.astro                 — "Áreas de práctica" grid; areas are PLACEHOLDERS,
                                      flagged in-code, pending client confirmation
    Contact.astro                   — email/phone/address, dark section matching Hero
    Footer.astro                     — credential line + dynamically-computed copyright year
                                        + "Sitio web por Halliday" credit link
  pages/index.astro                  — assembles Layout + all sections in order
  styles/global.css                  — Tailwind entry + @theme (colors, fonts) + a11y/motion CSS
  assets/images/                     — lady-justice-hero.webp (Hero bg), karla-professional-photo.png
                                        (Perfil Profesional portrait) — both go through astro:assets,
                                        never reference these as plain public/ files
```

One component per section — keep it that way when adding sections rather than growing
`index.astro` into a monolith.

Section order in `index.astro`: `Hero → About → WorkingStyle → Credentials →
InternationalClients → Practice → Contact`. Sections strictly alternate `bg-paper` /
`bg-paper-deep` backgrounds for visual separation (Hero and Contact are the `bg-ink`
bookends). If you insert a section, either background works, but you'll need to flip
every section after it to keep the alternation — that's what happened when
`InternationalClients` was inserted before `Practice`: `Practice.astro` flipped from
`bg-paper-deep` to `bg-paper`, which *also* required flipping its cards from `bg-paper`
to `bg-paper-deep` (cards need the opposite tone from their section to read as cards
at all — same reason `WorkingStyle`'s blockquote is `bg-paper` against the section's
`bg-paper-deep`). Check every `bg-paper`/`bg-paper-deep` in a section you're touching,
not just the `<section>` tag's own class.

## Images

Both photos are imported as ESM modules and rendered via `astro:assets`' `<Image>`
(Hero, About), which handles optimization/responsive `widths` automatically. Keep
filenames free of spaces — an image was originally uploaded as `KarlaMG Professional
Picture 1.png`; renamed to `karla-professional-photo.png` before importing, since
spaces in import specifiers are fragile.

If an asset needs to appear in `Layout.astro`'s JSON-LD (e.g. the `image` field on the
Attorney schema), don't hand-write a path — import the asset there too and resolve it
with `getImage()` + `new URL(result.src, Astro.site)` to get a correct absolute URL
that already has the GitHub Pages `base` folded in (see the `profileImage` const in
`Layout.astro`). Don't reuse a relative path string; `getImage()` is what accounts for
the hashed output filename and the `base` prefix correctly.

## Content notes

- The bio copy in `About.astro` and `WorkingStyle.astro` has been revised several
  times as the client refines her wording (headings, pull-quotes, and paragraph text
  have all changed at least once). This file doesn't track exact prose — read the
  component directly for current copy; treat anything quoted below as either a
  structural fact (an id, a class, a number) or an explicit "don't reintroduce X"
  note, not a snapshot of the marketing copy.
- Client-provided facts (name, dates, carné number, email, phone, address) should be
  treated as exact — don't rephrase numbers/dates. Carné is always written
  **"Carné CSJ No. 14680"** (not just "Carné No. ...").
- **There used to be an original circular "notarial seal" SVG** (ring text, scales
  icon, `NotarialSeal.astro`) in the Credentials section. It was removed at the
  client's request — she flagged that a circular graphic reading "CORTE SUPREMA DE
  JUSTICIA / REPÚBLICA DE NICARAGUA" could be mistaken for a real government seal,
  which it wasn't meant to imply. Don't re-add a seal/stamp-style graphic evoking an
  official emblem without checking with the client first; the carné number is
  conveyed as plain text in the "Credencial oficial" list item instead.
- The six practice areas in `Practice.astro` are placeholders pending the client's
  sign-off — there's an in-code comment flagging this; don't remove the comment until
  they're confirmed.
- "Perfil Profesional" (formerly "Sobre mí") is the section id `#perfil-profesional` —
  keep the nav label, `<h2>`, and anchor id in sync if it's renamed again.
- Address is written **"Iglesia San José, 3 c. al Norte"** — capital N on "Norte". It
  appears in both `Contact.astro` and the JSON-LD `streetAddress` in `Layout.astro`;
  keep them in sync.
- The Contact section's Correo/Teléfono/Ubicación values are `text-lg`, not `text-xl`
  — they were sized down specifically so `karlamendoza1970@gmail.com` fits on one
  line. That column's width is capped by the section's `max-w-4xl` container
  regardless of viewport, so this wraps at *every* desktop width, not just narrow
  ones, if the font size goes back up. There's also a `<wbr />` before `.com` in the
  email markup as a safety net so if it ever does wrap, it breaks at a sensible point
  instead of mid-word — don't reintroduce `break-all`, which is what caused that.
- The original brief called for Contact's intro paragraph to note that her email is
  "la misma dirección que utilizan los juzgados para contactarme de forma oficial" —
  that sentence was removed at the client's request. Current copy is just "Si necesita
  asesoría legal o desea agendar una consulta, escríbame directamente al correo."
  Don't re-add the courts-contact-her-here framing without checking with the client.
- `Footer.astro` has a "Sitio web por Halliday" credit line linking to
  `https://hallidayinc.com/` (`target="_blank" rel="noopener noreferrer"` — it's an
  external site, keep that so it opens in a new tab rather than navigating away from
  Karla's page). If you touch that line, watch out for whitespace collapsing between
  the "por" text node and the `<a>` on the next line — that's why it's written as
  `Sitio web por{" "}` rather than a plain trailing space; without the explicit `{" "}`
  Astro drops the space and it renders as "porHalliday".

## Known environment gotchas (from building/testing this repo)

- **Headless-browser screenshot testing on this machine:** headless Edge's
  `--window-size` CLI flag does **not** reliably set the actual layout viewport here
  (Windows display scaling distorts it, and `screen.width` has been observed pinned at
  800px regardless of the flag) — narrow "mobile" screenshots taken this way are not
  trustworthy. Use Playwright's `newPage({ viewport })` instead if you need accurate
  responsive verification; it sets the viewport via the automation protocol, not a CLI
  flag. Install it with `npm install --no-save playwright` (don't add it as a real
  dependency — it's QA-only), and clean it out of `node_modules` afterward.
- **Correction to an earlier note in this file:** the recurring dark, rounded
  icon-cluster that shows up in `npm run dev` screenshots is **Astro's own dev
  toolbar** (it injects several extra `<header>` elements into the page — a Playwright
  `locator('header')` will hit it and throw a strict-mode-violation error listing
  "Featured integrations", "Audit 0", "Settings", etc. Use a specific selector like
  `header.sticky` to get the real nav). It was previously misdiagnosed here as a
  generic "browser/OS chrome artifact." It only appears in dev mode, never in
  `npm run build` output, so it's harmless either way — just don't waste time
  debugging it as a site bug, and don't let it confuse a `locator('header')` query.
- Flex children default to `min-width: auto`, i.e. they won't shrink below their
  content's natural width, which silently overflows on narrow viewports. Nav's brand
  link (`min-w-0` + `truncate` on the name span) and Hero's content wrapper (plain block,
  not `flex flex-col`, since it didn't need flex at all) both hit this; watch for it
  in any new flex row that has to work down to ~360px wide.
- **`npm run dev` can hang and fail with `"Dev server failed to start within 30s."`**
  after `node_modules` churn (e.g. installing/removing the temporary `playwright`
  dependency mentioned above). Fix: `rm -rf node_modules/.vite node_modules/.astro` and retry —
  a stale dependency-optimization cache was the cause both times this happened. Try
  this first before assuming something is actually broken.
- Don't try to debug a stuck dev server by killing `chrome`/`msedge` processes you
  find running — on this machine those are as likely to be the user's real browser
  session as anything automation-related, and Playwright's own bundled Chromium lives
  in `%LOCALAPPDATA%\ms-playwright`, not `Program Files`. Check `Get-Process ... |
  Select Path` before assuming a process is yours to touch.
- Separately from the cache issue above: `npm run dev` can also print `"Dev server
  already running at http://localhost:4321 (pid ####)"` and then just... not be
  reachable — Astro's dev-server daemon state file went stale (e.g. the tracked PID
  was killed by something other than `astro dev stop`). Fix: `npx astro dev stop`
  first (it'll say "Stopped dev server" or "No dev server is running" either way),
  *then* start it. Don't assume "already running" means it's actually up — verify
  with a real request before concluding the server is fine.

## Development

```sh
npm install
npm run dev      # http://localhost:4321/karlamendozagarcia-law/ — note the base path
npm run build    # outputs to ./dist/
npm run preview
```

## Documentation

Full Astro docs: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Images (astro:assets)](https://docs.astro.build/en/guides/images/)
- [Tailwind v4 CSS-first configuration](https://tailwindcss.com/docs/theme)
