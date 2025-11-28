import React from 'react';
import FormWarning from './FormWarning';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateWarningMutation } from '@/api/hooks/useWarnings';
import { apiCalls, warningsDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateWarning({ onClose }) {
    const { mutate, isPending } = useCreateWarningMutation();

    const {
        branchesData,
        entitiesData,
        mainProgramsData,
        studentsData,
        teachersData,
        warningReasonsData,
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
            <FormWarning
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    warning_type: warningTypeOptions,
                    program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data,
                    entity_id: entitiesData?.data,
                    student_id: studentsData?.data,
                    teacher_id: teachersData?.data,
                    warning_reason_id: warningReasonsData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={warningsDefaultValues}
            />
        </Modal>
    );
}
