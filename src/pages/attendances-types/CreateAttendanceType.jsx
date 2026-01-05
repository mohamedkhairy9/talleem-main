import React from 'react';
import FormAttendanceType from './FormAttendanceType';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateAttendanceTypeMutation } from '@/api/hooks/useAttendanceTypes';
import { enabledDisabledOptions, yesNoOptions } from '@/utils/constants/options';

export default function CreateAttendanceType({ onClose }) {
    const { mutate, isPending } = useCreateAttendanceTypeMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="absences_types.create" />
            <FormAttendanceType
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions,
                    with_excuse: yesNoOptions
                }}
                oldData={{ status: true, with_excuse: false }}
            />
        </Modal>
    );
}
