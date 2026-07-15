import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const usersColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.getValue()} />
    }),
    columnHelper.accessor('national_id', {
        header: 'table_headers.national_id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('phone', {
        header: 'table_headers.phone',
        cell: info => <Cell value={info.getValue()} />
    }),
    // columnHelper.accessor('branch', {
    //     header: 'table_headers.branch',
    //     cell: info => <NameCell directValue={info.row.original} />
    // }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => {
            const status = info.getValue();
            const isEnabled = status === 1 || status === true;
            return (
                <div className="flex items-center space-x-2">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            isEnabled ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    />
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                            isEnabled
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                    >
                        {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            );
        }
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const usersFields = [
    {
        name: 'name.en',
        label: 'validation.users.name.label',
        type: 'text',
        placeholder: 'validation.users.name.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'national_id',
        label: 'validation.national_id.label',
        type: 'text',
        placeholder: 'validation.national_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'password',
        label: 'validation.users.password.label',
        type: 'password',
        placeholder: 'validation.users.password.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'branch_id',
        label: 'validation.users.branch_id.label',
        type: 'select',
        placeholder: 'validation.users.branch_id.placeholder',
        isMulti: true,
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
        isMulti: true,
        editMode: true,
        viewMode: true
    },
    {
        name: 'role_id',
        label: 'validation.users.role_id.label',
        type: 'select',
        placeholder: 'validation.users.role_id.placeholder',
        editMode: true,
        viewMode: true
    }
];

export const usersDefaultValues = {
    name: {
        en: '',
        ar: ''
    },
    national_id: '',
    password: '',
    branch_id: [],
    entity_id: [],
    role_id: null,
    locale: 'en',
    current_app_locale: 'en',
    user_type: 'employee',
    status: true
};

export const usersFilters = [
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
