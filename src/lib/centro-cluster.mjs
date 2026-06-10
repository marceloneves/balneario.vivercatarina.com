/**
 * Cluster Centro (estrela) — pilar + satélites conforme docs/estrategia-conteudo.md.
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
import { CENTRO_CLUSTER_SLUGS, CENTRO_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { CENTRO_CLUSTER_SLUGS };

export const PILLAR = CENTRO_PILLAR;
export const HUB_HREF = '/bairro/centro';
export const HUB_TITLE = 'Veja imóveis em lançamento no Centro';
export const HUB_NEIGHBORHOOD_NAME = 'Centro';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-1.webp';

export const SATELLITE_SLUGS = [...CENTRO_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...CENTRO_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('centro') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel': [
		'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco',
		'investir-imovel-centro-balneario-camboriu-locacao-valorizacao',
		'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar',
	],
	'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco': [
		'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel',
		'investir-imovel-centro-balneario-camboriu-locacao-valorizacao',
		'como-comprar-imovel-centro-balneario-camboriu-financiamento',
	],
	'aluguel-centro-balneario-camboriu-valores-mercado': [
		'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel',
		'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco',
		'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar',
	],
	'investir-imovel-centro-balneario-camboriu-locacao-valorizacao': [
		'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel',
		'aluguel-centro-balneario-camboriu-valores-mercado',
		'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco',
	],
	'como-comprar-imovel-centro-balneario-camboriu-financiamento': [
		'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel',
		'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco',
		'investir-imovel-centro-balneario-camboriu-locacao-valorizacao',
	],
	'centro-balneario-camboriu-e-bom-para-morar': [
		'centro-x-beira-mar-onde-morar-balneario-camboriu',
		'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel',
		'investir-imovel-centro-balneario-camboriu-locacao-valorizacao',
	],
	'centro-x-beira-mar-onde-morar-balneario-camboriu': [
		'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel',
		'centro-balneario-camboriu-e-bom-para-morar',
		'aluguel-centro-balneario-camboriu-valores-mercado',
	],
	'infraestrutura-centro-balneario-camboriu-comercio-mobilidade': [
		'centro-balneario-camboriu-e-bom-para-morar',
		'centro-x-beira-mar-onde-morar-balneario-camboriu',
		'seguranca-centro-balneario-camboriu-como-e-morar',
	],
	'seguranca-centro-balneario-camboriu-como-e-morar': [
		'centro-balneario-camboriu-e-bom-para-morar',
		'infraestrutura-centro-balneario-camboriu-comercio-mobilidade',
		'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco',
	],
	'escolas-saude-centro-balneario-camboriu-opcoes': [
		'centro-balneario-camboriu-e-bom-para-morar',
		'infraestrutura-centro-balneario-camboriu-comercio-mobilidade',
		'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar',
	],
	'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar': [
		'aluguel-centro-balneario-camboriu-valores-mercado',
		'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia',
		'centro-x-beira-mar-onde-morar-balneario-camboriu',
	],
	'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia': [
		'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar',
		'infraestrutura-centro-balneario-camboriu-comercio-mobilidade',
		'centro-balneario-camboriu-e-bom-para-morar',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

export const SATELLITE_BODY_PLAN = {
	'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel': {
		links: [
			{ find: 'renda de locação', target: PILLAR },
			{ find: 'apartamentos compactos', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
			{ find: 'custos fixos', target: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar' },
			{ find: 'valorização contínua', target: 'investir-imovel-centro-balneario-camboriu-locacao-valorizacao' },
			{ find: 'apartamentos compactos', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
		],
	},
	'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco': {
		links: [
			{ find: 'praticidade urbana', target: PILLAR },
			{ find: 'custo por metro', target: 'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel' },
			{ find: 'locação anual', target: 'aluguel-centro-balneario-camboriu-valores-mercado' },
			{ find: 'custo de reforma', target: 'como-comprar-imovel-centro-balneario-camboriu-financiamento' },
		],
	},
	'aluguel-centro-balneario-camboriu-valores-mercado': {
		links: [
			{ find: 'imposto de marinha', target: PILLAR },
			{ find: 'imóveis mobiliados', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
			{ find: 'valor total da locação', target: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar' },
			{ find: 'por metro quadrado', target: 'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel' },
		],
	},
	'investir-imovel-centro-balneario-camboriu-locacao-valorizacao': {
		links: [
			{ find: 'locação anual', target: 'aluguel-centro-balneario-camboriu-valores-mercado' },
			{ find: 'yield líquido', target: 'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel' },
			{ find: 'custo do financiamento', target: 'como-comprar-imovel-centro-balneario-camboriu-financiamento' },
			{ find: 'Studios reformados', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
		],
	},
	'como-comprar-imovel-centro-balneario-camboriu-financiamento': {
		links: [
			{ find: 'faixa real de imóveis', target: 'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel' },
			{ find: 'tipo de imóvel', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
			{ find: 'prédios antigos', target: PILLAR },
			{ find: 'composição de renda', target: 'investir-imovel-centro-balneario-camboriu-locacao-valorizacao' },
		],
	},
	'centro-balneario-camboriu-e-bom-para-morar': {
		links: [
			{ find: 'mais movimentada e prática', target: PILLAR },
			{ find: 'valorização consistente', target: 'investir-imovel-centro-balneario-camboriu-locacao-valorizacao' },
			{ find: 'polo cultural', target: 'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia' },
			{ find: 'Custo de vida', target: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar' },
		],
	},
	'centro-x-beira-mar-onde-morar-balneario-camboriu': {
		links: [
			{ find: 'metro quadrado gira', target: 'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel' },
			{ find: 'conveniência e efervescência', target: 'centro-balneario-camboriu-e-bom-para-morar' },
			{ find: 'cultura e gastronomia', target: 'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia' },
			{ find: 'principal nó de transporte', target: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade' },
		],
	},
	'infraestrutura-centro-balneario-camboriu-comercio-mobilidade': {
		links: [
			{ find: 'vida nas ruas', target: PILLAR },
			{ find: 'gargalo das pontes', target: 'centro-x-beira-mar-onde-morar-balneario-camboriu' },
			{ find: 'vaga escriturada', target: 'como-comprar-imovel-centro-balneario-camboriu-financiamento' },
			{ find: 'entorno do TICEN', target: 'seguranca-centro-balneario-camboriu-como-e-morar' },
		],
	},
	'seguranca-centro-balneario-camboriu-como-e-morar': {
		links: [
			{ find: 'crime de oportunidade', target: PILLAR },
			{ find: 'entorno do TICEN', target: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade' },
			{ find: 'comerciais esvaziam', target: 'centro-balneario-camboriu-e-bom-para-morar' },
			{ find: 'portaria, controle', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
		],
	},
	'escolas-saude-centro-balneario-camboriu-opcoes': {
		links: [
			{ find: 'escola e hospital perto', target: PILLAR },
			{ find: 'barulho e área verde', target: 'centro-balneario-camboriu-e-bom-para-morar' },
			{ find: 'estrutura de serviços', target: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade' },
			{ find: 'mensalidades escolares', target: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar' },
		],
	},
	'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar': {
		links: [
			{ find: 'passagem mais cara', target: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade' },
			{ find: 'viver a pé', target: PILLAR },
			{ find: 'vida cultural', target: 'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia' },
			{ find: 'comparação simplista', target: 'centro-x-beira-mar-onde-morar-balneario-camboriu' },
		],
	},
	'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia': {
		links: [
			{ find: 'custo zero', target: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar' },
			{ find: 'estacionar no Centro', target: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade' },
			{ find: 'quem mora ali', target: PILLAR },
			{ find: 'morar no Centro', target: 'centro-balneario-camboriu-e-bom-para-morar' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'Mercado Público', target: 'o-que-fazer-centro-balneario-camboriu-cultura-gastronomia' },
		{ find: 'locação anual', target: 'aluguel-centro-balneario-camboriu-valores-mercado' },
		{ find: 'Para quem investe', target: 'investir-imovel-centro-balneario-camboriu-locacao-valorizacao' },
		{ find: 'metros quadrados', target: 'preco-m2-centro-balneario-camboriu-quanto-custa-comprar-imovel' },
		{ find: 'lançamentos residenciais', target: 'apartamentos-a-venda-centro-balneario-camboriu-faixas-preco' },
		{ find: 'perfis de comprador', target: 'como-comprar-imovel-centro-balneario-camboriu-financiamento' },
		{ find: 'trânsito intenso', target: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade' },
		{ find: 'bom para morar', target: 'centro-balneario-camboriu-e-bom-para-morar' },
		{ find: 'Educação e saúde na região', target: 'escolas-saude-centro-balneario-camboriu-opcoes' },
		{ find: 'dependência do carro', target: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar' },
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Centro em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos no Centro</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta na região.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-centro">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades do Centro</button>
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

export function rebuildCentroArticle(rawHtml, slug) {
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
