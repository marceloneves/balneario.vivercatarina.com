# Linkagem interna (VBC)

Regras editoriais e técnicas para links internos no blog Viver Catarina — **todos os clusters** (bairro, Compra Segura e Balneário Camboriú geral), além do linkify automático em artigos avulsos.

---

## Regra unificada por cluster

Cada artigo pertence a **um único cluster** (`src/lib/blog-clusters.mjs`). Os links internos seguem o papel do artigo (pilar ou satélite) e o tipo do cluster (bairro ou tema).

### Matriz de linkagem

| Papel | Corpo (`/blog/`) | Leia também (rodapé) | Hub `/bairro/` |
|-------|------------------|----------------------|----------------|
| **Pilar** | **0** links | **1×** cada satélite publicado (título completo) | **Não** (só satélites de bairro têm hub) |
| **Satélite** | **1×** pilar + **3×** satélites do mesmo cluster (âncora ≤3 palavras) | **1º** pilar + **3** satélites (título completo) | **1 bloco** após a 2ª seção — **só clusters de bairro** |

### Regras em uma frase

- **Todo** artigo termina com um bloco intitulado **Leia também** (título fixo, sem variação por cluster).
- **Pilar** aponta **1×** para **todos** os satélites — **somente** no **Leia também**; sem links `/blog/` no corpo.
- **Satélite** aponta **2×** para o pilar: **1×** no corpo e **1×** no Leia também.
- **Satélite** aponta **3×** para outros satélites do mesmo cluster no corpo e **3×** no Leia também.
- **Satélite de bairro** aponta **1×** para o hub do bairro (`/bairro/[slug]`) no meio do conteúdo (bloco comercial).
- **Remover** todos os demais links internos do cluster: outro cluster, `/lancamentos`, `blog-cluster-bridge`, links externos no corpo.

### Clusters pequenos (proporcional)

Quando o cluster tem **menos de 4 satélites** publicados, o teto de cruzamento é proporcional:

```
satélites no corpo / Leia também = min(3, total_de_satélites − 1)
itens no Leia também = 1 (pilar) + min(3, total_de_satélites − 1)
links /blog/ no corpo = 1 (pilar) + min(3, total_de_satélites − 1)
```

Exemplo: **Cachoeira do Bom Jesus** (3 satélites) → corpo e Leia também com **1 pilar + 2 satélites**.

### Tipos de link (destino × posição)

A auditoria (`scripts/audit-cluster-links.mjs`) classifica cada `<a>` assim:

**Por destino**

| Tipo | Exemplo | Permitido no cluster? |
|------|---------|------------------------|
| `pilar` | `/blog/morar-no-campeche-guia-completo` | Sim |
| `satelite_cluster` | `/blog/preco-m2-campeche-…` (mesmo cluster) | Sim |
| `hub_bairro` | `/bairro/campeche` | Sim — só satélites de bairro, no bloco hub |
| `blog_outro_cluster` | `/blog/` de outro cluster ou avulso | **Não** |
| `lancamentos` | `/lancamentos` | **Não** |
| `imovel` | `/imovel/`, `/property/` | **Não** nos clusters |
| `externo` | `https://…` no corpo | **Não** |

**Por posição / bloco**

| Posição | O que é |
|---------|---------|
| `corpo` | Parágrafos, listas, callouts — a partir do **2º** `h3.blog-inner-title` |
| `hub_comercial` | `div.blog-property-hub-row` (após 2ª seção) |
| `leia_tambem` | Rodapé do satélite |
| `fechamento` | `blog-article-closing` — sem links de cluster |

---

## Regra global: âncora com no máximo 3 palavras (corpo)

No **corpo** do artigo (parágrafos, listas, callouts), o texto visível do link tem **no máximo 3 palavras** — wrap em trecho que já existe no HTML.

| Onde | Texto do link |
|------|----------------|
| **Corpo (clusters)** | ≤3 palavras (`resolveBodyFind()` + `BODY_FIND_SHORTCUTS`) |
| **Leia também (todos os artigos)** | **Título completo** — no pilar: cada satélite; no satélite: pilar em 1º + 3 satélites |
| **Hub comercial** | Frase do `HUB_TITLE` (ex.: “Veja imóveis em lançamento no Campeche”) |
| **Artigos fora do cluster** | Frases em `BLOG_PHRASE_RULES` normalizadas para ≤3 palavras no corpo |

**Título do rodapé:** sempre `Leia também` — nunca `Explore cada tema…` nem outro rótulo.

**Validação:**

```bash
node scripts/rebuild-all-cluster-links.mjs   # reaplica, valida cada cluster e checa cross-cluster
node scripts/validate-cluster-cross-links.mjs  # só artigos /blog/ fora do cluster (falha se houver)
node scripts/audit-cluster-links.mjs         # inventário destino × posição + regras
node scripts/audit-blog-body-anchors.mjs     # âncoras ≤3 palavras em todo o blog
```

**Código compartilhado:** `src/lib/cluster-link-rebuild.mjs` (`buildLeiaTambemSlugs`, `findCrossClusterBlogLinks`), `src/lib/cluster-link-anchor.mjs` (`MAX_LINK_ANCHOR_WORDS = 3`). O rebuild filtra `LEIA_TAMBEM` e `SATELLITE_BODY_PLAN` para aceitar apenas slugs do mesmo cluster.

---

## Clusters no repositório

| Cluster | Pilar (slug) | Hub | Módulo |
|---------|--------------|-----|--------|
| Compra Segura | `guia-definitivo-burocracia-imoveis-balneario-camboriu` | — | `compra-segura-cluster.mjs` |
| Campeche | `morar-no-campeche-guia-completo` | `/bairro/campeche` | `campeche-cluster-body-links.mjs` |
| Cachoeira do Bom Jesus | `morar-na-cachoeira-do-bom-jesus-guia-completo` | `/bairro/canasvieiras` | `cachoeira-cluster.mjs` |
| Canasvieiras | `morar-em-canasvieiras-guia-completo` | `/bairro/canasvieiras` | `canasvieiras-cluster.mjs` |
| Centro | `morar-no-centro-balneario-camboriu-guia-completo` | `/bairro/centro` | `centro-cluster.mjs` |
| Ingleses | `morar-nos-ingleses-guia-completo` | `/bairro/ingleses` | `ingleses-cluster.mjs` |
| Itacorubi | `morar-no-itacorubi-guia-completo` | `/bairro/itacorubi` | `itacorubi-cluster.mjs` |
| Jurerê Internacional | `morar-em-jurere-internacional-guia-completo` | `/bairro/jurereinternacional` | `jurere-internacional-cluster.mjs` |
| Balneário Camboriú (geral) | `morar-em-balneario-camboriu-guia-completo` | — | `balneario-camboriu-cluster.mjs` |

Slugs completos: `src/lib/blog-cluster-slugs.mjs`.  
**Compra Segura** e **Balneário Camboriú (geral)** não têm hub comercial (`HUB_ARTICLES` vazio).

---

## Princípios gerais

### 1. Preservar a redação (corpo)

No **corpo**, só envolver com `<a>` trechos que **já existem** no HTML, com **até 3 palavras** na âncora. Proibido:

- usar frases inteiras ou títulos de artigo como texto do link;
- trocar palavras só para encaixar um título longo;
- acrescentar termos (ex.: “no Campeche” onde não havia);
- substituir o trecho pelo título completo do destino.

### 2. Modo wrap, não replace

```html
<!-- Correto -->
<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">custo de vida real</a>

<!-- Incorreto -->
<a href="/blog/custo-de-vida-campeche-quanto-custa-morar">Custo de vida no Campeche</a>
```

### 3. Âncoras curtas e descritivas

Máximo **3 palavras** (ex.: `custo de vida`, `aluguel de temporada`, `preço do m²`). Evitar “clique aqui”, “saiba mais” e títulos completos de post.

### 4. Um destino, uma vez no corpo (cluster)

Cada URL de destino no **corpo** do artigo aparece **no máximo uma vez**.

### 5. Sem links em títulos

**Não** colocar link interno nem externo em **h2, h3 ou h4**.  
Linkar apenas no conteúdo da seção: parágrafos, listas, callouts, tabelas (quando fizer sentido).

> **Seção principal** = `<h3 class="blog-inner-title h4">`. O hub comercial fica ao fim da **2ª** dessas seções. **Links no corpo** só a partir do **2º** subtítulo — intro e 1ª seção ficam sem link interno.

### 6. Blocos permitidos

| Bloco | Quem usa | Conteúdo |
|-------|----------|----------|
| **Leia também** | **Todos** os artigos (pilar e satélite) | Pilar: todos os satélites; satélite: pilar (1º) + 3 satélites; título completo |
| **Veja imóveis em lançamento…** (hub) | Satélites de **bairro** | Link para `/bairro/[slug]` + lead |

### 7. O que não usar

- Parágrafo **“Veja também o [pilar]…”** (`blog-cluster-bridge`).
- Hub apontando para `/lancamentos` (usar **`/bairro/[slug]`**).
- Links para artigos de **outro cluster** no corpo ou no Leia também.
- Links dentro de h2, h3 ou h4.
- `PILLAR_BODY_PLAN` no rebuild — o pilar **não** recebe links no corpo (constante legada pode existir no código, mas o rebuild ignora).

---

## Pilar (todos os clusters)

| Regra | Detalhe |
|-------|---------|
| Links no corpo | **0** — nenhum `/blog/` antes do Leia também |
| Leia também | **1×** cada satélite publicado; título **Leia também**; título completo nos links |
| Hub comercial | **Não** — apenas satélites de bairro recebem hub |

**Fluxo do HTML:** introdução → seções → **Leia também** → `blog-article-closing` (se existir).

---

## Satélite (todos os clusters)

### Corpo

| Regra | Detalhe |
|-------|---------|
| Quantidade | **1×** pilar + **3×** satélites (`SATELLITE_BODY_PLAN` + `trimSatelliteBodyPlan()`) |
| Modo | **Wrap** no texto `find`; nunca título completo no corpo |
| Link ao pilar | **Obrigatório** — 1× no corpo (além de 1× no Leia também = **2×** no artigo) |
| Zona linkável | Só a partir do **2º** `h3.blog-inner-title` |
| h2–h4 | Sem `<a>` |

Os `find` em `SATELLITE_BODY_PLAN` precisam existir no HTML **após o 2º subtítulo**; caso contrário o rebuild ignora a entrada e a validação falha.

### Leia também

| Regra | Detalhe |
|-------|---------|
| Posição | **Só no final** — depois do corpo e do hub (se houver) |
| Ordem | **1º = pilar** · 2º a 4º = três satélites (`LEIA_TAMBEM`) |
| Quantidade | **4 itens** (ou proporcional em clusters pequenos) |
| Texto do link | **Título completo** (`BLOG_POSTS.title`) |
| Montagem | `leiaTambemSlugsForSatellite(slug)` → `[PILLAR, ...LEIA_TAMBEM[slug]]` |

O pilar aparece **no corpo** e de novo no Leia também — papéis diferentes (contexto vs. navegação).

### Hub — satélites de bairro

| Regra | Detalhe |
|-------|---------|
| Quem recebe | Apenas **satélites** (`HUB_ARTICLES` = lista de satélites, **sem** o pilar) |
| URL | **`/bairro/[slug]`** do bairro do cluster (nunca `/lancamentos`) |
| Layout | `div.blog-property-hub-row` — imagem + formulário lead |
| Posição | Fim da **2ª** seção `h3.blog-inner-title`, **antes** da 3ª |
| Inserção | `insertHubAfterSecondSubtitle()` |

### Ordem dos blocos no HTML (satélite de bairro)

1. Intro + **1ª** seção `h3.blog-inner-title`
2. **2ª** seção `h3` (conteúdo completo)
3. `div.blog-property-hub-row` — hub comercial
4. **3ª** seção em diante (links do corpo podem aparecer aqui)
5. `div.blog-related` — Leia também (pilar + 3 satélites)

**Satélite de tema** (Compra Segura, Balneário Camboriú): mesma ordem, **sem** o passo 3 (hub).

---

## Estrutura HTML dos blocos

### Leia também (satélites)

```html
<div class="blog-related">
  <p class="blog-related__title">Leia também</p>
  <ul>
    <li><a href="/blog/morar-no-campeche-guia-completo">Morar no Campeche: Guia Completo do Bairro Mais Promissor do sul de Balneário Camboriú</a></li>
    <li><a href="/blog/aluguel-campeche-valores-temporada">Aluguel no Campeche: Valores, Temporada e Como Funciona o Mercado</a></li>
    <!-- … título completo em cada satélite … -->
  </ul>
</div>
```

### Hub comercial (satélites de bairro)

```html
<div class="blog-related blog-property-hub-row">
  <div class="blog-property-hub-row__visual">
    <p class="blog-related__title"><a href="/bairro/campeche">Veja imóveis em lançamento no Campeche</a></p>
    <p class="blog-property-hub__media"><a href="/bairro/campeche"><img src="…" alt="Campeche, Balneário Camboriú" loading="lazy"></a></p>
  </div>
  <aside class="blog-property-hub-lead">… formulário lead …</aside>
</div>
```

### Leia também (pilar — todos os satélites)

```html
<div class="blog-related">
  <p class="blog-related__title">Leia também</p>
  <ul>
    <li><a href="/blog/preco-m2-campeche-quanto-custa-comprar">Preço do m² no Campeche: Quanto Custa Comprar um Imóvel no Bairro</a></li>
    <!-- … um <li> por satélite publicado, título completo … -->
  </ul>
</div>
```

---

## Artigos fora do cluster

Gerenciados por `src/lib/blog-content-links.mjs` + `src/lib/content-inline-links.mjs`:

- Linkify automático **ativo** no corpo (a partir do **2º** `h3.blog-inner-title`).
- **Sem** links em h2, h3 e h4.
- **Uma ocorrência por URL** (`maxOncePerHref`).

Slugs de **todos** os clusters estão em `blog-cluster-slugs.mjs` — o automático fica **desligado** para eles.

---

## Implementação no repositório

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/cluster-link-rebuild.mjs` | Regras unificadas: `trimSatelliteBodyPlan`, contadores de validação |
| `src/lib/cluster-link-anchor.mjs` | Âncoras ≤3 palavras, `resolveBodyFind`, validação |
| `src/lib/campeche-cluster-body-links.mjs` | Campeche: planos, hub, rebuild (referência para demais bairros) |
| `src/lib/*-cluster.mjs` | Um módulo por cluster (planos + rebuild) |
| `src/lib/blog-cluster-slugs.mjs` | Slugs e pilares — fonte única |
| `src/lib/blog-clusters.mjs` | Metadados e filtro de listagem |
| `scripts/rebuild-all-cluster-links.mjs` | Roda todos os rebuilds em sequência |
| `scripts/rebuild-*-cluster-links.mjs` | Rebuild + validação por cluster |
| `scripts/audit-cluster-links.mjs` | Inventário completo e checagem de regras |
| `scripts/audit-blog-body-anchors.mjs` | Âncoras longas/fracas em todo o blog |

**O que cada rebuild faz:**

1. Remove blocos `blog-related`, `blog-cluster-bridge` e links antigos do corpo.
2. Aplica `SATELLITE_BODY_PLAN` via `trimSatelliteBodyPlan()` (1 pilar + até 3 satélites).
3. Remove links em títulos (`stripHeadingAnchors`).
4. Insere hub após a 2ª `h3` (**só** satélites de bairro).
5. Monta **Leia também** (pilar: todos os satélites; satélite: pilar + 3 satélites).
6. Valida contagens, ordem do Leia também e âncoras.

**Mapas editáveis por cluster:**

| Constante | Conteúdo |
|-----------|----------|
| `SATELLITE_BODY_PLAN` | `{ find, target }` por satélite — corpo |
| `LEIA_TAMBEM` | 3 slugs de satélites (pilar acrescentado em código) |
| `HUB_ARTICLES` | Satélites que recebem hub (vazio em clusters de tema) |
| `HUB_HREF` / `HUB_TITLE` | URL e texto do hub de bairro |

---

## Checklist antes de publicar

### Pilar

- [ ] **0** links `/blog/` no corpo.
- [ ] **Leia também** com todos os satélites publicados; título completo em cada `<li>`.
- [ ] Sem hub comercial.

### Satélite

- [ ] Corpo: **1×** pilar + **3×** satélites (ou proporcional); âncora ≤3 palavras; só após 2º `h3`.
- [ ] **2×** pilar no artigo (corpo + Leia também).
- [ ] Leia também: pilar **1º** + 3 satélites; títulos completos.
- [ ] Hub após 2ª `h3` — **se** cluster de bairro.
- [ ] Nenhum link para outro cluster, `/lancamentos` ou `blog-cluster-bridge`.
- [ ] Nenhum `<a>` em h2, h3 ou h4.

### Validação automatizada

```bash
node scripts/rebuild-all-cluster-links.mjs
node scripts/audit-cluster-links.mjs
node scripts/audit-blog-body-anchors.mjs
```

---

## Referência: slugs do cluster Campeche

**Pilar:** `morar-no-campeche-guia-completo`

**Satélites:** `preco-m2-campeche-quanto-custa-comprar`, `apartamentos-a-venda-campeche-faixas-preco`, `casas-a-venda-campeche-sub-regioes`, `aluguel-campeche-valores-temporada`, `investir-imovel-campeche-roi-valorizacao`, `como-comprar-imovel-campeche-financiamento`, `campeche-em-expansao-valorizacao`, `campeche-e-bom-para-morar`, `sub-regioes-campeche-guia-completo`, `campeche-x-bairros-sul-comparativo`, `infraestrutura-campeche-comercio-mobilidade`, `seguranca-campeche-como-e-morar`, `praias-do-campeche-guia-completo`, `escolas-creches-campeche`, `saude-campeche-postos-hospitais-clinicas`, `custo-de-vida-campeche-quanto-custa-morar`, `inverno-verao-campeche-sazonalidade`

Demais clusters: `src/lib/blog-cluster-slugs.mjs`.

---

*Última revisão: rodapé sempre **Leia também** (pilar e satélite); pilar lista todos os satélites; satélite → 1+3 corpo, 1+3 Leia também, 2× pilar; hub só em bairro.*
