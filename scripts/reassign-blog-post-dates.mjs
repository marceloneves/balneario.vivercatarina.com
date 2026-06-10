/**
 * Reatribui datePublished (2 artigos/dia a partir de 01/01/2026) e dateUpdated (hoje).
 * Ordem de criação: do artigo mais antigo no array (final) ao mais recente (início).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { formatBlogDatePtBr } from '../src/lib/blog-date.mjs';
import { BLOG_POSTS } from '../src/lib/blog-posts.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsPath = join(__dirname, '../src/lib/blog-posts.mjs');

const START_DATE = new Date(2026, 0, 1);
const UPDATED_ISO = process.env.BLOG_DATE_UPDATED ?? '2026-06-06';

function addDays(base, offset) {
	const d = new Date(base);
	d.setDate(d.getDate() + offset);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

const chronological = [...BLOG_POSTS].reverse();
const dateBySlug = new Map();

chronological.forEach((post, index) => {
	const dayOffset = Math.floor(index / 2);
	const datePublished = addDays(START_DATE, dayOffset);
	dateBySlug.set(post.slug, {
		datePublished,
		dateLabel: formatBlogDatePtBr(datePublished),
		dateUpdated: UPDATED_ISO,
		dateUpdatedLabel: formatBlogDatePtBr(UPDATED_ISO),
	});
});

let source = readFileSync(postsPath, 'utf8');

for (const post of BLOG_POSTS) {
	const dates = dateBySlug.get(post.slug);
	if (!dates) {
		continue;
	}

	const slugMarker = `slug: '${post.slug}'`;
	const slugIndex = source.indexOf(slugMarker);
	if (slugIndex === -1) {
		throw new Error(`Slug não encontrado: ${post.slug}`);
	}

	const blockEnd = source.indexOf('\n\t},', slugIndex);
	if (blockEnd === -1) {
		throw new Error(`Bloco não encontrado: ${post.slug}`);
	}

	let block = source.slice(slugIndex, blockEnd);

	block = block
		.replace(/dateLabel: '[^']*'/, `dateLabel: '${dates.dateLabel}'`)
		.replace(/datePublished: '[^']*'/, `datePublished: '${dates.datePublished}'`);

	if (/dateUpdated:/.test(block)) {
		block = block
			.replace(/dateUpdatedLabel: '[^']*'/, `dateUpdatedLabel: '${dates.dateUpdatedLabel}'`)
			.replace(/dateUpdated: '[^']*'/, `dateUpdated: '${dates.dateUpdated}'`);
	} else {
		block = block.replace(
			/datePublished: '[^']*',/,
			`datePublished: '${dates.datePublished}',\n\t\tdateUpdated: '${dates.dateUpdated}',\n\t\tdateUpdatedLabel: '${dates.dateUpdatedLabel}',`,
		);
	}

	source = source.slice(0, slugIndex) + block + source.slice(blockEnd);
}

writeFileSync(postsPath, source, 'utf8');

const first = dateBySlug.get(chronological[0].slug);
const last = dateBySlug.get(chronological[chronological.length - 1].slug);
console.log(`Atualizados ${BLOG_POSTS.length} artigos.`);
console.log(`Criação: ${first.datePublished} → ${last.datePublished} (2/dia)`);
console.log(`Atualização: ${UPDATED_ISO}`);
