/**
 * Cluster Canasvieiras — pilar + 5 satélites (cluster médio).
 */

import { BLOG_POSTS } from './blog-posts.mjs';
import { pickNeighborhoodCoverImage } from './home-page.mjs';
import {
	applyPlan,
	insertHubAfterSecondSubtitle,
	splitClosing,
	stripBodyAnchors,
	stripClusterBridge,
	stripHeadingAnchors,
	stripRelatedBlocks,
} from './campeche-cluster-body-links.mjs';
import { CANASVIEIRAS_CLUSTER_SLUGS, CANASVIEIRAS_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { CANASVIEIRAS_CLUSTER_SLUGS };

export const PILLAR = CANASVIEIRAS_PILLAR;
export const HUB_HREF = '/bairro/canasvieiras';
export const HUB_TITLE = 'Veja imóveis em lançamento em Canasvieiras';
export const HUB_NEIGHBORHOOD_NAME = 'Canasvieiras';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-2.webp';

export const SATELLITE_SLUGS = [...CANASVIEIRAS_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...CANASVIEIRAS_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('canasvieiras') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'preco-m2-canasvieiras-quanto-custa-comprar-imovel': [
		'apartamentos-a-venda-canasvieiras-faixas-preco',
		'aluguel-temporada-canasvieiras-mercado',
		'custo-de-vida-canasvieiras-quanto-custa-morar',
	],
	'apartamentos-a-venda-canasvieiras-faixas-preco': [
		'preco-m2-canasvieiras-quanto-custa-comprar-imovel',
		'aluguel-temporada-canasvieiras-mercado',
		'canasvieiras-e-bom-para-morar',
	],
	'canasvieiras-e-bom-para-morar': [
		'custo-de-vida-canasvieiras-quanto-custa-morar',
		'aluguel-temporada-canasvieiras-mercado',
		'preco-m2-canasvieiras-quanto-custa-comprar-imovel',
	],
	'aluguel-temporada-canasvieiras-mercado': [
		'preco-m2-canasvieiras-quanto-custa-comprar-imovel',
		'apartamentos-a-venda-canasvieiras-faixas-preco',
		'canasvieiras-e-bom-para-morar',
	],
	'custo-de-vida-canasvieiras-quanto-custa-morar': [
		'aluguel-temporada-canasvieiras-mercado',
		'preco-m2-canasvieiras-quanto-custa-comprar-imovel',
		'canasvieiras-e-bom-para-morar',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

/** Âncoras no corpo: no máximo 3 palavras (wrap no trecho existente). */
export const SATELLITE_BODY_PLAN = {
	'preco-m2-canasvieiras-quanto-custa-comprar-imovel': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'estúdios e compactos', target: 'apartamentos-a-venda-canasvieiras-faixas-preco' },
			{ find: 'aluguel de temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
			{ find: 'investir em temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
			{ find: 'demanda de temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
		],
	},
	'apartamentos-a-venda-canasvieiras-faixas-preco': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'metro quadrado', target: 'preco-m2-canasvieiras-quanto-custa-comprar-imovel' },
			{ find: 'aluguel de temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
			{ find: 'investir em temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
		],
	},
	'canasvieiras-e-bom-para-morar': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'custo de vida', target: 'custo-de-vida-canasvieiras-quanto-custa-morar' },
			{ find: 'alta temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
			{ find: 'custo-benefício', target: 'preco-m2-canasvieiras-quanto-custa-comprar-imovel' },
		],
	},
	'aluguel-temporada-canasvieiras-mercado': {
		links: [
			{ find: 'vocação histórica', target: PILLAR },
			{ find: 'studio ou apartamento', target: 'apartamentos-a-venda-canasvieiras-faixas-preco' },
			{ find: 'custos de manutenção', target: 'custo-de-vida-canasvieiras-quanto-custa-morar' },
			{ find: 'tíquete de entrada', target: 'preco-m2-canasvieiras-quanto-custa-comprar-imovel' },
		],
	},
	'custo-de-vida-canasvieiras-quanto-custa-morar': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'moradia mais acessível', target: 'preco-m2-canasvieiras-quanto-custa-comprar-imovel' },
			{ find: 'aluguel de temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
			{ find: 'bairros nobres', target: 'canasvieiras-e-bom-para-morar' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'significativamente mais acessíveis', target: 'preco-m2-canasvieiras-quanto-custa-comprar-imovel' },
		{ find: 'aluguel de temporada', target: 'aluguel-temporada-canasvieiras-mercado' },
		{ find: 'custo-benefício de Canasvieiras', target: 'custo-de-vida-canasvieiras-quanto-custa-morar' },
		{ find: 'bom para morar', target: 'canasvieiras-e-bom-para-morar' },
	],
};

export function renderLeiaTambem(slugs) {
	const items = slugs.map((s) => `<li>${linkHtml(s)}</li>`).join('\n');
	return `<div class="blog-related">
<p class="blog-related__title">Leia também</p>
<ul>
${items}
</ul>
</div>`;
}

export function renderHubBlock(slug) {
	const formId = `blog-hub-lead-${slug}`;
	const imageUrl = hubImageUrl();

	return `<div class="blog-related blog-property-hub-row">
<div class="blog-property-hub-row__visual">
<p class="blog-related__title"><a href="${HUB_HREF}">${HUB_TITLE}</a></p>
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Canasvieiras em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos em Canasvieiras</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta no bairro.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-canasvieiras">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades de Canasvieiras</button>
<p class="blog-property-hub-lead__feedback" hidden role="status"></p>
</form>
</aside>
</div>`;
}

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	return renderLeiaTambem(SATELLITE_SLUGS);
}

export function rebuildCanasvieirasArticle(rawHtml, slug) {
	let html = stripRelatedBlocks(rawHtml);
	html = stripClusterBridge(html);
	html = stripBodyAnchors(html);

	const { body, closing } = splitClosing(html);
	let content = body;

	if (slug === PILLAR) {
		content = stripHeadingAnchors(content);
		const footer = [renderExploreBlock(), closing].filter(Boolean).join('\n\n');
		return `${content}\n\n${footer}`.trim() + '\n';
	}

	const plan = SATELLITE_BODY_PLAN[slug];
	if (!plan) {
		return rawHtml;
	}

	const trimmed = trimSatelliteBodyPlan(
		plan.links,
		slug,
		PILLAR,
		SATELLITE_SLUGS,
		SATELLITE_BODY_PLAN,
		LEIA_TAMBEM[slug] ?? [],
	);
	let linked = applyPlan(content, { links: trimmed });
	linked = stripHeadingAnchors(linked);
	linked = insertHubAfterSecondSubtitle(linked, renderHubBlock(slug));

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
