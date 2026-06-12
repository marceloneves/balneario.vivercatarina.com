/**
 * Extrai artigos do cluster Centro, converte HTML e publica em src/content/blog.
 * Uso: node scripts/publish-centro-articles.mjs [caminho-transcript.jsonl]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { convertUserHtml } from './convert-user-html-to-blog-html-lib.mjs';

const transcriptPath =
	process.argv[2] ||
	'/Users/marceloneves/.cursor/projects/Users-marceloneves-Projetos-GIT-balneario-vivercatarina-com/agent-transcripts/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433.jsonl';

const ARTICLE_META = [
	{
		slug: 'morar-no-centro-balneario-camboriu-guia-completo',
		title: 'Morar no Centro de Balneário Camboriú: Guia do Coração da Cidade',
		excerpt:
			'Morar no Centro de Balneário Camboriú significa viver no ponto mais valorizado da cidade, com Praia Central, Avenida Atlântica e infraestrutura completa a poucos passos.',
		metaDescription:
			'Guia completo para morar no Centro de Balneário Camboriú: perfil do morador, preços, infraestrutura, investimento, prós e contras, custo de vida e FAQ.',
		datePublished: '2026-06-12',
		imageNum: 46,
		tags: ['Balneário Camboriú', 'Centro', 'Moradia', 'Imóveis'],
		match: /MORAR NO CENTRO DE BALNEÁRIO CAMBORIÚ: GUIA DO CORAÇÃO/i,
	},
	{
		slug: 'preco-m2-centro-balneario-camboriu-quanto-custa',
		title: 'Preço do m² no Centro de Balneário Camboriú: Quanto Custa Comprar um Imóvel',
		excerpt:
			'O preço do m² no Centro de Balneário Camboriú varia entre R$ 12 mil e R$ 40 mil ou mais, conforme vista, andar e padrão construtivo na orla mais valorizada da cidade.',
		metaDescription:
			'Preço do m² no Centro de BC: faixas por padrão, comparativos com outros bairros, custos adicionais, valorização e FAQ para compradores.',
		datePublished: '2026-06-14',
		imageNum: 47,
		tags: ['Balneário Camboriú', 'Centro', 'Preço m²', 'Imóveis'],
		match: /PREÇO DO M² NO CENTRO DE BC/i,
	},
	{
		slug: 'apartamentos-a-venda-centro-balneario-camboriu',
		title: 'Apartamentos à Venda no Centro de Balneário Camboriú: O Que Esperar por Faixa de Preço',
		excerpt:
			'Comprar apartamento no Centro de BC exige entender o que cada faixa de preço entrega, do studio nas quadras internas à cobertura frente-mar na Avenida Atlântica.',
		metaDescription:
			'Apartamentos à venda no Centro de BC: faixas de R$ 450 mil a R$ 40 mi+, tipologias, microterritórios, comparativos e FAQ para comprar no coração da cidade.',
		datePublished: '2026-06-16',
		imageNum: 48,
		tags: ['Balneário Camboriú', 'Centro', 'Apartamentos', 'Imóveis'],
		match: /APARTAMENTOS À VENDA NO CENTRO DE BC/i,
	},
	{
		slug: 'aluguel-centro-balneario-camboriu-valores-mercado',
		title: 'Aluguel no Centro de Balneário Camboriú: Valores e Mercado Imobiliário Atualizado',
		excerpt:
			'O aluguel no Centro de Balneário Camboriú varia de R$ 2.500 a R$ 20.000 ou mais, com forte demanda anual e de temporada na região mais disputada da cidade.',
		metaDescription:
			'Aluguel no Centro de BC: valores anuais e de temporada, sazonalidade, tipologias, comparativos e FAQ sobre locação no coração da cidade.',
		datePublished: '2026-06-18',
		imageNum: 49,
		tags: ['Balneário Camboriú', 'Centro', 'Aluguel', 'Temporada'],
		match: /ALUGUEL NO CENTRO DE BALNEÁRIO CAMBORIÚ/i,
	},
	{
		slug: 'vale-a-pena-investir-centro-balneario-camboriu',
		title: 'Investir no Centro de Balneário Camboriú: Liquidez, Valorização e o Que Realmente Importa',
		excerpt:
			'Investir no Centro de Balneário Camboriú combina alta liquidez de revenda, valorização consistente e demanda permanente no metro quadrado mais disputado do litoral catarinense.',
		metaDescription:
			'Vale a pena investir no Centro de BC? Análise de liquidez, valorização, rentabilidade, riscos e FAQ para investidores imobiliários.',
		datePublished: '2026-06-20',
		imageNum: 50,
		tags: ['Balneário Camboriú', 'Centro', 'Investimento', 'Imóveis'],
		match: /VALE A PENA INVESTIR NO CENTRO DE BC/i,
	},
	{
		slug: 'como-comprar-imovel-centro-balneario-camboriu',
		title: 'Como Comprar Imóvel no Centro de Balneário Camboriú: O Guia Definitivo',
		excerpt:
			'Comprar imóvel no Centro de Balneário Camboriú exige método, orçamento realista e due diligence em um dos mercados mais aquecidos e valorizados do Sul do Brasil.',
		metaDescription:
			'Como comprar imóvel no Centro de BC: passo a passo, documentação, na planta x pronto, faixas de preço, custos extras e FAQ para aquisição segura.',
		datePublished: '2026-06-22',
		imageNum: 51,
		tags: ['Balneário Camboriú', 'Centro', 'Compra', 'Imóveis'],
		match: /COMO COMPRAR IMÓVEL NO CENTRO DE BALNEÁRIO CAMBORIÚ/i,
	},
	{
		slug: 'centro-balneario-camboriu-e-bom-para-morar',
		title: 'Centro de Balneário Camboriú é Bom para Morar? Prós, Contras e o Que Ninguém Te Conta',
		excerpt:
			'Morar no Centro de Balneário Camboriú entrega praticidade urbana à beira-mar, mas envolve custos elevados, trânsito sazonal e movimento intenso na alta temporada.',
		metaDescription:
			'O Centro de BC é bom para morar? Prós, contras, custo de vida, perfil de morador, comparativos e FAQ honesto sobre moradia no coração da cidade.',
		datePublished: '2026-06-24',
		imageNum: 52,
		tags: ['Balneário Camboriú', 'Centro', 'Moradia', 'Qualidade de Vida'],
		match: /CENTRO DE BC É BOM PARA MORAR/i,
	},
	{
		slug: 'infraestrutura-centro-balneario-camboriu-comercio-mobilidade',
		title: 'Infraestrutura do Centro de Balneário Camboriú: Avenida Atlântica, Shoppings e Serviços',
		excerpt:
			'A infraestrutura do Centro de Balneário Camboriú concentra orla revitalizada, shoppings, rede de saúde e mobilidade caminhável no bairro mais completo da cidade.',
		metaDescription:
			'Infraestrutura do Centro de BC: Avenida Atlântica, shoppings, saúde, mobilidade, faixas de preço e FAQ sobre viver no coração da cidade.',
		datePublished: '2026-06-26',
		imageNum: 53,
		tags: ['Balneário Camboriú', 'Centro', 'Infraestrutura', 'Serviços'],
		match: /INFRAESTRUTURA DO CENTRO DE BC/i,
	},
	{
		slug: 'verticalizacao-centro-balneario-camboriu-praia-central',
		title: 'Morar Perto da Praia Central de Balneário Camboriú: Guia da Verticalização no Centro',
		excerpt:
			'Morar perto da Praia Central significa viver entre os arranha-céus mais altos do Brasil, com conveniência máxima e valorização patrimonial na orla do Centro de BC.',
		metaDescription:
			'Verticalização no Centro de BC: frente-mar x quadra-mar, arranha-céus, faixas de preço, construtoras e FAQ sobre morar perto da Praia Central.',
		datePublished: '2026-06-28',
		imageNum: 54,
		tags: ['Balneário Camboriú', 'Centro', 'Verticalização', 'Praia Central'],
		match: /VERTICALIZAÇÃO NO CENTRO DE BC/i,
	},
	{
		slug: 'praia-central-balneario-camboriu-guia-orla',
		title: 'Praia Central de Balneário Camboriú: Guia Completo da Orla',
		excerpt:
			'A Praia Central é a orla mais emblemática de Santa Catarina, com 6 km de extensão, calçadão revitalizado e os arranha-céus que definem o skyline de Balneário Camboriú.',
		metaDescription:
			'Praia Central de BC: guia da orla, alargamento da faixa de areia, imóveis, faixas de preço, locação e FAQ sobre o cartão-postal da cidade.',
		datePublished: '2026-06-30',
		imageNum: 55,
		tags: ['Balneário Camboriú', 'Centro', 'Praia Central', 'Orla'],
		match: /PRAIA CENTRAL DE BALNEÁRIO CAMBORIÚ/i,
	},
	{
		slug: 'custo-de-vida-centro-balneario-camboriu-quanto-custa-morar',
		title: 'Custo de Vida no Centro de Balneário Camboriú: Quanto Custa Morar na Região',
		excerpt:
			'Morar no Centro de Balneário Camboriú exige orçamento mensal elevado, com moradia, condomínio e serviços proporcionais ao endereço mais valorizado da cidade.',
		metaDescription:
			'Custo de vida no Centro de BC: aluguel, condomínio, alimentação, faixas mensais por perfil, comparativos e FAQ sobre quanto custa morar na região.',
		datePublished: '2026-07-02',
		imageNum: 56,
		tags: ['Balneário Camboriú', 'Centro', 'Custo de Vida', 'Moradia'],
		match: /CUSTO DE VIDA NO CENTRO DE BC/i,
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
		if (text.includes('cluster centro') && text.includes('ARTIGO:')) {
			return text;
		}
	}
	throw new Error('Mensagem com artigos do Centro não encontrada no transcript');
}

function fixSourceHtml(html) {
	return html.replace(
		/fatores que pesam mais ou menos conforme o seu perfil e estilo de vida\.\s*<\/\s*\n\s*<h3>Qual o valor médio/i,
		'fatores que pesam mais ou menos conforme o seu perfil e estilo de vida.</p>\n\n<h3>Qual o valor médio',
	);
}

const blogDir = join(process.cwd(), 'src/content/blog');
const imgDir = join(process.cwd(), 'public/assets/img/blog');
const sourcesDir = join(process.cwd(), 'scripts/_sources/centro');
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

	const rawHtml = fixSourceHtml(source.content);
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
console.log(`\nMeta salva em scripts/_sources/centro/published-meta.json (${published.length} artigos)`);
