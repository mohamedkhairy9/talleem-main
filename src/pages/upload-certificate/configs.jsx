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
    columnHelper.accessor('issued_by', {
        header: 'table_headers.issued_by',
        cell: info => <Cell value={info.row.original.issued_by} />
    }),
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <Cell value={info.row.original.branch} />
    }),
    columnHelper.accessor('entity', {
        header: 'table_headers.entity',
        cell: info => <Cell value={info.row.original.entity} />
    }),
    columnHelper.accessor('obtained_date', {
        header: 'table_headers.obtained_date',
        cell: info => <DateCell fullDate value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const certificatesFields = [
    {
        name: 'issued_by',
        label: 'validation.issued_by.label',
        type: 'radio',
        placeholder: 'validation.issued_by.placeholder',
        editMode: true,
        viewMode: true,
        options: [
            { value: 'main_administration', label: { en: 'Main Administration', ar: 'الإدارة العامة' } },
            { value: 'branch', label: { en: 'Branch Management', ar: 'إدارة الفرع' } },
            { value: 'entity', label: { en: 'Entity Management', ar: 'إدارة الجهة' } }
        ]
    },
    {
        name: 'main_program_id',
        label: 'validation.main_program_id.label',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
        editMode: true,
        viewMode: true
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
        name: 'obtained_date',
        label: 'validation.obtained_date.label',
        type: 'date',
        placeholder: 'validation.obtained_date.placeholder',
        editMode: true,
        viewMode: true,
        max: new Date().toISOString().split('T')[0]
    },
    {
        name: 'certificate_image',
        label: 'validation.certificate_image.label',
        type: 'file',
        placeholder: 'validation.certificate_image.placeholder',
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
        name: 'issued_by',
        type: 'select',
        placeholder: 'validation.issued_by.placeholder',
        defaultValue: ''
    }
];

export const filtersDefaultValues = {
    search: '',
    branch_id: '',
    issued_by: ''
};

export const certificatesDefaultValues = {
    issued_by: 'main_administration',
    main_program_id: '',
    branch_id: '',
    entity_id: '',
    student_id: '',
    certificate_name_id: '',
    obtained_date: '',
    certificate_image: null
};

export const apiCalls = [
    API_KEYS.MAIN_PROGRAMS,
    API_KEYS.BRANCHES,
    API_KEYS.ENTITIES,
    API_KEYS.STUDENTS,
    API_KEYS.CERTIFICATE_NAMES
];