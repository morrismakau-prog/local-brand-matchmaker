function calculateDistance(coord1, coord2) {
    const lonDiff = coord1[0] - coord2[0];
    const latDiff = coord1[1] - coord2[1];

    return Math.sqrt(lonDiff * lonDiff + latDiff * latDiff);
}

export function findLocalMatches(brand, creatorsList, maxDistanceThreshold = 0.05) {
return creatorsList.filter(creator =>{
    const isCorrectCategory = creator.category === brand.category;
    const separationDistance = calculateDistance(brand.coordinates, creator.coordinates);
    const iswithinProximity = separationDistance <= maxDistanceThreshold;

    return isCorrectCategory && iswithinProximity;
 });
}

