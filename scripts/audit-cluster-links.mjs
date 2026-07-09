/**
 * Auditoria completa de linkagem interna no blog.
 * Lista todos os tipos de links (destino × posição) e valida regras por cluster.
 *
 * Uso: node scripts/audit-cluster-links.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getBlogPosts } from '../src/lib/blog-posts.mjs';
import { BLOG_CLUSTERS, getBlogClusterIdForSlug } from '../src/lib/blog-clusters.mjs';
import {
	CENTRO_PILLAR,
	COMPRA_SEGURA_PILLAR,
	BALNEARIO_CAMBORIU_PILLAR,
} from '../src/lib/blog-cluster-slugs.mjs';
import {
	countBodyBlogLinks,
	countBodySatelliteLinks,
	countHubBlocks,
	countPillarLinksInHtml,
	expectedBodySatelliteLinkCount,
} from '../src/lib/cluster-link-rebuild.mjs';
import { findOverlongBodyAnchors, findWeakBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');
const posts = getBlogPosts();
const publishedBySlug = new Map(posts.map((p) => [p.slug, p]));

const PILLAR_BY_CLUSTER = {
	'compra-segura-balneario-camboriu': COMPRA_SEGURA_PILLAR,
	centro: CENTRO_PILLAR,
	geral: BALNEARIO_CAMBORIU_PILLAR,
};

/** Clusters de bairro com hub comercial `/bairro/…` nos satélites. */
const BAIRRO_CLUSTER_IDS = new Set([
	'campeche',
	'cachoeira-do-bom-jesus',
	'canasvieiras',
	'centro',
	'ingleses',
	'itacorubi',
	'jurere-internacional',
]);

const HUB_HREF_BY_CLUSTER = {
	campeche: '/bairro/campeche',
	'cachoeira-do-bom-jesus': '/bairro/canasvieiras',
	canasvieiras: '/bairro/canasvieiras',
	centro: '/bairro/centro',
	ingleses: '/bairro/ingleses',
	itacorubi: '/bairro/itacorubi',
	'jurere-internacional': '/bairro/jurereinternacional',
};

const LINK_TYPE_LABELS = {
	pilar: 'Blog → pilar do cluster',
	satelite_cluster: 'Blog → satélite do mesmo cluster',
	blog_outro_cluster: 'Blog → artigo de outro cluster / avulso',
	hub_bairro: 'Hub comercial → /bairro/',
	lancamentos: 'Lançamentos → /lancamentos',
	imovel: 'Imóvel → /imovel/ ou /property/',
	pagina_site: 'Página interna do site',
	externo: 'URL externa',
};

const POSITION_LABELS = {
	corpo: 'Corpo (parágrafos, listas, callouts)',
	hub_comercial: 'Bloco hub comercial (blog-property-hub-row)',
	leia_tambem: 'Bloco Leia também',
	fechamento: 'Fechamento editorial (blog-article-closing)',
};

function extractAnchors(html) {
	return [...html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>/gi)].map((m) => m[1]);
}

function slugFromBlogHref(href) {
	const match = href.match(/^\/blog\/([^/?#]+)/);
	return match?.[1] ?? null;
}

function classifyDestination(href, { pillar, clusterSlugs }) {
	if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
		return 'externo';
	}

	if (href.startsWith('/bairro/')) {
		return 'hub_bairro';
	}

	if (href.startsWith('/lancamentos')) {
		return 'lancamentos';
	}

	if (href.startsWith('/imovel/') || href.startsWith('/property/')) {
		return 'imovel';
	}

	const slug = slugFromBlogHref(href);
	if (slug) {
		if (slug === pillar) {
			return 'pilar';
		}

		if (clusterSlugs.has(slug)) {
			return 'satelite_cluster';
		}

		return 'blog_outro_cluster';
	}

	if (href.startsWith('/')) {
		return 'pagina_site';
	}

	return 'externo';
}

function findHubBlock(html) {
	const start = html.indexOf('<div class="blog-related blog-property-hub-row">');
	if (start === -1) {
		return '';
	}

	const asideEnd = html.indexOf('</aside>', start);
	if (asideEnd === -1) {
		return '';
	}

	const blockEnd = html.indexOf('</div>', asideEnd + 8);
	return blockEnd === -1 ? '' : html.slice(start, blockEnd + 6);
}

function splitHtmlZones(html) {
	const closingIdx = html.indexOf('<div class="blog-article-closing">');
	const bodyEnd = closingIdx === -1 ? html.length : closingIdx;
	const bodyHtml = html.slice(0, bodyEnd);
	const closingHtml = closingIdx === -1 ? '' : html.slice(closingIdx);

	const hubHtml = findHubBlock(bodyHtml);

	const leiaIdx = bodyHtml.indexOf('<p class="blog-related__title">Leia também</p>');
	const relatedStart = leiaIdx;
	const relatedKind = leiaIdx !== -1 ? 'leia_tambem' : null;

	const hubStart = hubHtml ? bodyHtml.indexOf(hubHtml) : -1;
	const hubEnd = hubStart === -1 ? -1 : hubStart + hubHtml.length;
	const corpoEnd = relatedStart !== -1 ? relatedStart : bodyHtml.length;

	let corpoHtml;
	if (hubHtml && hubStart !== -1) {
		corpoHtml = bodyHtml.slice(0, hubStart) + bodyHtml.slice(hubEnd, corpoEnd);
	} else {
		corpoHtml = bodyHtml.slice(0, corpoEnd);
	}

	let relatedHtml = '';
	if (relatedStart !== -1) {
		relatedHtml = bodyHtml.slice(relatedStart, bodyHtml.length);
	}

	return {
		corpo: corpoHtml,
		hub: hubHtml,
		related: relatedHtml,
		relatedKind,
		fechamento: closingHtml,
	};
}

function countByTypeAndPosition(html, ctx) {
	const zones = splitHtmlZones(html);
	const matrix = {};

	for (const [zone, zoneHtml] of Object.entries(zones)) {
		if (!zoneHtml || zone === 'relatedKind') {
			continue;
		}

		const position =
			zone === 'related' ? zones.relatedKind ?? 'leia_tambem' : zone === 'hub' ? 'hub_comercial' : zone;

		for (const href of extractAnchors(zoneHtml)) {
			const dest = classifyDestination(href, ctx);
			matrix[`${dest}@${position}`] = (matrix[`${dest}@${position}`] ?? 0) + 1;
		}
	}

	return { matrix, zones };
}

function emptyMatrix() {
	return {};
}

function addMatrix(target, source) {
	for (const [key, n] of Object.entries(source)) {
		target[key] = (target[key] ?? 0) + n;
	}
}

function blogHref(slug) {
	return `/blog/${slug}`;
}

function countLeiaTambemItems(html) {
	const idx = html.indexOf('<p class="blog-related__title">Leia também</p>');
	if (idx === -1) {
		return 0;
	}

	const block = html.slice(idx, idx + 8000);
	return (block.match(/<li><a href="/g) ?? []).length;
}

function validateArticle(slug, clusterId, pillar, clusterSlugs, satellites) {
	const path = join(blogDir, `${slug}.html`);
	if (!existsSync(path)) {
		return { slug, missing: true, violations: ['arquivo HTML ausente'] };
	}

	const html = readFileSync(path, 'utf8');
	const isPillar = slug === pillar;
	const isBairro = BAIRRO_CLUSTER_IDS.has(clusterId);
	const expectedHub = HUB_HREF_BY_CLUSTER[clusterId];
	const pillarHref = blogHref(pillar);
	const violations = [];

	const { matrix, zones } = countByTypeAndPosition(html, { pillar, clusterSlugs });
	const bodyBlog = countBodyBlogLinks(html);
	const bodySats = countBodySatelliteLinks(html, slug, satellites, blogHref);
	const minBodySats = expectedBodySatelliteLinkCount(satellites, slug);
	const pillarTotal = countPillarLinksInHtml(html, pillarHref);
	const hubBlocks = countHubBlocks(html);
	const hasLeia = html.includes('<p class="blog-related__title">Leia também</p>');
	const leiaItems = countLeiaTambemItems(html);
	const expectedLeiaItems = isPillar ? satellites.length : 1 + minBodySats;
	const expectedBodyLinks = 1 + minBodySats;

	// Links proibidos
	for (const [key, count] of Object.entries(matrix)) {
		if (!count) {
			continue;
		}

		const [dest, pos] = key.split('@');

		if (dest === 'blog_outro_cluster') {
			violations.push(`link para outro cluster/avulso em ${POSITION_LABELS[pos] ?? pos} (${count}×)`);
		}

		if (dest === 'lancamentos') {
			violations.push(`link para /lancamentos em ${POSITION_LABELS[pos] ?? pos} (${count}×)`);
		}

		if (dest === 'externo' && pos === 'corpo') {
			violations.push(`link externo no corpo (${count}×)`);
		}
	}

	if (html.includes('blog-cluster-bridge')) {
		violations.push('bloco blog-cluster-bridge presente (proibido)');
	}

	if (isPillar) {
		if (bodyBlog > 0) {
			violations.push(`pilar com ${bodyBlog} link(s) /blog/ no corpo (esperado: 0)`);
		}

		if (!hasLeia) {
			violations.push('pilar sem bloco Leia também');
		}

		if (leiaItems !== satellites.length) {
			violations.push(
				`Leia também com ${leiaItems} itens (esperado: ${satellites.length} satélites)`,
			);
		}

		if (isBairro && hubBlocks > 0) {
			violations.push('pilar com hub comercial (apenas satélites)');
		}
	} else {
		if (bodyBlog !== expectedBodyLinks) {
			violations.push(
				`corpo com ${bodyBlog} link(s) /blog/ (esperado: ${expectedBodyLinks} = 1 pilar + ${minBodySats} satélites)`,
			);
		}

		if (bodySats < minBodySats) {
			violations.push(
				`corpo com ${bodySats} link(s) a satélites (mínimo: ${minBodySats})`,
			);
		}

		if (pillarTotal < 2) {
			violations.push(`apenas ${pillarTotal} link(s) ao pilar no artigo (esperado: 2 = corpo + Leia também)`);
		}

		if (!hasLeia) {
			violations.push('satélite sem bloco Leia também');
		}

		if (leiaItems !== expectedLeiaItems) {
			violations.push(
				`Leia também com ${leiaItems} itens (esperado: ${expectedLeiaItems} = pilar + ${minBodySats} satélites)`,
			);
		}

		if (isBairro) {
			if (hubBlocks !== 1) {
				violations.push(`hub comercial: ${hubBlocks} bloco(s) (esperado: 1)`);
			}

			const hubLinks = extractAnchors(zones.hub).filter((h) => h.startsWith('/bairro/'));
			const wrongHub = hubLinks.filter((h) => h !== expectedHub);
			if (wrongHub.length) {
				violations.push(`hub aponta para ${wrongHub.join(', ')} (esperado: ${expectedHub})`);
			}
		} else if (hubBlocks > 0) {
			violations.push(`cluster sem hub comercial, mas artigo tem ${hubBlocks} bloco(s)`);
		}
	}

	for (const bad of findOverlongBodyAnchors(html)) {
		violations.push(`âncora longa no corpo (${bad.words} palavras): "${bad.text}"`);
	}

	for (const bad of findWeakBodyAnchors(html)) {
		violations.push(`âncora fraca no corpo: "${bad.text}"`);
	}

	return {
		slug,
		title: publishedBySlug.get(slug)?.title ?? slug,
		role: isPillar ? 'pilar' : 'satélite',
		matrix,
		violations,
		stats: {
			bodyBlog,
			bodySats,
			pillarTotal,
			hubBlocks,
			leiaItems,
		},
	};
}

function printMatrix(matrix, indent = '    ') {
	const byDest = {};

	for (const [key, count] of Object.entries(matrix)) {
		const [dest, pos] = key.split('@');
		if (!byDest[dest]) {
			byDest[dest] = {};
		}
		byDest[dest][pos] = count;
	}

	for (const dest of Object.keys(LINK_TYPE_LABELS)) {
		if (!byDest[dest]) {
			continue;
		}

		const total = Object.values(byDest[dest]).reduce((a, b) => a + b, 0);
		console.log(`${indent}${LINK_TYPE_LABELS[dest]}: ${total}`);

		for (const [pos, count] of Object.entries(byDest[dest])) {
			console.log(`${indent}  └ ${POSITION_LABELS[pos] ?? pos}: ${count}`);
		}
	}
}

console.log('═══════════════════════════════════════════════════════════════');
console.log(' AUDITORIA DE LINKS INTERNOS — BLOG VBC');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('TIPOS DE LINK (por destino)');
for (const [key, label] of Object.entries(LINK_TYPE_LABELS)) {
	console.log(`  • ${key}: ${label}`);
}

console.log('\nPOSIÇÕES / BLOCOS (por onde o link aparece)');
for (const [key, label] of Object.entries(POSITION_LABELS)) {
	console.log(`  • ${key}: ${label}`);
}

console.log('\nREGRAS POR PAPEL');
console.log('  Pilar: Leia também com 1× cada satélite; 0 links /blog/ no corpo');
console.log('  Satélite: 1× pilar + 3× satélites no corpo; pilar + 3× satélites no Leia também');
console.log('  Satélite (bairro): + 1 bloco hub → /bairro/[slug] após 2ª seção');
console.log('  Proibido: links para outro cluster, /lancamentos, blog-cluster-bridge\n');

const globalMatrix = emptyMatrix();
const allViolations = [];
let totalArticles = 0;
let totalViolations = 0;

for (const cluster of BLOG_CLUSTERS) {
	const pillar = PILLAR_BY_CLUSTER[cluster.id];
	const published = [...cluster.slugSet].filter((s) => publishedBySlug.has(s));
	const satellites = published.filter((s) => s !== pillar);

	console.log(`\n── ${cluster.label} (${published.length} artigos) ──`);
	console.log(`Pilar: ${publishedBySlug.get(pillar)?.title ?? pillar}`);
	console.log(`Hub esperado: ${HUB_HREF_BY_CLUSTER[cluster.id] ?? 'nenhum'}`);

	const clusterMatrix = emptyMatrix();
	const analyses = published
		.map((s) => validateArticle(s, cluster.id, pillar, cluster.slugSet, satellites))
		.filter(Boolean);

	for (const a of analyses.sort((x, y) => (x.role === 'pilar' ? -1 : 1) - (y.role === 'pilar' ? -1 : 1))) {
		totalArticles++;
		addMatrix(clusterMatrix, a.matrix);
		addMatrix(globalMatrix, a.matrix);

		console.log(`\n  ${a.role === 'pilar' ? '▸ PILAR' : '▸ Satélite'}: ${a.title}`);
		console.log(
			`    Métricas: corpo ${a.stats.bodyBlog} /blog/ (${a.stats.bodySats} sat.) | pilar total ${a.stats.pillarTotal} | hub ${a.stats.hubBlocks} | leia ${a.stats.leiaItems}`,
		);
		printMatrix(a.matrix, '    ');

		if (a.violations.length) {
			totalViolations += a.violations.length;
			allViolations.push({ cluster: cluster.label, slug: a.slug, title: a.title, items: a.violations });
			console.log('    ⚠ Violações:');
			for (const v of a.violations) {
				console.log(`      - ${v}`);
			}
		} else {
			console.log('    ✓ Regras OK');
		}
	}

	console.log(`\n  Subtotal ${cluster.label}:`);
	printMatrix(clusterMatrix, '    ');
}

// Artigos publicados fora de qualquer cluster
const clusteredSlugs = new Set();
for (const cluster of BLOG_CLUSTERS) {
	for (const slug of cluster.slugSet) {
		clusteredSlugs.add(slug);
	}
}

const orphanPosts = posts.filter((p) => !clusteredSlugs.has(p.slug));
if (orphanPosts.length) {
	console.log(`\n── Artigos avulsos (${orphanPosts.length}) ──`);

	for (const post of orphanPosts) {
		const path = join(blogDir, `${post.slug}.html`);
		if (!existsSync(path)) {
			continue;
		}

		totalArticles++;
		const html = readFileSync(path, 'utf8');
		const { matrix } = countByTypeAndPosition(html, { pillar: '', clusterSlugs: new Set() });

		addMatrix(globalMatrix, matrix);

		console.log(`\n  ▸ ${post.title}`);
		printMatrix(matrix, '    ');

		const autoViolations = [];
		for (const bad of findOverlongBodyAnchors(html)) {
			autoViolations.push(`âncora longa: "${bad.text}" (${bad.words} palavras)`);
		}
		for (const bad of findWeakBodyAnchors(html)) {
			autoViolations.push(`âncora fraca: "${bad.text}"`);
		}

		if (autoViolations.length) {
			totalViolations += autoViolations.length;
			allViolations.push({
				cluster: 'Avulso',
				slug: post.slug,
				title: post.title,
				items: autoViolations,
			});
			console.log('    ⚠ Violações:');
			for (const v of autoViolations) {
				console.log(`      - ${v}`);
			}
		} else {
			console.log('    ✓ Âncoras do corpo OK');
		}
	}
}

console.log('\n═══════════════════════════════════════════════════════════════');
console.log(' RESUMO GLOBAL');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`Artigos auditados: ${totalArticles}`);
printMatrix(globalMatrix, '  ');

if (allViolations.length) {
	console.log(`\n⚠ ${totalViolations} violação(ões) em ${allViolations.length} artigo(s):\n`);
	for (const row of allViolations) {
		console.log(`  [${row.cluster}] ${row.title}`);
		for (const v of row.items) {
			console.log(`    - ${v}`);
		}
	}
	process.exitCode = 1;
} else {
	console.log('\n✓ Nenhuma violação encontrada.');
}
