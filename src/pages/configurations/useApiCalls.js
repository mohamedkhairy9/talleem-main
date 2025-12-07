import { API_KEYS } from '@/api/endpoints';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { remotelyAttendancePlatformsServices } from '@/api/services/remotelyAttendancePlatforms';
import { sessionModesService } from '@/api/services/essionModes.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const isEnabled = key => {
        return apiCalls.some(call => call.key === key);
    };

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS, { status: true }],
            queryFn: () => remotelyAttendancePlatformsServices.getRemotelyAttendancePlatforms({ status: true }),
            enabled: isEnabled(API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS)
        },
        {
            queryKey: [API_KEYS.SESSION_MODES, { status: true }],
            queryFn: () => sessionModesService.getSessionModes({ status: true }),
            enabled: isEnabled(API_KEYS.SESSION_MODES)
        }
    ]);

    const [platformsQuery, sessionModesQuery] = queries;

    return {
        platformsData: platformsQuery?.data,
        sessionModesData: sessionModesQuery?.data,
        isLoading: isAnyLoading
    };
}