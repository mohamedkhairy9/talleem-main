import { useUpdateSpecificationMutation } from '@/api/hooks/useSpecifications';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormSpecification from './FormSpecification';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewSpecification({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="specifications.view" />
            <FormSpecification
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
