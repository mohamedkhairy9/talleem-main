import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteStudentMutation } from '@/api/hooks/useStudents';

export default function DeleteStudent({ onClose, id }) {
    const { mutate, isPending } = useDeleteStudentMutation();

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
