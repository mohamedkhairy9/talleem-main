import React from 'react';
import { useRolesQuery } from '@/api/hooks/useRoles';
import Table from '@/components/common/table/Table';
import { rolesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateRole from './CreateRole';
import EditRole from './EditRole';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function Roles() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useRolesQuery(pagination);
    const { t } = useLocale();

    console.log('data', data);

    const tableData = data?.data?.map(item => ({
        ...item,
        display_name: item.display_name?.[i18next.language]
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
                setPagination={setPagination}
            />
            {isOpen.add && <CreateRole onClose={toggle.add} />}
            {isOpen.edit && (
                <EditRole
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.delete && (
                <DeleteRole onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
