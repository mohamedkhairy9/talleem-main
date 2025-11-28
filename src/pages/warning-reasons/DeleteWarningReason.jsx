import { useDeleteWarningReasonMutation } from '@/api/hooks/useWarningReasons';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteWarningReason({ onClose, id }) {
    const { mutate, isPending } = useDeleteWarningReasonMutation();

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