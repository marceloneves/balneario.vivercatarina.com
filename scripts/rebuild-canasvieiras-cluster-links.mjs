/**
 * Reaplica linkagem do cluster Canasvieiras (pilar + satélites).
 * Uso: node scripts/rebuild-canasvieiras-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	CANASVIEIRAS_CLUSTER_SLUGS,
	PILLAR,
	blogHref,
	rebuildCanasvieirasArticle,
} from '../src/lib/canasvieiras-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

for (const slug of CANASVIEIRAS_CLUSTER_SLUGS) {
	const path = join(blogDir, `${slug}.html`);
	const raw = readFileSync(path, 'utf8');
	const rebuilt = rebuildCanasvieirasArticle(raw, slug);
	writeFileSync(path, rebuilt, 'utf8');
	const hubBlocks = (rebuilt.match(/<div class="blog-related blog-property-hub-row">/g) ?? []).length;
	const leiaBlocks = (rebuilt.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
	console.log(`${slug}: hub=${hubBlocks} leia=${leiaBlocks}`);
}

const pillarHtml = readFileSync(join(blogDir, `${PILLAR}.html`), 'utf8');
if ((pillarHtml.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length !== 1) {
	console.error('Pilar sem bloco Leia também');
	process.exitCode = 1;
}

for (const link of [
	'blog/preco-m2-canasvieiras-quanto-custa-comprar-imovel',
	'blog/apartamentos-a-venda-canasvieiras-faixas-preco',
	'blog/canasvieiras-e-bom-para-morar',
	'blog/aluguel-temporada-canasvieiras-mercado',
	'blog/custo-de-vida-canasvieiras-quanto-custa-morar',
]) {
	if (!pillarHtml.includes(link)) {
		console.error(`Pilar sem link: ${link}`);
		process.exitCode = 1;
	}
}

const precoHtml = readFileSync(
	join(blogDir, 'preco-m2-canasvieiras-quanto-custa-comprar-imovel.html'),
	'utf8',
);
if (!precoHtml.includes(blogHref(PILLAR))) {
	console.error('Satélite preço m² sem link ao pilar');
	process.exitCode = 1;
}

const overlong = [...CANASVIEIRAS_CLUSTER_SLUGS].flatMap((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return findOverlongBodyAnchors(html).map((item) => ({ slug, ...item }));
});

const weak = [...CANASVIEIRAS_CLUSTER_SLUGS].flatMap((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return findWeakBodyAnchors(html).map((item) => ({ slug, ...item }));
});

if (overlong.length) {
	console.error('Âncoras com mais de 3 palavras:');
	for (const { slug, href, text, words } of overlong) {
		console.error(`  ${slug}: ${words}w ${href} "${text}"`);
	}
	process.exitCode = 1;
}

if (weak.length) {
	console.error('Âncoras fracas no corpo:');
	for (const { slug, href, text } of weak) {
		console.error(`  ${slug}: ${href} "${text}"`);
	}
	process.exitCode = 1;
}

if (!process.exitCode) {
	console.log('OK: âncoras do cluster Canasvieiras (≤3 palavras, sem início/fim fraco).');
}
