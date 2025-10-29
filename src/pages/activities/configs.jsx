import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const activitiesColumns = [
    columnHelper.accessor('main_program_id', {
        header: 'table_headers.main_program',
        cell: info => (
            <NameCell directValue={info.row.original.main_program?.name} />
        )
    }),
    columnHelper.accessor('name', {
        header: 'table_headers.activities',
        cell: info => <NameCell directValue={info.row.original.name} />
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

export const activitiesFields = [
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
        options: enabledDisabledOptions,
        editMode: true,
        viewMode: true
    }
];

export const activitiesFilters = [
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

export const apiCalls = [API_KEYS.MAIN_PROGRAMS];
