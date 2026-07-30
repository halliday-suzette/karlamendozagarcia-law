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
- Deployed via GitHub Pages behind a **custom domain, `abogadakarlamendoza.com`**,
  served from the domain root. `astro.config.mjs` sets `site` to that domain and has
  **no `base`**. `public/CNAME` (containing just `abogadakarlamendoza.com`) is what
  makes GitHub Pages recognize the custom domain — Astro copies `public/` verbatim
  into `dist/`, so this file has to exist in the repo and ship with every deploy, or
  GitHub Pages silently reverts to serving only the `github.io` URL. Do not delete it.
  - **This project used to be hosted at the GitHub Pages *project* URL**
    (`halliday-suzette.github.io/karlamendozagarcia-law/`), which required
    `base: '/karlamendozagarcia-law'`. When the custom domain was added, the site
    briefly went out completely unstyled (raw HTML, no CSS/fonts/images, giant
    literal hamburger-icon SVGs) because every asset URL was still being generated
    with that `/karlamendozagarcia-law/` prefix, which 404s at the domain root. If
    you ever see that failure mode again, check `astro.config.mjs` for a stray
    `base` first — it's the same bug. Any internal link that isn't a `#fragment` or
    `mailto:`/`tel:` still shouldn't be hardcoded with a leading slash assumption
    baked in from memory of the old setup; check `import.meta.env.BASE_URL` usage
    (e.g. the favicon link in `Layout.astro`) if `base` ever comes back for any reason
    (**`BASE_URL` is not guaranteed to have a trailing slash** — concatenating
    naively breaks the URL; that's why the favicon link does
    `.replace(/\/$/, "")` + path rather than a plain string join).
- `public/google553bd40e1b13ed74.html` is a Google Search Console domain-ownership
  verification file. Same mechanism as `public/CNAME` above: it only works because
  everything in `public/` ships verbatim into `dist/`, so it has to live there (not
  the project root) to be reachable at
  `https://abogadakarlamendoza.com/google553bd40e1b13ed74.html` after deploy. It was
  originally downloaded straight into the project root by mistake, which would have
  404'd post-deploy and failed Google's check — moved into `public/` to fix that.
  Don't delete this file; if Search Console verification is ever redone, a new
  filename will be issued, and the old one can be removed only once the new one is
  confirmed verified (removing it prematurely can drop the property back to
  "unverified").
- `.github/workflows/deploy.yml` builds and deploys on push to `main` via
  `withastro/action`. Repo's GitHub Pages source must be set to "GitHub Actions" for
  it to take effect (Settings → Pages). The custom domain itself is configured in two
  places that both have to agree: the repo's **Settings → Pages → Custom domain**
  field, and `public/CNAME` in this repo — if they ever diverge, trust `public/CNAME`
  as the source of truth since that's what actually ships.

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
                            her portrait as `image`, + FAQPage), fonts, favicon,
                            skip-link, Plausible analytics snippet (see Content notes);
                            global scroll-reveal IntersectionObserver; renders
                            <WhatsAppButton /> after <slot /> so it's on every page
  components/
    Nav.astro              — sticky nav, KMG monogram, hamburger toggle (md: breakpoint)
    WhatsAppButton.astro   — fixed bottom-right floating CTA (site-wide, via Layout),
                             visible "Contáctame" label, uses src/lib/whatsapp.ts
    Hero.astro              — full-bleed background photo (src/assets/images/lady-justice-hero.webp,
                               via astro:assets <Image>) with gradient scrim, name/title/chips/CTA
    About.astro               — "Perfil Profesional" section: portrait (karla-professional-photo.png)
                                 + heading/intro in a two-col layout up top, then bio copy + timeline
    WorkingStyle.astro          — "Su compromiso con cada cliente"
    Credentials.astro            — "Formación y credenciales": single-column info list
                                    (Formación académica / Afiliación profesional / Credencial
                                    oficial) — no graphic, see Content notes below
    InternationalClients.astro    — "¿Se encuentra fuera de Nicaragua?": brief 2–3
                                     sentence summary + 2-col brass-bullet checklist +
                                     closing paragraph linking to #preguntas-frecuentes
                                     and #contacto (kept intentionally short — see
                                     Content notes)
    Practice.astro                 — "Áreas de práctica" grid; areas are PLACEHOLDERS,
                                      flagged in-code, pending client confirmation
    Faq.astro                       — "Preguntas frecuentes", renders src/lib/faq.ts;
                                       backs the FAQPage JSON-LD in Layout.astro — don't
                                       change question/answer content here without also
                                       checking that JSON-LD block
    Contact.astro                    — hosts <ConsultationForm /> as the primary content,
                                        then a secondary "También puede contactarme
                                        directamente" NAP grid (email/phone/WhatsApp/
                                        address) below a divider; dark section matching Hero
    ConsultationForm.astro            — "Formulario de Solicitud de Consulta": 5-section
                                         form (contact info / case details / conditional
                                         overseas-logistics fields / contact preference /
                                         consent), Formspree-backed (see Content notes),
                                         vanilla-JS validation + inline success/error
                                         states; imported by Contact.astro only, not a
                                         top-level section in index.astro
    Footer.astro                       — credential line + dynamically-computed copyright
                                          year + "Sitio web por Halliday" credit link
  pages/index.astro                    — assembles Layout + all sections in order
  styles/global.css                    — Tailwind entry + @theme (colors, fonts) + a11y/motion CSS
  lib/whatsapp.ts                      — single source of truth for the wa.me URL (number +
                                          prefilled message, built with encodeURIComponent) —
                                          imported by both WhatsAppButton.astro and Contact.astro
  lib/faq.ts                           — question/answer data for Faq.astro; also the source
                                          for Layout.astro's FAQPage JSON-LD, so the two never
                                          drift apart by construction
  assets/images/                       — lady-justice-hero.webp (Hero bg), karla-professional-photo.png
                                          (Perfil Profesional portrait) — both go through astro:assets,
                                          never reference these as plain public/ files
```

One component per section — keep it that way when adding sections rather than growing
`index.astro` into a monolith.

Section order in `index.astro`: `Hero → About → WorkingStyle → Credentials →
InternationalClients → Practice → Faq → Contact`. Sections strictly alternate `bg-paper` /
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
against `Astro.site` (see the `profileImage` const in `Layout.astro`). Don't reuse a
relative path string; `getImage()` is what accounts for the hashed output filename.
(This mattered even more when the site had a `base` path folded into every asset URL —
see the custom-domain migration note above — but the pattern is still the right one
now: never assume what an asset's public URL looks like, always derive it.)

## Content notes

- The copy in `Hero.astro`, `About.astro`, `WorkingStyle.astro`, and the WhatsApp
  prefilled message in `lib/whatsapp.ts` has been revised several times as the client
  refines her wording (headings, the eyebrow line, chip text, pull-quotes, paragraph
  text, and the WhatsApp message have all changed at least once — e.g. the Hero `<h1>`
  has flipped between "Lic. Karla Mendoza García" and "Licenciada Karla Mendoza
  García" more than once). This file doesn't track exact prose — read the component
  directly for current copy; treat anything quoted below as either a structural fact
  (an id, a class, a number) or an explicit "don't reintroduce X" note, not a
  snapshot of the marketing copy.
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
- The Contact section's Correo/Teléfono/Ubicación values are `text-lg`, not `text-xl`.
  Sizing down alone turned out **not** to be enough to keep
  `karlamendoza1970@gmail.com` on one line: at the `lg` breakpoint the "También puede
  contactarme directamente" grid used to be a flat `lg:grid-cols-4` inside the
  section's `max-w-4xl` container, giving every column a fixed ~200px regardless of
  viewport — ~60px short of what the email needs at `text-lg`, so it wrapped at
  *every* desktop width, not just narrow ones. Fixed by widening just the Correo
  track: `lg:grid-cols-[1.8fr_1fr_1fr_1fr]` (Correo gets ~1.8x a normal column, the
  other three still have plenty of room) plus `whitespace-nowrap` on the email link
  itself (replacing `break-words`, which is what let it wrap in the first place).
  There's still a `<wbr />` before `.com` in the markup as a defense-in-depth
  fallback in case the address ever changes to something longer — don't reintroduce
  `break-all`, and don't shrink the grid back to plain equal `lg:grid-cols-4` without
  re-checking that the email still fits.
- The original brief called for Contact's intro paragraph to note that her email is
  "la misma dirección que utilizan los juzgados para contactarme de forma oficial" —
  that sentence was removed at the client's request. Current copy is just "Si necesita
  asesoría legal o desea agendar una consulta, escríbame directamente al correo."
  Don't re-add the courts-contact-her-here framing without checking with the client.
- **WhatsApp**: the number is `50587328420` and the prefilled message is defined once
  in `src/lib/whatsapp.ts` (`whatsappUrl`) — never hand-build a `wa.me` URL elsewhere;
  import `whatsappUrl` instead, or the number/message can drift out of sync between
  the floating button and the Contact section link. The floating button
  (`WhatsAppButton.astro`) is intentionally the one place on the site that breaks the
  brass/ink/paper palette — it uses WhatsApp's own brand green (`#25D366`) on purpose,
  for recognizability, the same way a "Pay with PayPal" button would. Both WhatsApp
  links carry a `data-analytics="whatsapp-*-click"` attribute that is still **not
  wired to anything** — Plausible (see below) doesn't auto-track it; that would need
  explicit `plausible('whatsapp-...-click')` calls added deliberately, not assumed.
  - **There are exactly two WhatsApp touchpoints on the page** (floating button +
    Contact card link) — `WhatsAppButton.astro` is only ever rendered once, from
    `Layout.astro`, right after `<slot />`. If it's ever reported as appearing a
    third time "after the footer," that's very likely someone reading raw DOM/source
    order and mistaking the floating button's actual position in the markup (it sits
    right after `<Footer />` in source, since Layout renders it post-slot) for a
    second instance — it's `position: fixed`, so it always renders pinned
    bottom-right regardless of where it sits in the DOM. Confirm with
    `grep -o 'wa\.me' dist/index.html | wc -l` (should be 2) before assuming a real
    duplicate-render bug and touching `Layout.astro`.
- **Analytics and the contact form are no longer both declined.** An earlier version
  of this note said the client explicitly chose to skip both, relying on
  email/phone/WhatsApp instead — that decision was revisited and both have since been
  added: a real consultation-request form (`ConsultationForm.astro`, see below) and
  Plausible analytics (also below). If you're asked to add either again, they already
  exist — check there first rather than re-implementing from scratch or assuming the
  old "client declined" framing still holds.
- **`ConsultationForm.astro`** ("Formulario de Solicitud de Consulta") submits via
  Formspree, not a custom backend — the endpoint is hardcoded as
  `FORMSPREE_ENDPOINT` at the top of the component
  (`https://formspree.io/f/mqernrga`, a real, live production form ID — treat it as a
  client-provided fact like the carné number, don't swap it back to a placeholder).
  Client-side validation is custom vanilla JS with Spanish error messages (the form
  has `novalidate` so the browser's native, locale-dependent validation text never
  shows); submission is AJAX (`fetch` + `Accept: application/json`) so success shows
  an inline confirmation panel instead of a redirect. Sección 3 (overseas-logistics
  questions) is hidden by default via the `inert` attribute plus Tailwind
  opacity/max-height/translate transition classes, and only becomes visible +
  `required` when "¿Dónde se encuentra actualmente?" is answered with something other
  than León or another Nicaraguan city — toggled in the component's own `<script>`,
  not the global reveal system in `Layout.astro` (deliberately kept separate; that
  global `IntersectionObserver` is for whole-section scroll-reveal, a different
  concern from a field's conditional visibility). The Hero CTA ("Solicitar una
  consulta →") targets `#formulario-consulta`, not `#contacto` — clicking it
  smooth-scrolls to the form specifically and focuses the "Nombre completo" field,
  handled by a click listener in `ConsultationForm.astro` that intercepts the anchor
  and calls `scrollIntoView` + `.focus()` (respects `prefers-reduced-motion`). The
  Sección 5 consent-checkbox copy is exact client/legal-review language (not
  paraphrasable marketing copy like most of the site) — treat it the same way as the
  carné number or address: don't casually reword it. The `#form-submit-error` panel
  (shown when the Formspree POST fails) is deliberately just one short line — "Por
  favor intente nuevamente, o contáctenos directamente más abajo." — with no
  email/WhatsApp links of its own; it used to repeat both in full, which duplicated
  the NAP grid sitting a few lines below it in the same section. Don't re-add contact
  links there; point people at the card below instead.
- `InternationalClients.astro` used to carry a second paragraph explaining *how* an
  overseas client can act through a poder without traveling — that's now covered in
  more depth by two `lib/faq.ts` entries ("¿Puede un nicaragüense en el extranjero...
  sin viajar...?" and "¿Atiende clientes fuera de León?"), so it was cut down to a
  brief summary to avoid saying the same thing twice a few sections apart. Don't
  re-expand this section's prose to re-explain the mechanics — extend the FAQ entries
  instead, and keep this section as the short version + pointer.
- **Plausible analytics** is wired into `Layout.astro`'s `<head>`, right after the two
  JSON-LD `<script>` blocks: a loader script tag (pointed at
  `plausible.io/js/pa-KjW10VMDAfWM5-5bZ8p3z.js`, this site's actual Plausible script
  ID) plus a small `window.plausible = ...` init snippet, tracking pageviews
  site-wide, cookie-free (no consent banner needed). Both `<script>` tags carry
  Astro's `is:inline` directive — without it, Astro processes/bundles `<script>` tags
  by default (adds `type="module"`, may dedupe/rewrite them), which can silently
  break a third-party snippet like this that depends on running exactly as given, in
  global scope, in order. Any other third-party embed added to this site should get
  the same `is:inline` treatment. This does **not** wire up the
  `data-analytics="whatsapp-*-click"` attributes mentioned above — those still don't
  fire anything.
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
npm run dev      # http://localhost:4321/
npm run build    # outputs to ./dist/
npm run preview
```

## Documentation

Full Astro docs: https://docs.astro.build

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Images (astro:assets)](https://docs.astro.build/en/guides/images/)
- [Tailwind v4 CSS-first configuration](https://tailwindcss.com/docs/theme)
