/**
 * Reaplica linkagem do cluster Balneário Camboriú (geral).
 * Uso: node scripts/rebuild-balneario-camboriu-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	BALNEARIO_CAMBORIU_CLUSTER_SLUGS,
	PILLAR,
	PUBLISHED_SATELLITE_SLUGS,
	SATELLITE_SLUGS,
	blogHref,
	leiaTambemSlugsForSatellite,
	rebuildFlorianopolisArticle,
} from '../src/lib/balneario-camboriu-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');
const pillarHref = blogHref(PILLAR);

const publishedClusterSlugs = [...BALNEARIO_CAMBORIU_CLUSTER_SLUGS].filter((slug) => {
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
	const rebuilt = rebuildFlorianopolisArticle(raw, slug);
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

const pillarBodyEnd = pillarHtml.indexOf('<p class="blog-related__title">Leia também</p>');
const pillarBody = pillarBodyEnd === -1 ? pillarHtml : pillarHtml.slice(0, pillarBodyEnd);
const pillarBodyBlogLinks = (pillarBody.match(/href="\/blog\/[^"]+"/g) ?? []).length;

if (pillarBodyBlogLinks > 0) {
	console.error(`Pilar com ${pillarBodyBlogLinks} link(s) no corpo (deve ter 0)`);
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

	if (expected.length !== 4) {
		return true;
	}

	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const leiaIdx = html.indexOf('<p class="blog-related__title">Leia também</p>');
	if (leiaIdx === -1) {
		return true;
	}

	const block = html.slice(leiaIdx, leiaIdx + 3200);
	const firstHref = block.match(/<li><a href="([^"]+)"/)?.[1];
	return firstHref !== pillarHref;
});

if (badLeiaTambem.length) {
	console.error('Satélites com Leia também inválido:', badLeiaTambem);
	process.exitCode = 1;
}

const missingBodySatelliteLinks = publishedSatellitesWithHtml.filter((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const bodyEnd = html.indexOf('<p class="blog-related__title">Leia também</p>');
	const body = bodyEnd === -1 ? html : html.slice(0, bodyEnd);
	const otherSatelliteLinks = PUBLISHED_SATELLITE_SLUGS.filter(
		(other) => other !== slug && body.includes(blogHref(other)),
	);
	return otherSatelliteLinks.length < 3;
});

if (missingBodySatelliteLinks.length) {
	console.error('Satélites com menos de 3 links a outros satélites no corpo:', missingBodySatelliteLinks);
	process.exitCode = 1;
}

const missingLeiaSatelliteLinks = publishedSatellitesWithHtml.filter((slug) => {
	const expected = leiaTambemSlugsForSatellite(slug).slice(1);
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const leiaIdx = html.indexOf('<p class="blog-related__title">Leia também</p>');
	if (leiaIdx === -1) {
		return true;
	}

	const block = html.slice(leiaIdx);
	const missing = expected.filter((other) => !block.includes(blogHref(other)));
	return missing.length > 0;
});

if (missingLeiaSatelliteLinks.length) {
	console.error('Satélites com Leia também incompleto:', missingLeiaSatelliteLinks);
	process.exitCode = 1;
}

if (!process.exitCode) {
	console.log('OK: cluster Balneário Camboriú');
}
