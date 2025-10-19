import { useUpdateLocationTypeMutation } from '@/api/hooks/useLocationTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormLocationType from './FormLocationType';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditLocationType({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateLocationTypeMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="location_types.update" />
            <FormLocationType
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
