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

function normalizeSelectedIds(value) {
    if (Array.isArray(value)) {
        return value
            .map(item => item?.id ?? item?.value ?? item)
            .filter(item => item !== undefined && item !== null && item !== '');
    }

    if (value && typeof value === 'object') {
        const normalized = value.id ?? value.value;
        return normalized !== undefined && normalized !== null && normalized !== ''
            ? [normalized]
            : [];
    }

    return value !== undefined && value !== null && value !== '' ? [value] : [];
}

export default function Users() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useUsersQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        national_id: item.national_id ?? item.email ?? '',
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
        national_id: item.national_id ?? item.email ?? '',
        name: {
            en: item.name?.en || item.name?.ar || '',
            ar: item.name?.ar || item.name?.en || ''
        },
        status: item.status,
        user_type: item.user_type,
        branch_id: normalizeSelectedIds(item.branches ?? item.branch ?? item.branch_id),
        branch: item.branch,
        branches: Array.isArray(item.branches)
            ? item.branches
            : item.branch
            ? [item.branch]
            : [],
        entity_id: normalizeSelectedIds(item.entities ?? item.entity ?? item.entity_id),
        entity: item.entity?.id ? item.entity : item.entity_id?.id ? item.entity_id : null,
        entities: Array.isArray(item.entities)
            ? item.entities
            : item.entity?.id
            ? [item.entity]
            : item.entity_id?.id
            ? [item.entity_id]
            : [],
        // role_id must be numeric; if API sends role names in roles[], don't pass them as role_id
        role_id:
            item.role_id ??
            (Array.isArray(item.roles) && typeof item.roles[0] === 'number'
                ? item.roles[0]
                : undefined),
        roles: item.roles
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
                enableAdd={true}
                enableEdit={true}
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
