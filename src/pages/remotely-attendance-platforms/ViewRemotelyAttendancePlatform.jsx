import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormRemotelyAttendancePlatform from './FormRemotelyAttendancePlatform';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewRemotelyAttendancePlatform({ onClose, oldData }) {

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="remotely_attendance_platforms.view" />
            <FormRemotelyAttendancePlatform
                mutate={()=>{}}
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
