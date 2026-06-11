/**
 * Cluster Pioneiros / Barra Norte (estrela) — pilar + satélites conforme docs/estrategia-conteudo.md.
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
import { PIONEIROS_CLUSTER_SLUGS, PIONEIROS_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { PIONEIROS_CLUSTER_SLUGS };

export const PILLAR = PIONEIROS_PILLAR;
export const HUB_HREF = '/bairro/pioneiros';
export const HUB_TITLE = 'Veja imóveis em lançamento nos Pioneiros';
export const HUB_NEIGHBORHOOD_NAME = 'Pioneiros';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-2.webp';

export const SATELLITE_SLUGS = [...PIONEIROS_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

export const LINK_LABELS = Object.fromEntries(
	[...PIONEIROS_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('pioneiros') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

export const LEIA_TAMBEM = {
	'preco-m2-pioneiros-bairro-em-ascensao': [
		'apartamentos-a-venda-pioneiros',
		'pioneiros-e-bom-para-morar',
		'vale-a-pena-investir-pioneiros',
	],
	'apartamentos-a-venda-pioneiros': [
		'preco-m2-pioneiros-bairro-em-ascensao',
		'pioneiros-e-bom-para-morar',
		'como-comprar-imovel-pioneiros-barra-norte',
	],
	'aluguel-pioneiros-valores-mercado': [
		'custo-de-vida-pioneiros',
		'preco-m2-pioneiros-bairro-em-ascensao',
		'pioneiros-e-bom-para-morar',
	],
	'vale-a-pena-investir-pioneiros': [
		'preco-m2-pioneiros-bairro-em-ascensao',
		'pioneiros-e-bom-para-morar',
		'como-comprar-imovel-pioneiros-barra-norte',
	],
	'como-comprar-imovel-pioneiros-barra-norte': [
		'preco-m2-pioneiros-bairro-em-ascensao',
		'pioneiros-e-bom-para-morar',
		'apartamentos-a-venda-pioneiros',
	],
	'pioneiros-e-bom-para-morar': [
		'preco-m2-pioneiros-bairro-em-ascensao',
		'pioneiros-x-barra-sul-custo-beneficio',
		'vale-a-pena-investir-pioneiros',
	],
	'pioneiros-x-barra-sul-custo-beneficio': [
		'preco-m2-pioneiros-bairro-em-ascensao',
		'vale-a-pena-investir-pioneiros',
		'pioneiros-e-bom-para-morar',
	],
	'infraestrutura-pioneiros-molhe-comercio-servicos': [
		'barra-norte-molhe-guia-regiao-pioneiros',
		'pioneiros-e-bom-para-morar',
		'como-comprar-imovel-pioneiros-barra-norte',
	],
	'barra-norte-molhe-guia-regiao-pioneiros': [
		'morro-do-careca-estaleiro-natureza-pioneiros',
		'infraestrutura-pioneiros-molhe-comercio-servicos',
		'pioneiros-e-bom-para-morar',
	],
	'morro-do-careca-estaleiro-natureza-pioneiros': [
		'barra-norte-molhe-guia-regiao-pioneiros',
		'pioneiros-e-bom-para-morar',
		'vale-a-pena-investir-pioneiros',
	],
	'custo-de-vida-pioneiros': [
		'aluguel-pioneiros-valores-mercado',
		'pioneiros-e-bom-para-morar',
		'preco-m2-pioneiros-bairro-em-ascensao',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

export const SATELLITE_BODY_PLAN = {
	'preco-m2-pioneiros-bairro-em-ascensao': {
		links: [
			{ find: 'bairro em ascensão', target: PILLAR },
			{ find: 'compra na planta', target: PILLAR },
			{ find: 'tipo de imóvel', target: 'apartamentos-a-venda-pioneiros' },
			{ find: 'valorização acelerada', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'focados em locação', target: 'aluguel-pioneiros-valores-mercado' },
			{ find: 'ITBI', target: 'como-comprar-imovel-pioneiros-barra-norte' },
		],
	},
	'apartamentos-a-venda-pioneiros': {
		links: [
			{ find: 'compra na planta', target: PILLAR },
			{ find: 'metro quadrado médio', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'alto padrão', target: PILLAR },
			{ find: 'locação anual', target: 'aluguel-pioneiros-valores-mercado' },
			{ find: 'morar ou investir', target: 'vale-a-pena-investir-pioneiros' },
		],
	},
	'aluguel-pioneiros-valores-mercado': {
		links: [
			{ find: 'bairro em ascensão', target: PILLAR },
			{ find: '2 suítes', target: 'apartamentos-a-venda-pioneiros' },
			{ find: 'custo-benefício', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'investir em aluguel', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'custo de vida', target: 'custo-de-vida-pioneiros' },
		],
	},
	'vale-a-pena-investir-pioneiros': {
		links: [
			{ find: 'Pontal Norte', target: PILLAR },
			{ find: 'renda de locação', target: 'aluguel-pioneiros-valores-mercado' },
			{ find: 'm² médio', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'coberturas', target: 'apartamentos-a-venda-pioneiros' },
			{ find: 'compra na planta', target: 'como-comprar-imovel-pioneiros-barra-norte' },
		],
	},
	'como-comprar-imovel-pioneiros-barra-norte': {
		links: [
			{ find: 'compra na planta', target: PILLAR },
			{ find: '4% a 6%', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'incorporadora', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'quadra-mar', target: 'apartamentos-a-venda-pioneiros' },
			{ find: 'valorização durante', target: 'vale-a-pena-investir-pioneiros' },
		],
	},
	'pioneiros-e-bom-para-morar': {
		links: [
			{ find: 'qualidade de vida', target: PILLAR },
			{ find: 'custo-benefício', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'empreendimentos verticais', target: 'apartamentos-a-venda-pioneiros' },
			{ find: 'valorização acelerada', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'zoneamento', target: 'como-comprar-imovel-pioneiros-barra-norte' },
		],
	},
	'pioneiros-x-barra-sul-custo-beneficio': {
		links: [
			{ find: 'Barra Norte', target: PILLAR },
			{ find: 'custo-benefício', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'potencial de valorização', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'qualidade de vida', target: 'pioneiros-e-bom-para-morar' },
			{ find: 'No aluguel', target: 'aluguel-pioneiros-valores-mercado' },
		],
	},
	'infraestrutura-pioneiros-molhe-comercio-servicos': {
		links: [
			{ find: 'Barra Norte', target: PILLAR },
			{ find: 'qualidade de vida', target: 'pioneiros-e-bom-para-morar' },
			{ find: 'valorização', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'escolher o imóvel', target: 'como-comprar-imovel-pioneiros-barra-norte' },
			{ find: 'Deck do Pontal Norte', target: 'barra-norte-molhe-guia-regiao-pioneiros' },
		],
	},
	'barra-norte-molhe-guia-regiao-pioneiros': {
		links: [
			{ find: 'bairro Pioneiros', target: PILLAR },
			{ find: 'Morro do Careca', target: 'morro-do-careca-estaleiro-natureza-pioneiros' },
			{ find: 'qualidade de vida', target: 'pioneiros-e-bom-para-morar' },
			{ find: 'infraestrutura comercial', target: 'infraestrutura-pioneiros-molhe-comercio-servicos' },
			{ find: 'morar nos Pioneiros', target: PILLAR },
		],
	},
	'morro-do-careca-estaleiro-natureza-pioneiros': {
		links: [
			{ find: 'Deck do Pontal Norte', target: 'barra-norte-molhe-guia-regiao-pioneiros' },
			{ find: 'Praia do Buraco', target: 'barra-norte-molhe-guia-regiao-pioneiros' },
			{ find: 'qualidade de vida', target: 'pioneiros-e-bom-para-morar' },
			{ find: 'valorização', target: 'vale-a-pena-investir-pioneiros' },
			{ find: 'morar nos Pioneiros', target: PILLAR },
		],
	},
	'custo-de-vida-pioneiros': {
		links: [
			{ find: 'locação anual', target: 'aluguel-pioneiros-valores-mercado' },
			{ find: 'IPTU', target: 'como-comprar-imovel-pioneiros-barra-norte' },
			{ find: 'custo-benefício', target: 'preco-m2-pioneiros-bairro-em-ascensao' },
			{ find: 'qualidade de vida', target: 'pioneiros-e-bom-para-morar' },
			{ find: 'Avenida do Estado', target: 'infraestrutura-pioneiros-molhe-comercio-servicos' },
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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Pioneiros em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos nos Pioneiros</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta na região.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-pioneiros">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades dos Pioneiros</button>
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

export function rebuildPioneirosArticle(rawHtml, slug) {
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
