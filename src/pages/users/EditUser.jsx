import React from 'react';
import FormUser from './FormUser';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateUserMutation } from '@/api/hooks/useUsers';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

// Locale options
const localeOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' }
];

export default function EditUser({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateUserMutation();
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);

    if (branchesLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="users.edit" />
            <FormUser
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    branch_id: branchesData?.data,
                    locale: localeOptions,
                    current_app_locale: localeOptions,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
