import React from 'react';
import FormCountry from './FormCountry';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateCountryMutation } from '@/api/hooks/useCountries';
import { countriesDefaultValues } from './configs';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateCountry({ onClose }) {
    const { mutate, isPending } = useCreateCountryMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="countries.create" />
            <FormCountry
                onClose={onClose}
                oldData={countriesDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
