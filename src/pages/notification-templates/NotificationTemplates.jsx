import React from 'react';
import { useNotificationTemplatesQuery } from '@/api/hooks/useNotificationTemplates';
import Table from '@/components/common/table/Table';
import { notificationTemplatesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import Actions from './Actions';
import TriggerNotification from './TriggerNotification';
import ScheduleNotification from './ScheduleNotification';
import ViewNotificationTemplate from './ViewNotificationTemplate';
import EditNotificationTemplate from './EditNotificationTemplate';

const extractTemplatesCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.notification_templates)) {
        return response.notification_templates;
    }
    return [];
};

const resolveTemplatesTotalCount = (response, fallbackCount) => {
    const total =
        response?.meta?.total ??
        response?.total ??
        (response?.meta?.last_page && response?.meta?.per_page
            ? response.meta.last_page * response.meta.per_page
            : undefined) ??
        fallbackCount;

    return Number(total) || 0;
};

export default function NotificationTemplates() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useNotificationTemplatesQuery(filters);
    const { t } = useLocale();
    const tableData = extractTemplatesCollection(data);
    const totalCount = resolveTemplatesTotalCount(data, tableData.length);

    return (
        <div>
            <Table
                resource="notifications"
                title={t('table_titles.notification_templates')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={totalCount}
                columns={notificationTemplatesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                Actions={Actions}
                enableAdd={false}
                enableEdit={true}
                enableDelete={false}
                enableCopy={false}
                enableView={true}
            />
            {isOpen.view && (
                <ViewNotificationTemplate
                    onClose={toggle.view}
                    template={getOriginalObject(isOpen.view, tableData)}
                />
            )}
            {isOpen.edit && (
                <EditNotificationTemplate
                    onClose={toggle.edit}
                    template={getOriginalObject(isOpen.edit, tableData)}
                />
            )}
            {isOpen.trigger && (
                <TriggerNotification
                    onClose={toggle.trigger}
                    template={getOriginalObject(isOpen.trigger, tableData)}
                />
            )}
            {isOpen.schedule && (
                <ScheduleNotification
                    onClose={toggle.schedule}
                    template={getOriginalObject(isOpen.schedule, tableData)}
                />
            )}
        </div>
    );
}
