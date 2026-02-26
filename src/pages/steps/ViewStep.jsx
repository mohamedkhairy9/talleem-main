import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormStep from './FormStep';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import { useStepQuery } from '@/api/hooks/useSteps';

export default function ViewStep({ onClose, stepId }) {
    const { data: stepData, isLoading: isLoadingStep } = useStepQuery(stepId);

    if (isLoadingStep) return <Loader />;

    // Handle nested data structure: { data: { data: {...} } } or { data: {...} }
    const step = stepData?.data?.data || stepData?.data || stepData;

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
            <ModalHeader onClose={onClose} header="steps.view" />
            <FormStep
                oldData={step}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions,
                    step_type: stepTypeOptions,
                    assigned_to_type: assignedToTypeOptions
                }}
            />
        </Modal>
    );
}

