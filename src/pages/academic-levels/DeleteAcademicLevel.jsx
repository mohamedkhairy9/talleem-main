import { useDeleteAcademicLevelMutation } from '@/api/hooks/useAcademicLevels';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteAcademicLevel({ onClose, id }) {
    const { mutate, isPending } = useDeleteAcademicLevelMutation();

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
