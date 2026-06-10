import { readdir, readFile, stat, unlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { encodeWebpBuffer } from '../src/lib/webp-process.mjs';
import { MAX_WEBP_WIDTH, WEBP_QUALITY } from '../src/lib/webp-quality.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMAGE_ROOTS = [join(root, 'src/data/imoveis'), join(root, 'public/assets/img')];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.vercel', '.git', 'tmp', '.node-local']);
const SKIP_PATH_SNIPPETS = ['/favicons/'];
const VARIANT_PATTERN = /-\d+w\.webp$/i;
const CONCURRENCY = 12;

async function walkWebpFiles(dir, files = []) {
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

			await walkWebpFiles(fullPath, files);
			continue;
		}

		if (entry.name.endsWith('.webp') && !VARIANT_PATTERN.test(entry.name)) {
			files.push(fullPath);
		}
	}

	return files;
}

async function walkVariantFiles(dir, files = []) {
	let entries;

	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch {
		return files;
	}

	for (const entry of entries) {
		const fullPath = join(dir, entry.name);

		if (entry.isDirectory()) {
			await walkVariantFiles(fullPath, files);
			continue;
		}

		if (VARIANT_PATTERN.test(entry.name)) {
			files.push(fullPath);
		}
	}

	return files;
}

async function normalizeFile(filePath) {
	const before = (await stat(filePath)).size;
	const fileBuffer = await readFile(filePath);
	const buffer = await encodeWebpBuffer(fileBuffer);
	await writeFile(filePath, buffer);

	return { filePath, before, after: buffer.length };
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
	const files = [];

	for (const imageRoot of IMAGE_ROOTS) {
		await walkWebpFiles(imageRoot, files);
	}

	console.log(
		`Normalizando ${files.length} WebP para até ${MAX_WEBP_WIDTH}px com qualidade ${WEBP_QUALITY}.`,
	);

	const results = await runPool(files, normalizeFile);
	const beforeBytes = results.reduce((sum, item) => sum + item.before, 0);
	const afterBytes = results.reduce((sum, item) => sum + item.after, 0);

	console.log(
		`Antes: ${(beforeBytes / 1024 / 1024).toFixed(2)} MiB | Depois: ${(afterBytes / 1024 / 1024).toFixed(2)} MiB | Economia: ${(((beforeBytes - afterBytes) / beforeBytes) * 100).toFixed(1)}%`,
	);

	const variantFiles = await walkVariantFiles(join(root, 'src/data/imoveis'));

	for (const variantPath of variantFiles) {
		await unlink(variantPath);
	}

	console.log(`Variantes removidas: ${variantFiles.length}. Regenerando...`);

	const { spawn } = await import('node:child_process');
	await new Promise((resolve, reject) => {
		const child = spawn('node', ['scripts/generate-property-image-variants.mjs'], {
			cwd: root,
			stdio: 'inherit',
		});

		child.on('exit', (code) => {
			if (code === 0) {
				resolve();
				return;
			}

			reject(new Error(`generate-property-image-variants.mjs falhou com código ${code}`));
		});
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
