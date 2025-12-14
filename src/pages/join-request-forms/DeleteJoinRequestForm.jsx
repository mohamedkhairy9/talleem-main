import { useDeleteJoinRequestFormMutation } from '@/api/hooks/useJoinRequestForms';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteJoinRequestForm({ onClose, id }) {
    const { mutate, isPending } = useDeleteJoinRequestFormMutation();

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
        />
    );
}

