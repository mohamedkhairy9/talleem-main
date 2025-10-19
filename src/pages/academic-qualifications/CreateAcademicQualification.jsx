import React from 'react';
import FormAcademicQualification from './FormAcademicQualification';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateAcademicQualificationMutation } from '@/api/hooks/useAcademicQualifications';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateAcademicQualification({ onClose }) {
    const { mutate, isPending } = useCreateAcademicQualificationMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header="academic_qualifications.create"
            />
            <FormAcademicQualification
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
