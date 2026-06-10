import { basename } from 'node:path';
import { getCategoryLabel } from './property-listings.mjs';
import { cleanPropertyTitle } from './property-slug.mjs';

const IMAGE_SUBJECT_PATTERNS = [
	[/rooftop/i, 'Área de rooftop'],
	[/localiza[cç][aã]o|localizacao/i, 'Localização do empreendimento'],
	[/recep[cç][aã]o|recepcao/i, 'Hall de recepção'],
	[/drone|vista[\s-]?a[eé]rea|a[eé]reo/i, 'Vista aérea'],
	[/fachada/i, 'Fachada'],
	[/planta|floor[\s-]?plan/i, 'Planta baixa'],
	[/piscina/i, 'Área da piscina'],
	[/gourmet|churrasqueira/i, 'Espaço gourmet'],
	[/academia|fitness/i, 'Academia'],
	[/sala|living/i, 'Sala de estar'],
	[/cozinha|kitchen/i, 'Cozinha'],
	[/su[ií]te|suite/i, 'Suíte'],
	[/quarto|dormit[oó]rio|bedroom/i, 'Quarto'],
	[/banheiro|lavabo/i, 'Banheiro'],
	[/garagem|vaga/i, 'Garagem'],
	[/varanda|sacada|balcony/i, 'Varanda'],
	[/lobby|hall/i, 'Hall'],
	[/lavanderia/i, 'Lavanderia'],
	[/playground|brinquedoteca/i, 'Área kids'],
	[/spa|sauna/i, 'Spa e sauna'],
	[/principal/i, 'Vista principal'],
	[/terreno/i, 'Terreno'],
	[/lazer|leisure|amenities/i, 'Área de lazer'],
	[/studio/i, 'Studio'],
	[/garden/i, 'Garden'],
	[/cobertura|duplex|triplex/i, 'Cobertura'],
	[/praia|beach/i, 'Vista da praia'],
	[/render|perspectiva/i, 'Perspectiva ilustrativa'],
	[/captura[\s_-]*(de[\s_-]*)?tela/i, 'Perspectiva ilustrativa'],
];

const GENERIC_FILE_STEM =
	/^(whatsapp[\s_-]?image|unnamed|captura[\s_-]?de[\s_-]?tela|image|foto|img|original|scaled|copia|de|\d+[\s\d-]*)$/i;

function escapeHtmlAttr(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;');
}

function normalizeFileStem(fileName) {
	return String(fileName || '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\.[a-z0-9]+$/i, '')
		.replace(/^\d+[-_]?/, '')
		.replace(/[-_]+/g, ' ')
		.replace(/\b(scaled|original|copia|de|imagem|image|webp|jpg|png)\b/gi, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();
}

export function inferImageSubjectFromFile(fileName) {
	const normalized = normalizeFileStem(fileName);

	if (!normalized || GENERIC_FILE_STEM.test(normalized)) {
		return null;
	}

	for (const [pattern, label] of IMAGE_SUBJECT_PATTERNS) {
		if (pattern.test(normalized)) {
			return label;
		}
	}

	const words = normalized
		.split(' ')
		.filter((word) => word.length > 2 && !/^\d+$/.test(word));

	if (words.length >= 2) {
		const phrase = words
			.slice(0, 4)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

		return phrase;
	}

	return null;
}

export function buildPropertyImageContext(property) {
	const title = cleanPropertyTitle(property?.title, property);
	const neighborhood = property?.address?.neighborhood?.name || 'Balneário Camboriú';
	const city = property?.address?.city?.name || 'Balneário Camboriú';
	const category = getCategoryLabel(property?.category || 'lancamento').toLowerCase();

	return { title, neighborhood, city, category };
}

function buildLocationPhrase({ neighborhood, city }) {
	if (neighborhood && neighborhood !== city) {
		return `${neighborhood}, ${city}`;
	}

	return city;
}

export function buildPropertyImageTitle(property) {
	const { title, neighborhood, city } = buildPropertyImageContext(property);
	const location = buildLocationPhrase({ neighborhood, city });

	return `${title}, ${location}`;
}

export function buildNeighborhoodImageTitle(neighborhoodName, cityName = 'Balneário Camboriú') {
	return `${neighborhoodName}, ${cityName}`;
}

function buildGalleryPositionLabel(index, total) {
	if (index === 0) {
		return 'Foto principal';
	}

	if (total > 1) {
		return `Foto ${index + 1} de ${total}`;
	}

	return 'Foto do empreendimento';
}

export function buildPropertyGalleryImageAlt(property, imageFile, index = 0, total = 1) {
	const context = buildPropertyImageContext(property);
	const location = buildLocationPhrase(context);
	const subject = inferImageSubjectFromFile(basename(imageFile));
	const position = buildGalleryPositionLabel(index, total);

	if (subject) {
		return `${subject} do empreendimento ${context.title} em ${location} — ${context.category} na planta`;
	}

	return `${position} do empreendimento ${context.title} em ${location} — ${context.category} na planta`;
}

export function buildPropertyListingImageAlt(property) {
	const context = buildPropertyImageContext(property);
	const location = buildLocationPhrase(context);

	return `Imagem do ${context.category} ${context.title} em ${location} — imóvel na planta em Balneário Camboriú`;
}

export function buildPropertyPlantaImageAlt(property, planta, index = 0) {
	const context = buildPropertyImageContext(property);
	const location = buildLocationPhrase(context);
	const titulo = planta?.titulo || planta?.tipo || `tipologia ${index + 1}`;
	const area =
		planta?.areaPrivativaMin != null
			? `${planta.areaPrivativaMin} m² privativos`
			: 'metragem sob consulta';

	return `Planta baixa ${titulo} do ${context.title} em ${location} — ${area}, ${context.category} na planta`;
}

export function buildNeighborhoodImageAlt(neighborhoodName) {
	return `Vista do bairro ${neighborhoodName} em Balneário Camboriú para comprar imóvel na planta`;
}

export function buildPropertyDescriptionImageAlt(property, options = {}) {
	const { imageFile = '', index = 0 } = options;
	const context = buildPropertyImageContext(property);
	const location = buildLocationPhrase(context);
	const subject = inferImageSubjectFromFile(basename(imageFile));

	if (subject) {
		return `${subject} do ${context.title} em ${location} — ${context.category} na planta`;
	}

	if (index === 0) {
		return `Ilustração do ${context.title} em ${location} — ${context.category} na planta em Balneário Camboriú`;
	}

	return `Imagem complementar do ${context.title} em ${location} — ${context.category} na planta`;
}

function applyImageTitleAttr(attrs, title) {
	const cleanedAttrs = attrs.replace(/\s*title=(["']).*?\1/gi, '');

	return `${cleanedAttrs} title="${escapeHtmlAttr(title)}"`;
}

export function normalizeDescriptionImageAlts(html, property) {
	if (!html?.includes('<img')) {
		return html;
	}

	const imageTitle = buildPropertyImageTitle(property);
	let imageIndex = 0;

	return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
		const altMatch = attrs.match(/\balt=(["'])(.*?)\1/i);
		const currentAlt = altMatch?.[2]?.trim();
		let nextAttrs = applyImageTitleAttr(attrs, imageTitle);

		if (currentAlt) {
			return `<img${nextAttrs}>`;
		}

		const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/i);
		const src = srcMatch?.[1] || '';
		const fileName = basename(src.split('?')[0]);
		const alt = buildPropertyDescriptionImageAlt(property, {
			imageFile: fileName,
			index: imageIndex,
		});
		imageIndex += 1;

		nextAttrs = nextAttrs.replace(/\s*alt=(["']).*?\1/gi, '');

		return `<img${nextAttrs} alt="${escapeHtmlAttr(alt)}">`;
	});
}
