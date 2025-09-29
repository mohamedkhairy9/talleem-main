import React from 'react';
import FormAcademicYear from './FormAcademicYear';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateAcademicYearMutation } from '@/api/hooks/useAcademicYears';

export default function CreateAcademicYear({ onClose }) {
    const { mutate, isPending } = useCreateAcademicYearMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_years.create" />
            <FormAcademicYear
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
            />
        </Modal>
    );
}
