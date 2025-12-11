import { useDeletePhaseMutation } from '@/api/hooks/usePhases';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeletePhase({ onClose, id }) {
    const { mutate, isPending } = useDeletePhaseMutation();

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

