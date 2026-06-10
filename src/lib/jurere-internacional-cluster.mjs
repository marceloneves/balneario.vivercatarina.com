/**
 * Cluster Jurerê Internacional — linkagem interna (pilar + satélites planejados).
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
import {
	JURERE_INTERNACIONAL_CLUSTER_SLUGS,
	JURERE_INTERNACIONAL_PILLAR,
} from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { JURERE_INTERNACIONAL_CLUSTER_SLUGS };

export const PILLAR = JURERE_INTERNACIONAL_PILLAR;
export const HUB_HREF = '/bairro/jurereinternacional';
export const HUB_TITLE = 'Veja imóveis em lançamento em Jurerê Internacional';
export const HUB_NEIGHBORHOOD_NAME = 'Jurerê Internacional';

const HUB_IMAGE_FALLBACK = '/assets/img/gallery/gallery-1-5.webp';

export const SATELLITE_SLUGS = [...JURERE_INTERNACIONAL_CLUSTER_SLUGS].filter(
	(slug) => slug !== PILLAR,
);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

/** @type {Record<string, string>} */
export const LINK_LABELS = Object.fromEntries(
	[...JURERE_INTERNACIONAL_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

/** Todos os artigos do cluster recebem o bloco hub comercial. */
export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export function hubImageUrl() {
	return pickNeighborhoodCoverImage('jurereinternacional') || HUB_IMAGE_FALLBACK;
}

export function blogHref(slug) {
	return `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short ? shortLinkLabel(LINK_LABELS[targetSlug]) : LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

/** Três satélites relacionados por artigo (o pilar entra sempre em 1º no bloco Leia também). */
export const LEIA_TAMBEM = {
	'preco-m2-jurere-internacional-quanto-custa-imovel-luxo': [
		'apartamentos-a-venda-jurere-internacional-faixas-preco',
		'casas-mansoes-a-venda-jurere-internacional-alto-padrao',
		'investir-imovel-jurere-internacional-valorizacao-retorno',
	],
	'apartamentos-a-venda-jurere-internacional-faixas-preco': [
		'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
		'investir-imovel-jurere-internacional-valorizacao-retorno',
		'aluguel-jurere-internacional-temporada-luxo',
	],
	'casas-mansoes-a-venda-jurere-internacional-alto-padrao': [
		'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
		'investir-imovel-jurere-internacional-valorizacao-retorno',
		'apartamentos-a-venda-jurere-internacional-faixas-preco',
	],
	'aluguel-jurere-internacional-temporada-luxo': [
		'investir-imovel-jurere-internacional-valorizacao-retorno',
		'inverno-verao-jurere-sazonalidade',
		'casas-mansoes-a-venda-jurere-internacional-alto-padrao',
	],
	'investir-imovel-jurere-internacional-valorizacao-retorno': [
		'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
		'aluguel-jurere-internacional-temporada-luxo',
		'como-comprar-imovel-jurere-internacional-alto-padrao',
	],
	'como-comprar-imovel-jurere-internacional-alto-padrao': [
		'casas-mansoes-a-venda-jurere-internacional-alto-padrao',
		'apartamentos-a-venda-jurere-internacional-faixas-preco',
		'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
	],
	'jurere-internacional-e-bom-para-morar': [
		'praia-jurere-internacional-guia-completo',
		'seguranca-jurere-internacional-como-e-morar',
		'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping',
	],
	'jurere-internacional-x-jurere-tradicional-comparativo': [
		'investir-imovel-jurere-internacional-valorizacao-retorno',
		'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
		'jurere-internacional-e-bom-para-morar',
	],
	'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping': [
		'seguranca-jurere-internacional-como-e-morar',
		'vida-noturna-beach-clubs-jurere-verao',
		'custo-de-vida-jurere-internacional-quanto-custa-morar',
	],
	'seguranca-jurere-internacional-como-e-morar': [
		'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping',
		'custo-de-vida-jurere-internacional-quanto-custa-morar',
		'jurere-internacional-x-jurere-tradicional-comparativo',
	],
	'praia-jurere-internacional-guia-completo': [
		'jurere-internacional-x-jurere-tradicional-comparativo',
		'inverno-verao-jurere-sazonalidade',
		'vida-noturna-beach-clubs-jurere-verao',
	],
	'vida-noturna-beach-clubs-jurere-verao': [
		'praia-jurere-internacional-guia-completo',
		'inverno-verao-jurere-sazonalidade',
		'custo-de-vida-jurere-internacional-quanto-custa-morar',
	],
	'custo-de-vida-jurere-internacional-quanto-custa-morar': [
		'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
		'aluguel-jurere-internacional-temporada-luxo',
		'vida-noturna-beach-clubs-jurere-verao',
	],
	'inverno-verao-jurere-sazonalidade': [
		'vida-noturna-beach-clubs-jurere-verao',
		'jurere-internacional-e-bom-para-morar',
		'custo-de-vida-jurere-internacional-quanto-custa-morar',
	],
};

export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

/** @type {Record<string, { links: { find: string, target: string }[] }>} */
export const SATELLITE_BODY_PLAN = {
	'preco-m2-jurere-internacional-quanto-custa-imovel-luxo': {
		links: [
			{ find: 'valorização imobiliária', target: PILLAR },
			{ find: 'entrada relativa', target: 'apartamentos-a-venda-jurere-internacional-faixas-preco' },
			{ find: 'essência do bairro', target: 'casas-mansoes-a-venda-jurere-internacional-alto-padrao' },
			{ find: 'Comprar na planta é a estratégia', target: 'como-comprar-imovel-jurere-internacional-alto-padrao' },
		],
	},
	'apartamentos-a-venda-jurere-internacional-faixas-preco': {
		links: [
			{ find: 'o queridinho dos investidores', target: PILLAR },
			{ find: 'O metro quadrado do bairro é um dos mais caros do país', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'renda passiva via aluguel de temporada', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
			{ find: 'rentabilidade no aluguel por temporada', target: 'aluguel-jurere-internacional-temporada-luxo' },
		],
	},
	'casas-mansoes-a-venda-jurere-internacional-alto-padrao': {
		links: [
			{ find: 'cada um com um perfil de comprador', target: PILLAR },
			{ find: 'A distância do mar e o tamanho do terreno são os principais fatores', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'próximas ao Open Shopping', target: 'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping' },
			{ find: 'o ITBI de cerca de 3%', target: 'como-comprar-imovel-jurere-internacional-alto-padrao' },
			{ find: 'acima da média', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
			{ find: 'locação de temporada de alto padrão', target: 'aluguel-jurere-internacional-temporada-luxo' },
		],
	},
	'aluguel-jurere-internacional-temporada-luxo': {
		links: [
			{ find: 'coração do mercado de locação de Jurerê', target: PILLAR },
			{ find: 'Réveillon e Carnaval', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'mercados de locação', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
			{ find: 'O bairro registra o metro quadrado de locação mais caro da cidade', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'Casas e mansões variam de R$ 1.500', target: 'casas-mansoes-a-venda-jurere-internacional-alto-padrao' },
		],
	},
	'investir-imovel-jurere-internacional-valorizacao-retorno': {
		links: [
			{ find: 'combina dois motores', target: PILLAR },
			{ find: 'preço por metro', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'locação de temporada', target: 'aluguel-jurere-internacional-temporada-luxo' },
			{ find: 'Studio para temporada:', target: 'apartamentos-a-venda-jurere-internacional-faixas-preco' },
			{ find: 'Casa ou mansão:', target: 'casas-mansoes-a-venda-jurere-internacional-alto-padrao' },
			{ find: 'Comprar na planta:', target: 'como-comprar-imovel-jurere-internacional-alto-padrao' },
		],
	},
	'como-comprar-imovel-jurere-internacional-alto-padrao': {
		links: [
			{ find: 'verificação documental é a etapa que mais protege', target: PILLAR },
			{ find: 'em casas com ampliações', target: 'casas-mansoes-a-venda-jurere-internacional-alto-padrao' },
			{ find: 'particularidades de cada microrregião do bairro', target: PILLAR },
			{ find: 'viável em parte dos apartamentos do bairro', target: 'apartamentos-a-venda-jurere-internacional-faixas-preco' },
			{ find: 'imposto de transmissão pago à prefeitura', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'pagamento à vista predomina', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
		],
	},
	'jurere-internacional-e-bom-para-morar': {
		links: [
			{ find: 'vantagens do bairro', target: PILLAR },
			{ find: 'águas tranquilas, claras e mornas', target: 'praia-jurere-internacional-guia-completo' },
			{ find: 'sistema de vigilância particular 24 horas', target: 'seguranca-jurere-internacional-como-e-morar' },
			{ find: 'Open Shopping', target: 'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping' },
			{ find: 'O custo de vida em Jurerê é dos mais altos', target: 'custo-de-vida-jurere-internacional-quanto-custa-morar' },
			{ find: 'música eletrônica', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'duas faces muito distintas', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'investimento de valorização', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
		],
	},
	'jurere-internacional-x-jurere-tradicional-comparativo': {
		links: [
			{ find: 'escolher onde morar ou investir com inteligência', target: PILLAR },
			{ find: 'Em Jurerê Internacional, o metro quadrado fica', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'vigilância privada 24 horas', target: 'seguranca-jurere-internacional-como-e-morar' },
			{ find: 'concentrado no Open Shopping', target: 'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping' },
			{ find: 'mesma praia de águas calmas', target: 'praia-jurere-internacional-guia-completo' },
			{ find: 'forte sazonalidade do norte de Balneário Camboriú', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'valorização recorde', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
		],
	},
	'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping': {
		links: [
			{ find: 'O comércio de Jurerê gira em torno do', target: PILLAR },
			{ find: 'inaugurou a Plataforma Lounge', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'moderno sistema de segurança particular', target: 'seguranca-jurere-internacional-como-e-morar' },
			{ find: 'ondas de furtos', target: 'seguranca-jurere-internacional-como-e-morar' },
			{ find: 'já foi alvo de reclamações de moradores', target: 'jurere-internacional-e-bom-para-morar' },
			{ find: 'nova Marina Beira-Mar Norte', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
			{ find: 'Open Shopping', target: 'casas-mansoes-a-venda-jurere-internacional-alto-padrao' },
		],
	},
	'seguranca-jurere-internacional-como-e-morar': {
		links: [
			{ find: 'R$ 190 mensais por casa monitorada', target: 'custo-de-vida-jurere-internacional-quanto-custa-morar' },
			{ find: 'plano diretor próprio do bairro', target: PILLAR },
			{ find: 'sazonalidade da segurança', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'furtos de oportunidade', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'investimento privado pesado', target: 'jurere-internacional-x-jurere-tradicional-comparativo' },
			{ find: 'silenciosa e confiável', target: 'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping' },
			{ find: 'valorização imobiliária sustentada', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
		],
	},
	'praia-jurere-internacional-guia-completo': {
		links: [
			{ find: 'Jurerê quase secreta', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'infraestruturas mais sofisticadas do litoral', target: 'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping' },
			{ find: 'areia contínua', target: 'jurere-internacional-x-jurere-tradicional-comparativo' },
			{ find: 'beach clubs em pleno funcionamento', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'concentração dos beach clubs', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'rodovia SC-401', target: PILLAR },
		],
	},
	'vida-noturna-beach-clubs-jurere-verao': {
		links: [
			{ find: 'beach clubs', target: PILLAR },
			{ find: 'praia de mar calmo', target: 'praia-jurere-internacional-guia-completo' },
			{ find: 'pautam a temporada', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'Winter Play', target: 'inverno-verao-jurere-sazonalidade' },
			{ find: 'réveillon e shows', target: 'aluguel-jurere-internacional-temporada-luxo' },
			{ find: 'Furtos de oportunidade', target: 'seguranca-jurere-internacional-como-e-morar' },
			{ find: 'alinhar o formato ao orçamento', target: 'custo-de-vida-jurere-internacional-quanto-custa-morar' },
		],
	},
	'custo-de-vida-jurere-internacional-quanto-custa-morar': {
		links: [
			{ find: 'item que mais', target: PILLAR },
			{ find: 'metro quadrado', target: 'preco-m2-jurere-internacional-quanto-custa-imovel-luxo' },
			{ find: 'bom potencial de aluguel de temporada', target: 'aluguel-jurere-internacional-temporada-luxo' },
			{ find: 'condomínio, IPTU, segurança e manutenção', target: 'seguranca-jurere-internacional-como-e-morar' },
			{ find: 'praia de mar calmo', target: 'praia-jurere-internacional-guia-completo' },
			{ find: 'P12 e Café de la Musique', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'valorização consistente', target: 'investir-imovel-jurere-internacional-valorizacao-retorno' },
		],
	},
	'inverno-verao-jurere-sazonalidade': {
		links: [
			{ find: 'programação dos beach clubs é diária', target: 'vida-noturna-beach-clubs-jurere-verao' },
			{ find: 'trânsito intenso da SC-401', target: 'praia-jurere-internacional-guia-completo' },
			{ find: 'oportunidade de renda relevante', target: 'aluguel-jurere-internacional-temporada-luxo' },
			{ find: 'tarifas de hospedagem caem drasticamente', target: 'custo-de-vida-jurere-internacional-quanto-custa-morar' },
			{ find: 'Jurerê de casa', target: PILLAR },
			{ find: 'parte de viver', target: 'jurere-internacional-e-bom-para-morar' },
		],
	},
};

/** Pilar: links no corpo conforme satélites forem publicados. */
export const PILLAR_BODY_PLAN = { links: [] };

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
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Jurerê Internacional em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos em Jurerê Internacional</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta no bairro.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}" data-lead-source="blog-hub-jurere-internacional">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades de Jurerê Internacional</button>
<p class="blog-property-hub-lead__feedback" hidden role="status"></p>
</form>
</aside>
</div>`;
}

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	return renderLeiaTambem(SATELLITE_SLUGS);
}

/** Reconstrói o HTML do artigo do cluster com linkagem controlada. */
export function rebuildJurereArticle(rawHtml, slug) {
	let html = stripRelatedBlocks(rawHtml);
	html = stripClusterBridge(html);
	html = stripBodyAnchors(html);

	const { body, closing } = splitClosing(html);
	let content = body;

	if (slug === PILLAR) {
		content = stripHeadingAnchors(content);
		const footer = [renderExploreBlock(), closing].filter(Boolean).join('\n\n');
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
	);
	let linked = applyPlan(content, { links: trimmed });
	linked = stripHeadingAnchors(linked);
	linked = insertHubAfterSecondSubtitle(linked, renderHubBlock(slug));

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
