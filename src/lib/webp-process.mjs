import sharp from 'sharp';
import { MAX_WEBP_WIDTH, WEBP_ALPHA_QUALITY, WEBP_QUALITY } from './webp-quality.mjs';

export async function encodeWebpBuffer(fileBuffer) {
	const { hasAlpha } = await sharp(fileBuffer, { failOn: 'none' }).metadata();

	return sharp(fileBuffer, { failOn: 'none' })
		.resize({ width: MAX_WEBP_WIDTH, withoutEnlargement: true })
		.webp({
			quality: WEBP_QUALITY,
			effort: 4,
			...(hasAlpha ? { alphaQuality: WEBP_ALPHA_QUALITY } : {}),
		})
		.toBuffer();
}

export async function encodeWebpFile(sourcePath, targetPath) {
	const fileBuffer = await sharp(sourcePath, { failOn: 'none' }).toBuffer();
	const output = await encodeWebpBuffer(fileBuffer);
	await sharp(output).toFile(targetPath);
}
