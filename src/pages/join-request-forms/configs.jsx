import ActiveCell from '@/components/common/table/cells/ActiveCell';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const joinRequestFormsColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => {
            // Handle both string and object formats
            const name = info.row.original.name;
            if (!name) {
                return <Cell value="-" />;
            }
            if (typeof name === 'string') {
                return <Cell value={name} />;
            }
            return <NameCell directValue={name} />;
        }
    }),
    columnHelper.accessor('description', {
        header: 'table_headers.description',
        cell: info => {
            const description = info.row.original.description;
            if (!description) return <Cell value="-" />;
            if (typeof description === 'string') {
                return <Cell value={description} />;
            }
            return <NameCell directValue={description} />;
        }
    }),
    columnHelper.accessor('data', {
        header: 'table_headers.fields_count',
        cell: info => {
            const fields = info.row.original.data?.fields || [];
            return <Cell value={`${fields.length} ${fields.length === 1 ? 'field' : 'fields'}`} />;
        },
        enableColumnFilter: false
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

export const joinRequestFormsFields = [
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
        name: 'description.en',
        label: 'validation.description.label.en',
        type: 'text',
        placeholder: 'validation.description.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'description.ar',
        label: 'validation.description.label.ar',
        type: 'text',
        placeholder: 'validation.description.placeholder.ar',
        editMode: true,
        viewMode: true
    }
];

export const joinRequestFormsFilters = [
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

// Field types for dynamic form builder
export const fieldTypes = [
    { label: 'Text', value: 'text' },
    { label: 'Email', value: 'email' },
    { label: 'Number', value: 'number' },
    { label: 'File', value: 'file' },
    { label: 'Date', value: 'date' },
    { label: 'Textarea', value: 'textarea' },
    { label: 'Select', value: 'select' }
];

