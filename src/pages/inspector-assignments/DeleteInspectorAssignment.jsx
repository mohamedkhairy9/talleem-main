import { useDeleteInspectorAssignmentMutation } from '@/api/hooks/useInspectorAssignments';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteInspectorAssignment({ onClose, id }) {
    const { mutate, isPending } = useDeleteInspectorAssignmentMutation();

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
