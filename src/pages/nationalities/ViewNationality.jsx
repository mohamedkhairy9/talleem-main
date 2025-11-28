import React from 'react';
import FormNationality from './FormNationality';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { enabledDisabledOptions } from '@/utils/constants/options';

import { useCountriesQuery } from '@/api/hooks/useCountries';
import { allData } from '@/utils/constants/global.constants';
import Loader from '@/components/common/Loader';

export default function ViewNationality({ onClose, oldData }) {
    const { data: countriesData, isLoading } = useCountriesQuery(allData);
    if (isLoading) return <Loader />;
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="nationalities.view" />
            <FormNationality
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}} // No mutation needed for view mode
                isPending={false}
                options={{
                    country_id: countriesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
