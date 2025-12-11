import { useUpdateRequestTypeMutation } from '@/api/hooks/useRequestTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormRequestType from './FormRequestType';

export default function EditRequestType({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateRequestTypeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="request_types.update" />
            <FormRequestType
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{}}
            />
        </Modal>
    );
}

