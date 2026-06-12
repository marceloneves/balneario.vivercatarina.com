import { BLOG_CLUSTERS } from './blog-clusters.mjs';
import { getBlogPosts } from './blog-posts.mjs';
import { resolveNeighborhoodEntry } from './neighborhood-intro.mjs';

const CAMPECHE_NEIGHBORHOOD_SLUG = 'campeche';
const CANASVIEIRAS_NEIGHBORHOOD_SLUG = 'canasvieiras';
const CENTRO_NEIGHBORHOOD_SLUG = 'centro';
const ITACORUBI_NEIGHBORHOOD_SLUG = 'itacorubi';
const JURERE_INTERNACIONAL_NEIGHBORHOOD_SLUG = 'jurereinternacional';
const INGLESES_NEIGHBORHOOD_SLUG = 'ingleses';
const PIONEIROS_NEIGHBORHOOD_SLUG = 'pioneiros';
const BARRA_SUL_NEIGHBORHOOD_SLUG = 'barrasul';
const ARIRIBA_NEIGHBORHOOD_SLUG = 'aririba';
const NACOES_NEIGHBORHOOD_SLUG = 'nacoes';

/** Artigo pilar do cluster Ingleses. */
const INGLESES_PILLAR_SLUG = 'morar-nos-ingleses-guia-completo';

const INGLESES_SATELLITE_SLUGS = [
	'preco-m2-ingleses-quanto-custa-comprar-imovel',
	'apartamentos-a-venda-ingleses-faixas-preco',
	'casas-a-venda-ingleses-sub-regioes',
	'aluguel-ingleses-valores-temporada',
	'investir-imovel-ingleses-locacao-valorizacao',
	'como-comprar-imovel-ingleses-financiamento',
	'ingleses-e-bom-para-morar',
	'sub-regioes-ingleses-guia-completo',
	'regiao-gaivotas-ingleses-guia-completo',
	'condominios-rua-das-gaivotas-ingleses-guia-completo',
	'quanto-rende-apartamento-rua-das-gaivotas-ingleses',
	'ingleses-x-norte-cidade-onde-morar-balneario-camboriu',
	'infraestrutura-ingleses-comercio-mobilidade',
	'seguranca-ingleses-como-e-morar',
	'praias-ingleses-santinho-guia-completo',
	'escolas-creches-ingleses-opcoes',
	'saude-ingleses-postos-hospitais-clinicas',
	'custo-de-vida-ingleses-quanto-custa-morar',
	'inverno-verao-ingleses-sazonalidade',
];

const INGLESES_PROPERTY_ARTICLE_SLUGS = [INGLESES_PILLAR_SLUG, ...INGLESES_SATELLITE_SLUGS];

/** Artigo pilar do cluster Centro. */
const CENTRO_PILLAR_SLUG = 'morar-no-centro-balneario-camboriu-guia-completo';

const CENTRO_SATELLITE_SLUGS = [
	'preco-m2-centro-balneario-camboriu-quanto-custa',
	'apartamentos-a-venda-centro-balneario-camboriu',
	'aluguel-centro-balneario-camboriu-valores-mercado',
	'vale-a-pena-investir-centro-balneario-camboriu',
	'como-comprar-imovel-centro-balneario-camboriu',
	'centro-balneario-camboriu-e-bom-para-morar',
	'infraestrutura-centro-balneario-camboriu-comercio-mobilidade',
	'verticalizacao-centro-balneario-camboriu-praia-central',
	'praia-central-balneario-camboriu-guia-orla',
	'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar',
];

const CENTRO_PROPERTY_ARTICLE_SLUGS = [CENTRO_PILLAR_SLUG, ...CENTRO_SATELLITE_SLUGS];

/** Artigo pilar do cluster Ariribá. */
const ARIRIBA_PILLAR_SLUG = 'morar-no-aririba-balneario-camboriu-guia-completo';

const ARIRIBA_SATELLITE_SLUGS = [
	'preco-m2-aririba-balneario-camboriu-quanto-custa',
	'apartamentos-a-venda-aririba-balneario-camboriu',
	'vale-a-pena-investir-aririba-balneario-camboriu',
	'aluguel-aririba-balneario-camboriu-valores-mercado',
	'aririba-balneario-camboriu-e-bom-para-morar',
	'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar',
];

const ARIRIBA_PROPERTY_ARTICLE_SLUGS = [ARIRIBA_PILLAR_SLUG, ...ARIRIBA_SATELLITE_SLUGS];

/** Artigo pilar do cluster Nações. */
const NACOES_PILLAR_SLUG = 'morar-no-nacoes-balneario-camboriu-guia-completo';

const NACOES_SATELLITE_SLUGS = [
	'preco-m2-nacoes-balneario-camboriu-quanto-custa',
	'apartamentos-compactos-a-venda-nacoes-balneario-camboriu',
	'nacoes-balneario-camboriu-e-bom-para-morar',
	'custo-de-vida-nacoes-balneario-camboriu-quanto-custa-morar',
];

const NACOES_PROPERTY_ARTICLE_SLUGS = [NACOES_PILLAR_SLUG, ...NACOES_SATELLITE_SLUGS];

/** Artigo pilar do cluster Barra Sul. */
const BARRA_SUL_PILLAR_SLUG = 'morar-na-barra-sul-balneario-camboriu-guia-completo';

const BARRA_SUL_PROPERTY_ARTICLE_SLUGS = [
	BARRA_SUL_PILLAR_SLUG,
	'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
	'apartamentos-a-venda-barra-sul-balneario-camboriu',
	'coberturas-luxo-barra-sul-balneario-camboriu',
	'aluguel-barra-sul-temporada-valores-mercado',
	'vale-a-pena-investir-barra-sul-balneario-camboriu',
	'como-comprar-imovel-barra-sul-balneario-camboriu',
	'barra-sul-e-bom-para-morar',
	'barra-sul-x-centro-x-pioneiros-comparativo',
	'arranha-ceus-barra-sul-senna-tower',
	'infraestrutura-barra-sul-comercio-mobilidade',
	'praia-barra-sul-molhe-guia-orla',
	'gastronomia-vida-noturna-barra-sul',
	'custo-de-vida-barra-sul-quanto-custa-morar',
];

/** Artigo pilar do cluster Pioneiros. */
const PIONEIROS_PILLAR_SLUG = 'morar-nos-pioneiros-guia-completo';

const PIONEIROS_PROPERTY_ARTICLE_SLUGS = [
	PIONEIROS_PILLAR_SLUG,
	'preco-m2-pioneiros-bairro-em-ascensao',
	'apartamentos-a-venda-pioneiros',
	'aluguel-pioneiros-valores-mercado',
	'vale-a-pena-investir-pioneiros',
	'como-comprar-imovel-pioneiros-barra-norte',
	'pioneiros-e-bom-para-morar',
	'pioneiros-x-barra-sul-custo-beneficio',
	'infraestrutura-pioneiros-molhe-comercio-servicos',
	'barra-norte-molhe-guia-regiao-pioneiros',
	'morro-do-careca-estaleiro-natureza-pioneiros',
	'custo-de-vida-pioneiros',
];

/** Artigo pilar do cluster Itacorubi. */
const ITACORUBI_PILLAR_SLUG = 'morar-no-itacorubi-guia-completo';

const ITACORUBI_SATELLITE_SLUGS = [
	'preco-m2-itacorubi-quanto-custa-comprar-imovel',
	'apartamentos-a-venda-itacorubi-faixas-preco',
	'itacorubi-e-bom-para-morar',
	'custo-de-vida-itacorubi-quanto-custa-morar',
];

const ITACORUBI_PROPERTY_ARTICLE_SLUGS = [ITACORUBI_PILLAR_SLUG, ...ITACORUBI_SATELLITE_SLUGS];

/** Artigo pilar do cluster Canasvieiras. */
const CANASVIEIRAS_PILLAR_SLUG = 'morar-em-canasvieiras-guia-completo';

const CANASVIEIRAS_SATELLITE_SLUGS = [
	'canasvieiras-e-bom-para-morar',
	'preco-m2-canasvieiras-quanto-custa-comprar-imovel',
	'apartamentos-a-venda-canasvieiras-faixas-preco',
	'aluguel-temporada-canasvieiras-mercado',
	'custo-de-vida-canasvieiras-quanto-custa-morar',
];

const CANASVIEIRAS_PROPERTY_ARTICLE_SLUGS = [
	CANASVIEIRAS_PILLAR_SLUG,
	...CANASVIEIRAS_SATELLITE_SLUGS,
];

/** Artigo pilar do cluster Campeche — sempre primeiro na seção do bairro. */
const CAMPECHE_PILLAR_SLUG = 'morar-no-campeche-guia-completo';

/** Artigo pilar do cluster Jurerê Internacional. */
const JURERE_INTERNACIONAL_PILLAR_SLUG = 'morar-em-jurere-internacional-guia-completo';

const JURERE_INTERNACIONAL_SATELLITE_SLUGS = [
	'preco-m2-jurere-internacional-quanto-custa-imovel-luxo',
	'apartamentos-a-venda-jurere-internacional-faixas-preco',
	'casas-mansoes-a-venda-jurere-internacional-alto-padrao',
	'aluguel-jurere-internacional-temporada-luxo',
	'investir-imovel-jurere-internacional-valorizacao-retorno',
	'como-comprar-imovel-jurere-internacional-alto-padrao',
	'jurere-internacional-e-bom-para-morar',
	'jurere-internacional-x-jurere-tradicional-comparativo',
	'infraestrutura-jurere-internacional-seguranca-comercio-open-shopping',
	'seguranca-jurere-internacional-como-e-morar',
	'praia-jurere-internacional-guia-completo',
	'vida-noturna-beach-clubs-jurere-verao',
	'custo-de-vida-jurere-internacional-quanto-custa-morar',
	'inverno-verao-jurere-sazonalidade',
];

const JURERE_INTERNACIONAL_PROPERTY_ARTICLE_SLUGS = [
	JURERE_INTERNACIONAL_PILLAR_SLUG,
	...JURERE_INTERNACIONAL_SATELLITE_SLUGS,
];

/** Satélites em ordem de prioridade para as landings de lançamento (exibidos após o pilar). */
const CAMPECHE_SATELLITE_SLUGS = [
	'campeche-e-bom-para-morar',
	'preco-m2-campeche-quanto-custa-comprar',
	'sub-regioes-campeche-guia-completo',
	'investir-imovel-campeche-roi-valorizacao',
	'como-comprar-imovel-campeche-financiamento',
];

const CAMPECHE_PROPERTY_ARTICLE_SLUGS = [CAMPECHE_PILLAR_SLUG, ...CAMPECHE_SATELLITE_SLUGS];

const NEIGHBORHOOD_SLUG_TO_CLUSTER_ID = {
	[CAMPECHE_NEIGHBORHOOD_SLUG]: 'campeche',
	[CANASVIEIRAS_NEIGHBORHOOD_SLUG]: 'canasvieiras',
	[CENTRO_NEIGHBORHOOD_SLUG]: 'centro',
	[BARRA_SUL_NEIGHBORHOOD_SLUG]: 'barra-sul',
	[PIONEIROS_NEIGHBORHOOD_SLUG]: 'pioneiros',
	[INGLESES_NEIGHBORHOOD_SLUG]: 'ingleses',
	[ITACORUBI_NEIGHBORHOOD_SLUG]: 'itacorubi',
	[JURERE_INTERNACIONAL_NEIGHBORHOOD_SLUG]: 'jurere-internacional',
	[ARIRIBA_NEIGHBORHOOD_SLUG]: 'aririba',
	[NACOES_NEIGHBORHOOD_SLUG]: 'nacoes',
};

function normalizeText(value) {
	return String(value ?? '')
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase();
}

function isCentroNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === CENTRO_NEIGHBORHOOD_SLUG || name === 'centro';
}

function isItacorubiNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === ITACORUBI_NEIGHBORHOOD_SLUG || name === 'itacorubi';
}

function isCanasvieirasNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === CANASVIEIRAS_NEIGHBORHOOD_SLUG || name === 'canasvieiras';
}

function isCampecheNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === CAMPECHE_NEIGHBORHOOD_SLUG || name === 'campeche';
}

function isJurereInternacionalNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return (
		slug === JURERE_INTERNACIONAL_NEIGHBORHOOD_SLUG ||
		name === 'jurere internacional'
	);
}

function isAriribaNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === ARIRIBA_NEIGHBORHOOD_SLUG || name === 'aririba';
}

function isNacoesNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === NACOES_NEIGHBORHOOD_SLUG || name === 'nacoes';
}

function isBarraSulNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === BARRA_SUL_NEIGHBORHOOD_SLUG || name === 'barra sul';
}

function isPioneirosNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === PIONEIROS_NEIGHBORHOOD_SLUG || name === 'pioneiros';
}

function isInglesesNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);
	const name = normalizeText(neighborhoodName);

	return slug === INGLESES_NEIGHBORHOOD_SLUG || name === 'ingleses';
}

function getPostsBySlugs(slugs, limit = 3) {
	const posts = getBlogPosts();
	const bySlug = new Map(posts.map((post) => [post.slug, post]));

	return slugs
		.map((slug) => bySlug.get(slug))
		.filter(Boolean)
		.slice(0, limit);
}

function scorePostForNeighborhood(post, neighborhoodName) {
	const target = normalizeText(neighborhoodName);

	if (!target) {
		return 0;
	}

	let score = 0;

	if (normalizeText(post.title).includes(target)) {
		score += 12;
	}

	if (normalizeText(post.excerpt).includes(target)) {
		score += 8;
	}

	for (const tag of post.tags) {
		const normalizedTag = normalizeText(tag);

		if (normalizedTag === target) {
			score += 10;
		} else if (normalizedTag.includes(target)) {
			score += 4;
		}
	}

	return score;
}

function resolveClusterIdForNeighborhood(neighborhoodName, neighborhoodSlug) {
	const slug = normalizeText(neighborhoodSlug);

	if (slug && NEIGHBORHOOD_SLUG_TO_CLUSTER_ID[slug]) {
		return NEIGHBORHOOD_SLUG_TO_CLUSTER_ID[slug];
	}

	const name = normalizeText(neighborhoodName);

	for (const cluster of BLOG_CLUSTERS) {
		if (normalizeText(cluster.label) === name) {
			return cluster.id;
		}
	}

	return null;
}

function clusterHasPublishedArticles(clusterId, publishedSlugs) {
	const cluster = BLOG_CLUSTERS.find((entry) => entry.id === clusterId);

	if (!cluster) {
		return false;
	}

	return [...cluster.slugSet].some((slug) => publishedSlugs.has(slug));
}

export function buildNeighborhoodBlogMoreLink(neighborhoodName, neighborhoodSlug) {
	if (!neighborhoodName || neighborhoodName === 'Não informado') {
		return null;
	}

	const entry = resolveNeighborhoodEntry(neighborhoodName, neighborhoodSlug);
	const displayName = entry?.name ?? neighborhoodName;
	const publishedSlugs = new Set(getBlogPosts().map((post) => post.slug));
	const clusterId = resolveClusterIdForNeighborhood(neighborhoodName, neighborhoodSlug);
	const href =
		clusterId && clusterHasPublishedArticles(clusterId, publishedSlugs)
			? `/blog?cluster=${encodeURIComponent(clusterId)}`
			: '/blog?cluster=geral';

	return {
		href,
		label: `Veja mais artigos sobre o bairro ${displayName}`,
	};
}

export function getNeighborhoodBlogPosts(neighborhoodName, limit = 3, neighborhoodSlug) {
	if (!neighborhoodName || neighborhoodName === 'Não informado') {
		return [];
	}

	if (isCentroNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(CENTRO_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isAriribaNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(ARIRIBA_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isNacoesNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(NACOES_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isBarraSulNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(BARRA_SUL_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isPioneirosNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(PIONEIROS_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isItacorubiNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(ITACORUBI_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isCanasvieirasNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(CANASVIEIRAS_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isCampecheNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(CAMPECHE_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isJurereInternacionalNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(JURERE_INTERNACIONAL_PROPERTY_ARTICLE_SLUGS, limit);
	}

	if (isInglesesNeighborhood(neighborhoodName, neighborhoodSlug)) {
		return getPostsBySlugs(INGLESES_PROPERTY_ARTICLE_SLUGS, limit);
	}

	const posts = getBlogPosts();

	return posts
		.map((post) => ({ post, score: scorePostForNeighborhood(post, neighborhoodName) }))
		.filter(({ score }) => score > 0)
		.sort((a, b) => b.score - a.score || b.post.datePublished.localeCompare(a.post.datePublished))
		.slice(0, limit)
		.map(({ post }) => post);
}
