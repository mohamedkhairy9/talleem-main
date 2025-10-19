import React from 'react';
import FormLocationType from './FormLocationType';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateLocationTypeMutation } from '@/api/hooks/useLocationTypes';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateLocationType({ onClose }) {
    const { mutate, isPending } = useCreateLocationTypeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="location_types.create" />
            <FormLocationType
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
