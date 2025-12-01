import { API_KEYS } from '@/api/endpoints';
import { allData } from '@/utils/constants/global.constants';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';
import { activitiesService } from '@/api/services/activities.service';
import { branchesService } from '@/api/services/branches.service';
import { citiesService } from '@/api/services/cities.service';
import { educationProgramEntityTypesService } from '@/api/services/educationProgramEntityTypes.service';
import { locationTypesService } from '@/api/services/locationTypes.service';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { neighborhoodsService } from '@/api/services/neighborhoods.service';
import { usersService } from '@/api/services/users.service';
import { memorizationProgramEntityTypesService } from '@/api/services/memorizationProgramEntityTypes.service';
import { nationalitiesService } from '@/api/services/nationalities.service';
import { specificationsService } from '@/api/services/specifications.service';
import { academicQualificationsService } from '@/api/services/academicQualifications.service';
import { sessionModesService } from '@/api/services/essionModes.service';

export default function useApiCalls({ apiCalls = [], mainProgramId } = {}) {
    const isEnabled = key => apiCalls.includes(key);

    const { queries, isAnyLoading } = useCustomQueries([
        {
            queryKey: [API_KEYS.BRANCHES, allData],
            queryFn: () => branchesService.getBranches(allData),
            enabled: isEnabled(API_KEYS.BRANCHES)
        },
        {
            queryKey: [API_KEYS.ACADEMIC_QUALIFICATIONS, allData],
            queryFn: () =>
                academicQualificationsService.getAcademicQualifications(
                    allData
                ),
            enabled: isEnabled(API_KEYS.ACADEMIC_QUALIFICATIONS)
        },
        {
            queryKey: [API_KEYS.MAIN_PROGRAMS, allData],
            queryFn: () => mainProgramsService.getMainPrograms(allData),
            enabled: isEnabled(API_KEYS.MAIN_PROGRAMS)
        },
        {
            queryKey: [API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES, allData],
            queryFn: () =>
                educationProgramEntityTypesService.getEducationProgramEntityTypes(
                    allData
                ),
            enabled: isEnabled(API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES)
        },
        {
            queryKey: [API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES, allData],
            queryFn: () =>
                memorizationProgramEntityTypesService.getMemorizationProgramEntityTypes(
                    allData
                ),
            enabled: isEnabled(API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES)
        },
        {
            queryKey: [API_KEYS.CITIES, allData],
            queryFn: () => citiesService.getCities(allData),
            enabled: isEnabled(API_KEYS.CITIES)
        },
        {
            queryKey: [API_KEYS.NEIGHBORHOODS, allData],
            queryFn: () => neighborhoodsService.getNeighborhoods(allData),
            enabled: isEnabled(API_KEYS.NEIGHBORHOODS)
        },
        {
            queryKey: [API_KEYS.LOCATION_TYPES, allData],
            queryFn: () => locationTypesService.getLocationTypes(allData),
            enabled: isEnabled(API_KEYS.LOCATION_TYPES)
        },
        {
            queryKey: [API_KEYS.USERS, allData],
            queryFn: () => usersService.getUsers(allData),
            enabled: isEnabled(API_KEYS.USERS)
        },
        {
            queryKey: [API_KEYS.ACTIVITIES, { ...allData, main_program_id: mainProgramId }],
            queryFn: () => activitiesService.getActivities({ ...allData, main_program_id: mainProgramId }),
            enabled: isEnabled(API_KEYS.ACTIVITIES) && !!mainProgramId
        },
        {
            queryKey: [API_KEYS.NATIONALITIES, allData],
            queryFn: () => nationalitiesService.getNationalities(allData),
            enabled: isEnabled(API_KEYS.NATIONALITIES)
        },
        {
            queryKey: [API_KEYS.SPECIFICATIONS, allData],
            queryFn: () => specificationsService.getSpecifications(allData),
            enabled: isEnabled(API_KEYS.SPECIFICATIONS)
        },
        {
            queryKey: [API_KEYS.SESSION_MODES, allData], 
            queryFn: () => sessionModesService.getSessionModes(allData),
            enabled: isEnabled(API_KEYS.SESSION_MODES)
        }
    ]);

    const [
        branchesQuery,
        academicQualificationsQuery,
        mainProgramsQuery,
        educationProgramEntityTypesQuery,
        memorizationProgramEntityTypesQuery,
        citiesQuery,
        neighborhoodsQuery,
        locationTypesQuery,
        usersQuery,
        activitiesQuery,
        nationalitiesQuery,
        specificationsQuery,
        sessionModesQuery
    ] = queries;

    return {
        branchesData: branchesQuery?.data,
        academicQualificationsData: academicQualificationsQuery?.data,
        mainProgramsData: mainProgramsQuery?.data,
        educationProgramEntityTypesData: educationProgramEntityTypesQuery?.data,
        memorizationProgramEntityTypesData:
            memorizationProgramEntityTypesQuery?.data,
        citiesData: citiesQuery?.data,
        neighborhoodsData: neighborhoodsQuery?.data,
        locationTypesData: locationTypesQuery?.data,
        usersData: usersQuery?.data,
        activitiesData: activitiesQuery?.data,
        nationalitiesData: nationalitiesQuery?.data,
        specificationsData: specificationsQuery?.data,
        sessionModesData: sessionModesQuery?.data,
        isLoading: isAnyLoading
    };
}
