import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { linkifyHtmlContent } from './content-inline-links.mjs';
import { buildGlossaryLinkRules } from './glossary-content-links.mjs';
import {
	countAnchorWords,
	isWeakBodyAnchor,
	shortLinkLabel,
	MAX_LINK_ANCHOR_WORDS,
} from './cluster-link-anchor.mjs';

const NEIGHBORHOODS = JSON.parse(
	readFileSync(join(process.cwd(), 'src/data/balneario-camboriu-neighborhoods.json'), 'utf8'),
);

/** @typedef {{ text: string, href: string, slug?: string, caseSensitive?: boolean }} LinkRule */

/** Frases longas → âncora de até 3 palavras (linkify automático). */
const PHRASE_RULE_SHORT = {
	'Vale a pena investir em imóvel no Campeche': 'investir no Campeche',
	'Morar no Continente x em Balneário Camboriú': 'Morar no Continente',
	'Quanto Custa Morar em Balneário Camboriú': 'Quanto Custa Morar',
	'quanto custa morar em Balneário Camboriú': 'quanto custa morar',
	'Inverno x verão no Campeche': 'Inverno x verão',
	'custo de vida no Campeche': 'custo de vida',
	'Quanto custa morar no Campeche': 'Morar no Campeche',
	'Campeche é bom para morar': 'Campeche é bom',
	'Centro de Saúde do Campeche': 'Centro de Saúde',
	'escolas e creches no Campeche': 'escolas e creches',
	'preço do m² no Campeche': 'preço do m²',
	'Preço do m² no Campeche': 'Preço do m²',
	'casas à venda no Campeche': 'casas à venda',
	'Casas à venda no Campeche': 'Casas à venda',
	'apartamentos à venda no Campeche': 'apartamentos à venda',
	'Apartamentos à venda no Campeche': 'Apartamentos à venda',
	'bairros do sul de Balneário Camboriú': 'sul de Balneário Camboriú',
	'checklist com 15 itens': 'checklist com 15',
	'guia completo do Campeche': 'guia completo',
	'comprar imóvel no Campeche': 'comprar imóvel',
	'Comprar imóvel no Campeche': 'Comprar imóvel',
	'Os 10 Melhores Bairros': 'Melhores Bairros',
	'melhores bairros para morar': 'melhores bairros',
	'metro quadrado no Campeche': 'metro quadrado',
	'condomínios de alto padrão': 'condomínios fechados',
};

/** @param {LinkRule[]} rules */
function normalizeBlogPhraseRules(rules) {
	const seen = new Set();
	const out = [];

	for (const rule of rules) {
		let text = PHRASE_RULE_SHORT[rule.text] ?? rule.text;
		if (countAnchorWords(text) > MAX_LINK_ANCHOR_WORDS) {
			text = shortLinkLabel(text);
		}
		if (countAnchorWords(text) > MAX_LINK_ANCHOR_WORDS || isWeakBodyAnchor(text)) {
			continue;
		}

		const key = `${rule.href}|${text.toLowerCase()}`;
		if (seen.has(key)) {
			continue;
		}
		seen.add(key);
		out.push({ ...rule, text });
	}

	return out;
}

/** @type {LinkRule[]} */
const BLOG_PHRASE_RULES = normalizeBlogPhraseRules([
	{
		text: 'Cachoeira do Bom Jesus',
		href: '/blog/morar-na-cachoeira-do-bom-jesus-guia-completo',
		slug: 'morar-na-cachoeira-do-bom-jesus-guia-completo',
	},
	{
		text: 'cachoeira do bom jesus',
		href: '/blog/morar-na-cachoeira-do-bom-jesus-guia-completo',
		slug: 'morar-na-cachoeira-do-bom-jesus-guia-completo',
	},
	{
		text: 'Morar na Cachoeira',
		href: '/blog/morar-na-cachoeira-do-bom-jesus-guia-completo',
		slug: 'morar-na-cachoeira-do-bom-jesus-guia-completo',
	},
	{
		text: 'trabalho remoto',
		href: '/blog/balneario-camboriu-trabalho-remoto-guia-nomade-digital',
		slug: 'balneario-camboriu-trabalho-remoto-guia-nomade-digital',
	},
	{
		text: 'Trabalho Remoto',
		href: '/blog/balneario-camboriu-trabalho-remoto-guia-nomade-digital',
		slug: 'balneario-camboriu-trabalho-remoto-guia-nomade-digital',
	},
	{
		text: 'nômade digital',
		href: '/blog/balneario-camboriu-trabalho-remoto-guia-nomade-digital',
		slug: 'balneario-camboriu-trabalho-remoto-guia-nomade-digital',
	},
	{
		text: 'Nômade Digital',
		href: '/blog/balneario-camboriu-trabalho-remoto-guia-nomade-digital',
		slug: 'balneario-camboriu-trabalho-remoto-guia-nomade-digital',
	},
	{
		text: 'Apartamento ou Casa',
		href: '/blog/apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha',
		slug: 'apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha',
	},
	{
		text: 'apartamento ou casa',
		href: '/blog/apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha',
		slug: 'apartamento-ou-casa-balneario-camboriu-qual-melhor-escolha',
	},
	{
		text: 'construir uma casa em Balneário Camboriú',
		href: '/blog/quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
		slug: 'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
	},
	{
		text: 'Custo Unitário Básico',
		href: '/blog/quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
		slug: 'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
	},
	{
		text: 'custo de construção',
		href: '/blog/quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
		slug: 'quanto-custa-construir-casa-balneario-camboriu-terreno-obra-documentacao',
	},
	{
		text: 'Mudar para Balneário Camboriú',
		href: '/blog/mudar-para-balneario-camboriu-guia-vindo-outro-estado',
		slug: 'mudar-para-balneario-camboriu-guia-vindo-outro-estado',
	},
	{
		text: 'mudar para Balneário Camboriú',
		href: '/blog/mudar-para-balneario-camboriu-guia-vindo-outro-estado',
		slug: 'mudar-para-balneario-camboriu-guia-vindo-outro-estado',
	},
	{
		text: 'mudança interestadual',
		href: '/blog/mudar-para-balneario-camboriu-guia-vindo-outro-estado',
		slug: 'mudar-para-balneario-camboriu-guia-vindo-outro-estado',
	},
	{
		text: 'Morar em Balneário Camboriú',
		href: '/blog/morar-em-balneario-camboriu-guia-completo',
		slug: 'morar-em-balneario-camboriu-guia-completo',
	},
	{
		text: 'guia completo de Balneário Camboriú',
		href: '/blog/morar-em-balneario-camboriu-guia-completo',
		slug: 'morar-em-balneario-camboriu-guia-completo',
	},
	{
		text: 'Balneário Camboriú',
		href: '/blog/morar-em-balneario-camboriu-guia-completo',
		slug: 'morar-em-balneario-camboriu-guia-completo',
	},
	{
		text: 'Documentação para Comprar Imóvel',
		href: '/blog/documentacao-comprar-imovel-santa-catarina-checklist',
		slug: 'documentacao-comprar-imovel-santa-catarina-checklist',
	},
	{
		text: 'certidão de ônus reais',
		href: '/blog/documentacao-comprar-imovel-santa-catarina-checklist',
		slug: 'documentacao-comprar-imovel-santa-catarina-checklist',
	},
	{
		text: 'contrato de gaveta',
		href: '/blog/documentacao-comprar-imovel-santa-catarina-checklist',
		slug: 'documentacao-comprar-imovel-santa-catarina-checklist',
	},
	{
		text: 'Como Comprar Imóvel em Balneário Camboriú',
		href: '/blog/como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		slug: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	},
	{
		text: 'comprar imóvel em Balneário Camboriú',
		href: '/blog/como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		slug: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	},
	{
		text: 'pré-aprovação de crédito',
		href: '/blog/como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		slug: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	},
	{
		text: 'ITBI e Custos de Cartório',
		href: '/blog/itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		slug: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
	},
	{
		text: 'custos de transação',
		href: '/blog/itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		slug: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
	},
	{
		text: 'custos de cartório',
		href: '/blog/itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		slug: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
	},
	{
		text: 'ITBI em Balneário Camboriú',
		href: '/blog/itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		slug: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
	},
	{
		text: 'Financiamento Imobiliário em Balneário Camboriú',
		href: '/blog/financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
		slug: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	},
	{
		text: 'financiamento imobiliário em Balneário Camboriú',
		href: '/blog/financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
		slug: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	},
	{
		text: 'taxa pró-cotista',
		href: '/blog/financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
		slug: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	},
	{
		text: 'teto do SFH',
		href: '/blog/financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
		slug: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	},
	{
		text: 'Checklist Definitivo',
		href: '/blog/checklist-avaliar-imovel-em-balneario-camboriu',
		slug: 'checklist-avaliar-imovel-em-balneario-camboriu',
	},
	{
		text: 'checklist com 15 itens',
		href: '/blog/checklist-avaliar-imovel-em-balneario-camboriu',
		slug: 'checklist-avaliar-imovel-em-balneario-camboriu',
	},
	{
		text: 'Quanto Custa Morar em Balneário Camboriú',
		href: '/blog/quanto-custa-morar-em-balneario-camboriu',
		slug: 'quanto-custa-morar-em-balneario-camboriu',
	},
	{
		text: 'quanto custa morar em Balneário Camboriú',
		href: '/blog/quanto-custa-morar-em-balneario-camboriu',
		slug: 'quanto-custa-morar-em-balneario-camboriu',
	},
	{
		text: 'Inverno x verão no Campeche',
		href: '/blog/inverno-verao-campeche-sazonalidade',
		slug: 'inverno-verao-campeche-sazonalidade',
	},
	{
		text: 'sazonalidade no Campeche',
		href: '/blog/inverno-verao-campeche-sazonalidade',
		slug: 'inverno-verao-campeche-sazonalidade',
	},
	{
		text: 'custo de vida no Campeche',
		href: '/blog/custo-de-vida-campeche-quanto-custa-morar',
		slug: 'custo-de-vida-campeche-quanto-custa-morar',
	},
	{
		text: 'Quanto custa morar no Campeche',
		href: '/blog/custo-de-vida-campeche-quanto-custa-morar',
		slug: 'custo-de-vida-campeche-quanto-custa-morar',
	},
	{
		text: 'Morar no Continente x em Balneário Camboriú',
		href: '/blog/morar-centro-x-praias-em-balneario-camboriu',
		slug: 'morar-centro-x-praias-em-balneario-camboriu',
	},
	{
		text: 'continente e em Balneário Camboriú',
		href: '/blog/morar-centro-x-praias-em-balneario-camboriu',
		slug: 'morar-centro-x-praias-em-balneario-camboriu',
	},
	{
		text: 'Morar Perto da UFSC',
		href: '/blog/morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
		slug: 'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
	},
	{
		text: 'região universitária',
		href: '/blog/morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
		slug: 'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
	},
	{
		text: 'UFSC',
		href: '/blog/morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
		slug: 'morar-perto-da-ufsc-trindade-carvoeira-corrego-grande',
	},
	{
		text: 'Campeche é bom para morar',
		href: '/blog/campeche-e-bom-para-morar',
		slug: 'campeche-e-bom-para-morar',
	},
	{
		text: 'saúde no Campeche',
		href: '/blog/saude-campeche-postos-hospitais-clinicas',
		slug: 'saude-campeche-postos-hospitais-clinicas',
	},
	{
		text: 'Centro de Saúde do Campeche',
		href: '/blog/saude-campeche-postos-hospitais-clinicas',
		slug: 'saude-campeche-postos-hospitais-clinicas',
	},
	{
		text: 'UPA Sul',
		href: '/blog/saude-campeche-postos-hospitais-clinicas',
		slug: 'saude-campeche-postos-hospitais-clinicas',
	},
	{
		text: 'Colégio do Campeche',
		href: '/blog/escolas-creches-campeche',
		slug: 'escolas-creches-campeche',
	},
	{
		text: 'escolas e creches no Campeche',
		href: '/blog/escolas-creches-campeche',
		slug: 'escolas-creches-campeche',
	},
	{
		text: 'Praias do Campeche',
		href: '/blog/praias-do-campeche-guia-completo',
		slug: 'praias-do-campeche-guia-completo',
	},
	{
		text: 'Ilha do Campeche',
		href: '/blog/praias-do-campeche-guia-completo',
		slug: 'praias-do-campeche-guia-completo',
	},
	{
		text: 'Praia do Campeche',
		href: '/blog/praias-do-campeche-guia-completo',
		slug: 'praias-do-campeche-guia-completo',
	},
	{
		text: 'infraestrutura do Campeche',
		href: '/blog/infraestrutura-campeche-comercio-mobilidade',
		slug: 'infraestrutura-campeche-comercio-mobilidade',
	},
	{
		text: 'Infraestrutura do Campeche',
		href: '/blog/infraestrutura-campeche-comercio-mobilidade',
		slug: 'infraestrutura-campeche-comercio-mobilidade',
	},
	{
		text: 'Avenida Pequeno Príncipe',
		href: '/blog/infraestrutura-campeche-comercio-mobilidade',
		slug: 'infraestrutura-campeche-comercio-mobilidade',
	},
	{
		text: 'Morar no Campeche',
		href: '/blog/morar-no-campeche-guia-completo',
		slug: 'morar-no-campeche-guia-completo',
	},
	{
		text: 'guia completo do Campeche',
		href: '/blog/morar-no-campeche-guia-completo',
		slug: 'morar-no-campeche-guia-completo',
	},
	{
		text: 'preço do m² no Campeche',
		href: '/blog/preco-m2-campeche-quanto-custa-comprar',
		slug: 'preco-m2-campeche-quanto-custa-comprar',
	},
	{
		text: 'Preço do m² no Campeche',
		href: '/blog/preco-m2-campeche-quanto-custa-comprar',
		slug: 'preco-m2-campeche-quanto-custa-comprar',
	},
	{
		text: 'Campeche em Expansão',
		href: '/blog/campeche-em-expansao-valorizacao',
		slug: 'campeche-em-expansao-valorizacao',
	},
	{
		text: 'valorização do Campeche',
		href: '/blog/campeche-em-expansao-valorizacao',
		slug: 'campeche-em-expansao-valorizacao',
	},
	{
		text: 'Vale a pena investir em imóvel no Campeche',
		href: '/blog/investir-imovel-campeche-roi-valorizacao',
		slug: 'investir-imovel-campeche-roi-valorizacao',
	},
	{
		text: 'investir no Campeche',
		href: '/blog/investir-imovel-campeche-roi-valorizacao',
		slug: 'investir-imovel-campeche-roi-valorizacao',
	},
	{
		text: 'casas à venda no Campeche',
		href: '/blog/casas-a-venda-campeche-sub-regioes',
		slug: 'casas-a-venda-campeche-sub-regioes',
	},
	{
		text: 'Casas à venda no Campeche',
		href: '/blog/casas-a-venda-campeche-sub-regioes',
		slug: 'casas-a-venda-campeche-sub-regioes',
	},
	{
		text: 'aluguel no Campeche',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'Aluguel no Campeche',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'comprar imóvel no Campeche',
		href: '/blog/como-comprar-imovel-campeche-financiamento',
		slug: 'como-comprar-imovel-campeche-financiamento',
	},
	{
		text: 'Comprar imóvel no Campeche',
		href: '/blog/como-comprar-imovel-campeche-financiamento',
		slug: 'como-comprar-imovel-campeche-financiamento',
	},
	{
		text: 'apartamentos à venda no Campeche',
		href: '/blog/apartamentos-a-venda-campeche-faixas-preco',
		slug: 'apartamentos-a-venda-campeche-faixas-preco',
	},
	{
		text: 'Apartamentos à venda no Campeche',
		href: '/blog/apartamentos-a-venda-campeche-faixas-preco',
		slug: 'apartamentos-a-venda-campeche-faixas-preco',
	},
	{
		text: 'sub-regiões do Campeche',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'Sub-regiões do Campeche',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'Novo Campeche',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'sul de Balneário Camboriú',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
	},
	{
		text: 'bairros do sul de Balneário Camboriú',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
	},
	{
		text: 'Segurança no Campeche',
		href: '/blog/seguranca-campeche-como-e-morar',
		slug: 'seguranca-campeche-como-e-morar',
	},
	{
		text: 'segurança no Campeche',
		href: '/blog/seguranca-campeche-como-e-morar',
		slug: 'seguranca-campeche-como-e-morar',
	},
	{
		text: 'Os 10 Melhores Bairros',
		href: '/blog/melhores-bairros-para-morar-em-balneario-camboriu',
		slug: 'melhores-bairros-para-morar-em-balneario-camboriu',
	},
	{
		text: 'melhores bairros para morar',
		href: '/blog/melhores-bairros-para-morar-em-balneario-camboriu',
		slug: 'melhores-bairros-para-morar-em-balneario-camboriu',
	},
	{
		text: 'alta temporada',
		href: '/blog/inverno-verao-campeche-sazonalidade',
		slug: 'inverno-verao-campeche-sazonalidade',
	},
	{
		text: 'aluguel de temporada',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'Aluguel de temporada',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'Alugar no Campeche',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'renda de locação',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'renda de aluguel',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'valorização do bairro',
		href: '/blog/campeche-em-expansao-valorizacao',
		slug: 'campeche-em-expansao-valorizacao',
	},
	{
		text: 'valorização imobiliária',
		href: '/blog/campeche-em-expansao-valorizacao',
		slug: 'campeche-em-expansao-valorizacao',
	},
	{
		text: 'Morro das Pedras',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'Rio Tavares',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'Campeche Norte',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'Jardim Campeche',
		href: '/blog/sub-regioes-campeche-guia-completo',
		slug: 'sub-regioes-campeche-guia-completo',
	},
	{
		text: 'Armação',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
		caseSensitive: true,
	},
	{
		text: 'Ribeirão da Ilha',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
	},
	{
		text: 'Pântano do Sul',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
	},
	{
		text: 'apartamento na planta',
		href: '/blog/apartamentos-a-venda-campeche-faixas-preco',
		slug: 'apartamentos-a-venda-campeche-faixas-preco',
	},
	{
		text: 'Apartamento na planta',
		href: '/blog/apartamentos-a-venda-campeche-faixas-preco',
		slug: 'apartamentos-a-venda-campeche-faixas-preco',
	},
	{
		text: 'passível de financiamento',
		href: '/blog/como-comprar-imovel-campeche-financiamento',
		slug: 'como-comprar-imovel-campeche-financiamento',
	},
	{
		text: 'financiamento imobiliário',
		href: '/blog/financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
		slug: 'financiamento-imobiliario-balneario-camboriu-sfh-sbpe-fgts',
	},
	{
		text: 'metro quadrado no Campeche',
		href: '/blog/preco-m2-campeche-quanto-custa-comprar',
		slug: 'preco-m2-campeche-quanto-custa-comprar',
	},
	{
		text: 'm² no Campeche',
		href: '/blog/preco-m2-campeche-quanto-custa-comprar',
		slug: 'preco-m2-campeche-quanto-custa-comprar',
	},
	{
		text: 'condomínios fechados',
		href: '/blog/casas-a-venda-campeche-sub-regioes',
		slug: 'casas-a-venda-campeche-sub-regioes',
	},
	{
		text: 'condomínios de alto padrão',
		href: '/blog/casas-a-venda-campeche-sub-regioes',
		slug: 'casas-a-venda-campeche-sub-regioes',
	},
	{
		text: 'escolas particulares',
		href: '/blog/escolas-creches-campeche',
		slug: 'escolas-creches-campeche',
	},
	{
		text: 'custo de vida real',
		href: '/blog/custo-de-vida-campeche-quanto-custa-morar',
		slug: 'custo-de-vida-campeche-quanto-custa-morar',
	},
	{
		text: 'investir em renda',
		href: '/blog/investir-imovel-campeche-roi-valorizacao',
		slug: 'investir-imovel-campeche-roi-valorizacao',
	},
	{
		text: 'investir em imóvel',
		href: '/blog/investir-imovel-campeche-roi-valorizacao',
		slug: 'investir-imovel-campeche-roi-valorizacao',
	},
	{
		text: 'comparativo entre bairros',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
	},
	{
		text: 'comparativo de bairros',
		href: '/blog/campeche-x-bairros-sul-comparativo',
		slug: 'campeche-x-bairros-sul-comparativo',
	},
	{
		text: 'rede de saúde',
		href: '/blog/saude-campeche-postos-hospitais-clinicas',
		slug: 'saude-campeche-postos-hospitais-clinicas',
	},
	{
		text: 'Renda de temporada',
		href: '/blog/aluguel-campeche-valores-temporada',
		slug: 'aluguel-campeche-valores-temporada',
	},
	{
		text: 'potencial de valorização',
		href: '/blog/campeche-em-expansao-valorizacao',
		slug: 'campeche-em-expansao-valorizacao',
	},
	{
		text: 'custo de vida real',
		href: '/blog/custo-de-vida-campeche-quanto-custa-morar',
		slug: 'custo-de-vida-campeche-quanto-custa-morar',
	},
	{
		text: 'educação particular',
		href: '/blog/escolas-creches-campeche',
		slug: 'escolas-creches-campeche',
	},
	{
		text: 'comprar apartamento',
		href: '/blog/apartamentos-a-venda-campeche-faixas-preco',
		slug: 'apartamentos-a-venda-campeche-faixas-preco',
	},
]);

import {
	CACHOEIRA_CLUSTER_SLUGS,
	COMPRA_SEGURA_CLUSTER_SLUGS,
	CONSTRUTORAS_CLUSTER_SLUGS,
	BALNEARIO_CAMBORIU_CLUSTER_SLUGS,
} from './blog-cluster-slugs.mjs';
import { CANASVIEIRAS_CLUSTER_SLUGS } from './canasvieiras-cluster.mjs';
import { CENTRO_CLUSTER_SLUGS } from './centro-cluster.mjs';
import { INGLESES_CLUSTER_SLUGS } from './ingleses-cluster.mjs';
import { ITACORUBI_CLUSTER_SLUGS } from './itacorubi-cluster.mjs';
import { JURERE_INTERNACIONAL_CLUSTER_SLUGS } from './jurere-internacional-cluster.mjs';

const CAMPECHE_CLUSTER_SLUGS = new Set([
	'morar-no-campeche-guia-completo',
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
]);

/** @type {LinkRule[]} */
const LANCAMENTOS_PHRASE_RULES = normalizeBlogPhraseRules([
	{ text: 'apartamentos em lançamento', href: '/lancamentos/apartamentos' },
	{ text: 'prontos para morar', href: '/lancamentos/pronto-para-morar' },
	{ text: 'pronto para morar', href: '/lancamentos/pronto-para-morar' },
	{ text: 'imóveis por bairro', href: '/bairros' },
	{ text: 'lançamentos em Balneário Camboriú', href: '/lancamentos' },
	{ text: 'lançamentos imobiliários', href: '/lancamentos' },
	{ text: 'imóveis na planta', href: '/lancamentos' },
]);

function buildNeighborhoodRules(currentSlug) {
	const skipCampecheHub = CAMPECHE_CLUSTER_SLUGS.has(currentSlug);
	const skipJurereHub = JURERE_INTERNACIONAL_CLUSTER_SLUGS.has(currentSlug);
	const skipCanasvieirasHub =
		CANASVIEIRAS_CLUSTER_SLUGS.has(currentSlug) || CACHOEIRA_CLUSTER_SLUGS.has(currentSlug);
	const skipItacorubiHub = ITACORUBI_CLUSTER_SLUGS.has(currentSlug);
	const skipCentroHub = CENTRO_CLUSTER_SLUGS.has(currentSlug);
	const skipInglesesHub = INGLESES_CLUSTER_SLUGS.has(currentSlug);

	return [...NEIGHBORHOODS]
		.filter(
			({ slug }) =>
				!(skipCampecheHub && slug === 'campeche') &&
				!(skipJurereHub && slug === 'jurereinternacional') &&
				!(skipCanasvieirasHub && slug === 'canasvieiras') &&
				!(skipItacorubiHub && slug === 'itacorubi') &&
				!(skipCentroHub && slug === 'centro') &&
				!(skipInglesesHub && slug === 'ingleses'),
		)
		.sort((a, b) => b.name.length - a.name.length)
		.map(({ name, slug }) => ({
			text: name,
			href: `/bairro/${slug}`,
			caseSensitive: true,
		}));
}

function buildArticleLinkRules(currentSlug) {
	const rules = [
		...BLOG_PHRASE_RULES.filter((rule) => rule.slug !== currentSlug),
		...LANCAMENTOS_PHRASE_RULES,
		...buildNeighborhoodRules(currentSlug),
		...buildGlossaryLinkRules(),
	];

	return rules.sort((a, b) => b.text.length - a.text.length);
}

/** @param {string} html @param {string} [currentSlug] */
export function applyArticleInlineLinks(html, currentSlug = '') {
	if (
		CAMPECHE_CLUSTER_SLUGS.has(currentSlug) ||
		JURERE_INTERNACIONAL_CLUSTER_SLUGS.has(currentSlug) ||
		CANASVIEIRAS_CLUSTER_SLUGS.has(currentSlug) ||
		CACHOEIRA_CLUSTER_SLUGS.has(currentSlug) ||
		COMPRA_SEGURA_CLUSTER_SLUGS.has(currentSlug) ||
		CONSTRUTORAS_CLUSTER_SLUGS.has(currentSlug) ||
		BALNEARIO_CAMBORIU_CLUSTER_SLUGS.has(currentSlug) ||
		ITACORUBI_CLUSTER_SLUGS.has(currentSlug) ||
		CENTRO_CLUSTER_SLUGS.has(currentSlug) ||
		INGLESES_CLUSTER_SLUGS.has(currentSlug)
	) {
		return html;
	}

	const rules = buildArticleLinkRules(currentSlug);

	return linkifyHtmlContent(html, rules, {
		skipHeadings: true,
		maxOncePerHref: true,
		skipBeforeSecondSubtitle: true,
	});
}
