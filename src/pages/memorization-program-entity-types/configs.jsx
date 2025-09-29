import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const memorizationProgramEntityTypesColumns = [
    columnHelper.accessor('name', {
        header: 'Memorization Program',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('code', {
        header: 'Code',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const memorizationProgramEntityTypesFields = [
    {
        name: 'name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'code',
        label: 'validation.code.label',
        type: 'number',
        placeholder: 'validation.code.placeholder',
        editMode: true,
        viewMode: true
    }
];
