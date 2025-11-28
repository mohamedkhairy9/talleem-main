import { useUpdateKinshipMutation } from '@/api/hooks/useKinships';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormKinship from './FormKinship';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewKinship({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="kinships.view" />
            <FormKinship
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
