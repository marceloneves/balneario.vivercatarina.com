/**
 * Falha se algum <a> no HTML tiver âncora com mais de 3 palavras.
 * Uso: node scripts/validate-cluster-anchor-length.mjs <arquivo.html> ...
 */
import { readFileSync } from 'node:fs';
import { findOverlongBodyAnchors } from '../src/lib/cluster-link-anchor.mjs';

const files = process.argv.slice(2);
if (!files.length) {
	console.error('Informe um ou mais arquivos HTML.');
	process.exit(1);
}

let failed = false;

for (const file of files) {
	const html = readFileSync(file, 'utf8');
	const over = findOverlongBodyAnchors(html);
	if (over.length) {
		failed = true;
		console.error(`\n${file}:`);
		for (const { href, text, words } of over) {
			console.error(`  ${words} palavras → ${href} → "${text}"`);
		}
	}
}

if (failed) {
	process.exit(1);
}

console.log(`OK: ${files.length} arquivo(s) sem âncoras > 3 palavras.`);
