
import { findLocalMatches } from './matchEngine.js';

describe('Matchmaker Engine Unit Test Suite', () => {
    
    const mockBrand = {
        name: "Cafe Central",
        category: "Food & Drink",
        coordinates: [36.6850, -1.2690]
    };

    const mockCreators = [
        { name: "Nearby Foodie", category: "Food & Drink", coordinates: [36.6855, -1.2695] },
        { name: "Far Away Fitness", category: "Fitness & Health", coordinates: [36.9000, -1.9000] },
        { name: "Distant Foodie", category: "Food & Drink", coordinates: [36.9000, -1.9000] }
    ];

    test('should successfully match a creator in the same niche and close proximity', () => {
        const matches = findLocalMatches(mockBrand, mockCreators, 0.05);
        expect(matches.length).toBe(1);
        expect(matches[0].name).toBe("Nearby Foodie");
    });

    test('should filter out creators that do not match the brand category niche', () => {
        const matches = findLocalMatches(mockBrand, mockCreators, 0.05);
        const fitnessMatch = matches.find(c => c.category === "Fitness & Health");
        expect(fitnessMatch).toBeUndefined();
    });

    test('should filter out creators that share a category but live outside the distance threshold', () => {
        const matches = findLocalMatches(mockBrand, mockCreators, 0.05);
        const distantMatch = matches.find(c => c.name === "Distant Foodie");
        expect(distantMatch).toBeUndefined();
    });

    test('should match creators whose category spelling differs but represents the same niche', () => {
        const brandWithPluralCategory = { ...mockBrand, category: 'Food & Drinks' };
        const matches = findLocalMatches(brandWithPluralCategory, mockCreators, 0.05);
        expect(matches.some(c => c.name === 'Nearby Foodie')).toBe(true);
    });

    test('should safely return no matches when inputs are missing or invalid', () => {
        expect(findLocalMatches(null, mockCreators, 0.05)).toEqual([]);
        expect(findLocalMatches(mockBrand, null, 0.05)).toEqual([]);
    });
});






