import React from 'react';
import FormGeneralHoliday from './FormGeneralHoliday';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateGeneralHolidayMutation } from '@/api/hooks/useGeneralHolidays';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateGeneralHoliday({ onClose }) {
    const { mutate, isPending } = useCreateGeneralHolidayMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="general_holidays.create" />
            <FormGeneralHoliday
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
