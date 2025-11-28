import { useDeleteActivityMutation } from '@/api/hooks/useActivities';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteActivity({ onClose, id }) {
    const { mutate, isPending } = useDeleteActivityMutation();

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
