/**
 * Extrai artigos do cluster Barra (≠ Barra Sul), converte HTML e publica em src/content/blog.
 * Uso: node scripts/publish-barra-articles.mjs [caminho-transcript.jsonl|arquivo-texto]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { convertUserHtml } from './convert-user-html-to-blog-html-lib.mjs';

const transcriptPath =
	'/Users/marceloneves/.cursor/projects/Users-marceloneves-Projetos-GIT-balneario-vivercatarina-com/agent-transcripts/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433.jsonl';

const ARTICLE_META = [
	{
		slug: 'morar-na-barra-balneario-camboriu-guia-completo',
		title: 'Morar na Barra: Guia do Bairro à Beira do Rio Camboriú em Balneário Camboriú',
		excerpt:
			'Morar na Barra significa viver à beira do Rio Camboriú, com tradição pesqueira, praias reservadas e valorização crescente, longe da verticalização extrema do Centro e distinto da Barra Sul.',
		metaDescription:
			'Guia completo para morar na Barra de BC: localização, imóveis, preços, prós e contras, investimento, custo de vida e FAQ sobre o bairro à beira do Rio Camboriú.',
		datePublished: '2026-08-01',
		imageNum: 69,
		tags: ['Balneário Camboriú', 'Barra', 'Moradia', 'Imóveis'],
		match: /MORAR NA BARRA: GUIA DO BAIRRO À BEIRA DO RIO/i,
	},
	{
		slug: 'preco-m2-barra-balneario-camboriu-quanto-custa',
		title: 'Preço do m² na Barra: Quanto Custa Comprar um Imóvel à Beira do Rio Camboriú',
		excerpt:
			'O preço do m² na Barra varia entre R$ 8 mil e R$ 16 mil ou mais, refletindo a escassez de terrenos à beira do Rio Camboriú e a valorização do bairro histórico de Balneário Camboriú.',
		metaDescription:
			'Preço do m² na Barra: faixas por tipologia, comparativos com outros bairros, terrenos, custos extras e FAQ para compradores no bairro à beira do rio.',
		datePublished: '2026-08-03',
		imageNum: 70,
		tags: ['Balneário Camboriú', 'Barra', 'Preço m²', 'Imóveis'],
		match: /PREÇO DO M² NA BARRA: QUANTO CUSTA COMPRAR/i,
	},
	{
		slug: 'apartamentos-a-venda-barra-balneario-camboriu',
		title: 'Apartamentos à Venda na Barra: O Que Esperar por Faixa de Preço em BC',
		excerpt:
			'Apartamentos à venda na Barra partem de cerca de R$ 450 mil em unidades compactas e sobem até R$ 6 milhões ou mais em alto padrão com vista para o rio ou o mar.',
		metaDescription:
			'Apartamentos à venda na Barra: faixas de entrada, intermediária e luxo, tipologias, comparativos, custos extras e FAQ para comprar no bairro à beira do Rio Camboriú.',
		datePublished: '2026-08-05',
		imageNum: 71,
		tags: ['Balneário Camboriú', 'Barra', 'Apartamentos', 'Imóveis'],
		match: /APARTAMENTOS À VENDA NA BARRA: O QUE ESPERAR/i,
	},
	{
		slug: 'barra-balneario-camboriu-e-bom-para-morar',
		title: 'Barra é Bom para Morar? Prós e Contras de Viver à Beira do Rio Camboriú',
		excerpt:
			'A Barra entrega tranquilidade, contato com rio e mar e valorização patrimonial, mas exige atenção a acesso, dependência de carro e comércio limitado dentro do bairro.',
		metaDescription:
			'A Barra é bom para morar? Prós, contras, perfil de morador, faixas de preço, comparativos e FAQ honesto sobre moradia no bairro à beira do Rio Camboriú.',
		datePublished: '2026-08-07',
		imageNum: 72,
		tags: ['Balneário Camboriú', 'Barra', 'Moradia', 'Qualidade de Vida'],
		match: /BARRA É BOM PARA MORAR\? PRÓS E CONTRAS/i,
	},
	{
		slug: 'custo-de-vida-barra-balneario-camboriu-quanto-custa-morar',
		title: 'Custo de Vida na Barra: Quanto Custa Morar no Bairro à Beira do Rio Camboriú',
		excerpt:
			'Morar na Barra custa em média entre R$ 4.500 e R$ 9.000 por mês para casal, com moradia, transporte e estilo de vida como principais variáveis do orçamento.',
		metaDescription:
			'Custo de vida na Barra: aluguel, condomínio, alimentação, transporte, faixas mensais por perfil e FAQ sobre quanto custa morar à beira do Rio Camboriú.',
		datePublished: '2026-08-09',
		imageNum: 73,
		tags: ['Balneário Camboriú', 'Barra', 'Custo de Vida', 'Moradia'],
		match: /CUSTO DE VIDA NA BARRA: QUANTO CUSTA MORAR/i,
	},
];

function extractArticlesFromTranscript(text) {
	const articles = [];
	const articleRegex =
		/={30}\nARTIGO: ([^\n]+)\nGerado em:[^\n]+\n={30}\n([\s\S]*?)(?=\n={30}\nARTIGO:|$)/g;
	let match;
	while ((match = articleRegex.exec(text)) !== null) {
		articles.push({ header: match[1].trim(), content: match[2].trim() });
	}
	return articles;
}

function isBarraClusterMessage(text) {
	if (!text.includes('ARTIGO:') || !text.includes('MORAR NA BARRA')) {
		return false;
	}
	if (text.includes('Barra Sul') && !text.includes('novo cluster Barra') && !text.includes('cluster Barra')) {
		return false;
	}
	return (
		text.includes('novo cluster Barra') ||
		text.includes('cluster novo: Barra') ||
		text.includes('cluster Barra') ||
		text.includes('Não são artigos do cluster Barra Sul')
	);
}

function findUserMessageText(path) {
	const lines = readFileSync(path, 'utf8').trim().split('\n');
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const row = JSON.parse(lines[i]);
		if (row.role !== 'user') continue;
		const text = row.message?.content?.find((c) => c.type === 'text')?.text ?? '';
		if (isBarraClusterMessage(text)) {
			return text;
		}
	}
	throw new Error('Mensagem com artigos da Barra não encontrada no transcript');
}

function loadSourceText(argPath) {
	if (argPath && existsSync(argPath)) {
		return readFileSync(argPath, 'utf8');
	}
	try {
		return findUserMessageText(transcriptPath);
	} catch {
		const fallback = join(process.cwd(), 'scripts/_sources/barra/import-message.txt');
		if (existsSync(fallback)) {
			return readFileSync(fallback, 'utf8');
		}
		throw new Error('Fonte dos artigos da Barra não encontrada');
	}
}

const blogDir = join(process.cwd(), 'src/content/blog');
const imgDir = join(process.cwd(), 'public/assets/img/blog');
const sourcesDir = join(process.cwd(), 'scripts/_sources/barra');
mkdirSync(sourcesDir, { recursive: true });

const userText = loadSourceText(process.argv[2]);
const extracted = extractArticlesFromTranscript(userText);
console.log(`Encontrados ${extracted.length} artigos na fonte`);

const published = [];

for (const meta of ARTICLE_META) {
	const source = extracted.find((a) => meta.match.test(a.header));
	if (!source) {
		console.error(`Artigo não encontrado: ${meta.slug} (${meta.match})`);
		process.exitCode = 1;
		continue;
	}

	const rawHtml = source.content;
	const sourcePath = join(sourcesDir, `${meta.slug}.html`);
	writeFileSync(sourcePath, rawHtml, 'utf8');

	const outPath = join(blogDir, `${meta.slug}.html`);
	const html = convertUserHtml(rawHtml);
	writeFileSync(outPath, html, 'utf8');

	const imgName = `blog_1_${meta.imageNum}.webp`;
	const imgPath = join(imgDir, imgName);
	if (!existsSync(imgPath)) {
		const fallback = join(imgDir, `blog_1_${((meta.imageNum - 1) % 32) + 1}.webp`);
		copyFileSync(fallback, imgPath);
		console.log(`Imagem criada: ${imgName} (cópia de fallback)`);
	}

	published.push({
		...meta,
		imageUrl: `/assets/img/blog/${imgName}`,
		dateUpdated: meta.datePublished,
		href: `/blog/${meta.slug}`,
	});
	console.log(`Publicado: ${meta.slug} (${html.length} chars)`);
}

writeFileSync(join(sourcesDir, 'published-meta.json'), JSON.stringify(published, null, 2), 'utf8');
console.log(`\nMeta salva em scripts/_sources/barra/published-meta.json (${published.length} artigos)`);
