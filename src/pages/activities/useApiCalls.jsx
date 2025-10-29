import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { usersService } from '@/api/services/users.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const isEnabled = key => apiCalls.includes(key);

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.MAIN_PROGRAMS, allData],
            queryFn: () => mainProgramsService.getMainPrograms(allData),
            enabled: isEnabled(API_KEYS.MAIN_PROGRAMS)
        },
        {
            queryKey: [API_KEYS.USERS, allData],
            queryFn: () => usersService.getUsers(allData),
            enabled: isEnabled(API_KEYS.USERS)
        }
    ]);

    const [mainProgramsQuery, usersQuery] = queries;

    return {
        mainProgramsData: mainProgramsQuery?.data,
        usersData: usersQuery?.data,
        isLoading: isAnyLoading
    };
}
