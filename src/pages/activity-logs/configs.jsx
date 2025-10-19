import { createColumnHelper } from '@tanstack/react-table';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import EventTypeCell from '@/components/common/table/cells/EventTypeCell';
import ModelNameCell from '@/components/common/table/cells/ModelNameCell';
import React from 'react';

const columnHelper = createColumnHelper();

export const activityLogsColumns = [
    columnHelper.accessor('description', {
        header: 'Activity Description',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('event', {
        header: 'Event Type',
        cell: info => <EventTypeCell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('subject_type', {
        header: 'Subject Type',
        cell: info => <ModelNameCell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('subject_id', {
        header: 'Subject ID',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('causer.name', {
        header: 'User',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('created_at', {
        header: 'Date & Time',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];
