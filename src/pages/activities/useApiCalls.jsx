import { useActivitiesQuery } from '@/api/hooks/useActivities';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { allData } from '@/utils/constants/global.constants';
import React from 'react';

export default function useApiCalls({ apiCalls = [] } = {}) {
    const { mainProgramsData, isLoading: mainProgramsLoading } =
        useMainProgramsQuery(allData);

    const { usersData, isLoading: usersLoading } = useUsersQuery(allData);

    const isLoading = mainProgramsLoading || usersLoading;

    return { mainProgramsData, usersData, isLoading };
}
