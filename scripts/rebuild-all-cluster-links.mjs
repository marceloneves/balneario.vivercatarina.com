/**
 * Reaplica linkagem de todos os clusters.
 * Uso: node scripts/rebuild-all-cluster-links.mjs
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const scripts = [
	'rebuild-campeche-cluster-links.mjs',
	'rebuild-jurere-cluster-links.mjs',
	'rebuild-canasvieiras-cluster-links.mjs',
	'rebuild-centro-cluster-links.mjs',
	'rebuild-pioneiros-cluster-links.mjs',
	'rebuild-ingleses-cluster-links.mjs',
	'rebuild-itacorubi-cluster-links.mjs',
	'rebuild-cachoeira-cluster-links.mjs',
	'rebuild-compra-segura-cluster-links.mjs',
	'rebuild-balneario-camboriu-cluster-links.mjs',
];

let failed = false;

for (const script of scripts) {
	console.log(`\n=== ${script} ===`);
	const result = spawnSync(process.execPath, [join(root, 'scripts', script)], {
		cwd: root,
		stdio: 'inherit',
	});

	if (result.status !== 0) {
		failed = true;
	}
}

if (!failed) {
	console.log('\n=== validate-cluster-cross-links.mjs ===');
	const validation = spawnSync(process.execPath, [join(root, 'scripts', 'validate-cluster-cross-links.mjs')], {
		cwd: root,
		stdio: 'inherit',
	});

	if (validation.status !== 0) {
		failed = true;
	}
}

process.exit(failed ? 1 : 0);
