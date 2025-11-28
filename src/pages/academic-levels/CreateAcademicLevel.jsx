import React from 'react';
import FormAcademicLevel from './FormAcademicLevel';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateAcademicLevelMutation } from '@/api/hooks/useAcademicLevels';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateAcademicLevel({ onClose }) {
    const { mutate, isPending } = useCreateAcademicLevelMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_levels.create" />
            <FormAcademicLevel
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
