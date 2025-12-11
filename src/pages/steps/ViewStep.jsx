import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormStep from './FormStep';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import { useStepQuery } from '@/api/hooks/useSteps';
import { useJoinRequestFormsQuery } from '@/api/hooks/useJoinRequestForms';
import i18next from 'i18next';

export default function ViewStep({ onClose, stepId }) {
    const { data: stepData, isLoading: isLoadingStep } = useStepQuery(stepId);
    const { data: joinRequestFormsData } = useJoinRequestFormsQuery();

    if (isLoadingStep) return <Loader />;

    // Handle nested data structure: { data: { data: {...} } } or { data: {...} }
    const step = stepData?.data?.data || stepData?.data || stepData;

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
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="steps.view" />
            <FormStep
                oldData={step}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions,
                    join_request_form_id: joinRequestFormOptions,
                    step_type: stepTypeOptions,
                    assigned_to_type: assignedToTypeOptions
                    // assigned_to_id will be populated dynamically in FormStep based on assigned_to_type
                }}
            />
        </Modal>
    );
}

