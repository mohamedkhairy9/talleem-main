import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormBranchAdministration from './FormBranchAdministration';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';

export default function ViewBranchAdministration({ onClose, oldData }) {
    const { data: branchesData, isLoading: branchesLoading } = useBranchesQuery(
        { per_page: 0 }
    );
    const { data: usersData, isLoading: usersLoading } = useUsersQuery({
        per_page: 0
    });

    const options = {
        branch_id: branchesData?.data || [],
        user_id: usersData?.data || []
    };

    const isLoading = branchesLoading || usersLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader
                header="branch_administrations.view"
                onClose={onClose}
            />
            <FormBranchAdministration
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={options}
            />
        </Modal>
    );
}
