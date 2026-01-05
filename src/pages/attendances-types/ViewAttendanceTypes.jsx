import { useUpdateAttendanceTypeMutation } from '@/api/hooks/useAttendanceTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAttendanceType from './FormAttendanceType';
import { enabledDisabledOptions, yesNoOptions } from '@/utils/constants/options';

export default function ViewAttendanceType({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="absences_types.view" />
            <FormAttendanceType
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions,
                    with_excuse: yesNoOptions
                }}
            />
        </Modal>
    );
}
