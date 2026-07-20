import React from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateEntityMutation } from '@/api/hooks/useEntities';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import {
    enabledDisabledOptions,
    genderOptions
} from '@/utils/constants/options';

const statusOptions = [
    { label: { ar: 'نشط', en: 'Active' }, value: 'active' },
    { label: { ar: 'غير نشط', en: 'Inactive' }, value: 'inactive' },
    { label: { ar: 'معلق', en: 'Suspended' }, value: 'suspended' },
    { label: { ar: 'ملغاة', en: 'Cancelled' }, value: 'Cancelled' },
    { label: { ar: 'غير مصرح', en: 'Unauthorized' }, value: 'unauthorized' }
];

const entryTypeOptions = [
    { label: { ar: 'جديد بالموافقة', en: 'New with Approval' }, value: 'new_with_approval' },
    { label: { ar: 'نشط برخصة', en: 'Active with License' }, value: 'active_with_license' }
];

export default function EditEntity({ onClose, oldData }) {
    console.log("old data: ", oldData)
    const { mutate, isPending } = useUpdateEntityMutation();

    const {
        branchesData,
        mainProgramsData,
        academicQualificationsData,
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
        sessionModesData,
        isLoading
    } = useApiCalls({ apiCalls, mainProgramId: oldData?.main_program_id });

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
                    city_id: citiesData?.data,
                    neighborhood_id: neighborhoodsData?.data,
                    location_type_id: locationTypesData?.data,
                    status: statusOptions,
                    activity_ids: activitiesData?.data,
                    memorization_program_entity_type_id:
                        memorizationProgramEntityTypesData?.data,
                    education_program_entity_type_id:
                        educationProgramEntityTypesData?.data,
                    nationality_id: nationalitiesData?.data,
                    academic_level_id: academicLevelsData?.data,
                    specification_id: specificationsData?.data,
                    gender: genderOptions,
                    session_mode_id: sessionModesData?.data,
                    entry_type: entryTypeOptions,
                    'manager.city_id': citiesData?.data,
                    'manager.nationality_id': nationalitiesData?.data,
                    'manager.specification_id': specificationsData?.data,
                    'manager.gender': genderOptions,
                    'manager.status': enabledDisabledOptions,
                    'manager.academic_qualification_id': academicQualificationsData?.data
                }}
            />
        </Modal>
    );
}