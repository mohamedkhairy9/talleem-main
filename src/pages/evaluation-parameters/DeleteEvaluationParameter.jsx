import { useDeleteEvaluationParameterMutation } from '@/api/hooks/useEvaluationParameters';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteEvaluationParameter({ onClose, id }) {
    const { mutate, isPending } = useDeleteEvaluationParameterMutation();

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