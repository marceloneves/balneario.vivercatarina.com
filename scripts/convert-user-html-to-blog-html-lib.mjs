/**
 * Biblioteca compartilhada de conversão HTML editorial -> formato blog.
 */
const INTERNAL_LINK = String.raw`\[LINK INTERNO:[^\]]+\]`;

/** Remove CTAs editoriais que só existiam para abrigar links internos. */
function stripInternalLinkCtas(html) {
	const replacements = [
		[
			new RegExp(
				`Para entender o conjunto completo dessa região, vale conhecer o panorama detalhado em\\s*${INTERNAL_LINK}`,
				'gi',
			),
			'Para entender o conjunto completo dessa região, vale conhecer o panorama detalhado do bairro',
		],
		[
			new RegExp(
				`recomendamos a leitura do nosso conteúdo principal\\s*${INTERNAL_LINK},\\s*que aprofunda`,
				'gi',
			),
			'vale observar como',
		],
		[new RegExp(`tema central do nosso\\s*${INTERNAL_LINK}`, 'gi'), 'tema central do bairro'],
		[
			new RegExp(`tema que aprofundamos no nosso\\s*${INTERNAL_LINK}`, 'gi'),
			'tema que aprofundamos neste guia',
		],
		[
			new RegExp(`vale percorrer o guia completo em\\s*${INTERNAL_LINK}\\s+e seguir`, 'gi'),
			'vale seguir',
		],
		[
			new RegExp(`guia principal em\\s*${INTERNAL_LINK}\\s+e nos demais`, 'gi'),
			'nos demais',
		],
		[
			new RegExp(`Para entender o contexto completo do bairro, vale conferir o guia\\s*${INTERNAL_LINK}`, 'gi'),
			'Para entender o contexto completo do bairro, vale conferir o guia principal',
		],
		[
			new RegExp(`vale conferir o guia\\s*${INTERNAL_LINK}`, 'gi'),
			'vale conferir o guia principal',
		],
	];

	const removals = [
		new RegExp(`o conteúdo sobre\\s*${INTERNAL_LINK}\\s+complementa`, 'gi'),
		new RegExp(`o conteúdo sobre\\s*${INTERNAL_LINK}\\s+aprofunda`, 'gi'),
		new RegExp(`Quem deseja aprofundar[^.]{0,120}?pode consultar\\s*${INTERNAL_LINK}`, 'gi'),
		new RegExp(`Quem busca aprofundar[^.]{0,120}?pode consultar\\s*${INTERNAL_LINK}`, 'gi'),
		new RegExp(`tema explorado em profundidade em\\s*${INTERNAL_LINK}`, 'gi'),
		new RegExp(`tema diretamente conectado a\\s*${INTERNAL_LINK}`, 'gi'),
		new RegExp(
			`(?:,\\s*)?(?:Para[^.<]{0,200}?,\\s*)?(?:vale (?:conferir(?:\\s+também)?|explorar|consultar)(?:\\s+(?:o guia(?:\\s+completo)?(?:\\s+em)?|em profundidade)?)?|recomendamos a leitura do nosso conteúdo principal|guia completo em|revisitar o guia completo em|aprofundar a leitura em|conferir o panorama completo em)\\s*${INTERNAL_LINK}\\.?`,
			'gi',
		),
	];

	let output = html;
	for (const [pattern, replacement] of replacements) {
		output = output.replace(pattern, replacement);
	}
	for (const pattern of removals) {
		output = output.replace(pattern, '');
	}

	return output;
}

export function stripInternalLinks(html) {
	let output = stripInternalLinkCtas(html);
	output = output.replace(/\s*\[LINK INTERNO:[^\]]+\]/g, '');
	output = output.replace(/,\s*\./g, '.');
	output = output.replace(/\s+\./g, '.');
	output = output.replace(/\s{2,}/g, ' ');
	return output;
}

export function wrapTables(html) {
	return html.replace(/<table>([\s\S]*?)<\/table>/g, (_, inner) => {
		if (inner.includes('class="table table-bordered"')) {
			return `<table class="table table-bordered">${inner}</table>`;
		}
		return `<div class="table-responsive mb-40">\n<table class="table table-bordered">${inner}</table>\n</div>`;
	});
}

export function convertUserHtml(raw) {
	let html = stripInternalLinks(raw);
	html = html.replace(/<h1>[\s\S]*?<\/h1>\s*/i, '');

	const segments = html.split(/(?=<h2>)/i);
	const converted = [];
	let inFaq = false;

	for (const segment of segments) {
		if (!segment.trim()) continue;

		let chunk = segment;
		const h2Match = chunk.match(/^<h2>([\s\S]*?)<\/h2>/i);
		if (h2Match) {
			const title = h2Match[1].trim();
			if (/perguntas frequentes/i.test(title)) {
				inFaq = true;
			}
			chunk = chunk.replace(/^<h2>[\s\S]*?<\/h2>/i, `<h3 class="blog-inner-title h4">${title}</h3>`);
		}

		if (inFaq) {
			chunk = chunk.replace(/<h3>([\s\S]*?)<\/h3>/gi, '<h4 class="blog-inner-title h5">$1</h4>');
		} else {
			chunk = chunk.replace(/<h3>([\s\S]*?)<\/h3>/gi, '<h4 class="blog-subsection-title">$1</h4>');
		}

		converted.push(chunk);
	}

	html = converted.join('');

	html = html.replace(
		/^(\s*<p><strong>([\s\S]*?)<\/strong><\/p>)/,
		'<p><em>$2</em></p>',
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
