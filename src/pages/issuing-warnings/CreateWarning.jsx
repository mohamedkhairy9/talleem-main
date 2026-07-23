import React from 'react';
import FormWarning from './FormWarning';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateWarningMutation } from '@/api/hooks/useWarnings';
import { apiCalls, warningsDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { enabledDisabledOptions } from '@/utils/constants/options';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useUserStore } from '@/utils/stores/user.store';
import { getBranchManagerAssignedBranchId } from '@/utils/helpers/branchManagerScope';

export default function CreateWarning({ onClose }) {
    const { mutate, isPending } = useCreateWarningMutation();
    const currentUser = useUserStore(state => state.user);
    const assignedBranchId = getBranchManagerAssignedBranchId(currentUser);

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
            <ModalHeader onClose={onClose} header="warnings.create" />
            <ErrorBoundary>
                <FormWarning
                    mutate={mutate}
                    isPending={isPending}
                    onClose={onClose}
                    options={{
                        warning_type: warningTypeOptions,
                        program_id: mainProgramsData?.data,
                        branch_id: assignedBranchId
                            ? (branchesData?.data || []).filter(
                                  branch => String(branch.id) === String(assignedBranchId)
                              )
                            : branchesData?.data,
                        status: enabledDisabledOptions
                    }}
                    oldData={{
                        ...warningsDefaultValues,
                        branch_id: assignedBranchId || ''
                    }}
                    assignedBranchId={assignedBranchId}
                />
            </ErrorBoundary>
        </Modal>
    );
}
