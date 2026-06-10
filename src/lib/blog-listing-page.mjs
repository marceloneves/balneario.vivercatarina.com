import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	attachBlogClusterToPosts,
	getBlogClusterFilterOptions,
} from './blog-clusters.mjs';
import { getBlogPosts } from './blog-posts.mjs';
import { patchCompactListingBreadcrumb } from './listing-breadcrumb.mjs';
import { applySemanticHtml } from './semantic-html.mjs';
import { buildPaginationMarkup, paginate } from './property-listings.mjs';
import { patchSiteMenu } from './site-menu.mjs';

export const BLOG_POSTS_PER_PAGE = 9;

const templatePath = join(process.cwd(), 'src/content/template-pages/blog.html');

function escapeHtml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function normalizeBlogSearchText(value) {
	return String(value ?? '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '');
}

function buildBlogSearchText(post) {
	const parts = [
		post.title,
		post.excerpt,
		post.category,
		...(Array.isArray(post.tags) ? post.tags : []),
		post.slug?.replace(/-/g, ' '),
	];

	return normalizeBlogSearchText(parts.filter(Boolean).join(' '));
}

function blogCategoryHref(post) {
	if (post.clusterId && post.clusterId !== 'geral') {
		return `/blog?cluster=${encodeURIComponent(post.clusterId)}`;
	}

	if (post.clusterId === 'geral') {
		return '/blog?cluster=geral';
	}

	return '/blog';
}

function renderBlogPostCard(post) {
	const title = escapeHtml(post.title);
	const excerpt = escapeHtml(post.excerpt);
	const category = escapeHtml(post.category);
	const categoryHref = escapeHtml(blogCategoryHref(post));
	const href = escapeHtml(post.href);
	const imageUrl = escapeHtml(post.imageUrl);
	const dateLabel = escapeHtml(post.dateLabel);
	const datePublished = escapeHtml(post.datePublished);

	const clusterId = escapeHtml(post.clusterId ?? 'geral');

	return `<div class="col-lg-4 col-md-6 d-flex" data-blog-cluster="${clusterId}">
	<article class="blog-card blog-post-card">
		<div class="blog-img">
			<a href="${href}">
				<img src="${imageUrl}" alt="${title} — blog Viver Catarina sobre imóveis na planta em Balneário Camboriú" loading="lazy" width="400" height="220" />
			</a>
			<div class="date">
				<time datetime="${datePublished}">
					<a href="/blog">${dateLabel}</a>
				</time>
			</div>
		</div>
		<div class="blog-content">
			<div class="blog-meta">
				<a href="${categoryHref}"><i class="fa-regular fa-tag" aria-hidden="true"></i> ${category}</a>
			</div>
			<h3 class="box-title">
				<a href="${href}">${title}</a>
			</h3>
			<p class="box-text">${excerpt}</p>
			<a href="${href}" class="th-btn pill blog-post-card__read-btn">Ler artigo</a>
		</div>
	</article>
</div>`;
}

function renderBlogListingTitle(pageNumber = 1) {
	const heading =
		pageNumber > 1 ? `Blog — Página ${pageNumber}` : 'Blog';

	return `<div class="title-area text-center mb-40">
	<p class="sub-title"><span class="double-line"></span> Viver Catarina</p>
	<h1 class="sec-title" id="blog-listing-title">${escapeHtml(heading)}</h1>
</div>`;
}

function renderBlogListingSearch() {
	return `<form class="blog-listing-search" id="blog-listing-search" role="search" aria-label="Buscar artigos do blog">
	<label class="visually-hidden" for="blog-listing-search-input">Buscar artigos</label>
	<div class="blog-listing-search__field">
		<span class="blog-listing-search__icon" aria-hidden="true"><i class="far fa-search"></i></span>
		<input
			type="search"
			class="blog-listing-search__input"
			id="blog-listing-search-input"
			name="q"
			placeholder="Buscar por bairro, tema ou palavra-chave..."
			autocomplete="off"
			enterkeyhint="search"
			spellcheck="false"
		/>
		<button type="button" class="blog-listing-search__clear" id="blog-listing-search-clear" hidden aria-label="Limpar busca">
			<i class="far fa-times" aria-hidden="true"></i>
		</button>
	</div>
	<p class="blog-listing-search__status" id="blog-listing-search-status" role="status" aria-live="polite" hidden></p>
</form>`;
}

function renderBlogClusterFilter(allPosts) {
	const options = getBlogClusterFilterOptions(allPosts);

	if (options.length <= 1) {
		return '';
	}

	const buttonMarkup = options
		.map(({ id, label, count }, index) => {
			const isActive = index === 0;
			const countMarkup =
				count > 0 && id !== 'all'
					? `<span class="blog-category-filter__count">${count}</span>`
					: '';
			return `<button type="button" class="blog-category-filter__btn${isActive ? ' is-active' : ''}" data-cluster-filter="${escapeHtml(id)}" aria-pressed="${isActive ? 'true' : 'false'}">${escapeHtml(label)}${countMarkup}</button>`;
		})
		.join('\n');

	return `<div class="blog-listing-controls__filters">
	<p class="blog-listing-controls__filters-label">Filtrar por tema</p>
	<nav class="blog-category-filter" id="blog-category-filter" aria-label="Filtrar artigos por bairro">
	<div class="blog-category-filter__track">${buttonMarkup}</div>
</nav>
</div>`;
}

function renderBlogListingControls(allPosts) {
	const filterMarkup = renderBlogClusterFilter(allPosts);

	return `<div class="blog-listing-controls mb-40">
	${renderBlogListingSearch()}
	${filterMarkup}
</div>`;
}

function renderBlogClusterFilterDataScript(allPosts) {
	const payload = attachBlogClusterToPosts(allPosts).map((post) => {
		const { slug, title, excerpt, category, href, imageUrl, dateLabel, datePublished, clusterId } = post;

		return {
			slug,
			title,
			excerpt,
			category,
			href,
			imageUrl,
			dateLabel,
			datePublished,
			clusterId,
			searchText: buildBlogSearchText(post),
		};
	});
	const json = JSON.stringify(payload).replace(/</g, '\\u003c');

	return `<script id="blog-cluster-filter-data" type="application/json">${json}</script>
<script src="/js/blog-cluster-filter.js" defer></script>`;
}

function renderBlogListingMain(posts, paginationMarkup = '', pageNumber = 1, allPosts = posts) {
	const cards = attachBlogClusterToPosts(posts).map(renderBlogPostCard).join('\n');

	return `<section class="th-blog-wrapper blog-listing-section space-top space-extra-bottom" id="blog-listing" aria-label="Artigos do blog">
	<div class="container">
		${renderBlogListingTitle(pageNumber)}
		${renderBlogListingControls(allPosts)}
		<div class="row gy-30 justify-content-center" id="blog-listing-grid">
			${cards}
		</div>
		${paginationMarkup}
		${renderBlogClusterFilterDataScript(allPosts)}
	</div>
</section>`;
}

export function getBlogListingPageCount(posts, perPage = BLOG_POSTS_PER_PAGE) {
	return Math.max(1, Math.ceil(posts.length / perPage));
}

export function buildBlogListingPageHtml(posts, pageNumber = 1) {
	const allPosts = getBlogPosts();
	const { items, currentPage, totalPages } = paginate(posts, pageNumber, BLOG_POSTS_PER_PAGE);
	const paginationMarkup = buildPaginationMarkup(currentPage, totalPages, '/blog');
	const main = renderBlogListingMain(items, paginationMarkup, currentPage, allPosts);

	const bodyHtml = readFileSync(templatePath, 'utf8');
	const contentStart = bodyHtml.indexOf('<!--==============================\nBlog Area');
	const footerStart = bodyHtml.indexOf('<!--==============================\n\tFooter Area');

	if (contentStart === -1 || footerStart === -1) {
		throw new Error('Não foi possível montar a listagem do blog.');
	}

	const menuPath = currentPage === 1 ? '/blog' : `/blog/pagina-${currentPage}`;
	const breadcrumbOptions =
		currentPage > 1
			? {
					pageLabel: `Página ${currentPage}`,
					parent: { href: '/blog', label: 'Blog' },
				}
			: { pageLabel: 'Blog' };

	const header = patchSiteMenu(
		applySemanticHtml(
			patchCompactListingBreadcrumb(bodyHtml.slice(0, contentStart), breadcrumbOptions),
		),
		menuPath,
	);
	const footer = applySemanticHtml(bodyHtml.slice(footerStart));

	return `${header}
    <main id="conteudo-principal">
${main}
    </main>
${footer}`;
}
