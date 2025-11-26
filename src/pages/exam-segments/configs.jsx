import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const examSegmentsCountColumns = [
    columnHelper.accessor('parts_count', {
        header: 'table_headers.parts_count',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('segments_required', {
        header: 'table_headers.segments_required',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('is_active', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const examSegmentsCountFields = [
    {
        name: 'parts_count',
        label: 'validation.parts_count.label',
        type: 'number',
        placeholder: 'validation.parts_count.placeholder',
        editMode: true,
        viewMode: true,
        min: 1,
        max: 30
    },
    {
        name: 'segments_required',
        label: 'validation.segments_required.label',
        type: 'number',
        placeholder: 'validation.segments_required.placeholder',
        editMode: true,
        viewMode: true,
        min: 1
    },
    {
        name: 'is_active',
        label: 'validation.is_active.label',
        type: 'select',
        placeholder: 'validation.is_active.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true
    }
];

export const examSegmentsCountFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'is_active',
        type: 'select',
        placeholder: 'validation.is_active.placeholder',
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    is_active: 1,
    search: ''
};

export const examSegmentsCountDefaultValues = {
    parts_count: 1,
    segments_required: 1,
    is_active: true
};