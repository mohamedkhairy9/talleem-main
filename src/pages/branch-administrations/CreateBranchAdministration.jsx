import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormBranchAdministration from './FormBranchAdministration';
import { useCreateBranchAdministrationMutation } from '@/api/hooks/useBranchAdministrations';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';
import { branchAdministrationsDefaultValues } from './configs';

export default function CreateBranchAdministration({ onClose }) {
    const { mutate, isPending } = useCreateBranchAdministrationMutation();
    const { data: branchesData, isLoading: branchesLoading } = useBranchesQuery(
        { per_page: 0 }
    );
    const { data: usersData, isLoading: usersLoading } = useUsersQuery({
        per_page: 0
    });

    const isLoading = branchesLoading || usersLoading;

    const options = {
        branch_id: branchesData?.data || [],
        user_id: usersData?.data || []
    };

    if (isLoading) return <Loader />;

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader
                header="branch_administrations.create"
                onClose={onClose}
            />
            <FormBranchAdministration
                onClose={onClose}
                oldData={branchAdministrationsDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={options}
            />
        </Modal>
    );
}
