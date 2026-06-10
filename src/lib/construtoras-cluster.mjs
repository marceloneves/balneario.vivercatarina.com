/**
 * Cluster Construtoras e Incorporadoras — pilar + satélites (sem hub de bairro).
 *
 * Regras de linkagem:
 * - Pilar: Leia também com todos os satélites publicados; sem links no corpo.
 * - Satélite: 1× pilar no corpo + 1× outro satélite do cluster no corpo; pilar de novo no Leia também.
 */

import { BLOG_POSTS } from './blog-posts.mjs';
import {
	applyPlan,
	splitClosing,
	stripBodyAnchors,
	stripClusterBridge,
	stripHeadingAnchors,
	stripRelatedBlocks,
} from './campeche-cluster-body-links.mjs';
import { CONSTRUTORAS_CLUSTER_SLUGS, CONSTRUTORAS_PILLAR } from './blog-cluster-slugs.mjs';
import { shortLinkLabel } from './cluster-link-anchor.mjs';
import { buildLeiaTambemSlugs, trimSatelliteBodyPlan } from './cluster-link-rebuild.mjs';

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
	'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos': [
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'gpinho-construtora-projetos-balneario-camboriu',
	],
	'wkoerich-historia-obras-lancamentos-balneario-camboriu': [
		'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos',
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'gpinho-construtora-projetos-balneario-camboriu',
	],
	'cfl-empreendimentos-balneario-camboriu-perfil-projetos': [
		'habitasul-balneario-camboriu-empreendimentos-incorporadora',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
		'piemonte-construtora-balneario-camboriu-historia-empreendimentos',
	],
	'formacco-empreendimentos-trajetoria-balneario-camboriu': [
		'cota-empreendimentos-obras-lancamentos-balneario-camboriu',
		'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
	],
	'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu': [
		'cota-empreendimentos-obras-lancamentos-balneario-camboriu',
		'formacco-empreendimentos-trajetoria-balneario-camboriu',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
	],
	'hantei-engenharia-balneario-camboriu-empreendimentos-atuacao': [
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
	],
	'gpinho-construtora-projetos-balneario-camboriu': [
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'piemonte-construtora-balneario-camboriu-historia-empreendimentos',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
	],
	'piemonte-construtora-balneario-camboriu-historia-empreendimentos': [
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
		'gpinho-construtora-projetos-balneario-camboriu',
	],
	'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu': [
		'habitasul-balneario-camboriu-empreendimentos-incorporadora',
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'formacco-empreendimentos-trajetoria-balneario-camboriu',
	],
	'habitasul-balneario-camboriu-empreendimentos-incorporadora': [
		'cfl-empreendimentos-balneario-camboriu-perfil-projetos',
		'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu',
		'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos',
	],
	'cota-empreendimentos-obras-lancamentos-balneario-camboriu': [
		'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu',
		'formacco-empreendimentos-trajetoria-balneario-camboriu',
		'wkoerich-historia-obras-lancamentos-balneario-camboriu',
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
	'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'conforto e sustentabilidade', target: 'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu' },
			{ find: 'histórico consolidado', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'altíssimo padrão em Jurerê', target: 'habitasul-balneario-camboriu-empreendimentos-incorporadora' },
			{ find: 'João Paulo', target: 'hantei-engenharia-balneario-camboriu-empreendimentos-atuacao' },
			{ find: 'visitar empreendimentos já entregues', target: 'formacco-empreendimentos-trajetoria-balneario-camboriu' },
			{ find: 'região continental', target: 'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'Praça da Trindade', target: 'gpinho-construtora-projetos-balneario-camboriu' },
		],
	},
	'wkoerich-historia-obras-lancamentos-balneario-camboriu': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'PBQP-H Nível A', target: 'piemonte-construtora-balneario-camboriu-historia-empreendimentos' },
			{ find: 'construtoras mais consolidadas', target: 'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos' },
			{ find: 'residencial de luxo', target: 'cfl-empreendimentos-balneario-camboriu-perfil-projetos' },
			{ find: 'tradição e contemporaneidade', target: 'hantei-engenharia-balneario-camboriu-empreendimentos-atuacao' },
			{ find: 'pontualidade nas entregas', target: 'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu' },
		],
	},
	'cfl-empreendimentos-balneario-camboriu-perfil-projetos': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'Jurerê Internacional', target: 'habitasul-balneario-camboriu-empreendimentos-incorporadora' },
			{ find: 'Campeche', target: 'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu' },
			{ find: 'bairro Cacupé', target: 'piemonte-construtora-balneario-camboriu-historia-empreendimentos' },
			{ find: 'cases de sucesso', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'Terraço Cacupé', target: 'gpinho-construtora-projetos-balneario-camboriu' },
			{ find: 'incorporadoras mais sofisticadas', target: 'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos' },
			{ find: 'alto valor agregado', target: 'hantei-engenharia-balneario-camboriu-empreendimentos-atuacao' },
			{ find: 'litoral catarinense', target: 'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu' },
		],
	},
	'formacco-empreendimentos-trajetoria-balneario-camboriu': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'região continental', target: 'cota-empreendimentos-obras-lancamentos-balneario-camboriu' },
			{ find: 'soluções sustentáveis', target: 'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu' },
			{ find: 'Estreito', target: 'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'apartamentos entregues', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'arquitetura sustentável', target: 'cfl-empreendimentos-balneario-camboriu-perfil-projetos' },
			{ find: 'Itacorubi', target: 'gpinho-construtora-projetos-balneario-camboriu' },
		],
	},
	'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'gestão familiar', target: 'cota-empreendimentos-obras-lancamentos-balneario-camboriu' },
			{ find: 'Estreito', target: 'formacco-empreendimentos-trajetoria-balneario-camboriu' },
			{ find: 'pontualidade nas entregas', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
		],
	},
	'hantei-engenharia-balneario-camboriu-empreendimentos-atuacao': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'segmento de luxo', target: 'cfl-empreendimentos-balneario-camboriu-perfil-projetos' },
			{ find: 'alto padrão', target: 'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos' },
			{ find: 'design moderno', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
		],
	},
	'gpinho-construtora-projetos-balneario-camboriu': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'Piatto Cacupé', target: 'piemonte-construtora-balneario-camboriu-historia-empreendimentos' },
			{ find: 'Trindade', target: 'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos' },
			{ find: 'Itacorubi', target: 'formacco-empreendimentos-trajetoria-balneario-camboriu' },
		],
	},
	'piemonte-construtora-balneario-camboriu-historia-empreendimentos': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'Cacupé', target: 'cfl-empreendimentos-balneario-camboriu-perfil-projetos' },
			{ find: 'PBQP-H Nível A', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'Unna Residence', target: 'gpinho-construtora-projetos-balneario-camboriu' },
		],
	},
	'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'Certificação Lixo Zero', target: 'habitasul-balneario-camboriu-empreendimentos-incorporadora' },
			{ find: 'Campeche', target: 'cfl-empreendimentos-balneario-camboriu-perfil-projetos' },
			{ find: 'sustentabilidade', target: 'formacco-empreendimentos-trajetoria-balneario-camboriu' },
			{ find: 'alto padrão', target: 'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos' },
		],
	},
	'habitasul-balneario-camboriu-empreendimentos-incorporadora': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'Jurerê Internacional', target: 'cfl-empreendimentos-balneario-camboriu-perfil-projetos' },
			{ find: 'Certificação Lixo Zero', target: 'grupo-oad-empreendimentos-mercado-imobiliario-balneario-camboriu' },
			{ find: 'mercado de luxo', target: 'construtora-dimas-balneario-camboriu-empreendimentos-lancamentos' },
		],
	},
	'cota-empreendimentos-obras-lancamentos-balneario-camboriu': {
		links: [
			{ find: 'patrimônio de afetação', target: PILLAR },
			{ find: 'Estreito', target: 'rdo-empreendimentos-historia-obras-lancamentos-balneario-camboriu' },
			{ find: 'região continental', target: 'formacco-empreendimentos-trajetoria-balneario-camboriu' },
			{ find: 'meio século', target: 'wkoerich-historia-obras-lancamentos-balneario-camboriu' },
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

	const trimmed = trimSatelliteBodyPlan(
		plan.links,
		slug,
		PILLAR,
		SATELLITE_SLUGS,
		SATELLITE_BODY_PLAN,
		LEIA_TAMBEM[slug] ?? defaultLeiaSatellites(slug),
	).filter(({ target }) => publishedSlugs.has(target));
	let linked = trimmed.length ? applyPlan(content, { links: trimmed }) : content;
	linked = stripHeadingAnchors(linked);

	const leiaSlugs = leiaTambemSlugsForSatellite(slug);
	const footer = [renderLeiaTambem(leiaSlugs), closing].filter(Boolean).join('\n\n');

	return `${linked.trim()}\n\n${footer}`.trim() + '\n';
}
