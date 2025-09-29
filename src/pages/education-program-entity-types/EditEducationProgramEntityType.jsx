import { useUpdateEducationProgramEntityTypeMutation } from '@/api/hooks/useEducationProgramEntityTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormEducationProgramEntityType from './FormEducationProgramEntityType';

export default function EditEducationProgramEntityType({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateEducationProgramEntityTypeMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="education_program_entity_types.update"
            />
            <FormEducationProgramEntityType
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
            />
        </Modal>
    );
}
