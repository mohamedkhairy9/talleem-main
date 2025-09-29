import React from 'react';
import { useAttendanceTypesQuery } from '@/api/hooks/useAttendanceTypes';
import Table from '@/components/common/table/Table';
import { attendanceTypesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateAttendanceType from './CreateAttendanceType';
import EditAttendanceType from './EditAttendanceType';
import DeleteAttendanceType from './DeleteAttendanceType';

export default function AttendanceTypes() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useAttendanceTypesQuery(pagination);

    return (
        <div>
            <Table
                title="Attendance Types"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={attendanceTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateAttendanceType onClose={toggle.add} />}
            {isOpen.edit && (
                <EditAttendanceType
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
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
