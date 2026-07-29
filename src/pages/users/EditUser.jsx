import React from 'react';
import FormUser from './FormUser';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateUserMutation, useUserQuery } from '@/api/hooks/useUsers';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { mergeUserFormData } from './userFormData';

export default function EditUser({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateUserMutation();
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: userDetails, isLoading: userDetailsLoading } = useUserQuery(
        oldData?.id,
        { enabled: Boolean(oldData?.id) }
    );
    const formData = mergeUserFormData(oldData, userDetails);

    if (branchesLoading || userDetailsLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="users.edit" />
            <FormUser
                onClose={onClose}
                oldData={formData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    branch_id: branchesData?.data
                }}
            />
        </Modal>
    );
}
