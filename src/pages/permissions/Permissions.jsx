import React from 'react';
import { usePermissionsQuery } from '@/api/hooks/usePermissions';
import Table from '@/components/common/table/Table';
import { permissionsColumns } from './configs';
import usePagination from '@/utils/hooks/global/usePagination';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';

export default function Permissions() {
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = usePermissionsQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        display_name: item.display_name?.[i18next.language]
    }));

    return (
        <div>
            <Table
                title={t('table_titles.permissions')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={permissionsColumns}
                pagination={pagination}
                setPagination={setPagination}
                enableAdd={false}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableView={false}
                enableRowSelection={false}
            />
        </div>
    );
}
