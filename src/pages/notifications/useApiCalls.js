import { API_KEYS } from '@/api/endpoints';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { branchesService } from '@/api/services/branches.service';
import { entitiesService } from '@/api/services/entities.service';
import { rolesService } from '@/api/services/roles.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const safeApiCalls = Array.isArray(apiCalls) ? apiCalls : [];
    
    const isEnabled = key => {
        return safeApiCalls.includes(key);
    };

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.BRANCHES, { status: true }],
            queryFn: () => branchesService.getBranches({ status: true }),
            enabled: isEnabled(API_KEYS.BRANCHES)
        },
        {
            queryKey: [API_KEYS.ENTITIES],
            queryFn: () => entitiesService.getEntities({ status: "active" }),
            enabled: isEnabled(API_KEYS.ENTITIES)
        },
        {
            queryKey: [API_KEYS.ROLES, { status: true }],
            queryFn: () => rolesService.getRoles({ status: true }),
            enabled: isEnabled(API_KEYS.ROLES)
        }
    ]);

    const [branchesQuery, entitiesQuery, rolesQuery] = queries;

    // Debug logs
    console.log('Branches data:', branchesQuery?.data);
    console.log('Entities data:', entitiesQuery?.data);
    console.log('Roles data:', rolesQuery?.data);

    return {
        branches: branchesQuery?.data,
        entities: entitiesQuery?.data,
        roles: rolesQuery?.data,
        isLoading: isAnyLoading
    };
}