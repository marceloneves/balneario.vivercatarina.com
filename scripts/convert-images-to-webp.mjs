import { readFile, writeFile } from 'node:fs/promises';
import { encodeWebpBuffer } from '../src/lib/webp-process.mjs';
import { existsSync } from 'node:fs';
import {
	mkdir,
	readdir,
	readFile,
	stat,
	unlink,
	writeFile,
} from 'node:fs/promises';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const RASTER_EXT = /\.(jpe?g|png)$/i;
const SKIP_DIRS = new Set(['node_modules', 'dist', '.vercel', '.git', 'tmp', '.node-local']);
const SKIP_PATH_SNIPPETS = ['/favicons/', '/favicons\\'];
const IMAGE_ROOTS = [join(root, 'src/data/imoveis'), join(root, 'public/assets/img')];
const TEXT_ROOTS = [join(root, 'src'), join(root, 'public/assets/css')];
const TEXT_EXTENSIONS = new Set(['.json', '.mjs', '.js', '.astro', '.html', '.css', '.md']);
const CONCURRENCY = 12;

async function walkRasterFiles(dir, files = []) {
	let entries;

	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return files;
	}

	for (const entry of entries) {
		if (SKIP_DIRS.has(entry.name)) {
			continue;
		}

		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			if (SKIP_PATH_SNIPPETS.some((snippet) => fullPath.includes(snippet))) {
				continue;
			}

			await walkRasterFiles(fullPath, files);
			continue;
		}

		if (RASTER_EXT.test(entry.name)) {
			files.push(fullPath);
		}
	}

	return files;
}

async function convertFile(filePath) {
	const ext = extname(filePath).toLowerCase();
	const webpPath = filePath.replace(RASTER_EXT, '.webp');

	if (existsSync(webpPath)) {
		await unlink(filePath);
		const webpStat = await stat(webpPath);

		return {
			status: 'removed-duplicate-original',
			filePath,
			webpPath,
			before: 0,
			after: webpStat.size,
		};
	}

	const sourceBuffer = await readFile(filePath);
	const outputBuffer = await encodeWebpBuffer(sourceBuffer);
	await writeFile(webpPath, outputBuffer);

	const [origStat, webpStat] = await Promise.all([stat(filePath), stat(webpPath)]);
	await unlink(filePath);

	return {
		status: 'converted',
		filePath,
		webpPath,
		before: origStat.size,
		after: webpStat.size,
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

function replaceRasterExtensions(text) {
	return text
		.replace(/\.jpe?g(?=["'\\\s>]|$)/gi, '.webp')
		.replace(/\.png(?=["'\\\s>]|$)/gi, '.webp');
}

async function walkTextFiles(dir, files = []) {
	let entries;

	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return files;
	}

	for (const entry of entries) {
		if (SKIP_DIRS.has(entry.name)) {
			continue;
		}

		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await walkTextFiles(fullPath, files);
			continue;
		}

		if (TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
			files.push(fullPath);
		}
	}

	return files;
}

async function updateTextReferences() {
	const files = [];

	for (const textRoot of TEXT_ROOTS) {
		await walkTextFiles(textRoot, files);
	}

	let updatedFiles = 0;

	for (const filePath of files) {
		const original = await readFile(filePath, 'utf8');
		const updated = replaceRasterExtensions(original);

		if (updated !== original) {
			await writeFile(filePath, updated, 'utf8');
			updatedFiles += 1;
		}
	}

	return updatedFiles;
}

async function main() {
	const files = [];

	for (const imageRoot of IMAGE_ROOTS) {
		await walkRasterFiles(imageRoot, files);
	}

	console.log(`Encontradas ${files.length} imagens raster para converter.`);

	const results = await runPool(files, convertFile);
	const converted = results.filter((item) => item.status === 'converted');
	const removedDuplicates = results.filter((item) => item.status === 'removed-duplicate-original');
	const beforeBytes = converted.reduce((sum, item) => sum + item.before, 0);
	const afterBytes = converted.reduce((sum, item) => sum + item.after, 0);
	const updatedFiles = await updateTextReferences();

	console.log(`Convertidas: ${converted.length}`);
	console.log(`Originais removidos (webp já existia): ${removedDuplicates.length}`);
	console.log(
		`Tamanho antes: ${(beforeBytes / 1024 / 1024).toFixed(2)} MiB | depois: ${(afterBytes / 1024 / 1024).toFixed(2)} MiB | economia: ${beforeBytes ? (((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1) : '0.0'}%`,
	);
	console.log(`Arquivos de texto atualizados: ${updatedFiles}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
