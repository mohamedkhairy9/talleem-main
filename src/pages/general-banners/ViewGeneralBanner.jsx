import { useUpdateGeneralBannerMutation } from '@/api/hooks/useGeneralBanners';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormGeneralBanner from './FormGeneralBanner';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewGeneralBanner({ onClose, oldData }) {
    console.log('oldData', oldData);
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="general_banners.view" />
            <FormGeneralBanner
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
