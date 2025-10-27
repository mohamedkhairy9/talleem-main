import React from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateEntityMutation } from '@/api/hooks/useEntities';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNeighborhoodsQuery } from '@/api/hooks/useNeighborhoods';
import { useLocationTypesQuery } from '@/api/hooks/useLocationTypes';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';

const statusOptions = [
    { label: { ar: 'نشط', en: 'Active' }, value: 'active' },
    { label: { ar: 'غير نشط', en: 'Inactive' }, value: 'inactive' }
];

export default function EditEntity({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateEntityMutation();

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
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: neighborhoodsData, isLoading: neighborhoodsLoading } =
        useNeighborhoodsQuery(allData);
    const { data: locationTypesData, isLoading: locationTypesLoading } =
        useLocationTypesQuery(allData);
    const { data: usersData, isLoading: usersLoading } = useUsersQuery(allData);

    const isLoading =
        branchesLoading ||
        mainProgramsLoading ||
        entityCategoriesLoading ||
        educationProgramEntityTypesLoading ||
        citiesLoading ||
        neighborhoodsLoading ||
        locationTypesLoading ||
        usersLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="entities.edit" />
            <FormEntity
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    user_id: usersData?.data,
                    branch_id: branchesData?.data,
                    main_program_id: mainProgramsData?.data,
                    entity_category_id: entityCategoriesData?.data,
                    education_program_entity_type_id:
                        educationProgramEntityTypesData?.data,
                    city_id: citiesData?.data,
                    neighborhood_id: neighborhoodsData?.data,
                    location_type_id: locationTypesData?.data,
                    status: statusOptions
                }}
            />
        </Modal>
    );
}
