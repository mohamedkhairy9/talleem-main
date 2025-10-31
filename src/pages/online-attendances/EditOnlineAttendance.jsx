import React from 'react';
import FormOnlineAttendance from './FormOnlineAttendance';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateOnlineAttendanceMutation } from '@/api/hooks/useOnlineAttendances';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { attendanceTypeOptions } from './configs';
import { allData } from '@/utils/constants/global.constants';

export default function EditOnlineAttendance({ onClose, oldData }) {
    console.log("old data: ", oldData);
    const { mutate, isPending } = useUpdateOnlineAttendanceMutation();
    const { data: usersData } = useUsersQuery(allData);

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="online_attendances.edit" />
            <FormOnlineAttendance
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    attendance_type: attendanceTypeOptions,
                    user_id: usersData?.data || []
                }}
            />
        </Modal>
    );
}
