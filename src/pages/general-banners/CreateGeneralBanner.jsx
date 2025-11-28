import React from 'react';
import FormGeneralBanner from './FormGeneralBanner';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateGeneralBannerMutation } from '@/api/hooks/useGeneralBanners';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateGeneralBanner({ onClose }) {
    const { mutate, isPending } = useCreateGeneralBannerMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="general_banners.create" />
            <FormGeneralBanner
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
