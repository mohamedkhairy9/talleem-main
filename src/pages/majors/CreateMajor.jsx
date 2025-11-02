import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { majorsDefaultValues } from './configs';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useCreateMajorMutation } from '@/api/hooks/useMajors';
import FormMajor from './FormMajor';


export default function CreateMajor({ onClose }) {
    const { mutate, isPending } = useCreateMajorMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="majors.create" />
            <FormMajor
                onClose={onClose}
                oldData={majorsDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
