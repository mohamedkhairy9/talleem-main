import { useUpdateQuoranPartMutation } from '@/api/hooks/useQuoranParts';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormQuoranPart from './FormQuoranPart';

export default function ViewQuoranPart({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="quoran_parts.view" />
            <FormQuoranPart
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
            />
        </Modal>
    );
}
