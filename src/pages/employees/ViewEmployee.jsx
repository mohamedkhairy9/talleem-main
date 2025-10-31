import React from 'react';
import FormEmployee from './FormEmployee';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useJobsQuery } from '@/api/hooks/useJobs';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewEmployee({ onClose, oldData }) {
    // Fetch all available options
    const { data: jobsData, isLoading: jobsLoading } = useJobsQuery(allData);
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: entityCategoriesData, isLoading: entityCategoriesLoading } =
        useEntityCategoriesQuery(allData);
    const {
        data: academicQualificationsData,
        isLoading: academicQualificationsLoading
    } = useAcademicQualificationsQuery(allData);
    const { data: specificationsData, isLoading: specificationsLoading } =
        useSpecificationsQuery(allData);
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: nationalitiesData, isLoading: nationalitiesLoading } =
        useNationalitiesQuery(allData);
    const { data: usersData, isLoading: usersLoading } = useUsersQuery(allData);

    const isLoading =
        jobsLoading ||
        branchesLoading ||
        entityCategoriesLoading ||
        academicQualificationsLoading ||
        specificationsLoading ||
        citiesLoading ||
        nationalitiesLoading ||
        usersLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="employees.view" />
            <FormEmployee
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}} // No mutation needed for view mode
                isPending={false}
                options={{
                    user_id: usersData?.data,
                    nationality_id: nationalitiesData?.data,
                    job_id: jobsData?.data,
                    branch_id: branchesData?.data,
                    entity_id: entityCategoriesData?.data,
                    academic_qualification_id: academicQualificationsData?.data,
                    specification_id: specificationsData?.data,
                    city_id: citiesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
