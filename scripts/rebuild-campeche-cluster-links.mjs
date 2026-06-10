/**
 * Reescreve os 18 artigos do cluster Campeche com linkagem controlada.
 * Uso: node scripts/rebuild-campeche-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	CAMPECHE_CLUSTER_SLUGS,
	PILLAR,
	SATELLITE_SLUGS,
	blogHref,
	countBodyClusterLinks,
	leiaTambemSlugsForSatellite,
	rebuildCampecheArticle,
} from '../src/lib/campeche-cluster-body-links.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';
import {
	countBodyBlogLinks,
	countBodySatelliteLinks,
	countHubBlocks,
	expectedBodySatelliteLinkCount,
} from '../src/lib/cluster-link-rebuild.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

for (const slug of CAMPECHE_CLUSTER_SLUGS) {
	const path = join(blogDir, `${slug}.html`);
	const raw = readFileSync(path, 'utf8');
	const rebuilt = rebuildCampecheArticle(raw, slug);
	writeFileSync(path, rebuilt, 'utf8');

	const bodyLinks = countBodyClusterLinks(rebuilt);
	const pillarLinks = (rebuilt.match(new RegExp(blogHref(PILLAR).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? [])
		.length;
	const relatedBlocks = (rebuilt.match(/<div class="blog-related/g) ?? []).length;

	console.log(
		`${slug}: ${bodyLinks} links no corpo | ${pillarLinks} ao pilar | ${relatedBlocks} blocos relacionados`,
	);
}

const missingPillar = SATELLITE_SLUGS.filter((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return !html.includes(blogHref(PILLAR));
});

if (missingPillar.length) {
	console.warn('Satélites SEM link ao pilar:', missingPillar);
	process.exitCode = 1;
} else {
	console.log('\nOK: os 17 satélites linkam para o pilar.');
}

const pillarHref = blogHref(PILLAR);

const badLeiaTambem = SATELLITE_SLUGS.filter((slug) => {
	const expected = leiaTambemSlugsForSatellite(slug);
	if (expected.length !== 4 || expected[0] !== PILLAR) {
		return true;
	}

	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const leiaIdx = html.indexOf('<p class="blog-related__title">Leia também</p>');
	if (leiaIdx === -1) {
		return true;
	}

	const block = html.slice(leiaIdx, leiaIdx + 1200);
	const liCount = (block.match(/<li><a href="\/blog\//g) ?? []).length;
	const firstHref = block.match(/<li><a href="([^"]+)"/)?.[1];
	return liCount !== 4 || firstHref !== pillarHref;
});

if (badLeiaTambem.length) {
	console.warn('Satélites com Leia também inválido (esperado: pilar + 3 satélites):', badLeiaTambem);
	process.exitCode = 1;
} else {
	console.log('OK: Leia também com pilar em 1º e mais 3 satélites em cada artigo.');
}

const pillarHtml = readFileSync(join(blogDir, `${PILLAR}.html`), 'utf8');
if (countBodyBlogLinks(pillarHtml) > 0) {
	console.warn('Pilar com links /blog/ no corpo (deve ter 0)');
	process.exitCode = 1;
}

if (countHubBlocks(pillarHtml) > 0) {
	console.warn('Pilar com bloco hub (apenas satélites devem ter hub)');
	process.exitCode = 1;
}

const badHub = SATELLITE_SLUGS.filter((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	const hubBlocks = countHubBlocks(html);
	const leadForms = (html.match(/<aside class="blog-property-hub-lead">/g) ?? []).length;
	return hubBlocks !== 1 || leadForms !== 1;
});

if (badHub.length) {
	console.warn('Satélites com hub ausente ou duplicado:', badHub);
	process.exitCode = 1;
} else {
	console.log('OK: hub só nos satélites (1 bloco cada).');
}

const minBodySats = expectedBodySatelliteLinkCount(SATELLITE_SLUGS, '');
const badBodySats = SATELLITE_SLUGS.filter((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return countBodySatelliteLinks(html, slug, SATELLITE_SLUGS, blogHref) < minBodySats;
});

if (badBodySats.length) {
	console.warn(`Satélites com menos de ${minBodySats} link(s) a outros satélites no corpo:`, badBodySats);
	process.exitCode = 1;
}

const overlong = [...CAMPECHE_CLUSTER_SLUGS].flatMap((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return findOverlongBodyAnchors(html).map((item) => ({ slug, ...item }));
});

const weak = [...CAMPECHE_CLUSTER_SLUGS].flatMap((slug) => {
	const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
	return findWeakBodyAnchors(html).map((item) => ({ slug, ...item }));
});

if (overlong.length) {
	console.warn('Âncoras com mais de 3 palavras:');
	for (const { slug, href, text, words } of overlong) {
		console.warn(`  ${slug}: ${words}w ${href} "${text}"`);
	}
	process.exitCode = 1;
}

if (weak.length) {
	console.warn('Âncoras fracas no corpo:');
	for (const { slug, href, text } of weak) {
		console.warn(`  ${slug}: ${href} "${text}"`);
	}
	process.exitCode = 1;
}

if (!process.exitCode) {
	console.log('OK: âncoras do cluster Campeche (≤3 palavras, sem início/fim fraco).');
}
