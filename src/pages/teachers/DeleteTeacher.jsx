import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteTeacherMutation } from '@/api/hooks/useTeachers';

export default function DeleteTeacher({ onClose, id }) {
    const { mutate, isPending } = useDeleteTeacherMutation();

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
