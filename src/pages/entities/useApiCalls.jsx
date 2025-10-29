import { useActivitiesQuery } from '@/api/hooks/useActivities';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useLocationTypesQuery } from '@/api/hooks/useLocationTypes';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useNeighborhoodsQuery } from '@/api/hooks/useNeighborhoods';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { allData } from '@/utils/constants/global.constants';

export default function useApiCalls() {
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: mainProgramsData, isLoading: mainProgramsLoading } =
        useMainProgramsQuery(allData);
    const { data: entityCategoriesData, isLoading: entityCategoriesLoading } =
        useEntityCategoriesQuery(allData);
    const {
        data: educationProgramEntityTypesData,
        isLoading: educationProgramEntityTypesLoading
    } = useEducationProgramEntityTypesQuery(allData);
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: neighborhoodsData, isLoading: neighborhoodsLoading } =
        useNeighborhoodsQuery(allData);
    const { data: locationTypesData, isLoading: locationTypesLoading } =
        useLocationTypesQuery(allData);
    const { data: usersData, isLoading: usersLoading } = useUsersQuery(allData);
    const { data: activitiesData, isLoading: activitiesLoading } =
        useActivitiesQuery(allData);

    const isLoading =
        branchesLoading ||
        mainProgramsLoading ||
        entityCategoriesLoading ||
        educationProgramEntityTypesLoading ||
        citiesLoading ||
        neighborhoodsLoading ||
        locationTypesLoading ||
        usersLoading ||
        activitiesLoading;

    return {
        branchesData,
        mainProgramsData,
        entityCategoriesData,
        educationProgramEntityTypesData,
        citiesData,
        neighborhoodsData,
        locationTypesData,
        usersData,
        activitiesData,
        isLoading
    };
}
