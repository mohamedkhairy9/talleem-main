import { useUpdateRoleMutation } from '@/api/hooks/useRoles';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormRole from './FormRole';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditRole({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateRoleMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="roles.create" />
            <FormRole
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
