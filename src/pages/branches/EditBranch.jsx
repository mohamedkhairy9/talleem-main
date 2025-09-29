import { useUpdateBranchMutation } from '@/api/hooks/useBranches';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormBranch from './FormBranch';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNeighborhoodsQuery } from '@/api/hooks/useNeighborhoods';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';

export default function EditBranch({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateBranchMutation();
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: neighborhoodsData, isLoading: neighborhoodsLoading } =
        useNeighborhoodsQuery(allData);

    if (citiesLoading || neighborhoodsLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="branches.update" />
            <FormBranch
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    city_id: citiesData?.data,
                    neighborhood_id: neighborhoodsData?.data
                }}
            />
        </Modal>
    );
}
