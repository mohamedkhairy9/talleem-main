import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteParentMutation } from '@/api/hooks/useParents';

export default function DeleteParent({ onClose, id }) {
    const { mutate, isPending } = useDeleteParentMutation();

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
