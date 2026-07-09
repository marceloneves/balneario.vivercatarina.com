function stripHtml(html) {
	return html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() ?? '';
}

function isPriceOrListingBlock(text) {
	const value = text.trim();
	if (!value) {
		return true;
	}

	if (value.length < 18) {
		return true;
	}

	if (/^entrada\s*(\+|a partir|$)/i.test(value) && value.length < 140) {
		return true;
	}

	if (/^valores e disponibilidade/i.test(value)) {
		return true;
	}

	if (/^condi[çc][õo]es de pagamento/i.test(value)) {
		return true;
	}

	if (/^valores atualizados em/i.test(value)) {
		return true;
	}

	if (/^imagens ilustrativas/i.test(value)) {
		return true;
	}

	if (/^aceita ve[ií]culo como parte/i.test(value)) {
		return true;
	}

	if (/^estuda-se im[oó]vel/i.test(value)) {
		return true;
	}

	if (/^ou r\$\s/i.test(value)) {
		return true;
	}

	if (/a partir de\s*R\$/i.test(value) && /m²|m2|dormit|quarto|su[ií]te|studio|st[uú]dio|loft|vaga|garagem/i.test(value)) {
		return true;
	}

	if (/^torre [AB]\s*[—–-]/i.test(value)) {
		return true;
	}

	if (/^(apartamento|studio|st[uú]dio|loft|est[uú]dio|unidade)\s+(com|de)\s+/i.test(value) && /R\$|m²|m2/i.test(value)) {
		return true;
	}

	if (
		/^(infraestrutura|localiza[çc][ãa]o premium|acabamentos|unidades|por que escolher|modelo de aquisi[çc][ãa]o)/i.test(
			value,
		) &&
		value.length < 90
	) {
		return true;
	}

	if (/^[🏡🛋️🌇🌴📍✔✨🏊🌅🎯]/u.test(value) && value.length < 120) {
		return true;
	}

	return false;
}

function extractBlocks(html) {
	const blocks = [];

	for (const match of html.matchAll(/<(p|h[1-6]|li)[^>]*>([\s\S]*?)<\/\1>/gi)) {
		const inner = match[2].trim();
		if (inner) {
			blocks.push({ tag: match[1].toLowerCase(), html: inner });
		}
	}

	return blocks;
}

function distributeIntoGroups(items, groupCount) {
	if (items.length === 0) {
		return [];
	}

	const groups = Array.from({ length: groupCount }, () => ({
		blocks: [],
		weight: 0,
	}));

	for (const block of items) {
		const target = groups.reduce((lightest, group) =>
			group.weight < lightest.weight ? group : lightest,
		);
		const weight = stripHtml(block.html).length;
		target.blocks.push(block);
		target.weight += weight;
	}

	return groups.map((group) => group.blocks).filter((group) => group.length > 0);
}

function blockToInlineHtml(html) {
	return html
		.replace(/<\/?p[^>]*>/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function wrapParagraph(html) {
	const inline = blockToInlineHtml(html);
	if (!inline) {
		return '';
	}

	return `<p>${inline}</p>`;
}

/**
 * Resume a descrição do imóvel em 2–3 parágrafos usando o texto já existente.
 * Remove blocos de preço, tabelas de tipologia e avisos legais curtos.
 */
export function summarizePropertyDescriptionHtml(html, { minParagraphs = 2, maxParagraphs = 3 } = {}) {
	if (!html?.trim()) {
		return html;
	}

	const blocks = extractBlocks(html).filter((block) => !isPriceOrListingBlock(stripHtml(block.html)));
	const proseBlocks = blocks.filter((block) => stripHtml(block.html).length >= 35);

	const candidates = proseBlocks.length > 0 ? proseBlocks : blocks.filter((block) => stripHtml(block.html).length >= 25);

	if (candidates.length === 0) {
		return '';
	}

	if (candidates.length <= maxParagraphs) {
		return candidates.map((block) => wrapParagraph(block.html)).join('\n');
	}

	const targetCount = Math.min(maxParagraphs, Math.max(minParagraphs, 3));
	const groups = distributeIntoGroups(candidates, targetCount);

	return groups
		.map((group) => wrapParagraph(group.map((block) => block.html).join(' ')))
		.filter(Boolean)
		.join('\n');
}