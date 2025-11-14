import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const warningReasonsColumns = [
    columnHelper.accessor('description', {
        header: 'table_headers.description',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('program_name', {
        header: 'table_headers.program',
        cell: info => <Cell value={info.getValue()} />
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

export const warningReasonsFields = [
    {
        name: 'name.en',
        label: 'validation.description.label.en',
        type: 'text',
        placeholder: 'validation.description.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.ar',
        label: 'validation.description.label.ar',
        type: 'text',
        placeholder: 'validation.description.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'main_program_id',
        label: 'validation.main_program_id.label',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true
    }
];

export const warningReasonsFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'main_program_id',
        type: 'select',
        placeholder: 'validation.program.placeholder',
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
    search: '',
    main_program_id: ''
};

export const apiCalls = [API_KEYS.MAIN_PROGRAMS];
