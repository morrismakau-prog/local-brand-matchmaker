import { findLocalMatches } from './matchEngine.js';
import { initializeMap, renderLocationMarkers } from './mapManager.js';

const API_BASE_URL = 'http://localhost:3000';

async function fetchDatabaseCollections() {
    try {
        const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
        const creatorsResponse = await fetch(`${API_BASE_URL}/creators`);
        
        if (!brandsResponse.ok || !creatorsResponse.ok) {
            throw new Error('Database server returned an error.');
        }

        const brands = await brandsResponse.json();
        const creators = await creatorsResponse.json();
        
        return { brands, creators };
    } catch (error) {
        console.warn("Server offline, pulling local file backup...", error);
        const response = await fetch('./db.json');
        const data = await response.json();
        return { brands: data.brands ?? [], creators: data.creators ?? [] };
    }
}
function displayMatchesInSidebar(brands, creators) {
    const trackerContainer = document.getElementById('tracker-container');
    if (!trackerContainer) return;

    trackerContainer.innerHTML = '<h2>Active Match Tracker</h2>';

    const activeBrand = brands[0];
    if (!activeBrand) return;

    const matches = findLocalMatches(activeBrand, creators, 0.05);

    if (matches.length === 0) {
        trackerContainer.innerHTML += '<p class="no-matches">No local niche matches found.</p>';
        return;
    }

    matches.forEach(creator => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.innerHTML = `
            <div class="match-card-body">
                <strong>High Match Found!</strong>
                <p><strong>Brand:</strong> ${activeBrand.name}</p>
                <p><strong>Matched Creator:</strong> ${creator.name}</p>
                <span class="status-badge">Niche: ${creator.category}</span>
            </div>
        `;
        trackerContainer.appendChild(matchCard);
    });
}

async function runDashboardApp() {
    initializeMap();

    const { brands, creators } = await fetchDatabaseCollections();

    renderLocationMarkers(brands, 'darkred');
    renderLocationMarkers(creators, 'teal');

    displayMatchesInSidebar(brands, creators);
}

window.addEventListener('DOMContentLoaded', runDashboardApp);
