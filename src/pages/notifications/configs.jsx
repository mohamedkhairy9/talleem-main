import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';
import { FaSms, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';

const columnHelper = createColumnHelper();

// Table Columns
export const notificationsColumns = [
    columnHelper.accessor('title', {
        header: 'table_headers.subject',
        cell: info => <NameCell directValue={info.row.original.title} />
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
    //    API_KEYS.MAIN_PROGRAMS,
    API_KEYS.BRANCHES,
    //     API_KEYS.ENTITY_TYPES,
    API_KEYS.ENTITIES,
    API_KEYS.ROLES
];

// User Type Options - From database (as shown in image)
export const userTypeOptions = [
    { id: 'entity', label: { ar: 'جهة', en: 'Entity' }, value: 'entity' },
    { id: 'student', label: { ar: 'طالب', en: 'Student' }, value: 'student' },
    { id: 'teacher', label: { ar: 'معلم', en: 'Teacher' }, value: 'teacher' },
    { id: 'guest', label: { ar: 'ضيف', en: 'Guest' }, value: 'guest' },
    {
        id: 'employee',
        label: { ar: 'موظف', en: 'Employee' },
        value: 'employee'
    },
    { id: 'parent', label: { ar: 'ولي أمر', en: 'Parent' }, value: 'parent' }
];

// Sending Methods Configuration
export const sendingMethods = [
    {
        key: 'sms',
        icon: <FaSms/>,
        labelKey: 'notifications.sms'
    },
    {
        key: 'email',
        icon: <MdEmail/>,
        labelKey: 'notifications.email'
    },
    {
        key: 'push',
        icon: <IoNotifications/>,
        labelKey: 'notifications.push'
    },
    {
        key: 'whatsapp',
        icon: <FaWhatsapp/>,
        labelKey: 'notifications.whatsapp'
    }
];

// Dynamic Filter Fields Configuration
export const getFilterFields = t => [
    {
        name: 'user_type',
        type: 'select',
        label: t('notifications.user_type'),
        placeholder: t('notifications.select_user_type'),
        isMulti: true,
        required: true,
        optionsSource: 'static', // Options from userTypeOptions
        gridColumn: 'full' // Full width
    },
    {
        name: 'role_id',
        type: 'select',
        label: t('notifications.role'),
        placeholder: t('notifications.select_role'),
        isMulti: false,
        required: false,
        optionsSource: 'api', // Options from API
        apiKey: 'rolesData',
        filterFunction: roles =>
            roles.filter(role => role.name !== 'super-admin'), // Exclude super-admin
        gridColumn: 'half'
    },
    // {
    //     name: 'program_id',
    //     type: 'select',
    //     label: t('notifications.program'),
    //     placeholder: t('notifications.select_program'),
    //     isMulti: false,
    //     required: false,
    //     optionsSource: 'api',
    //     apiKey: 'programsData',
    //     gridColumn: 'half',
    //     disabled: true // On hold
    // },
    {
        name: 'branch_id',
        type: 'select',
        label: t('notifications.branch'),
        placeholder: t('notifications.select_branch'),
        isMulti: false,
        required: false,
        optionsSource: 'api',
        apiKey: 'branchesData',
        gridColumn: 'half'
    },
    // {
    //     name: 'entity_type_id',
    //     type: 'select',
    //     label: t('notifications.entity_type'),
    //     placeholder: t('notifications.select_entity_type'),
    //     isMulti: false,
    //     required: false,
    //     optionsSource: 'api',
    //     apiKey: 'entityTypesData',
    //     gridColumn: 'half',
    //     disabled: true // On hold
    // },
    {
        name: 'entity_id',
        type: 'select',
        label: t('notifications.entity'),
        placeholder: t('notifications.select_entity'),
        isMulti: false,
        required: false,
        optionsSource: 'api',
        apiKey: 'entitiesData',
        dependsOn: 'branch_id', // Depends on branch selection
        gridColumn: 'half'
    }
];

export const notificationFields = [
    {
        name: 'user_type',
        type: 'select',
        label: 'notifications.user_type',
        placeholder: 'notifications.select_user_type',
        isMulti: true,
        gridColumn: 'full'
    },
    {
        name: 'role_id',
        type: 'select',
        label: 'notifications.role',
        placeholder: 'notifications.select_role',
        isMulti: false,
        gridColumn: 'half'
    },
    {
        name: 'branch_id',
        type: 'select',
        label: 'notifications.branch',
        placeholder: 'notifications.select_branch',
        isMulti: false,
        gridColumn: 'half'
    },
    {
        name: 'entity_id',
        type: 'select',
        label: 'notifications.entity',
        placeholder: 'notifications.select_entity',
        isMulti: false,
        gridColumn: 'half'
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
        ...(data.role_id && { role_id: data.role_id }),
        ...(data.entity_id && { entity_id: data.entity_id })
    };

    // Prepare payload with single title and description
    const payload = {
        filters,
        sending_type: sendingTypes, // Send all selected types as array
        title: {
            en: data.title_en,
            ar: data.title_ar
        },
        content: {
            en: data.description_en,
            ar: data.description_ar
        }
    };

    return payload;
};

// Default values for form - Updated with title and description
export const getDefaultFormValues = () => ({
    user_type: [],
    role_id: null,
    branch_id: null,
    entity_id: null,
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: ''
});