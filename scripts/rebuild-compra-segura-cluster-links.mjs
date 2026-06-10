/**
 * Reaplica linkagem do cluster Compra Segura em Balneário Camboriú.
 * Uso: node scripts/rebuild-compra-segura-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	COMPRA_SEGURA_CLUSTER_SLUGS,
	PILLAR,
	PUBLISHED_SATELLITE_SLUGS,
	SATELLITE_SLUGS,
	blogHref,
	leiaTambemSlugsForSatellite,
	rebuildCompraSeguraArticle,
} from '../src/lib/compra-segura-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';
import {
	countBodyBlogLinks,
	countBodySatelliteLinks,
	expectedBodySatelliteLinkCount,
} from '../src/lib/cluster-link-rebuild.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');
const pillarHref = blogHref(PILLAR);

const publishedClusterSlugs = [...COMPRA_SEGURA_CLUSTER_SLUGS].filter((slug) => {
	try {
		readFileSync(join(blogDir, `${slug}.html`), 'utf8');
		return true;
	} catch {
		return false;
	}
});

for (const slug of publishedClusterSlugs) {
	const path = join(blogDir, `${slug}.html`);
	const raw = readFileSync(path, 'utf8');
	const rebuilt = rebuildCompraSeguraArticle(raw, slug);
	writeFileSync(path, rebuilt, 'utf8');
	const leiaBlocks = (rebuilt.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
	console.log(`${slug}: leia=${leiaBlocks}`);
}

const pillarPath = join(blogDir, `${PILLAR}.html`);
const pillarHtml = readFileSync(pillarPath, 'utf8');

for (const bad of findWeakBodyAnchors(pillarHtml)) {
	console.error(`Pilar [âncora fraca] ${bad.text} → ${bad.href}`);
	process.exitCode = 1;
}

for (const bad of findOverlongBodyAnchors(pillarHtml)) {
	console.error(`Pilar [âncora longa] ${bad.text} (${bad.words} palavras)`);
	process.exitCode = 1;
}

for (const satelliteSlug of PUBLISHED_SATELLITE_SLUGS) {
	const href = blogHref(satelliteSlug);
	if (!pillarHtml.includes(href)) {
		console.error(`Pilar sem link para satélite ${satelliteSlug}`);
		process.exitCode = 1;
	}
}

const publishedSatellitesWithHtml = SATELLITE_SLUGS.filter((slug) => {
	try {
		readFileSync(join(blogDir, `${slug}.html`), 'utf8');
		return true;
	} catch {
		return false;
	}
});

const missingPillar = publishedSatellitesWithHtml.filter((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const pillarLinks = (html.match(new RegExp(pillarHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? [])
		.length;
	return pillarLinks < 2;
});

if (missingPillar.length) {
	console.error('Satélites sem 2 links ao pilar (corpo + Leia também):', missingPillar);
	process.exitCode = 1;
}

const badLeiaTambem = publishedSatellitesWithHtml.filter((slug) => {
	const expected = leiaTambemSlugsForSatellite(slug);
	if (expected[0] !== PILLAR) {
		return true;
	}

	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const leiaIdx = html.indexOf('<p class="blog-related__title">Leia também</p>');
	if (leiaIdx === -1) {
		return true;
	}

	const block = html.slice(leiaIdx, leiaIdx + 2400);
	const firstHref = block.match(/<li><a href="([^"]+)"/)?.[1];
	return firstHref !== pillarHref;
});

if (badLeiaTambem.length) {
	console.error('Satélites com Leia também inválido (pilar deve ser 1º):', badLeiaTambem);
	process.exitCode = 1;
}

if (countBodyBlogLinks(pillarHtml) > 0) {
	console.error('Pilar com links /blog/ no corpo (deve ter 0)');
	process.exitCode = 1;
}

const minBodySats = expectedBodySatelliteLinkCount(PUBLISHED_SATELLITE_SLUGS, '');
const missingClusterCrossLink = publishedSatellitesWithHtml.filter((slug) => {
	if (PUBLISHED_SATELLITE_SLUGS.length < 2) {
		return false;
	}

	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return countBodySatelliteLinks(html, slug, PUBLISHED_SATELLITE_SLUGS, blogHref) < minBodySats;
});

if (missingClusterCrossLink.length) {
	console.error(
		`Satélites com menos de ${minBodySats} link(s) a outros satélites no corpo:`,
		missingClusterCrossLink,
	);
	process.exitCode = 1;
}

if (!process.exitCode) {
	console.log('OK: cluster Compra Segura em Balneário Camboriú');
}
