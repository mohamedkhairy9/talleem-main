import React from 'react';
import { useNotificationTemplatesQuery } from '@/api/hooks/useNotificationTemplates';
import Table from '@/components/common/table/Table';
import { notificationTemplatesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import Actions from './Actions';
import TriggerNotification from './TriggerNotification';
import ScheduleNotification from './ScheduleNotification';
import ViewNotificationTemplate from './ViewNotificationTemplate';

export default function NotificationTemplates() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useNotificationTemplatesQuery(filters);
    const { t } = useLocale();

    const tableData = data

    console.log('tableData', tableData);
    

    return (
        <div>
            <Table
                title={t('table_titles.notification_templates')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
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
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableView={true}
            />
            {isOpen.view && (
                <ViewNotificationTemplate
                    onClose={toggle.view}
                    template={getOriginalObject(isOpen.view, data)}
                />
            )}
            {isOpen.trigger && (
                <TriggerNotification
                    onClose={toggle.trigger}
                    template={getOriginalObject(isOpen.trigger, data)}
                />
            )}
            {isOpen.schedule && (
                <ScheduleNotification
                    onClose={toggle.schedule}
                    template={getOriginalObject(isOpen.schedule, data)}
                />
            )}
        </div>
    );
}
