import React from 'react';
import { useNotificationsQuery } from '@/api/hooks/useNotifications';
import Table from '@/components/common/table/Table';
import { notificationsColumns, filtersDefaultValues } from './configs';
import useFiltering from '@/utils/hooks/global/useFiltering';
import useLocale from '@/utils/hooks/global/useLocale';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import Filters from './Filters';
import SendNotification from './SendNotification';
import ViewNotification from './ViewNotification';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

const extractNotificationsCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.notifications)) return response.notifications;
    return [];
};

const resolveNotificationsTotalCount = (response, fallbackCount) => {
    const total =
        response?.meta?.total ??
        response?.total ??
        (response?.meta?.last_page && response?.meta?.per_page
            ? response.meta.last_page * response.meta.per_page
            : undefined) ??
        fallbackCount;

    return Number(total) || 0;
};

export default function Notifications() {
    const { isOpen, toggle } = useIsOpen();
    const {
        pagination,
        setPagination,
        handleFilter,
        filters,
        setter,
        setFilters
    } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useNotificationsQuery(filters);
    const { t } = useLocale();
    const notificationsList = extractNotificationsCollection(data);
    const totalCount = resolveNotificationsTotalCount(
        data,
        notificationsList.length
    );

    const handleNotificationsFilter = (name, value) => {
        handleFilter(name, value);

        if (pagination.page !== 1) {
            setPagination(old => ({ ...old, page: 1 }));
        }
    };

    const tableData = notificationsList.map(item => ({
        ...item,
        title:
            item?.data?.title?.[i18next.language] ||
            item?.data?.title?.ar ||
            item?.data?.title?.en ||
            item?.title?.[i18next.language] ||
            item?.title?.ar ||
            item?.title?.en ||
            item?.title ||
            'N/A'
    }));

    return (
        <div>
            <Table
                resource="notifications"
                title={t('table_titles.notifications')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={totalCount}
                columns={notificationsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters
                        filters={filters}
                        handleFilter={handleNotificationsFilter}
                    />
                }
                setFilters={setFilters}
                filters={filters}
                enableAdd={true}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableView={true}
            />
            {isOpen.add && <SendNotification onClose={toggle.add} />}
            {isOpen.view && (
                <ViewNotification
                    onClose={toggle.view}
                    notification={getOriginalObject(isOpen.view, tableData)}
                />
            )}
        </div>
    );
}
