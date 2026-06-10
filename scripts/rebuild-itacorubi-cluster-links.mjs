/**
 * Reaplica linkagem do cluster Itacorubi (pilar + satélites publicados).
 * Uso: node scripts/rebuild-itacorubi-cluster-links.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	ITACORUBI_CLUSTER_SLUGS,
	PILLAR,
	blogHref,
	rebuildItacorubiArticle,
} from '../src/lib/itacorubi-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';
import { countBodyBlogLinks, countHubBlocks } from '../src/lib/cluster-link-rebuild.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

const publishedSlugs = [...ITACORUBI_CLUSTER_SLUGS].filter((slug) =>
	existsSync(join(blogDir, `${slug}.html`)),
);

for (const slug of publishedSlugs) {
	const path = join(blogDir, `${slug}.html`);
	const raw = readFileSync(path, 'utf8');
	const rebuilt = rebuildItacorubiArticle(raw, slug);
	writeFileSync(path, rebuilt, 'utf8');
	const hubBlocks = (rebuilt.match(/<div class="blog-related blog-property-hub-row">/g) ?? []).length;
	const leiaBlocks = (rebuilt.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
	console.log(`${slug}: hub=${hubBlocks} leia=${leiaBlocks}`);
}

const pillarPath = join(blogDir, `${PILLAR}.html`);
if (!existsSync(pillarPath)) {
	console.error('Pilar não encontrado:', PILLAR);
	process.exitCode = 1;
} else {
	const pillarHtml = readFileSync(pillarPath, 'utf8');
	if (countHubBlocks(pillarHtml) > 0) {
		console.error('Pilar não deve ter bloco hub');
		process.exitCode = 1;
	}

	if (countBodyBlogLinks(pillarHtml) > 0) {
		console.error('Pilar não deve ter links /blog/ no corpo');
		process.exitCode = 1;
	}

	const precoPath = join(blogDir, 'preco-m2-itacorubi-quanto-custa-comprar-imovel.html');
	if (existsSync(precoPath)) {
		const precoHtml = readFileSync(precoPath, 'utf8');
		if (!precoHtml.includes(blogHref(PILLAR))) {
			console.error('Satélite preço m² sem link ao pilar');
			process.exitCode = 1;
		}
		if (!pillarHtml.includes('blog/preco-m2-itacorubi-quanto-custa-comprar-imovel')) {
			console.error('Pilar sem link ao preço m²');
			process.exitCode = 1;
		}
	}

	const aptPath = join(blogDir, 'apartamentos-a-venda-itacorubi-faixas-preco.html');
	if (existsSync(aptPath)) {
		const aptHtml = readFileSync(aptPath, 'utf8');
		if (!aptHtml.includes(blogHref(PILLAR))) {
			console.error('Satélite apartamentos sem link ao pilar');
			process.exitCode = 1;
		}
		if (!pillarHtml.includes('blog/apartamentos-a-venda-itacorubi-faixas-preco')) {
			console.error('Pilar sem link aos apartamentos');
			process.exitCode = 1;
		}
	}

	const bomPath = join(blogDir, 'itacorubi-e-bom-para-morar.html');
	if (existsSync(bomPath)) {
		const bomHtml = readFileSync(bomPath, 'utf8');
		if (!bomHtml.includes(blogHref(PILLAR))) {
			console.error('Satélite é bom para morar sem link ao pilar');
			process.exitCode = 1;
		}
		if (!pillarHtml.includes('blog/itacorubi-e-bom-para-morar')) {
			console.error('Pilar sem link ao é bom para morar');
			process.exitCode = 1;
		}
	}

	const custoPath = join(blogDir, 'custo-de-vida-itacorubi-quanto-custa-morar.html');
	if (existsSync(custoPath)) {
		const custoHtml = readFileSync(custoPath, 'utf8');
		if (!custoHtml.includes(blogHref(PILLAR))) {
			console.error('Satélite custo de vida sem link ao pilar');
			process.exitCode = 1;
		}
		if (!pillarHtml.includes('blog/custo-de-vida-itacorubi-quanto-custa-morar')) {
			console.error('Pilar sem link ao custo de vida');
			process.exitCode = 1;
		}
	}

	const leiaCount = (pillarHtml.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
	if (leiaCount !== 1) {
		console.error('Pilar sem bloco Leia também');
		process.exitCode = 1;
	}

	for (const link of [
		'blog/preco-m2-itacorubi-quanto-custa-comprar-imovel',
		'blog/apartamentos-a-venda-itacorubi-faixas-preco',
		'blog/itacorubi-e-bom-para-morar',
		'blog/custo-de-vida-itacorubi-quanto-custa-morar',
	]) {
		if (!pillarHtml.includes(link)) {
			console.error(`Pilar sem link: ${link}`);
			process.exitCode = 1;
		}
	}
}

const overlong = publishedSlugs.flatMap((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return findOverlongBodyAnchors(html).map((item) => ({ slug, ...item }));
});

const weak = publishedSlugs.flatMap((slug) => {
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
	console.log(`OK: ${publishedSlugs.length} artigo(s) do cluster Itacorubi.`);
}
