import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import i18next from 'i18next';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const phasesColumns = (requestTypesMap) => [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('request_type_id', {
        header: 'table_headers.request_type',
        cell: info => (
            <Cell 
                value={requestTypesMap[info.getValue()] || `Request Type ${info.getValue()}`} 
            />
        )
    }),
    columnHelper.accessor('order', {
        header: 'table_headers.order',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('steps', {
        header: 'table_headers.steps_count',
        cell: info => <Cell value={info.row.original.steps?.length || 0} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    })
];

export const phasesFields = [
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
        name: 'request_type_id',
        label: 'validation.request_type_id.label',
        type: 'select',
        placeholder: 'validation.request_type_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'order',
        label: 'validation.order.label',
        type: 'number',
        placeholder: 'validation.order.placeholder',
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

export const phasesFilters = [
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
    search: '',
    request_type_id: ''
};

export const apiCalls = [API_KEYS.REQUEST_TYPES];

