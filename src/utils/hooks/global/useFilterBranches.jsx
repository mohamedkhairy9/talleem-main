export default function useFilterBranch(field, id, branches) {
    if(!id) return [];

    if(field === "city"){
        return branches.filter(branch => branch.city.id === id)
    } 
        
    if(field === "neighborhood"){
        return branches.filter(branch => branch.neightborhood.id === id)
    } 
    
}