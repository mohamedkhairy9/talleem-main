import React from 'react';
import FormOnlineAttendance from './FormOnlineAttendance';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateOnlineAttendanceMutation } from '@/api/hooks/useOnlineAttendances';
import {
    onlineAttendancesDefaultValues,
} from './configs';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateOnlineAttendance({ onClose }) {
    const { mutate, isPending } = useCreateOnlineAttendanceMutation();
    const { data: usersData } = useUsersQuery(allData);

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="online_attendances.create" />
            <FormOnlineAttendance
                onClose={onClose}
                oldData={onlineAttendancesDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    status: enabledDisabledOptions,
                    user_id: usersData?.data || []
                }}
            />
        </Modal>
    );
}
