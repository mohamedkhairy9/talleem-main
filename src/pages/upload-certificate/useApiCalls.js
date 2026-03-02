import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { branchesService } from '@/api/services/branches.service';
import { certificateNamesService } from '@/api/services/certificateNames.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
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
            queryKey: [API_KEYS.CERTIFICATE_NAMES, allData],
            queryFn: () => certificateNamesService.getCertificateNames(allData),
            enabled: isEnabled(API_KEYS.CERTIFICATE_NAMES)
        }
    ]);

    const [mainProgramsQuery, branchesQuery, certificateNamesQuery] = queries;

    return {
        mainProgramsData: mainProgramsQuery?.data,
        branchesData: branchesQuery?.data,
        certificateNamesData: certificateNamesQuery?.data,
        isLoading: isAnyLoading
    };
}