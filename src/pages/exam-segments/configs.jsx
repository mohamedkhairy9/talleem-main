import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const examSegmentsCountColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
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
    name: { en: '', ar: '' },
    parts_count: 1,
    segments_required: 1,
    is_active: true
};