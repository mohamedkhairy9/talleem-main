import { useUpdateMainProgramMutation } from '@/api/hooks/useMainPrograms';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormMainProgram from './FormMainProgram';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewMainProgram({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="main_programs.view" />
            <FormMainProgram
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
