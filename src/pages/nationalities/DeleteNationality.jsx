import React from 'react';
import DeleteModal from '@/components/common/form/DeleteModal';
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
		<DeleteModal deleteFn={handleDelete} loading={isPending} onClose={onClose} />
	);
}
