/**
 * Converte HTML editorial (h1/h2/h3) para o formato de artigo do blog Viver Catarina.
 * Uso: node scripts/convert-user-html-to-blog-html.mjs <entrada.html> <saida.html>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const sourcePath = process.argv[2];
const outPath = process.argv[3];

if (!sourcePath || !outPath) {
	console.error('Uso: node scripts/convert-user-html-to-blog-html.mjs <entrada.html> <saida.html>');
	process.exit(1);
}

function stripInternalLinks(html) {
	return html.replace(/\[LINK INTERNO:[^\]]+\]/g, '');
}

function wrapTables(html) {
	return html.replace(/<table>([\s\S]*?)<\/table>/g, (_, inner) => {
		if (inner.includes('class="table table-bordered"')) {
			return `<table class="table table-bordered">${inner}</table>`;
		}
		return `<div class="table-responsive mb-40">\n<table class="table table-bordered">${inner}</table>\n</div>`;
	});
}

function convertUserHtml(raw) {
	let html = stripInternalLinks(raw);

	// Remove h1
	html = html.replace(/<h1>[\s\S]*?<\/h1>\s*/i, '');

	// FAQ: h3 questions after "Perguntas Frequentes" section
	const parts = html.split(/(<h2[^>]*>[\s\S]*?<\/h2>)/gi);
	let inFaq = false;
	const converted = [];

	for (let i = 0; i < parts.length; i += 1) {
		const part = parts[i];
		if (/^<h2/i.test(part)) {
			const text = part.replace(/<\/?h2[^>]*>/gi, '').trim();
			if (/perguntas frequentes/i.test(text)) {
				inFaq = true;
			}
			converted.push(`<h3 class="blog-inner-title h4">${text}</h3>`);
			continue;
		}

		let chunk = part;
		if (inFaq) {
			chunk = chunk.replace(/<h3>([\s\S]*?)<\/h3>/gi, '<h4 class="blog-inner-title h5">$1</h4>');
		} else {
			chunk = chunk.replace(/<h3>([\s\S]*?)<\/h3>/gi, '<h4 class="blog-subsection-title">$1</h4>');
		}
		converted.push(chunk);
	}

	html = converted.join('');

	// h2 -> h3 (for any remaining h2 not caught above - shouldn't happen)
	html = html.replace(/<h2>([\s\S]*?)<\/h2>/gi, '<h3 class="blog-inner-title h4">$1</h3>');

	// First paragraph: bold-only or em-only -> lide
	html = html.replace(
		/^(\s*<p><strong>([\s\S]*?)<\/strong><\/p>)/,
		'<p><em>$2</em></p>',
	);
	html = html.replace(
		/^(\s*<p><em>([\s\S]*?)<\/em><\/p>)/,
		(match, _full, inner) => {
			if (converted.length && !match.includes('blog-inner-title')) {
				return `<p><em>${inner}</em></p>`;
			}
			return match;
		},
	);

	html = wrapTables(html);

	html = html
		.split('\n')
		.map((line) => line.trim())
		.filter((line, index, arr) => !(line === '' && arr[index - 1] === ''))
		.join('\n\n')
		.trim();

	return `${html}\n`;
}

const raw = readFileSync(sourcePath, 'utf8');
const html = convertUserHtml(raw);
writeFileSync(outPath, html, 'utf8');
console.log(`Written ${outPath} (${html.length} chars)`);
