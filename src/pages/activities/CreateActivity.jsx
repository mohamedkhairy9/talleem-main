import React from 'react';
import FormActivity from './FormActivity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateActivityMutation } from '@/api/hooks/useActivities';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateActivity({ onClose }) {
    const { mutate, isPending } = useCreateActivityMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="activities.create" />
            <FormActivity
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
