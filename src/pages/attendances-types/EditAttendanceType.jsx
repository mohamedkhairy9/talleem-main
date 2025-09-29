import { useUpdateAttendanceTypeMutation } from '@/api/hooks/useAttendanceTypes';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAttendanceType from './FormAttendanceType';

export default function EditAttendanceType({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateAttendanceTypeMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="attendance_types.update" />
            <FormAttendanceType
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
            />
        </Modal>
    );
}
