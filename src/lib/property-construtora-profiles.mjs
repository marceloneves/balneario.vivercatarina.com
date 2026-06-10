const CONSTRUTORA_PROFILES = [
	{
		id: 'spot',
		displayName: 'Spot',
		matchers: [/\bspot\b/i, /empresa especializada em spe/i],
		summary:
			'A Spot é uma incorporadora com atuação em Balneário Camboriú voltada a empreendimentos compactos e ao modelo de locação por temporada, com histórico de obras entregues na Grande Balneário Camboriú.',
	},
	{
		id: 'wkoerich',
		displayName: 'WKoerich',
		matchers: [/wkoerich/i, /\bkabi\b/i],
		summary:
			'A WKoerich integra o grupo KABI Empreendimentos Imobiliários e atua em lançamentos residenciais no Centro de Balneário Camboriú.',
	},
	{
		id: 'lumis',
		displayName: 'Lumis',
		matchers: [/lumis/i],
		summary:
			'A Lumis é incorporadora com atuação em lançamentos de médio e alto padrão em bairros como Campeche e outras regiões de Balneário Camboriú.',
	},
	{
		id: 'luma',
		displayName: 'Luma',
		matchers: [/\bluma\b/i],
		summary:
			'A Luma desenvolve empreendimentos residenciais e comerciais em Balneário Camboriú, com projetos no norte de Balneário Camboriú e em outras regiões da cidade.',
	},
];

export function resolveConstrutoraProfile(property, haystack) {
	for (const profile of CONSTRUTORA_PROFILES) {
		if (profile.matchers.some((matcher) => matcher.test(haystack))) {
			return profile;
		}
	}

	return null;
}

export function extractConstrutoraFactsFromText(text) {
	const facts = [];

	const sinceYear = text.match(/(?:desde|atuante desde|fundada em)\s+(\d{4})/i);
	if (sinceYear) {
		facts.push({ label: 'Atuação desde', value: sinceYear[1] });
	}

	const yearsActive = text.match(/(\d+)\s+anos?\s+de\s+(?:atuação|experiência|mercado|história)/i);
	if (yearsActive) {
		facts.push({ label: 'Tempo de atuação', value: `${yearsActive[1]} anos` });
	}

	const deliveredCount = text.match(
		/(\d+)\s+(?:empreendimentos?|imóveis|obras?|unidades?|projetos?)\s+(?:já\s+)?entregue/i,
	);
	if (deliveredCount) {
		facts.push({
			label: 'Empreendimentos entregues',
			value: deliveredCount[1],
		});
	}

	const deliveredMoreThan = text.match(
		/(?:mais de|acima de)\s+(\d+)\s+(?:empreendimentos?|imóveis|obras?|unidades?|projetos?)/i,
	);
	if (deliveredMoreThan) {
		facts.push({
			label: 'Empreendimentos entregues',
			value: `mais de ${deliveredMoreThan[1]}`,
		});
	}

	if (!deliveredCount && !deliveredMoreThan) {
		if (/diversos imóveis já entregues/i.test(text)) {
			facts.push({
				label: 'Empreendimentos entregues',
				value: 'diversos imóveis já entregues',
			});
		} else if (/histórico de obras entregues/i.test(text)) {
			facts.push({
				label: 'Empreendimentos entregues',
				value: 'histórico de obras entregues',
			});
		} else if (/vários empreendimentos entregues/i.test(text)) {
			facts.push({
				label: 'Empreendimentos entregues',
				value: 'vários empreendimentos entregues',
			});
		}
	}

	return facts;
}

export function isConstrutoraTrackRecordSentence(sentence) {
	if (
		/valores e disponibilidade|condições de pagamento|atualizados em|entrada em \d|estuda-se imóvel|fale com nossos consultores/i.test(
			sentence,
		)
	) {
		return false;
	}

	if (
		/^(?:tipologias|áreas comuns|rooftop|localização e entorno|destaques do|unidades disponíveis)/i.test(
			sentence,
		)
	) {
		return false;
	}

	if (
		/piscina|fitness|spa|coworking|home market|mini market|studios ideais|loft[s]? com|sacada com churrasqueira/i.test(
			sentence,
		) &&
		!/incorporadora|construtora|entregue|obras entregues|vasta experiência/i.test(sentence)
	) {
		return false;
	}

	if (
		/modalidade\s+SPE|sociedade de propósito específico|lançamento\s+SPE/i.test(sentence) &&
		!/incorporadora|construtora|entregue|histórico|renomada|sólida|vasta experiência|obras entregues/i.test(
			sentence,
		)
	) {
		return false;
	}

	if (
		/rentabilidade|short stay|temporada|investimento inteligente|ideal para investir/i.test(sentence) &&
		!/incorporadora|construtora|entregue|histórico|renomada|sólida|vasta experiência|obras entregues/i.test(
			sentence,
		)
	) {
		return false;
	}

	return /incorporadora sólida|construtora renomada|construíd[oa] por uma incorporadora|projetado por uma construtora|imóveis já entregues|obras entregues|histórico comprovado|histórico de obras|vasta experiência|\d+\s+anos de|desde \d{4}|empresa especializada em spe[s]?/i.test(
		sentence,
	);
}

export function cleanConstrutoraSentence(sentence) {
	return sentence
		.replace(/,?\s*este empreendimento é construíd[oa] na modalidade.*$/i, '.')
		.replace(/,?\s*garantindo maior transparência.*$/i, '.')
		.replace(/,?\s*uma das regiões mais.*$/i, '.')
		.replace(/,?\s*esta casa é perfeita.*$/i, '.')
		.replace(/,?\s*o empreendimento oferece.*$/i, '.')
		.replace(/\s+/g, ' ')
		.trim();
}
