import { useUpdateKinshipMutation } from '@/api/hooks/useKinships';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormKinship from './FormKinship';

export default function EditKinship({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateKinshipMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="kinships.update" />
            <FormKinship
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
            />
        </Modal>
    );
}
