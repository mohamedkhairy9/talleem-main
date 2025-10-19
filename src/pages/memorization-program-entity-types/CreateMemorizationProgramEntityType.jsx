import React from 'react';
import FormMemorizationProgramEntityType from './FormMemorizationProgramEntityType';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateMemorizationProgramEntityTypeMutation } from '@/api/hooks/useMemorizationProgramEntityTypes';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateMemorizationProgramEntityType({ onClose }) {
    const { mutate, isPending } =
        useCreateMemorizationProgramEntityTypeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="memorization_program_entity_types.create"
            />
            <FormMemorizationProgramEntityType
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
