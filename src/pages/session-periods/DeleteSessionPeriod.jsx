import { useDeleteSessionPeriodMutation } from '@/api/hooks/useSessionPeriods';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteSessionPeriod({ onClose, id }) {
    const { mutate, isPending } = useDeleteSessionPeriodMutation();

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
