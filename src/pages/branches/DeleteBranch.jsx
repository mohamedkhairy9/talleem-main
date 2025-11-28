import { useDeleteBranchMutation } from '@/api/hooks/useBranches';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteBranch({ onClose, id }) {
    const { mutate, isPending } = useDeleteBranchMutation();

    function handleDelete() {
        mutate(id, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <DeleteModal
            deleteFn={handleDelete}
            loading={isPending}
            onClose={onClose}
        ></DeleteModal>
    );
}
