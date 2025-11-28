import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const majorsColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.majors',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
];

export const majorsFields = [
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

export const majorsDefaultValues = {
    status: true
};

export const majorsFilters = [
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
        defaultValue: ''
    }
];

export const filtersDefaultValues = {
    status: true,
    search: ''
};
