import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';
import ActiveCell from '@/components/common/table/cells/ActiveCell';

const columnHelper = createColumnHelper();

export const citiesColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.city',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('country', {
        header: 'table_headers.country',
        cell: info => <NameCell directValue={info.row.original.country?.name} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    })
];

export const citiesFields = [
    {
        name: 'country_id',
        label: 'validation.country_id.label',
        type: 'select',
        placeholder: 'validation.country_id.placeholder',
        editMode: true,
        viewMode: true
    },
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

export const citiesFilters = [
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
