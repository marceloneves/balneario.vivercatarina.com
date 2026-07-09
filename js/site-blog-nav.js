(function () {
	function blogPath() {
		var path = window.location.pathname || '/';
		if (path.length > 1 && path.charAt(path.length - 1) === '/') {
			return path.slice(0, -1);
		}
		return path || '/';
	}

	function isBlogMenuLink(anchor) {
		if (!anchor) {
			return false;
		}

		if (anchor.getAttribute('data-nav-blog') !== null) {
			return true;
		}

		var href = anchor.getAttribute('href') || '';

		return href === '/blog' || href === '/blog/';
	}

	function goToBlog() {
		if (blogPath() === '/blog') {
			return;
		}

		window.location.href = '/blog';
	}

	document.addEventListener(
		'click',
		function (event) {
			var link = event.target.closest('a[data-nav-blog], a[href="/blog"], a[href="/blog/"]');

			if (!link || !isBlogMenuLink(link) || link.target === '_blank') {
				return;
			}

			if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			goToBlog();
		},
		true,
	);

	document.addEventListener('DOMContentLoaded', function () {
		document.querySelectorAll('a[data-nav-blog], a[href="/blog"], a[href="/blog/"]').forEach(function (link) {
			link.addEventListener('click', function (event) {
				if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
					return;
				}

				event.preventDefault();
				goToBlog();
			});
		});
	});
})();
