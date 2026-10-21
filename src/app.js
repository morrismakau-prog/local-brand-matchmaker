
import { findLocalMatches } from './matchEngine.js';
import { initializeMap, renderLocationMarkers } from './mapManager.js';

const API_BASE_URL = 'http://localhost:3000';

async function fetchDatabaseCollections() {
    try {
        const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
        const creatorsResponse = await fetch(`${API_BASE_URL}/creators`);

        if (!brandsResponse.ok || !creatorsResponse.ok) {
            throw new Error('The local API returned an unsuccessful response.');
        }
        
        const brands = await brandsResponse.json();
        const creators = await creatorsResponse.json();
        
        return { brands, creators };
    } catch (error) {
        try {
            const response = await fetch('./db.json');
            if (!response.ok) {
                throw new Error('The local data file could not be loaded.');
            }
            const data = await response.json();
            return { brands: data.brands ?? [], creators: data.creators ?? [] };
        } catch (fallbackError) {
            console.error('Unable to load brands and creators:', fallbackError);
            return { brands: [], creators: [] };
        }
    }
}

async function runDashboardApp() {

    initializeMap();

    const { brands, creators } = await fetchDatabaseCollections();

    renderLocationMarkers(brands, '#6A5ACD');
    renderLocationMarkers(creators, '#FF7F50');
}

window.addEventListener('DOMContentLoaded', runDashboardApp);
