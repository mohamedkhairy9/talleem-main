import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
import { useDeleteCertificateMutation } from '@/api/hooks/useCertificates';

export default function DeleteCertificate({ onClose, id }) {
    const { mutate, isPending } = useDeleteCertificateMutation();

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