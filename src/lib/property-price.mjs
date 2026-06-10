const STARTING_PRICE_PATTERN =
	/a partir de[\s\S]{0,50}?R\$\s*(\d{1,3}(?:\.\d{3})+(?:,\d{2})?|\d+(?:,\d{3})+)/gi;

const BR_CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	maximumFractionDigits: 0,
});

function normalizeAmount(amount) {
	const value = Number(amount);

	if (!Number.isFinite(value) || value <= 0) {
		return null;
	}

	return value;
}

export function formatBrCurrency(amount) {
	const value = normalizeAmount(amount);

	if (value == null) {
		return null;
	}

	return BR_CURRENCY_FORMATTER.format(value);
}

export function parseBrCurrency(display) {
	if (!display) {
		return null;
	}

	const match = String(display).match(/R\$\s*([\d.,\s]+)/i);

	if (!match) {
		return null;
	}

	let value = match[1].trim().replace(/\s/g, '');

	if (value.includes(',') && value.includes('.')) {
		return Number(value.replace(/\./g, '').replace(',', '.'));
	}

	if (value.includes(',')) {
		const parts = value.split(',');

		if (parts.length === 2 && parts[1].length <= 2) {
			return Number(`${parts[0].replace(/\./g, '')}.${parts[1]}`);
		}

		if (parts.every((part) => /^\d{1,3}$/.test(part))) {
			return Number(parts.join(''));
		}

		return Number(value.replace(/,/g, ''));
	}

	if (value.includes('.')) {
		return Number(value.replace(/\./g, ''));
	}

	return Number(value);
}

export function formatPropertyPriceLabel(price = {}, fallbackAmount = null) {
	const amount = normalizeAmount(price?.amount ?? fallbackAmount);
	const formatted = formatBrCurrency(amount);

	if (!formatted) {
		return 'Consulte';
	}

	const prefix = price?.prefix?.trim();

	return prefix ? `${prefix} ${formatted}` : formatted;
}

export function parseUsDisplayPrice(display) {
	return parseBrCurrency(display);
}

export function formatUsDisplayPrice(amount) {
	return formatBrCurrency(amount);
}

export function extractStartingPricesFromHtml(html) {
	if (!html) {
		return [];
	}

	const prices = [];

	for (const match of html.matchAll(STARTING_PRICE_PATTERN)) {
		const context = html.slice(Math.max(0, match.index - 30), match.index).toLowerCase();

		if (/entrada\s*$/.test(context.trim()) || /vaga[^a]{0,40}$/.test(context)) {
			continue;
		}

		prices.push(parseBrCurrency(`R$ ${match[1]}`));
	}

	return prices.filter((price) => Number.isFinite(price));
}

export function resolvePropertyPrice({ display, prefix, amount, descriptionHtml }) {
	const displayAmount = parseBrCurrency(display);
	let resolvedAmount = displayAmount ?? normalizeAmount(amount);

	const startingPrices = extractStartingPricesFromHtml(descriptionHtml);
	const normalizedPrefix = prefix?.trim().toLowerCase();

	if (startingPrices.length > 0 && normalizedPrefix === 'a partir de') {
		const minimumStartingPrice = Math.min(...startingPrices);

		if (
			displayAmount &&
			displayAmount !== minimumStartingPrice &&
			Number.isInteger(displayAmount / minimumStartingPrice) &&
			displayAmount / minimumStartingPrice === 10
		) {
			resolvedAmount = minimumStartingPrice;
		}
	}

	return {
		prefix: prefix || null,
		display: formatBrCurrency(resolvedAmount) || display || null,
		amount: resolvedAmount,
		currency: 'BRL',
	};
}
