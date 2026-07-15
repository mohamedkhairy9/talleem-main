import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { API_KEYS } from '@/api/endpoints';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { FaSms, FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import i18next from 'i18next';

const columnHelper = createColumnHelper();

const getLocalizedValue = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[i18next.language] || value.en || value.ar || '';
};

const getNotificationData = item => item?.data || item || {};

const getNotificationTitle = item => {
    const data = getNotificationData(item);
    return (
        getLocalizedValue(data.title) ||
        getLocalizedValue(item?.title) ||
        getLocalizedValue(data.subject) ||
        'N/A'
    );
};

const getNotificationContent = item => {
    const data = getNotificationData(item);
    return (
        getLocalizedValue(data.content) ||
        getLocalizedValue(data.body) ||
        getLocalizedValue(data.message) ||
        getLocalizedValue(item?.content) ||
        'N/A'
    );
};

const getRecipientName = notifiable =>
    getLocalizedValue(notifiable?.name) ||
    notifiable?.email ||
    notifiable?.phone ||
    'N/A';

const getSendingType = item => {
    const data = getNotificationData(item);
    return (
        data.sending_type ||
        data.delivery_method ||
        item?.sending_type ||
        item?.delivery_method ||
        'N/A'
    );
};

const formatLabel = value => {
    if (value === null || value === undefined || value === '') return 'N/A';
    return String(value)
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

const renderSendingTypeBadge = value => {
    const normalizedValue = Array.isArray(value) ? value.join(', ') : value;
    const colorMap = {
        sms: 'bg-purple-100 text-purple-800 border-purple-200',
        email: 'bg-blue-100 text-blue-800 border-blue-200',
        inbox: 'bg-green-100 text-green-800 border-green-200',
        'in-app-inbox': 'bg-green-100 text-green-800 border-green-200',
        push: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        whatsapp: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    const color =
        colorMap[normalizedValue] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${color}`}
        >
            {formatLabel(normalizedValue)}
        </span>
    );
};

const renderReadStatusBadge = readAt => {
    const isRead = Boolean(readAt);
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
};

export const notificationsColumns = [
    columnHelper.accessor(row => getNotificationTitle(row), {
        id: 'title',
        header: 'table_headers.subject',
        cell: info => <NameCell directValue={info.getValue()} />
    }),
    columnHelper.accessor(row => getNotificationContent(row), {
        id: 'content',
        header: 'notifications.message',
        cell: info => (
            <div className="max-w-[320px] truncate text-sm text-gray-700">
                {info.getValue()}
            </div>
        )
    }),
    columnHelper.accessor('notifiable', {
        header: 'table_headers.user',
        cell: info => <Cell value={getRecipientName(info.getValue())} />
    }),
    columnHelper.accessor(
        row => row?.notifiable?.email || row?.notifiable?.phone || 'N/A',
        {
            id: 'recipient_contact',
            header: 'table_headers.email',
            cell: info => <Cell value={info.getValue()} />
        }
    ),
    columnHelper.accessor(row => row.type_label || row.type, {
        id: 'type_label',
        header: 'table_headers.type',
        cell: info => (
            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {formatLabel(info.getValue())}
            </span>
        )
    }),
    columnHelper.accessor(row => getSendingType(row), {
        id: 'sending_type',
        header: 'table_headers.sent_via',
        cell: info => renderSendingTypeBadge(info.getValue())
    }),
    columnHelper.accessor('read_at', {
        header: 'table_headers.status',
        cell: info => renderReadStatusBadge(info.getValue())
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

export const notificationApiCalls = [
    API_KEYS.BRANCHES,
    API_KEYS.ENTITIES,
    API_KEYS.ROLES
];

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

export const sendingMethods = [
    {
        key: 'sms',
        icon: <FaSms />,
        labelKey: 'notifications.sms'
    },
    {
        key: 'email',
        icon: <MdEmail />,
        labelKey: 'notifications.email'
    },
    {
        key: 'push',
        icon: <IoNotifications />,
        labelKey: 'notifications.push'
    },
    {
        key: 'whatsapp',
        icon: <FaWhatsapp />,
        labelKey: 'notifications.whatsapp'
    }
];

export const getFilterFields = t => [
    {
        name: 'user_type',
        type: 'select',
        label: t('notifications.user_type'),
        placeholder: t('notifications.select_user_type'),
        isMulti: true,
        required: true,
        optionsSource: 'static',
        gridColumn: 'full'
    },
    {
        name: 'role_id',
        type: 'select',
        label: t('notifications.role'),
        placeholder: t('notifications.select_role'),
        isMulti: false,
        required: false,
        optionsSource: 'api',
        apiKey: 'rolesData',
        filterFunction: roles => roles.filter(role => role.name !== 'super-admin'),
        gridColumn: 'half'
    },
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
    {
        name: 'entity_id',
        type: 'select',
        label: t('notifications.entity'),
        placeholder: t('notifications.select_entity'),
        isMulti: false,
        required: false,
        optionsSource: 'api',
        apiKey: 'entitiesData',
        dependsOn: 'branch_id',
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

export const prepareNotificationPayload = (data, selectedMethods) => {
    const sendingTypes = Object.keys(selectedMethods).filter(
        method => selectedMethods[method]
    );

    const filters = {
        user_type: data.user_type,
        ...(data.branch_id && { branch_id: data.branch_id }),
        ...(data.role_id && { role_id: data.role_id }),
        ...(data.entity_id && { entity_id: data.entity_id })
    };

    return {
        filters,
        sending_type: sendingTypes,
        title: {
            en: data.title_en,
            ar: data.title_ar
        },
        content: {
            en: data.description_en,
            ar: data.description_ar
        }
    };
};

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
