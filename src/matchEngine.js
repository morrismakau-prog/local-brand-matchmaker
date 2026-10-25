function calculateDistance(coord1, coord2) {
    const lonDiff = coord1[0] - coord2[0];
    const latDiff = coord1[1] - coord2[1];

    return Math.sqrt(lonDiff * lonDiff + latDiff * latDiff);
}

function normalizeCategory(category) {
    if (typeof category !== 'string') return '';

    return category
        .trim()
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\b(\w+?)s\b(?=\s*$)/g, '$1')
        .trim();
}

export function findLocalMatches(brand, creatorsList, maxDistanceThreshold = 0.05) {
    if (!brand || !Array.isArray(creatorsList)) return [];

    const normalizedBrandCategory = normalizeCategory(brand.category);
    const safeThreshold = Number.isFinite(maxDistanceThreshold) ? maxDistanceThreshold : 0.05;

    return creatorsList.filter(creator => {
        if (!creator || !Array.isArray(brand.coordinates) || !Array.isArray(creator.coordinates)) {
            return false;
        }

        const normalizedCreatorCategory = normalizeCategory(creator.category);
        const isCorrectCategory = normalizedCreatorCategory === normalizedBrandCategory &&
            normalizedCreatorCategory.length > 0 && normalizedBrandCategory.length > 0;
        const separationDistance = calculateDistance(brand.coordinates, creator.coordinates);
        const isWithinProximity = separationDistance <= safeThreshold;

        return isCorrectCategory && isWithinProximity;
    });
}

