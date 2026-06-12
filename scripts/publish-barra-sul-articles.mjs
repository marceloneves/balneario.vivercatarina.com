/**
 * Extrai artigos do cluster Barra Sul, converte HTML e publica em src/content/blog.
 * Uso: node scripts/publish-barra-sul-articles.mjs [caminho-transcript.jsonl]
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { convertUserHtml } from './convert-user-html-to-blog-html-lib.mjs';

const transcriptPath =
	process.argv[2] ||
	'/Users/marceloneves/.cursor/projects/Users-marceloneves-Projetos-GIT-balneario-vivercatarina-com/agent-transcripts/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433/dcf186cd-7baa-4bf3-9a2c-b02bbbe4c433.jsonl';

const ARTICLE_META = [
	{
		slug: 'morar-na-barra-sul-balneario-camboriu-guia-completo',
		title: 'Morar na Barra Sul: Guia do Bairro Mais Luxuoso de Balneário Camboriú',
		excerpt:
			'Morar na Barra Sul significa viver no endereço mais valorizado de Balneário Camboriú, com arranha-céus de luxo, orla junto ao molhe e infraestrutura premium para quem busca exclusividade à beira-mar.',
		metaDescription:
			'Guia completo para morar na Barra Sul, bairro mais luxuoso de Balneário Camboriú: perfil do morador, preços, infraestrutura, investimento, prós e contras, custo de vida e FAQ.',
		datePublished: '2026-06-12',
		imageNum: 32,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Luxo', 'Imóveis'],
		match: /MORAR NA BARRA SUL: GUIA DO BAIRRO MAIS LUXUOSO/i,
	},
	{
		slug: 'preco-m2-barra-sul-balneario-camboriu-quanto-custa',
		title: 'Preço do m² na Barra Sul: Quanto Custa o Bairro Mais Caro de BC',
		excerpt:
			'O preço do m² na Barra Sul está entre os mais altos do litoral catarinense, com faixas estimadas de R$ 12 mil a R$ 45 mil por metro quadrado conforme padrão, vista e localização na orla.',
		metaDescription:
			'Preço do m² na Barra Sul de Balneário Camboriú: faixas por padrão, comparativos com outros bairros, custos adicionais, valorização e FAQ para compradores de alto padrão.',
		datePublished: '2026-06-14',
		imageNum: 33,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Preço m²', 'Imóveis'],
		match: /PREÇO DO M² NA BARRA SUL/i,
	},
	{
		slug: 'apartamentos-a-venda-barra-sul-balneario-camboriu',
		title: 'Apartamentos à Venda na Barra Sul: O Que Esperar em Cada Faixa de Preço',
		excerpt:
			'Comprar apartamento na Barra Sul exige entender o que cada faixa de preço entrega, do compacto no miolo do bairro à cobertura frente-mar na Avenida Atlântica.',
		metaDescription:
			'Apartamentos à venda na Barra Sul: faixas de R$ 900 mil a R$ 15 mi+, tipologias, microterritórios, comparativos e FAQ para comprar no bairro mais caro de BC.',
		datePublished: '2026-06-16',
		imageNum: 34,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Apartamentos', 'Imóveis'],
		match: /APARTAMENTOS À VENDA NA BARRA SUL/i,
	},
	{
		slug: 'coberturas-luxo-barra-sul-balneario-camboriu',
		title: 'Apartamentos de Luxo na Barra Sul: Coberturas e Alto Padrão Frente-Mar',
		excerpt:
			'Os apartamentos de luxo na Barra Sul concentram coberturas duplex, unidades frente-mar e plantas amplas assinadas pelas principais construtoras do litoral catarinense.',
		metaDescription:
			'Coberturas e apartamentos de luxo na Barra Sul: faixas de preço, frente-mar x quadra-mar, padrão construtivo, custos e FAQ para compradores de altíssimo padrão em BC.',
		datePublished: '2026-06-18',
		imageNum: 35,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Luxo', 'Coberturas'],
		match: /COBERTURAS E APARTAMENTOS DE LUXO/i,
	},
	{
		slug: 'aluguel-barra-sul-temporada-valores-mercado',
		title: 'Aluguel na Barra Sul: Temporada e Valores do Mercado de Luxo',
		excerpt:
			'O aluguel na Barra Sul está entre os mais altos de Santa Catarina, com diárias premium na alta temporada e contratos anuais voltados ao público de alto padrão.',
		metaDescription:
			'Aluguel na Barra Sul: valores de temporada e anual, sazonalidade, tipologias, comparativos e FAQ sobre locação no mercado de luxo de Balneário Camboriú.',
		datePublished: '2026-06-20',
		imageNum: 36,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Aluguel', 'Temporada'],
		match: /ALUGUEL NA BARRA SUL/i,
	},
	{
		slug: 'vale-a-pena-investir-barra-sul-balneario-camboriu',
		title: 'Investir na Barra Sul: Vale a Pena? Análise de Valorização e Retorno',
		excerpt:
			'Investir na Barra Sul tende a valer a pena para quem busca preservação de patrimônio e valorização consistente no mercado de luxo de Balneário Camboriú.',
		metaDescription:
			'Vale a pena investir na Barra Sul? Análise de valorização, rentabilidade, cenários de retorno, riscos e FAQ para investidores imobiliários em BC.',
		datePublished: '2026-06-22',
		imageNum: 37,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Investimento', 'Imóveis'],
		match: /VALE A PENA INVESTIR NA BARRA SUL/i,
	},
	{
		slug: 'como-comprar-imovel-barra-sul-balneario-camboriu',
		title: 'Como Comprar Imóvel na Barra Sul: Passo a Passo do Alto Padrão',
		excerpt:
			'Comprar imóvel na Barra Sul exige planejamento financeiro, análise da construtora e due diligence jurídica em um mercado de tickets entre os mais elevados do Brasil.',
		metaDescription:
			'Como comprar imóvel na Barra Sul: passo a passo, documentação, na planta x pronto, faixas de preço, custos extras e FAQ para aquisição segura em BC.',
		datePublished: '2026-06-24',
		imageNum: 38,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Compra', 'Imóveis'],
		match: /COMO COMPRAR IMÓVEL NA BARRA SUL/i,
	},
	{
		slug: 'barra-sul-e-bom-para-morar',
		title: 'Barra Sul é Bom para Morar? Prós, Contras e o Que Ninguém Te Conta',
		excerpt:
			'Morar na Barra Sul significa viver no endereço mais valorizado de Balneário Camboriú, com vista para o mar e acesso ao molhe, mas envolve custos elevados e sazonalidade intensa.',
		metaDescription:
			'A Barra Sul é boa para morar? Prós, contras, custo de vida, perfil de morador, comparativos e FAQ honesto sobre moradia no bairro de luxo de BC.',
		datePublished: '2026-06-26',
		imageNum: 39,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Moradia', 'Qualidade de Vida'],
		match: /BARRA SUL É BOM PARA MORAR/i,
	},
	{
		slug: 'barra-sul-x-centro-x-pioneiros-comparativo',
		title: 'Barra Sul x Centro x Pioneiros: Qual Bairro de BC Vale Mais a Pena',
		excerpt:
			'Decidir entre Barra Sul, Centro e Pioneiros envolve preço por metro quadrado, estilo de vida e objetivo de moradia ou investimento em Balneário Camboriú.',
		metaDescription:
			'Barra Sul x Centro x Pioneiros: comparativo de preços, perfil, valorização, aluguel e FAQ para escolher o melhor bairro de Balneário Camboriú.',
		datePublished: '2026-06-28',
		imageNum: 40,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Centro', 'Pioneiros'],
		match: /BARRA SUL X CENTRO X PIONEIROS/i,
	},
	{
		slug: 'arranha-ceus-barra-sul-senna-tower',
		title: 'Os Arranha-céus da Barra Sul: Senna Tower e os Prédios Mais Altos do Brasil',
		excerpt:
			'A Barra Sul concentra os prédios mais altos de Balneário Camboriú, incluindo a Senna Tower projetada para ultrapassar 500 metros de altura.',
		metaDescription:
			'Arranha-céus da Barra Sul: Senna Tower, One Tower, Yachthouse, faixas de preço, construtoras e FAQ sobre o skyline mais vertical do litoral brasileiro.',
		datePublished: '2026-06-30',
		imageNum: 41,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Arranha-céus', 'Senna Tower'],
		match: /ARRANHA-CÉUS DA BARRA SUL/i,
	},
	{
		slug: 'infraestrutura-barra-sul-comercio-mobilidade',
		title: 'Infraestrutura da Barra Sul: Comércio, Mobilidade e Serviços',
		excerpt:
			'A infraestrutura da Barra Sul combina comércio premium, mobilidade fluida entre praia e centro e serviços completos no bairro mais sofisticado de Balneário Camboriú.',
		metaDescription:
			'Infraestrutura da Barra Sul: comércio, mobilidade, serviços, faixas de preço, comparativos e FAQ sobre viver no bairro de luxo de BC.',
		datePublished: '2026-07-02',
		imageNum: 42,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Infraestrutura', 'Serviços'],
		match: /INFRAESTRUTURA DA BARRA SUL/i,
	},
	{
		slug: 'praia-barra-sul-molhe-guia-orla',
		title: 'Praia da Barra Sul: Guia Completo da Orla e do Molhe',
		excerpt:
			'A Praia da Barra Sul marca o encontro do mar com a foz do Rio Camboriú, protegida pelo icônico molhe e valorizada como um dos trechos mais cobiçados da orla de BC.',
		metaDescription:
			'Praia da Barra Sul: guia da orla, molhe, engordamento da praia, imóveis, faixas de preço e FAQ sobre o trecho mais nobre de Balneário Camboriú.',
		datePublished: '2026-07-04',
		imageNum: 43,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Praia', 'Molhe'],
		match: /PRAIA DA BARRA SUL/i,
	},
	{
		slug: 'gastronomia-vida-noturna-barra-sul',
		title: 'Restaurantes na Barra Sul: Guia da Vida Noturna e Gastronomia',
		excerpt:
			'A Barra Sul reúne restaurantes premium, bares à beira-mar e casas noturnas de alto padrão, formando um dos polos gastronômicos mais sofisticados de Balneário Camboriú.',
		metaDescription:
			'Gastronomia e vida noturna na Barra Sul: restaurantes, bares, faixas de preço, polos gastronômicos e FAQ sobre onde comer e sair no bairro de luxo de BC.',
		datePublished: '2026-07-06',
		imageNum: 44,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Gastronomia', 'Vida Noturna'],
		match: /VIDA NOTURNA E GASTRONOMIA|RESTAURANTES NA BARRA SUL/i,
	},
	{
		slug: 'custo-de-vida-barra-sul-quanto-custa-morar',
		title: 'Custo de Vida na Barra Sul: Quanto Custa Morar no Bairro de Luxo',
		excerpt:
			'Morar na Barra Sul exige um orçamento mensal elevado, com condomínio, alimentação premium e serviços proporcionais ao padrão do bairro mais caro de Balneário Camboriú.',
		metaDescription:
			'Custo de vida na Barra Sul: condomínio, alimentação, serviços, faixas mensais por perfil, comparativos e FAQ sobre quanto custa morar no bairro de luxo de BC.',
		datePublished: '2026-07-08',
		imageNum: 45,
		tags: ['Balneário Camboriú', 'Barra Sul', 'Custo de Vida', 'Moradia'],
		match: /CUSTO DE VIDA NA BARRA SUL/i,
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

function findUserMessageText(transcriptPath) {
	const lines = readFileSync(transcriptPath, 'utf8').trim().split('\n');
	for (let i = lines.length - 1; i >= 0; i -= 1) {
		const row = JSON.parse(lines[i]);
		if (row.role !== 'user') continue;
		const text = row.message?.content?.find((c) => c.type === 'text')?.text ?? '';
		if (text.includes('publique os artigos abaixo na integra') && text.includes('ARTIGO:')) {
			return text;
		}
	}
	throw new Error('Mensagem com artigos não encontrada no transcript');
}

const blogDir = join(process.cwd(), 'src/content/blog');
const imgDir = join(process.cwd(), 'public/assets/img/blog');
const sourcesDir = join(process.cwd(), 'scripts/_sources/barra-sul');
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

	const sourcePath = join(sourcesDir, `${meta.slug}.html`);
	writeFileSync(sourcePath, source.content, 'utf8');

	const outPath = join(blogDir, `${meta.slug}.html`);
	const html = convertUserHtml(source.content);
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
console.log(`\nMeta salva em scripts/_sources/barra-sul/published-meta.json (${published.length} artigos)`);
