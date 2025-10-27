import React from 'react';
import FormQuoranPart from './FormQuoranPart';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateQuoranPartMutation } from '@/api/hooks/useQuoranParts';

export default function CreateQuoranPart({ onClose }) {
    const { mutate, isPending } = useCreateQuoranPartMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="quoran_parts.create" />
            <FormQuoranPart
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
