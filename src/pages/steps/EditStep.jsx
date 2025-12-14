import React from 'react';
import FormStep from './FormStep';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateStepMutation } from '@/api/hooks/useSteps';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useJoinRequestFormsQuery } from '@/api/hooks/useJoinRequestForms';
import Loader from '@/components/common/Loader';

export default function EditStep({ onClose, oldData, onStepUpdated }) {
    const { mutate, isPending } = useUpdateStepMutation();
    const { data: joinRequestFormsData, isLoading: isLoadingForms } = useJoinRequestFormsQuery();

    if (isLoadingForms) return <Loader />;

    // Step type options
    const stepTypeOptions = [
        { label: 'Upload', value: 'upload' },
        { label: 'Review', value: 'review' },
        { label: 'Approval', value: 'approval' },
        { label: 'Auto', value: 'auto' }
    ];

    // Assigned to type options
    const assignedToTypeOptions = [
        { label: 'User', value: 'user' },
        { label: 'Role', value: 'role' }
    ];

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="steps.edit" />
            <FormStep
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions,
                    step_type: stepTypeOptions,
                    assigned_to_type: assignedToTypeOptions
                    // assigned_to_id will be populated dynamically in FormStep based on assigned_to_type
                }}
                onStepCreated={onStepUpdated}
            />
        </Modal>
    );
}

