import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { MdCheck, MdClose } from 'react-icons/md';
import i18next from 'i18next';

const columnHelper = createColumnHelper();

const renderBooleanBadge = value => (
    <div className="flex items-center">
        <span
            className={`inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium ${
                value
                    ? 'bg-green-100 text-green-800 border-green-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
        >
            {value ? (
                <MdCheck className="h-4 w-4" />
            ) : (
                <MdClose className="h-4 w-4" />
            )}
        </span>
    </div>
);

const formatLabel = value => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

const getLocalizedValue = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value?.[i18next.language] || value?.en || value?.ar || '';
};

export const notificationTemplatesColumns = [
    columnHelper.accessor(
        row => row.notification_template_id || row.template_id || row.id,
        {
            id: 'notification_template_id',
            header: 'notifications.template_id',
            cell: info => <Cell value={info.getValue()} />
        }
    ),
    columnHelper.accessor('id', {
        header: 'table_headers.id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('subject', {
        header: 'table_headers.subject',
        cell: info => <NameCell directValue={info.getValue()} />
    }),
    columnHelper.accessor(
        row => getLocalizedValue(row.content) || getLocalizedValue(row.inbox_content),
        {
            id: 'content',
            header: 'notifications.message',
            cell: info => (
                <div className="max-w-[320px] truncate text-sm text-gray-700">
                    {info.getValue() || 'N/A'}
                </div>
            )
        }
    ),
    columnHelper.accessor(row => row.type_label || row.type, {
        id: 'type_label',
        header: 'table_headers.type',
        cell: info => <Cell value={formatLabel(info.getValue())} />
    }),
    columnHelper.accessor('send_via_sms', {
        header: 'table_headers.sms',
        cell: info => renderBooleanBadge(info.getValue())
    }),
    columnHelper.accessor('send_via_email', {
        header: 'table_headers.email',
        cell: info => renderBooleanBadge(info.getValue())
    }),
    columnHelper.accessor('send_via_inbox', {
        header: 'table_headers.inbox',
        cell: info => renderBooleanBadge(info.getValue())
    }),
    columnHelper.accessor('send_via_whatsapp', {
        header: 'notifications.whatsapp',
        cell: info => renderBooleanBadge(info.getValue())
    }),
    columnHelper.accessor('target_role_labels', {
        header: 'notifications.role',
        cell: info => {
            const roles = info.getValue();
            const roleNames = Array.isArray(roles)
                ? roles
                      .map(role =>
                          i18next.language === 'ar'
                              ? role?.display_name || role?.name
                              : role?.name || role?.display_name
                      )
                      .filter(Boolean)
                      .join(', ')
                : '';

            return <Cell value={roleNames || 'N/A'} />;
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
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => {
            const isEnabled = info.getValue() === true || info.getValue() === 1;
            return (
                <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${
                        isEnabled
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                >
                    {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
            );
        }
    }),
    columnHelper.accessor('active_users_only', {
        header: 'Active Users Only',
        cell: info => renderBooleanBadge(info.getValue())
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
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
