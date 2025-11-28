import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteUserMutation } from '@/api/hooks/useUsers';

export default function DeleteUser({ onClose, id }) {
    const { mutate, isPending } = useDeleteUserMutation();

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
