import React, { useMemo } from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useEntityQuery, useUpdateEntityMutation } from '@/api/hooks/useEntities';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import {
    enabledDisabledOptions,
    genderOptions
} from '@/utils/constants/options';
import { normalizeSessionModeOptions } from '@/utils/helpers/sessionModeLabels';
import { useEntityManagersQuery } from '@/api/hooks/useEntityManagers';
import { allData } from '@/utils/constants/global.constants';
import { getEntityPermitFormData } from './entityPermitDetails';

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

export default function EditEntity({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateEntityMutation();
    const { data: entityDetailsResponse, isLoading: isEntityDetailsLoading } =
        useEntityQuery(oldData?.id, { enabled: !!oldData?.id });
    const { data: entityManagersData, isLoading: entityManagersLoading } =
        useEntityManagersQuery({ ...allData, status: true });

    const detailedEntity = entityDetailsResponse?.data || entityDetailsResponse || null;
    const resolvedOldData = useMemo(() => {
        const permitData = detailedEntity
            ? getEntityPermitFormData(detailedEntity, oldData)
            : {};

        return {
            ...oldData,
            // The table can expose a derived license status. In edit mode we
            // must always keep the entity's real status and registration date
            // from its details record.
            ...(detailedEntity
                ? {
                      status: detailedEntity.status ?? oldData?.status,
                      registration_date:
                          permitData.registration_date ??
                          oldData?.registration_date
                  }
                : {}),
            ...permitData
        };
    }, [detailedEntity, oldData]);

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
    } = useApiCalls({ apiCalls, mainProgramId: resolvedOldData?.main_program_id });

    if (isLoading || entityManagersLoading || isEntityDetailsLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="entities.edit" />
            <FormEntity
                onClose={onClose}
                oldData={{
                    ...resolvedOldData,
                    entity_manager_id: resolvedOldData?.manager?.id ?? ''
                }}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
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
                    academic_level_id: academicLevelsData?.data,
                    specification_id: specificationsData?.data,
                    gender: genderOptions,
                    session_mode_id: normalizeSessionModeOptions(sessionModesData?.data),
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
