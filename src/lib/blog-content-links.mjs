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
	'Quanto Custa Morar em Balneário Camboriú': 'Quanto Custa Morar',
	'quanto custa morar em Balneário Camboriú': 'quanto custa morar',
	'bairros do sul de Balneário Camboriú': 'sul de Balneário Camboriú',
	'checklist com 15 itens': 'checklist com 15',
	'Os 10 Melhores Bairros': 'Melhores Bairros',
	'melhores bairros para morar': 'melhores bairros',
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
		text: 'Morar em Balneário Camboriú',
		href: '/blog/morar-em-balneario-camboriu-guia-completo',
		slug: 'morar-em-balneario-camboriu-guia-completo',
	},
	{
		text: 'Morar nos Pioneiros',
		href: '/blog/morar-nos-pioneiros-guia-completo',
		slug: 'morar-nos-pioneiros-guia-completo',
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
]);

import {
	COMPRA_SEGURA_CLUSTER_SLUGS,
	CONSTRUTORAS_CLUSTER_SLUGS,
	BALNEARIO_CAMBORIU_CLUSTER_SLUGS,
} from './blog-cluster-slugs.mjs';
import { CENTRO_CLUSTER_SLUGS } from './centro-cluster.mjs';
import { ARIRIBA_CLUSTER_SLUGS } from './aririba-cluster.mjs';
import { NACOES_CLUSTER_SLUGS } from './nacoes-cluster.mjs';
import { BARRA_CLUSTER_SLUGS } from './barra-cluster.mjs';
import { PIONEIROS_CLUSTER_SLUGS } from './pioneiros-cluster.mjs';
import { BARRA_SUL_CLUSTER_SLUGS } from './barra-sul-cluster.mjs';

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
	const skipCentroHub = CENTRO_CLUSTER_SLUGS.has(currentSlug);
	const skipAriribaHub = ARIRIBA_CLUSTER_SLUGS.has(currentSlug);
	const skipNacoesHub = NACOES_CLUSTER_SLUGS.has(currentSlug);
	const skipBarraSulHub = BARRA_SUL_CLUSTER_SLUGS.has(currentSlug);
	const skipPioneirosHub = PIONEIROS_CLUSTER_SLUGS.has(currentSlug);

	return [...NEIGHBORHOODS]
		.filter(
			({ slug }) =>
				!(skipCentroHub && slug === 'centro') &&
				!(skipAriribaHub && slug === 'aririba') &&
				!(skipNacoesHub && slug === 'nacoes') &&
				!(skipBarraSulHub && slug === 'barrasul') &&
				!(skipPioneirosHub && slug === 'pioneiros'),
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
		COMPRA_SEGURA_CLUSTER_SLUGS.has(currentSlug) ||
		CONSTRUTORAS_CLUSTER_SLUGS.has(currentSlug) ||
		BALNEARIO_CAMBORIU_CLUSTER_SLUGS.has(currentSlug) ||
		CENTRO_CLUSTER_SLUGS.has(currentSlug) ||
		NACOES_CLUSTER_SLUGS.has(currentSlug) ||
		BARRA_CLUSTER_SLUGS.has(currentSlug) ||
		BARRA_SUL_CLUSTER_SLUGS.has(currentSlug) ||
		PIONEIROS_CLUSTER_SLUGS.has(currentSlug)
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
