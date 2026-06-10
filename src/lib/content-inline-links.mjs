/** @typedef {{ text: string, href: string, caseSensitive?: boolean, linkClass?: string }} LinkRule */

const SKIP_TAG_NAMES = new Set(['script', 'style', 'pre', 'code', 'noscript', 'textarea']);
const HEADING_SKIP_OPEN = /^<h[2-4]\b/i;
const HEADING_SKIP_CLOSE = /^<\/h[2-4]>/i;
const SKIP_LINK_CLASSES = ['blog-inner-title', 'blog-subsection-title', 'glossary-term'];
const BLOG_SUBTITLE_OPEN = /<h3 class="blog-inner-title h4">/gi;
const BLOG_RELATED_OPEN = /<div class="blog-related"/gi;
const BLOG_RELATED_PLACEHOLDER_PREFIX = '<!--BLOG_RELATED_BLOCK_';

/** Conteúdo a partir do 2º h3 `blog-inner-title` (linkável no cluster). */
export function splitFromSecondBlogSubtitle(html) {
	const headings = [...html.matchAll(BLOG_SUBTITLE_OPEN)];
	if (headings.length < 2) {
		return { before: html, linkable: '' };
	}

	const splitAt = headings[1].index;
	return {
		before: html.slice(0, splitAt),
		linkable: html.slice(splitAt),
	};
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildLinkRegex(rule) {
	const escaped = escapeRegex(rule.text);

	if (rule.caseSensitive) {
		return new RegExp(`(?<![\\wÀ-ú])(${escaped})(?![\\wÀ-ú])`);
	}

	return new RegExp(`(?<![\\wÀ-ú])(${escaped})(?![\\wÀ-ú])`, 'i');
}

function splitOutsideAnchors(html) {
	return html.split(/(<a\b[^>]*>[\s\S]*?<\/a>)/gi).map((part) => ({
		linked: /^<a\b/i.test(part),
		content: part,
	}));
}

function applyRuleOutsideAnchors(html, rule, linkedCounts) {
	const regex = buildLinkRegex(rule);
	const maxPerHref = rule.maxPerHref ?? Infinity;
	const currentCount = linkedCounts.get(rule.href) ?? 0;

	if (currentCount >= maxPerHref) {
		return html;
	}

	return splitOutsideAnchors(html)
		.map(({ linked, content }) => {
			if (linked || !regex.test(content)) {
				return content;
			}

			const used = linkedCounts.get(rule.href) ?? 0;
			if (used >= maxPerHref) {
				return content;
			}

			const classAttr = rule.linkClass ? ` class="${rule.linkClass}"` : '';
			const replaced = content.replace(regex, `<a href="${rule.href}"${classAttr}>$1</a>`);

			if (replaced !== content) {
				linkedCounts.set(rule.href, used + 1);
			}

			return replaced;
		})
		.join('');
}

function opensNoLinkZone(tag) {
	if (!tag.startsWith('<') || tag.startsWith('</')) {
		return false;
	}

	const tagNameMatch = tag.match(/^<(\w+)/);
	if (tagNameMatch && SKIP_TAG_NAMES.has(tagNameMatch[1].toLowerCase())) {
		return true;
	}

	if (HEADING_SKIP_OPEN.test(tag)) {
		return true;
	}

	return SKIP_LINK_CLASSES.some((className) =>
		new RegExp(`class="[^"]*\\b${className}\\b`, 'i').test(tag),
	);
}

function closesNoLinkZone(tag) {
	if (!tag.startsWith('</')) {
		return false;
	}

	const match = tag.match(/^<\/(\w+)/);
	if (!match) {
		return false;
	}

	const tagName = match[1].toLowerCase();

	return SKIP_TAG_NAMES.has(tagName) || HEADING_SKIP_CLOSE.test(tag);
}

function opensAnchor(tag) {
	return /^<a\b/i.test(tag);
}

function closesAnchor(tag) {
	return /^<\/a>/i.test(tag);
}

function extractBlogRelatedBlocks(html) {
	const blocks = [];
	let stripped = html;
	let searchFrom = 0;

	while (true) {
		BLOG_RELATED_OPEN.lastIndex = searchFrom;
		const match = BLOG_RELATED_OPEN.exec(stripped);
		if (!match) {
			break;
		}

		const start = match.index;
		let depth = 1;
		let cursor = stripped.indexOf('>', start) + 1;

		while (cursor < stripped.length && depth > 0) {
			const nextOpen = stripped.indexOf('<div', cursor);
			const nextClose = stripped.indexOf('</div>', cursor);

			if (nextClose === -1) {
				break;
			}

			if (nextOpen !== -1 && nextOpen < nextClose) {
				depth += 1;
				cursor = nextOpen + 4;
				continue;
			}

			depth -= 1;
			cursor = nextClose + 6;
		}

		const block = stripped.slice(start, cursor);
		const index = blocks.length;
		blocks.push(block);
		const placeholder = `${BLOG_RELATED_PLACEHOLDER_PREFIX}${index}-->`;
		stripped = stripped.slice(0, start) + placeholder + stripped.slice(cursor);
		searchFrom = start + placeholder.length;
	}

	return { stripped, blocks };
}

function restoreBlogRelatedBlocks(html, blocks) {
	return blocks.reduce(
		(result, block, index) =>
			result.replace(`${BLOG_RELATED_PLACEHOLDER_PREFIX}${index}-->`, block),
		html,
	);
}

function linkifyTextNode(text, rules, linkedCounts) {
	if (!text.trim()) {
		return text;
	}

	let result = text;

	for (const rule of rules) {
		result = applyRuleOutsideAnchors(result, rule, linkedCounts);
	}

	return result;
}

/** @param {string} html @param {LinkRule[]} rules @param {{ skipHeadings?: boolean, maxOncePerHref?: boolean, skipBeforeSecondSubtitle?: boolean }} [options] */
export function linkifyHtmlContent(html, rules, options = {}) {
	if (!html || !rules.length) {
		return html;
	}

	const { skipHeadings = true, maxOncePerHref = false, skipBeforeSecondSubtitle = false } = options;

	if (skipBeforeSecondSubtitle) {
		const { before, linkable } = splitFromSecondBlogSubtitle(html);
		if (!linkable) {
			return before;
		}

		return (
			before +
			linkifyHtmlContent(linkable, rules, {
				...options,
				skipBeforeSecondSubtitle: false,
			})
		);
	}
	const { stripped, blocks } = extractBlogRelatedBlocks(html);
	const linkedCounts = new Map();
	const effectiveRules = maxOncePerHref
		? rules.map((rule) => ({ ...rule, maxPerHref: 1 }))
		: rules;
	const parts = stripped.split(/(<[^>]+>)/);
	let skipLinkifyDepth = 0;
	let anchorDepth = 0;

	const linkified = parts
		.map((part) => {
			if (part.startsWith('<')) {
				if (opensAnchor(part)) {
					anchorDepth += 1;
				} else if (closesAnchor(part) && anchorDepth > 0) {
					anchorDepth -= 1;
				}

				if (skipHeadings && opensNoLinkZone(part)) {
					skipLinkifyDepth += 1;
				} else if (skipHeadings && closesNoLinkZone(part) && skipLinkifyDepth > 0) {
					skipLinkifyDepth -= 1;
				}

				return part;
			}

			if (skipLinkifyDepth > 0 || anchorDepth > 0) {
				return part;
			}

			return linkifyTextNode(part, effectiveRules, linkedCounts);
		})
		.join('');

	return restoreBlogRelatedBlocks(linkified, blocks);
}
