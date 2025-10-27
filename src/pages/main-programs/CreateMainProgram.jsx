import React from 'react';
import FormMainProgram from './FormMainProgram';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateMainProgramMutation } from '@/api/hooks/useMainPrograms';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateMainProgram({ onClose }) {
    const { mutate, isPending } = useCreateMainProgramMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="main_programs.create" />
            <FormMainProgram
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
