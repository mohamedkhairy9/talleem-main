import React from 'react';
import FormCity from './FormCity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateCityMutation } from '@/api/hooks/useCities';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateCity({ onClose }) {
    const { mutate, isPending } = useCreateCityMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="cities.create" />
            <FormCity
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
