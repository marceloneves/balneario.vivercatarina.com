function stripHtml(html) {
	return String(html ?? '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

const SPE_PATTERNS = [
	/modalidade\s+SPE\b/i,
	/SPE\s*\(\s*Sociedade de Prop[oó]sito Espec[ií]fico\s*\)/i,
	/sociedade de prop[oó]sito espec[ií]fico/i,
	/constru[ií]d[oa]\s+na\s+modalidade\s+SPE\b/i,
	/(?:projeto|lan[cç]amento)\s+SPE\s+(?:na|em|no)\b/i,
	/empresa especializada em SPEs?\b/i,
	/(?:Constru[cç][aã]o|Lan[cç]amento)\s+SPE,?\s+/i,
];

/** Indica se o empreendimento declara modalidade SPE no título ou na descrição. */
export function isSpeProperty(property) {
	if (!property) {
		return false;
	}

	const haystack = `${property.title || ''} ${stripHtml(property.descriptionHtml)}`;
	return SPE_PATTERNS.some((pattern) => pattern.test(haystack));
}
