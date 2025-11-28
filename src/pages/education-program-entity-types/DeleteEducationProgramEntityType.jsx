import { useDeleteEducationProgramEntityTypeMutation } from '@/api/hooks/useEducationProgramEntityTypes';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteEducationProgramEntityType({ onClose, id }) {
    const { mutate, isPending } = useDeleteEducationProgramEntityTypeMutation();

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
