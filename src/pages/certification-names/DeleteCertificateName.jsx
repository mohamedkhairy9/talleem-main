import { useDeleteCertificateNameMutation } from '@/api/hooks/useCertificateNames';
import DeleteModal from '@/components/common/form/DeleteModal';
import React from 'react';

export default function DeleteCertificateName({ onClose, id }) {
    const { mutate, isPending } = useDeleteCertificateNameMutation();

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
