import { API_KEYS } from '@/api/endpoints';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { branchesService } from '@/api/services/branches.service';
import { entityCategoriesService } from '@/api/services/entityCategories.service';
import { entitiesService } from '@/api/services/entities.service';
import { allData } from '@/utils/constants/global.constants';

export default function useApiCalls({ apiCalls = [] } = {}) {
    // const isEnabled = key => apiCalls.some(call => call.key === key);
    const isEnabled = key => apiCalls.includes(key);

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.MAIN_PROGRAMS, allData],
            queryFn: () => mainProgramsService.getMainPrograms(allData),
            enabled: isEnabled(API_KEYS.MAIN_PROGRAMS)
        },
        {
            queryKey: [API_KEYS.BRANCHES, allData],
            queryFn: () => branchesService.getBranches(allData),
            enabled: isEnabled(API_KEYS.BRANCHES)
        },
        {
            queryKey: [API_KEYS.ENTITY_CATEGORIES, allData],
            queryFn: () => entityCategoriesService.getEntityCategories(allData),
            enabled: isEnabled(API_KEYS.ENTITY_CATEGORIES)
        },
        {
            queryKey: [API_KEYS.ENTITIES, allData],
            queryFn: () => entitiesService.getEntities(allData),
            enabled: isEnabled(API_KEYS.ENTITIES)
        },
    ]);

    const [
        programsQuery,
        branchesQuery,
        entityTypesQuery,
        entitiesQuery,
    ] = queries;

    return {
        programsData: programsQuery?.data,
        branchesData: branchesQuery?.data,
        entityTypesData: entityTypesQuery?.data,
        entitiesData: entitiesQuery?.data,
        isLoading: isAnyLoading
    };
}