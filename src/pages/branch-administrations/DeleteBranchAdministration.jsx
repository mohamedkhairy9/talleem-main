import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteBranchAdministrationMutation } from '@/api/hooks/useBranchAdministrations';

export default function DeleteBranchAdministration({ onClose, id }) {
    const { mutate, isPending } = useDeleteBranchAdministrationMutation();

    const handleDelete = () => {
        mutate(id, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <DeleteModal
            deleteFn={handleDelete}
            loading={isPending}
            onClose={onClose}
        />
    );
}
