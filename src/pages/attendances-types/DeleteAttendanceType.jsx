import { useDeleteAttendanceTypeMutation } from '@/api/hooks/useAttendanceTypes';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteAttendanceType({ onClose, id }) {
    const { mutate, isPending } = useDeleteAttendanceTypeMutation();

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
