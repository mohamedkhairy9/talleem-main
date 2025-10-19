import { useUpdateSessionPeriodMutation } from '@/api/hooks/useSessionPeriods';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormSessionPeriod from './FormSessionPeriod';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditSessionPeriod({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateSessionPeriodMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="session_periods.update" />
            <FormSessionPeriod
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
