import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormParent from './FormParent';
import { useCreateParentMutation } from '@/api/hooks/useParents';
import { parentsDefaultValues } from './configs';

export default function CreateParent({ onClose }) {
    const { mutate, isPending } = useCreateParentMutation();

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader header="parents.create" onClose={onClose} />
            <FormParent
                onClose={onClose}
                oldData={parentsDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{}}
            />
        </Modal>
    );
}
