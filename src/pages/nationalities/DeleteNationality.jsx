import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import Btn from '@/components/common/buttons/Btn';
import { useDeleteNationalityMutation } from '@/api/hooks/useNationalities';

export default function DeleteNationality({ onClose, id }) {
    const { mutate, isPending } = useDeleteNationalityMutation();

    const handleDelete = () => {
        mutate(id, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="nationalities.delete" />
            <div className="p-4">
                <p className="text-gray-600 mb-4">
                    Are you sure you want to delete this nationality? This
                    action cannot be undone.
                </p>
                <div className="flex gap-2">
                    <Btn
                        onClick={handleDelete}
                        loading={isPending}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        label="common.delete"
                    />
                    <Btn
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        label="common.cancel"
                    />
                </div>
            </div>
        </Modal>
    );
}
