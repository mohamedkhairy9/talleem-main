import { useDeleteGeneralHolidayMutation } from '@/api/hooks/useGeneralHolidays';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteGeneralHoliday({ onClose, id }) {
    const { mutate, isPending } = useDeleteGeneralHolidayMutation();

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
