/**
 * Regras unificadas de linkagem por cluster:
 * - Pilar: Leia também com 1× cada satélite; sem links /blog/ no corpo.
 * - Satélite: 1× pilar + 3× satélites no corpo; pilar + 3× satélites no Leia também; 1× hub no meio.
 */

/** @param {Record<string, { links: { find: string, target: string }[] }>} allPlans */
export function findFindForTarget(allPlans, target) {
	for (const plan of Object.values(allPlans)) {
		const hit = plan.links.find((link) => link.target === target);
		if (hit) {
			return hit.find;
		}
	}

	return null;
}

/**
 * Mantém só destinos do cluster: 1× pilar + até 3× satélites (sem duplicar target).
 * Completa satélites faltantes a partir de `leiaExtra` e de outros planos do cluster.
 */
export function trimSatelliteBodyPlan(links, slug, pillar, satelliteSlugs, allPlans = {}, leiaExtra = []) {
	const clusterSet = new Set([pillar, ...satelliteSlugs]);
	const filtered = links.filter(({ target }) => clusterSet.has(target));

	const pillarLink = filtered.find((link) => link.target === pillar);
	const satLinks = [];
	const seen = new Set();

	for (const link of filtered) {
		if (link.target === pillar || link.target === slug) {
			continue;
		}

		if (!seen.has(link.target)) {
			seen.add(link.target);
			satLinks.push(link);
		}

		if (satLinks.length === 3) {
			break;
		}
	}

	for (const target of leiaExtra) {
		if (satLinks.length >= 3) {
			break;
		}

		if (target === slug || target === pillar || !clusterSet.has(target) || seen.has(target)) {
			continue;
		}

		const find = findFindForTarget(allPlans, target);
		if (find) {
			seen.add(target);
			satLinks.push({ find, target });
		}
	}

	const result = [];

	if (pillarLink) {
		result.push(pillarLink);
	} else {
		const fallbackFind = findFindForTarget(allPlans, pillar);
		if (fallbackFind) {
			result.push({ find: fallbackFind, target: pillar });
		}
	}

	return [...result, ...satLinks.slice(0, 3)];
}

/** Conta links /blog/ no corpo (antes do Leia também). */
export function sliceBodyBeforeRelated(html) {
	const markers = ['<p class="blog-related__title">Leia também</p>'];

	let end = html.length;

	for (const marker of markers) {
		const idx = html.indexOf(marker);
		if (idx !== -1 && idx < end) {
			end = idx;
		}
	}

	return html.slice(0, end);
}

/** @param {string} html @param {string} pillarHref */
export function countPillarLinksInHtml(html, pillarHref) {
	return (html.match(new RegExp(pillarHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length;
}

export function expectedBodySatelliteLinkCount(publishedSatelliteSlugs, slug) {
	return Math.min(3, Math.max(0, publishedSatelliteSlugs.length - 1));
}

/** @param {string} html @param {string} slug @param {string[]} publishedSatelliteSlugs @param {(s: string) => string} blogHrefFn */
export function countBodySatelliteLinks(html, slug, publishedSatelliteSlugs, blogHrefFn) {
	const body = sliceBodyBeforeRelated(html);
	return publishedSatelliteSlugs.filter(
		(other) => other !== slug && body.includes(blogHrefFn(other)),
	).length;
}

export function countBodyBlogLinks(html) {
	const body = sliceBodyBeforeRelated(html);
	return (body.match(/href="\/blog\/[^"]+"/g) ?? []).length;
}

export function countHubBlocks(html) {
	return (html.match(/<div class="blog-related blog-property-hub-row">/g) ?? []).length;
}

/** Mantém só slugs que pertencem ao cluster (exclui o artigo atual). */
export function filterClusterSlugs(slugs, allowedSlugs, excludeSlug) {
	const allowed = new Set(allowedSlugs);
	return slugs.filter((s) => s !== excludeSlug && allowed.has(s));
}

/** Pilar em 1º + até `maxSatellites` satélites do mesmo cluster. */
export function buildLeiaTambemSlugs(slug, pillar, satelliteSlugs, leiaExtra = [], maxSatellites = 3) {
	const allowed = new Set([pillar, ...satelliteSlugs]);
	const satellites = filterClusterSlugs(leiaExtra, allowed, slug).slice(0, maxSatellites);
	return [pillar, ...satellites];
}

/** Links `/blog/` cujo destino não está no conjunto permitido do cluster. */
export function findCrossClusterBlogLinks(html, allowedSlugs) {
	const allowed = new Set(allowedSlugs);
	const hits = [];

	for (const [, href, target] of html.matchAll(/href="(\/blog\/([^"?#]+))"/g)) {
		if (allowed.has(target)) {
			continue;
		}

		hits.push({ href, target });
	}

	return hits;
}
