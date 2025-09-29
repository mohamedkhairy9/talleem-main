import { useUpdateAcademicLevelMutation } from '@/api/hooks/useAcademicLevels';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAcademicLevel from './FormAcademicLevel';

export default function EditAcademicLevel({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateAcademicLevelMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_levels.update" />
            <FormAcademicLevel
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
            />
        </Modal>
    );
}
