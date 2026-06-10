/**
 * Aplica Leia também + hub conforme planilha do cluster Campeche.
 * Uso: node scripts/apply-campeche-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	CAMPECHE_SLUGS,
	HUB_ARTICLES,
	LEIA_TAMBEM,
	PILLAR,
	HUB_HREF,
	renderHubBlock,
	renderLeiaTambem,
} from './campeche-cluster-linking.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

function replaceFirstLeiaTambem(html, newBlock) {
	const re = /<div class="blog-related">\s*<p class="blog-related__title">Leia também<\/p>[\s\S]*?<\/div>/;
	if (!re.test(html)) {
		return null;
	}
	return html.replace(re, newBlock);
}

function ensureHubBlock(html, slug) {
	if (!HUB_ARTICLES.has(slug) || html.includes(HUB_HREF)) {
		return html;
	}
	const hub = renderHubBlock(slug);
	const re = /(<div class="blog-related">\s*<p class="blog-related__title">Leia também<\/p>[\s\S]*?<\/div>)/;
	if (re.test(html)) {
		return html.replace(re, `$1\n\n${hub}`);
	}
	return `${html.trim()}\n\n${hub}\n`;
}

for (const slug of CAMPECHE_SLUGS) {
	if (slug === PILLAR) {
		continue;
	}

	const path = join(blogDir, `${slug}.html`);
	let html = readFileSync(path, 'utf8');
	const leiaSlugs = LEIA_TAMBEM[slug] ?? [PILLAR];
	const newLeia = renderLeiaTambem(leiaSlugs);
	const updated = replaceFirstLeiaTambem(html, newLeia);

	if (updated === null) {
		console.warn(`Sem bloco Leia também em ${slug}`);
		continue;
	}

	html = ensureHubBlock(updated, slug);
	writeFileSync(path, html, 'utf8');
	console.log(`Atualizado: ${slug}`);
}

// Hub no pilar (mantém blocos Leia também existentes)
{
	const path = join(blogDir, `${PILLAR}.html`);
	let html = readFileSync(path, 'utf8');
	html = ensureHubBlock(html, PILLAR);
	writeFileSync(path, html, 'utf8');
	console.log(`Atualizado: ${PILLAR} (hub)`);
}

console.log('Concluído.');
