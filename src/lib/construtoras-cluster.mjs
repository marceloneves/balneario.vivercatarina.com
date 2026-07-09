/**
 * Cluster Incorporadoras e Construtoras de Balneário Camboriú — pilar + satélites.
 *
 * Regras de linkagem:
 * - Pilar: Leia também com todos os satélites publicados; sem links no corpo.
 * - Satélite: 1× pilar no corpo + 3× outros satélites no corpo; pilar de novo no Leia também.
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
import { CONSTRUTORAS_CLUSTER_SLUGS, CONSTRUTORAS_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs } from './cluster-link-rebuild.mjs';

export { CONSTRUTORAS_CLUSTER_SLUGS };

export const PILLAR = CONSTRUTORAS_PILLAR;

export const SATELLITE_SLUGS = [...CONSTRUTORAS_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));
const publishedSlugs = new Set(BLOG_POSTS.map((post) => post.slug));

export const PUBLISHED_SATELLITE_SLUGS = SATELLITE_SLUGS.filter((slug) => publishedSlugs.has(slug));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...CONSTRUTORAS_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
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
	'construtora-incorporadora-diferenca-balneario-camboriu': [
		'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence',
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
	],
	'maiores-arranha-ceus-balneario-camboriu-quem-construiu': [
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
	],
	'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini': [
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
		'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina',
		'rv-empreendimentos-outras-construtoras-balneario-camboriu',
	],
	'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence': [
		'construtora-incorporadora-diferenca-balneario-camboriu',
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
	],
	'rv-empreendimentos-outras-construtoras-balneario-camboriu': [
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
		'procave-balneario-camboriu-sustentabilidade-praia-brava',
	],
	'procave-balneario-camboriu-sustentabilidade-praia-brava': [
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
		'rv-empreendimentos-outras-construtoras-balneario-camboriu',
	],
	'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina': [
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
		'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini',
	],
	'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao': [
		'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus',
		'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini',
		'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina',
	],
	'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus': [
		'maiores-arranha-ceus-balneario-camboriu-quem-construiu',
		'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina',
		'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao',
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
	'construtora-incorporadora-diferenca-balneario-camboriu': {
		links: [
			{ find: 'Grandes nomes da', target: PILLAR },
			{ find: 'concebem, vendem e', target: 'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus' },
			{ find: 'Embraed e Procave', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'Procave atuam', target: 'procave-balneario-camboriu-sustentabilidade-praia-brava' },
			{ find: 'registro de incorporação', target: 'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
		],
	},
	'maiores-arranha-ceus-balneario-camboriu-quem-construiu': {
		links: [
			{ find: 'incorporadoras como a', target: PILLAR },
			{ find: 'Pasqualotto & GT', target: 'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina' },
			{ find: 'da FG Empreendimentos', target: 'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus' },
			{ find: 'da Embraed', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'grife Armani/Casa', target: 'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'solidez da incorporadora', target: 'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence' },
			{ find: 'potencial de valorização', target: 'investir-imoveis-balneario-camboriu-valorizacao-roi' },
		],
	},
	'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini': {
		links: [
			{ find: 'polo de branded', target: PILLAR },
			{ find: 'pela Embraed', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'Pasqualotto & GT', target: 'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina' },
			{ find: 'CK Construções', target: 'rv-empreendimentos-outras-construtoras-balneario-camboriu' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'reputação de quem', target: 'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence' },
			{ find: 'potencial de retorno', target: 'investir-imoveis-balneario-camboriu-valorizacao-roi' },
		],
	},
	'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence': {
		links: [
			{ find: 'líderes de Balneário', target: PILLAR },
			{ find: 'banco de terrenos', target: 'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus' },
			{ find: 'Construtoras menores', target: 'rv-empreendimentos-outras-construtoras-balneario-camboriu' },
			{ find: 'construtoras consolidadas', target: 'procave-balneario-camboriu-sustentabilidade-praia-brava' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'acabamentos e materiais', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'construtora que define', target: 'construtora-incorporadora-diferenca-balneario-camboriu' },
		],
	},
	'rv-empreendimentos-outras-construtoras-balneario-camboriu': {
		links: [
			{ find: 'ecossistema diverso de', target: PILLAR },
			{ find: 'arranha-céus', target: 'maiores-arranha-ceus-balneario-camboriu-quem-construiu' },
			{ find: 'branded residences', target: 'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini' },
			{ find: 'Praia Brava', target: 'procave-balneario-camboriu-sustentabilidade-praia-brava' },
			{ find: 'design de grife', target: 'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'análise criteriosa', target: 'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence' },
		],
	},
	'procave-balneario-camboriu-sustentabilidade-praia-brava': {
		links: [
			{ find: 'litoral norte catarinense', target: PILLAR },
			{ find: 'Barra Sul de', target: 'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus' },
			{ find: 'alto padrão com', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'frente-mar na', target: 'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina' },
			{ find: 'construtoras concentradas em', target: 'rv-empreendimentos-outras-construtoras-balneario-camboriu' },
		],
	},
	'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina': {
		links: [
			{ find: 'referência mundial de', target: PILLAR },
			{ find: 'torres gêmeas da', target: 'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus' },
			{ find: 'alto padrão de', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'sustentabilidade', target: 'procave-balneario-camboriu-sustentabilidade-praia-brava' },
			{ find: 'branded residence', target: 'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini' },
		],
	},
	'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao': {
		links: [
			{ find: 'referências do luxo', target: PILLAR },
			{ find: '270 metros', target: 'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus' },
			{ find: 'design italiano', target: 'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina' },
			{ find: 'ISO 14001', target: 'procave-balneario-camboriu-sustentabilidade-praia-brava' },
			{ find: 'branded residences', target: 'branded-residences-balneario-camboriu-armani-pininfarina-lamborghini' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
		],
	},
	'fg-empreendimentos-balneario-camboriu-maior-construtora-arranha-ceus': {
		links: [
			{ find: 'incorporadora de BC', target: PILLAR },
			{ find: 'Yachthouse by Pininfarina', target: 'pasqualotto-gt-balneario-camboriu-yachthouse-pininfarina' },
			{ find: 'acabamentos de altíssimo', target: 'embaed-balneario-camboriu-luxo-artesanal-acabamento-alto-padrao' },
			{ find: 'Barra Sul', target: 'procave-balneario-camboriu-sustentabilidade-praia-brava' },
			{ find: 'compra na planta', target: 'comprar-imovel-na-planta-balneario-camboriu' },
			{ find: 'incorporadora é decisiva', target: 'como-escolher-incorporadora-segura-balneario-camboriu-due-diligence' },
			{ find: 'potencial de valorização', target: 'investir-imoveis-balneario-camboriu-valorizacao-roi' },
			{ find: 'oito dos dez', target: 'maiores-arranha-ceus-balneario-camboriu-quem-construiu' },
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

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	if (PUBLISHED_SATELLITE_SLUGS.length === 0) {
		return '';
	}

	return renderLeiaTambem(PUBLISHED_SATELLITE_SLUGS);
}

export function rebuildConstrutorasArticle(rawHtml, slug) {
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

	const trimmed = plan.links.filter(({ target }) => publishedSlugs.has(target));
	let linked = trimmed.length ? applyPlan(content, { links: trimmed }) : content;
	linked = stripHeadingAnchors(linked);

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
