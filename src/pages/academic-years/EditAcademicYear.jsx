import { useUpdateAcademicYearMutation } from '@/api/hooks/useAcademicYears';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAcademicYear from './FormAcademicYear';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditAcademicYear({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateAcademicYearMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_years.update" />
            <FormAcademicYear
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
