import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const notificationsColumns = [
    columnHelper.accessor('data.title', {
        header: 'table_headers.subject',
        cell: info => <NameCell directValue={info.row.original.data.title} />
    }),
    columnHelper.accessor('notifiable', {
        header: 'table_headers.user',
        cell: info => {
            const notifiable = info.getValue();
            const name =
                typeof notifiable?.name === 'string'
                    ? notifiable?.name
                    : notifiable?.name?.en || notifiable?.name?.ar || 'N/A';
            return <Cell value={name} />;
        }
    }),
    columnHelper.accessor('type', {
        header: 'table_headers.type',
        cell: info => (
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {info.getValue()}
            </span>
        )
    }),
    columnHelper.accessor('data.sending_type', {
        header: 'table_headers.sent_via',
        cell: info => {
            const sendingType = info.getValue();
            const typeMap = {
                sms: {
                    label: 'SMS',
                    color: 'bg-purple-100 text-purple-800 border-purple-200'
                },
                email: {
                    label: 'Email',
                    color: 'bg-blue-100 text-blue-800 border-blue-200'
                },
                'in-app-inbox': {
                    label: 'Inbox',
                    color: 'bg-green-100 text-green-800 border-green-200'
                }
            };
            const typeInfo = typeMap[sendingType] || {
                label: sendingType,
                color: 'bg-gray-100 text-gray-800 border-gray-200'
            };
            return (
                <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${typeInfo.color}`}
                >
                    {typeInfo.label}
                </span>
            );
        }
    }),
    columnHelper.accessor('read_at', {
        header: 'table_headers.status',
        cell: info => {
            const readAt = info.getValue();
            const isRead = readAt !== null;
            return (
                <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                        isRead
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                >
                    {isRead ? 'Read' : 'Unread'}
                </span>
            );
        }
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const notificationsFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    }
];

export const filtersDefaultValues = {
    search: ''
};
