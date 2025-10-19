import React from 'react';
import FormEducationProgramEntityType from './FormEducationProgramEntityType';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateEducationProgramEntityTypeMutation } from '@/api/hooks/useEducationProgramEntityTypes';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateEducationProgramEntityType({ onClose }) {
    const { mutate, isPending } = useCreateEducationProgramEntityTypeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="education_program_entity_types.create"
            />
            <FormEducationProgramEntityType
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
