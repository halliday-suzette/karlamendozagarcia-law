// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Deployed via GitHub Pages at https://halliday-suzette.github.io/karlamendozagarcia-law/.
// If a custom domain is added later (via a CNAME), change `site` to that domain and
// remove `base`.
export default defineConfig({
	site: 'https://halliday-suzette.github.io',
	base: '/karlamendozagarcia-law',
	vite: {
		plugins: [tailwindcss()],
	},
});
