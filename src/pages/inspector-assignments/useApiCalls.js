import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { branchesService } from '@/api/services/branches.service';
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
            queryKey: [API_KEYS.MAIN_PROGRAMS, allData],
            queryFn: () => mainProgramsService.getMainPrograms(allData),
            enabled: isEnabled(API_KEYS.MAIN_PROGRAMS)
        }
    ]);

    const [branchesQuery, mainProgramsQuery] = queries;

    return {
        branchesData: branchesQuery?.data,
        mainProgramsData: mainProgramsQuery?.data,
        isLoading: isAnyLoading
    };
}