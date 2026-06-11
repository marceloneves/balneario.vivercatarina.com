import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyArticleInlineLinks } from './blog-content-links.mjs';
import { getBlogPostMetaDescription } from './blog-posts.mjs';
import { renderArticleShareLinksHtml } from './blog-share-links.mjs';
import { patchCompactListingBreadcrumb } from './listing-breadcrumb.mjs';
import { applySemanticHtml, wrapSplitPageContent } from './semantic-html.mjs';
import { buildKeywords } from './site-seo.mjs';

const templatePath = join(process.cwd(), 'src/content/template-pages/blog-details.html');

export function loadBlogArticleTemplate() {
	return readFileSync(templatePath, 'utf8');
}

export function buildBlogArticlePageHtml(post, rawBody, templateHtml = loadBlogArticleTemplate()) {
	const title = post.title;
	const blogBody = applyArticleInlineLinks(rawBody, post.slug);

	const blogAreaStart = templateHtml.indexOf('<!--==============================\n        Blog Area');
	const articleStart = templateHtml.indexOf('<article class="th-blog blog-single">');
	const articleEnd = templateHtml.indexOf('</article>', articleStart);
	const footerStart = templateHtml.indexOf('<!--==============================\n\tFooter Area');

	if (blogAreaStart === -1 || articleStart === -1 || articleEnd === -1 || footerStart === -1) {
		throw new Error('Não foi possível montar o artigo do blog a partir do template.');
	}

	const shell = wrapSplitPageContent(
		applySemanticHtml(
			patchCompactListingBreadcrumb(templateHtml.slice(0, blogAreaStart), {
				pageLabel: title,
				parent: { href: '/blog', label: 'Blog' },
			}),
		),
		applySemanticHtml(templateHtml.slice(footerStart)),
	);

	const articleBlock = templateHtml
		.slice(articleStart, articleEnd + '</article>'.length)
		.replace(
			'Building gains into housing stocks and how to trade the sector',
			post.title,
		)
		.replace('Michel Smith', post.author)
		.replace('24/02/2025', post.dateLabel)
		.replace(
			'Atualizado em 24/02/2025',
			`Atualizado em ${post.dateUpdatedLabel ?? post.dateLabel}`,
		)
		.replace('Business', post.category)
		.replace('src="/assets/img/blog/blog-s-1-1.webp"', `src="${post.imageUrl}"`)
		.replace(
			'alt="Image"',
			`alt="${post.title} — imóveis na planta em Balneário Camboriú"`,
		)
		.replace(
			'<!-- BLOG_BODY -->',
			`<div class="blog-article-body">${blogBody}</div>`,
		)
		.replace(
			'<span class="share-links-title">Tags:</span>',
			'<span class="share-links-title">Tags</span>',
		)
		.replace(
			'<a href="/blog">luxury home</a>\n                                            <a href="/blog">Strategey</a>\n                                            <a href="/blog">Villa Home</a>\n                                            <a href="/blog">Project</a>',
			(post.tags ?? [])
				.map((tag) => `<a href="/blog">${tag}</a>`)
				.join('\n                                            '),
		)
		.replace(
			'<span class="share-links-title">Share this article:</span>',
			'<span class="share-links-title">Compartilhar</span>',
		)
		.replace(
			`<div class="th-social">
                                            <a href="https://facebook.com/" target="_blank"><i class="fab fa-facebook-f"></i></a>
                                            <a href="https://twitter.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                                            <a href="https://linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                                            <a href="https://instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                                        </div><!-- End Social Share -->`,
			renderArticleShareLinksHtml(post.href, post.title),
		);

	const articleHtml = applySemanticHtml(`<!--==============================
        Blog Area
    ==============================-->
    <section class="th-blog-wrapper blog-details space-top space-extra-bottom">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-xl-10 col-xxl-9">
                    ${articleBlock}
                </div>
            </div>
        </div>
    </section>`);

	return {
		shell,
		articleHtml,
		title,
		description: getBlogPostMetaDescription(post),
		keywords: buildKeywords(title, post.category, ...(post.tags ?? []), 'blog imobiliário Balneário Camboriú'),
	};
}
