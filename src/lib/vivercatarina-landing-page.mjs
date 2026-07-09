import { filterBalnearioCamboriuListings } from './property-data.mjs';
import { enrichProperty, loadNeighborhoodListing } from './property-listings.mjs';
import { resolveNeighborhoodPageSlug } from './neighborhood-slugs.mjs';
import { cleanPropertyTitle } from './property-slug.mjs';
import { SITE_NAME } from './site-contact.mjs';

function stripHtml(html) {
	return html?.replace(/<[^>]+>/g, '').trim() ?? '';
}

function boldEntities(text, entities) {
	if (!text || typeof text !== 'string') return text;
	const sorted = [...entities]
		.filter((e) => e && String(e).trim().length >= 3)
		.sort((a, b) => b.length - a.length);
	let result = text;
	for (const entity of sorted) {
		const esc = String(entity).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		result = result.replace(new RegExp(`(?<!")\\b(${esc})\\b`, 'gi'), '<strong>$1</strong>');
	}
	return result;
}

function boldMysideTexts(obj, entities) {
	const fields = ['locationParagraph', 'whyUsParagraphs', 'descriptionParagraphs', 'unitsLead'];
	const out = { ...obj };
	for (const field of fields) {
		if (!out[field]) continue;
		if (Array.isArray(out[field])) {
			out[field] = out[field].map((t) => boldEntities(t, entities));
		} else {
			out[field] = boldEntities(out[field], entities);
		}
	}
	return out;
}

export function usesMysideLandingLayout() {
	return true;
}

export const PHOTOS_ILLUSTRATIVE_DISCLAIMER =
	'As imagens desta galeria são meramente ilustrativas e têm caráter representativo. <strong>Acabamentos</strong>, <strong>mobiliário</strong>, <strong>paisagismo</strong> e demais detalhes das unidades podem variar conforme o <strong>memorial descritivo</strong> do empreendimento.';

function loadSimilarProperties(property, slug, page) {
	const neighborhoodSlug = resolveNeighborhoodPageSlug(property.address?.neighborhood?.slug);
	const listing = loadNeighborhoodListing(neighborhoodSlug);

	if (!listing?.properties?.length) {
		return [];
	}

	return filterBalnearioCamboriuListings(listing.properties)
		.filter((entry) => entry.slug !== slug)
		.slice(0, 4)
		.map((entry) =>
			enrichProperty(entry, {
				neighborhoodName: page.nav.neighborhood,
				cityName: page.nav.city,
			}),
		);
}

function defaultFeatureHighlights(property) {
	const features = (property.features || []).filter(Boolean);
	if (features.length > 0) {
		return features;
	}

	return [
		'Empreendimento na planta em região em valorização',
		'Localização em bairro consolidado de Balneário Camboriú',
		'Potencial para moradia ou investimento',
		'Acompanhamento com corretor credenciado',
	];
}

function defaultMysideContent(property, page) {
	const displayTitle = cleanPropertyTitle(property.title, property);
	// `district` é o bairro do endereço postal; `neighborhood` é o bairro que
	// tem página própria. Sem nenhum dos dois, a cidade assume o lugar.
	const neighborhood =
		property.address?.neighborhood?.name || property.address?.district || 'Balneário Camboriú';
	const city = property.address?.city?.name || 'Balneário Camboriú';
	const hasDescription = stripHtml(property.descriptionHtml || '').length > 0;
	const hasPhotos = (property.images || []).length > 0;
	const hasPlantas = (page.plantas || []).length > 0;
	const isPreLaunch = property.category === 'pre-lancamento';
	const registro = (page.ficha?.items || []).find((item) => item.label === 'Registro')?.value;
	const hasRegistro = Boolean(registro) && registro !== 'Não informado';

	return {
		statusLabel: page.hero.situacao,
		bedroomTabs: ['1 quarto', '2 quartos', '3 quartos'],
		unitsLead: hasPlantas
			? 'Consulte disponibilidade, metragens e condições de pagamento para cada tipologia.'
			: 'As plantas do empreendimento serão divulgadas pela incorporadora.',
		floorPlansNote: hasPlantas ? 'Plantas disponíveis' : 'Plantas ainda não divulgadas',
		photosNote: hasPhotos ? null : 'Fotos ainda não divulgadas',
		photosLead: hasPhotos
			? null
			: 'As imagens oficiais do empreendimento serão publicadas assim que forem liberadas pela incorporadora.',
		photosIntro: hasPhotos ? PHOTOS_ILLUSTRATIVE_DISCLAIMER : null,
		leadHeadline: isPreLaunch
			? `O ${displayTitle} ainda não foi lançado.`
			: `Interessado no ${displayTitle}?`,
		leadSubheadline: isPreLaunch
			? 'Mas podemos enviar todos os detalhes para você assim que mais informações forem divulgadas.'
			: 'Receba plantas, valores, condições de pagamento e disponibilidade com nossa equipe.',
		descriptionTitle: isPreLaunch
			? `Pré-lançamento ${displayTitle}: oportunidade na planta em ${neighborhood}`
			: `${displayTitle} em ${neighborhood}`,
		descriptionParagraphs: hasDescription
			? []
			: [
					`O ${displayTitle} integra o portfólio de imóveis na planta em ${neighborhood}, ${city}.`,
					'Entre em contato para receber plantas, tabela de preços, condições de pagamento e atualizações do empreendimento.',
				],
		featureHighlights: defaultFeatureHighlights(property),
		locationParagraph:
			neighborhood === city
				? `O empreendimento está em ${city}. Veja no mapa a localização, vias de acesso e pontos de interesse do entorno.`
				: `O empreendimento está em ${neighborhood}, ${city}. Veja no mapa a localização, vias de acesso e pontos de interesse do entorno.`,
		locationPoints: page.location?.points || [],
		disclaimer: isPreLaunch
			? 'Esse empreendimento ainda não está à venda. Todas as informações são preliminares, com o objetivo de informar potenciais clientes interessados no lançamento futuro. Detalhes serão confirmados no momento do lançamento.'
			: null,
		legalDisclaimer:
			'As informações desta página possuem caráter meramente informativo e não substituem a análise dos documentos oficiais do empreendimento. Condições comerciais, disponibilidade e valores estão sujeitos a alterações sem aviso prévio. Consulte sempre a incorporadora, o corretor responsável credenciado ao CRECI e a documentação do empreendimento antes da assinatura do contrato.',
		incorporationDisclaimer: hasRegistro
			? null
			: 'Venda condicionada ao registro de incorporação no Cartório de Registro de Imóveis, nos termos da Lei nº 4.591/64.',
		whyUsTitle: `O que é o Portal ${SITE_NAME}?`,
		whyUsParagraphs: [
			`O portal ${SITE_NAME} é especializado em imóveis na planta em Balneário Camboriú, reunindo lançamentos, pré-lançamentos e oportunidades por bairro com suporte de corretores credenciados.`,
			'Ajudamos você a comparar empreendimentos, entender condições de pagamento e acompanhar novidades antes do lançamento oficial.',
		],
	};
}

function parseBedroomCount(label) {
	const match = String(label || '').match(/(\d+)/);
	return match ? Number(match[1]) : null;
}

function capitalizeLabel(label) {
	const text = String(label || '').trim();
	if (!text) return text;
	return text.charAt(0).toLocaleUpperCase('pt-BR') + text.slice(1);
}

/** Plantas para a seção ViverCatarina: usa floorPlans reais ou gera tipologias das abas. */
export function buildMysideDisplayPlantas(page) {
	const plantas = page.plantas || [];
	if (plantas.length > 0) {
		return plantas;
	}

	const tabs = page.vivercatarina?.bedroomTabs?.length
		? page.vivercatarina.bedroomTabs
		: ['1 quarto', '2 quartos', '3 quartos'];
	const displayTitle = page.seo?.h1 || 'Empreendimento';

	return tabs.map((tab, index) => {
		const titulo = capitalizeLabel(tab);
		const quartos = parseBedroomCount(tab);

		return {
			tipo: titulo,
			titulo,
			quartos,
			imageUrl: null,
			imageAlt: `Planta ${titulo} do ${displayTitle} — metragem sob consulta, em lançamento na planta`,
			imageTitle: displayTitle,
			highlights: quartos ? [`${quartos} ${quartos === 1 ? 'quarto' : 'quartos'}`] : [],
			precoAPartir: 'Sob consulta',
			unidadesResumo: null,
			specItems: [
				{ label: 'Tipologia', value: titulo },
				{ label: 'Área privativa', value: 'A divulgar' },
				{ label: 'Quartos', value: quartos ? `${quartos} ${quartos === 1 ? 'quarto' : 'quartos'}` : 'A divulgar' },
				{ label: 'Preço', value: 'Sob consulta' },
				{ label: 'Status', value: 'Em breve' },
			],
			badge: index === 0 ? 'Lançamento' : null,
		};
	});
}

export function buildMysideLandingExtras(property, slug, page) {
	const custom = property.vivercatarina || {};
	const defaults = defaultMysideContent(property, page);

	const displayTitle = cleanPropertyTitle(property.title, property);
	const neighborhood = property.address?.neighborhood?.name || '';
	const city = property.address?.city?.name || '';
	const construtora = property.developer?.name || property.construtora || '';
	const boldEntitiesList = [displayTitle, neighborhood, city, construtora, SITE_NAME].filter(Boolean);

	const merged = {
		...defaults,
		...custom,
		featureHighlights: custom.featureHighlights || defaults.featureHighlights,
		descriptionParagraphs:
			custom.descriptionParagraphs !== undefined
				? custom.descriptionParagraphs
				: defaults.descriptionParagraphs,
		locationPoints:
			custom.locationPoints !== undefined ? custom.locationPoints : defaults.locationPoints,
	};

	return {
		landingLayout: 'vivercatarina',
		vivercatarina: boldMysideTexts(merged, boldEntitiesList),
		similarProperties: loadSimilarProperties(property, slug, page),
	};
}
