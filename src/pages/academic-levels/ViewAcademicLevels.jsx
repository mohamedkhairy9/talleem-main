import { useUpdateAcademicLevelMutation } from '@/api/hooks/useAcademicLevels';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAcademicLevel from './FormAcademicLevel';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewAcademicLevel({ onClose, oldData }) {
    console.log('oldData', oldData);

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_levels.view" />
            <FormAcademicLevel
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
