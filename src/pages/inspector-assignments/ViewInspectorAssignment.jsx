import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import FormInspectorAssignment from './Forminspectorassignment';

export default function ViewInspectorAssignment({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { branchesData, entitiesData, usersData, mainProgramsData, isLoading } = useApiCalls({
        apiCalls
    });

    if (isLoading) return <Loader />;

    const assignmentTypeOptions = [
        { id: 'regular', name: 'إشراف تربوي اعتيادي' },
        { id: 'committee', name: 'تشكيل لجنة إشراف' }
    ];

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="inspector_assignments.view" />
            <FormInspectorAssignment
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    assignment_type: assignmentTypeOptions,
                    main_program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data,
                    entity_ids: entitiesData?.data,
                    supervisor_ids: usersData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}