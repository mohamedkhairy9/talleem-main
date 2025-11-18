import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

// Table Columns
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
                },
                push: {
                    label: 'Push',
                    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
                },
                whatsapp: {
                    label: 'WhatsApp',
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
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

// Filters
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

// API Calls Configuration
export const notificationApiCalls = [
    {
        key: API_KEYS.MAIN_PROGRAMS,
        name: 'programsData'
    },
    {
        key: API_KEYS.BRANCHES,
        name: 'branchesData'
    },
    {
        key: API_KEYS.ENTITY_TYPES,
        name: 'entityTypesData'
    },
    {
        key: API_KEYS.ENTITIES,
        name: 'entitiesData'
    }
];

// User Type Options
export const getUserTypeOptions = (t) => [
    { id: 'teacher', name: t('notifications.teacher'), value: 'teacher' },
    { id: 'student', name: t('notifications.student'), value: 'student' },
    { id: 'guardian', name: t('notifications.guardian'), value: 'guardian' },
    { id: 'entity_manager', name: t('notifications.entity_manager'), value: 'entity_manager' },
    { id: 'supervisor', name: t('notifications.supervisor'), value: 'supervisor' },
    { id: 'branch_manager', name: t('notifications.branch_manager'), value: 'branch_manager' }
];

// Sending Methods Configuration
export const sendingMethods = [
    {
        key: 'sms',
        icon: '📱',
        labelKey: 'notifications.sms'
    },
    {
        key: 'email',
        icon: '📧',
        labelKey: 'notifications.email'
    },
    {
        key: 'push',
        icon: '📬',
        labelKey: 'notifications.push'
    },
    {
        key: 'whatsapp',
        icon: '💬',
        labelKey: 'notifications.whatsapp'
    }
];

// Helper function to prepare notification payload
export const prepareNotificationPayload = (data, selectedMethods) => {
    // Get selected sending types
    const sendingTypes = Object.keys(selectedMethods).filter(
        method => selectedMethods[method]
    );

    // Prepare base filters
    const filters = {
        user_type: data.user_type,
        ...(data.branch_id && { branch_id: data.branch_id }),
        ...(data.program_id && { program_id: data.program_id }),
        ...(data.entity_type_id && { entity_type_id: data.entity_type_id }),
        ...(data.entity_id && { entity_id: data.entity_id }),
        ...(data.relation_owner_name && { relation_owner_name: data.relation_owner_name })
    };

    // Prepare payload
    const payload = {
        filters,
        sending_type: sendingTypes[0] // Backend should handle this
    };

    // Add title and content based on first selected method
    const firstMethod = sendingTypes[0];
    if (firstMethod) {
        payload.title = {
            en: data[`${firstMethod}_title_en`],
            ar: data[`${firstMethod}_title_ar`]
        };
        payload.content = {
            en: data[`${firstMethod}_content_en`],
            ar: data[`${firstMethod}_content_ar`]
        };
    }

    return payload;
};

// Default values for form
export const getDefaultFormValues = () => ({
    user_type: [],
    program_id: null,
    branch_id: null,
    entity_type_id: null,
    entity_id: null,
    relation_owner_name: ''
});