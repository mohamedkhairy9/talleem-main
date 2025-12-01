import React, { useState } from 'react';
import FormBranch from './FormBranch';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateBranchMutation } from '@/api/hooks/useBranches';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNeighborhoodsQuery } from '@/api/hooks/useNeighborhoods';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateBranch({ onClose }) {
    const [selectedCityId, setSelectedCityId] = useState(null);
    const { mutate, isPending } = useCreateBranchMutation();
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: neighborhoodsData, isLoading: neighborhoodsLoading } =
        useNeighborhoodsQuery(
            selectedCityId ? { city_id: selectedCityId } : allData
        );

    if (citiesLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="branches.create" />
            <FormBranch
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                onCityChange={setSelectedCityId}
                neighborhoodsLoading={neighborhoodsLoading}
                options={{
                    city_id: citiesData?.data,
                    neighborhood_id: neighborhoodsData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
