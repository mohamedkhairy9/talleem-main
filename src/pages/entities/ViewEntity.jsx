import React from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import { enabledDisabledOptions, genderOptions } from '@/utils/constants/options';

const statusOptions = [
    { label: { ar: 'نشط', en: 'Active' }, value: 'active' },
    { label: { ar: 'معلق', en: 'Suspended' }, value: 'suspended' },
    { label: { ar: 'ملغي', en: 'Canceled' }, value: 'canceled' },
    { label: { ar: 'غير مصرح', en: 'Unauthorized' }, value: 'unauthorized' }
];

export default function ViewEntity({ onClose, oldData }) {
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
        memorizationProgramEntityTypesData,
        nationalitiesData,
        academicLevelsData,
        specificationsData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="entities.view" />
            <FormEntity
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
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
                    activity_ids: activitiesData?.data,
                    memorization_program_entity_type_id:
                        memorizationProgramEntityTypesData?.data,
                    nationality_id: nationalitiesData?.data,
                    academic_level_id: academicLevelsData?.data,
                    specification_id: specificationsData?.data,
                    gender: genderOptions,
                    'manager.city_id': citiesData?.data,
                    'manager.nationality_id': nationalitiesData?.data,
                    'manager.academic_level_id': academicLevelsData?.data,
                    'manager.specification_id': specificationsData?.data,
                    'manager.gender': genderOptions,
                    'manager.status': enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
