import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { entitiesService } from '@/api/services/entities.service';
import { activitiesService } from '@/api/services/activities.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const isEnabled = key => apiCalls.includes(key);

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.ENTITIES, allData],
            queryFn: () => entitiesService.getEntities(allData),
            enabled: isEnabled(API_KEYS.ENTITIES)
        },
        {
            queryKey: [API_KEYS.ACTIVITIES, allData],
            queryFn: () => activitiesService.getActivities(allData),
            enabled: isEnabled(API_KEYS.ACTIVITIES)
        }
    ]);

    const [entitiesQuery, activitiesQuery] = queries;

    return {
        entitiesData: entitiesQuery?.data,
        activitiesData: activitiesQuery?.data,
        isLoading: isAnyLoading
    };
}
