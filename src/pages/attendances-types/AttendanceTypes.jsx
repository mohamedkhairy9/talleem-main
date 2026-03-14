import React from 'react';
import { useAttendanceTypesQuery } from '@/api/hooks/useAttendanceTypes';
import Table from '@/components/common/table/Table';
import { attendanceTypesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateAttendanceType from './CreateAttendanceType';
import EditAttendanceType from './EditAttendanceType';
import DeleteAttendanceType from './DeleteAttendanceType';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewAttendanceType from './ViewAttendanceTypes';
import Filters from './Filters';

export default function AttendanceTypes() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useAttendanceTypesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code,
        status: item.status,
        with_excuse: item.with_excuse
    }))

    return (
        <div>
            <Table
                resource="attendance_types"
                title={t('table_titles.absences_types')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={attendanceTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateAttendanceType onClose={toggle.add} />}
            {isOpen.edit && (
                <EditAttendanceType
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewAttendanceType
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteAttendanceType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
