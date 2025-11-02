import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { majorsDefaultValues } from './configs';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useCreateMajorMutation, useUpdateMajorMutation } from '@/api/hooks/useMajors';
import FormMajor from './FormMajor';


export default function ViewMajor({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateMajorMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="majors.view" />
            <FormMajor
                onClose={onClose}
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
