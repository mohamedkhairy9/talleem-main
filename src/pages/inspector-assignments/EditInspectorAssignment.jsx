import { useUpdateInspectorAssignmentMutation } from '@/api/hooks/useInspectorAssignments';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormInspectorAssignment from './FormInspectorAssignment';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';

export default function EditInspectorAssignment({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateInspectorAssignmentMutation();

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
            <ModalHeader onClose={onClose} header="inspector_assignments.update" />
            <FormInspectorAssignment
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
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