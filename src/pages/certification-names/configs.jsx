import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';

const columnHelper = createColumnHelper();

export const certificateNamesColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.certificate_name',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('main_program', {
        header: 'table_headers.program',
        cell: info => <Cell value={info.getValue()?.name} />
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

export const certificateNamesFields = [
    {
        name: 'name.ar',
        label: 'validation.certificate_name_ar.label',
        type: 'text',
        placeholder: 'validation.certificate_name_ar.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.en',
        label: 'validation.certificate_name_en.label',
        type: 'text',
        placeholder: 'validation.certificate_name_en.placeholder',
        editMode: true,
        viewMode: true
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
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        editMode: true,
        viewMode: true
    }
];

export const certificateNamesFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'main_program_id',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
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
    main_program_id: ''
};

export const certificateNamesDefaultValues = {
    name: {
        ar: '',
        en: ''
    },
    main_program_id: '',
    status: true
};

export const apiCalls = [API_KEYS.MAIN_PROGRAMS];
