import { useUpdateCityMutation } from '@/api/hooks/useCities';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormCity from './FormCity';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditCity({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateCityMutation();
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="cities.edit" />
            <FormCity
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
