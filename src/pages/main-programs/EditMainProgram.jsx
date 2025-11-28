import { useUpdateMainProgramMutation } from '@/api/hooks/useMainPrograms';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormMainProgram from './FormMainProgram';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditMainProgram({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateMainProgramMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="main_programs.update" />
            <FormMainProgram
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
