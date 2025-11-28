import React from 'react';
import FormSessionMode from './FormSessionMode';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateSessionModeMutation } from '@/api/hooks/useSessionModes';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditSessionMode({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateSessionModeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="session_modes.update" />
            <FormSessionMode
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