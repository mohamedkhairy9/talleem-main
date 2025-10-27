import React from 'react';
import FormRole from './FormRole';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateRoleMutation } from '@/api/hooks/useRoles';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateRole({ onClose }) {
    const { mutate, isPending } = useCreateRoleMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="roles.create" />
            <FormRole
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
