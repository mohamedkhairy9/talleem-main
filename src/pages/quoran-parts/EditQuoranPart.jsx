import { useUpdateQuoranPartMutation } from '@/api/hooks/useQuoranParts';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormQuoranPart from './FormQuoranPart';

export default function EditQuoranPart({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateQuoranPartMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="quoran_parts.update" />
            <FormQuoranPart
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
            />
        </Modal>
    );
}
