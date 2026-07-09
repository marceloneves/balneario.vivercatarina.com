import { SITE_EMAIL, SITE_NAME, SITE_PHONE_DISPLAY, SITE_URL } from './site-contact.mjs';

/** @typedef {{ question: string, answer: string }} HomeFaqItem */

/** @type {HomeFaqItem[]} */
export const HOME_FAQ_ITEMS = [
	{
		question: 'Por que comprar imóvel na planta em Balneário Camboriú?',
		answer:
			'Balneário Camboriú combina alta demanda por moradia e veraneio, verticalização acelerada e lançamentos constantes em bairros consolidados como Centro, Barra Sul e Pioneiros. Comprar na planta pode permitir condições comerciais diferenciadas, escolha de unidade e acompanhamento da obra — desde que você compare localização, incorporadora e prazo de entrega antes de decidir.',
	},
	{
		question: 'Praia Central, Barra Sul ou Barra Norte: qual região escolher em Balneário Camboriú?',
		answer:
			'A Praia Central e o Centro concentram comércio, serviços e as torres mais altas, com frente mar na Avenida Atlântica. A Barra Sul reúne empreendimentos de alto padrão perto do Molhe e do Unipraias. A Barra Norte fica na divisa com a Praia Brava, com perfil mais residencial. A escolha depende de rotina, orçamento e se a compra é para morar, veranear ou investir.',
	},
	{
		question: 'Quais bairros de Balneário Camboriú têm mais lançamentos imobiliários?',
		answer:
			'Há oferta relevante em Centro, Barra Sul, Barra Norte, Praia Central, Pioneiros, Nações, Vila Real, Municípios e Bairro dos Estados, entre outros. No Viver Catarina você navega por bairro em /bairros ou pela home, filtrando apartamentos, casas e loteamentos disponíveis em cada região da cidade.',
	},
	{
		question: 'O que observar ao comprar apartamento na planta em Balneário Camboriú?',
		answer:
			'Verifique zoneamento e gabarito permitido no bairro, incidência de sombra na praia, distância até serviços e mobilidade, reputação da construtora, memorial descritivo, cronograma de obra, índice de correção do contrato e taxas de condomínio previstas. Em Balneário Camboriú, vaga de garagem, ventilação e trânsito na temporada também pesam na experiência diária.',
	},
	{
		question: 'Pré-lançamento, na planta ou pronto para morar: o que faz sentido em Balneário Camboriú?',
		answer:
			'Pré-lançamento e na planta tendem a atrair quem busca preço de tabela e prazo para pagar durante a obra. Pronto para morar atende quem precisa de entrega rápida ou quer ver a unidade concluída. Em Balneário Camboriú, a fase ideal varia conforme bairro, fluxo de caixa e se a compra é para morar, veraneio ou locação.',
	},
	{
		question: 'Balneário Camboriú é um bom lugar para investir em imóvel?',
		answer:
			'O litoral catarinense tem mercado líquido e forte sazonalidade turística, e Balneário Camboriú concentra demanda de veraneio e locação por temporada. Apartamentos compactos no Centro e próximos à Praia Central atraem locação; unidades frente mar e de alto padrão na Barra Sul têm público próprio. Analise sempre vacância, valor de condomínio e perfil do empreendimento.',
	},
	{
		question: 'Como comparar bairros e lançamentos em Balneário Camboriú?',
		answer:
			'Use a seção Bairros na home ou a página /bairros para ver lançamentos por região — Centro, Praia Central, Barra Sul, Barra Norte, Nações, Pioneiros e demais bairros da cidade. Compare preço por metro quadrado, tipologia, vaga, perfil do bairro e distância ao que importa para você. O blog e o glossário do site ajudam a entender termos do mercado local.',
	},
	{
		question: 'Quais cuidados na compra de imóvel novo em Balneário Camboriú?',
		answer:
			'Leia o contrato de promessa de compra e venda, confira registro da incorporação, acompanhe o cronograma da obra, entenda correção monetária e multas, e valide documentação no Cartório de Registro de Imóveis após o habite-se. Em Balneário Camboriú, as regras de zoneamento e de gabarito do plano diretor podem impactar diretamente o empreendimento.',
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
