import { useUpdateCityMutation } from '@/api/hooks/useCities';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormCity from './FormCity';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useCountriesQuery } from '@/api/hooks/useCountries';
import { allData } from '@/utils/constants/global.constants';
import Loader from '@/components/common/Loader';

export default function EditCity({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateCityMutation();
    const { data: countriesData, isLoading } = useCountriesQuery(allData);

    if (isLoading) return <Loader />;
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
                    country_id: countriesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
