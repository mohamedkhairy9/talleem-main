import React from 'react';
import { useNotificationsQuery } from '@/api/hooks/useNotifications';
import Table from '@/components/common/table/Table';
import { notificationsColumns, filtersDefaultValues } from './configs';
import useFiltering from '@/utils/hooks/global/useFiltering';
import useLocale from '@/utils/hooks/global/useLocale';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import ViewNotification from './ViewNotification';
import SendNotification from './SendNotification';
import i18next from 'i18next';

export default function Notifications() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useNotificationsQuery(filters);
    const { t } = useLocale();
    const tableData = data?.data?.map(item => ({
        ...item,
        title: item?.data?.title?.[i18next.language],
    }));

    return (
        <div>
            <Table
                title={t('table_titles.notifications')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={notificationsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableAdd={true}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableView={false}
            />
            {isOpen.add && <SendNotification onClose={toggle.add} />}
            {/* {isOpen.view && (
                <ViewNotification
                    onClose={toggle.view}
                    notification={getOriginalObject(isOpen.view, data)}
                />
            )} */}
        </div>
    );
}