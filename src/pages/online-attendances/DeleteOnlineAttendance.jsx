import { useDeleteOnlineAttendanceMutation } from '@/api/hooks/useOnlineAttendances';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteOnlineAttendance({ onClose, id }) {
    const { mutate, isPending } = useDeleteOnlineAttendanceMutation();

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
