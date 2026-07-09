/**
 * Infra compartilhada de linkagem interna dos clusters de blog.
 *
 * Regra VBC: sem link interno ou externo em h2, h3 ou h4 — usar o texto de
 * conteúdo da seção.
 */

import { splitFromSecondBlogSubtitle } from './content-inline-links.mjs';
import { resolveBodyFind, assertBodyAnchorWords } from './cluster-link-anchor.mjs';

function blogHref(slug) {
	return `/blog/${slug}`;
}

function stripPropertyHubRows(html) {
	const marker = 'blog-property-hub-row';
	let result = html;
	let classIdx = result.indexOf(marker);

	while (classIdx !== -1) {
		const start = result.lastIndexOf('<div', classIdx);
		if (start === -1) {
			break;
		}

		const openEnd = result.indexOf('>', start);
		if (openEnd === -1 || openEnd < classIdx) {
			classIdx = result.indexOf(marker, classIdx + marker.length);
			continue;
		}

		let pos = openEnd + 1;
		let depth = 1;

		while (pos < result.length && depth > 0) {
			const nextDiv = result.indexOf('<div', pos);
			const nextClose = result.indexOf('</div>', pos);

			if (nextClose === -1) {
				break;
			}

			if (nextDiv !== -1 && nextDiv < nextClose) {
				depth += 1;
				pos = nextDiv + 4;
			} else {
				depth -= 1;
				pos = nextClose + 6;
			}
		}

		result = `${result.slice(0, start).trimEnd()}\n\n${result.slice(pos).trimStart()}`.replace(/^\n+/, '');
		classIdx = result.indexOf(marker);
	}

	return result;
}

/** Restos de hub removidos parcialmente pelo regex antigo de blog-related. */
function stripOrphanHubLeadFragments(html) {
	return html
		.replace(/<aside class="blog-property-hub-lead">[\s\S]*?<\/aside>\s*<\/div>\s*/g, '')
		.replace(/<aside class="blog-property-hub-lead">[\s\S]*?<\/aside>\s*/g, '');
}

export function stripRelatedBlocks(html) {
	return stripOrphanHubLeadFragments(stripPropertyHubRows(html)).replace(
		/<div class="blog-related[^"]*">[\s\S]*?<\/div>\s*/g,
		'',
	);
}

export function stripClusterBridge(html) {
	return html.replace(/<p class="blog-cluster-bridge">[\s\S]*?<\/p>\s*/g, '');
}

/** Remove todas as âncoras do corpo, preservando o texto interno. */
export function stripBodyAnchors(html) {
	let result = html;

	for (let pass = 0; pass < 8; pass += 1) {
		const next = result.replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1');
		if (next === result) {
			break;
		}
		result = next;
	}

	return result;
}

const H234_BLOCK = /<(h[2-4])\b[^>]*>[\s\S]*?<\/\1>/gi;

/** Remove âncoras dentro de h2, h3 e h4 (regra VBC). */
export function stripHeadingAnchors(html) {
	return html.replace(/<(h[2-4])\b([^>]*)>([\s\S]*?)<\/\1>/gi, (match, tag, attrs, inner) => {
		const plainInner = stripBodyAnchors(inner);
		return `<${tag}${attrs}>${plainInner}</${tag}>`;
	});
}

function forEachLinkableSegment(html, fn) {
	const segments = [];
	let lastIndex = 0;
	const re = new RegExp(H234_BLOCK.source, 'gi');
	let match = re.exec(html);

	while (match) {
		if (match.index > lastIndex) {
			segments.push({ linkable: true, html: html.slice(lastIndex, match.index) });
		}
		segments.push({ linkable: false, html: match[0] });
		lastIndex = match.index + match[0].length;
		match = re.exec(html);
	}

	if (lastIndex < html.length) {
		segments.push({ linkable: true, html: html.slice(lastIndex) });
	}

	if (!segments.length) {
		return fn(html);
	}

	return segments.map((seg) => (seg.linkable ? fn(seg.html) : seg.html)).join('');
}

function wrapLinkHtml(find, targetSlug) {
	return `<a href="${blogHref(targetSlug)}">${find}</a>`;
}

function replaceFirst(html, find, replacement) {
	if (!find || !html.includes(find) || html.includes(replacement)) {
		return html;
	}

	return html.replace(find, replacement);
}

/** Envolve trecho existente com <a>; âncora ≤3 palavras; ignora h2–h4; só a partir do 2º subtítulo. */
export function applyPlan(html, plan) {
	const { before, linkable } = splitFromSecondBlogSubtitle(html);
	if (!linkable) {
		return before;
	}

	const fullHtml = before + linkable;
	const applied = new Set();

	const linked = forEachLinkableSegment(linkable, (linkableHtml) => {
		let output = linkableHtml;

		for (const { find, target, tail = '' } of plan.links) {
			if (!find || applied.has(target)) {
				continue;
			}

			let resolvedFind;
			try {
				resolvedFind = resolveBodyFind(fullHtml, find);
			} catch {
				continue;
			}

			if (!output.includes(resolvedFind)) {
				continue;
			}

			assertBodyAnchorWords(resolvedFind);

			const anchor = wrapLinkHtml(resolvedFind, target) + tail;
			if (output.includes(anchor)) {
				applied.add(target);
				continue;
			}

			output = replaceFirst(output, resolvedFind, anchor);
			applied.add(target);
		}

		return output;
	});

	return before + linked;
}

export function splitClosing(html) {
	const closingIdx = html.indexOf('<div class="blog-article-closing">');
	if (closingIdx === -1) {
		return { body: html.trim(), closing: '' };
	}

	return {
		body: html.slice(0, closingIdx).trim(),
		closing: html.slice(closingIdx).trim(),
	};
}

const H3_SUBTITLE_OPEN = /<h3 class="blog-inner-title h4">/gi;

/** Insere o hub comercial ao fim da 2ª seção (antes do 3º h3 `blog-inner-title`). */
export function insertHubAfterSecondSubtitle(html, hubHtml) {
	if (!hubHtml?.trim()) {
		return html;
	}

	const headings = [...html.matchAll(H3_SUBTITLE_OPEN)];
	if (headings.length < 2) {
		return `${html.trim()}\n\n${hubHtml.trim()}`;
	}

	const insertAt =
		headings.length >= 3 ? headings[2].index : html.length;

	const before = html.slice(0, insertAt).trimEnd();
	const after = html.slice(insertAt).trimStart();

	return after ? `${before}\n\n${hubHtml.trim()}\n\n${after}` : `${before}\n\n${hubHtml.trim()}`;
}

