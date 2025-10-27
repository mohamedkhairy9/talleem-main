import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const notificationTemplatesColumns = [
    columnHelper.accessor('id', {
        header: 'table_headers.id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('subject', {
        header: 'table_headers.subject',
        cell: info => <NameCell directValue={info.row.original.subject} />
    }),
    columnHelper.accessor('type', {
        header: 'table_headers.type',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('send_via_sms', {
        header: 'table_headers.sms',
        cell: info => {
            const value = info.getValue();
            return (
                <div className="flex items-center ">
                    {value ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                            ✓
                        </span>
                    ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                            ✗
                        </span>
                    )}
                </div>
            );
        }
    }),
    columnHelper.accessor('send_via_email', {
        header: 'table_headers.email',
        cell: info => {
            const value = info.getValue();
            return (
                <div className="flex items-center ">
                    {value ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                            ✓
                        </span>
                    ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                            ✗
                        </span>
                    )}
                </div>
            );
        }
    }),
    columnHelper.accessor('send_via_inbox', {
        header: 'table_headers.inbox',
        cell: info => {
            const value = info.getValue();
            return (
                <div className="flex items-center ">
                    {value ? (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                            ✓
                        </span>
                    ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                            ✗
                        </span>
                    )}
                </div>
            );
        }
    }),
    columnHelper.accessor('is_scheduled', {
        header: 'table_headers.scheduled',
        cell: info => {
            const value = info.getValue();
            return (
                <div className="flex items-center space-x-2">
                    <div
                        className={`w-2 h-2 rounded-full ${
                            value ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                    />
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                            value
                                ? 'bg-blue-100 text-blue-800 border-blue-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                    >
                        {value ? 'Scheduled' : 'Manual'}
                    </span>
                </div>
            );
        }
    })
];

export const notificationTemplatesFilters = [
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
