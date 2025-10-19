import { useQuery } from '@tanstack/react-query';
import { activityLogsService } from '../services/activityLogs.service';
import { API_KEYS } from '../endpoints';

export const useActivityLogsQuery = (params = {}) => {
    return useQuery({
        queryKey: [API_KEYS.ACTIVITY_LOGS, params],
        queryFn: () => activityLogsService.getActivityLogs(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000 // 10 minutes
    });
};
