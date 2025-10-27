import React from 'react';
import { useOnlineAttendancesQuery } from '@/api/hooks/useOnlineAttendances';
import Table from '@/components/common/table/Table';
import { onlineAttendancesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateOnlineAttendance from './CreateOnlineAttendance';
import EditOnlineAttendance from './EditOnlineAttendance';
import DeleteOnlineAttendance from './DeleteOnlineAttendance';
import ViewOnlineAttendance from './ViewOnlineAttendance';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function OnlineAttendances() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useOnlineAttendancesQuery(filters);
    const { t } = useLocale();

    const formData = data?.data?.map(item => {
        // Determine if this is a check_in or check_out based on available data
        const hasCheckOut = item.check_out_date && item.check_out_time;

        // For edit/view mode we map split fields into one datetime-local value
        const attendance_type = hasCheckOut ? 'check_out' : 'check_in';
        const date = hasCheckOut ? item.check_out_date : item.check_in_date;
        const time = hasCheckOut ? item.check_out_time : item.check_in_time;

        // Convert to datetime-local compatible format: YYYY-MM-DDTHH:MM
        const attendance_datetime =
            date && time ? `${date}T${time?.slice(0, 5)}` : '';

        return {
            ...item,
            user_id: item.user_id,
            attendance_type,
            attendance_datetime
        };
    });

    return (
        <div>
            <Table
                title={t('table_titles.online_attendances')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={onlineAttendancesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateOnlineAttendance onClose={toggle.add} />}
            {isOpen.edit && (
                <EditOnlineAttendance
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewOnlineAttendance
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteOnlineAttendance
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
