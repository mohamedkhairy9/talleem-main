import React from 'react';
import FormUser from './FormUser';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions, userTypeOptions } from '@/utils/constants/options';

// Locale options
const localeOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' }
];

export default function ViewUser({ onClose, oldData }) {
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);

    if (branchesLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="users.view" />
            <FormUser
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}} // No mutation needed for view mode
                isPending={false}
                options={{
                    branch_id: branchesData?.data,
                    locale: localeOptions,
                    current_app_locale: localeOptions,
                    status: enabledDisabledOptions,
                    user_type: userTypeOptions
                }}
            />
        </Modal>
    );
}
