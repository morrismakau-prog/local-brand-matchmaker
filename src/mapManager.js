const mapBounds = {
	west: 36.67,
	east: 36.73,
	south: -1.31,
	north: -1.25
};

const locationGroups = {
	brands: { color: 'darkred', locations: [] },
	creators: { color: 'teal', locations: [] }
};

let mapElement;

function renderMarkers() {
	const markerLayer = mapElement?.querySelector('.map-markers');
	if (!markerLayer) return;

	markerLayer.replaceChildren();

	for (const [groupName, group] of Object.entries(locationGroups)) {
		for (const location of group.locations) {
			if (!Array.isArray(location.coordinates) || location.coordinates.length < 2) continue;

			const [longitude, latitude] = location.coordinates;
			const marker = document.createElement('span');
			marker.className = `map-marker map-marker-${groupName}`;
			marker.style.setProperty('--marker-color', group.color);

			const leftPercent = ((Number(longitude) - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100;
			const topPercent = ((mapBounds.north - Number(latitude)) / (mapBounds.north - mapBounds.south)) * 100;
			marker.style.left = `${Math.min(100, Math.max(0, leftPercent))}%`;
			marker.style.top = `${Math.min(100, Math.max(0, topPercent))}%`;
			marker.title = location.name;
			marker.setAttribute('aria-label', location.name);
			marker.setAttribute('role', 'img');
			markerLayer.append(marker);
		}
	}
}

export function initializeMap() {
	mapElement = document.getElementById('map');
	if (!mapElement) return;

	mapElement.replaceChildren();
	const gridDiv = document.createElement('div');
	gridDiv.className = 'map-grid';
	gridDiv.setAttribute('aria-hiden', 'true');

	const labelDiv = document.createElement('div');
	labelDiv.className = 'map-place-label';
	labelDiv.textContent = 'NAIROBI';

	const markersDiv = document.createElement('div');
	markersDiv.className = 'map-markers';
	mapElement.append(gridDiv, labelDiv, markersDiv);
	renderMarkers();
}

export function renderLocationMarkers(locations, color) {
	const groupName = color === 'darkred' ? 'brands' : 'creators';
	locationGroups[groupName].locations = Array.isArray(locations) ? locations : [];
	renderMarkers();
}


