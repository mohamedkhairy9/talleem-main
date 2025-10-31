import React from 'react';
import FormEmployee from './FormEmployee';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateEmployeeMutation } from '@/api/hooks/useEmployees';
import { employeesDefaultValues } from './configs';
import { useJobsQuery } from '@/api/hooks/useJobs';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateEmployee({ onClose }) {
    const { mutate, isPending } = useCreateEmployeeMutation();

    // Fetch all available options
    const { data: jobsData, isLoading: jobsLoading } = useJobsQuery(allData);
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: entitiesData, isLoading: entitiesLoading } =
        useEntitiesQuery(allData);
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

    const isLoading =
        jobsLoading ||
        branchesLoading ||
        entitiesLoading ||
        academicQualificationsLoading ||
        specificationsLoading ||
        citiesLoading ||
        nationalitiesLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="employees.create" />
            <FormEmployee
                onClose={onClose}
                oldData={employeesDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    nationality_id: nationalitiesData?.data,
                    job_id: jobsData?.data,
                    branch_id: branchesData?.data,
                    entity_id: entitiesData?.data,
                    academic_qualification_id: academicQualificationsData?.data,
                    specification_id: specificationsData?.data,
                    city_id: citiesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
