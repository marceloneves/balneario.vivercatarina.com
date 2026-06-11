import { enrichBlogPost } from './blog-clusters.mjs';
import { buildMetaDescription } from './site-seo.mjs';

export const BLOG_POSTS = [
	{
		slug: 'frente-mar-quadra-mar-vista-mar-balneario-camboriu',
		title: 'Frente-Mar, Quadra-Mar e Vista Mar em BC: Entenda as Diferenças e os Preços',
		excerpt:
			'Em Balneário Camboriú, frente-mar significa vista direta e desobstruída do oceano e o m² mais caro, quadra-mar é a segunda fileira de prédios com melhor custo-benefício, e vista mar garante o visual do mar sem estar na primeira quadra.',
		metaDescription:
			'Frente-mar, quadra-mar e vista mar em Balneário Camboriú: diferenças, preços, valorização, aluguel, prós e contras de cada classificação e FAQ para escolher a posição certa em relação ao mar.',
		imageUrl: '/assets/img/blog/blog_1_19.webp',
		datePublished: '2026-06-27',
		dateUpdated: '2026-06-27',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'Frente-mar', 'Quadra-mar', 'Vista mar'],
		href: '/blog/frente-mar-quadra-mar-vista-mar-balneario-camboriu',
	},
	{
		slug: 'itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
		title: 'ITBI e Custos de Cartório em Balneário Camboriú: Quanto Custa Além do Imóvel',
		excerpt:
			'Comprar um imóvel em Balneário Camboriú custa de 3% a 6% a mais que o valor anunciado, somando o ITBI de cerca de 3%, a escritura e o registro em cartório, despesas obrigatórias que precisam entrar no orçamento desde o início.',
		metaDescription:
			'ITBI e custos de cartório em Balneário Camboriú: alíquota, base de cálculo, escritura, registro, isenções, descontos, erros comuns e FAQ sobre quanto custa além do valor do imóvel.',
		imageUrl: '/assets/img/blog/blog_1_18.webp',
		datePublished: '2026-06-26',
		dateUpdated: '2026-06-26',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'ITBI', 'Cartório', 'Custos de transação'],
		href: '/blog/itbi-custos-cartorio-balneario-camboriu-quanto-custa-alem-imovel',
	},
	{
		slug: 'como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
		title: 'Como Comprar Imóvel em Balneário Camboriú: Financiamento e Passo a Passo',
		excerpt:
			'Comprar imóvel financiado em Balneário Camboriú ficou mais acessível em 2026 com o novo teto do SFH de R$ 2,25 milhões, entrada mínima de 20% e a possibilidade de usar o FGTS em uma faixa muito maior de apartamentos.',
		metaDescription:
			'Como comprar imóvel financiado em Balneário Camboriú: passo a passo, SFH, SFI, SAC, Price, FGTS, regras de 2026, custos extras, dicas de aprovação e FAQ sobre financiamento imobiliário.',
		imageUrl: '/assets/img/blog/blog_1_17.webp',
		datePublished: '2026-06-25',
		dateUpdated: '2026-06-25',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'Financiamento', 'SFH', 'FGTS'],
		href: '/blog/como-comprar-imovel-balneario-camboriu-financiamento-documentacao',
	},
	{
		slug: 'comprar-imovel-balneario-camboriu-estrangeiro',
		title: 'Comprar Imóvel em BC Sendo Estrangeiro: Guia para Argentinos e Paraguaios',
		excerpt:
			'Estrangeiros como argentinos e paraguaios podem comprar imóveis urbanos em Balneário Camboriú sem restrição, bastando ter CPF, documentação apostilada e fazer a transferência dos recursos via remessa internacional registrada no Banco Central.',
		metaDescription:
			'Comprar imóvel em Balneário Camboriú sendo estrangeiro: CPF, documentação apostilada, remessa internacional, financiamento, Golden Visa, custos extras, erros comuns e FAQ para argentinos e paraguaios.',
		imageUrl: '/assets/img/blog/blog_1_16.webp',
		datePublished: '2026-06-24',
		dateUpdated: '2026-06-24',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'Estrangeiros', 'Compra de imóvel', 'Argentinos'],
		href: '/blog/comprar-imovel-balneario-camboriu-estrangeiro',
	},
	{
		slug: 'investir-imoveis-balneario-camboriu-valorizacao-roi',
		title: 'Investir em Imóveis em Balneário Camboriú: Guia Definitivo de Valorização e ROI',
		excerpt:
			'Investir em Balneário Camboriú significa entrar no mercado com o metro quadrado mais caro do Brasil e um retorno sobre investimento que chegou a 19,1% ao ano, sustentado por escassez de orla, alto padrão e demanda constante.',
		metaDescription:
			'Investir em imóveis em Balneário Camboriú: valorização, ROI de 19,1%, FipeZAP, fontes de retorno, estratégias, riscos, saturação do mercado e FAQ para investir com visão de longo prazo.',
		imageUrl: '/assets/img/blog/blog_1_15.webp',
		datePublished: '2026-06-23',
		dateUpdated: '2026-06-23',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'Investimento', 'Valorização', 'ROI'],
		href: '/blog/investir-imoveis-balneario-camboriu-valorizacao-roi',
	},
	{
		slug: 'comprar-imovel-na-planta-balneario-camboriu',
		title: 'Comprar Imóvel na Planta em Balneário Camboriú: Guia Completo e Vantagens',
		excerpt:
			'Comprar na planta em Balneário Camboriú permite adquirir um imóvel até 30% mais barato que o pronto, com valorização de 15% a 40% durante a obra e pagamento parcelado direto com a construtora, desde que se verifique o registro de incorporação e a solidez da empresa.',
		metaDescription:
			'Comprar imóvel na planta em Balneário Camboriú: vantagens, pagamento, passo a passo, registro de incorporação, INCC, riscos, custos extras e FAQ para comprar com segurança.',
		imageUrl: '/assets/img/blog/blog_1_14.webp',
		datePublished: '2026-06-22',
		dateUpdated: '2026-06-22',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'Compra na planta', 'Lançamentos', 'Investimento'],
		href: '/blog/comprar-imovel-na-planta-balneario-camboriu',
	},
	{
		slug: 'custo-de-vida-pioneiros',
		title: 'Custo de Vida nos Pioneiros: Quanto Custa Morar no Bairro',
		excerpt:
			'Morar nos Pioneiros exige planejar moradia, condomínio, IPTU e despesas do dia a dia, com um custo de vida de alto padrão que, graças à eficiência dos novos prédios, pode ser mais competitivo do que o valor dos imóveis sugere.',
		metaDescription:
			'Custo de vida nos Pioneiros: aluguel, condomínio, IPTU, supermercado, Tarifa Zero, orçamento mensal estimado, dicas para economizar e FAQ sobre quanto custa morar no bairro.',
		imageUrl: '/assets/img/blog/blog_1_13.webp',
		datePublished: '2026-06-21',
		dateUpdated: '2026-06-21',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Custo de vida', 'Moradia', 'Orçamento'],
		href: '/blog/custo-de-vida-pioneiros',
	},
	{
		slug: 'morro-do-careca-estaleiro-natureza-pioneiros',
		title: 'Morro do Careca e Estaleiro: Natureza nos Pioneiros e no Entorno de Balneário Camboriú',
		excerpt:
			'Morar nos Pioneiros é ter o Morro do Careca como mirante natural do bairro e as praias agrestes do Estaleiro e Estaleirinho a poucos quilômetros, um contraste raro entre os arranha-céus e a Mata Atlântica preservada.',
		metaDescription:
			'Morro do Careca, Estaleiro e Estaleirinho nos Pioneiros: mirante natural, praias agrestes, Bandeira Azul, trilhas, roteiros e FAQ sobre natureza em Balneário Camboriú.',
		imageUrl: '/assets/img/blog/blog_1_12.webp',
		datePublished: '2026-06-20',
		dateUpdated: '2026-06-20',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Morro do Careca', 'Estaleiro', 'Natureza'],
		href: '/blog/morro-do-careca-estaleiro-natureza-pioneiros',
	},
	{
		slug: 'barra-norte-molhe-guia-regiao-pioneiros',
		title: 'Barra Norte e Molhe: Guia da Região dos Pioneiros em Balneário Camboriú',
		excerpt:
			'A Barra Norte é a região dos Pioneiros que reúne o Molhe do Pontal Norte, o Deck de 810 metros e praias escondidas como a do Canto e a do Buraco, oferecendo o lado mais natural e tranquilo de Balneário Camboriú.',
		metaDescription:
			'Guia da Barra Norte e Molhe nos Pioneiros: Deck do Pontal Norte, Praia do Canto, Praia do Buraco, Morro do Careca, Estrada da Rainha, roteiro de passeio e FAQ em Balneário Camboriú.',
		imageUrl: '/assets/img/blog/blog_1_11.webp',
		datePublished: '2026-06-19',
		dateUpdated: '2026-06-19',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Barra Norte', 'Molhe', 'Praias'],
		href: '/blog/barra-norte-molhe-guia-regiao-pioneiros',
	},
	{
		slug: 'infraestrutura-pioneiros-molhe-comercio-servicos',
		title: 'Infraestrutura dos Pioneiros: Molhe Norte, Comércio e Serviços',
		excerpt:
			'A infraestrutura dos Pioneiros combina o Molhe da Barra Norte e o Deck do Pontal Norte com comércio completo, saúde de referência e lazer, tornando o bairro um dos mais autossuficientes e walkable de Balneário Camboriú.',
		metaDescription:
			'Infraestrutura dos Pioneiros: Molhe da Barra Norte, Deck do Pontal Norte, comércio na Avenida do Estado, saúde, educação, mobilidade walkable e FAQ sobre o bairro em Balneário Camboriú.',
		imageUrl: '/assets/img/blog/blog_1_10.webp',
		datePublished: '2026-06-18',
		dateUpdated: '2026-06-18',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Infraestrutura', 'Molhe', 'Barra Norte'],
		href: '/blog/infraestrutura-pioneiros-molhe-comercio-servicos',
	},
	{
		slug: 'pioneiros-x-barra-sul-custo-beneficio',
		title: 'Pioneiros x Barra Sul: Luxo com Melhor Custo-Benefício em Balneário Camboriú',
		excerpt:
			'Na disputa entre Pioneiros e Barra Sul, o primeiro entrega alto padrão com metro quadrado quase pela metade e melhor potencial de valorização, enquanto a Barra Sul oferece o prestígio máximo e os arranha-céus mais icônicos do Brasil.',
		metaDescription:
			'Pioneiros x Barra Sul: comparação de preço, m², aluguel, perfil de imóvel, estilo de vida, valorização e veredito de qual bairro escolher em Balneário Camboriú.',
		imageUrl: '/assets/img/blog/blog_1_9.webp',
		datePublished: '2026-06-17',
		dateUpdated: '2026-06-17',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Barra Sul', 'Comparativo', 'Custo-benefício'],
		href: '/blog/pioneiros-x-barra-sul-custo-beneficio',
	},
	{
		slug: 'pioneiros-e-bom-para-morar',
		title: 'Pioneiros é Bom para Morar? Prós, Contras e o Que Ninguém Te Conta',
		excerpt:
			'Morar nos Pioneiros é bom para quem busca alto padrão, segurança e natureza com melhor custo-benefício que a Barra Sul, mas exige conviver com obras constantes, trânsito de verão e o risco de novos edifícios alterarem a vista.',
		metaDescription:
			'Pioneiros é bom para morar? Prós e contras honestos: segurança, infraestrutura, natureza, obras, risco de perder a vista, trânsito de verão e para quem o bairro é a escolha certa.',
		imageUrl: '/assets/img/blog/blog_1_8.webp',
		datePublished: '2026-06-16',
		dateUpdated: '2026-06-16',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Moradia', 'Qualidade de vida', 'Barra Norte'],
		href: '/blog/pioneiros-e-bom-para-morar',
	},
	{
		slug: 'como-comprar-imovel-pioneiros-barra-norte',
		title: 'Como Comprar Imóvel nos Pioneiros / Barra Norte: Passo a Passo Completo',
		excerpt:
			'Comprar imóvel nos Pioneiros segue seis etapas, da análise da documentação ao registro em cartório, com atenção especial à compra na planta, ao financiamento de alto padrão e às particularidades de um bairro em plena transformação.',
		metaDescription:
			'Como comprar imóvel nos Pioneiros: passo a passo, documentação, ITBI, financiamento, compra na planta, custos de transação, erros comuns e dicas para comprar bem na Barra Norte.',
		imageUrl: '/assets/img/blog/blog_1_7.webp',
		datePublished: '2026-06-15',
		dateUpdated: '2026-06-15',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Compra', 'Financiamento', 'ITBI'],
		href: '/blog/como-comprar-imovel-pioneiros-barra-norte',
	},
	{
		slug: 'vale-a-pena-investir-pioneiros',
		title: 'Vale a Pena Investir nos Pioneiros? A Grande Aposta de 2026 em Balneário Camboriú',
		excerpt:
			'Investir nos Pioneiros vale a pena para quem busca valorização e renda no longo prazo, pois o bairro reúne metro quadrado abaixo da média da cidade, transformação urbana acelerada e os três pilares objetivos que sustentam a alta do Pontal Norte.',
		metaDescription:
			'Vale a pena investir nos Pioneiros em 2026? Fontes de retorno, pilares de valorização, estratégias, riscos, debate sobre saturação de BC e como investir bem na Barra Norte.',
		imageUrl: '/assets/img/blog/blog_1_6.webp',
		datePublished: '2026-06-14',
		dateUpdated: '2026-06-14',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Investimento', 'Valorização', 'Mercado imobiliário'],
		href: '/blog/vale-a-pena-investir-pioneiros',
	},
	{
		slug: 'aluguel-pioneiros-valores-mercado',
		title: 'Aluguel nos Pioneiros: Valores e Mercado em Balneário Camboriú',
		excerpt:
			'O aluguel nos Pioneiros vai de cerca de R$ 3.900 mensais em apartamentos de 2 dormitórios a mais de R$ 12.500 em unidades de alto padrão com vista para o mar, com diárias de temporada que chegam a R$ 10.000 no Réveillon.',
		metaDescription:
			'Aluguel nos Pioneiros em 2026: valores de locação anual e temporada, diárias de pico, custos extras, contrato, investimento em locação e dicas para morar ou rentabilizar.',
		imageUrl: '/assets/img/blog/blog_1_5.webp',
		datePublished: '2026-06-13',
		dateUpdated: '2026-06-13',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Aluguel', 'Locação', 'Mercado imobiliário'],
		href: '/blog/aluguel-pioneiros-valores-mercado',
	},
	{
		slug: 'apartamentos-a-venda-pioneiros',
		title: 'Apartamentos à Venda nos Pioneiros: O Que Esperar por Faixa de Preço',
		excerpt:
			'Os apartamentos à venda nos Pioneiros vão de unidades de 2 suítes quadra-mar a coberturas e mansões suspensas de alto luxo, oferecendo o melhor leque de alto padrão com custo-benefício de Balneário Camboriú em 2026.',
		metaDescription:
			'Apartamentos à venda nos Pioneiros por faixa de preço: 2, 3 e 4 suítes, coberturas e mansões suspensas, metragens, empreendimentos reais e como escolher a unidade certa.',
		imageUrl: '/assets/img/blog/blog_1_4.webp',
		datePublished: '2026-06-12',
		dateUpdated: '2026-06-12',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Apartamentos', 'Mercado imobiliário', 'Alto padrão'],
		href: '/blog/apartamentos-a-venda-pioneiros',
	},
	{
		slug: 'preco-m2-pioneiros-bairro-em-ascensao',
		title: 'Preço do m² nos Pioneiros: Quanto Custa o Bairro em Ascensão de Balneário Camboriú',
		excerpt:
			'O preço do metro quadrado nos Pioneiros gira em torno de R$ 23.839 na planta, abaixo da média de Balneário Camboriú, o que confirma o bairro como a melhor combinação entre alto padrão e custo-benefício da cidade em 2026.',
		metaDescription:
			'Preço do m² nos Pioneiros em 2026: média de R$ 23.839 na planta, faixas por tipo de imóvel, comparação com BC e Barra Sul, valorização e custos de transação.',
		imageUrl: '/assets/img/blog/blog_1_3.webp',
		datePublished: '2026-06-11',
		dateUpdated: '2026-06-11',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Preço m²', 'Mercado imobiliário', 'Valorização'],
		href: '/blog/preco-m2-pioneiros-bairro-em-ascensao',
	},
	{
		slug: 'morar-nos-pioneiros-guia-completo',
		title: 'Morar nos Pioneiros: Guia do Bairro que Mais Cresce em Balneário Camboriú',
		excerpt:
			'Morar nos Pioneiros é apostar no bairro de maior crescimento de Balneário Camboriú, onde o alto padrão à beira-mar encontra melhor custo-benefício que a Barra Sul, natureza preservada e a maior transformação urbana da cidade em 2026.',
		metaDescription:
			'Guia completo para morar nos Pioneiros, Barra Norte de Balneário Camboriú: custo de vida, valorização, Molhe Norte, Morro do Careca, mercado imobiliário e o que considerar antes de comprar ou alugar.',
		imageUrl: '/assets/img/blog/blog_1_2.webp',
		datePublished: '2026-06-10',
		dateUpdated: '2026-06-10',
		author: 'Viver Catarina',
		tags: ['Pioneiros', 'Barra Norte', 'Moradia', 'Valorização'],
		href: '/blog/morar-nos-pioneiros-guia-completo',
	},
	{
		slug: 'morar-em-balneario-camboriu-guia-completo',
		title: 'Morar em Balneário Camboriú: Guia Completo da Cidade dos Arranha-céus',
		excerpt:
			'Morar em Balneário Camboriú significa viver na cidade mais verticalizada e valorizada do litoral brasileiro, onde o metro quadrado supera R$ 35 mil nas regiões nobres e a qualidade de vida à beira-mar convive com os arranha-céus mais altos do país.',
		metaDescription:
			'Guia completo para morar em Balneário Camboriú: bairros, custo de vida, arranha-céus, valorização imobiliária, infraestrutura e o que considerar antes de comprar ou alugar na Dubai brasileira.',
		imageUrl: '/assets/img/blog/blog_1_1.webp',
		datePublished: '2026-06-09',
		dateUpdated: '2026-06-09',
		author: 'Viver Catarina',
		tags: ['Balneário Camboriú', 'Moradia', 'Guia da cidade', 'Arranha-céus'],
		href: '/blog/morar-em-balneario-camboriu-guia-completo',
	},
];

export function getBlogPosts() {
	return BLOG_POSTS.map((post) => enrichBlogPost(post));
}

export function getBlogPost(slug) {
	const post = BLOG_POSTS.find((entry) => entry.slug === slug);

	return post ? enrichBlogPost(post) : null;
}

export function getBlogPostMetaDescription(post) {
	if (!post) {
		return '';
	}

	if (post.metaDescription) {
		return buildMetaDescription('', post.metaDescription);
	}

	const keyword = getBlogPostSeoKeyword(post);

	return buildMetaDescription(keyword, post.excerpt);
}

function getBlogPostSeoKeyword(post) {
	const shortTitle = post.title.includes(':')
		? post.title.split(':')[0].trim()
		: post.title.trim();

	if (shortTitle.length <= 72) {
		return shortTitle;
	}

	return post.category ? `${post.category} Balneário Camboriú` : 'imóveis na planta em Balneário Camboriú';
}
