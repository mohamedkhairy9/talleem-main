import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteExamSegmentsCountMutation } from '@/api/hooks/useExamSegmentsCount';

export default function DeleteExamSegmentsCount({ onClose, id }) {
    const { mutate, isPending } = useDeleteExamSegmentsCountMutation();

    const handleDelete = () => {
        mutate(id, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <DeleteModal
            deleteFn={handleDelete}
            loading={isPending}
            onClose={onClose}
        />
    );
}