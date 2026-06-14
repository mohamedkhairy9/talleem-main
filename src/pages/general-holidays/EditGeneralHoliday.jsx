import { useUpdateGeneralHolidayMutation } from '@/api/hooks/useGeneralHolidays';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormGeneralHoliday from './FormGeneralHoliday';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditGeneralHoliday({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateGeneralHolidayMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="general_holidays.update" />
            <FormGeneralHoliday
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
