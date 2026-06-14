import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormGeneralHoliday from './FormGeneralHoliday';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewGeneralHoliday({ onClose, oldData }) {
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="general_holidays.view" />
            <FormGeneralHoliday
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
