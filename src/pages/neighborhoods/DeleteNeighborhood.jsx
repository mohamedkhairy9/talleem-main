import { useDeleteNeighborhoodMutation } from '@/api/hooks/useNeighborhoods';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteNeighborhood({ onClose, id }) {
    const { mutate, isPending } = useDeleteNeighborhoodMutation();

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
