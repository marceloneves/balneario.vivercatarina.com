/**
 * Cluster Itacorubi — pilar (satélites conforme docs/estrategia-conteudo.md).
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
import { ITACORUBI_CLUSTER_SLUGS, ITACORUBI_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { ITACORUBI_CLUSTER_SLUGS };

export const PILLAR = ITACORUBI_PILLAR;
export const HUB_HREF = '/bairro/itacorubi';
export const HUB_TITLE = 'Veja imóveis em lançamento no Itacorubi';
export const HUB_NEIGHBORHOOD_NAME = 'Itacorubi';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-3.webp';

export const SATELLITE_SLUGS = [...ITACORUBI_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...ITACORUBI_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('itacorubi') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'preco-m2-itacorubi-quanto-custa-comprar-imovel': [
		'apartamentos-a-venda-itacorubi-faixas-preco',
		'itacorubi-e-bom-para-morar',
		'custo-de-vida-itacorubi-quanto-custa-morar',
	],
	'apartamentos-a-venda-itacorubi-faixas-preco': [
		'preco-m2-itacorubi-quanto-custa-comprar-imovel',
		'itacorubi-e-bom-para-morar',
		'custo-de-vida-itacorubi-quanto-custa-morar',
	],
	'itacorubi-e-bom-para-morar': [
		'custo-de-vida-itacorubi-quanto-custa-morar',
		'preco-m2-itacorubi-quanto-custa-comprar-imovel',
		'apartamentos-a-venda-itacorubi-faixas-preco',
	],
	'custo-de-vida-itacorubi-quanto-custa-morar': [
		'preco-m2-itacorubi-quanto-custa-comprar-imovel',
		'apartamentos-a-venda-itacorubi-faixas-preco',
		'itacorubi-e-bom-para-morar',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	const maxSatellites = Math.min(3, SATELLITE_SLUGS.length - 1);
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? [], maxSatellites);
}

export const SATELLITE_BODY_PLAN = {
	'preco-m2-itacorubi-quanto-custa-comprar-imovel': {
		links: [
			{ find: 'eixo central', target: PILLAR },
			{ find: 'polo tecnológico', target: PILLAR },
			{ find: 'locação anual', target: PILLAR },
			{ find: 'custos fixos', target: 'custo-de-vida-itacorubi-quanto-custa-morar' },
		],
	},
	'apartamentos-a-venda-itacorubi-faixas-preco': {
		links: [
			{ find: 'polo tecnológico', target: PILLAR },
			{ find: 'faixa de preço', target: 'preco-m2-itacorubi-quanto-custa-comprar-imovel' },
			{ find: 'preço de m²', target: 'preco-m2-itacorubi-quanto-custa-comprar-imovel' },
			{ find: 'custos fixos', target: 'custo-de-vida-itacorubi-quanto-custa-morar' },
		],
	},
	'itacorubi-e-bom-para-morar': {
		links: [
			{ find: 'eixo central', target: PILLAR },
			{ find: 'custo de vida', target: 'custo-de-vida-itacorubi-quanto-custa-morar' },
			{ find: 'locação anual', target: 'apartamentos-a-venda-itacorubi-faixas-preco' },
			{ find: 'valorizada e completa', target: 'preco-m2-itacorubi-quanto-custa-comprar-imovel' },
		],
	},
	'custo-de-vida-itacorubi-quanto-custa-morar': {
		links: [
			{ find: 'valorização contínua', target: 'preco-m2-itacorubi-quanto-custa-comprar-imovel' },
			{ find: 'bairro plano', target: PILLAR },
			{ find: 'apartamentos compactos', target: 'apartamentos-a-venda-itacorubi-faixas-preco' },
			{ find: 'infraestrutura completa', target: 'itacorubi-e-bom-para-morar' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'valorização contínua', target: 'preco-m2-itacorubi-quanto-custa-comprar-imovel' },
		{ find: 'locação anual', target: 'preco-m2-itacorubi-quanto-custa-comprar-imovel' },
		{ find: 'studios para solteiros', target: 'apartamentos-a-venda-itacorubi-faixas-preco' },
		{ find: 'bom para morar', target: 'itacorubi-e-bom-para-morar' },
		{ find: 'custo de vida', target: 'custo-de-vida-itacorubi-quanto-custa-morar' },
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Itacorubi em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos no Itacorubi</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta no bairro.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-itacorubi">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades do Itacorubi</button>
<p class="blog-property-hub-lead__feedback" hidden role="status"></p>
</form>
</aside>
</div>`;
}

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	const published = SATELLITE_SLUGS.filter((slug) => blogTitleBySlug.has(slug));
	if (!published.length) {
		return '';
	}

	return renderLeiaTambem(published);
}

export function rebuildItacorubiArticle(rawHtml, slug) {
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
	if (!plan || !blogTitleBySlug.has(slug)) {
		return rawHtml;
	}

	const trimmed = trimSatelliteBodyPlan(
		plan.links,
		slug,
		PILLAR,
		SATELLITE_SLUGS,
		SATELLITE_BODY_PLAN,
		LEIA_TAMBEM[slug] ?? [],
	).filter(({ target }) => blogTitleBySlug.has(target));
	let linked = trimmed.length ? applyPlan(content, { links: trimmed }) : content;
	linked = stripHeadingAnchors(linked);
	linked = insertHubAfterSecondSubtitle(linked, renderHubBlock(slug));

	const leiaSlugs = leiaTambemSlugsForSatellite(slug).filter((s) => blogTitleBySlug.has(s));
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
