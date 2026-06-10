/**
 * Reaplica linkagem do cluster Cachoeira do Bom Jesus (pilar + satélites).
 * Uso: node scripts/rebuild-cachoeira-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	CACHOEIRA_CLUSTER_SLUGS,
	PILLAR,
	rebuildCachoeiraArticle,
} from '../src/lib/cachoeira-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';
import { countBodyBlogLinks, countHubBlocks } from '../src/lib/cluster-link-rebuild.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

for (const slug of CACHOEIRA_CLUSTER_SLUGS) {
	const path = join(blogDir, `${slug}.html`);
	try {
		readFileSync(path, 'utf8');
	} catch {
		continue;
	}

	const raw = readFileSync(path, 'utf8');
	const rebuilt = rebuildCachoeiraArticle(raw, slug);
	writeFileSync(path, rebuilt, 'utf8');
	const hubBlocks = (rebuilt.match(/<div class="blog-related blog-property-hub-row">/g) ?? []).length;
	const leiaBlocks = (rebuilt.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
	console.log(`${slug}: hub=${hubBlocks} leia=${leiaBlocks}`);
}

const pillarHtml = readFileSync(join(blogDir, `${PILLAR}.html`), 'utf8');
if (countHubBlocks(pillarHtml) > 0) {
	console.error('Pilar não deve ter bloco hub');
	process.exitCode = 1;
}

if (countBodyBlogLinks(pillarHtml) > 0) {
	console.error('Pilar não deve ter links /blog/ no corpo');
	process.exitCode = 1;
}

for (const bad of findOverlongBodyAnchors(pillarHtml)) {
	console.error(`Âncora longa no pilar: ${bad}`);
	process.exitCode = 1;
}

for (const bad of findWeakBodyAnchors(pillarHtml)) {
	console.error(`Âncora fraca no pilar: ${bad}`);
	process.exitCode = 1;
}

console.log('OK: cluster Cachoeira do Bom Jesus');
