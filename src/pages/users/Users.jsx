import React from 'react';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Table from '@/components/common/table/Table';
import { usersColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateUser from './CreateUser';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';
import ViewUser from './ViewUser';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Users() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useUsersQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        branch: {
            ...item.branch,
            name: item.branch?.name?.[i18next.language]
        }
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        locale: item.locale,
        current_app_locale: item.current_app_locale,
        email: item.email,
        name: item.name,
        phone: item.phone,
        status: item.status,
        user_type: item.user_type,
        branch_id: item.branch?.id,
        roles: item.roles // Include roles from the response
    }));

    return (
        <div>
            <Table
                resource="users"
                title={t('table_titles.users')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={usersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                enableAdd={false}
                enableEdit={false}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
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
