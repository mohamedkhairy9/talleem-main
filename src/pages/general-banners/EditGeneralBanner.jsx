import { useUpdateGeneralBannerMutation } from '@/api/hooks/useGeneralBanners';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormGeneralBanner from './FormGeneralBanner';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditGeneralBanner({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateGeneralBannerMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="general_banners.update" />
            <FormGeneralBanner
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
