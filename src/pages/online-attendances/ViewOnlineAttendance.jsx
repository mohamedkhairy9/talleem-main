import React from 'react';
import FormOnlineAttendance from './FormOnlineAttendance';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { attendanceTypeOptions } from './configs';
import { allData } from '@/utils/constants/global.constants';

export default function ViewOnlineAttendance({ onClose, oldData }) {
    const { data: usersData } = useUsersQuery(allData);

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="online_attendances.view" />
            <FormOnlineAttendance
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}} // No mutation needed for view mode
                isPending={false}
                options={{
                    attendance_type: attendanceTypeOptions,
                    user_id: usersData?.data || []
                }}
            />
        </Modal>
    );
}
