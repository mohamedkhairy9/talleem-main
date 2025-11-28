import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormBranchAdministration from './FormBranchAdministration';
import { useUpdateBranchAdministrationMutation } from '@/api/hooks/useBranchAdministrations';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';

export default function EditBranchAdministration({ onClose, oldData }) {
    console.log("old data:", oldData)
    const { mutate, isPending } = useUpdateBranchAdministrationMutation();
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
