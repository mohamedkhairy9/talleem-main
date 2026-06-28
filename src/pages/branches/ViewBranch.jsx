import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormBranch from './FormBranch';
import { useCitiesQuery } from '@/api/hooks/useCities';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { normalizeBranchCityValue } from './branchFormPolicy';

export default function ViewBranch({ onClose, oldData }) {
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);

    if (citiesLoading) return <Loader />;

    const normalizedOldData = {
        ...oldData,
        city_id: normalizeBranchCityValue(oldData)
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="branches.view" />
            <FormBranch
                oldData={normalizedOldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    city_id: citiesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
