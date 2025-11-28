import { useDeleteAboutUsMutation } from '@/api/hooks/useAboutUs';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteAboutUs({ onClose }) {
    const { mutate, isPending } = useDeleteAboutUsMutation();

    function handleDelete() {
        mutate(undefined, {
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
