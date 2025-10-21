import { useUpdateRoleMutation } from '@/api/hooks/useRoles';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormRole from './FormRole';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewRole({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="roles.view" />
            <FormRole
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
