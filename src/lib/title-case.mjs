/**
 * Title case para títulos de seção (inicial maiúscula em palavras principais).
 * Artigos e preposições permanecem em minúsculas, exceto no início.
 * Preserva siglas e trechos já em maiúsculas (ex.: D/Pace, SC).
 */
const MINOR_WORDS = new Set([
	'a',
	'o',
	'os',
	'as',
	'um',
	'uma',
	'uns',
	'umas',
	'de',
	'do',
	'da',
	'dos',
	'das',
	'e',
	'em',
	'no',
	'na',
	'nos',
	'nas',
	'por',
	'para',
	'com',
	'sem',
	'ao',
	'à',
	'aos',
	'às',
	'sobre',
	'sob',
	'entre',
	'até',
	'que',
	'ou',
	'mas',
	'nem',
]);

function normalizeWord(word) {
	return word.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').toLocaleLowerCase('pt-BR');
}

export function toTitleCase(text) {
	if (text == null || text === '') return '';

	const words = String(text).split(/\s+/).filter(Boolean);

	return words
		.map((word, index) => {
			if (/^[A-Z0-9][A-Z0-9/.-]*$/.test(word)) {
				return word;
			}

			if (word !== word.toLocaleLowerCase('pt-BR') && /[a-záàâãéêíóôõúç]/i.test(word.slice(1))) {
				return word;
			}

			const lower = word.toLocaleLowerCase('pt-BR');
			const normalized = normalizeWord(word);

			if (index > 0 && MINOR_WORDS.has(normalized)) {
				return lower;
			}

			const firstLetterIndex = word.search(/\p{L}/u);
			if (firstLetterIndex === -1) {
				return lower;
			}

			return (
				word.slice(0, firstLetterIndex) +
				word.charAt(firstLetterIndex).toLocaleUpperCase('pt-BR') +
				word.slice(firstLetterIndex + 1).toLocaleLowerCase('pt-BR')
			);
		})
		.join(' ');
}
