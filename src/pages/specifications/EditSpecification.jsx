import { useUpdateSpecificationMutation } from '@/api/hooks/useSpecifications';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormSpecification from './FormSpecification';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditSpecification({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateSpecificationMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="specifications.update" />
            <FormSpecification
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
