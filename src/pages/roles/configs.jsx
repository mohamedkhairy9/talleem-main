import i18next from 'i18next';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';

const columnHelper = createColumnHelper();

export const rolesColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.role',
        cell: info => <NameCell directValue={info.row.original.display_name} />
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

export const rolesFields = [
    {
        name: 'display_name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'display_name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'description.en',
        label: 'validation.description.label.en',
        type: 'textarea',
        placeholder: 'validation.description.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'description.ar',
        label: 'validation.description.label.ar',
        type: 'textarea',
        placeholder: 'validation.description.placeholder.ar',
        editMode: true,
        viewMode: true
    }
];

export const assignPermissionsFields = [
    {
        name: 'permission_ids',
        label: 'validation.permission_ids.label',
        type: 'select',
        placeholder: 'validation.permission_ids.placeholder',
        editMode: true,
        viewMode: true,
        isMulti: true
    }
];

export const rolesFilters = [
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
    status: 1,
    search: ''
};
