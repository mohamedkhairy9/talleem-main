import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormRequestType from './FormRequestType';

export default function ViewRequestType({ onClose, oldData }) {
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="request_types.view" />
            <FormRequestType
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{}}
            />
        </Modal>
    );
}

