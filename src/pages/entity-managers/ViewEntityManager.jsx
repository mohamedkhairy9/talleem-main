import React from 'react';
import FormEntityManager from './FormEntityManager';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useAcademicLevelsQuery } from '@/api/hooks/useAcademicLevels';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions, genderOptions } from '@/utils/constants/options';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useMajorsQuery } from '@/api/hooks/useMajors';

export default function ViewEntityManager({ onClose, oldData }) {
    // Fetch all available options
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: entitiesData, isLoading: entitiesLoading } =
        useEntitiesQuery(allData);
    const { data: academicLevelsData, isLoading: academicLevelsLoading } =
        useAcademicLevelsQuery(allData);
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
    const { data: mainProgramsData, isLoading: mainProgramsLoading } = 
        useMainProgramsQuery(allData);
    const { data: majorsData, isLoading: majorsLoading } = 
        useMajorsQuery(allData);

    const isLoading =
        branchesLoading ||
        entitiesLoading ||
        academicLevelsLoading ||
        academicQualificationsLoading ||
        specificationsLoading ||
        citiesLoading ||
        nationalitiesLoading ||
        mainProgramsLoading ||
        majorsLoading;

    if (isLoading) return <Loader />;

    const optionsObj = {
        entity_id: entitiesData?.data,
        nationality_id: nationalitiesData?.data,
        branch_id: branchesData?.data,
        academic_level_id: academicLevelsData?.data,
        academic_qualification_id: academicQualificationsData?.data,
        specification_id: specificationsData?.data,
        city_id: citiesData?.data,
        gender: genderOptions,
        status: enabledDisabledOptions.map(field => {
            field.value = +field.value
            return field;
        }),
        main_program_id: mainProgramsData?.data,
        major_id: majorsData?.data
    };

    // Debug logs
    console.log('ViewEntityManager - oldData:', oldData);
    console.log('ViewEntityManager - academic_qualification_id from oldData:', oldData?.academic_qualification_id);
    console.log('ViewEntityManager - academicQualificationsData:', academicQualificationsData);
    console.log('ViewEntityManager - academic_qualification_id options:', optionsObj.academic_qualification_id);

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="entity_managers.view" />
            <FormEntityManager
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={optionsObj}
            />
        </Modal>
    );
}
