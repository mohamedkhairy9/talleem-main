import React from 'react';
import FormStep from './FormStep';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateStepMutation } from '@/api/hooks/useSteps';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateStep({ onClose, phaseId, requestTypeId, currentStepsCount = 0, onStepCreated }) {
    const { mutate, isPending } = useCreateStepMutation();

    // Get the next order number
    const getNextOrder = () => {
        return currentStepsCount + 1;
    };

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
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="steps.create" />
            <FormStep
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions,
                    step_type: stepTypeOptions,
                    assigned_to_type: assignedToTypeOptions
                }}
                onStepCreated={onStepCreated}
                oldData={{ 
                    phase_id: phaseId,
                    status: true,
                    order: getNextOrder()
                }}
            />
        </Modal>
    );
}

