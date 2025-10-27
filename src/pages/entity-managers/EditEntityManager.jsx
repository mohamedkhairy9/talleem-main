import React from 'react';
import FormEntityManager from './FormEntityManager';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateEntityManagerMutation } from '@/api/hooks/useEntityManagers';
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
import { genderOptions } from '@/utils/constants/options';

export default function EditEntityManager({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateEntityManagerMutation();

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

    const isLoading =
        branchesLoading ||
        entitiesLoading ||
        academicLevelsLoading ||
        academicQualificationsLoading ||
        specificationsLoading ||
        citiesLoading ||
        nationalitiesLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="entity_managers.update" />
            <FormEntityManager
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    entity_id: entitiesData?.data,
                    nationality_id: nationalitiesData?.data,
                    branch_id: branchesData?.data,
                    academic_level_id: academicLevelsData?.data,
                    specification_id: specificationsData?.data,
                    city_id: citiesData?.data,
                    gender: genderOptions
                }}
            />
        </Modal>
    );
}
