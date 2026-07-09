/**
 * Cluster Barra Sul (estrela) — pilar + satélites conforme docs/estrategia-conteudo.md.
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
} from './cluster-body-links.mjs';
import { BARRA_SUL_CLUSTER_SLUGS, BARRA_SUL_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { BARRA_SUL_CLUSTER_SLUGS };

export const PILLAR = BARRA_SUL_PILLAR;
export const HUB_HREF = '/bairro/barrasul';
export const HUB_TITLE = 'Veja imóveis em lançamento na Barra Sul';
export const HUB_NEIGHBORHOOD_NAME = 'Barra Sul';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-2.webp';

export const SATELLITE_SLUGS = [...BARRA_SUL_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...BARRA_SUL_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('barrasul') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'preco-m2-barra-sul-balneario-camboriu-quanto-custa': [
		'apartamentos-a-venda-barra-sul-balneario-camboriu',
		'vale-a-pena-investir-barra-sul-balneario-camboriu',
		'custo-de-vida-barra-sul-quanto-custa-morar',
	],
	'apartamentos-a-venda-barra-sul-balneario-camboriu': [
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		'coberturas-luxo-barra-sul-balneario-camboriu',
		'como-comprar-imovel-barra-sul-balneario-camboriu',
	],
	'coberturas-luxo-barra-sul-balneario-camboriu': [
		'apartamentos-a-venda-barra-sul-balneario-camboriu',
		'arranha-ceus-barra-sul-senna-tower',
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
	],
	'aluguel-barra-sul-temporada-valores-mercado': [
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		'custo-de-vida-barra-sul-quanto-custa-morar',
		'vale-a-pena-investir-barra-sul-balneario-camboriu',
	],
	'vale-a-pena-investir-barra-sul-balneario-camboriu': [
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		'aluguel-barra-sul-temporada-valores-mercado',
		'apartamentos-a-venda-barra-sul-balneario-camboriu',
	],
	'como-comprar-imovel-barra-sul-balneario-camboriu': [
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		'apartamentos-a-venda-barra-sul-balneario-camboriu',
		'vale-a-pena-investir-barra-sul-balneario-camboriu',
	],
	'barra-sul-e-bom-para-morar': [
		'custo-de-vida-barra-sul-quanto-custa-morar',
		'infraestrutura-barra-sul-comercio-mobilidade',
		'barra-sul-x-centro-x-pioneiros-comparativo',
	],
	'barra-sul-x-centro-x-pioneiros-comparativo': [
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		'barra-sul-e-bom-para-morar',
		'vale-a-pena-investir-barra-sul-balneario-camboriu',
	],
	'arranha-ceus-barra-sul-senna-tower': [
		'coberturas-luxo-barra-sul-balneario-camboriu',
		'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		'vale-a-pena-investir-barra-sul-balneario-camboriu',
	],
	'infraestrutura-barra-sul-comercio-mobilidade': [
		'barra-sul-e-bom-para-morar',
		'gastronomia-vida-noturna-barra-sul',
		'praia-barra-sul-molhe-guia-orla',
	],
	'praia-barra-sul-molhe-guia-orla': [
		'infraestrutura-barra-sul-comercio-mobilidade',
		'coberturas-luxo-barra-sul-balneario-camboriu',
		'barra-sul-e-bom-para-morar',
	],
	'gastronomia-vida-noturna-barra-sul': [
		'custo-de-vida-barra-sul-quanto-custa-morar',
		'infraestrutura-barra-sul-comercio-mobilidade',
		'barra-sul-e-bom-para-morar',
	],
	'custo-de-vida-barra-sul-quanto-custa-morar': [
		'aluguel-barra-sul-temporada-valores-mercado',
		'gastronomia-vida-noturna-barra-sul',
		'barra-sul-e-bom-para-morar',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

export const SATELLITE_BODY_PLAN = {
	'preco-m2-barra-sul-balneario-camboriu-quanto-custa': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'valorização imobiliária', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'locação de temporada', target: 'aluguel-barra-sul-temporada-valores-mercado' },
			{ find: 'compra na planta', target: 'como-comprar-imovel-barra-sul-balneario-camboriu' },
		],
	},
	'apartamentos-a-venda-barra-sul-balneario-camboriu': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'metro quadrado', target: 'preco-m2-barra-sul-balneario-camboriu-quanto-custa' },
			{ find: 'coberturas frente mar', target: 'coberturas-luxo-barra-sul-balneario-camboriu' },
			{ find: 'investimento imobiliário', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
		],
	},
	'coberturas-luxo-barra-sul-balneario-camboriu': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'valorização imobiliária', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'arranha-céus', target: 'arranha-ceus-barra-sul-senna-tower' },
			{ find: 'locação de temporada', target: 'aluguel-barra-sul-temporada-valores-mercado' },
		],
	},
	'aluguel-barra-sul-temporada-valores-mercado': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'valorização do metro quadrado', target: 'preco-m2-barra-sul-balneario-camboriu-quanto-custa' },
			{ find: 'investimento imobiliário', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'custo de vida', target: 'custo-de-vida-barra-sul-quanto-custa-morar' },
		],
	},
	'vale-a-pena-investir-barra-sul-balneario-camboriu': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'locação de temporada', target: 'aluguel-barra-sul-temporada-valores-mercado' },
			{ find: 'apartamentos à venda', target: 'apartamentos-a-venda-barra-sul-balneario-camboriu' },
			{ find: 'preço por metro quadrado', target: 'preco-m2-barra-sul-balneario-camboriu-quanto-custa' },
		],
	},
	'como-comprar-imovel-barra-sul-balneario-camboriu': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'imóvel na planta', target: 'preco-m2-barra-sul-balneario-camboriu-quanto-custa' },
			{ find: 'estilo de vida', target: 'barra-sul-e-bom-para-morar' },
			{ find: 'valorização imobiliária', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
		],
	},
	'barra-sul-e-bom-para-morar': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'investir em imóveis', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'infraestrutura e comércio', target: 'infraestrutura-barra-sul-comercio-mobilidade' },
			{ find: 'custo de vida', target: 'custo-de-vida-barra-sul-quanto-custa-morar' },
		],
	},
	'barra-sul-x-centro-x-pioneiros-comparativo': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'preço por metro quadrado', target: 'preco-m2-barra-sul-balneario-camboriu-quanto-custa' },
			{ find: 'locação de temporada', target: 'aluguel-barra-sul-temporada-valores-mercado' },
			{ find: 'valorização futura', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
		],
	},
	'arranha-ceus-barra-sul-senna-tower': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'investir em imóveis', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'locação por temporada', target: 'aluguel-barra-sul-temporada-valores-mercado' },
			{ find: 'coberturas de luxo', target: 'coberturas-luxo-barra-sul-balneario-camboriu' },
		],
	},
	'infraestrutura-barra-sul-comercio-mobilidade': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'apartamentos à venda', target: 'apartamentos-a-venda-barra-sul-balneario-camboriu' },
			{ find: 'retorno de investimento', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'estilo de vida', target: 'barra-sul-e-bom-para-morar' },
		],
	},
	'praia-barra-sul-molhe-guia-orla': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'altíssimo padrão', target: 'coberturas-luxo-barra-sul-balneario-camboriu' },
			{ find: 'valorização patrimonial', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'malha de serviços', target: 'infraestrutura-barra-sul-comercio-mobilidade' },
		],
	},
	'gastronomia-vida-noturna-barra-sul': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'infraestrutura de lazer', target: 'infraestrutura-barra-sul-comercio-mobilidade' },
			{ find: 'valorização imobiliária', target: 'vale-a-pena-investir-barra-sul-balneario-camboriu' },
			{ find: 'custo de vida', target: 'custo-de-vida-barra-sul-quanto-custa-morar' },
		],
	},
	'custo-de-vida-barra-sul-quanto-custa-morar': {
		links: [
			{ find: 'bairro mais luxuoso', target: PILLAR },
			{ find: 'aluguel anual', target: 'aluguel-barra-sul-temporada-valores-mercado' },
			{ find: 'Barra Sul ou Centro', target: 'barra-sul-x-centro-x-pioneiros-comparativo' },
			{ find: 'gastronomia', target: 'gastronomia-vida-noturna-barra-sul' },
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Barra Sul em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos na Barra Sul</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta na região.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-barra-sul">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades da Barra Sul</button>
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

export function rebuildBarraSulArticle(rawHtml, slug) {
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
