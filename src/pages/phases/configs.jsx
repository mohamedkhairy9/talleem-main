import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineExternalLink } from 'react-icons/hi';
import i18next from 'i18next';
import useLocale from '@/utils/hooks/global/useLocale';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const phasesColumns = (requestTypesMap) => {
    const StepsCountCell = ({ phase }) => {
        const { t } = useLocale();
        const count = phase.steps?.length || 0;
        const viewStepsLabel = t('phases.view_steps');
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 font-medium">{count}</span>
                <Link
                    to={`/phases/${phase.id}/steps`}
                    title={viewStepsLabel}
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 hover:underline font-medium"
                >
                    {viewStepsLabel}
                    <HiOutlineExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                </Link>
            </div>
        );
    };

    return [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('request_type_id', {
        header: 'table_headers.request_type',
        cell: info => (
            <Cell 
                value={requestTypesMap[info.getValue()] || `Request Type ${info.getValue()}`} 
            />
        )
    }),
    columnHelper.accessor('order', {
        header: 'table_headers.order',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('steps', {
        header: 'table_headers.steps_count',
        cell: info => <StepsCountCell phase={info.row.original} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    })
    ];
};

export const phasesFields = [
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
        name: 'request_type_id',
        label: 'validation.request_type_id.label',
        type: 'select',
        placeholder: 'validation.request_type_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'order',
        label: 'validation.order.label',
        type: 'number',
        placeholder: 'validation.order.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true
    }
];

export const phasesFilters = [
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
    search: '',
    request_type_id: ''
};

export const apiCalls = [API_KEYS.REQUEST_TYPES];

