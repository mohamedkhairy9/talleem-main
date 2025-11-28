import { useDeleteWarningMutation } from '@/api/hooks/useWarnings';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteWarning({ onClose, id }) {
    const { mutate, isPending } = useDeleteWarningMutation();

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
