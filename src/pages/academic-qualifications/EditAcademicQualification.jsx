import { useUpdateAcademicQualificationMutation } from '@/api/hooks/useAcademicQualifications';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAcademicQualification from './FormAcademicQualification';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditAcademicQualification({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateAcademicQualificationMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_qualifications.update" />
            <FormAcademicQualification
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