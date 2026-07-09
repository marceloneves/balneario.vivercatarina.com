import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	SITE_EMAIL,
	SITE_LOCATION,
	SITE_PHONE_DISPLAY,
	SITE_PHONE_TEL,
	SITE_WHATSAPP_NUMBER,
} from './site-contact.mjs';

const SOCIAL_LINKS = {
	facebook: 'https://www.facebook.com/vivercatarina',
	twitter: 'https://twitter.com/vivercatarina',
	instagram: 'https://www.instagram.com/vivercatarina',
	linkedin: 'https://www.linkedin.com/company/vivercatarina',
	whatsapp: `https://wa.me/${SITE_WHATSAPP_NUMBER}`,
};

function patchSocialLinks(html) {
	return html
		.replace(/href="https?:\/\/(?:www\.)?facebook\.com\/?"/g, `href="${SOCIAL_LINKS.facebook}"`)
		.replace(/href="https?:\/\/(?:www\.)?(?:twitter|x)\.com\/?"/g, `href="${SOCIAL_LINKS.twitter}"`)
		.replace(/href="https?:\/\/(?:www\.)?instagram\.com\/?"/g, `href="${SOCIAL_LINKS.instagram}"`)
		.replace(/href="https?:\/\/(?:www\.)?linkedin\.com\/?"/g, `href="${SOCIAL_LINKS.linkedin}"`)
		.replace(/href="https?:\/\/(?:www\.)?whatsapp\.com\/?"/g, `href="${SOCIAL_LINKS.whatsapp}"`);
}
import { patchGlossaryMenu } from './site-menu.mjs';
import { patchFooterNavMenus } from './footer-nav.mjs';

const dataRoot = join(process.cwd(), 'src/data');
const FOOTER_NEIGHBORHOODS_MARKER = 'footer-bairros-section';
const FOOTER_CITIES_TITLE = 'Cidades de Santa Catarina';

export const FOOTER_DISCLAIMER =
	'As informações e imagens divulgadas neste site são de caráter informativo e pertencem às respectivas incorporadoras. O atendimento é realizado por corretores credenciados e devidamente registrados no CRECI.';

export const FOOTER_COPYRIGHT_TEXT = '2025-2026 - Viver Catarina - Todos os direitos reservados';

const FOOTER_DISCLAIMER_HTML = `<p class="footer-disclaimer">${FOOTER_DISCLAIMER}</p>`;
const FOOTER_COPYRIGHT_TEXT_HTML =
	'<p class="copyright-text">2025-2026 - <a href="/">Viver Catarina</a> - Todos os direitos reservados</p>';
const FOOTER_COPYRIGHT_EMAIL_HTML = `<p class="copyright-email"><a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>`;

const FOOTER_CONTACT_COLUMN_HTML = `                                <div class="footer-item">
                                    <section class="widget footer-widget footer-contact-widget" aria-labelledby="footer-nav-contato">
                                        <h3 class="widget_title" id="footer-nav-contato">Contato</h3>
                                        <address class="footer-info-wrap">
                                            <div class="footer-info">
                                                <i class="fas fa-phone"></i>
                                                <p class="info-box_link"><a href="tel:${SITE_PHONE_TEL}">${SITE_PHONE_DISPLAY}</a></p>
                                            </div>
                                            <div class="footer-info">
                                                <i class="fas fa-envelope"></i>
                                                <p class="info-box_link"><a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>
                                            </div>
                                            <div class="footer-info">
                                                <i class="fas fa-location-dot"></i>
                                                <p class="info-box_link"><span>${SITE_LOCATION}</span></p>
                                            </div>
                                        </address>
                                    </section>
                                </div>`;

export { FOOTER_CONTACT_COLUMN_HTML };

const FOOTER_ABOUT_LOGO_HTML = `<div class="about-logo">
                                    <a href="/" aria-label="Viver Catarina Imóveis na Planta - página inicial"><img src="/assets/img/logo-white.svg" alt="Viver Catarina Imóveis na Planta" width="220" height="44"></a>
                                </div>`;

const FOOTER_SUPORTE_COLUMN_PATTERN =
	/(<div class="footer-item">\s*<nav class="widget widget_nav_menu footer-widget" aria-labelledby="footer-nav-suporte">[\s\S]*?<\/nav>\s*<\/div>)/;

const FOOTER_ABOUT_CLOSE_PATTERN =
	/<\/div>\s*<\/div>\s*<\/div>\s*<div class="footer-all-widget-item">/;

function stripContactFromAboutContent(content) {
	return content
		.replace(/\s*<address class="footer-info-wrap">[\s\S]*?<\/address>\s*/gi, '')
		.replace(/\s*<p class="footer-info">[\s\S]*?<\/p>\s*/gi, '')
		.replace(/\s*<div class="footer-info">[\s\S]*?<\/div>\s*/gi, '')
		.replace(/\s*<\/address>\s*/gi, '');
}

function removeAboutWidgetContactInfo(html) {
	if (!html.includes('<footer') || !html.includes('th-widget-about')) {
		return html;
	}

	const footerStart = html.indexOf('<footer');
	const footerEnd = html.indexOf('</footer>', footerStart);
	if (footerStart === -1 || footerEnd === -1) {
		return html;
	}

	const footer = html.slice(footerStart, footerEnd + '</footer>'.length);
	const aboutStart = footer.indexOf('<div class="th-widget-about">');
	if (aboutStart === -1) {
		return html;
	}

	const closeMatch = footer.slice(aboutStart).match(FOOTER_ABOUT_CLOSE_PATTERN);
	if (!closeMatch || closeMatch.index === undefined) {
		return html;
	}

	const aboutBlockStart = footerStart + aboutStart;
	const aboutBlockEnd = footerStart + aboutStart + closeMatch.index;
	const aboutContentStart = aboutBlockStart + '<div class="th-widget-about">'.length;
	const cleanedContent = stripContactFromAboutContent(html.slice(aboutContentStart, aboutBlockEnd));

	return `${html.slice(0, aboutContentStart)}${cleanedContent}${html.slice(aboutBlockEnd)}`;
}

function patchFooterAboutBranding(html) {
	if (!html.includes('<footer') || !html.includes('th-widget-about')) {
		return html;
	}

	let output = html.replace(
		/(<div class="footer-all-widget-item">\s*<div class="widget footer-widget">\s*)<h3 class="widget_title">Viver Catarina<\/h3>\s*(?=<div class="th-widget-about">)/,
		'$1',
	);

	const footerStart = output.indexOf('<footer');
	const footerEnd = output.indexOf('</footer>', footerStart);
	if (footerStart === -1 || footerEnd === -1) {
		return output;
	}

	const footer = output.slice(footerStart, footerEnd + '</footer>'.length);
	const aboutStart = footer.indexOf('<div class="th-widget-about">');
	if (aboutStart === -1) {
		return output;
	}

	const closeMatch = footer.slice(aboutStart).match(FOOTER_ABOUT_CLOSE_PATTERN);
	if (!closeMatch || closeMatch.index === undefined) {
		return output;
	}

	const aboutBlockStart = footerStart + aboutStart;
	const aboutBlockEnd = footerStart + aboutStart + closeMatch.index;
	const aboutContentStart = aboutBlockStart + '<div class="th-widget-about">'.length;
	let aboutContent = output.slice(aboutContentStart, aboutBlockEnd);

	aboutContent = aboutContent.replace(
		/(<p class="about-text">[\s\S]*?<\/p>)\s*<div class="about-logo">[\s\S]*?<\/div>\s*/i,
		'$1\n                                ',
	);

	const hasLogoBeforeText = /<div class="about-logo">[\s\S]*?<\/div>\s*<p class="about-text">/.test(
		aboutContent,
	);

	if (hasLogoBeforeText) {
		aboutContent = aboutContent.replace(
			/<div class="about-logo">[\s\S]*?<\/div>\s*(?=<p class="about-text">)/,
			`${FOOTER_ABOUT_LOGO_HTML}\n                                `,
		);
	} else {
		aboutContent = aboutContent.replace(
			/(<p class="about-text">)/,
			`${FOOTER_ABOUT_LOGO_HTML}\n                                $1`,
		);
	}

	return `${output.slice(0, aboutContentStart)}${aboutContent}${output.slice(aboutBlockEnd)}`;
}

function injectFooterContactColumn(html) {
	if (html.includes('footer-nav-contato') || !html.includes('footer-nav-suporte')) {
		return html;
	}

	return html.replace(FOOTER_SUPORTE_COLUMN_PATTERN, `$1\n${FOOTER_CONTACT_COLUMN_HTML}`);
}

function hasFooterContactColumn(html) {
	return html.includes('footer-nav-contato') || html.includes('footer-contact-widget');
}

function buildFooterCopyrightRow(socialContent) {
	return `                <div class="row gy-3 justify-content-lg-between justify-content-center align-items-center footer-copyright-row">
                    <div class="col-auto footer-copyright-email">
                        ${FOOTER_COPYRIGHT_EMAIL_HTML}
                    </div>
                    <div class="col-lg-7 footer-copyright-center">
                        ${FOOTER_COPYRIGHT_TEXT_HTML}
                    </div>
                    <div class="col-auto footer-copyright-social">
${socialContent}                    </div>
                </div>`;
}

function patchCopyrightText(html) {
	if (html.includes('footer-copyright-email')) {
		return html
			.replace(/<p class="copyright-text">[\s\S]*?<\/p>/, FOOTER_COPYRIGHT_TEXT_HTML)
			.replace(/<p class="copyright-email">[\s\S]*?<\/p>/, FOOTER_COPYRIGHT_EMAIL_HTML);
	}

	return html.replace(
		/<div class="row gy-3 justify-content-lg-between justify-content-center align-items-center">\s*<div class="col-lg-7">\s*<p class="copyright-text">[\s\S]*?<\/p>\s*<\/div>\s*<div class="col-auto">([\s\S]*?)<\/div>\s*<\/div>/,
		buildFooterCopyrightRow('$1'),
	);
}

export function buildFooterNeighborhoodsSectionHtml() {
	const neighborhoods = JSON.parse(
		readFileSync(join(dataRoot, 'balneario-camboriu-neighborhoods.json'), 'utf8'),
	);
	const regions = JSON.parse(
		readFileSync(join(dataRoot, 'footer-neighborhoods-by-region.json'), 'utf8'),
	);
	const neighborhoodBySlug = new Map(neighborhoods.map((neighborhood) => [neighborhood.slug, neighborhood]));

	const regionsHtml = regions
		.map(({ region, slugs }) => {
			const items = slugs
				.map((slug) => neighborhoodBySlug.get(slug))
				.filter(Boolean)
				.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
				.map(
					({ slug, name }) =>
						`<li><a href="/bairro/${slug}">${name}</a></li>`,
				)
				.join('\n                                ');

			return `                        <div class="footer-bairros-region">
                            <h4 class="footer-bairros-region-title">${region}</h4>
                            <ul class="footer-bairros-list">
                                ${items}
                            </ul>
                        </div>`;
		})
		.join('\n');

	return `        <section class="footer-bairros-section" aria-label="Bairros de Balneário Camboriú">
            <div class="container">
                <div class="footer-bairros-wrap">
                    <h3 class="widget_title">Bairros de Balneário Camboriú</h3>
                    <div class="footer-bairros-regions">
${regionsHtml}
                    </div>
                </div>
            </div>
        </section>
`;
}

// Subdomínio de cada cidade no padrão <slug>.vivercatarina.com.
// "balneario" (Balneário Camboriú) confirmado pelo usuário; demais são
// palpites e devem ser revisados conforme os sites realmente publicados.
const CITY_SUBDOMAINS = {
	'Balneário Camboriú': 'balneario-camboriu',
	'São José': 'saojose',
	'Palhoça': 'palhoca',
	'Biguaçu': 'biguacu',
	'Tijucas': 'tijucas',
	'Joinville': 'joinville',
	'Jaraguá do Sul': 'jaraguadosul',
	'Barra Velha': 'barravelha',
	'Penha': 'penha',
	'Balneário Piçarras': 'picarras',
	'Balneário Camboriú': 'balneario',
	'Itajaí': 'itajai',
	'Blumenau': 'blumenau',
	'Brusque': 'brusque',
	'Camboriú': 'camboriu',
	'Itapema': 'itapema',
	'Navegantes': 'navegantes',
	'Balneário Camboriú': 'balneario',
	'Bombinhas': 'bombinhas',
	'Criciúma': 'criciuma',
	'Tubarão': 'tubarao',
	'Imbituba': 'imbituba',
	'Chapecó': 'chapeco',
};

function cityHref(name) {
	const slug = CITY_SUBDOMAINS[name];
	return slug ? `https://${slug}.vivercatarina.com` : null;
}

const FOOTER_CITIES_BY_REGION = [
	{ region: 'Grande Balneário Camboriú', cities: ['Balneário Camboriú', 'São José', 'Palhoça', 'Biguaçu', 'Tijucas'] },
	{ region: 'Norte Catarinense', cities: ['Joinville', 'Jaraguá do Sul', 'Barra Velha', 'Penha', 'Balneário Piçarras'] },
	{ region: 'Vale do Itajaí e Litoral', cities: ['Balneário Camboriú', 'Itajaí', 'Blumenau', 'Brusque', 'Camboriú', 'Itapema', 'Navegantes', 'Balneário Camboriú', 'Bombinhas'] },
	{ region: 'Sul Catarinense', cities: ['Criciúma', 'Tubarão', 'Imbituba'] },
	{ region: 'Oeste Catarinense', cities: ['Chapecó'] },
];

// Mega-menu "Outras cidades" para o cabeçalho (mesma rede de cidades do rodapé).
// Estrutura de submenus alinhada ao tema Piller (menu-item-has-children + sub-menu).
export function buildHeaderCitiesMenuHtml() {
	const regionsHtml = FOOTER_CITIES_BY_REGION.map(({ region, cities }) => {
		const items = cities
			.map((name) => {
				const href = cityHref(name);
				return href
					? `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${name}</a></li>`
					: `<li><a href="#">${name}</a></li>`;
			})
			.join('');

		return `<li class="menu-item-has-children"><a href="#">${region}</a><ul class="sub-menu">${items}</ul></li>`;
	}).join('');

	return `<li class="menu-item-has-children"><a href="#">Outras cidades</a><ul class="sub-menu">${regionsHtml}</ul></li>`;
}

export function buildFooterCitiesSectionHtml() {
	const regionsHtml = FOOTER_CITIES_BY_REGION.map(({ region, cities }) => {
		const items = cities
			.map((name) => {
				const href = cityHref(name);
				return href
					? `<li><a href="${href}" target="_blank" rel="noopener">${name}</a></li>`
					: `<li>${name}</li>`;
			})
			.join('\n                                ');

		return `                        <div class="footer-cities-region">
                            <h4 class="footer-cities-region-title">${region}</h4>
                            <ul class="footer-cities-list">
                                ${items}
                            </ul>
                        </div>`;
	}).join('\n');

	return `        <section class="footer-cities-section" aria-label="${FOOTER_CITIES_TITLE}">
            <div class="container">
                <div class="footer-cities-wrap">
                    <h3 class="widget_title">${FOOTER_CITIES_TITLE}</h3>
                    <div class="footer-cities-regions">
${regionsHtml}
                    </div>
                </div>
            </div>
        </section>
`;
}

function removeFooterNeighborhoodsSection(html) {
	return html
		.replace(
			/<section class="footer-cities-section footer-neighborhoods-section"[\s\S]*?<\/section>\s*/g,
			'',
		)
		.replace(
			/<section class="footer-bairros-section footer-bairros-section"[\s\S]*?<\/section>\s*/g,
			'',
		)
		.replace(
			/<section class="footer-bairros-section[\s\S]*?<\/section>\s*/g,
			'',
		);
}

function patchFooterCitiesTitle(html) {
	return html.replace(
		/(<(?:section|div) class="footer-cities-section"[\s\S]*?<div class="footer-cities-wrap">\s*)<h3 class="widget_title">Cidades(?: em Santa Catarina)?<\/h3>/,
		`$1<h3 class="widget_title">${FOOTER_CITIES_TITLE}</h3>`,
	);
}

function patchFooterNeighborhoodsSection(html) {
	const section = buildFooterNeighborhoodsSectionHtml();
	let output = removeFooterNeighborhoodsSection(html);

	const citiesSectionStart = output.search(
		/<(?:section|div) class="footer-cities-section"(?: aria-label="Cidades atendidas")?>/,
	);

	if (citiesSectionStart !== -1) {
		return `${output.slice(0, citiesSectionStart)}${section}${output.slice(citiesSectionStart)}`;
	}

	if (output.includes('<div class="copyright-wrap">')) {
		return output.replace('<div class="copyright-wrap">', `${section}        <div class="copyright-wrap">`);
	}

	return output;
}

function unwrapFooterCitiesContainer(html) {
	return html.replace(
		/(<section class="footer-cities-section"[^>]*>)\s*<div class="container">\s*([\s\S]*?)<\/div>\s*<\/section>/,
		'$1\n$2\n        </section>',
	);
}

// Rodapé completo no padrão do site de origem (footer-default), com os dados
// do Balneário Camboriú: bairros, cidades, contato e localização. Substitui por inteiro
// o <footer> que vem do template do tema.
export function buildSiteFooterHtml() {
	const bairrosSectionHtml = buildFooterNeighborhoodsSectionHtml();
	const citiesSectionHtml = buildFooterCitiesSectionHtml();

	return `<footer class="footer-wrapper footer-default">
	<div class="widget-area">
		<div class="container">
			<div class="footer-all-widget-wrapper">
				<div class="footer-all-widget-item">
					<div class="widget footer-widget">
						<div class="th-widget-about">
							<div class="about-logo">
								<a href="/" aria-label="Viver Catarina Imóveis na Planta - página inicial"><img src="/assets/img/logo-white.svg" alt="Viver Catarina Imóveis na Planta" title="Viver Catarina Imóveis na Planta" width="220" height="44" /></a>
							</div>
							<p class="about-text">O maior portal de lançamentos imobiliários de Santa Catarina. Encontre apartamentos na planta, pré-lançamentos e imóveis prontos para morar nas 23 maiores cidades catarinenses. De Joinville a Criciúma, de Balneário Camboriú a Chapecó — cobrimos cada lançamento, cada bairro, cada oportunidade do mercado imobiliário de SC. Aqui você compara, pesquisa e encontra o imóvel novo ideal com informações completas, atualizadas e direto das construtoras.</p>
						</div>
					</div>
				</div>
				<div class="footer-all-widget-item">
					<div class="footer-right-wrap">
						<div class="footer-item-wrap">
							<div class="footer-item">
								<nav class="widget widget_nav_menu footer-widget" aria-labelledby="footer-nav-institucional">
									<h3 class="widget_title" id="footer-nav-institucional">Institucional</h3>
									<div class="menu-all-pages-container">
										<ul class="menu">
											<li><a href="/">Início</a></li>
											<li><a href="/quem-somos">Quem Somos</a></li>
											<li><a href="/bairros">Bairros</a></li>
											<li><a href="/blog" rel="bookmark">Blog</a></li>
											<li><a href="/contact">Contato</a></li>
											<li><a href="/sitemap-index.xml">Mapa do Site</a></li>
										</ul>
									</div>
								</nav>
							</div>
							<div class="footer-item">
								<nav class="widget widget_nav_menu footer-widget" aria-labelledby="footer-nav-legal">
									<h3 class="widget_title" id="footer-nav-legal">Legal e Transparência</h3>
									<div class="menu-all-pages-container">
										<ul class="menu">
											<li><a href="/privacidade">Política de Privacidade</a></li>
											<li><a href="/termos-de-uso">Termos de Uso</a></li>
											<li><a href="/politica-de-cookies">Política de Cookies</a></li>
										</ul>
									</div>
								</nav>
							</div>
							<div class="footer-item">
								<section class="widget footer-widget footer-contact-widget" aria-labelledby="footer-nav-contato">
									<h3 class="widget_title" id="footer-nav-contato">Contato</h3>
									<address class="footer-info-wrap">
										<div class="footer-info">
											<i class="fab fa-whatsapp"></i>
											<p class="info-box_link"><a href="tel:${SITE_PHONE_TEL}">${SITE_PHONE_DISPLAY}</a></p>
										</div>
										<div class="footer-info">
											<i class="fas fa-envelope"></i>
											<p class="info-box_link"><a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>
										</div>
										<div class="footer-info">
											<i class="fas fa-location-dot"></i>
											<p class="info-box_link"><span>${SITE_LOCATION}</span></p>
										</div>
									</address>
								</section>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

${bairrosSectionHtml}
${citiesSectionHtml}

	<div class="copyright-wrap">
		<div class="footer-bottom-top-shape animation-infinite" data-bg-src="/assets/img/icon/footer-bottom-top-shape.webp"></div>
		<div class="container">
			<p class="footer-disclaimer">As informações e imagens divulgadas neste site são de caráter informativo e pertencem às respectivas incorporadoras. O atendimento é realizado por corretores credenciados e devidamente registrados no CRECI. Viver Catarina é um portal de propriedade da PMTurbo Tecnologia Ltda. ME — CNPJ 54.008.386/0001-07.</p>
			<div class="row gy-3 justify-content-lg-between justify-content-center align-items-center footer-copyright-row">
				<div class="col-auto footer-copyright-email">
					<p class="copyright-email"><a href="mailto:${SITE_EMAIL}">${SITE_EMAIL}</a></p>
				</div>
				<div class="col-lg-7 footer-copyright-center">
					<p class="copyright-text">2025-2026 - <a href="/">Viver Catarina</a> - Todos os direitos reservados</p>
				</div>
				<div class="col-auto footer-copyright-social">
					<div class="footer-default-copy-right">
						<div class="th-social">
							<a href="https://www.facebook.com/vivercatarina" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
							<a href="https://www.instagram.com/vivercatarina" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
							<a href="https://wa.me/${SITE_WHATSAPP_NUMBER}" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</footer>`;
}

export function patchSiteFooter(html) {
	if (!html || !html.includes('footer-wrapper')) {
		return html;
	}

	// Substitui por inteiro o rodapé do template pelo rodapé padrão (footer-default),
	// já com bairros e cidades do Balneário Camboriú.
	return html.replace(
		/<footer class="footer-wrapper[^"]*">[\s\S]*?<\/footer>/,
		() => buildSiteFooterHtml(),
	);
}
