import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { branchesService } from '@/api/services/branches.service';
import { entitiesService } from '@/api/services/entities.service';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { studentsService } from '@/api/services/students.service';
import { teachersService } from '@/api/services/teachers.service';
import { warningReasonsService } from '@/api/services/warningReasons.service';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const isEnabled = key => apiCalls.includes(key);

    const { queries, isAnyLoading } = useCustomQueries([
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
            queryKey: [API_KEYS.MAIN_PROGRAMS, allData],
            queryFn: () => mainProgramsService.getMainPrograms(allData),
            enabled: isEnabled(API_KEYS.MAIN_PROGRAMS)
        },
        {
            queryKey: [API_KEYS.STUDENTS, allData],
            queryFn: () => studentsService.getStudents(allData),
            enabled: isEnabled(API_KEYS.STUDENTS)
        },
        {
            queryKey: [API_KEYS.TEACHERS, allData],
            queryFn: () => teachersService.getTeachers(allData),
            enabled: isEnabled(API_KEYS.TEACHERS)
        },
        {
            queryKey: [API_KEYS.WARNING_REASONS, allData],
            queryFn: () => warningReasonsService.getWarningReasons(allData),
            enabled: isEnabled(API_KEYS.WARNING_REASONS)
        }
    ]);

    const [
        branchesQuery,
        entitiesQuery,
        mainProgramsQuery,
        studentsQuery,
        teachersQuery,
        warningReasonsQuery
    ] = queries;

    return {
        branchesData: branchesQuery?.data,
        entitiesData: entitiesQuery?.data,
        mainProgramsData: mainProgramsQuery?.data,
        studentsData: studentsQuery?.data,
        teachersData: teachersQuery?.data,
        warningReasonsData: warningReasonsQuery?.data,
        isLoading: isAnyLoading
    };
}
