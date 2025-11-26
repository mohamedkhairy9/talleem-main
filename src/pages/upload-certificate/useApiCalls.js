import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { branchesService } from '@/api/services/branches.service';
import { entitiesService } from '@/api/services/entities.service';
import { studentsService } from '@/api/services/students.service';
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
            queryKey: [API_KEYS.ENTITIES, allData],
            queryFn: () => entitiesService.getEntities(allData),
            enabled: isEnabled(API_KEYS.ENTITIES)
        },
        {
            queryKey: [API_KEYS.STUDENTS, allData],
            queryFn: () => studentsService.getStudents(allData),
            enabled: isEnabled(API_KEYS.STUDENTS)
        },
        {
            queryKey: [API_KEYS.CERTIFICATE_NAMES, allData],
            queryFn: () => certificateNamesService.getCertificateNames(allData),
            enabled: isEnabled(API_KEYS.CERTIFICATE_NAMES)
        }
    ]);

    const [
        mainProgramsQuery,
        branchesQuery,
        entitiesQuery,
        studentsQuery,
        certificateNamesQuery
    ] = queries;

    return {
        mainProgramsData: mainProgramsQuery?.data,
        branchesData: branchesQuery?.data,
        entitiesData: entitiesQuery?.data,
        studentsData: studentsQuery?.data,
        certificateNamesData: certificateNamesQuery?.data,
        isLoading: isAnyLoading
    };
}