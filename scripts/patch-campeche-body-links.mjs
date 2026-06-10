/**
 * Envolve trechos existentes com <a> (sem alterar palavras).
 * Uso: node scripts/patch-campeche-body-links.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** @type {{ file: string, from: string, to: string }[]} */
const PATCHES = [
	// Pilar — headings e trechos sem linkify automático
	{
		file: 'morar-no-campeche-guia-completo.html',
		from: '<h4 class="blog-subsection-title">Casas à venda: o segmento das sub-regiões residenciais</h4>',
		to: '<h4 class="blog-subsection-title"><a href="/blog/casas-a-venda-campeche-sub-regioes">Casas à venda</a>: o segmento das sub-regiões residenciais</h4>',
	},
	{
		file: 'morar-no-campeche-guia-completo.html',
		from: '<h4 class="blog-subsection-title">Vale a pena investir em imóvel no Campeche</h4>',
		to: '<h4 class="blog-subsection-title"><a href="/blog/investir-imovel-campeche-roi-valorizacao">Vale a pena investir em imóvel no Campeche</a></h4>',
	},
    {
		file: 'morar-no-campeche-guia-completo.html',
		from: 'consulte o guia de Preço do m² no Campeche.',
		to: 'consulte o guia de <a href="/blog/preco-m2-campeche-quanto-custa-comprar">Preço do m² no Campeche</a>.',
	},
	// preco-m2
	{
		file: 'preco-m2-campeche-quanto-custa-comprar.html',
		from: '<h4 class="blog-subsection-title">Possibilidade de financiamento</h4>',
		to: '<h4 class="blog-subsection-title"><a href="/blog/como-comprar-imovel-campeche-financiamento">Possibilidade de financiamento</a></h4>',
	},
	{
		file: 'preco-m2-campeche-quanto-custa-comprar.html',
		from: '<h4 class="blog-subsection-title">Apartamentos de 1 dormitório (R$ 35 a 55 m²)</h4>',
		to: '<h4 class="blog-subsection-title"><a href="/blog/apartamentos-a-venda-campeche-faixas-preco">Apartamentos de 1 dormitório</a> (R$ 35 a 55 m²)</h4>',
	},
	// apartamentos
	{
		file: 'apartamentos-a-venda-campeche-faixas-preco.html',
		from: 'preço do metro quadrado',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">preço do metro quadrado</a>',
	},
	{
		file: 'apartamentos-a-venda-campeche-faixas-preco.html',
		from: 'investir em renda com locação',
		to: '<a href="/blog/investir-imovel-campeche-roi-valorizacao">investir em renda</a> com locação',
	},
	// casas
	{
		file: 'casas-a-venda-campeche-sub-regioes.html',
		from: 'apartamentos compactos',
		to: '<a href="/blog/apartamentos-a-venda-campeche-faixas-preco">apartamentos compactos</a>',
	},
	{
		file: 'casas-a-venda-campeche-sub-regioes.html',
		from: 'financiamento bancário',
		to: '<a href="/blog/como-comprar-imovel-campeche-financiamento">financiamento bancário</a>',
	},
	// aluguel
	{
		file: 'aluguel-campeche-valores-temporada.html',
		from: 'investir em renda',
		to: '<a href="/blog/investir-imovel-campeche-roi-valorizacao">investir em renda</a>',
	},
	{
		file: 'aluguel-campeche-valores-temporada.html',
		from: 'alta temporada',
		to: '<a href="/blog/inverno-verao-campeche-sazonalidade">alta temporada</a>',
	},
	// investir
	{
		file: 'investir-imovel-campeche-roi-valorizacao.html',
		from: 'aluguel de temporada',
		to: '<a href="/blog/aluguel-campeche-valores-temporada">aluguel de temporada</a>',
	},
	{
		file: 'investir-imovel-campeche-roi-valorizacao.html',
		from: 'financiamento',
		to: '<a href="/blog/como-comprar-imovel-campeche-financiamento">financiamento</a>',
	},
	// como-comprar
	{
		file: 'como-comprar-imovel-campeche-financiamento.html',
		from: 'parte das casas do bairro',
		to: 'parte das <a href="/blog/casas-a-venda-campeche-sub-regioes">casas do bairro</a>',
	},
	{
		file: 'como-comprar-imovel-campeche-financiamento.html',
		from: 'renda com locação',
		to: '<a href="/blog/investir-imovel-campeche-roi-valorizacao">renda com locação</a>',
	},
	// expansao
	{
		file: 'campeche-em-expansao-valorizacao.html',
		from: 'investir no Campeche',
		to: '<a href="/blog/investir-imovel-campeche-roi-valorizacao">investir no Campeche</a>',
	},
	// bom-morar
	{
		file: 'campeche-e-bom-para-morar.html',
		from: '<h3 class="blog-inner-title h4">Campeche x outros bairros do sul de Balneário Camboriú</h3>',
		to: '<h3 class="blog-inner-title h4"><a href="/blog/campeche-x-bairros-sul-comparativo">Campeche x outros bairros do sul de Balneário Camboriú</a></h3>',
	},
	// sub-regioes
	{
		file: 'sub-regioes-campeche-guia-completo.html',
		from: 'casas em condomínios',
		to: '<a href="/blog/casas-a-venda-campeche-sub-regioes">casas em condomínios</a>',
	},
	{
		file: 'sub-regioes-campeche-guia-completo.html',
		from: 'apartamentos na planta',
		to: '<a href="/blog/apartamentos-a-venda-campeche-faixas-preco">apartamentos na planta</a>',
	},
	{
		file: 'sub-regioes-campeche-guia-completo.html',
		from: 'Segurança no Campeche',
		to: '<a href="/blog/seguranca-campeche-como-e-morar">Segurança no Campeche</a>',
	},
	// comparativo
	{
		file: 'campeche-x-bairros-sul-comparativo.html',
		from: 'Campeche é bom para morar',
		to: '<a href="/blog/campeche-e-bom-para-morar">Campeche é bom para morar</a>',
	},
	{
		file: 'campeche-x-bairros-sul-comparativo.html',
		from: 'sub-regiões do Campeche',
		to: '<a href="/blog/sub-regioes-campeche-guia-completo">sub-regiões do Campeche</a>',
	},
	// infra
	{
		file: 'infraestrutura-campeche-comercio-mobilidade.html',
		from: 'custo de vida no Campeche',
		to: '<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">custo de vida no Campeche</a>',
	},
	{
		file: 'infraestrutura-campeche-comercio-mobilidade.html',
		from: 'Campeche é bom para morar',
		to: '<a href="/blog/campeche-e-bom-para-morar">Campeche é bom para morar</a>',
	},
	// seguranca
	{
		file: 'seguranca-campeche-como-e-morar.html',
		from: 'sub-regiões do Campeche',
		to: '<a href="/blog/sub-regioes-campeche-guia-completo">sub-regiões do Campeche</a>',
	},
	{
		file: 'seguranca-campeche-como-e-morar.html',
		from: 'casas em condomínios fechados',
		to: '<a href="/blog/casas-a-venda-campeche-sub-regioes">casas em condomínios fechados</a>',
	},
	// praias
	{
		file: 'praias-do-campeche-guia-completo.html',
		from: 'Campeche é bom para morar',
		to: '<a href="/blog/campeche-e-bom-para-morar">Campeche é bom para morar</a>',
	},
	// escolas
	{
		file: 'escolas-creches-campeche.html',
		from: 'custo de vida no Campeche',
		to: '<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">custo de vida no Campeche</a>',
	},
	{
		file: 'escolas-creches-campeche.html',
		from: 'saúde no Campeche',
		to: '<a href="/blog/saude-campeche-postos-hospitais-clinicas">saúde no Campeche</a>',
	},
	// saude
	{
		file: 'saude-campeche-postos-hospitais-clinicas.html',
		from: 'escolas e creches no Campeche',
		to: '<a href="/blog/escolas-creches-campeche">escolas e creches no Campeche</a>',
	},
	{
		file: 'saude-campeche-postos-hospitais-clinicas.html',
		from: 'custo de vida no Campeche',
		to: '<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">custo de vida no Campeche</a>',
	},
	// custo
	{
		file: 'custo-de-vida-campeche-quanto-custa-morar.html',
		from: 'escolas e creches',
		to: '<a href="/blog/escolas-creches-campeche">escolas e creches</a>',
	},
	// inverno
	// apartamentos (lote 2)
	{
		file: 'apartamentos-a-venda-campeche-faixas-preco.html',
		from: 'O metro quadrado na planta',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">O metro quadrado na planta</a>',
	},
	{
		file: 'apartamentos-a-venda-campeche-faixas-preco.html',
		from: '<h3 class="blog-inner-title h4">Faixa de R$ 270 a 500 mil: studios e compactos para investir</h3>',
		to: '<h3 class="blog-inner-title h4">Faixa de R$ 270 a 500 mil: studios e compactos para <a href="/blog/investir-imovel-campeche-roi-valorizacao">investir</a></h3>',
	},
	// casas (lote 2)
	{
		file: 'casas-a-venda-campeche-sub-regioes.html',
		from: 'diferente de comprar apartamento',
		to: 'diferente de <a href="/blog/apartamentos-a-venda-campeche-faixas-preco">comprar apartamento</a>',
	},
	{
		file: 'casas-a-venda-campeche-sub-regioes.html',
		from: 'O preço varia muito conforme tamanho',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">O preço varia muito conforme tamanho</a>',
	},
	// aluguel (lote 2)
	{
		file: 'aluguel-campeche-valores-temporada.html',
		from: 'Apartamentos de 2 quartos',
		to: '<a href="/blog/apartamentos-a-venda-campeche-faixas-preco">Apartamentos de 2 quartos</a>',
	},
	// investir (lote 2)
	{
		file: 'investir-imovel-campeche-roi-valorizacao.html',
		from: 'a <strong>renda de temporada</strong>',
		to: 'a <strong><a href="/blog/aluguel-campeche-valores-temporada">renda de temporada</a></strong>',
	},
	{
		file: 'investir-imovel-campeche-roi-valorizacao.html',
		from: 'valorização do metro quadrado',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">valorização do metro quadrado</a>',
	},
	{
		file: 'investir-imovel-campeche-roi-valorizacao.html',
		from: 'alta temporada',
		to: '<a href="/blog/inverno-verao-campeche-sazonalidade">alta temporada</a>',
	},
	// como-comprar (lote 2)
	{
		file: 'como-comprar-imovel-campeche-financiamento.html',
		from: 'valor do imóvel',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">valor do imóvel</a>',
	},
	{
		file: 'como-comprar-imovel-campeche-financiamento.html',
		from: 'tipo de imóvel',
		to: '<a href="/blog/apartamentos-a-venda-campeche-faixas-preco">tipo de imóvel</a>',
	},
	{
		file: 'como-comprar-imovel-campeche-financiamento.html',
		from: 'comprovação de renda',
		to: '<a href="/blog/investir-imovel-campeche-roi-valorizacao">comprovação de renda</a>',
	},
	// expansao (lote 2)
	{
		file: 'campeche-em-expansao-valorizacao.html',
		from: 'infraestrutura urbana completa',
		to: '<a href="/blog/infraestrutura-campeche-comercio-mobilidade">infraestrutura urbana completa</a>',
	},
	{
		file: 'campeche-em-expansao-valorizacao.html',
		from: '<th scope="col">Preço do m²</th>',
		to: '<th scope="col"><a href="/blog/preco-m2-campeche-quanto-custa-comprar">Preço do m²</a></th>',
	},
	// bom-morar (lote 2)
	{
		file: 'campeche-e-bom-para-morar.html',
		from: 'custo de vida em alta',
		to: '<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">custo de vida em alta</a>',
	},
	{
		file: 'campeche-e-bom-para-morar.html',
		from: '<h4 class="blog-subsection-title">Segurança e clima de comunidade</h4>',
		to: '<h4 class="blog-subsection-title"><a href="/blog/seguranca-campeche-como-e-morar">Segurança</a> e clima de comunidade</h4>',
	},
	// sub-regioes (lote 2)
	{
		file: 'sub-regioes-campeche-guia-completo.html',
		from: 'lançamentos compactos para temporada',
		to: '<a href="/blog/apartamentos-a-venda-campeche-faixas-preco">lançamentos compactos para temporada</a>',
	},
	// comparativo (lote 2)
	{
		file: 'campeche-x-bairros-sul-comparativo.html',
		from: 'O Campeche é o bairro mais completo',
		to: '<a href="/blog/campeche-e-bom-para-morar">O Campeche é o bairro mais completo</a>',
	},
	{
		file: 'campeche-x-bairros-sul-comparativo.html',
		from: 'preço por metro quadrado',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">preço por metro quadrado</a>',
	},
	// infra (lote 2)
	{
		file: 'infraestrutura-campeche-comercio-mobilidade.html',
		from: 'alta temporada',
		to: '<a href="/blog/inverno-verao-campeche-sazonalidade">alta temporada</a>',
	},
	{
		file: 'infraestrutura-campeche-comercio-mobilidade.html',
		from: 'crescimento do comércio',
		to: '<a href="/blog/campeche-em-expansao-valorizacao">crescimento do comércio</a>',
	},
	{
		file: 'infraestrutura-campeche-comercio-mobilidade.html',
		from: 'qualidade de vida',
		to: '<a href="/blog/campeche-e-bom-para-morar">qualidade de vida</a>',
	},
	// seguranca (lote 2)
	{
		file: 'seguranca-campeche-como-e-morar.html',
		from: 'conforme a sub-região',
		to: 'conforme a <a href="/blog/sub-regioes-campeche-guia-completo">sub-região</a>',
	},
	// escolas (lote 2)
	{
		file: 'escolas-creches-campeche.html',
		from: 'custo baixo',
		to: '<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">custo baixo</a>',
	},
	{
		file: 'escolas-creches-campeche.html',
		from: 'famílias para o bairro',
		to: '<a href="/blog/campeche-e-bom-para-morar">famílias para o bairro</a>',
	},
	{
		file: 'escolas-creches-campeche.html',
		from: 'Visite a <strong>infraestrutura</strong> e converse com outras famílias',
		to: 'Visite a <strong><a href="/blog/saude-campeche-postos-hospitais-clinicas">infraestrutura</a></strong> e converse com outras famílias',
	},
	// saude (lote 2) — sem trecho linkável para escolas/custo/pilar no corpo
	// custo (lote 2)
	{
		file: 'custo-de-vida-campeche-quanto-custa-morar.html',
		from: 'metro quadrado entre os mais caros',
		to: '<a href="/blog/preco-m2-campeche-quanto-custa-comprar">metro quadrado entre os mais caros</a>',
	},
	// inverno (lote 2)
	{
		file: 'inverno-verao-campeche-sazonalidade.html',
		from: 'renda de temporada',
		to: '<a href="/blog/investir-imovel-campeche-roi-valorizacao">renda de temporada</a>',
	},
	{
		file: 'inverno-verao-campeche-sazonalidade.html',
		from: 'preço do aluguel',
		to: '<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">preço do aluguel</a>',
	},
];

const blogDir = join(process.cwd(), 'src/content/blog');

for (const patch of PATCHES) {
	const path = join(blogDir, patch.file);
	let html = readFileSync(path, 'utf8');

	if (html.includes(patch.to)) {
		console.log(`Já aplicado: ${patch.file}`);
		continue;
	}

	if (!html.includes(patch.from)) {
		console.warn(`Texto não encontrado em ${patch.file}: ${patch.from.slice(0, 60)}…`);
		continue;
	}

	html = html.replace(patch.from, patch.to);
	writeFileSync(path, html, 'utf8');
	console.log(`Patch: ${patch.file}`);
}

console.log('Patches concluídos.');
