import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateInspectorAssignmentMutation } from '@/api/hooks/useInspectorAssignments';
import { apiCalls, inspectorAssignmentsDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { enabledDisabledOptions } from '@/utils/constants/options';
import FormInspectorAssignment from './Forminspectorassignment';

export default function CreateInspectorAssignment({ onClose }) {
    const { mutate, isPending } = useCreateInspectorAssignmentMutation();

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
            <ModalHeader onClose={onClose} header="inspector_assignments.create" />
            <FormInspectorAssignment
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    assignment_type: assignmentTypeOptions,
                    main_program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data,
                    entity_ids: entitiesData?.data,
                    supervisor_ids: usersData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={inspectorAssignmentsDefaultValues}
            />
        </Modal>
    );
}