import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { API_KEYS } from '@/api/endpoints';
import i18next from 'i18next';

const columnHelper = createColumnHelper();

export const warningsColumns = [
    columnHelper.accessor('warning_type', {
        header: 'table_headers.warning_type',
        cell: info => {
            const type = info.getValue();
            let translationKey = '';
            if (type === 'student') translationKey = 'warnings.student';
            else if (type === 'teacher') translationKey = 'warnings.teacher';
            else if (type === 'entity') translationKey = 'warnings.entity';
            
            return <Cell withLocale={true} value={translationKey} />;
        }
    }),
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <Cell value={info.getValue()?.name} />
    }),
    columnHelper.accessor('program', {
        header: 'table_headers.program',
        cell: info => <Cell value={info.getValue()?.name} />
    }),
    columnHelper.accessor('entity', {
        header: 'table_headers.entity',
        cell: info => <Cell value={info.getValue()?.name} />
    }),
    columnHelper.accessor('student', {
        header: 'table_headers.student',
        cell: info => <Cell value={info.getValue()?.name || '-'} />
    }),
    columnHelper.accessor('teacher', {
        header: 'table_headers.teacher',
        cell: info => <Cell value={info.getValue()?.name || '-'} />
    }),
    columnHelper.accessor('warning_reason', {
        header: 'table_headers.warning_reason',
        cell: info => <Cell value={info.getValue()?.name} />
    }),
    columnHelper.accessor('date', {
        header: 'table_headers.warning_date',
        cell: info => <DateCell value={info.getValue()} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    })
];

export const warningsFields = [
    {
        name: 'warning_type',
        label: 'validation.warning_type.label',
        type: 'select',
        placeholder: 'validation.warning_type.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'program_id',
        label: 'validation.program_id.label',
        type: 'select',
        placeholder: 'validation.program_id.placeholder',
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
        viewMode: true,
        conditional: true
    },
    {
        name: 'student_id',
        label: 'validation.student_id.label',
        type: 'select',
        placeholder: 'validation.student_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true // يظهر فقط عند اختيار student
    },
    {
        name: 'teacher_id',
        label: 'validation.teacher_id.label',
        type: 'select',
        placeholder: 'validation.teacher_id.placeholder',
        editMode: true,
        viewMode: true,
        conditional: true // يظهر فقط عند اختيار teacher
    },
    {
        name: 'warning_reason_id',
        label: 'validation.warning_reason_id.label',
        type: 'select',
        placeholder: 'validation.warning_reason_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'date',
        label: 'validation.warning_date.label',
        type: 'date',
        placeholder: 'validation.warning_date.placeholder',
        editMode: true,
        viewMode: true,
        minDate: new Date().toISOString().split('T')[0] 
    },
    {
        name: 'note',
        label: 'validation.note.label',
        type: 'textarea',
        placeholder: 'validation.note.placeholder',
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

export const warningsFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'warning_type',
        type: 'select',
        placeholder: 'validation.warning_type.placeholder',
        defaultValue: ''
    },
    {
        name: 'branch_id',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
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
    warning_type: '',
    branch_id: ''
};

export const warningsDefaultValues = {
    status: true,
    warning_type: '',
    program_id: '',
    branch_id: '',
    entity_id: '',
    student_id: null,
    teacher_id: null,
    warning_reason_id: '',
    date: '',
    note: ''
};

export const apiCalls = [
    API_KEYS.BRANCHES,
    API_KEYS.MAIN_PROGRAMS
];