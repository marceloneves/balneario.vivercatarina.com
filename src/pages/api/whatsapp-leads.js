import {
	appendWhatsAppLead,
	buildWhatsAppRedirectUrl,
	validateCampecheNewsletterLead,
	validateWhatsAppLead,
} from '../../lib/whatsapp-leads-store.mjs';

export const prerender = false;

export async function POST({ request }) {
	let body;

	try {
		body = await request.json();
	} catch {
		return new Response(JSON.stringify({ error: 'Dados inválidos.' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const isBlogHubNewsletter =
		body.source === 'blog-hub-campeche' || body.source === 'blog-hub-jurere-internacional';

	const validationError = isBlogHubNewsletter
		? validateCampecheNewsletterLead(body)
		: validateWhatsAppLead(body);

	if (validationError) {
		return new Response(JSON.stringify({ error: validationError }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	try {
		const entry = appendWhatsAppLead({
			name: body.name,
			phone: body.phone,
			email: body.email,
			source: body.source,
			pageUrl: body.pageUrl,
			propertySlug: body.propertySlug,
		});

		if (isBlogHubNewsletter) {
			return new Response(
				JSON.stringify({
					ok: true,
					id: entry.id,
				}),
				{
					status: 201,
					headers: { 'Content-Type': 'application/json' },
				},
			);
		}

		return new Response(
			JSON.stringify({
				ok: true,
				id: entry.id,
				redirectUrl: buildWhatsAppRedirectUrl(body.name, {
					propertyTitle: body.propertyTitle,
				}),
			}),
			{
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			},
		);
	} catch {
		return new Response(JSON.stringify({ error: 'Não foi possível registrar seu contato.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
