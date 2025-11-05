import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateRemotelyAttendancePlatformMutation } from '@/api/hooks/useRemotelyAttendancePlatforms';
import FormRemotelyAttendancePlatform from './FormRemotelyAttendancePlatform';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditRemotelyAttendancePlatform({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateRemotelyAttendancePlatformMutation();
    console.log("old data: ", oldData)
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="remotely_attendance_platforms.update" />
            <FormRemotelyAttendancePlatform
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
