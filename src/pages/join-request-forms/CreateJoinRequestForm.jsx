import React from 'react';
import FormJoinRequestForm from './FormJoinRequestForm';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateJoinRequestFormMutation } from '@/api/hooks/useJoinRequestForms';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateJoinRequestForm({ onClose }) {
    const { mutate, isPending } = useCreateJoinRequestFormMutation();

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="join_request_forms.create" />
            <FormJoinRequestForm
                onClose={onClose}
                oldData={{
                    name: { en: '', ar: '' },
                    description: { en: '', ar: '' },
                    data: { fields: [] },
                    status: true
                }}
                mutate={mutate}
                isPending={isPending}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}

