// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Deployed via GitHub Pages behind the custom domain abogadakarlamendoza.com — served
// from the domain root, so no `base` path (unlike the earlier
// halliday-suzette.github.io/karlamendozagarcia-law/ project-pages URL).
export default defineConfig({
	site: 'https://abogadakarlamendoza.com',
	vite: {
		plugins: [tailwindcss()],
	},
});
