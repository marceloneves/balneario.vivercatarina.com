/**
 * Reaplica linkagem do cluster Ingleses (pilar + satélites publicados).
 * Uso: node scripts/rebuild-ingleses-cluster-links.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	INGLESES_CLUSTER_SLUGS,
	PILLAR,
	blogHref,
	rebuildInglesesArticle,
} from '../src/lib/ingleses-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';
import { countBodyBlogLinks, countHubBlocks } from '../src/lib/cluster-link-rebuild.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

const publishedSlugs = [...INGLESES_CLUSTER_SLUGS].filter((slug) =>
	existsSync(join(blogDir, `${slug}.html`)),
);

for (const slug of publishedSlugs) {
	const path = join(blogDir, `${slug}.html`);
	const raw = readFileSync(path, 'utf8');
	const rebuilt = rebuildInglesesArticle(raw, slug);
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

	const publishedSatellites = publishedSlugs.filter((slug) => slug !== PILLAR);
	if (publishedSatellites.length > 0) {
		const leiaCount = (pillarHtml.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
		if (leiaCount !== 1) {
			console.error('Pilar sem bloco Leia também');
			process.exitCode = 1;
		}

		for (const satelliteSlug of publishedSatellites) {
			const satellitePath = join(blogDir, `${satelliteSlug}.html`);
			const satelliteHtml = readFileSync(satellitePath, 'utf8');
			if (!satelliteHtml.includes(blogHref(PILLAR))) {
				console.error(`Satélite sem link ao pilar: ${satelliteSlug}`);
				process.exitCode = 1;
			}
			if (!pillarHtml.includes(blogHref(satelliteSlug))) {
				console.error(`Pilar sem link ao satélite: ${satelliteSlug}`);
				process.exitCode = 1;
			}
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
	console.log(`OK: ${publishedSlugs.length} artigo(s) do cluster Ingleses.`);
}
