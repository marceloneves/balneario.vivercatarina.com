/**
 * Cluster Campeche — planilha de linkagem interna.
 * Corpo: só texto existente (linkify + <a> manual).
 * Leia também / hub: blocos adicionáveis.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyArticleInlineLinks } from '../src/lib/blog-content-links.mjs';

export const PILLAR = 'morar-no-campeche-guia-completo';
export const HUB_HREF = '/bairro/campeche';

export const CAMPECHE_SLUGS = [
	PILLAR,
	'preco-m2-campeche-quanto-custa-comprar',
	'apartamentos-a-venda-campeche-faixas-preco',
	'casas-a-venda-campeche-sub-regioes',
	'aluguel-campeche-valores-temporada',
	'investir-imovel-campeche-roi-valorizacao',
	'como-comprar-imovel-campeche-financiamento',
	'campeche-em-expansao-valorizacao',
	'campeche-e-bom-para-morar',
	'sub-regioes-campeche-guia-completo',
	'campeche-x-bairros-sul-comparativo',
	'infraestrutura-campeche-comercio-mobilidade',
	'seguranca-campeche-como-e-morar',
	'praias-do-campeche-guia-completo',
	'escolas-creches-campeche',
	'saude-campeche-postos-hospitais-clinicas',
	'custo-de-vida-campeche-quanto-custa-morar',
	'inverno-verao-campeche-sazonalidade',
];

/** @type {Record<string, string>} */
export const TITLES = {
	[PILLAR]: 'Morar no Campeche: guia completo do bairro mais promissor do sul de Balneário Camboriú',
	'preco-m2-campeche-quanto-custa-comprar':
		'Preço do m² no Campeche: Quanto Custa Comprar um Imóvel no Bairro',
	'apartamentos-a-venda-campeche-faixas-preco':
		'Apartamentos à Venda no Campeche: Faixas de Preço e O Que Esperar',
	'casas-a-venda-campeche-sub-regioes':
		'Casas à Venda no Campeche: Sub-regiões, Preços e Perfil de Cada Área',
	'aluguel-campeche-valores-temporada':
		'Aluguel no Campeche: Valores, Temporada e Renda com Imóvel',
	'investir-imovel-campeche-roi-valorizacao':
		'Vale a Pena Investir em Imóvel no Campeche? ROI e Valorização',
	'como-comprar-imovel-campeche-financiamento':
		'Como Comprar Imóvel no Campeche: Financiamento, Documentação e Passo a Passo',
	'campeche-em-expansao-valorizacao':
		'Campeche em Expansão: Até Onde Vai a Valorização do Bairro',
	'campeche-e-bom-para-morar':
		'Campeche é Bom para Morar? Prós, Contras e o Que Ninguém Te Conta',
	'sub-regioes-campeche-guia-completo':
		'Sub-regiões do Campeche: Guia Completo de Cada Área do Bairro',
	'campeche-x-bairros-sul-comparativo':
		'Campeche x Bairros do sul de Balneário Camboriú: Comparativo Completo',
	'infraestrutura-campeche-comercio-mobilidade':
		'Infraestrutura do Campeche: Comércio, Mobilidade e o Trânsito da Pequeno Príncipe',
	'seguranca-campeche-como-e-morar':
		'Segurança no Campeche: Como É Morar e O Que Esperar',
	'praias-do-campeche-guia-completo': 'Praias do Campeche: Guia Completo da Região',
	'escolas-creches-campeche': 'Escolas e Creches no Campeche: Guia para Famílias',
	'saude-campeche-postos-hospitais-clinicas':
		'Saúde no Campeche: Postos, Hospitais e Clínicas da Região',
	'custo-de-vida-campeche-quanto-custa-morar':
		'Custo de Vida no Campeche: Quanto Custa Morar no Bairro',
	'inverno-verao-campeche-sazonalidade':
		'Inverno x Verão no Campeche: Sazonalidade, Turismo e Dia a Dia',
};

/** Links de corpo exigidos pela planilha (origem → destinos). */
export const BODY_LINKS = {
	[PILLAR]: CAMPECHE_SLUGS.filter((s) => s !== PILLAR),
	'preco-m2-campeche-quanto-custa-comprar': [
		'apartamentos-a-venda-campeche-faixas-preco',
		'casas-a-venda-campeche-sub-regioes',
		'como-comprar-imovel-campeche-financiamento',
	],
	'apartamentos-a-venda-campeche-faixas-preco': [
		'preco-m2-campeche-quanto-custa-comprar',
		'casas-a-venda-campeche-sub-regioes',
		'aluguel-campeche-valores-temporada',
		'investir-imovel-campeche-roi-valorizacao',
	],
	'casas-a-venda-campeche-sub-regioes': [
		'sub-regioes-campeche-guia-completo',
		'apartamentos-a-venda-campeche-faixas-preco',
		'preco-m2-campeche-quanto-custa-comprar',
		'como-comprar-imovel-campeche-financiamento',
	],
	'aluguel-campeche-valores-temporada': [
		'custo-de-vida-campeche-quanto-custa-morar',
		'investir-imovel-campeche-roi-valorizacao',
		'inverno-verao-campeche-sazonalidade',
		'apartamentos-a-venda-campeche-faixas-preco',
	],
	'investir-imovel-campeche-roi-valorizacao': [
		'aluguel-campeche-valores-temporada',
		'preco-m2-campeche-quanto-custa-comprar',
		'inverno-verao-campeche-sazonalidade',
		'como-comprar-imovel-campeche-financiamento',
		'campeche-em-expansao-valorizacao',
	],
	'como-comprar-imovel-campeche-financiamento': [
		'preco-m2-campeche-quanto-custa-comprar',
		'apartamentos-a-venda-campeche-faixas-preco',
		'casas-a-venda-campeche-sub-regioes',
		'investir-imovel-campeche-roi-valorizacao',
	],
	'campeche-em-expansao-valorizacao': [
		'investir-imovel-campeche-roi-valorizacao',
		'preco-m2-campeche-quanto-custa-comprar',
		'sub-regioes-campeche-guia-completo',
		'infraestrutura-campeche-comercio-mobilidade',
	],
	'campeche-e-bom-para-morar': [
		'campeche-x-bairros-sul-comparativo',
		'custo-de-vida-campeche-quanto-custa-morar',
		'seguranca-campeche-como-e-morar',
		'sub-regioes-campeche-guia-completo',
	],
	'sub-regioes-campeche-guia-completo': [
		'casas-a-venda-campeche-sub-regioes',
		'apartamentos-a-venda-campeche-faixas-preco',
		'campeche-x-bairros-sul-comparativo',
		'seguranca-campeche-como-e-morar',
	],
	'campeche-x-bairros-sul-comparativo': [
		'campeche-e-bom-para-morar',
		'sub-regioes-campeche-guia-completo',
		'custo-de-vida-campeche-quanto-custa-morar',
		'preco-m2-campeche-quanto-custa-comprar',
	],
	'infraestrutura-campeche-comercio-mobilidade': [
		'custo-de-vida-campeche-quanto-custa-morar',
		'inverno-verao-campeche-sazonalidade',
		'campeche-em-expansao-valorizacao',
		'campeche-e-bom-para-morar',
	],
	'seguranca-campeche-como-e-morar': [
		'sub-regioes-campeche-guia-completo',
		'campeche-e-bom-para-morar',
		'casas-a-venda-campeche-sub-regioes',
	],
	'praias-do-campeche-guia-completo': [
		'campeche-e-bom-para-morar',
		'sub-regioes-campeche-guia-completo',
		'inverno-verao-campeche-sazonalidade',
	],
	'escolas-creches-campeche': [
		'custo-de-vida-campeche-quanto-custa-morar',
		'campeche-e-bom-para-morar',
		'saude-campeche-postos-hospitais-clinicas',
	],
	'saude-campeche-postos-hospitais-clinicas': [
		'custo-de-vida-campeche-quanto-custa-morar',
		'escolas-creches-campeche',
		'infraestrutura-campeche-comercio-mobilidade',
	],
	'custo-de-vida-campeche-quanto-custa-morar': [
		'aluguel-campeche-valores-temporada',
		'preco-m2-campeche-quanto-custa-comprar',
		'escolas-creches-campeche',
		'inverno-verao-campeche-sazonalidade',
		'campeche-x-bairros-sul-comparativo',
	],
	'inverno-verao-campeche-sazonalidade': [
		'aluguel-campeche-valores-temporada',
		'investir-imovel-campeche-roi-valorizacao',
		'praias-do-campeche-guia-completo',
		'custo-de-vida-campeche-quanto-custa-morar',
	],
};

/** Leia também: pilar + extras marcados "Corpo + Leia também" na planilha. */
export const LEIA_TAMBEM = {
	[PILLAR]: CAMPECHE_SLUGS.filter((s) => s !== PILLAR),
	'preco-m2-campeche-quanto-custa-comprar': [
		PILLAR,
		'apartamentos-a-venda-campeche-faixas-preco',
	],
	'apartamentos-a-venda-campeche-faixas-preco': [PILLAR],
	'casas-a-venda-campeche-sub-regioes': [PILLAR],
	'aluguel-campeche-valores-temporada': [PILLAR],
	'investir-imovel-campeche-roi-valorizacao': [PILLAR, 'aluguel-campeche-valores-temporada'],
	'como-comprar-imovel-campeche-financiamento': [PILLAR],
	'campeche-em-expansao-valorizacao': [PILLAR, 'investir-imovel-campeche-roi-valorizacao'],
	'campeche-e-bom-para-morar': [PILLAR, 'campeche-x-bairros-sul-comparativo'],
	'sub-regioes-campeche-guia-completo': [PILLAR],
	'campeche-x-bairros-sul-comparativo': [PILLAR, 'campeche-e-bom-para-morar'],
	'infraestrutura-campeche-comercio-mobilidade': [PILLAR],
	'seguranca-campeche-como-e-morar': [PILLAR, 'sub-regioes-campeche-guia-completo'],
	'praias-do-campeche-guia-completo': [PILLAR],
	'escolas-creches-campeche': [PILLAR],
	'saude-campeche-postos-hospitais-clinicas': [PILLAR],
	'custo-de-vida-campeche-quanto-custa-morar': [PILLAR],
	'inverno-verao-campeche-sazonalidade': [PILLAR],
};

/** Todos os artigos do cluster recebem o bloco hub comercial (/bairro/campeche). */
export const HUB_ARTICLES = CAMPECHE_SLUGS;

/** @type {Record<string, string>} */
export const HUB_ANCHORS = {
	[PILLAR]: 'Empreendimentos em destaque no Campeche',
	'preco-m2-campeche-quanto-custa-comprar': 'Veja imóveis no Campeche por faixa de preço',
	'apartamentos-a-venda-campeche-faixas-preco': 'Apartamentos à venda no Campeche',
	'casas-a-venda-campeche-sub-regioes': 'Casas à venda no Campeche',
	'aluguel-campeche-valores-temporada': 'Imóveis para alugar no Campeche',
	'investir-imovel-campeche-roi-valorizacao': 'Lançamentos no Campeche para investir',
	'como-comprar-imovel-campeche-financiamento': 'Veja opções de imóveis no Campeche',
	'campeche-em-expansao-valorizacao': 'Novos empreendimentos no Campeche',
	'sub-regioes-campeche-guia-completo': 'Imóveis no Campeche por sub-região',
	'campeche-x-bairros-sul-comparativo': 'Imóveis no Campeche',
};

export function blogHref(slug) {
	return slug === HUB_HREF ? HUB_HREF : `/blog/${slug}`;
}

export function renderLeiaTambem(slugs) {
	const items = slugs
		.map((s) => `<li><a href="${blogHref(s)}">${TITLES[s]}</a></li>`)
		.join('\n');
	return `<div class="blog-related">
<p class="blog-related__title">Leia também</p>
<ul>
${items}
</ul>
</div>`;
}

export function renderHubBlock(slug) {
	const anchor = HUB_ANCHORS[slug] ?? 'Veja imóveis no Campeche';
	return `<div class="blog-related blog-property-hub">
<p class="blog-related__title">Veja imóveis em lançamento</p>
<p><a href="${HUB_HREF}">${anchor}</a></p>
</div>`;
}

const blogDir = join(process.cwd(), 'src/content/blog');

function stripRelatedBlocks(html) {
	return html.replace(/<div class="blog-related[^"]*">[\s\S]*?<\/div>/g, '');
}

/** @returns {{ missingBody: { from: string, to: string }[], missingHub: string[] }} */
export function auditClusterLinks() {
	const missingBody = [];
	const missingHub = [];

	for (const slug of CAMPECHE_SLUGS) {
		const raw = readFileSync(join(blogDir, `${slug}.html`), 'utf8');
		const html = applyArticleInlineLinks(raw, slug);
		const bodyOnly = stripRelatedBlocks(html);

		const bodyTargets = [...(BODY_LINKS[slug] ?? []), PILLAR].filter((t) => t !== slug);
		for (const target of bodyTargets) {
			const href = blogHref(target);
			if (!bodyOnly.includes(href)) {
				missingBody.push({ from: slug, to: target });
			}
		}

		if (HUB_ARTICLES.has(slug) && !raw.includes(HUB_HREF)) {
			missingHub.push(slug);
		}
	}

	return { missingBody, missingHub };
}

if (process.argv[1]?.endsWith('campeche-cluster-linking.mjs')) {
	const { missingBody, missingHub } = auditClusterLinks();
	console.log('Missing body links:', missingBody.length);
	console.log(JSON.stringify(missingBody, null, 2));
	console.log('Missing hub:', missingHub);
}
