import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormWarning from './FormWarning';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';

export default function ViewWarning({ onClose, oldData }) {
    console.log('oldData', oldData);

    const {
        branchesData,
        mainProgramsData,
        studentsData,
        teachersData,
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
            <ModalHeader onClose={onClose} header="warnings.view" />
            <FormWarning
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    warning_type: warningTypeOptions,
                    program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data,
                    student_id: studentsData?.data,
                    teacher_id: teachersData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
