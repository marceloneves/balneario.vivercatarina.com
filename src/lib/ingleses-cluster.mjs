/**
 * Cluster Ingleses (estrela) — pilar + satélites conforme docs/estrategia-conteudo.md.
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
import { INGLESES_CLUSTER_SLUGS, INGLESES_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { INGLESES_CLUSTER_SLUGS };

export const PILLAR = INGLESES_PILLAR;
export const HUB_HREF = '/bairro/ingleses';
export const HUB_TITLE = 'Veja imóveis em lançamento nos Ingleses';
export const HUB_NEIGHBORHOOD_NAME = 'Ingleses';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-2.webp';

export const SATELLITE_SLUGS = [...INGLESES_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...INGLESES_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('ingleses') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const title = LINK_LABELS[targetSlug] ?? articleTitle(targetSlug);
	const label = short ? shortLinkLabel(title) : title;
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'aluguel-ingleses-valores-temporada': [
		'quanto-rende-apartamento-rua-das-gaivotas-ingleses',
		'apartamentos-a-venda-ingleses-faixas-preco',
		'investir-imovel-ingleses-locacao-valorizacao',
		'inverno-verao-ingleses-sazonalidade',
	],
	'casas-a-venda-ingleses-sub-regioes': [
		'apartamentos-a-venda-ingleses-faixas-preco',
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
		'sub-regioes-ingleses-guia-completo',
	],
	'apartamentos-a-venda-ingleses-faixas-preco': [
		'aluguel-ingleses-valores-temporada',
		'casas-a-venda-ingleses-sub-regioes',
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
		'investir-imovel-ingleses-locacao-valorizacao',
	],
	'preco-m2-ingleses-quanto-custa-comprar-imovel': [
		'apartamentos-a-venda-ingleses-faixas-preco',
		'sub-regioes-ingleses-guia-completo',
		'investir-imovel-ingleses-locacao-valorizacao',
		'ingleses-x-norte-cidade-onde-morar-balneario-camboriu',
	],
	'investir-imovel-ingleses-locacao-valorizacao': [
		'quanto-rende-apartamento-rua-das-gaivotas-ingleses',
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
		'aluguel-ingleses-valores-temporada',
		'apartamentos-a-venda-ingleses-faixas-preco',
	],
	'como-comprar-imovel-ingleses-financiamento': [
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
		'apartamentos-a-venda-ingleses-faixas-preco',
		'casas-a-venda-ingleses-sub-regioes',
		'investir-imovel-ingleses-locacao-valorizacao',
	],
	'ingleses-e-bom-para-morar': [
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
		'aluguel-ingleses-valores-temporada',
		'investir-imovel-ingleses-locacao-valorizacao',
		'como-comprar-imovel-ingleses-financiamento',
	],
	'sub-regioes-ingleses-guia-completo': [
		'regiao-gaivotas-ingleses-guia-completo',
		'casas-a-venda-ingleses-sub-regioes',
		'apartamentos-a-venda-ingleses-faixas-preco',
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
	],
	'regiao-gaivotas-ingleses-guia-completo': [
		'condominios-rua-das-gaivotas-ingleses-guia-completo',
		'quanto-rende-apartamento-rua-das-gaivotas-ingleses',
		PILLAR,
		'sub-regioes-ingleses-guia-completo',
	],
	'condominios-rua-das-gaivotas-ingleses-guia-completo': [
		'regiao-gaivotas-ingleses-guia-completo',
		'quanto-rende-apartamento-rua-das-gaivotas-ingleses',
		PILLAR,
		'como-comprar-imovel-ingleses-financiamento',
	],
	'quanto-rende-apartamento-rua-das-gaivotas-ingleses': [
		'regiao-gaivotas-ingleses-guia-completo',
		'condominios-rua-das-gaivotas-ingleses-guia-completo',
		'investir-imovel-ingleses-locacao-valorizacao',
		'aluguel-ingleses-valores-temporada',
	],
	'ingleses-x-norte-cidade-onde-morar-balneario-camboriu': [
		'preco-m2-ingleses-quanto-custa-comprar-imovel',
		'ingleses-e-bom-para-morar',
		'investir-imovel-ingleses-locacao-valorizacao',
	],
	'infraestrutura-ingleses-comercio-mobilidade': [
		'ingleses-e-bom-para-morar',
		'sub-regioes-ingleses-guia-completo',
		'ingleses-x-norte-cidade-onde-morar-balneario-camboriu',
	],
	'seguranca-ingleses-como-e-morar': [
		'ingleses-e-bom-para-morar',
		'sub-regioes-ingleses-guia-completo',
		'casas-a-venda-ingleses-sub-regioes',
	],
	'praias-ingleses-santinho-guia-completo': [
		'sub-regioes-ingleses-guia-completo',
		'ingleses-e-bom-para-morar',
		'seguranca-ingleses-como-e-morar',
	],
	'escolas-creches-ingleses-opcoes': [
		'ingleses-e-bom-para-morar',
		'infraestrutura-ingleses-comercio-mobilidade',
		'sub-regioes-ingleses-guia-completo',
	],
	'saude-ingleses-postos-hospitais-clinicas': [
		'escolas-creches-ingleses-opcoes',
		'infraestrutura-ingleses-comercio-mobilidade',
		'sub-regioes-ingleses-guia-completo',
	],
	'custo-de-vida-ingleses-quanto-custa-morar': [
		'aluguel-ingleses-valores-temporada',
		'inverno-verao-ingleses-sazonalidade',
		'ingleses-e-bom-para-morar',
	],
	'inverno-verao-ingleses-sazonalidade': [
		'custo-de-vida-ingleses-quanto-custa-morar',
		'aluguel-ingleses-valores-temporada',
		'infraestrutura-ingleses-comercio-mobilidade',
		'praias-ingleses-santinho-guia-completo',
	],
};


export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

export const SATELLITE_BODY_PLAN = {
	'aluguel-ingleses-valores-temporada': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'distância real', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'precificar pelo', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'custo mensal real', target: 'custo-de-vida-ingleses-quanto-custa-morar' },
		],
	},
	'casas-a-venda-ingleses-sub-regioes': {
		links: [
			{ find: 'condomínio fechado', target: PILLAR },
			{ find: 'sub-região define', target: 'sub-regioes-ingleses-guia-completo' },
			{ find: 'apartamento padronizado', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'financiáveis,', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
		],
	},
	'apartamentos-a-venda-ingleses-faixas-preco': {
		links: [
			{ find: 'Rua das Gaivotas', target: 'regiao-gaivotas-ingleses-guia-completo' },
			{ find: 'render com pouco', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'aluguel de temporada', target: 'aluguel-ingleses-valores-temporada' },
			{ find: 'como Jurerê', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
			{ find: 'maior bairro', target: PILLAR },
		],
	},
	'preco-m2-ingleses-quanto-custa-comprar-imovel': {
		links: [
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'dupla demanda', target: PILLAR },
			{ find: 'proximidade do mar', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'Canasvieiras é', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
		],
	},
	'investir-imovel-ingleses-locacao-valorizacao': {
		links: [
			{ find: 'locação de temporada', target: 'aluguel-ingleses-valores-temporada' },
			{ find: 'Jurerê Internacional lidera', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
			{ find: 'studios e compactos', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'valorização projetada', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'yield líquido', target: 'quanto-rende-apartamento-rua-das-gaivotas-ingleses' },
			{ find: 'dupla demanda', target: PILLAR },
		],
	},
	'como-comprar-imovel-ingleses-financiamento': {
		links: [
			{ find: 'escritura de posse', target: 'casas-a-venda-ingleses-sub-regioes' },
			{ find: 'lançamento na planta', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'valor do imóvel', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'Memorial de Incorporação', target: PILLAR },
		],
	},
	'ingleses-e-bom-para-morar': {
		links: [
			{ find: 'mais acessível que', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'Jurerê Internacional', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
			{ find: 'segurança é desigual', target: 'seguranca-ingleses-como-e-morar' },
			{ find: 'escola, comércio', target: 'escolas-creches-ingleses-opcoes' },
			{ find: 'saúde no bairro', target: 'saude-ingleses-postos-hospitais-clinicas' },
		],
	},
	'sub-regioes-ingleses-guia-completo': {
		links: [
			{ find: 'Rua das Gaivotas', target: 'regiao-gaivotas-ingleses-guia-completo' },
			{ find: 'lançamentos de maior', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'preços mais altos', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'inscrições rupestres', target: 'praias-ingleses-santinho-guia-completo' },
			{ find: 'personalidade sazonal', target: 'ingleses-e-bom-para-morar' },
		],
	},
	'regiao-gaivotas-ingleses-guia-completo': {
		links: [
			{ find: 'Rua das Gaivotas', target: 'condominios-rua-das-gaivotas-ingleses-guia-completo' },
			{ find: 'maior bairro', target: PILLAR },
			{ find: 'sub-regiões como', target: 'sub-regioes-ingleses-guia-completo' },
			{ find: 'R$ 11,4 mil', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'apartamentos compactos', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
			{ find: 'Jurerê Internacional', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
			{ find: 'financiamento bancário', target: 'como-comprar-imovel-ingleses-financiamento' },
			{ find: 'aluguel de temporada', target: 'quanto-rende-apartamento-rua-das-gaivotas-ingleses' },
			{ find: 'furtos de oportunidade', target: 'seguranca-ingleses-como-e-morar' },
		],
	},
	'condominios-rua-das-gaivotas-ingleses-guia-completo': {
		links: [
			{ find: 'região das Gaivotas', target: 'regiao-gaivotas-ingleses-guia-completo' },
			{ find: 'aluguel de temporada', target: 'quanto-rende-apartamento-rua-das-gaivotas-ingleses' },
			{ find: 'atas de assembleia', target: 'como-comprar-imovel-ingleses-financiamento' },
			{ find: 'taxas de condomínio', target: 'quanto-rende-apartamento-rua-das-gaivotas-ingleses' },
			{ find: 'R$ 490 a', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'sem vaga de', target: 'regiao-gaivotas-ingleses-guia-completo' },
		],
	},
	'quanto-rende-apartamento-rua-das-gaivotas-ingleses': {
		links: [
			{ find: 'Rua das Gaivotas', target: 'regiao-gaivotas-ingleses-guia-completo' },
			{ find: 'R$ 11,4 mil', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'condomínio alto', target: 'condominios-rua-das-gaivotas-ingleses-guia-completo' },
			{ find: 'locação anual', target: 'aluguel-ingleses-valores-temporada' },
			{ find: 'norte de Balneário Camboriú', target: PILLAR },
			{ find: 'sazonalidade marcante', target: 'inverno-verao-ingleses-sazonalidade' },
			{ find: 'valorização histórica', target: 'investir-imovel-ingleses-locacao-valorizacao' },
			{ find: 'regra de temporada', target: 'condominios-rua-das-gaivotas-ingleses-guia-completo' },
		],
	},
	'ingleses-x-norte-cidade-onde-morar-balneario-camboriu': {
		links: [
			{ find: 'Jurerê Internacional', target: 'investir-imovel-ingleses-locacao-valorizacao' },
			{ find: 'Canasvieiras', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'custo-benefício', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
			{ find: 'sub-região muda', target: 'sub-regioes-ingleses-guia-completo' },
		],
	},
	'infraestrutura-ingleses-comercio-mobilidade': {
		links: [
			{ find: 'autossuficiência', target: PILLAR },
			{ find: 'sub-regiões se organizam', target: 'sub-regioes-ingleses-guia-completo' },
			{ find: 'gargalo de acesso', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
			{ find: 'duas realidades', target: 'inverno-verao-ingleses-sazonalidade' },
		],
	},
	'seguranca-ingleses-como-e-morar': {
		links: [
			{ find: 'furto de oportunidade', target: PILLAR },
			{ find: 'respira com o calendário', target: 'inverno-verao-ingleses-sazonalidade' },
			{ find: 'sub-região para outra', target: 'sub-regioes-ingleses-guia-completo' },
			{ find: 'condomínio com portaria', target: 'casas-a-venda-ingleses-sub-regioes' },
		],
	},
	'praias-ingleses-santinho-guia-completo': {
		links: [
			{ find: 'privilégio de escolher', target: PILLAR },
			{ find: 'Ingleses Sul', target: 'sub-regioes-ingleses-guia-completo' },
			{ find: 'movimentado no verão', target: 'inverno-verao-ingleses-sazonalidade' },
			{ find: 'bolsa sozinhos', target: 'seguranca-ingleses-como-e-morar' },
		],
	},
	'escolas-creches-ingleses-opcoes': {
		links: [
			{ find: 'criar os filhos', target: PILLAR },
			{ find: 'regiões da cidade', target: 'infraestrutura-ingleses-comercio-mobilidade' },
			{ find: 'distância real entre', target: 'sub-regioes-ingleses-guia-completo' },
			{ find: 'filhos pequenos', target: 'ingleses-e-bom-para-morar' },
		],
	},
	'saude-ingleses-postos-hospitais-clinicas': {
		links: [
			{ find: 'sistema regional integrado', target: PILLAR },
			{ find: 'Canasvieiras e Cachoeira', target: 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu' },
			{ find: 'famílias com idosos', target: 'ingleses-e-bom-para-morar' },
			{ find: 'endereço pretendido', target: 'sub-regioes-ingleses-guia-completo' },
		],
	},
	'custo-de-vida-ingleses-quanto-custa-morar': {
		links: [
			{ find: 'moram nos Ingleses o', target: PILLAR },
			{ find: 'aluguel de dois', target: 'aluguel-ingleses-valores-temporada' },
			{ find: 'escola, comércio e saúde', target: 'escolas-creches-ingleses-opcoes' },
			{ find: 'sazonalidade do bairro', target: 'inverno-verao-ingleses-sazonalidade' },
		],
	},
	'inverno-verao-ingleses-sazonalidade': {
		links: [
			{ find: 'procurados da capital', target: PILLAR },
			{ find: 'aluguel de temporada', target: 'aluguel-ingleses-valores-temporada' },
			{ find: 'SC-403 congestiona', target: 'infraestrutura-ingleses-comercio-mobilidade' },
			{ find: 'Praia dos Ingleses', target: 'praias-ingleses-santinho-guia-completo' },
			{ find: 'atenção ao orçamento', target: 'custo-de-vida-ingleses-quanto-custa-morar' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'valorização acima', target: 'preco-m2-ingleses-quanto-custa-comprar-imovel' },
		{ find: 'tripé raro', target: 'apartamentos-a-venda-ingleses-faixas-preco' },
		{ find: 'condomínios fechados', target: 'casas-a-venda-ingleses-sub-regioes' },
		{ find: 'bom para morar', target: 'ingleses-e-bom-para-morar' },
		{ find: 'sub-regiões', target: 'sub-regioes-ingleses-guia-completo' },
		{ find: 'Rua das Gaivotas', target: 'regiao-gaivotas-ingleses-guia-completo' },
		{ find: 'Ingleses Centrinho', target: 'infraestrutura-ingleses-comercio-mobilidade' },
		{ find: 'locação anual', target: 'aluguel-ingleses-valores-temporada' },
		{ find: 'investir', target: 'investir-imovel-ingleses-locacao-valorizacao' },
		{ find: 'Praia do Santinho', target: 'praias-ingleses-santinho-guia-completo' },
		{ find: 'escolas municipais', target: 'escolas-creches-ingleses-opcoes' },
		{ find: 'básicas de saúde', target: 'saude-ingleses-postos-hospitais-clinicas' },
		{ find: 'preços historicamente acessíveis', target: 'custo-de-vida-ingleses-quanto-custa-morar' },
		{ find: 'sazonalidade que marca', target: 'inverno-verao-ingleses-sazonalidade' },
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Ingleses em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos nos Ingleses</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta no bairro.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-ingleses">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades nos Ingleses</button>
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

export function rebuildInglesesArticle(rawHtml, slug) {
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
