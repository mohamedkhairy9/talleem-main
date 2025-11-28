import { createColumnHelper } from '@tanstack/react-table';
import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import EventTypeCell from '@/components/common/table/cells/EventTypeCell';
import ModelNameCell from '@/components/common/table/cells/ModelNameCell';
import React from 'react';
import NameCell from '@/components/common/table/cells/NameCell';

const columnHelper = createColumnHelper();

export const activityLogsColumns = [
    columnHelper.accessor('description', {
        header: 'table_headers.activity_description',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('subject.type', {
        header: 'table_headers.subject_type',
        cell: info => <ModelNameCell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('causer.name', {
        header: 'table_headers.user',
        cell: info => {
            return <NameCell directValue={info.row.original?.causer?.name} />;
        },
        enableColumnFilter: true
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.date_time',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];
