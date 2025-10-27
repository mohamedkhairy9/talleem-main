import React from 'react';
import { useRolesQuery } from '@/api/hooks/useRoles';
import Table from '@/components/common/table/Table';
import { rolesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import DeleteRole from './DeleteRole';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewRole from './ViewRole';
import Filters from './Filters';

export default function Roles() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useRolesQuery(filters);
    const { t } = useLocale();

    console.log('data', data);

    const tableData = data?.data?.map(item => ({
        ...item,
        display_name: item.display_name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        display_name: item.display_name,
        description: item.description,
        id: item.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.roles')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={rolesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateRole onClose={toggle.add} />}
            {isOpen.edit && (
                <EditRole
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewRole
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteRole onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
