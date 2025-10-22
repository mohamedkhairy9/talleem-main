import { useUpdateMemorizationProgramEntityTypeMutation } from '@/api/hooks/useMemorizationProgramEntityTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormMemorizationProgramEntityType from './FormMemorizationProgramEntityType';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewMemorizationProgramEntityType({
    onClose,
    oldData
}) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="memorization_program_entity_types.view"
            />
            <FormMemorizationProgramEntityType
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
