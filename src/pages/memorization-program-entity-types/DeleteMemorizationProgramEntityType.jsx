import { useDeleteMemorizationProgramEntityTypeMutation } from '@/api/hooks/useMemorizationProgramEntityTypes';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteMemorizationProgramEntityType({ onClose, id }) {
    const { mutate, isPending } =
        useDeleteMemorizationProgramEntityTypeMutation();

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
