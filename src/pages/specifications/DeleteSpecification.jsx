import { useDeleteSpecificationMutation } from '@/api/hooks/useSpecifications';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteSpecification({ onClose, id }) {
    const { mutate, isPending } = useDeleteSpecificationMutation();

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
