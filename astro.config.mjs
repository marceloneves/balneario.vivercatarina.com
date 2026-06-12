// @ts-check
import { defineConfig } from 'astro/config';
import { SITE_URL } from './src/lib/site-contact.mjs';

// https://astro.build/config
export default defineConfig({
	output: 'static',
	site: SITE_URL,
	vite: {
		server: {
			watch: {
				ignored: ['**/src/data/imoveis/**', '**/dist/**', '**/.vercel/**'],
			},
		},
	},
});
