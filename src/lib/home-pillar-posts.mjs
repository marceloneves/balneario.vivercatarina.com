import { getBlogPosts } from './blog-posts.mjs';
import {
	ARIRIBA_PILLAR,
	BALNEARIO_CAMBORIU_PILLAR,
	BARRA_PILLAR,
	BARRA_SUL_PILLAR,
	CENTRO_PILLAR,
	CONSTRUTORAS_PILLAR,
	NACOES_PILLAR,
	PIONEIROS_PILLAR,
} from './blog-cluster-slugs.mjs';

/**
 * Pilares exibidos na home, do mais abrangente ao mais específico: primeiro o
 * guia da cidade, depois os bairros por relevância de mercado.
 *
 * Só entram pilares com artigo publicado — a lista pode declarar mais pilares
 * do que o blog tem no momento.
 */
const HOME_PILLAR_ORDER = [
	BALNEARIO_CAMBORIU_PILLAR,
	CENTRO_PILLAR,
	BARRA_SUL_PILLAR,
	BARRA_PILLAR,
	NACOES_PILLAR,
	PIONEIROS_PILLAR,
	ARIRIBA_PILLAR,
	CONSTRUTORAS_PILLAR,
];

export function getHomePillarPosts(limit = 4) {
	const postBySlug = new Map(getBlogPosts().map((post) => [post.slug, post]));

	return HOME_PILLAR_ORDER.map((slug) => postBySlug.get(slug))
		.filter(Boolean)
		.slice(0, limit);
}
