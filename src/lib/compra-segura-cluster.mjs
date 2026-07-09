/**
 * Cluster Compra Segura em Balneário Camboriú — pilar + satélites (sem hub de bairro).
 *
 * Regras de linkagem:
 * - Pilar: Leia também com todos os satélites publicados; sem links no corpo.
 * - Satélite: 1× pilar no corpo + 1× outro satélite do cluster no corpo; pilar de novo no Leia também.
 */

import { BLOG_POSTS } from './blog-posts.mjs';
import {
	applyPlan,
	splitClosing,
	stripBodyAnchors,
	stripClusterBridge,
	stripHeadingAnchors,
	stripRelatedBlocks,
} from './cluster-body-links.mjs';
import { COMPRA_SEGURA_CLUSTER_SLUGS, COMPRA_SEGURA_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { COMPRA_SEGURA_CLUSTER_SLUGS };

export const PILLAR = COMPRA_SEGURA_PILLAR;

export const SATELLITE_SLUGS = [...COMPRA_SEGURA_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));
const publishedSlugs = new Set(BLOG_POSTS.map((post) => post.slug));

export const PUBLISHED_SATELLITE_SLUGS = SATELLITE_SLUGS.filter((slug) => publishedSlugs.has(slug));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...COMPRA_SEGURA_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
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
	'posse-escritura-publica-propriedade-legal-balneario-camboriu': [
		'documentacao-comprar-imovel-santa-catarina-checklist',
		'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	],
	'documentacao-comprar-imovel-santa-catarina-checklist': [
		'posse-escritura-publica-propriedade-legal-balneario-camboriu',
		'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	],
	'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel': [
		'itbi-cartorio-santa-catarina-rito-transferencia-propriedade',
		'documentacao-comprar-imovel-santa-catarina-checklist',
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	],
	'itbi-cartorio-santa-catarina-rito-transferencia-propriedade': [
		'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		'documentacao-comprar-imovel-santa-catarina-checklist',
		'posse-escritura-publica-propriedade-legal-balneario-camboriu',
	],
	'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts': [
		'financiamento-imobiliario-sc-caixa-bancos-privados-melhor-taxa',
		'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		'documentacao-comprar-imovel-santa-catarina-checklist',
	],
	'financiamento-imobiliario-sc-caixa-bancos-privados-melhor-taxa': [
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
		'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		'documentacao-comprar-imovel-santa-catarina-checklist',
	],
	'plano-diretor-balneario-camboriu-viabilidade-terreno': [
		'areas-preservacao-permanente-app-balneario-camboriu',
		'documentacao-comprar-imovel-santa-catarina-checklist',
		'posse-escritura-publica-propriedade-legal-balneario-camboriu',
	],
	'areas-preservacao-permanente-app-balneario-camboriu': [
		'plano-diretor-balneario-camboriu-viabilidade-terreno',
		'terrenos-marinha-laudemio-balneario-camboriu-compra-orla',
		'documentacao-comprar-imovel-santa-catarina-checklist',
	],
	'terrenos-marinha-laudemio-balneario-camboriu-compra-orla': [
		'areas-preservacao-permanente-app-balneario-camboriu',
		'plano-diretor-balneario-camboriu-viabilidade-terreno',
		'documentacao-comprar-imovel-santa-catarina-checklist',
	],
	'habite-se-balneario-camboriu-entrega-chaves-imovel': [
		'contrato-imovel-planta-santa-catarina-clausulas-comprador',
		'documentacao-comprar-imovel-santa-catarina-checklist',
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	],
	'contrato-imovel-planta-santa-catarina-clausulas-comprador': [
		'incc-compra-planta-santa-catarina-inflacao-construcao',
		'habite-se-balneario-camboriu-entrega-chaves-imovel',
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	],
	'incc-compra-planta-santa-catarina-inflacao-construcao': [
		'contrato-imovel-planta-santa-catarina-clausulas-comprador',
		'habite-se-balneario-camboriu-entrega-chaves-imovel',
		'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
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
	'posse-escritura-publica-propriedade-legal-balneario-camboriu': {
		links: [
			{ find: 'contrato de gaveta', target: PILLAR },
			{ find: 'matrícula atualizada', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
			{ find: 'ITBI', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
			{ find: 'impossibilidade de financiar', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
		],
	},
	'documentacao-comprar-imovel-santa-catarina-checklist': {
		links: [
			{ find: 'contrato de gaveta', target: PILLAR },
			{ find: 'e não apenas de posse', target: 'posse-escritura-publica-propriedade-legal-balneario-camboriu' },
			{ find: 'ITBI', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
			{ find: 'capacidade de financiamento', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
		],
	},
	'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel': {
		links: [
			{ find: 'compra financiada', target: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao' },
			{ find: 'litoral catarinense', target: 'morar-em-balneario-camboriu-guia-completo' },
			{ find: 'custos de transação', target: 'comprar-imovel-na-planta-balneario-camboriu' },
		],
	},
	'itbi-cartorio-santa-catarina-rito-transferencia-propriedade': {
		links: [
			{ find: 'planejar a compra', target: PILLAR },
			{ find: 'financiamento bancário', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
			{ find: 'escritura pública', target: 'posse-escritura-publica-propriedade-legal-balneario-camboriu' },
			{ find: 'documentação do imóvel', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
			{ find: 'custos de transferência', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
		],
	},
	'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts': {
		links: [
			{ find: 'total da compra', target: PILLAR },
			{ find: 'ITBI', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
			{ find: 'guerra de taxas entre os bancos', target: 'financiamento-imobiliario-sc-caixa-bancos-privados-melhor-taxa' },
			{ find: 'imóvel residencial', target: 'posse-escritura-publica-propriedade-legal-balneario-camboriu' },
		],
	},
	'financiamento-imobiliario-sc-caixa-bancos-privados-melhor-taxa': {
		links: [
			{ find: 'compra imóvel', target: PILLAR },
			{ find: 'crédito imobiliário', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
			{ find: 'despesas de cartório', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
			{ find: 'documentação do imóvel', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
		],
	},
	'plano-diretor-balneario-camboriu-viabilidade-terreno': {
		links: [
			{ find: 'comprar terreno', target: PILLAR },
			{ find: 'sobreposição com APP', target: 'areas-preservacao-permanente-app-balneario-camboriu' },
			{ find: 'não substitui', target: 'posse-escritura-publica-propriedade-legal-balneario-camboriu' },
			{ find: 'assinar a escritura', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
		],
	},
	'areas-preservacao-permanente-app-balneario-camboriu': {
		links: [
			{ find: 'adquirir um imóvel', target: PILLAR },
			{ find: 'financiamento bancário', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
			{ find: 'zoneamento urbano', target: 'plano-diretor-balneario-camboriu-viabilidade-terreno' },
			{ find: 'terrenos com vista', target: 'terrenos-marinha-laudemio-balneario-camboriu-compra-orla' },
		],
	},
	'terrenos-marinha-laudemio-balneario-camboriu-compra-orla': {
		links: [
			{ find: 'imóvel de marinha', target: PILLAR },
			{ find: 'diligência documental', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
			{ find: 'escritura pública', target: 'posse-escritura-publica-propriedade-legal-balneario-camboriu' },
			{ find: 'registrar no cartório', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
		],
	},
	'habite-se-balneario-camboriu-entrega-chaves-imovel': {
		links: [
			{ find: 'imóveis na planta', target: PILLAR },
			{ find: 'averbado na matrícula', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
			{ find: 'contrato prevê', target: 'contrato-imovel-planta-santa-catarina-clausulas-comprador' },
			{ find: 'financiar', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
		],
	},
	'contrato-imovel-planta-santa-catarina-clausulas-comprador': {
		links: [
			{ find: 'compra na planta', target: PILLAR },
			{ find: '180 dias de tolerância', target: 'habite-se-balneario-camboriu-entrega-chaves-imovel' },
			{ find: 'INCC', target: 'incc-compra-planta-santa-catarina-inflacao-construcao' },
			{ find: 'financiamento', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
		],
	},
	'incc-compra-planta-santa-catarina-inflacao-construcao': {
		links: [
			{ find: 'compra na planta', target: PILLAR },
			{ find: 'parcela das chaves', target: 'contrato-imovel-planta-santa-catarina-clausulas-comprador' },
			{ find: 'habite-se', target: 'habite-se-balneario-camboriu-entrega-chaves-imovel' },
			{ find: 'financiamento', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
		],
	},
};

export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'posse e propriedade', target: 'posse-escritura-publica-propriedade-legal-balneario-camboriu' },
		{ find: 'terreno ou lote', target: 'plano-diretor-balneario-camboriu-viabilidade-terreno' },
		{ find: 'imóvel em APP', target: 'areas-preservacao-permanente-app-balneario-camboriu' },
		{ find: 'laudêmio', target: 'terrenos-marinha-laudemio-balneario-camboriu-compra-orla' },
		{ find: 'habite-se', target: 'habite-se-balneario-camboriu-entrega-chaves-imovel' },
		{ find: 'Lei do Distrato', target: 'contrato-imovel-planta-santa-catarina-clausulas-comprador' },
		{ find: 'INCC, o Índice Nacional', target: 'incc-compra-planta-santa-catarina-inflacao-construcao' },
		{ find: 'due diligence', target: 'documentacao-comprar-imovel-santa-catarina-checklist' },
		{ find: 'ITBI', target: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel' },
		{ find: 'financiamento', target: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts' },
	],
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

export function rebuildCompraSeguraArticle(rawHtml, slug) {
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

	const trimmed = trimSatelliteBodyPlan(
		plan.links,
		slug,
		PILLAR,
		SATELLITE_SLUGS,
		SATELLITE_BODY_PLAN,
		LEIA_TAMBEM[slug] ?? defaultLeiaSatellites(slug),
	).filter(({ target }) => publishedSlugs.has(target));
	let linked = trimmed.length ? applyPlan(content, { links: trimmed }) : content;
	linked = stripHeadingAnchors(linked);

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
