import { useDeleteMajorMutation } from '@/api/hooks/useMajors';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteMajor({ onClose, id }) {
    const { mutate, isPending } = useDeleteMajorMutation();

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
