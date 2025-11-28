import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormRemotelyAttendancePlatform from './FormRemotelyAttendancePlatform';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { remotelyAttendanceplatformsDefaultValues } from './configs';
import { useCreateRemotelyAttendancePlatformMutation } from '@/api/hooks/useRemotelyAttendancePlatforms';

export default function CreateRemotelyAttendancePlatform({ onClose }) {
    const { mutate, isPending } = useCreateRemotelyAttendancePlatformMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="remotely_attendance_platforms.create" />
            <FormRemotelyAttendancePlatform
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                oldData={remotelyAttendanceplatformsDefaultValues}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
