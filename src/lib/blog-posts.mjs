import { enrichBlogPost } from './blog-clusters.mjs';
import { buildMetaDescription } from './site-seo.mjs';

export const BLOG_POSTS = [];

export function getBlogPosts() {
	return BLOG_POSTS.map((post) => enrichBlogPost(post));
}

export function getBlogPost(slug) {
	const post = BLOG_POSTS.find((entry) => entry.slug === slug);

	return post ? enrichBlogPost(post) : null;
}

export function getBlogPostMetaDescription(post) {
	if (!post) {
		return '';
	}

	if (post.metaDescription) {
		return buildMetaDescription('', post.metaDescription);
	}

	const keyword = getBlogPostSeoKeyword(post);

	return buildMetaDescription(keyword, post.excerpt);
}

function getBlogPostSeoKeyword(post) {
	const shortTitle = post.title.includes(':')
		? post.title.split(':')[0].trim()
		: post.title.trim();

	if (shortTitle.length <= 72) {
		return shortTitle;
	}

	return post.category ? `${post.category} Balneário Camboriú` : 'imóveis na planta em Balneário Camboriú';
}
