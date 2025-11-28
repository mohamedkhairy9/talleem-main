import { useDeleteMainProgramMutation } from '@/api/hooks/useMainPrograms';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteMainProgram({ onClose, id }) {
    const { mutate, isPending } = useDeleteMainProgramMutation();

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
