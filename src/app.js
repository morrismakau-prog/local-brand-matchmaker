import { findLocalMatches } from './matchEngine.js';
import { initializeMap, renderLocationMarkers } from './mapManager.js';

const API_BASE_URL = 'http://localhost:3000';

async function fetchDatabaseCollections() {
    try {
        const brandsResponse = await fetch(`${API_BASE_URL}/brands`);
        const creatorsResponse = await fetch(`${API_BASE_URL}/creators`);
        const brands = await brandsResponse.json();
        const creators = await creatorsResponse.json();
        return { brands, creators };
    } catch (error) {
        console.warn("pulling local file backup...", error);
        const response = await fetch('./db.json');
        const data = await response.json();
        return { brands: data.brands ?? [], creators: data.creators ?? [] };
    }
}
let localBrands = [];
let localCreators = [];

function displayMatchesInSidebar() {
    const trackerContainer = document.getElementById('tracker-container');
    if (!trackerContainer) return;

    trackerContainer.innerHTML = '<h2>Active Match Tracker</h2>';

    localBrands.forEach(brand => {
        const matches = findLocalMatches(brand, localCreators, 0.05);

        matches.forEach(creator => {
            const matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.innerHTML = `
            <div class="match-card-body">
            <strong> Match Active!</strong>
            <p><strong>Brand:</strong> ${brand.name}</p>
            <p><srong>Creator:</strong> ${creator.name}</p>
            <span class="status-badge" style="background-color: lightseagreen;">Niche: ${creator.category}</span>
            <button class="remove-match-btn" data-brand-id="${brand.id}" style="margin-top: 8px; display: block; color: coral; background: none; border: none; cursor: pointer; font-size: 0.8rem; padding: 0;"> Remove Match</button>
           </div> 
            `;

            matchCard.querySelector('.remove-match-btn').addEventListener('click', () => {
                matchCard.remove();
                console.log(`Match removed successfully for brand reference ID: ${brand.id}`);
            });

            trackerContainer.appendChild(matchCard);

        });
    });
}

function configureFormInputs() {
    const formContainer = document.getElementById('campaign-form-container');
    if (!formContainer) return;

    formContainer.innerHTML = `
    <h2>Create Collaboration</h2>
    <div style="display: flex; flex-direction: column; gap: 8px;">
         <input type="text" id="input-brand-name" placeholder="Business Name" style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;" value="Alpha Fitness Gym">
     <select id="input-brand-niche" style="padding: 6px; border: 1px solid #ccc; border-radius: 4px;">
         <option value="Fitness & Health">Fitness & Health</option>
         <option value="Food & Drinks">Food & Drinks</option>
     </select>
     <button id="submit-campaign-btn" style="background-color: slateblue; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold;" Launch Campaign</button>
   </div>   
`;

document.getElementById('submit-campaign-btn').addEventListener('click', () => {
    const nameInput = document.getElementById('input-brand-name').value;
    const nicheInput = document.getElementById('input-brand-niche').value;

    const newBrand = {
        id: 'b' + (localBrands.length + 1),
        name: nameInput,
        category: nicheInput,
        coordinates: [36.7020, -1.2710]
    };

    localBrands.push(newBrand);
    renderLocationMarkers(localBrands, 'darkred');
    displayMatchesInSidebar();
 });
}

async function runDashboardApp() {
    initializeMap();

    const { brands, creators } = await fetchDatabaseCollections();
    localBrands = brands;
    localCreators = creators;

    renderLocationMarkers(brands, 'darkred');
    renderLocationMarkers(creators, 'teal'); 
    
    configureFormInputs();
    displayMatchesInSidebar();
}

window.addEventListener('DOMContentLoaded', runDashboardApp);
