import {
	SITE_CITY,
	SITE_EMAIL,
	SITE_NAME,
	SITE_PHONE_TEL,
	SITE_URL,
} from './site-contact.mjs';

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const LOGO_URL = `${SITE_URL}/assets/img/logo.svg`;

function absoluteUrl(value) {
	if (!value) {
		return `${SITE_URL}/`;
	}

	if (/^https?:\/\//i.test(value)) {
		return value;
	}

	return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

function normalizePath(pathname) {
	const path = String(pathname || '/')
		.split('?')[0]
		.split('#')[0];

	if (!path || path === '/' || path === '/index.html') {
		return '/';
	}

	return path.replace(/\/+$/, '') || '/';
}

function cleanLeafName(title) {
	return String(title || '')
		.replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`), '')
		.trim();
}

/** Nó Organization — portal de divulgação de lançamentos (não é corretor/imobiliária).
 *  Referenciado por @id pelos demais schemas. */
export function buildOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': ORG_ID,
		name: SITE_NAME,
		url: `${SITE_URL}/`,
		image: LOGO_URL,
		logo: { '@type': 'ImageObject', url: LOGO_URL },
		email: SITE_EMAIL,
		telephone: SITE_PHONE_TEL,
		areaServed: { '@type': 'City', name: SITE_CITY },
		address: {
			'@type': 'PostalAddress',
			addressLocality: SITE_CITY,
			addressRegion: 'SC',
			addressCountry: 'BR',
		},
	};
}

/** Nó WebSite — identifica o site e seu publisher (a Organization). */
export function buildWebSiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		'@id': WEBSITE_ID,
		name: SITE_NAME,
		url: `${SITE_URL}/`,
		inLanguage: 'pt-BR',
		publisher: { '@id': ORG_ID },
	};
}

/** BlogPosting para artigos do blog. */
export function buildArticleSchema(post) {
	if (!post) {
		return null;
	}

	const url = absoluteUrl(post.href || (post.slug ? `/blog/${post.slug}` : '/blog'));

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${url}#article`,
		mainEntityOfPage: { '@type': 'WebPage', '@id': url },
		url,
		headline: post.title,
		image: post.imageUrl ? absoluteUrl(post.imageUrl) : LOGO_URL,
		inLanguage: 'pt-BR',
		author: {
			'@type': 'Person',
			name: post.author || SITE_NAME,
			url: `${SITE_URL}/`,
			worksFor: { '@id': ORG_ID },
		},
		publisher: { '@id': ORG_ID },
	};

	if (post.excerpt) {
		schema.description = post.excerpt;
	}

	if (post.datePublished) {
		schema.datePublished = post.datePublished;
		schema.dateModified = post.dateUpdated || post.datePublished;
	}

	return schema;
}

/**
 * FAQPage JSON-LD a partir da FAQ visível do artigo de blog.
 * Lê os pares pergunta (h4) + resposta (p) na seção de Perguntas Frequentes.
 * Voltado à citação por IA/LLM (o rich result de FAQ do Google foi aposentado).
 */
export function buildBlogFaqJsonLd(bodyHtml, post) {
	if (!bodyHtml || !post) {
		return null;
	}

	const url = absoluteUrl(post.href || (post.slug ? `/blog/${post.slug}` : '/blog'));
	const faqStart = bodyHtml.search(/<h[23][^>]*>\s*Perguntas\s+[Ff]requentes/);

	if (faqStart === -1) {
		return null;
	}

	let segment = bodyHtml.slice(faqStart);
	const nextHeading = segment.slice(4).search(/<h[23]\b/i);
	if (nextHeading !== -1) {
		segment = segment.slice(0, nextHeading + 4);
	}

	const strip = (value) =>
		String(value ?? '')
			.replace(/<[^>]+>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim();

	const mainEntity = [...segment.matchAll(/<h[45][^>]*>(.*?)<\/h[45]>\s*<p[^>]*>(.*?)<\/p>/gis)]
		.map((m) => {
			const question = strip(m[1]);
			const answer = strip(m[2]);
			if (!question || !answer) {
				return null;
			}
			return {
				'@type': 'Question',
				name: question,
				acceptedAnswer: { '@type': 'Answer', text: answer },
			};
		})
		.filter(Boolean);

	if (mainEntity.length === 0) {
		return null;
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		'@id': `${url}#faq`,
		url,
		mainEntity,
	};
}

/**
 * ItemList para páginas de listagem.
 * @param {{ url: string, name: string }[]} items
 */
export function buildItemListSchema(items, { name } = {}) {
	const list = (items || []).filter((item) => item && item.url && item.name);

	if (!list.length) {
		return null;
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		...(name ? { name } : {}),
		numberOfItems: list.length,
		itemListElement: list.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			url: absoluteUrl(item.url),
			name: item.name,
		})),
	};
}

/**
 * BreadcrumbList a partir de uma lista explícita de itens.
 * @param {{ name: string, url: string }[]} items
 */
export function breadcrumbListFromItems(items) {
	const list = (items || []).filter((item) => item && item.name && item.url);

	if (list.length < 2) {
		return null;
	}

	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: list.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: absoluteUrl(item.url),
		})),
	};
}

const BREADCRUMB_SECTIONS = {
	lancamentos: { name: 'Lançamentos', path: '/lancamentos/apartamentos' },
	bairros: { name: 'Bairros', path: '/bairros' },
	bairro: { name: 'Bairros', path: '/bairros' },
	imovel: { name: 'Lançamentos', path: '/lancamentos/apartamentos' },
	blog: { name: 'Blog', path: '/blog' },
	glossario: { name: 'Glossário', path: '/glossario' },
	contact: { name: 'Contato', path: '/contact' },
	'quem-somos': { name: 'Quem Somos', path: '/quem-somos' },
	about: { name: 'Quem Somos', path: '/quem-somos' },
};

/** Gera BreadcrumbList automaticamente a partir do caminho e do título da página. */
export function buildBreadcrumbSchema(pathname, title) {
	const path = normalizePath(pathname);

	if (path === '/') {
		return null;
	}

	const segments = path.slice(1).split('/');
	const section = BREADCRUMB_SECTIONS[segments[0]];
	const leafName = cleanLeafName(title) || section?.name || segments[segments.length - 1];

	const crumbs = [{ name: 'Início', url: `${SITE_URL}/` }];

	if (section && section.path !== path) {
		crumbs.push({ name: section.name, url: `${SITE_URL}${section.path}` });
	}

	crumbs.push({ name: leafName, url: `${SITE_URL}${path}` });

	return breadcrumbListFromItems(crumbs);
}
