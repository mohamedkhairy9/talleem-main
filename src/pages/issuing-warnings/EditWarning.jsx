import { useUpdateWarningMutation } from '@/api/hooks/useWarnings';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormWarning from './FormWarning';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function EditWarning({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateWarningMutation();

    const {
        branchesData,
        mainProgramsData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    const warningTypeOptions = [
        { id: 'student', name: 'إنذار طالب' },
        { id: 'teacher', name: 'إنذار معلم' },
        { id: 'entity', name: 'إنذار جهة' }
    ];

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="warnings.update" />
            <ErrorBoundary>
                <FormWarning
                    oldData={oldData}
                    mutate={mutate}
                    isPending={isPending}
                    onClose={onClose}
                    editMode={true}
                    options={{
                        warning_type: warningTypeOptions,
                        program_id: mainProgramsData?.data,
                        branch_id: branchesData?.data,
                        status: enabledDisabledOptions
                    }}
                />
            </ErrorBoundary>
        </Modal>
    );
}
