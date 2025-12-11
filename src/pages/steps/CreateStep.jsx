import React from 'react';
import FormStep from './FormStep';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateStepMutation } from '@/api/hooks/useSteps';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useJoinRequestFormsQuery } from '@/api/hooks/useJoinRequestForms';
import Loader from '@/components/common/Loader';

export default function CreateStep({ onClose, phaseId, currentStepsCount = 0, onStepCreated }) {
    const { mutate, isPending } = useCreateStepMutation();
    const { data: joinRequestFormsData, isLoading: isLoadingForms } = useJoinRequestFormsQuery();

    // Get the next order number
    const getNextOrder = () => {
        return currentStepsCount + 1;
    };

    if (isLoadingForms) return <Loader />;

    // Generate options for join_request_form_id
    const joinRequestFormOptions = joinRequestFormsData?.data?.map(form => ({
        label: form.name,
        value: form.id
    })) || [];

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
                    join_request_form_id: joinRequestFormOptions,
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

