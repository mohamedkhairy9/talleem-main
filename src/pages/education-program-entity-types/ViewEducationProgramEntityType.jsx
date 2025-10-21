import { useUpdateEducationProgramEntityTypeMutation } from '@/api/hooks/useEducationProgramEntityTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormEducationProgramEntityType from './FormEducationProgramEntityType';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewEducationProgramEntityType({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="education_program_entity_types.view"
            />
            <FormEducationProgramEntityType
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
