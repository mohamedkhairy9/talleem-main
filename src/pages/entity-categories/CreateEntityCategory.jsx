import React from 'react';
import FormEntityCategory from './FormEntityCategory';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateEntityCategoryMutation } from '@/api/hooks/useEntityCategories';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateEntityCategory({ onClose }) {
    const { mutate, isPending } = useCreateEntityCategoryMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="entity_categories.create" />
            <FormEntityCategory
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
