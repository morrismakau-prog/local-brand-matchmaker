const mapBounds = {
	west: 36.67,
	east: 36.71,
	south: -1.28,
	north: -1.25
};

const locationGroups = {
	brands: { color: '#c84b31', locations: [] },
	creators: { color: '#187d78', locations: [] }
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
			marker.style.left = `${((longitude - mapBounds.west) / (mapBounds.east - mapBounds.west)) * 100}%`;
			marker.style.top = `${((mapBounds.north - latitude) / (mapBounds.north - mapBounds.south)) * 100}%`;
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
	mapElement.classList.add('local-map');
	mapElement.innerHTML = '<div class="map-grid" aria-hidden="true"></div><div class="map-place-label">NAIROBI</div><div class="map-markers"></div><div class="map-legend"><span><i class="legend-brand"></i>Brands</span><span><i class="legend-creator"></i>Creators</span></div>';
	renderMarkers();
}

export function renderLocationMarkers(locations, color) {
	const groupName = color === '#6A5ACD' ? 'brands' : 'creators';
	locationGroups[groupName].locations = Array.isArray(locations) ? locations : [];
	renderMarkers();
}
