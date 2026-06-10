import {
	buildLocationLabel,
	buildMapEmbedUrl,
	buildMapUrl,
	buildPriceLabel,
	getPropertyCode,
	getPropertyImageUrl,
	getPropertyVideoUrl,
	resolvePropertyCityName,
} from './property-data.mjs';
import { getCategoryLabel } from './property-listings.mjs';
import { buildFinancingSimulation } from './property-financing.mjs';
import { formatBrCurrency } from './property-price.mjs';
import { buildPropertyRealEstateListingJsonLd } from './property-schema.mjs';
import { cleanPropertyTitle } from './property-slug.mjs';
import { applyGlossaryInlineLinks } from './glossary-content-links.mjs';
import {
	buildPropertyGalleryImageAlt,
	buildPropertyImageTitle,
	buildPropertyPlantaImageAlt,
	normalizeDescriptionImageAlts,
} from './property-image-alt.mjs';
import { buildGalleryImageSources } from './property-image-variants.mjs';
import { buildPropertySeo } from './site-seo.mjs';
import { SITE_NAME, SITE_WHATSAPP_NUMBER } from './site-contact.mjs';
import {
	cleanConstrutoraSentence,
	isConstrutoraTrackRecordSentence,
	resolveConstrutoraProfile,
} from './property-construtora-profiles.mjs';

const WHATSAPP_NUMBER = SITE_WHATSAPP_NUMBER;
const NOT_INFORMED = 'Não informado';

function normalizeVoidElements(html) {
	return html.replace(/<br\s*\/>/gi, '<br>').replace(/<hr\s*\/>/gi, '<hr>');
}

function linkifyGlossaryContent(value) {
	return value ? normalizeVoidElements(applyGlossaryInlineLinks(value)) : value;
}

function linkifyGlossaryList(items) {
	return items.map((item) => linkifyGlossaryContent(item));
}

function linkifyFaqItems(items) {
	return items.map((item) => ({
		pergunta: item.pergunta,
		resposta: linkifyGlossaryContent(item.resposta),
	}));
}

const FEATURE_ICON_MAP = {
	bicicletario: 'fa-solid fa-bicycle',
	elevador: 'fa-solid fa-building',
	piscina: 'fa-solid fa-person-swimming',
	academia: 'fa-solid fa-dumbbell',
	churrasqueira: 'fa-solid fa-fire',
	garagem: 'fa-solid fa-car',
	portaria: 'fa-solid fa-shield-halved',
	sauna: 'fa-solid fa-hot-tub-person',
	wifi: 'fa-solid fa-wifi',
};

function stripHtml(html) {
	return html
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;|&#8211;|&amp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function parseBrMoney(value) {
	if (!value) {
		return null;
	}

	return Number(value.replace(/\./g, '').replace(',', '.'));
}

function formatBrMoney(amount) {
	return formatBrCurrency(amount) ?? 'Sob consulta';
}

function parseArea(text) {
	const match = text.match(/(\d+(?:[.,]\d+)?)\s*m(?:²|2)/i);
	return match ? Number(match[1].replace(',', '.')) : null;
}

function parseAreaRange(text) {
	const range = text.match(
		/(\d+(?:[.,]\d+)?)\s*m(?:²|2)\s*a\s*(\d+(?:[.,]\d+)?)\s*m(?:²|2)/i,
	);

	if (range) {
		return {
			min: Number(range[1].replace(',', '.')),
			max: Number(range[2].replace(',', '.')),
		};
	}

	const single = parseArea(text);
	return { min: single, max: single };
}

function parseUnitDetails(text) {
	const normalized = text || '';
	const suites = normalized.match(/(\d+)\s*su[ií]tes?/i);
	const bedrooms = normalized.match(/(\d+)\s*(?:quartos?|dormit[oó]rios?)/i);
	const vagas = normalized.match(/(\d+)\s*vagas?/i);
	const banheiros = normalized.match(/(\d+)\s*banheiros?/i);

	let quartos = null;
	if (/studio/i.test(normalized)) {
		quartos = 0;
	} else if (suites) {
		quartos = Number(suites[1]);
	} else if (bedrooms) {
		quartos = Number(bedrooms[1]);
	}

	return {
		quartos,
		suites: suites ? Number(suites[1]) : null,
		vagas: vagas ? Number(vagas[1]) : null,
		banheiros: banheiros ? Number(banheiros[1]) : null,
		lavabo: /lavabo/i.test(normalized),
		varanda: /varanda|sacada/i.test(normalized),
	};
}

function parseExtendedPlantaDetails(text) {
	const normalized = text || '';
	const areaTotal = normalized.match(
		/(\d+(?:[.,]\d+)?)\s*m(?:²|2)\s*(?:de\s*)?(?:área\s*)?total/i,
	);
	const varandaArea = normalized.match(
		/(?:varanda|sacada)[^.\d\n]{0,50}(\d+(?:[.,]\d+)?)\s*m(?:²|2)/i,
	);
	const andares = normalized.match(
		/(\d+)[º°]?\s*(?:ao|a)\s*(\d+)[º°]?(?:\s*(?:andar|pavimento))?/i,
	);
	const unidadesDisponiveis = normalized.match(/(\d+)\s*unidades?\s*dispon[ií]ve(is|l)/i);

	let vagaTipo = null;
	if (/vagas?\s*(?:de\s*garagem\s*)?cobertas?/i.test(normalized) || /(\d+)\s*vagas?\s*cobertas?/i.test(normalized)) {
		vagaTipo = 'coberta';
	} else if (/vagas?\s*(?:de\s*garagem\s*)?rotativas?/i.test(normalized)) {
		vagaTipo = 'rotativa';
	} else if (/vaga\s*(?:de\s*garagem\s*)?descoberta/i.test(normalized)) {
		vagaTipo = 'descoberta';
	}

	return {
		areaTotal: areaTotal ? Number(areaTotal[1].replace(',', '.')) : null,
		varandaArea: varandaArea ? Number(varandaArea[1].replace(',', '.')) : null,
		vagaTipo,
		andares: andares ? `${andares[1]}º ao ${andares[2]}º` : null,
		unidadesDisponiveis: unidadesDisponiveis ? Number(unidadesDisponiveis[1]) : null,
	};
}

function formatAreaValue(value) {
	if (value == null || Number.isNaN(value)) {
		return null;
	}

	const formatted = Number(value).toLocaleString('pt-BR', {
		minimumFractionDigits: Number(value) % 1 === 0 ? 0 : 2,
		maximumFractionDigits: 2,
	});

	return `${formatted} m²`;
}

function formatAreaPrivativaLabel(planta) {
	const { areaPrivativaMin, areaPrivativaMax } = planta;

	if (areaPrivativaMin && areaPrivativaMax && areaPrivativaMin !== areaPrivativaMax) {
		return `${formatAreaValue(areaPrivativaMin)} a ${formatAreaValue(areaPrivativaMax)}`;
	}

	return formatAreaValue(areaPrivativaMin ?? areaPrivativaMax);
}

function formatPlantaTitulo(planta) {
	if (planta.suites === 1) {
		return '1 Suíte';
	}

	if (planta.suites > 1) {
		return `${planta.suites} Suítes`;
	}

	if (planta.quartos === 0) {
		return 'Studio';
	}

	if (planta.quartos === 1) {
		return '1 Quarto';
	}

	if (planta.quartos) {
		return `${planta.quartos} Quartos`;
	}

	return planta.tipo || 'Unidade';
}

function formatQuartosLabel(planta) {
	if (planta.suites === 1) {
		return '1 suíte';
	}

	if (planta.suites > 1) {
		return `${planta.suites} suítes`;
	}

	if (planta.quartos === 0) {
		return 'Studio';
	}

	if (planta.quartos === 1) {
		return '1 quarto';
	}

	if (planta.quartos) {
		return `${planta.quartos} quartos`;
	}

	return NOT_INFORMED;
}

function formatVarandaLabel(planta) {
	if (!planta.varanda) {
		return NOT_INFORMED;
	}

	if (planta.varandaArea) {
		return `Sim · ${formatAreaValue(planta.varandaArea)}`;
	}

	return 'Sim';
}

function formatVagaLabel(planta) {
	if (planta.vagas == null) {
		return NOT_INFORMED;
	}

	if (planta.vagaTipo) {
		return planta.vagas === 1
			? `1 ${planta.vagaTipo}`
			: `${planta.vagas} ${planta.vagaTipo}s`;
	}

	return planta.vagas === 1 ? '1 vaga' : `${planta.vagas} vagas`;
}

function buildPlantaHighlights(planta) {
	const highlights = [];
	const quartos = formatQuartosLabel(planta);

	if (quartos !== NOT_INFORMED) {
		highlights.push(quartos);
	}

	if (planta.banheiros != null) {
		highlights.push(
			planta.banheiros === 1 ? '1 banheiro' : `${planta.banheiros} banheiros`,
		);
	}

	if (planta.vagas != null) {
		highlights.push(planta.vagas === 1 ? '1 vaga' : `${planta.vagas} vagas`);
	}

	const areaPrivativa = formatAreaPrivativaLabel(planta);
	if (areaPrivativa) {
		highlights.push(`${areaPrivativa} privativo`);
	}

	if (planta.areaTotal) {
		highlights.push(`${formatAreaValue(planta.areaTotal)} total`);
	}

	return highlights;
}

function mergePlantaExtendedFields(planta, text) {
	const extended = parseExtendedPlantaDetails(text);

	return {
		...planta,
		areaTotal: planta.areaTotal ?? extended.areaTotal,
		varandaArea: planta.varandaArea ?? extended.varandaArea,
		vagaTipo: planta.vagaTipo ?? extended.vagaTipo,
		andares: planta.andares ?? extended.andares,
		unidadesDisponiveis: planta.unidadesDisponiveis ?? extended.unidadesDisponiveis,
	};
}

function normalizePlantaDisplay(planta, property, index = 0) {
	const merged = mergePlantaExtendedFields(planta, planta.rawText || planta.tipo || '');
	const titulo = formatPlantaTitulo(merged);
	const unidadesDisponiveis = merged.unidadesDisponiveis;

	return {
		...merged,
		titulo,
		imageAlt: buildPropertyPlantaImageAlt(property, { ...merged, titulo }, index),
		imageTitle: buildPropertyImageTitle(property),
		highlights: buildPlantaHighlights(merged),
		unidadesResumo: unidadesDisponiveis
			? `${unidadesDisponiveis} ${unidadesDisponiveis === 1 ? 'unidade disponível' : 'unidades disponíveis'}`
			: null,
		specItems: [
			{
				label: 'Área privativa',
				value: formatAreaPrivativaLabel(merged) || NOT_INFORMED,
			},
			{
				label: 'Área total',
				value: formatAreaValue(merged.areaTotal) || NOT_INFORMED,
			},
			{ label: 'Quartos', value: formatQuartosLabel(merged) },
			{
				label: 'Banheiros',
				value:
					merged.banheiros != null ? String(merged.banheiros) : NOT_INFORMED,
			},
			{ label: 'Varanda', value: formatVarandaLabel(merged) },
			{ label: 'Preço', value: merged.precoAPartir || NOT_INFORMED },
			{ label: 'Vaga', value: formatVagaLabel(merged) },
			{ label: 'Andares', value: merged.andares || NOT_INFORMED },
			{
				label: 'Unidades',
				value: unidadesDisponiveis
					? `${unidadesDisponiveis} disponíveis`
					: NOT_INFORMED,
			},
			{ label: 'Status', value: merged.status || 'Disponível' },
		],
	};
}

function inferTipo(rawText, details) {
	if (/studio/i.test(rawText)) {
		return 'Studio';
	}

	if (/garden/i.test(rawText)) {
		return 'Garden';
	}

	if (/cobertura/i.test(rawText)) {
		return 'Cobertura';
	}

	if (/loft/i.test(rawText)) {
		return 'Loft';
	}

	if (/sala comercial/i.test(rawText)) {
		return 'Sala comercial';
	}

	if (/terreno|lote/i.test(rawText)) {
		return 'Terreno';
	}

	if (details.quartos === 0) {
		return 'Studio';
	}

	if (details.quartos) {
		return `${details.quartos} ${details.quartos === 1 ? 'Quarto' : 'Quartos'}`;
	}

	return rawText.split(/ a partir de /i)[0]?.trim().slice(0, 80) || 'Unidade';
}

function parseBaseUnitPrice(descriptionHtml) {
	const match = stripHtml(descriptionHtml || '').match(
		/unidades?\s+a partir de\s*R\$\s*([\d.\s]+(?:,\d{2})?)/i,
	);

	return match ? parseBrMoney(match[1].replace(/\s/g, '')) : null;
}

export function parsePlantasFromDescription(descriptionHtml) {
	if (!descriptionHtml) {
		return [];
	}

	const plantas = [];
	const seen = new Set();
	const blockPattern = /<(p|h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi;

	for (const match of descriptionHtml.matchAll(blockPattern)) {
		const text = stripHtml(match[2]);

		if (!/a partir de/i.test(text) || /^entrada\s/i.test(text)) {
			continue;
		}

		const priceMatch = text.match(/a partir de\s*R\$\s*([\d.\s]+(?:,\d{2})?)/i);
		if (!priceMatch) {
			continue;
		}

		const price = parseBrMoney(priceMatch[1].replace(/\s/g, ''));
		const beforePrice = text.split(/a partir de/i)[0].trim();
		const rawText =
			beforePrice.length > 3 ? beforePrice : text.replace(/a partir de[\s\S]*$/i, '').trim();

		if (/^unidades?$/i.test(rawText)) {
			continue;
		}

		const key = `${rawText}|${price}`;
		if (seen.has(key)) {
			continue;
		}

		seen.add(key);

		const area = parseAreaRange(`${rawText} ${text}`);
		const details = parseUnitDetails(rawText);
		const extended = parseExtendedPlantaDetails(rawText);

		plantas.push({
			tipo: inferTipo(rawText, details),
			areaPrivativaMin: area.min,
			areaPrivativaMax: area.max,
			areaTotal: extended.areaTotal,
			quartos: details.quartos,
			suites: details.suites,
			banheiros: details.banheiros,
			vagas: details.vagas,
			lavabo: details.lavabo,
			varanda: details.varanda,
			varandaArea: extended.varandaArea,
			vagaTipo: extended.vagaTipo,
			andares: extended.andares,
			unidadesDisponiveis: extended.unidadesDisponiveis,
			precoAPartir: formatBrMoney(price),
			precoAmount: price,
			status: 'Disponível',
			badge: plantas.length === 0 ? 'Lançamento' : null,
			rawText,
			imageUrl: null,
		});
	}

	return plantas;
}

function extractPlantaSignature(text) {
	const details = parseUnitDetails(text || '');
	const area = parseArea(text || '');

	return {
		...details,
		area,
		isStudio: /studio/i.test(text || ''),
	};
}

function scorePlantaMatch(floorPlan, descPlanta) {
	const fpText = `${floorPlan.title} ${floorPlan.image || ''}`;
	const fpSig = extractPlantaSignature(fpText);
	const descSig = extractPlantaSignature(descPlanta.rawText);
	let score = 0;

	if (fpSig.isStudio && descSig.quartos === 0) {
		score += 10;
	}

	if (fpSig.quartos != null && descSig.quartos != null && fpSig.quartos === descSig.quartos) {
		score += 8;
	}

	if (fpSig.suites != null && descSig.suites != null && fpSig.suites === descSig.suites) {
		score += 8;
	}

	const fpSuites = fpText.match(/(\d+)[-\s]su[ií]tes?/i);
	if (fpSuites && descSig.suites === Number(fpSuites[1])) {
		score += 6;
	}

	if (fpSig.area && descSig.area && Math.abs(fpSig.area - descSig.area) < 8) {
		score += 4;
	}

	return score;
}

function findMatchingDescriptionPlanta(floorPlan, descriptionPlantas) {
	if (!descriptionPlantas.length) {
		return null;
	}

	let best = null;
	let bestScore = 0;

	for (const planta of descriptionPlantas) {
		const score = scorePlantaMatch(floorPlan, planta);
		if (score > bestScore) {
			bestScore = score;
			best = planta;
		}
	}

	return bestScore > 0 ? best : null;
}

function buildPlantaFromFloorPlan(floorPlan, descPlanta, property, slug, index, basePrice) {
	const fpText = `${floorPlan.title} ${floorPlan.image || ''}`;
	const fpDetails = parseUnitDetails(fpText);
	const fpArea = parseAreaRange(fpText);

	return {
		tipo: floorPlan.title,
		areaPrivativaMin: descPlanta?.areaPrivativaMin ?? fpArea.min ?? property.overview?.sizeSqm,
		areaPrivativaMax:
			descPlanta?.areaPrivativaMax ?? fpArea.max ?? descPlanta?.areaPrivativaMin ?? property.overview?.sizeSqm,
		areaTotal: descPlanta?.areaTotal ?? null,
		quartos: descPlanta?.quartos ?? fpDetails.quartos ?? property.overview?.bedrooms,
		suites: descPlanta?.suites ?? fpDetails.suites,
		banheiros: descPlanta?.banheiros ?? fpDetails.banheiros ?? property.overview?.bathrooms,
		vagas: descPlanta?.vagas ?? fpDetails.vagas ?? property.overview?.garages,
		lavabo: descPlanta?.lavabo ?? fpDetails.lavabo,
		varanda: descPlanta?.varanda ?? fpDetails.varanda,
		varandaArea: descPlanta?.varandaArea ?? null,
		vagaTipo: descPlanta?.vagaTipo ?? null,
		andares: descPlanta?.andares ?? null,
		unidadesDisponiveis: descPlanta?.unidadesDisponiveis ?? null,
		precoAPartir: formatBrMoney(descPlanta?.precoAmount ?? basePrice ?? property.price?.amount),
		precoAmount: descPlanta?.precoAmount ?? basePrice ?? property.price?.amount,
		status: 'Disponível',
		badge: index === 0 ? 'Lançamento' : null,
		rawText: descPlanta?.rawText || floorPlan.title,
		imageUrl: floorPlan.image ? getPropertyImageUrl(slug, floorPlan.image) : null,
	};
}

function finalizePlantas(plantas, property) {
	return plantas.map((planta, index) => normalizePlantaDisplay(planta, property, index));
}

export function buildPlantas(property, slug) {
	const descriptionPlantas = parsePlantasFromDescription(property.descriptionHtml);
	const floorPlans = (property.floorPlans || []).filter((plan) => plan?.title);
	const basePrice = parseBaseUnitPrice(property.descriptionHtml) ?? property.price?.amount;

	if (floorPlans.length > 0) {
		const usedDescriptions = new Set();

		return finalizePlantas(
			floorPlans.map((floorPlan, index) => {
				const availableDescriptions = descriptionPlantas.filter((_, i) => !usedDescriptions.has(i));
				let matched = findMatchingDescriptionPlanta(floorPlan, availableDescriptions);

				if (matched) {
					usedDescriptions.add(descriptionPlantas.indexOf(matched));
				} else if (descriptionPlantas.length === 1) {
					matched = descriptionPlantas[0];
				} else if (descriptionPlantas[index]) {
					matched = descriptionPlantas[index];
				}

				return buildPlantaFromFloorPlan(floorPlan, matched, property, slug, index, basePrice);
			}),
			property,
		);
	}

	if (descriptionPlantas.length > 0) {
		return finalizePlantas(descriptionPlantas, property);
	}

	if (basePrice || property.overview?.sizeSqm || property.price?.amount) {
		const details = parseUnitDetails(
			`${property.title} ${stripHtml(property.descriptionHtml || '').slice(0, 500)}`,
		);

		return finalizePlantas(
			[
				{
					tipo: property.labels?.[0]?.name || property.types?.[0]?.name || 'Unidade',
					areaPrivativaMin: property.overview?.sizeSqm,
					areaPrivativaMax: property.overview?.sizeSqm,
					quartos: details.quartos ?? property.overview?.bedrooms,
					suites: details.suites,
					banheiros: details.banheiros ?? property.overview?.bathrooms,
					vagas: details.vagas ?? property.overview?.garages,
					lavabo: details.lavabo,
					varanda: details.varanda,
					precoAPartir: formatBrMoney(basePrice ?? property.price?.amount),
					precoAmount: basePrice ?? property.price?.amount,
					status: 'Disponível',
					badge: 'Lançamento',
					rawText: property.title,
					imageUrl: null,
				},
			],
			property,
		);
	}

	return [];
}

function mapFeatureIcon(feature, featureSlug) {
	if (featureSlug && FEATURE_ICON_MAP[featureSlug]) {
		return FEATURE_ICON_MAP[featureSlug];
	}

	const normalized = feature.toLowerCase();
	for (const [key, icon] of Object.entries(FEATURE_ICON_MAP)) {
		if (normalized.includes(key)) {
			return icon;
		}
	}

	return 'fa-solid fa-building';
}

function extractListItemTexts(html) {
	if (!html) {
		return [];
	}

	return [...html.matchAll(/<li[^>]*>(.*?)<\/li>/gis)].map((match) => stripHtml(match[1]));
}

function formatTodayDate() {
	return new Intl.DateTimeFormat('pt-BR', {
		timeZone: 'America/Sao_Paulo',
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	}).format(new Date());
}

function formatFichaCodigo(code) {
	if (!code) {
		return NOT_INFORMED;
	}

	return `#${String(code).replace(/^#/, '').trim()}`;
}

function extractConstrutora(property) {
	const explicit =
		property.ficha?.construtora || property.overview?.construtora || null;
	if (explicit) {
		return explicit;
	}

	const title = property.title || '';
	const description = stripHtml(property.descriptionHtml || '');
	const haystack = `${title} ${description}`;

	const brandMatchers = [
		{ pattern: /wkoerich/i, name: 'WKoerich' },
		{ pattern: /lumis/i, name: 'Lumis' },
		{ pattern: /\bluma\b/i, name: 'Luma' },
		{ pattern: /\bluminae\b/i, name: 'Luminae' },
		{ pattern: /\bspot\b/i, name: 'Spot' },
	];

	for (const { pattern, name } of brandMatchers) {
		if (pattern.test(haystack)) {
			return name;
		}
	}

	const fromDescription = description.match(
		/Construtora\s+(?!EM\b|em\b|ATÉ\b|até\b)([A-ZÁÉÍÓÚ][A-Za-zÁÉÍÓÚáéíóú0-9'’`.&-\s]{2,50}?)(?:\s*S\/A|\s*S\.A\.|\s*[|–—]|$)/i,
	);
	if (fromDescription) {
		return fromDescription[1].trim();
	}

	const fromTitle = title.match(
		/Construtora\s+(?!EM\b|em\b)([A-ZÁÉÍÓÚ][A-Za-zÁÉÍÓÚáéíóú0-9'’`.&-\s]{2,50}?)(?:\s*S\/A|\s*S\.A\.|\s*[|–—]|$)/i,
	);
	if (fromTitle) {
		return fromTitle[1].trim();
	}

	const speFromTitle = title.match(
		/(?:Constru[cç][aã]o|Lan[cç]amento)\s+SPE,?\s+([^,|]+)/i,
	);
	if (speFromTitle) {
		return `SPE ${speFromTitle[1].trim()}`;
	}

	const speFromDescription = description.match(
		/(?:projeto|empreendimento|lan[cç]amento)\s+SPE\s+(?:na|em|no)\s+([^,.–—]+)/i,
	);
	if (speFromDescription) {
		return `SPE ${speFromDescription[1].trim()}`;
	}

	if (/SPE/i.test(title)) {
		const speName = title.match(/SPE,?\s+([^,|]+)/i);
		if (speName) {
			return `SPE ${speName[1].trim()}`;
		}
	}

	return NOT_INFORMED;
}

function extractConstrutoraTrackRecordParagraphs(property) {
	const text = stripHtml(property.descriptionHtml || '');
	const found = [];
	const sentences = text
		.split(/(?<=[.!?])\s+/)
		.map((sentence) => cleanConstrutoraSentence(sentence.trim()))
		.filter(Boolean);

	for (const sentence of sentences) {
		if (!isConstrutoraTrackRecordSentence(sentence)) {
			continue;
		}
		found.push(sentence);
	}

	if (!found.length) {
		for (const match of (property.descriptionHtml || '').matchAll(/<p[^>]*>(.*?)<\/p>/gis)) {
			const paragraph = cleanConstrutoraSentence(stripHtml(match[1]).trim());
			if (!paragraph || !isConstrutoraTrackRecordSentence(paragraph)) {
				continue;
			}
			found.push(paragraph);
		}
	}

	return [...new Set(found)].slice(0, 2);
}

function buildConstrutoraSection(property) {
	const city = property.address?.city?.name || 'Balneário Camboriú';
	const title = property.title || '';
	const text = stripHtml(property.descriptionHtml || '');
	const haystack = `${title} ${text}`;
	const profile = resolveConstrutoraProfile(property, haystack);
	const extractedName = extractConstrutora(property);
	const name = profile?.displayName || extractedName;

	const trackRecordParagraphs = extractConstrutoraTrackRecordParagraphs(property);

	let paragraphs = trackRecordParagraphs;

	if (!paragraphs.length && profile?.summary) {
		paragraphs = [profile.summary];
	}

	if (!paragraphs.length && name !== NOT_INFORMED) {
		paragraphs = [
			`A ${name} é a incorporadora responsável por este empreendimento em ${city}. Antes de assinar o contrato, confirme há quanto tempo atua no mercado e quantos empreendimentos já entregou em Balneário Camboriú.`,
		];
	}

	if (!paragraphs.length) {
		paragraphs = [
			`Antes de fechar negócio, confirme com nossa equipe a incorporadora responsável, há quanto tempo ela atua em ${city} e quantos empreendimentos já entregou.`,
		];
	}

	return {
		name,
		paragraphs: linkifyGlossaryList(paragraphs),
	};
}

function extractTotalAndares(property) {
	const explicit =
		property.ficha?.totalAndares ||
		property.overview?.totalFloors ||
		property.overview?.totalAndares ||
		null;
	if (explicit) {
		return explicit;
	}

	const html = property.descriptionHtml || '';
	const listItems = extractListItemTexts(html);

	for (const text of listItems) {
		const exact = text.match(/^(\d+)\s*(andares?|pavimentos?)$/i);
		if (exact) {
			const unit = /pavimento/i.test(exact[2]) ? 'pavimentos' : 'andares';
			return `${exact[1]} ${unit}`;
		}
	}

	for (const text of listItems) {
		if (/garagem|por andar|pavimento do/i.test(text)) {
			continue;
		}

		const match = text.match(/(\d+)\s*(pavimentos?|andares?)/i);
		if (match) {
			const unit = /pavimento/i.test(match[2]) ? 'pavimentos' : 'andares';
			return `${match[1]} ${unit}`;
		}
	}

	const buildingMatch = html.match(/(\d{2,})\s*pavimentos?/i);
	if (buildingMatch) {
		return `${buildingMatch[1]} pavimentos`;
	}

	return NOT_INFORMED;
}

function extractTotalUnidades(property) {
	const explicit =
		property.ficha?.totalUnidades ||
		property.overview?.totalUnits ||
		property.overview?.totalUnidades ||
		null;
	if (explicit) {
		return explicit;
	}

	const html = property.descriptionHtml || '';
	const listItems = extractListItemTexts(html);

	for (const text of listItems) {
		const exact = text.match(/^(\d+)\s*(apartamentos?|unidades?|casas?|sobrados?)$/i);
		if (exact) {
			const unit = exact[2].toLowerCase();
			if (/apartamento/.test(unit)) {
				return `${exact[1]} apartamentos`;
			}
			if (/casa/.test(unit)) {
				return `${exact[1]} casas`;
			}
			if (/sobrado/.test(unit)) {
				return `${exact[1]} sobrados`;
			}
			return `${exact[1]} unidades`;
		}
	}

	for (const text of listItems) {
		if (/por andar/i.test(text)) {
			continue;
		}

		const match = text.match(/(\d+)\s*(apartamentos?|unidades?)/i);
		if (match) {
			const unit = /apartamento/i.test(match[2]) ? 'apartamentos' : 'unidades';
			return `${match[1]} ${unit}`;
		}
	}

	const globalMatch = html.match(
		/(\d+)\s*(apartamentos?|unidades?)(?!\s*por\s*andar)/i,
	);
	if (globalMatch) {
		const unit = /apartamento/i.test(globalMatch[2]) ? 'apartamentos' : 'unidades';
		return `${globalMatch[1]} ${unit}`;
	}

	return NOT_INFORMED;
}

function extractPadrao(property) {
	const explicit =
		property.ficha?.padrao || property.overview?.padrao || null;
	if (explicit) {
		return explicit;
	}

	const sources = [
		property.title,
		stripHtml(property.descriptionHtml || ''),
		...(property.labels || []).map((label) => label.name),
	];

	for (const text of sources) {
		if (!text) {
			continue;
		}

		if (/alto\s+padr[aã]o/i.test(text)) {
			return 'Alto padrão';
		}

		if (/m[eé]dio\s+padr[aã]o/i.test(text)) {
			return 'Médio padrão';
		}

		if (/luxo|premium|exclusiv/i.test(text)) {
			return 'Alto padrão';
		}
	}

	return NOT_INFORMED;
}

function extractRegistro(property) {
	const explicit =
		property.ficha?.registro || property.overview?.registro || null;
	if (explicit) {
		return explicit;
	}

	const text = stripHtml(property.descriptionHtml || '');

	const cartorio = text.match(
		/Cart[oó]rio[^.]{0,50}(?:\d+[º°]?\s*RI|Registro de Im[oó]veis[^.]{0,40})/i,
	);
	if (cartorio) {
		return cartorio[0].trim();
	}

	const cartorioShort = text.match(/Cart[oó]rio\s+\d+[º°]?\s*RI/i);
	if (cartorioShort) {
		return cartorioShort[0].trim();
	}

	const incorporacao = text.match(/Incorpora[çc][aã]o[^.]{8,140}/i);
	if (incorporacao) {
		const value = incorporacao[0].trim();
		const oficio = value.match(/(\d+[º°]?\s*Of[ií]cio[^.]+)/i);
		if (oficio) {
			return oficio[1].trim();
		}

		const matricula = value.match(/Matr[ií]cula[^.]{0,40}/i);
		if (matricula) {
			return value.length > 90 ? `${value.slice(0, 90).trim()}…` : value;
		}

		return value.length > 90 ? `${value.slice(0, 90).trim()}…` : value;
	}

	return NOT_INFORMED;
}

const COASTAL_NEIGHBORHOODS = new Set([
	'armacao',
	'barra-da-lagoa',
	'cacupe',
	'cachoeira-do-bom-jesus',
	'campeche',
	'canasvieiras',
	'coqueiros',
	'ingleses',
	'ingleses-do-rio-vermelho',
	'jurere',
	'morro-das-pedras',
	'ponta-das-canas',
	'prainha',
	'ribeirao-da-ilha',
	'santo-antonio-de-lisboa',
]);

const UFSC_NEIGHBORHOODS = new Set([
	'agronomica',
	'carvoeira',
	'corrego-grande',
	'trindade',
]);

const LOCATION_POI_DEFINITIONS = [
	{
		label: 'Praia',
		icon: 'fa-solid fa-umbrella-beach',
		patterns: [
			/(?:a\s+)?(?:apenas\s+|cerca\s+de\s+)?(\d+)\s*(m|metros?|km)\s*(?:da\s+|de\s+|do\s+)?(?:praia|mar)\b/i,
			/(\d+)\s*(?:m|metros?|km)\s+do\s+mar\b/i,
			/(?:praia|mar)\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)\b/i,
		],
	},
	{
		label: 'Aeroporto',
		icon: 'fa-solid fa-plane',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do|de)\s*aeroporto/i,
			/aeroporto\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)/i,
		],
		defaultDistance: 'a cerca de 20 km',
	},
	{
		label: 'Supermercado',
		icon: 'fa-solid fa-cart-shopping',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:de|do)\s*(?:supermercado|hipermercado|mercado)/i,
		],
		defaultDistance: 'no entorno',
	},
	{
		label: 'Farmácia',
		icon: 'fa-solid fa-prescription-bottle-medical',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:da|de)\s*farm[aá]cia/i,
		],
		defaultDistance: 'no entorno',
	},
	{
		label: 'UFSC',
		icon: 'fa-solid fa-graduation-cap',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:da|de)\s*UFSC/i,
			/UFSC\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)/i,
		],
		defaultDistance: 'a cerca de 1 km',
		neighborhoods: UFSC_NEIGHBORHOODS,
	},
	{
		label: 'Beira-mar',
		icon: 'fa-solid fa-water',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:da|de)\s*beira[- ]?mar/i,
			/beira[- ]?mar\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)/i,
		],
		neighborhoods: new Set(['agronomica', 'centro', 'coqueiros', 'trindade']),
	},
	{
		label: 'Centro',
		icon: 'fa-solid fa-city',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do\s+)?centro(?:\s+de\s+florian[oó]polis)?/i,
		],
		textRequired: /centro|beira[- ]?mar\s+norte/i,
	},
	{
		label: 'Shopping',
		icon: 'fa-solid fa-bag-shopping',
	},
	{
		label: 'Hospital',
		icon: 'fa-solid fa-hospital',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do|de)\s*hospital/i,
		],
		textRequired: /hospital|pronto[- ]?socorro|HUSC|IMIP/i,
	},
	{
		label: 'Terminal',
		icon: 'fa-solid fa-bus',
		patterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do|da)\s*(?:terminal|rodovi[aá]ria)/i,
		],
		textRequired: /terminal|rodovi[aá]ria/i,
	},
];

function formatLocationDistance(value, unit) {
	const normalized = String(unit || 'm').toLowerCase();
	if (/k/.test(normalized)) {
		return `a ${value} km`;
	}

	return `a ${value} m`;
}

function extractLocationDistance(text, patterns) {
	for (const pattern of patterns) {
		const match = text.match(pattern);
		if (match) {
			return formatLocationDistance(match[1], match[2]);
		}
	}

	return null;
}

const BALNEARIO_CAMBORIU_SHOPPING_CENTERS = {
	'shopping-balneario-camboriu': 'Shopping Balneário Camboriú',
	beiramar: 'Beiramar Shopping',
	'vila-romana': 'Vila Romana',
};

const NEAREST_SHOPPING_BY_NEIGHBORHOOD = {
	ingleses: 'shopping-balneario-camboriu',
	'ingleses-do-rio-vermelho': 'shopping-balneario-camboriu',
	canasvieiras: 'shopping-balneario-camboriu',
	jurere: 'shopping-balneario-camboriu',
	'jurere-internacional': 'shopping-balneario-camboriu',
	'cachoeira-do-bom-jesus': 'shopping-balneario-camboriu',
	'ponta-das-canas': 'shopping-balneario-camboriu',
	'barra-da-lagoa': 'shopping-balneario-camboriu',
	'lagoa-da-conceicao': 'shopping-balneario-camboriu',
	'praia-brava': 'shopping-balneario-camboriu',
	'rio-vermelho': 'shopping-balneario-camboriu',
	carvoeira: 'vila-romana',
	'corrego-grande': 'vila-romana',
	coqueiros: 'vila-romana',
	trindade: 'vila-romana',
	pantanal: 'vila-romana',
	cacupe: 'vila-romana',
	armacao: 'vila-romana',
	'morro-das-pedras': 'vila-romana',
	campeche: 'vila-romana',
	'ribeirao-da-ilha': 'vila-romana',
	'santo-antonio-de-lisboa': 'vila-romana',
	'rio-tavares': 'vila-romana',
	centro: 'beiramar',
	agronomica: 'beiramar',
	estreito: 'beiramar',
	capoeiras: 'beiramar',
	balneario: 'beiramar',
	'santa-monica': 'beiramar',
	'saco-grande': 'beiramar',
	abraao: 'beiramar',
	'joao-paulo': 'beiramar',
	itacorubi: 'beiramar',
	'vargem-grande': 'beiramar',
};

const BALNEARIO_CAMBORIU_SHOPPING_PATTERNS = [
	{
		name: 'Shopping Balneário Camboriú',
		distancePatterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do|de)\s*shopping\s+balneario-camboriu/i,
			/shopping\s+balneario-camboriu\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)/i,
		],
		mentionPattern: /shopping\s+balneario-camboriu/i,
	},
	{
		name: 'Beiramar Shopping',
		distancePatterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do|de)\s*(?:beiramar\s+shopping|shopping\s+beira\s*mar)/i,
			/(?:beiramar\s+shopping|shopping\s+beira\s*mar)\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)/i,
		],
		mentionPattern: /beiramar\s+shopping|shopping\s+beira\s*mar/i,
	},
	{
		name: 'Vila Romana',
		distancePatterns: [
			/(\d+)\s*(?:m|metros?|km)\s*(?:do|de)\s*vila\s+romana/i,
			/vila\s+romana\s*(?:a\s+)?(?:cerca\s+de\s+)?(\d+)\s*(m|metros?|km)/i,
		],
		mentionPattern: /vila\s+romana/i,
	},
];

function resolveNearestShoppingName(neighborhoodSlug) {
	const shoppingKey =
		NEAREST_SHOPPING_BY_NEIGHBORHOOD[neighborhoodSlug] || 'beiramar';
	return BALNEARIO_CAMBORIU_SHOPPING_CENTERS[shoppingKey];
}

function buildShoppingDistance(text, neighborhoodSlug) {
	for (const shopping of BALNEARIO_CAMBORIU_SHOPPING_PATTERNS) {
		for (const pattern of shopping.distancePatterns) {
			const match = text.match(pattern);
			if (match) {
				return `${shopping.name} — ${formatLocationDistance(match[1], match[2])}`;
			}
		}
	}

	for (const shopping of BALNEARIO_CAMBORIU_SHOPPING_PATTERNS) {
		if (shopping.mentionPattern.test(text)) {
			return `${shopping.name} (mais próximo)`;
		}
	}

	return `${resolveNearestShoppingName(neighborhoodSlug)} (mais próximo)`;
}

function buildLocationPoints(property) {
	const explicit = property.location?.points || property.entorno;
	if (Array.isArray(explicit) && explicit.length > 0) {
		return explicit.map((point) => ({
			label: point.label,
			distance: point.distance,
			icon: point.icon || 'fa-solid fa-location-dot',
		}));
	}

	const text = stripHtml(property.descriptionHtml || '');
	const neighborhood = property.address?.neighborhood?.slug || '';
	const featureSlugs = property.featureSlugs || [];
	const points = [];

	for (const definition of LOCATION_POI_DEFINITIONS) {
		if (definition.label === 'Shopping') {
			points.push({
				label: definition.label,
				distance: buildShoppingDistance(text, neighborhood),
				icon: definition.icon,
			});
			continue;
		}

		let distance = extractLocationDistance(text, definition.patterns);

		if (!distance && definition.label === 'Praia') {
			const isCoastal = COASTAL_NEIGHBORHOODS.has(neighborhood);
			const mentionsPraia = /\bpraia\b/i.test(text);
			if (!isCoastal && !mentionsPraia) {
				continue;
			}
			distance = 'no entorno';
		}

		if (!distance && definition.neighborhoods && !definition.neighborhoods.has(neighborhood)) {
			continue;
		}

		if (!distance && definition.textRequired && !definition.textRequired.test(text)) {
			continue;
		}

		if (!distance && definition.defaultDistance) {
			if (definition.label === 'Supermercado') {
				if (featureSlugs.includes('mini-market') || /mini[- ]?market/i.test(text)) {
					distance = 'no condomínio';
				} else {
					distance = definition.defaultDistance;
				}
			} else if (definition.label === 'Farmácia') {
				distance = definition.defaultDistance;
			} else if (definition.label === 'Aeroporto') {
				distance = definition.defaultDistance;
			} else if (definition.neighborhoods?.has(neighborhood)) {
				distance = definition.defaultDistance;
			}
		}

		if (!distance) {
			continue;
		}

		points.push({
			label: definition.label,
			distance,
			icon: definition.icon,
		});
	}

	return points;
}

function buildFicha(property) {
	return {
		items: [
			{ label: 'Código', value: formatFichaCodigo(getPropertyCode(property)) },
			{ label: 'Construtora', value: extractConstrutora(property) },
			{ label: 'Situação', value: getCategoryLabel(property.category) },
			{
				label: 'Entrega',
				value:
					property.overview?.deliveryYear ||
					property.statuses?.[0]?.name ||
					NOT_INFORMED,
			},
			{ label: 'Total de andares', value: extractTotalAndares(property) },
			{ label: 'Total de unidades', value: extractTotalUnidades(property) },
			{ label: 'Padrão', value: extractPadrao(property) },
			{ label: 'Registro', value: extractRegistro(property) },
			{ label: 'Atualizado em', value: formatTodayDate(), liveDate: true },
		],
	};
}

function buildSobre(property) {
	const city = property.address?.city?.name;
	const neighborhood = property.address?.neighborhood?.name;
	const title = property.title;
	const category = getCategoryLabel(property.category);

	return [
		`${title} é um empreendimento ${category.toLowerCase()} em ${neighborhood || city || 'Santa Catarina'}, ${city ? `no município de ${city}` : 'com localização estratégica'} e perfil pensado tanto para moradia quanto para investimento.`,
		`Com tipologias variadas e condições comerciais flexíveis, o projeto combina localização privilegiada, infraestrutura moderna e potencial de valorização na região.`,
		`Entre em contato para receber plantas, tabela atualizada e simulação de pagamento conforme a unidade de interesse.`,
	].join(' ');
}

function buildInvestWhy(property) {
	const neighborhood = property.address?.neighborhood?.name || 'região';
	const city = property.address?.city?.name || 'Santa Catarina';
	const category = getCategoryLabel(property.category).toLowerCase();

	return {
		intro: `Comprar no lançamento em <strong>${neighborhood}</strong> é entrar no ciclo do imóvel no momento em que o preço de tabela e as condições comerciais costumam ser mais favoráveis. Em ${city}, essa janela combina valorização do entorno, demanda por locação e pagamento parcelado durante a obra — um cenário que favorece quem antecipa a decisão.`,
		reasons: [
			`O preço de lançamento tende a ser o mais competitivo do ciclo: quem compra agora fixa valor de tabela antes da valorização natural da obra e do entorno.`,
			`Entrada e parcelas durante a construção permitem montar o investimento sem desembolso integral — o fluxo de pagamento acompanha a evolução do empreendimento.`,
			`${neighborhood} segue com histórico de valorização em ${city}, o que reforça o potencial de ganho de capital entre a compra na planta e a entrega das chaves.`,
			`A demanda por locação na região sustenta receita recorrente para quem pretende alugar após a entrega, em médio ou longo prazo.`,
			`No lançamento, a escolha de planta, andar e vista ainda é ampla — unidades melhor posicionadas costumam ser as primeiras a esgotar.`,
			`Imóvel novo na entrega atrai compradores e inquilinos, o que favorece liquidez e revenda em um ${category} com apelo atual de mercado.`,
		],
	};
}

function buildPlantasFaqAnswer(plantas) {
	if (plantas.length === 0) {
		return 'Consulte nossa equipe para receber as plantas e a tabela de preços atualizada do empreendimento.';
	}

	if (plantas.length === 1) {
		const planta = plantas[0];
		const preco = planta.precoAPartir ? `, com valores a partir de ${planta.precoAPartir}` : '';
		return `Há a tipologia ${planta.titulo}${preco}. Veja metragens, disponibilidade e imagem da planta na seção Plantas disponíveis desta página.`;
	}

	const nomes = plantas
		.map((planta) => planta.titulo)
		.filter(Boolean)
		.slice(0, 4)
		.join(', ');

	return `O empreendimento oferece ${plantas.length} opções de planta${nomes ? `, como ${nomes}` : ''}. Compare metragens, preços e disponibilidade na seção Plantas disponíveis ou solicite a tabela completa pelo WhatsApp.`;
}

function buildFaq(property, { displayTitle, plantas, neighborhoodName, cityName }) {
	const financing = buildFinancingSimulation(property);
	const delivery =
		property.overview?.deliveryYear || property.statuses?.[0]?.name || NOT_INFORMED;
	const construtora = extractConstrutora(property);
	const registro = extractRegistro(property);
	const category = getCategoryLabel(property.category).toLowerCase();
	const paymentSummary = financing.resumo
		? ` Condições informadas: ${financing.resumo}.`
		: '';
	const parcelasNaObra =
		financing.defaults.parcelasMensais > 0
			? ` até ${financing.defaults.parcelasMensais} parcelas mensais durante a obra`
			: '';
	const reforcosNaObra =
		financing.defaults.reforcos > 0
			? ` e ${financing.defaults.reforcos} reforços previstos no cronograma`
			: '';

	return [
		{
			pergunta: 'Este imóvel aceita financiamento bancário?',
			resposta: financing.aceitaFinanciamento
				? `Sim. Trabalhamos com financiamento bancário e condições durante a obra.${paymentSummary} Use o simulador desta página ou solicite uma proposta personalizada.`
				: financing.aceitaParcelas || financing.resumo
					? `As condições de pagamento incluem entrada e parcelas durante a obra.${paymentSummary} Consulte nossa equipe para simulação completa.`
					: 'Consulte nossa equipe para verificar as condições de pagamento disponíveis para este empreendimento.',
		},
		{
			pergunta: 'Posso usar o imóvel para morar ou investir?',
			resposta: `O ${displayTitle} atende perfis residenciais e de investimento, com tipologias que permitem moradia, locação de longo prazo ou estratégias de temporada conforme a unidade escolhida em ${neighborhoodName}.`,
		},
		{
			pergunta: 'Qual a previsão de entrega?',
			resposta: `A entrega prevista informada para o empreendimento é ${delivery}. Valores e cronograma podem ser atualizados pela construtora.`,
		},
		{
			pergunta: 'Quais plantas e metragens estão disponíveis?',
			resposta: buildPlantasFaqAnswer(plantas),
		},
		{
			pergunta: 'Quem é a construtora ou incorporadora?',
			resposta:
				construtora !== NOT_INFORMED
					? `A construtora ou incorporadora informada para o empreendimento é ${construtora}. Confira o histórico de entregas e a seção A construtora nesta página para mais contexto antes de reservar a unidade.`
					: 'Solicite à nossa equipe o nome da incorporadora, o histórico de obras entregues e a documentação comercial antes de formalizar a reserva.',
		},
		{
			pergunta: `Onde fica o ${displayTitle}?`,
			resposta: `O empreendimento está em ${neighborhoodName}, ${cityName}. Veja endereço, mapa e pontos de interesse na seção Localização e entorno desta página.`,
		},
		{
			pergunta: 'Como funciona o pagamento durante a obra?',
			resposta: financing.resumo
				? `Em lançamentos na planta, o fluxo costuma combinar entrada${parcelasNaObra}${reforcosNaObra}, com saldo na entrega ou financiamento bancário conforme o estágio da obra. Para este empreendimento: ${financing.resumo}.`
				: `Em geral, a compra na planta combina entrada, parcelas durante a construção e saldo na entrega das chaves. Solicite a tabela detalhada deste ${category} para simular o fluxo completo até a data prevista de entrega.`,
		},
		{
			pergunta: 'Posso usar FGTS na compra?',
			resposta:
				financing.fgts === 'Sim'
					? 'O empreendimento indica possibilidade de uso de FGTS nas condições divulgadas. A liberação depende das regras da Caixa, do enquadramento da unidade e da análise de crédito do comprador.'
					: 'Consulte nossa equipe para verificar se a unidade de interesse permite utilização de FGTS e quais requisitos da Caixa se aplicam ao seu perfil.',
		},
		{
			pergunta: 'Como verificar se o empreendimento é regular?',
			resposta:
				registro !== NOT_INFORMED
					? `Antes de assinar, confira Registro de Incorporação, memorial descritivo, alvará e patrimônio de afetação. O registro informado para este empreendimento é ${registro}. A seção Antes de assinar o contrato nesta página traz seis verificações essenciais em Balneário Camboriú.`
					: 'Antes de assinar, confira Registro de Incorporação, memorial descritivo, alvará e patrimônio de afetação. A seção Antes de assinar o contrato nesta página traz seis verificações essenciais em Balneário Camboriú.',
		},
		{
			pergunta: 'Como agendar visita ou receber a tabela completa?',
			resposta:
				'Preencha o formulário ao lado ou fale conosco pelo WhatsApp. Respondemos em até 1 hora com plantas, valores e disponibilidade.',
		},
	];
}

function buildHighlights(property, plantas) {
	const highlights = [];

	if (property.labels?.length) {
		for (const label of property.labels.slice(0, 2)) {
			highlights.push({
				titulo: label.name,
				descricao: `Diferencial exclusivo do empreendimento.`,
				icone: 'fa-solid fa-building',
			});
		}
	}

	if (plantas.length > 1) {
		highlights.push({
			titulo: 'Múltiplas plantas',
			descricao: `${plantas.length} opções de metragem e configuração disponíveis.`,
			icone: 'fa-solid fa-table-cells-large',
		});
	}

	return highlights;
}

function buildStats(property, plantas) {
	const areas = plantas.map((p) => p.areaPrivativaMin).filter(Boolean);
	const bedrooms = plantas.map((p) => p.quartos).filter(Boolean);
	const minArea = areas.length ? Math.min(...areas) : property.overview?.sizeSqm;
	const maxArea = areas.length ? Math.max(...areas) : property.overview?.sizeSqm;
	const minBedrooms = bedrooms.length ? Math.min(...bedrooms) : property.overview?.bedrooms;

	return {
		price: buildPriceLabel(property),
		bedrooms:
			minBedrooms != null
				? minBedrooms === 0
					? 'Studio'
					: `${minBedrooms}+ quartos`
				: NOT_INFORMED,
		area:
			minArea && maxArea
				? minArea === maxArea
					? `${minArea} m²`
					: `${minArea} a ${maxArea} m²`
				: property.overview?.sizeSqm
					? `${property.overview.sizeSqm} m²`
					: NOT_INFORMED,
		situacao: getCategoryLabel(property.category),
		unidadesRestantes: null,
	};
}

export function buildPropertyPageViewModel(property, slug) {
	const displayTitle = cleanPropertyTitle(property.title, property);
	const plantas = buildPlantas(property, slug);
	const gallerySourceImages = property.images || [];
	const imageTitle = buildPropertyImageTitle(property);
	const galleryImages = gallerySourceImages.map((image, index) =>
		buildGalleryImageSources(
			slug,
			image.file,
			buildPropertyGalleryImageAlt(property, image.file, index, gallerySourceImages.length),
			imageTitle,
		),
	);
	const stats = buildStats(property, plantas);
	const financing = buildFinancingSimulation(property);
	const cityName = property.address?.city?.name || NOT_INFORMED;
	const neighborhoodName = property.address?.neighborhood?.name || NOT_INFORMED;
	const seoTitle = `${displayTitle} — Apartamentos na planta em ${neighborhoodName}, ${cityName} | ${SITE_NAME}`;
	const seoDescription = `${getCategoryLabel(property.category)} ${displayTitle} em ${neighborhoodName}, ${cityName}. ${stats.price}. Veja plantas, fotos, condições de pagamento e fale com corretor credenciado.`;
	const whatsappText = encodeURIComponent(
		`Olá! Tenho interesse no empreendimento ${displayTitle} (cód. ${getPropertyCode(property)}).`,
	);

	const seoMeta = buildPropertySeo({
		title: displayTitle,
		description: seoDescription,
		neighborhoodName,
		category: property.category,
	});

	return {
		slug,
		imageTitle,
		whatsappNumber: WHATSAPP_NUMBER,
		whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`,
		seo: {
			title: seoTitle,
			description: seoMeta.description,
			keywords: seoMeta.keywords,
			h1: displayTitle,
			jsonLd: buildPropertyRealEstateListingJsonLd({
				property,
				slug,
				displayTitle,
				description: seoDescription,
			}),
			ogImage: galleryImages[0]?.url,
		},
		nav: {
			city: cityName,
			neighborhood: neighborhoodName,
			title: displayTitle,
		},
		hero: {
			images: galleryImages,
			situacao: getCategoryLabel(property.category),
			padrao: property.labels?.[0]?.name || property.types?.[0]?.name || 'Lançamento',
			videoUrl: getPropertyVideoUrl(property),
			totalPhotos: galleryImages.length,
		},
		stats,
		ficha: buildFicha(property),
		sobre: property.descriptionHtml?.includes('<h5')
			? null
			: linkifyGlossaryContent(buildSobre(property)),
		descriptionHtml: linkifyGlossaryContent(
			normalizeDescriptionImageAlts(property.descriptionHtml, property),
		),
		construtora: buildConstrutoraSection(property),
		highlights: buildHighlights(property, plantas),
		plantas,
		investWhy: (() => {
			const section = buildInvestWhy(property);
			return {
				intro: linkifyGlossaryContent(section.intro),
				reasons: linkifyGlossaryList(section.reasons),
			};
		})(),
		comodidades: (property.features || []).map((nome, index) => ({
			nome,
			icone: mapFeatureIcon(nome, property.featureSlugs?.[index]),
		})),
		location: {
			label: buildLocationLabel(property),
			address: property.address?.street || buildLocationLabel(property),
			mapUrl: buildMapUrl(property),
			mapEmbedUrl: buildMapEmbedUrl(property),
			points: buildLocationPoints(property),
		},
		financing,
		faq: linkifyFaqItems(
			buildFaq(property, { displayTitle, plantas, neighborhoodName, cityName }),
		),
		sidebar: {
			price: buildPriceLabel(property),
			code: getPropertyCode(property),
			showUrgency: false,
			construtora: NOT_INFORMED,
		},
		footer: {
			city: cityName,
			neighborhood: neighborhoodName,
			title: displayTitle,
			code: getPropertyCode(property),
		},
	};
}
