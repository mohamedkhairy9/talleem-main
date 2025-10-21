import { useUpdateActivityMutation } from '@/api/hooks/useActivities';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormActivity from './FormActivity';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewActivity({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="activities.view" />
            <FormActivity
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
