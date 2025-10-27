import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const usersColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.getValue()} />
    }),
    columnHelper.accessor('email', {
        header: 'table_headers.email',
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
        name: 'email',
        label: 'validation.users.email.label',
        type: 'email',
        placeholder: 'validation.users.email.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'password',
        label: 'validation.users.password.label',
        type: 'password',
        placeholder: 'validation.users.password.placeholder',
        editMode: false,
        viewMode: false
    },
    {
        name: 'phone',
        label: 'validation.users.phone.label',
        type: 'text',
        placeholder: 'validation.users.phone.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'branch_id',
        label: 'validation.users.branch_id.label',
        type: 'select',
        placeholder: 'validation.users.branch_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'user_type',
        label: 'validation.users.user_type.label',
        type: 'select',
        placeholder: 'validation.users.user_type.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'locale',
        label: 'validation.users.locale.label',
        type: 'select',
        placeholder: 'validation.users.locale.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'current_app_locale',
        label: 'validation.users.current_app_locale.label',
        type: 'select',
        placeholder: 'validation.users.current_app_locale.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.users.status.label',
        type: 'select',
        placeholder: 'validation.users.status.placeholder',
        defaultValue: true,
        options: enabledDisabledOptions,
        editMode: true,
        viewMode: true
    }
];

export const usersDefaultValues = {
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
    status: 1,
    search: ''
};
