import React, { useMemo } from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateEntityMutation } from '@/api/hooks/useEntities';
import { apiCalls, entitiesDefaultValues } from './configs';

import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import {
    enabledDisabledOptions,
    genderOptions
} from '@/utils/constants/options';
import { normalizeSessionModeOptions } from '@/utils/helpers/sessionModeLabels';
import { useEntityManagersQuery } from '@/api/hooks/useEntityManagers';
import { useConfigurationsQuery } from '@/api/hooks/useConfigurations';
import { allData } from '@/utils/constants/global.constants';
import { resolveEntityAcceptanceAgeConfig } from './entityAcceptanceAgeConfig';

const statusOptions = [
    { label: { ar: 'مصرح', en: 'Permitted' }, value: 'active' },
    { label: { ar: 'معلق', en: 'Suspended' }, value: 'suspended' },
    { label: { ar: 'ملغاة', en: 'Cancelled' }, value: 'Cancelled' },
    { label: { ar: 'غير مصرح', en: 'Not Permitted' }, value: 'unauthorized' }
];

const entryTypeOptions = [
    { label: { ar: 'جديد بالموافقة', en: 'New with Approval' }, value: 'new_with_approval' },
    { label: { ar: 'مصرح بتصريح', en: 'Permitted with Permit' }, value: 'active_with_license' }
];

export default function CreateEntity({ onClose }) {
    const { mutate, isPending } = useCreateEntityMutation();
    const { data: entityManagersData, isLoading: entityManagersLoading } =
        useEntityManagersQuery({ ...allData, status: true });
    const { data: configurationsData, isLoading: configurationsLoading } =
        useConfigurationsQuery('tahfiz');
    const acceptanceAgeConfig = useMemo(
        () => resolveEntityAcceptanceAgeConfig(configurationsData?.data),
        [configurationsData]
    );
    const defaultEntityValues = useMemo(
        () => ({
            ...entitiesDefaultValues,
            min_acceptance_age: acceptanceAgeConfig.minStudentAge
        }),
        [acceptanceAgeConfig.minStudentAge]
    );

    const {
        branchesData,
        academicQualificationsData,
        mainProgramsData,
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
    } = useApiCalls({ apiCalls });

    if (isLoading || entityManagersLoading || configurationsLoading) {
        return <Loader />;
    }

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="entities.create" />
            <FormEntity
                onClose={onClose}
                oldData={defaultEntityValues}
                mutate={mutate}
                isPending={isPending}
                minStudentAge={acceptanceAgeConfig.minStudentAge}
                isMinStudentAgeEditable={
                    acceptanceAgeConfig.isMinStudentAgeEditable
                }
                options={{
                    entity_manager_id: entityManagersData?.data,
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
                    session_mode_id: normalizeSessionModeOptions(sessionModesData?.data),
                    academic_level_id: academicLevelsData?.data,
                    specification_id: specificationsData?.data,
                    gender: genderOptions,
                    entry_type: entryTypeOptions,
                    'manager.city_id': citiesData?.data,
                    'manager.nationality_id': nationalitiesData?.data,
                    'manager.specification_id': specificationsData?.data,
                    'manager.gender': genderOptions,
                    'manager.status': enabledDisabledOptions,
                    'manager.academic_qualification_id':
                        academicQualificationsData?.data
                }}
            />
        </Modal>
    );
}
