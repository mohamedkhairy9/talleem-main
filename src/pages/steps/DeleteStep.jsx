import { useDeleteStepMutation } from '@/api/hooks/useSteps';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteStep({ onClose, id }) {
    const { mutate, isPending } = useDeleteStepMutation();

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

