import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { resolveNeighborhoodPageSlug } from './neighborhood-slugs.mjs';
import { isStandaloneHouseProperty } from './property-kind.mjs';
import { formatPropertyPriceLabel } from './property-price.mjs';

const dataRoot = join(process.cwd(), 'src/data');
export const BALNEARIO_CAMBORIU_CITY_SLUG = 'balneario-camboriu';
const GENERIC_VIDEO = 'https://www.youtube.com/embed/XgTfaP86ph0?feature=oembed';
const PLACEHOLDER_LAT = -33.868419;
const PLACEHOLDER_LNG = 151.193245;
const REGIONAL_CITY_NAMES = new Set([
	'Grande Balneário Camboriú',
	'Litoral Norte',
	'Litoral Sul',
	'Oeste',
	'Serra Catarinense',
	'Sul',
	'Vale do Itajaí',
]);
const SANTA_CATARINA_BOUNDS = {
	minLat: -29.6,
	maxLat: -25.8,
	minLng: -53.9,
	maxLng: -48.3,
};

let balnearioCamboriuSlugCache;
let balnearioCamboriuSlugCacheKey;

export function isBalnearioCamboriuProperty(property) {
	return property?.address?.city?.slug === BALNEARIO_CAMBORIU_CITY_SLUG;
}

export function isSiteEligibleProperty(property) {
	return isBalnearioCamboriuProperty(property) && !isStandaloneHouseProperty(property);
}

function getBalnearioCamboriuSlugCacheKey() {
	const indexPath = join(dataRoot, 'imoveis/index.json');
	const indexStat = statSync(indexPath);
	return String(indexStat.mtimeMs);
}

export function getBalnearioCamboriuPropertySlugs() {
	const cacheKey = getBalnearioCamboriuSlugCacheKey();

	if (balnearioCamboriuSlugCache && balnearioCamboriuSlugCacheKey === cacheKey) {
		return balnearioCamboriuSlugCache;
	}

	const index = JSON.parse(readFileSync(join(dataRoot, 'imoveis/index.json'), 'utf8'));
	balnearioCamboriuSlugCacheKey = cacheKey;
	balnearioCamboriuSlugCache = new Set(
		index.properties
			.filter((property) => property.city === BALNEARIO_CAMBORIU_CITY_SLUG)
			.map((property) => property.slug)
			.filter((slug) => {
				const property = loadProperty(slug);
				return property && isSiteEligibleProperty(property);
			}),
	);

	return balnearioCamboriuSlugCache;
}

export function isBalnearioCamboriuListingEntry(entry) {
	if (!entry?.slug) {
		return false;
	}

	return getBalnearioCamboriuPropertySlugs().has(entry.slug);
}

export function filterBalnearioCamboriuListings(entries) {
	return entries.filter(isBalnearioCamboriuListingEntry);
}

export function listPropertySlugs() {
	return [...getBalnearioCamboriuPropertySlugs()];
}

export function loadProperty(slug) {
	const filePath = join(dataRoot, 'imoveis', slug, 'property.json');

	if (!existsSync(filePath)) {
		return null;
	}

	return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function getPropertyCode(property) {
	const code = property.overview?.code?.trim();

	if (code) {
		return code;
	}

	if (property.id != null) {
		return String(property.id);
	}

	return property.slug;
}

export function toWebpAssetPath(relativePath) {
	return String(relativePath || '').replace(/\.(jpe?g|png)$/i, '.webp');
}

export function getPropertyImageUrl(slug, imageFile) {
	return `/data/imoveis/${slug}/${toWebpAssetPath(imageFile)}`;
}

export function resolvePropertyCityName(property) {
	const city = property.address?.city?.name;

	if (city && !REGIONAL_CITY_NAMES.has(city)) {
		return city;
	}

	const neighborhood = property.address?.neighborhood?.name;

	if (neighborhood && !REGIONAL_CITY_NAMES.has(neighborhood)) {
		return neighborhood;
	}

	const street = property.address?.street || '';
	const streetCity = street.match(/,\s*([A-Za-zÀ-ú\s]+)\s+SC\b/i);

	if (streetCity) {
		return streetCity[1].trim();
	}

	const slashCity = street.match(/([A-Za-zÀ-ú\s]+)\/SC/i);

	if (slashCity) {
		return slashCity[1].trim();
	}

	const titleCity = property.title?.match(/([A-Za-zÀ-ú\s]+)\/SC/i);

	if (titleCity) {
		return titleCity[1].trim();
	}

	return city || null;
}

export function buildLocationLabel(property) {
	const city = property.address?.city?.name;
	const state = property.address?.state?.name || 'SC';
	const neighborhood = property.address?.neighborhood?.name;

	if (neighborhood && city) {
		return `${neighborhood}, ${city} - ${state}`;
	}

	if (city) {
		return `${city}, ${state}`;
	}

	return 'Santa Catarina';
}

export function buildFullAddressLabel(property) {
	const street = property.address?.street?.trim();
	const district = property.address?.district?.trim();
	const city = property.address?.city?.name?.trim();
	const state = property.address?.state?.name === 'Santa Catarina' ? 'SC' : property.address?.state?.name;
	const zipcode = property.address?.zipcode?.trim();

	if (!street) {
		return buildLocationLabel(property);
	}

	const head = district ? `${street} - ${district}` : street;
	const tail = [city && state ? `${city} - ${state}` : city, zipcode].filter(Boolean).join(', ');

	return tail ? `${head}, ${tail}` : head;
}

export function buildPriceLabel(property) {
	return formatPropertyPriceLabel(property?.price);
}

export function isPlaceholderCoordinates(lat, lng) {
	return Math.abs(Number(lat) - PLACEHOLDER_LAT) < 0.000001 && Math.abs(Number(lng) - PLACEHOLDER_LNG) < 0.000001;
}

export function isSantaCatarinaCoordinates(lat, lng) {
	const latitude = Number(lat);
	const longitude = Number(lng);

	return (
		latitude >= SANTA_CATARINA_BOUNDS.minLat &&
		latitude <= SANTA_CATARINA_BOUNDS.maxLat &&
		longitude >= SANTA_CATARINA_BOUNDS.minLng &&
		longitude <= SANTA_CATARINA_BOUNDS.maxLng
	);
}

export function sanitizeImportedLocation(location) {
	if (!location?.lat || !location?.lng) {
		return null;
	}

	if (isPlaceholderCoordinates(location.lat, location.lng)) {
		return null;
	}

	if (!isSantaCatarinaCoordinates(location.lat, location.lng)) {
		return null;
	}

	return {
		lat: Number(location.lat),
		lng: Number(location.lng),
	};
}

function addressLooksComplete(street) {
	return /,/.test(street) || /\b(sc|santa catarina)\b/i.test(street);
}

export function buildMapAddressQuery(property) {
	const address = property.address || {};
	const parts = [];
	const street = address.street?.trim();

	if (street) {
		parts.push(street);

		if (!addressLooksComplete(street)) {
			if (address.neighborhood?.name) {
				parts.push(address.neighborhood.name);
			}

			if (address.city?.name && !REGIONAL_CITY_NAMES.has(address.city.name)) {
				parts.push(address.city.name);
			}
		}
	} else {
		if (address.neighborhood?.name) {
			parts.push(address.neighborhood.name);
		}

		if (address.city?.name && !REGIONAL_CITY_NAMES.has(address.city.name)) {
			parts.push(address.city.name);
		}
	}

	if (!parts.some((part) => /\b(sc|santa catarina)\b/i.test(part))) {
		parts.push(address.state?.name || 'Santa Catarina');
	}

	parts.push('Brasil');

	return parts.filter(Boolean).join(', ');
}

function resolveMapTarget(property) {
	const { lat, lng } = property.location || {};
	const sanitized = sanitizeImportedLocation({ lat, lng });

	if (sanitized) {
		return `${sanitized.lat},${sanitized.lng}`;
	}

	return buildMapAddressQuery(property) || null;
}

export function buildMapUrl(property) {
	const target = resolveMapTarget(property);

	if (!target) {
		return null;
	}

	const query = /,/.test(target) && /^-?\d/.test(target.trim())
		? target
		: encodeURIComponent(target);

	return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function buildMapEmbedUrl(property) {
	const target = resolveMapTarget(property);

	if (!target) {
		return null;
	}

	const query = /,/.test(target) && /^-?\d/.test(target.trim())
		? target
		: encodeURIComponent(target);

	return `https://www.google.com/maps?q=${query}&z=15&output=embed`;
}

export function getBairroUrl(property) {
	if (property.address?.city?.slug !== 'balneario-camboriu') {
		return null;
	}

	const pageSlug = resolveNeighborhoodPageSlug(property.address?.neighborhood?.slug);
	return pageSlug ? `/bairro/${pageSlug}` : null;
}

export function getPropertyVideoUrl(property) {
	const url = property.videoUrl;
	if (!url || url === GENERIC_VIDEO) {
		return null;
	}

	return url;
}

export function escapeHtml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}
