import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const entityActivitiesColumns = [
    columnHelper.accessor('entity', {
        header: 'table_headers.entity',
        cell: info => <NameCell directValue={info.row.original.entity_id?.name} />
    }),
    columnHelper.accessor('activity', {
        header: 'table_headers.activity',
        cell: info => (
            <NameCell directValue={info.row.original.activity_name} />
        )
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const entityActivitiesFields = [
    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'activity_id',
        label: 'validation.activity_id.label',
        type: 'select',
        placeholder: 'validation.activity_id.placeholder',
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

export const entityActivitiesFilters = [
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

export const entityActivitiesDefaultValues = {
    status: true,
    entity_id: '',
    activity_id: ''
};

export const apiCalls = [API_KEYS.ENTITIES, API_KEYS.ACTIVITIES];
