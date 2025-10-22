import React from 'react';
import FormNationality from './FormNationality';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateNationalityMutation } from '@/api/hooks/useNationalities';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useCountriesQuery } from '@/api/hooks/useCountries';
import { allData } from '@/utils/constants/global.constants';
import Loader from '@/components/common/Loader';


export default function EditNationality({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateNationalityMutation();
    const { data: countriesData, isLoading } = useCountriesQuery(allData);

    if (isLoading) return <Loader />;
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="nationalities.edit" />
            <FormNationality
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    country_id: countriesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
