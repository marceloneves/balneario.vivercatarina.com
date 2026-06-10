(function initBlogListingControls() {
	const dataEl = document.getElementById('blog-cluster-filter-data');
	const filterNav = document.getElementById('blog-category-filter');
	const grid = document.getElementById('blog-listing-grid');
	const section = document.getElementById('blog-listing');
	const searchForm = document.getElementById('blog-listing-search');
	const searchInput = document.getElementById('blog-listing-search-input');
	const searchClear = document.getElementById('blog-listing-search-clear');
	const searchStatus = document.getElementById('blog-listing-search-status');

	if (!dataEl || !grid || !section) {
		return;
	}

	const filterButtons = filterNav?.querySelectorAll('[data-cluster-filter]') ?? [];
	const paginationEl = section.querySelector('.th-pagination');
	let allPosts = [];
	let serverGridHtml = grid.innerHTML;
	let activeCluster = 'all';
	let searchQuery = '';
	let searchDebounceTimer = null;

	try {
		allPosts = JSON.parse(dataEl.textContent);
	} catch {
		return;
	}

	function escapeHtml(value) {
		return String(value ?? '')
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function normalizeSearchText(value) {
		return String(value ?? '')
			.toLowerCase()
			.normalize('NFD')
			.replace(/\p{M}/gu, '');
	}

	function blogCategoryHref(post) {
		if (post.clusterId && post.clusterId !== 'geral') {
			return `/blog?cluster=${encodeURIComponent(post.clusterId)}`;
		}

		if (post.clusterId === 'geral') {
			return '/blog?cluster=geral';
		}

		return '/blog';
	}

	function renderBlogPostCard(post) {
		const title = escapeHtml(post.title);
		const excerpt = escapeHtml(post.excerpt);
		const category = escapeHtml(post.category);
		const categoryHref = escapeHtml(blogCategoryHref(post));
		const href = escapeHtml(post.href);
		const imageUrl = escapeHtml(post.imageUrl);
		const dateLabel = escapeHtml(post.dateLabel);
		const datePublished = escapeHtml(post.datePublished);
		const clusterId = escapeHtml(post.clusterId);

		return `<div class="col-lg-4 col-md-6 d-flex" data-blog-cluster="${clusterId}">
	<article class="blog-card blog-post-card">
		<div class="blog-img">
			<a href="${href}">
				<img src="${imageUrl}" alt="${title}" loading="lazy" width="400" height="220" />
			</a>
			<div class="date">
				<time datetime="${datePublished}">
					<a href="/blog">${dateLabel}</a>
				</time>
			</div>
		</div>
		<div class="blog-content">
			<div class="blog-meta">
				<a href="${categoryHref}"><i class="fa-regular fa-tag" aria-hidden="true"></i> ${category}</a>
			</div>
			<h3 class="box-title">
				<a href="${href}">${title}</a>
			</h3>
			<p class="box-text">${excerpt}</p>
			<a href="${href}" class="th-btn pill blog-post-card__read-btn">Ler artigo</a>
		</div>
	</article>
</div>`;
	}

	function setPaginationVisible(visible) {
		if (paginationEl) {
			paginationEl.hidden = !visible;
		}
	}

	function setActiveButton(clusterId) {
		for (const button of filterButtons) {
			const isActive = button.dataset.clusterFilter === clusterId;

			button.classList.toggle('is-active', isActive);
			button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
		}
	}

	function isFilteredView() {
		return activeCluster !== 'all' || Boolean(searchQuery);
	}

	function getFilteredPosts() {
		let posts = allPosts;

		if (activeCluster !== 'all') {
			posts = posts.filter((post) => post.clusterId === activeCluster);
		}

		if (searchQuery) {
			posts = posts.filter((post) => (post.searchText ?? '').includes(searchQuery));
		}

		return posts;
	}

	function getSearchDisplayQuery() {
		return searchInput?.value.trim() || searchQuery;
	}

	function getEmptyMessage() {
		const displayQuery = escapeHtml(getSearchDisplayQuery());

		if (searchQuery && activeCluster !== 'all') {
			return `<div class="col-12"><p class="blog-listing-empty text-center">Nenhum artigo encontrado nesta categoria para &ldquo;${displayQuery}&rdquo;.</p></div>`;
		}

		if (searchQuery) {
			return `<div class="col-12"><p class="blog-listing-empty text-center">Nenhum artigo encontrado para &ldquo;${displayQuery}&rdquo;.</p></div>`;
		}

		return '<div class="col-12"><p class="blog-listing-empty text-center">Nenhum artigo nesta categoria.</p></div>';
	}

	function updateSearchUi() {
		if (!searchInput || !searchClear) {
			return;
		}

		const hasQuery = Boolean(searchInput.value.trim());

		searchClear.hidden = !hasQuery;
		searchInput.setAttribute('aria-expanded', hasQuery ? 'true' : 'false');
	}

	function updateSearchStatus(resultCount) {
		if (!searchStatus) {
			return;
		}

		if (!isFilteredView()) {
			searchStatus.hidden = true;
			searchStatus.textContent = '';
			return;
		}

		const label = resultCount === 1 ? 'artigo encontrado' : 'artigos encontrados';
		searchStatus.hidden = false;
		searchStatus.textContent = `${resultCount} ${label}`;
	}

	function updateUrl() {
		const url = new URL(window.location.href);

		if (activeCluster === 'all') {
			url.searchParams.delete('cluster');
		} else {
			url.searchParams.set('cluster', activeCluster);
		}

		if (!searchQuery) {
			url.searchParams.delete('q');
		} else {
			url.searchParams.set('q', searchQuery);
		}

		history.replaceState({}, '', url.pathname + url.search + url.hash);
	}

	function renderListing() {
		updateUrl();
		setActiveButton(activeCluster);
		updateSearchUi();

		if (!isFilteredView()) {
			grid.innerHTML = serverGridHtml;
			setPaginationVisible(true);
			section.classList.remove('blog-listing-section--filtered');
			updateSearchStatus(0);
			return;
		}

		const filtered = getFilteredPosts();

		if (filtered.length === 0) {
			grid.innerHTML = getEmptyMessage();
		} else {
			grid.innerHTML = filtered.map(renderBlogPostCard).join('\n');
		}

		setPaginationVisible(false);
		section.classList.add('blog-listing-section--filtered');
		updateSearchStatus(filtered.length);
	}

	function setSearchQuery(rawValue, { immediate = false } = {}) {
		const normalized = normalizeSearchText(rawValue.trim());

		const apply = () => {
			searchQuery = normalized;
			renderListing();
		};

		if (immediate) {
			clearTimeout(searchDebounceTimer);
			apply();
			return;
		}

		clearTimeout(searchDebounceTimer);
		searchDebounceTimer = window.setTimeout(apply, 200);
	}

	if (filterNav && filterButtons.length) {
		filterNav.addEventListener('click', (event) => {
			const button = event.target.closest('[data-cluster-filter]');

			if (!button || !filterNav.contains(button)) {
				return;
			}

			activeCluster = button.dataset.clusterFilter || 'all';
			renderListing();
		});
	}

	if (searchForm && searchInput) {
		searchForm.addEventListener('submit', (event) => {
			event.preventDefault();
			setSearchQuery(searchInput.value, { immediate: true });
		});

		searchInput.addEventListener('input', () => {
			setSearchQuery(searchInput.value);
		});

		searchInput.addEventListener('search', () => {
			if (!searchInput.value) {
				setSearchQuery('', { immediate: true });
			}
		});
	}

	if (searchClear && searchInput) {
		searchClear.addEventListener('click', () => {
			searchInput.value = '';
			searchInput.focus();
			setSearchQuery('', { immediate: true });
		});
	}

	const params = new URLSearchParams(window.location.search);
	const clusterParam = params.get('cluster');
	const searchParam = params.get('q') ?? '';

	if (clusterParam && [...filterButtons].some((btn) => btn.dataset.clusterFilter === clusterParam)) {
		activeCluster = clusterParam;
	}

	if (searchParam && searchInput) {
		searchInput.value = searchParam;
		searchQuery = normalizeSearchText(searchParam);
	}

	if (isFilteredView()) {
		renderListing();
	}
})();
