import React, { useMemo } from 'react';
import FormJoinRequestForm from './FormJoinRequestForm';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateJoinRequestFormMutation } from '@/api/hooks/useJoinRequestForms';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import { useJoinRequestFormQuery } from '@/api/hooks/useJoinRequestForms';

export default function EditJoinRequestForm({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateJoinRequestFormMutation();
    const { data: formData, isLoading } = useJoinRequestFormQuery(oldData?.id);

    // Normalize data structure - must be called before any conditional returns
    const normalizedData = useMemo(() => {
        // Axios interceptor extracts response.data, so formData is the form object
        // Handle both: direct form object or wrapped in { data: {...} }
        const form = formData?.id ? formData : (formData?.data || formData);
        
        if (!form || !form.id) return oldData;

        // Ensure data.fields exists and is an array
        const normalized = {
            ...form,
            data: {
                fields: form.data?.fields || []
            },
            // Convert status from number to boolean if needed
            status: typeof form.status === 'number' ? form.status === 1 : form.status
        };

        // Normalize field labels - handle both string and object formats
        if (normalized.data.fields) {
            normalized.data.fields = normalized.data.fields.map(field => ({
                ...field,
                label: typeof field.label === 'string' 
                    ? { en: field.label, ar: field.label }
                    : field.label || { en: '', ar: '' }
            }));
        }

        // Normalize name and description
        if (typeof normalized.name === 'string') {
            normalized.name = { en: normalized.name, ar: normalized.name };
        }
        if (normalized.description && typeof normalized.description === 'string') {
            normalized.description = { en: normalized.description, ar: normalized.description };
        }

        return normalized;
    }, [formData, oldData]);

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="join_request_forms.edit" />
            <FormJoinRequestForm
                oldData={normalizedData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}

