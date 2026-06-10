import { SITE_EMAIL, SITE_NAME, SITE_PHONE_DISPLAY, SITE_URL } from './site-contact.mjs';

/** @typedef {{ question: string, answer: string }} HomeFaqItem */

/** @type {HomeFaqItem[]} */
export const HOME_FAQ_ITEMS = [
	{
		question: 'Por que comprar imóvel na planta em Balneário Camboriú?',
		answer:
			'Balneário Camboriú combina alta demanda habitacional, valorização em bairros consolidados e lançamentos novos em Balneário Camboriú e no Continente. Comprar na planta pode permitir condições comerciais diferenciadas, escolha de unidade e acompanhamento da obra — desde que você compare localização, incorporadora e prazo de entrega antes de decidir.',
	},
	{
		question: 'Ilha ou Continente: qual região escolher em Balneário Camboriú?',
		answer:
			'A Ilha concentra bairros nobres, universitários e litorâneos — como Centro, Trindade, Campeche, Jurerê e Lagoa da Conceição. O Continente (Estreito, Capoeiras, Coqueiros e região) costuma oferecer melhor custo-benefício e acesso rodoviário. A escolha depende de rotina de trabalho, trânsito nas pontes e perfil de moradia ou investimento.',
	},
	{
		question: 'Quais bairros de Balneário Camboriú têm mais lançamentos imobiliários?',
		answer:
			'Há oferta relevante em regiões como Campeche, Cacupé, Agronômica, Trindade, Coqueiros, Estreito, Canasvieiras, Ingleses e Lagoa da Conceição, entre outros. No Viver Catarina você navega por bairro em /bairros ou pela home, filtrando apartamentos, casas e loteamentos disponíveis em cada região da cidade.',
	},
	{
		question: 'O que observar ao comprar apartamento na planta em Balneário Camboriú?',
		answer:
			'Verifique zoneamento e restrições de altura do bairro, distância até serviços e mobilidade, reputação da construtora, memorial descritivo, cronograma de obra, índice de correção do contrato e taxas de condomínio previstas. Em Balneário Camboriú, estacionamento, ventilação e acesso às pontes também pesam na experiência diária.',
	},
	{
		question: 'Pré-lançamento, na planta ou pronto para morar: o que faz sentido em Balneário Camboriú?',
		answer:
			'Pré-lançamento e na planta tendem a atrair quem busca preço de tabela e prazo para pagar durante a obra. Pronto para morar atende quem precisa de entrega rápida ou quer ver a unidade concluída. Em Balneário Camboriú, a fase ideal varia conforme bairro, fluxo de caixa e se a compra é para morar, veraneio ou locação.',
	},
	{
		question: 'Balneário Camboriú é um bom lugar para investir em imóvel?',
		answer:
			'A litoral catarinense tem mercado líquido, sazonalidade turística em bairros litorâneos e demanda estável perto de universidades e centros empresariais. Studios e apartamentos compactos na Região Universitária e no Centro atraem locação; bairros de praia podem valorizar com infraestrutura. Analise sempre vacância, condomínio e perfil do empreendimento.',
	},
	{
		question: 'Como comparar bairros e lançamentos em Balneário Camboriú?',
		answer:
			'Use a seção Bairros na home ou a página /bairros para ver lançamentos por região — Continente, Centro, Região Universitária, Norte, Leste e sul de Balneário Camboriú. Compare preço por metro quadrado, tipologia, vaga, perfil do bairro e distância ao que importa para você. O blog e o glossário do site ajudam a entender termos do mercado local.',
	},
	{
		question: 'Quais cuidados na compra de imóvel novo em Balneário Camboriú?',
		answer:
			'Leia o contrato de promessa de compra e venda, confira registro da incorporação, acompanhe o cronograma da obra, entenda correção monetária e multas, e valide documentação no Cartório de Registro de Imóveis após o habite-se. Em Balneário Camboriú, outorga onerosa e regras de zoneamento de Balneário Camboriú podem impactar o empreendimento.',
	},
	{
		question: 'Como funciona o financiamento de lançamento em Balneário Camboriú?',
		answer:
			'Enquanto a obra avança, é comum pagar entrada e parcelas direto com a incorporadora. Após estágio avançado ou entrega, muitos compradores migram para financiamento bancário. Bancos avaliam renda, score e documentação do empreendimento. Um corretor credenciado ajuda a simular condições conforme o lançamento escolhido.',
	},
	{
		question: 'Como agendar visita ou tirar dúvidas sobre um lançamento em Balneário Camboriú?',
		answer: `No ${SITE_NAME}, abra a página do empreendimento ou bairro de interesse e fale conosco pelo WhatsApp, telefone ${SITE_PHONE_DISPLAY} ou e-mail ${SITE_EMAIL}. Corretores parceiros registrados no CRECI orientam sobre disponibilidade, valores atualizados e próximos passos para o imóvel em Balneário Camboriú que você quer conhecer.`,
	},
];

export function getHomeFaqItems() {
	return HOME_FAQ_ITEMS;
}

export function buildHomeFaqSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: HOME_FAQ_ITEMS.map(({ question, answer }) => ({
			'@type': 'Question',
			name: question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: answer,
			},
		})),
		url: `${SITE_URL}/#home-faq`,
		name: 'Perguntas frequentes sobre imóveis na planta em Balneário Camboriú',
	};
}
