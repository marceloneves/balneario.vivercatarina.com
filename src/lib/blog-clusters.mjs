import { formatBlogDatePtBr } from './blog-date.mjs';
import {
	CACHOEIRA_CLUSTER_SLUGS,
	COMPRA_SEGURA_CLUSTER_SLUGS,
	CONSTRUTORAS_CLUSTER_SLUGS,
	CAMPECHE_CLUSTER_SLUGS,
	CANASVIEIRAS_CLUSTER_SLUGS,
	CENTRO_CLUSTER_SLUGS,
	ARIRIBA_CLUSTER_SLUGS,
	NACOES_CLUSTER_SLUGS,
	BARRA_CLUSTER_SLUGS,
	BALNEARIO_CAMBORIU_CLUSTER_SLUGS,
	BARRA_SUL_CLUSTER_SLUGS,
	PIONEIROS_CLUSTER_SLUGS,
	INGLESES_CLUSTER_SLUGS,
	ITACORUBI_CLUSTER_SLUGS,
	JURERE_INTERNACIONAL_CLUSTER_SLUGS,
} from './blog-cluster-slugs.mjs';

export {
	CACHOEIRA_CLUSTER_SLUGS,
	COMPRA_SEGURA_CLUSTER_SLUGS,
	CONSTRUTORAS_CLUSTER_SLUGS,
	CAMPECHE_CLUSTER_SLUGS,
	CANASVIEIRAS_CLUSTER_SLUGS,
	CENTRO_CLUSTER_SLUGS,
	ARIRIBA_CLUSTER_SLUGS,
	NACOES_CLUSTER_SLUGS,
	BARRA_CLUSTER_SLUGS,
	BALNEARIO_CAMBORIU_CLUSTER_SLUGS,
	BARRA_SUL_CLUSTER_SLUGS,
	PIONEIROS_CLUSTER_SLUGS,
	INGLESES_CLUSTER_SLUGS,
	ITACORUBI_CLUSTER_SLUGS,
	JURERE_INTERNACIONAL_CLUSTER_SLUGS,
} from './blog-cluster-slugs.mjs';

/** Artigos fora de cluster de bairro (filtro e categoria na listagem). */
export const BLOG_GENERAL_CLUSTER_LABEL = 'Balneário Camboriú';

/** Clusters de bairro com artigos no blog (ordem de exibição no filtro). */
export const BLOG_CLUSTERS = [
	{
		id: 'construtoras-incorporadoras',
		label: 'Construtoras e Incorporadoras',
		slugSet: CONSTRUTORAS_CLUSTER_SLUGS,
	},
	{ id: 'compra-segura-balneario-camboriu', label: 'Compra Segura em Balneário Camboriú', slugSet: COMPRA_SEGURA_CLUSTER_SLUGS },
	{ id: 'campeche', label: 'Campeche', slugSet: CAMPECHE_CLUSTER_SLUGS },
	{ id: 'cachoeira-do-bom-jesus', label: 'Cachoeira do Bom Jesus', slugSet: CACHOEIRA_CLUSTER_SLUGS },
	{ id: 'canasvieiras', label: 'Canasvieiras', slugSet: CANASVIEIRAS_CLUSTER_SLUGS },
	{ id: 'centro', label: 'Centro', slugSet: CENTRO_CLUSTER_SLUGS },
	{ id: 'aririba', label: 'Ariribá', slugSet: ARIRIBA_CLUSTER_SLUGS },
	{ id: 'nacoes', label: 'Nações', slugSet: NACOES_CLUSTER_SLUGS },
	{ id: 'barra', label: 'Barra', slugSet: BARRA_CLUSTER_SLUGS },
	{ id: 'barra-sul', label: 'Barra Sul', slugSet: BARRA_SUL_CLUSTER_SLUGS },
	{ id: 'pioneiros', label: 'Pioneiros', slugSet: PIONEIROS_CLUSTER_SLUGS },
	{ id: 'ingleses', label: 'Ingleses', slugSet: INGLESES_CLUSTER_SLUGS },
	{ id: 'itacorubi', label: 'Itacorubi', slugSet: ITACORUBI_CLUSTER_SLUGS },
	{
		id: 'jurere-internacional',
		label: 'Jurerê Internacional',
		slugSet: JURERE_INTERNACIONAL_CLUSTER_SLUGS,
	},
	{ id: 'geral', label: BLOG_GENERAL_CLUSTER_LABEL, slugSet: BALNEARIO_CAMBORIU_CLUSTER_SLUGS },
];

const SLUG_TO_CLUSTER_ID = new Map();
const CLUSTER_LABEL_BY_ID = new Map(BLOG_CLUSTERS.map((cluster) => [cluster.id, cluster.label]));

for (const cluster of BLOG_CLUSTERS) {
	for (const slug of cluster.slugSet) {
		SLUG_TO_CLUSTER_ID.set(slug, cluster.id);
	}
}

/** Identificador do cluster de um artigo publicado, ou `geral` se não pertence a nenhum. */
export function getBlogClusterIdForSlug(slug) {
	return SLUG_TO_CLUSTER_ID.get(slug) ?? 'geral';
}

/** Nome exibido como categoria do artigo (label do cluster). */
export function getBlogClusterLabelForSlug(slug) {
	const clusterId = SLUG_TO_CLUSTER_ID.get(slug);

	if (!clusterId) {
		return null;
	}

	return CLUSTER_LABEL_BY_ID.get(clusterId) ?? null;
}

/** Categoria do artigo: nome do cluster ou Balneário Camboriú (fora de cluster de bairro). */
export function resolveBlogPostCategory(post) {
	const clusterLabel = getBlogClusterLabelForSlug(post.slug);

	if (clusterLabel) {
		return clusterLabel;
	}

	return BLOG_GENERAL_CLUSTER_LABEL;
}

export function enrichBlogPost(post) {
	const clusterId = getBlogClusterIdForSlug(post.slug);

	return {
		...post,
		clusterId,
		category: resolveBlogPostCategory(post),
		dateLabel: formatBlogDatePtBr(post.datePublished),
		dateUpdatedLabel: post.dateUpdated ? formatBlogDatePtBr(post.dateUpdated) : undefined,
	};
}

export function filterBlogPostsByCluster(posts, clusterId) {
	if (!clusterId || clusterId === 'all') {
		return posts;
	}

	if (clusterId === 'geral') {
		const cluster = BLOG_CLUSTERS.find((entry) => entry.id === 'geral');

		if (cluster) {
			return posts.filter((post) => cluster.slugSet.has(post.slug));
		}

		return posts.filter((post) => !SLUG_TO_CLUSTER_ID.has(post.slug));
	}

	const cluster = BLOG_CLUSTERS.find((entry) => entry.id === clusterId);

	if (!cluster) {
		return posts;
	}

	return posts.filter((post) => cluster.slugSet.has(post.slug));
}

/** Opções do filtro: apenas clusters (e “geral”) com pelo menos um artigo publicado. */
export function getBlogClusterFilterOptions(posts) {
	const publishedSlugs = new Set(posts.map((post) => post.slug));
	const options = [{ id: 'all', label: 'Todos' }];

	for (const cluster of BLOG_CLUSTERS) {
		const count = [...cluster.slugSet].filter((slug) => publishedSlugs.has(slug)).length;

		if (count > 0) {
			options.push({ id: cluster.id, label: cluster.label, count });
		}
	}

	const geralInClusters = BLOG_CLUSTERS.some((cluster) => cluster.id === 'geral');
	const geralCount = posts.filter((post) => !SLUG_TO_CLUSTER_ID.has(post.slug)).length;

	if (geralCount > 0 && !geralInClusters) {
		options.push({ id: 'geral', label: BLOG_GENERAL_CLUSTER_LABEL, count: geralCount });
	}

	return options;
}

export function attachBlogClusterToPosts(posts) {
	return posts.map((post) => enrichBlogPost(post));
}
