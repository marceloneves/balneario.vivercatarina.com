/**
 * Cluster Cachoeira do Bom Jesus — pilar + satélites (cluster médio).
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
import { CACHOEIRA_CLUSTER_SLUGS, CACHOEIRA_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { CACHOEIRA_CLUSTER_SLUGS };

export const PILLAR = CACHOEIRA_PILLAR;
export const HUB_HREF = '/bairro/canasvieiras';
export const HUB_TITLE = 'Veja imóveis em lançamento na Cachoeira do Bom Jesus';
export const HUB_NEIGHBORHOOD_NAME = 'Cachoeira do Bom Jesus';

const HUB_IMAGE_FALLBACK =
	'/data/imoveis/cachoeira-spot-cachoeira-do-bom-jesus-balneario-camboriu-sc/images/01-02-1-1.webp';

export const SATELLITE_SLUGS = [...CACHOEIRA_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));
const publishedSlugs = new Set(BLOG_POSTS.map((post) => post.slug));

export const PUBLISHED_SATELLITE_SLUGS = SATELLITE_SLUGS.filter((slug) => publishedSlugs.has(slug));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...CACHOEIRA_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
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
	'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel': [
		'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco',
		'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade',
	],
	'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco': [
		'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade',
		'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel',
	],
	'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade': [
		'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco',
		'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	const extra = (LEIA_TAMBEM[slug] ?? []).filter((s) => publishedSlugs.has(s));
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, extra, 2);
}

export const SATELLITE_BODY_PLAN = {
	'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'studios e compactos', target: 'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco' },
			{ find: 'somando ITBI', target: 'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco' },
			{ find: 'vizinhos famosos', target: 'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade' },
		],
	},
	'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'objetivo guiar', target: 'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade' },
			{ find: 'preço ainda acessível', target: 'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel' },
			{ find: 'Registro de Incorporação', target: 'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade' },
			{ find: 'Planeje o financiamento', target: 'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel' },
		],
	},
	'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'ticket de entrada', target: 'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel' },
			{ find: 'gestão de locação', target: 'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco' },
			{ find: 'custos de transação', target: 'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel' },
			{ find: 'Registro de Incorporação', target: 'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'forte movimento de lançamentos', target: 'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco' },
		{ find: 'custo competitivo', target: 'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel' },
		{ find: 'recorre a Canasvieiras', target: 'apartamentos-a-venda-cachoeira-do-bom-jesus-faixas-preco' },
		{ find: 'ou Ingleses para', target: 'preco-m2-cachoeira-do-bom-jesus-quanto-custa-comprar-imovel' },
		{ find: 'custo-benefício de todo', target: 'apartamentos-cachoeira-do-bom-jesus-como-escolher-unidade' },
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Cachoeira do Bom Jesus em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos na Cachoeira do Bom Jesus</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta no bairro.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-cachoeira-do-bom-jesus">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades da Cachoeira do Bom Jesus</button>
<p class="blog-property-hub-lead__feedback" hidden role="status"></p>
</form>
</aside>
</div>`;
}

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	if (PUBLISHED_SATELLITE_SLUGS.length === 0) {
		return '';
	}

	return renderLeiaTambem(PUBLISHED_SATELLITE_SLUGS);
}

export function rebuildCachoeiraArticle(rawHtml, slug) {
	let html = stripRelatedBlocks(rawHtml);
	html = stripClusterBridge(html);
	html = stripBodyAnchors(html);

	const { body, closing } = splitClosing(html);
	let content = body;

	if (slug === PILLAR) {
		content = stripHeadingAnchors(content);
		const explore = renderExploreBlock();
		const footer = [explore, closing].filter(Boolean).join('\n\n');
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
	).filter(({ target }) => publishedSlugs.has(target));
	let linked = trimmed.length ? applyPlan(content, { links: trimmed }) : content;
	linked = stripHeadingAnchors(linked);
	linked = insertHubAfterSecondSubtitle(linked, renderHubBlock(slug));

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
