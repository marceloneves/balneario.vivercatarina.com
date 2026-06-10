/** Formata ISO (YYYY-MM-DD) para exibição em pt-BR: DD/MM/AAAA */
export function formatBlogDatePtBr(iso) {
	if (!iso || typeof iso !== 'string') {
		return '';
	}

	const [year, month, day] = iso.split('-');

	if (!year || !month || !day) {
		return '';
	}

	return `${day}/${month}/${year}`;
}
