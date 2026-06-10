/**
 * Garante que artigos de cluster não linkam para /blog/ de outro cluster.
 * Uso: node scripts/validate-cluster-cross-links.mjs
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	CAMPECHE_CLUSTER_SLUGS,
	CANASVIEIRAS_CLUSTER_SLUGS,
	CENTRO_CLUSTER_SLUGS,
	INGLESES_CLUSTER_SLUGS,
	ITACORUBI_CLUSTER_SLUGS,
	COMPRA_SEGURA_CLUSTER_SLUGS,
	CACHOEIRA_CLUSTER_SLUGS,
	BALNEARIO_CAMBORIU_CLUSTER_SLUGS,
	JURERE_INTERNACIONAL_CLUSTER_SLUGS,
} from '../src/lib/blog-cluster-slugs.mjs';
import { findCrossClusterBlogLinks } from '../src/lib/cluster-link-rebuild.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');

const CLUSTERS = [
	{ name: 'Campeche', slugs: CAMPECHE_CLUSTER_SLUGS },
	{ name: 'Canasvieiras', slugs: CANASVIEIRAS_CLUSTER_SLUGS },
	{ name: 'Centro', slugs: CENTRO_CLUSTER_SLUGS },
	{ name: 'Ingleses', slugs: INGLESES_CLUSTER_SLUGS },
	{ name: 'Itacorubi', slugs: ITACORUBI_CLUSTER_SLUGS },
	{ name: 'Cachoeira', slugs: CACHOEIRA_CLUSTER_SLUGS },
	{ name: 'Compra Segura', slugs: COMPRA_SEGURA_CLUSTER_SLUGS },
	{ name: 'Balneário Camboriú', slugs: BALNEARIO_CAMBORIU_CLUSTER_SLUGS },
	{ name: 'Jurerê Internacional', slugs: JURERE_INTERNACIONAL_CLUSTER_SLUGS },
];

const violations = [];

for (const { name, slugs } of CLUSTERS) {
	const allowed = [...slugs];

	for (const slug of allowed) {
		const path = join(blogDir, `${slug}.html`);

		if (!existsSync(path)) {
			continue;
		}

		const html = readFileSync(path, 'utf8');
		const cross = findCrossClusterBlogLinks(html, allowed);

		for (const { href, target } of cross) {
			violations.push({ cluster: name, slug, href, target });
		}
	}
}

if (violations.length) {
	console.error(`Cross-cluster: ${violations.length} link(s) proibido(s)\n`);

	for (const { cluster, slug, href, target } of violations) {
		console.error(`  [${cluster}] ${slug} → ${href} (${target})`);
	}

	process.exit(1);
}

console.log(`OK: nenhum link cross-cluster em ${CLUSTERS.length} clusters.`);
