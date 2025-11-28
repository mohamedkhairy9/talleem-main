import { API_KEYS } from '@/api/endpoints';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { remotelyAttendancePlatformsServices } from '@/api/services/remotelyAttendancePlatforms';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const isEnabled = key => {
        return apiCalls.some(call => call.key === key);
    };

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS, { status: true }],
            queryFn: () => remotelyAttendancePlatformsServices.getPlatforms({ status: true }),
            enabled: isEnabled(API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS)
        }
    ]);

    const [platformsQuery] = queries;

    return {
        platformsData: platformsQuery?.data,
        isLoading: isAnyLoading
    };
}