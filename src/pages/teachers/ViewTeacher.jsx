import React from 'react';
import FormTeacher from './FormTeacher';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewTeacher({ onClose, oldData }) {
    // Fetch all available options
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
        branchesLoading ||
        mainProgramsLoading ||
        entityCategoriesLoading ||
        educationProgramEntityTypesLoading ||
        academicQualificationsLoading ||
        specificationsLoading ||
        citiesLoading ||
        nationalitiesLoading ||
        usersLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="teachers.view" />
            <FormTeacher
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    user_id: usersData?.data,
                    nationality_id: nationalitiesData?.data,
                    branch_id: branchesData?.data,
                    main_program_id: mainProgramsData?.data,
                    entity_id: entityCategoriesData?.data,
                    education_program_entity_type_id:
                        educationProgramEntityTypesData?.data,
                    entity_category_id: entityCategoriesData?.data,
                    academic_qualification_id: academicQualificationsData?.data,
                    specification_id: specificationsData?.data,
                    city_id: citiesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
