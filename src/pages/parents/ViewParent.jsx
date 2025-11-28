import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormParent from './FormParent';

export default function ViewParent({ onClose, oldData }) {
    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader header="parents.view" onClose={onClose} />
            <FormParent
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{}}
            />
        </Modal>
    );
}
