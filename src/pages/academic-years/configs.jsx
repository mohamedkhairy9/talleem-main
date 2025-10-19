import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';

const columnHelper = createColumnHelper();

export const academicYearsColumns = [
    columnHelper.accessor('name', {
        header: 'Academic Year',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('start_date', {
        header: 'Start Date',
        cell: info => <DateCell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('end_date', {
        header: 'End Date',
        cell: info => <DateCell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const academicYearsFields = [
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
        name: 'start_date',
        label: 'validation.start_date.label',
        type: 'date',
        placeholder: 'validation.start_date.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'end_date',
        label: 'validation.end_date.label',
        type: 'date',
        placeholder: 'validation.end_date.placeholder',
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
