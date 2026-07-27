import Cell from '@/components/common/table/cells/Cell';
import NameCell from '@/components/common/table/cells/NameCell';
import DateCell from '@/components/common/table/cells/DateCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';
import {
    getJoinRequestDisplayStatus,
    getJoinRequestStatusBadgeClasses
} from './statusDisplay';
import { getLocalizedRequestTypeName } from './joinRequestTypeDisplay';

const columnHelper = createColumnHelper();

const hasNameValue = value => {
    if (typeof value === 'string') return value.trim().length > 0;

    return Boolean(
        value &&
            typeof value === 'object' &&
            [value.ar, value.en].some(item =>
                typeof item === 'string' && item.trim().length > 0
            )
    );
};

const getNameFromRecord = value => {
    if (!value) return null;

    if (hasNameValue(value)) return value;

    return hasNameValue(value.name) ? value.name : null;
};

/**
 * The form payload is different for each request category.  New requests keep
 * the name at the root, whereas transfer/renewal requests reference the target
 * record (teacher, student, or entity).  Resolve the visible subject name so
 * the name column is never tied to one form shape only.
 */
export const getJoinRequestSubjectName = (submittedData = {}, category) => {
    const namesByCategory = {
        entities: [
            submittedData.name,
            submittedData.entity,
            submittedData.new_entity,
            submittedData.current_entity,
            submittedData.manager
        ],
        teachers: [
            submittedData.name,
            submittedData.teacher,
            submittedData.new_teacher,
            submittedData.entity
        ],
        supervisors: [
            submittedData.name,
            submittedData.supervisor,
            submittedData.student,
            submittedData.teacher,
            submittedData.entity
        ]
    };

    const candidates =
        namesByCategory[category] ||
        [
            submittedData.name,
            submittedData.teacher,
            submittedData.student,
            submittedData.supervisor,
            submittedData.entity,
            submittedData.new_entity,
            submittedData.manager
        ];

    return candidates.map(getNameFromRecord).find(hasNameValue) || null;
};

export const joinRequestsColumns = (
    requestTypesMap,
    currentLocale = 'en',
    category
) => [
    columnHelper.accessor('id', {
        header: 'table_headers.id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('submitted_data.name', {
        header: 'table_headers.name',
        cell: info => (
            <NameCell
                directValue={getJoinRequestSubjectName(
                    info.row.original.submitted_data,
                    category
                )}
            />
        )
    }),
    columnHelper.accessor('request_type_id', {
        header: 'table_headers.request_type',
        cell: info => {
            const requestTypeId = info.getValue();
            const requestTypeName =
                requestTypesMap[requestTypeId] ||
                getLocalizedRequestTypeName(info.row.original.request_type, currentLocale);

            return (
                <Cell
                    value={requestTypeName || `Request Type ${requestTypeId}`}
                />
            );
        }
    }),
    columnHelper.accessor('form.name', {
        header: 'table_headers.form',
        cell: info => <NameCell directValue={info.row.original.form?.name} />
    }),
    columnHelper.accessor('current_phase.name', {
        header: 'table_headers.current_phase',
        cell: info => <NameCell directValue={info.row.original.current_phase?.name} />
    }),
    columnHelper.accessor('status_text', {
        header: 'table_headers.status',
        cell: info => {
            const statusDisplay = getJoinRequestDisplayStatus(
                info.row.original,
                currentLocale
            );

            return (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium border ${getJoinRequestStatusBadgeClasses(
                        statusDisplay.key
                    )}`}
                >
                    {statusDisplay.text}
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

export const joinRequestsFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    }
];

export const filtersDefaultValues = {
    search: '',
    request_type_id: ''
};

export const apiCalls = [API_KEYS.REQUEST_TYPES];

