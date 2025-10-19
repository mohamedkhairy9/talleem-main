import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteEmployeeMutation } from '@/api/hooks/useEmployees';

export default function DeleteEmployee({ onClose, id }) {
    const { mutate, isPending } = useDeleteEmployeeMutation();

    const handleDelete = () => {
        mutate(id, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <DeleteModal
            onClose={onClose}
            onConfirm={handleDelete}
            isDeleting={isPending}
            title="common.delete_confirmation"
            message="common.delete_message"
        />
    );
}

