(function () {
	function bindHubLeadForm(form) {
		const feedback = form.querySelector('.blog-property-hub-lead__feedback');
		const submitButton = form.querySelector('[type="submit"]');
		const neighborhoodName =
			form.dataset.neighborhoodName || 'este bairro';
		const leadSource =
			form.dataset.leadSource || 'blog-hub-campeche';

		form.addEventListener('submit', async (event) => {
			event.preventDefault();

			if (!submitButton) {
				return;
			}

			if (feedback) {
				feedback.hidden = true;
				feedback.textContent = '';
				feedback.classList.remove('is-error');
			}

			submitButton.disabled = true;

			try {
				const data = new FormData(form);
				const response = await fetch('/api/whatsapp-leads.php', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						name: data.get('name'),
						email: data.get('email'),
						source: leadSource,
						pageUrl: window.location.href,
					}),
				});

				const payload = await response.json();

				if (!response.ok) {
					if (feedback) {
						feedback.textContent =
							payload.error || 'Não foi possível enviar agora. Tente novamente.';
						feedback.classList.add('is-error');
						feedback.hidden = false;
					}
					return;
				}

				form.reset();
				if (feedback) {
					feedback.textContent = `Pronto! Em breve você recebe novidades de ${neighborhoodName}.`;
					feedback.hidden = false;
				}
			} catch {
				if (feedback) {
					feedback.textContent =
						'Erro de conexão. Verifique sua internet e tente novamente.';
					feedback.classList.add('is-error');
					feedback.hidden = false;
				}
			} finally {
				submitButton.disabled = false;
			}
		});
	}

	document.querySelectorAll('.blog-hub-lead-form').forEach(bindHubLeadForm);
})();
