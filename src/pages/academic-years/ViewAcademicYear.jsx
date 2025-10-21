import { useUpdateAcademicYearMutation } from '@/api/hooks/useAcademicYears';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormAcademicYear from './FormAcademicYear';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewAcademicYear({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="academic_years.view" />
            <FormAcademicYear
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
