import React, { useMemo } from 'react';
import { useNotificationsQuery } from '@/api/hooks/useNotifications';
import Table from '@/components/common/table/Table';
import { notificationsColumns, filtersDefaultValues } from './configs';
import useFiltering from '@/utils/hooks/global/useFiltering';
import useLocale from '@/utils/hooks/global/useLocale';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import Filters from './Filters';
import SendNotification from './SendNotification';
import ScheduleNotification from './ScheduleNotification';
import ViewNotification from './ViewNotification';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

const getDisplayText = value => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }
    if (Array.isArray(value)) {
        return value.map(getDisplayText).filter(Boolean).join(', ');
    }
    if (typeof value === 'object') {
        const locale = i18next.resolvedLanguage || i18next.language || 'en';
        const localizedValue =
            value[locale] ||
            value[locale.split('-')[0]] ||
            value.en ||
            value.ar;

        return localizedValue && localizedValue !== value
            ? getDisplayText(localizedValue)
            : '';
    }
    return '';
};

const extractNotificationsCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.notifications)) return response.notifications;
    return [];
};

const resolveNotificationsTotalCount = (response, fallbackCount) => {
    const total =
        response?.meta?.total ??
        response?.total ??
        response?.data?.meta?.total ??
        response?.data?.total ??
        (response?.meta?.last_page && response?.meta?.per_page
            ? response.meta.last_page * response.meta.per_page
            : undefined) ??
        (response?.data?.meta?.last_page && response?.data?.meta?.per_page
            ? response.data.meta.last_page * response.data.meta.per_page
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
    const notificationParams = useMemo(
        () => ({
            ...filters,
            page: pagination.page,
            per_page: pagination.per_page
        }),
        [filters, pagination.page, pagination.per_page]
    );
    const { data, isLoading, refresh } = useNotificationsQuery(
        notificationParams
    );
    const { t } = useLocale();
    const allNotifications = extractNotificationsCollection(data);
    const totalCount = resolveNotificationsTotalCount(
        data,
        allNotifications.length
    );
    // Some notification API responses return the full collection even when
    // page/per_page are supplied. Keep server pagination as the default, but
    // paginate locally only when the response contains every record.
    const notificationsList =
        totalCount > pagination.per_page &&
        allNotifications.length >= totalCount
            ? allNotifications.slice(
                  (pagination.page - 1) * pagination.per_page,
                  pagination.page * pagination.per_page
              )
            : allNotifications;

    const handleNotificationsFilter = (name, value) => {
        handleFilter(name, value);

        if (pagination.page !== 1) {
            setPagination(old => ({ ...old, page: 1 }));
        }
    };

    const tableData = notificationsList.map(item => ({
        ...item,
        title: getDisplayText(item?.data?.title) || getDisplayText(item?.title) || 'N/A'
    }));
    const scheduleButton = (
        <button
            type="button"
            onClick={toggle.schedule}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
            {t('table_headers.scheduled')}
        </button>
    );

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
                ToolbarExtra={scheduleButton}
            />
            {isOpen.add && <SendNotification onClose={toggle.add} />}
            {isOpen.schedule && (
                <ScheduleNotification onClose={toggle.schedule} />
            )}
            {isOpen.view && (
                <ViewNotification
                    onClose={toggle.view}
                    notification={getOriginalObject(isOpen.view, tableData)}
                />
            )}
        </div>
    );
}
