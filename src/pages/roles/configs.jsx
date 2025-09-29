import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import RoleCell from '@/components/common/table/cells/RoleCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const rolesColumns = [
    columnHelper.accessor('name', {
        header: 'Role',
        cell: info => <NameCell directValue={info.row.original.display_name} />
    }),
    columnHelper.accessor('guard_name', {
        header: 'Guard',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const rolesFields = [
    {
        name: 'display_name.en',
        label: 'validation.display_name.label.en',
        type: 'text',
        placeholder: 'validation.display_name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'display_name.ar',
        label: 'validation.display_name.label.ar',
        type: 'text',
        placeholder: 'validation.display_name.placeholder.ar',
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
