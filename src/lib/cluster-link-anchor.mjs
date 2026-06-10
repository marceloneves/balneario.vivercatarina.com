/**
 * Regras globais de âncora para linkagem interna (corpo e blocos gerados).
 * Máximo de 3 palavras por texto visível do link.
 */

export const MAX_LINK_ANCHOR_WORDS = 3;

/** Conta palavras (sequências não vazias separadas por espaço). */
export function countAnchorWords(text) {
	if (!text || typeof text !== 'string') {
		return 0;
	}

	return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Rótulo curto (uso opcional; Explore e Leia também usam título completo). */
export function shortLinkLabel(title, maxWords = MAX_LINK_ANCHOR_WORDS) {
	if (!title) {
		return '';
	}

	const words = title
		.replace(/[:\?]/g, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean);

	return words.slice(0, maxWords).join(' ');
}

/**
 * Valida trecho `find` do plano de corpo.
 * @param {string} find
 * @param {string} [context]
 */
export function assertBodyAnchorWords(find, context = 'corpo') {
	const n = countAnchorWords(find);
	if (n > MAX_LINK_ANCHOR_WORDS) {
		throw new Error(
			`Âncora de link no ${context} com ${n} palavras (máx. ${MAX_LINK_ANCHOR_WORDS}): "${find}"`,
		);
	}
}

/**
 * Valida regra de linkify automático (`blog-content-links`).
 * @param {{ text: string }} rule
 */
export function assertPhraseRuleWords(rule) {
	assertBodyAnchorWords(rule.text, 'linkify automático');
}

const TAG_RE = /<[^>]+>/g;

/** Primeira palavra que enfraquece a âncora (artigos, preposições soltas). */
const WEAK_ANCHOR_START =
	/^(o|a|os|as|um|uma|uns|umas|nos|nas|no|na|em|de|do|da|dos|das|e|ao|aos|à|às)$/i;

function stripTags(html) {
	return html.replace(TAG_RE, ' ');
}

function anchorStartsWeak(candidate) {
	const first = candidate.trim().split(/\s+/)[0] ?? '';
	return WEAK_ANCHOR_START.test(first);
}

function anchorEndsWeak(candidate) {
	const parts = candidate.trim().split(/\s+/).filter(Boolean);
	const last = parts[parts.length - 1] ?? '';
	return WEAK_ANCHOR_START.test(last);
}

/** Âncora que começa ou termina com artigo/preposição solta. */
export function isWeakBodyAnchor(text) {
	if (!text?.trim()) {
		return false;
	}

	return anchorStartsWeak(text) || anchorEndsWeak(text);
}

/**
 * Escolhe a melhor janela de até 3 palavras dentro de `find` que exista no HTML.
 * Prefere trechos sem artigo/preposição no início ou no fim.
 */
function bestThreeWordWindow(plain, words) {
	let best = null;
	let bestQuality = -1;

	for (let i = 0; i <= words.length - MAX_LINK_ANCHOR_WORDS; i += 1) {
		const candidate = words.slice(i, i + MAX_LINK_ANCHOR_WORDS).join(' ');
		if (!plain.includes(candidate)) {
			continue;
		}

		const quality = isWeakBodyAnchor(candidate) ? 0 : 1;
		if (quality > bestQuality) {
			best = candidate;
			bestQuality = quality;
		}
	}

	return best;
}

/**
 * Encurta `find` para até 3 palavras que existam no HTML (janela deslizante).
 * @param {string} html
 * @param {string} find
 * @returns {string | null}
 */
export function shortenFindInHtml(html, find) {
	if (!find?.trim()) {
		return null;
	}

	const plain = stripTags(html);
	const words = find.trim().split(/\s+/).filter(Boolean);

	if (words.length <= MAX_LINK_ANCHOR_WORDS) {
		return plain.includes(find) ? find : null;
	}

	const threeWord = bestThreeWordWindow(plain, words);
	if (threeWord) {
		return threeWord;
	}

	for (let len = MAX_LINK_ANCHOR_WORDS - 1; len >= 1; len -= 1) {
		for (let i = 0; i <= words.length - len; i += 1) {
			const candidate = words.slice(i, i + len).join(' ');
			if (plain.includes(candidate) && !isWeakBodyAnchor(candidate)) {
				return candidate;
			}
		}
	}

	return null;
}

/**
 * Atalhos editoriais quando a janela automática gera âncora pouco natural.
 * Chave = `find` longo do plano; valor = trecho de até 3 palavras no HTML.
 */
export const BODY_FIND_SHORTCUTS = {
	'faixa mais procurada por quem vai morar': 'faixa mais procurada',
	'do que no de apartamentos': 'mercado de apartamentos',
	'financiamento de R$ 400 mil': 'financiamento bancário',
	'Campeche Norte / Novo Campeche': 'Campeche Norte',
	'consulte o guia de Preço do m² no Campeche': 'guia de Preço',
	'Nos Apartamentos à venda no Campeche': 'Apartamentos à venda',
	'O Aluguel no Campeche está': 'Aluguel no Campeche',
	'O custo de vida no Campeche é considerado': 'custo de vida',
	'Comprar casa no Campeche é uma decisão de localização': 'decisão de localização',
	'O metro quadrado na planta': 'metro quadrado',
	'O confronto entre Campeche': 'confronto entre Campeche',
	'O Rio Tavares faz fronteira com o Campeche': 'Rio Tavares',
	'A maioria das compras no Campeche passa por financiamento': 'compras no Campeche',
	'A reputação do Campeche se sustenta': 'reputação do Campeche',
	'infraestrutura completa que o bairro consolidou': 'infraestrutura completa',
	'um dos melhores bairros para morar no sul de Balneário Camboriú': 'melhores bairros para',
	'O Campeche entrega uma infraestrutura comercial de bairro grande': 'infraestrutura comercial',
	'no coração do bairro': 'coração do bairro',
	'famílias jovens que precisam conciliar': 'famílias jovens',
	'O retorno total de um imóvel': 'retorno total',
	'equilibra localização e variedade de preço': 'variedade de preço',
	'lançamentos compactos para temporada': 'lançamentos compactos',
	'condomínios fechados de luxo': 'condomínios fechados',
	'mais tranquila e distante da agitação': 'mais tranquila',
	'O Campeche vence em comércio, vida noturna, oferta de imóveis e potencial de valorização':
		'potencial de valorização',
	'O preço acompanha o nível de desenvolvimento de cada bairro': 'preço acompanha',
	'metro quadrado entre os mais caros': 'metro quadrado',
	'O metro quadrado do bairro é um dos mais caros do país': 'metro quadrado',
	'renda passiva via aluguel de temporada': 'aluguel de temporada',
	'locação de temporada de alto padrão': 'locação de temporada',
	'A distância do mar e o tamanho do terreno são os principais fatores': 'distância do mar',
	'Em Jurerê Internacional, o metro quadrado fica': 'metro quadrado',
	'vale a pena morar': 'vale a pena',
	'O preço por metro quadrado valorizou cerca de 50%': 'preço por metro',
	'A locação de temporada é altamente demandada': 'locação de temporada',
	'O preço por metro quadrado valorizou': 'preço por metro',
	'A locação de temporada é altamente': 'locação de temporada',
	'O retorno total de um imóvel': 'retorno total',
	'combina dois motores que poucos ativos reúnem': 'combina dois motores',
	'O bairro registra o metro quadrado de locação mais caro da cidade': 'locação mais caro',
	'O bairro liderou a valorização imobiliária de Balneário Camboriú': 'valorização imobiliária',
	'Os apartamentos são a entrada relativa do bairro': 'entrada relativa',
	'As casas são a essência do bairro': 'essência do bairro',
	'Réveillon e o Carnaval são o topo absoluto': 'Réveillon e Carnaval',
	'Jurerê é um dos melhores mercados de locação do país': 'mercados de locação',
	'valorização acima da média': 'acima da média',
	'restaurantes renomados e o Open Shopping': 'Open Shopping',
	'som grave da música eletrônica': 'música eletrônica',
	'dois bairros em um': 'dois bairros em',
	'O comércio de Jurerê gira em torno do': 'comércio de Jurerê',
	'A moradia é o item que mais define': 'item que mais',
	'metro quadrado está entre os mais altos': 'metro quadrado',
	'bom potencial de aluguel de temporada': 'aluguel de temporada',
	'Jurerê reúne uma constelação de beach clubs': 'beach clubs',
	'melhor parte de viver ali': 'parte de viver',
	'oportunidade de renda relevante': 'oportunidade de renda',
	'tarifas de hospedagem caem drasticamente': 'tarifas de hospedagem',
	'eventos-âncora que pautam a temporada': 'pautam a temporada',
	'Furtos de oportunidade': 'furtos de oportunidade',
	'alinhar o formato ao orçamento': 'formato ao orçamento',
	'concentração dos beach clubs': 'beach clubs',
	'dividem a mesma faixa de areia contínua': 'areia contínua',
	'Já o inverno revela uma Jurerê': 'Jurerê quase secreta',
	'moderno sistema de segurança particular': 'sistema de segurança',
	'já foi alvo de reclamações de moradores': 'alvo de reclamações',
	'distância até o Open Shopping': 'Open Shopping',
	'infraestrutura silenciosa e confiável': 'silenciosa e confiável',
	'réveillon e shows de grandes DJs': 'réveillon e shows',
	'As vantagens do bairro são reais': 'vantagens do bairro',
	'águas tranquilas, claras e mornas': 'águas tranquilas, claras',
	'O custo de vida em Jurerê é dos mais altos': 'custo de vida',
	'forte sazonalidade do norte de Balneário Camboriú': 'sazonalidade do Norte',
	'valorização recorde': 'valorização recorde',
	'vigilância privada 24 horas': 'vigilância privada 24',
	'mesma praia de águas calmas': 'praia de águas',
	'concentrado no Open Shopping': 'Open Shopping',
	'escolher onde morar ou investir com inteligência': 'morar ou investir',
};

/**
 * @param {string} html HTML do artigo (corpo, sem blocos relacionados)
 * @param {string} find Trecho do plano
 * @returns {string}
 */
export function resolveBodyFind(html, find) {
	const plain = stripTags(html);
	const shortcut = BODY_FIND_SHORTCUTS[find];
	if (shortcut && plain.includes(shortcut) && !isWeakBodyAnchor(shortcut)) {
		assertBodyAnchorWords(shortcut);
		return shortcut;
	}

	if (countAnchorWords(find) <= MAX_LINK_ANCHOR_WORDS && plain.includes(find) && !isWeakBodyAnchor(find)) {
		return find;
	}

	const shortened = shortenFindInHtml(html, find);
	if (shortened) {
		assertBodyAnchorWords(shortened);
		return shortened;
	}

	throw new Error(
		`Não foi possível encurtar âncora (${countAnchorWords(find)} palavras) para ≤${MAX_LINK_ANCHOR_WORDS}: "${find}"`,
	);
}

/** @param {string} html */
export function findOverlongBodyAnchors(html) {
	const withoutBlocks = html
		.replace(/<div class="blog-related blog-property-hub-row">[\s\S]*?<\/div>\s*/g, '')
		.replace(/<div class="blog-related">[\s\S]*?<\/div>\s*/g, '');
	const matches = [...withoutBlocks.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
	const over = [];

	for (const [, href, inner] of matches) {
		const text = stripTags(inner).trim();
		const words = countAnchorWords(text);
		if (words > MAX_LINK_ANCHOR_WORDS) {
			over.push({ href, text, words });
		}
	}

	return over;
}

function stripRelatedBlocks(html) {
	return html
		.replace(/<div class="blog-related blog-property-hub-row">[\s\S]*?<\/div>\s*/g, '')
		.replace(/<div class="blog-related">[\s\S]*?<\/div>\s*/g, '');
}

/** @param {string} html */
export function findWeakBodyAnchors(html) {
	const withoutBlocks = stripRelatedBlocks(html);
	const matches = [...withoutBlocks.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
	const weak = [];

	for (const [, href, inner] of matches) {
		const text = stripTags(inner).trim();
		if (!text || !isWeakBodyAnchor(text)) {
			continue;
		}

		weak.push({ href, text, words: countAnchorWords(text) });
	}

	return weak;
}
