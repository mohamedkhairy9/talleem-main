import { useDeleteCountryMutation } from '@/api/hooks/useCountries';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteCountry({ onClose, id }) {
    const { mutate, isPending } = useDeleteCountryMutation();

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
