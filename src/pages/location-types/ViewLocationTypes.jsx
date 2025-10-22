import { useUpdateLocationTypeMutation } from '@/api/hooks/useLocationTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormLocationType from './FormLocationType';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewLocationType({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="location_types.view" />
            <FormLocationType
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
