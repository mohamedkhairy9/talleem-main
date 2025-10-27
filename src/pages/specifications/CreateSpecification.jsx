import React from 'react';
import FormSpecification from './FormSpecification';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateSpecificationMutation } from '@/api/hooks/useSpecifications';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateSpecification({ onClose }) {
    const { mutate, isPending } = useCreateSpecificationMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="specifications.create" />
            <FormSpecification
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
