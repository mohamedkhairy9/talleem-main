import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteEntityMutation } from '@/api/hooks/useEntities';

export default function DeleteEntity({ onClose, id }) {
    const { mutate, isPending } = useDeleteEntityMutation();

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
