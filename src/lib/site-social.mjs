import { SITE_WHATSAPP_NUMBER } from './site-contact.mjs';

export const SITE_FACEBOOK_URL = 'https://www.facebook.com/vivercatarina';
export const SITE_INSTAGRAM_URL = 'https://www.instagram.com/vivercatarina';

// Redes sociais da barra superior, idênticas ao site de referência:
// Facebook, Instagram e WhatsApp (sem Twitter), ícones FontAwesome.
const HEADER_SOCIAL_HTML =
	`<a href="${SITE_FACEBOOK_URL}" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>` +
	`<a href="${SITE_INSTAGRAM_URL}" aria-label="Instagram"><i class="fab fa-instagram"></i></a>` +
	`<a href="https://wa.me/${SITE_WHATSAPP_NUMBER}" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>`;

// Substitui todo o conteúdo do .th-social dentro do header-top pelo set padrão.
// O primeiro </div> após o th-social é o fechamento do próprio th-social.
const HEADER_TOP_SOCIAL_PATTERN =
	/(<div class="header-top">[\s\S]*?<div class="th-social">)[\s\S]*?(<\/div>)/;

export function patchHeaderSocial(html) {
	if (!html || !html.includes('header-top')) {
		return html;
	}

	return html.replace(
		HEADER_TOP_SOCIAL_PATTERN,
		(match, start, end) => `${start}${HEADER_SOCIAL_HTML}${end}`,
	);
}
