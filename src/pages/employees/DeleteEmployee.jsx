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
            deleteFn={handleDelete}
            loading={isPending}
            onClose={onClose}
        />
    );
}
