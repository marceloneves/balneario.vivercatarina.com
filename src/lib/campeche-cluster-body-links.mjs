/**
 * Linkagem interna do cluster Campeche — corpo: 3–6 links descritivos por satélite.
 * Pilar: destino #1 (link de cada um dos 17 satélites).
 *
 * Regra VBC: sem link interno ou externo em h2, h3 ou h4 — usar o texto de conteúdo da seção.
 */

import { CAMPECHE_CLUSTER_SLUGS, CAMPECHE_PILLAR } from './blog-cluster-slugs.mjs';
import { BLOG_POSTS } from './blog-posts.mjs';
import { pickNeighborhoodCoverImage } from './home-page.mjs';
import { splitFromSecondBlogSubtitle } from './content-inline-links.mjs';
import {
	resolveBodyFind,
	shortLinkLabel,
	assertBodyAnchorWords,
	MAX_LINK_ANCHOR_WORDS,
} from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

export { CAMPECHE_CLUSTER_SLUGS };

export const PILLAR = CAMPECHE_PILLAR;
export const HUB_HREF = '/bairro/campeche';

export const SATELLITE_SLUGS = [...CAMPECHE_CLUSTER_SLUGS].filter((slug) => slug !== PILLAR);

const blogTitleBySlug = new Map(BLOG_POSTS.map((post) => [post.slug, post.title]));

/** Título completo do artigo (Leia também, Explore). */
export function articleTitle(slug) {
	return blogTitleBySlug.get(slug) ?? slug;
}

/** @type {Record<string, string>} */
export const LINK_LABELS = Object.fromEntries(
	[...CAMPECHE_CLUSTER_SLUGS].map((slug) => [slug, articleTitle(slug)]),
);

/** Três satélites relacionados por artigo (o pilar entra sempre em 1º no bloco Leia também). */
export const LEIA_TAMBEM = {
	'preco-m2-campeche-quanto-custa-comprar': [
		'apartamentos-a-venda-campeche-faixas-preco',
		'como-comprar-imovel-campeche-financiamento',
		'investir-imovel-campeche-roi-valorizacao',
	],
	'apartamentos-a-venda-campeche-faixas-preco': [
		'preco-m2-campeche-quanto-custa-comprar',
		'investir-imovel-campeche-roi-valorizacao',
		'aluguel-campeche-valores-temporada',
	],
	'casas-a-venda-campeche-sub-regioes': [
		'sub-regioes-campeche-guia-completo',
		'preco-m2-campeche-quanto-custa-comprar',
		'como-comprar-imovel-campeche-financiamento',
	],
	'aluguel-campeche-valores-temporada': [
		'investir-imovel-campeche-roi-valorizacao',
		'inverno-verao-campeche-sazonalidade',
		'custo-de-vida-campeche-quanto-custa-morar',
	],
	'investir-imovel-campeche-roi-valorizacao': [
		'aluguel-campeche-valores-temporada',
		'campeche-em-expansao-valorizacao',
		'preco-m2-campeche-quanto-custa-comprar',
	],
	'como-comprar-imovel-campeche-financiamento': [
		'preco-m2-campeche-quanto-custa-comprar',
		'apartamentos-a-venda-campeche-faixas-preco',
		'investir-imovel-campeche-roi-valorizacao',
	],
	'campeche-em-expansao-valorizacao': [
		'investir-imovel-campeche-roi-valorizacao',
		'preco-m2-campeche-quanto-custa-comprar',
		'sub-regioes-campeche-guia-completo',
	],
	'campeche-e-bom-para-morar': [
		'campeche-x-bairros-sul-comparativo',
		'custo-de-vida-campeche-quanto-custa-morar',
		'seguranca-campeche-como-e-morar',
	],
	'sub-regioes-campeche-guia-completo': [
		'campeche-x-bairros-sul-comparativo',
		'casas-a-venda-campeche-sub-regioes',
		'apartamentos-a-venda-campeche-faixas-preco',
	],
	'campeche-x-bairros-sul-comparativo': [
		'campeche-e-bom-para-morar',
		'sub-regioes-campeche-guia-completo',
		'custo-de-vida-campeche-quanto-custa-morar',
	],
	'infraestrutura-campeche-comercio-mobilidade': [
		'campeche-e-bom-para-morar',
		'inverno-verao-campeche-sazonalidade',
		'sub-regioes-campeche-guia-completo',
	],
	'seguranca-campeche-como-e-morar': [
		'campeche-e-bom-para-morar',
		'sub-regioes-campeche-guia-completo',
		'casas-a-venda-campeche-sub-regioes',
	],
	'praias-do-campeche-guia-completo': [
		'sub-regioes-campeche-guia-completo',
		'campeche-e-bom-para-morar',
		'inverno-verao-campeche-sazonalidade',
	],
	'escolas-creches-campeche': [
		'custo-de-vida-campeche-quanto-custa-morar',
		'campeche-e-bom-para-morar',
		'saude-campeche-postos-hospitais-clinicas',
	],
	'saude-campeche-postos-hospitais-clinicas': [
		'escolas-creches-campeche',
		'infraestrutura-campeche-comercio-mobilidade',
		'sub-regioes-campeche-guia-completo',
	],
	'custo-de-vida-campeche-quanto-custa-morar': [
		'aluguel-campeche-valores-temporada',
		'preco-m2-campeche-quanto-custa-comprar',
		'campeche-e-bom-para-morar',
	],
	'inverno-verao-campeche-sazonalidade': [
		'aluguel-campeche-valores-temporada',
		'investir-imovel-campeche-roi-valorizacao',
		'praias-do-campeche-guia-completo',
	],
};

/** Pilar em 1º + três satélites do mapa `LEIA_TAMBEM`. */
export function leiaTambemSlugsForSatellite(slug) {
	return buildLeiaTambemSlugs(slug, PILLAR, SATELLITE_SLUGS, LEIA_TAMBEM[slug] ?? []);
}

/** Apenas satélites recebem o bloco hub comercial no meio do conteúdo. */
export const HUB_ARTICLES = new Set(SATELLITE_SLUGS);

export const HUB_TITLE = 'Veja imóveis em lançamento no Campeche';
export const HUB_NEIGHBORHOOD_NAME = 'Campeche';
const HUB_IMAGE_FALLBACK = '/assets/img/blog/blog_1_7.webp';

function hubImageUrl() {
	return pickNeighborhoodCoverImage('campeche') || HUB_IMAGE_FALLBACK;
}

/**
 * Por satélite: trecho único no HTML → slug de destino (3–6 no corpo, incluindo 1 link natural ao pilar).
 * @type {Record<string, { links: { find: string, target: string }[] }>}
 */
export const SATELLITE_BODY_PLAN = {
	'preco-m2-campeche-quanto-custa-comprar': {
		links: [
			{ find: 'faixa mais procurada por quem vai morar', target: PILLAR },
			{ find: 'passível de financiamento', target: 'como-comprar-imovel-campeche-financiamento' },
			{ find: 'studios e apartamentos de 1 e 2 dormitórios', target: 'apartamentos-a-venda-campeche-faixas-preco' },
			{ find: 'separar as sub-regiões', target: 'sub-regioes-campeche-guia-completo' },
		],
	},
	'apartamentos-a-venda-campeche-faixas-preco': {
		links: [
			{ find: 'faixa mais procurada por quem vai morar', target: PILLAR },
			{ find: 'metro quadrado', target: 'preco-m2-campeche-quanto-custa-comprar' },
			{ find: 'aluguel de temporada', target: 'aluguel-campeche-valores-temporada' },
			{ find: 'studios e compactos para investir', target: 'investir-imovel-campeche-roi-valorizacao' },
			{ find: 'renda de aluguel', target: 'investir-imovel-campeche-roi-valorizacao' },
		],
	},
	'casas-a-venda-campeche-sub-regioes': {
		links: [
			{ find: 'decisão de localização', target: PILLAR },
			{ find: 'sub-regiões vizinhas', target: 'sub-regioes-campeche-guia-completo' },
			{ find: 'mercado de casas', target: 'apartamentos-a-venda-campeche-faixas-preco' },
			{ find: 'equilibra localização e variedade de preço', target: 'preco-m2-campeche-quanto-custa-comprar' },
			{ find: 'financiamento bancário', target: 'como-comprar-imovel-campeche-financiamento' },
		],
	},
	'aluguel-campeche-valores-temporada': {
		links: [
			{ find: 'Seja para morar ou para', target: PILLAR },
			{ find: 'alta temporada', target: 'inverno-verao-campeche-sazonalidade' },
			{ find: 'investir em renda', target: 'investir-imovel-campeche-roi-valorizacao' },
			{ find: 'Apartamentos de 2 quartos', target: 'apartamentos-a-venda-campeche-faixas-preco' },
			{ find: 'custo real mensal inclui', target: 'custo-de-vida-campeche-quanto-custa-morar' },
		],
	},
	'investir-imovel-campeche-roi-valorizacao': {
		links: [
			{ find: 'retorno total', target: PILLAR },
			{ find: 'renda de temporada', target: 'aluguel-campeche-valores-temporada' },
			{ find: 'valorização do metro quadrado', target: 'preco-m2-campeche-quanto-custa-comprar' },
			{ find: 'locação de temporada', target: 'inverno-verao-campeche-sazonalidade' },
			{ find: 'financiamento de R$ 400 mil', target: 'como-comprar-imovel-campeche-financiamento' },
			{ find: 'valorização consistente', target: 'campeche-em-expansao-valorizacao' },
		],
	},
	'como-comprar-imovel-campeche-financiamento': {
		links: [
			{ find: 'compras no Campeche', target: PILLAR },
			{ find: 'valor do imóvel', target: 'preco-m2-campeche-quanto-custa-comprar' },
			{ find: 'tipo de imóvel', target: 'apartamentos-a-venda-campeche-faixas-preco' },
			{ find: 'casas do bairro', target: 'casas-a-venda-campeche-sub-regioes' },
			{ find: 'comprovação de renda', target: 'investir-imovel-campeche-roi-valorizacao' },
		],
	},
	'campeche-em-expansao-valorizacao': {
		links: [
			{ find: 'reputação do Campeche', target: PILLAR },
			{ find: 'puxado pela oferta de studios voltados a investidores', target: 'investir-imovel-campeche-roi-valorizacao' },
			{ find: 'Preço do m²', target: 'preco-m2-campeche-quanto-custa-comprar' },
			{ find: 'Campeche Norte / Novo Campeche', target: 'sub-regioes-campeche-guia-completo' },
			{ find: 'infraestrutura completa', target: 'infraestrutura-campeche-comercio-mobilidade' },
		],
	},
	'campeche-e-bom-para-morar': {
		links: [
			{ find: 'vantagens do bairro', target: PILLAR },
			{ find: 'melhores bairros para', target: 'campeche-x-bairros-sul-comparativo' },
			{ find: 'elevou o custo de vida', target: 'custo-de-vida-campeche-quanto-custa-morar' },
			{ find: 'sensação de segurança', target: 'seguranca-campeche-como-e-morar' },
			{ find: 'escolher com cuidado a sub-região', target: 'sub-regioes-campeche-guia-completo' },
		],
	},
	'sub-regioes-campeche-guia-completo': {
		links: [
			{ find: 'coração do bairro', target: PILLAR },
			{ find: 'lançamentos compactos para temporada', target: 'apartamentos-a-venda-campeche-faixas-preco' },
			{ find: 'condomínios fechados de luxo', target: 'casas-a-venda-campeche-sub-regioes' },
			{ find: 'vida no sul de Balneário Camboriú', target: 'campeche-x-bairros-sul-comparativo' },
			{ find: 'mais tranquila e distante da agitação', target: 'seguranca-campeche-como-e-morar' },
		],
	},
	'campeche-x-bairros-sul-comparativo': {
		links: [
			{ find: 'confronto entre Campeche', target: PILLAR },
			{ find: 'O Campeche vence em comércio, vida noturna, oferta de imóveis e potencial de valorização', target: 'campeche-e-bom-para-morar' },
			{ find: 'Rio Tavares', target: 'sub-regioes-campeche-guia-completo' },
			{ find: 'custo de vida', target: 'custo-de-vida-campeche-quanto-custa-morar' },
			{ find: 'O preço acompanha o nível de desenvolvimento de cada bairro', target: 'preco-m2-campeche-quanto-custa-comprar' },
		],
	},
	'infraestrutura-campeche-comercio-mobilidade': {
		links: [
			{ find: 'infraestrutura comercial', target: PILLAR },
			{ find: 'alta temporada', target: 'inverno-verao-campeche-sazonalidade' },
			{ find: 'crescimento do comércio', target: 'campeche-em-expansao-valorizacao' },
			{ find: 'qualidade de vida', target: 'campeche-e-bom-para-morar' },
			{ find: 'No verão, o fluxo de turistas multiplica o trânsito', target: 'inverno-verao-campeche-sazonalidade' },
		],
	},
	'seguranca-campeche-como-e-morar': {
		links: [
			{ find: 'Morar no Campeche é viver em um dos bairros', target: PILLAR },
			{ find: 'sub-regiões predominantemente residenciais', target: 'sub-regioes-campeche-guia-completo' },
			{ find: 'condomínios fechados', target: 'casas-a-venda-campeche-sub-regioes' },
		],
	},
	'praias-do-campeche-guia-completo': {
		links: [
			{ find: 'Morar no Campeche é ter, num raio de poucos quilômetros', target: PILLAR },
			{ find: 'Morro das Pedras', target: 'sub-regioes-campeche-guia-completo' },
			{ find: 'alta temporada', target: 'inverno-verao-campeche-sazonalidade' },
		],
	},
	'escolas-creches-campeche': {
		links: [
			{ find: 'vantagens de morar no Campeche', target: PILLAR },
			{ find: 'opções mais acessíveis', target: 'custo-de-vida-campeche-quanto-custa-morar' },
			{ find: 'famílias jovens', target: 'campeche-e-bom-para-morar' },
			{ find: 'famílias das sub-regiões próximas', target: 'sub-regioes-campeche-guia-completo' },
		],
	},
	'saude-campeche-postos-hospitais-clinicas': {
		links: [
			{ find: 'jornada de cuidado dos moradores', target: PILLAR },
			{ find: 'sub-regiões e bairros vizinhos', target: 'sub-regioes-campeche-guia-completo' },
			{ find: 'Avenida Pequeno Príncipe', target: 'infraestrutura-campeche-comercio-mobilidade' },
			{ find: 'famílias da região', target: 'escolas-creches-campeche' },
		],
	},
	'custo-de-vida-campeche-quanto-custa-morar': {
		links: [
			{ find: 'Morar no Campeche é pagar um prêmio', target: PILLAR },
			{ find: 'Aluguel + condomínio', target: 'aluguel-campeche-valores-temporada' },
			{ find: 'metro quadrado entre os mais caros', target: 'preco-m2-campeche-quanto-custa-comprar' },
			{ find: 'educação particular', target: 'escolas-creches-campeche' },
			{ find: 'aluguel de temporada no verão', target: 'inverno-verao-campeche-sazonalidade' },
		],
	},
	'inverno-verao-campeche-sazonalidade': {
		links: [
			{ find: 'Morar no Campeche é aceitar viver em dois bairros', target: PILLAR },
			{ find: 'aluguel de temporada', target: 'aluguel-campeche-valores-temporada' },
			{ find: 'renda de temporada', target: 'investir-imovel-campeche-roi-valorizacao' },
			{ find: 'perto da praia', target: 'praias-do-campeche-guia-completo' },
		],
	},
};

/** Pilar: até 6 links descritivos no corpo (satélites-chave). */
export const PILLAR_BODY_PLAN = {
	links: [
		{ find: 'consulte o guia de Preço do m² no Campeche', target: 'preco-m2-campeche-quanto-custa-comprar' },
		{ find: 'Nos Apartamentos à venda no Campeche', target: 'apartamentos-a-venda-campeche-faixas-preco' },
		{ find: 'casas concentram-se', target: 'casas-a-venda-campeche-sub-regioes' },
		{ find: 'O Aluguel no Campeche está', target: 'aluguel-campeche-valores-temporada' },
		{ find: 'Para o investidor', target: 'investir-imovel-campeche-roi-valorizacao' },
		{ find: 'O custo de vida no Campeche é considerado', target: 'custo-de-vida-campeche-quanto-custa-morar' },
	],
};

export function blogHref(slug) {
	return slug === HUB_HREF ? HUB_HREF : `/blog/${slug}`;
}

export function linkHtml(targetSlug, { short = false } = {}) {
	const label = short
		? shortLinkLabel(LINK_LABELS[targetSlug])
		: LINK_LABELS[targetSlug];
	return `<a href="${blogHref(targetSlug)}">${label}</a>`;
}

function stripPropertyHubRows(html) {
	const marker = 'blog-property-hub-row';
	let result = html;
	let classIdx = result.indexOf(marker);

	while (classIdx !== -1) {
		const start = result.lastIndexOf('<div', classIdx);
		if (start === -1) {
			break;
		}

		const openEnd = result.indexOf('>', start);
		if (openEnd === -1 || openEnd < classIdx) {
			classIdx = result.indexOf(marker, classIdx + marker.length);
			continue;
		}

		let pos = openEnd + 1;
		let depth = 1;

		while (pos < result.length && depth > 0) {
			const nextDiv = result.indexOf('<div', pos);
			const nextClose = result.indexOf('</div>', pos);

			if (nextClose === -1) {
				break;
			}

			if (nextDiv !== -1 && nextDiv < nextClose) {
				depth += 1;
				pos = nextDiv + 4;
			} else {
				depth -= 1;
				pos = nextClose + 6;
			}
		}

		result = `${result.slice(0, start).trimEnd()}\n\n${result.slice(pos).trimStart()}`.replace(/^\n+/, '');
		classIdx = result.indexOf(marker);
	}

	return result;
}

/** Restos de hub removidos parcialmente pelo regex antigo de blog-related. */
function stripOrphanHubLeadFragments(html) {
	return html
		.replace(/<aside class="blog-property-hub-lead">[\s\S]*?<\/aside>\s*<\/div>\s*/g, '')
		.replace(/<aside class="blog-property-hub-lead">[\s\S]*?<\/aside>\s*/g, '');
}

export function stripRelatedBlocks(html) {
	return stripOrphanHubLeadFragments(stripPropertyHubRows(html)).replace(
		/<div class="blog-related[^"]*">[\s\S]*?<\/div>\s*/g,
		'',
	);
}

export function stripClusterBridge(html) {
	return html.replace(/<p class="blog-cluster-bridge">[\s\S]*?<\/p>\s*/g, '');
}

/** Remove todas as âncoras do corpo, preservando o texto interno. */
export function stripBodyAnchors(html) {
	let result = html;

	for (let pass = 0; pass < 8; pass += 1) {
		const next = result.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
		if (next === result) {
			break;
		}
		result = next;
	}

	return result;
}

const H234_BLOCK = /<(h[2-4])\b[^>]*>[\s\S]*?<\/\1>/gi;

/** Remove âncoras dentro de h2, h3 e h4 (regra VBC). */
export function stripHeadingAnchors(html) {
	return html.replace(/<(h[2-4])\b([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
		const plainInner = stripBodyAnchors(inner);
		return `<${tag}${attrs}>${plainInner}</${tag}>`;
	});
}

function forEachLinkableSegment(html, fn) {
	const segments = [];
	let lastIndex = 0;
	const re = new RegExp(H234_BLOCK.source, 'gi');
	let match = re.exec(html);

	while (match) {
		if (match.index > lastIndex) {
			segments.push({ linkable: true, html: html.slice(lastIndex, match.index) });
		}
		segments.push({ linkable: false, html: match[0] });
		lastIndex = match.index + match[0].length;
		match = re.exec(html);
	}

	if (lastIndex < html.length) {
		segments.push({ linkable: true, html: html.slice(lastIndex) });
	}

	if (!segments.length) {
		return fn(html);
	}

	return segments.map((seg) => (seg.linkable ? fn(seg.html) : seg.html)).join('');
}

function wrapLinkHtml(find, targetSlug) {
	return `<a href="${blogHref(targetSlug)}">${find}</a>`;
}

function replaceFirst(html, find, replacement) {
	if (!find || !html.includes(find) || html.includes(replacement)) {
		return html;
	}

	return html.replace(find, replacement);
}

/** Envolve trecho existente com <a>; âncora ≤3 palavras; ignora h2–h4; só a partir do 2º subtítulo. */
export function applyPlan(html, plan) {
	const { before, linkable } = splitFromSecondBlogSubtitle(html);
	if (!linkable) {
		return before;
	}

	const fullHtml = before + linkable;
	const applied = new Set();

	const linked = forEachLinkableSegment(linkable, (linkableHtml) => {
		let output = linkableHtml;

		for (const { find, target, tail = '' } of plan.links) {
			if (!find || applied.has(target)) {
				continue;
			}

			let resolvedFind;
			try {
				resolvedFind = resolveBodyFind(fullHtml, find);
			} catch {
				continue;
			}

			if (!output.includes(resolvedFind)) {
				continue;
			}

			assertBodyAnchorWords(resolvedFind);

			const anchor = wrapLinkHtml(resolvedFind, target) + tail;
			if (output.includes(anchor)) {
				applied.add(target);
				continue;
			}

			output = replaceFirst(output, resolvedFind, anchor);
			applied.add(target);
		}

		return output;
	});

	return before + linked;
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

export function renderHubBlock(slug) {
	const formId = `blog-hub-lead-${slug}`;
	const imageUrl = hubImageUrl();
	return `<div class="blog-related blog-property-hub-row">
<div class="blog-property-hub-row__visual">
<p class="blog-related__title"><a href="${HUB_HREF}">${HUB_TITLE}</a></p>
<p class="blog-property-hub__media"><a href="${HUB_HREF}"><img src="${imageUrl}" alt="Vista do bairro Campeche em Balneário Camboriú para imóveis na planta" loading="lazy" width="512" height="288"></a></p>
</div>
<aside class="blog-property-hub-lead">
<p class="blog-property-hub-lead__title">Receba lançamentos no Campeche</p>
<p class="blog-property-hub-lead__intro">Deixe seu contato e receba oportunidades de imóveis na planta no bairro.</p>
<form class="blog-hub-lead-form" id="${formId}" data-neighborhood-name="${HUB_NEIGHBORHOOD_NAME}">
<label for="${formId}-name">Nome</label>
<input id="${formId}-name" name="name" type="text" placeholder="Seu nome" required>
<label for="${formId}-email">E-mail</label>
<input id="${formId}-email" name="email" type="email" placeholder="Seu e-mail" required>
<button type="submit" class="th-btn blog-property-hub-lead__submit radius w-100">Receber Novidades do Campeche</button>
<p class="blog-property-hub-lead__feedback" hidden role="status"></p>
</form>
</aside>
</div>`;
}

/** Rodapé do pilar: todos os satélites, título "Leia também". */
export function renderExploreBlock() {
	return renderLeiaTambem(SATELLITE_SLUGS);
}

export function splitClosing(html) {
	const closingIdx = html.indexOf('<div class="blog-article-closing">');
	if (closingIdx === -1) {
		return { body: html.trim(), closing: '' };
	}

	return {
		body: html.slice(0, closingIdx).trim(),
		closing: html.slice(closingIdx).trim(),
	};
}

const H3_SUBTITLE_OPEN = /<h3 class="blog-inner-title h4">/gi;

/** Insere o hub comercial ao fim da 2ª seção (antes do 3º h3 `blog-inner-title`). */
export function insertHubAfterSecondSubtitle(html, hubHtml) {
	if (!hubHtml?.trim()) {
		return html;
	}

	const headings = [...html.matchAll(H3_SUBTITLE_OPEN)];
	if (headings.length < 2) {
		return `${html.trim()}\n\n${hubHtml.trim()}`;
	}

	const insertAt =
		headings.length >= 3 ? headings[2].index : html.length;

	const before = html.slice(0, insertAt).trimEnd();
	const after = html.slice(insertAt).trimStart();

	return after ? `${before}\n\n${hubHtml.trim()}\n\n${after}` : `${before}\n\n${hubHtml.trim()}`;
}

/** Reconstrói o HTML do artigo do cluster com linkagem controlada. */
export function rebuildCampecheArticle(rawHtml, slug) {
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
	const footer = [renderLeiaTambem(leiaSlugs)].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}

/** Conta links internos do cluster no corpo (sem blocos blog-related). */
export function countBodyClusterLinks(html) {
	const body = stripRelatedBlocks(html);
	return [...body.matchAll(/<a href="\/blog\/[^"]+"/g)].length;
}

/** @param {string} html @param {string} slug */
export function applyCampecheClusterBodyLinks(html, slug) {
	if (!CAMPECHE_CLUSTER_SLUGS.has(slug)) {
		return html;
	}

	return html;
}
