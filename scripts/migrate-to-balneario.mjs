import { readFileSync, writeFileSync, readdirSync, renameSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname, basename } from 'node:path';

const ROOT = join(process.cwd());
const EXCLUDE_DIRS = new Set(['.node-local', 'node_modules', '.git', 'tmp', 'dist', '.vercel']);

const SPECIAL_SLUG_MAP = {
	'ingleses-x-norte-cidade-onde-morar-balneario-camboriu': 'ingleses-x-norte-cidade-onde-morar-balneario-camboriu',
	'centro-x-beira-mar-onde-morar-balneario-camboriu': 'centro-x-beira-mar-onde-morar-balneario-camboriu',
	'morar-centro-x-praias-em-balneario-camboriu': 'morar-centro-x-praias-em-balneario-camboriu',
	'campeche-x-bairros-sul-comparativo': 'campeche-x-bairros-sul-comparativo',
	'balneario-camboriu-trabalho-remoto-guia-nomade-digital': 'balneario-camboriu-trabalho-remoto-guia-nomade-digital',
};

const FILE_RENAMES = [
	['src/data/balneario-camboriu-neighborhoods.json', 'src/data/balneario-camboriu-neighborhoods.json'],
	['src/lib/balneario-camboriu-cluster.mjs', 'src/lib/balneario-camboriu-cluster.mjs'],
	['scripts/rebuild-balneario-camboriu-cluster-links.mjs', 'scripts/rebuild-balneario-camboriu-cluster-links.mjs'],
];

function walk(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (EXCLUDE_DIRS.has(entry.name)) continue;
		const full = join(dir, entry.name);
		if (entry.isDirectory()) walk(full, files);
		else files.push(full);
	}
	return files;
}

function protectIlhaTerms(content) {
	const placeholders = [];
	let next = content;

	const rules = [
		[/Ilha do Campeche/gi, 'Ilha do Campeche'],
		[/Ribeirão da Ilha/gi, 'Ribeirão da Ilha'],
		[/Ilha das Laranjeiras/gi, 'Ilha das Laranjeiras'],
		[/ilha-do-campeche/g, 'ilha-do-campeche'],
		[/ribeirao-da-ilha/g, 'ribeirao-da-ilha'],
		[/ilha-das-laranjeiras/g, 'ilha-das-laranjeiras'],
		[/sul-da-ilha-spot/g, 'sul-da-ilha-spot'],
	];

	for (const [pattern, token] of rules) {
		next = next.replace(pattern, token);
	}

	return next;
}

function restoreIlhaTerms(content) {
	return content
		.replaceAll('Ilha do Campeche', 'Ilha do Campeche')
		.replaceAll('Ribeirão da Ilha', 'Ribeirão da Ilha')
		.replaceAll('Ilha das Laranjeiras', 'Ilha das Laranjeiras')
		.replaceAll('ilha-do-campeche', 'ilha-do-campeche')
		.replaceAll('ribeirao-da-ilha', 'ribeirao-da-ilha')
		.replaceAll('ilha-das-laranjeiras', 'ilha-das-laranjeiras')
		.replaceAll('sul-da-ilha-spot', 'sul-da-ilha-spot');
}

function applyIlhaTextReplacements(content) {
	let next = protectIlhaTerms(content);

	const replacements = [
		[/Balneário Camboriú/gi, 'Balneário Camboriú'],
		[/norte de Balneário Camboriú/gi, 'norte de Balneário Camboriú'],
		[/sul de Balneário Camboriú/gi, 'sul de Balneário Camboriú'],
		[/maior bairro de Balneário Camboriú/gi, 'maior bairro de Balneário Camboriú'],
		[/em Balneário Camboriú, Santa Catarina/gi, 'em Balneário Camboriú, Santa Catarina'],
		[/em Balneário Camboriú\b/gi, 'em Balneário Camboriú'],
		[/em Balneário Camboriú\b/g, 'em Balneário Camboriú'],
		[/de Balneário Camboriú\b/gi, 'de Balneário Camboriú'],
		[/de Balneário Camboriú\b/g, 'de Balneário Camboriú'],
		[/a Balneário Camboriú\b/gi, 'a Balneário Camboriú'],
		[/a Balneário Camboriú\b/g, 'a Balneário Camboriú'],
		[/praias e centro/gi, 'praias e centro'],
		[/centro e praias/gi, 'centro e praias'],
		[/incorporadoras de Balneário Camboriú/gi, 'incorporadoras de Balneário Camboriú'],
		[/incorporadoras de Balneário Camboriú/gi, 'incorporadoras de Balneário Camboriú'],
		[/litoral catarinense/gi, 'litoral catarinense'],
	];

	for (const [pattern, replacement] of replacements) {
		next = next.replace(pattern, replacement);
	}

	return restoreIlhaTerms(next);
}

function applySlugReplacements(content) {
	let next = content;

	for (const [from, to] of Object.entries(SPECIAL_SLUG_MAP)) {
		next = next.replaceAll(from, to);
	}

	next = next.replaceAll('balneario-camboriu', 'balneario-camboriu');
	next = next.replaceAll('Balneário Camboriú', 'Balneário Camboriú');
	next = next.replaceAll('balneario-camboriu', 'balneario-camboriu');

	next = next.replaceAll('BALNEARIO_CAMBORIU_PILLAR', 'BALNEARIO_CAMBORIU_PILLAR');
	next = next.replaceAll('BALNEARIO_CAMBORIU_CLUSTER_SLUGS', 'BALNEARIO_CAMBORIU_CLUSTER_SLUGS');
	next = next.replaceAll('BALNEARIO_CAMBORIU_CITY_SLUG', 'BALNEARIO_CAMBORIU_CITY_SLUG');
	next = next.replaceAll('BALNEARIO_CAMBORIU_SHOPPING_CENTERS', 'BALNEARIO_CAMBORIU_SHOPPING_CENTERS');
	next = next.replaceAll('BALNEARIO_CAMBORIU_SHOPPING_PATTERNS', 'BALNEARIO_CAMBORIU_SHOPPING_PATTERNS');
	next = next.replaceAll('balneario-camboriu-neighborhoods.json', 'balneario-camboriu-neighborhoods.json');
	next = next.replaceAll('balneario-camboriu-cluster.mjs', 'balneario-camboriu-cluster.mjs');
	next = next.replaceAll('rebuild-balneario-camboriu-cluster-links.mjs', 'rebuild-balneario-camboriu-cluster-links.mjs');
	next = next.replaceAll('isBalnearioCamboriuProperty', 'isBalnearioCamboriuProperty');
	next = next.replaceAll('isBalnearioCamboriuListingEntry', 'isBalnearioCamboriuListingEntry');
	next = next.replaceAll('filterBalnearioCamboriuListings', 'filterBalnearioCamboriuListings');
	next = next.replaceAll('getBalnearioCamboriuPropertySlugs', 'getBalnearioCamboriuPropertySlugs');
	next = next.replaceAll('getBalnearioCamboriuSlugCacheKey', 'getBalnearioCamboriuSlugCacheKey');
	next = next.replaceAll('balneario-camboriuSlugCache', 'balnearioCamboriuSlugCache');
	next = next.replaceAll('balneario-camboriuSlugCacheKey', 'balnearioCamboriuSlugCacheKey');

	return next;
}

function transformContent(content) {
	let next = applySlugReplacements(content);
	next = applyIlhaTextReplacements(next);
	next = next.replaceAll(/lan[cç]amento\s+em\s+florian[oó]polis/gi, 'lançamento em Balneário Camboriú');
	next = next.replaceAll(/em\s+florian[oó]polis/gi, 'em Balneário Camboriú');
	return next;
}

function shouldProcessFile(file) {
	const ext = extname(file);
	return ['.mjs', '.astro', '.html', '.json', '.md', '.txt', '.xml'].includes(ext);
}

// 1. Transform all file contents
let changed = 0;
for (const file of walk(ROOT)) {
	if (!shouldProcessFile(file)) continue;
	const original = readFileSync(file, 'utf8');
	const updated = transformContent(original);
	if (updated !== original) {
		writeFileSync(file, updated, 'utf8');
		changed++;
	}
}
console.log(`Conteúdo atualizado em ${changed} arquivos`);

// 2. Rename blog HTML files whose basename contains old slug tokens
const blogDir = join(ROOT, 'src/content/blog');
for (const file of readdirSync(blogDir)) {
	if (!file.endsWith('.html')) continue;
	const oldBase = file.replace(/\.html$/, '');
	const newBase = applySlugReplacements(oldBase);
	if (newBase !== oldBase) {
		const from = join(blogDir, file);
		const to = join(blogDir, `${newBase}.html`);
		if (!existsSync(to)) {
			renameSync(from, to);
			console.log(`Blog renomeado: ${file} -> ${newBase}.html`);
		}
	}
}

// 3. Rename property directories
const imoveisDir = join(ROOT, 'src/data/imoveis');
for (const entry of readdirSync(imoveisDir, { withFileTypes: true })) {
	if (!entry.isDirectory()) continue;
	const oldName = entry.name;
	const newName = applySlugReplacements(oldName);
	if (newName === oldName) continue;
	const from = join(imoveisDir, oldName);
	const to = join(imoveisDir, newName);
	if (!existsSync(to)) {
		renameSync(from, to);
		console.log(`Imóvel renomeado: ${oldName} -> ${newName}`);
	}
}

// 4. Rename shared files
for (const [fromRel, toRel] of FILE_RENAMES) {
	const from = join(ROOT, fromRel);
	const to = join(ROOT, toRel);
	if (existsSync(from) && !existsSync(to)) {
		renameSync(from, to);
		console.log(`Arquivo renomeado: ${fromRel} -> ${toRel}`);
	}
}

console.log('Migração concluída.');
