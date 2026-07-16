import { API_KEYS } from '@/api/endpoints';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const certificatesColumns = [
    columnHelper.accessor('student_name', {
        header: 'table_headers.student_name',
        cell: info => <NameCell directValue={info.row.original.student_name} />
    }),
    columnHelper.accessor('certificate_name', {
        header: 'table_headers.certificate_name',
        cell: info => <Cell value={info.row.original.certificate_name} />
    }),
    columnHelper.accessor('issued_from', {
        header: 'table_headers.issued_from',
        cell: info => <Cell value={info.row.original.issued_from} />
    }),
    columnHelper.accessor('issued_date', {
        header: 'table_headers.issued_date',
        cell: info => <DateCell fullDate value={info.getValue()} />
    }),
    columnHelper.accessor('is_active', {
        header: 'table_headers.status',
        cell: info => <Cell value={info.getValue() ? 'Active' : 'Inactive'} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const certificatesFields = [
    {
        name: 'main_program_id',
        label: 'validation.main_program_id.label',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
        editMode: true,
        viewMode: true,
        isFilterOnly: true  // Mark as filter only
    },
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true,
        isFilterOnly: true  // Mark as filter only
    },
    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
        editMode: true,
        viewMode: true,
        isFilterOnly: true  // Mark as filter only
    },
    {
        name: 'student_id',
        label: 'validation.student_id.label',
        type: 'select',
        placeholder: 'validation.student_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'certificate_name_id',
        label: 'validation.certificate_name_id.label',
        type: 'select',
        placeholder: 'validation.certificate_name_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'issued_date',
        label: 'validation.issued_date.label',
        type: 'date',
        placeholder: 'validation.issued_date.placeholder',
        editMode: true,
        viewMode: true,
        max: new Date().toISOString().split('T')[0]
    },
    {
        name: 'file',
        label: 'validation.file.label',
        type: 'file',
        placeholder: 'validation.file.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*'
    }
];

export const certificatesFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'branch_id',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        defaultValue: ''
    },
    {
        name: 'issued_from',
        type: 'select',
        placeholder: 'validation.issued_from.placeholder',
        defaultValue: ''
    }
];

export const filtersDefaultValues = {
    search: '',
    branch_id: '',
    issued_from: ''
};

export const certificatesDefaultValues = {
    main_program_id: '',
    branch_id: '',
    entity_id: '',
    student_id: '',
    certificate_name_id: '',
    issued_date: '',
    is_active: 1,
    file: null
};

export const apiCalls = [
    API_KEYS.MAIN_PROGRAMS,
    API_KEYS.BRANCHES
];
