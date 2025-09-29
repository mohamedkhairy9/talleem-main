import React from 'react';
import FormJob from './FormJob';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateJobMutation } from '@/api/hooks/useJobs';

export default function CreateJob({ onClose }) {
    const { mutate, isPending } = useCreateJobMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="jobs.create" />
            <FormJob mutate={mutate} isPending={isPending} onClose={onClose} />
        </Modal>
    );
}