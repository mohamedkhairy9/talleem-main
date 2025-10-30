import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const generalBannersColumns = [
    columnHelper.accessor('image', {
        header: 'table_headers.image',
        cell: info => (
            <div className="flex justify-center">
                {info.getValue() ? (
                    <img
                        src={info.getValue()}
                        alt="Banner"
                        className="h-16 w-24 object-cover rounded-md"
                    />
                ) : (
                    <div className="h-16 w-24 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">
                        No Image
                    </div>
                )}
            </div>
        ),
        enableColumnFilter: false,
        enableSorting: false
    }),
    columnHelper.accessor('link', {
        header: 'table_headers.link',
        cell: info => (
            <a
                href={info.getValue()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline truncate block max-w-xs"
            >
                {info.getValue()}
            </a>
        )
    }),
    columnHelper.accessor('start_date', {
        header: 'table_headers.start_date',
        cell: info => <DateCell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('end_date', {
        header: 'table_headers.end_date',
        cell: info => <DateCell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => (
            <Cell
                value={
                    info.getValue() ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Inactive
                        </span>
                    )
                }
            />
        )
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const generalBannersFields = [
    {
        name: 'link',
        label: 'validation.link.label',
        type: 'text',
        placeholder: 'validation.link.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'start_date',
        label: 'validation.start_date.label',
        type: 'date',
        placeholder: 'validation.start_date.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'end_date',
        label: 'validation.end_date.label',
        type: 'date',
        placeholder: 'validation.end_date.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'image',
        label: 'validation.image.label',
        type: 'file',
        placeholder: 'validation.image.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*'
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

export const generalBannersFilters = [
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
