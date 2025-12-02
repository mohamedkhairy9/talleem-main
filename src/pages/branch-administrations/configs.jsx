import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import EnabledCell from '@/components/common/table/cells/EnabledCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const branchAdministrationsColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <NameCell directValue={info.row.original.branch} />
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
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
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
    name: {
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
