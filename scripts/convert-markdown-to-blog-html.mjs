/**
 * Converte markdown editorial de artigo de blog para HTML do Viver Catarina.
 * Uso: node scripts/convert-markdown-to-blog-html.mjs <entrada.md> <saida.html>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = process.argv[2];
const outPath = process.argv[3];

if (!sourcePath || !outPath) {
	console.error('Uso: node scripts/convert-markdown-to-blog-html.mjs <entrada.md> <saida.html>');
	process.exit(1);
}

function inlineMarkdown(text) {
	return text
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>')
		.replace(/ {2,}/g, ' ')
		.replace(/ +([,.;:!?])/g, '$1');
}

function isBoldOnlyLine(line) {
	return /^\*\*[^*]+\*\*$/.test(line.trim());
}

function isItalicOnlyLine(line) {
	return /^\*[^*]+\*$/.test(line.trim());
}

function isTableLine(line) {
	return line.trim().startsWith('|');
}

function parseTable(lines, startIndex) {
	const tableLines = [];
	let i = startIndex;
	while (i < lines.length && isTableLine(lines[i])) {
		tableLines.push(lines[i]);
		i += 1;
	}

	const rows = tableLines
		.filter((line) => !/^\|[\s\-:|]+\|$/.test(line.trim()))
		.map((line) =>
			line
				.trim()
				.replace(/^\|/, '')
				.replace(/\|$/, '')
				.split('|')
				.map((cell) => cell.trim()),
		);

	if (!rows.length) {
		return { html: '', nextIndex: startIndex };
	}

	const [head, ...body] = rows;
	const thead = `<thead><tr>${head.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('')}</tr></thead>`;
	const tbody = `<tbody>${body
		.map((row) => `<tr>${row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('')}</tr>`)
		.join('')}</tbody>`;

	return {
		html: `<div class="table-responsive mb-40">\n<table class="table table-bordered">\n${thead}\n${tbody}\n</table>\n</div>`,
		nextIndex: i,
	};
}

function convertMarkdown(md) {
	let text = md
		.replace(/^={3,}[\s\S]*?={3,}\n+/m, '')
		.replace(/^# .+\n+/m, '')
		.replace(/\[LINK INTERNO:[^\]]+\]/g, '')
		.replace(/^>\s*\*\*Tema sugerido[\s\S]*?(?=\n\n|\n##|\n###|$)/gm, '')
		.replace(/^---\s*$/gm, '');

	const lines = text.split('\n');
	const blocks = [];
	let i = 0;
	let lideDone = false;
	let inFaq = false;

	while (i < lines.length) {
		const line = lines[i];
		const trimmed = line.trim();

		if (!trimmed) {
			i += 1;
			continue;
		}

		if (trimmed.startsWith('## FAQ')) {
			inFaq = true;
		}

		if (isTableLine(trimmed)) {
			const { html, nextIndex } = parseTable(lines, i);
			if (html) {
				blocks.push(html);
			}
			i = nextIndex;
			continue;
		}

		if (trimmed.startsWith('## ')) {
			blocks.push(`<h3 class="blog-inner-title h4">${inlineMarkdown(trimmed.slice(3))}</h3>`);
			i += 1;
			continue;
		}

		if (trimmed.startsWith('### ')) {
			blocks.push(`<h4 class="blog-subsection-title">${inlineMarkdown(trimmed.slice(4))}</h4>`);
			i += 1;
			continue;
		}

		if (trimmed.startsWith('- ')) {
			const items = [];
			while (i < lines.length && lines[i].trim().startsWith('- ')) {
				items.push(`<li>${inlineMarkdown(lines[i].trim().slice(2))}</li>`);
				i += 1;
			}
			blocks.push(`<ul>\n${items.join('\n')}\n</ul>`);
			continue;
		}

		if (inFaq && isBoldOnlyLine(trimmed)) {
			const question = trimmed.replace(/^\*\*|\*\*$/g, '');
			blocks.push(`<h4 class="blog-inner-title h5">${inlineMarkdown(question)}</h4>`);
			i += 1;
			continue;
		}

		if (!lideDone && isBoldOnlyLine(trimmed)) {
			const lide = trimmed.replace(/^\*\*|\*\*$/g, '');
			blocks.push(`<p><em>${inlineMarkdown(lide)}</em></p>`);
			lideDone = true;
			i += 1;
			continue;
		}

		if (isItalicOnlyLine(trimmed)) {
			blocks.push(`<p><em>${inlineMarkdown(trimmed.slice(1, -1))}</em></p>`);
			i += 1;
			continue;
		}

		const paragraphLines = [trimmed];
		i += 1;
		while (i < lines.length) {
			const next = lines[i].trim();
			if (
				!next ||
				next.startsWith('## ') ||
				next.startsWith('### ') ||
				next.startsWith('- ') ||
				isTableLine(next) ||
				/^\*\*[^*]+\*\*$/.test(next)
			) {
				break;
			}
			paragraphLines.push(next);
			i += 1;
		}

		const paragraph = inlineMarkdown(paragraphLines.join(' '));
		blocks.push(`<p>${paragraph}</p>`);
	}

	return `${blocks.join('\n\n')}\n`;
}

const md = readFileSync(sourcePath, 'utf8');
const html = convertMarkdown(md);
writeFileSync(outPath, html, 'utf8');
console.log(`Written ${outPath} (${html.length} chars)`);
