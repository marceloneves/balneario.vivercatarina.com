import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const publicRoot = join(process.cwd(), 'public');
const cache = new Map();

/**
 * Anexa ?v=<hash do conteúdo> a um asset de `public/`.
 *
 * O Cloudflare serve os CSS com max-age de 7 dias. Sem a query, uma alteração
 * só chega ao usuário quando o cache expira. Com o hash, cada mudança vira uma
 * URL nova e o cache antigo deixa de ser usado.
 *
 * Assets externos (http…) e caminhos inexistentes voltam intactos.
 */
export function versionedAsset(href) {
	if (typeof href !== 'string' || !href.startsWith('/')) {
		return href;
	}

	if (cache.has(href)) {
		return cache.get(href);
	}

	let result = href;

	try {
		const contents = readFileSync(join(publicRoot, href.replace(/^\//, '')));
		const hash = createHash('sha1').update(contents).digest('hex').slice(0, 8);
		result = `${href}?v=${hash}`;
	} catch {
		// Asset gerado pelo Astro (ex.: /_astro/…) ou ausente: já tem hash próprio.
	}

	cache.set(href, result);
	return result;
}
