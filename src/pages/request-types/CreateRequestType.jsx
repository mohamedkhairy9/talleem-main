import React from 'react';
import FormRequestType from './FormRequestType';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateRequestTypeMutation } from '@/api/hooks/useRequestTypes';

export default function CreateRequestType({ onClose }) {
    const { mutate, isPending } = useCreateRequestTypeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="request_types.create" />
            <FormRequestType
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{}}
                oldData={{}}
            />
        </Modal>
    );
}

