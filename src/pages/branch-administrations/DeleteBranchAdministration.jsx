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
            onClose={onClose}
            onConfirm={handleDelete}
            isDeleting={isPending}
            title="common.delete_confirmation"
            message="common.delete_message"
        />
    );
}
