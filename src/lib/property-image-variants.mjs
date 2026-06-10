import { getPropertyImageUrl, toWebpAssetPath } from './property-data.mjs';
import { MAX_WEBP_WIDTH } from './webp-quality.mjs';

export const PROPERTY_IMAGE_THUMB_WIDTH = 240;
export const PROPERTY_IMAGE_LCP_WIDTH = 800;

function getVariantFilePath(slug, imageFile, width) {
	const webpFile = toWebpAssetPath(imageFile);
	const base = webpFile.replace(/\.webp$/i, '');

	return `/data/imoveis/${slug}/${base}-${width}w.webp`;
}

export function buildGalleryImageSources(slug, imageFile, alt, title) {
	const url = getPropertyImageUrl(slug, imageFile);
	const thumbUrl = getVariantFilePath(slug, imageFile, PROPERTY_IMAGE_THUMB_WIDTH);
	const lcpUrl = getVariantFilePath(slug, imageFile, PROPERTY_IMAGE_LCP_WIDTH);

	return {
		url,
		thumbUrl,
		lcpUrl,
		alt,
		title,
		srcset: `${thumbUrl} ${PROPERTY_IMAGE_THUMB_WIDTH}w, ${lcpUrl} ${PROPERTY_IMAGE_LCP_WIDTH}w, ${url} ${MAX_WEBP_WIDTH}w`,
		sizes: '(max-width: 768px) 100vw, 800px',
		thumbSrcset: `${thumbUrl} ${PROPERTY_IMAGE_THUMB_WIDTH}w, ${lcpUrl} ${PROPERTY_IMAGE_LCP_WIDTH}w`,
		thumbSizes: '240px',
	};
}
