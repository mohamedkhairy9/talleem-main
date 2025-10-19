import React from 'react';
import FormNationality from './FormNationality';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { enabledDisabledOptions } from '@/utils/constants/options';

// TODO: Create countries hook and service
const mockCountries = [
    { id: 1, name: { en: 'Syria', ar: 'سوريا' } },
    { id: 2, name: { en: 'Lebanon', ar: 'لبنان' } },
    { id: 3, name: { en: 'Jordan', ar: 'الأردن' } },
    { id: 4, name: { en: 'Egypt', ar: 'مصر' } },
    { id: 5, name: { en: 'Saudi Arabia', ar: 'السعودية' } }
];

export default function ViewNationality({ onClose, oldData }) {
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="nationalities.view" />
            <FormNationality
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}} // No mutation needed for view mode
                isPending={false}
                options={{
                    country_id: mockCountries,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
