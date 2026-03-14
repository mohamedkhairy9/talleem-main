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
import i18next from 'i18next';

export default function OnlineAttendances() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useOnlineAttendancesQuery(filters);
    const { t } = useLocale();
    
    const tableData = data?.data?.map(item => ({
        ...item,
        user: item.user?.name?.[i18next.language],
        check_in: `${item.check_in_date}T${item.check_in_time?.slice(0, 5)}`,
        check_out: `${item.check_out_date}T${item.check_out_time?.slice(0, 5)}`,
    }))

    console.log("Data: ", data?.data);

    const formData = data?.data?.map(item => {
        // For edit/view mode we map split fields into one datetime-local value
        const date = item.check_out_date && item.check_in_date;
        const time = item.check_out_time && item.check_in_time;

        // Convert to datetime-local compatible format: YYYY-MM-DDTHH:MM
        const check_in_datetime =
            date && time ? `${item.check_in_date}T${item.check_in_time?.slice(0, 5)}` : '';
        
        const check_out_datetime = 
            date && time ? `${item.check_out_date}T${item.check_out_time?.slice(0, 5)}` : "";

        return {
            id: item.id,
            user_id: item.user?.id,
            check_in: check_in_datetime,
            check_out: check_out_datetime,
            status: item.status,
        };
    });

    return (
        <div>
            <Table
                resource="online-attendances"
                title={t('table_titles.online_attendances')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
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
