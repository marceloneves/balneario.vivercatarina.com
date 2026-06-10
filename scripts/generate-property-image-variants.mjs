import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	PROPERTY_IMAGE_LCP_WIDTH,
	PROPERTY_IMAGE_THUMB_WIDTH,
} from '../src/lib/property-image-variants.mjs';
import { WEBP_QUALITY } from '../src/lib/webp-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imoveisDir = join(root, 'src/data/imoveis');
const VARIANTS = [
	{ suffix: `${PROPERTY_IMAGE_THUMB_WIDTH}w`, width: PROPERTY_IMAGE_THUMB_WIDTH, quality: WEBP_QUALITY },
	{ suffix: `${PROPERTY_IMAGE_LCP_WIDTH}w`, width: PROPERTY_IMAGE_LCP_WIDTH, quality: WEBP_QUALITY },
];
const CONCURRENCY = 12;

async function walkWebpFiles(dir, files = []) {
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await walkWebpFiles(fullPath, files);
			continue;
		}

		if (!entry.name.endsWith('.webp') || /-\d+w\.webp$/i.test(entry.name)) {
			continue;
		}

		files.push(fullPath);
	}

	return files;
}

async function createVariant(sourcePath, variant) {
	const targetPath = sourcePath.replace(/\.webp$/i, `-${variant.suffix}.webp`);

	await sharp(sourcePath, { failOn: 'none' })
		.resize({ width: variant.width, withoutEnlargement: true })
		.webp({ quality: variant.quality })
		.toFile(targetPath);

	const [sourceStat, targetStat] = await Promise.all([stat(sourcePath), stat(targetPath)]);

	return {
		status: 'created',
		sourcePath,
		targetPath,
		before: sourceStat.size,
		after: targetStat.size,
	};
}

async function runPool(items, worker) {
	const results = [];
	let index = 0;

	async function consume() {
		while (index < items.length) {
			const current = items[index];
			index += 1;
			results.push(await worker(current));
		}
	}

	await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, consume));
	return results;
}

async function main() {
	const files = await walkWebpFiles(imoveisDir);
	const jobs = files.flatMap((filePath) => VARIANTS.map((variant) => ({ filePath, variant })));

	console.log(`Gerando variantes para ${files.length} imagens (${jobs.length} arquivos).`);

	const results = await runPool(jobs, ({ filePath, variant }) => createVariant(filePath, variant));
	const created = results.filter((item) => item.status === 'created');
	const skipped = results.filter((item) => item.status === 'skipped');

	console.log(`Criadas: ${created.length}`);
	console.log(`Já existiam: ${skipped.length}`);
	console.log(
		`Tamanho das novas variantes: ${(created.reduce((sum, item) => sum + item.after, 0) / 1024 / 1024).toFixed(2)} MiB`,
	);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
