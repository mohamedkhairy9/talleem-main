import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const countriesColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.countries',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('short_name', {
        header: 'table_headers.short_name',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('phone_code', {
        header: 'table_headers.phone_code',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const countriesFields = [
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
        name: 'short_name',
        label: 'validation.short_name.label',
        type: 'text',
        placeholder: 'validation.short_name.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'phone_code',
        label: 'validation.phone_code.label',
        type: 'text',
        placeholder: 'validation.phone_code.placeholder',
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

export const countriesDefaultValues = {
    status: true
};
