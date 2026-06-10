/**
 * Reescreve o pilar do cluster Jurerê Internacional com linkagem controlada.
 * Uso: node scripts/rebuild-jurere-cluster-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	JURERE_INTERNACIONAL_CLUSTER_SLUGS,
	PILLAR,
	blogHref,
	rebuildJurereArticle,
} from '../src/lib/jurere-internacional-cluster.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

for (const slug of JURERE_INTERNACIONAL_CLUSTER_SLUGS) {
	const path = join(blogDir, `${slug}.html`);
	try {
		const raw = readFileSync(path, 'utf8');
		const rebuilt = rebuildJurereArticle(raw, slug);
		writeFileSync(path, rebuilt, 'utf8');
		const hubBlocks = (rebuilt.match(/<div class="blog-related blog-property-hub-row">/g) ?? []).length;
		const leiaBlocks = (rebuilt.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length;
		console.log(`${slug}: hub=${hubBlocks} leia=${leiaBlocks}`);
	} catch (err) {
		if (err.code === 'ENOENT' && slug !== PILLAR) {
			continue;
		}
		throw err;
	}
}

const pillarHtml = readFileSync(join(blogDir, `${PILLAR}.html`), 'utf8');
if ((pillarHtml.match(/<p class="blog-related__title">Leia também<\/p>/g) ?? []).length !== 1) {
	process.exitCode = 1;
}

const precoSlug = 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo';
const precoHtml = readFileSync(join(blogDir, `${precoSlug}.html`), 'utf8');
if (!precoHtml.includes(blogHref(PILLAR))) {
	console.warn('Satélite preço m² sem link ao pilar');
	process.exitCode = 1;
}

const overlong = [...JURERE_INTERNACIONAL_CLUSTER_SLUGS].flatMap((slug) => {
	try {
		const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
		return findOverlongBodyAnchors(html).map((item) => ({ slug, ...item }));
	} catch (err) {
		if (err.code === 'ENOENT') {
			return [];
		}
		throw err;
	}
});

const weak = [...JURERE_INTERNACIONAL_CLUSTER_SLUGS].flatMap((slug) => {
	try {
		const html = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
		return findWeakBodyAnchors(html).map((item) => ({ slug, ...item }));
	} catch (err) {
		if (err.code === 'ENOENT') {
			return [];
		}
		throw err;
	}
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
	console.log('OK: âncoras do cluster Jurerê (≤3 palavras, sem início/fim fraco).');
}
