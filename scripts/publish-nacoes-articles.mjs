/**
 * Extrai artigos do cluster Nações, converte HTML e publica em src/content/blog.
 * Uso: node scripts/publish-nacoes-articles.mjs [caminho-transcript.jsonl]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { convertUserHtml } from './convert-user-html-to-blog-html-lib.mjs';

const transcriptPath =
	process.argv[2] ||
	'/Users/marceloneves/.cursor/projects/Users-marceloneves-Projetos-GIT-balneario-vivercatarina-com/agent-transcripts/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433.jsonl';

const ARTICLE_META = [
	{
		slug: 'morar-no-nacoes-balneario-camboriu-guia-completo',
		title: 'Morar no Bairro das Nações: Guia do Bairro dos Compactos de Balneário Camboriú',
		excerpt:
			'Morar no bairro das Nações significa viver no endereço dos apartamentos compactos de Balneário Camboriú, com praia próxima, ticket acessível e forte vocação para locação e investimento.',
		metaDescription:
			'Guia completo para morar no Nações: perfil dos compactos, preços, infraestrutura, prós e contras, investimento, custo de vida e FAQ sobre o bairro dos compactos de BC.',
		datePublished: '2026-07-18',
		imageNum: 64,
		tags: ['Balneário Camboriú', 'Nações', 'Moradia', 'Imóveis'],
		match: /MORAR NO NAÇÕES: GUIA DO BAIRRO DOS COMPACTOS/i,
	},
	{
		slug: 'preco-m2-nacoes-balneario-camboriu-quanto-custa',
		title: 'Preço do m² no Nações: Quanto Custa Comprar um Imóvel no Bairro dos Compactos',
		excerpt:
			'O preço do m² no Nações varia entre R$ 8 mil e R$ 14 mil ou mais, refletindo o bairro dos compactos de Balneário Camboriú com boa liquidez e entrada mais acessível que a orla nobre.',
		metaDescription:
			'Preço do m² no Nações: faixas por tipologia, comparativos com outros bairros, custos extras, investimento em locação e FAQ para compradores.',
		datePublished: '2026-07-20',
		imageNum: 65,
		tags: ['Balneário Camboriú', 'Nações', 'Preço m²', 'Imóveis'],
		match: /PREÇO DO M² NO NAÇÕES: QUANTO CUSTA COMPRAR/i,
	},
	{
		slug: 'apartamentos-compactos-a-venda-nacoes-balneario-camboriu',
		title: 'Apartamentos Compactos à Venda no Nações: Ideais para Investir em Balneário Camboriú',
		excerpt:
			'Apartamentos compactos à venda no Nações concentram studios e unidades de um dormitório com alta liquidez, ticket de entrada acessível e forte demanda por locação em BC.',
		metaDescription:
			'Compactos à venda no Nações: studios, tipologias, faixas de preço, rentabilidade, comparativos e FAQ para investir no bairro dos compactos de BC.',
		datePublished: '2026-07-22',
		imageNum: 66,
		tags: ['Balneário Camboriú', 'Nações', 'Apartamentos', 'Investimento'],
		match: /APARTAMENTOS COMPACTOS À VENDA NO NAÇÕES/i,
	},
	{
		slug: 'nacoes-balneario-camboriu-e-bom-para-morar',
		title: 'Nações é Bom para Morar? Prós e Contras Reais do Bairro dos Compactos de BC',
		excerpt:
			'O bairro das Nações entrega localização estratégica e imóveis compactos com bom custo-benefício, mas exige atenção a ruído, metragens reduzidas e variação de padrão entre ruas.',
		metaDescription:
			'O Nações é bom para morar? Prós, contras, perfil de morador, faixas de preço, comparativos e FAQ honesto sobre moradia no bairro dos compactos de BC.',
		datePublished: '2026-07-24',
		imageNum: 67,
		tags: ['Balneário Camboriú', 'Nações', 'Moradia', 'Qualidade de Vida'],
		match: /NAÇÕES É BOM PARA MORAR/i,
	},
	{
		slug: 'custo-de-vida-nacoes-balneario-camboriu-quanto-custa-morar',
		title: 'Custo de Vida no Nações: Quanto Custa Morar no Bairro das Nações em BC',
		excerpt:
			'Morar no Nações custa em média entre R$ 3.500 e R$ 7.000 por mês para quem aluga um compacto, com moradia, condomínio e estilo de vida como principais variáveis.',
		metaDescription:
			'Custo de vida no Nações: aluguel, condomínio, alimentação, faixas mensais por perfil, comparativos e FAQ sobre quanto custa morar no bairro dos compactos.',
		datePublished: '2026-07-26',
		imageNum: 68,
		tags: ['Balneário Camboriú', 'Nações', 'Custo de Vida', 'Moradia'],
		match: /CUSTO DE VIDA NO NAÇÕES/i,
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
		if (
			(text.includes('cluster nacoes') || text.includes('cluster novo: Nações') || text.includes('cluster Nações')) &&
			text.includes('ARTIGO:')
		) {
			return text;
		}
	}
	throw new Error('Mensagem com artigos do Nações não encontrada no transcript');
}

const blogDir = join(process.cwd(), 'src/content/blog');
const imgDir = join(process.cwd(), 'public/assets/img/blog');
const sourcesDir = join(process.cwd(), 'scripts/_sources/nacoes');
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
console.log(`\nMeta salva em scripts/_sources/nacoes/published-meta.json (${published.length} artigos)`);
