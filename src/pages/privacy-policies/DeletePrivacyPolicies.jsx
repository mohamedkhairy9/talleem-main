import { useDeletePrivacyPoliciesMutation } from '@/api/hooks/usePrivacyPolicies';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeletePrivacyPolicies({ onClose }) {
    const { mutate, isPending } = useDeletePrivacyPoliciesMutation();

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
