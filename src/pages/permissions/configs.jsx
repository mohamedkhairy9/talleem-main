import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const permissionsColumns = [
    columnHelper.accessor('display_name', {
        header: 'table_headers.name',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('name', {
        header: 'table_headers.permissions',
        cell: info => <NameCell directValue={info.getValue()} />
    }),
    columnHelper.accessor('guard_name', {
        header: 'table_headers.guard',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const permissionsFilters = [
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
