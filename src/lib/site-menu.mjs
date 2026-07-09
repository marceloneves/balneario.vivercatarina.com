import { patchHeaderSocial } from './site-social.mjs';
import { buildHeaderCitiesMenuHtml } from './site-footer.mjs';

// Insere o mega-menu "Outras cidades" antes do item "Blog" (mobile e desktop).
// IMPORTANTE: só dentro dos navs do cabeçalho (main-menu / th-mobile-menu),
// NUNCA no breadcrumb (breadcumb-menu também tem um item "Blog"). Idempotente.
const HEADER_NAV_PATTERN = /(<nav class="(?:main-menu|th-mobile-menu)[^>]*>[\s\S]*?<\/nav>)/g;
const BLOG_ANCHOR_PATTERN = /(<li[^>]*><a href="\/blog"[^>]*>Blog<\/a><\/li>)/;

export function patchOutrasCidadesMenu(html) {
	if (!html || html.includes('>Outras cidades<') || !html.includes('href="/blog"')) {
		return html;
	}

	const menu = buildHeaderCitiesMenuHtml();
	return html.replace(HEADER_NAV_PATTERN, (navBlock) =>
		navBlock.replace(BLOG_ANCHOR_PATTERN, `${menu}$1`),
	);
}

const BAIRROS_SUBMENU_PATTERN =
	/<li class="menu-item-has-children(?: active)?">\s*<a href="\/bairros">Bairros<\/a>\s*<ul class="sub-menu">[\s\S]*?<\/ul>\s*<\/li>/g;

const LOTEAMENTO_MENU_ITEM =
	'<li><a href="/lancamentos/loteamento">Loteamento</a></li>';

const CASAS_MENU_PATTERN =
	/(<li><a href="\/lancamentos\/casas-em-condominio">Casas em condomínio<\/a><\/li>)(\s*)/g;

const GLOSSARY_MENU_PATTERN =
	/(<li(?:\s+class="active")?><a href="\/blog">Blog<\/a><\/li>)(\s*)(<li(?:\s+class="active")?><a href="\/contact">Contato<\/a><\/li>)/g;

const HEADER_ADD_LISTING_PATTERN =
	/<a href="\/contact" class="th-btn[^"]*"><i class="fa-regular fa-house-chimney me-2"><\/i>\s*(?:Add Listing|Anunciar imóvel)\s*<\/a>\s*/gi;

export function removeHeaderAddListingButton(html) {
	if (!html || !html.includes('house-chimney')) {
		return html;
	}

	return html.replace(HEADER_ADD_LISTING_PATTERN, '');
}

function isGlossaryPathActive(currentPath) {
	return currentPath === '/glossario' || currentPath.startsWith('/glossario/');
}

function isBairrosPathActive(currentPath) {
	return (
		currentPath === '/bairros' ||
		currentPath.startsWith('/bairros/') ||
		currentPath.startsWith('/bairro/')
	);
}

function isBlogPathActive(currentPath) {
	const path = String(currentPath || '/').split('?')[0].replace(/\/$/, '') || '/';
	return path === '/blog' || path.startsWith('/blog/');
}

const BLOG_MENU_PATTERN = /<li(?:\s+class="active")?><a href="\/blog">Blog<\/a><\/li>/g;

export function patchBlogMenu(html, currentPath = '/') {
	if (!html || !html.includes('href="/blog">Blog</a>')) {
		return html;
	}

	const activeClass = isBlogPathActive(currentPath) ? ' class="active"' : '';

	return html.replace(
		BLOG_MENU_PATTERN,
		`<li${activeClass}><a href="/blog" data-nav-blog rel="bookmark">Blog</a></li>`,
	);
}

function isBlogListingPath(currentPath) {
	const path = String(currentPath || '/').split('?')[0].replace(/\/$/, '') || '/';
	return path === '/blog';
}

export function patchBairrosMenu(html, currentPath = '/') {
	if (!html || !html.includes('href="/bairros">Bairros</a>')) {
		return html;
	}

	const activeClass = isBairrosPathActive(currentPath) ? ' class="active"' : '';
	const item = `<li${activeClass}><a href="/bairros">Bairros</a></li>`;

	return html.replace(BAIRROS_SUBMENU_PATTERN, item);
}

const LANCAMENTOS_MAIN_LINK_PATTERN = /<a href="\/lancamentos">Lançamentos<\/a>/g;

export function patchLancamentosMainLink(html) {
	if (!html || !html.includes('href="/lancamentos">Lançamentos</a>')) {
		return html;
	}

	return html.replace(
		LANCAMENTOS_MAIN_LINK_PATTERN,
		'<a href="/lancamentos/apartamentos">Lançamentos</a>',
	);
}

export function patchLancamentosSubmenu(html) {
	let output = patchLancamentosMainLink(html);

	if (!output.includes('/lancamentos/loteamento')) {
		output = output.replace(CASAS_MENU_PATTERN, `$1$2${LOTEAMENTO_MENU_ITEM}$2`);
	}

	return output;
}

export function patchGlossaryMenu(html, currentPath = '/') {
	if (html.includes('href="/glossario"')) {
		return html;
	}

	const activeClass = isGlossaryPathActive(currentPath) ? ' class="active"' : '';
	const item = `<li${activeClass}><a href="/glossario">Glossário</a></li>`;

	return html.replace(GLOSSARY_MENU_PATTERN, `$1$2${item}$2$3`);
}

function isHomePath(currentPath) {
	const path = String(currentPath || '/').split('?')[0];
	return path === '/' || path === '/index.html';
}

export function patchListingHeaderBranding(html) {
	if (!html || !html.includes('header-logo')) {
		return html;
	}

	return html.replace(
		/(<div class="header-logo">\s*<a href="\/"[^>]*><img src=")\/assets\/img\/logo\.svg"/,
		'$1/assets/img/logo-white.svg"',
	);
}

export function patchSiteMenu(html, currentPath = '/') {
	let output = patchOutrasCidadesMenu(
		patchHeaderSocial(
			patchGlossaryMenu(
				patchLancamentosSubmenu(
					patchBlogMenu(patchBairrosMenu(removeHeaderAddListingButton(html), currentPath), currentPath),
					currentPath,
				),
				currentPath,
			),
		),
	);

	if (!isHomePath(currentPath) && !isBlogListingPath(currentPath)) {
		output = patchListingHeaderBranding(output);
	}

	return output;
}
