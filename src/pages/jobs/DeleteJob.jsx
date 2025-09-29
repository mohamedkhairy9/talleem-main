import { useDeleteJobMutation } from '@/api/hooks/useJobs';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteJob({ onClose, id }) {
    const { mutate, isPending } = useDeleteJobMutation();

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