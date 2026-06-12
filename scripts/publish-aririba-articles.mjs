/**
 * Extrai artigos do cluster Ariribá, converte HTML e publica em src/content/blog.
 * Uso: node scripts/publish-aririba-articles.mjs [caminho-transcript.jsonl]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { convertUserHtml } from './convert-user-html-to-blog-html-lib.mjs';

const transcriptPath =
	process.argv[2] ||
	'/Users/marceloneves/.cursor/projects/Users-marceloneves-Projetos-GIT-balneario-vivercatarina-com/agent-transcripts/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433.jsonl';

const ARTICLE_META = [
	{
		slug: 'morar-no-aririba-balneario-camboriu-guia-completo',
		title: 'Morar no Ariribá: Guia do Bairro que Mais Valorizou em BC',
		excerpt:
			'Morar no Ariribá significa viver em um dos bairros de maior valorização de Balneário Camboriú, com Praia do Ariribá, infraestrutura completa e forte potencial de retorno sobre investimento.',
		metaDescription:
			'Guia completo para morar no Ariribá: valorização, preços, perfil dos imóveis, prós e contras, custo de vida, investimento e FAQ sobre o bairro que mais valorizou em BC.',
		datePublished: '2026-07-04',
		imageNum: 57,
		tags: ['Balneário Camboriú', 'Ariribá', 'Moradia', 'Imóveis'],
		match: /MORAR NO ARIRIBÁ: GUIA DO BAIRRO QUE MAIS VALORIZOU/i,
	},
	{
		slug: 'preco-m2-aririba-balneario-camboriu-quanto-custa',
		title: 'Preço do m² no Ariribá: O Bairro Líder de Valorização de BC',
		excerpt:
			'O preço do m² no Ariribá varia entre R$ 9 mil e R$ 20 mil ou mais, refletindo o bairro de maior valorização percentual de Balneário Camboriú nos últimos anos.',
		metaDescription:
			'Preço do m² no Ariribá: faixas por tipologia, comparativos com outros bairros, fatores de precificação, cenários de investimento e FAQ para compradores.',
		datePublished: '2026-07-06',
		imageNum: 58,
		tags: ['Balneário Camboriú', 'Ariribá', 'Preço m²', 'Imóveis'],
		match: /PREÇO DO M² NO ARIRIBÁ: O BAIRRO LÍDER/i,
	},
	{
		slug: 'apartamentos-a-venda-aririba-balneario-camboriu',
		title: 'Apartamentos à Venda no Ariribá: O Que Esperar por Faixa de Preço',
		excerpt:
			'Comprar apartamento no Ariribá exige entender faixas de R$ 600 mil a R$ 6 milhões ou mais, conforme distância da praia, padrão construtivo e tipologia do imóvel.',
		metaDescription:
			'Apartamentos à venda no Ariribá: faixas de entrada, intermediária e premium, tipologias, comparativos, custos extras e FAQ para comprar no bairro valorizado.',
		datePublished: '2026-07-08',
		imageNum: 59,
		tags: ['Balneário Camboriú', 'Ariribá', 'Apartamentos', 'Imóveis'],
		match: /APARTAMENTOS À VENDA NO ARIRIBÁ/i,
	},
	{
		slug: 'vale-a-pena-investir-aririba-balneario-camboriu',
		title: 'Investir no Ariribá: Por Que a Valorização de 28% em 2025 Coloca o Bairro no Radar',
		excerpt:
			'Investir no Ariribá combina valorização acelerada, ticket de entrada mais acessível que a orla central e demanda por locação em um dos bairros que mais crescem em BC.',
		metaDescription:
			'Vale a pena investir no Ariribá? Análise da valorização de 28% em 2025, faixas de preço, cenários de retorno, riscos e FAQ para investidores imobiliários.',
		datePublished: '2026-07-10',
		imageNum: 60,
		tags: ['Balneário Camboriú', 'Ariribá', 'Investimento', 'Imóveis'],
		match: /VALE A PENA INVESTIR NO ARIRIBÁ/i,
	},
	{
		slug: 'aluguel-aririba-balneario-camboriu-valores-mercado',
		title: 'Aluguel no Ariribá: Valores e Mercado no Bairro Mais Valorizado de BC',
		excerpt:
			'O aluguel no Ariribá varia de R$ 1.800 a R$ 25.000 ou mais por mês, com forte demanda anual e picos expressivos de temporada próximos à praia.',
		metaDescription:
			'Aluguel no Ariribá: valores anuais e de temporada, tipologias, custo total de ocupação, comparativos e FAQ sobre locação no bairro valorizado.',
		datePublished: '2026-07-12',
		imageNum: 61,
		tags: ['Balneário Camboriú', 'Ariribá', 'Aluguel', 'Temporada'],
		match: /ALUGUEL NO ARIRIBÁ: VALORES E MERCADO/i,
	},
	{
		slug: 'aririba-balneario-camboriu-e-bom-para-morar',
		title: 'Ariribá é Bom para Morar? Prós e Contras do Bairro que Conquistou BC',
		excerpt:
			'O Ariribá entrega proximidade com o mar, infraestrutura consolidada e valorização acelerada, mas envolve custos crescentes, obras e trânsito sazonal no verão.',
		metaDescription:
			'O Ariribá é bom para morar? Prós, contras, perfil de morador, faixas de preço, comparativos com outros bairros e FAQ honesto sobre moradia na região.',
		datePublished: '2026-07-14',
		imageNum: 62,
		tags: ['Balneário Camboriú', 'Ariribá', 'Moradia', 'Qualidade de Vida'],
		match: /ARIRIBÁ É BOM PARA MORAR/i,
	},
	{
		slug: 'custo-de-vida-aririba-balneario-camboriu-quanto-custa-morar',
		title: 'Custo de Vida no Ariribá: Quanto Custa Morar no Bairro que Mais Valorizou em BC',
		excerpt:
			'Morar no Ariribá exige orçamento mensal estimado entre R$ 6 mil e R$ 18 mil para famílias, com moradia e condomínio como os principais pesos do custo de vida.',
		metaDescription:
			'Custo de vida no Ariribá: aluguel, condomínio, alimentação, faixas mensais por perfil, comparativos e FAQ sobre quanto custa morar no bairro valorizado.',
		datePublished: '2026-07-16',
		imageNum: 63,
		tags: ['Balneário Camboriú', 'Ariribá', 'Custo de Vida', 'Moradia'],
		match: /CUSTO DE VIDA NO ARIRIBÁ/i,
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

function findUserMessageText(path) {
	const lines = readFileSync(path, 'utf8').trim().split('\n');
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const row = JSON.parse(lines[i]);
		if (row.role !== 'user') continue;
		const text = row.message?.content?.find((c) => c.type === 'text')?.text ?? '';
		if (text.includes('cluster aririba') && text.includes('ARTIGO:')) {
			return text;
		}
	}
	throw new Error('Mensagem com artigos do Ariribá não encontrada no transcript');
}

const blogDir = join(process.cwd(), 'src/content/blog');
const imgDir = join(process.cwd(), 'public/assets/img/blog');
const sourcesDir = join(process.cwd(), 'scripts/_sources/aririba');
mkdirSync(sourcesDir, { recursive: true });

const userText = findUserMessageText(transcriptPath);
const extracted = extractArticlesFromTranscript(userText);
console.log(`Encontrados ${extracted.length} artigos no transcript`);

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
console.log(`\nMeta salva em scripts/_sources/aririba/published-meta.json (${published.length} artigos)`);
