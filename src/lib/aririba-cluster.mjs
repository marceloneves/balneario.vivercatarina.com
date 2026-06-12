/**
 * Cluster Ariribá (médio-estrela) — pilar + satélites conforme docs/estrategia-conteudo.md.
 */

import { BLOG_POSTS } from './blog-posts.mjs';
import {
	applyPlan,
	insertHubAfterSecondSubtitle,
	splitClosing,
	stripBodyAnchors,
	stripClusterBridge,
	stripHeadingAnchors,
	stripRelatedBlocks,
} from './campeche-cluster-body-links.mjs';
import { ARIRIBA_CLUSTER_SLUGS, ARIRIBA_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { ARIRIBA_CLUSTER_SLUGS };

export const PILLAR = ARIRIBA_PILLAR;
export const HUB_HREF = '/bairros';
export const HUB_TITLE = 'Veja imóveis em lançamento no Ariribá';
export const HUB_NEIGHBORHOOD_NAME = 'Ariribá';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-2.webp';

export const SATELLITE_SLUGS = [...ARIRIBA_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...ARIRIBA_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'preco-m2-aririba-balneario-camboriu-quanto-custa': [
		'apartamentos-a-venda-aririba-balneario-camboriu',
		'vale-a-pena-investir-aririba-balneario-camboriu',
		'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar',
	],
	'apartamentos-a-venda-aririba-balneario-camboriu': [
		'preco-m2-aririba-balneario-camboriu-quanto-custa',
		'vale-a-pena-investir-aririba-balneario-camboriu',
		'aririba-balneario-camboriu-e-bom-para-morar',
	],
	'vale-a-pena-investir-aririba-balneario-camboriu': [
		'preco-m2-aririba-balneario-camboriu-quanto-custa',
		'aluguel-aririba-balneario-camboriu-valores-mercado',
		'apartamentos-a-venda-aririba-balneario-camboriu',
	],
	'aluguel-aririba-balneario-camboriu-valores-mercado': [
		'preco-m2-aririba-balneario-camboriu-quanto-custa',
		'vale-a-pena-investir-aririba-balneario-camboriu',
		'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar',
	],
	'aririba-balneario-camboriu-e-bom-para-morar': [
		'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar',
		'vale-a-pena-investir-aririba-balneario-camboriu',
		'aluguel-aririba-balneario-camboriu-valores-mercado',
	],
	'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar': [
		'aluguel-aririba-balneario-camboriu-valores-mercado',
		'aririba-balneario-camboriu-e-bom-para-morar',
		'preco-m2-aririba-balneario-camboriu-quanto-custa',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

export const SATELLITE_BODY_PLAN = {
	'preco-m2-aririba-balneario-camboriu-quanto-custa': {
		links: [
			{ find: 'bairro de maior valorização', target: PILLAR },
			{ find: 'valorização patrimonial', target: 'vale-a-pena-investir-aririba-balneario-camboriu' },
			{ find: 'locação por temporada', target: 'aluguel-aririba-balneario-camboriu-valores-mercado' },
			{ find: 'apartamento de 2 dormitórios', target: 'apartamentos-a-venda-aririba-balneario-camboriu' },
		],
	},
	'apartamentos-a-venda-aririba-balneario-camboriu': {
		links: [
			{ find: 'morar no Ariribá', target: PILLAR },
			{ find: 'metro quadrado', target: 'preco-m2-aririba-balneario-camboriu-quanto-custa' },
			{ find: 'locação de temporada', target: 'aluguel-aririba-balneario-camboriu-valores-mercado' },
			{ find: 'valorização imobiliária', target: 'vale-a-pena-investir-aririba-balneario-camboriu' },
		],
	},
	'vale-a-pena-investir-aririba-balneario-camboriu': {
		links: [
			{ find: 'Morar no Ariribá', target: PILLAR },
			{ find: 'locação anual', target: 'aluguel-aririba-balneario-camboriu-valores-mercado' },
			{ find: 'preço por metro quadrado', target: 'preco-m2-aririba-balneario-camboriu-quanto-custa' },
			{ find: 'apartamentos à venda', target: 'apartamentos-a-venda-aririba-balneario-camboriu' },
		],
	},
	'aluguel-aririba-balneario-camboriu-valores-mercado': {
		links: [
			{ find: 'Morar no Ariribá', target: PILLAR },
			{ find: 'valorização imobiliária', target: 'preco-m2-aririba-balneario-camboriu-quanto-custa' },
			{ find: 'investir em imóveis', target: 'vale-a-pena-investir-aririba-balneario-camboriu' },
			{ find: 'custo de vida', target: 'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar' },
		],
	},
	'aririba-balneario-camboriu-e-bom-para-morar': {
		links: [
			{ find: 'Morar no Ariribá', target: PILLAR },
			{ find: 'investir em imóveis', target: 'vale-a-pena-investir-aririba-balneario-camboriu' },
			{ find: 'custo de vida', target: 'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar' },
			{ find: 'valorização imobiliária', target: 'preco-m2-aririba-balneario-camboriu-quanto-custa' },
		],
	},
	'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar': {
		links: [
			{ find: 'Morar no Ariribá', target: PILLAR },
			{ find: 'aluguel anual', target: 'aluguel-aririba-balneario-camboriu-valores-mercado' },
			{ find: 'valorização imobiliária', target: 'vale-a-pena-investir-aririba-balneario-camboriu' },
			{ find: 'bom para morar', target: 'aririba-balneario-camboriu-e-bom-para-morar' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [],
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Ariribá em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos no Ariribá</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta na região.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-aririba">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades do Ariribá</button>
<p class="blog-property-hub-lead__feedback" hidden role="status"></p>
</form>
</aside>
</div>`;
}

export function renderExploreBlock() {
	const published = SATELLITE_SLUGS.filter((slug) => blogTitleBySlug.has(slug));
	if (!published.length) {
		return '';
	}

	return renderLeiaTambem(published);
}

export function rebuildAriribaArticle(rawHtml, slug) {
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
