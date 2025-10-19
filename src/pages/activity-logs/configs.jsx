import { createColumnHelper } from '@tanstack/react-table';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import EventTypeCell from '@/components/common/table/cells/EventTypeCell';
import ModelNameCell from '@/components/common/table/cells/ModelNameCell';
import React from 'react';

const columnHelper = createColumnHelper();

export const activityLogsColumns = [
    columnHelper.accessor('description', {
        header: 'table_headers.activity_description',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('event', {
        header: 'table_headers.event_type',
        cell: info => <EventTypeCell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('subject_type', {
        header: 'table_headers.subject_type',
        cell: info => <ModelNameCell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('subject_id', {
        header: 'table_headers.subject_id',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('causer.name', {
        header: 'table_headers.user',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.date_time',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];
