import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { branchesService } from '@/api/services/branches.service';
import { entitiesService } from '@/api/services/entities.service';
import { usersService } from '@/api/services/users.service';
import { mainProgramsService } from '@/api/services/mainPrograms.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const isEnabled = key => apiCalls.includes(key);

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.BRANCHES, allData],
            queryFn: () => branchesService.getBranches(allData),
            enabled: isEnabled(API_KEYS.BRANCHES)
        },
        {
            queryKey: [API_KEYS.ENTITIES, allData],
            queryFn: () => entitiesService.getEntities(allData),
            enabled: isEnabled(API_KEYS.ENTITIES)
        },
        {
            queryKey: [API_KEYS.USERS, allData],
            queryFn: () => usersService.getUsers(allData),
            enabled: isEnabled(API_KEYS.USERS)
        },
        {
            queryKey: [API_KEYS.MAIN_PROGRAMS, allData],
            queryFn: () => mainProgramsService.getMainPrograms(allData),
            enabled: isEnabled(API_KEYS.MAIN_PROGRAMS)
        }
    ]);

    const [branchesQuery, entitiesQuery, usersQuery, mainProgramsQuery] = queries;

    return {
        branchesData: branchesQuery?.data,
        entitiesData: entitiesQuery?.data,
        usersData: usersQuery?.data,
        mainProgramsData: mainProgramsQuery?.data,
        isLoading: isAnyLoading
    };
}