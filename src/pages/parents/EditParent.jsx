import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormParent from './FormParent';
import { useUpdateParentMutation } from '@/api/hooks/useParents';

export default function EditParent({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateParentMutation();

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader header="parents.update" onClose={onClose} />
            <FormParent
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{}}
            />
        </Modal>
    );
}
