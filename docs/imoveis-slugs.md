# Slugs dos imóveis cadastrados

Lista de imóveis em **Balneário Camboriú** em `src/data/imoveis/`.

**Total no cadastro:** 0 imóveis

O cadastro está vazio. Enquanto não houver imóveis importados:

- a home mostra o filtro de construtora só com a opção "Todas as construtoras";
- as listagens de `/lancamentos/*` e `/bairro/*` ficam sem cards de imóvel;
- `sitemap-imoveis.xml` sai vazio.

Para popular, rode `npm run import:properties` e depois `npm run generate:lancamentos`
e `npm run generate:bairros`. A construtora de cada imóvel é lida de
`ficha.construtora` no `property.json`.

Este documento listava 113 imóveis herdados do site de Florianópolis; a lista saiu
junto com o restante do conteúdo daquela cidade.
