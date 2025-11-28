import React from 'react';
import FormKinship from './FormKinship';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateKinshipMutation } from '@/api/hooks/useKinships';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateKinship({ onClose }) {
    const { mutate, isPending } = useCreateKinshipMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="kinships.create" />
            <FormKinship
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
