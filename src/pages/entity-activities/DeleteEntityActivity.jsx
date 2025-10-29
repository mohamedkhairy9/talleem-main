import { useDeleteEntityActivityMutation } from '@/api/hooks/useEntityActivities';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteEntityActivity({ onClose, id }) {
    const { mutate, isPending } = useDeleteEntityActivityMutation();

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
