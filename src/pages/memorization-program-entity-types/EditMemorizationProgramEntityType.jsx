import { useUpdateMemorizationProgramEntityTypeMutation } from '@/api/hooks/useMemorizationProgramEntityTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormMemorizationProgramEntityType from './FormMemorizationProgramEntityType';

export default function EditMemorizationProgramEntityType({
    onClose,
    oldData
}) {
    console.log('oldData', oldData);

    const { mutate, isPending } =
        useUpdateMemorizationProgramEntityTypeMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="memorization_program_entity_types.update"
            />
            <FormMemorizationProgramEntityType
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
            />
        </Modal>
    );
}
