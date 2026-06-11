/**
 * Cluster Balneário Camboriú (geral) — pilar + satélites.
 *
 * Regras de linkagem:
 * - Pilar: Leia também com 1× cada satélite; sem links no corpo.
 * - Satélite: 1× pilar no corpo + 1× pilar no Leia também; 3× outros satélites no corpo e 3× no Leia também.
 */

import { BLOG_POSTS } from './blog-posts.mjs';
import {
	applyPlan,
	splitClosing,
	stripBodyAnchors,
	stripClusterBridge,
	stripHeadingAnchors,
	stripRelatedBlocks,
} from './campeche-cluster-body-links.mjs';
import { BALNEARIO_CAMBORIU_CLUSTER_SLUGS, BALNEARIO_CAMBORIU_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs } from './cluster-link-rebuild.mjs';

export { BALNEARIO_CAMBORIU_CLUSTER_SLUGS };

export const PILLAR = BALNEARIO_CAMBORIU_PILLAR;

export const SATELLITE_SLUGS = [...BALNEARIO_CAMBORIU_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));
const publishedSlugs = new Set(BLOG_POSTS.map((post) => post.slug));

export const PUBLISHED_SATELLITE_SLUGS = SATELLITE_SLUGS.filter((slug) => publishedSlugs.has(slug));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...BALNEARIO_CAMBORIU_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set();

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const fullTitle = articleTitle(targetSlug);
	const label = short ? shortLinkLabel(fullTitle) : fullTitle;
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

/** Três satélites do cluster por artigo (pilar entra sempre em 1º no Leia também). */
export const LEIA_TAMBEM = {
	'frente-mar-quadra-mar-vista-mar-balneario-camboriu': [
		'investir-imoveis-balneario-camboriu-valorizacao-roi',
		'comprar-imovel-na-planta-balneario-camboriu',
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	],
	'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel': [
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		'comprar-imovel-na-planta-balneario-camboriu',
		'comprar-imovel-balneario-camboriu-estrangeiro',
	],
	'comprar-imovel-balneario-camboriu-estrangeiro': [
		'comprar-imovel-na-planta-balneario-camboriu',
		'investir-imoveis-balneario-camboriu-valorizacao-roi',
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	],
	'investir-imoveis-balneario-camboriu-valorizacao-roi': [
		'frente-mar-quadra-mar-vista-mar-balneario-camboriu',
		'comprar-imovel-na-planta-balneario-camboriu',
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	],
	'comprar-imovel-na-planta-balneario-camboriu': [
		'investir-imoveis-balneario-camboriu-valorizacao-roi',
		'comprar-imovel-balneario-camboriu-estrangeiro',
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	],
	'balneario-camboriu-trabalho-remoto-guia-nomade-digital': [
		'quanto-custa-morar-em-balneario-camboriu',
		'melhores-bairros-para-morar-em-balneario-camboriu',
		'mudar-para-balneario-camboriu-guia-vindo-outro-estado',
	],
	'apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha': [
		'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		'checklist-avaliar-imovel-em-balneario-camboriu',
	],
	'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao': [
		'apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha',
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		'checklist-avaliar-imovel-em-balneario-camboriu',
	],
	'mudar-para-balneario-camboriu-guia-vindo-outro-estado': [
		'quanto-custa-morar-em-balneario-camboriu',
		'melhores-bairros-para-morar-em-balneario-camboriu',
		'morar-centro-x-praias-em-balneario-camboriu',
	],
	'como-comprar-imovel-balneario-camboriu-financiamento-documentacao': [
		'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		'comprar-imovel-na-planta-balneario-camboriu',
		'comprar-imovel-balneario-camboriu-estrangeiro',
	],
	'checklist-avaliar-imovel-em-balneario-camboriu': [
		'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		'quanto-custa-morar-em-balneario-camboriu',
		'melhores-bairros-para-morar-em-balneario-camboriu',
	],
	'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande': [
		'melhores-bairros-para-morar-em-balneario-camboriu',
		'quanto-custa-morar-em-balneario-camboriu',
		'checklist-avaliar-imovel-em-balneario-camboriu',
	],
	'morar-centro-x-praias-em-balneario-camboriu': [
		'quanto-custa-morar-em-balneario-camboriu',
		'melhores-bairros-para-morar-em-balneario-camboriu',
		'mudar-para-balneario-camboriu-guia-vindo-outro-estado',
	],
	'quanto-custa-morar-em-balneario-camboriu': [
		'melhores-bairros-para-morar-em-balneario-camboriu',
		'morar-centro-x-praias-em-balneario-camboriu',
		'checklist-avaliar-imovel-em-balneario-camboriu',
	],
	'melhores-bairros-para-morar-em-balneario-camboriu': [
		'quanto-custa-morar-em-balneario-camboriu',
		'morar-centro-x-praias-em-balneario-camboriu',
		'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
	],
};

function defaultLeiaSatellites(slug) {
	return PUBLISHED_SATELLITE_SLUGS.filter((s) => s !== slug).slice(0, 3);
}

export function leiaTambemSlugsForSatellite(slug) {
	const configured = LEIA_TAMBEM[slug] ?? defaultLeiaSatellites(slug);
	const extra = configured.filter((s) => publishedSlugs.has(s));
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, extra);
}

export const SATELLITE_BODY_PLAN = {
	'frente-mar-quadra-mar-vista-mar-balneario-camboriu': {
		links: [
			{ find: 'litorais mais desejados', target: PILLAR },
			{ find: 'Para o investidor', target: 'investir-imoveis-balneario-camboriu-valorizacao-roi' },
			{ find: 'imóveis quadra-mar', target: 'apartamentos-a-venda-pioneiros' },
		],
	},
	'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel': {
		links: [
			{ find: 'litoral catarinense', target: PILLAR },
			{ find: 'compra financiada', target: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao' },
			{ find: 'custos de transação', target: 'comprar-imovel-na-planta-balneario-camboriu' },
		],
	},
	'comprar-imovel-balneario-camboriu-estrangeiro': {
		links: [
			{ find: 'litoral brasileiro', target: PILLAR },
			{ find: 'imóvel na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'imposto municipal de', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
		],
	},
	'investir-imoveis-balneario-camboriu-valorizacao-roi': {
		links: [
			{ find: 'litoral brasileiro', target: PILLAR },
			{ find: 'Comprar na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'padrão e frente-mar', target: 'frente-mar-quadra-mar-vista-mar-balneario-camboriu' },
		],
	},
	'comprar-imovel-na-planta-balneario-camboriu': {
		links: [
			{ find: 'litoral catarinense', target: PILLAR },
			{ find: 'custos de transação', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
			{ find: 'pagamento parcelado', target: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao' },
		],
	},
	'balneario-camboriu-trabalho-remoto-guia-nomade-digital': {
		links: [
			{ find: 'nômades digitais', target: PILLAR },
			{ find: 'capitais mais caras do Brasil', target: 'quanto-custa-morar-em-balneario-camboriu' },
			{ find: 'Escolher onde morar', target: 'melhores-bairros-para-morar-em-balneario-camboriu' },
			{ find: 'alugar por temporada', target: 'mudar-para-balneario-camboriu-guia-vindo-outro-estado' },
		],
	},
	'apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha': {
		links: [
			{ find: 'estilo de vida em Balneário Camboriú', target: PILLAR },
			{ find: 'casas e terrenos', target: 'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao' },
			{ find: 'investidores que buscam liquidez', target: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao' },
			{ find: 'crime de oportunidade', target: 'checklist-avaliar-imovel-em-balneario-camboriu' },
		],
	},
	'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao': {
		links: [
			{ find: 'comprar o terreno', target: PILLAR },
			{ find: 'construir e comprar pronto', target: 'apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha' },
			{ find: 'Escritura, matrícula', target: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao' },
			{ find: 'custo de vida e pela escassez', target: 'quanto-custa-morar-em-balneario-camboriu' },
		],
	},
	'mudar-para-balneario-camboriu-guia-vindo-outro-estado': {
		links: [
			{ find: 'definir moradia em Balneário Camboriú', target: PILLAR },
			{ find: 'uma das capitais mais caras do Brasil', target: 'quanto-custa-morar-em-balneario-camboriu' },
			{ find: 'quatro regiões de Balneário Camboriú', target: 'melhores-bairros-para-morar-em-balneario-camboriu' },
			{ find: 'Continente e Centro', target: 'morar-centro-x-praias-em-balneario-camboriu' },
		],
	},
	'como-comprar-imovel-balneario-camboriu-financiamento-documentacao': {
		links: [
			{ find: 'litoral brasileiro', target: PILLAR },
			{ find: 'valorização dos imóveis', target: 'investir-imoveis-balneario-camboriu-valorizacao-roi' },
			{ find: 'imposto municipal de', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
		],
	},
	'checklist-avaliar-imovel-em-balneario-camboriu': {
		links: [
			{ find: 'geografia de ilha', target: PILLAR },
			{ find: 'matrícula do imóvel', target: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao' },
			{ find: 'IPTU', target: 'quanto-custa-morar-em-balneario-camboriu' },
			{ find: 'região universitária', target: 'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande' },
		],
	},
	'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande': {
		links: [
			{ find: 'estudante da UFSC', target: PILLAR },
			{ find: 'apartamento de um quarto', target: 'quanto-custa-morar-em-balneario-camboriu' },
			{ find: 'ao lado da UFSC', target: 'melhores-bairros-para-morar-em-balneario-camboriu' },
			{ find: 'região universitária exige estratégia', target: 'checklist-avaliar-imovel-em-balneario-camboriu' },
		],
	},
	'morar-centro-x-praias-em-balneario-camboriu': {
		links: [
			{ find: 'geografia ilhada', target: PILLAR },
			{ find: 'diferença no aluguel', target: 'quanto-custa-morar-em-balneario-camboriu' },
			{ find: 'bairros insulares', target: 'melhores-bairros-para-morar-em-balneario-camboriu' },
			{ find: 'migra de fora', target: 'mudar-para-balneario-camboriu-guia-vindo-outro-estado' },
		],
	},
	'quanto-custa-morar-em-balneario-camboriu': {
		links: [
			{ find: 'custo real de moradia em Balneário Camboriú', target: PILLAR },
			{ find: 'qual bairro faz mais sentido', target: 'melhores-bairros-para-morar-em-balneario-camboriu' },
			{ find: 'escolha entre praias e centro', target: 'morar-centro-x-praias-em-balneario-camboriu' },
			{ find: 'custos extras', target: 'checklist-avaliar-imovel-em-balneario-camboriu' },
		],
	},
	'melhores-bairros-para-morar-em-balneario-camboriu': {
		links: [
			{ find: 'Ilha do Silício', target: PILLAR },
			{ find: 'custos fixos além da moradia', target: 'quanto-custa-morar-em-balneario-camboriu' },
			{ find: 'região continental', target: 'morar-centro-x-praias-em-balneario-camboriu' },
			{ find: 'presença da UFSC', target: 'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande' },
		],
	},
};

function filterPublishedPlanLinks(links) {
	return links.filter(({ target }) => publishedSlugs.has(target));
}

export function renderLeiaTambem(slugs) {
	const items = slugs.map((s) => `<li>${linkHtml(s)}</li>`).join('\n');
	return `<div class="blog-related">
<p class="blog-related__title">Leia também</p>
<ul>
${items}
</ul>
</div>`;
}

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	if (PUBLISHED_SATELLITE_SLUGS.length === 0) {
		return '';
	}

	return renderLeiaTambem(PUBLISHED_SATELLITE_SLUGS);
}

export function rebuildFlorianopolisArticle(rawHtml, slug) {
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
	if (!plan || !publishedSlugs.has(slug)) {
		return rawHtml;
	}

	const planLinks = filterPublishedPlanLinks(plan.links);
	let linked = planLinks.length ? applyPlan(content, { links: planLinks }) : content;
	linked = stripHeadingAnchors(linked);

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
