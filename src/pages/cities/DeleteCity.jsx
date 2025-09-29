import { useDeleteCityMutation } from '@/api/hooks/useCities';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteCity({ onClose, id }) {
    const { mutate, isPending } = useDeleteCityMutation();

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