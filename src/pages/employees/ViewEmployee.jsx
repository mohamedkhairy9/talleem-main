import React from 'react';
import FormEmployee from './FormEmployee';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewEmployee({ onClose, oldData }) {
    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="employees.view" />
            <FormEmployee
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
