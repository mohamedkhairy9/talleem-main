import { useUpdateWarningMutation } from '@/api/hooks/useWarnings';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React, { useMemo } from 'react';
import FormWarning from './FormWarning';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { normalizeWarningRowData } from './warningFormHelpers';

const warningTypeOptions = [
    { id: 'student', name: 'إنذار طالب' },
    { id: 'teacher', name: 'إنذار معلم' },
    { id: 'entity', name: 'إنذار جهة' }
];

export default function EditWarning({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateWarningMutation();
    const { branchesData, mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    const normalizedOldData = useMemo(() => normalizeWarningRowData(oldData), [oldData]);

    const options = useMemo(() => {
        const o = {
            warning_type: warningTypeOptions,
            program_id: mainProgramsData?.data,
            branch_id: branchesData?.data,
            status: enabledDisabledOptions
        };
        if (normalizedOldData?.entity) o.entity_id = [normalizedOldData.entity];
        if (normalizedOldData?.student) o.student_id = [normalizedOldData.student];
        if (normalizedOldData?.teacher) o.teacher_id = [normalizedOldData.teacher];
        if (normalizedOldData?.warning_reason) o.warning_reason_id = [normalizedOldData.warning_reason];
        return o;
    }, [mainProgramsData?.data, branchesData?.data, normalizedOldData?.entity, normalizedOldData?.student, normalizedOldData?.teacher, normalizedOldData?.warning_reason]);

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="warnings.update" />
            <ErrorBoundary>
                <FormWarning
                    oldData={normalizedOldData}
                    mutate={mutate}
                    isPending={isPending}
                    onClose={onClose}
                    editMode={true}
                    options={options}
                />
            </ErrorBoundary>
        </Modal>
    );
}
