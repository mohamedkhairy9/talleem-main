import React from 'react';
import FormUser from './FormUser';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateUserMutation } from '@/api/hooks/useUsers';
import { usersDefaultValues } from './configs';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';

export default function CreateUser({ onClose }) {
    const { mutate, isPending } = useCreateUserMutation();
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);

    if (branchesLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="users.create" />
            <FormUser
                onClose={onClose}
                oldData={usersDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    branch_id: branchesData?.data
                }}
            />
        </Modal>
    );
}
