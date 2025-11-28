import { useDeleteLocationTypeMutation } from '@/api/hooks/useLocationTypes';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteLocationType({ onClose, id }) {
    const { mutate, isPending } = useDeleteLocationTypeMutation();

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
