import React from 'react';
import FormCountry from './FormCountry';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateCountryMutation } from '@/api/hooks/useCountries';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditCountry({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateCountryMutation();
    console.log("old data: ", oldData)
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="countries.edit" />
            <FormCountry
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
