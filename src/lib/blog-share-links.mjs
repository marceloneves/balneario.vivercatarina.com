import { SITE_URL } from './site-contact.mjs';

/** @param {string} articlePath ex.: `/blog/meu-artigo` */
export function buildArticleShareUrls(articlePath, title) {
	const path = articlePath.startsWith('/') ? articlePath : `/${articlePath}`;
	const url = `${SITE_URL}${path}`;
	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedMessage = encodeURIComponent(`${title} — ${url}`);

	return {
		facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
		whatsapp: `https://wa.me/?text=${encodedMessage}`,
		linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
		twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
	};
}

export function renderArticleShareLinksHtml(articlePath, title) {
	const urls = buildArticleShareUrls(articlePath, title);

	return `<div class="th-social">
                                            <a href="${urls.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
                                            <a href="${urls.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
                                            <a href="${urls.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no LinkedIn"><i class="fab fa-linkedin-in" aria-hidden="true"></i></a>
                                            <a href="${urls.twitter}" target="_blank" rel="noopener noreferrer" aria-label="Compartilhar no X"><i class="fab fa-twitter" aria-hidden="true"></i></a>
                                        </div><!-- End Social Share -->`;
}
