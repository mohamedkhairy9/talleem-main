import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import { activityLogsService } from '../services/activityLogs.service';
import { API_KEYS } from '../endpoints';

export const useActivityLogsQuery = (
    params = {},
    options = {
        enabled: true,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000
    }
) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACTIVITY_LOGS, params],
        queryFn: () => activityLogsService.getActivityLogs(params),
        ...options
    });
};
