import { useDeleteAcademicQualificationMutation } from '@/api/hooks/useAcademicQualifications';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteAcademicQualification({ onClose, id }) {
    const { mutate, isPending } = useDeleteAcademicQualificationMutation();

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