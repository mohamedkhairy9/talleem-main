import React from 'react';
import FormBranch from './FormBranch';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateBranchMutation } from '@/api/hooks/useBranches';
import { useCitiesQuery } from '@/api/hooks/useCities';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateBranch({ onClose }) {
    const { mutate, isPending } = useCreateBranchMutation();
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);

    if (citiesLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="branches.create" />
            <FormBranch
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    city_id: citiesData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true, city_id: [] }}
            />
        </Modal>
    );
}
