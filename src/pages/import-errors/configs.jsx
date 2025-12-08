import { createColumnHelper } from '@tanstack/react-table';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import React from 'react';

const columnHelper = createColumnHelper();

export const importErrorsColumns = [
    columnHelper.accessor('id', {
        header: 'table_headers.id',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('model', {
        header: 'table_headers.model',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: true
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.date',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('response', {
        header: 'table_headers.response',
        cell: info => {
            const response = info.getValue();
            if (!response || !response.errors) return <Cell value="-" />;
            return <Cell value={JSON.stringify(response.errors)} />;
        },
        enableColumnFilter: false
    })
];

