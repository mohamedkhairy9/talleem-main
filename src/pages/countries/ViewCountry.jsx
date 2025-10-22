import React from 'react';
import FormCountry from './FormCountry';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewCountry({ onClose, oldData }) {
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="countries.view" />
            <FormCountry
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}} // No mutation needed for view mode
                isPending={false}
                options={{
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
