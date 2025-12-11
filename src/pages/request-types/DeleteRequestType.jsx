import { useDeleteRequestTypeMutation } from '@/api/hooks/useRequestTypes';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteRequestType({ onClose, id }) {
    const { mutate, isPending } = useDeleteRequestTypeMutation();

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

