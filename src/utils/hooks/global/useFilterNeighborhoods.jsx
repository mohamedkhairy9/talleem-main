export function useFilterNeighrborhood(cityId, neighborhoods){
    if(!cityId) return [];

    return neighborhoods.map(neighborhood => neighborhood.city.id === cityId)
}