import { useUpdateSessionPeriodMutation } from '@/api/hooks/useSessionPeriods';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormSessionPeriod from './FormSessionPeriod';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewSessionPeriod({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="session_periods.view" />
            <FormSessionPeriod
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
