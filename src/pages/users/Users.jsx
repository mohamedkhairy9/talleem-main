import React from 'react';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Table from '@/components/common/table/Table';
import { usersColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import ViewUser from './ViewUser';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function Users() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useUsersQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        branch: {
            ...item.branch,
            name: item.branch?.name?.[i18next.language]
        }
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        branch_id: item.branch?.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.users')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={usersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateUser onClose={toggle.add} />}
            {isOpen.edit && (
                <EditUser
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewUser
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteUser onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
