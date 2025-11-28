import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import EnabledCell from '@/components/common/table/cells/EnabledCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const branchAdministrationsColumns = [
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <NameCell directValue={info.row.original.branch} />
    }),
    columnHelper.accessor('user', {
        header: 'table_headers.user',
        cell: info => <NameCell directValue={info.row.original.user} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => {
            const status = info.getValue();
            const isEnabled = status === 1 || status === true;
            return <EnabledCell isEnabled={isEnabled} />;
        }
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const branchAdministrationsFields = [
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'user_id',
        label: 'validation.user_id.label',
        type: 'select',
        placeholder: 'validation.user_id.placeholder',
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
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        editMode: true,
        viewMode: true
    }
];

export const branchAdministrationsDefaultValues = {
    description: {
        en: '',
        ar: ''
    },
    status: true
};

export const branchAdministrationsFilters = [
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
    search: '',
    status: true
};
