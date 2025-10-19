import { useUpdateActivityMutation } from '@/api/hooks/useActivities';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormActivity from './FormActivity';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditActivity({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateActivityMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="activities.update" />
            <FormActivity
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
