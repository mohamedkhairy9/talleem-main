import { useDeleteQuoranPartMutation } from '@/api/hooks/useQuoranParts';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteQuoranPart({ onClose, id }) {
    const { mutate, isPending } = useDeleteQuoranPartMutation();

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
