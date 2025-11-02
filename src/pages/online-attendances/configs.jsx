import DateCell from '@/components/common/table/cells/DateCell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';

const columnHelper = createColumnHelper();

export const onlineAttendancesColumns = [
    columnHelper.accessor('user', {
        header: 'table_headers.user',
        cell: info => <NameCell directValue={info.row.original.user} />
    }),
    columnHelper.accessor('check_in', {
        header: 'table_headers.check_in',
        cell: info => {
            const data = info.row.original;
            if (data.check_in_date && data.check_in_time) {
                return (
                    <DateCell
                        fullDate
                        value={`${data.check_in_date} ${data.check_in_time}`}
                    />
                );
            }
            return <span>-</span>;
        }
    }),
    columnHelper.accessor('check_out', {
        header: 'table_headers.check_out',
        cell: info => {
            const data = info.row.original;
            console.log("table data: ", data)
            if (data.check_out_date && data.check_out_time) {
                return (
                    <DateCell
                        fullDate
                        value={`${data.check_out_date} ${data.check_out_time}`}
                    />
                );
            }
            return <span>-</span>;
        }
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const onlineAttendancesFields = [
    {
        name: 'user_id',
        label: 'validation.user_id.label',
        type: 'select',
        placeholder: 'validation.user_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'check_in',
        label: 'validation.check_in.label',
        type: 'datetime-local',
        placeholder: 'validation.check_in.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'check_out',
        label: 'validation.check_out.label',
        type: 'datetime-local',
        placeholder: 'validation.check_out.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        options: enabledDisabledOptions,
        editMode: true,
        viewMode: true
        }
];

export const onlineAttendancesFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'status',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    status: true,
    search: ''
};

export const onlineAttendancesDefaultValues = {
    status: true
};
