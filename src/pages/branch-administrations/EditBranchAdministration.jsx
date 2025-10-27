import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormBranchAdministration from './FormBranchAdministration';
import { useUpdateBranchAdministrationMutation } from '@/api/hooks/useBranchAdministrations';
import { useBranchAdministrationQuery } from '@/api/hooks/useBranchAdministrations';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';

export default function EditBranchAdministration({ onClose, oldData }) {
    const { data, isLoading } = useBranchAdministrationQuery(oldData?.id);
    const { mutate, isPending } = useUpdateBranchAdministrationMutation();
    const { data: branchesData } = useBranchesQuery({ per_page: 0 });
    const { data: usersData } = useUsersQuery({ per_page: 0 });

    const options = {
        branch_id: branchesData?.data || [],
        user_id: usersData?.data || []
    };

    const formData = data?.data
        ? {
              ...data.data,
              branch_id: data.data.branch?.id,
              user_id: data.data.user?.id
          }
        : oldData;

    if (isLoading) return <Loader />;

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader
                header="branch_administrations.update"
                onClose={onClose}
            />
            <FormBranchAdministration
                onClose={onClose}
                oldData={formData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={options}
            />
        </Modal>
    );
}
