import { useUpdateEntityCategoryMutation } from '@/api/hooks/useEntityCategories';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormEntityCategory from './FormEntityCategory';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewEntityCategory({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="entity_categories.view" />
            <FormEntityCategory
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
