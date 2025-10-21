import { useUpdateJobMutation } from '@/api/hooks/useJobs';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormJob from './FormJob';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewJob({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="jobs.view" />
            <FormJob
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
