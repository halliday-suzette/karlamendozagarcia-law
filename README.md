# Sitio web — Lic. Karla Mendoza García

Sitio de una sola página (brochure) para Lic. Karla Mendoza García, Abogado y Notario
Público en León, Nicaragua. Construido con [Astro](https://astro.build) y
[Tailwind CSS](https://tailwindcss.com) v4, sin frameworks de UI adicionales.

## Requisitos

- Node.js 22.12 o superior
- npm

## Desarrollo local

```sh
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:4321/karlamendozagarcia-law/` (incluye el
`base` de GitHub Pages configurado en `astro.config.mjs`).

## Compilar para producción

```sh
npm run build
```

Genera el sitio estático en `./dist/`, listo para desplegar en GitHub Pages, Netlify,
Vercel o cualquier hosting estático.

```sh
npm run preview
```

Sirve el resultado de `./dist/` localmente para revisarlo antes de publicar.

## Desplegar en GitHub Pages

El repositorio incluye un workflow (`.github/workflows/deploy.yml`) que compila y
publica el sitio automáticamente en cada push a `main`, usando la acción oficial
[`withastro/action`](https://github.com/withastro/action).

Para activarlo:

1. En GitHub, ir a **Settings → Pages** del repositorio.
2. En **Source**, seleccionar **GitHub Actions**.
3. Hacer push a `main`; el workflow compila el sitio y lo publica en
   `https://halliday-suzette.github.io/karlamendozagarcia-law/`.

`astro.config.mjs` ya está configurado con `site` y `base` para esa URL. Si más
adelante se usa un dominio propio (vía un archivo `CNAME`), hay que cambiar `site` a
ese dominio y quitar `base`.

## Estructura

```
src/
  layouts/Layout.astro     — <head>, metadatos, JSON-LD, fuentes, script de scroll-reveal
  components/               — una sección o pieza de UI por archivo
  pages/index.astro         — ensambla todas las secciones en la página única
  styles/global.css         — entrada de Tailwind y tema (colores, tipografías)
```

## Antes de publicar

- Confirmar con la clienta las seis áreas de práctica en
  [`src/components/Practice.astro`](src/components/Practice.astro) — están marcadas
  como marcador de posición (placeholder) pendiente de su aprobación.
- Sustituir `public/favicon.svg` si se define un monograma/logo definitivo.
