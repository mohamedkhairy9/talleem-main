import Cell from '@/components/common/table/cells/Cell';
import NameCell from '@/components/common/table/cells/NameCell';
import DateCell from '@/components/common/table/cells/DateCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import i18next from 'i18next';
import { API_KEYS } from '@/api/endpoints';
import {
    getJoinRequestDisplayStatus,
    getJoinRequestStatusBadgeClasses
} from './statusDisplay';

const columnHelper = createColumnHelper();

export const joinRequestsColumns = (requestTypesMap, currentLocale = 'en') => [
    columnHelper.accessor('id', {
        header: 'table_headers.id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('submitted_data.name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.submitted_data?.name} />
    }),
    columnHelper.accessor('request_type_id', {
        header: 'table_headers.request_type',
        cell: info => (
            <Cell 
                value={requestTypesMap[info.getValue()] || `Request Type ${info.getValue()}`} 
            />
        )
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

