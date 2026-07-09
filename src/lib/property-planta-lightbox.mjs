export function attachPlantaLightboxIndexes(plantas) {
	let lightboxIndex = 0;

	return plantas.map((planta) => {
		if (!planta.imageUrl) {
			return { ...planta, lightboxIndex: null };
		}

		const index = lightboxIndex;
		lightboxIndex += 1;

		return { ...planta, lightboxIndex: index };
	});
}
