import React from 'react';
import FormEmployee from './FormEmployee';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { useRolesQuery } from '@/api/hooks/useRoles';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';

export default function ViewEmployee({ onClose, oldData }) {
    const { data: rolesData, isLoading } = useRolesQuery(allData);

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="employees.view" />
            <FormEmployee
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    status: enabledDisabledOptions,
                    roles: rolesData?.data ?? []
                }}
            />
        </Modal>
    );
}
