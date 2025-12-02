import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormBranchAdministration from './FormBranchAdministration';
import { useUpdateBranchAdministrationMutation } from '@/api/hooks/useBranchAdministrations';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditBranchAdministration({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateBranchAdministrationMutation();
    const { data: branchesData, isLoading: branchesLoading } = useBranchesQuery(allData);

    if (branchesLoading) return <Loader />;

    const options = {
        branch_id: branchesData?.data || [],
        status: enabledDisabledOptions
    };

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader
                header="branch_administrations.update"
                onClose={onClose}
            />
            <FormBranchAdministration
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={options}
            />
        </Modal>
    );
}
