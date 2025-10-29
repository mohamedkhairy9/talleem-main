import React from 'react';
import FormCity from './FormCity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateCityMutation } from '@/api/hooks/useCities';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useCountriesQuery } from '@/api/hooks/useCountries';
import { allData } from '@/utils/constants/global.constants';
import Loader from '@/components/common/Loader';

export default function CreateCity({ onClose }) {
    const { mutate, isPending } = useCreateCityMutation();
    const { data: countriesData, isLoading } = useCountriesQuery(allData);

    if (isLoading) return <Loader />;
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="cities.create" />
            <FormCity
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    country_id: countriesData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
