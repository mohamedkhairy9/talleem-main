import { useDeleteTermsAndConditionsMutation } from '@/api/hooks/useTermsAndConditions';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteTermsAndConditions({ onClose }) {
    const { mutate, isPending } = useDeleteTermsAndConditionsMutation();

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
