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

## Structure

```
src/
  layouts/Layout.astro   — <head>: title/meta, JSON-LD (schema.org Attorney), fonts,
                            favicon, skip-link; global scroll-reveal IntersectionObserver
  components/
    Nav.astro              — sticky nav, KMG monogram, hamburger toggle (md: breakpoint)
    Hero.astro              — full-bleed background photo (src/assets/images/lady-justice-hero.webp,
                               via astro:assets <Image>) with gradient scrim, name/title/chips/CTA
    About.astro               — "Perfil Profesional" section: bio copy + timeline
    WorkingStyle.astro          — "Su forma de trabajar con los clientes"
    Credentials.astro            — "Formación y credenciales": info list + <NotarialSeal />
    NotarialSeal.astro            — original circular seal SVG (not a real government
                                     emblem); ring text is placed char-by-char via computed
                                     trig in the frontmatter, not <textPath> — see comments
    Practice.astro                 — "Áreas de práctica" grid; areas are PLACEHOLDERS,
                                      flagged in-code, pending client confirmation
    Contact.astro                   — email/phone/address, dark section matching Hero
    Footer.astro                     — credential line + dynamically-computed copyright year
  pages/index.astro                  — assembles Layout + all sections in order
  styles/global.css                  — Tailwind entry + @theme (colors, fonts) + a11y/motion CSS
```

One component per section — keep it that way when adding sections rather than growing
`index.astro` into a monolith.

## Content notes

- Client-provided facts (name, dates, carné number, email, phone, address) should be
  treated as exact — don't rephrase numbers/dates. Carné is always written
  **"Carné CSJ No. 14680"** (not just "Carné No. ...") to stay consistent with the seal
  graphic.
- The six practice areas in `Practice.astro` are placeholders pending the client's
  sign-off — there's an in-code comment flagging this; don't remove the comment until
  they're confirmed.
- "Perfil Profesional" (formerly "Sobre mí") is the section id `#perfil-profesional` —
  keep the nav label, `<h2>`, and anchor id in sync if it's renamed again.

## Known environment gotchas (from building/testing this repo)

- **Headless-browser screenshot testing on this machine:** headless Edge's
  `--window-size` CLI flag does **not** reliably set the actual layout viewport here
  (Windows display scaling distorts it, and `screen.width` has been observed pinned at
  800px regardless of the flag) — narrow "mobile" screenshots taken this way are not
  trustworthy. Use Playwright's `newPage({ viewport })` instead if you need accurate
  responsive verification; it sets the viewport via the automation protocol, not a CLI
  flag. Install it with `npm install --no-save playwright` (don't add it as a real
  dependency — it's QA-only), and clean it out of `node_modules` afterward.
- A recurring dark, rounded icon-cluster overlay sometimes appears in headless
  Edge/Chromium screenshots (confirmed by testing: it tracks the *viewport* edge, not
  page content, across different window sizes). It's a browser/OS chrome artifact from
  the automation capture, not a bug in the site.
- Flex children default to `min-width: auto`, i.e. they won't shrink below their
  content's natural width, which silently overflows on narrow viewports. Nav's brand
  link (`min-w-0` + `truncate` on the name span) and Hero's content wrapper (plain block,
  not `flex flex-col`, since it didn't need flex at all) both hit this; watch for it
  in any new flex row that has to work down to ~360px wide.

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
