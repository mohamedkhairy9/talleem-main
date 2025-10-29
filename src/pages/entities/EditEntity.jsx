import React from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateEntityMutation } from '@/api/hooks/useEntities';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';

const statusOptions = [
    { label: { ar: 'نشط', en: 'Active' }, value: 'active' },
    { label: { ar: 'غير نشط', en: 'Inactive' }, value: 'inactive' },
    { label: { ar: 'معلق', en: 'Suspended' }, value: 'suspended' },
    { label: { ar: 'ملغي', en: 'Canceled' }, value: 'canceled' },
    { label: { ar: 'غير مصرح', en: 'Unauthorized' }, value: 'unauthorized' }
];

export default function EditEntity({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateEntityMutation();

    const {
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
    } = useApiCalls();

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
                    status: statusOptions,
                    activity_ids: activitiesData?.data
                }}
            />
        </Modal>
    );
}
