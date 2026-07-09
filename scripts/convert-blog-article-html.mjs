import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sourcePath = process.argv[2];
const outPath = process.argv[3];

if (!sourcePath || !outPath) {
	console.error('Uso: node scripts/convert-blog-article-html.mjs <entrada.html> <saida.html>');
	process.exit(1);
}

/** @type {Record<string, string>} */
const RELATED_LINKS = {
	'Quanto Custa Morar em Balneário Camboriú em 2026: Tabela Completa de Aluguel e Compra por Bairro':
		'/blog/quanto-custa-morar-em-balneario-camboriu',
};

function extractHeroLide(raw) {
	const match = raw.match(/<header class="hero">[\s\S]*?<p class="lide">([\s\S]*?)<\/p>/);
	return match ? `<p>${match[1].trim()}</p>` : '';
}

function statsToTable(statsHtml) {
	const rows = [
		...statsHtml.matchAll(
			/<div class="stat"><span class="num">([\s\S]*?)<\/span><span class="lbl">([\s\S]*?)<\/span><\/div>/g,
		),
	];
	if (!rows.length) {
		return statsHtml;
	}

	const body = rows
		.map(
			([, num, lbl]) =>
				`<tr><td><strong>${num.trim()}</strong></td><td>${lbl.trim()}</td></tr>`,
		)
		.join('\n');

	return `<div class="table-responsive mb-40"><p class="blog-table-lead"><strong>Indicadores em números</strong></p><table class="table table-bordered"><thead><tr><th>Indicador</th><th>Referência</th></tr></thead><tbody>\n${body}\n</tbody></table></div>`;
}

const raw = readFileSync(sourcePath, 'utf8');
const heroLide = extractHeroLide(raw);
const mainStart = raw.indexOf('<main');
const mainEnd = raw.indexOf('</main>');
const closingStart = raw.indexOf('<section class="closing">');

if (mainStart === -1 || mainEnd === -1) {
	throw new Error('Não foi possível extrair o conteúdo principal do HTML.');
}

let html = raw.slice(mainStart, mainEnd + '</main>'.length);
if (closingStart !== -1 && closingStart < mainEnd) {
	const closingEnd = raw.indexOf('</section>', closingStart);
	if (closingEnd !== -1) {
		html += raw.slice(closingStart, closingEnd + '</section>'.length);
	}
} else if (closingStart > mainEnd) {
	const closingEnd = raw.indexOf('</section>', closingStart);
	if (closingEnd !== -1) {
		html += raw.slice(closingStart, closingEnd + '</section>'.length);
	}
}

html = html
	.replace(/<main[^>]*>/, '')
	.replace(/<\/main>/, '')
	.replace(/<section class="closing">/g, '<div class="blog-article-closing">')
	.replace(/<\/section>/g, '</div>')
	.replace(/<!--[\s\S]*?-->/g, '')
	.replace(/\sclass="lead-first"/g, '')
	.replace(/<h2 style="[^"]*">/g, '<h2>')
	.replace(/<h3>(Perguntas Frequentes[^<]*)<\/h3>/gi, '<h2>$1</h2>')
	.replace(/<h3>/g, '<h4 class="blog-subsection-title">')
	.replace(/<\/h3>/g, '</h4>')
	.replace(/<h2>/g, '<h3 class="blog-inner-title h4">')
	.replace(/<\/h2>/g, '</h3>')
	.replace(/<nav class="toc">/g, '<nav class="blog-article-toc" aria-label="Índice do artigo">')
	.replace(
		/<h4>O que você vai encontrar<\/h4>/g,
		'<p class="blog-article-toc__title">O que você vai encontrar</p>',
	)
	.replace(/<div class="tbl-wrap">/g, '<div class="table-responsive mb-40">')
	.replace(/<table class="num">/g, '<table class="table table-bordered">')
	.replace(/<table>/g, '<table class="table table-bordered">')
	.replace(/<caption>([^<]*)<\/caption>/g, '<p class="blog-table-lead"><strong>$1</strong></p>')
	.replace(
		/<div class="key">\s*<span class="k-label">([^<]*)<\/span>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g,
		'<div class="blog-callout"><p class="blog-callout__label">$1</p><p>$2</p></div>',
	)
	.replace(/<div class="related">/g, '<div class="blog-related">')
	.replace(/<h4>Leia também no guia<\/h4>/g, '<p class="blog-related__title">Leia também</p>')
	.replace(/<div class="wrap">/g, '')
	.replace(/<span class="stage-tag">[\s\S]*?<\/span>\s*/g, '')
	.replace(/<div class="cluster">[\s\S]*?<\/div>\s*/g, '')
	.replace(
		/<div class="lead-answer">\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g,
		'<div class="blog-callout"><p class="blog-callout__label">Resposta rápida</p><p>$1</p></div>',
	)
	.replace(/<div class="table-scroll">/g, '<div class="table-responsive mb-40">')
	.replace(
		/<div class="callout">\s*<h4>([^<]*)<\/h4>\s*<p>([\s\S]*?)<\/p>\s*<\/div>/g,
		'<div class="blog-callout"><p class="blog-callout__label">$1</p><p>$2</p></div>',
	)
	.replace(
		/<div class="stats">((?:\s*<div class="stat">[\s\S]*?<\/div>)+)\s*<\/div>/g,
		(_, block) => statsToTable(block),
	)
	.replace(
		/<div class="proscons">\s*<div class="pc-card pro">([\s\S]*?)<\/div>\s*<div class="pc-card con">([\s\S]*?)<\/div>\s*<\/div>/g,
		(_, proInner, conInner) => {
			const formatCard = (inner, variant) => {
				const body = inner
					.replace(/<h4>([^<]*)<\/h4>/, '<p class="blog-pros-cons__title">$1</p>')
					.trim();
				return `<div class="blog-pros-cons__box blog-pros-cons__box--${variant}">${body}</div>`;
			};
			return `<div class="blog-pros-cons">${formatCard(proInner, 'pro')}${formatCard(conInner, 'con')}</div>`;
		},
	)
	.replace(/<h4>(?![^>]*class=)/g, '<h4 class="blog-subsection-title">');

html = html.replace(/<div class="faq">([\s\S]*?)<\/div>/g, (_, faqBlock) => {
	const items = [
		...faqBlock.matchAll(
			/<details(?:\s+open)?>\s*<summary>([^<]*)<\/summary>\s*<p>([\s\S]*?)<\/p>\s*<\/details>/g,
		),
	];
	return items
		.map(
			([, question, answer]) =>
				`<h4 class="blog-inner-title h5">${question.trim()}</h4>\n<p>${answer.trim()}</p>`,
		)
		.join('\n\n');
});

for (const [label, href] of Object.entries(RELATED_LINKS)) {
	const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	html = html.replace(new RegExp(`<a href="#">${escaped}<\\/a>`, 'g'), `<a href="${href}">${label}</a>`);
}

html = html.replace(/<div class="blog-related">[\s\S]*?<\/div>/g, (block) => {
	if (block.includes('href="#"')) {
		return '';
	}
	return block;
});

html = html
	.replace(
		/<table class="table table-bordered">\s*<p class="blog-table-lead">/g,
		'<p class="blog-table-lead">',
	)
	.replace(/<\/p>\s*<thead>/g, '</p><table class="table table-bordered"><thead>')
	.replace(/\n<\/div>\n+(?=<div class="blog-article-closing">)/g, '\n\n')
	.replace(/\n<\/div>\s*$/g, '')
	.split('\n')
	.map((line) => line.trim())
	.filter((line, index, arr) => !(line === '' && arr[index - 1] === ''))
	.join('\n\n')
	.trim();

if (heroLide) {
	html = `${heroLide}\n\n${html}`;
}

writeFileSync(outPath, `${html}\n`, 'utf8');
console.log(`Written ${outPath} (${html.length} chars)`);
