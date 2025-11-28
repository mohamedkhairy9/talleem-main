import { useDeleteGeneralBannerMutation } from '@/api/hooks/useGeneralBanners';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteGeneralBanner({ onClose, id }) {
    const { mutate, isPending } = useDeleteGeneralBannerMutation();

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
