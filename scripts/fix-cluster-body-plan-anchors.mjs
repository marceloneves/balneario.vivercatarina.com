/**
 * Sugere encurtamento de `find` nos planos de cluster (máx. 3 palavras).
 * Uso: node scripts/fix-cluster-body-plan-anchors.mjs [campeche|jurere|canasvieiras]
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { shortenFindInHtml, countAnchorWords, MAX_LINK_ANCHOR_WORDS } from '../src/lib/cluster-link-anchor.mjs';

const cluster = process.argv[2] ?? 'campeche';

const configs = {
	campeche: {
		module: '../src/lib/campeche-cluster-body-links.mjs',
		slugsExport: 'CAMPECHE_CLUSTER_SLUGS',
		planExport: 'SATELLITE_BODY_PLAN',
		pillarPlanExport: 'PILLAR_BODY_PLAN',
	},
	jurere: {
		module: '../src/lib/jurere-internacional-cluster.mjs',
		slugsExport: 'JURERE_INTERNACIONAL_CLUSTER_SLUGS',
		planExport: 'SATELLITE_BODY_PLAN',
		pillarPlanExport: 'PILLAR_BODY_PLAN',
	},
	canasvieiras: {
		module: '../src/lib/canasvieiras-cluster.mjs',
		slugsExport: 'CANASVIEIRAS_CLUSTER_SLUGS',
		planExport: 'SATELLITE_BODY_PLAN',
		pillarPlanExport: 'PILLAR_BODY_PLAN',
	},
};

const cfg = configs[cluster];
if (!cfg) {
	console.error('Cluster inválido:', cluster);
	process.exit(1);
}

const mod = await import(new URL(cfg.module, import.meta.url));
const blogDir = join(process.cwd(), 'src/content/blog');
const satellitePlan = mod[cfg.planExport];
const pillarPlan = mod[cfg.pillarPlanExport];

let failures = 0;

function auditPlan(slug, plan, label) {
	if (!plan?.links?.length) {
		return;
	}

	const path = join(blogDir, `${slug}.html`);
	const html = readFileSync(path, 'utf8');

	for (const { find, target } of plan.links) {
		const n = countAnchorWords(find);
		if (n <= MAX_LINK_ANCHOR_WORDS) {
			continue;
		}

		const shortened = shortenFindInHtml(html, find);
		if (shortened) {
			console.log(`[${slug}] ${n}→${countAnchorWords(shortened)}: "${find}" → "${shortened}" (${target})`);
		} else {
			console.warn(`[${slug}] FALHA: "${find}" (${target})`);
			failures += 1;
		}
	}
}

for (const slug of Object.keys(satellitePlan)) {
	auditPlan(slug, satellitePlan[slug], 'satélite');
}

if (pillarPlan?.links?.length) {
	const pillarSlug =
		cluster === 'campeche'
			? 'morar-no-campeche-guia-completo'
			: cluster === 'jurere'
				? 'morar-em-jurere-internacional-guia-completo'
				: 'morar-em-canasvieiras-guia-completo';
	auditPlan(pillarSlug, pillarPlan, 'pilar');
}

process.exit(failures ? 1 : 0);
