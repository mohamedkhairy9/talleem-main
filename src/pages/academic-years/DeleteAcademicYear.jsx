import { useDeleteAcademicYearMutation } from '@/api/hooks/useAcademicYears';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteAcademicYear({ onClose, id }) {
    const { mutate, isPending } = useDeleteAcademicYearMutation();

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
