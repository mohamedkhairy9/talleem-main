import React from 'react';
import { useRolesQuery } from '@/api/hooks/useRoles';
import Table from '@/components/common/table/Table';
import { rolesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import DeleteRole from './DeleteRole';
import ViewRole from './ViewRole';
import AssignPermissionsModal from './AssignPermissionsModal';
import Filters from './Filters';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import { MdSecurity } from 'react-icons/md';

export default function Roles() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useRolesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        display_name: item.display_name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        display_name: item.display_name,
        description: item.description,
        id: item.id
    }));

    const RolesTableActions = ({ row, toggleModals }) => (
        <button
            type="button"
            onClick={e => {
                e.stopPropagation();
                toggleModals?.assignPermission?.(row);
            }}
            className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors"
            title={t('roles.assign_permission')}
        >
            <MdSecurity className="w-4 h-4" />
        </button>
    );

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
                Actions={RolesTableActions}
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
            {isOpen.assignPermission && (
                <AssignPermissionsModal
                    role={isOpen.assignPermission}
                    onClose={() => toggle.assignPermission(false)}
                />
            )}
        </div>
    );
}
