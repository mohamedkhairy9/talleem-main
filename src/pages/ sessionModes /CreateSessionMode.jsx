import React from 'react';
import FormSessionMode from './FormSessionMode';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateSessionModeMutation } from '@/api/hooks/useSessionModes';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateSessionMode({ onClose }) {
    const { mutate, isPending } = useCreateSessionModeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="session_modes.create" />
            <FormSessionMode
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