import React from 'react';
import FormSessionPeriod from './FormSessionPeriod';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateSessionPeriodMutation } from '@/api/hooks/useSessionPeriods';

export default function CreateSessionPeriod({ onClose }) {
    const { mutate, isPending } = useCreateSessionPeriodMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="session_periods.create" />
            <FormSessionPeriod
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
            />
        </Modal>
    );
}
