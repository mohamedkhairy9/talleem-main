import { useDeleteKinshipMutation } from '@/api/hooks/useKinships';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteKinship({ onClose, id }) {
    const { mutate, isPending } = useDeleteKinshipMutation();

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
