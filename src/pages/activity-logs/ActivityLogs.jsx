import React from 'react';
import { useActivityLogsQuery } from '@/api/hooks/useActivityLogs';
import Table from '@/components/common/table/Table';
import { activityLogsColumns } from './configs';
import usePagination from '@/utils/hooks/global/usePagination';
import useLocale from '@/utils/hooks/global/useLocale';

export default function ActivityLogs() {
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refetch } = useActivityLogsQuery(pagination);
    const { t } = useLocale();

    console.log('Activity Logs data:', data);

    // Transform data to flatten nested objects for table display
    const tableData = data?.data?.data?.map(item => ({
        ...item,
        'causer.name': item.causer?.name || 'Unknown User'
    }));

    return (
        <div>
            <Table
                title={t('table_titles.activity_logs')}
                refresh={refetch}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={activityLogsColumns}
                pagination={pagination}
                setPagination={setPagination}
                enableView={false}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableAdd={false}
            />
        </div>
    );
}
