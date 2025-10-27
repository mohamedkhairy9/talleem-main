import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteEntityManagerMutation } from '@/api/hooks/useEntityManagers';

export default function DeleteEntityManager({ onClose, id }) {
    const { mutate, isPending } = useDeleteEntityManagerMutation();

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
