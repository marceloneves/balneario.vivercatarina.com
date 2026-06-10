/**
 * Audita âncoras do corpo em todos os HTML do blog (≤3 palavras, sem início/fim fraco).
 * Uso: node scripts/audit-blog-body-anchors.mjs
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	findOverlongBodyAnchors,
	findWeakBodyAnchors,
} from '../src/lib/cluster-link-anchor.mjs';

const blogDir = join(process.cwd(), 'src/content/blog');
const files = readdirSync(blogDir).filter((f) => f.endsWith('.html')).sort();

let failed = false;

for (const file of files) {
	const slug = file.replace(/\.html$/, '');
	const html = readFileSync(join(blogDir, file), 'utf8');
	const over = findOverlongBodyAnchors(html);
	const weak = findWeakBodyAnchors(html);

	if (!over.length && !weak.length) {
		continue;
	}

	failed = true;
	console.error(`\n${slug}:`);
	for (const { href, text, words } of over) {
		console.error(`  [${words} palavras] ${text} → ${href}`);
	}
	for (const { href, text } of weak) {
		console.error(`  [âncora fraca] ${text} → ${href}`);
	}
}

if (failed) {
	console.error(`\nFalha: corrija as âncoras acima (${files.length} artigos auditados).`);
	process.exit(1);
}

console.log(`OK: ${files.length} artigos do blog sem âncoras longas ou fracas no corpo.`);
