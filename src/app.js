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
            <p><strong>Creator:</strong> ${creator.name}</p>
            <span class="status-badge" style="background-color: lightseagreen;">Niche: ${creator.category}</span>
        </div> 
            `;
            trackerContainer.appendChild(matchCard);
            });
        });
   
}

function configureFormInputs() {
    const formContainer = document.getElementById('campaign-form-container');
    if (!formContainer) return;

    formContainer.innerHTML = `
    <h2>Create Collaboration</h2>
    <div style="display: flex; flex-direction: column; gap: 12px;">
         <input type="text" id="input-brand-name" placeholder="Business Name" style="padding: 8px; border: 1px solid lightgray; border-radius: 4px;" value="Alpha Fitness Gym">
     <select id="input-brand-niche" style="padding: 8px; border: 1px solid lightgray; border-radius: 4px;">
         <option value="Fitness & Health">Fitness & Health</option>
         <option value="Food & Drink">Food & Drink</option>
         <option value="Fashion & Apparel">Fashion & Apparel</option>
     </select>
     <button id="submit-campaign-btn">Launch Campaign</button>
   </div>   
`;

document.getElementById('submit-campaign-btn').addEventListener('click', async () => {
    const nameInput = document.getElementById('input-brand-name').value;
    const nicheInput = document.getElementById('input-brand-niche').value;

    const uniqueId = 'b_' + Date.now();
    const shiftAmount = (localBrands.length) * 0.005;

    const newBrand = {
        id: uniqueId,
        name: nameInput,
        category: nicheInput,
        coordinates: [36.7020 + shiftAmount, -1.2710 - shiftAmount]
    };

    try {
        const response = await fetch(`${API_BASE_URL}/brands`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBrand)
        });

        if (response.ok) {
            localBrands.push(newBrand);
            renderLocationMarkers(localBrands, 'darkred');
            displayMatchesInSidebar();
        }
    } catch (err) {
        console.error("Database connection failure:",err);
        localBrands.push(newBrand);
            renderLocationMarkers(localBrands, 'darkred');
            displayMatchesInSidebar();
    }
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



