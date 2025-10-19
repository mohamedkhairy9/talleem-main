import { useUpdateJobMutation } from '@/api/hooks/useJobs';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormJob from './FormJob';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditJob({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateJobMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="jobs.create" />
            <FormJob
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
