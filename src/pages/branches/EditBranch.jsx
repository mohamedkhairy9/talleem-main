import { useUpdateBranchMutation } from '@/api/hooks/useBranches';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React, { useState } from 'react';
import FormBranch from './FormBranch';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNeighborhoodsQuery } from '@/api/hooks/useNeighborhoods';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditBranch({ onClose, oldData }) {
    console.log('oldData', oldData);

    const [selectedCityId, setSelectedCityId] = useState(oldData?.city_id || null);
    const { mutate, isPending } = useUpdateBranchMutation();
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: neighborhoodsData, isLoading: neighborhoodsLoading } =
        useNeighborhoodsQuery(
            selectedCityId ? { city_id: selectedCityId } : allData
        );

    if (citiesLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="branches.update" />
            <FormBranch
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                onCityChange={setSelectedCityId}
                neighborhoodsLoading={neighborhoodsLoading}
                options={{
                    city_id: citiesData?.data,
                    neighborhood_id: neighborhoodsData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
